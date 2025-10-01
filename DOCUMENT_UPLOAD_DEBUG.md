# Document Upload Debug Enhancement

## Issue
Document uploads are failing with a generic error message:
```json
{"message":"Failed to upload documents"}
```

No detailed error information was being logged, making it difficult to diagnose the root cause.

## Solution
Enhanced error logging throughout the document upload pipeline to identify exactly where failures occur.

## Changes Made

### 1. Enhanced Document Controller Logging
**File:** `backend/src/controllers/documentController.ts`

Added comprehensive logging at each step:
- Request received
- File details (count, names, sizes, types)
- User authentication status
- MinIO upload progress
- Database insertion progress
- Detailed error messages with stack traces

**Key additions:**
```typescript
console.log('Upload request received');
console.log('Files:', req.files);
console.log('User:', req.user);
console.log(`Processing ${files.length} file(s)`);
console.log(`User ID: ${user.id}`);
console.log(`Processing file: ${file.originalname}, size: ${file.size}`);
console.log(`Uploading to MinIO: ${storageKey}`);
console.log(`Successfully uploaded to MinIO: ${storageKey}`);
console.log(`Inserting ${documentsToInsert.length} document(s) into database`);
console.log('Upload completed successfully');
```

Added detailed error reporting:
```typescript
const errorMessage = error instanceof Error ? error.message : 'Unknown error';
const errorStack = error instanceof Error ? error.stack : '';
console.error('Error details:', errorMessage);
console.error('Error stack:', errorStack);
```

### 2. Enhanced S3/MinIO Upload Logging
**File:** `backend/src/lib/s3.ts`

Added logging for MinIO operations:
```typescript
console.log(`Uploading file to MinIO: ${storageKey}, size: ${fileBuffer.length} bytes, type: ${mimetype}`);
console.log(`File uploaded successfully: ${storageKey}`);
// On error:
console.error(`Failed to upload file to MinIO: ${storageKey}`, error);
```

### 3. Added User Authentication Check
Added explicit check for user authentication:
```typescript
if (!user || !user.id) {
  console.error('User not authenticated or missing ID');
  return res.status(401).json({ message: 'User not authenticated' });
}
```

## How to Debug Upload Issues

### Step 1: Check Backend Logs
After attempting an upload, check the backend logs:
```bash
docker compose logs backend --tail 100 -f
```

### Step 2: Identify the Failure Point
The logs will show exactly where the upload fails:

**Scenario A: No files received**
```
Upload request received
No files in request
```
**Solution:** Check frontend form data, ensure files are being sent

**Scenario B: User not authenticated**
```
Upload request received
Files: [...]
User not authenticated or missing ID
```
**Solution:** Check JWT token, re-login if needed

**Scenario C: MinIO connection failure**
```
Processing file: test.pdf, size: 12345, type: application/pdf
Uploading to MinIO: documents/uuid.pdf
Failed to upload file to MinIO: documents/uuid.pdf
Error: connect ECONNREFUSED
```
**Solution:** Check MinIO is running, verify environment variables

**Scenario D: Database insertion failure**
```
Successfully uploaded to MinIO: documents/uuid.pdf
Inserting 1 document(s) into database
Error: relation "documents" does not exist
```
**Solution:** Run database migrations

**Scenario E: Success**
```
Upload request received
Processing 1 file(s)
User ID: abc-123
Processing file: test.pdf, size: 12345
Uploading to MinIO: documents/uuid.pdf
Successfully uploaded to MinIO: documents/uuid.pdf
Inserting 1 document(s) into database
Successfully inserted 1 document(s) into database
Upload completed successfully
```

## Common Issues and Solutions

### Issue 1: MinIO Connection Refused
**Symptoms:**
```
Failed to upload file to MinIO: documents/...
Error: connect ECONNREFUSED minio:9000
```

**Causes:**
- MinIO container not running
- Network issue between backend and MinIO
- Wrong MINIO_ENDPOINT or MINIO_PORT

**Solutions:**
```bash
# Check MinIO status
docker compose ps minio

# Restart MinIO if needed
docker compose restart minio

# Verify environment variables
docker compose exec backend sh
env | grep MINIO
```

### Issue 2: Authentication Errors
**Symptoms:**
```
Failed to upload file to MinIO
Error: Access Denied
```

**Causes:**
- Wrong MINIO_ACCESS_KEY or MINIO_SECRET_KEY
- Keys don't match MINIO_ROOT_USER/MINIO_ROOT_PASSWORD

**Solutions:**
```bash
# Verify MinIO credentials in .env
cat .env | grep MINIO

# Should have:
# MINIO_ACCESS_KEY=minioadmin
# MINIO_SECRET_KEY=minioadmin
# MINIO_ROOT_USER=minioadmin
# MINIO_ROOT_PASSWORD=minioadmin
```

### Issue 3: Database Table Missing
**Symptoms:**
```
Error: relation "documents" does not exist
```

