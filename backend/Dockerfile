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
COPY package.json ./

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/index.js"]
