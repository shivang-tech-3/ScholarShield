export type ScholarshipCategory = 'STEM' | 'Merit' | 'Need-Based' | 'Diversity' | 'Global' | 'Women in Tech' | 'Research';

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  providerLogo?: string;
  amount: number;
  currency: string;
  deadline: string;
  category: ScholarshipCategory;
  description: string;
  minGpa: number;
  maxAnnualIncome?: number;
  targetFields: string[];
  educationLevels: ('High School' | 'Undergraduate' | 'Postgraduate' | 'Doctorate')[];
  totalSlots: number;
  appliedCount: number;
  isVerified: boolean;
  featured?: boolean;
}

export type DocumentType = 'TRANSCRIPT' | 'INCOME_CERTIFICATE' | 'ID_PROOF' | 'RECOMMENDATION_LETTER' | 'ENROLLMENT_VERIFICATION';

export interface VerifiedDocument {
  id: string;
  name: string;
  type: DocumentType;
  hash: string;
  uploadedAt: string;
  fileSize: string;
  status: 'valid' | 'flagged' | 'pending';
  fraudFlagReason?: string;
}

export interface FraudAnalysis {
  riskScore: number; // 0 to 100 (0 = Lowest Risk / Pure Legit, 100 = High Risk)
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  integrityScore: number; // 0 to 100
  flagReasons: string[];
  isTamperProof: boolean;
  verifiedGpaMatch: boolean;
  verifiedIncomeMatch: boolean;
  duplicateIdentityRisk: boolean;
}

export type ApplicationStatus = 'submitted' | 'under_review' | 'verified' | 'approved' | 'rejected' | 'disbursed';

export interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  scholarshipTitle: string;
  scholarshipAmount: number;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  institution: string;
  studentGpa: number;
  annualFamilyIncome: number;
  major: string;
  educationLevel: string;
  statementOfPurpose: string;
  documents: VerifiedDocument[];
  fraudAnalysis: FraudAnalysis;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  verificationBadgeId: string;
  disbursementTxHash?: string;
}

export interface VerificationResult {
  certificateId: string;
  documentHash: string;
  studentName: string;
  institution: string;
  issueDate: string;
  validUntil: string;
  status: 'AUTHENTIC' | 'SUSPICIOUS' | 'REVOKED' | 'NOT_FOUND';
  algorithm: string;
  verifier: string;
  metadata: {
    gpa: number;
    scholarshipName?: string;
    grantValue?: string;
  };
}
