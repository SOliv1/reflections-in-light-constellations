# Photo Sharing Backend Architecture

## Overview
This is the core backend structure for the photo sharing feature. It includes models, utilities, and API routes that enable users to create, manage, and share photos and albums with various access controls.

## Project Structure

```
apps/api/
├── models/
│   ├── User.js                 # User profile and settings
│   ├── Photo.js                # Photo metadata and ownership
│   ├── Album.js                # Album/collection management
│   ├── ShareLink.js            # Share link configurations
│   └── MoodTag.js              # Mood/semantic tags and styling
├── routes/
│   └── share.js                # Share link API endpoints
├── utils/
│   ├── shareUtils.js           # Token generation, URL building
│   └── passwordUtils.js        # Password hashing and validation
```

## Data Models

### User
Stores user profile information and sharing preferences.

**Key fields:**
- `id` - UUID
- `email` - unique, indexed
- `settings` - privacy defaults, theme preferences

### Photo
Stores photo metadata with mood tags and EXIF data.

**Key fields:**
- `id` - UUID
- `ownerId` - FK to User
- `storageUrl` - Cloudinary/cloud storage URL
- `exif` - Camera settings, coordinates, location
- `moodTagIds` - Array of mood tags
- `season` - Auto-detected or user-selected
- `colorTint` - Hex color for presentation

### Album
Groups photos into albums or curated collections.

**Key fields:**
- `id` - UUID
- `ownerId` - FK to User
- `photoIds` - Array of Photo.id
- `type` - 'album' | 'collection'
- `settings` - Display options (timeline, mood map, downloads, etc.)

### ShareLink
Core entity for sharing. Handles one photo OR one album per link.

**Key fields:**
- `token` - Secure random token
- `urlSlug` - Human-readable slug (e.g., `soft-dawn-7f3k`)
- `shortCode` - 6-char code for URL shortening
- `isPublic` - Anyone with link vs invited only
- `isPasswordProtected` - Boolean flag
- `passwordHash` - bcrypt hash (if protected)
- `permissions` - Fine-grained access control
- `mood` - FK to MoodTag for presentation
- `season` - Seasonal tint
- `expiresAt` - Expiration date (null = never)
- `viewCount` - Analytics tracking
- `viewedByEmails` - Who has accessed

### MoodTag
System-provided semantic tags for photo presentation.

**System moods include:**
- `mood-soft-dawn` - Gentle light, warm tones
- `mood-quiet-morning` - Serene, contemplative
- `mood-celebration` - Vibrant, joyful
- `mood-soft-nostalgia` - Warm memories, timeless

**Each mood includes:**
- `colorTint` - Primary hex color
- `hexArray` - Color palette for UI
- `emoji` - Visual identifier
- `typography` - Font preferences (serif/sans-serif, weight, spacing)
- `season` - Associated season

## API Routes

### Create Share Link
```
POST /api/share/create
{
  ownerId: string,
  photoId?: string,           // One of these
  albumId?: string,           // Two is an error
  isPublic: boolean,
  password?: string,          // Optional protection
  passwordHint?: string,
  expiresAt?: date,
  permissions: {
    allowDownload: boolean,
    allowComments: boolean,
    allowReactions: boolean,
    hideExif: boolean,
  },
  mood: string,               // FK to MoodTag
  season: string,
  colorTint: string,
  caption: string,
}

Response:
{
  success: true,
  shareLink: { ... },
  shareUrl: "http://localhost:3000/share/soft-dawn-7f3k"
}
```

### Verify Password
```
POST /api/share/:urlSlug/verify-password
{
  password: string
}

Response:
{
  success: true,
  message: "Password verified",
  token: string                // Session token for subsequent requests
}
```

### Get Share Link Metadata
```
GET /api/share/:urlSlug/metadata?email=optional@email.com

Response:
{
  success: true,
  metadata: {
    urlSlug: string,
    isPasswordProtected: boolean,
    permissions: { ... },
    mood: string,
    season: string,
    colorTint: string,
    caption: string,
    expiresAt: date,
    viewCount: number,
  },
  contentType: "photo" | "album"
}
```

