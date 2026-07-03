import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./DrawerUnified.css";
import Tabs from "./Tabs/Tabs";
import ReflectionsPanel from "./Panels/ReflectionsPanel";
import ActionsPanel from "./Panels/ActionsPanel";
import NotesPanel from "./Panels/NotesPanel";
import QuotePanel from "./Panels/QuotePanel";

export default function DrawerUnified({ isOpen, onClose, season, mood, activeTab: controlledTab, onTabChange }) {
  const [internalTab, setInternalTab] = useState("reflections");
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = onTabChange ?? setInternalTab;

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return createPortal(
    <div className={`drawer-unified ${isOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!isOpen} aria-label="Reflection drawer">
      <div className="drawer-backdrop" onClick={onClose} />

      <div className={`drawer-surface season-${season} mood-${mood}`}>
        <button className="drawer-close" onClick={onClose}>×</button>

        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="drawer-content fade-in">
          {activeTab === "reflections" && <ReflectionsPanel />}
          {activeTab === "actions" && <ActionsPanel />}
          {activeTab === "notes" && <NotesPanel />}
          {activeTab === "quote" && <QuotePanel season={season} />}
        </div>
      </div>
    </div>,
    document.body
  );
}

