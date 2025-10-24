# Admin Database Schema and MCP Client

**ADW ID:** 61c79c41
**Date:** 2025-10-24
**Specification:** specs/issue-1-adw-61c79c41-sdlc_planner-database-schema-mcp-client.md

## Overview

This feature establishes the foundational database schema and MCP Gateway client library for the unified Admin Dashboard. The admin dashboard serves as a centralized management interface for both Kids Ascension and Ozean Licht platforms, built on the shared_users_db infrastructure. All admin operations go through the MCP Gateway using a type-safe TypeScript client, following the Zero Touch Engineering (ZTE) philosophy.

## What Was Built

### Database Schema (shared_users_db)
- **admin_users** - Admin user accounts with role-based access control
- **admin_roles** - System and custom role definitions with default permissions
- **admin_permissions** - Granular permission definitions with category organization
- **admin_audit_logs** - Comprehensive audit trail for all admin actions
- **admin_sessions** - Active session tracking with expiration management

### MCP Client Library
- **MCPGatewayClient** - Core client class for database operations via MCP Gateway
- **MCPGatewayClientWithQueries** - Extended client with pre-built query methods
- **Type Definitions** - Complete TypeScript types for all database schemas
- **Health Check Utilities** - Connectivity verification and latency measurement
- **Error Handling** - Typed error classes with retry logic

### Testing Infrastructure
- Unit tests with mocked MCP Gateway responses
- Integration tests for end-to-end verification
- Test fixtures and setup utilities
- Jest configuration with ESLint integration

## Technical Implementation

### Files Modified

- `.gitignore`: Added patterns for admin project build artifacts
- `.mcp.json`: MCP Gateway configuration for local development
- `.ports.env`: Isolated port allocation for worktree environment

### Key Files Created

**Core Library** (`projects/admin/lib/mcp-client/`)
- `client.ts`: MCPGatewayClient class with low-level MCP operations (191 lines)
- `queries.ts`: High-level query methods for admin operations (574 lines)
- `config.ts`: Configuration validation and defaults (97 lines)
- `errors.ts`: Typed error classes (MCPError, MCPTimeoutError, etc.) (82 lines)
- `health.ts`: Health check utilities and latency measurement (109 lines)
- `index.ts`: Main exports and public API (31 lines)

**Type Definitions** (`projects/admin/types/`)
- `admin.ts`: Admin domain types (AdminUser, AdminRole, AdminPermission, etc.) (165 lines)
- `database.ts`: Database row types matching SQL schema (80 lines)
- `mcp.ts`: MCP Gateway protocol types (MCPRequest, MCPResponse) (80 lines)
- `index.ts`: Barrel exports for all types (7 lines)

**Database Migrations** (`projects/admin/migrations/`)
- `001_create_admin_schema.sql`: Complete database schema with indexes and seed data (150 lines)
- `README.md`: Migration execution instructions and rollback procedures (123 lines)

**Tests** (`projects/admin/tests/`)
- `mcp-client/client.test.ts`: Core client functionality tests (84 lines)
- `mcp-client/health.test.ts`: Health check tests (43 lines)
- `integration/e2e.test.ts`: End-to-end integration tests (71 lines)
- `setup.ts`: Test environment configuration (11 lines)
- `__mocks__/node-fetch.ts`: Fetch mock for unit tests (40 lines)

**Configuration & Documentation**
- `package.json`: Dependencies and scripts (47 lines)
- `tsconfig.json`: TypeScript configuration with strict mode (24 lines)
- `jest.config.js`: Jest test configuration (24 lines)
- `.eslintrc.json`: ESLint rules and TypeScript integration (28 lines)
- `README.md`: Complete usage documentation (574 lines)
- `CHANGELOG.md`: Version history (52 lines)
- `IMPLEMENTATION_SUMMARY.md`: Detailed implementation notes (303 lines)

### Key Changes

1. **Multi-Database Support**: Client supports three databases (shared-users-db, kids-ascension-db, ozean-licht-db) via configuration

2. **Role Hierarchy**: Four system roles defined:
   - `super_admin`: Full access across all platforms
   - `ka_admin`: Kids Ascension platform admin
   - `ol_admin`: Ozean Licht platform admin
   - `support`: Read-only access for support staff

3. **Permission System**: Wildcard-based permissions with category support:
   - `*`: Full access (super admin)
   - `users.*`: All user operations
   - `ka.videos.approve`: Specific KA video approval
   - Entity-scoped permissions for platform isolation

4. **Audit Logging**: Every admin action tracked with:
   - Admin user ID and action type
   - Entity type, ID, and scope (KA/OL)
   - Metadata (before/after values)
   - IP address, user agent, request ID
   - Timestamp for chronological tracking

