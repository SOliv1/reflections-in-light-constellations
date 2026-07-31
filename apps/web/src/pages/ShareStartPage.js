import { Link } from "react-router-dom";
import { SHARE_FEATURE_ENABLED } from "../config";

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function ShareStartPage() {
  const todayIso = getTodayIso();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        width: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
        padding: "clamp(14px, 5vw, 24px)",
        background:
          "radial-gradient(circle at 14% 18%, rgba(250, 204, 154, 0.32), transparent 45%), radial-gradient(circle at 86% 82%, rgba(136, 190, 255, 0.26), transparent 45%), linear-gradient(180deg, #0e1b2f 0%, #1f3452 55%, #2f1e3f 100%)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "660px",
          boxSizing: "border-box",
          borderRadius: "18px",
          background: "rgba(10, 15, 30, 0.72)",
          border: "1px solid rgba(255, 255, 255, 0.22)",
          boxShadow: "0 26px 72px rgba(0, 0, 0, 0.34)",
          padding: "clamp(22px, 6vw, 30px) clamp(18px, 5vw, 26px)",
          color: "#f8efe2",
        }}
      >
        <p style={{ margin: 0, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.8 }}>
          Sharing portal
        </p>
        <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(1.8rem, 4vw, 2.4rem)" }}>
          Share Album
        </h1>
        <p style={{ margin: "0 0 20px", opacity: 0.9, lineHeight: 1.5 }}>
          This is a dedicated sharing page. It is separate from the main landing page and opens the Today
          sharing flow directly.
        </p>

        {!SHARE_FEATURE_ENABLED ? (
          <p style={{ margin: "0 0 20px", color: "#ffe2a7", lineHeight: 1.5 }}>
            Sharing is currently paused while security controls are being finalized.
          </p>
        ) : null}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
          {SHARE_FEATURE_ENABLED ? (
            <Link
              to={`/day/${todayIso}?share=album`}
              style={{
                textDecoration: "none",
                background: "linear-gradient(135deg, #f0be84 0%, #de8a69 100%)",
                color: "#1a2137",
                fontWeight: 700,
                padding: "12px 18px",
                borderRadius: "999px",
              }}
            >
              Open Today and Share Album
            </Link>
          ) : null}
          <Link
            to={`/day/${todayIso}`}
            style={{
              textDecoration: "none",
              border: "1px solid rgba(255, 255, 255, 0.38)",
              color: "#f8efe2",
              fontWeight: 600,
              padding: "12px 18px",
              borderRadius: "999px",
            }}
          >
            View Today Page
          </Link>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              color: "#d8e3f7",
              padding: "12px 18px",
              borderRadius: "999px",
            }}
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
