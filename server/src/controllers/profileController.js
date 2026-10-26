import User, { BRANCH_ENUM } from '../models/User.js';

/**
 * Calculate profile completeness percentage and missing items
 */
export const calculateCompleteness = (user) => {
  let score = 0;
  const missing = [];

  if (user.branch && user.branch.trim()) score += 15;
  else missing.push('Engineering Branch');

  if (user.cgpa !== null && user.cgpa !== undefined && !isNaN(Number(user.cgpa))) score += 25;
  else missing.push('Academic CGPA');

  if (user.tenthPct !== null && user.tenthPct !== undefined && !isNaN(Number(user.tenthPct))) score += 15;
  else missing.push('10th Percentage');

  if (user.twelfthPct !== null && user.twelfthPct !== undefined && !isNaN(Number(user.twelfthPct))) score += 15;
  else missing.push('12th / Diploma Percentage');

  if (user.activeBacklogs !== null && user.activeBacklogs !== undefined) score += 15;
  else missing.push('Active Backlogs Count');

  if (user.phone && user.phone.trim()) score += 15;
  else missing.push('Contact Phone Number');

  return {
    percentage: Math.min(score, 100),
    isComplete: score === 100,
    missing
  };
};

// GET /api/profile - Fetch current student profile with completeness metrics
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const completeness = calculateCompleteness(user);

    res.json({
      success: true,
      profile: user,
      completeness
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile - Update student profile with strict academic validation
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      name,
      rollNo,
      branch,
      phone,
      admissionYear,
      graduationYear,
      cgpa,
      tenthPct,
      twelfthPct,
      activeBacklogs
    } = req.body;

    // Validate Branch
    if (branch && !BRANCH_ENUM.includes(branch)) {
      return res.status(400).json({
        success: false,
        message: `Invalid branch selection. Allowed: ${BRANCH_ENUM.join(', ')}`
      });
    }

    // Validate CGPA (0 to 10)
    if (cgpa !== undefined && cgpa !== '' && cgpa !== null) {
      const numCgpa = Number(cgpa);
      if (isNaN(numCgpa) || numCgpa < 0 || numCgpa > 10) {
        return res.status(400).json({
          success: false,
          message: 'Academic CGPA must be a valid number between 0.0 and 10.0'
        });
      }
      user.cgpa = numCgpa;
    }

    // Validate 10th % (0 to 100)
    if (tenthPct !== undefined && tenthPct !== '' && tenthPct !== null) {
      const num10th = Number(tenthPct);
      if (isNaN(num10th) || num10th < 0 || num10th > 100) {
        return res.status(400).json({
          success: false,
          message: '10th percentage must be between 0 and 100'
        });
      }
      user.tenthPct = num10th;
    }

    // Validate 12th % (0 to 100)
    if (twelfthPct !== undefined && twelfthPct !== '' && twelfthPct !== null) {
      const num12th = Number(twelfthPct);
      if (isNaN(num12th) || num12th < 0 || num12th > 100) {
        return res.status(400).json({
          success: false,
          message: '12th/Diploma percentage must be between 0 and 100'
        });
      }
      user.twelfthPct = num12th;
    }

    // Validate Backlogs (>= 0)
    if (activeBacklogs !== undefined && activeBacklogs !== '' && activeBacklogs !== null) {
      const numBacklogs = Number(activeBacklogs);
      if (isNaN(numBacklogs) || numBacklogs < 0) {
        return res.status(400).json({
          success: false,
          message: 'Active backlogs cannot be negative'
        });
      }
      user.activeBacklogs = numBacklogs;
    }

    if (name) user.name = name.trim();
    if (rollNo !== undefined) user.rollNo = rollNo.trim().toUpperCase();
    if (branch) user.branch = branch;
    if (phone !== undefined) user.phone = phone.trim();
    if (admissionYear !== undefined) user.admissionYear = admissionYear ? Number(admissionYear) : null;
    if (graduationYear !== undefined) user.graduationYear = graduationYear ? Number(graduationYear) : null;

    await user.save();

    const completeness = calculateCompleteness(user);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: user,
      completeness
    });
  } catch (error) {
    next(error);
  }
};
