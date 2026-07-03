import React from "react";
import ExploreHeader from "./ExploreHeader";
import WeatherCard from "./WeatherCard";
import ReflectionNav from "./ReflectionNav";
import Carousel from "./Carousel";
import TodayButton from "./TodayButton";
import CategoryTiles from "./CategoryTiles";
import QuoteCard from "./QuoteCard";
import "../../styles/mobile.css";

/**
 * MobileLayout
 * ─────────────────────────────────────────────────────
 * Complete mobile-first experience for Reflections of Light
 * 
 * Props:
 *   - time: formatted time string (e.g., "07:07")
 *   - reflection: atmospheric reflection quote
 *   - temperature: current temperature (number)
 *   - weatherDescription: description text (string)
 *   - weatherGlow: glow description (string)
 *   - location: location name (string)
 *   - currentReflection: current reflection number (1-30)
 *   - quoteOfDay: { quote: string, person: string }
 *   - onNavigatePrevious: callback for previous button
 *   - onNavigateNext: callback for next button
 *   - onSelectReflection: callback for carousel selection
 *   - onToday: callback for today button
 *   - onCategorySelect: callback for category tile selection
 */

export default function MobileLayout({
  constellationImage = null,
  time = "--:--",
  reflection = "",
  temperature = 20.9,
  weatherDescription = "A quiet layer of overcast cloud",
  weatherGlow = "A warm 20.9 deg glow",
  location = "EVESHAM, GB",
  currentReflection = 1,
  quoteOfDay = { quote: "", person: "" },
  onNavigatePrevious = () => {},
  onNavigateNext = () => {},
  onSelectReflection = () => {},
  onToday = () => {},
  onCategorySelect = () => {}
}) {
  return (
    <div
      className="mobile-container"
      style={constellationImage ? {
        backgroundImage: `linear-gradient(180deg, rgba(9, 14, 38, 0.42), rgba(18, 28, 62, 0.72)), url(${constellationImage})`
      } : undefined}
    >
      {/* 1. Explore Header */}
      <div id="scene-reflection"><ExploreHeader time={time} reflection={reflection} /></div>

      {/* 2. Weather Card */}
      <div id="scene-weather"><WeatherCard
        temperature={temperature}
        description={weatherDescription}
        glow={weatherGlow}
        location={location}
      /></div>

      {/* 3. Reflection Navigation */}
      <ReflectionNav
        current={currentReflection}
        total={30}
        onPrevious={onNavigatePrevious}
        onNext={onNavigateNext}
      />

      {/* 4. Carousel (1-30) */}
      <div id="scene-calendar"><Carousel
        items={30}
        activeIndex={currentReflection}
        onSelectItem={onSelectReflection}
      /></div>

      {/* 5. Today Button */}
      <TodayButton onClick={onToday} />

      {/* 6. Category Tiles */}
      <CategoryTiles onSelectCategory={onCategorySelect} />

      {/* 7. Quote of the Day */}
      {quoteOfDay.quote && (
        <QuoteCard
          quote={quoteOfDay.quote}
          author={quoteOfDay.person}
        />
      )}

    </div>
  );
}
