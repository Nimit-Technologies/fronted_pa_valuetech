# syntax=docker/dockerfile:1.7

# ---------------------------------------------------------------------------
# deps: install dependencies with a reproducible, cacheable layer
# ---------------------------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# build: compile the Vite SPA
# ---------------------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

# VITE_* values are inlined into the static bundle at build time, so each
# target environment needs its own image build with its own --build-arg values.
ARG VITE_APP_NAME=PA_ValueTech
ARG VITE_APP_DESCRIPTION=Admin_Management_Portal
ARG VITE_ENVIRONMENT=production
ARG VITE_BACKEND_URL=https://paserver.nimitconsultancy.in
ARG VITE_SERVER_PORT=
ARG VITE_API_URL=https://paserver.nimitconsultancy.in/api/v1
ARG VITE_API_TIMEOUT=30000
ARG VITE_ENV=production
ARG VITE_ENABLE_DEBUG_MODE=false
ARG VITE_ENABLE_ANALYTICS=true
ARG VITE_AUTH_COOKIE_NAME=auth
ARG VITE_AUTH_TOKEN_STORAGE=localStorage
ARG VITE_LOG_LEVEL=error
ARG VITE_SENTRY_DSN=

ENV VITE_APP_NAME=$VITE_APP_NAME \
    VITE_APP_DESCRIPTION=$VITE_APP_DESCRIPTION \
    VITE_ENVIRONMENT=$VITE_ENVIRONMENT \
    VITE_BACKEND_URL=$VITE_BACKEND_URL \
    VITE_SERVER_PORT=$VITE_SERVER_PORT \
    VITE_API_URL=$VITE_API_URL \
    VITE_API_TIMEOUT=$VITE_API_TIMEOUT \
    VITE_ENV=$VITE_ENV \
    VITE_ENABLE_DEBUG_MODE=$VITE_ENABLE_DEBUG_MODE \
    VITE_ENABLE_ANALYTICS=$VITE_ENABLE_ANALYTICS \
    VITE_AUTH_COOKIE_NAME=$VITE_AUTH_COOKIE_NAME \
    VITE_AUTH_TOKEN_STORAGE=$VITE_AUTH_TOKEN_STORAGE \
    VITE_LOG_LEVEL=$VITE_LOG_LEVEL \
    VITE_SENTRY_DSN=$VITE_SENTRY_DSN

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# runtime: serve the static build as a non-root user
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runtime

RUN apk add --no-cache tini \
    && npm install -g serve@14 \
    && npm cache clean --force \
    && addgroup -S app && adduser -S app -G app

WORKDIR /app
COPY --from=build /app/dist ./
COPY serve.json ./serve.json
RUN chown -R app:app /app

USER app
# HOME=/tmp keeps the app writable-free under a read-only root filesystem;
# `serve` never needs to persist anything besides its own scratch/config files.
ENV HOME=/tmp \
    NODE_ENV=production

EXPOSE 5173

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:5173', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["serve", "-s", ".", "-l", "5173", "--no-clipboard"]
