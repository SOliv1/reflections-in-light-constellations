# Railway Setup

This repository is set up as an isolated monorepo with two Railway services:

- `web` from `apps/web`
- `api` from `apps/api`

Railway supports this pattern by setting a separate Root Directory and Watch Paths for each service.

Official docs:

- https://docs.railway.com/deployments/monorepo
- https://docs.railway.com/builds/build-configuration
- https://docs.railway.com/guides/react
- https://docs.railway.com/guides/express
- https://docs.railway.com/databases/mongodb

## Service 1: web

Source repository:

- `SOliv1/reflections-in-light-constellations`

Settings:

- Root Directory: `/apps/web`
- Watch Paths: `/apps/web/**`
- Domain: generate after first deploy

Environment variables:

- `REACT_APP_API_BASE_URL=https://<your-api-domain>`

Recommended flow:

1. Create the `api` service first or generate its domain first.
2. Copy the API domain into `REACT_APP_API_BASE_URL`.
3. Redeploy the `web` service.

## Service 2: api

Source repository:

- `SOliv1/reflections-in-light-constellations`

Settings:

- Root Directory: `/apps/api`
- Watch Paths: `/apps/api/**`
- Start Command: `npm start`
- Domain: generate after first deploy

Environment variables:

- `PORT=5000`
- `MONGODB_URI=...`
- `MONGO_DB_NAME=Sandbox`
- `OPENWEATHER_API_KEY=...`
- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`
- `CORS_ALLOWED_ORIGINS=https://<your-web-domain>`

## MongoDB

You can either:

1. keep your existing MongoDB provider and paste that URI into `MONGODB_URI`
2. add Railway MongoDB and use its connection value for `MONGODB_URI`

If you use Railway MongoDB, generate the database first and then connect your API service to it.

## Recommended Order

1. Create Railway project.
2. Add `api` service from GitHub.
3. Set `api` Root Directory to `/apps/api`.
4. Add API environment variables.
5. Deploy `api`.
6. Generate API domain.
7. Add `web` service from GitHub.
8. Set `web` Root Directory to `/apps/web`.
9. Set `REACT_APP_API_BASE_URL` to the generated API domain.
10. Deploy `web`.
11. Generate web domain.
12. Update `CORS_ALLOWED_ORIGINS` in `api` with the web domain.
13. Redeploy `api`.

## Notes

- Railway config files do not automatically follow the Root Directory setting. If you use `railway.json`, Railway expects the config path to be explicit in service settings.
- Because this frontend is Create React App, Railway may auto-build it successfully. If not, the fallback is to serve the built output with an explicit static serve command.
