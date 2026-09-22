# ScholarShield Privacy Model & Invariants

## Zero-Knowledge Invariants

| Category | Invariant | Enforcement |
|:---|:---|:---|
| **Private Witness** | Family Income ($ USD) | Only evaluated client-side in PLONK circuit; never broadcast |
| **Private Witness** | Academic GPA Score (%) | Only evaluated client-side in PLONK circuit; never broadcast |
| **Private Witness** | Student Secret Seed Key | Only used to derive deterministic nullifier; never broadcast |
| **Public Anchor** | Scholarship ID | Public grant terms defined on Midnight ledger |
| **Public Anchor** | Application Nullifier | Unique one-way hash `Hash(studentSecret, scholarshipId)` |
| **Public State** | Eligibility Decision | Stored on Midnight as `VerificationRecord { status: Eligible }` |

## Threat Mitigation Matrix

1. **Information Leakage Threat**: Reviewers learn student poverty status or exact grades.  
   *Mitigation*: The zero-knowledge circuit proves inequality constraints (`Income <= Ceiling`, `Score >= Minimum`) without revealing the evaluation point.

2. **Double-Claiming Threat**: Students apply to the same grant multiple times or submit across institutions.  
   *Mitigation*: Deterministic nullifiers ensure any duplicate attempt results in an immediate ledger collision and revert.

3. **Transcript Forgery Threat**: Unaccredited candidates submit fabricated claims.  
   *Mitigation*: Prover must supply a valid Merkle membership proof against the university registrar root.
