/**
 * Album Model
 * Stores album/collection metadata
 */

export const Album = {
  schema: {
    id: String,                           // UUID
    ownerId: String,                      // Foreign key to User.id
    title: String,
    description: String,
    coverPhotoId: String,                 // Foreign key to Photo.id (optional)
    photoIds: [String],                   // Array of Photo.id
    type: String,                         // 'album' | 'collection'
    isPrivate: Boolean,
    isArchived: Boolean,
    settings: {
      showTimeline: Boolean,              // Show date-based strip for recipients
      showMoodMap: Boolean,               // Show mood legend
      defaultMood: String,                // Default mood for shares from this album
      defaultSeason: String,              // Default seasonal tint
      allowDownloads: Boolean,
      allowComments: Boolean,
      hideExif: Boolean,
    },
    createdAt: Date,
    updatedAt: Date,
  },

  // Example document
  example: {
    id: 'album-uuid-789',
    ownerId: 'user-uuid-123',
    title: 'Summer in the City',
    description: 'A collection of quiet moments during warm afternoons',
    coverPhotoId: 'photo-uuid-456',
    photoIds: ['photo-uuid-456', 'photo-uuid-457', 'photo-uuid-458'],
    type: 'collection',
    isPrivate: false,
    isArchived: false,
    settings: {
      showTimeline: true,
      showMoodMap: true,
      defaultMood: 'quiet-morning',
      defaultSeason: 'summer',
      allowDownloads: false,
      allowComments: true,
      hideExif: false,
    },
    createdAt: new Date('2026-07-15'),
    updatedAt: new Date('2026-07-27'),
  },
};

export default Album;
