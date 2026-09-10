import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PortalTime from "./PortalTime";
import { BIRTHDAY_DAY, BIRTHDAY_MONTH } from "../data/birthdayExperience";
import { buildSpecialDateLinks, defaultSpecialDates } from "../data/specialDates";
import { SHARE_FEATURE_ENABLED } from "../config";
import "./MiniOrbMenu.css";

export default function MiniOrbMenu({
  testSeason,
  setTestSeason,
  showTestLogo,
  setShowTestLogo,
  showR,
  setShowR,
  veilMode,
  setVeilMode,
  starDensity,
  setStarDensity,
}) {
  const [open, setOpen] = useState(false);
  const [radialOpen, setRadialOpen] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const currentYear = new Date().getFullYear();
  const todayIso = new Date().toISOString().slice(0, 10);
  const birthdayIso = `${currentYear}-${String(BIRTHDAY_MONTH).padStart(2, "0")}-${String(BIRTHDAY_DAY).padStart(2, "0")}`;
  const specialDateLinks = useMemo(() => {
    let customDates = [];
    try {
      const parsed = JSON.parse(window.localStorage.getItem("rilcSpecialDates") || "[]");
      if (Array.isArray(parsed)) customDates = parsed;
    } catch {
      customDates = [];
    }
    return buildSpecialDateLinks(currentYear, [...defaultSpecialDates, ...customDates]);
  }, [currentYear]);

  const closeMenu = () => setOpen(false);

  // 1. Seasonal tint colours
  const seasonTint = {
    spring: "rgba(255, 180, 220, 0.55)",
    summer: "rgba(140, 200, 255, 0.55)",
    autumn: "rgba(255, 180, 120, 0.55)",
    winter: "rgba(200, 220, 255, 0.55)",
  };
  const activeTint = seasonTint[testSeason] || "rgba(190, 205, 255, 0.72)";

  // 4. Orb memory — restore last season on mount
  useEffect(() => {
    const saved = window.localStorage.getItem("miniOrbSeason");
    if (saved && ["spring", "summer", "autumn", "winter"].includes(saved)) {
      setTestSeason(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 4. Orb memory — persist when season changes
  useEffect(() => {
    if (testSeason) {
      window.localStorage.setItem("miniOrbSeason", testSeason);
    }
  }, [testSeason]);

  // 1. Sleep / wake logic (idle timer)
  useEffect(() => {
    let timer = setTimeout(() => setIsSleeping(true), 8000);
    const wake = () => {
      setIsSleeping(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIsSleeping(true), 8000);
    };

    window.addEventListener("mousemove", wake);
    window.addEventListener("mousedown", wake);
    window.addEventListener("touchstart", wake);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("mousedown", wake);
      window.removeEventListener("touchstart", wake);
    };
  }, []);

  // 6. Heartbeat sync — listen for main-orb heartbeat events
  useEffect(() => {
    const handler = () => {
      const orb = document.querySelector(".mini-orb");
      if (!orb) return;
      orb.classList.add("heartbeat");
      setTimeout(() => orb.classList.remove("heartbeat"), 500);
    };

    window.addEventListener("main-orb-heartbeat", handler);
    return () => window.removeEventListener("main-orb-heartbeat", handler);
  }, []);

  // 2. Star density cycle (prop-driven)
  const cycleStarDensity = () => {
    setStarDensity((prev) =>
      prev === "low" ? "normal" : prev === "normal" ? "high" : "low"
    );
  };

  // Veil cycle: off → on → lift → off
  const cycleVeil = () => {
    setVeilMode((prev) =>
      prev === "off" ? "on" : prev === "on" ? "lift" : "off"
    );
  };

  const veilLabel = {
    off: "Veil: Off",
    on: "Veil: On",
    lift: "Veil: Lifted",
  }[veilMode] || "Veil: Off";

  // 3. Seasonal moon paths — just expose season to CSS
  const moonSeason = testSeason || "spring";

  // 5. Breathing animation — class when idle & closed
  const breathingClass = !open ? "breathing" : "";

  // Long‑press radial menu
  let pressTimer;
  const startPress = () => {
    pressTimer = setTimeout(() => setRadialOpen(true), 450);
  };
  const endPress = () => {
    clearTimeout(pressTimer);
  };

  // Cycle season
  const cycleSeason = () => {
    const order = ["spring", "summer", "autumn", "winter"];
    const next = order[(order.indexOf(testSeason) + 1) % order.length];
    setTestSeason(next);

    const orb = document.querySelector(".mini-orb");
    if (orb) {
      orb.classList.add("dawn-wake");
      setTimeout(() => orb.classList.remove("dawn-wake"), 1200);
    }
  };

  return (
    <div
      className="mini-orb-wrapper"
      data-star-density={starDensity}
    >
      {/* Seasonal particle drift */}
      <div
        className="mini-orb-particles"
        style={{ "--orb-tint": activeTint }}
      />

      {/* Orbiting moon (seasonal path via data attribute) */}
      <div
        className="mini-orb-moon"
        data-season={moonSeason}
        style={{ "--orb-tint": activeTint }}
      />

      {/* Micro-weather */}
      <div
        className="mini-orb-weather"
        data-season={testSeason}
      />

      {/* Main mini orb */}
      <button
        type="button"
        aria-label="Explore menu"
        aria-expanded={open}
        className={`mini-orb ${open ? "open" : ""} ${breathingClass} ${
          isSleeping ? "sleep" : ""
        }`}
        style={{ "--orb-tint": activeTint }}
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
        onClick={() => {
          setOpen(!open);
          setRadialOpen(false);
          setIsSleeping(false);
        }}
      >
        <span className="mini-orb-label">Explore</span>
      </button>

      {/* Long‑press radial menu */}
      {radialOpen && (
        <div className="radial-menu">
          <button onClick={cycleSeason}>Season</button>
          <button onClick={cycleStarDensity}>Stars</button>
          <button onClick={() => setShowTestLogo(!showTestLogo)}>Logo</button>
          <button onClick={() => setShowR(!showR)}>R</button>
        </div>
      )}

      {/* Drop‑down menu */}
      {open && (
        <div className="mini-orb-menu">
          <PortalTime compact />
          <Link to={`/day/${todayIso}`} className="mini-menu-link mini-menu-primary" onClick={closeMenu}>Open Today</Link>
          {SHARE_FEATURE_ENABLED ? (
            <Link to="/share-start" className="mini-menu-link mini-menu-primary" onClick={closeMenu}>Share Album</Link>
          ) : (
            <Link to="/share/test-403" className="mini-menu-link mini-menu-primary mini-menu-preview" onClick={closeMenu}>
              Share Album
            </Link>
          )}

          <div className="mini-menu-section">Navigate</div>
          <a href="/#scene-sky" className="mini-menu-link" onClick={closeMenu}>Home</a>
          <a href="/#scene-reflection" className="mini-menu-link" onClick={closeMenu}>Reflection</a>
          <a href="/#scene-weather" className="mini-menu-link" onClick={closeMenu}>Weather</a>
          <a href="/#scene-calendar" className="mini-menu-link" onClick={closeMenu}>Calendar</a>
          <a href="/#scene-drawer" className="mini-menu-link" onClick={closeMenu}>Reflection Drawer</a>
          <Link to={`/day/${birthdayIso}`} className="mini-menu-link" onClick={closeMenu}>Your Birthday</Link>

          <div className="mini-menu-section">Special Dates</div>
          {specialDateLinks.map((specialDate) => (
            <Link key={specialDate.id} to={`/day/${specialDate.isoDate}`} className="mini-menu-link" onClick={closeMenu}>
              {specialDate.label}
            </Link>
          ))}
          <a href="/#scene-footer" className="mini-menu-link" onClick={closeMenu}>Contact</a>

          <div className="mini-menu-section">Atmosphere</div>
          <button onClick={cycleSeason}>
            Season: {testSeason || "auto"}
          </button>

          <button onClick={cycleStarDensity}>
            Stars: {starDensity}
          </button>

          <button onClick={cycleVeil} className={`veil-toggle veil-state-${veilMode}`}>
            {veilLabel}
          </button>

          <button onClick={() => setShowTestLogo(!showTestLogo)}>
            {showTestLogo ? "Hide Logo" : "Show Logo"}
          </button>

          <button onClick={() => setShowR(!showR)}>
            {showR ? "Hide R" : "Show R"}
          </button>
        </div>
      )}
    </div>
  );
}
