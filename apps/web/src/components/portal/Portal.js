import "./Portal.css";
import { useState } from "react";

export function Portal({
  dayIndex,
  season,
  mood,
  type,
  onClick,
  macroMood,
  setMood,
  cueText,
  portalState,
  children,
}) {
  const [showMoodMenu, setShowMoodMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const dayClass = dayIndex ? `portal--day-${dayIndex}` : "";
  const seasonClass = season ? `portal--season-${season}` : "";
  const moodClass = mood ? `portal--mood-${mood}` : "";
  const hoverClass = document.body.classList.contains("portal-hovering")
    ? "portal--hover"
    : "";

  const pulseClass =
    mood === "calm"
      ? "portal--pulse-slow"
      : mood === "reflective"
      ? "portal--pulse-medium"
      : "portal--pulse-fast";

  const typeClass = type ? `portal--${type}` : "";
  const glowClass = type === "mood" ? "portal--glow" : "";
  const awareClass = portalState === "aware" ? "portal--aware" : "";

  const classes = [
    "portal",
    typeClass,
    dayClass,
    seasonClass,
    moodClass,
    pulseClass,
    glowClass,
    awareClass,
    children && isExpanded ? "portal--expanded" : "",
    hoverClass,
    macroMood
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="portal-container">

      {/* ⭐ EXISTING MOOD ORB — now interactive */}
      <div
        className={`mood-orb ${showMoodMenu ? "open" : ""}`}
        onClick={() => setShowMoodMenu(!showMoodMenu)}
      ></div>

      {/* ⭐ RADIAL MOOD MENU */}
      {showMoodMenu && (
        <div className="mood-radial-menu">
          {["calm", "joyful", "stormy", "reflective", "natural"].map((m) => (
            <button
              key={m}
              className="mood-option"
              onClick={() => {
                setMood(m);
                setShowMoodMenu(false);
              }}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}

          {/* ⭐ RESET BUTTON IN CENTRE */}
          <button
            className="mood-reset"
            onClick={() => {
              setMood(null);
              setShowMoodMenu(false);
            }}
          >
            Reset
          </button>
        </div>
      )}

      {/* ⭐ PORTAL CORE */}
      <div
        className={classes}
        role={children ? "button" : undefined}
        tabIndex={children ? 0 : undefined}
        aria-label={children ? `${isExpanded ? "Collapse" : "Expand"} portal clock` : undefined}
        aria-expanded={children ? isExpanded : undefined}
        onClick={() => {
          if (children) setIsExpanded((expanded) => !expanded);
          if (type === "mood" && setMood) {
            setMood(mood);
          }
          if (onClick) onClick();
        }}
        onKeyDown={(event) => {
          if (!children || (event.key !== "Enter" && event.key !== " ")) return;
          event.preventDefault();
          setIsExpanded((expanded) => !expanded);
        }}
      >
        <div className="portal__core">
          <div className="portal__crescent"></div>
          <div className="portal__shimmer"></div>
          {children && <div className="portal__content">{children}</div>}
        </div>
      </div>

      {/* ⭐ CUE TEXT */}
      {cueText && (
        <div className="portal__cue">
          {cueText}
        </div>
      )}

      {/* ⭐ SUBTITLE */}
      {portalState === "aware" && (
        <div className="portal-subtitle">
          The Door begins the story
        </div>
      )}
    </div>
  );
}

export default Portal;