### Send Invitations
```
POST /api/share/:urlSlug/invite
{
  recipientEmails: [string],
  message?: string
}

Response:
{
  success: true,
  message: "Invitations sent to 3 recipient(s)",
  sentTo: [string]
}
```

### Revoke Share Link
```
DELETE /api/share/:urlSlug
{
  ownerId: string              // Required for authorization
}

Response:
{
  success: true,
  message: "Share link revoked"
}
```

### Get User's Share Links
```
GET /api/share/my-links?ownerId=user-uuid-123

Response:
{
  success: true,
  count: number,
  shareLinks: [{ ... }]
}
```

## Utilities

### shareUtils.js
- `generateShareToken()` - 32-char random token
- `generateUrlSlug(baseName)` - e.g., "soft-dawn-7f3k"
- `generateShortCode()` - 6-char alphanumeric
- `isShareLinkExpired(expiresAt)` - Expiration check
- `validateShareLinkAccess(shareLink)` - Permission validation
- `buildShareUrl(urlSlug, options)` - Construct public URL
- `getMoodPresentation(shareLink, moodTag)` - Hydrate UI styling
- `sanitizeShareLinkForResponse(shareLink, options)` - Remove sensitive data
- `recordShareLinkView(shareLink, viewerEmail)` - Track analytics

### passwordUtils.js
- `hashPassword(password)` - Hash plain text (bcrypt ready)
- `verifyPassword(password, hash)` - Compare against hash
- `generateRandomPassword()` - Suggest 16-char password
- `validatePasswordStrength(password)` - Check complexity

## Security Considerations

1. **Password Protection:**
   - Use bcrypt (v10+ rounds recommended)
   - Validate password strength before hashing
   - Hash is stored, never plain text

2. **Token Security:**
   - 32-character cryptographically random tokens
   - URL slugs have random 4-char suffix to prevent enumeration
   - Short codes for URL shortening (optional)

3. **Access Control:**
   - Expiration dates are checked on every access
   - Public vs friends-only distinction
   - Recipient email whitelist for restricted shares
   - Fine-grained permissions (download, comments, exif)

4. **Data Sanitization:**
   - Sensitive fields removed before API responses
   - Passwords never returned to client
   - Recipient lists sanitized for non-owners

5. **Rate Limiting:**
   - Recommended: Apply per IP/user to `/invite` and password verification
   - Prevent brute-force password attacks

## Next Steps

1. **Database Integration:**
   - Replace mock database calls with actual MongoDB/PostgreSQL queries
   - Add indexes on frequently queried fields (urlSlug, ownerId, token)
   - Consider denormalizing view counts for performance

2. **Authentication:**
   - Add JWT/session middleware to verify ownerId in requests
   - Implement optional share link authentication (for private shares)

3. **Email Notifications:**
   - Implement `sendShareInviteEmail()` function
   - Use SendGrid, AWS SES, or similar service

4. **Frontend Components:**
   - `ShareModal` - Create share with all options
   - `MoodSelector` - Pick mood with color preview
   - `SeasonTintLayer` - Seasonal color overlay
   - `SoftGalleryViewer` - Recipient view with mood presentation
   - `PasswordGate` - Entry screen for protected links

5. **Testing:**
   - Unit tests for utility functions
   - Integration tests for API endpoints
   - Test password validation and hashing
   - Test share link expiration logic

6. **Analytics:**
   - Expand tracking to include device, browser, referrer
   - Store view events separately for detailed analytics
   - Generate usage reports for share link creators

7. **Error Handling:**
   - Comprehensive error messages
   - Proper HTTP status codes
   - Logging for debugging

## Installation Notes

Before using this backend:

```bash
cd apps/api
npm install

# For production password hashing:
npm install bcrypt

# For database (choose one):
npm install mongoose        # MongoDB
npm install pg              # PostgreSQL
```

Update `/api/utils/passwordUtils.js` to use bcrypt in production (see TODO comments).
