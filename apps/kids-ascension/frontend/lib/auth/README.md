# Kids Ascension Authentication

NextAuth v5 configuration for Kids Ascension, integrated with the unified authentication system using `shared_users_db`.

## Overview

This implementation migrates Kids Ascension from Supabase Auth to NextAuth v5 with:

- **Credentials provider** for email/password authentication
- **Prisma adapter** for database session management
- **Multi-tenant support** via UserEntity with KIDS_ASCENSION entity type
- **JWT sessions** with 30-day expiration
- **Role-based access control** (USER, CREATOR, EDUCATOR, ADMIN, MODERATOR, SUPPORT)

## Files Created

```
apps/kids-ascension/frontend/
├── lib/
│   └── auth.ts                          # Main NextAuth configuration
├── types/
│   └── next-auth.d.ts                   # TypeScript type definitions
├── app/api/auth/[...nextauth]/
│   └── route.ts                         # NextAuth API route handler
├── prisma/
│   └── schema.prisma                    # Prisma schema reference
└── .env.example                         # Environment variables template
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd /opt/ozean-licht-ecosystem/apps/kids-ascension/frontend
npm install
```

Dependencies added to `package.json`:
- `next-auth@^5.0.0-beta.4` - NextAuth v5 beta
- `@auth/prisma-adapter@^2.0.0` - Prisma adapter for NextAuth
- `bcryptjs@^2.4.3` - Password hashing
- `@types/bcryptjs@^2.4.6` - TypeScript types for bcryptjs

### 2. Generate Prisma Client

The Prisma client for `shared_users_db` needs to be generated from the shared database schema:

```bash
cd /opt/ozean-licht-ecosystem/shared/database
npm install
npx prisma generate
```

This generates the client to `shared/database/node_modules/.prisma/client-shared-users/`.

### 3. Environment Variables

Copy `.env.example` to `.env` and configure:

```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
SHARED_USERS_DB_URL=postgresql://user:password@localhost:5432/shared_users_db
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Verify Database Connection

Ensure the `shared_users_db` database exists and has the required schema:

```bash
cd /opt/ozean-licht-ecosystem/shared/database
npx prisma db push
```

## Usage

### Authentication Functions

#### Server-side (Server Components, Server Actions, Route Handlers)

```typescript
import { auth, getSession } from "@/lib/auth"

// Get current session
const session = await auth()

// Or using getSession helper
const session = await getSession()

// Access user data
if (session?.user) {
  console.log(session.user.id)           // User ID from shared_users_db
  console.log(session.user.email)        // User email
  console.log(session.user.entityId)     // UserEntity ID for Kids Ascension
  console.log(session.user.entityRole)   // User role (USER, CREATOR, etc.)
  console.log(session.user.emailVerified) // Email verification status
}
```

#### Client-side (Client Components)

```typescript
"use client"

import { useSession } from "next-auth/react"

function MyComponent() {
  const { data: session, status } = useSession()

  if (status === "loading") return <div>Loading...</div>
  if (status === "unauthenticated") return <div>Not authenticated</div>

  return <div>Welcome, {session?.user?.email}</div>
}
```

### Registration

```typescript
import { registerUser } from "@/lib/auth"

// Register a new user
try {
  const user = await registerUser(
    "user@example.com",
    "securePassword123",
    "John Doe",
    "USER" // Optional: USER (default), CREATOR, or EDUCATOR
  )
  console.log("User created:", user.id)
} catch (error) {
  console.error("Registration failed:", error.message)
}
```

### Login

```typescript
import { signIn } from "@/lib/auth"

// Login with credentials
const result = await signIn("credentials", {
  email: "user@example.com",
  password: "securePassword123",
  redirect: false,
})

if (result?.error) {
  console.error("Login failed:", result.error)
} else {
  console.log("Login successful")
}
```

### Logout

```typescript
import { signOut } from "@/lib/auth"

