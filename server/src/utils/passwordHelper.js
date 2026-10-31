import crypto from 'crypto';

/**
 * Hash a password using Node.js built-in scrypt algorithm
 * Format: salt:hash
 */
export const hashPassword = (password) => {
  if (!password) return '';
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

/**
 * Verify a plain text password against a stored salt:hash string
 */
export const verifyPassword = (password, storedHash) => {
  if (!password || !storedHash || !storedHash.includes(':')) {
    return false;
  }
  try {
    const [salt, key] = storedHash.split(':');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(key, 'hex'));
  } catch (err) {
    return false;
  }
};

