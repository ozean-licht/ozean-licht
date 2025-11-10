# Admin Dashboard

Unified admin dashboard for Kids Ascension and Ozean Licht platforms with NextAuth authentication, role-based access control, and comprehensive audit logging.

## Features

### Authentication & Security
- **NextAuth v5 (Auth.js)** - Modern authentication with database sessions
- **PostgreSQL session storage** - Secure, server-side session management
- **Role-based access control** - Super admin, KA admin, OL admin, support roles
- **Permission system** - Granular permissions with wildcard support
- **Audit logging** - All authentication and admin actions logged
- **Route protection** - Middleware-based route guards
- **CSRF protection** - Built into NextAuth

### Dashboard & UI
- **Next.js 14 App Router** - Modern React with server components
- **TypeScript** - Full type safety across the stack
- **Tailwind CSS** - Utility-first styling
- **Responsive design** - Mobile-friendly admin interface
- **2FA setup page** - Placeholder UI for future implementation

### MCP Client Library
- **Type-safe database operations** via MCP Gateway
- **Zero direct database connections** - All operations through MCP Gateway
- **Comprehensive admin operations** - Users, roles, permissions, audit logs, sessions
- **Health check utilities** - Verify connectivity and database health
- **Automatic retries** - Transient failures automatically retried

## Quick Start

### Prerequisites

