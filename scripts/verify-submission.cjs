/**
 * Pre-Submission Health Check Script for Rise In Level 1-4 Submission
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'src/contract/scholarshield.compact',
  'src/contract/managed/scholarshield/contract/index.json',
  'src/contract/managed/scholarshield/zkir/proveAndClaimScholarship.zkir',
  'src/lib/midnight/client.ts',
  'src/lib/midnight/zk-scholarship-engine.ts',
  'src/app/student/page.tsx',
  'src/app/verifier/page.tsx',
  'tests/scholarshield-compact.test.ts',
  'tests/verifier-audit.test.ts',
  '.github/workflows/ci.yml',
  'README.md',
  'IDEA_SUBMISSION.md',
  'LEVEL4_SUBMISSION.md',
  'LEVEL4_REQUIREMENTS_CHECKLIST.md',
  'SCREENSHOTS_GUIDE.md',
  '.env.example'
];

console.log('\n🔍 Auditing ScholarShield Level 1-4 Submission Package...\n');

let allPresent = true;
for (const file of REQUIRED_FILES) {
  const p = path.resolve(process.cwd(), file);
  if (fs.existsSync(p)) {
    console.log(`  ✅ [FOUND] ${file}`);
  } else {
    console.log(`  ❌ [MISSING] ${file}`);
    allPresent = false;
  }
}

console.log('\n------------------------------------------------------------');
if (allPresent) {
  console.log('🎉 ALL REQUIRED SUBMISSION FILES ARE VERIFIED AND READY!\n');
} else {
  console.log('⚠️ Some required files are missing.\n');
  process.exit(1);
}
