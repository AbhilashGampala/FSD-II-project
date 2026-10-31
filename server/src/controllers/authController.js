import jwt from 'jsonwebtoken';
import User, { BRANCH_ENUM } from '../models/User.js';
import Otp from '../models/Otp.js';
import { hashOtp, generateOtp, parseRollFromEmail } from '../utils/otpHelper.js';
import { hashPassword, verifyPassword } from '../utils/passwordHelper.js';
import { JWT_SECRET, DEMO_MODE, NODE_ENV } from '../config/environment.js';

// Helper to sign JWT and set cookie
const setAuthCookie = (res, user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
};

/**
 * Direct Email/Roll Number & Password Login
 */
export const login = async (req, res, next) => {
  try {
    const { email, identifier, username, password } = req.body;
    const rawIdentifier = identifier || email || username;

    if (!rawIdentifier || !rawIdentifier.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your registered email address or roll number.'
      });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your password.'
      });
    }

    const input = rawIdentifier.trim();
    let emailLookup = input.toLowerCase();
    if (!emailLookup.includes('@')) {
      emailLookup = `${emailLookup}@vishnu.edu.in`;
    }

    // Lookup user by email OR roll number
    const user = await User.findOne({
      $or: [
        { email: emailLookup },
        { rollNo: { $regex: new RegExp(`^${input}$`, 'i') } }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User account not found.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact the administrator.'
      });
    }

    // Verify password:
    // If user has a hashed password, verify it
    // If user has no password yet (legacy/seeded user), check default password 'Vishnu@123' or rollNo
    let isPasswordValid = false;
    if (user.password) {
      isPasswordValid = verifyPassword(password, user.password);
    } else {
      if (password === 'Vishnu@123' || (user.rollNo && password === user.rollNo)) {
        isPasswordValid = true;
        user.password = hashPassword(password);
        await user.save();
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials.'
      });
    }

    const token = setAuthCookie(res, user);

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.__v;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 1: Request OTP
 */
export const requestOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Enforce official college domain
    if (!normalizedEmail.endsWith('@vishnu.edu.in')) {
      return res.status(400).json({
        success: false,
        message: 'Only official college emails ending with @vishnu.edu.in are allowed.'
      });
    }

    // Check if account is deactivated
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser && !existingUser.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact the administrator.'
      });
    }

    // Generate and hash OTP
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert OTP record for this email
    await Otp.findOneAndUpdate(
      { email: normalizedEmail },
      { otpHash, expiresAt, attempts: 0 },
      { upsert: true, new: true }
    );

    // Console output for OTP (demo mode or development)
    if (DEMO_MODE) {
      console.log(`\n========================================`);
      console.log(`🔑 [DEMO OTP] For ${normalizedEmail}: ${otp}`);
      console.log(`========================================\n`);
    } else {
      console.log(`\n========================================`);
      console.log(`📨 [OTP SENT TO CONSOLE] For ${normalizedEmail}: ${otp} (expires in 10 mins)`);
      console.log(`========================================\n`);
    }

    return res.status(200).json({
      success: true,
      message: DEMO_MODE
        ? 'Demo mode active: use OTP 123456'
        : 'OTP generated and printed to server console',
      isNewUser: !existingUser,
      demoMode: DEMO_MODE
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 2: Verify OTP
 */
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find active OTP record
    const otpRecord = await Otp.findOne({ email: normalizedEmail });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired or was not requested. Please request a new one.'
      });
    }

    // Check maximum attempts limit
    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new OTP.'
      });
    }

    // Compare hash
    const inputHash = hashOtp(String(otp).trim());
    if (inputHash !== otpRecord.otpHash) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = 5 - otpRecord.attempts;
      return res.status(400).json({
        success: false,
        message: `Incorrect OTP. ${remaining} attempt(s) remaining.`
      });
    }

    // OTP is valid - remove it
    await Otp.deleteOne({ _id: otpRecord._id });

    // Check if user already exists
    const user = await User.findOne({ email: normalizedEmail }).select('-__v');

    if (user) {
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact the administrator.'
        });
      }

      const token = setAuthCookie(res, user);
      const safeUser = user.toObject();
      delete safeUser.password;
      delete safeUser.__v;

      return res.status(200).json({
        success: true,
        isNewUser: false,
        token,
        user: safeUser
      });
    }

    // First time signup: parse prefill info and instruct client to complete profile
    const prefill = parseRollFromEmail(normalizedEmail);

    return res.status(200).json({
      success: true,
      isNewUser: true,
      email: normalizedEmail,
      prefill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 3: Complete First-Time Signup Profile (Student Only)
 */
export const signupProfile = async (req, res, next) => {
  try {
    const { email, name, rollNo, branch, phone, admissionYear, graduationYear, password } = req.body;

    if (!email || !name || !branch) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and branch are required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail.endsWith('@vishnu.edu.in')) {
      return res.status(400).json({
        success: false,
        message: 'Only official college emails ending with @vishnu.edu.in are allowed.'
      });
    }

    if (!BRANCH_ENUM.includes(branch)) {
      return res.status(400).json({
        success: false,
        message: `Invalid branch. Allowed values: ${BRANCH_ENUM.join(', ')}`
      });
    }

    // Check if already registered
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in.'
      });
    }

    // Create new student
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: password ? hashPassword(password) : hashPassword('Vishnu@123'),
      rollNo: rollNo ? rollNo.trim().toUpperCase() : '',
      role: 'student', // Signup is strictly for students
      branch,
      phone: phone ? phone.trim() : '',
      admissionYear: admissionYear ? Number(admissionYear) : null,
      graduationYear: graduationYear ? Number(graduationYear) : null,
      isActive: true,
      isSample: false
    });

    await newUser.save();

    const token = setAuthCookie(res, newUser);

    const safeUser = newUser.toObject();
    delete safeUser.password;
    delete safeUser.__v;

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout
 */
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax'
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

/**
 * Get current authenticated user profile
 */
export const getMe = (req, res) => {
  const safeUser = req.user.toObject ? req.user.toObject() : { ...req.user };
  delete safeUser.password;
  delete safeUser.__v;
  return res.status(200).json({
    success: true,
    user: safeUser
  });
};

/**
 * Get public auth configuration (demo mode status)
 */
export const getConfig = (req, res) => {
  return res.status(200).json({
    success: true,
    demoMode: DEMO_MODE
  });
};
