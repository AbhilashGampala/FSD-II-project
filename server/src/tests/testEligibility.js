import { checkEligibility } from '../utils/eligibility.js';

let passedCount = 0;
let failedCount = 0;

function assertTest(testName, actual, expected) {
  if (actual === expected) {
    console.log(`  ✓ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    console.error(`     Expected: ${expected}`);
    console.error(`     Actual:   ${actual}`);
    failedCount++;
  }
}

console.log('\n======================================================');
console.log('🧪 RUNNING PLACEMENT ELIGIBILITY UNIT TESTS');
console.log('======================================================\n');

// 1. Incomplete Profile Test
const incompleteStudent = {
  name: 'Incomplete User',
  branch: '',
  cgpa: null,
  tenthPct: null,
  twelfthPct: null,
  activeBacklogs: 0
};
const standardDrive = {
  branches: ['CSE', 'IT'],
  minCgpa: 7.5,
  min10thPct: 70,
  min12thPct: 70,
  maxActiveBacklogs: 0,
  graduationYear: 2025
};
const res1 = checkEligibility(incompleteStudent, standardDrive);
assertTest('Incomplete profile marks isIncomplete === true', res1.isIncomplete, true);
assertTest('Incomplete profile marks eligible === false', res1.eligible, false);
assertTest('Incomplete profile includes prompt reason', res1.reasons[0], 'Complete your profile to check eligibility');

// 2. Ideal Eligible Student (Pass all criteria)
const eligibleStudent = {
  name: 'Aarav Sharma',
  branch: 'CSE',
  cgpa: 8.5,
  tenthPct: 88,
  twelfthPct: 85,
  activeBacklogs: 0,
  graduationYear: 2025
};
const res2 = checkEligibility(eligibleStudent, standardDrive);
assertTest('Eligible student passes all rules (eligible === true)', res2.eligible, true);
assertTest('Eligible student has 0 failing reasons', res2.reasons.length, 0);

// 3. Branch Mismatch Failure
const mechStudent = {
  ...eligibleStudent,
  branch: 'MECH'
};
const res3 = checkEligibility(mechStudent, standardDrive);
assertTest('Ineligible branch fails check', res3.eligible, false);
assertTest('Branch failure mentions branch', res3.reasons[0].includes('Branch \'MECH\' is not eligible'), true);

// 4. CGPA Cutoff Failure
const lowCgpaStudent = {
  ...eligibleStudent,
  cgpa: 7.2 // required 7.5
};
const res4 = checkEligibility(lowCgpaStudent, standardDrive);
assertTest('CGPA below cutoff fails check', res4.eligible, false);
assertTest('CGPA failure includes exact cutoff explanation', res4.reasons.some(r => r.includes('CGPA 7.2 is below required 7.5')), true);

// 5. 10th Percentage Cutoff Failure
const low10thStudent = {
  ...eligibleStudent,
  tenthPct: 65 // required 70
};
const res5 = checkEligibility(low10thStudent, standardDrive);
assertTest('10th percentage below cutoff fails check', res5.eligible, false);
assertTest('10th failure includes explanation', res5.reasons.some(r => r.includes('10th marks (65%) is below required 70%')), true);

// 6. 12th Percentage Cutoff Failure
const low12thStudent = {
  ...eligibleStudent,
  twelfthPct: 68 // required 70
};
const res6 = checkEligibility(low12thStudent, standardDrive);
assertTest('12th percentage below cutoff fails check', res6.eligible, false);
assertTest('12th failure includes explanation', res6.reasons.some(r => r.includes('12th marks (68%) is below required 70%')), true);

// 7. Active Backlogs Exceeded Failure
const studentWithBacklogs = {
  ...eligibleStudent,
  activeBacklogs: 2 // required max 0
};
const res7 = checkEligibility(studentWithBacklogs, standardDrive);
assertTest('Backlogs above maximum fails check', res7.eligible, false);
assertTest('Backlog failure includes explanation', res7.reasons.some(r => r.includes('Active backlogs (2) exceeds maximum allowed (0)')), true);

// 8. Graduation Year Mismatch Failure
const wrongBatchStudent = {
  ...eligibleStudent,
  graduationYear: 2026 // drive is for 2025
};
const res8 = checkEligibility(wrongBatchStudent, standardDrive);
assertTest('Wrong batch graduation year fails check', res8.eligible, false);
assertTest('Graduation year failure includes explanation', res8.reasons.some(r => r.includes('Graduation year (2026) does not match required batch (2025)')), true);

// 9. Open to All Branches Drive (empty branches array)
const openDrive = {
  branches: [],
  minCgpa: 6.0,
  min10thPct: 60,
  min12thPct: 60,
  maxActiveBacklogs: 1,
  graduationYear: null
};
const res9 = checkEligibility(mechStudent, openDrive);
assertTest('Open drive with empty branches allows MECH student', res9.eligible, true);

console.log('\n------------------------------------------------------');
console.log(`Results: ${passedCount} PASSED, ${failedCount} FAILED`);
console.log('------------------------------------------------------\n');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL ELIGIBILITY UNIT TESTS PASSED SUCCESSFULLY!\n');
  process.exit(0);
}
