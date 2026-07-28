import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { fetchFromApi } from "../api";

function CeremonialScreen({ title, subtitle, note, accent = "#7fd6d6" }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "28px",
        background:
          "radial-gradient(circle at 18% 20%, rgba(127,214,214,0.22), transparent 45%), radial-gradient(circle at 82% 78%, rgba(244,175,160,0.24), transparent 48%), linear-gradient(180deg, #101a2f 0%, #1f2a44 48%, #2f2241 100%)",
        color: "#f7efe2",
      }}
    >
      <section
        style={{
          width: "min(92vw, 620px)",
          borderRadius: "16px",
          background: "rgba(10, 16, 32, 0.62)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 22px 60px rgba(0, 0, 0, 0.35)",
          padding: "28px 24px",
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
      <p>Mode: {state.privacyStatus?.mode || "public"}</p>
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
