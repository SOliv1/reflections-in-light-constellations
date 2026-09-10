import { useCallback, useEffect, useRef, useState } from "react";
import PhotoTile from "./PhotoTile";
import ShareModal from "./ShareModal";
import "./PhotoGallery.css";

const PhotoGallery = ({
  images,
  favourites,
  toggleFavourite,
  season,
  mood,
  lightingPresets = [],
  onSelectMood,
  onDelete,
  onApproachPortal,
  onCreateShare,
  sharingEnabled = false,
  collectionShareTarget = null,
  shareButtonLabel = "Share Collection",
  autoOpenCollectionShare = false,
}) => {
  const [expandedPhoto, setExpandedPhoto] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTarget, setShareTarget] = useState(null);
  const hasAutoOpenedShare = useRef(false);
  console.log("Gallery images:", images);

  const seasonalBorderGlow = {
  winter: "rgba(127, 200, 255, 0.45)",
  spring: "rgba(255, 143, 177, 0.45)",
  summer: "rgba(255, 215, 0, 0.45)",
  autumn: "rgba(255, 179, 107, 0.45)",
};

const moodImageFilter = {
  "warm-spotlight": "sepia(0.38) saturate(1.24) brightness(1.1) contrast(1.04) hue-rotate(-10deg)",
  "blue-hour": "brightness(0.9) saturate(0.78) contrast(1.08) hue-rotate(-22deg)",
  "dress-rehearsal": "brightness(1.05) saturate(0.9) contrast(0.98) hue-rotate(8deg)",
  "golden-encore": "none",
  "velvet-midnight": "brightness(0.76) saturate(0.68) contrast(1.18) hue-rotate(-34deg)",
  calm: "brightness(1.04) saturate(0.94)",
  joyful: "sepia(0.32) saturate(1.18) brightness(1.08) hue-rotate(-6deg)",
  stormy: "brightness(0.82) saturate(0.7) contrast(1.16) hue-rotate(-32deg)",
  reflective: "brightness(0.92) saturate(0.82) hue-rotate(-12deg)",
  natural: "none",
};

const moodImageOverlay = {
  "warm-spotlight": "linear-gradient(180deg, rgba(255, 210, 156, 0.14), rgba(145, 76, 34, 0.16))",
  "blue-hour": "linear-gradient(180deg, rgba(120, 158, 255, 0.14), rgba(22, 36, 92, 0.2))",
  "dress-rehearsal": "linear-gradient(180deg, rgba(225, 198, 255, 0.12), rgba(78, 50, 104, 0.16))",
  "golden-encore": "linear-gradient(180deg, rgba(255, 235, 188, 0.06), rgba(114, 78, 28, 0.08))",
  "velvet-midnight": "linear-gradient(180deg, rgba(108, 118, 196, 0.12), rgba(12, 16, 44, 0.24))",
  calm: "linear-gradient(180deg, rgba(225, 198, 255, 0.12), rgba(78, 50, 104, 0.16))",
  joyful: "linear-gradient(180deg, rgba(255, 210, 156, 0.14), rgba(145, 76, 34, 0.16))",
  stormy: "linear-gradient(180deg, rgba(108, 118, 196, 0.12), rgba(12, 16, 44, 0.24))",
  reflective: "linear-gradient(180deg, rgba(120, 158, 255, 0.14), rgba(22, 36, 92, 0.2))",
  natural: "linear-gradient(180deg, rgba(255, 235, 188, 0.06), rgba(114, 78, 28, 0.08))",
};


  const openShareForPhoto = (photo) => {
    setShareTarget(photo || null);
    setShowShareModal(true);
  };

  const openShareForCollection = useCallback(() => {
    setShareTarget(collectionShareTarget || { id: "day-collection", type: "collection" });
    setShowShareModal(true);
  }, [collectionShareTarget]);

  const handleShare = async (payload) => {
    return await onCreateShare?.(payload);
  };

  function openSharePreviewRoute(event) {
    event?.stopPropagation?.();
    window.location.assign("/share/test-403");
  }

  useEffect(() => {
    if (!sharingEnabled || !autoOpenCollectionShare || hasAutoOpenedShare.current) {
      return;
    }

    hasAutoOpenedShare.current = true;
    openShareForCollection();
  }, [sharingEnabled, autoOpenCollectionShare, openShareForCollection]);

  return (
    <>
      {sharingEnabled ? (
        <div className="photo-gallery-share-hero">
          <button
            type="button"
            className="gallery-share-btn"
            onClick={openShareForCollection}
          >
            ✨ {shareButtonLabel}
          </button>
          <p className="photo-gallery-share-note">Invite someone into today&apos;s reflections</p>
        </div>
      ) : (
        <div className="photo-gallery-share-hero is-disabled" role="status" aria-live="polite">
          <button
            type="button"
            className="gallery-share-btn gallery-share-btn-preview"
            onClick={openSharePreviewRoute}
          >
            Share Collection
          </button>
          <p className="photo-gallery-share-note">Sharing is paused. Tap to open the secure route and return home.</p>
        </div>
      )}

      <div className="photo-gallery-header">
        <h3>Captured reflections</h3>
      </div>

      <div className="photo-grid">
        {images.map((image) => (
          <PhotoTile
            key={image.id}
            img={image}
            photo={image}
            isFavourite={!!favourites[image.id]}
            onToggle={() => toggleFavourite(image.id)}
            onClick={() => setExpandedPhoto(image.src)}
            season={season}
            onDelete={() => onDelete(image.id)}
            onApproachPortal={onApproachPortal}
            onShare={sharingEnabled ? () => openShareForPhoto(image) : undefined}

          />
        ))}
      </div>

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
                type="button"
                className={`photo-modal-light ${preset.id === mood ? "active" : ""}`}
                onClick={() => onSelectMood?.(preset.id)}
              >
                {preset.label}
              </button>
            ))}
            {sharingEnabled ? (
              <button
                type="button"
                className="photo-modal-share"
                onClick={(event) => {
                  event.stopPropagation();
                  const expandedImage = images.find((image) => image.src === expandedPhoto) || null;
                  openShareForPhoto(expandedImage);
                }}
              >
                Share photo
              </button>
            ) : (
              <button
                type="button"
                className="photo-modal-share photo-modal-share-preview"
                onClick={openSharePreviewRoute}
                title="Open paused sharing route"
              >
                Share photo
              </button>
            )}
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
            className="seasonal-border"
            style={{
              filter: moodImageFilter[mood] || "none",
            }}
          />
        </div>
      </div>
     )}

      {sharingEnabled && showShareModal && (
        <ShareModal
          photo={shareTarget?.type === "collection" ? null : shareTarget}
          album={shareTarget?.type === "collection" ? shareTarget : null}
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
          defaultMood={mood || "mood-soft-dawn"}
        />
      )}

    </>
  );
};

export default PhotoGallery;
