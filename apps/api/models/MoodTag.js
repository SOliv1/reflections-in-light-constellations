/**
 * MoodTag Model
 * Stores mood/semantic tags and presentation metadata
 */

export const MoodTag = {
  schema: {
    id: String,                           // UUID or slug like 'mood-soft-dawn'
    label: String,                        // Human-readable: "Soft dawn", "Quiet morning"
    description: String,                  // Brief description
    season: String,                       // 'spring' | 'summer' | 'autumn' | 'winter' | 'year-round'
    colorTint: String,                    // Hex color code
    emoji: String,                        // Visual identifier
    hexArray: [String],                   // Palette of colors for this mood
    typography: {
      fontStyle: String,                  // 'serif' | 'sans-serif' | 'handwriting'
      fontWeight: String,                 // 'light' | 'regular' | 'medium' | 'bold'
      letterSpacing: String,              // CSS value like 'normal' | '2px'
    },
    createdAt: Date,
    isSystem: Boolean,                    // System-provided vs user-created
  },

  // Example documents
  examples: [
    {
      id: 'mood-soft-dawn',
      label: 'Soft dawn',
      description: 'Gentle light breaking through quiet morning',
      season: 'year-round',
      colorTint: '#E8D5B7',
      emoji: '🌅',
      hexArray: ['#FDF8F3', '#E8D5B7', '#D4AF9B', '#C5A896'],
      typography: {
        fontStyle: 'serif',
        fontWeight: 'light',
        letterSpacing: '1px',
      },
      createdAt: new Date('2026-01-01'),
      isSystem: true,
    },
    {
      id: 'mood-quiet-morning',
      label: 'Quiet morning',
      description: 'Serene and contemplative start to the day',
      season: 'year-round',
      colorTint: '#B8C6DB',
      emoji: '🌤️',
      hexArray: ['#E6EBF5', '#B8C6DB', '#8895B8', '#5A6B8A'],
      typography: {
        fontStyle: 'sans-serif',
        fontWeight: 'light',
        letterSpacing: '0.5px',
      },
      createdAt: new Date('2026-01-01'),
      isSystem: true,
    },
    {
      id: 'mood-celebration',
      label: 'Celebration',
      description: 'Vibrant, joyful moments with friends',
      season: 'year-round',
      colorTint: '#F4A261',
      emoji: '🎉',
      hexArray: ['#FFFAED', '#F4A261', '#E76F51', '#D62828'],
      typography: {
        fontStyle: 'sans-serif',
        fontWeight: 'bold',
        letterSpacing: '1px',
      },
      createdAt: new Date('2026-01-01'),
      isSystem: true,
    },
    {
      id: 'mood-soft-nostalgia',
      label: 'Soft nostalgia',
      description: 'Warm memories and timeless moments',
      season: 'autumn',
      colorTint: '#A0826D',
      emoji: '📸',
      hexArray: ['#F5E6D3', '#D4A574', '#A0826D', '#6B5B4A'],
      typography: {
        fontStyle: 'serif',
        fontWeight: 'regular',
        letterSpacing: '1.5px',
      },
      createdAt: new Date('2026-01-01'),
      isSystem: true,
    },
  ],
};

export default MoodTag;
