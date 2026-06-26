FROM node:22-alpine AS build

WORKDIR /app

COPY apps/web/package*.json ./
RUN npm ci

COPY apps/web/. .
RUN npm run build

FROM caddy:2-alpine

COPY apps/web/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/build /usr/share/caddy

EXPOSE 8080
