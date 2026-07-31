/**
 * ShareModal Component
 * Modal for creating share links - opens when user clicks "Share" button
 */

import { useEffect, useState } from 'react';
import { fetchFromApi } from '../api';
import './ShareModal.css';

export default function ShareModal({ 
  photo, 
  album, 
  onClose, 
  onShare,
  defaultMood = 'mood-soft-dawn',
  seasons = ['spring', 'summer', 'autumn', 'winter']
}) {
  const [shareType, setShareType] = useState('public'); // Internal value remains 'public' for API compatibility.
  const [friendEmails, setFriendEmails] = useState('');
  const [password, setPassword] = useState('');
  const [passwordHint, setPasswordHint] = useState('');
  const [allowDownload, setAllowDownload] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [hideExif, setHideExif] = useState(false);
  const [selectedMood, setSelectedMood] = useState(defaultMood);
  const [selectedSeason, setSelectedSeason] = useState('year-round');
  const [caption, setCaption] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [shareMode, setShareMode] = useState(null);
  const [showA11yToast, setShowA11yToast] = useState(false);
  const [shareEvidence, setShareEvidence] = useState(null);
  const [copied, setCopied] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [inviteCapabilities, setInviteCapabilities] = useState({
    invitesEnabled: false,
    maxRecipientEmails: 25,
    loading: true,
  });

  const modeMeta = {
    public: {
      color: '#7FD6D6',
      text: 'Private Share Link',
      description: 'Access is limited to people you share the link with.',
      successText: 'Your link is active.',
    },
    private: {
      color: '#C8CCD0',
      text: 'Private',
      description: 'Password required.',
      successText: 'Sent successfully.',
    },
    friends: {
      color: '#F4AFA0',
      text: 'Friends',
      description: 'Restricted to selected recipients.',
      successText: 'Delivered.',
    },
  };

  const currentMode = shareMode || (shareType === 'password' ? 'private' : shareType);
  const invitesEnabled = Boolean(inviteCapabilities.invitesEnabled);

  useEffect(() => {
    let mounted = true;

    async function loadCapabilities() {
      try {
        const response = await fetchFromApi('/api/share/capabilities');
        const data = await response.json();

        if (!mounted) {
          return;
        }

        setInviteCapabilities({
          invitesEnabled: Boolean(data?.capabilities?.invitesEnabled),
          maxRecipientEmails: Number(data?.capabilities?.maxRecipientEmails || 25),
          loading: false,
        });
      } catch {
        if (!mounted) {
          return;
        }

        setInviteCapabilities((prev) => ({
          ...prev,
          invitesEnabled: false,
          loading: false,
        }));
      }
    }

    loadCapabilities();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!invitesEnabled && shareType === 'friends') {
      setShareType('public');
    }
  }, [invitesEnabled, shareType]);

  function ModeIcon({ mode, animated = false }) {
    const className = animated ? 'share-mode-icon is-spinning' : 'share-mode-icon';

    if (mode === 'private') {
      return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="6" y="10" width="12" height="10" rx="2" stroke="#C8CCD0" strokeWidth="2" />
          <path d="M9 10V7a3 3 0 0 1 6 0v3" stroke="#C8CCD0" strokeWidth="2" />
        </svg>
      );
    }

    if (mode === 'friends') {
      return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 20s-6-4.5-6-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.5-6 9-6 9z"
            stroke="#F4AFA0"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      );
    }

    return (
      <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="#7FD6D6" strokeWidth="2" />
      </svg>
    );
  }

  const moods = [
    { id: 'mood-soft-dawn', label: 'Soft dawn', emoji: '🌅', color: '#E8D5B7' },
    { id: 'mood-quiet-morning', label: 'Quiet morning', emoji: '🌤️', color: '#B8C6DB' },
    { id: 'mood-celebration', label: 'Celebration', emoji: '🎉', color: '#F4A261' },
    { id: 'mood-soft-nostalgia', label: 'Soft nostalgia', emoji: '📸', color: '#A0826D' },
  ];

  const handleShare = async (e) => {
    e.preventDefault();
    const nextMode = shareType === 'password' ? 'private' : shareType;
    if (shareType === 'friends' && !invitesEnabled) {
      setSubmitError('Friends invite sending is disabled until email provider configuration is complete. Use Private Share Link for manual sharing.');
      return;
    }

    setShareMode(nextMode);
    setIsSending(true);
    setSubmitError('');
    const startedAt = Date.now();

    try {
      const payload = {
        photoId: photo?.id || null,
        albumId: album?.id || null,
        isPublic: shareType === 'public',
        password: shareType === 'password' ? password : null,
        passwordHint: shareType === 'password' ? passwordHint : null,
        recipientEmails: shareType === 'friends' ? friendEmails.split(',').map(e => e.trim()) : [],
        permissions: {
          allowDownload,
          allowComments,
          hideExif,
        },
        mood: selectedMood,
        season: selectedSeason,
        caption,
      };

      // Call parent handler (will integrate with API)
      const result = await onShare?.(payload);
      const shareUrl = result?.shareUrl;

      if (!shareUrl) {
        throw new Error('Share created but no link was returned. Please retry.');
      }

      const elapsed = Date.now() - startedAt;
      const minSpinnerMs = nextMode === 'friends' ? 4000 : 1200;
      if (elapsed < minSpinnerMs) {
        await new Promise((resolve) => setTimeout(resolve, minSpinnerMs - elapsed));
      }

      setIsSending(false);
      setShowA11yToast(true);
      setCopied(false);
      setShareEvidence({
        shareUrl,
        privacyStatus: result?.privacyStatus || null,
        invitation: result?.invitation || null,
      });

      setTimeout(() => setShowA11yToast(false), 4000);
    } catch (error) {
      console.error('Error sharing:', error);
      setIsSending(false);
      setSubmitError(error?.message || 'Failed to create share link');
    }
  };

  async function copyShareUrl() {
    if (!shareEvidence?.shareUrl) {
      return;
    }

    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareEvidence.shareUrl);
      setCopied(true);
    }
  }

  return (
    <div className="share-modal-overlay" onClick={isSending ? undefined : onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="share-modal-header">
          <h2>Share this moment</h2>
          <p className="share-modal-subtitle">Choose how you'd like to invite others in</p>
          <button className="share-modal-close" onClick={onClose} disabled={isSending}>✕</button>
        </div>

        <form onSubmit={handleShare} className="share-modal-form">
          {/* Share Type Selection */}
          <section className="share-section">
            <h3>How would you like to share?</h3>
            <div className="share-options">
              <label className="share-option">
                <input
                  type="radio"
                  value="public"
                  checked={shareType === 'public'}
                  onChange={(e) => setShareType(e.target.value)}
                />
                <div className="share-option-content">
                  <strong>Private Share Link</strong>
                  <span>Create a private link and share it only with people you trust</span>
                </div>
              </label>

              <label className="share-option">
                <input
                  type="radio"
                  value="friends"
                  checked={shareType === 'friends'}
                  disabled={!invitesEnabled}
                  onChange={(e) => setShareType(e.target.value)}
                />
                <div className={`share-option-content ${!invitesEnabled ? 'share-option-content-disabled' : ''}`}>
                  <strong>Share with friends</strong>
                  <span>Only invited friends can view (email provider required)</span>
                </div>
              </label>

              <label className="share-option">
                <input
                  type="radio"
                  value="password"
                  checked={shareType === 'password'}
                  onChange={(e) => setShareType(e.target.value)}
                />
                <div className="share-option-content">
                  <strong>Password protected</strong>
                  <span>Secure link with optional password</span>
                </div>
              </label>
            </div>
            {!invitesEnabled && !inviteCapabilities.loading && (
              <p className="share-mode-note" role="status" aria-live="polite">
                Friend invites are currently disabled. Use Private Share Link to copy and share manually.
              </p>
            )}
          </section>

          {/* Friends Email Input */}
          {shareType === 'friends' && (
            <section className="share-section">
              <label htmlFor="friend-emails">
                Friends' emails
                <span className="share-help">Separate with commas</span>
              </label>
              <input
                id="friend-emails"
                type="text"
                placeholder="alice@example.com, bob@example.com"
                value={friendEmails}
                onChange={(e) => setFriendEmails(e.target.value)}
                className="share-input"
                maxLength={Math.max(200, inviteCapabilities.maxRecipientEmails * 36)}
              />
              <span className="share-help">Maximum recipients per send: {inviteCapabilities.maxRecipientEmails}</span>
            </section>
          )}

          {/* Password Protection */}
          {shareType === 'password' && (
            <section className="share-section">
              <label htmlFor="password">
                Password
                <span className="share-help">Optional - leave blank for link-only access</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="share-input"
              />
              <label htmlFor="password-hint" style={{ marginTop: '12px' }}>
                Password hint
                <span className="share-help">Optional - visible to viewers</span>
              </label>
              <input
                id="password-hint"
                type="text"
                placeholder="Hint for the password"
                value={passwordHint}
                onChange={(e) => setPasswordHint(e.target.value)}
                className="share-input"
              />
            </section>
          )}

          {/* Permissions */}
          <section className="share-section">
            <h3>Permissions</h3>
            <div className="share-toggles">
              <label className="share-toggle">
                <input
                  type="checkbox"
                  checked={allowDownload}
                  onChange={(e) => setAllowDownload(e.target.checked)}
                />
                <span>Allow downloads</span>
              </label>

              <label className="share-toggle">
                <input
                  type="checkbox"
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                />
                <span>Allow comments & reactions</span>
              </label>

              <label className="share-toggle">
                <input
                  type="checkbox"
                  checked={hideExif}
                  onChange={(e) => setHideExif(e.target.checked)}
                />
                <span>Hide camera details (EXIF)</span>
              </label>
            </div>
          </section>

          {/* Mood & Presentation */}
          <section className="share-section">
            <h3>Set the mood</h3>
            <div className="mood-selector">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  className={`mood-chip ${selectedMood === mood.id ? 'active' : ''}`}
                  style={{
                    borderColor: mood.color,
                    backgroundColor: selectedMood === mood.id ? mood.color + '15' : 'transparent',
                  }}
                  onClick={() => setSelectedMood(mood.id)}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <span className="mood-label">{mood.label}</span>
                </button>
              ))}
            </div>

            <label htmlFor="season" style={{ marginTop: '16px' }}>
              Seasonal tint
            </label>
            <select
              id="season"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="share-select"
            >
              <option value="year-round">Year-round</option>
              {seasons.map((seasonName) => (
                <option key={seasonName} value={seasonName}>
                  {seasonName.charAt(0).toUpperCase() + seasonName.slice(1)}
                </option>
              ))}
            </select>
          </section>

          {/* Caption */}
          <section className="share-section">
            <label htmlFor="caption">
              Add a gentle caption
              <span className="share-help">Optional - appears above photos</span>
            </label>
            <textarea
              id="caption"
              placeholder="A few words about this moment..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={200}
              className="share-textarea"
              rows={3}
            />
            <span className="share-count">{caption.length}/200</span>
          </section>

          {/* Footer */}
          <p className="share-privacy-note" role="note" aria-live="polite">
            Recipient emails stay private and are never shown on the shared page.
          </p>

          {isSending && (
            <p className="share-progress" role="status" aria-live="polite">
              <ModeIcon mode={currentMode} animated />
              Creating your share link...
            </p>
          )}

          {submitError && (
            <p className="share-submit-error" role="alert">
              {submitError}
            </p>
          )}

          <div className="share-modal-footer">
            <button
              type="button"
              className="share-button-secondary"
              onClick={onClose}
              disabled={isSending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="share-button-primary"
              disabled={isSending}
            >
              {isSending ? 'Creating link...' : 'Create share link'}
            </button>
          </div>

          {shareEvidence?.shareUrl && (
            <section className="share-evidence" aria-live="polite">
              <h3>Share link ready</h3>
              <p className="share-evidence-help">Share this URL directly in message, email, or chat.</p>
              <input
                className="share-evidence-input"
                value={shareEvidence.shareUrl}
                readOnly
                onFocus={(event) => event.target.select()}
                aria-label="Generated share URL"
              />
              <div className="share-evidence-actions">
                <button type="button" className="share-button-secondary" onClick={copyShareUrl}>
                  {copied ? 'Copied' : 'Copy link'}
                </button>
                <a className="share-evidence-open" href={shareEvidence.shareUrl} target="_blank" rel="noreferrer">
                  Open link
                </a>
              </div>
              <p className="share-evidence-meta">
                Mode: {shareEvidence.privacyStatus?.mode || currentMode}. Recipient emails stay private.
              </p>
              {shareEvidence.invitation?.summary?.skipped > 0 && (
                <p className="share-evidence-meta">
                  Emails were not sent because the email provider is not configured yet.
                </p>
              )}
            </section>
          )}
        </form>
      </div>

      {showA11yToast && (
        <div
          className="share-a11y-toast"
          role="status"
          aria-live="assertive"
          style={{ '--mode-color': modeMeta[currentMode].color }}
        >
          Your gallery link has been sent.
        </div>
      )}
    </div>
  );
}
