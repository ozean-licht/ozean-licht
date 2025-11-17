# Plan: Storybook Shared Users DB Authentication Integration

## Task Description

Implement authentication for the Ozean Licht Storybook application using the existing `shared_users_db` database. This will enable controlled access to the component documentation while maintaining the public documentation model with optional authenticated features (commenting, AI chat, personalization).

## Objective

Add NextAuth.js-based authentication to Storybook that:
- Integrates with `shared_users_db` for unified authentication across the ecosystem
- Provides optional login (public access by default, enhanced features when authenticated)
- Follows the admin dashboard's authentication patterns
- Enables future authenticated features (commenting on components, AI chat integration)
- Maintains the current public-facing Storybook deployment

## Problem Statement

Currently, Storybook at `storybook.ozean-licht.dev` is publicly accessible without authentication. While this is appropriate for public documentation, it limits advanced features that require user context:

1. **Commenting System**: Cannot implement component commenting without user authentication
2. **AI Chat Integration**: Claude Agent SDK integration would benefit from user-specific context
3. **Personalization**: Cannot save user preferences or bookmarks
4. **Audit Trail**: No visibility into who's viewing/using components
5. **Access Control**: Cannot restrict certain internal components if needed

The solution must preserve public access while enabling optional authentication for enhanced features.

## Solution Approach

Implement a **hybrid authentication model** that mirrors the admin dashboard's NextAuth.js setup but adapted for Storybook:

### Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│              Storybook Application Flow                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Public Access (Default)                                    │
│  ├─ View all components                                     │
│  ├─ Read documentation                                      │
│  └─ Test component variations                              │
│                                                             │
│  Authenticated Access (Enhanced)                            │
│  ├─ Comment on components                                   │
│  ├─ AI chat assistance (CMD+K)                             │
│  ├─ Save preferences                                        │
│  ├─ Bookmark components                                     │
│  └─ View usage analytics                                    │
│                                                             │
│  Authentication Layer                                       │
│  ├─ NextAuth.js v5 (like admin)                           │
│  ├─ shared_users_db connection                            │
│  ├─ JWT sessions                                           │
│  └─ Cookie-based auth                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Technical Decisions

1. **NextAuth.js v5**: Use same version as admin dashboard for consistency
2. **Database**: Direct PostgreSQL connection to `shared_users_db` (auth pool pattern)
3. **Session Strategy**: JWT (not database sessions) for Storybook compatibility
4. **UI Integration**: Custom login addon in Storybook toolbar
5. **Deployment**: No changes to Coolify deployment (just environment variables)

### Benefits

- ✅ Unified authentication across ecosystem
- ✅ Low latency (direct database connection, 5-10ms like admin)
- ✅ No breaking changes (public access maintained)
- ✅ Future-proof for commenting and AI features
- ✅ Follows established patterns (admin dashboard reference)

## Relevant Files

### Existing Files (Reference)

- **`apps/admin/lib/auth/config.ts`** - NextAuth.js configuration pattern to follow
- **`apps/admin/lib/db/auth-pool.ts`** - PostgreSQL connection pool implementation
- **`apps/admin/lib/auth/utils.ts`** - Password verification utilities
- **`apps/admin/app/api/auth/[...nextauth]/route.ts`** - API route handler pattern
- **`shared/database/README.md`** - Database schema documentation
- **`apps/storybook/.storybook/main.ts`** - Storybook main configuration
- **`apps/storybook/.storybook/preview.ts`** - Storybook preview configuration
- **`apps/storybook/package.json`** - Dependencies to extend

### New Files

#### Core Authentication Files

- **`apps/storybook/lib/auth/config.ts`** - NextAuth.js configuration for Storybook
- **`apps/storybook/lib/auth/utils.ts`** - Authentication utilities (password verification, user fetching)
- **`apps/storybook/lib/auth/middleware.ts`** - Optional authentication middleware
- **`apps/storybook/lib/db/auth-pool.ts`** - PostgreSQL connection pool for auth
- **`apps/storybook/app/api/auth/[...nextauth]/route.ts`** - NextAuth API routes

#### UI Components

- **`apps/storybook/.storybook/addons/auth-toolbar.tsx`** - Login/logout toolbar addon
- **`apps/storybook/components/auth/LoginModal.tsx`** - Login modal component
- **`apps/storybook/components/auth/UserMenu.tsx`** - User menu dropdown

#### Types & Utilities

- **`apps/storybook/types/auth.d.ts`** - NextAuth type definitions
- **`apps/storybook/lib/auth/session-provider.tsx`** - SessionProvider wrapper

## Implementation Phases