5. **Type Safety**: End-to-end TypeScript types from database to API:
   - Database row types match SQL schema exactly
   - Input/output types for all operations
   - MCP protocol types for request/response
   - Compile-time validation prevents errors

## How to Use

### Installation

```bash
cd projects/admin
npm install
```

### Database Migration

Execute the migration to create admin tables in shared_users_db:

```bash
# Option 1: Direct SQL execution
psql $SHARED_USERS_DB_URL -f projects/admin/migrations/001_create_admin_schema.sql

# Option 2: Via MCP Gateway (if available)
# See migrations/README.md for detailed instructions
```

### Basic Usage

```typescript
import { MCPGatewayClientWithQueries } from '@admin/mcp-client';

// Initialize client
const client = new MCPGatewayClientWithQueries({
  database: 'shared-users-db',
  baseUrl: 'http://localhost:8100',
  timeout: 10000,
  retries: 3
});

// Health check
const health = await client.healthCheck();
console.log('Gateway healthy:', health.healthy);

// Get admin user
const adminUser = await client.getAdminUserById('user-id');
if (adminUser) {
  console.log('Role:', adminUser.adminRole);
  console.log('Permissions:', adminUser.permissions);
}

// Check permission
const canApprove = await client.checkPermission(
  adminUser.id,
  'ka.videos.approve'
);

// Create audit log
await client.createAuditLog({
  adminUserId: adminUser.id,
  action: 'video.approve',
  entityType: 'video',
  entityId: 'video-123',
  entityScope: 'kids_ascension',
  metadata: { previousStatus: 'pending', newStatus: 'approved' }
});
```

### Admin User Lifecycle

```typescript
// 1. Create admin user (linked to existing base user)
const newAdmin = await client.createAdminUser({
  userId: 'base-user-id',
  adminRole: 'ka_admin',
  entityScope: 'kids_ascension',
  permissions: ['ka.*']
});

// 2. List admin users with filters
const admins = await client.listAdminUsers({
  adminRole: 'ka_admin',
  isActive: true
});

// 3. Update admin user
const updated = await client.updateAdminUser(newAdmin.id, {
  permissions: [...newAdmin.permissions, 'users.read']
});

// 4. Deactivate admin user (soft delete)
await client.deactivateAdminUser(newAdmin.id);
```

### Session Management

```typescript
// Create session
const session = await client.createSession({
  adminUserId: adminUser.id,
  sessionToken: crypto.randomUUID(),
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  ttlSeconds: 86400 // 24 hours
});

// Validate session
const validSession = await client.getSessionByToken(session.sessionToken);
if (validSession && validSession.expiresAt > new Date()) {
  // Update activity timestamp
  await client.updateSessionActivity(session.sessionToken);
}

// Logout
await client.deleteSession(session.sessionToken);

// Cleanup expired sessions (cron job)
const deletedCount = await client.deleteExpiredSessions();
```

### Audit Log Querying

```typescript
// List audit logs with filters
const logs = await client.listAuditLogs({
  adminUserId: adminUser.id,
  action: 'video.approve',
  entityScope: 'kids_ascension',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-12-31'),
  limit: 50,
  offset: 0
});

logs.forEach(log => {
  console.log(`${log.createdAt}: ${log.action} on ${log.entityType} ${log.entityId}`);
  console.log('Metadata:', log.metadata);
});
```

## Configuration

### Client Configuration

```typescript
interface MCPClientConfig {
  database: 'shared-users-db' | 'kids-ascension-db' | 'ozean-licht-db';
  baseUrl?: string;        // Default: http://localhost:8100
  timeout?: number;        // Default: 10000ms
  retries?: number;        // Default: 3
  retryDelay?: number;     // Default: 1000ms
}
```

### Environment Variables

```bash
# Optional - defaults to localhost:8100
MCP_GATEWAY_URL=http://localhost:8100

# Database connections (for direct migration execution)
SHARED_USERS_DB_URL=postgresql://user:pass@host/shared_users_db

# For integration tests
RUN_INTEGRATION_TESTS=true
```

### Database Configuration

**Connection Requirements:**
- PostgreSQL 14+ (for gen_random_uuid())
- MCP Gateway running on http://localhost:8100
- shared_users_db database with `users` table (for foreign key)

**Performance Tuning:**
- Connection pooling handled by MCP Gateway (2-10 connections)
- All foreign keys and frequently queried columns have indexes
- JSONB columns use GIN indexes for fast wildcard permission matching

## Testing

### Run All Tests

```bash
cd projects/admin
npm test
```

### Run Unit Tests Only

```bash
npm test -- --testPathPattern=mcp-client
```

