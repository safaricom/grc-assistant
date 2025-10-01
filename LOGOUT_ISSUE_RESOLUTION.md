# Logout Issue Resolution

## Problem
User was getting logged out immediately when accessing the Chat page without any visible errors. Other pages worked fine.

## Root Cause
The issue occurred due to UUID mismatch between JWT tokens and database records:

1. User logged in and received a JWT token containing their user ID (UUID)
2. Database was cleared or recreated (during deployment or container restart)
3. Database seeding recreated users with **new UUIDs**
4. User's browser still had the old JWT token with the **old UUID**
5. When accessing Chat page, the frontend called `/chat/sessions`
6. Auth middleware validated the JWT token signature (valid) but queried the database for the user ID
7. User with old UUID didn't exist in database → 401 response
8. Frontend auto-logout interceptor caught 401 → forced logout → redirected to login

## Why Only Chat Page?
The Chat page immediately loads chat sessions on mount by calling `/chat/sessions`, which requires authentication. Other pages may not make authenticated API calls immediately on load, so the issue wasn't apparent.

## Solution
1. **Improved Auth Middleware Error Message**: Enhanced logging to explain that this usually means database was reset or user was deleted
2. **Better Frontend Error Handling**: Store error message in sessionStorage and display it on login page
3. **User Action Required**: Log out and log back in to get fresh JWT token with correct user ID

## Prevention
To avoid this in production:
- Keep database data persistent across deployments
- Use database migrations without dropping tables
- If database must be reset, clear all user sessions/tokens on the frontend
- Consider using fixed UUIDs for admin/test users in seeding (not recommended for production)

## Files Modified
- `backend/src/middleware/auth.ts` - Improved error logging
- `frontend/src/lib/api.ts` - Store logout reason in sessionStorage
- `frontend/src/pages/Login.tsx` - Display logout reason on login page

## Resolution Steps for User
1. **Clear browser cache/cookies** or use incognito mode
2. **Log in again** to get fresh JWT token with correct user ID
3. Chat and other features should work normally

## Technical Details
- JWT tokens contain user claims (id, email, role) signed by server
- JWT signature validation ensures token wasn't tampered with
- JWT content validation (user exists in DB) ensures user account is still valid
- This two-level validation prevents "zombie" authentication states where token is valid but user doesn't exist
