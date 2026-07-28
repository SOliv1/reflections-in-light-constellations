/**
 * User Model
 * Stores user profile information and settings
 */

export const User = {
  schema: {
    id: String,                    // UUID
    name: String,
    email: String,                 // unique, indexed
    settings: {
      defaultPrivacy: String,      // 'private' | 'friends-only' | 'public'
      allowCommentsDefault: Boolean,
      allowDownloadsDefault: Boolean,
      hideExifDefault: Boolean,
      theme: String,               // 'light' | 'dark' | 'seasonal'
      moodPreference: String,      // default mood for shares
    },
    createdAt: Date,
    updatedAt: Date,
  },

  // Example document
  example: {
    id: 'user-uuid-123',
    name: 'Sam',
    email: 'sam@example.com',
    settings: {
      defaultPrivacy: 'friends-only',
      allowCommentsDefault: true,
      allowDownloadsDefault: false,
      hideExifDefault: false,
      theme: 'seasonal',
      moodPreference: 'quiet-morning',
    },
    createdAt: new Date('2026-07-27'),
    updatedAt: new Date('2026-07-27'),
  },
};

export default User;
