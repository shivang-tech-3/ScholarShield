import { describe, it, expect, beforeEach } from 'vitest';
import { ScholarShieldEngine } from '../src/zk-scholarship-engine.js';
import { computeStudentCommitment, MerkleTree } from '../src/crypto.js';
import { StudentPrivateWitness, VerificationStatus } from '../src/types.js';

describe('ScholarShield Compact Contract Unit Tests', () => {
  let engine: ScholarShieldEngine;
  let studentSecret: string;
  let studentSalt: string;
  let studentCommitment: string;
  let institutionTree: MerkleTree;
  let institutionRoot: string;
  const targetScholarshipId = '0xsch_stem_fellowship_2026';

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

  it('1. should generate valid ZK proof for eligible candidate', () => {
    const witness: StudentPrivateWitness = {
      studentSecret,
      privateIncomeUSD: 32000,
      privateAcademicPercentageBps: 9250,
      studentSalt,
      institutionMerkleProof: institutionTree.getProof(0),
      leafIndex: 0
    };

    const proof = engine.generateEligibilityProof(targetScholarshipId, institutionRoot, witness);
    expect(proof.circuit).toBe('proveAndClaimScholarship');
    expect(proof.publicInputs.isEligible).toBe(true);

    const record = engine.proveAndClaimScholarship(proof);
    expect(record.status).toBe(VerificationStatus.Eligible);
  });

  it('2. should reject when income exceeds threshold', () => {
    const witness: StudentPrivateWitness = {
      studentSecret,
      privateIncomeUSD: 75000,
      privateAcademicPercentageBps: 9500,
      studentSalt,
      institutionMerkleProof: institutionTree.getProof(0),
      leafIndex: 0
    };

    expect(() => {
      engine.generateEligibilityProof(targetScholarshipId, institutionRoot, witness);
    }).toThrow(/Family income.*exceeds maximum allowed threshold/);
  });

  it('3. should reject when academic percentage is below minimum', () => {
    const witness: StudentPrivateWitness = {
      studentSecret,
      privateIncomeUSD: 30000,
      privateAcademicPercentageBps: 7800,
      studentSalt,
      institutionMerkleProof: institutionTree.getProof(0),
      leafIndex: 0
    };

    expect(() => {
      engine.generateEligibilityProof(targetScholarshipId, institutionRoot, witness);
    }).toThrow(/Academic score.*does not satisfy prerequisite threshold/);
  });
});
