import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../components/Mobile/MobileLayout";
import { fetchFromApi } from "../api";
import { quotes } from "../data/quotes";
import "../styles/mobile-integration.css";

/**
 * MobileHomePage
 * ──────────────────────────────────────────────────────────────────────────
 * The mobile-first home experience for Reflections of Light.
 * Integrates real data from API and manages mobile navigation.
 *
 * Props passed from AppShell:
 * - weather data, time, photos, veil mode, season
 */

export default function MobileHomePage({
  weatherCondition,
  weatherMood,
  season,
  veilMode,
  photos
}) {
  const navigate = useNavigate();
  const [time, setTime] = useState("--:--");
  const [currentReflectionNum, setCurrentReflectionNum] = useState(1);
  const [weatherData, setWeatherData] = useState(null);
  const [quoteOfDay, setQuoteOfDay] = useState({ quote: "", person: "" });
  const [reflection, setReflection] = useState("");

  /* ──────────────────────────────────────────────────────────────────────
     Clock: Update time every second
  ────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    }

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ──────────────────────────────────────────────────────────────────────
     Weather: Load current weather data
  ────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetchFromApi("/api/weather");
        if (res.ok) {
          const data = await res.json();
          setWeatherData(data);
        }
      } catch (err) {
        console.error("Failed to load weather for mobile:", err);
      }
    }
    loadWeather();
  }, []);

  /* ──────────────────────────────────────────────────────────────────────
     Quote of the Day: Calculate based on current date
  ────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const today = new Date();
    const index = (today.getDate() - 1) % quotes.length;
    setQuoteOfDay(quotes[index] || { quote: "", person: "" });

    // Set atmospheric reflection
    const reflections = [
      "We are stardust reflecting the quiet order of the universe.",
      "Every moment is a chance to begin again.",
      "Light enters where the heart softens.",
      "In stillness, we find clarity.",
      "Your essence is luminous and eternal."
    ];
    const reflectionIndex = today.getDate() % reflections.length;
    setReflection(reflections[reflectionIndex]);
  }, []);

  /* ──────────────────────────────────────────────────────────────────────
     Handlers
  ────────────────────────────────────────────────────────────────────── */
  const handlePreviousReflection = () => {
    const newNum = currentReflectionNum === 1 ? 30 : currentReflectionNum - 1;
    setCurrentReflectionNum(newNum);
  };

  const handleNextReflection = () => {
    const newNum = currentReflectionNum === 30 ? 1 : currentReflectionNum + 1;
    setCurrentReflectionNum(newNum);
  };

  const handleSelectReflection = (num) => {
    setCurrentReflectionNum(num);
  };

  const handleToday = () => {
    const today = new Date();
    const isoDate = today.toISOString().split("T")[0];
    navigate(`/day/${isoDate}`);
  };

  const handleCategorySelect = (categoryId) => {
    // Route to drawer/category page based on ID
    switch (categoryId) {
      case "short-reflections":
        navigate("/reflections");
        break;
      case "quiet-actions":
        navigate("/actions");
        break;
      case "light-notes":
        navigate("/notes");
        break;
      case "quote-of-day":
        // Already visible, could scroll to quote section
        break;
      default:
        break;
    }
  };

  /* ──────────────────────────────────────────────────────────────────────
     Extract weather data for display
  ────────────────────────────────────────────────────────────────────── */
  const temperature = weatherData?.main?.temp?.toFixed(1) || 20.9;
  const weatherDescription = weatherData?.weather?.[0]?.description || "A quiet layer of overcast cloud";
  const location = weatherData?.name || "EVESHAM, GB";
  const glow = `A warm ${temperature} deg glow`;

  return (
    <MobileLayout
      time={time}
      reflection={reflection}
      temperature={parseFloat(temperature)}
      weatherDescription={weatherDescription}
      weatherGlow={glow}
      location={location}
      currentReflection={currentReflectionNum}
      quoteOfDay={quoteOfDay}
      onNavigatePrevious={handlePreviousReflection}
      onNavigateNext={handleNextReflection}
      onSelectReflection={handleSelectReflection}
      onToday={handleToday}
      onCategorySelect={handleCategorySelect}
    />
  );
}
