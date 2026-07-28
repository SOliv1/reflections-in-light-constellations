/**
 * WHERE TO FIND SHARE LINKS - Visual Guide
 * 
 * This shows you exactly where to look and click to access sharing features
 */

export const SHARE_LOCATIONS = {
  // ========================================================================
  // LOCATION 1: PHOTO TILE (Gallery Grid)
  // ========================================================================
  photoTile: {
    where: "Gallery Grid View",
    description: "When hovering over any photo in the grid",
    actions: [
      "🔗 Share - Creates a link to share this single photo",
      "❤️ Favourite - Save to your favorites",
      "🗑️ Delete - Remove this photo",
    ],
    steps: [
      "1. Move your mouse over any photo in the grid",
      "2. Hover buttons appear in the bottom-right corner",
      "3. Click 🔗 Share button",
      "4. ShareModal opens with photo-specific options",
    ],
    visual: `
    ┌────────────────────────────────────────────────────┐
    │            Gallery / Day Photos                     │
    ├────────────────────────────────────────────────────┤
    │                                                    │
    │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
    │  │          │  │          │  │          │        │
    │  │  Photo   │  │  Photo   │  │  Photo   │        │
    │  │          │  │          │  │          │        │
    │  │ [🔗👤🗑]│  │          │  │          │        │
    │  └──────────┘  └──────────┘  └──────────┘        │
    │     ↑                                              │
    │     └─ Hover here to see buttons                   │
    │                                                    │
    │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
    │  │          │  │          │  │          │        │
    │  │  Photo   │  │  Photo   │  │  Photo   │        │
    │  │          │  │          │  │          │        │
    │  └──────────┘  └──────────┘  └──────────┘        │
    │                                                    │
    └────────────────────────────────────────────────────┘
    `,
  },

  // ========================================================================
  // LOCATION 2: PHOTO MODAL (Expanded View)
  // ========================================================================
  photoModal: {
    where: "Photo Modal / Expanded View",
    description: "When a photo is clicked and expanded fullscreen",
    actions: [
      "🔗 Share - Creates a link to this photo",
      "Mood buttons - Change the mood filter",
      "🗑️ Delete - Remove this photo",
    ],
    steps: [
      "1. Click on any photo in the grid",
      "2. Photo expands to fill screen",
      "3. See control buttons at the top",
      "4. Click 🔗 Share button in the controls",
      "5. ShareModal opens",
    ],
    visual: `
    ┌─────────────────────────────────────────────────────┐
    │ 🔗 Share | [Mood1] [Mood2] [Mood3] | 🗑 Delete   │
    │───────────────────────────────────────────────────────│
    │                                                       │
    │                                                       │
    │                 [Large Photo View]                   │
    │                 (1600x900px display)                 │
    │                                                       │
    │                                                       │
    │                                                       │
    │                                                       │
    └─────────────────────────────────────────────────────┘
    `,
  },

  // ========================================================================
  // LOCATION 3: GALLERY HEADER (Collections)
  // ========================================================================
  galleryHeader: {
    where: "Gallery Header / Album View",
    description: "At the top of the photo gallery, next to album title",
    actions: [
      "🔗 Share Collection - Creates a link for all photos in this album",
    ],
    steps: [
      "1. Navigate to Gallery or Day view",
      "2. Look at the header above the photo grid",
      "3. Click 🔗 Share Collection button",
      "4. ShareModal opens with album-specific options",
    ],
    visual: `
    ┌─────────────────────────────────────────────────────┐
    │  Summer Memories              🔗 Share Collection   │
    │───────────────────────────────────────────────────────│
    │                                                       │
    │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │
    │  │ Photo  │  │ Photo  │  │ Photo  │  │ Photo  │   │
    │  └────────┘  └────────┘  └────────┘  └────────┘   │
    │                                                       │
    │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │
    │  │ Photo  │  │ Photo  │  │ Photo  │  │ Photo  │   │
    │  └────────┘  └────────┘  └────────┘  └────────┘   │
    │                                                       │
    └─────────────────────────────────────────────────────┘
    `,
  },

  // ========================================================================
  // LOCATION 4: DAY VIEW (Today's Photos)
  // ========================================================================
  dayView: {
    where: "Day Page Header",
    description: "At the top of the daily reflections view",
    actions: [
      "🔗 Share Today - Creates a link for today's photos",
    ],
    steps: [
      "1. Open Today or Day view",
      "2. Look in the page header",
      "3. Click 🔗 Share Today button",
      "4. ShareModal opens for the day's collection",
    ],
    visual: `
    ┌─────────────────────────────────────────────────────┐
    │  Today's Reflections              🔗 Share Today    │
    │───────────────────────────────────────────────────────│
    │                                                       │
    │  Today: July 27                                      │
    │  Mood: Soft Dawn  Weather: Sunny                     │
    │                                                       │
    │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    │
    │  │  📷 │  │  📷 │  │  📷 │  │  📷 │  │  📷 │    │
    │  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘    │
    │                                                       │
    └─────────────────────────────────────────────────────┘
    `,
  },
};

