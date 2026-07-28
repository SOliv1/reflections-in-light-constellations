/**
 * INTEGRATION GUIDE: Where Share Links Appear in the App
 * 
 * The sharing UI has three main integration points:
 * 1. Photo Tile - "Share" button on hover
 * 2. Photo Modal - Share button in expanded view
 * 3. Gallery Header - "Share Collection" for albums
 */

// ============================================================================
// 1. PHOTO TILE - Add Share Button on Hover
// ============================================================================
// File: apps/web/src/components/PhotoTile.js
// Add this to show a "Share" button when hovering over a photo

/*
BEFORE (current PhotoTile):
<div
  ref={tileRef}
  className="photo-tile"
  onMouseEnter={() => { ... }}
  onMouseLeave={() => { ... }}
  onClick={(e) => { ... }}
>
  <img src={img.src} alt={img.alt} className="photo-tile-image" />
  {/* delete button and other actions */}
</div>

AFTER (with Share button):
<div
  ref={tileRef}
  className="photo-tile"
  onMouseEnter={() => { ... }}
  onMouseLeave={() => { ... }}
  onClick={(e) => { ... }}
>
  <img src={img.src} alt={img.alt} className="photo-tile-image" />
  
  {/* NEW: Hover Actions Bar */}
  <div className="photo-tile-actions">
    <button 
      className="photo-tile-action share-action"
      onClick={(e) => {
        e.stopPropagation();
        onShare?.(photo);  // Call parent handler
      }}
      title="Share this photo"
    >
      <span className="icon">🔗</span>
      <span className="label">Share</span>
    </button>
    
    <button 
      className="photo-tile-action favourite-action"
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
      title="Add to favourites"
    >
      <span className="icon">{isFavourite ? '❤️' : '🤍'}</span>
    </button>
    
    <button 
      className="photo-tile-action delete-action"
      onClick={handleDelete}
      title="Delete photo"
    >
      <span className="icon">🗑️</span>
    </button>
  </div>
</div>

PhotoTile Props (update):
export default function PhotoTile({
  photo,
  img = photo,
  onClick,
  isFavourite,
  onToggle,
  season,
  onDelete,
  onApproachPortal,
  onShare,  // ← NEW: handler for opening share modal
}) { ... }
*/

// ============================================================================
// 2. PHOTO MODAL - Share Button in Expanded View
// ============================================================================
// File: apps/web/src/components/PhotoGallery.js
// Add Share button to the expanded photo modal

/*
BEFORE (current modal):
{expandedPhoto && (
  <div className={`photo-modal ${mood || ""}`} onClick={() => setExpandedPhoto(null)}>
    {lightingPresets.length > 0 ? (
      <div className="photo-modal-controls" onClick={(event) => event.stopPropagation()}>
        {lightingPresets.map((preset) => (
          <button key={preset.id} className="photo-modal-light" onClick={() => onSelectMood?.(preset.id)}>
            {preset.label}
          </button>
        ))}
      </div>
    ) : null}
    <div className="photo-modal-frame" style={{ "--season-glow": seasonalBorderGlow[season], ... }}>
      <img src={expandedPhoto} alt="Expanded" />
    </div>
  </div>
)}

AFTER (with Share button):
{expandedPhoto && (
  <div className={`photo-modal ${mood || ""}`} onClick={() => setExpandedPhoto(null)}>
    {lightingPresets.length > 0 ? (
      <div className="photo-modal-controls" onClick={(event) => event.stopPropagation()}>
        {lightingPresets.map((preset) => (
          <button key={preset.id} className="photo-modal-light" onClick={() => onSelectMood?.(preset.id)}>
            {preset.label}
          </button>
        ))}
        
        {/* NEW: Share button in controls */}
        <button 
          className="photo-modal-share-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowShareModal(true);
          }}
          title="Share this photo"
        >
          🔗 Share
        </button>
      </div>
    ) : null}
    <div className="photo-modal-frame" style={{ "--season-glow": seasonalBorderGlow[season], ... }}>
      <img src={expandedPhoto} alt="Expanded" />
    </div>
  </div>
)}

{/* NEW: Share Modal */}
{showShareModal && (
  <ShareModal
    photo={currentPhoto}
    onClose={() => setShowShareModal(false)}
    onShare={handleCreateShare}
    defaultMood={mood}
  />
)}
*/

