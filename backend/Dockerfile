### Backend Dockerfile (Node + TypeScript build)
# Multi-stage: deps/build -> runtime
FROM node:22-alpine AS deps
WORKDIR /app

# Install build deps (only needed for installing native modules if any)
RUN apk add --no-cache python3 make g++

# Copy package files and install production deps separately to leverage cache
COPY package.json package-lock.json* tsconfig.json ./
COPY src/ ./src/

# Install only production dependencies first (npm ci if lockfile exists)
RUN if [ -f package-lock.json ]; then npm ci --only=production; else npm install --production; fi

FROM node:22-alpine AS builder
WORKDIR /app

# Copy everything and install dev dependencies for build
COPY package.json package-lock.json* tsconfig.json ./
COPY . .
# Remove any local .env that might be copied into the image so dotenv in the
# container doesn't accidentally load host-local values (like POSTGRES_HOST=localhost)
RUN rm -f .env || true

RUN npm install
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

# Copy only production node_modules and built output
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Copy runtime helper scripts (wait-for-db) and runtime drizzle configs from source
# Copy scripts and drizzle config files directly from the build context so they are
# always available in the runtime image even if intermediate builder layers are cached.
COPY ./scripts ./scripts
COPY ./drizzle.config.cjs ./drizzle.config.cjs
COPY ./drizzle.config.js ./drizzle.config.js
# include generated drizzle migration files and meta info so runtime can run migrations
COPY --from=builder /app/drizzle ./drizzle
COPY package.json ./

ENV NODE_ENV=production
EXPOSE 3001

# Copy startup script and make it executable
COPY --from=builder /app/scripts/start.sh ./scripts/start.sh
RUN chmod +x ./scripts/start.sh

# Default entrypoint: run startup script that will apply migrations/seeds then start the app
ENTRYPOINT ["/bin/sh", "./scripts/start.sh"]
