import React from "react";
import "./GlobalFooter.css";

const externalProps = {
  target: "_blank",
  rel: "noopener noreferrer",
};

export default function GlobalFooter() {
  return (
    <footer className="global-footer" id="scene-footer">
      <div className="global-footer__inner">
        <p className="global-footer__title">Reflections-In-Light-Constellations</p>
        <p className="global-footer__family">© 2026 Reflections Family</p>

        <address className="global-footer__contact">
          <span>Contact:</span>{" "}
          <a href="mailto:info@-house.co.uk">info@-house.co.uk</a>
          <span aria-hidden="true"> · </span>
          <a href="https://seasonal.studio/studio/work-with-me" {...externalProps}>
            Send a message
          </a>
        </address>

        <nav className="global-footer__links" aria-label="Legal and family links">
          <a href="https://boutique-house-production-751b.up.railway.app/legal/privacy/" {...externalProps}>
            Privacy Policy
          </a>
          <span aria-hidden="true">·</span>
          <a href="https://boutique-house-production-751b.up.railway.app/legal/terms/" {...externalProps}>
            Terms &amp; Conditions
          </a>
        </nav>

        <p className="global-footer__colophon">
          © 2026 Reflections in Light: Part of the Reflections in Light Family and part of the{" "}
          <a href="https://soliv1.github.io/moodsboard-reflections-family/#/" {...externalProps}>
            Cinematic Moods Board Family
          </a>
          <span aria-hidden="true"> · </span>
          <a href="https://seasonal.studio/" {...externalProps}>
            Visit the home website: seasonal.studio (KUK)
          </a>
          <span aria-hidden="true"> · </span>
          Worcestershire
        </p>
      </div>
    </footer>
  );
}
