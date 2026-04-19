import React from "react";
import "./Constellation.css";

// Determine season for moon phase
function getSeason() {
  const month = new Date().getMonth();
  if (month === 11 || month === 0 || month === 1) return "winter";
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
}

function Constellation({ veilMode, birthdayMode, starDensity = "normal" }) {
  const season = getSeason();

  // Determine moon phase by season
  const moonPhase = {
    winter: "full",
    spring: "new",
    summer: "crescent",
    autumn: "waning",
  }[season];

  return (
    <section
      className={`constellation-wrapper interactive active season-${season} veil-${veilMode || "off"} ${
        birthdayMode ? "birthday-mode" : ""
      }`}
      data-star-density={starDensity}
      aria-label="Night sky"
    >
      {/* Sky wash gradient */}
      <div className="constellation-skywash" aria-hidden="true"></div>

      {/* Moon */}
      <div className={`moon ${moonPhase}`} aria-hidden="true"></div>

      {/* Stars and planets */}
      <div className="constellation-container" aria-hidden="true">
        {/* Scattered background stars */}
        <div className="star" style={{ top: "16%", left: "12%" }}></div>
        <div className="star" style={{ top: "18%", left: "28%" }}></div>
        <div className="star" style={{ top: "17%", left: "45%" }}></div>
        <div className="star" style={{ top: "20%", left: "62%" }}></div>
        <div className="star" style={{ top: "22%", left: "78%" }}></div>
        <div className="star" style={{ top: "25%", left: "35%" }}></div>
        <div className="star" style={{ top: "28%", left: "70%" }}></div>

        {/* Shooting star */}
        <div className="shooting-star"></div>

        {/* Main constellation layer */}
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

        {/* Right constellation with connecting lines */}
        <div className="right-constellation">
          <span className="right-constellation-star right-constellation-star-1"></span>
          <span className="right-constellation-star right-constellation-star-2"></span>
          <span className="right-constellation-star right-constellation-star-3"></span>
          <span className="right-constellation-star right-constellation-star-4"></span>
          <span className="right-constellation-line right-constellation-line-1"></span>
          <span className="right-constellation-line right-constellation-line-2"></span>
          <span className="right-constellation-line right-constellation-line-3"></span>
        </div>

        {/* Left celestial accent */}
        <div className="left-celestial-accent">
          <span className="left-accent-star left-accent-star-1"></span>
          <span className="left-accent-star left-accent-star-2"></span>
          <span className="left-accent-star left-accent-star-3"></span>
        </div>

        {/* Planets — Venus, Pluto, Mars */}
        <div className="planet-venus" aria-hidden="true"></div>
        <div className="planet-pluto" aria-hidden="true"></div>
        <div className="planet-mars" aria-hidden="true"></div>

        {/* Cloud + particle drift layer */}
        <div className={`sky-cloud-layer season-${season}`} aria-hidden="true">
          <span className="sky-cloud sky-cloud-1"></span>
          <span className="sky-cloud sky-cloud-2"></span>
        </div>
        <div className={`sky-particles season-${season}`} aria-hidden="true"></div>

        {/* Birthday constellation overlay */}
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

            <div className="tiny-rocket">
              <span className="rocket-window"></span>
              <span className="rocket-flame"></span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Constellation;
