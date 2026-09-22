# ScholarShield — Screenshots & Visual Submission Guide

This guide details the exact screenshots required for each Rise In Midnight level submission.

---

## 📸 Required Screenshots by Level

### Level 1 — New Moon Submission
1. **Successful Compact Compile Output**:
   - Run: `npm test`
   - Capture terminal output showing `7 passed (7)` tests for `tests/scholarshield-compact.test.ts`.
2. **Contract Deployed / Managed Directory**:
   - Screenshot showing `src/contract/scholarshield.compact` and `src/contract/managed/` with circuit descriptors.

---

### Level 2 — Waxing Crescent Submission
1. **Lace Wallet Connected**:
   - Open `/student`, connect Lace Wallet (or Instant Demo Shielded Prover), show connected status indicator in top-right.
2. **Circuit Called Successfully**:
   - Click `✓ Eligible Student`, synthesize proof, show the green `Scholarship Verified & Claimed On Midnight!` confirmation card with generated Nullifier.

---

### Level 3 — First Quarter Submission
1. **Test Output (3+ Tests Passing)**:
   - Screenshot of `npm test` showing all 7 passing unit tests.
2. **CI/CD Pipeline Running**:
   - Screenshot of `.github/workflows/ci.yml` or GitHub Actions tab showing green passing CI build.
3. **Verifier Dashboard (Observable Privacy)**:
   - Open `/verifier`, audit nullifier, show that verifier sees `RESULT: ELIGIBLE` with zero private numbers exposed.

---

### Level 4 — Waxing Gibbous Submission
1. **Full Demonstrable Flow**:
   - Side-by-side view of Student Portal (showing masked private inputs `●●●●●●`) and Verifier Dashboard (showing public confirmation).
2. **Constraint Failure Protection**:
   - Click `✗ High Income`, submit, capture the red ZK circuit violation warning protecting the grant pool.