### Phase 1: Foundation (Environment & Dependencies)

**Goal**: Set up environment configuration and install required dependencies

**Tasks**:
- Add environment variables for `shared_users_db` connection
- Install NextAuth.js v5 and required dependencies
- Configure TypeScript types for NextAuth
- Create basic auth directory structure

**Validation**: Dependencies installed, environment configured

### Phase 2: Core Authentication (NextAuth Setup)

**Goal**: Implement NextAuth.js configuration with shared_users_db integration

**Tasks**:
- Create PostgreSQL auth pool (mirroring admin pattern)
- Configure NextAuth.js with CredentialsProvider
- Implement user lookup and password verification
- Set up JWT session strategy
- Create NextAuth API routes

**Validation**: NextAuth endpoints respond, database connection works

### Phase 3: Integration & Polish (Storybook UI)

**Goal**: Integrate authentication into Storybook UI and test end-to-end

**Tasks**:
- Create auth toolbar addon for login/logout
- Build login modal component
- Add session provider to preview
- Update preview decorators for user context
- Add authentication status to globalTypes
- Test authentication flow end-to-end

**Validation**: Users can log in, session persists, logout works

## Step by Step Tasks

### 1. Environment Configuration

- Create `.env.local` in `apps/storybook/` directory
- Add `shared_users_db` connection string:
  ```env
  # Authentication Database
  SHARED_USERS_DB_URL=postgresql://user:password@host:5430/shared_users_db

  # NextAuth Configuration
  AUTH_SECRET=<generate-32-char-secret>
  NEXTAUTH_SECRET=<same-as-auth-secret>
  NEXTAUTH_URL=https://storybook.ozean-licht.dev
  NEXTAUTH_URL_INTERNAL=http://localhost:6006
  ```
- Generate secure AUTH_SECRET: `openssl rand -base64 48`
- Add environment variables to Coolify deployment configuration

### 2. Install Dependencies

- Install NextAuth.js v5 and database dependencies:
  ```bash
  cd apps/storybook
  npm install next-auth@beta pg @types/pg bcrypt @types/bcrypt
  ```
- Update `package.json` scripts if needed for Next.js compatibility
- Verify Storybook + Next.js compatibility

### 3. Create PostgreSQL Auth Pool

- Create `apps/storybook/lib/db/auth-pool.ts`
- Copy implementation from `apps/admin/lib/db/auth-pool.ts`
- Adjust for Storybook-specific configuration
- Add connection pooling (min: 2, max: 10)
- Implement health check function

### 4. Create Authentication Utilities

- Create `apps/storybook/lib/auth/utils.ts`
- Copy password verification from admin: `verifyPassword()`
- Add user fetching helper: `getUserByEmail()`
- Add user entity checking: `hasStorybookAccess()`
- Export all utility functions

### 5. Configure NextAuth.js

- Create `apps/storybook/lib/auth/config.ts`
- Configure CredentialsProvider with email/password
- Implement `authorize()` function:
  - Query `users` table by email
  - Verify password hash
  - Check `user_entities` for 'OZEAN_LICHT' or 'ADMIN' access
  - Return user object with role and permissions
- Set up JWT session strategy
- Configure session and JWT callbacks
- Set cookie configuration for `.ozean-licht.dev` domain

### 6. Create NextAuth API Routes

- Create `apps/storybook/app/api/auth/[...nextauth]/route.ts`
- Export NextAuth handlers: `{ GET, POST }`
- Follow Next.js App Router pattern
- Test endpoints: `/api/auth/session`, `/api/auth/signin`

### 7. Create TypeScript Definitions

- Create `apps/storybook/types/auth.d.ts`
- Extend NextAuth types with custom user properties:
  ```typescript
  declare module 'next-auth' {
    interface User {
      id: string;
      email: string;
      role?: string;
      entityScope?: string;
    }
    interface Session {
      user: User;
    }
  }
  ```

### 8. Create Session Provider Component

- Create `apps/storybook/lib/auth/session-provider.tsx`
- Wrap NextAuth SessionProvider for Storybook context
- Export custom hook: `useStorybookAuth()`
- Handle loading and error states

### 9. Build Login UI Components

- Create `apps/storybook/components/auth/LoginModal.tsx`:
  - Email and password fields
  - Submit handler using `signIn()`
  - Error message display
  - Ozean Licht branding (turquoise, glass morphism)
  - Close on successful login
- Create `apps/storybook/components/auth/UserMenu.tsx`:
  - Display user email
  - Logout button
  - User role badge
  - Dropdown menu styled with Ozean Licht design

### 10. Create Auth Toolbar Addon

