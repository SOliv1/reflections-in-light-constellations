import React, { useMemo, useState } from "react";
import "./Constellation.css";
import { getPatternForMoodAndSeason } from "../data/constellationPatterns";
//import Portal from "./portal/Portal";


// Determine season for moon phase
function getSeasonFromDate() {
  const month = new Date().getMonth();
  if (month === 11 || month === 0 || month === 1) return "winter";
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "spring";
}

function Constellation({
  veilMode,
  birthdayMode,
  weatherMood = "neutral",
  season: seasonProp,
  timeOfDay = "day",
  orbColor = "#8ab4f8",
  drawerOpen = false,
}) {
  const season = seasonProp || getSeasonFromDate();
  const [activeStarId, setActiveStarId] = useState(null);
  const pattern = useMemo(() => getPatternForMoodAndSeason(season, weatherMood), [season, weatherMood]);

  // Determine moon phase by season
  const moonPhase = {
    winter: "full",
    spring: "new",
    summer: "crescent",
    autumn: "waning",
  }[season];

  const brightnessClass = `time-${timeOfDay}`;

  return (
    <div
      className={`constellation-wrapper interactive active season-${season} mood-${weatherMood} ${brightnessClass} drawer-${
        drawerOpen ? "open" : "closed"
      } veil-${veilMode || "off"} ${
        birthdayMode ? "birthday-mode" : ""
      }`}
      style={{ "--constellation-orb-color": orbColor }}
    >
      <div className="constellation-skywash"></div>
      {/* Moon */}

      <div className={`moon ${moonPhase}`}></div>

      {/* Portal receives veilMode correctly
      <Portal
        type="mood"
        dayIndex={1}
        season={season}
        mood={null}
        cueText=""
        veilMode={veilMode}
      /> */}

      {/* Veil overlay */}


      {/* Stars */}
      <div className="constellation-container">
        {pattern.map((star, index) => (
          <button
            key={star.id}
            type="button"
            className={`star constellation-interactive-star ${activeStarId === star.id ? "is-active" : ""}`}
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${index * 0.24}s`,
            }}
            title={star.label}
            aria-label={star.label}
            onMouseEnter={() => setActiveStarId(star.id)}
            onMouseLeave={() => setActiveStarId(null)}
            onFocus={() => setActiveStarId(star.id)}
            onBlur={() => setActiveStarId(null)}
            onClick={() => setActiveStarId((current) => (current === star.id ? null : star.id))}
          >
            <span className="constellation-star-tooltip">{star.label}</span>
          </button>
        ))}
        <div className="star" style={{ top: "16%", left: "12%" }}></div>
        <div className="star" style={{ top: "18%", left: "28%" }}></div>
        <div className="star" style={{ top: "17%", left: "45%" }}></div>
        <div className="star" style={{ top: "20%", left: "62%" }}></div>
        <div className="star" style={{ top: "22%", left: "78%" }}></div>
        <div className="star" style={{ top: "25%", left: "35%" }}></div>
        <div className="star" style={{ top: "28%", left: "70%" }}></div>

        <div className="shooting-star"></div>

        <div className="constellation-layer">
          <span className="star star-1"></span>
          <span className="star star-2"></span>
          <span className="star star-3"></span>
          <span className="star star-4"></span>
          <span className="star star-5"></span>
          <span className="star star-6"></span>
          <span className="star star-7"></span>
          <span className="star star-8"></span>
          <span className="star star-9"></span>
          <span className="star star-10"></span>
          <span className="star star-11"></span>
          <span className="star star-12"></span>
          <span className="star star-13"></span>
          <span className="star star-14"></span>
          <span className="star star-15"></span>
        </div>

        <div className="right-constellation">
          <span className="right-constellation-star right-constellation-star-1"></span>
          <span className="right-constellation-star right-constellation-star-2"></span>
          <span className="right-constellation-star right-constellation-star-3"></span>
          <span className="right-constellation-star right-constellation-star-4"></span>
          <span className="right-constellation-line right-constellation-line-1"></span>
          <span className="right-constellation-line right-constellation-line-2"></span>
          <span className="right-constellation-line right-constellation-line-3"></span>
        </div>

        <div className="left-celestial-accent">
          <span className="left-accent-star left-accent-star-1"></span>
          <span className="left-accent-star left-accent-star-2"></span>
          <span className="left-accent-star left-accent-star-3"></span>
        </div>

        <div className="planet-venus"></div>
        <div className="planet-pluto"></div>
        <div className="planet-mars"></div>

        {/* Birthday constellation */}
        {birthdayMode && (
          <>
            <div className="cancer-constellation">
              <span className="cancer-star cancer-star-1"></span>
              <span className="cancer-star cancer-star-2"></span>
              <span className="cancer-star cancer-star-3"></span>
              <span className="cancer-star cancer-star-4"></span>
              <span className="cancer-star cancer-star-5"></span>
              <span className="cancer-star cancer-star-6"></span>

              <span className="cancer-line cancer-line-1"></span>
              <span className="cancer-line cancer-line-2"></span>
              <span className="cancer-line cancer-line-3"></span>
              <span className="cancer-line cancer-line-4"></span>
              <span className="cancer-line cancer-line-5"></span>
            </div>

            <div className="planet-saturn">
              <span className="planet-ring"></span>
            </div>

            <div className="planet-orbital"></div>

            <div className="tiny-rocket birthday-enhanced">
              <span className="rocket-window"></span>
              <span className="rocket-flame"></span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Constellation;
