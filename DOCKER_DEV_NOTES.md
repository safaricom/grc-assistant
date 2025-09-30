Development Docker notes

This project uses a top-level `.env` (next to `docker-compose.yml`) that is read by the `docker-compose` services.

Key variables the compose stack needs (set in `.env`):

- VITE_API_HOST
  - For local docker-compose builds this should be `http://backend:3001` so the frontend built static assets call the backend container by service name.
  - In production set this to your deployed API URL (example: `https://api.example.com`).

- FRONTEND_ORIGIN
  - When running with docker-compose the frontend container is exposed on host port 80. Set this to `http://localhost:80` so the backend CORS allows browser requests from the frontend.
  - When running Vite locally (npm run dev) set this to `http://localhost:8080` instead.

- POSTGRES_*, MINIO_* and other backend runtime variables should be set in the same `.env`.

Notes
- Vite `VITE_*` variables are baked into the frontend at build time. The `frontend` Dockerfile accepts `ARG VITE_API_HOST` and sets `ENV VITE_API_HOST` so the built static assets use the correct API host.
- For local development you can either:
  - Run the backend and frontend locally (npm run dev) — ensure `.env` has `FRONTEND_ORIGIN=http://localhost:8080` and `VITE_API_HOST` set accordingly.
  - Use `docker-compose up --build` — the compose file defaults `VITE_API_HOST` to `http://backend:3001` and sets `FRONTEND_ORIGIN=http://localhost:80` in the top-level `.env`.

Troubleshooting
- If you see Network/CORS errors in the browser, check:
  - That the backend is running and reachable from the container network.
  - That `VITE_API_HOST` is correct for your environment, and that `FRONTEND_ORIGIN` is set to the exact origin used by the browser.
  - Browser devtools console will show clearer messages now; check for logged diagnostic objects from the frontend (apiHost, apiKeyPresent, origin).
