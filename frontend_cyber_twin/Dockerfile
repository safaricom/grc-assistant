# Frontend Dockerfile - Multi-stage build for Vite + React
ARG NODE_VERSION=24.7.0-alpine

# =========================================
# Stage 1: Develop the React.js Application
# =========================================
FROM node:${NODE_VERSION} AS dev

# Set environment variables for development
ENV NODE_ENV=development

# Set the working directory inside the container
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json ./

# Install project dependencies with cache mount for better performance
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy the rest of the application source code into the container
COPY . .

# Expose the port used by the Vite development server
EXPOSE 5173

# Use a default command, can be overridden in Docker compose.yml file
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# =========================================
# Stage 2: Build the React.js Application
# =========================================
FROM node:${NODE_VERSION} AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json ./

# Install project dependencies using npm ci (ensures a clean, reproducible install)
RUN npm ci

# Copy the rest of the application source code into the container
COPY . .

# Do NOT copy .env* into the build; API base should default to relative paths for production.
# Environment can be provided at runtime (for dev) or via build args if necessary.

# Build the React.js application (outputs to /app/dist)
RUN npm run build

# =========================================
# Stage 3: Prepare Nginx to Serve Static Files
# =========================================
FROM nginxinc/nginx-unprivileged:alpine3.22 AS runner

# Add labels for better container management
LABEL maintainer="Safaricom Cyber Guard Team"
LABEL description="Frontend service for Safaricom Cyber Guard application"

# Use a built-in non-root user for security best practices
USER nginx

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx cache directory with proper permissions
RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx

# Copy the static build output from the build stage to Nginx's default HTML serving directory
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Expose port 8080 to allow HTTP traffic
# Note: The default NGINX container now listens on port 8080 instead of 80
EXPOSE 8080

# Start Nginx directly with custom config
CMD ["nginx", "-c", "/etc/nginx/conf.d/default.conf", "-g", "daemon off;"]