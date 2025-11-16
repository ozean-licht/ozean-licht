# Plan: Storybook Authentication Integration

## Task Description
Add authentication to the Storybook component library using the shared-user database (same authentication system as the admin dashboard). This will restrict access to the Storybook documentation to authenticated admin users only.

## Objective
Secure the Storybook instance by implementing NextAuth-based authentication that:
- Uses the existing shared-user database (same as admin dashboard)
- Requires admin users to login before accessing component documentation
- Maintains session state across Storybook navigation
- Supports both development and production deployment modes

## Problem Statement
Currently, Storybook is an open, unauthenticated documentation site. For production deployments, we need to restrict access to authenticated admin users only to prevent unauthorized access to internal component documentation and design system specifications.

## Solution Approach
Create a Next.js authentication wrapper application that:
1. Handles authentication using NextAuth with the shared-user database
2. Serves the Storybook build as a protected resource
3. Redirects unauthenticated users to a login page
4. Maintains the existing Storybook functionality while adding auth layer
5. Integrates seamlessly with the existing monorepo structure

**Architecture Decision:**
- Use Next.js wrapper (separate app) rather than modifying Storybook's internals
- Leverage existing admin dashboard auth patterns (NextAuth + PostgreSQL)
- Serve Storybook as static assets from Next.js middleware
- Support both dev mode (proxy to Storybook dev server) and production (serve static build)

## Relevant Files

### Existing Files (Reference)
- `apps/admin/lib/auth/config.ts` - NextAuth configuration pattern to replicate
- `apps/admin/lib/auth/utils.ts` - Password verification utilities
- `apps/admin/lib/db/auth-pool.ts` - PostgreSQL connection pool for auth
- `apps/admin/migrations/001_create_admin_schema.sql` - Database schema reference
- `storybook/config/main.ts` - Storybook configuration
- `storybook/config/preview.ts` - Storybook preview configuration
- `storybook/build/` - Storybook static build output
- `.ports.env` - Port configuration for services

### New Files
- `storybook/auth-wrapper/app/page.tsx` - Root redirect to login or Storybook
- `storybook/auth-wrapper/app/login/page.tsx` - Login page
- `storybook/auth-wrapper/app/api/auth/[...nextauth]/route.ts` - NextAuth API routes
- `storybook/auth-wrapper/app/storybook/[[...path]]/page.tsx` - Storybook viewer (protected)
- `storybook/auth-wrapper/lib/auth/config.ts` - NextAuth configuration
- `storybook/auth-wrapper/lib/db/auth-pool.ts` - Database connection pool
- `storybook/auth-wrapper/middleware.ts` - Next.js middleware for auth protection
- `storybook/auth-wrapper/package.json` - Dependencies
- `storybook/auth-wrapper/next.config.js` - Next.js configuration
- `storybook/auth-wrapper/tsconfig.json` - TypeScript configuration
- `storybook/auth-wrapper/.env.example` - Environment variables template
- `storybook/auth-wrapper/Dockerfile` - Docker container for deployment
- `storybook/auth-wrapper/docker-compose.yml` - Local testing
- `storybook/auth-wrapper/README.md` - Setup and usage documentation

## Implementation Phases

### Phase 1: Foundation Setup
Create the Next.js wrapper application structure and copy authentication patterns from the admin dashboard. Set up the basic project structure with proper TypeScript configuration and dependencies.

### Phase 2: Authentication Implementation
Implement NextAuth configuration, database connection, login page, and session management. This mirrors the admin dashboard authentication but is simplified for read-only Storybook access.

### Phase 3: Storybook Integration
Configure the wrapper to serve Storybook static files in production and proxy to the dev server in development. Add middleware to protect routes and handle redirects.

### Phase 4: Deployment Configuration
Create Docker configuration for Coolify deployment, environment variable setup, and integration with the existing infrastructure.

## Step by Step Tasks

### 1. Create Next.js Wrapper Project Structure
- Create directory: `storybook/auth-wrapper/`
- Initialize Next.js 14+ project with App Router
- Set up TypeScript configuration
- Create basic directory structure (app, lib, public, types)
- Add `.gitignore` for Next.js
- Create `.env.example` with required environment variables

