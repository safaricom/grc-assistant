# Chat Error Resolution - Complete Guide

## Issues Identified and Fixed

### 1. Temporary Session ID Bug ✅ FIXED
**Problem**: When creating a new chat, the frontend was sending `Date.now().toString()` as the `session_id` to the backend. The backend tried to query the database for this invalid ID, which caused an error.

**Fix**: 
- Detect if session is new (temporary ID or no ID)
- Don't send `session_id` to backend for new sessions
- Let backend create new session and return the real UUID
- Then reload sessions with the proper ID

**Code Changed**: `frontend/src/pages/Chat.tsx`

### 2. Enhanced Error Logging ✅ DEPLOYED
**Added**: Comprehensive error logging in backend to show:
- Exact error message and type
- Response data from external APIs
- HTTP status codes
- Error codes (ECONNREFUSED, ECONNABORTED, etc.)
- Stack traces for debugging

**Code Changed**: `backend/src/controllers/chatController.ts`

### 3. Layout and Viewport Issues ✅ FIXED
- Chat input now always visible
- Messages area properly scrollable
- Sidebar independently scrollable
- No page scrolling required

## Deployment Steps on EC2

### Step 1: Pull Latest Code
```bash
cd ~/code/grc-assistant
git pull origin main
```

### Step 2: Rebuild Containers
```bash
docker compose build backend frontend
```

### Step 3: Restart Services
```bash
docker compose restart
```

Or for a clean restart:
```bash
docker compose down
docker compose up -d
```

### Step 4: Watch Logs
```bash
docker compose logs backend -f
```

## Testing the Fix

### 1. Start New Chat
- Click "New Chat" in sidebar
- Type a message in the input at bottom
- Press Enter or click Send button
- Watch backend logs for detailed output

### 2. Expected Flow

**Frontend Logs** (Browser Console):
```
Sending message to server proxy /api/chat
Chat response received: { 
  responseLength: 234, 
  sources: 2, 
  processingTime: 1234, 
  sessionId: "123e4567-e89b-12d3-a456-426614174000" 
}
```

**Backend Logs**:
```
[AUTH] User authenticated: admin@grc.com
Chat API error details: {
  message: "...",
  response: {...},
  status: 200,
  ...
}
```

### 3. If Still Getting Errors

Check backend logs for one of these patterns:

#### Pattern A: "Failed to authenticate with Cognito"
**Issue**: CLIENT_ID or CLIENT_SECRET wrong
**Fix**: Verify credentials in `.env` file

#### Pattern B: "Unable to reach chat service"
**Issue**: Network connectivity
**Fix**: 
```bash
# Test from EC2
docker compose exec backend curl -v https://cfpu8q1wol.execute-api.eu-west-1.amazonaws.com/Sandbox/api/v1/chat
```

#### Pattern C: "External API error" with 401/403
**Issue**: API_KEY invalid
**Fix**: Get new API key

#### Pattern D: Database error
**Issue**: Session lookup or insert failed
**Fix**: Check PostgreSQL connection

## Verification Checklist

- [ ] Code pulled from git (latest commit: 1a2120c)
- [ ] Backend container rebuilt
- [ ] Frontend container rebuilt
- [ ] Containers restarted
- [ ] Backend logs show no startup errors
- [ ] Can access chat page without logout
- [ ] Can see chat input at bottom of screen
- [ ] Environment variables loaded (check with `docker compose exec backend env | grep API_KEY`)

## Environment Variables Verification

Run this command to verify all required variables are set:

```bash
docker compose exec backend sh -c 'echo "AUTH_HOST=$AUTH_HOST"; echo "CLIENT_ID=$CLIENT_ID"; echo "CLIENT_SECRET=${CLIENT_SECRET:0:10}..."; echo "API_HOST=$API_HOST"; echo "API_KEY=${API_KEY:0:10}..."'
```

Expected output:
```
AUTH_HOST=https://cybersec-rag-domain.auth.eu-west-1.amazoncognito.com
CLIENT_ID=6nk9ji4rea0qvdm56lbubneko2
CLIENT_SECRET=mb39acpgfi...
API_HOST=https://cfpu8q1wol.execute-api.eu-west-1.amazonaws.com
API_KEY=A6TAKGc9V3...
```

## Manual Testing

### Test 1: Cognito Authentication
```bash
docker compose exec backend node -e "
const axios = require('axios');
const authString = Buffer.from('6nk9ji4rea0qvdm56lbubneko2:mb39acpgfidd8u3emqoib02fh67p2pjthfra31grrh12samc3i').toString('base64');
axios.post('https://cybersec-rag-domain.auth.eu-west-1.amazoncognito.com/oauth2/token', 'grant_type=client_credentials', {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + authString }
}).then(res => console.log('TOKEN RECEIVED:', res.data.access_token.substring(0,30) + '...')).catch(err => console.error('AUTH FAILED:', err.response?.data || err.message));
"
```

### Test 2: Database Connection
```bash
docker compose exec backend node -e "
const { Pool } = require('pg');
const pool = new Pool({
  host: 'postgres',
  port: 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB
});
pool.query('SELECT COUNT(*) FROM users').then(res => console.log('DB CONNECTED. Users:', res.rows[0].count)).catch(err => console.error('DB ERROR:', err.message));
"
```

### Test 3: Full Chat Flow
```bash
docker compose exec backend node -e "
const axios = require('axios');

// Get token
const authString = Buffer.from('6nk9ji4rea0qvdm56lbubneko2:mb39acpgfidd8u3emqoib02fh67p2pjthfra31grrh12samc3i').toString('base64');
axios.post('https://cybersec-rag-domain.auth.eu-west-1.amazoncognito.com/oauth2/token', 'grant_type=client_credentials', {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + authString }
}).then(tokenRes => {
  const token = tokenRes.data.access_token;
  console.log('✓ Got Cognito token');
  
  // Call RAG API
  return axios.post('https://cfpu8q1wol.execute-api.eu-west-1.amazonaws.com/Sandbox/api/v1/chat', {
    message: 'What is GRC?',
    include_sources: true
  }, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-api-key': 'A6TAKGc9V33AAMhk5iVq533UKUHTKRiK6P4msIiw',
      'Content-Type': 'application/json'
    },
    timeout: 30000
  });
}).then(chatRes => {
  console.log('✓ RAG API SUCCESS');
  console.log('Response:', chatRes.data.response?.substring(0, 100) + '...');
  console.log('Sources:', chatRes.data.sources?.length || 0);
}).catch(err => {
  console.error('✗ ERROR:', err.response?.data || err.message);
  if (err.code) console.error('Error code:', err.code);
});
"
```

## Success Criteria

✅ Chat message sends successfully  
✅ AI response appears in chat  
✅ Session saved to database  
✅ Can refresh page and see chat history  
✅ Can create multiple chats  
✅ Each user only sees their own chats  

## Support

If still encountering issues after following this guide:

1. **Check logs**: `docker compose logs backend --tail=100`
2. **Verify env vars**: See "Environment Variables Verification" above
3. **Test connectivity**: Run manual tests above
4. **Check AWS Console**: Verify Cognito app client and API Gateway are active
5. **Network**: Ensure EC2 security group allows outbound HTTPS

## Key Files Changed

- `frontend/src/pages/Chat.tsx` - Fixed temporary session ID issue
- `backend/src/controllers/chatController.ts` - Enhanced error logging
- `frontend/src/components/ChatMessages.tsx` - Improved scrolling
- `frontend/src/components/WelcomeScreen.tsx` - Fixed viewport fitting