**Solution:**
Migrations haven't run. Check migration logs:
```bash
docker compose logs backend | grep -i migration
```

If missing, restart backend:
```bash
docker compose restart backend
```

### Issue 4: User Not Authenticated
**Symptoms:**
```
User not authenticated or missing ID
```

**Causes:**
- No JWT token in request
- Token expired
- Token invalid

**Solutions:**
- Re-login in the frontend
- Check that token is being sent in Authorization header
- Verify JWT_SECRET matches between login and verification

### Issue 5: Multer Not Receiving Files
**Symptoms:**
```
No files in request
```

**Causes:**
- Frontend not sending files as multipart/form-data
- Field name mismatch (frontend sends 'file', backend expects 'files')
- File size exceeds multer limit

**Solutions:**
Check frontend is sending correct form data:
```typescript
const formData = new FormData();
formData.append('files', file); // Must be 'files' not 'file'
```

Check route configuration:
```typescript
router.post('/upload', upload.array('files', 10), uploadDocument);
```

## Testing After Deployment

### 1. Deploy Changes
```bash
cd ~/code/grc-assistant
git pull
docker compose down
docker compose build backend
docker compose up -d
```

### 2. Monitor Logs
```bash
# Watch logs in real-time
docker compose logs backend -f
```

### 3. Test Upload from Browser
1. Open browser to: `http://ec2-34-253-237-129.eu-west-1.compute.amazonaws.com`
2. Login with: `admin@grc.com` / `admin@321`
3. Navigate to "Document Management"
4. Click "Upload Documents"
5. Select a small test file (e.g., text file or PDF)
6. Click Upload
7. **Immediately check backend logs** to see detailed progress

### 4. Interpret Results

**Success Pattern:**
```
Upload request received
Files: [ { fieldname: 'files', originalname: 'test.pdf', ... } ]
User: { id: '...', email: 'admin@grc.com', ... }
Processing 1 file(s)
User ID: ...
Processing file: test.pdf, size: 12345, type: application/pdf
Uploading to MinIO: documents/uuid.pdf
Uploading file to MinIO: documents/uuid.pdf, size: 12345 bytes
File uploaded successfully: documents/uuid.pdf
Successfully uploaded to MinIO: documents/uuid.pdf
Inserting 1 document(s) into database
Successfully inserted 1 document(s) into database
Upload completed successfully
```

**Failure Pattern:**
```
Upload request received
Processing 1 file(s)
...
Failed to upload file to MinIO: documents/uuid.pdf
Error: <specific error message>
Error details: <error description>
Error stack: <stack trace>
Cleaning up 0 S3 objects due to an error
```

The error details and stack trace will tell you exactly what went wrong.

## Expected Behavior

### Upload Flow
1. ✅ Frontend sends multipart form data with files
2. ✅ Backend receives request with files array
3. ✅ Middleware authenticates user via JWT
4. ✅ Multer parses multipart data into files array
5. ✅ Controller validates files exist
6. ✅ Controller validates user is authenticated
7. ✅ For each file:
   - Generate unique storage key
   - Upload to MinIO
   - Track upload success
8. ✅ Insert all documents into database (in transaction)
9. ✅ Return document metadata to frontend
10. ✅ Frontend displays success message and refreshes list

### On Error
1. ⚠️ Log detailed error information
2. ⚠️ Clean up any files uploaded to MinIO (if upload succeeded but DB failed)
3. ⚠️ Return error response to frontend
4. ⚠️ Frontend displays error message

## Next Steps

1. **Deploy and test** to see the detailed logs
2. **Share the log output** if upload still fails - the logs will show exactly what's wrong
3. **Common issues** are usually:
   - MinIO credentials mismatch
   - Database table not created (migration not run)
   - User authentication issues

## Environment Variables Checklist

Verify these are set in `.env` and passed to backend container:

- [x] `MINIO_ENDPOINT=localhost` (overridden to `minio` in docker-compose)
- [x] `MINIO_PORT=9000`
- [x] `MINIO_ACCESS_KEY=minioadmin`
- [x] `MINIO_SECRET_KEY=minioadmin`
- [x] `MINIO_BUCKET=grc-documents`
- [x] `MINIO_USE_SSL=false`
- [x] `MINIO_ROOT_USER=minioadmin` (for MinIO container)
- [x] `MINIO_ROOT_PASSWORD=minioadmin` (for MinIO container)
- [x] `JWT_SECRET=your_jwt_secret`

## Files Modified

1. `backend/src/controllers/documentController.ts` - Enhanced logging throughout upload process
2. `backend/src/lib/s3.ts` - Added logging for MinIO operations
3. `DOCUMENT_UPLOAD_DEBUG.md` - This documentation

## Success Criteria

After deployment, you should be able to:
- See detailed logs for every upload attempt
- Identify exactly where uploads fail
- Upload documents successfully
- See documents appear in the list
- View uploaded documents
- Delete documents
