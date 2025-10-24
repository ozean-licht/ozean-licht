# Admin MCP Client

MCP Gateway client library for the unified admin dashboard. Provides type-safe database operations for admin users, roles, permissions, audit logs, and session management.

## Features

- **Type-safe database operations** via MCP Gateway
- **Zero direct database connections** - all operations through MCP Gateway
- **Comprehensive admin operations** - users, roles, permissions, audit logs, sessions
- **Health check utilities** to verify connectivity
- **Automatic retries** on transient failures
- **TypeScript first** with full type definitions

## Installation

```bash
npm install @admin/mcp-client
```

## Quick Start

```typescript
import { MCPGatewayClientWithQueries } from '@admin/mcp-client';

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

## License

UNLICENSED - Private package for Ozean Licht Ecosystem

## Support

For issues, questions, or contributions, please contact the development team or refer to the main repository documentation.
