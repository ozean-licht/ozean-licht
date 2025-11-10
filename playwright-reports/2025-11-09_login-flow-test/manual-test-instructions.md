# Manual Test Instructions - Admin Login Flow

## Prerequisites

1. **Start the Admin Dashboard:**
   ```bash
   cd /opt/ozean-licht-ecosystem
   pnpm --filter admin dev
   ```
   Should start on port 9200

2. **Verify MCP Gateway is Running:**
   ```bash
   curl http://localhost:8100/health
   ```

## Test Steps

### Step 1: Navigate to Login Page
1. Open browser to: http://localhost:9200/login
2. **Capture Screenshot:** `01-initial-login-page.png`
3. **Check Console:** Open DevTools Console (F12)
4. **Expected:** Login form visible with email/password fields

### Step 2: Fill Login Form
1. Enter email: `super@ozean-licht.dev`
2. Enter password: `SuperAdmin123!`
3. **Capture Screenshot:** `02-form-filled.png`
4. **Check:** Form validation (if any)

### Step 3: Submit Form
1. Click "Sign In" button (or equivalent)
2. **Capture Screenshot:** `03-after-submit.png`
3. **Monitor:** Network tab for POST requests
4. **Check Console:** For any errors or logs

### Step 4: Post-Login State
1. Wait for redirect/page change
2. **Capture Screenshot:** `04-post-login-page.png`
3. **Note Current URL:** Should be `/dashboard` or similar
4. **Check:**
   - Session cookie set?
   - User authenticated?
   - 404 page shown? (expected if dashboard not implemented)

### Step 5: Verify Authentication
1. Check browser cookies for `next-auth.session-token`
2. Check browser localStorage/sessionStorage
3. **Capture Screenshot:** `05-auth-state.png` (DevTools Application tab)

## Data to Collect

### Network Requests
```
POST /api/auth/signin/credentials
- Status code: ?
- Response body: ?
- Headers: ?

GET /api/auth/session
- Status code: ?
- Response: ?
```

### Console Logs
```
[Document all console.log, console.error, console.warn messages]
```

### Cookies
```
next-auth.session-token: ?
next-auth.csrf-token: ?
next-auth.callback-url: ?
```

### Final URL
```
Expected: http://localhost:9200/dashboard
Actual: ?
```

## Expected vs Actual Behavior

| Step | Expected | Actual | Status |
|------|----------|--------|--------|
| Login page loads | Form visible | ? | ? |
| Submit credentials | Redirect to /dashboard | ? | ? |
| Dashboard page | 404 (not implemented) | ? | ? |
| Session cookie | Set | ? | ? |
| Console errors | None (or documented) | ? | ? |

## Questions to Answer

1. ✓ Does the login form render correctly?
2. ✓ Does form validation work (if implemented)?
3. ✓ Does the authentication request succeed?
4. ✓ Is the session token created?
5. ✓ Does redirect happen after successful login?
6. ✓ What page is shown after redirect?
7. ✓ Are there any console errors?
8. ✓ Are there any network errors?

## Save All Data

Save screenshots to:
```
/opt/ozean-licht-ecosystem/playwright-reports/2025-11-09_login-flow-test/
```

Document all findings in the main report file.
