# syntax=docker/dockerfile:1

# Astro SSR (node adapter standalone) + better-sqlite3 native dep.
# Uses bun slim (Debian) so node-gyp can compile native modules if a prebuild
# is not available.

FROM oven/bun:1.3-slim AS base
WORKDIR /app
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*
COPY package.json bun.lock ./

# Production-only dependencies (goes into final image)
FROM base AS prod-deps
RUN bun install --frozen-lockfile --production

# Full dependencies (for build only)
FROM base AS build
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Minimal runtime image
FROM oven/bun:1.3-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321

# Writable data dir for sqlite
RUN mkdir -p /app/data && chown bun:bun /app/data

COPY --chown=bun:bun --from=prod-deps /app/node_modules ./node_modules
COPY --chown=bun:bun --from=build     /app/dist         ./dist
COPY --chown=bun:bun package.json ./

USER bun
EXPOSE 4321
CMD ["bun", "./dist/server/entry.mjs"]
