import { Scholarship, ScholarshipApplication, VerificationResult } from '@/types';

export const INITIAL_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sch-future-stem-2026',
    title: 'Future Tech & AI Innovators Fellowship',
    provider: 'DeepMind NextGen Tech Foundation',
    providerLogo: '🤖',
    amount: 15000,
    currency: 'USD',
    deadline: '2026-11-30',
    category: 'STEM',
    description: 'Providing full tuition relief and research grants to promising undergraduates in Artificial Intelligence, Machine Learning, and Cybersecurity.',
    minGpa: 3.5,
    targetFields: ['Computer Science', 'Data Science', 'Electrical Engineering', 'Robotics'],
    educationLevels: ['Undergraduate', 'Postgraduate'],
    totalSlots: 25,
    appliedCount: 18,
    isVerified: true,
    featured: true
  },
  {
    id: 'sch-women-stem-2026',
    title: 'EmpowerTech Women in Engineering Grant',
    provider: 'Global Tech Equity Consortium',
    providerLogo: '⚡',
    amount: 12000,
    currency: 'USD',
    deadline: '2026-10-15',
    category: 'Women in Tech',
    description: 'Empowering female leaders in high-impact STEM fields, supporting both academic excellence and international research fellowships.',
    minGpa: 3.2,
    targetFields: ['Computer Engineering', 'Biotechnology', 'Aerospace', 'Mathematics'],
    educationLevels: ['Undergraduate', 'Postgraduate'],
    totalSlots: 40,
    appliedCount: 29,
    isVerified: true,
    featured: true
  },
  {
    id: 'sch-need-firstgen-2026',
    title: 'Pioneer Horizon First-Gen Need Grant',
    provider: 'Ascend Educational Trust',
    providerLogo: '🌱',
    amount: 20000,
    currency: 'USD',
    deadline: '2026-12-05',
    category: 'Need-Based',
    description: 'Designed for first-generation university scholars from under-resourced communities demonstrating exceptional perseverance and community impact.',
    minGpa: 2.8,
    maxAnnualIncome: 45000,
    targetFields: ['All Disciplines', 'Healthcare', 'Social Sciences', 'Economics'],
    educationLevels: ['Undergraduate'],
    totalSlots: 50,
    appliedCount: 42,
    isVerified: true,
    featured: false
  },
  {
    id: 'sch-global-climate-2026',
    title: 'Global Sustainability & Clean Energy Award',
    provider: 'EarthCare International Alliance',
    providerLogo: '🌍',
    amount: 18000,
    currency: 'USD',
    deadline: '2026-11-15',
    category: 'Global',
    description: 'Funding breakthrough student research in renewable energy, circular economy, and ecological biodiversity preservation.',
    minGpa: 3.4,
    targetFields: ['Environmental Science', 'Chemical Engineering', 'Renewable Energy', 'Earth Sciences'],
    educationLevels: ['Postgraduate', 'Doctorate'],
    totalSlots: 15,
    appliedCount: 11,
    isVerified: true,
    featured: true
  },
  {
    id: 'sch-merit-leaders-2026',
    title: 'Apex National Scholar Leadership Endowment',
    provider: 'National Academic Honors Society',
    providerLogo: '🏛️',
    amount: 25000,
    currency: 'USD',
    deadline: '2026-12-31',
    category: 'Merit',
    description: 'Distinguished honor for students maintaining top 1% academic standing with proven entrepreneurial or public service leadership record.',
    minGpa: 3.85,
    targetFields: ['All Fields', 'Law', 'Medicine', 'Business Administration', 'Engineering'],
    educationLevels: ['Undergraduate', 'Postgraduate', 'Doctorate'],
    totalSlots: 10,
    appliedCount: 9,
    isVerified: true,
    featured: false
  }
];

