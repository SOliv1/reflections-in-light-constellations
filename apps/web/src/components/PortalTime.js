// src/components/PortalTime.js
import React, { useEffect, useMemo, useState } from "react";

const PortalTime = ({ season, mood, veilMode, embedded = false, compact = false }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let intervalId;
    const delayToNextMinute = 60000 - (Date.now() % 60000);
    const timeoutId = window.setTimeout(() => {
      setNow(new Date());
      intervalId = window.setInterval(() => setNow(new Date()), 60000);
    }, delayToNextMinute);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  const { londonTime, londonZone } = useMemo(() => {
    const parts = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/London",
      timeZoneName: "short",
    }).formatToParts(now);

    const part = (type) => parts.find((item) => item.type === type)?.value || "";
    return {
      londonTime: `${part("hour")}:${part("minute")}`,
      londonZone: part("timeZoneName"),
    };
  }, [now]);

  const clock = (
    <time
      className={embedded ? "portal-core-time" : compact ? "scene-menu-time" : "portal-time-text"}
      dateTime={now.toISOString()}
    >
      {londonTime} <span className="portal-time-zone">{londonZone}</span>
    </time>
  );

  if (embedded || compact) return clock;

  return (
    <div
      className={`portal-time veil-${veilMode} season-${season} mood-${mood}`}
    >
      {clock}
    </div>
  );
};

export default PortalTime;
