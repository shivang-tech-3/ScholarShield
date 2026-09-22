import { describe, it, expect, beforeEach } from 'vitest';
import { ScholarShieldEngine } from '../src/lib/midnight/zk-scholarship-engine';
import { computeStudentCommitment, computeApplicationNullifier, MerkleTree } from '../src/lib/midnight/crypto';
import { StudentPrivateWitness, VerificationStatus } from '../src/lib/midnight/types';

describe('Midnight ScholarShield Compact Contract & ZK Proof Engine', () => {
  let engine: ScholarShieldEngine;
  let studentSecret: string;
  let studentSalt: string;
  let studentCommitment: string;
  let institutionTree: MerkleTree;
  let institutionRoot: string;
  const targetScholarshipId = '0xsch_stem_fellowship_2026'; // max income $50k, min score 85.00%

  beforeEach(() => {
    engine = new ScholarShieldEngine();
    studentSecret = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    studentSalt = '0xsalt_random_proof_salt_123';

    studentCommitment = computeStudentCommitment(studentSecret, studentSalt);
    const peerCommitment1 = computeStudentCommitment('0xpeer1', '0xsalt1');
    const peerCommitment2 = computeStudentCommitment('0xpeer2', '0xsalt2');

    institutionTree = new MerkleTree([studentCommitment, peerCommitment1, peerCommitment2]);
    institutionRoot = institutionTree.getRoot();
  });

  it('1. should successfully generate ZK proof and claim scholarship for an ELIGIBLE student', () => {
    const witness: StudentPrivateWitness = {
      studentSecret,
      privateIncomeUSD: 32000, // <= $50,000 threshold (PASSES)
      privateAcademicPercentageBps: 9250, // 92.50% >= 85.00% (PASSES)
      studentSalt,
      institutionMerkleProof: institutionTree.getProof(0),
      leafIndex: 0
    };

    // Step 1: Client-Side ZK Witness & Circuit Proof Generation
    const proof = engine.generateEligibilityProof(targetScholarshipId, institutionRoot, witness);
    expect(proof.circuit).toBe('proveAndClaimScholarship');
    expect(proof.publicInputs.isEligible).toBe(true);
    expect(proof.publicInputs.scholarshipId).toBe(targetScholarshipId);
    expect(proof.publicInputs.nullifier).toBeDefined();

    // Step 2: Submit to Midnight Ledger
    const record = engine.proveAndClaimScholarship(proof);
    expect(record.status).toBe(VerificationStatus.Eligible);
    expect(record.nullifier).toBe(proof.publicInputs.nullifier);
    expect(engine.spentNullifiers.has(proof.publicInputs.nullifier)).toBe(true);

    // Step 3: Verify Public Query reveals strictly public result
    const publicVerification = engine.getVerificationRecord(record.nullifier);
    expect(publicVerification).not.toBeNull();
    expect(publicVerification?.status).toBe(VerificationStatus.Eligible);
    // Crucial Privacy Invariant: Private values are NOT stored or exposed
    expect((publicVerification as any).privateIncomeUSD).toBeUndefined();
    expect((publicVerification as any).privateAcademicPercentageBps).toBeUndefined();
    expect((publicVerification as any).studentSecret).toBeUndefined();
  });

  it('2. should reject proof generation if family income is ABOVE scholarship threshold', () => {
    const witness: StudentPrivateWitness = {
      studentSecret,
      privateIncomeUSD: 75000, // > $50,000 threshold (FAILS)
      privateAcademicPercentageBps: 9500, // 95.00% (PASSES)
      studentSalt,
      institutionMerkleProof: institutionTree.getProof(0),
      leafIndex: 0
    };

    expect(() => {
      engine.generateEligibilityProof(targetScholarshipId, institutionRoot, witness);
    }).toThrow(/Family income.*exceeds maximum allowed threshold/);
  });

  it('3. should reject proof generation if academic percentage is BELOW prerequisite minimum', () => {
    const witness: StudentPrivateWitness = {
      studentSecret,
      privateIncomeUSD: 30000, // <= $50,000 (PASSES)
      privateAcademicPercentageBps: 7800, // 78.00% < 85.00% required (FAILS)
      studentSalt,
      institutionMerkleProof: institutionTree.getProof(0),
      leafIndex: 0
    };

    expect(() => {
      engine.generateEligibilityProof(targetScholarshipId, institutionRoot, witness);
    }).toThrow(/Academic score.*does not satisfy prerequisite threshold/);
  });

  it('4. should reject proof generation if BOTH income and academic conditions fail', () => {
    const witness: StudentPrivateWitness = {
      studentSecret,
      privateIncomeUSD: 90000, // FAILS
      privateAcademicPercentageBps: 6500, // FAILS
      studentSalt,
      institutionMerkleProof: institutionTree.getProof(0),
      leafIndex: 0
    };

    expect(() => {
      engine.generateEligibilityProof(targetScholarshipId, institutionRoot, witness);
    }).toThrow();
  });

  it('5. should reject student who is NOT part of the accredited institution Merkle whitelist', () => {
    const unlistedSecret = '0x9999999999999999999999999999999999999999999999999999999999999999';
    const witness: StudentPrivateWitness = {
      studentSecret: unlistedSecret,
      privateIncomeUSD: 35000,
      privateAcademicPercentageBps: 9000,
      studentSalt,
      institutionMerkleProof: institutionTree.getProof(0),
      leafIndex: 0
    };

    expect(() => {
      engine.generateEligibilityProof(targetScholarshipId, institutionRoot, witness);
    }).toThrow(/Student identity commitment is not part of the accredited institution root/);
  });

  it('6. should prevent double-claiming using deterministic ZK nullifiers', () => {
    const witness: StudentPrivateWitness = {
      studentSecret,
      privateIncomeUSD: 30000,
      privateAcademicPercentageBps: 9000,
      studentSalt,
      institutionMerkleProof: institutionTree.getProof(0),
      leafIndex: 0
    };

    const proof = engine.generateEligibilityProof(targetScholarshipId, institutionRoot, witness);
    engine.proveAndClaimScholarship(proof);

    // Re-submitting the same claim with identical nullifier
    expect(() => {
      engine.proveAndClaimScholarship(proof);
    }).toThrow(/Double claim detected/);
  });

  it('7. should grant selective auditor disclosure viewing key (Midnight Rational Privacy)', () => {
    const witness: StudentPrivateWitness = {
      studentSecret,
      privateIncomeUSD: 28000,
      privateAcademicPercentageBps: 9400,
      studentSalt,
      institutionMerkleProof: institutionTree.getProof(0),
      leafIndex: 0
    };

    const proof = engine.generateEligibilityProof(targetScholarshipId, institutionRoot, witness);
    const claim = engine.proveAndClaimScholarship(proof);

    const auditorKeyCommitment = '0xauditor_key_hash_compliance_node_01';
    const encryptedViewingKey = '0xenc_viewing_key_aes256gcm_with_auditor_public_key';

    const accessRecord = engine.grantAuditorAccess(
      claim.nullifier,
      auditorKeyCommitment,
      encryptedViewingKey
    );

    expect(accessRecord.nullifier).toBe(claim.nullifier);
    expect(accessRecord.auditorKeyCommitment).toBe(auditorKeyCommitment);
    expect(engine.auditorRecords.has(claim.nullifier)).toBe(true);
  });
});