export const INITIAL_APPLICATIONS: ScholarshipApplication[] = [
  {
    id: 'app-908124',
    scholarshipId: 'sch-future-stem-2026',
    scholarshipTitle: 'Future Tech & AI Innovators Fellowship',
    scholarshipAmount: 15000,
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@stanford.edu',
    studentPhone: '+1 (555) 234-8901',
    institution: 'Stanford University',
    studentGpa: 3.92,
    annualFamilyIncome: 38000,
    major: 'Artificial Intelligence & Neural Systems',
    educationLevel: 'Undergraduate',
    statementOfPurpose: 'Dedicated to developing privacy-preserving decentralized zero-knowledge identity protocols for students in developing nations.',
    documents: [
      {
        id: 'doc-1',
        name: 'Official_Transcript_Stanford_2026.pdf',
        type: 'TRANSCRIPT',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        uploadedAt: '2026-09-20 14:32',
        fileSize: '1.8 MB',
        status: 'valid'
      },
      {
        id: 'doc-2',
        name: 'Tax_Return_Verification_2025.pdf',
        type: 'INCOME_CERTIFICATE',
        hash: '7d793037a0760186574b0282f2f435e70d71d4b77bf65b30f1ae47d6da96ee4f',
        uploadedAt: '2026-09-20 14:35',
        fileSize: '820 KB',
        status: 'valid'
      }
    ],
    fraudAnalysis: {
      riskScore: 6,
      riskLevel: 'LOW',
      integrityScore: 98,
      flagReasons: ['Tamper-proof digital watermark detected', 'Institutional registrar signature matched'],
      isTamperProof: true,
      verifiedGpaMatch: true,
      verifiedIncomeMatch: true,
      duplicateIdentityRisk: false
    },
    status: 'approved',
    submittedAt: '2026-09-20T14:35:00Z',
    updatedAt: '2026-09-21T10:15:00Z',
    verificationBadgeId: 'SS-STN-9821',
    disbursementTxHash: '0x8b3a7491ecb1836109f3e498c87b9e018274a7b091e92d837648392104928174'
  },
  {
    id: 'app-908125',
    scholarshipId: 'sch-need-firstgen-2026',
    scholarshipTitle: 'Pioneer Horizon First-Gen Need Grant',
    scholarshipAmount: 20000,
    studentName: 'Elena Rostova',
    studentEmail: 'e.rostova@mit.edu',
    studentPhone: '+1 (555) 892-3112',
    institution: 'Massachusetts Institute of Technology',
    studentGpa: 3.75,
    annualFamilyIncome: 29000,
    major: 'Biological Engineering',
    educationLevel: 'Undergraduate',
    statementOfPurpose: 'First generation immigrant focusing on accessible diagnostics for infectious tropical diseases.',
    documents: [
      {
        id: 'doc-3',
        name: 'MIT_Official_Transcript.pdf',
        type: 'TRANSCRIPT',
        hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
        uploadedAt: '2026-09-21 09:12',
        fileSize: '2.1 MB',
        status: 'valid'
      }
    ],
    fraudAnalysis: {
      riskScore: 12,
      riskLevel: 'LOW',
      integrityScore: 94,
      flagReasons: ['Registrar cryptographic seal valid', 'Household income within target bracket'],
      isTamperProof: true,
      verifiedGpaMatch: true,
      verifiedIncomeMatch: true,
      duplicateIdentityRisk: false
    },
    status: 'under_review',
    submittedAt: '2026-09-21T09:12:00Z',
    updatedAt: '2026-09-22T08:00:00Z',
    verificationBadgeId: 'SS-MIT-4402'
  },
  {
    id: 'app-908126',
    scholarshipId: 'sch-future-stem-2026',
    scholarshipTitle: 'Future Tech & AI Innovators Fellowship',
    scholarshipAmount: 15000,
    studentName: 'Marcus Vance',
    studentEmail: 'marcus.v@unverified-mail.net',
    studentPhone: '+1 (555) 777-9911',
    institution: 'Pacific Coastal Institute',
    studentGpa: 3.99,
    annualFamilyIncome: 120000,
    major: 'Computer Science',
    educationLevel: 'Undergraduate',
    statementOfPurpose: 'Seeking scholarship funding to cover tech equipment expenses.',
    documents: [
      {
        id: 'doc-4',
        name: 'Transcript_Scan_Modified.pdf',
        type: 'TRANSCRIPT',
        hash: 'b10a8db164e0754105b7a99be72e3fe5c9f563d767d0f3957ce682de95c52c99',
        uploadedAt: '2026-09-22 18:04',
        fileSize: '410 KB',
        status: 'flagged',
        fraudFlagReason: 'Font anomaly and GPA mismatch: Stated 3.99, embedded metadata 2.45'
      }
    ],
    fraudAnalysis: {
      riskScore: 84,
      riskLevel: 'HIGH',
      integrityScore: 22,
      flagReasons: [
        'Document metadata timestamp mismatch',
        'PDF font alteration detected in GPA block',
        'Income threshold exceeded by 140%',
        'Duplicate SSN detected in cross-institution lookup'
      ],
      isTamperProof: false,
      verifiedGpaMatch: false,
      verifiedIncomeMatch: false,
      duplicateIdentityRisk: true
    },
    status: 'rejected',
    submittedAt: '2026-09-22T18:04:00Z',
    updatedAt: '2026-09-22T19:20:00Z',
    verificationBadgeId: 'SS-FLAG-0012'
  }
];

export const INITIAL_VERIFICATIONS: Record<string, VerificationResult> = {
  'SS-STN-9821': {
    certificateId: 'SS-STN-9821',
    documentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    studentName: 'Aarav Sharma',
    institution: 'Stanford University',
    issueDate: '2026-09-21',
    validUntil: '2027-09-21',
    status: 'AUTHENTIC',
    algorithm: 'SHA-256 / Ed25519 Cryptographic Proof',
    verifier: 'ScholarShield Multi-Sig Node #04 (Verified Registrar)',
    metadata: {
      gpa: 3.92,
      scholarshipName: 'Future Tech & AI Innovators Fellowship',
      grantValue: '$15,000 USD'
    }
  },
  'SS-MIT-4402': {
    certificateId: 'SS-MIT-4402',
    documentHash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    studentName: 'Elena Rostova',
    institution: 'Massachusetts Institute of Technology',
    issueDate: '2026-09-22',
    validUntil: '2027-09-22',
    status: 'AUTHENTIC',
    algorithm: 'SHA-256 / Ed25519 Cryptographic Proof',
    verifier: 'ScholarShield Registrar Network',
    metadata: {
      gpa: 3.75,
      scholarshipName: 'Pioneer Horizon First-Gen Need Grant',
      grantValue: '$20,000 USD'
    }
  },
  'SS-FLAG-0012': {
    certificateId: 'SS-FLAG-0012',
    documentHash: 'b10a8db164e0754105b7a99be72e3fe5c9f563d767d0f3957ce682de95c52c99',
    studentName: 'Marcus Vance',
    institution: 'Pacific Coastal Institute',
    issueDate: '2026-09-22',
    validUntil: 'EXPIRED / REVOKED',
    status: 'SUSPICIOUS',
    algorithm: 'TAMPER_FLAGGED_SHA256',
    verifier: 'ScholarShield Anti-Fraud AI Sentinel',
    metadata: {
      gpa: 2.45,
      scholarshipName: 'Future Tech & AI Innovators Fellowship',
      grantValue: 'DISBURSEMENT_FROZEN'
    }
  }
};
