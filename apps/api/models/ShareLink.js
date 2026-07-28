/**
 * ShareLink Model
 * Stores shareable link configurations for photos, albums, and collections
 */

export const ShareLink = {
  schema: {
    id: String,                           // UUID
    ownerId: String,                      // Foreign key to User.id

    // Link target (one of these should be populated)
    albumId: String,                      // Foreign key to Album.id (optional)
    photoId: String,                      // Foreign key to Photo.id (optional)

    // Link generation
    token: String,                        // Secure random token
    urlSlug: String,                      // Human-readable slug like 'soft-dawn-7f3k'
    shortCode: String,                    // 6-8 char code for URL shortening

    // Recipients
    recipientEmails: [String],            // Array of invited email addresses
    isPublic: Boolean,                    // true = anyone with link | false = invited only

    // Expiration
    expiresAt: Date,                      // null = never expires
    isExpired: Boolean,                   // Cached flag for quick queries

    // Protection
    isPasswordProtected: Boolean,
    passwordHash: String,                 // bcrypt hash
    passwordHint: String,                 // Optional hint for viewer

    // Access control
    permissions: {
      allowDownload: Boolean,
      allowComments: Boolean,
      allowReactions: Boolean,
      hideExif: Boolean,
      previewOnly: Boolean,               // Can view but not interact
    },

    // Presentation
    mood: String,                         // Foreign key to MoodTag.id
    season: String,                       // 'spring' | 'summer' | 'autumn' | 'winter'
    colorTint: String,                    // Hex color for veil/overlay
    caption: String,                      // Gentle caption

    // Tracking
    viewCount: Number,
    lastViewedAt: Date,
    viewedByEmails: [String],             // Emails that have accessed

    // Metadata
    createdAt: Date,
    updatedAt: Date,
  },

  // Example document - public album share
  examplePublic: {
    id: 'sharelink-uuid-001',
    ownerId: 'user-uuid-123',
    albumId: 'album-uuid-789',
    photoId: null,
    token: 'sk_live_abc123def456ghi789',
    urlSlug: 'soft-dawn-7f3k',
    shortCode: 'SD7F3K',
    recipientEmails: [],
    isPublic: true,
    expiresAt: null,
    isExpired: false,
    isPasswordProtected: false,
    passwordHash: null,
    passwordHint: null,
    permissions: {
      allowDownload: false,
      allowComments: true,
      allowReactions: true,
      hideExif: false,
      previewOnly: false,
    },
    mood: 'mood-soft-dawn',
    season: 'summer',
    colorTint: '#E8D5B7',
    caption: 'A collection of quiet moments during warm afternoons',
    viewCount: 42,
    lastViewedAt: new Date('2026-07-27T14:30:00Z'),
    viewedByEmails: ['friend1@example.com', 'friend2@example.com'],
    createdAt: new Date('2026-07-15'),
    updatedAt: new Date('2026-07-27'),
  },

  // Example document - password-protected single photo share
  examplePasswordProtected: {
    id: 'sharelink-uuid-002',
    ownerId: 'user-uuid-123',
    albumId: null,
    photoId: 'photo-uuid-456',
    token: 'sk_live_xyz789abc123def456',
    urlSlug: 'quiet-moment-2x9p',
    shortCode: 'QM2X9P',
    recipientEmails: ['special-friend@example.com'],
    isPublic: false,
    expiresAt: new Date('2026-08-27'),
    isExpired: false,
    isPasswordProtected: true,
    passwordHash: '$2b$10$encrypted_hash_here',
    passwordHint: 'The mood of this photo',
    permissions: {
      allowDownload: true,
      allowComments: false,
      allowReactions: false,
      hideExif: true,
      previewOnly: false,
    },
    mood: 'mood-quiet-morning',
    season: 'summer',
    colorTint: '#B8C6DB',
    caption: 'A moment I wanted to share with you',
    viewCount: 1,
    lastViewedAt: new Date('2026-07-26T10:15:00Z'),
    viewedByEmails: ['special-friend@example.com'],
    createdAt: new Date('2026-07-25'),
    updatedAt: new Date('2026-07-27'),
  },

  // Example document - friends-only share
  exampleFriendsOnly: {
    id: 'sharelink-uuid-003',
    ownerId: 'user-uuid-123',
    albumId: 'album-uuid-789',
    photoId: null,
    token: 'sk_live_mno456pqr789stu012',
    urlSlug: 'summer-collection-4k2j',
    shortCode: 'SC4K2J',
    recipientEmails: ['alice@example.com', 'bob@example.com', 'charlie@example.com'],
    isPublic: false,
    expiresAt: new Date('2026-09-27'),
    isExpired: false,
    isPasswordProtected: false,
    passwordHash: null,
    passwordHint: null,
    permissions: {
      allowDownload: false,
      allowComments: true,
      allowReactions: true,
      hideExif: false,
      previewOnly: false,
    },
    mood: 'mood-celebration',
    season: 'summer',
    colorTint: '#F4A261',
    caption: 'Summer adventures with the crew',
    viewCount: 3,
    lastViewedAt: new Date('2026-07-27T12:00:00Z'),
    viewedByEmails: ['alice@example.com', 'bob@example.com'],
    createdAt: new Date('2026-07-15'),
    updatedAt: new Date('2026-07-27'),
  },
};

export default ShareLink;
