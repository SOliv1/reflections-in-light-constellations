import React from "react";
import { Link } from "react-router-dom";
import "../../styles/mobile.css";

export default function ExploreHeader({ time, reflection }) {
  return (
    <section className="explore-section">
      <h1 className="explore-title">Explore</h1>

      <Link to="/share-start" className="explore-share-link" aria-label="Open Share Album landing page">
        Share Album
      </Link>

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