- Create `apps/storybook/.storybook/addons/auth-toolbar.tsx`
- Register as TOOL type addon in `.storybook/manager.ts`
- Display login button when unauthenticated
- Display user menu when authenticated
- Use Storybook addon API for state management
- Position in toolbar next to theme switcher

### 11. Integrate Auth into Preview

- Update `.storybook/preview.ts`:
  - Import SessionProvider
  - Add SessionProvider to decorators (wrap all stories)
  - Add `authStatus` to globalTypes for debugging
  - Create decorator to inject user context into stories
- Test that session is available in stories via `useSession()`

### 12. Update Storybook Configuration

- Update `.storybook/main.ts`:
  - Add auth toolbar addon to `addons` array
  - Configure Vite to handle Next.js auth routes (if needed)
  - Add environment variable passthrough
- Update `.storybook/manager.ts`:
  - Import and register auth toolbar addon
  - Configure addon behavior (always visible)

### 13. Add Authentication Middleware (Optional)

- Create `apps/storybook/lib/auth/middleware.ts`
- Implement optional route protection (for future private stories)
- Export `requireAuth` wrapper function
- Configure ignored routes (all public by default)

### 14. Create Test Users

- Use existing admin test user creation script
- Add test users with different roles:
  - `storybook.viewer@test.com` - Basic viewer
  - `storybook.commenter@test.com` - Can comment
  - `storybook.admin@test.com` - Full access
- Insert into `users` and `user_entities` tables
- Document credentials in `apps/storybook/docs/TEST_CREDENTIALS.md`

### 15. End-to-End Testing

- Start Storybook development server: `pnpm storybook`
- Test authentication flow:
  1. Click login button in toolbar
  2. Enter test credentials
  3. Verify login success and session creation
  4. Verify user menu appears with correct email
  5. Refresh page - verify session persists
  6. Click logout - verify session cleared
- Test public access (unauthenticated browsing)
- Test with different user roles
- Verify cookies set correctly

### 16. Update Documentation

- Update `apps/storybook/README.md` with authentication section
- Document authentication architecture in `docs/` folder
- Create user guide for login/logout
- Document environment variables needed
- Add troubleshooting section

### 17. Deployment Configuration

- Add environment variables to Coolify:
  - `SHARED_USERS_DB_URL`
  - `AUTH_SECRET`
  - `NEXTAUTH_URL=https://storybook.ozean-licht.dev`
- Verify cookie domain configuration (`.ozean-licht.dev`)
- Test production build: `pnpm build`
- Deploy to Coolify and verify

### 18. Security Hardening

- Verify HTTPS-only cookies in production
- Implement rate limiting on login endpoint (optional)
- Add CSRF protection (NextAuth.js handles this)
- Audit session expiration (default 30 days, consider shorter)
- Test cross-site cookie behavior

### 19. Performance Validation

- Measure authentication overhead (should be < 10ms like admin)
- Test connection pool under load
- Verify no performance impact on public access
- Check bundle size increase (NextAuth adds ~150KB)

### 20. Final Integration Testing

- Test on all browsers (Chrome, Firefox, Safari)
- Test on mobile devices
- Verify no breaking changes to existing stories
- Test with/without authentication
- Verify all environment variables work in production
- Complete final smoke test checklist

## Testing Strategy

### Unit Tests

**File**: `apps/storybook/lib/auth/utils.test.ts`

Test authentication utilities:
```typescript
import { verifyPassword, getUserByEmail } from './utils';

describe('Auth Utils', () => {
  test('verifyPassword returns true for valid password', async () => {
    const hash = await bcrypt.hash('password123', 10);
    const result = await verifyPassword('password123', hash);
    expect(result).toBe(true);
  });

  test('getUserByEmail fetches user from database', async () => {
    const user = await getUserByEmail('test@test.com');
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@test.com');
  });
});
```

### Integration Tests

**File**: `apps/storybook/lib/auth/config.test.ts`

Test NextAuth.js configuration:
```typescript
import { handlers } from './config';

describe('NextAuth Config', () => {
  test('POST /api/auth/signin returns 200 for valid credentials', async () => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'password123',
      }),
    });
    expect(response.status).toBe(200);
  });

  test('Session contains user data after login', async () => {
    const session = await auth();
    expect(session?.user).toHaveProperty('email');
  });
});
```

### End-to-End Tests

**File**: `apps/storybook/tests/auth.e2e.test.ts`

