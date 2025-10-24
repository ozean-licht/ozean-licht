# NextAuth Admin Authentication System

**ADW ID:** fe20370d
**Date:** 2025-10-24
**Specification:** specs/issue-3-adw-fe20370d-sdlc_planner-nextauth-admin-dashboard.md

## Overview

Implemented a complete authentication system for the admin dashboard using NextAuth.js v5 with a custom PostgreSQL adapter. This system provides secure email/password authentication, session management, route protection middleware, and comprehensive audit logging for all authentication events.

## What Was Built

### Core Authentication Infrastructure

- **NextAuth.js v5 Configuration** - App Router compatible authentication with custom adapter
- **Custom PostgreSQL Adapter** - Integrates with existing MCP Gateway client and database schema
- **Credentials Provider** - Email/password authentication with bcrypt hashing (12 rounds)
- **Session Management** - Database-backed sessions with 24-hour TTL and automatic refresh
- **Route Protection Middleware** - Protects dashboard routes and redirects unauthenticated users
- **Audit Logging** - All authentication events logged to `admin_audit_logs` table

### User Interface Components

- **Login Page** - Responsive login form with error handling and loading states
- **Dashboard Layout** - Header with user info and sidebar navigation
- **Logout Functionality** - Sign out button with proper session cleanup
- **2FA Setup Page** - Placeholder page for future two-factor authentication

### Utility Functions

- **Password Management** - Secure hashing and verification using bcryptjs
- **Token Generation** - Cryptographically secure session tokens (32 bytes)
- **Audit Logging** - Helper functions for logging auth events with metadata
- **Test User Seeding** - Script to create test admin user for development

## Technical Implementation

### Files Modified

- `projects/admin/package.json`: Added Next.js 15, NextAuth v5, React, Tailwind CSS, and authentication dependencies
- `projects/admin/tsconfig.json`: Updated for Next.js App Router with path aliases
- `projects/admin/.gitignore`: Added Next.js build artifacts and environment files
- `projects/admin/README.md`: Comprehensive documentation with setup instructions and architecture overview

### Files Created

**Core Authentication**
- `projects/admin/lib/auth/config.ts`: NextAuth configuration with custom adapter and credentials provider
- `projects/admin/lib/auth/adapter.ts`: Custom PostgreSQL adapter implementing NextAuth Adapter interface
- `projects/admin/lib/auth/utils.ts`: Password hashing, token generation, and audit logging utilities
- `projects/admin/lib/auth/constants.ts`: Authentication constants (session TTL, bcrypt rounds, etc.)
- `projects/admin/types/next-auth.d.ts`: TypeScript type extensions for NextAuth session and JWT

**API Routes**
- `projects/admin/app/api/auth/[...nextauth]/route.ts`: NextAuth API handler for all auth endpoints

**Middleware**
- `projects/admin/middleware.ts`: Route protection logic that redirects unauthenticated users to login

**UI Components**
- `projects/admin/app/(auth)/layout.tsx`: Auth page layout wrapper
- `projects/admin/app/(auth)/login/page.tsx`: Login page with branding
- `projects/admin/app/(dashboard)/layout.tsx`: Dashboard layout with header and sidebar
- `projects/admin/app/(dashboard)/page.tsx`: Dashboard home page showing user info
- `projects/admin/app/(dashboard)/settings/2fa/page.tsx`: 2FA setup placeholder page
- `projects/admin/components/auth/LoginForm.tsx`: Login form component with validation
- `projects/admin/components/auth/LogoutButton.tsx`: Logout button component
- `projects/admin/components/dashboard/Header.tsx`: Dashboard header with user info

**Styling & Configuration**
- `projects/admin/app/globals.css`: Tailwind CSS global styles
- `projects/admin/app/layout.tsx`: Root layout with session provider
- `projects/admin/tailwind.config.js`: Tailwind CSS configuration
- `projects/admin/postcss.config.js`: PostCSS configuration
- `projects/admin/next.config.js`: Next.js configuration

**Scripts & Utilities**
- `projects/admin/scripts/seed-test-admin.ts`: Script to seed test admin user
- `projects/admin/scripts/README.md`: Documentation for admin scripts

### Key Changes

**Authentication Flow**
1. User submits email/password via login form
2. NextAuth credentials provider validates credentials against database
3. Password verified using bcrypt comparison
4. Admin user record checked for active status
5. Session created in `admin_sessions` table with secure token
6. JWT token includes admin role and permissions
7. Audit log entry created with IP address and user agent
8. User redirected to dashboard with authenticated session

**Session Management**
- Sessions stored in database (not just JWT)
- 24-hour TTL with automatic refresh on activity
- Session validation on every protected route access
- Secure httpOnly cookies prevent XSS attacks

**Security Features**
- bcrypt password hashing (12 rounds)
- Cryptographically secure session tokens (32 bytes)
- CSRF protection enabled by default
- Input validation using Zod schemas
- Parameterized queries prevent SQL injection
- Audit logging for all authentication events

## How to Use

### Development Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Set Environment Variables**
   Create `.env.local`:
   ```bash
   NEXTAUTH_URL=http://localhost:9200
   NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
   MCP_GATEWAY_URL=http://localhost:8100
   SHARED_USERS_DB_URL=postgresql://user:pass@localhost:5432/shared_users_db
   ```

3. **Seed Test Admin User**
   ```bash
   pnpm run seed:test-admin
   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   ```

