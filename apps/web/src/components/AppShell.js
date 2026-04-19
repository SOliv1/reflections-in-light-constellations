import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";

import BackgroundCarousel from "./BackgroundCarousel";
import Calendar from "./Calendar";
import Constellation from "./Constellation";
import Portal from "./portal/Portal";
import DrawerUnified from "./DrawerUnified/DrawerUnified";
import Veil from "./Veil/Veil";

import { fetchFromApi } from "../api";
import { BIRTHDAY_DAY, BIRTHDAY_MONTH } from "../data/birthdayExperience";
import useWeatherPhotos from "../hooks/useWeatherPhotos";

import DayPage from "../pages/DayPage";

import springSeasonal from "../assets/logos/springSeasonalLogo.png";
import reflectionsMarkLogo from "../assets/logos/reflectionsMarkLogo.png";
import moodLogo from "../assets/logos/moodLogo.png";
import moodOrbBlue from "../assets/logos/moodOrbBlue.png";
import moodOrbPink from "../assets/logos/moodOrbPink.png";
import moodOrb from "../assets/logos/moodOrb.png";
import { getSeasonalLogo } from "../logoSeasonal";
import {
  normalizeWeatherClass,
  normalizeWeatherEntry,
} from "../utils/weatherHelpers";

// veilMode and starDensity are now lifted to App.js and passed as props
export default function AppShell({ testSeason, showTestLogo, showR, veilMode = "off", starDensity = "normal" }) {

  /* ---------------- MODE + UI STATE ---------------- */
  const [photos, setPhotos] = useState([]);
  const [autoVeil] = useState(false);

  // Seasonal logo mapping — orb variants by season
  const seasonalLogos = {
    spring: moodOrbPink,
    summer: moodOrbBlue,
    autumn: moodLogo,
    winter: springSeasonal,
  };

  // Default logo is moodLogo; showTestLogo swaps to seasonal variant
  const activeSeasonal = testSeason ? seasonalLogos[testSeason] : getSeasonalLogo();
  const defaultLogo = moodOrb; // base orb shown when showTestLogo is off
  const activeLogo = showTestLogo ? activeSeasonal : defaultLogo;

  /* ---------------- ROUTER + BIRTHDAY ---------------- */
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const birthdayMatch = location.pathname.match(/^\/day\/(\d{4})-(\d{2})-(\d{2})$/);
  const isBirthdayScene = birthdayMatch
    ? Number(birthdayMatch[2]) === BIRTHDAY_MONTH &&
      Number(birthdayMatch[3]) === BIRTHDAY_DAY
    : false;

  /* ---------------- WEATHER + GALLERY ---------------- */
  const [weatherCondition, setWeatherCondition] = useState(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetchFromApi("/api/gallery");
        const data = await res.json();
        const urls = Array.isArray(data)
          ? data
              .map((item) => item?.photoUrl || item?.imageUrl || item?.url)
              .filter(Boolean)
          : [];
        setPhotos(urls);
      } catch {
        setPhotos([]);
      }
    }
    loadGallery();
  }, []);

  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetchFromApi("/api/weather");
        const data = await res.json();
        const primary = data.weather?.[0] || {};
        setWeatherCondition(normalizeWeatherEntry(primary));
      } catch {
        setWeatherCondition(normalizeWeatherClass("unknown"));
      }
    }
    loadWeather();
  }, []);

  /* ---------------- SCROLL LISTENER ---------------- */
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty("--scroll", window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- TIME + SEASON ---------------- */
  const hour = new Date().getHours();
  let timeOfDay = "day";
  if (hour >= 19 || hour < 5) timeOfDay = "night";
  else if (hour >= 17) timeOfDay = "evening";

  const month = new Date().getMonth();
  const calendarSeason =
    month === 11 || month <= 1
      ? "winter"
      : month >= 2 && month <= 4
        ? "spring"
        : month >= 5 && month <= 7
          ? "summer"
          : "autumn";

  // testSeason from MiniOrbMenu overrides the calendar season
  const season = testSeason || calendarSeason;

  const isNight = hour < 6 || hour >= 18;
  const backgroundImage = useWeatherPhotos(isHomePage);
  const weatherMood = weatherCondition || "neutral";

  /* ---------------- DRAWERS ---------------- */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mode = "architectural"; // default display mode

  /* ---------------- RENDER ---------------- */
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            {/* Midnight veil — fixed overlay, subtle depth layer behind sky */}
            <Veil
              moodColor={weatherMood}
              state={veilMode}
              season={season}
              autoVeil={autoVeil}
            />

            {/* Sky wrapper — constellation + portal */}
            <div className="sky-wrapper">
              <Constellation
                veilMode={veilMode}
                birthdayMode={isBirthdayScene}
                starDensity={starDensity}
              />
              <Portal
                type="mood"
                dayIndex={1}
                season={season}
                mood={weatherMood}
                cueText=""
                weatherMood={weatherMood}
              />
            </div>

            {/* Main app shell */}
            <div className={`App mode-${mode} time-${timeOfDay} season-${season}`}>
              {/* Home logo (top-left) — Link back to home */}
              <Link to="/" className="app-home-logo" aria-label="Return home">
                <div className="orb-base">
                  <img
                    src={activeLogo}
                    className="orb-tint"
                    alt="Mood orb logo"
                  />
                  {showR && (
                    <img
                      src={reflectionsMarkLogo}
                      className="orb-mark"
                      alt="Reflections mark"
                    />
                  )}
                </div>
              </Link>

              {/* Background photo carousel */}
              <BackgroundCarousel
                photos={photos}
                veilMode={veilMode}
                weatherImage={backgroundImage}
                weatherMood={weatherMood}
                season={season}
              />

              {/* Constellation layer inside main App (density-aware) */}
              <Constellation
                season={season}
                timeOfDay={timeOfDay}
                mode={mode}
                veilMode={veilMode}
                starDensity={starDensity}
              />

              {/* Calendar */}
              <Calendar
                season={season}
                isNight={isNight}
                weatherCondition={weatherCondition}
                weatherMood={weatherMood}
                isHomePage={true}
                onDaySelect={() => setDrawerOpen(true)}
              />

              {/* Unified Drawer */}
              <DrawerUnified
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                season={season}
                mood={weatherMood}
              />
            </div>
          </>
        }
      />

      <Route path="/day/:date" element={<DayPage />} />
    </Routes>
  );
}
