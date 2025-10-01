# Authentication Validation Improvements

## Problem Identified

When the database is cleared or a user is deleted, their JWT token remains valid in the frontend's localStorage/sessionStorage. This creates a "zombie authentication state" where:

- ✅ Token is cryptographically valid (correct signature, not expired)
- ❌ User record doesn't exist in database
- ❌ Operations requiring user data fail with foreign key constraint errors
- ⚠️ User appears logged in but can't perform any actions

### Example Error
```
ERROR: insert or update on table "documents" violates foreign key constraint "documents_uploaded_by_id_users_id_fk"
Key (uploaded_by_id)=(956ff027-aee9-4efd-8302-636a3f29e926) is not present in table "users"
```

## Root Cause

**JWT tokens are stateless** - they only verify:
1. Token signature (ensures it was issued by our server)
2. Token expiration (ensures it hasn't expired)

They do NOT verify that the user still exists in the database.

## Solutions Implemented

### 1. Enhanced Auth Middleware (Backend)

**File:** `backend/src/middleware/auth.ts`

**Changes:**
- Made `isAuthenticated` middleware async
- Added database lookup to verify user exists
- Returns specific error codes for better frontend handling
- Logs authentication failures for monitoring

**Before:**
```typescript
jwt.verify(token, JWT_SECRET, (err, user) => {
  if (err) {
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
  req.user = user;
  next();
});
```

**After:**
```typescript
const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };

// Verify user still exists in database
const userExists = await db.query.users.findFirst({
  where: eq(users.id, decoded.id),
  columns: { id: true, email: true, role: true },
});

if (!userExists) {
  return res.status(401).json({ 
    error: "User account no longer exists. Please log in again.",
    code: "USER_NOT_FOUND"
  });
}
```

**Benefits:**
- ✅ Every authenticated request validates user exists
- ✅ Minimal performance overhead (single indexed query)
- ✅ Prevents operations on non-existent users
- ✅ Clear error messages for debugging

### 2. Automatic Logout on 401 (Frontend)

**File:** `frontend/src/lib/api.ts`

**Changes:**
- Added Axios response interceptor
- Detects 401 Unauthorized responses
- Automatically logs out user and redirects to login

**Implementation:**
```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.warn('[API] 401 Unauthorized - logging out user');
      logout();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

**Benefits:**
- ✅ Graceful handling of authentication failures
- ✅ User immediately redirected to login
- ✅ Prevents confusing "logged in but can't do anything" state
- ✅ Works for ALL API calls automatically

## Testing the Improvements

### Test Scenario 1: User Deleted While Logged In

1. Log in as a user
2. Delete that user from the database
3. Try to upload a document or make any authenticated request
4. **Expected:** User automatically logged out and redirected to login page

### Test Scenario 2: Database Cleared

1. Log in as admin@grc.com
2. Clear the database (delete all users)
3. Try to navigate to any protected page
4. **Expected:** User automatically logged out and redirected to login page

### Test Scenario 3: Token Expired

1. Log in and wait 1 hour (token expiration)
2. Try to make any authenticated request
3. **Expected:** User automatically logged out with "Token expired" message

## Additional Improvements to Consider

### 1. Token Refresh Mechanism
Implement refresh tokens to allow users to stay logged in longer without compromising security:
```typescript
// Issue short-lived access token (15 min) + long-lived refresh token (7 days)
const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
```

### 2. User Activity Tracking
Track last_login_at and last_activity_at to detect stale sessions:
```sql
ALTER TABLE users ADD COLUMN last_activity_at TIMESTAMP DEFAULT NOW();
```

### 3. Token Blacklist
For critical operations (password change, account deletion), invalidate existing tokens:
```typescript
// Store revoked tokens in Redis with TTL matching token expiration
await redis.setex(`revoked:${tokenId}`, tokenExpiresIn, 'true');
```

### 4. Graceful User Experience
Show a toast notification before redirecting:
```typescript
if (error.response?.status === 401) {
  toast.error('Your session has expired. Please log in again.');
  setTimeout(() => logout(), 2000); // Give user time to see message
}
```

## Performance Considerations

**Database Query on Every Request:**
- Single indexed query on primary key (users.id)
- Typically < 1ms response time
- Can add Redis caching if needed:

```typescript
// Check Redis cache first
const cached = await redis.get(`user:${decoded.id}`);
if (cached) {
  req.user = JSON.parse(cached);
  return next();
}

// Fallback to database
const userExists = await db.query.users.findFirst(...);
await redis.setex(`user:${decoded.id}`, 300, JSON.stringify(userExists)); // 5 min cache
```

## Security Benefits

1. **Defense in Depth:** Multiple layers of validation
2. **Audit Trail:** Logs all authentication failures
3. **Prompt Detection:** Invalid tokens caught immediately
4. **User Safety:** Automatic logout prevents confused state

## Migration Notes

**No Breaking Changes:**
- Existing valid tokens continue to work
- No database schema changes required
- Frontend automatically adapts to 401 responses

**Deployment:**
1. Deploy backend changes first
2. Deploy frontend changes
3. Monitor logs for USER_NOT_FOUND errors
4. Run automatic seeding to ensure initial users exist

## Related Documentation

- [CHAT_IMPLEMENTATION.md](./CHAT_IMPLEMENTATION.md) - External API authentication
- [DOCUMENT_UPLOAD_DEBUG.md](./DOCUMENT_UPLOAD_DEBUG.md) - Upload debugging guide
- [DATABASE_MIGRATION_FIX.md](./DATABASE_MIGRATION_FIX.md) - Database setup

