import React, { useEffect, useMemo, useState } from "react";

export default function PortalTime({ compact = false }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(intervalId);
  }, []);

  const { time, zone } = useMemo(() => {
    const parts = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit", minute: "2-digit", hour12: false,
      timeZone: "Europe/London", timeZoneName: "short",
    }).formatToParts(now);
    const part = (type) => parts.find((item) => item.type === type)?.value || "";
    return { time: `${part("hour")}:${part("minute")}`, zone: part("timeZoneName") };
  }, [now]);

  return (
    <time className={compact ? "scene-menu-time" : "portal-time-text"} dateTime={now.toISOString()}>
      {time} <span className="portal-time-zone">{zone}</span>
    </time>
  );
}
