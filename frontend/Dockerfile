### Frontend Dockerfile (Vite + React)
# Build with node, serve with nginx (multi-stage)
FROM node:22-alpine AS build
WORKDIR /app

# Accept Vite build-time API host
ARG VITE_API_HOST
ENV VITE_API_HOST=${VITE_API_HOST}

# Install dependencies
COPY package.json package-lock.json* tsconfig.json ./
COPY . .
RUN npm ci --silent

# Build the app (Vite reads VITE_* env vars at build-time)
RUN npm run build

FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html

# Add a simple nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
