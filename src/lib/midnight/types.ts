/**
 * Midnight ScholarShield Type Definitions
 */

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
  maxIncomeThresholdUSD: number; // Public ceiling
  minAcademicPercentageBps: number; // e.g. 8500 = 85.00%
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

/**
 * Shielded Student Private Witness Data (NEVER revealed to public blockchain)
 */
export interface StudentPrivateWitness {
  studentSecret: string;
  privateIncomeUSD: number;
  privateAcademicPercentageBps: number;
  studentSalt: string;
  institutionMerkleProof: string[];
  leafIndex: number;
}

/**
 * Zero-Knowledge Proof Payload submitted to the Midnight Ledger
 */
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

export interface LaceWalletState {
  isConnected: boolean;
  address: string | null;
  networkId: 'preprod' | 'testnet' | 'mainnet';
  balanceTDUST: number;
  isConnecting: boolean;
  error: string | null;
  walletType: 'lace' | 'freighter' | 'demo' | null;
}