5. **Access the Application**
   - Navigate to `http://localhost:9200`
   - You'll be redirected to `/login`
   - Use test credentials: `admin@ozean-licht.dev` / `admin123`

### Using the Authentication System

**Login**
1. Navigate to `/login`
2. Enter email and password
3. Click "Sign in"
4. Upon success, redirected to dashboard

**Access Protected Routes**
- All routes under `/dashboard/*` require authentication
- Middleware automatically redirects unauthenticated users to login
- Callback URL preserved for post-login redirect

**Logout**
1. Click "Sign Out" button in dashboard header
2. Session deleted from database
3. Audit log entry created
4. Redirected to login page

**Access 2FA Setup (Placeholder)**
- Navigate to `/dashboard/settings/2fa`
- View placeholder page with 2FA information
- Full implementation planned for future release

## Configuration

### Environment Variables

**Required**
- `NEXTAUTH_URL` - Base URL for NextAuth (e.g., `http://localhost:9200`)
- `NEXTAUTH_SECRET` - Secret key for JWT signing (generate with `openssl rand -base64 32`)
- `MCP_GATEWAY_URL` - URL for MCP Gateway (e.g., `http://localhost:8100`)
- `SHARED_USERS_DB_URL` - PostgreSQL connection string for shared users database

**Optional**
- `NODE_ENV` - Environment mode (`development` or `production`)

### Authentication Constants

Configurable in `lib/auth/constants.ts`:
- `SESSION_TTL_SECONDS`: 86400 (24 hours)
- `PASSWORD_MIN_LENGTH`: 8
- `BCRYPT_ROUNDS`: 12
- `SESSION_TOKEN_BYTES`: 32

### Database Tables

Uses existing schema from issue #1:
- `users` - Base user accounts with email and password hash
- `admin_users` - Admin-specific data with role and permissions
- `admin_sessions` - Active sessions with tokens and expiration
- `admin_audit_logs` - Authentication event logs

## Testing

### Manual Testing

1. **Valid Login**
   - Use test credentials
   - Should redirect to dashboard
   - User info displayed in header

2. **Invalid Login**
   - Use wrong password
   - Error message should appear
   - No session created

3. **Route Protection**
   - Access `/dashboard` while logged out
   - Should redirect to `/login?callbackUrl=/dashboard`
   - After login, redirected back to dashboard

4. **Logout**
   - Click "Sign Out"
   - Should redirect to login
   - Cannot access dashboard without re-authenticating

### Audit Logs

Check database for authentication events:
```sql
SELECT * FROM admin_audit_logs
WHERE action IN ('login.success', 'login.failure', 'logout')
ORDER BY created_at DESC
LIMIT 10;
```

## Notes

### Current Limitations

1. **OAuth Not Implemented** - Only email/password authentication currently supported
2. **2FA Placeholder Only** - Full two-factor authentication planned for future release
3. **No Password Reset** - Users cannot reset forgotten passwords yet
4. **Basic Rate Limiting** - Advanced rate limiting not yet implemented
5. **Test Credentials** - Only for development; production requires proper user management

### Security Best Practices Implemented

- Passwords hashed with bcrypt (12 rounds)
- Session tokens are cryptographically secure
- httpOnly cookies prevent XSS
- CSRF protection enabled
- Input validation with Zod
- Parameterized queries via MCP Gateway
- Comprehensive audit logging

### Future Enhancements

Planned for future releases:
- OAuth providers (Google, Facebook)
- TOTP-based 2FA with authenticator apps
- Email verification for new users
- Password reset functionality
- "Remember me" option
- Session management UI (view/revoke active sessions)
- WebAuthn/passkey support
- Advanced rate limiting with Redis
- Brute force protection
- Account lockout policies

### Dependencies

**Core**
- next@^15.0.0 - Next.js framework
- react@^18.3.0 - React library
- next-auth@^5.0.0-beta.22 - Authentication library
- bcryptjs@^2.4.3 - Password hashing
- zod@^3.23.0 - Input validation

**Styling**
- tailwindcss@^3.4.0 - Utility-first CSS framework
- postcss@^8.4.32 - CSS processing
- autoprefixer@^10.4.16 - CSS autoprefixer

**Development**
- typescript@^5.3.3 - TypeScript compiler
- tsx@^4.7.0 - TypeScript execution

### Architecture Notes

**Monorepo Structure**
- Admin dashboard is at `projects/admin/`
- Uses shared MCP Gateway client (`@admin/mcp-client`)
- Integrates with existing database schema
- Part of larger Ozean Licht Ecosystem

**Database Strategy**
- Shared users database (`shared_users_db`) for authentication
- Separate entity databases for Kids Ascension and Ozean Licht
- Admin users can have access to multiple entities

**NextAuth Integration**
- Custom adapter bridges NextAuth and PostgreSQL
- Session strategy is database-backed (not JWT-only)
- JWT tokens include admin role and permissions
- Callbacks enrich session with fresh admin data

### Troubleshooting

**"Invalid email or password" on valid credentials**
- Check database contains test user (run seed script)
- Verify `SHARED_USERS_DB_URL` is correct
- Check MCP Gateway is running on port 8100

**Redirects to login on every request**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches actual URL
- Ensure cookies are enabled in browser

**Build errors**
- Run `pnpm install` to ensure all dependencies installed
- Check TypeScript errors with `pnpm typecheck`
- Verify all environment variables are set

**MCP Gateway connection errors**
- Verify MCP Gateway is running: `curl http://localhost:8100/health`
- Check network connectivity
- Review MCP Gateway logs for errors