### 2. Install Dependencies
- Add Next.js core dependencies (next, react, react-dom)
- Add NextAuth v5 (`next-auth@beta`)
- Add PostgreSQL client (`pg`, `@types/pg`)
- Add bcrypt for password verification (`bcrypt`, `@types/bcrypt`)
- Add utility dependencies (clsx, tailwind-merge)
- Add Tailwind CSS for styling
- Copy shared-ui dependencies for consistent styling

### 3. Copy and Adapt Authentication Code
- Copy `apps/admin/lib/db/auth-pool.ts` → `storybook/auth-wrapper/lib/db/auth-pool.ts`
- Copy `apps/admin/lib/auth/utils.ts` → `storybook/auth-wrapper/lib/auth/utils.ts`
- Copy `apps/admin/lib/auth/config.ts` → `storybook/auth-wrapper/lib/auth/config.ts`
- Copy `apps/admin/lib/auth/constants.ts` → `storybook/auth-wrapper/lib/auth/constants.ts`
- Simplify auth config (remove RBAC complexity, keep basic admin user check)
- Update paths and imports for new location

### 4. Create TypeScript Types
- Create `types/next-auth.d.ts` for NextAuth session augmentation
- Create `types/auth.ts` for authentication types
- Define minimal user session type (id, email, adminUserId, adminRole)
- Export types from `types/index.ts`

### 5. Implement Login Page
- Create `app/login/page.tsx` with login form
- Copy login form component from admin dashboard
- Style with Ozean Licht design system (cosmic dark theme)
- Add proper error handling and validation
- Include CSRF protection via NextAuth
- Add loading states and error messages

### 6. Create NextAuth API Routes
- Create `app/api/auth/[...nextauth]/route.ts`
- Export NextAuth handlers (GET, POST)
- Configure callback URLs for login/logout
- Set up session strategy (JWT)
- Configure cookie settings for production domain

### 7. Implement Root Page and Redirects
- Create `app/page.tsx` as landing page
- Check authentication status
- Redirect to `/storybook` if authenticated
- Redirect to `/login` if not authenticated
- Add loading state during auth check

### 8. Create Protected Storybook Route
- Create `app/storybook/[[...path]]/page.tsx` for catch-all route
- Implement server-side auth check using NextAuth `auth()` helper
- In development: proxy requests to Storybook dev server (port 6006)
- In production: serve static files from `storybook/build/`
- Handle all Storybook assets (JS, CSS, images, fonts)
- Preserve Storybook routing and deep links

### 9. Implement Next.js Middleware
- Create `middleware.ts` at root level
- Protect `/storybook/*` routes with auth check
- Allow public access to `/login` and `/api/auth/*`
- Redirect unauthenticated users to `/login`
- Add `matcher` config for efficient routing

### 10. Configure Storybook Asset Serving
- Update `next.config.js` to serve Storybook build directory
- Add rewrites for Storybook assets in production
- Configure proper MIME types for Storybook files
- Set up static file caching headers
- Handle iframe embedding (for Storybook preview)

