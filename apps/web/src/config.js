const LOCAL_API_URL = "http://localhost:5000";
const PRODUCTION_API_URL = "https://sparkling-gratitude-production-e9a3.up.railway.app";

function normalizeUrls(rawValue) {
  return (rawValue || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

function getRuntimeFallbackUrls() {
  if (typeof window === "undefined") {
    return [LOCAL_API_URL];
  }

  const { hostname, origin, protocol } = window.location;
  const isLocalHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "74.220.49.0/24" ||
    hostname === "[::1]";

  if (isLocalHost) {
    // Prefer a local API during development, then use the deployed API so the
    // preview still receives Cloudinary and weather data when port 5000 is off.
    return [LOCAL_API_URL, PRODUCTION_API_URL];
  }

  const urls = [];

  // In Codespaces/GitHub dev domains, the frontend and API are often on different
  // forwarded ports under the same host slug, e.g. -3001.app.github.dev and
  // -5000.app.github.dev. Try the API port before the current origin.
  const githubDevHostMatch = hostname.match(/^(.*?)-\d+\.app\.github\.dev$/i);
  if (githubDevHostMatch) {
    urls.push(`${protocol}//${githubDevHostMatch[1]}-5000.app.github.dev`);
  }

  if (origin) {
    urls.push(origin);
  }

  return urls;
}

const configuredUrls = normalizeUrls(
  [
    process.env.REACT_APP_API_BASE_URL,
    process.env.REACT_APP_API_URLS,
    process.env.REACT_APP_API_URL,
  ]
    .filter(Boolean)
    .join(",")
);

export const API_BASE_URLS = [...new Set([...configuredUrls, ...getRuntimeFallbackUrls()])];

export const API_BASE_URL = API_BASE_URLS[0] || LOCAL_API_URL;

export default API_BASE_URL;
