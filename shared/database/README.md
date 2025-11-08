# Shared Users Database (`shared_users_db`)

**Phase 0: Kids Ascension Integration - Foundation**

> **Critical Prerequisite**: This database must be created and configured before Phase 1 of the Kids Ascension integration can begin. It provides unified authentication for both Kids Ascension and Ozean Licht platforms.

---

## Table of Contents

- [Overview](#overview)
- [Database Architecture](#database-architecture)
- [Quick Start](#quick-start)
- [Setup Instructions](#setup-instructions)
- [Schema Reference](#schema-reference)
- [Testing & Validation](#testing--validation)
- [Integration Guide](#integration-guide)
- [Troubleshooting](#troubleshooting)
- [Related Documentation](#related-documentation)

---

## Overview

The `shared_users_db` database provides **unified authentication** across the Ozean Licht Ecosystem. It enables users to access both Kids Ascension and Ozean Licht platforms with a single account while maintaining legal separation between the two Austrian associations (Vereine).

### Purpose

- **Unified Authentication**: Single sign-on across platforms
- **Multi-Tenant Access Control**: Platform-specific role management
- **Legal Separation**: Users can belong to one or both platforms
- **Shared Infrastructure**: Cost-efficient authentication system

### Key Features

- 🔐 **User Accounts**: Core user accounts with email/password authentication
- 🎭 **Platform Mapping**: `user_entities` table maps users to platforms (Kids Ascension, Ozean Licht)
- 🎫 **Session Management**: JWT session storage for NextAuth.js
- 🔗 **OAuth Support**: Future-ready OAuth integration (Google, GitHub, etc.)
- 🔑 **Password Reset**: Secure password reset token management
- ✅ **Email Verification**: Email verification token system

---

## Database Architecture

### Multi-Tenant Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                      Ozean Licht Ecosystem                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │          shared_users_db (Unified Authentication)         │ │
│  │  • users                  - Core user accounts            │ │
│  │  • user_entities          - Platform access mapping       │ │
│  │  • sessions               - JWT sessions                  │ │
│  │  • oauth_accounts         - OAuth providers               │ │
│  │  • password_reset_tokens  - Password resets               │ │
│  │  • email_verification_tokens - Email verification         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────┐      ┌─────────────────────┐          │
│  │  kids_ascension_db  │      │   ozean_licht_db    │          │
│  │  • videos           │      │   • courses         │          │
│  │  • courses          │      │   • members         │          │
│  │  • lessons          │      │   • content         │          │
│  │  • progress         │      │   • events          │          │
│  │  • classrooms       │      │   • community       │          │
│  └─────────────────────┘      └─────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User Login Request
    ↓
Query: shared_users_db.users (email + password)
    ↓
Verify: Password hash
    ↓
Check: shared_users_db.user_entities (platform access)
    ↓
Has Kids Ascension Access?
    ├─ YES → Query kids_ascension_db (user data)
    └─ NO  → Query ozean_licht_db (user data)
    ↓
Create: JWT session in shared_users_db.sessions
    ↓
Return: Session token to client
```

---

## Quick Start

### Prerequisites

- PostgreSQL 15+ installed and running
- Superuser or database creation privileges
- Node.js 18+ (for TypeScript test scripts)
- `ts-node` installed globally or via `npx`

### Installation (5 Minutes)

```bash
# 1. Navigate to project root
cd /opt/ozean-licht-ecosystem

# 2. Configure environment variables
cp example.env .env
# Edit .env and set SHARED_USERS_DB_URL

# 3. Run migration script
./shared/database/scripts/run-migration.sh

# 4. Verify database setup
npx ts-node shared/database/scripts/test-connection.ts

# 5. Generate Prisma client (optional)
cd shared/database
npm install
npx prisma generate

# 6. Create test admin user (optional)
cd ../../apps/admin
npm run seed:test-admin
```

**Expected Result**: All tests pass, database is ready for Phase 1.

---

## Setup Instructions

### Step 1: Environment Configuration

Add the following to your `.env` file:

```env
# === SHARED USERS DATABASE (Unified Authentication) ===
POSTGRES_HOST_SHARED=localhost
POSTGRES_PORT_SHARED=5430
POSTGRES_USER_SHARED=postgres
POSTGRES_PASSWORD_SHARED=your_secure_password
POSTGRES_DB_SHARED=shared_users_db

# Connection String (Primary)
SHARED_USERS_DB_URL=postgresql://postgres:your_secure_password@localhost:5430/shared_users_db

# Connection String (Alias)
DATABASE_URL_SHARED=postgresql://postgres:your_secure_password@localhost:5430/shared_users_db
```

**Notes:**
- Port `5430` is recommended to avoid conflicts with other databases
- Use a strong password for production
- Both `SHARED_USERS_DB_URL` and `DATABASE_URL_SHARED` can be used

### Step 2: Database Creation

**Option A: Automated Script (Recommended)**

```bash
./shared/database/scripts/run-migration.sh
```

This script will:
1. Validate environment variables
2. Test PostgreSQL connection
3. Create `shared_users_db` database
4. Execute migration SQL
5. Verify database structure

**Option B: Manual Execution**

```bash
# Create database
psql -U postgres -h localhost -p 5430 <<EOF
CREATE DATABASE shared_users_db;
\c shared_users_db
EOF

# Run migration
psql -U postgres -h localhost -p 5430 -d shared_users_db \
  -f shared/database/migrations/000_create_shared_users_db.sql
```

### Step 3: Verification

```bash
# Test connection and database structure
npx ts-node shared/database/scripts/test-connection.ts
```

**Expected output:**

```
✅ Environment Variable
✅ Database Connection
✅ Table Existence
✅ Indexes
✅ Foreign Keys
✅ Triggers
✅ Seed Data
✅ CRUD Operations

🎉 All tests passed! shared_users_db is ready for use.
```

---

## Schema Reference

### Tables Overview

| Table | Purpose | Records |
|-------|---------|---------|
| `users` | Core user accounts | ~1000s |
| `user_entities` | Platform access mapping | ~2x users |
| `sessions` | JWT sessions | Active users |
| `oauth_accounts` | OAuth providers | Optional |
| `password_reset_tokens` | Password resets | Ephemeral |
| `email_verification_tokens` | Email verification | Ephemeral |

### Users Table

**Purpose**: Core user accounts for authentication

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Fields**:
- `id`: UUID primary key (generated by PostgreSQL)
- `email`: Unique email address (used for login)
- `password_hash`: bcrypt hashed password (NULL for OAuth-only accounts)
- `is_active`: Account status (false = suspended)
- `is_deleted`: Soft delete flag

**Indexes**:
- `idx_users_email` - Fast email lookup
- `idx_users_is_active` - Active users filtering

### User Entities Table

**Purpose**: Maps users to platforms with roles

```sql
CREATE TABLE user_entities (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    entity_type VARCHAR(50) NOT NULL, -- 'KIDS_ASCENSION' or 'OZEAN_LICHT'
    role VARCHAR(50) NOT NULL,        -- 'USER', 'CREATOR', 'EDUCATOR', 'ADMIN'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Fields**:
- `user_id`: References `users(id)` (CASCADE delete)
- `entity_type`: Platform identifier (enum: `KIDS_ASCENSION`, `OZEAN_LICHT`)
- `role`: User role within platform (enum: `USER`, `CREATOR`, `EDUCATOR`, `ADMIN`, `MODERATOR`, `SUPPORT`)
- `metadata`: JSONB field for platform-specific data

**Constraints**:
- `UNIQUE(user_id, entity_type)` - One role per platform
- Foreign key cascade on user deletion

**Example Data**:

```sql
-- User can access both platforms with different roles
INSERT INTO user_entities (user_id, entity_type, role) VALUES
  ('user-uuid', 'KIDS_ASCENSION', 'CREATOR'),  -- KA content creator
  ('user-uuid', 'OZEAN_LICHT', 'USER');        -- OL regular user
```

### Sessions Table

**Purpose**: JWT session storage for NextAuth.js

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    session_token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Fields**:
- `session_token`: JWT token (indexed, unique)
- `expires_at`: Session expiration timestamp
- `last_activity_at`: Track user activity

**Indexes**:
- `idx_sessions_token` - Fast token lookup
- `idx_sessions_expires_at` - Cleanup expired sessions

---

## Testing & Validation

### Automated Test Suite

The test suite validates:

1. **Environment Variables**: `SHARED_USERS_DB_URL` is set
2. **Database Connection**: PostgreSQL connection successful
3. **Table Existence**: All 6 tables created
4. **Indexes**: Performance indexes present
5. **Foreign Keys**: Referential integrity constraints
6. **Triggers**: `updated_at` triggers active
7. **Seed Data**: System user created
8. **CRUD Operations**: Create, Read, Update, Delete functional

### Running Tests

```bash
# Run all tests
npx ts-node shared/database/scripts/test-connection.ts

# Or with ts-node installed globally
ts-node shared/database/scripts/test-connection.ts
```

### Manual Verification

```bash
# Connect to database
psql $SHARED_USERS_DB_URL

# List tables
\dt

# Expected output:
#  public | email_verification_tokens
#  public | oauth_accounts
#  public | password_reset_tokens
#  public | sessions
#  public | user_entities
#  public | users

# Count records
SELECT COUNT(*) FROM users;  -- Should be 1 (system user)

# Verify indexes
\di

# Verify foreign keys
\d user_entities
```

---

## Integration Guide

### NextAuth.js Integration

**File**: `apps/kids-ascension/web/lib/auth/config.ts`

```typescript
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from ".prisma/client-shared-users"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.SHARED_USERS_DB_URL
    }
  }
})

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Query shared_users_db
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { userEntities: true }
        })

        // Check platform access
        const hasKAAccess = user.userEntities.some(
          entity => entity.entityType === "KIDS_ASCENSION"
        )

        return hasKAAccess ? user : null
      }
    })
  ],
  session: { strategy: "jwt" }
}

export const { handlers, auth } = NextAuth(authOptions)
```

### Prisma Client Setup

**Location**: `shared/database/prisma/schema.prisma`

```bash
# Generate Prisma client
cd shared/database
npx prisma generate

# Client available at:
# .prisma/client-shared-users
```

**Usage**:

```typescript
import { PrismaClient } from ".prisma/client-shared-users"

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.SHARED_USERS_DB_URL }
  }
})

// Query users
const users = await prisma.user.findMany({
  where: { isActive: true },
  include: { userEntities: true }
})
```

### MCP Gateway Integration

**Admin Dashboard Pattern** (`apps/admin/lib/auth/config.ts`):

```typescript
import { MCPGatewayClientWithQueries } from '../mcp-client'

const mcpClient = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'shared-users-db'
})

// Query via MCP Gateway
const users = await mcpClient.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
)
```

---

## Troubleshooting

### Error: Database does not exist

**Symptom**: `database "shared_users_db" does not exist`

**Solution**:

```bash
# Create database
psql -U postgres -h localhost -p 5430 <<EOF
CREATE DATABASE shared_users_db;
EOF

# Re-run migration
./shared/database/scripts/run-migration.sh
```

### Error: SHARED_USERS_DB_URL not set

**Symptom**: Test script fails with environment variable error

**Solution**: Add to `.env`:

```env
SHARED_USERS_DB_URL=postgresql://postgres:password@localhost:5430/shared_users_db
```

### Error: relation "users" does not exist

**Symptom**: Admin migration fails with missing `users` table

**Solution**: Run Phase 0 migration first:

```bash
./shared/database/scripts/run-migration.sh
```

### Error: Permission denied

**Symptom**: Cannot create database or tables

**Solution**: Grant privileges:

```sql
-- Connect as superuser
psql -U postgres

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE shared_users_db TO your_user;
GRANT ALL ON SCHEMA public TO your_user;
```

### Error: Port 5430 already in use

**Symptom**: Cannot connect to PostgreSQL on port 5430

**Solution**: Change port in `.env`:

```env
POSTGRES_PORT_SHARED=5433  # Use different port
SHARED_USERS_DB_URL=postgresql://postgres:password@localhost:5433/shared_users_db
```

---

## Related Documentation

### Integration Plan & Analysis

- **Integration Plan**: [`specs/kids-ascension-integration-plan.md`](../../specs/kids-ascension-integration-plan.md)
  - Complete 10-phase integration approach
  - Database schema specifications (lines 926-1264)
  - Authentication patterns (lines 1266-1405)

- **Analysis Report**: [`specs/kids_ascension_integration_analysis_2025.md`](../../specs/kids_ascension_integration_analysis_2025.md)
  - Phase 0 requirement identified (lines 390-442)
  - Validation against current codebase
  - Updated timeline recommendations

### Ecosystem Documentation

- **Engineering Rules**: [`CLAUDE.md`](../../CLAUDE.md)
  - Multi-tenant database strategy
  - Development workflows

- **Architecture Guide**: [`docs/architecture.md`](../../docs/architecture.md)
  - Complete system architecture (2900+ lines)
  - Database infrastructure overview

- **Context Map**: [`CONTEXT_MAP.md`](../../CONTEXT_MAP.md)
  - Repository navigation guide

### Admin Dashboard Reference

- **Admin Migrations**: [`apps/admin/migrations/001_create_admin_schema.sql`](../../apps/admin/migrations/001_create_admin_schema.sql)
  - Admin-specific tables (references `users` table)
  - Audit logging, permissions, roles

- **Admin Auth Config**: [`apps/admin/lib/auth/config.ts`](../../apps/admin/lib/auth/config.ts)
  - NextAuth.js v5 implementation
  - MCP Gateway integration pattern

---

## Migration History

| Migration | Date | Description | Status |
|-----------|------|-------------|--------|
| `000_create_shared_users_db.sql` | 2025-01-08 | Create shared authentication database | ✅ Phase 0 |
| `001_create_admin_schema.sql` | 2024-10-24 | Admin-specific tables | ✅ Complete |

---

## Next Steps

### After Phase 0 Completion

1. ✅ **Verify Setup**: Run test suite (all tests pass)
2. ✅ **Generate Prisma Client**: `npx prisma generate`
3. ✅ **Create Test Admin**: `npm run seed:test-admin` (in apps/admin)
4. 🔄 **Proceed to Phase 1**: Foundation Setup (create Kids Ascension directory structure)

### Phase 1 Prerequisites

- [x] `shared_users_db` database created
- [x] All tables, indexes, triggers created
- [x] Test suite passing
- [x] Prisma client generated
- [x] Environment variables configured

**Phase 1 can now begin!** 🚀

---

## Support & Contribution

### Reporting Issues

If you encounter issues with Phase 0 setup:

1. Run test suite: `npx ts-node shared/database/scripts/test-connection.ts`
2. Check logs: `psql $SHARED_USERS_DB_URL -c "\dt"`
3. Review troubleshooting section above
4. Create issue with test output and error messages

### Improvement Suggestions

This is Phase 0 of a 10-phase integration plan. Suggestions welcome:

- Database schema optimizations
- Index improvements
- Security enhancements
- Documentation clarifications

---

**Document Version**: 1.0.0
**Last Updated**: 2025-01-08
**Phase**: Phase 0 (Foundation)
**Status**: ✅ Complete
**Next Phase**: Phase 1 (Foundation Setup)
