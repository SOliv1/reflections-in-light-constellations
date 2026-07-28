import { useEffect } from "react";
import LightNotesDrawer from "./LightNotesDrawer";
import QuietActionsDrawer from "./QuietActionsDrawer";
import QuoteDrawer from "./QuoteDrawer";
import ShortReflectionsDrawer from "./ShortReflectionsDrawer";
import "../styles/DrawerUnified.css";
import "./MobileDrawerHost.css";

const ORB_COLOR = "rgb(220, 228, 255)";

export default function MobileDrawerHost({ activeDrawer, onChange, onClose, quote, season, weatherMood }) {
  useEffect(() => {
    if (!activeDrawer) return undefined;

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
  }, [activeDrawer, onClose]);

  if (!activeDrawer) return null;

  let drawer = null;

  if (activeDrawer === "short-reflections") {
    drawer = (
      <ShortReflectionsDrawer
        orbColor={ORB_COLOR}
        weatherMood={weatherMood}
        season={season}
        onOpenActions={() => onChange("quiet-actions")}
        onOpenNotes={() => onChange("light-notes")}
        onClose={onClose}
      />
    );
  } else if (activeDrawer === "quiet-actions") {
    drawer = <QuietActionsDrawer orbColor={ORB_COLOR} onClose={onClose} />;
  } else if (activeDrawer === "light-notes") {
    drawer = <LightNotesDrawer orbColor={ORB_COLOR} onClose={onClose} />;
  } else if (activeDrawer === "quote-of-day") {
    drawer = <QuoteDrawer quote={quote} orbColor={ORB_COLOR} onClose={onClose} />;
  }

  return (
    <div className="mobile-drawer-host" role="dialog" aria-modal="true" aria-label="Reflection tools">
      <button className="mobile-drawer-host__backdrop" type="button" onClick={onClose} aria-label="Close drawer" />
      <div className="mobile-drawer-host__surface">{drawer}</div>
    </div>
  );
}
