# ✅ Admin Dashboard 404 Issue - RESOLVED

**Date:** 2025-11-09
**Issue:** Getting 404 error on `/dashboard` when accessing via SSH tunnel on port 9700

---

## Root Cause

The `NEXTAUTH_URL` was set to `http://localhost:9700` (the tunnel port), but the dev server runs on `http://localhost:9200`. This mismatch caused NextAuth session validation to fail, resulting in 404 errors on protected routes.

---

## The Fix

### ✅ Updated `.env.local`:

```bash
# Before (BROKEN):
NEXTAUTH_URL=http://localhost:9700  # ❌ Wrong - tunnel port, not server port
NEXTAUTH_URL_INTERNAL=http://localhost:9200  # ❌ Not a real NextAuth variable

# After (FIXED):
NEXTAUTH_URL=http://localhost:9200  # ✅ Correct - matches where server runs
```

**Key Rule:** `NEXTAUTH_URL` must always match the port where the Next.js server actually runs, NOT the tunnel port.

---

## How to Access the Dashboard

### Option 1: Direct Access (No Tunnel)
**Best for testing on the server itself**

1. Server is running on: `http://localhost:9200`
2. Open browser to: `http://localhost:9200/login`
3. Login with:
   - Email: `super@ozean-licht.dev`
   - Password: `SuperAdmin123!`
4. You'll be redirected to `/dashboard` ✅

### Option 2: SSH Tunnel Access (For Remote Access)
**For accessing from your local machine**

1. **On your local machine, create SSH tunnel:**
   ```bash
   ssh -L 9700:localhost:9200 adw-user@138.201.139.25
   ```
   This forwards `localhost:9700` (your machine) → `localhost:9200` (server)

2. **Open browser on your local machine:**
   ```
   http://localhost:9700/login
   ```

3. **Login and access dashboard** ✅

**Important:** Keep `NEXTAUTH_URL=http://localhost:9200` in `.env.local` even when using the tunnel!

---

## Current Server Status

```
✅ Server: Running on http://localhost:9200
✅ NEXTAUTH_URL: http://localhost:9200 (FIXED)
✅ Database: Connected to shared-users-db
✅ Test Users: 5 admin users available
✅ Routes: All compiling successfully
```

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | `super@ozean-licht.dev` | `SuperAdmin123!` |
| **KA Admin** | `admin.ka@ozean-licht.dev` | `KidsAdmin123!` |
| **OL Admin** | `admin.ol@ozean-licht.dev` | `OzeanAdmin123!` |
| **Viewer (All)** | `viewer@ozean-licht.dev` | `Viewer123!` |
| **Viewer (KA)** | `viewer.ka@ozean-licht.dev` | `ViewerKA123!` |

Full details: `apps/admin/docs/development/credentials.md`

---

## Verification Steps

Run these commands to verify everything is working:

```bash
# 1. Check server is responding
curl -I http://localhost:9200/login
# Should return: HTTP/1.1 200 OK

# 2. Check dashboard redirects to login (expected behavior)
curl -I http://localhost:9200/dashboard
# Should return: HTTP/1.1 307 Temporary Redirect
# Location: /login?callbackUrl=%2Fdashboard

# 3. Check server logs
# Dev server should show:
#   ✓ Compiled /middleware in 539ms (194 modules)
#   ✓ Ready in 1180ms
```

---

## Why This Happened

1. **Initial Setup:** `NEXTAUTH_URL` was mistakenly set to port 9700 (the tunnel port)
2. **Server Reality:** Next.js dev server runs on port 9200
3. **NextAuth Confusion:** NextAuth tried to validate sessions against port 9700 (which doesn't exist on the server)
4. **Result:** Session validation failed → 404 errors on protected routes

---

## What Was Fixed

1. ✅ **Corrected `NEXTAUTH_URL`** to match actual server port (9200)
2. ✅ **Removed invalid `NEXTAUTH_URL_INTERNAL`** variable (doesn't exist in NextAuth)
3. ✅ **Cleaned `.next` build cache** (had permission issues from root-owned files)
4. ✅ **Restarted dev server** with correct configuration
5. ✅ **Documented tunnel access pattern** for future reference

---

## Important Notes

### For SSH Tunnel Users:

- **Always use:** `NEXTAUTH_URL=http://localhost:9200` (server port)
- **Never use:** `NEXTAUTH_URL=http://localhost:9700` (tunnel port)
- **Tunnel command:** `ssh -L 9700:localhost:9200 user@server`
- **Browser URL:** `http://localhost:9700` (on your local machine)

### For Direct Access:

- **Server URL:** `http://localhost:9200`
- **Browser URL:** `http://localhost:9200`
- **Everything matches** - no tunnel needed

---

## Next Steps

1. **✅ Login to dashboard** using credentials above
2. **Test Phase 1 features** (Specs 1.1-1.7):
   - Layout & Navigation
   - Shared UI Components
   - Data Tables
   - Basic RBAC
   - User Management
   - Audit Logging
3. **Report any issues** found during testing
4. **Review implementation** against spec requirements

---

## Related Documentation

- **Tunnel Access Guide:** `apps/admin/docs/development/tunnel-access-fix.md`
- **Test Credentials:** `apps/admin/docs/development/credentials.md`
- **Dashboard Roadmap:** `apps/admin/docs/admin-dashboard-roadmap.md`
- **Status Report:** `apps/admin/docs/development/dashboard-status-2025-11-09.md`

---

## Quick Commands

```bash
# Start dev server
cd apps/admin
npm run dev

# Check if server is running
curl http://localhost:9200/login

# View server logs
# (Check the terminal where npm run dev is running)

# Access dashboard
# Browser: http://localhost:9200/login (direct)
# Browser: http://localhost:9700/login (via tunnel)
```

---

**Status:** ✅ **RESOLVED**
**Admin Dashboard:** Ready for testing
**Phase 1 Specs (1.1-1.7):** Implemented, awaiting manual testing

🎉 **The dashboard is now accessible!**
