# Document Management Fix

## Issue
When loading the Documents page, the application displayed: `{"message":"Failed to fetch documents"}`

## Root Cause
The backend container was missing explicit MinIO environment variables in `docker-compose.yml`. While `MINIO_ENDPOINT` and `MINIO_PORT` were being set, the critical authentication variables (`MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET`, `MINIO_USE_SSL`) were not explicitly passed to the backend container, causing S3 client initialization or connection issues.

## Changes Made

### 1. Updated `docker-compose.yml`
Added explicit MinIO environment variables to the backend service:
```yaml
environment:
  MINIO_ENDPOINT: minio
  MINIO_PORT: "9000"
  MINIO_ACCESS_KEY: ${MINIO_ACCESS_KEY}
  MINIO_SECRET_KEY: ${MINIO_SECRET_KEY}
  MINIO_BUCKET: ${MINIO_BUCKET}
  MINIO_USE_SSL: ${MINIO_USE_SSL}
```

**Why this matters:**
- The `env_file` directive reads from `.env`, but environment variables set explicitly in the `environment` section take precedence
- `MINIO_ENDPOINT` and `MINIO_PORT` were already overridden to use service names, but other variables needed to be passed through
- Without explicit passthrough, these variables might not be available to the backend container

### 2. Enhanced Error Logging in `backend/src/lib/s3.ts`
Added detailed configuration logging at startup:
```typescript
console.log('MinIO Configuration:', {
  endpoint: MINIO_ENDPOINT,
  port: MINIO_PORT,
  bucket: MINIO_BUCKET,
  useSSL: MINIO_USE_SSL,
  hasAccessKey: !!MINIO_ACCESS_KEY,
  hasSecretKey: !!MINIO_SECRET_KEY,
});
```

Improved error message to show which variables are missing:
```typescript
throw new Error(`MinIO environment variables are not fully configured. Missing: ${missing.join(', ')}`);
```

### 3. Enhanced Error Logging in `backend/src/controllers/documentController.ts`
Updated `getDocuments` function to provide:
- Success logging with document count
- Detailed error messages
- Error details in API response

## Environment Variables Required

The following MinIO variables must be set in `.env` (already configured):
```env
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MINIO_ENDPOINT=localhost         # Overridden to 'minio' in docker-compose
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=grc-documents
MINIO_USE_SSL=false
```

**Note:** 
- `MINIO_ENDPOINT=localhost` in `.env` is correct for local development
- Docker Compose overrides it to `minio` (the service name) for container-to-container communication
- `MINIO_ACCESS_KEY` and `MINIO_SECRET_KEY` should match `MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD` for MinIO

## How Document Management Works

### Architecture
```
Browser → Frontend (Port 80)
    ↓
Backend API (Port 3001)
    ↓
PostgreSQL (Port 5432) - Document metadata
    ↓
MinIO (Port 9000) - Document files
```

### Document Flow

#### Fetching Documents (GET /api/documents)
1. Frontend requests `/api/documents`
2. Backend authenticates user via JWT token
3. Backend queries PostgreSQL for document metadata
4. Returns JSON with file info (name, type, size, uploader, etc.)

#### Uploading Documents (POST /api/documents/upload)
1. Frontend sends multipart form data with files
2. Backend authenticates user
3. Backend generates unique storage key for each file
4. Files uploaded to MinIO bucket
5. Metadata saved to PostgreSQL
6. Returns created document records

#### Viewing Documents (GET /api/documents/:id/view)
1. Frontend opens document in new tab with JWT token in query string
2. Backend authenticates via query token
3. Backend fetches document metadata from PostgreSQL
4. Backend streams file from MinIO to browser
5. Browser displays file inline (PDF, images, etc.)

#### Deleting Documents (DELETE /api/documents/:id)
1. Frontend sends delete request
2. Backend authenticates user
3. Backend deletes file from MinIO
4. Backend deletes metadata from PostgreSQL
5. Returns success response

## Deployment Instructions

### On EC2 Instance

1. **Pull latest changes:**
   ```bash
   cd ~/code/grc-assistant
   git pull
   ```

2. **Rebuild and restart containers:**
   ```bash
   docker compose down
   docker compose build backend
   docker compose up -d
   ```

3. **Check logs for MinIO configuration:**
   ```bash
   docker compose logs backend | grep -i minio
   ```

   You should see:
   ```
   MinIO Configuration: { endpoint: 'minio', port: '9000', ... }
   Bucket grc-documents already exists.
   ```

4. **Test document endpoint:**
   ```bash
   # Get auth token first
   curl -X POST http://localhost:3001/api/auth/callback/credentials \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@grc.com","password":"admin@321"}' \
     | jq -r '.token'
   
   # Use token to fetch documents
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/api/documents
   ```

5. **Access from browser:**
   - Navigate to: `http://ec2-34-253-237-129.eu-west-1.compute.amazonaws.com`
   - Login with admin credentials
   - Click "Document Management" in sidebar
   - Should see empty table or existing documents (no error)

## Troubleshooting

### Issue: "MinIO environment variables are not fully configured"
**Solution:** Check backend logs to see which variables are missing:
```bash
docker compose logs backend | grep -i "missing"
```

### Issue: "Could not connect to MinIO after multiple retries"
**Symptoms:**
- Backend logs show connection refused errors
- MinIO container is not running

**Solutions:**
1. Check MinIO container status:
   ```bash
   docker compose ps minio
   ```

2. Check MinIO logs:
   ```bash
   docker compose logs minio
   ```

3. Restart MinIO:
   ```bash
   docker compose restart minio
   docker compose restart backend
   ```

### Issue: Authentication errors (401/403)
**Symptoms:**
- "User not authenticated: No token provided"
- "Forbidden: Invalid token"

**Solutions:**
1. Verify user is logged in
2. Check browser localStorage/sessionStorage for token
3. Token might be expired - try logging out and back in

### Issue: Database connection errors
**Symptoms:**
- "Failed to fetch documents" with database-related errors in logs

**Solutions:**
1. Check PostgreSQL is running:
   ```bash
   docker compose ps postgres
   ```

2. Verify database credentials in `.env`

3. Check backend can connect to database:
   ```bash
   docker compose exec backend sh
   # Inside container:
   wget http://postgres:5432
   ```

## Testing Checklist

- [x] Docker compose environment variables updated
- [x] Error logging enhanced for debugging
- [x] MinIO configuration validated
- [ ] Backend container rebuilt and deployed
- [ ] MinIO connection verified in logs
- [ ] Document list page loads without errors
- [ ] Document upload functionality tested
- [ ] Document view functionality tested
- [ ] Document delete functionality tested

## Security Notes

1. **Authentication:** All document endpoints require JWT authentication
2. **File Storage:** Documents stored in MinIO with unique keys to prevent collisions
3. **Metadata:** User who uploaded each document is tracked in database
4. **Access Control:** Consider adding role-based access (currently all authenticated users can access all documents)

## Future Enhancements

1. **Access Control:**
   - Implement document-level permissions
   - Add document sharing functionality
   - Restrict deletion to document owner or admins

2. **Performance:**
   - Add document pagination for large datasets
   - Implement document search/filtering
   - Add file type filtering

3. **Features:**
   - Document versioning
   - Document tags/categories
   - Document preview thumbnails
   - Bulk upload/delete operations

4. **Monitoring:**
   - Add metrics for storage usage
   - Track upload/download statistics
   - Alert on storage quota thresholds
