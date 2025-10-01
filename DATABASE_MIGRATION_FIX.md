# Database Migration Fix for Documents Table

## Issue
Document Management page was showing database errors:
```json
{
  "message": "Failed to fetch documents",
  "error": "Failed query: select \"documents\"... relation \"documents\" does not exist"
}
```

## Root Cause
The `documents` table was not being created in the database because:
1. No migration file existed for the `documents` table
2. Migrations were not being automatically run on application startup
3. The database schema in `schema.ts` defined the documents table, but it was never created in PostgreSQL

## Solution

### 1. Created Migration File
**File:** `backend/drizzle/0003_create_documents_table.sql`

Creates the documents table with proper structure:
- `id` (UUID, primary key)
- `file_name` (text)
- `file_type` (text)
- `file_size` (integer)
- `storage_key` (text, unique)
- `uploaded_by_id` (UUID, foreign key to users)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- Indexes on `uploaded_by_id` and `created_at` for performance

### 2. Updated Migration Journal
**File:** `backend/drizzle/meta/_journal.json`

Added entry for the new migration:
```json
{
  "idx": 3,
  "version": "7",
  "when": 1759304000000,
  "tag": "0003_create_documents_table",
  "breakpoints": true
}
```

### 3. Created Migration Snapshot
**File:** `backend/drizzle/meta/0003_snapshot.json`

Complete database schema snapshot including the documents table with indexes.

### 4. Updated Database Connection
**File:** `backend/src/lib/db/index.ts`

Added automatic migration runner:
```typescript
import { migrate } from "drizzle-orm/node-postgres/migrator";

// In connectDb():
console.log("Running database migrations...");
const migrationsFolder = path.join(__dirname, "../../../drizzle");
await migrate(db, { migrationsFolder });
console.log("Database migrations completed.");
```

**Benefits:**
- Migrations run automatically on server startup
- No manual intervention needed
- Safe to run multiple times (migrations are idempotent)
- Ensures database schema matches code expectations

## Database Schema

### Documents Table
```sql
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  storage_key text NOT NULL UNIQUE,
  uploaded_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX documents_uploaded_by_id_idx ON documents(uploaded_by_id);
CREATE INDEX documents_created_at_idx ON documents(created_at DESC);
```

### Relationships
- **documents.uploaded_by_id** → **users.id**: Tracks who uploaded each document
- On user deletion: Sets `uploaded_by_id` to NULL (preserves document)

## Deployment Steps

### Automatic (Recommended)
Migrations run automatically when the backend starts. Just deploy:

```bash
cd ~/code/grc-assistant
git pull
docker compose down
docker compose build backend
docker compose up -d
```

Check logs to verify migration ran:
```bash
docker compose logs backend | grep -i migration
```

Expected output:
```
Running database migrations...
Database migrations completed.
```

### Manual (If Needed)
If you need to run migrations manually:

```bash
# Inside backend container
docker compose exec backend sh
cd /app
npm run db:migrate
```

## Verification

### 1. Check Database Schema
Connect to PostgreSQL and verify table exists:
```bash
docker compose exec postgres psql -U grc_assistant_user -d grc_assistant_db
```

```sql
-- List all tables
\dt

-- Describe documents table
\d documents

-- Check for any documents
SELECT COUNT(*) FROM documents;
```

### 2. Test API Endpoints

**List documents:**
```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@grc.com","password":"admin@321"}' \
  | jq -r '.token')

# List documents
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/documents
```

Expected: `[]` (empty array, not an error)

**Upload document:**
```bash
# Create a test file
echo "Test document content" > test.txt

# Upload
curl -X POST http://localhost:3001/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "files=@test.txt"
```

Expected: JSON response with document metadata

### 3. Test from Browser
1. Navigate to: `http://ec2-34-253-237-129.eu-west-1.compute.amazonaws.com`
2. Login with: `admin@grc.com` / `admin@321`
3. Click "Document Management" in sidebar
4. Should see empty table with "No documents found" (not an error)
5. Click "Upload Documents" button
6. Select a file and upload
7. Document should appear in the table

## Migration System Overview

### How Drizzle Migrations Work

1. **Schema Definition** (`src/lib/db/schema.ts`):
   - Define tables using Drizzle ORM syntax
   - Type-safe schema definitions

