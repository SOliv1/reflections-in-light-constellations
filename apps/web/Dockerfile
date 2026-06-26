FROM node:22-alpine AS build

WORKDIR /src

COPY . .
RUN mkdir /app && \
    if [ -f apps/web/package.json ]; then \
    cp -a apps/web/. /app/; \
    else \
    cp -a . /app/; \
    fi

WORKDIR /app
RUN npm ci
RUN npm run build

FROM caddy:2-alpine

COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/build /usr/share/caddy

EXPOSE 8080
