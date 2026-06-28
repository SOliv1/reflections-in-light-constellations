import React from "react";
import "./CosmicPlanets.css";

export default function CosmicPlanets() {
  return (
    <div className="cosmic-layer planet-layer" aria-hidden="true">
      <div className="planet saturn"></div>
      <div className="planet venus"></div>
      <div className="planet mars"></div>
      <div className="planet pluto"></div>
      <div className="planet jupiter"></div>
      <div className="planet earth"></div>
      <div className="planet mercury"></div>
      <div className="sun-glow"></div>
    </div>
  );
}