1. **MCP Gateway running** at `http://localhost:8100`
2. **PostgreSQL database** with admin schema applied (from issue #1)
3. **Node.js 18+** installed

### Installation

```bash
# Install dependencies
npm install

# Or with pnpm (recommended)
pnpm install
```

### Configuration

1. Copy environment variables:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your values:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:9200
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# MCP Gateway
MCP_GATEWAY_URL=http://localhost:8100
DATABASE_NAME=shared-users-db

# Ports (for isolated worktrees)
FRONTEND_PORT=9200
```

3. Generate NextAuth secret:

```bash
openssl rand -base64 32
```

### Create Test Admin User

```bash
# Run the seed script
npm run seed:test-admin
```

**Test Credentials:**
- Email: `admin@ozean-licht.dev`
- Password: `admin123`
- Role: `super_admin`

### Run Development Server

```bash
# Start Next.js dev server
npm run dev

# Or with custom port
FRONTEND_PORT=9200 npm run dev
```

Visit `http://localhost:9200/login` to access the dashboard.

## Authentication Architecture

### NextAuth Configuration

The admin dashboard uses NextAuth v5 (Auth.js) with a custom PostgreSQL adapter:

- **Authentication Provider:** Credentials (email/password)
- **Session Strategy:** Database-backed sessions (stored in `admin_sessions` table)
- **Session Duration:** 24 hours
- **Adapter:** Custom MCP Gateway adapter for admin tables

### Authentication Flow

1. **Login Request:**
   - User submits email/password → LoginForm component
   - NextAuth Credentials provider → `authorize` function
   - Query `admin_users` via MCP Gateway → Verify password with bcrypt
   - Create session via adapter → Store in `admin_sessions` table
   - Set httpOnly cookie → Redirect to dashboard

2. **Protected Route Access:**
   - Request to `/dashboard/*` → Middleware intercepts
   - Check session cookie → Validate via NextAuth
   - If valid: Allow access, update `last_activity_at`
   - If invalid: Redirect to `/login`

3. **Logout:**
   - User clicks logout → Call NextAuth `signOut`
   - Delete session from `admin_sessions` → Clear cookie
   - Redirect to `/login`

### Route Protection

All routes under `/dashboard/*` are protected by Next.js middleware. The middleware:

- Checks for valid session
- Redirects unauthenticated users to `/login`
- Preserves callback URL for post-login redirect
- Redirects authenticated users away from `/login`

### Auth Utilities

```typescript
import { requireAuth, hasPermission } from '@/lib/auth-utils'

// Server component - require authentication
export default async function MyPage() {
  const session = await requireAuth() // Throws redirect if not auth
  return <div>Welcome {session.user.email}</div>
}

// Check permissions
const canEdit = hasPermission(session.user.permissions, 'users.edit')

// Wildcard permissions
hasPermission(['*'], 'anything') // true - super admin
hasPermission(['users.*'], 'users.create') // true - all user operations
hasPermission(['*.read'], 'videos.read') // true - all read operations
```

## MCP Client Library Usage

### Basic Example

```typescript
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';

// Initialize client
const client = new MCPGatewayClientWithQueries({
  database: 'shared-users-db',
  baseUrl: 'http://localhost:8100', // Optional, defaults to localhost:8100
  timeout: 10000, // Optional, defaults to 10s
  retries: 3, // Optional, defaults to 3
});

// Health check
const health = await client.healthCheck();
console.log('Gateway healthy:', health.healthy);

// Get admin user
const adminUser = await client.getAdminUserById('user-id');
console.log('Admin user:', adminUser);

// List admin roles
const roles = await client.listAdminRoles();
console.log('Available roles:', roles);
```

## Configuration

### MCPClientConfig

```typescript
interface MCPClientConfig {
  database: 'shared-users-db' | 'kids-ascension-db' | 'ozean-licht-db';
  baseUrl?: string; // Default: http://localhost:8100
  timeout?: number; // Default: 10000ms
  retries?: number; // Default: 3
  retryDelay?: number; // Default: 1000ms
}
```

### Environment Variables

```bash
# Optional - defaults to localhost:8100
MCP_GATEWAY_URL=http://localhost:8100

# For integration tests
RUN_INTEGRATION_TESTS=true
```

## API Reference

### Admin User Operations

#### `getAdminUserById(id: string): Promise<AdminUser | null>`

Get admin user by ID.

```typescript
const user = await client.getAdminUserById('user-id');
if (user) {
  console.log('Admin role:', user.adminRole);
  console.log('Permissions:', user.permissions);
}
```

#### `getAdminUserByUserId(userId: string): Promise<AdminUser | null>`

Get admin user by underlying user ID.

```typescript
const user = await client.getAdminUserByUserId('base-user-id');
```

#### `createAdminUser(data: CreateAdminUserInput): Promise<AdminUser>`

Create a new admin user.

```typescript
const newAdmin = await client.createAdminUser({
  userId: 'base-user-id',
  adminRole: 'support',
  entityScope: null,
  permissions: ['*.read'],
  createdBy: 'creator-admin-id',
});
```

#### `updateAdminUser(id: string, data: UpdateAdminUserInput): Promise<AdminUser>`

Update an admin user.

```typescript
const updated = await client.updateAdminUser('admin-id', {
  permissions: ['users.read', 'users.update'],
  updatedBy: 'updater-admin-id',
});
```

#### `listAdminUsers(filters?: AdminUserFilters): Promise<AdminUser[]>`

List admin users with optional filters.

```typescript
// List all active KA admins
const kaAdmins = await client.listAdminUsers({
  adminRole: 'ka_admin',
  isActive: true,
  limit: 50,
});

// List all support staff
const support = await client.listAdminUsers({
  adminRole: 'support',
});
```

#### `deactivateAdminUser(id: string): Promise<void>`

Deactivate an admin user (soft delete).

```typescript
await client.deactivateAdminUser('admin-id');
```

### Role Operations

#### `getAdminRoleById(id: string): Promise<AdminRoleDefinition | null>`

Get role by ID.

```typescript
const role = await client.getAdminRoleById('role-id');
```

#### `getAdminRoleByName(name: string): Promise<AdminRoleDefinition | null>`

Get role by name.

```typescript
const superAdmin = await client.getAdminRoleByName('super_admin');
console.log('Default permissions:', superAdmin.defaultPermissions);
```

#### `listAdminRoles(): Promise<AdminRoleDefinition[]>`

List all admin roles.

```typescript
const roles = await client.listAdminRoles();
roles.forEach(role => {
  console.log(`${role.roleLabel}: ${role.description}`);
});
```

### Permission Operations

#### `listAdminPermissions(category?: string): Promise<AdminPermission[]>`

List all permissions, optionally filtered by category.

```typescript
// All permissions
const allPerms = await client.listAdminPermissions();

// User permissions only
const userPerms = await client.listAdminPermissions('users');
```

#### `checkPermission(adminUserId: string, permissionKey: string): Promise<boolean>`

Check if an admin user has a specific permission.

```typescript
// Check exact permission
const canReadUsers = await client.checkPermission('admin-id', 'users.read');

// Wildcard matching supported
const hasAll = await client.checkPermission('admin-id', '*'); // All permissions
const canReadAnything = await client.checkPermission('admin-id', '*.read'); // All read permissions
const canDoUserStuff = await client.checkPermission('admin-id', 'users.*'); // All user permissions
```

### Audit Log Operations

#### `createAuditLog(data: CreateAuditLogInput): Promise<AdminAuditLog>`

Create an audit log entry.

```typescript
const log = await client.createAuditLog({
  adminUserId: 'admin-id',
  action: 'user.update',
  entityType: 'user',
  entityId: 'target-user-id',
  entityScope: 'kids_ascension',
  metadata: {
    before: { email: 'old@example.com' },
    after: { email: 'new@example.com' },
  },
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  requestId: 'req-123',
});
```

#### `listAuditLogs(filters: AuditLogFilters): Promise<AdminAuditLog[]>`

List audit logs with filters.

```typescript
// All logs for a user
const userLogs = await client.listAuditLogs({
  adminUserId: 'admin-id',
  limit: 100,
});

// Logs for specific action
const approvals = await client.listAuditLogs({
  action: 'video.approve',
  entityScope: 'kids_ascension',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-12-31'),
});

// Logs for specific entity
const entityLogs = await client.listAuditLogs({
  entityType: 'video',
  entityId: 'video-id',
});
```

### Session Operations

#### `createSession(data: CreateSessionInput): Promise<AdminSession>`

Create a new admin session.

```typescript
const session = await client.createSession({
  adminUserId: 'admin-id',
  sessionToken: 'random-secure-token',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  ttlSeconds: 86400, // 24 hours
});
```

#### `getSessionByToken(token: string): Promise<AdminSession | null>`

Get session by token (only returns non-expired sessions).

```typescript
const session = await client.getSessionByToken('session-token');
if (session) {
  console.log('Session expires at:', session.expiresAt);
  console.log('Last activity:', session.lastActivityAt);
}
```

#### `updateSessionActivity(token: string): Promise<void>`

Update session activity timestamp.

```typescript
await client.updateSessionActivity('session-token');
```

#### `deleteSession(token: string): Promise<void>`

Delete a session (logout).

```typescript
await client.deleteSession('session-token');
```

#### `deleteExpiredSessions(): Promise<number>`

Delete all expired sessions (cleanup job).

```typescript
const deleted = await client.deleteExpiredSessions();
console.log(`Deleted ${deleted} expired sessions`);
```

### Raw Query Operations

#### `query<T>(sql: string, params?: any[]): Promise<T[]>`

Execute a raw SQL query.

```typescript
const result = await client.query<{ count: number }>(
  'SELECT COUNT(*) as count FROM admin_users WHERE is_active = $1',
  [true]
);
console.log('Active admins:', result[0].count);
```

#### `execute(sql: string, params?: any[]): Promise<number>`

Execute a SQL statement (returns affected rows).

```typescript
const affected = await client.execute(
  'UPDATE admin_users SET updated_at = NOW() WHERE id = $1',
  ['user-id']
);
console.log(`Updated ${affected} rows`);
```

#### `transaction<T>(callback: (client) => Promise<T>): Promise<T>`

Execute multiple operations in a transaction.

```typescript
const result = await client.transaction(async (tx) => {
  const user = await tx.createAdminUser({ ... });
  await tx.createAuditLog({ ... });
  return user;
});
```

### Health Check Utilities

#### `healthCheck(client: MCPGatewayClient): Promise<MCPHealthResponse>`

Check MCP Gateway and database health.

```typescript
import { healthCheck } from '@admin/mcp-client';

const health = await healthCheck(client);
console.log('Healthy:', health.healthy);
console.log('Latency:', health.latency, 'ms');
```

#### `checkGatewayReachable(baseUrl?: string): Promise<boolean>`

Check if MCP Gateway is reachable.

```typescript
import { checkGatewayReachable } from '@admin/mcp-client';

const reachable = await checkGatewayReachable('http://localhost:8100');
```

#### `getGatewayInfo(baseUrl?: string): Promise<{ version: string; services: string[] } | null>`

Get MCP Gateway version and available services.

```typescript
import { getGatewayInfo } from '@admin/mcp-client';

const info = await getGatewayInfo();
console.log('Gateway version:', info?.version);
console.log('Services:', info?.services);
```

#### `checkDatabaseConnection(client: MCPGatewayClient): Promise<DiagnosticInfo>`

Verify database connection with detailed diagnostics.

```typescript
import { checkDatabaseConnection } from '@admin/mcp-client';

const diag = await checkDatabaseConnection(client);
console.log('Connected:', diag.connected);
console.log('DB Version:', diag.databaseVersion);
```

## Error Handling

All errors extend the `MCPError` base class:

```typescript
import {
  MCPError,
  MCPTimeoutError,
  MCPConnectionError,
  MCPValidationError,
  MCPQueryError,
} from '@admin/mcp-client';

try {
  const user = await client.getAdminUserById('user-id');
} catch (error) {
  if (error instanceof MCPTimeoutError) {
    console.error('Request timed out');
  } else if (error instanceof MCPConnectionError) {
    console.error('Failed to connect to MCP Gateway');
  } else if (error instanceof MCPQueryError) {
    console.error('Database query failed:', error.message);
  } else if (error instanceof MCPValidationError) {
    console.error('Invalid request:', error.message);
  } else if (error instanceof MCPError) {
    console.error('MCP error:', error.code, error.message);
  }
}
```

### Error Codes

- `-32000`: Timeout error
- `-32001`: Connection error
- `-32002`: Not used
- `-32003`: Query error
- `-32602`: Validation error (invalid params)
- `-32603`: Internal error

## Testing

```bash
# Run unit tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests (requires MCP Gateway)
RUN_INTEGRATION_TESTS=true npm run test:integration

# Type checking
npm run typecheck

# Build
npm run build
```

## Database Schema

This library interacts with the following tables in `shared_users_db`:

- `admin_users` - Admin user accounts
- `admin_roles` - Role definitions
- `admin_permissions` - Permission definitions
- `admin_audit_logs` - Audit trail
- `admin_sessions` - Session tracking

See `migrations/001_create_admin_schema.sql` for the complete schema.

## Migration

To apply the database schema:

```bash
psql $SHARED_USERS_DB_URL -f projects/admin/migrations/001_create_admin_schema.sql
```

See `migrations/README.md` for detailed migration instructions.

## Examples

### Complete Admin User Lifecycle

```typescript
// Create admin user
const newAdmin = await client.createAdminUser({
  userId: 'base-user-id',
  adminRole: 'ka_admin',
  entityScope: 'kids_ascension',
  permissions: ['ka.*'],
});

// Check permission
const canApprove = await client.checkPermission(newAdmin.id, 'ka.videos.approve');
console.log('Can approve videos:', canApprove);

// Create session
const session = await client.createSession({
  adminUserId: newAdmin.id,
  sessionToken: 'secure-random-token',
  ipAddress: '192.168.1.1',
});

// Log action
await client.createAuditLog({
  adminUserId: newAdmin.id,
  action: 'video.approve',
  entityType: 'video',
  entityId: 'video-123',
  entityScope: 'kids_ascension',
  metadata: { approved: true },
});

// Update session activity
await client.updateSessionActivity(session.sessionToken);

// List user's audit logs
const logs = await client.listAuditLogs({
  adminUserId: newAdmin.id,
  limit: 10,
});

// Logout
await client.deleteSession(session.sessionToken);

// Deactivate admin
await client.deactivateAdminUser(newAdmin.id);
```

### Permission Checking Examples

```typescript
// Super admin (has wildcard *)
await client.checkPermission('super-admin-id', 'users.read'); // true
await client.checkPermission('super-admin-id', 'anything'); // true

// KA admin (has ka.*)
await client.checkPermission('ka-admin-id', 'ka.videos.approve'); // true
await client.checkPermission('ka-admin-id', 'ol.courses.create'); // false

// Support (has *.read)
await client.checkPermission('support-id', 'users.read'); // true
await client.checkPermission('support-id', 'users.update'); // false
```

## Architecture

This library follows a three-tier architecture:

```
Admin Dashboard Application
         ↓
MCP Client Library (TypeScript)
         ↓
MCP Gateway (JSON-RPC 2.0)
         ↓
PostgreSQL (shared_users_db)
```

### Key Design Decisions

1. **No direct database access** - All operations go through MCP Gateway for centralized metrics, connection pooling, and future remote access
2. **Zero authentication overhead** - Localhost/Docker network bypass for trusted internal agents
3. **Type-safe operations** - Full TypeScript types for all operations and responses
4. **Automatic retries** - Transient failures are automatically retried up to 3 times
5. **Comprehensive audit logging** - All admin actions are logged for compliance and security

## Performance

Expected performance (via MCP Gateway):

- Simple queries (by ID): < 50ms
- List queries (paginated): < 200ms
- Health check: < 100ms round-trip
- Audit log creation: < 150ms

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Documentation Index](./docs/README.md)** - Complete documentation overview
- **[Platform Requirements](./docs/requirements/)** - Kids Ascension & Ozean Licht specifications
- **[Deployment Guide](./docs/deployment/DEPLOYMENT.md)** - Production deployment instructions
- **[Test Credentials](./docs/development/credentials.md)** - Test user accounts for local development
- **[Architecture Decisions](./docs/archive/adw-plans/)** - Historical architecture decision records
- **[Roadmap](./specs/admin-dashboard-roadmap.md)** - Implementation roadmap and phases

## License

UNLICENSED - Private package for Ozean Licht Ecosystem

## Support

For issues, questions, or contributions, please contact the development team or refer to the main repository documentation.
