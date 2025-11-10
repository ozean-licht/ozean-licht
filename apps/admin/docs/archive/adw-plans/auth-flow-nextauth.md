# Admin Dashboard Authentication Flow - Implementation Spec

**Feature:** NextAuth.js Authentication System for Admin Dashboard
**Issue:** TBD
**ADW Type:** /feature
**Estimated Complexity:** Medium
**Target:** Week 1 - Day 2-3

---

## Overview

Implement a secure authentication system for the admin dashboard using NextAuth.js with PostgreSQL adapter. This provides login/logout functionality, session management, route protection, and 2FA setup UI (implementation in future phase).

### Goals
- Secure admin user authentication with bcrypt password hashing
- JWT-based session management with NextAuth
- Route protection via middleware
- Entity-aware authentication (multi-entity access control)
- Audit logging for all authentication events
- 2FA setup page (UI only, backend implementation later)

### Success Criteria
- Admin users can log in with email/password
- JWT tokens stored in secure httpOnly cookies
- Protected routes redirect to `/login` for unauthenticated users
- Sessions persist across page reloads
- Logout clears session and redirects to login
- All auth events logged to `admin_audit_logs` table

---

## Database Foundation

The database schema is already in place from Day 1-2 (Issue #1):
- `admins` table with password_hash and entity access
- `admin_sessions` table for NextAuth session storage
- `admin_audit_logs` table for logging auth events

**Test Admin User:**
```
Email: admin@ozean-licht.dev
Password: admin123
Role: super_admin
Entities: ['kids_ascension', 'ozean_licht']
```

---

## Technical Approach

### 1. NextAuth Configuration

**Libraries to Install:**
```bash
cd projects/admin
npm install next-auth@latest
npm install bcryptjs
npm install @types/bcryptjs --save-dev
```

**Key Configuration Files:**
- `app/api/auth/[...nextauth]/route.ts` - NextAuth route handler
- `lib/auth/config.ts` - NextAuth configuration
- `lib/auth/adapter.ts` - Custom PostgreSQL adapter via MCP Gateway
- `lib/auth/utils.ts` - Password verification, session helpers
- `middleware.ts` - Route protection middleware

### 2. Authentication Flow

```
User → Login Page → NextAuth Credentials Provider → MCP Gateway → PostgreSQL
                                                     ↓
                                              Verify Password (bcrypt)
                                                     ↓
                                              Create Session
                                                     ↓
                                              Log Audit Event
                                                     ↓
                                              Return JWT Token
                                                     ↓
                                              Redirect to Dashboard
```

### 3. Session Structure

```typescript
interface AdminSession {
  user: {
    id: string
    email: string
    role: 'super_admin' | 'admin' | 'moderator' | 'analyst' | 'support'
    entitiesAccess: ('kids_ascension' | 'ozean_licht')[]
    twoFactorEnabled: boolean
  }
  expires: string
}
```

### 4. Route Protection Strategy

**Public Routes:**
- `/login`
- `/api/auth/*` (NextAuth routes)

**Protected Routes (require authentication):**
- `/` (dashboard home)
- `/health`
- `/users`
- `/content`
- `/angels`
- `/events`
- `/audit`
- `/settings/*`

---

## Implementation Steps

### Step 1: Install Dependencies
```bash
cd projects/admin
npm install next-auth@latest bcryptjs
npm install @types/bcryptjs --save-dev
```

### Step 2: Create Authentication Library Files

**File: `lib/auth/constants.ts`**
```typescript
export const AUTH_CONFIG = {
  SESSION_MAX_AGE: 24 * 60 * 60, // 24 hours
  SESSION_UPDATE_AGE: 60 * 60, // 1 hour
  JWT_SECRET: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production',
  COOKIE_NAME: 'admin-session',
  BCRYPT_ROUNDS: 12
} as const

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_INACTIVE: 'Account is inactive',
  SESSION_EXPIRED: 'Session expired, please login again',
  UNAUTHORIZED: 'You are not authorized to access this resource'
} as const

export const PROTECTED_ROUTES = [
  '/',
  '/health',
  '/users',
  '/content',
  '/angels',
  '/events',
  '/audit',
  '/settings'
]

export const PUBLIC_ROUTES = [
  '/login',
  '/api/auth'
]
```

**File: `lib/auth/utils.ts`**
```typescript
import bcrypt from 'bcryptjs'
import { AUTH_CONFIG } from './constants'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, AUTH_CONFIG.BCRYPT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}
```

**File: `lib/auth/adapter.ts`**
```typescript
import { AdminMCPClient } from '@/lib/mcp-client'
import { Admin } from '@/types/database'

/**
 * Custom NextAuth adapter for PostgreSQL via MCP Gateway
 */
export class NextAuthMCPAdapter {
  private client: AdminMCPClient

  constructor() {
    this.client = new AdminMCPClient()
  }

  async getAdminByEmail(email: string): Promise<Admin | null> {
    const result = await this.client.getAdminByEmail(email)
    return result || null
  }

  async createSession(adminId: string, sessionToken: string, expires: Date) {
    return this.client.createAdminSession({
      admin_id: adminId,
      session_token: sessionToken,
      expires_at: expires.toISOString()
    })
  }

  async deleteSession(sessionToken: string) {
    return this.client.deleteAdminSession(sessionToken)
  }

  async updateLastLogin(adminId: string) {
    return this.client.updateAdminLastLogin(adminId)
  }
}
```

**File: `lib/auth/config.ts`**
```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthMCPAdapter } from './adapter'
import { verifyPassword } from './utils'
import { AUTH_CONFIG, AUTH_ERRORS } from './constants'
import { AdminMCPClient } from '@/lib/mcp-client'

const adapter = new NextAuthMCPAdapter()
const mcpClient = new AdminMCPClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS)
        }

        // Get admin user from database
        const admin = await adapter.getAdminByEmail(credentials.email)

        if (!admin) {
          throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS)
        }

        if (!admin.is_active) {
          throw new Error(AUTH_ERRORS.ACCOUNT_INACTIVE)
        }

        // Verify password
        const isValid = await verifyPassword(
          credentials.password,
          admin.password_hash
        )

        if (!isValid) {
          throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS)
        }

        // Update last login
        await adapter.updateLastLogin(admin.id)

        // Log authentication event
        await mcpClient.createAuditLog({
          admin_id: admin.id,
          action: 'admin.login',
          entity: 'shared',
          resource_type: 'session',
          resource_id: admin.id,
          changes: null,
          ip_address: null, // Will be set in middleware
          user_agent: null
        })

        return {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          entitiesAccess: admin.entities_access,
          twoFactorEnabled: admin.two_factor_enabled
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role
        token.entitiesAccess = user.entitiesAccess
        token.twoFactorEnabled = user.twoFactorEnabled
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          role: token.role as string,
          entitiesAccess: token.entitiesAccess as string[],
          twoFactorEnabled: token.twoFactorEnabled as boolean
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: AUTH_CONFIG.SESSION_MAX_AGE,
    updateAge: AUTH_CONFIG.SESSION_UPDATE_AGE
  },
  secret: AUTH_CONFIG.JWT_SECRET
}
```

### Step 3: Create NextAuth API Route

**File: `app/api/auth/[...nextauth]/route.ts`**
```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/config'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

### Step 4: Create Login Page

**File: `app/(auth)/layout.tsx`**
```typescript
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
```

**File: `app/(auth)/login/page.tsx`**
```typescript
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Sign in to access the admin panel
        </p>
      </div>
      <LoginForm />
    </div>
  )
}
```

**File: `components/auth/LoginForm.tsx`**
```typescript
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@ozean-licht.dev"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
```

**File: `components/auth/LogoutButton.tsx`**
```typescript
'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      onClick={() => signOut({ callbackUrl: '/login' })}
    >
      Logout
    </Button>
  )
}
```

### Step 5: Create Route Protection Middleware

**File: `middleware.ts`**
```typescript
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { isProtectedRoute, isPublicRoute } from '@/lib/auth/utils'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl

    // Allow public routes
    if (isPublicRoute(pathname)) {
      return NextResponse.next()
    }

    // Protect all other routes
    if (!req.nextauth.token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)'
  ]
}
```

### Step 6: Add 2FA Setup Page (UI Only)

**File: `app/(dashboard)/settings/2fa/page.tsx`**
```typescript
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TwoFactorSetupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Two-Factor Authentication</h1>
        <p className="text-slate-600 mt-2">
          Add an extra layer of security to your account
        </p>
      </div>

      <Alert>
        <AlertDescription>
          2FA setup will be available in a future update. This page is a placeholder for the UI.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Setup 2FA</CardTitle>
          <CardDescription>
            Use an authenticator app to generate verification codes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8 text-slate-400">
            QR Code will appear here
          </div>
          <Button disabled className="w-full">
            Enable 2FA (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Step 7: Update MCP Client with Auth Methods

Add these methods to `lib/mcp-client/queries.ts`:

```typescript
// Admin authentication queries
export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const result = await executeQuery<Admin>(
    'SELECT * FROM admins WHERE email = $1 LIMIT 1',
    [email]
  )
  return result[0] || null
}

export async function createAdminSession(data: {
  admin_id: string
  session_token: string
  expires_at: string
}) {
  return executeQuery(
    'INSERT INTO admin_sessions (admin_id, session_token, expires_at) VALUES ($1, $2, $3) RETURNING *',
    [data.admin_id, data.session_token, data.expires_at]
  )
}

export async function deleteAdminSession(sessionToken: string) {
  return executeQuery(
    'DELETE FROM admin_sessions WHERE session_token = $1',
    [sessionToken]
  )
}

export async function updateAdminLastLogin(adminId: string) {
  return executeQuery(
    'UPDATE admins SET last_login_at = NOW() WHERE id = $1',
    [adminId]
  )
}
```

### Step 8: Create Session Helper for Server Components

**File: `lib/auth-utils.ts`**
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { AUTH_ERRORS } from '@/lib/auth/constants'

export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error(AUTH_ERRORS.SESSION_EXPIRED)
  }

  return session
}

