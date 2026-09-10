/**
 * Password Utilities
 * Helpers for bcrypt hashing and verification
 */

import crypto from 'crypto';

/**
 * Hash a password using Node's built-in scrypt KDF
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashBuffer = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });

  return `scrypt$${salt}$${hashBuffer.toString('hex')}`;
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Previously hashed password
 * @returns {Promise<boolean>} True if password matches
 */
export async function verifyPassword(password, hash) {
  const parts = String(hash || '').split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') {
    return false;
  }

  const [, salt, expectedHashHex] = parts;
  const expectedHash = Buffer.from(expectedHashHex, 'hex');
  if (expectedHash.length === 0) {
    return false;
  }

  const actualHash = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, expectedHash.length, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });

  if (actualHash.length !== expectedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualHash, expectedHash);
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
