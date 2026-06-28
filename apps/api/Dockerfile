FROM node:22-alpine

WORKDIR /app

COPY apps/api/package*.json ./
RUN npm ci --omit=dev

COPY apps/api/. ./

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]
