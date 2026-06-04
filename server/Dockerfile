FROM node:18-alpine AS build

WORKDIR /app/server

COPY server/package.json server/package-lock.json ./
RUN npm ci

COPY server/ ./
COPY public/ /app/public/

ENV PUBLIC_DIR=/app/public

RUN npm run build

FROM node:18-alpine

WORKDIR /app/server

ENV NODE_ENV=production
ENV PUBLIC_DIR=/app/public

COPY --from=build /app/server/package.json ./
COPY --from=build /app/server/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/server/dist ./dist
COPY --from=build /app/public /app/public

RUN mkdir -p files/images files/videos

EXPOSE 4000

CMD ["node", "dist/start.js"]