Use Playwright or Cypress:
```typescript
import { test, expect } from '@playwright/test';

test('User can log in and out', async ({ page }) => {
  await page.goto('http://localhost:6006');

  // Click login button
  await page.click('[data-testid="auth-toolbar-login"]');

  // Fill login form
  await page.fill('[name="email"]', 'test@test.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('[type="submit"]');

  // Verify logged in
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  await expect(page.locator('text=test@test.com')).toBeVisible();

  // Logout
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout-button"]');

  // Verify logged out
  await expect(page.locator('[data-testid="auth-toolbar-login"]')).toBeVisible();
});
```

### Edge Cases to Test

1. **Expired sessions**: Verify auto-logout after JWT expiration
2. **Concurrent logins**: Test same user on multiple devices
3. **Invalid credentials**: Verify error messages
4. **Network errors**: Test database connection failures
5. **Cookie edge cases**: Test with cookies disabled, cross-domain scenarios
6. **CSRF protection**: Verify NextAuth CSRF tokens work
7. **Session persistence**: Test page refresh with active session
8. **Role-based access**: Verify different roles see appropriate UI

## Acceptance Criteria

### Functional Requirements

- ✅ Users can log in with email and password
- ✅ Users can log out successfully
- ✅ Session persists across page refreshes
- ✅ Public access remains unchanged (no authentication required by default)
- ✅ Login UI matches Ozean Licht design system (turquoise, glass morphism)
- ✅ User menu shows email and role
- ✅ Authentication uses `shared_users_db` successfully
- ✅ Multiple user roles supported (viewer, commenter, admin)

### Technical Requirements

- ✅ NextAuth.js v5 properly configured
- ✅ Direct PostgreSQL connection with connection pooling
- ✅ JWT session strategy implemented
- ✅ Cookies configured for `.ozean-licht.dev` domain
- ✅ TypeScript types properly extended
- ✅ No breaking changes to existing Storybook functionality
- ✅ Auth toolbar addon registered and functional
- ✅ Session provider wraps all stories

### Security Requirements

- ✅ Passwords hashed with bcrypt (verified from database)
- ✅ HTTPS-only cookies in production
- ✅ CSRF protection enabled (NextAuth default)
- ✅ JWT tokens properly signed and validated
- ✅ No sensitive data in client-side code
- ✅ Environment variables not exposed to client
- ✅ Session expiration enforced (30 day default)

### Performance Requirements

- ✅ Authentication check < 10ms (direct database connection)
- ✅ No impact on public page load time
- ✅ Bundle size increase < 200KB
- ✅ Database connection pool efficiently managed

### User Experience Requirements

- ✅ Login modal opens smoothly from toolbar
- ✅ Error messages clear and helpful
- ✅ Loading states shown during authentication
- ✅ Session status visible in toolbar
- ✅ Logout confirmation (optional)
- ✅ Mobile-friendly login UI

### Deployment Requirements

- ✅ Coolify environment variables configured
- ✅ Production build succeeds
- ✅ Authentication works on production domain
- ✅ Database connectivity from Coolify server
- ✅ No downtime during deployment

## Validation Commands

Execute these commands to validate the implementation:

**Environment Setup**:
```bash
# Verify environment variables
grep -E "SHARED_USERS_DB_URL|AUTH_SECRET|NEXTAUTH" apps/storybook/.env.local

# Verify dependencies installed
cd apps/storybook && npm list next-auth pg bcrypt
```

**Database Connection**:
```bash
# Test database connection from Storybook directory
cd apps/storybook
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.SHARED_USERS_DB_URL });
pool.query('SELECT NOW()').then(r => console.log('✅ DB Connected:', r.rows[0].now)).catch(e => console.error('❌ DB Error:', e.message));
"
```

**Build Validation**:
```bash
# Build Storybook
cd apps/storybook
pnpm build

# Verify no TypeScript errors
pnpm typecheck

# Verify no build errors
ls -lh storybook-static/
```

**Runtime Validation**:
```bash
# Start Storybook dev server
pnpm storybook

# Test authentication endpoint (in another terminal)
curl http://localhost:6006/api/auth/session
# Expected: {"user":null} (when not authenticated)

# Test login endpoint
curl -X POST http://localhost:6006/api/auth/signin/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
# Expected: 302 redirect or session token
```

**End-to-End Validation**:
```bash
# Run E2E tests (if implemented)
pnpm test:e2e

# Manual testing checklist:
# 1. Open http://localhost:6006
# 2. Click login button in toolbar
# 3. Enter credentials and submit
# 4. Verify user menu appears
# 5. Refresh page - verify still logged in
# 6. Click logout - verify logged out
# 7. Browse stories without auth - verify works
```

## Notes

### Dependencies

Add to `apps/storybook/package.json`:

