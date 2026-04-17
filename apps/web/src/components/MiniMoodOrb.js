import "./MiniMoodOrb.css";

const MOOD_LABELS = {
  sunny: "Sunny clarity",
  clear: "Clear light",
  cloudy: "Cloudy calm",
  rain: "Rainy renewal",
  storm: "Storm energy",
  snow: "Snow stillness",
  mist: "Misty hush",
  neutral: "Balanced light",
  unknown: "Unknown sky",
};

export default function MiniMoodOrb({
  orbColor = "#8ab4f8",
  weatherMood = "neutral",
  season = "spring",
  timeOfDay = "day",
  veilMode = "off",
  mode = "architectural",
  highlighted = false,
  onClick,
  className = "",
  title,
}) {
  const resolvedMood = MOOD_LABELS[weatherMood] || MOOD_LABELS.unknown;
  const resolvedTitle =
    title ||
    `${resolvedMood} · ${season} · ${timeOfDay}${highlighted ? " · drawer active" : ""}`;

  return (
    <button
      type="button"
      className={`mini-mood-orb mini-mood-orb--${season} mini-mood-orb--${timeOfDay} mini-mood-orb--${mode} mini-mood-orb--veil-${veilMode} ${
        highlighted ? "is-highlighted" : ""
      } ${className}`.trim()}
      title={resolvedTitle}
      aria-label={resolvedTitle}
      onClick={onClick}
      style={{ "--mini-orb-color": orbColor }}
    >
      <span className="mini-mood-orb__core" />
      <span className={`mini-mood-orb__ring mini-mood-orb__ring--${weatherMood}`} />
    </button>
  );
}
