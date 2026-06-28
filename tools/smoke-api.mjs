import assert from "node:assert/strict";

const baseUrl = (process.argv[2] || "").replace(/\/+$/, "");
const expectedRelease = process.env.EXPECTED_RELEASE || "";
const retries = Number(process.env.SMOKE_RETRIES || 1);
const delayMs = Number(process.env.SMOKE_DELAY_MS || 10000);

if (!baseUrl) {
  console.error("Usage: node tools/smoke-api.mjs <api-base-url>");
  process.exit(2);
}

async function readJson(response, label) {
  const contentType = response.headers.get("content-type") || "";
  assert.match(contentType, /application\/json/i, `${label} returned ${contentType || "no content type"}`);
  return response.json();
}

async function checkApi() {
  const healthResponse = await fetch(`${baseUrl}/health`);
  assert.equal(healthResponse.status, 200, `/health returned ${healthResponse.status}`);
  const health = await readJson(healthResponse, "/health");
  assert.equal(health.app, "ok");
  assert.equal(health.db, "connected");

  if (expectedRelease) {
    assert.equal(
      health.release,
      expectedRelease,
      `Production is serving release ${health.release || "unknown"}, expected ${expectedRelease}`
    );
  }

  const routeHealthResponse = await fetch(`${baseUrl}/api/upload/health`);
  assert.equal(
    routeHealthResponse.status,
    200,
    `/api/upload/health returned ${routeHealthResponse.status}`
  );
  const routeHealth = await readJson(routeHealthResponse, "/api/upload/health");
  assert.equal(routeHealth.route, "upload");
  assert.equal(routeHealth.db, "connected");

  const uploadResponse = await fetch(`${baseUrl}/api/upload`, { method: "POST" });
  assert.equal(uploadResponse.status, 400, `/api/upload returned ${uploadResponse.status}`);
  const uploadBody = await readJson(uploadResponse, "/api/upload");
  assert.deepEqual(uploadBody, { error: "No file uploaded" });

  const galleryResponse = await fetch(`${baseUrl}/api/gallery`);
  assert.equal(galleryResponse.status, 200, `/api/gallery returned ${galleryResponse.status}`);
  const gallery = await readJson(galleryResponse, "/api/gallery");
  assert.ok(Array.isArray(gallery), "/api/gallery did not return an array");
}

let lastError;
for (let attempt = 1; attempt <= retries; attempt += 1) {
  try {
    await checkApi();
    console.log(`API smoke test passed for ${baseUrl}`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.error(`API smoke attempt ${attempt}/${retries} failed: ${error.message}`);
    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

console.error(`API smoke test failed for ${baseUrl}: ${lastError?.message || "unknown error"}`);
process.exit(1);
