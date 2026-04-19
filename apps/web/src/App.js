import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppShell from "./components/AppShell";
import MiniOrbMenu from "./components/MiniOrbMenu";

import "./App.css";

export default function App() {
  const [showTestLogo, setShowTestLogo] = useState(false);
  const [testSeason, setTestSeason] = useState(null);
  const [showR, setShowR] = useState(false);
  // Shared sky state — MiniOrbMenu controls, AppShell/Constellation consume
  const [veilMode, setVeilMode] = useState("off");
  const [starDensity, setStarDensity] = useState("normal");

  return (
    <Router>
      {/* Mini Orb Controls */}
      <MiniOrbMenu
        testSeason={testSeason}
        setTestSeason={setTestSeason}
        showTestLogo={showTestLogo}
        setShowTestLogo={setShowTestLogo}
        showR={showR}
        setShowR={setShowR}
        veilMode={veilMode}
        setVeilMode={setVeilMode}
        starDensity={starDensity}
        setStarDensity={setStarDensity}
      />

      {/* Main App */}
      <AppShell
        testSeason={testSeason}
        showTestLogo={showTestLogo}
        showR={showR}
        veilMode={veilMode}
        starDensity={starDensity}
      />
    </Router>
  );
}
