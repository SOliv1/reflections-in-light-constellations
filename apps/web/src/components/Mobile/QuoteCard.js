import React from "react";
import "../../styles/mobile.css";

export default function QuoteCard({ quote, author }) {
  if (!quote) return null;

  return (
    <div className="quote-card">
      <p className="quote-text">
        <span className="quote-mark">"</span>
        {quote}
        <span className="quote-mark">"</span>
      </p>
      {author && (
        <p className="quote-attribution">— {author}</p>
      )}
    </div>
  );
}