// ============================================================================
// 3. GALLERY HEADER - Collection Share Button
// ============================================================================
// File: apps/web/src/components/PhotoGallery.js
// Add button above the grid for sharing the entire album/collection

/*
BEFORE (just grid):
return (
  <>
    <div className="photo-grid">
      {images.map((image) => (
        <PhotoTile key={image.id} ... />
      ))}
    </div>
    ...
  </>
);

AFTER (with gallery header):
return (
  <>
    <div className="photo-gallery-header">
      <h2>{album?.title || 'Gallery'}</h2>
      <button 
        className="gallery-share-btn"
        onClick={() => setShowAlbumShareModal(true)}
      >
        <span className="icon">🔗</span>
        Share Collection
      </button>
    </div>
    
    <div className="photo-grid">
      {images.map((image) => (
        <PhotoTile key={image.id} ... />
      ))}
    </div>
    
    {/* Share entire album modal */}
    {showAlbumShareModal && (
      <ShareModal
        album={album}
        onClose={() => setShowAlbumShareModal(false)}
        onShare={handleCreateAlbumShare}
        defaultMood={album?.mood || 'mood-soft-dawn'}
      />
    )}
    ...
  </>
);
*/

// ============================================================================
// 4. DAY PAGE - Share Today's Photos
// ============================================================================
// File: apps/web/src/components/PersistentDayPage.js
// Add share button to share the day's photos

/*
Add Share button in day view header:
<div className="day-header">
  <h1>Today's Reflections</h1>
  <button 
    className="day-share-btn"
    onClick={() => setShowDayShareModal(true)}
  >
    🔗 Share Today
  </button>
</div>

Then open ShareModal with type='collection' or 'album'
*/

// ============================================================================
// LOCATION VISUAL MAP
// ============================================================================

/*
    ┌─────────────────────────────────────────────────────┐
    │           Photo Gallery / Explore                    │
    ├─────────────────────────────────────────────────────┤
    │  🔗 Share Collection                                 │  ← Gallery Header Share
    │                                                      │
    │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐           │
    │  │Photo │  │Photo │  │Photo │  │Photo │           │
    │  │(🔗)  │  │(🔗)  │  │(🔗)  │  │(🔗)  │  ← Photo Tile Share Buttons
    │  └──────┘  └──────┘  └──────┘  └──────┘           │
    │                                                      │
    │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐           │
    │  │Photo │  │Photo │  │Photo │  │Photo │           │
    │  │(🔗)  │  │(🔗)  │  │(🔗)  │  │(🔗)  │           │
    │  └──────┘  └──────┘  └──────┘  └──────┘           │
    └─────────────────────────────────────────────────────┘

    Click photo to expand:
    ┌─────────────────────────────────────┐
    │     🔗 Share   [Mood] [Delete]      │  ← Photo Modal Controls
    ├─────────────────────────────────────┤
    │                                     │
    │          [Large Photo]              │
    │                                     │
    └─────────────────────────────────────┘

    Share button opens:
    ┌─────────────────────────────────────┐
    │      🔗 Share this moment           │
    │                                     │
    │  ○ Public link                      │
    │  ○ Share with friends               │
    │  ○ Password protected               │
    │                                     │
    │  Mood: [🌅] [🌤️] [🎉] [📸]       │
    │  Perms: [✓] Download [✓] Comments │
    │                                     │
    │         [Create share link]         │
    └─────────────────────────────────────┘
*/

// ============================================================================
// COMPONENT HIERARCHY
// ============================================================================

/*
App
├── PhotoGallery (or PersistentDayPage)
│   ├── [Gallery Header] ← Share Collection button
│   ├── [photo-grid]
│   │   ├── PhotoTile ← Share button on hover
│   │   │   ├── [photo-tile-image]
│   │   │   └── [photo-tile-actions] ← NEW
│   │   │       ├── Share button
│   │   │       ├── Favourite button
│   │   │       └── Delete button
│   │   ├── PhotoTile
│   │   └── ...
│   ├── [photo-modal] (expanded view) ← Share button in controls
│   │   ├── [photo-modal-controls]
│   │   │   ├── Mood buttons
│   │   │   └── Share button ← NEW
│   │   └── [photo-modal-frame]
│   └── ShareModal ← NEW
│       ├── Share type selector
│       ├── Recipients / Password
│       ├── Permissions
│       ├── Mood selector
│       └── Footer buttons
*/

export default 'Integration guide for share links';
