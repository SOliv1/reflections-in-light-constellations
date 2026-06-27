# Reflections In Light Constellations
[![CodeQL](https://github.com/SOliv1/reflections-in-light/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/SOliv1/reflections-in-light/actions/workflows/github-code-scanning/codeql) [![wakatime](https://wakatime.com/badge/user/b1df3236-cf2d-4081-bd32-1df83d414551.svg)](https://wakatime.com/@b1df3236-cf2d-4081-bd32-1df83d414551) [![NodeJS (apps/web)](https://github.com/SOliv1/reflections-in-light-constellations/actions/workflows/webpack.yml/badge.svg)](https://github.com/SOliv1/reflections-in-light-constellations/actions/workflows/webpack.yml) [![Deploy to Railway](https://github.com/SOliv1/reflections-in-light-constellations/actions/workflows/deploy-railway.yml/badge.svg)](https://github.com/SOliv1/reflections-in-light-constellations/actions/workflows/deploy-railway.yml) 

A standalone `Insp-Home-Cinematic` app built from the Reflections in Light family, now evolving as its own experience.

C:\Users\soliv\OneDrive\Documents\GitHub\reflections-in-light-constellations

## Structure

- `apps/web` contains the React frontend
- `apps/api` contains the Express API
- `REFLECTIONS_IN_LIGHT_CONSTELLATIONS_MIGRATION.md` captures the migration and deployment plan

## Railway Direction

Deploy this repo as two Railway services:

- `web` from `apps/web`
- `api` from `apps/api`
Backend: npm start dev

front end start: cd /workspaces/reflections-in-light-constellations/apps/web
npm start

## Core Features

- cinematic layered lsbackgrounds and veil logic
- unified drawer interactions
- constellation and logo evolution
- weather and time-driven atmosphere
- gallery, daily image, and quote foundations

## Open In Browser (Codespaces)

Use these exact commands in the terminal to open the web app and API routes in your local browser:

```bash
"$BROWSER" "https://expert-disco-5x5p7p9v9gw24995-3001.app.github.dev"
"$BROWSER" "https://expert-disco-5x5p7p9v9gw24995-5000.app.github.dev"
"$BROWSER" "https://expert-disco-5x5p7p9v9gw24995-5000.app.github.dev/health"
"$BROWSER" "https://expert-disco-5x5p7p9v9gw24995-5000.app.github.dev/api/gallery"
```

## Why You See 404 For /upload

If you see this:

```text
Request failed with status 404 for https://expert-disco-5x5p7p9v9gw24995-3001.app.github.dev/upload
```

that is expected when `/upload` is requested on port `3001` (the React web app orig.  cd /workspaces/reflections-in-light-constellations/apps/api && npm run dev

- `/upload` is an API route handled by `apps/api/server.js`.
- The upload route accepts `POST` requests (file upload), not a normal browser `GET` page.
- In Codespaces, the API is on port `5000`, so uploads should target:

```text
https://expert-disco-5x5p7p9v9gw24995-5000.app.github.dev/upload
```
