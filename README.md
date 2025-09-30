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
- Run migrations inside the backend container using drizzle-kit:

```fish
# run migrations
docker compose exec backend npm run db:migrate
```

- Seed the database (uses compiled JS in `dist`):

```fish
# run seed (creates admin/user if missing)
docker compose exec backend node dist/lib/db/seed.js
```

One-command setup (migrate + seed)

```fish
docker compose exec backend sh -c "npm run db:migrate && node dist/lib/db/seed.js"
```

Notes and tips
- The frontend is exposed on host port 80. the backend listens on port 3001.
- Environment variables are provided via `.env` referenced in `docker-compose.yml`. Keep secrets out of source control.
- For development you may prefer mapping source code volumes into the containers and running the dev servers (not covered here).

````