export const SHARE_MODAL_LAYOUT = `
┌─────────────────────────────────────────────────┐
│                                             ✕    │
│  🔗 Share this moment                           │
│  Choose how you'd like to invite others in     │
│─────────────────────────────────────────────────│
│                                                 │
│  How would you like to share?                  │
│  ○ Public link                                  │
│    Anyone with the link can view               │
│                                                 │
│  ○ Share with friends                          │
│    Only invited friends can view               │
│                                                 │
│  ○ Password protected                          │
│    Secure link with optional password          │
│                                                 │
│─────────────────────────────────────────────────│
│                                                 │
│  Permissions                                    │
│  ☑ Allow downloads                              │
│  ☑ Allow comments & reactions                   │
│  ☐ Hide camera details (EXIF)                  │
│                                                 │
│─────────────────────────────────────────────────│
│                                                 │
│  Set the mood                                   │
│  [🌅 Soft dawn] [🌤 Quiet morning]              │
│  [🎉 Celebration] [📸 Soft nostalgia]           │
│                                                 │
│  Caption                                        │
│  ┌─────────────────────────────────────────┐  │
│  │ A few words about this moment...        │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│                     [Cancel] [Create share link]│
└─────────────────────────────────────────────────┘
`;

export const EXAMPLE_SHARE_FLOW = `
STEP-BY-STEP: Creating a Share Link

STEP 1: FIND YOUR PHOTO
└─ Go to Gallery or Day view
└─ Hover over a photo in the grid
└─ You'll see action buttons appear: [🔗] [❤️] [🗑️]

STEP 2: CLICK SHARE
└─ Click the 🔗 Share button
└─ ShareModal pops up

STEP 3: CHOOSE SHARING METHOD
└─ ○ Public link (anyone with URL)
└─ ○ Friends only (invite by email)
└─ ○ Password protected (optional password)

STEP 4: SET PERMISSIONS
└─ Allow downloads? ☑/☐
└─ Allow comments? ☑/☐
└─ Hide camera details? ☑/☐

STEP 5: CHOOSE MOOD & PRESENTATION
└─ Pick a mood: 🌅 🌤️ 🎉 📸
└─ Select season: Spring/Summer/Autumn/Winter
└─ Add optional caption

STEP 6: CREATE LINK
└─ Click "Create share link" button
└─ Backend generates:
   ├─ URL slug: soft-dawn-7f3k
   ├─ Short code: ZUHEYW
   ├─ Full URL: http://localhost:3000/share/soft-dawn-7f3k
   └─ Token: f5a39594f4ac642f...

STEP 7: COPY & SHARE
└─ Copy the URL
└─ Send to friends via text, email, etc.
└─ They click the link to view the photo(s)

IF PASSWORD PROTECTED:
└─ Viewer sees: "This space is gently protected"
└─ Viewer enters password
└─ Hint displayed: "The mood of this photo"
└─ After verification, photo(s) visible

IF FRIENDS ONLY:
└─ Link is inactive until invited emails access it
└─ ViewCount tracks who viewed
└─ Analytics show: alice@example.com ✅
                   bob@example.com ⏳
`;

export default SHARE_LOCATIONS;
