# Auth Toolbar Fix - Migration Applied

**Date:** 2025-11-17
**Issue:** Auth toolbar not displayed after deployment

---

## What Was Wrong

The original `auth-toolbar.tsx` tried to use React hooks (`useSession`) in the Storybook manager context, but `SessionProvider` only exists in the preview context (different iframe). This caused the addon to fail silently.

---

## What Was Fixed

### 1. Manager Configuration (✅ Fixed)
**File:** `apps/storybook/.storybook/manager.ts`

Changed from broken addon to fixed version:
```typescript
// OLD (broken)
import './addons/auth-toolbar';

// NEW (fixed)
import './addons/auth-toolbar-fixed';
```

### 2. Preview Configuration (✅ Fixed)
**File:** `apps/storybook/.storybook/preview.ts`

Added import and decorator:
```typescript
// Added import
import { withAuthChannelBridge } from './decorators/auth-channel-bridge';

// Added decorator (after SessionProvider)
decorators: [
  (Story) => React.createElement(SessionProvider, {}, React.createElement(Story)),
  withAuthChannelBridge,  // ← NEW
  // ... other decorators
]
```

### 3. Path Aliases (✅ Fixed)
**File:** `apps/storybook/.storybook/main.ts`

Fixed `@` alias to point to storybook directory:
```typescript
resolve: {
  alias: {
    '@': join(__dirname, '..'),  // ← Changed from '../../admin'
    '@admin': join(__dirname, '../../admin'),
    '@shared': join(__dirname, '../../../shared/ui/src'),
  }
}
```

### 4. Channel Bridge Created (✅ Created)
**File:** `apps/storybook/.storybook/decorators/auth-channel-bridge.tsx`

New decorator that bridges authentication state between preview and manager contexts using Storybook's channel API.

---

## How It Works Now

```
┌─────────────────────────────────────────────┐
│  Storybook Manager (Toolbar)                │
│  auth-toolbar-fixed.tsx                     │
│  - Displays login/user info                 │
│  - Listens to channel for auth status       │
│  - Emits channel events for login/logout    │
└─────────────┬───────────────────────────────┘
              │
              │ Channel API (postMessage)
              │ Events: auth-status, trigger-login
              │
┌─────────────▼───────────────────────────────┐
│  Storybook Preview (Stories)                │
│  SessionProvider + AuthChannelBridge        │
│  - Has access to useSession()               │
│  - Emits auth status to channel             │
│  - Renders LoginModal when triggered        │
└─────────────────────────────────────────────┘
```

---

## Verification Steps

### 1. Rebuild Storybook
```bash
cd apps/storybook
pnpm build
```

### 2. Check for Errors
Look for any build errors related to:
- Missing imports
- Path resolution issues
- TypeScript errors

### 3. Deploy and Test

After deployment, check:
1. **Toolbar appears** - Sign In button should be visible in top-right
2. **Click Sign In** - Login modal should appear
3. **Login works** - After successful login, user menu appears
4. **Session persists** - Refresh page, user should still be logged in
5. **Logout works** - Click logout, returns to Sign In button

### 4. Browser Console

Check for these messages:
```
✅ Good:
- No errors about "useSession must be wrapped"
- No errors about missing modules
- Channel events logged (in development)

❌ Bad:
- "useSession must be wrapped in <SessionProvider>"
- "Cannot find module '@/lib/auth/session-provider'"
- "Channel communication failed"
```

---

## Environment Variables Required

Make sure these are set in Coolify:

```env
SHARED_USERS_DB_URL=postgresql://user:password@host:5432/shared_users_db
AUTH_SECRET=<your-secret-from-openssl-rand>
NEXTAUTH_SECRET=<same-as-auth-secret>
NEXTAUTH_URL=https://storybook.ozean-licht.dev
NODE_ENV=production
```

---

## If It Still Doesn't Work

### Check 1: Files Exist
```bash
ls apps/storybook/.storybook/addons/auth-toolbar-fixed.tsx
ls apps/storybook/.storybook/decorators/auth-channel-bridge.tsx
```

### Check 2: Imports are Correct
```bash
# Should see the fixed addon
grep "auth-toolbar-fixed" apps/storybook/.storybook/manager.ts

# Should see channel bridge
grep "withAuthChannelBridge" apps/storybook/.storybook/preview.ts
```

### Check 3: Build Output
```bash
# Rebuild and check for errors
cd apps/storybook
pnpm build 2>&1 | grep -i error
```

### Check 4: Browser DevTools

1. Open Storybook in browser
2. Open DevTools (F12)
3. Check Console tab for errors
4. Check Network tab - look for failed requests to `/api/auth/session`

---

## Common Issues

### Issue: "Cannot find module '@/lib/auth/session-provider'"
**Fix:** Path alias not configured correctly
```bash
# Verify in main.ts
grep "'@':" apps/storybook/.storybook/main.ts
# Should show: '@': join(__dirname, '..'),
```

### Issue: "useSession must be wrapped in <SessionProvider>"
**Fix:** Still using old addon
```bash
# Check manager.ts
grep "auth-toolbar" apps/storybook/.storybook/manager.ts
# Should show: import './addons/auth-toolbar-fixed';
```

### Issue: Login modal doesn't appear
**Fix:** Channel bridge not registered
```bash
# Check preview.ts
grep "withAuthChannelBridge" apps/storybook/.storybook/preview.ts
# Should show decorator registered
```

### Issue: Database connection fails
**Fix:** Environment variables not set
```bash
# In Coolify, verify:
# - SHARED_USERS_DB_URL is correct
# - Database is accessible from Coolify server
# - User has OZEAN_LICHT or ADMIN entity
```

---

## Testing Checklist

After deployment:

- [ ] Storybook loads without errors
- [ ] Auth toolbar visible in top-right
- [ ] "Sign In" button appears
- [ ] Click Sign In → modal appears
- [ ] Enter credentials → login succeeds
- [ ] User menu appears with email
- [ ] Refresh page → session persists
- [ ] Click logout → returns to Sign In
- [ ] No console errors

---

## Success Criteria

✅ All fixes applied
✅ Files created in correct locations
✅ Path aliases configured
✅ No build errors
✅ Ready for redeployment

**Status:** Migration complete, ready to redeploy

---

**Fixed By:** Claude (AI Assistant)
**Date:** 2025-11-17
