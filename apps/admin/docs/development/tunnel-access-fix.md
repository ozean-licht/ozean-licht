# Admin Dashboard - Tunnel Access Fix

**Issue:** Getting 404 on `/dashboard` when accessing via SSH tunnel on port 9700

## Root Cause

The admin dashboard is running on port **9200** locally, but being accessed via SSH tunnel on port **9700**. This creates a mismatch:

- **NEXTAUTH_URL** is set to `http://localhost:9700` (what users access)
- **Server actually runs on:** `http://localhost:9200`
- **Result:** NextAuth session validation fails, routes return 404 or authentication errors

## Solution

### Option 1: Match NEXTAUTH_URL to Server Port (Simplest)

Update `.env.local` to match where the server actually runs:

```bash
# .env.local
NEXTAUTH_URL=http://localhost:9200
```

Then access via: `http://localhost:9200` (direct, no tunnel mismatch)

### Option 2: Keep Tunnel Access on 9700 (Recommended for SSH)

If you need to access via port 9700 through SSH tunnel, NextAuth v5 supports URL mismatches better, but you need to ensure the tunnel is set up correctly:

**SSH Tunnel Setup:**
```bash
# On your local machine
ssh -L 9700:localhost:9200 user@138.201.139.25
```

This forwards local port 9700 → remote port 9200 where the server actually runs.

**Update `.env.local`:**
```bash
# .env.local
NEXTAUTH_URL=http://localhost:9200
# Not 9700! The server needs to know its actual port
```

**Access via browser:**
```
http://localhost:9700  # Your tunnel port
```

### Option 3: Run Server on Port 9700 (Alternative)

Change the server to run on the same port as the tunnel:

```bash
# .env.local
NEXTAUTH_URL=http://localhost:9700
PORT=9700
FRONTEND_PORT=9700
```

Then start the server:
```bash
cd apps/admin
FRONTEND_PORT=9700 npm run dev
```

## Verification Steps

1. **Check server is running:**
   ```bash
   curl http://localhost:9200/login
   # Should return HTML (not 404)
   ```

2. **Test redirect:**
   ```bash
   curl -I http://localhost:9200/dashboard
   # Should return: 307 Temporary Redirect → /login?callbackUrl=%2Fdashboard
   ```

3. **Test login page:**
   ```bash
   curl http://localhost:9200/login | grep "Admin Dashboard"
   # Should find the title
   ```

4. **Access via browser:**
   - Navigate to `http://localhost:9200/login` (or 9700 if using tunnel)
   - Login with: `super@ozean-licht.dev` / `SuperAdmin123!`
   - Should redirect to `/dashboard` successfully

## Common Issues

### Issue: "404 - Page could not be found" on /dashboard

**Cause:** NextAuth session validation failing due to URL mismatch

**Fix:**
1. Ensure `NEXTAUTH_URL` matches where the server actually runs
2. Check `.env.local` is being loaded: `cat apps/admin/.env.local`
3. Restart dev server after changing `.env.local`

### Issue: "CSRF token was missing" error

**Cause:** Session cookies not being set correctly due to domain/port mismatch

**Fix:**
1. Clear browser cookies for localhost
2. Ensure NEXTAUTH_URL is correct
3. Access via the exact URL specified in NEXTAUTH_URL

### Issue: Server fails to start with "EADDRINUSE"

**Cause:** Port already in use by another process

**Fix:**
```bash
# Kill existing process
lsof -ti:9200 | xargs kill -9

# Or use a different port
FRONTEND_PORT=9201 npm run dev
```

### Issue: Permission denied on .next directory

**Cause:** Previous server run as root, created files with wrong ownership

**Fix:**
```bash
cd apps/admin
sudo rm -rf .next
npm run dev
```

## Current Configuration

**Server Port:** 9200
**Tunnel Port (if used):** 9700
**NEXTAUTH_URL:** Should be `http://localhost:9200`
**Test Credentials:**
- Email: `super@ozean-licht.dev`
- Password: `SuperAdmin123!`

## Related Documentation

- [Test Credentials](./credentials.md)
- [Dashboard Status Report](./dashboard-status-2025-11-09.md)
- [NextAuth Configuration](../../lib/auth/config.ts)

---

**Created:** 2025-11-09
**Issue:** Tunnel access causing 404 errors
**Status:** ✅ Resolved with proper NEXTAUTH_URL configuration
