/**
 * QUICK START: Implementing Share Buttons
 * Follow these steps to add sharing to your app
 */

// ============================================================================
// STEP 1: Import ShareModal Component (Already Created)
// ============================================================================

// File: apps/web/src/components/PhotoGallery.js (or your main gallery component)

import ShareModal from './ShareModal';

// ============================================================================
// STEP 2: Add State for Share Modal
// ============================================================================

const PhotoGallery = ({ images, ... }) => {
  const [expandedPhoto, setExpandedPhoto] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);      // ← NEW
  const [shareTarget, setShareTarget] = useState(null);             // ← NEW (photo or album)

  // ... existing code ...

  // ============================================================================
  // STEP 3: Create Share Handler
  // ============================================================================

  const handleCreateShare = async (payload) => {
    try {
      // Call your backend API
      const response = await fetch('/api/share/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: currentUser.id,  // From your auth context
          ...payload,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Show success message
        console.log('Share link created:', result.shareUrl);
        
        // Optional: Copy to clipboard
        navigator.clipboard.writeText(result.shareUrl);
        alert(`Link copied! Share: ${result.shareUrl}`);
        
        // Close modal
        setShowShareModal(false);
      }
    } catch (error) {
      console.error('Error creating share link:', error);
      alert('Failed to create share link');
    }
  };

  // ============================================================================
  // STEP 4: Add Share Button to Photo Grid
  // ============================================================================

  return (
    <>
      {/* NEW: Gallery Header with Share Collection Button */}
      <div className="photo-gallery-header">
        <h2>{album?.title || 'Gallery'}</h2>
        <button 
          className="gallery-share-btn"
          onClick={() => {
            setShareTarget(album || { id: 'day', type: 'collection' });
            setShowShareModal(true);
          }}
        >
          🔗 Share Collection
        </button>
      </div>

      {/* Photo Grid */}
      <div className="photo-grid">
        {images.map((image) => (
          <PhotoTile
            key={image.id}
            photo={image}
            isFavourite={!!favourites[image.id]}
            onToggle={() => toggleFavourite(image.id)}
            onClick={() => setExpandedPhoto(image.src)}
            season={season}
            onDelete={() => onDelete(image.id)}
            onApproachPortal={onApproachPortal}
            // NEW: Handler for share button
            onShare={(photo) => {
              setShareTarget(photo);
              setShowShareModal(true);
            }}
          />
        ))}
      </div>

      {/* Photo Modal with Share Button */}
      {expandedPhoto && (
        <div className={`photo-modal ${mood || ""}`} onClick={() => setExpandedPhoto(null)}>
          {lightingPresets.length > 0 ? (
            <div
              className="photo-modal-controls"
              onClick={(event) => event.stopPropagation()}
            >
              {lightingPresets.map((preset) => (
                <button
                  key={preset.id}
                  className={`photo-modal-light ${preset.id === mood ? "active" : ""}`}
                  onClick={() => onSelectMood?.(preset.id)}
                >
                  {preset.label}
                </button>
              ))}
              
              {/* NEW: Share button in expanded view */}
              <button 
                className="photo-modal-share"
                onClick={(e) => {
                  e.stopPropagation();
                  const expandedImage = images.find(img => img.src === expandedPhoto);
                  setShareTarget(expandedImage);
                  setShowShareModal(true);
                }}
              >
                🔗 Share
              </button>
            </div>
          ) : null}
          <div
            className="photo-modal-frame"
            style={{
              "--season-glow": seasonalBorderGlow[season],
              "--mood-overlay": moodImageOverlay[mood] || "transparent",
            }}
          >
            <img
              src={expandedPhoto}
              alt="Expanded"
            />
          </div>
        </div>
      )}

      {/* NEW: Share Modal */}
      {showShareModal && (
        <ShareModal
          photo={shareTarget?.id ? shareTarget : null}
          album={shareTarget?.type === 'collection' ? shareTarget : null}
          onClose={() => setShowShareModal(false)}
          onShare={handleCreateShare}
          defaultMood={mood}
        />
      )}
    </>
  );
};

// ============================================================================
// STEP 5: Update PhotoTile Component
// ============================================================================

