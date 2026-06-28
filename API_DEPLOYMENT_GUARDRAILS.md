# API Deployment Guardrails Runbook

This runbook explains why the API deployment safeguards exist, what they check,
and how to respond when one fails.

## Incident summary

On 28–29 June 2026, photo uploads failed with this frontend error:

```text
Expected API response but received HTML from
https://sparkling-gratitude-production-e9a3.up.railway.app/api/upload
```

The live endpoint returned `404 Cannot POST /api/upload` as HTML instead of an
API JSON response. The frontend configuration and web proxy were working; the
API service was serving an older deployment that did not expose the upload
route.

New API deployments had failed because Railway uses `apps/api` as the service
build context, while the Dockerfile tried to copy `apps/api/...` from inside
that context. Railway correctly retained the last successful deployment, but
that older deployment was missing `/api/upload`.

The Dockerfile was corrected to copy files relative to `apps/api`:

```dockerfile
COPY package*.json ./
COPY . ./
```

## Guardrails now in place

### 1. One API route registry

All Express middleware and routes are registered in `apps/api/app.js`.
`apps/api/server.js` only starts the server, and `apps/api/index.js` re-exports
the same app for backward compatibility.

This prevents two server entry points from silently exposing different routes.

### 2. Upload route contract test

`apps/api/test/uploadRoute.test.js` starts the real Express app on a temporary
local port and sends an empty `POST /api/upload` request. It requires:

- HTTP status `400`;
- an `application/json` content type;
- body `{ "error": "No file uploaded" }`.

The empty request proves that the route is mounted without uploading an image,
calling Cloudinary, or writing to MongoDB.

Run all API tests locally:

```powershell
Set-Location apps/api
npm test
```

### 3. Exact Docker build-context check

The `API safeguards` GitHub workflow runs this build on every relevant push or
pull request:

```bash
docker build -f apps/api/Dockerfile apps/api
```

This matches Railway's API build context and catches invalid `COPY` paths before
they become a production deployment failure.

### 4. Upload-aware Railway health check

Railway now checks:

```text
/api/upload/health
```

The deployment becomes healthy only when the upload router is mounted and
MongoDB is connected. Railway retains the previous healthy deployment if this
check does not pass.

### 5. Production smoke tests

`tools/smoke-api.mjs` verifies all of the following:

- `/health` returns JSON and reports MongoDB connected;
- `/api/upload/health` confirms the upload router is mounted;
- an empty `POST /api/upload` returns the expected JSON `400` response;
- `/api/gallery` returns a JSON array;
- production is serving the expected Git commit when `EXPECTED_RELEASE` is set.

The GitHub workflow runs the checks against both production paths:

```text
https://reflections-in-light-constellations-production.up.railway.app
https://sparkling-gratitude-production-e9a3.up.railway.app
```

The second URL tests the same web proxy path used by the browser.

## Expected healthy responses

| Request | Expected result |
| --- | --- |
| `GET /health` | `200`, JSON, `app: "ok"`, `db: "connected"` |
| `GET /api/upload/health` | `200`, JSON, `route: "upload"`, `db: "connected"` |
| Empty `POST /api/upload` | `400`, JSON, `error: "No file uploaded"` |
| `GET /api/gallery` | `200`, JSON array |

HTML from an `/api/...` request is always a routing or deployment failure and
must not be treated as a valid API response.

## Manual production verification

From the repository root in PowerShell:

```powershell
node tools/smoke-api.mjs https://reflections-in-light-constellations-production.up.railway.app
node tools/smoke-api.mjs https://sparkling-gratitude-production-e9a3.up.railway.app
```

To verify that production is serving the current commit:

```powershell
$env:EXPECTED_RELEASE = git rev-parse HEAD
node tools/smoke-api.mjs https://reflections-in-light-constellations-production.up.railway.app
node tools/smoke-api.mjs https://sparkling-gratitude-production-e9a3.up.railway.app
Remove-Item Env:EXPECTED_RELEASE
```

These checks do not upload or delete user data.

## Troubleshooting a failed deployment

1. Check the `API safeguards` workflow in GitHub Actions. Do not deploy if API
   tests or the Docker build failed.
2. Check Railway deployment state:

   ```powershell
   railway status
   railway deployment list --service reflections-in-light-constellations --environment production
   ```

3. Read build logs for the failed deployment:

   ```powershell
   railway logs --build --service reflections-in-light-constellations --lines 300 DEPLOYMENT_ID
   ```

4. Read runtime logs if the image built but health checks failed:

   ```powershell
   railway logs --deployment --service reflections-in-light-constellations --lines 300 DEPLOYMENT_ID
   ```

5. Run the production smoke test against the direct API domain first, then the
   web proxy domain. If direct API passes but the proxy fails, inspect
   `apps/web/Caddyfile` and the web service's `API_UPSTREAM` value.
6. If both domains fail, inspect the API deployment, route registry, database
   connection, and Railway variables.

Never solve an HTML API response by removing the frontend response validation.
That validation is correctly identifying a broken route or deployment.

## Safe recovery procedure

1. Keep the last healthy Railway deployment live.
2. Reproduce and fix the failure in the repository.
3. Run `npm test` in `apps/api`.
4. Ensure CI passes the exact-context Docker build.
5. Deploy only the API service when the web application is unchanged.
6. Wait for Railway health checks to pass.
7. Run smoke tests against both production domains.
8. Confirm a real photo upload in the application only after the no-data smoke
   tests pass.

## Files that enforce these safeguards

- `.github/workflows/api.yml` — API tests, Docker build, and production smoke checks.
- `.github/workflows/deploy-railway.yml` — smoke checks after manual Railway deployments.
- `apps/api/app.js` — single Express route registry.
- `apps/api/server.js` — server startup only.
- `apps/api/test/uploadRoute.test.js` — upload route contract test.
- `apps/api/railway.json` — upload-aware Railway health check.
- `apps/api/Dockerfile` — API-root-relative Docker build.
- `tools/smoke-api.mjs` — direct API and web proxy production verification.

## Change-control rule

Changes to the API Dockerfile, route registry, upload route, Railway config, or
smoke script must keep the `API safeguards` workflow passing. Do not bypass or
disable a failed guardrail to force a production deployment; investigate the
failure or retain the previous healthy deployment.
