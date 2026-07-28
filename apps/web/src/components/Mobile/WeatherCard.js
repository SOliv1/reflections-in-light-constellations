import React from "react";
import "../../styles/mobile.css";

export default function WeatherCard({
  temperature,
  description,
  glow,
  location
}) {
  return (
    <div className="weather-card">
      <div className="weather-temperature">
        {temperature}°C
      </div>

      <div className="weather-description">
        {description}
      </div>

      <div className="weather-glow">
        {glow}
      </div>

      <div className="weather-location">
        {location}
      </div>
    </div>
  );
}
