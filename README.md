````markdown
# GRC Assistant

GRC (Governance, Risk, Compliance) Assistant is a comprehensive business application handling governance, risk management, and compliance workflows.

## REPO Details

This repository contains the GRC Assistant backend (Express + TypeScript) and frontend (Vite + React) along with local services (Postgres, MinIO) orchestrated with Docker Compose.

Quick project description
- Backend: TypeScript Express server using Drizzle ORM and PostgreSQL.
- Frontend: Vite + React built and served by nginx (production-style build).
- Local services: Postgres and MinIO are included in the compose setup.

Prerequisites
- Docker and Docker Compose installed locally
- An `.env` file at the repo root with the required environment variables (see `.env.example` if available)

Start the application
1. Build and start all services (frontend, backend, postgres, minio):

```fish
# from repository root
docker compose up --build -d
```

2. Tail logs (optional):

```fish
docker compose logs -f backend frontend
```

Database migrations and seeding

The backend container will automatically attempt to run Drizzle migrations when it starts. This avoids separate one-off migrate/seed services and is safer for simple deployments like a single EC2 instance.

If you want the container to also run the seed script on first start, set the environment variable RUN_SEED=true in your `.env` before starting the stack. Example (seed will run inside the runtime image and use compiled JS in `dist`):

```fish
# run migrations only (default behaviour handled at container start)
docker compose up --build -d

# explicitly run migrations + seed manually inside the backend container
docker compose exec backend sh -c "npm run db:migrate && node dist/lib/db/seed.js"
```

Notes and tips
- The frontend is exposed on host port 80. The backend listens on port 3001.
- Environment variables are provided via `.env` referenced in `docker-compose.yml`. Keep secrets out of source control.
- For development you may prefer mapping source code volumes into the containers and running the dev servers (not covered here).

````