### 11. Create Environment Configuration
- Create `.env.example` with all required variables:
  - `NEXTAUTH_URL` - Base URL for NextAuth
  - `NEXTAUTH_SECRET` - JWT signing secret
  - `AUTH_SECRET` - Alternative secret name (v5 compatibility)
  - `DATABASE_URL` - PostgreSQL connection string
  - `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DATABASE` - DB config
  - `POSTGRES_USER`, `POSTGRES_PASSWORD` - DB credentials
  - `NODE_ENV` - Environment mode
  - `STORYBOOK_DEV_URL` - Dev server URL (default: http://localhost:6006)
- Document all environment variables in README
- Add validation for required env vars

### 12. Set Up Tailwind CSS
- Copy `tailwind.config.js` from admin dashboard
- Adapt for Ozean Licht branding
- Include cosmic dark theme colors
- Add Montserrat and Cinzel fonts
- Configure content paths for wrapper app
- Create `app/globals.css` with base styles

### 13. Create Development Proxy Logic
- Implement proxy function for development mode
- Use Next.js `fetch` to forward requests to Storybook dev server
- Preserve all headers and cookies
- Handle WebSocket connections (for HMR)
- Add error handling for when Storybook dev server is down
- Log proxy requests in development for debugging

### 14. Create Docker Configuration
- Create `Dockerfile` for multi-stage build:
  1. Stage 1: Build Storybook static files
  2. Stage 2: Build Next.js wrapper
  3. Stage 3: Production runtime with both builds
- Create `.dockerignore` to exclude unnecessary files
- Optimize image size (use alpine base)
- Set proper Node.js version (18+)
- Configure health check endpoint

### 15. Create Docker Compose for Local Testing
- Create `docker-compose.yml` for local testing
- Include PostgreSQL service (shared-users-db)
- Include auth wrapper service
- Include Storybook dev server (optional)
- Set up networking between services
- Add volume mounts for development
- Configure environment variables

### 16. Add Coolify Deployment Configuration
- Create deployment configuration in `tools/coolify/storybook-auth.json`
- Set resource UUID for Coolify
- Configure build and deploy commands
- Set environment variables mapping
- Configure domain (e.g., `storybook.ozean-licht.dev`)
- Add health check endpoint configuration
- Set up port mapping (default: 3002)

### 17. Create Logout Functionality
- Add logout button to Storybook wrapper UI
- Create logout API endpoint or use NextAuth signOut
- Clear session and redirect to login
- Add audit logging for logout events

### 18. Add Session Monitoring
- Implement session refresh logic
- Add idle timeout (optional)
- Monitor session in Next.js middleware
- Log authentication events to admin_audit_logs table
- Track last_login_at timestamp

### 19. Create Documentation
- Create `storybook/auth-wrapper/README.md` with:
  - Project overview and architecture
  - Setup instructions (local development)
  - Environment variables documentation
  - Deployment instructions (Coolify)
  - Troubleshooting guide
  - Development vs Production modes
- Update main `CONTEXT_MAP.md` with new structure
- Add deployment guide to `storybook/DEPLOYMENT.md`

### 20. Testing and Validation
- Test login flow (valid credentials)
- Test login flow (invalid credentials)
- Test session persistence across page reloads
- Test logout functionality
- Test protected route access (authenticated)
- Test redirect for unauthenticated access
- Test Storybook functionality through wrapper
- Test deep linking to specific stories
- Test iframe embedding (Storybook preview)
- Test asset loading (JS, CSS, images)
- Verify audit logging (login/logout events)

### 21. Integration Testing
- Test with PostgreSQL database (shared-users-db)
- Test with existing admin users
- Test entity scope permissions (optional feature)
- Test concurrent sessions
- Test session expiration
- Test CSRF protection
- Test cookie security settings
- Test reverse proxy compatibility (Coolify/Traefik)

### 22. Port Configuration
- Add new port to `.ports.env`: `STORYBOOK_AUTH_PORT=3002`
- Update port documentation in README
- Ensure no port conflicts with existing services
- Configure Next.js to use specified port

### 23. Update Monorepo Scripts
- Add script to root `package.json`: `"storybook:auth": "cd storybook/auth-wrapper && pnpm dev"`
- Add build script: `"build:storybook-auth": "cd storybook/auth-wrapper && pnpm build"`
- Add combined script to run both: `"storybook:dev-with-auth": "concurrently \"pnpm storybook\" \"pnpm storybook:auth\""`
- Update `.claude/CLAUDE.md` with new commands

### 24. Security Hardening
- Add rate limiting for login attempts (optional via middleware)
- Configure secure cookie settings for production
- Add Content Security Policy headers
- Configure CORS properly for Storybook iframe
- Add helmet.js or Next.js security headers
- Validate all environment variables on startup
- Add input sanitization for login form
- Configure session timeout (default: 7 days)

### 25. Performance Optimization
- Implement static file caching for Storybook assets
- Add CDN configuration (optional for production)
- Optimize Next.js build for production
- Enable Next.js compression
- Configure proper cache headers
- Lazy load Storybook assets when possible
- Add loading states for better UX

## Testing Strategy

### Unit Tests
- Test auth configuration initialization
- Test password verification utility
- Test database pool connection
- Test session JWT encoding/decoding
- Test middleware route matching logic

### Integration Tests
- Test complete login flow (valid user)
- Test login rejection (invalid credentials)
- Test login rejection (non-admin user)
- Test session persistence
- Test logout flow
- Test protected route access control
- Test database connection error handling
- Test Storybook asset serving (production)
- Test Storybook proxy (development)

### Manual Testing
- Visual testing of login page (Ozean Licht branding)
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness of login page
- Storybook functionality through auth wrapper
- Deep linking to specific stories
- Session timeout behavior
- Concurrent session handling

### Security Testing
- Test CSRF token validation
- Test SQL injection protection (parameterized queries)
- Test XSS protection (input sanitization)
- Test session hijacking prevention
- Test brute force protection (rate limiting)
- Test secure cookie configuration

## Acceptance Criteria

- [ ] Unauthenticated users are redirected to login page when accessing `/storybook`
- [ ] Admin users can login with email and password (same as admin dashboard)
- [ ] Successful login redirects to Storybook interface
- [ ] All Storybook features work correctly through auth wrapper (stories, docs, controls)
- [ ] Deep links to specific stories are preserved after authentication
- [ ] Session persists across page reloads and browser tabs
- [ ] Logout clears session and redirects to login page
- [ ] Login/logout events are logged to `admin_audit_logs` table
- [ ] Works in both development mode (proxy) and production mode (static files)
- [ ] Docker container builds successfully
- [ ] Deployment to Coolify succeeds
- [ ] Login page follows Ozean Licht design system (cosmic dark theme)
- [ ] No errors in browser console or server logs
- [ ] Database connection pooling works efficiently
- [ ] Session cookies are secure (httpOnly, sameSite, secure in production)
- [ ] Non-admin users cannot access Storybook even with valid credentials
- [ ] All assets (JS, CSS, images, fonts) load correctly

## Validation Commands

Execute these commands to validate the implementation:

### 1. Build Validation
```bash
# Build Storybook static files
pnpm build-storybook

# Verify build output
ls -la storybook/build/
test -f storybook/build/index.html && echo "✅ Storybook build exists"

# Install auth wrapper dependencies
cd storybook/auth-wrapper && pnpm install

# Build auth wrapper
pnpm build

# Verify Next.js build
test -d .next && echo "✅ Next.js build complete"
```

### 2. Development Server Validation
```bash
# Terminal 1: Start Storybook dev server
pnpm storybook

# Terminal 2: Start auth wrapper dev server
cd storybook/auth-wrapper && pnpm dev

# Terminal 3: Test endpoints
curl -I http://localhost:3002/ # Should redirect to /login
curl -I http://localhost:3002/login # Should return 200
curl -I http://localhost:3002/storybook # Should redirect to /login (no session)
```

### 3. Database Connection Validation
```bash
# Test database connection
cd storybook/auth-wrapper
node -e "
  const { getAuthPool } = require('./lib/db/auth-pool.ts');
  const pool = getAuthPool();
  pool.query('SELECT 1 as ok').then(r => {
    console.log('✅ Database connection successful:', r.rows[0]);
    process.exit(0);
  }).catch(e => {
    console.error('❌ Database connection failed:', e.message);
    process.exit(1);
  });
"
```

### 4. Authentication Flow Testing
```bash
# Use curl or Postman to test login
curl -X POST http://localhost:3002/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"test123"}'

# Should return session cookie if successful
```

### 5. Docker Build Validation
```bash
# Build Docker image
cd storybook/auth-wrapper
docker build -t storybook-auth:latest .

# Run container
docker run -p 3002:3002 --env-file .env storybook-auth:latest

# Test running container
curl http://localhost:3002/
```

### 6. TypeScript Validation
```bash
# Type check
cd storybook/auth-wrapper
pnpm tsc --noEmit

# Should show no type errors
```

### 7. Lint Validation (if ESLint configured)
```bash
cd storybook/auth-wrapper
pnpm lint
```

### 8. Production Build Test
```bash
# Set production environment
export NODE_ENV=production

# Build and start
cd storybook/auth-wrapper
pnpm build
pnpm start

# Test production server
curl -I http://localhost:3002/
```

### 9. Audit Log Validation
```bash
# After successful login/logout, check database
psql -h localhost -p 32771 -U postgres -d shared-users-db -c "
  SELECT action, metadata, created_at
  FROM admin_audit_logs
  ORDER BY created_at DESC
  LIMIT 5;
"

# Should show LOGIN_SUCCESS and LOGIN_FAILURE events
```

### 10. Integration Test
```bash
# Full end-to-end test with Playwright (create later)
cd storybook/auth-wrapper
pnpm test:e2e
```

## Notes

### Dependencies
All dependencies are standard Next.js packages already used in the monorepo:
- `next` (^14.2.0 or latest)
- `next-auth@beta` (^5.0.0-beta.30+) - NextAuth v5
- `react` (18.3.1)
- `react-dom` (18.3.1)
- `pg` (^8.11.0) - PostgreSQL client
- `@types/pg` (^8.10.0)
- `bcrypt` (^5.1.1) - Password hashing
- `@types/bcrypt` (^5.0.2)
- `tailwindcss` (^3.4.18)
- `typescript` (^5.0.0)

### Environment Variables Required
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
AUTH_SECRET=your-super-secret-key-min-32-chars

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:32771/shared-users-db

# Or individual DB vars
POSTGRES_HOST=localhost
POSTGRES_PORT=32771
POSTGRES_DATABASE=shared-users-db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password

# Storybook Dev Server (development only)
STORYBOOK_DEV_URL=http://localhost:6006

# Environment
NODE_ENV=development
```

### Port Allocation
- Storybook dev server: `6006` (existing)
- Auth wrapper dev server: `3002` (new)
- Auth wrapper production: `3002` (new)

### Database Tables Used
This implementation uses existing tables from `001_create_admin_schema.sql`:
- `users` - Base user authentication
- `admin_users` - Admin user records and permissions
- `admin_audit_logs` - Login/logout event logging

No new migrations required.

### Production Deployment Considerations
1. **Domain Configuration**: Set up DNS for `storybook.ozean-licht.dev`
2. **SSL/TLS**: Coolify/Traefik handles HTTPS automatically
3. **Cookie Domain**: Set to `.ozean-licht.dev` for subdomain sharing
4. **Session Security**: Ensure `NEXTAUTH_SECRET` is strong (32+ characters)
5. **Build Process**:
   - Build Storybook static files first
   - Build Next.js wrapper with embedded static files
   - Deploy single container to Coolify

### Alternative Approaches Considered
1. **Storybook Plugin**: Too complex, requires forking Storybook
2. **Reverse Proxy (Nginx + OAuth)**: Adds infrastructure complexity
3. **Basic Auth**: Too simple, no audit logging or user management
4. **Custom Express Server**: More complex than Next.js approach

**Selected Approach**: Next.js wrapper provides best balance of:
- Reuses existing auth patterns from admin dashboard
- Minimal changes to Storybook itself
- Easy deployment via Coolify
- Full audit logging and session management
- Familiar Next.js development experience

### Future Enhancements (Out of Scope)
- [ ] Role-based access to specific stories (e.g., KA admin sees only KA components)
- [ ] SSO integration with admin dashboard (shared session)
- [ ] API for programmatic Storybook access
- [ ] User activity tracking (which stories viewed)
- [ ] Embedded Storybook in admin dashboard (iframe)
- [ ] Rate limiting for login attempts
- [ ] Two-factor authentication (2FA)
- [ ] Social login providers (Google, GitHub)

### Memory System Integration
Save this pattern for future use:
```bash
bash tools/memory/save.sh "Pattern: Secured Storybook with Next.js auth wrapper. Used NextAuth + shared-user DB for unified authentication. Serves static build in production, proxies dev server in development. Files: storybook/auth-wrapper/" --category=pattern
```

### Resources
- NextAuth v5 Documentation: https://authjs.dev/
- Next.js App Router: https://nextjs.org/docs/app
- Storybook Static Export: https://storybook.js.org/docs/sharing/publish-storybook
- PostgreSQL Connection Pooling: https://node-postgres.com/apis/pool