// File: apps/web/src/components/PhotoTile.js

export default function PhotoTile({
  photo,
  img = photo,
  onClick,
  isFavourite,
  onToggle,
  season,
  onDelete,
  onApproachPortal,
  onShare,  // ← NEW: Add this prop
}) {
  // ... existing code ...

  return (
    <div
      ref={tileRef}
      className="photo-tile"
      onMouseEnter={() => {
        if (onApproachPortal) onApproachPortal(photo);
        document.body.classList.add("portal-hovering");
      }}
      onMouseLeave={() => {
        document.body.classList.remove("portal-hovering");
      }}
      onClick={(e) => {
        if (onApproachPortal) onApproachPortal(photo);
        if (onClick) setTimeout(() => onClick(e), 350);
      }}
    >
      <img
        src={img.src}
        alt={img.alt}
        className="photo-tile-image"
        loading="lazy"
        decoding="async"
        draggable="false"
        onError={handleImageError}
      />

      {/* NEW: Action buttons on hover */}
      <div className="photo-tile-actions">
        <button 
          className="photo-tile-action share-action"
          onClick={(e) => {
            e.stopPropagation();
            onShare?.(photo);
          }}
          title="Share this photo"
        >
          <span className="icon">🔗</span>
          Share
        </button>

        <button 
          className="photo-tile-action favourite-action"
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          title={isFavourite ? "Remove from favourites" : "Add to favourites"}
        >
          <span className="icon">{isFavourite ? '❤️' : '🤍'}</span>
        </button>

        <button 
          className="photo-tile-action delete-action"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(e);
          }}
          title="Delete photo"
        >
          <span className="icon">🗑️</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// STEP 6: Add CSS for Action Buttons
// ============================================================================

// File: apps/web/src/components/PhotoTile.css (add these styles)

.photo-tile-actions {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-tile:hover .photo-tile-actions {
  opacity: 1;
}

.photo-tile-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.photo-tile-action:hover {
  background: rgba(0, 0, 0, 0.85);
  transform: translateY(-2px);
}

.photo-tile-action .icon {
  font-size: 14px;
}

.share-action:hover {
  background: linear-gradient(135deg, #D4AF9B 0%, #C9946F 100%);
}

.favourite-action:hover {
  background: rgba(255, 0, 0, 0.7);
}

.delete-action:hover {
  background: rgba(255, 0, 0, 0.7);
}

// ============================================================================
// STEP 7: Add CSS for Gallery Share Button
// ============================================================================

.photo-gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  margin-bottom: 16px;
}

.photo-gallery-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0;
}

.gallery-share-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #D4AF9B 0%, #C9946F 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(212, 175, 155, 0.3);
}

.gallery-share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 155, 0.4);
}

// ============================================================================
// STEP 8: API Integration (Backend)
// ============================================================================

// File: apps/api/routes/share.js (already created)
// The backend is already set up with these endpoints:

/*
POST /api/share/create
  - Creates a new share link
  - Returns: { success, shareLink, shareUrl }

POST /api/share/:urlSlug/verify-password
  - Verifies password for protected links

GET /api/share/:urlSlug/metadata
  - Fetches share link details with view tracking

POST /api/share/:urlSlug/invite
  - Sends email invitations to recipients

DELETE /api/share/:urlSlug
  - Revokes a share link

GET /api/share/my-links
  - Gets all share links created by user
*/

// ============================================================================
// STEP 9: Test It Out
// ============================================================================

/*
1. Go to Gallery or Day view
2. Hover over any photo
3. Click 🔗 Share button
4. ShareModal pops up
5. Select sharing options (public, friends, password)
6. Set permissions and mood
7. Click "Create share link"
8. Backend creates link: http://localhost:3000/share/soft-dawn-7f3k
9. Copy and share with others!

Password-protected example:
  - Password: MySecret123
  - Hint: "Think of the mood"
  - Viewers see hint, must enter correct password

Friends-only example:
  - Recipients: alice@example.com, bob@example.com
  - Link only works for invited emails
  - Analytics show who viewed

Public example:
  - Anyone with link can view
  - View count tracks total views
  - No password required
*/

export default 'Quick start guide for share implementation';
