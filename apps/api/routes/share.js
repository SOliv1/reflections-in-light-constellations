/**
 * Share Routes
 * API endpoints for creating and managing share links
 */

import express from 'express';
import { connectToDb } from '../db.js';
import { getDayByDate } from '../models/Day.js';
import {
  generateShareToken,
  generateUrlSlug,
  generateShortCode,
  buildShareUrl,
  getSharePrivacyStatus,
  validateShareLinkAccess,
  sanitizeShareLinkForResponse,
  recordShareLinkView,
} from '../utils/shareUtils.js';
import { normalizeDayDate } from '../utils/dayDate.js';
import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
} from '../utils/passwordUtils.js';

const router = express.Router();
const shareLinksBySlug = new Map();
const MAX_RECIPIENT_EMAILS = 25;
const PASSWORD_VERIFY_WINDOW_MS = 10 * 60 * 1000;
const PASSWORD_VERIFY_MAX_ATTEMPTS = 10;
const passwordVerifyAttemptsByKey = new Map();

function getPasswordVerifyRateLimitKey(req) {
  const forwardedFor = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = forwardedFor || req.ip || req.socket?.remoteAddress || 'unknown';
  const slug = String(req.params.urlSlug || '').trim().toLowerCase();
  return `${slug}:${ip}`;
}

function enforcePasswordVerifyRateLimit(req, res, next) {
  const now = Date.now();
  const key = getPasswordVerifyRateLimitKey(req);
  const existing = passwordVerifyAttemptsByKey.get(key);

  if (!existing || now - existing.firstAttemptAt >= PASSWORD_VERIFY_WINDOW_MS) {
    passwordVerifyAttemptsByKey.set(key, { attempts: 1, firstAttemptAt: now });
    return next();
  }

  if (existing.attempts >= PASSWORD_VERIFY_MAX_ATTEMPTS) {
    const retryAfterMs = PASSWORD_VERIFY_WINDOW_MS - (now - existing.firstAttemptAt);
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
    res.set('Retry-After', String(retryAfterSeconds));
    return res.status(429).json({
      error: 'Too many password attempts. Please try again later.',
      retryAfterSeconds,
    });
  }

  existing.attempts += 1;
  passwordVerifyAttemptsByKey.set(key, existing);
  return next();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeRecipientEmails(input) {
  if (!Array.isArray(input)) {
    return [];
  }

  return [...new Set(input.map((email) => String(email || '').trim().toLowerCase()).filter(Boolean))];
}

function validateRecipientEmails(recipientEmails) {
  if (recipientEmails.length > MAX_RECIPIENT_EMAILS) {
    return {
      isValid: false,
      error: `A maximum of ${MAX_RECIPIENT_EMAILS} recipient emails is allowed`,
    };
  }

  const invalidEmails = recipientEmails.filter((email) => !isValidEmail(email));
  if (invalidEmails.length > 0) {
    return {
      isValid: false,
      error: 'Some recipient emails are invalid',
      invalidEmails,
    };
  }

  return { isValid: true };
}

async function sendShareInviteEmail({ to, shareUrl, ownerId, message }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.EMAIL_FROM;

  if (!apiKey || !fromEmail) {
    return {
      email: to,
      status: 'skipped',
      reason: 'email_provider_not_configured',
    };
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: fromEmail },
      subject: 'A reflection gallery has been shared with you',
      content: [
        {
          type: 'text/plain',
          value: [
            `${ownerId || 'Someone'} shared a reflection gallery with you.`,
            '',
            `Open link: ${shareUrl}`,
            message ? '' : null,
            message ? `Message: ${message}` : null,
          ]
            .filter(Boolean)
            .join('\n'),
        },
      ],
    }),
  });

  if (response.ok) {
    return {
      email: to,
      status: 'sent',
    };
  }

  return {
    email: to,
    status: 'failed',
    reason: `provider_error_${response.status}`,
  };
}

