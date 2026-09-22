# 🛡️ ScholarShield

> **Midnight Network Zero-Knowledge Scholarship Privacy DApp & Cryptographic Credential Protocol**

[![Midnight Compact 0.19](https://img.shields.io/badge/Midnight-Compact_0.19-purple?style=for-the-badge&logo=shield)](https://midnight.network)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0.1-brightgreen?style=for-the-badge&logo=vitest)](https://vitest.dev/)

---

## 🌟 Executive Overview

**ScholarShield** is a functional **Midnight Privacy DApp** designed to revolutionize higher education philanthropy. It allows students to prove their eligibility (family income ceiling and academic score prerequisites) to universities and grant sponsors using **Zero-Knowledge Proofs (ZK-SNARKs)** without revealing their sensitive private records or bank balances to the public blockchain.

---

## 🔒 Core Privacy Flow

```
Student enters private eligibility info (Income, Academic Score, Secret)
        ↓
Shielded Witness & Private Salt (Client-side execution only)
        ↓
Midnight Compact Contract (`scholarshield.compact`)
        ↓
Zero-Knowledge Circuit Verification (PLONK ZK-SNARKs):
  • Income <= Max Program Income Limit ($50,000)
  • Academic Percentage >= Min Required Score (85.00%)
  • University KYC Whitelist Merkle Proof Verified
  • Deterministic Nullifier Derived (1 claim per student per grant)
        ↓
Public On-Chain Verification:
  ✓ Result: ELIGIBLE or NOT ELIGIBLE
  ✓ Exact income, score, and student secret remain 100% hidden
```

---

## 📁 Repository Structure

```
ScholarShield/
├── src/
│   ├── contract/
│   │   └── scholarshield.compact     # Midnight Compact 0.19 Smart Contract
│   ├── lib/
│   │   └── midnight/
│   │       ├── client.ts              # Lace Wallet DApp Connector & Prover Service
│   │       ├── crypto-browser.ts      # Browser-compatible SHA-256 & Merkle Tree
│   │       ├── crypto.ts              # Node.js Cryptographic Engine
│   │       ├── types.ts               # Midnight Types & State Definitions
│   │       └── zk-scholarship-engine.ts # Compact ZK Circuit Emulation Engine
│   ├── components/
│   │   ├── ConnectWalletModal.tsx     # Lace Wallet & Demo Prover Dialog
│   │   ├── Navbar.tsx                 # Navigation with ZK Portal & Verifier Links
│   │   └── Footer.tsx                 # Security Standards
│   └── app/
│       ├── student/page.tsx           # Student Shielded Portal & ZK Proof Generator
│       ├── verifier/page.tsx          # Verifier Governance & Proof Auditor
│       ├── scholarships/page.tsx      # Grant Directory & Prerequisite Filters
│       ├── verify/page.tsx            # Public SHA-256 Validator
│       └── page.tsx                   # Platform Overview & Stats
└── tests/
    └── scholarshield-compact.test.ts  # Vitest Test Suite for Compact Circuits
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Compact Contract Tests
```bash
npm test
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🧪 Unit Test Coverage Matrix

| Test Scenario | Circuit Constraint | Result |
| :--- | :--- | :--- |
| **Eligible Student** | Income ≤ $50,000 & Score ≥ 85.00% | ✅ Passed (Status: `Eligible`) |
| **Income Above Ceiling** | Income $75,000 > $50,000 | ✅ Passed (Rejected with ZK constraint error) |
| **Score Below Minimum** | Score 78.00% < 85.00% | ✅ Passed (Rejected with ZK constraint error) |
| **Both Criteria Failing** | Income $90,000 & Score 65.00% | ✅ Passed (Rejected) |
| **Non-Whitelisted Student** | Unregistered secret | ✅ Passed (Merkle proof failure) |
| **Anti-Double Claiming** | Duplicate nullifier broadcast | ✅ Passed (Nullifier collision prevented) |
| **Selective Compliance Viewing Key** | Midnight Rational Privacy | ✅ Passed (Auditor record stored) |

---

## 📄 License

MIT License. Developed for the **Midnight Network Ecosystem**.
Repository: [https://github.com/shivang-tech-3/ScholarShield](https://github.com/shivang-tech-3/ScholarShield)