import {
  VerificationStatus,
  ScholarshipConfig,
  VerificationRecord,
  AuditorAccessRecord,
  StudentPrivateWitness,
  ZkScholarshipProofPayload
} from './types.js';
import {
  sha256,
  computeStudentCommitment,
  computeApplicationNullifier,
  MerkleTree
} from './crypto.js';

export class ScholarShieldEngine {
  public scholarships: Map<string, ScholarshipConfig> = new Map();
  public verifiedClaims: Map<string, VerificationRecord> = new Map();
  public spentNullifiers: Set<string> = new Set();
  public auditorRecords: Map<string, AuditorAccessRecord> = new Map();
  public totalVerifiedScholarsCount: number = 0;

  constructor() {
    this.seedDefaultPrograms();
  }

  private seedDefaultPrograms(): void {
    this.registerScholarship({
      scholarshipId: '0xsch_stem_fellowship_2026',
      title: 'Midnight Zero-Knowledge AI & STEM Fellowship',
      provider: 'DeepMind NextGen Tech Foundation',
      amountUSD: 15000,
      maxIncomeThresholdUSD: 50000,
      minAcademicPercentageBps: 8500,
      totalSlots: 25,
      awardedCount: 0,
      isActive: true,
      createdAt: Date.now()
    });

    this.registerScholarship({
      scholarshipId: '0xsch_women_tech_grant_2026',
      title: 'EmpowerTech Women in Engineering Grant',
      provider: 'Global Tech Equity Consortium',
      amountUSD: 12000,
      maxIncomeThresholdUSD: 60000,
      minAcademicPercentageBps: 8000,
      totalSlots: 40,
      awardedCount: 0,
      isActive: true,
      createdAt: Date.now()
    });

    this.registerScholarship({
      scholarshipId: '0xsch_need_firstgen_2026',
      title: 'Pioneer Horizon First-Gen Opportunity Grant',
      provider: 'Ascend Educational Trust',
      amountUSD: 20000,
      maxIncomeThresholdUSD: 40000,
      minAcademicPercentageBps: 7500,
      totalSlots: 50,
      awardedCount: 0,
      isActive: true,
      createdAt: Date.now()
    });
  }

  public registerScholarship(config: ScholarshipConfig): ScholarshipConfig {
    if (this.scholarships.has(config.scholarshipId)) {
      throw new Error('Scholarship ID already registered');
    }
    if (config.totalSlots <= 0) {
      throw new Error('Total slots must be greater than zero');
    }
    if (config.minAcademicPercentageBps > 10000) {
      throw new Error('Minimum academic score must not exceed 100.00% (10000 bps)');
    }

    this.scholarships.set(config.scholarshipId, config);
    return config;
  }

  public generateEligibilityProof(
    scholarshipId: string,
    institutionRoot: string,
    witness: StudentPrivateWitness
  ): ZkScholarshipProofPayload {
    const program = this.scholarships.get(scholarshipId);
    if (!program) {
      throw new Error(`Scholarship program '${scholarshipId}' does not exist on Midnight ledger.`);
    }
    if (!program.isActive) {
      throw new Error('Scholarship program is inactive or closed.');
    }
    if (program.awardedCount >= program.totalSlots) {
      throw new Error('Scholarship quota exhausted: all slots have been filled.');
    }

    // Constraint 1: Need-Based Rule
    if (witness.privateIncomeUSD > program.maxIncomeThresholdUSD) {
      throw new Error(
        `ZK Circuit Constraint Failed: Family income ($${witness.privateIncomeUSD.toLocaleString()}) exceeds maximum allowed threshold ($${program.maxIncomeThresholdUSD.toLocaleString()}) for this scholarship.`
      );
    }

    // Constraint 2: Merit-Based Rule
    if (witness.privateAcademicPercentageBps < program.minAcademicPercentageBps) {
      const actualPct = (witness.privateAcademicPercentageBps / 100).toFixed(2);
      const reqPct = (program.minAcademicPercentageBps / 100).toFixed(2);
      throw new Error(
        `ZK Circuit Constraint Failed: Academic score (${actualPct}%) does not satisfy prerequisite threshold (${reqPct}%).`
      );
    }

    // Constraint 3: Accredited Whitelist
    const studentCommitment = computeStudentCommitment(witness.studentSecret, witness.studentSalt);
    const isMember = MerkleTree.verifyProof(
      studentCommitment,
      witness.institutionMerkleProof,
      institutionRoot,
      witness.leafIndex
    );
    if (!isMember) {
      throw new Error('ZK Circuit Constraint Failed: Student identity commitment is not part of the accredited institution root.');
    }

    // Constraint 4: Application Nullifier
    const nullifier = computeApplicationNullifier(witness.studentSecret, scholarshipId);

    const proofBytes = '0x' + sha256(
      `zk-proof:proveAndClaimScholarship:${scholarshipId}:${nullifier}:${institutionRoot}:${Date.now()}`
    );

    return {
      circuit: 'proveAndClaimScholarship',
      proofBytes,
      publicInputs: {
        scholarshipId,
        nullifier,
        institutionRoot,
        isEligible: true,
        timestamp: Date.now()
      }
    };
  }

  public proveAndClaimScholarship(
    proofPayload: ZkScholarshipProofPayload
  ): VerificationRecord {
    const { scholarshipId, nullifier, institutionRoot, timestamp } = proofPayload.publicInputs;

    const program = this.scholarships.get(scholarshipId);
    if (!program) {
      throw new Error('Scholarship program does not exist');
    }

    if (this.spentNullifiers.has(nullifier)) {
      throw new Error('Double claim detected: Student has already claimed this scholarship using this nullifier');
    }

    this.spentNullifiers.add(nullifier);

    const record: VerificationRecord = {
      nullifier,
      scholarshipId,
      institutionRoot,
      status: VerificationStatus.Eligible,
      verifiedAt: timestamp,
      transactionHash: '0x' + sha256(`midnight_tx:${nullifier}:${timestamp}`)
    };

    this.verifiedClaims.set(nullifier, record);
    program.awardedCount++;
    this.scholarships.set(scholarshipId, program);
    this.totalVerifiedScholarsCount++;

    return record;
  }

  public getVerificationRecord(nullifier: string): VerificationRecord | null {
    return this.verifiedClaims.get(nullifier) || null;
  }

  public grantAuditorAccess(
    nullifier: string,
    auditorKeyCommitment: string,
    encryptedViewingKey: string,
    timestamp: number = Date.now()
  ): AuditorAccessRecord {
    if (!this.verifiedClaims.has(nullifier)) {
      throw new Error('Verified claim does not exist for this nullifier');
    }

    const record: AuditorAccessRecord = {
      nullifier,
      auditorKeyCommitment,
      encryptedViewingKey,
      timestamp
    };

    this.auditorRecords.set(nullifier, record);
    return record;
  }

  public getAllScholarships(): ScholarshipConfig[] {
    return Array.from(this.scholarships.values());
  }

  public getAllVerifiedClaims(): VerificationRecord[] {
    return Array.from(this.verifiedClaims.values());
  }
}
