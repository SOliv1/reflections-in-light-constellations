import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { fetchFromApi } from "../api";
import { SHARE_FEATURE_ENABLED } from "../config";

function CeremonialScreen({ title, subtitle, note, accent = "#7fd6d6" }) {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
        overflowX: "hidden",
        padding: "clamp(14px, 5vw, 28px)",
        background:
          "radial-gradient(circle at 18% 20%, rgba(127,214,214,0.22), transparent 45%), radial-gradient(circle at 82% 78%, rgba(244,175,160,0.24), transparent 48%), linear-gradient(180deg, #101a2f 0%, #1f2a44 48%, #2f2241 100%)",
        color: "#f7efe2",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "620px",
          boxSizing: "border-box",
          borderRadius: "16px",
          background: "rgba(10, 16, 32, 0.62)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 22px 60px rgba(0, 0, 0, 0.35)",
          padding: "clamp(22px, 6vw, 28px) clamp(18px, 5vw, 24px)",
          textAlign: "left",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: "14px" }}>
          <span
            aria-hidden="true"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              borderWidth: "2px",
              borderStyle: "solid",
              borderRightColor: `${accent}66`,
              borderBottomColor: `${accent}66`,
              borderLeftColor: `${accent}66`,
              borderTopColor: accent,
              animation: "shareSpin 1.15s linear infinite",
              boxShadow: `0 0 20px ${accent}55`,
            }}
          />
          <span
            aria-hidden="true"
            style={{
              width: "14px",
              height: "14px",
              marginLeft: "-22px",
              borderRadius: "50%",
              borderWidth: "2px",
              borderStyle: "solid",
              borderRightColor: `${accent}88`,
              borderBottomColor: `${accent}88`,
              borderLeftColor: `${accent}88`,
              borderTopColor: "transparent",
              animation: "shareSpinReverse 1.7s linear infinite",
            }}
          />
          <strong style={{ fontSize: "1.06rem", letterSpacing: "0.02em" }}>{title}</strong>
        </div>
        <p style={{ marginTop: "12px", marginBottom: 0, opacity: 0.9 }}>{subtitle}</p>
        {note ? (
          <p style={{ marginTop: "10px", marginBottom: 0, opacity: 0.75, fontStyle: "italic" }}>{note}</p>
        ) : null}
        <style>
          {"@keyframes shareSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes shareSpinReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }"}
        </style>
      </section>
    </main>
  );
}

