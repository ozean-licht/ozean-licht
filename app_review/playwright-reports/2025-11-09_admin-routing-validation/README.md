# Admin Dashboard Routing Validation

This directory contains a Playwright validation script to investigate routing behavior in the admin dashboard.

## Quick Start

```bash
cd /opt/ozean-licht-ecosystem/playwright-reports/2025-11-09_admin-routing-validation

# Install dependencies
npm install

# Run validation (ensure admin dev server is running on port 9200)
npm run validate
```

## What This Script Does

1. **Tests three routes:**
   - `http://localhost:9200/` (root)
   - `http://localhost:9200/dashboard` (dashboard)
   - `http://localhost:9200/login` (login page)

2. **Captures for each route:**
   - HTTP status codes
   - Redirect chains (if any)
   - Final URL after redirects
   - Page title
   - Console errors
   - Full-page screenshot
   - Body content preview

3. **Generates report:**
   - `validation-report.md` - Comprehensive markdown report
   - `screenshots/` - Visual evidence of each page

## Prerequisites

1. Admin dev server must be running:
   ```bash
   cd /opt/ozean-licht-ecosystem
   pnpm --filter admin dev
   ```

2. Server should be accessible at `http://localhost:9200`

## Expected Behavior

Based on `apps/admin/middleware.ts`:
- `/` should redirect to `/dashboard` (if authenticated) or `/login` (if not)
- `/dashboard` should be accessible or redirect to `/login`
- `/login` should always be accessible

## Output

After running, you'll find:
- `validation-report.md` - Full validation report with screenshots
- `screenshots/01-root.png` - Screenshot of root route
- `screenshots/02-dashboard.png` - Screenshot of dashboard route
- `screenshots/03-login.png` - Screenshot of login route

## Troubleshooting

**Error: "connect ECONNREFUSED"**
- Ensure admin dev server is running on port 9200

**Empty screenshots or errors**
- Check server logs for Next.js errors
- Verify no build errors in admin app

**404 on /dashboard**
- Check that `apps/admin/app/(dashboard)/page.tsx` exists
- Verify middleware is not blocking route
- Check Next.js routing configuration

## Manual Validation Alternative

If the script fails, you can manually test:

```bash
# Test each route with curl
curl -I http://localhost:9200/
curl -I http://localhost:9200/dashboard
curl -I http://localhost:9200/login

# Check for redirects
curl -L -v http://localhost:9200/dashboard 2>&1 | grep -E "(HTTP|Location)"
```

## Context

This validation was created to investigate reports of 404 errors on `/dashboard` route. The script provides evidence of actual routing behavior vs. expected behavior.

**Date Created:** 2025-11-09
**Purpose:** Urgent routing validation for admin dashboard
**Issue:** Dashboard route reportedly returning 404
