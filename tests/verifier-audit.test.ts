import { describe, it, expect, beforeEach } from 'vitest';
import { ScholarShieldEngine } from '../src/lib/midnight/zk-scholarship-engine';
import { computeStudentCommitment, MerkleTree } from '../src/lib/midnight/crypto';
import { VerificationStatus } from '../src/lib/midnight/types';

describe('Midnight Verifier & Auditor Query Engine Tests', () => {
  let engine: ScholarShieldEngine;

  beforeEach(() => {
    engine = new ScholarShieldEngine();
  });

  it('1. should return null for non-existent application nullifier queries', () => {
    const fakeNullifier = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const result = engine.getVerificationRecord(fakeNullifier);
    expect(result).toBeNull();
  });

  it('2. should accurately verify an on-chain claim without exposing underlying financial or academic scores', () => {
    const studentSecret = '0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';
    const salt = '0xsalt_verifier_test';
    const studentCommitment = computeStudentCommitment(studentSecret, salt);
    const tree = new MerkleTree([studentCommitment]);
    const root = tree.getRoot();

    const proof = engine.generateEligibilityProof(
      '0xsch_need_firstgen_2026',
      root,
      {
        studentSecret,
        privateIncomeUSD: 25000, // <= $40k
        privateAcademicPercentageBps: 8000, // >= 75%
        studentSalt: salt,
        institutionMerkleProof: tree.getProof(0),
        leafIndex: 0
      }
    );

    const record = engine.proveAndClaimScholarship(proof);

    // Verifier performs independent lookup
    const queriedRecord = engine.getVerificationRecord(record.nullifier);
    expect(queriedRecord).not.toBeNull();
    expect(queriedRecord?.status).toBe(VerificationStatus.Eligible);
    expect(queriedRecord?.scholarshipId).toBe('0xsch_need_firstgen_2026');
    expect(queriedRecord?.nullifier).toBe(record.nullifier);

    // Verify zero data leakage
    const recordKeys = Object.keys(queriedRecord || {});
    expect(recordKeys).not.toContain('privateIncomeUSD');
    expect(recordKeys).not.toContain('privateAcademicPercentageBps');
    expect(recordKeys).not.toContain('studentSecret');
  });
});
