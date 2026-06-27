import { API_BASE_URL, API_BASE_URLS } from "./config";

function buildUrl(baseUrl, path) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export async function fetchFromApi(path, options) {
  const candidates = API_BASE_URLS.length > 0 ? API_BASE_URLS : [API_BASE_URL];
  let lastError;
  let lastResponse;

  for (const baseUrl of candidates) {
    const requestUrl = buildUrl(baseUrl, path);

    try {
      const response = await fetch(requestUrl, options);
      const contentType = response.headers.get("content-type") || "";

      // A frontend/static server can answer an API request with its HTML shell
      // (commonly 404/405 for POST). That is not an API response, so continue
      // to the next configured candidate instead of surfacing a misleading
      // method error to the user.
      if (contentType.includes("text/html")) {
        lastError = new Error(
          `Expected API response but received HTML from ${requestUrl}. Check REACT_APP_API_BASE_URL or API_UPSTREAM.`
        );
        continue;
      }

      if (response.ok) {
        return response;
      }

      if (response.status < 500 && response.status !== 404) {
        return response;
      }

      lastResponse = response;
      lastError = new Error(`Request failed with status ${response.status} for ${requestUrl}`);
    } catch (error) {
      lastError = error;
    }
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw lastError || new Error(`All API endpoints failed for ${path}`);
}
