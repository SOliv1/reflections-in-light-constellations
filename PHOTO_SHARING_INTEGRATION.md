/**
 * Integration Guide for Photo Sharing Backend
 * 
 * Steps to integrate the sharing feature into your Express server
 */

// ============================================================================
// 1. Update apps/api/server.js (or app.js)
// ============================================================================

// Add this import at the top:
import shareRoutes from './routes/share.js';

// In your Express app initialization:
// app.use('/api/share', shareRoutes);

// Example server.js structure:
/*
import express from 'express';
import cors from 'cors';
import shareRoutes from './routes/share.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/share', shareRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/

// ============================================================================
// 2. Database Connection (MongoDB example with Mongoose)
// ============================================================================

/*
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: { type: String, unique: true, index: true },
  settings: {
    defaultPrivacy: String,
    allowCommentsDefault: Boolean,
    allowDownloadsDefault: Boolean,
    hideExifDefault: Boolean,
    theme: String,
    moodPreference: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const photoSchema = new mongoose.Schema({
  id: String,
  ownerId: String,
  storageUrl: String,
  thumbnailUrl: String,
  createdAt: { type: Date, default: Date.now },
  takenAt: Date,
  exif: {
    camera: String,
    lens: String,
    iso: Number,
    aperture: String,
    shutterSpeed: String,
    focalLength: Number,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    location: String,
  },
  moodTagIds: [String],
  caption: String,
  season: String,
  colorTint: String,
  isArchived: Boolean,
  updatedAt: { type: Date, default: Date.now },
});

const albumSchema = new mongoose.Schema({
  id: String,
  ownerId: String,
  title: String,
  description: String,
  coverPhotoId: String,
  photoIds: [String],
  type: { type: String, enum: ['album', 'collection'] },
  isPrivate: Boolean,
  isArchived: Boolean,
  settings: {
    showTimeline: Boolean,
    showMoodMap: Boolean,
    defaultMood: String,
    defaultSeason: String,
    allowDownloads: Boolean,
    allowComments: Boolean,
    hideExif: Boolean,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const shareLinkSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  ownerId: String,
  albumId: String,
  photoId: String,
  token: { type: String, unique: true, index: true },
  urlSlug: { type: String, unique: true, index: true },
  shortCode: { type: String, unique: true, index: true },
  recipientEmails: [String],
  isPublic: Boolean,
  expiresAt: Date,
  isExpired: Boolean,
  isPasswordProtected: Boolean,
  passwordHash: String,
  passwordHint: String,
  permissions: {
    allowDownload: Boolean,
    allowComments: Boolean,
    allowReactions: Boolean,
    hideExif: Boolean,
    previewOnly: Boolean,
  },
  mood: String,
  season: String,
  colorTint: String,
  caption: String,
  viewCount: { type: Number, default: 0 },
  lastViewedAt: Date,
  viewedByEmails: [String],
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
});

const moodTagSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  label: String,
  description: String,
  season: String,
  colorTint: String,
  emoji: String,
  hexArray: [String],
  typography: {
    fontStyle: String,
    fontWeight: String,
    letterSpacing: String,
  },
  createdAt: { type: Date, default: Date.now },
  isSystem: Boolean,
});

export const User = mongoose.model('User', userSchema);
export const Photo = mongoose.model('Photo', photoSchema);
export const Album = mongoose.model('Album', albumSchema);
export const ShareLink = mongoose.model('ShareLink', shareLinkSchema);
export const MoodTag = mongoose.model('MoodTag', moodTagSchema);
*/

// ============================================================================
// 3. Update routes/share.js to use actual database
// ============================================================================

/*
In share.js, replace TODO comments with actual database calls:

// Example for POST /api/share/create:
const shareLink = new ShareLink({
  id: `sharelink-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  ownerId,
  photoId: photoId || null,
  albumId: albumId || null,
  // ... other fields
});

await shareLink.save();

// Example for GET /api/share/:urlSlug/metadata:
const shareLink = await ShareLink.findOne({ urlSlug });

// Example for updating view count:
await ShareLink.updateOne(
  { id: shareLink.id },
  { 
    viewCount: updatedShareLink.viewCount,
    lastViewedAt: updatedShareLink.lastViewedAt,
    viewedByEmails: updatedShareLink.viewedByEmails,
  }
);
*/

// ============================================================================
// 4. Environment Variables (.env file)
// ============================================================================

/*
# App
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/reflections

# JWT (optional)
JWT_SECRET=your_jwt_secret_here

# Email Service (for sending share invitations)
SENDGRID_API_KEY=sg_your_key_here
EMAIL_FROM=noreply@reflectionslight.com

# Cloudinary (for photo storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
*/

// ============================================================================
// 5. Authentication Middleware (Optional)
// ============================================================================

/*
import jwt from 'jsonwebtoken';

export const authenticateShareOwner = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Use in routes:
// router.post('/create', authenticateShareOwner, async (req, res) => { ... });
*/

// ============================================================================
// 6. Testing with cURL or Postman
// ============================================================================

/*
# Create a share link
curl -X POST http://localhost:5000/api/share/create \
  -H "Content-Type: application/json" \
  -d '{
    "ownerId": "user-123",
    "albumId": "album-456",
    "isPublic": true,
    "permissions": {
      "allowDownload": false,
      "allowComments": true,
      "hideExif": false
    },
    "mood": "mood-soft-dawn",
    "season": "summer",
    "caption": "Summer adventures"
  }'

# Get share link metadata
curl http://localhost:5000/api/share/soft-dawn-7f3k/metadata

# Verify password
curl -X POST http://localhost:5000/api/share/soft-dawn-7f3k/verify-password \
  -H "Content-Type: application/json" \
  -d '{"password": "MyPassword123"}'

# Send invitations
curl -X POST http://localhost:5000/api/share/soft-dawn-7f3k/invite \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmails": ["friend@example.com", "colleague@example.com"],
    "message": "Check out these photos!"
  }'

# Delete share link
curl -X DELETE http://localhost:5000/api/share/soft-dawn-7f3k \
  -H "Content-Type: application/json" \
  -d '{"ownerId": "user-123"}'
*/

// ============================================================================
// 7. Production Checklist
// ============================================================================

/*
- [ ] Install bcrypt for password hashing
- [ ] Update passwordUtils.js to use bcrypt
- [ ] Connect to production database
- [ ] Set up email service for share invitations
- [ ] Add authentication middleware to all routes
- [ ] Add rate limiting for password verification and invites
- [ ] Set up HTTPS/SSL
- [ ] Add error logging (e.g., Sentry)
- [ ] Set up request logging (e.g., Morgan)
- [ ] Add input validation middleware
- [ ] Test all API endpoints with edge cases
- [ ] Add database indexes on frequently queried fields
- [ ] Set up monitoring and alerts
- [ ] Create backup strategy for database
*/

export default 'Integration guide for photo sharing backend';