### Run Integration Tests

```bash
# Requires MCP Gateway running and database migrated
export RUN_INTEGRATION_TESTS=true
npm test -- --testPathPattern=integration
```

### Test Coverage

```bash
npm test -- --coverage
```

**Coverage Requirements:** > 80% for all modules

### Manual Integration Testing

```bash
# 1. Start MCP Gateway
cd infrastructure/mcp-gateway
docker compose up -d
curl http://localhost:8100/health

# 2. Execute migration
psql $SHARED_USERS_DB_URL -f projects/admin/migrations/001_create_admin_schema.sql

# 3. Verify tables
psql $SHARED_USERS_DB_URL -c "\dt admin_*"

# 4. Test health check
node -e "
const { MCPGatewayClientWithQueries } = require('./lib/mcp-client');
const client = new MCPGatewayClientWithQueries({ database: 'shared-users-db' });
client.healthCheck().then(r => console.log('Health:', r));
"
```

## Notes

### Design Decisions

**Why raw SQL instead of Prisma?**
- Early phase of admin dashboard development
- Prisma adds complexity for initial MVP
- Raw SQL provides full control over schema and migrations
- Can migrate to Prisma in future phase when ORM benefits outweigh costs

**Why MCP Gateway instead of direct database access?**
- Enforces architectural pattern (all agents use MCP Gateway)
- Centralizes connection pooling and monitoring
- Enables token cost tracking for AI agent operations
- Prepares for future remote agent access with unified authentication

**Why store admin users in shared_users_db?**
- Admin users manage both KA and OL platforms
- Unified authentication system (shared users table)
- Simplifies cross-platform admin operations
- Aligns with multi-tenant architecture

**Why JSONB for permissions?**
- Flexible permission model (add permissions without schema changes)
- Supports wildcard matching (*, users.*, ka.*)
- Fast indexing with PostgreSQL GIN indexes
- Easy serialization/deserialization in TypeScript

### Performance Characteristics

**Expected Response Times (via MCP Gateway):**
- Simple queries (by ID): < 50ms
- List queries (paginated): < 200ms
- Health check: < 100ms
- Audit log creation: < 150ms

**Overhead vs Direct Connection:**
- MCP Gateway adds ~20-50ms latency per request
- Acceptable tradeoff for centralized monitoring and agent compatibility

### Security Considerations

1. **No Direct Database Access**: All operations through MCP Gateway prevent SQL injection
2. **Localhost Authentication Bypass**: Internal agents automatically bypass auth (trusted network)
3. **Audit Logging**: All admin actions tracked with full context
4. **Session Tracking**: Active sessions monitored with expiration
5. **Permission Checking**: Granular wildcard permission system
6. **Soft Delete**: Deactivation maintains audit trail integrity
7. **Input Validation**: All create/update operations validate constraints

### Future Enhancements

**Phase 2: Prisma Integration**
- Generate Prisma schema from SQL tables
- Migrate MCP client to use Prisma Client
- Type-safe query builder with Prisma

**Phase 3: Admin Dashboard UI**
- React frontend using MCP client library
- Admin user management interface
- Role and permission assignment UI
- Audit log viewer with filters

**Phase 4: Advanced Features**
- Two-factor authentication for admin users
- IP whitelisting for admin access
- Real-time session monitoring
- Time-based and IP-based permission rules
- Audit log archival and compliance reports

### Related Documentation

- `projects/admin/README.md` - Complete client library documentation
- `projects/admin/migrations/README.md` - Database migration instructions
- `infrastructure/mcp-gateway/docs/guides/AGENT-NAVIGATION.md` - MCP Gateway agent guide
- `docs/architecture.md` - Overall system architecture

### Known Limitations

1. **Transaction Support**: Basic transaction support implemented but not yet tested extensively
2. **Batch Operations**: No bulk insert/update operations yet
3. **Real-time Events**: No pub/sub or real-time notification system
4. **Audit Log Archival**: No automatic archival for old logs (manual cleanup required)
5. **Permission Inheritance**: No role inheritance or hierarchical permissions yet

### Migration Notes

**Idempotency:** Migration uses `IF NOT EXISTS` and `ON CONFLICT DO NOTHING` to allow safe re-execution.

**Rollback:** To rollback the migration:

```sql
DROP TABLE IF EXISTS admin_sessions;
DROP TABLE IF EXISTS admin_audit_logs;
DROP TABLE IF EXISTS admin_permissions;
DROP TABLE IF EXISTS admin_roles;
DROP TABLE IF EXISTS admin_users;
```

**Seed Data:** System roles and base permissions are inserted automatically. Custom roles and permissions can be added via the client API.
