// src/components/CosmicQuotePanel.js
//import { useMemo, useEffect } from "react";
import React from "react";
import "./CosmicQuotePanel.css"; // ✅ use a matching CSS file name

const CosmicQuotePanel = ({ season, mood, veilMode }) => {
  const cosmicQuote = "We are stardust reflecting the quiet order of the universe.";
  const seasonClass = `season-${season || "neutral"}`;
  const moodClass = `mood-${mood || "neutral"}`;
  const veilClass = `quote-veil-${veilMode || "off"}`;

  return (
    <div className={`cosmic-quote-panel ${seasonClass} ${moodClass} ${veilClass}`}>
      <p className="cosmic-quote-text">
        {cosmicQuote}
      </p>
    </div>

  );
};

export default CosmicQuotePanel;








/*const VEIL_CLASS_MAP = {
  on: "veil-on",
  lift: "veil-lift",
  off: "veil-off",
};

export default function CosmicQuote({
  veilMode = "off",
  weatherMood = "neutral",
  onQuoteReady,
  testDay      // ⭐ ADD THIS
}) {
  const veilClassName = VEIL_CLASS_MAP[veilMode] || "veil-off";

  const quoteOfTheDay = useMemo(() => {

    const today = new Date();
    const index = (today.getDate() - 1) % quotes.length;
    return quotes[index];
  }, []);

  // ⭐ FIXED: useEffect now works because:
  // - useEffect is imported
  // - onQuoteReady exists in props
  useEffect(() => {
    if (onQuoteReady && quoteOfTheDay) {
      onQuoteReady(quoteOfTheDay);
    }
  }, [onQuoteReady, quoteOfTheDay]);

  return (
    <div className="quote-container">
      <figure
        className={`daily-quote whisper ${veilClassName} mood-${weatherMood || "neutral"}`}
        aria-label="Daily quote"
      >
        <blockquote className="quote-text">
          <span className="quote-mark">"</span>
          {quoteOfTheDay.quote}
          <span className="quote-mark">"</span>
        </blockquote>

        <figcaption className="quote-person">
          By {quoteOfTheDay.person}
        </figcaption>
      </figure>
    </div>
  );
}*/