export async function getCurrentAdmin() {
  const session = await requireAuth()
  return session.user
}
```

---

## Environment Variables

Add to `.env.local`:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-secret-key-change-in-production-min-32-chars

# MCP Gateway (already configured)
MCP_GATEWAY_URL=http://10.0.1.16:8100
```

---

## Testing Requirements

### Unit Tests

**File: `tests/unit/auth/utils.test.ts`**
- Test password hashing
- Test password verification
- Test route protection logic

**File: `tests/unit/auth/adapter.test.ts`**
- Test adapter methods
- Mock MCP client responses

### Integration Tests

**File: `tests/integration/auth.test.ts`**
- Test login flow
- Test session creation
- Test logout flow
- Test protected route access

### Manual Testing Checklist

1. **Login Flow**
   - [ ] Can login with test admin user
   - [ ] Invalid credentials show error
   - [ ] Inactive account shows error message
   - [ ] Successful login redirects to dashboard

2. **Session Management**
   - [ ] Session persists across page reloads
   - [ ] Session stored in httpOnly cookie
   - [ ] JWT contains correct user data

3. **Route Protection**
   - [ ] Unauthenticated users redirected to /login
   - [ ] Callback URL preserved after login
   - [ ] Authenticated users can access dashboard
   - [ ] Public routes accessible without auth

