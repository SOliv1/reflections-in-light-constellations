/**
 * Sharing Utilities
 * Helper functions for share link generation, validation, and security
 */

import crypto from 'crypto';

/**
 * Generate a secure token for share links
 * @returns {string} Random 32-character token
 */
export function generateShareToken() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Generate a URL-friendly slug with random suffix
 * @param {string} baseName - Base name for slug (e.g., "soft-dawn")
 * @returns {string} Slug like "soft-dawn-7f3k"
 */
export function generateUrlSlug(baseName = 'share') {
  const sanitized = baseName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const randomSuffix = crypto.randomBytes(2).toString('hex');
  return `${sanitized}-${randomSuffix}`;
}

/**
 * Generate a short code for URL shortening
 * @returns {string} 6-character alphanumeric code
 */
export function generateShortCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Check if a share link has expired
 * @param {Date} expiresAt - Expiration date (null = never expires)
 * @returns {boolean} True if expired
 */
export function isShareLinkExpired(expiresAt) {
  if (!expiresAt) return false;
  return new Date() > expiresAt;
}

/**
 * Validate share link permissions
 * @param {Object} shareLink - ShareLink document
 * @returns {Object} { isValid, reason }
 */
export function validateShareLinkAccess(shareLink) {
  if (!shareLink) {
    return { isValid: false, reason: 'Share link not found' };
  }

  if (shareLink.isExpired || isShareLinkExpired(shareLink.expiresAt)) {
    return { isValid: false, reason: 'Share link has expired' };
  }

  if (!shareLink.photoId && !shareLink.albumId) {
    return { isValid: false, reason: 'Share link is missing target content' };
  }

  return { isValid: true, reason: null };
}

/**
 * Build share link public URL
 * @param {string} urlSlug - URL slug
 * @param {Object} options - { baseUrl, useShortCode, shortCode }
 * @returns {string} Full URL
 */
export function buildShareUrl(urlSlug, options = {}) {
  const {
    baseUrl = process.env.APP_URL || 'http://localhost:3000',
    useShortCode = false,
    shortCode = null,
  } = options;

  const target = useShortCode && shortCode ? shortCode : urlSlug;
  return `${baseUrl}/share/${target}`;
}

/**
 * Extract mood and presentation from share link
 * Used to hydrate viewer UI with proper styling
 * @param {Object} shareLink - ShareLink document
 * @param {Object} moodTag - MoodTag document
 * @returns {Object} Mood presentation data
 */
export function getMoodPresentation(shareLink, moodTag) {
  if (!moodTag) {
    // Fallback to share link data if mood tag not found
    return {
      colorTint: shareLink.colorTint || '#E8D5B7',
      season: shareLink.season || 'year-round',
      emoji: '📸',
    };
  }

  return {
    colorTint: moodTag.colorTint,
    hexArray: moodTag.hexArray,
    emoji: moodTag.emoji,
    season: shareLink.season || moodTag.season,
    typography: moodTag.typography,
    label: moodTag.label,
    description: moodTag.description,
  };
}

/**
 * Format share link response for API
 * Sanitizes sensitive data before sending to client
 * @param {Object} shareLink - ShareLink document
 * @param {Object} options - { includePassword, recipientOnly }
 * @returns {Object} Sanitized share link data
 */
export function sanitizeShareLinkForResponse(shareLink, options = {}) {
  const { includePassword = false, recipientOnly = false } = options;

  const sanitized = {
    id: shareLink.id,
    urlSlug: shareLink.urlSlug,
    shortCode: shareLink.shortCode,
    isPublic: shareLink.isPublic,
    isPasswordProtected: shareLink.isPasswordProtected,
    permissions: shareLink.permissions,
    mood: shareLink.mood,
    season: shareLink.season,
    colorTint: shareLink.colorTint,
    caption: shareLink.caption,
    expiresAt: shareLink.expiresAt,
    createdAt: shareLink.createdAt,
  };

  if (shareLink.isPasswordProtected && !includePassword) {
    sanitized.passwordHint = shareLink.passwordHint;
  }

  if (!recipientOnly) {
    sanitized.viewCount = shareLink.viewCount;
    sanitized.lastViewedAt = shareLink.lastViewedAt;
  }

  return sanitized;
}

/**
 * Build privacy status details for client reassurance.
 * Recipient emails are intentionally not returned in this object.
 * @param {Object} shareLink - ShareLink document
 * @returns {Object} Privacy status summary
 */
export function getSharePrivacyStatus(shareLink) {
  const recipientCount = Array.isArray(shareLink?.recipientEmails)
    ? shareLink.recipientEmails.length
    : 0;

  const mode = shareLink?.isPublic
    ? 'public'
    : shareLink?.isPasswordProtected
      ? 'private'
      : 'friends';

  return {
    mode,
    isPublic: Boolean(shareLink?.isPublic),
    isPasswordProtected: Boolean(shareLink?.isPasswordProtected),
    recipientCount,
    recipientEmailsSharedWithViewers: false,
    recipientEmailsSharedInApiResponse: false,
  };
}

/**
 * Log view activity for share link
 * @param {Object} shareLink - ShareLink document
 * @param {string} viewerEmail - Email of viewer (optional)
 * @returns {Object} Updated shareLink object
 */
export function recordShareLinkView(shareLink, viewerEmail = null) {
  const updated = { ...shareLink };
  updated.viewCount = (updated.viewCount || 0) + 1;
  updated.lastViewedAt = new Date();

  if (viewerEmail && !updated.viewedByEmails.includes(viewerEmail)) {
    updated.viewedByEmails = [...(updated.viewedByEmails || []), viewerEmail];
  }

  return updated;
}

export default {
  generateShareToken,
  generateUrlSlug,
  generateShortCode,
  isShareLinkExpired,
  validateShareLinkAccess,
  buildShareUrl,
  getMoodPresentation,
  getSharePrivacyStatus,
  sanitizeShareLinkForResponse,
  recordShareLinkView,
};