function SharePausedScreen({ message }) {
  const gameName = "Rocket Relay: Stardust Run";
  const launchTarget = 30;
  const [rocketBoost, setRocketBoost] = useState(false);
  const [rocketHover, setRocketHover] = useState(false);
  const [missionScore, setMissionScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [checkpointHits, setCheckpointHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [milestoneText, setMilestoneText] = useState("Tap the rocket to gather stardust.");
  const [sparkBursts, setSparkBursts] = useState([]);
  const [launchingHome, setLaunchingHome] = useState(false);
  const [gatePulse, setGatePulse] = useState(0);
  const [gateFlash, setGateFlash] = useState(false);
  const [tapResult, setTapResult] = useState(null);
  const [tapOutcome, setTapOutcome] = useState(null);
  const [lastCheckpointResult, setLastCheckpointResult] = useState({
    didHit: null,
    label: "WAITING",
    detail: "Tap the rocket to test the checkpoint.",
  });

  const nextBadge =
    missionScore >= 60
      ? "Legendary Navigator"
      : missionScore >= launchTarget
        ? "Astronaut"
        : missionScore >= 15
          ? "Star Navigator"
          : "Cadet";
  const launchReady = missionScore >= launchTarget;
  const difficultyTier = missionScore >= 60 ? 3 : missionScore >= 30 ? 2 : missionScore >= 15 ? 1 : 0;
  const difficultyLabel = ["Cadet", "Navigator", "Astronaut", "Legendary"][difficultyTier];
  const gateStep = [4, 5, 5, 6][difficultyTier];
  const gateTickMs = [90, 84, 78, 72][difficultyTier];
  const hitWindowStart = [42, 43, 44, 45][difficultyTier];
  const hitWindowEnd = [58, 57, 56, 55][difficultyTier];
  const perfectWindowStart = [48, 48, 49, 49][difficultyTier];
  const perfectWindowEnd = [52, 52, 51, 51][difficultyTier];
  const checkpointWindow = gatePulse >= hitWindowStart && gatePulse <= hitWindowEnd;
  const checkpointPerfect = gatePulse >= perfectWindowStart && gatePulse <= perfectWindowEnd;

  useEffect(() => {
    if (launchingHome) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setGatePulse((prev) => (prev + gateStep) % 100);
    }, gateTickMs);

    return () => window.clearInterval(timer);
  }, [launchingHome, gateStep, gateTickMs]);

  function launchSparks() {
    const burst = Array.from({ length: 6 }, (_, idx) => ({
      id: `${Date.now()}-${idx}`,
      x: Math.random() * 120 - 60,
      y: -(Math.random() * 40 + 24),
      size: Math.floor(Math.random() * 8) + 10,
      hue: idx % 2 === 0 ? "#ffd37a" : idx % 3 === 0 ? "#7fd6d6" : "#f4afa0",
    }));

    setSparkBursts((prev) => [...prev, ...burst]);
    window.setTimeout(() => {
      setSparkBursts((prev) => prev.filter((item) => !burst.some((born) => born.id === item.id)));
    }, 900);
  }

  function igniteRocket() {
    if (launchingHome) {
      return;
    }

    setRocketBoost(true);
    const basePoints = 1 + Math.floor(Math.random() * 3);
    const checkpointBonus = checkpointPerfect ? 3 : checkpointWindow ? 1 : 0;
    const missPenalty = !checkpointWindow && difficultyTier >= 3 ? 1 : 0;
    const points = Math.max(0, basePoints + checkpointBonus - missPenalty);

    if (checkpointPerfect) {
      setTapResult("PERFECT HIT");
      setTapOutcome({ didHit: true, wasPerfect: true, points });
      setLastCheckpointResult({
        didHit: true,
        label: "YES",
        detail: "PERFECT checkpoint timing",
      });
      setCheckpointHits((prev) => prev + 1);
      setGateFlash(true);
      window.setTimeout(() => setGateFlash(false), 300);
    } else if (checkpointWindow) {
      setTapResult("HIT");
      setTapOutcome({ didHit: true, wasPerfect: false, points });
      setLastCheckpointResult({
        didHit: true,
        label: "YES",
        detail: "Checkpoint hit",
      });
      setCheckpointHits((prev) => prev + 1);
      setGateFlash(true);
      window.setTimeout(() => setGateFlash(false), 220);
    } else {
      setTapResult("MISS");
      setTapOutcome({ didHit: false, wasPerfect: false, points });
      setLastCheckpointResult({
        didHit: false,
        label: "NO",
        detail: "Missed checkpoint",
      });
      setMisses((prev) => prev + 1);
    }

    window.setTimeout(() => {
      setTapResult(null);
      setTapOutcome(null);
    }, 700);

    setMissionScore((prev) => {
      const total = prev + points;
      if (total >= 60) {
        setMilestoneText("Legend rank reached. Mission control salutes you.");
      } else if (total >= launchTarget) {
        setMilestoneText("Launch window open. Press Blast Off Home when ready.");
      } else if (total >= 15) {
        setMilestoneText("Star Navigator unlocked. The route is stabilizing.");
      } else if (total >= 8) {
        setMilestoneText(checkpointWindow ? "Checkpoint hit. Bonus stardust secured." : "Great flight. Mission control sees a stable return path.");
      } else if (total >= 4) {
        setMilestoneText(checkpointWindow ? "Checkpoint hit. Nice timing." : "Good ignition. Keep gathering stardust.");
      } else {
        setMilestoneText(checkpointWindow ? "Checkpoint hit. Keep the rhythm going." : "Tap the rocket to gather stardust.");
      }

      return total;
    });
    setStreak((prev) => prev + 1);
    launchSparks();

    window.setTimeout(() => setRocketBoost(false), 1600);
    window.setTimeout(() => setStreak(0), 2600);
  }

  function blastOffHome() {
    if (!launchReady || launchingHome) {
      return;
    }

    setLaunchingHome(true);
    setRocketBoost(true);
    setMilestoneText("Blast-off confirmed. Returning to Earth...");
    window.setTimeout(() => {
      window.location.assign("/");
    }, 1300);
  }

  function resetMission() {
    setMissionScore(0);
    setStreak(0);
    setCheckpointHits(0);
    setRocketBoost(false);
    setRocketHover(false);
    setLaunchingHome(false);
    setGateFlash(false);
    setGatePulse(0);
    setSparkBursts([]);
    setTapResult(null);
    setTapOutcome(null);
    setLastCheckpointResult({
      didHit: null,
      label: "WAITING",
      detail: "Tap the rocket to test the checkpoint.",
    });
    setMisses(0);
    setMilestoneText("Tap the rocket to gather stardust.");
  }

  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
        overflowX: "hidden",
        padding: "clamp(12px, 4.8vw, 28px)",
        background:
          "radial-gradient(circle at 20% 22%, rgba(127,214,214,0.22), transparent 42%), radial-gradient(circle at 80% 18%, rgba(244,175,160,0.22), transparent 40%), linear-gradient(180deg, #081226 0%, #1b2242 50%, #2f2241 100%)",
        color: "#f7efe2",
      }}
    >
      <section
        style={{
          width: "100%",
          minWidth: 0,
          maxWidth: "700px",
          boxSizing: "border-box",
          borderRadius: "18px",
          background: "rgba(8, 16, 34, 0.78)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 24px 72px rgba(0, 0, 0, 0.42)",
          padding: "clamp(18px, 5vw, 26px) clamp(14px, 4.8vw, 24px) clamp(18px, 5vw, 24px)",
          textAlign: "center",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          overflow: "hidden",
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={igniteRocket}
          onMouseEnter={() => setRocketHover(true)}
          onMouseLeave={() => setRocketHover(false)}
          onFocus={() => setRocketHover(true)}
          onBlur={() => setRocketHover(false)}
          aria-label="Ignite rocket preview"
          style={{
            display: "grid",
            placeItems: "center",
            margin: "0 auto 10px",
            width: "min(100%, 260px)",
            maxWidth: "100%",
            boxSizing: "border-box",
            minHeight: "180px",
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            position: "relative",
            overflow: "visible",
            transform: launchingHome
              ? "translateY(-120px) scale(1.16)"
              : rocketBoost
                ? "scale(1.06)"
                : rocketHover
                  ? "scale(1.03)"
                  : "scale(1)",
            transition: launchingHome ? "transform 1200ms ease-in" : "transform 220ms ease",
            justifySelf: "center",
          }}
        >
          <svg
            width="208"
            height="150"
            viewBox="0 0 180 120"
            role="img"
            aria-label="Rocket launch illustration"
            style={{
              display: "block",
              width: "min(208px, 100%)",
              maxWidth: "100%",
              height: "auto",
              overflow: "visible",
              filter: launchingHome
                ? "drop-shadow(0 0 30px rgba(255, 208, 128, 0.95))"
                : rocketBoost
                  ? "drop-shadow(0 0 24px rgba(255, 208, 128, 0.75))"
                  : "none",
            }}
          >
            <defs>
              <linearGradient id="rocketBody" x1="0" x2="1">
                <stop offset="0%" stopColor="#f7efe2" />
                <stop offset="100%" stopColor="#d7dbe8" />
              </linearGradient>
              <linearGradient id="flame" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffd37a" />
                <stop offset="100%" stopColor="#f08c46" />
              </linearGradient>
            </defs>
            <circle cx="18" cy="16" r="2" fill="#f7efe2" opacity="0.8" style={{ animation: "shareStarTwinkle 2.2s ease-in-out infinite" }} />
            <circle cx="42" cy="30" r="1.5" fill="#f7efe2" opacity="0.7" style={{ animation: "shareStarTwinkle 2.8s ease-in-out infinite" }} />
            <circle cx="150" cy="24" r="2" fill="#f4afa0" opacity="0.85" style={{ animation: "shareStarTwinkle 2.4s ease-in-out infinite" }} />
            <circle cx="162" cy="44" r="1.5" fill="#7fd6d6" opacity="0.9" style={{ animation: "shareStarTwinkle 3.1s ease-in-out infinite" }} />
            <g
              transform="translate(92 68) rotate(-25)"
              style={{
                transformOrigin: "92px 68px",
                animation: rocketBoost
                  ? "shareRocketPulse 220ms ease-in-out 5"
                  : rocketHover
                    ? "shareRocketFloat 2.6s ease-in-out infinite"
                    : "shareRocketFloat 4s ease-in-out infinite",
              }}
            >
              <ellipse
                cx="0"
                cy="14"
                rx={rocketBoost ? "13" : "10"}
                ry={rocketBoost ? "26" : "18"}
                fill="url(#flame)"
                opacity={rocketBoost ? "1" : "0.95"}
              />
              <path d="M-16 0h32v46h-32z" fill="url(#rocketBody)" rx="8" />
              <path d="M-16 0C-12 -14 12 -14 16 0Z" fill="#f4afa0" />
              <circle cx="0" cy="12" r="6" fill="#1f2a44" />
              <path d="M-16 20l-10 12 10 2z" fill="#7fd6d6" />
              <path d="M16 20l10 12-10 2z" fill="#7fd6d6" />
            </g>
            <path
              d="M20 103c24-10 44-12 58-10"
              stroke="#7fd6d6"
              strokeWidth={checkpointWindow || gateFlash ? "3" : "2"}
              strokeDasharray={rocketBoost ? "3 4" : "4 6"}
              opacity={checkpointWindow || gateFlash ? "0.95" : "0.55"}
              style={{ animation: "shareTrailFlow 1.4s linear infinite" }}
            />
            <path
              d="M106 80c16-10 34-26 50-46"
              stroke="#f4afa0"
              strokeWidth={checkpointWindow || gateFlash ? "3" : "2"}
              strokeDasharray={rocketBoost ? "3 4" : "4 6"}
              opacity={checkpointWindow || gateFlash ? "0.9" : "0.5"}
              style={{ animation: "shareTrailFlow 1.6s linear infinite reverse" }}
            />
          </svg>

          <span style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {sparkBursts.map((spark) => (
              <span
                key={spark.id}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${spark.x}px)`,
                  top: `calc(58% + ${spark.y}px)`,
                  width: `${spark.size}px`,
                  height: `${spark.size}px`,
                  borderRadius: "50%",
                  background: spark.hue,
                  boxShadow: `0 0 12px ${spark.hue}`,
                  animation: "shareSparkLift 900ms ease-out forwards",
                }}
              />
            ))}
          </span>
        </button>

        <p style={{ marginTop: "0", marginBottom: "10px", opacity: 0.78, fontSize: "0.86rem", overflowWrap: "anywhere" }}>
          {launchingHome
            ? "Lift-off in progress..."
            : rocketBoost
            ? "Engines lit. Route secured."
            : rocketHover
              ? `Tap to ignite ${gameName}, then head back to Earth.`
              : `Hover or tap the rocket to start ${gameName}.`}
        </p>

        <p
          style={{
            marginTop: "0",
            marginBottom: "8px",
            minHeight: "20px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color:
              tapResult === "PERFECT HIT"
                ? "#ffd37a"
                : tapResult === "HIT"
                  ? "#7fd6d6"
                  : tapResult === "MISS"
                    ? "#f4afa0"
                : "rgba(247, 239, 226, 0.72)",
            overflowWrap: "anywhere",
          }}
        >
          {tapResult || "Time your tap with the checkpoint zone."}
        </p>

        <p
          style={{
            marginTop: "0",
            marginBottom: "8px",
            minHeight: "20px",
            fontSize: "0.92rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: tapOutcome ? (tapOutcome.didHit ? "#82ffd0" : "#ff9f9f") : "rgba(247, 239, 226, 0.7)",
            lineHeight: 1.35,
            overflowWrap: "anywhere",
          }}
        >
          {tapOutcome
            ? `${tapOutcome.didHit ? "✅ YES" : "❌ NO"} • ${tapOutcome.wasPerfect ? "PERFECT ZONE" : tapOutcome.didHit ? "HIT ZONE" : "MISSED ZONE"} • +${tapOutcome.points} STARDUST`
            : "Tap feedback: YES if you hit the zone, NO if you miss it."}
        </p>

        <p style={{ marginTop: "0", marginBottom: "8px", opacity: 0.86, fontSize: "0.84rem", overflowWrap: "anywhere" }}>
          Goal: reach {launchTarget} stardust quickly, unlock Astronaut, then Blast Off Home.
        </p>

        <p style={{ marginTop: "0", marginBottom: "8px", opacity: 0.8, fontSize: "0.78rem", overflowWrap: "anywhere" }}>
          Difficulty: {difficultyLabel} tier. As you rank up, the gate speeds up and timing windows get tighter.
        </p>

        <div
          style={{
            width: "min(92%, 420px)",
            maxWidth: "100%",
            boxSizing: "border-box",
            margin: "0 auto 12px",
            textAlign: "left",
          }}
        >
          <p style={{ margin: "0 0 6px", opacity: 0.82, fontSize: "0.78rem", letterSpacing: "0.04em", overflowWrap: "anywhere" }}>
            Checkpoint Gate: HIT in the light zone, PERFECT HIT in the bright center stripe.
          </p>
          <div
            style={{
              position: "relative",
              height: "12px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.28)",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: `${hitWindowStart}%`,
                width: `${hitWindowEnd - hitWindowStart}%`,
                top: 0,
                bottom: 0,
                background: "rgba(255, 211, 122, 0.55)",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: `${perfectWindowStart}%`,
                width: `${Math.max(2, perfectWindowEnd - perfectWindowStart)}%`,
                top: 0,
                bottom: 0,
                background: "rgba(255, 235, 176, 0.9)",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: `${gatePulse}%`,
                transform: "translateX(-50%)",
                top: "-2px",
                width: "8px",
                height: "16px",
                borderRadius: "999px",
                background: checkpointPerfect ? "#fff0b3" : checkpointWindow ? "#ffd37a" : "#7fd6d6",
                boxShadow: checkpointPerfect
                  ? "0 0 16px rgba(255, 240, 179, 0.95)"
                  : checkpointWindow
                    ? "0 0 14px rgba(255, 211, 122, 0.9)"
                    : "0 0 8px rgba(127, 214, 214, 0.7)",
                transition: "background 120ms ease, box-shadow 120ms ease",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "8px",
              borderRadius: "10px",
              padding: "9px 12px",
              border:
                lastCheckpointResult.didHit === true
                  ? "1px solid rgba(127, 235, 190, 0.85)"
                  : lastCheckpointResult.didHit === false
                    ? "1px solid rgba(255, 170, 160, 0.86)"
                    : "1px solid rgba(255,255,255,0.34)",
              background:
                lastCheckpointResult.didHit === true
                  ? "rgba(40, 130, 98, 0.2)"
                  : lastCheckpointResult.didHit === false
                    ? "rgba(130, 54, 54, 0.24)"
                    : "rgba(255,255,255,0.08)",
              color:
                lastCheckpointResult.didHit === true
                  ? "#98ffd8"
                  : lastCheckpointResult.didHit === false
                    ? "#ffb1b1"
                    : "#e3edf7",
              display: "flex",
              justifyContent: "space-between",
              gap: "8px",
              alignItems: "center",
              flexWrap: "wrap",
              fontSize: "0.82rem",
              letterSpacing: "0.04em",
              minWidth: 0,
            }}
          >
            <span style={{ opacity: 0.9 }}>Checkpoint Result</span>
            <strong
              style={{
                fontSize: "1.15rem",
                letterSpacing: "0.1em",
                lineHeight: 1,
                minWidth: 0,
              }}
            >
              {lastCheckpointResult.didHit === true
                ? "✅ YES"
                : lastCheckpointResult.didHit === false
                  ? "❌ NO"
                  : "⏳ WAITING"}
            </strong>
            <span
              style={{
                opacity: 0.96,
                fontWeight: lastCheckpointResult.didHit === null ? 500 : 700,
                flex: "1 1 100%",
                textAlign: "center",
                minWidth: 0,
                overflowWrap: "anywhere",
              }}
            >
              {lastCheckpointResult.detail}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(96px, 100%), 1fr))",
            gap: "8px",
            width: "100%",
            maxWidth: "560px",
            boxSizing: "border-box",
            margin: "0 auto 16px",
          }}
        >
          <div style={{ minWidth: 0, border: "1px solid rgba(255,255,255,0.24)", borderRadius: "10px", padding: "8px 10px", background: "rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "0.66rem", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.74 }}>Stardust</div>
            <div style={{ fontSize: "1.08rem", fontWeight: 700 }}>{missionScore}</div>
          </div>
          <div style={{ minWidth: 0, border: "1px solid rgba(255,255,255,0.24)", borderRadius: "10px", padding: "8px 10px", background: "rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "0.66rem", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.74 }}>Streak</div>
            <div style={{ fontSize: "1.08rem", fontWeight: 700 }}>{streak}</div>
          </div>
          <div style={{ minWidth: 0, border: "1px solid rgba(255,255,255,0.24)", borderRadius: "10px", padding: "8px 10px", background: "rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "0.66rem", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.74 }}>Badge</div>
            <div style={{ fontSize: "0.96rem", fontWeight: 700, overflowWrap: "anywhere" }}>{nextBadge}</div>
          </div>
          <div style={{ minWidth: 0, border: "1px solid rgba(255,255,255,0.24)", borderRadius: "10px", padding: "8px 10px", background: "rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "0.66rem", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.74 }}>Checkpoints</div>
            <div style={{ fontSize: "1.08rem", fontWeight: 700 }}>{checkpointHits}</div>
          </div>
          <div style={{ minWidth: 0, border: "1px solid rgba(255,255,255,0.24)", borderRadius: "10px", padding: "8px 10px", background: "rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "0.66rem", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.74 }}>Misses</div>
            <div style={{ fontSize: "1.08rem", fontWeight: 700 }}>{misses}</div>
          </div>
        </div>

        <p style={{ marginTop: "0", marginBottom: "18px", opacity: 0.86, fontStyle: "italic", overflowWrap: "anywhere" }}>{milestoneText}</p>

        <p style={{ marginTop: "0", marginBottom: "14px", opacity: 0.82, fontSize: "0.82rem", lineHeight: 1.45, overflowWrap: "anywhere" }}>
          Badge rules: Cadet at 0+, Star Navigator at 15+, Astronaut at {launchTarget}+, Legendary Navigator at 60+.
          Reach {launchTarget} stardust to unlock Blast Off Home.
        </p>

        <button
          type="button"
          onClick={blastOffHome}
          disabled={!launchReady || launchingHome}
          style={{
            border: "1px solid rgba(255,255,255,0.72)",
            borderRadius: "999px",
            background: launchReady
              ? "linear-gradient(120deg, #ffd27d 0%, #f48fa0 52%, #7fcfd6 100%)"
              : "rgba(255,255,255,0.14)",
            color: launchReady ? "#14243a" : "rgba(247,239,226,0.8)",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            padding: "10px 18px",
            marginBottom: "16px",
            cursor: launchReady ? "pointer" : "not-allowed",
            boxShadow: launchReady ? "0 14px 30px rgba(11,18,42,0.34)" : "none",
            maxWidth: "100%",
            whiteSpace: "normal",
          }}
        >
          {launchReady ? "Blast Off Home" : `Need ${launchTarget - missionScore} More Stardust`}
        </button>

        <div style={{ marginBottom: "14px" }}>
          <button
            type="button"
            onClick={resetMission}
            style={{
              border: "1px solid rgba(255,255,255,0.5)",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              color: "#f7efe2",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              padding: "8px 14px",
              cursor: "pointer",
              maxWidth: "100%",
              whiteSpace: "normal",
            }}
          >
            Reset Mission
          </button>
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "relative",
            margin: "2px auto 16px",
            width: "100%",
            maxWidth: "520px",
            boxSizing: "border-box",
            borderRadius: "14px",
            padding: "10px 12px 12px",
            background:
              "radial-gradient(circle at 22% 28%, rgba(127,214,214,0.2), transparent 44%), radial-gradient(circle at 76% 38%, rgba(255,211,122,0.2), transparent 46%), rgba(10, 20, 45, 0.58)",
            border: "1px solid rgba(180, 220, 255, 0.36)",
            boxShadow: "inset 0 0 22px rgba(127,214,214,0.16), 0 14px 30px rgba(4, 10, 24, 0.45)",
            overflow: "hidden",
          }}
        >
          <svg
            viewBox="0 0 520 86"
            width="100%"
            height="70"
            role="presentation"
            style={{ display: "block", maxWidth: "100%" }}
          >
            <path
              d="M28 52 L96 30 L152 56 L210 24 L280 50 L338 33 L402 58 L484 28"
              fill="none"
              stroke="rgba(163, 214, 255, 0.72)"
              strokeWidth="1.7"
              strokeDasharray="5 6"
              style={{ animation: "shareConstellationFlow 6s linear infinite" }}
            />
            {[28, 96, 152, 210, 280, 338, 402, 484].map((x, idx) => (
              <g key={`star-${x}`} style={{ animation: `shareStarTwinkle ${1.7 + idx * 0.18}s ease-in-out ${idx * 0.12}s infinite` }}>
                <circle cx={x} cy={idx % 2 === 0 ? 52 : idx % 3 === 0 ? 33 : 56} r="3.1" fill="#fff3cf" />
                <circle cx={x} cy={idx % 2 === 0 ? 52 : idx % 3 === 0 ? 33 : 56} r="7" fill="rgba(255, 211, 122, 0.28)" />
              </g>
            ))}
            <text
              x="260"
              y="46"
              textAnchor="middle"
              fill="#ffe4b0"
              style={{
                fontSize: "19px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                paintOrder: "stroke",
                stroke: "rgba(7, 18, 45, 0.7)",
                strokeWidth: "1.7px",
                filter: "drop-shadow(0 0 7px rgba(255,223,160,0.85))",
              }}
            >
              {gameName}
            </text>
          </svg>
          <div
            style={{
              marginTop: "-2px",
              fontSize: "0.75rem",
              opacity: 0.8,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#bee7f8",
              overflowWrap: "anywhere",
            }}
          >
            Constellation Beacon Online
          </div>
        </div>

        <p style={{ marginTop: 0, marginBottom: "8px", letterSpacing: "0.04em", opacity: 0.8 }}>Sharing paused</p>
        <h1 style={{ marginTop: 0, marginBottom: "10px", fontSize: "clamp(1.7rem, 3.6vw, 2.2rem)", overflowWrap: "anywhere" }}>
          Mission control is securing this route
        </h1>
        <p style={{ marginTop: 0, marginBottom: "10px", opacity: 0.95, overflowWrap: "anywhere" }}>{message}</p>
        <p style={{ marginTop: 0, marginBottom: "22px", opacity: 0.8, overflowWrap: "anywhere" }}>
          Sharing will relaunch after final security checks are complete.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              fontWeight: 700,
              color: "#0f2230",
              background: "linear-gradient(120deg, #7fd6d6 0%, #f4afa0 100%)",
              borderRadius: "999px",
              padding: "11px 18px",
              boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
              maxWidth: "100%",
              boxSizing: "border-box",
              overflowWrap: "anywhere",
            }}
          >
            Return to Earth (Home)
          </Link>
          <Link
            to={`/day/${new Date().toISOString().slice(0, 10)}`}
            style={{
              textDecoration: "none",
              fontWeight: 600,
              color: "#f7efe2",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: "999px",
              padding: "11px 18px",
              maxWidth: "100%",
              boxSizing: "border-box",
              overflowWrap: "anywhere",
            }}
          >
            Back to Today Page
          </Link>
        </div>

        <style>
          {"@keyframes shareRocketFloat { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-4px) rotate(1deg); } 100% { transform: translateY(0px) rotate(0deg); } } @keyframes shareRocketPulse { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-6px) rotate(1.2deg); } 100% { transform: translateY(0px) rotate(0deg); } } @keyframes shareTrailFlow { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 34; } } @keyframes shareStarTwinkle { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } } @keyframes shareSparkLift { 0% { opacity: 1; transform: translateY(0px) scale(1); } 100% { opacity: 0; transform: translateY(-28px) scale(0.35); } } @keyframes shareConstellationFlow { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -120; } }"}
        </style>
      </section>
    </main>
  );
}

function getAudienceLabel(mode) {
  if (mode === "friends") {
    return "Friends & family invited access";
  }

  if (mode === "private") {
    return "Password-protected access";
  }

  return "Private share link access";
}

export default function SharePage() {
  const { slug } = useParams();
  const [state, setState] = useState({
    loading: true,
    error: "",
    metadata: null,
    privacyStatus: null,
    sharedContent: null,
    target: null,
  });
  const [redirectReady, setRedirectReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (!SHARE_FEATURE_ENABLED) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Sharing is currently disabled while security controls are being finalized.",
      }));

      return () => {
        mounted = false;
      };
    }

    async function loadShare() {
      try {
        const response = await fetchFromApi(`/api/share/${slug}/metadata`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || `Failed to load share (${response.status})`);
        }

        if (!mounted) {
          return;
        }

        setState({
          loading: false,
          error: "",
          metadata: data?.metadata || null,
          privacyStatus: data?.privacyStatus || null,
          sharedContent: data?.sharedContent || null,
          target: data?.target || null,
        });
      } catch (error) {
        if (!mounted) {
          return;
        }

        setState({
          loading: false,
          error: error.message || "Could not load this shared page.",
          metadata: null,
          privacyStatus: null,
          sharedContent: null,
          target: null,
        });
      }
    }

    loadShare();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const dayIsoDate = state.target?.albumId?.startsWith("day-")
    ? state.target.albumId.slice(4)
    : null;

  useEffect(() => {
    if (!SHARE_FEATURE_ENABLED) {
      setRedirectReady(false);
      return;
    }

    if (!dayIsoDate) {
      setRedirectReady(false);
      return;
    }

    setRedirectReady(false);
    const timer = setTimeout(() => {
      setRedirectReady(true);
    }, 2800);

    return () => clearTimeout(timer);
  }, [dayIsoDate]);

  if (!SHARE_FEATURE_ENABLED) {
    return (
      <SharePausedScreen message="This feature is temporarily disabled while security controls are being finalized." />
    );
  }

  if (state.loading) {
    return (
      <CeremonialScreen
        title="Checking your shared link"
        subtitle="Validating this URL and gathering your reflection scene."
        note="Please hold while the page aligns the shared atmosphere."
        accent="#7fd6d6"
      />
    );
  }

  if (state.error) {
    if (state.error.toLowerCase().includes("sharing is currently disabled")) {
      return <SharePausedScreen message={state.error} />;
    }

    return (
      <main style={{ padding: "40px", color: "#1e2933" }}>
        <h1 style={{ marginTop: 0 }}>Share unavailable</h1>
        <p>{state.error}</p>
        <p style={{ opacity: 0.8 }}>
          If you are testing locally, share links are currently kept in memory and can disappear after restarting the API.
          Create a new link from the gallery and open it again.
        </p>
        <p>
          <Link to="/">Return to home</Link>
        </p>
      </main>
    );
  }

  if (dayIsoDate) {
    if (!redirectReady) {
      return (
        <CeremonialScreen
          title="Preparing your shared day experience"
          subtitle={`Link verified. Opening day ${dayIsoDate} in a moment.`}
          note="Gathering reflections, light, and mood."
          accent="#f4afa0"
        />
      );
    }

    return <Navigate to={`/day/${dayIsoDate}`} replace />;
  }

  const photos = Array.isArray(state.sharedContent?.photos) ? state.sharedContent.photos : [];

  return (
    <main style={{ padding: "40px", color: "#1e2933" }}>
      <h1 style={{ marginTop: 0 }}>Shared Reflection</h1>
      <p>This shared link is active.</p>
      <p>Access: {getAudienceLabel(state.privacyStatus?.mode)}</p>
      <p>Recipient emails are private and not shown on this page.</p>
      {state.target?.albumId ? <p>Collection: {state.target.albumId}</p> : null}
      {state.target?.photoId ? <p>Photo target: {state.target.photoId}</p> : null}
      {state.metadata?.caption ? <p>Caption: {state.metadata.caption}</p> : null}

      {photos.length > 0 ? (
        <section
          aria-label="Shared photos"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "14px",
            marginTop: "24px",
          }}
        >
          {photos.map((src) => (
            <img
              key={src}
              src={src}
              alt="Shared reflection"
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                objectFit: "cover",
                borderRadius: "10px",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.16)",
              }}
            />
          ))}
        </section>
      ) : (
        <p style={{ marginTop: "16px", opacity: 0.8 }}>
          No photos are currently attached to this shared target.
        </p>
      )}
    </main>
  );
}
