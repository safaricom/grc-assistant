#!/bin/sh
set -e

# Wait for Postgres to be available
echo "Waiting for postgres:${POSTGRES_PORT:-5432}..."
node ./scripts/wait-for-db.js ${POSTGRES_HOST:-postgres} ${POSTGRES_PORT:-5432}
echo "Postgres is available"

# Run migrations using drizzle-kit. Prefer local node_modules binary if present.
if command -v npx >/dev/null 2>&1; then
  echo "Running migrations with npx drizzle-kit..."
  npx --yes drizzle-kit migrate --config ./drizzle.config.cjs || {
    echo "Migration command failed" >&2
    exit 1
  }
else
  echo "npx not available, skipping migrations" >&2
fi

# Optionally run seed when environment variable RUN_SEED=true
if [ "${RUN_SEED}" = "true" ]; then
  echo "RUN_SEED=true: running seed script"
  if [ -f ./dist/lib/db/seed.js ]; then
    node ./dist/lib/db/seed.js || { echo "Seed failed" >&2; exit 1; }
  else
    echo "Compiled seed not found; attempting ts-node seed"
    if command -v ts-node >/dev/null 2>&1; then
      ts-node src/lib/db/seed.ts || { echo "Seed failed" >&2; exit 1; }
    else
      echo "No seed runner available, skipping seed" >&2
    fi
  fi
fi

echo "Starting application"
exec node dist/index.js
