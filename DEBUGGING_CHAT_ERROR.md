# Debugging Chat Error on EC2

## Step 1: Check Backend Logs

SSH into your EC2 instance and run:

```bash
cd ~/code/grc-assistant
docker compose logs backend --tail=100 -f
```

Then try sending a chat message from the browser and watch the logs.

## Step 2: Check Environment Variables

Verify that the backend container has the required environment variables:

```bash
docker compose exec backend env | grep -E "AUTH_HOST|CLIENT_ID|CLIENT_SECRET|API_HOST|API_KEY"
```

Expected output:
```
AUTH_HOST=https://cybersec-rag-domain.auth.eu-west-1.amazoncognito.com
CLIENT_ID=6nk9ji4rea0qvdm56lbubneko2
CLIENT_SECRET=mb39acpgfidd8u3emqoib02fh67p2pjthfra31grrh12samc3i
API_HOST=https://cfpu8q1wol.execute-api.eu-west-1.amazonaws.com
API_KEY=A6TAKGc9V33AAMhk5iVq533UKUHTKRiK6P4msIiw
```

## Step 3: Test Cognito Authentication Manually

Test if the backend can authenticate with Cognito:

```bash
docker compose exec backend node -e "
const axios = require('axios');
const authString = Buffer.from('6nk9ji4rea0qvdm56lbubneko2:mb39acpgfidd8u3emqoib02fh67p2pjthfra31grrh12samc3i').toString('base64');
axios.post('https://cybersec-rag-domain.auth.eu-west-1.amazoncognito.com/oauth2/token', 'grant_type=client_credentials', {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + authString
  }
}).then(res => console.log('SUCCESS:', res.data)).catch(err => console.error('ERROR:', err.response?.data || err.message));
"
```

Expected: Should return an access token

## Step 4: Test External RAG API Connectivity

Test if the backend can reach the external API:

```bash
docker compose exec backend curl -v https://cfpu8q1wol.execute-api.eu-west-1.amazonaws.com/Sandbox/api/v1/chat
```

Expected: Should return some response (even if 401/403, it means it's reachable)

## Step 5: Common Issues and Fixes

### Issue 1: "Failed to authenticate with Cognito"
**Cause**: CLIENT_ID or CLIENT_SECRET is wrong
**Fix**: Verify credentials in AWS Cognito console

### Issue 2: "Unable to reach chat service"
**Cause**: Network/firewall blocking outbound HTTPS requests from EC2
**Fix**: Check EC2 security group allows outbound HTTPS (port 443)

### Issue 3: "External API error" with 401/403
**Cause**: API_KEY is invalid or expired
**Fix**: Get new API key from API provider

### Issue 4: "Chat request timed out"
**Cause**: RAG API is slow or down
**Fix**: Increase timeout or contact API provider

### Issue 5: Environment variables not loaded
**Cause**: .env file not in correct location or docker-compose not rebuilt
**Fix**: 
```bash
# Ensure .env exists
cat .env | head -n 5

# Rebuild and restart
docker compose down
docker compose up -d --build
```

## Step 6: Enable Detailed Logging

If you're still getting generic errors, check that you have the latest backend code:

```bash
cd ~/code/grc-assistant
git pull origin main
docker compose build backend
docker compose restart backend
```

The latest code includes enhanced error logging that will show:
- Exact error message
- Response data from external API
- HTTP status codes
- Error codes

## Step 7: Manual Test from Backend Container

Get a shell in the backend container and test the full flow:

```bash
docker compose exec backend sh

# Inside container:
node -e "
const axios = require('axios');

// 1. Get Cognito token
const authString = Buffer.from('${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}').toString('base64');
axios.post('${process.env.AUTH_HOST}/oauth2/token', 'grant_type=client_credentials', {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + authString
  }
}).then(res => {
  const token = res.data.access_token;
  console.log('Got token:', token.substring(0, 20) + '...');
  
  // 2. Call RAG API
  return axios.post('${process.env.API_HOST}/Sandbox/api/v1/chat', {
    message: 'test message',
    include_sources: true
  }, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-api-key': '${process.env.API_KEY}',
      'Content-Type': 'application/json'
    }
  });
}).then(res => {
  console.log('RAG API SUCCESS:', res.data);
}).catch(err => {
  console.error('ERROR:', err.response?.data || err.message);
});
"
```

## Quick Fix Commands

```bash
# Pull latest code
cd ~/code/grc-assistant
git pull origin main

# Rebuild everything
docker compose down
docker compose build
docker compose up -d

# Watch logs
docker compose logs backend -f
```

## What to Look For in Logs

When you send a chat message, you should see:

**SUCCESS:**
```
Sending message to server proxy /api/chat
[AUTH] User authenticated: admin@grc.com
Chat response received: { responseLength: 150, sources: 2, processingTime: 1200, sessionId: "..." }
```

**FAILURE (with our enhanced logging):**
```
Chat API error details: {
  message: "connect ECONNREFUSED ...",
  response: null,
  status: undefined,
  code: "ECONNREFUSED"
}
```

This tells you exactly what failed!
