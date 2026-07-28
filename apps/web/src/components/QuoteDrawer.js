
export default function QuoteDrawer({ quote, orbColor, onClose }) {
  if (!quote) return null;
  const orbRGB = orbColor.replace("rgb(", "").replace(")", "");

  return (
    <div
      className="short-reflections-drawer quote-drawer-content"
      style={{ "--orbColor": orbColor, "--orbColorRGB": orbRGB }}
    >
      <button className="drawer-close-btn" onClick={onClose} aria-label="Close quote drawer">×</button>
      <button className="drawer-close-text" onClick={onClose}>Close</button>
      <h3 className="drawer-eyebrow">Quote of the Day</h3>
      <p className="drawer-quote">“{quote.quote}”</p>
      <p className="drawer-author">~ {quote.person} ~</p>
    </div>
  );
}