```json
{
  "dependencies": {
    "next-auth": "^5.0.0-beta.20",
    "pg": "^8.11.3",
    "bcrypt": "^5.1.1"
  },
  "devDependencies": {
    "@types/pg": "^8.10.9",
    "@types/bcrypt": "^5.0.2"
  }
}
```

### NextAuth.js v5 Beta Notes

- Using beta version for consistency with admin dashboard
- Stable enough for production (admin uses it successfully)
- `AUTH_SECRET` replaces `NEXTAUTH_SECRET` (both supported for compatibility)
- `trustHost: true` required for deployment behind reverse proxy (Coolify/Traefik)

### Database Schema Reference

**Users Table** (`shared_users_db.users`):
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**User Entities Table** (`shared_users_db.user_entities`):
```sql
CREATE TABLE user_entities (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    entity_type VARCHAR(50) NOT NULL, -- 'OZEAN_LICHT' | 'KIDS_ASCENSION'
    role VARCHAR(50) NOT NULL,        -- 'USER' | 'ADMIN'
    is_active BOOLEAN DEFAULT true
);
```

### Authentication Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. Click Login
       ▼
┌─────────────────┐
│  Login Modal    │
│  (Storybook)    │
└──────┬──────────┘
       │
       │ 2. Submit credentials
       ▼
┌──────────────────────────┐
│  NextAuth API Route      │
│  /api/auth/signin        │
└──────┬───────────────────┘
       │
       │ 3. Query database
       ▼
┌──────────────────────────┐
│  shared_users_db         │
│  - users table           │
│  - user_entities table   │
└──────┬───────────────────┘
       │
       │ 4. Verify password
       ▼
┌──────────────────────────┐
│  bcrypt.compare()        │
└──────┬───────────────────┘
       │
       │ 5. Create JWT
       ▼
┌──────────────────────────┐
│  JWT Session Token       │
│  Set-Cookie header       │
└──────┬───────────────────┘
       │
       │ 6. Return to browser
       ▼
┌─────────────────────────┐
│  Storybook UI           │
│  - User Menu visible    │
│  - Session in context   │
└─────────────────────────┘
```

### Future Enhancements

After authentication is implemented, these features become possible:

1. **Component Commenting**: Users can leave comments on specific components
2. **AI Chat Integration**: Personalized AI assistance via Claude Agent SDK
3. **Bookmarks**: Save favorite components for quick access
4. **Usage Analytics**: Track which components are viewed most
5. **Private Components**: Optionally restrict certain internal components
6. **User Preferences**: Save theme, sidebar state, favorite categories

### Security Best Practices

1. **Never log passwords**: Use generic error messages ("Invalid credentials")
2. **Rate limit login attempts**: Consider adding rate limiting (not in MVP)
3. **Secure cookie flags**: `httpOnly`, `secure` (HTTPS), `sameSite: 'lax'`
4. **JWT expiration**: Default 30 days (configurable)
5. **Environment variables**: Never commit `.env.local` to Git
6. **Database credentials**: Use read-only user for auth pool (optional enhancement)

### Troubleshooting Guide

**Problem**: "Database connection failed"
- **Solution**: Verify `SHARED_USERS_DB_URL` is correct
- **Check**: `psql $SHARED_USERS_DB_URL -c "SELECT 1"`

**Problem**: "Invalid credentials" for known-good password
- **Solution**: Check password hash format in database
- **Debug**: Log password verification in `authorize()` function

**Problem**: "Session not persisting"
- **Solution**: Check cookie domain configuration
- **Verify**: Cookies set to `.ozean-licht.dev` in production

**Problem**: "NextAuth API routes not found"
- **Solution**: Verify file structure: `app/api/auth/[...nextauth]/route.ts`
- **Check**: Storybook + Next.js compatibility configuration

**Problem**: "CORS errors on API routes"
- **Solution**: Verify `trustHost: true` in NextAuth config
- **Check**: Reverse proxy headers in Coolify/Traefik

### Reference Documentation

- **Admin Auth Implementation**: `apps/admin/lib/auth/config.ts` (lines 1-210)
- **Shared Users DB Schema**: `shared/database/README.md` (lines 216-315)
- **NextAuth.js v5 Docs**: https://authjs.dev/getting-started/introduction
- **Storybook Addons API**: https://storybook.js.org/docs/addons/writing-addons
- **PostgreSQL Node.js**: https://node-postgres.com/

---

**Plan Version**: 1.0.0
**Created**: 2025-11-16
**Task Type**: Feature
**Complexity**: Medium
**Estimated Time**: 8-12 hours
**Priority**: High (enables commenting and AI features)
