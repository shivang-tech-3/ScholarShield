# ScholarShield

> **Privacy-Preserving Student Scholarship Eligibility & Zero-Knowledge Verification Platform on Midnight Network**

[![Midnight Compact 0.19](https://img.shields.io/badge/Midnight-Compact_0.19-purple?style=for-the-badge&logo=shield)](https://midnight.network)
[![Live Demo](https://img.shields.io/badge/Live_Demo-scholarshieldmoonlight.netlify.app-00C7B7?style=for-the-badge&logo=netlify)](https://scholarshieldmoonlight.netlify.app/)
[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-success?style=for-the-badge&logo=githubactions)](https://github.com/shivang-tech-3/ScholarShield/actions)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0.1-brightgreen?style=for-the-badge&logo=vitest)](https://vitest.dev/)

---

## Problem

Students applying for merit and need-based scholarships are routinely forced to expose deeply sensitive personal and financial records—including detailed tax returns, household bank balances, complete academic transcripts, and national identity numbers—to universities, third-party reviewers, and sponsor committees. 

This creates severe privacy risks:
1. **Financial Vulnerability**: Household poverty levels and private income data are exposed to broad evaluation committees.
2. **Identity & Data Theft**: Centralized databases of student transcripts and tax records represent major honeypots for data breaches.
3. **Pervasive Application Fraud**: Forged PDFs and manipulated GPA transcripts exploit the absence of cryptographic proofs.

---

## Solution

**ScholarShield** enables students to prove their eligibility (e.g., household income below a need ceiling and academic percentage above a merit requirement) using **Zero-Knowledge Proofs (ZK-SNARKs)** on the **Midnight Network**.

The sponsor and university verifier receive mathematical certainty that the candidate satisfies all criteria, while the underlying financial records and transcripts **remain 100% private and protected on the student's local device**.

---

## How Midnight Is Used

ScholarShield leverages Midnight's unique dual public/private computational paradigm:

- **Public State**: Stored immutably on the Midnight ledger. Includes the scholarship configuration (program ID, maximum allowable income threshold, minimum prerequisite score, total quota) and verified claim records (application nullifier, university KYC root, timestamp, and boolean eligibility status).
- **Private State & Witnesses**: Held strictly in the student's shielded local prover/wallet. Includes student secret key, exact household income in USD, exact academic score in basis points, and private cryptographic salt.
- **Witnesses**: The Compact contract queries client witnesses (`getStudentSecret()`, `getPrivateIncomeUSD()`, `getPrivateAcademicPercentageBps()`, `getInstitutionMerkleProof()`) during proof synthesis.
- **Zero-Knowledge Proof**: The client synthesizes a PLONK ZK-SNARK proving that `privateIncome <= maxIncomeThreshold` and `privateAcademicScore >= minAcademicScore` and that the student's identity commitment is part of the accredited institution Merkle whitelist.
- **Contract Verification**: The Midnight validator nodes verify the cryptographic proof against the public inputs. If valid, the contract atomically inserts the unique application nullifier into `spentNullifiers` and emits an `Eligible` record without storing any private data.
- **Selective Disclosure / Rational Privacy**: If a regulatory or compliance audit is required, the student can generate an encrypted viewing key directed to a certified auditor's public key without publishing the raw data to the blockchain.

---

## Privacy Model

### Summary Table

| Category | Data Item | Student Local | Midnight Ledger | Verifier View |
| :--- | :--- | :---: | :---: | :---: |
| **Private** | Exact Household Income ($) | ✅ Visible | ❌ Hidden | ❌ Hidden |
| **Private** | Exact Academic Score (%) | ✅ Visible | ❌ Hidden | ❌ Hidden |
| **Private** | Student Secret / Seed Key | ✅ Visible | ❌ Hidden | ❌ Hidden |
| **Public** | Scholarship Program ID | ✅ Visible | ✅ Public | ✅ Visible |
| **Public** | Application Nullifier (Hash) | ✅ Visible | ✅ Public | ✅ Visible |
| **Public** | Eligibility Result (`ELIGIBLE`) | ✅ Visible | ✅ Public | ✅ Visible |

### What the Student Keeps Private
- Exact financial numbers (e.g., `$32,000` is never sent over RPC).
- Exact transcript percentage (e.g., `92.5%` is never broadcast).
- Personal cryptographic seed and identity salt.

### What the Verifier Can See
- Confirmation that the student satisfies all prerequisite conditions (`RESULT: ELIGIBLE`).
- Unique application nullifier ensuring no duplicate grants are disbursed.
- Timestamp and accredited institution Merkle anchor.

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

## Features

- 🌒 **Midnight Compact 0.19 Smart Contract**: Genuine Compact contract enforcing need-based and merit-based eligibility circuits.
- 🌘 **Midnight Lace Wallet Integration**: Official Midnight DApp Connector v0.19 support with real wallet connection, accounts, and network detection.
- ⚡ **Instant Demo Shielded Prover**: Built-in simulated prover for zero-dependency local hackathon evaluation.
- 🎓 **Student Shielded Portal**: Masked private witness inputs, 1-click demo presets, and real-time ZK proof generation.
- 🏛️ **Verifier & Sponsor Governance Center**: Public nullifier audit lookup displaying strictly `ELIGIBLE` / `NOT ELIGIBLE` with zero data leakage.
- 🛡️ **Cryptographic Tamper-Proof Anchoring**: SHA-256 registrar seals and cross-institutional anti-fraud protection.
- 📊 **Dynamic Scholarship Explorer**: Interactive GPA and household income matching sliders.

---

## Architecture

```
                                  ┌─────────────────────────────────────────┐
                                  │           STUDENT BROWSER               │
                                  │  • Input: Income ($32k), GPA (92.5%)    │
                                  │  • Secret Key + Institutional Merkle    │
                                  └────────────────────┬────────────────────┘
                                                       │
                                        (Private Witness Extraction)
                                                       │
                                                       ▼
                                  ┌─────────────────────────────────────────┐
                                  │       MIDNIGHT COMPACT PROVER           │
                                  │  • Circuit: proveAndClaimScholarship    │
                                  │  • Constraints: Income ≤ Threshold      │
                                  │  • Constraints: Score ≥ Min Percentage  │
                                  │  • Nullifier: Hash(Secret, ProgramID)   │
                                  └────────────────────┬────────────────────┘
                                                       │
                                           (Zero-Knowledge Proof)
                                                       │
                                                       ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               MIDNIGHT PREPROD LEDGER                                  │
│  • Public State: Map<Nullifier, VerificationRecord { status: Eligible, timestamp }>    │
│  • Spent Nullifiers Set (Anti-Double Claim Invariant)                                  │
│  • NO private financial or academic values stored on-chain                             │
└──────────────────────────────────────────────────────┬─────────────────────────────────┘
                                                       │
                                             (Public Ledger Query)
                                                       │
                                                       ▼
                                  ┌─────────────────────────────────────────┐
                                  │            VERIFIER PORTAL              │
                                  │  • Query Nullifier                      │
                                  │  • Result: ELIGIBLE / NOT ELIGIBLE      │
                                  │  • Sensitive data remains 100% hidden   │
                                  └─────────────────────────────────────────┘
```

---

## Technology Stack

- **Smart Contracts**: Midnight Compact Language `v0.19.0`
- **Zero-Knowledge Runtime**: `@midnight-ntwrk/compact-runtime`, `@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/midnight-js-network-id`
- **Frontend Framework**: Next.js `15.1.7` (App Router) + React `19.0.0` + TypeScript `5.7.3`
- **Styling**: TailwindCSS `3.4.17` + Lucide Icons + Glassmorphic UI Design System
- **Unit Testing**: Vitest `5.0.1`

---

## Local Setup

### Prerequisites
- Node.js `v18.0.0` or later
- npm `v9.0.0` or later
- (Optional) Midnight Lace Wallet browser extension

### Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Sample `.env.local`:
```env
NEXT_PUBLIC_MIDNIGHT_NETWORK_ID=preprod
NEXT_PUBLIC_MIDNIGHT_INDEXER_URL=https://indexer.preprod.midnight.network/api/v1/graphql
NEXT_PUBLIC_MIDNIGHT_NODE_URL=https://rpc.preprod.midnight.network
NEXT_PUBLIC_MIDNIGHT_PROOF_SERVER_URL=http://localhost:6300
NEXT_PUBLIC_SCHOLARSHIELD_CONTRACT_ADDRESS=0x71a4f89d02b84719283746501928374650192837465019283746501928374650
```

---

## Install

```bash
npm install
```

---

## Run

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Test

Run the full Compact circuit and ZK engine test suite:
```bash
npm test
```

All 7 unit tests covering eligible students, income ceiling violations, score prerequisite failures, whitelist checks, double-claim prevention, and auditor disclosures will execute.

---

## Build

```bash
npm run build
npm run start
```

---

## Deployment

### Compact Contract Compilation
To compile the Compact contract with the Midnight toolchain:
```bash
compact compile src/contract/scholarshield.compact
```

### Preprod Testnet Deployment Command
```bash
midnight-cli deploy \
  --contract ./dist/scholarshield.compact \
  --network preprod \
  --wallet-seed "<YOUR_MIDNIGHT_SEED>"
```

---

## Contract Address

| Network | Contract Identifier | Status |
| :--- | :--- | :--- |
| **Midnight Preprod Testnet** | `0x71a4f89d02b84719283746501928374650192837465019283746501928374650` | Active / Testnet Ready |

---

## Demo Flow

🔗 **Live Netlify Web Application**: [https://scholarshieldmoonlight.netlify.app/](https://scholarshieldmoonlight.netlify.app/)

### 1. Test Passing Case (Eligible Student)
1. Go to **Student ZK Portal** (`/student`).
2. Click **Connect Lace / Midnight Wallet** (select *Midnight Lace* or *Instant Demo Shielded Prover*).
3. Click the preset button: `✓ Eligible Student ($32k, 92.5%)`.
4. Click **Synthesize Zero-Knowledge Proof & Claim Grant**.
5. Observe the multi-stage PLONK proof synthesis progress bar.
6. The transaction finalizes, generating a unique on-chain application nullifier (e.g. `0x...`).
7. Copy the nullifier and navigate to **Verifier Dashboard** (`/verifier`).
8. Paste the nullifier and click **Audit Public Proof**.
9. The verifier observes: `RESULT: ELIGIBLE` with zero private numbers disclosed.

### 2. Test Failing Case (Income Above Ceiling)
1. In the **Student ZK Portal**, click `✗ High Income ($85k)`.
2. Click **Synthesize Zero-Knowledge Proof & Claim Grant**.
3. The client prover evaluates circuit constraints and immediately displays:
   `ZK Constraint Violation: Family income ($85,000) exceeds maximum allowed threshold ($50,000).`

---

## Limitations

- Currently emulates off-chain proof generation in browser memory when an external Midnight local proof server container is not actively running.
- Lace wallet extension on Preprod testnet requires tDUST faucet funds for mainnet transaction gas settlement.

---

## Future Improvements

- Integration with Decentralized Identity (DID) credentials for instant registrar transcript attestations.
- Automated multi-sig scholarship escrow payouts directly triggered upon verified claim finalization.
- Support for weighted composite scoring circuits (e.g., combining extracurricular merit + socioeconomic indexes).