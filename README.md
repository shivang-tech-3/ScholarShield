# 🛡️ ScholarShield

> **Cryptographic Student Scholarship Management, Anti-Fraud AI Sentinel & Tamper-Proof Credential Verification Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Security: SHA-256](https://img.shields.io/badge/Security-SHA--256_Ed25519-emerald?style=for-the-badge&logo=shield)](https://github.com/shivang-tech-3/ScholarShield)

---

## 🌟 Executive Overview

**ScholarShield** is an end-to-end decentralized and AI-empowered scholarship management and credential authenticity system. It solves two critical bottlenecks in higher education philanthropy:
1. **Academic Credential & Income Fraud**: Detecting altered PDF transcripts, manipulated GPA records, fabricated identity certificates, and duplicate applications across multiple universities.
2. **Delayed & Opaque Fund Disbursement**: Providing instant cryptographic verification, transparent review workflows, and simulated smart escrow fund dispatch.

---

## ✨ Core Pillars & Capabilities

### 🎓 1. Student Opportunity & Application Hub
- **Dynamic Grant Marketplace**: Filter verified scholarships across STEM, Merit, Need-Based, Diversity, and Global categories.
- **Smart Eligibility Matcher**: Real-time evaluation against prerequisite GPA, major disciplines, and family income ceilings.
- **Client-Side SHA-256 Hashing**: Generates tamper-proof cryptographic signatures directly from the user's browser for uploaded transcripts and financial records.
- **Live Milestone Tracker**: Real-time progress updates from submission to AI sentinel validation and grant disbursement.

### 🤖 2. ScholarShield AI Sentinel (Fraud Prevention Engine)
- **Document Metadata & Typography Auditing**: Detects PDF font modifications, anomalous GPA text blocks, and timestamp irregularities.
- **Cross-Institutional Duplicate Check**: Intercepts duplicate applicant attempts across partner university nodes.
- **Integrity Scoring Index**: Provides transparent 0–100 risk scoring with highlighted anomaly flags for scholarship committees.

### 🏛️ 3. Reviewer & Committee Command Center
- **Applicant Queue with Risk Categorization**: Filter by High, Medium, or Low risk tiers for rapid triaging.
- **One-Click Governance & Escrow**: Approve, reject, or release escrow payouts with instant transaction proof generation.
- **Audit Trails**: Immutable verification logs linking candidates, sponsors, and registrar nodes.

### 🔍 4. Public Cryptographic Validator
- **Instant Certificate Lookup**: Publicly verify any student badge (e.g. `SS-STN-9821`, `SS-MIT-4402`) or upload files to compare SHA-256 hashes against the registry.

---

## 🏗️ Architecture & Technology Stack

```
ScholarShield/
├── src/
│   ├── app/
│   │   ├── admin/page.tsx         # Reviewer Shield & AI Fraud Queue
│   │   ├── apply/page.tsx         # Student Submission & Document Hashing
│   │   ├── scholarships/page.tsx  # Grant Discovery & Matcher Sliders
│   │   ├── student/page.tsx       # Student Dashboard & Milestone Tracker
│   │   ├── verify/page.tsx        # Public SHA-256 Validator & Certificate Search
│   │   ├── globals.css            # Custom glassmorphism & dark palette
│   │   ├── layout.tsx             # Global layout & metadata
│   │   └── page.tsx               # High-impact landing page & live stats
│   ├── components/
│   │   ├── Navbar.tsx             # Responsive glass header
│   │   ├── Footer.tsx             # Security standards & links
│   │   ├── FraudScoreBadge.tsx    # Risk scoring indicator
│   │   ├── ScholarshipCard.tsx    # Interactive grant card
│   │   └── VerificationModal.tsx  # Cryptographic seal dialog
│   ├── lib/
│   │   ├── crypto.ts              # Web Crypto SHA-256 & ID generators
│   │   ├── data.ts                # Seed grants and verified records
│   │   └── store.ts               # Local persistence & reactive store
│   └── types/
│       └── index.ts               # TypeScript data definitions
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v18.0.0` or later
- npm `v9.0.0` or later

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shivang-tech-3/ScholarShield.git
   cd ScholarShield
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to access the platform.

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔒 Security Threat Model

| Threat | ScholarShield Mitigation |
| :--- | :--- |
| **Altered Transcript GPA** | Client computes SHA-256 hash verified against registrar signature. |
| **Fake Identity / Duplicate Claims** | Cross-registry identity match and multi-sig issuance prevent duplicate submissions. |
| **Unauthorized Grant Divergence** | Multi-party escrow requires officer sign-off before dispatching transactions. |

---

## 📄 License & Attribution

Designed and maintained by the **ScholarShield Team**. Open source under the MIT License.
Repository: [https://github.com/shivang-tech-3/ScholarShield](https://github.com/shivang-tech-3/ScholarShield)