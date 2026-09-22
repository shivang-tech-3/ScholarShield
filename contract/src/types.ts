export enum VerificationStatus {
  Eligible = 'Eligible',
  Ineligible = 'Ineligible',
  Revoked = 'Revoked'
}

export interface ScholarshipConfig {
  scholarshipId: string;
  title: string;
  provider: string;
  amountUSD: number;
  maxIncomeThresholdUSD: number;
  minAcademicPercentageBps: number;
  totalSlots: number;
  awardedCount: number;
  isActive: boolean;
  createdAt: number;
}

export interface VerificationRecord {
  nullifier: string;
  scholarshipId: string;
  institutionRoot: string;
  status: VerificationStatus;
  verifiedAt: number;
  transactionHash?: string;
}

export interface AuditorAccessRecord {
  nullifier: string;
  auditorKeyCommitment: string;
  encryptedViewingKey: string;
  timestamp: number;
}

export interface StudentPrivateWitness {
  studentSecret: string;
  privateIncomeUSD: number;
  privateAcademicPercentageBps: number;
  studentSalt: string;
  institutionMerkleProof: string[];
  leafIndex: number;
}

export interface ZkScholarshipProofPayload {
  circuit: 'proveAndClaimScholarship';
  proofBytes: string;
  publicInputs: {
    scholarshipId: string;
    nullifier: string;
    institutionRoot: string;
    isEligible: boolean;
    timestamp: number;
  };
}