async function sendInvitations({ shareLink, recipientEmails, message }) {
  const shareUrl = buildShareUrl(shareLink.urlSlug);
  const results = await Promise.all(
    recipientEmails.map((email) =>
      sendShareInviteEmail({
        to: email,
        shareUrl,
        ownerId: shareLink.ownerId,
        message,
      })
    )
  );

  const summary = results.reduce(
    (acc, item) => {
      if (item.status === 'sent') acc.sent += 1;
      else if (item.status === 'skipped') acc.skipped += 1;
      else acc.failed += 1;
      return acc;
    },
    { sent: 0, failed: 0, skipped: 0 }
  );

  return {
    shareUrl,
    summary,
    results,
  };
}

function getShareCapabilities() {
  const invitesEnabled = Boolean(process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM);
  return {
    invitesEnabled,
    maxRecipientEmails: MAX_RECIPIENT_EMAILS,
  };
}

router.get('/capabilities', (_req, res) => {
  res.json({
    success: true,
    capabilities: getShareCapabilities(),
  });
});

function getShareTarget(shareLink) {
  return {
    type: shareLink.photoId ? 'photo' : 'album',
    albumId: shareLink.albumId || null,
    photoId: shareLink.photoId || null,
  };
}

async function resolveShareContent(shareLink) {
  const target = getShareTarget(shareLink);

  if (target.photoId) {
    const looksLikeUrl = /^https?:\/\//i.test(target.photoId);
    return {
      photos: looksLikeUrl ? [target.photoId] : [],
      mood: shareLink.mood || null,
      source: 'single-photo',
    };
  }

  if (target.albumId && target.albumId.startsWith('day-')) {
    const isoDate = target.albumId.slice(4);
    const normalizedDayDate = normalizeDayDate(isoDate);

    if (!normalizedDayDate) {
      return {
        photos: [],
        mood: shareLink.mood || null,
        source: 'day-gallery',
      };
    }

    try {
      const db = await connectToDb();
      const day = await getDayByDate(db, normalizedDayDate);
      return {
        photos: Array.isArray(day?.photos) ? day.photos : [],
        mood: day?.mood || shareLink.mood || null,
        date: isoDate,
        source: 'day-gallery',
      };
    } catch {
      return {
        photos: [],
        mood: shareLink.mood || null,
        date: isoDate,
        source: 'day-gallery',
      };
    }
  }

  return {
    photos: [],
    mood: shareLink.mood || null,
    source: 'album',
  };
}

/**
 * POST /api/share/create
 * Create a new share link for a photo or album
 */
