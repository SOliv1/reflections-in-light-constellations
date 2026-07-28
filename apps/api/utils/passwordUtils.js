/**
 * Password Utilities
 * Helpers for bcrypt hashing and verification
 */

import crypto from 'crypto';

/**
 * Hash a password using simple crypto (or use bcrypt in production)
 * For production, use: import bcrypt from 'bcrypt'
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  // TODO: In production, replace with bcrypt:
  // return bcrypt.hash(password, 10);
  
  // Simple hash for development (NOT secure for production)
  const hash = crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
  
  return hash;
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Previously hashed password
 * @returns {Promise<boolean>} True if password matches
 */
export async function verifyPassword(password, hash) {
  // TODO: In production, replace with bcrypt:
  // return bcrypt.compare(password, hash);
  
  // Simple verification for development (NOT secure for production)
  const inputHash = crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
  
  return inputHash === hash;
}

/**
 * Generate a strong random password suggestion
 * @returns {string} Random 16-character password
 */
export function generateRandomPassword() {
  return crypto.randomBytes(12).toString('hex');
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} { isValid, errors }
 */
export function validatePasswordStrength(password) {
  const errors = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default {
  hashPassword,
  verifyPassword,
  generateRandomPassword,
  validatePasswordStrength,
};
