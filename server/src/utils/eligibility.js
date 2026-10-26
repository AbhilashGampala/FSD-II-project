/**
 * Shared Eligibility Evaluation Function
 * Used by Server API guards and mirrored in UI drive cards
 * 
 * @param {Object} student - Student user record
 * @param {Object} driveEligibility - Drive eligibility configuration
 * @returns {Object} { eligible, isIncomplete, reasons, firstFailingReason, criteria }
 */
export const checkEligibility = (student, driveEligibility = {}) => {
  if (!student) {
    return {
      eligible: false,
      isIncomplete: true,
      reasons: ['Student information not provided.'],
      firstFailingReason: 'Student information not provided.',
      criteria: []
    };
  }

  // 1. Profile Completeness Check
  const hasBranch = Boolean(student.branch && student.branch.trim());
  const hasCgpa = student.cgpa !== null && student.cgpa !== undefined && !isNaN(Number(student.cgpa));
  const has10th = student.tenthPct !== null && student.tenthPct !== undefined && !isNaN(Number(student.tenthPct));
  const has12th = student.twelfthPct !== null && student.twelfthPct !== undefined && !isNaN(Number(student.twelfthPct));
  const hasBacklogs = student.activeBacklogs !== null && student.activeBacklogs !== undefined && !isNaN(Number(student.activeBacklogs));

  if (!hasBranch || !hasCgpa || !has10th || !has12th || !hasBacklogs) {
    const missingFields = [];
    if (!hasBranch) missingFields.push('Branch');
    if (!hasCgpa) missingFields.push('CGPA');
    if (!has10th) missingFields.push('10th %');
    if (!has12th) missingFields.push('12th %');
    if (!hasBacklogs) missingFields.push('Active Backlogs');

    return {
      eligible: false,
      isIncomplete: true,
      reasons: ['Complete your profile to check eligibility'],
      firstFailingReason: `Complete your profile to check eligibility (missing: ${missingFields.join(', ')})`,
      criteria: []
    };
  }

  const {
    branches = [],
    minCgpa = 0,
    min10thPct = 0,
    min12thPct = 0,
    maxActiveBacklogs = 0,
    graduationYear = null
  } = driveEligibility;

  const reasons = [];
  const criteria = [];

  // 2. Branch Check (Empty branches array means all branches eligible)
  const branchEligible = !branches || branches.length === 0 || branches.includes(student.branch);
  criteria.push({
    rule: 'Branch',
    required: branches && branches.length > 0 ? branches.join(', ') : 'All Branches',
    actual: student.branch,
    passed: branchEligible
  });
  if (!branchEligible) {
    reasons.push(`Branch '${student.branch}' is not eligible (Allowed: ${branches.join(', ')})`);
  }

  // 3. CGPA Check
  const studentCgpa = Number(student.cgpa);
  const requiredCgpa = Number(minCgpa) || 0;
  const cgpaEligible = studentCgpa >= requiredCgpa;
  criteria.push({
    rule: 'Minimum CGPA',
    required: requiredCgpa > 0 ? `${requiredCgpa}` : 'None',
    actual: `${studentCgpa}`,
    passed: cgpaEligible
  });
  if (!cgpaEligible) {
    reasons.push(`Your CGPA ${studentCgpa} is below required ${requiredCgpa}`);
  }

  // 4. 10th Percentage Check
  const student10th = Number(student.tenthPct);
  const required10th = Number(min10thPct) || 0;
  const tenthEligible = student10th >= required10th;
  criteria.push({
    rule: '10th Percentage',
    required: required10th > 0 ? `${required10th}%` : 'None',
    actual: `${student10th}%`,
    passed: tenthEligible
  });
  if (!tenthEligible) {
    reasons.push(`Your 10th marks (${student10th}%) is below required ${required10th}%`);
  }

  // 5. 12th Percentage Check
  const student12th = Number(student.twelfthPct);
  const required12th = Number(min12thPct) || 0;
  const twelfthEligible = student12th >= required12th;
  criteria.push({
    rule: '12th Percentage',
    required: required12th > 0 ? `${required12th}%` : 'None',
    actual: `${student12th}%`,
    passed: twelfthEligible
  });
  if (!twelfthEligible) {
    reasons.push(`Your 12th marks (${student12th}%) is below required ${required12th}%`);
  }

  // 6. Active Backlogs Check
  const studentBacklogs = Number(student.activeBacklogs);
  const allowedBacklogs = Number(maxActiveBacklogs) || 0;
  const backlogsEligible = studentBacklogs <= allowedBacklogs;
  criteria.push({
    rule: 'Max Active Backlogs',
    required: `${allowedBacklogs}`,
    actual: `${studentBacklogs}`,
    passed: backlogsEligible
  });
  if (!backlogsEligible) {
    reasons.push(`Active backlogs (${studentBacklogs}) exceeds maximum allowed (${allowedBacklogs})`);
  }

  // 7. Graduation Year Check (if drive specifies graduationYear)
  let gradYearEligible = true;
  if (graduationYear && graduationYear > 0) {
    gradYearEligible = Number(student.graduationYear) === Number(graduationYear);
    criteria.push({
      rule: 'Graduation Year',
      required: `${graduationYear}`,
      actual: student.graduationYear ? `${student.graduationYear}` : 'Not set',
      passed: gradYearEligible
    });
    if (!gradYearEligible) {
      reasons.push(`Graduation year (${student.graduationYear}) does not match required batch (${graduationYear})`);
    }
  }

  const eligible = reasons.length === 0;

  return {
    eligible,
    isIncomplete: false,
    reasons,
    firstFailingReason: reasons.length > 0 ? reasons[0] : null,
    criteria
  };
};
