/**
 * Photo Model
 * Stores photo metadata and ownership information
 */

export const Photo = {
  schema: {
    id: String,                           // UUID
    ownerId: String,                      // Foreign key to User.id
    storageUrl: String,                   // Cloudinary URL or storage path
    thumbnailUrl: String,                 // Smaller preview version
    createdAt: Date,
    takenAt: Date,                        // When photo was captured
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
    moodTagIds: [String],                 // Array of MoodTag.id
    caption: String,
    season: String,                       // 'spring' | 'summer' | 'autumn' | 'winter'
    colorTint: String,                    // Hex code or semantic color
    isArchived: Boolean,
    updatedAt: Date,
  },

  // Example document
  example: {
    id: 'photo-uuid-456',
    ownerId: 'user-uuid-123',
    storageUrl: 'https://res.cloudinary.com/.../image.jpg',
    thumbnailUrl: 'https://res.cloudinary.com/.../image_thumb.jpg',
    createdAt: new Date('2026-07-27'),
    takenAt: new Date('2026-07-20T06:30:00Z'),
    exif: {
      camera: 'Canon EOS R5',
      lens: 'RF 50mm f/1.8',
      iso: 400,
      aperture: 'f/2.0',
      shutterSpeed: '1/125s',
      focalLength: 50,
      coordinates: {
        lat: 40.7128,
        lng: -74.0060,
      },
      location: 'Central Park, NY',
    },
    moodTagIds: ['mood-soft-dawn', 'mood-quiet-morning'],
    caption: 'A gentle moment before the city wakes',
    season: 'summer',
    colorTint: '#E8D5B7',
    isArchived: false,
    updatedAt: new Date('2026-07-27'),
  },
};

export default Photo;
