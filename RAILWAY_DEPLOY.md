# Railway deployment guide

This file describes the minimal steps to deploy the repository to Railway and configure CI-based deploys.

Prerequisites
- A Railway account (https://railway.app)
- Railway CLI token (create in Railway project settings)

Repository secrets (add these to the GitHub repository Settings → Secrets):
- `RAILWAY_API_KEY` — Railway service API token (used by the workflow)
- `RAILWAY_PROJECT_ID` — Railway project ID to deploy into

Recommended environment variables to set in Railway for services (add as Railway project variables):
- `OPENWEATHER_API_KEY`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `MONGO_DB_URI`

Deployment steps
1. Create a Railway project and add two services (if needed):
   - `web` service for the frontend (apps/web)
   - `api` service for the backend (apps/api)

2. In GitHub, add the two secrets `RAILWAY_API_KEY` and `RAILWAY_PROJECT_ID`.

3. The included GitHub Actions workflow `.github/workflows/deploy-railway.yml` builds `apps/web` and runs `railway up` to deploy the `web` service.

Notes
- The workflow assumes the Railway CLI is installed during the job and that `railway up --service web` will deploy the prepared build. Adjust the workflow if you prefer using Railway's GitHub integration or a different deployment strategy (Docker, Dockerfile, or monorepo setups).
- Do NOT store API keys in the repository; use Railway environment variables / GitHub secrets.
- After adding new secrets, re-run a push to `master` to trigger the workflow.