// Logout
await signOut({ redirect: true, redirectTo: "/" })
```

### Middleware Protection

Create `middleware.ts` at the app root to protect routes:

```typescript
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  // Protected routes
  const protectedRoutes = ["/dashboard", "/profile", "/settings"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

### Helper Functions

#### Check User Role

```typescript
import { userHasRole } from "@/lib/auth"

const isCreator = await userHasRole(userId, "CREATOR")
if (isCreator) {
  // Grant creator privileges
}
```

#### Update User Profile

```typescript
import { updateUserProfile } from "@/lib/auth"

await updateUserProfile(userId, {
  displayName: "Jane Doe",
  firstName: "Jane",
  lastName: "Doe",
  avatarUrl: "https://example.com/avatar.jpg",
})
```

#### Update User Role

```typescript
import { updateUserRole } from "@/lib/auth"

// Promote user to CREATOR
await updateUserRole(userId, "CREATOR")
```

#### Verify Email

```typescript
import { verifyUserEmail } from "@/lib/auth"

await verifyUserEmail(userId)
```

## Database Schema

The authentication uses the following tables from `shared_users_db`:

### User Table

Core user account with authentication credentials:

```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  display_name VARCHAR(255),
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

### UserEntity Table

Platform access mapping with role-based access control:

```sql
user_entities (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  entity_type EntityType,  -- 'KIDS_ASCENSION' or 'OZEAN_LICHT'
  role UserRole,           -- 'USER', 'CREATOR', 'EDUCATOR', 'ADMIN', etc.
  is_active BOOLEAN DEFAULT true,
  access_granted_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entity_type)
)
```

### Session Table

JWT session storage (managed by NextAuth):

```sql
sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
)
```

## Security Features

1. **Password Hashing**: bcrypt with 12 rounds
2. **JWT Sessions**: Signed with NEXTAUTH_SECRET
3. **Entity Isolation**: UserEntity enforces platform-specific access
4. **Account Status Checks**: Validates active, non-deleted accounts
5. **Email Verification**: Tracks verification status in session
6. **Audit Logging**: Logs sign-in/sign-out events

## Migration from Supabase

To migrate existing Supabase users:

1. Export Supabase auth users
2. Hash passwords with bcrypt (if not already hashed)
3. Create corresponding records in `users` and `user_entities` tables
4. Update application code to use NextAuth hooks/functions

## Testing

### Manual Testing

1. Start the development server:
```bash
npm run dev
```

2. Test registration:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

3. Test login:
```bash
curl -X POST http://localhost:3000/api/auth/signin/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Unit Tests

Create tests for authentication logic:

```typescript
// __tests__/lib/auth.test.ts
import { registerUser, verifyPassword, hashPassword } from "@/lib/auth"

describe("Authentication", () => {
  it("should hash passwords correctly", async () => {
    const password = "testPassword123"
    const hashed = await hashPassword(password)
    expect(await verifyPassword(password, hashed)).toBe(true)
  })

  it("should register a new user", async () => {
    const user = await registerUser(
      "newuser@example.com",
      "password123",
      "New User",
      "USER"
    )
    expect(user.email).toBe("newuser@example.com")
    expect(user.userEntities).toHaveLength(1)
    expect(user.userEntities[0].entityType).toBe("KIDS_ASCENSION")
  })
})
```

## Troubleshooting

### "Cannot find module '@prisma/client-shared-users'"

Generate the Prisma client:
```bash
cd /opt/ozean-licht-ecosystem/shared/database
npx prisma generate
```

### "Database connection failed"

Verify `SHARED_USERS_DB_URL` in `.env`:
```bash
psql $SHARED_USERS_DB_URL -c "SELECT 1"
```

### "Invalid session"

Clear cookies and try logging in again. Check that `NEXTAUTH_SECRET` is set.

### "No access to Kids Ascension platform"

Ensure the user has a UserEntity with:
- `entity_type = 'KIDS_ASCENSION'`
- `is_active = true`

## References

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
- [Shared Users DB Schema](/shared/database/prisma/schema.prisma)
- [Admin Auth Reference](/apps/admin/lib/auth/config.ts)
- [Legacy Supabase Auth](/apps/kids-ascension/kids-ascension_OLD/kids-ascension-web/lib/supabase/auth.ts)

## Next Steps

1. Create login/registration UI components
2. Implement middleware for route protection
3. Add email verification flow
4. Set up password reset functionality
5. Create user profile management pages
6. Add role-based permission checks throughout the app
7. Write comprehensive tests

---

**Last Updated**: 2025-11-08
**Author**: Claude (build-agent)
**Status**: ✅ Implementation Complete - Ready for Testing
