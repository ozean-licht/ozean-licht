# Admin Dashboard Login Flow Test

**Test Date:** 2025-11-09
**Test Subject:** Admin authentication flow validation
**Test URL:** http://localhost:9200/login

## Overview

This test suite validates the complete login flow for the admin dashboard, including:
- Login page rendering
- Form interaction
- Authentication request
- Session creation
- Post-login redirect
- Error handling

## Files in This Directory

- `README.md` - This file
- `playwright-report-admin-login-flow.md` - Comprehensive test report (generated)
- `automated-login-test.js` - Playwright test script
- `run-test.sh` - Test execution script
- `manual-test-instructions.md` - Manual testing guide
- `test-results.json` - Structured test data (generated)
- `*.png` - Screenshots captured during test (generated)

## Quick Start

### Automated Test (Recommended)

```bash
# 1. Ensure admin dashboard is running
cd /opt/ozean-licht-ecosystem
pnpm --filter admin dev  # Runs on port 9200

# 2. Run the test (in a new terminal)
cd /opt/ozean-licht-ecosystem/playwright-reports/2025-11-09_login-flow-test
chmod +x run-test.sh
./run-test.sh
```

### Manual Test

If you prefer to test manually or the automated test fails:

1. Follow instructions in `manual-test-instructions.md`
2. Capture screenshots as specified
3. Document findings in `playwright-report-admin-login-flow.md`

## Test Credentials

**Email:** super@ozean-licht.dev
**Password:** SuperAdmin123!

These credentials are documented in `apps/admin/app_docs/TEST_USERS_CREDENTIALS.md`

## Prerequisites

1. **Admin Dashboard Running**
   ```bash
   # Terminal 1
   cd /opt/ozean-licht-ecosystem
   pnpm --filter admin dev
   ```
   Should be accessible at http://localhost:9200

2. **Node.js and npm** (for automated test)
   - Playwright will be installed automatically if missing

3. **Database** (PostgreSQL with shared_users_db)
   - Test user must exist in database
   - NextAuth tables must be created

## Expected Outcomes

### Success Criteria

1. ✅ Login page renders with email/password form
2. ✅ Form accepts user input
3. ✅ Submit button triggers authentication request
4. ✅ POST request to `/api/auth/signin/credentials` returns 200
5. ✅ Session cookie (`next-auth.session-token`) is set
6. ✅ User is redirected to `/dashboard`
7. ✅ No console errors (except expected 404 if dashboard not implemented)

### Known Expected Behaviors

- **Dashboard 404:** Expected if `/dashboard` page not yet implemented
- **Redirect chain:** May see multiple redirects during auth flow
- **Cookie domain:** Should be set to `localhost` or proper domain

## Troubleshooting

### Admin Dashboard Not Starting

```bash
# Check if port 9200 is already in use
lsof -i :9200

# Kill existing process if needed
kill -9 <PID>

# Restart admin dashboard
pnpm --filter admin dev
```

### Database Connection Issues

```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check database exists
psql -U postgres -h localhost -c "\l" | grep shared_users_db

# Verify test user exists
psql -U postgres -h localhost -d shared_users_db \
  -c "SELECT email FROM users WHERE email = 'super@ozean-licht.dev';"
```

### Playwright Installation Issues

```bash
# Install Playwright browsers
npx playwright install

# Install system dependencies (Linux)
npx playwright install-deps
```

### Test Fails to Find Elements

Check if login page structure matches test selectors:
```javascript
// Current selectors in automated-login-test.js:
input[type="email"], input[name="email"]
input[type="password"], input[name="password"]
button[type="submit"]
```

Update selectors in `automated-login-test.js` if form structure changed.

## Test Output

After running the test, you'll find:

### Screenshots
1. `01-initial-login-page.png` - Login form before interaction
2. `02-form-filled.png` - Form with credentials entered
3. `03-after-submit.png` - Immediate state after submit
4. `04-post-login-page.png` - Final page after redirect
5. `05-auth-state.png` - Authentication state verification

### Reports
- `test-results.json` - Machine-readable test data
- `playwright-report-admin-login-flow.md` - Human-readable comprehensive report

### Data Captured
- Network requests (especially `/api/auth/*`)
- Console logs (errors, warnings, info)
- Cookies set during authentication
- Final URL after login
- Page content at each step

## Next Steps After This Test

1. **Review Results** - Check generated markdown report
2. **Verify Database** - Confirm session entry created
3. **Implement Dashboard** - Create `/dashboard` page if 404 found
4. **Test Logout** - Validate session termination
5. **Error Cases** - Test invalid credentials, expired sessions
6. **Integration** - Verify with MCP Gateway integration

## Integration with Review Phase

This test is part of the preparation for the full admin dashboard review. Results will inform:

- Authentication system status
- UI/UX quality
- Error handling completeness
- Session management robustness
- Production readiness assessment

## Related Documentation

- **Admin App Docs:** `/opt/ozean-licht-ecosystem/apps/admin/app_docs/`
- **NextAuth Config:** `/opt/ozean-licht-ecosystem/apps/admin/lib/auth.ts`
- **Test Users:** `/opt/ozean-licht-ecosystem/apps/admin/app_docs/TEST_USERS_CREDENTIALS.md`
- **Context Map:** `/opt/ozean-licht-ecosystem/CONTEXT_MAP.md`

## Contact

For issues or questions about this test:
1. Check test output and logs first
2. Review related documentation
3. Consult admin app specification docs

---

**Last Updated:** 2025-11-09
**Test Suite Version:** 1.0
**Admin Dashboard Version:** Phase 1 - Pre-deployment
