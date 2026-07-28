import { useEffect, useState } from "react";
import "./BackgroundCarousel.css";
import { fetchFromApi } from "../api";

const VEIL_CLASS_MAP = {
  on: "veil-on",
  lift: "veil-lift",
  off: "veil-off",
};

const MOOD_CLASS_MAP = {
  sunny: "mood-sunny",
  clear: "mood-sunny",
  cloudy: "mood-cloudy",
  rain: "mood-rain",
  storm: "mood-storm",
  mist: "mood-mist",
  snow: "mood-snow",
  neutral: "mood-neutral",
  unknown: "mood-neutral",
};

// ------------------------------------------------------------
// BACKEND RANDOMIZER (Express + Cloudinary Search API)
// ------------------------------------------------------------

async function getRandomFromServer(folder) {
  try {
    const res = await fetchFromApi(
      `/random-image?folder=${encodeURIComponent(folder)}`
    );

    if (!res.ok) {
      console.warn(`Randomizer request failed with status ${res.status}.`);
      return null;
    }

    const data = await res.json();
    return data.url || null;
  } catch (err) {
    console.error("Randomizer backend error:", err);
    return null;
  }
}


export default function BackgroundCarousel({
  veilMode,
  weatherMood,
  season,
}) {
  const [deepLayer, setDeepLayer] = useState(null);

  // ------------------------------------------------------------
  // Load the dedicated Cloudinary constellations collection.
  // ------------------------------------------------------------
  useEffect(() => {
    async function loadLayers() {
      const deep = await getRandomFromServer("constellations");

      setDeepLayer(deep);
    }

    loadLayers();
  }, [season, weatherMood]);

  const veilClassName = VEIL_CLASS_MAP[veilMode] || VEIL_CLASS_MAP.on;
  const moodClassName = MOOD_CLASS_MAP[weatherMood] || MOOD_CLASS_MAP.neutral;
  const seasonClassName = season ? `season-${season}` : "";

  return (
    <div className={`background-carousel has-constellations ${veilClassName} ${moodClassName} ${seasonClassName}`}>


    <div className="seasonal-drift" />

    {/* Primary Cloudinary constellations carousel layer */}
    {deepLayer && (
      <div
        className={`constellations-image loaded veil-${veilMode}`}
        style={{ backgroundImage: `url(${deepLayer})` }}
      />
    )}

    {weatherMood === "rain" && <div className="rain-layer" />}
    {weatherMood === "snow" && <div className="snow-layer" />}
    {weatherMood === "mist" && <div className="mist-layer" />}
    {weatherMood === "storm" && <div className="lightning-flash" />}
    {season === "autumn" && <div className="embers" />}

  </div>
);
}
