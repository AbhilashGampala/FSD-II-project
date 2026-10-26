import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  requestOtp,
  verifyOtp,
  signupProfile,
  logout,
  getMe,
  getConfig
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Stricter rate limiter for OTP endpoints to prevent brute-force
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per windowMs
  message: {
    success: false,
    message: 'Too many OTP requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth Routes
router.get('/config', getConfig);
router.post('/request-otp', otpLimiter, requestOtp);
router.post('/verify-otp', otpLimiter, verifyOtp);
router.post('/signup-profile', signupProfile);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

export default router;
