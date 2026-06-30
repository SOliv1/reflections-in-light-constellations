import React from "react";
import "../../styles/mobile.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mobile-footer">
      <div className="footer-divider" />
      <p>Daily Orb Reflections</p>
      <p>
        <a href="#contact">Contact</a>
        {" • "}
        <a href="#privacy">Privacy</a>
      </p>
      <p>© {currentYear} All rights reserved.</p>
      <p>
        <a href="#website">Website</a>
      </p>
    </footer>
  );
}
