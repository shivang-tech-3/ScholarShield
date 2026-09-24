# 🛡️ ScholarShield Protocol — Product Proposal & Technical Specification

> **Track:** Finance & Governance / Identity, Compliance & Verifiable Credentials  
> **Official Category (from provided list):** **Confidential Credentials** & **Age / Eligibility Gate** & **Private Allowlist Access**  
> **Target Network:** Midnight Network (Preprod Testnet)  
> **Deployed Preprod Contract Address:** `0xd73ba68393b75a34765a34f4894eef72173d75dfb3768ac5a50cd2e3c0142800`  
> **Live DApp:** [https://scholarshieldmoonlight.netlify.app/](https://scholarshieldmoonlight.netlify.app/)  
> **Repository:** [https://github.com/shivang-tech-3/ScholarShield](https://github.com/shivang-tech-3/ScholarShield)  

---

## 📋 Rise In Core 4-Question Product Proposal

### Question 1: What problem are you solving?
Higher education scholarships and merit-based grants distribute over $100 Billion globally each year. However, the legacy evaluation process forces vulnerable students to submit unredacted family tax filings, bank balance sheets, academic grade transcripts, and government ID numbers to review committees and university boards. This creates:
1. **Severe Privacy Breaches & Social Stigmatization**: Students are exposed to bias and identity theft by disclosing intimate financial hardships.
2. **Double-Claiming & Document Forgery**: Institutions lack cryptographic guarantees against duplicate claims across universities or photoshopped transcript documents.
3. **Public Ledger Privacy Violations**: Standard L1 blockchains (Ethereum, Solana) broadcast student scores and financial allocations publicly on block explorers.

### Question 2: What is your solution and core value proposition?
**ScholarShield** provides a confidential credential and zero-knowledge eligibility verification protocol. Students generate a client-side zk-SNARK proof that evaluates multidimensional eligibility constraints in a single Compact circuit without revealing private numbers. Universities and grant sponsors obtain mathematical certainty of eligibility without custodying sensitive student PII.

### Question 3: How does Midnight's privacy model and zero-knowledge technology specifically enable this solution?
ScholarShield leverages Midnight's dual-state architecture and Compact v0.19 language:
- **Private Witness Isolation**: Household income (`privateIncomeUSD`), academic GPA percentage (`privateAcademicPercentageBps`), secret keys, and salt are retained exclusively inside the student's shielded prover memory (`witness`).
- **ZK Circuit Constraints**: The `proveAndClaimScholarship` circuit verifies that income $\le$ maximum threshold, academic score $\ge$ minimum prerequisite, and identity commitment $\in$ accredited Merkle root.
- **On-Chain Public State Transition**: Observers only see public status `Eligible` and a cryptographic nullifier that prevents double claiming.
- **Midnight Rational Privacy (Selective Disclosure)**: Students can issue encrypted viewing keys (`grantAuditorAccess`) to certified compliance auditors without publishing raw data on-chain.

### Question 4: Who are the target users, and what is your go-to-market roadmap?
- **Target Users**: Underprivileged students applying for need-based grants, university financial aid offices, philanthropic grant foundations (e.g. STEM, DEI initiatives), and compliance examiners.
- **Go-to-Market Milestones**:
  - *Phase 1 (Levels 1-2)*: Compact smart contract, Lace wallet integration, and observable privacy engine on Preprod.
  - *Phase 2 (Levels 3-4)*: Multi-program pools, automated CI/CD pipeline, and verifier governance portal.
  - *Phase 3 (Levels 5-6)*: Multi-wallet Stellar cross-chain payouts, institutional DID integrations, and mainnet deployment.

---

## 🎯 1. Executive Summary & Vision

**ScholarShield** is an institutional zero-knowledge scholarship management, student eligibility gate, and confidential credential verification platform built natively on Midnight Network. It enables students to prove financial need and academic excellence using client-side zero-knowledge proofs (ZK-SNARKs) without disclosing sensitive tax filings, bank account balances, or complete GPA records to scholarship evaluation committees.

---

## 🔍 2. Problem Statement & Market Inefficiencies

Higher education philanthropy distributes billions in grants annually, yet the current evaluation process suffers from severe systemic vulnerabilities:

1. **Catastrophic Privacy Exposure**: Students are required to disclose unredacted family tax returns, household bank statements, and comprehensive academic transcripts to broad review panels. This leaves low-income students vulnerable to socioeconomic bias and identity theft.
2. **Pervasive Application Fraud & Double-Claiming**: Reviewers lack cryptographic means to verify authenticity. Forged PDF transcripts and duplicate submissions across multiple universities siphons grants away from deserving candidates.
3. **Public Blockchain Leaks**: Standard Web3 credentials on Ethereum or Solana publicly disclose student scores, financial tiers, and grant values on block explorers.

---

## 💡 3. The Solution: Multi-Constraint Zero-Knowledge Architecture

ScholarShield introduces a **Multi-Constraint Zero-Knowledge Evaluation Circuit** compiled with Midnight's Compact language:

### Multi-Dimensional Proof (Single Circuit)
The `proveAndClaimScholarship` circuit proves four simultaneous assertions:
1. **Need-Based Constraint:** `privateIncomeUSD <= maxIncomeThresholdUSD` (Proves financial need without revealing actual income).
2. **Merit-Based Constraint:** `privateAcademicPercentageBps >= minAcademicPercentageBps` (Proves academic standing without revealing transcript grades).
3. **Accredited Identity Whitelist:** `studentCommitment ∈ institutionMerkleRoot` (Verifies student enrollment without disclosing student identity).
4. **Anti-Double-Claiming Invariant:** `nullifier = Hash(studentSecret, scholarshipId)` (Enforces 1 claim per student per grant).

### Midnight Rational Privacy (Selective Auditor Disclosure)
In the event of an IRS 501(c)(3) or educational compliance audit, the student can issue an **encrypted viewing key** directly to the auditor's public key (`grantAuditorAccess`) without publishing raw records to the public blockchain.

---

## 👥 4. Ecosystem Actors & Workflow

| Actor | Action | Zero-Knowledge Guarantee |
|:---|:---|:---|
| **Student** | Enters income and GPA locally; generates PLONK ZK-SNARK | Private witness never leaves student's shielded wallet |
| **Sponsor / Donor** | Defines public grant parameters (income ceiling, quota) | Verified distribution with zero custody of PII data |
| **Verifier / University** | Audits on-chain application nullifier | Sees strictly `RESULT: ELIGIBLE` or `NOT ELIGIBLE` |
| **Auditor** | Inspects compliance viewing key if authorized | Targeted disclosure without leaking data to public |

---

## 🚀 5. Roadmap & Level 1–6 Milestone Trajectory

- **Level 1 (New Moon):** Compact smart contract, local ZK circuit compilation, and test suite. *(Completed)*
- **Level 2 (Waxing Crescent):** Frontend integration with Midnight Lace Wallet and observable privacy behavior. *(Completed)*
- **Level 3 (First Quarter):** Production CI/CD, comprehensive test matrix, and dedicated verifier portal. *(Completed)*
- **Level 4 (Waxing Gibbous):** Preprod testnet deployment readiness and 1-click demo presets. *(Completed)*
- **Level 5 & 6 (Full Moon / Supermoon):** Decentralized Identity (DID) integration and smart escrow milestone disbursements.