2. **Generate Migration** (`npm run db:generate`):
   - Compares schema.ts with database
   - Generates SQL migration files
   - Creates migration metadata

3. **Run Migration** (automatic on startup):
   - Reads migration files from `drizzle/` folder
   - Executes pending migrations in order
   - Tracks applied migrations in `__drizzle_migrations` table

### Migration Files Structure
```
backend/drizzle/
├── 0000_stale_brother_voodoo.sql       # Initial schema
├── 0001_lyrical_pestilence.sql        # Add DI fields
├── 0002_create_users_table.sql        # Users table
├── 0003_create_documents_table.sql    # Documents table (NEW)
└── meta/
    ├── _journal.json                   # Migration history
    ├── 0000_snapshot.json
    ├── 0001_snapshot.json
    ├── 0002_snapshot.json
    └── 0003_snapshot.json              # (NEW)
```

## Troubleshooting

### Issue: "relation 'documents' does not exist"
**Cause:** Migrations haven't run yet

**Solution:**
```bash
# Restart backend to trigger migrations
docker compose restart backend

# Check logs
docker compose logs backend | grep -i migration
```

### Issue: Migration fails with "already exists" error
**Cause:** Table was partially created

**Solution:**
```bash
# Connect to database
docker compose exec postgres psql -U grc_assistant_user -d grc_assistant_db

# Check if table exists
\dt documents

# If it exists but migration fails, check migration status
SELECT * FROM __drizzle_migrations;

# If needed, manually mark migration as complete or drop and recreate
```

### Issue: "column 'file_name' does not exist"
**Cause:** Old schema vs new schema mismatch

**Solution:**
```bash
# Drop and recreate documents table (CAUTION: loses data)
docker compose exec postgres psql -U grc_assistant_user -d grc_assistant_db

DROP TABLE IF EXISTS documents CASCADE;

# Restart backend to rerun migrations
docker compose restart backend
```

### Issue: Cannot upload files - MinIO error
**Cause:** MinIO not properly configured (separate issue, already fixed)

**Solution:** Ensure all MinIO env vars are set in docker-compose.yml

## Future Migrations

When adding new tables or modifying existing ones:

1. **Update schema.ts:**
   ```typescript
   export const newTable = pgTable("new_table", {
     id: uuid("id").primaryKey().defaultRandom(),
     // ... other columns
   });
   ```

2. **Generate migration:**
   ```bash
   cd backend
   npm run db:generate
   ```

3. **Review generated SQL** in `drizzle/XXXX_description.sql`

4. **Commit and deploy:**
   - Migration runs automatically on next deployment
   - No manual steps needed

## Testing Checklist

- [x] Created migration file for documents table
- [x] Updated migration journal
- [x] Created migration snapshot
- [x] Added automatic migration runner to connectDb
- [x] Updated MinIO environment variables in docker-compose
- [x] Enhanced error logging
- [ ] Deployed to EC2 and verified migration ran
- [ ] Tested document list (should return empty array)
- [ ] Tested document upload
- [ ] Tested document view
- [ ] Tested document delete

## Complete Deployment Checklist

1. **Push code to repository:**
   ```bash
   git add .
   git commit -m "Add documents table migration and auto-migration runner"
   git push
   ```

2. **On EC2 instance:**
   ```bash
   cd ~/code/grc-assistant
   git pull
   docker compose down
   docker compose build backend
   docker compose up -d
   ```

3. **Verify backend startup:**
   ```bash
   docker compose logs backend --tail 50
   ```
   
   Look for:
   - "Connecting to database..."
   - "Database connected successfully."
   - "Running database migrations..."
   - "Database migrations completed."
   - "Bucket grc-documents already exists."
   - "Server running on port 3001"

4. **Test document management:**
   - Access application in browser
   - Navigate to Documents page
   - Verify no errors
   - Upload a test document
   - Verify document appears in list

## Success Criteria

✅ Backend starts without errors
✅ Migrations run automatically
✅ Documents table exists in database
✅ Document Management page loads without errors
✅ Can upload documents successfully
✅ Can view uploaded documents
✅ Can delete documents
✅ MinIO stores files correctly
✅ Database stores metadata correctly
