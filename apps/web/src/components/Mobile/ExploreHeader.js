import React from "react";
import { Link } from "react-router-dom";
import { SHARE_FEATURE_ENABLED } from "../../config";
import "../../styles/mobile.css";

export default function ExploreHeader({ time, reflection }) {
  return (
    <section className="explore-section">
      <h1 className="explore-title">Explore</h1>

      {SHARE_FEATURE_ENABLED ? (
        <Link to="/share-start" className="explore-share-link" aria-label="Open Share Album landing page">
          Share Album
        </Link>
      ) : (
        <Link to="/share/test-403" className="explore-share-link explore-share-link-preview" aria-label="Open Share Album route">
          Share Album
        </Link>
      )}

      <div className="explore-metadata">
        <span>{time}</span>
        <span>•</span>
        <span>BST</span>
      </div>

      {reflection && (
        <p className="explore-reflection">{reflection}</p>
      )}
    </section>
  );
}
