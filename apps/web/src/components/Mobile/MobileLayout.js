import React, { useState, useEffect } from "react";
import ExploreHeader from "./ExploreHeader";
import WeatherCard from "./WeatherCard";
import ReflectionNav from "./ReflectionNav";
import Carousel from "./Carousel";
import TodayButton from "./TodayButton";
import CategoryTiles from "./CategoryTiles";
import QuoteCard from "./QuoteCard";
import Footer from "./Footer";
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
  const [isVisible, setIsVisible] = useState(false);

  // Fade in on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`mobile-container ${ isVisible ? "fade-in" : "" }`}>
      {/* 1. Explore Header */}
      <ExploreHeader
        time={time}
        reflection={reflection}
      />

      {/* 2. Weather Card */}
      <WeatherCard
        temperature={temperature}
        description={weatherDescription}
        glow={weatherGlow}
        location={location}
      />

      {/* 3. Reflection Navigation */}
      <ReflectionNav
        current={currentReflection}
        total={30}
        onPrevious={onNavigatePrevious}
        onNext={onNavigateNext}
      />

      {/* 4. Carousel (1-30) */}
      <Carousel
        items={30}
        activeIndex={currentReflection}
        onSelectItem={onSelectReflection}
      />

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

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
