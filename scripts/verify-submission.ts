/**
 * Pre-Submission Health Check Script for Rise In Level 1-4 Submission
 */

import { existsSync } from 'fs';
import { resolve } from 'path';

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

console.log('🔍 Auditing ScholarShield Level 1-4 Submission Package...\n');

let allPresent = true;
for (const file of REQUIRED_FILES) {
  const p = resolve(process.cwd(), file);
  if (existsSync(p)) {
    console.log(`  ✅ [FOUND] ${file}`);
  } else {
    console.log(`  ❌ [MISSING] ${file}`);
    allPresent = false;
  }
}

console.log('\n------------------------------------------------------------');
if (allPresent) {
  console.log('🎉 ALL REQUIRED SUBMISSION FILES ARE VERIFIED AND READY!');
} else {
  console.log('⚠️ Some required files are missing.');
  process.exit(1);
}
