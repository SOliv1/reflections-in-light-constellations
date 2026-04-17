
import { toRgbChannels } from "../utils/color";

export default function QuoteDrawer({ quote, orbColor, onClose = () => {}, children }) {
  const orbRGB = toRgbChannels(orbColor);

  return (
    <div className="quote-drawer-content">
      <div
        className="short-reflections-drawer"
        style={{
          '--orbColor': orbColor,
          '--orbColorRGB': orbRGB
        }}
      >
        <button className="drawer-close-btn" onClick={onClose}>×</button>
        {children}

        <h3 className="drawer-eyebrow">Quote of the Day</h3>
        {quote ? (
          <>
            <p className="drawer-quote">“{quote.quote}”</p>
            <p className="drawer-author">~ {quote.person} ~</p>
          </>
        ) : (
          <p className="drawer-quote">Gathering today's quote...</p>
        )}
      </div>
    </div>
  );
}