router.post('/create', async (req, res) => {
  try {
    const {
      ownerId,
      photoId,
      albumId,
      isPublic = true,
      password = null,
      passwordHint = null,
      expiresAt = null,
      recipientEmails = [],
      inviteMessage = '',
      permissions = {},
      mood = 'mood-soft-dawn',
      season = 'year-round',
      colorTint = '#E8D5B7',
      caption = '',
    } = req.body;

    // Validation
    if (!ownerId) {
      return res.status(400).json({ error: 'ownerId is required' });
    }

    if (!photoId && !albumId) {
      return res
        .status(400)
        .json({ error: 'Either photoId or albumId must be provided' });
    }

    if (photoId && albumId) {
      return res
        .status(400)
        .json({
          error: 'Cannot share both photo and album in a single link',
        });
    }

    const normalizedRecipientEmails = normalizeRecipientEmails(recipientEmails);
    const recipientValidation = validateRecipientEmails(normalizedRecipientEmails);
    if (!recipientValidation.isValid) {
      return res.status(400).json({
        error: recipientValidation.error,
        invalidEmails: recipientValidation.invalidEmails || [],
      });
    }

    // Password validation
    let passwordHash = null;
    if (password) {
      const strength = validatePasswordStrength(password);
      if (!strength.isValid) {
        return res.status(400).json({
          error: 'Password does not meet requirements',
          details: strength.errors,
        });
      }
      passwordHash = await hashPassword(password);
    }

    // Create share link
    const shareLink = {
      id: `sharelink-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ownerId,
      photoId: photoId || null,
      albumId: albumId || null,
      token: generateShareToken(),
      urlSlug: generateUrlSlug(albumId ? 'album' : 'photo'),
      shortCode: generateShortCode(),
      recipientEmails: normalizedRecipientEmails,
      isPublic,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isExpired: false,
      isPasswordProtected: !!password,
      passwordHash,
      passwordHint: passwordHint || null,
      permissions: {
        allowDownload: permissions.allowDownload ?? false,
        allowComments: permissions.allowComments ?? true,
        allowReactions: permissions.allowReactions ?? true,
        hideExif: permissions.hideExif ?? false,
        previewOnly: permissions.previewOnly ?? false,
      },
      mood,
      season,
      colorTint,
      caption,
      viewCount: 0,
      lastViewedAt: null,
      viewedByEmails: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Save to database
    // await ShareLinkCollection.insertOne(shareLink);

    shareLinksBySlug.set(shareLink.urlSlug, shareLink);

    let invitation = null;
    if (normalizedRecipientEmails.length > 0) {
      invitation = await sendInvitations({
        shareLink,
        recipientEmails: normalizedRecipientEmails,
        message: String(inviteMessage || '').trim(),
      });
    }

    res.status(201).json({
      success: true,
      shareLink: sanitizeShareLinkForResponse(shareLink),
      shareUrl: buildShareUrl(shareLink.urlSlug),
      privacyStatus: getSharePrivacyStatus(shareLink),
      invitation,
      limits: {
        maxRecipientEmails: MAX_RECIPIENT_EMAILS,
      },
    });
  } catch (error) {
    console.error('Error creating share link:', error);
    res.status(500).json({ error: 'Failed to create share link' });
  }
});

/**
 * POST /api/share/:urlSlug/verify-password
 * Verify password for protected share links
 */
router.post('/:urlSlug/verify-password', enforcePasswordVerifyRateLimit, async (req, res) => {
  try {
    const { password } = req.body;
    const { urlSlug } = req.params;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // TODO: Fetch share link from database
    // const shareLink = await ShareLinkCollection.findOne({ urlSlug });
    const shareLink = shareLinksBySlug.get(urlSlug) || null;

    if (!shareLink) {
      return res.status(404).json({ error: 'Share link not found' });
    }

    if (!shareLink.isPasswordProtected) {
      return res.status(400).json({ error: 'This share link is not password protected' });
    }

    const isValid = await verifyPassword(password, shareLink.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    passwordVerifyAttemptsByKey.delete(getPasswordVerifyRateLimitKey(req));

    res.json({
      success: true,
      message: 'Password verified',
      // Return a session token or JWT for subsequent requests
      token: shareLink.token,
    });
  } catch (error) {
    console.error('Error verifying password:', error);
    res.status(500).json({ error: 'Failed to verify password' });
  }
});

/**
 * GET /api/share/:urlSlug/metadata
 * Fetch share link metadata and content info
 */
router.get('/:urlSlug/metadata', async (req, res) => {
  try {
    const { urlSlug } = req.params;

    // TODO: Fetch share link from database
    // const shareLink = await ShareLinkCollection.findOne({ urlSlug });
    const shareLink = shareLinksBySlug.get(urlSlug) || null;

    if (!shareLink) {
      return res.status(404).json({ error: 'Share link not found' });
    }

    // Validate access
    const validation = validateShareLinkAccess(shareLink);
    if (!validation.isValid) {
      return res.status(403).json({ error: validation.reason });
    }

    // Record view
    const updatedShareLink = recordShareLinkView(shareLink, req.query.email || null);
    shareLinksBySlug.set(urlSlug, updatedShareLink);
    const sharedContent = await resolveShareContent(updatedShareLink);

    // TODO: Update view count in database
    // await ShareLinkCollection.updateOne({ id: shareLink.id }, updatedShareLink);

    res.json({
      success: true,
      metadata: sanitizeShareLinkForResponse(updatedShareLink),
      contentType: shareLink.photoId ? 'photo' : 'album',
      target: getShareTarget(updatedShareLink),
      sharedContent,
      privacyStatus: getSharePrivacyStatus(updatedShareLink),
    });
  } catch (error) {
    console.error('Error fetching share link metadata:', error);
    res.status(500).json({ error: 'Failed to fetch share link' });
  }
});

/**
 * POST /api/share/:urlSlug/invite
 * Send share link invitations to recipients
 */
router.post('/:urlSlug/invite', async (req, res) => {
  try {
    const { urlSlug } = req.params;
    const { recipientEmails, message = '' } = req.body;

    if (!recipientEmails || !Array.isArray(recipientEmails) || recipientEmails.length === 0) {
      return res.status(400).json({ error: 'recipientEmails array is required' });
    }

    const normalizedRecipientEmails = normalizeRecipientEmails(recipientEmails);
    const recipientValidation = validateRecipientEmails(normalizedRecipientEmails);
    if (!recipientValidation.isValid) {
      return res.status(400).json({
        error: recipientValidation.error,
        invalidEmails: recipientValidation.invalidEmails || [],
      });
    }

    // TODO: Fetch share link from database
    // const shareLink = await ShareLinkCollection.findOne({ urlSlug });
    const shareLink = shareLinksBySlug.get(urlSlug) || null;

    if (!shareLink) {
      return res.status(404).json({ error: 'Share link not found' });
    }

    // TODO: Update share link in database with new recipients and delivery status.
    const mergedRecipients = [...new Set([...(shareLink.recipientEmails || []), ...normalizedRecipientEmails])];
    const updatedShareLink = {
      ...shareLink,
      recipientEmails: mergedRecipients,
      updatedAt: new Date(),
    };
    shareLinksBySlug.set(urlSlug, updatedShareLink);

    const invitation = await sendInvitations({
      shareLink: updatedShareLink,
      recipientEmails: normalizedRecipientEmails,
      message: String(message || '').trim(),
    });

    res.json({
      success: true,
      message: `Invitation process completed for ${normalizedRecipientEmails.length} recipient(s)`,
      sentTo: normalizedRecipientEmails,
      invitation,
      privacyStatus: getSharePrivacyStatus(updatedShareLink),
      limits: {
        maxRecipientEmails: MAX_RECIPIENT_EMAILS,
      },
    });
  } catch (error) {
    console.error('Error sending invitations:', error);
    res.status(500).json({ error: 'Failed to send invitations' });
  }
});

/**
 * DELETE /api/share/:urlSlug
 * Revoke/delete a share link
 */
router.delete('/:urlSlug', async (req, res) => {
  try {
    const { urlSlug } = req.params;
    const { ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({ error: 'ownerId is required' });
    }

    // TODO: Fetch and validate ownership
    // const shareLink = await ShareLinkCollection.findOne({ urlSlug });
    const shareLink = shareLinksBySlug.get(urlSlug) || null;

    if (!shareLink) {
      return res.status(404).json({ error: 'Share link not found' });
    }

    if (shareLink.ownerId !== ownerId) {
      return res.status(403).json({ error: 'You do not own this share link' });
    }

    // TODO: Delete from database
    // await ShareLinkCollection.deleteOne({ id: shareLink.id });
    shareLinksBySlug.delete(urlSlug);

    res.json({
      success: true,
      message: 'Share link revoked',
    });
  } catch (error) {
    console.error('Error revoking share link:', error);
    res.status(500).json({ error: 'Failed to revoke share link' });
  }
});

/**
 * GET /api/share/my-links
 * Fetch all share links created by the user
 */
router.get('/my-links', async (req, res) => {
  try {
    const { ownerId } = req.query;

    if (!ownerId) {
      return res.status(400).json({ error: 'ownerId query param is required' });
    }

    // TODO: Fetch share links from database
    // const shareLinks = await ShareLinkCollection.find({ ownerId });
    const shareLinks = [...shareLinksBySlug.values()].filter((link) => link.ownerId === ownerId);

    res.json({
      success: true,
      count: shareLinks.length,
      shareLinks: shareLinks.map(link => sanitizeShareLinkForResponse(link)),
    });
  } catch (error) {
    console.error('Error fetching share links:', error);
    res.status(500).json({ error: 'Failed to fetch share links' });
  }
});

export default router;
