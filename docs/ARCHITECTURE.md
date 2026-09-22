# ScholarShield Architecture Specification

## 1. System Architecture Diagram

```
+-------------------------------------------------------------------------+
|                              STUDENT CLIENT                             |
|  - Inputs: Household Income ($32,000), GPA (92.5%), Student Secret Key  |
|  - Client-Side Prover: PLONK ZK-SNARK Constraint Synthesis              |
+------------------------------------+------------------------------------+
                                     |
                                     | (Zero-Knowledge Proof & Nullifier)
                                     v
+-------------------------------------------------------------------------+
|                         MIDNIGHT BLOCKCHAIN LEDGER                      |
|  - Compact 0.19 Smart Contract: proveAndClaimScholarship                |
|  - Public Ledger: Map<Nullifier, VerificationRecord { status: Eligible }|
|  - Spent Nullifiers: Set<Nullifier> (Anti-Double Claim Invariant)       |
|  - Private Witnesses: 0 bytes stored on-chain                           |
+------------------------------------+------------------------------------+
                                     |
                                     | (Public Query by Nullifier)
                                     v
+-------------------------------------------------------------------------+
|                        VERIFIER & SPONSOR PORTAL                        |
|  - Input: Application Nullifier                                         |
|  - Verification Result: ELIGIBLE / NOT ELIGIBLE                         |
|  - ZERO private financial or academic values disclosed                  |
+-------------------------------------------------------------------------+
```

## 2. Directory Layout

- `contract/`: Midnight Compact 0.19 Smart Contract, types, crypto, and unit tests.
- `src/`: Next.js 15 App Router frontend with Student Portal, Verifier Portal, Lace Wallet Connector, and ZK Prover.
- `docs/`: Architecture and Privacy specifications.
- `tests/`: End-to-end integration and verification tests.
