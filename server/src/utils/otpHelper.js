import crypto from 'crypto';
import { OTP_SECRET, DEMO_MODE } from '../config/environment.js';

/**
 * Hash an OTP using HMAC-SHA256 with OTP_SECRET
 * @param {string} otp 
 * @returns {string} hex hash
 */
export const hashOtp = (otp) => {
  return crypto.createHmac('sha256', OTP_SECRET).update(String(otp)).digest('hex');
};

/**
 * Generate 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export const generateOtp = () => {
  if (DEMO_MODE) {
    return '123456';
  }
  // Cryptographically random 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Parse roll number and graduation years from email
 * Example: '24pa1a05c2@vishnu.edu.in' -> Roll: '24PA1A05C2', Admission: 2024, Graduation: 2028
 * @param {string} email 
 * @returns {object} { rollNo, admissionYear, graduationYear }
 */
export const parseRollFromEmail = (email) => {
  if (!email || !email.includes('@')) {
    return { rollNo: '', admissionYear: null, graduationYear: null };
  }

  const prefix = email.split('@')[0].trim();
  // Standard JNTU/VIT roll format: 24PA1A05C2 (10 characters: 2-digit year + 2-letter college code + 1A + branch/seq)
  const rollRegex = /^([0-9]{2}[a-zA-Z0-9]{8})$/i;
  const match = prefix.match(rollRegex);

  if (match) {
    const rollNo = match[1].toUpperCase();
    const yearDigits = parseInt(rollNo.substring(0, 2), 10);
    const admissionYear = 2000 + yearDigits;
    const graduationYear = admissionYear + 4; // standard 4-year B.Tech

    return {
      rollNo,
      admissionYear,
      graduationYear
    };
  }

  return { rollNo: '', admissionYear: null, graduationYear: null };
};
