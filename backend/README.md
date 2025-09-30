Server proxy for GRC Assistant

This small Express server proxies requests to the OAuth token endpoint and the chat API so you don't expose client secrets in the browser.

Environment variables (copy from .env.example into .env):
- AUTH_HOST - full host for Cognito token endpoint (e.g. https://your-domain.auth.eu-west-1.amazoncognito.com)
- CLIENT_ID
- CLIENT_SECRET
- API_HOST - chat API host (e.g. https://cfpu8q1wol.execute-api.eu-west-1.amazonaws.com)
- API_KEY - x-api-key to call the chat API
- PORT - optional, default 3001

Run locally:
1. cd server
2. npm install
3. npm run dev

The server exposes:
- POST /api/chat  — body forwarded to the chat API; server adds Authorization header after obtaining token
