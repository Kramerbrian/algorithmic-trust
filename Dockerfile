# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
# Install only prod deps
COPY package.json package-lock.json* .npmrc* ./
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci --omit=dev || npm i --omit=dev
# Copy source
COPY . .
EXPOSE 3001
# Default command runs API
CMD ["node","api/server.js"]
