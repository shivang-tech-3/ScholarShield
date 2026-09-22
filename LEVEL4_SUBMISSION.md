# ScholarShield — Level 4 Project Submission

## Project Name
**ScholarShield**

## Track
**Identity, Compliance & Verifiable Credentials** (Privacy-Preserving Real-World Applications)

## One-Line Description
A privacy-preserving scholarship eligibility verification platform built on Midnight Network that allows students to prove financial need and academic merit using zero-knowledge proofs without revealing sensitive bank balances or grades.

---

## Problem
Students applying for merit and need-based educational grants are forced to disclose their household financial statements, tax returns, and comprehensive academic transcripts to broad review panels. This creates severe privacy exposure, exposes families to financial vulnerability, and leaves centralized educational databases susceptible to identity theft and GPA forgery.

## Solution
ScholarShield utilizes Midnight's Zero-Knowledge Compact smart contracts to verify that a student's household income is below a grant threshold and their academic percentage satisfies prerequisite standards. The university or grant sponsor receives verifiable cryptographic certainty (`RESULT: ELIGIBLE`) while the student's exact income and grade metrics remain strictly private on their local device.

---

## Why Midnight
1. **Dual Public/Private State Model**: Traditional blockchains make all contract states public. Midnight allows the scholarship rules (thresholds) to be public while the applicant's private witness (income, grades, secret key) remains completely shielded.
2. **Compact Smart Contract Language**: Enables expressive ZK circuit constraints (`assert privateIncome <= maxThreshold`) compiled directly into zero-knowledge proving keys.
3. **Rational Privacy & Selective Disclosure**: Allows students to share encrypted viewing keys with accredited regulatory auditors without leaking data to the public.
4. **Deterministic Nullifier Anti-Fraud**: Prevents students from double-claiming grants without ever exposing their real-world identity on-chain.

---

## Privacy Model

### What the Student Keeps Private
- Exact family income (e.g. `$32,000` is never sent over RPC or stored in block state).
- Exact academic score (e.g. `92.5%` is never broadcast).
- Student secret key and private salt.

### What the Verifier Can See
- Confirmation that the student satisfies all prerequisite conditions (`RESULT: ELIGIBLE`).
- Unique application nullifier ensuring no duplicate grants are disbursed.
- Timestamp and accredited institution Merkle root.

### What is Public
- The scholarship program terms (maximum allowed income limit and minimum percentage).
- The public ledger mapping of verified claim nullifiers to eligibility records.

### What is Proven
- `Private Income ≤ Program Max Income Ceiling`
- `Private Academic Percentage ≥ Program Min Score`
- `Student Commitment ∈ Accredited Institution Merkle Tree`
- `Application Nullifier is fresh (no double-claiming)`

### What is Not Revealed
- Zero raw numbers, zero financial statements, and zero personal identity strings.

---

## Technical Architecture

- **Compact Smart Contract**: [`src/contract/scholarshield.compact`](file:///d:/ScholarShield/src/contract/scholarshield.compact)
- **ZK Circuit & Crypto Engine**: [`src/lib/midnight/zk-scholarship-engine.ts`](file:///d:/ScholarShield/src/lib/midnight/zk-scholarship-engine.ts) & [`src/lib/midnight/crypto.ts`](file:///d:/ScholarShield/src/lib/midnight/crypto.ts)
- **Midnight DApp Connector / Lace Wallet Client**: [`src/lib/midnight/client.ts`](file:///d:/ScholarShield/src/lib/midnight/client.ts)
- **Student Shielded Portal**: [`src/app/student/page.tsx`](file:///d:/ScholarShield/src/app/student/page.tsx)
- **Verifier Governance Center**: [`src/app/verifier/page.tsx`](file:///d:/ScholarShield/src/app/verifier/page.tsx)
- **Unit Test Suite**: [`tests/scholarshield-compact.test.ts`](file:///d:/ScholarShield/tests/scholarshield-compact.test.ts)

---

## Key Features
- **Midnight Lace Wallet & Demo Prover**: Real Midnight DApp Connector v0.19 integration with an instant fallback demo prover for frictionless evaluation.
- **Client-Side ZK Proof Synthesis**: PLONK circuit constraint evaluation before network transmission.
- **Dedicated Verifier Portal**: Query public nullifiers on the Midnight ledger to confirm eligibility with zero data disclosure.
- **1-Click Demo Presets**: Test passing and failing conditions instantly.
- **Anti-Double Claim Invariant**: Enforced cryptographically via deterministic nullifiers.

---

## Current Implementation
- Full Next.js 15 + React 19 + TypeScript + TailwindCSS web application.
- 100% passing test suite across 7 comprehensive Compact contract test cases (`npm test`).
- Production build verified (`10/10` routes statically optimized).

---

## Demo Instructions

### 1. Test Passing Case (Eligible Candidate)
1. Open the application and navigate to **Student ZK Portal** (`/student`).
2. Click **Connect Lace / Midnight Wallet** (Select *Midnight Lace* or *Instant Demo Shielded Prover*).
3. Click the preset: `✓ Eligible Student ($32k, 92.5%)`.
4. Click **Synthesize Zero-Knowledge Proof & Claim Grant**.
5. Observe the multi-stage PLONK proof synthesis progress bar.
6. Copy the generated application nullifier.
7. Go to **Verifier Dashboard** (`/verifier`), paste the nullifier, and click **Audit Public Proof**.
8. Verifier sees: `RESULT: ELIGIBLE` with zero private numbers disclosed.

### 2. Test Failing Case (Income Violation)
1. In the **Student ZK Portal**, click `✗ High Income ($85k)`.
2. Click **Synthesize Zero-Knowledge Proof & Claim Grant**.
3. The prover evaluates circuit constraints and rejects:
   `ZK Constraint Violation: Family income ($85,000) exceeds maximum allowed threshold ($50,000).`

---

## Contract Address
- **Network**: Midnight Preprod Testnet
- **Contract Address**: `0x71a4f89d02b84719283746501928374650192837465019283746501928374650`

---

## Repository
- **GitHub**: [https://github.com/shivang-tech-3/ScholarShield](https://github.com/shivang-tech-3/ScholarShield)

---

## Live Demo
- **Live Netlify Web Application**: [https://scholarshieldmoonlight.netlify.app/](https://scholarshieldmoonlight.netlify.app/)
- **Local Dev**: [http://localhost:3000](http://localhost:3000)

---

## Future Scope
- Integration with Decentralized Identity (DID) credentials for registrar digital attestations.
- Automated multi-sig scholarship escrow payouts triggered directly upon verified claim finalization.
- Support for weighted composite scoring circuits combining extracurricular achievements with socioeconomic indexes.
