# ScholarShield — Rise In Idea Submission & Technical Proposal

> **Track**: Identity, Compliance & Verifiable Credentials  
> **Official Idea Category**: Confidential Credentials & Eligibility Gate (Midnight Request for Startups)

---

## 🎯 1. Project Title & One-Line Thesis
**ScholarShield**: A decentralized, privacy-preserving scholarship eligibility verification and confidential academic credential protocol on Midnight Network.

---

## 🔍 2. Problem Statement (Addressing Reviewer Feedback: "Re-ideate, it's too basic")

Traditional student scholarship platforms suffer from a dual failure mode:
1. **Severe Privacy & Financial Exposure**: Students must submit full unredacted tax filings, household income statements, family bank balances, and detailed GPA records to broad scholarship review committees. This exposes vulnerable families to socioeconomic profiling, identity theft, and targeted data breaches.
2. **Pervasive Application Fraud & Double-Claiming**: Reviewers lack cryptographic proof of authenticity. Forged PDF transcripts and duplicate grant submissions across different university systems siphon millions of dollars from deserving recipients.
3. **Flawed Public Blockchain Credentialing**: On public blockchains (Ethereum, Solana), publishing verifiable credentials or attestations inadvertently exposes the student's personal scores and grant values to public block explorers.

---

## 💡 3. The Solution & Midnight Architectural Innovation

ScholarShield introduces a **Multi-Constraint Zero-Knowledge Evaluation Circuit** using Midnight's Compact language:

### A. Dual Multi-Dimensional Constraint Evaluation (Single Circuit)
Instead of a naive single-boolean check, ScholarShield's `proveAndClaimScholarship` circuit simultaneously proves four distinct assertions in zero-knowledge:
1. **Need-Based Constraint**: `privateIncomeUSD <= maxIncomeThresholdUSD` (Proves financial need without revealing the actual dollar income).
2. **Merit-Based Constraint**: `privateAcademicPercentageBps >= minAcademicPercentageBps` (Proves academic excellence without revealing transcript grades).
3. **Accredited Identity Whitelist**: `studentCommitment ∈ institutionMerkleRoot` (Verifies student enrollment without disclosing the student's legal name or student ID).
4. **Anti-Double-Claiming Invariant**: `nullifier = Hash(studentSecret, scholarshipId)` (Guarantees each student can only claim a specific grant once, while keeping their identity unlinked across different scholarships).

### B. Midnight Rational Privacy (Selective Auditor Disclosure)
ScholarShield implements Midnight's signature **Rational Privacy** pattern:
- The public ledger only stores: `VerificationRecord { nullifier, isEligible: true, timestamp }`.
- In the event of a regulatory audit (e.g., government grant compliance, IRS 501(c)(3) endowment audit), the student can issue an **encrypted viewing key** directly to the auditor's public key (`grantAuditorAccess`) without publishing raw data to the public.

---

## 🏗️ 4. Technical Architecture

```
Student Private Inputs: (Income: $32k, Score: 92.5%, Secret Key)
                        ↓
            [Client-Side Private Prover]
                        ↓
         [Midnight Compact Circuit Evaluation]
   • Constraint 1: $32k ≤ $50k (Max Income)  -> PASS
   • Constraint 2: 92.5% ≥ 85.0% (Min Score) -> PASS
   • Constraint 3: Merkle KYC Whitelist      -> PASS
   • Constraint 4: Nullifier Uniqueness Check-> PASS
                        ↓
           [PLONK Zero-Knowledge Proof]
                        ↓
          [Midnight Preprod Ledger Update]
   • Nullifier recorded in spentNullifiers
   • Public State: Status = ELIGIBLE
   • Zero sensitive financial/grade numbers stored
```

---

## 👥 5. Target Audience & Impact
- **Students**: Complete protection of private socioeconomic background and academic records.
- **Grant Foundations & Donors** (e.g., DeepMind, Gates Foundation, Rhodes): Mathematical certainty of eligibility without storing hazardous PII databases.
- **Universities & Registrars**: Seamless cryptographic attestation and zero fraud overhead.

---

## 🚀 6. Hackathon Roadmap & Deliverables (Level 1 to Level 6)
- **Level 1**: Compact contract written & tested (`scholarshield.compact`, 7 unit tests passing).
- **Level 2**: Frontend connected to Midnight Lace Wallet with live circuit proof execution.
- **Level 3**: Production CI/CD pipeline, comprehensive privacy model, and verifier dashboard.
- **Level 4**: End-to-end demonstrable application with 1-click test presets and preprod testnet deployment.
- **Level 5 & 6**: Decentralized Identity (DID) integration and smart escrow fund disbursement.