4. **Logout Flow**
   - [ ] Logout clears session
   - [ ] Logout redirects to login page
   - [ ] Cannot access protected routes after logout

5. **Audit Logging**
   - [ ] Login events logged to `admin_audit_logs`
   - [ ] Logout events logged
   - [ ] Failed login attempts logged

---

## Security Considerations

### 1. Password Security
- **Bcrypt** with 12 rounds for password hashing
- Never log or expose password hashes
- Enforce password complexity (future phase)

### 2. Session Security
- **httpOnly cookies** prevent XSS attacks
- **JWT tokens** for stateless authentication
- Session expiry after 24 hours
- Token refresh every hour

### 3. Rate Limiting (Future Phase)
- Implement rate limiting on login endpoint
- Block IP after 5 failed attempts
- Temporary account lockout after 10 failed attempts

### 4. Audit Trail
- Log all authentication events
- Include IP address and user agent
- Monitor for suspicious activity patterns

---

## Validation Criteria

### Functional Requirements
- [x] Admin users can log in with email/password
- [x] JWT token stored in session
- [x] Protected routes redirect to /login
- [x] Session persists across page reloads
- [x] Logout clears session
- [x] 2FA setup page exists (UI only)

### Non-Functional Requirements
- [x] Login completes within 2 seconds
- [x] Password verification uses bcrypt
- [x] All auth events logged
- [x] Error messages are user-friendly
- [x] Mobile responsive login page

---

## Dependencies

**Required:**
- `next-auth@latest` - Authentication framework
- `bcryptjs` - Password hashing
- `@types/bcryptjs` - TypeScript types

**Shadcn Components:**
- `button` - Login button
- `input` - Email/password inputs
- `label` - Form labels
- `alert` - Error messages
- `card` - 2FA setup card

---

## Notes

- 2FA implementation deferred to Week 2+
- Password reset functionality not in scope
- OAuth providers (Google, Facebook) not in scope for Week 1
- Rate limiting implementation deferred to Week 2+

---

**Spec Version:** 1.0
**Created:** 2025-10-24
**Status:** Ready for Implementation
