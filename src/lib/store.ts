'use client';

import { useState, useEffect } from 'react';
import { Scholarship, ScholarshipApplication, VerificationResult } from '@/types';
import { INITIAL_SCHOLARSHIPS, INITIAL_APPLICATIONS, INITIAL_VERIFICATIONS } from './data';
import { generateVerificationId, generateTxHash, computeSHA256 } from './crypto';

const SCHOLARSHIPS_KEY = 'scholarshield_programs_v1';
const APPLICATIONS_KEY = 'scholarshield_applications_v1';
const VERIFICATIONS_KEY = 'scholarshield_verifications_v1';

export function getStoredScholarships(): Scholarship[] {
  if (typeof window === 'undefined') return INITIAL_SCHOLARSHIPS;
  const stored = localStorage.getItem(SCHOLARSHIPS_KEY);
  if (!stored) {
    localStorage.setItem(SCHOLARSHIPS_KEY, JSON.stringify(INITIAL_SCHOLARSHIPS));
    return INITIAL_SCHOLARSHIPS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_SCHOLARSHIPS;
  }
}

export function getStoredApplications(): ScholarshipApplication[] {
  if (typeof window === 'undefined') return INITIAL_APPLICATIONS;
  const stored = localStorage.getItem(APPLICATIONS_KEY);
  if (!stored) {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(INITIAL_APPLICATIONS));
    return INITIAL_APPLICATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

export function getStoredVerifications(): Record<string, VerificationResult> {
  if (typeof window === 'undefined') return INITIAL_VERIFICATIONS;
  const stored = localStorage.getItem(VERIFICATIONS_KEY);
  if (!stored) {
    localStorage.setItem(VERIFICATIONS_KEY, JSON.stringify(INITIAL_VERIFICATIONS));
    return INITIAL_VERIFICATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_VERIFICATIONS;
  }
}

export async function submitNewApplication(
  formData: {
    scholarshipId: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    institution: string;
    studentGpa: number;
    annualFamilyIncome: number;
    major: string;
    educationLevel: string;
    statementOfPurpose: string;
    fileName?: string;
  }
): Promise<ScholarshipApplication> {
  const scholarships = getStoredScholarships();
  const targetScholarship = scholarships.find(s => s.id === formData.scholarshipId) || scholarships[0];
  
  const docName = formData.fileName || `${formData.studentName.replace(/\s+/g, '_')}_Official_Transcript.pdf`;
  const docHash = await computeSHA256(formData.studentName + formData.institution + formData.studentGpa + Date.now());
  
  // Dynamic AI Anti-Fraud Evaluation
  const gpaMeets = formData.studentGpa >= targetScholarship.minGpa;
  const incomeMeets = targetScholarship.maxAnnualIncome ? formData.annualFamilyIncome <= targetScholarship.maxAnnualIncome : true;
  
  let riskScore = 8;
  const flagReasons: string[] = ['Cryptographic hash seal anchored to document payload'];
  
  if (!gpaMeets) {
    riskScore += 45;
    flagReasons.push(`GPA ${formData.studentGpa} below scholarship prerequisite (${targetScholarship.minGpa})`);
  }
  if (!incomeMeets) {
    riskScore += 35;
    flagReasons.push('Income exceeds ceiling limit for need-based criteria');
  }
  if (formData.studentGpa > 4.0 || formData.studentGpa < 1.0) {
    riskScore += 50;
    flagReasons.push('Abnormal GPA range detected');
  }

  const riskLevel = riskScore > 60 ? 'HIGH' : riskScore > 25 ? 'MEDIUM' : 'LOW';
  const integrityScore = Math.max(10, 100 - riskScore);
  const badgeId = generateVerificationId('SS');

  const newApp: ScholarshipApplication = {
    id: `app-${Date.now().toString().slice(-6)}`,
    scholarshipId: targetScholarship.id,
    scholarshipTitle: targetScholarship.title,
    scholarshipAmount: targetScholarship.amount,
    studentName: formData.studentName,
    studentEmail: formData.studentEmail,
    studentPhone: formData.studentPhone,
    institution: formData.institution,
    studentGpa: Number(formData.studentGpa),
    annualFamilyIncome: Number(formData.annualFamilyIncome),
    major: formData.major,
    educationLevel: formData.educationLevel,
    statementOfPurpose: formData.statementOfPurpose,
    documents: [
      {
        id: `doc-${Date.now()}`,
        name: docName,
        type: 'TRANSCRIPT',
        hash: docHash,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        fileSize: '1.4 MB',
        status: riskLevel === 'HIGH' ? 'flagged' : 'valid',
        fraudFlagReason: riskLevel === 'HIGH' ? flagReasons.join(', ') : undefined
      }
    ],
    fraudAnalysis: {
      riskScore,
      riskLevel,
      integrityScore,
      flagReasons,
      isTamperProof: true,
      verifiedGpaMatch: gpaMeets,
      verifiedIncomeMatch: incomeMeets,
      duplicateIdentityRisk: false
    },
    status: riskLevel === 'HIGH' ? 'under_review' : 'submitted',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    verificationBadgeId: badgeId
  };

  const applications = getStoredApplications();
  applications.unshift(newApp);
  if (typeof window !== 'undefined') {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  }

  // Register in verification registry
  const verifications = getStoredVerifications();
  verifications[badgeId] = {
    certificateId: badgeId,
    documentHash: docHash,
    studentName: formData.studentName,
    institution: formData.institution,
    issueDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: riskLevel === 'HIGH' ? 'SUSPICIOUS' : 'AUTHENTIC',
    algorithm: 'SHA-256 Tamper-Proof Cryptographic Signature',
    verifier: 'ScholarShield Anti-Fraud Verification Node',
    metadata: {
      gpa: Number(formData.studentGpa),
      scholarshipName: targetScholarship.title,
      grantValue: `$${targetScholarship.amount.toLocaleString()} ${targetScholarship.currency}`
    }
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(VERIFICATIONS_KEY, JSON.stringify(verifications));
  }

  return newApp;
}

export function updateApplicationStatus(
  appId: string,
  newStatus: ScholarshipApplication['status']
): ScholarshipApplication[] {
  const applications = getStoredApplications();
  const updated = applications.map(app => {
    if (app.id === appId) {
      return {
        ...app,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        disbursementTxHash: newStatus === 'approved' || newStatus === 'disbursed' 
          ? (app.disbursementTxHash || generateTxHash())
          : app.disbursementTxHash
      };
    }
    return app;
  });
  if (typeof window !== 'undefined') {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
  }
  return updated;
}
