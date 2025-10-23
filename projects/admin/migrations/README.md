# Database Migrations

This directory contains database migrations for the admin dashboard.

## Migrations

### 001_create_admin_schema.sql

Creates the foundational admin tables in `shared_users_db`:
- `admin_users` - Admin user accounts
- `admin_roles` - Role definitions
- `admin_permissions` - Permission definitions
- `admin_audit_logs` - Audit trail
- `admin_sessions` - Session tracking

## Execution

### Prerequisites

1. Ensure PostgreSQL is running and accessible
2. Set the `SHARED_USERS_DB_URL` environment variable:
   ```bash
   export SHARED_USERS_DB_URL="postgresql://user:password@host:port/shared_users_db"
   ```

3. Verify the `users` table exists in `shared_users_db` (required for foreign key reference)

### Running Migrations

**Option 1: Direct PostgreSQL execution (recommended)**

```bash
psql $SHARED_USERS_DB_URL -f projects/admin/migrations/001_create_admin_schema.sql
```

**Option 2: Via MCP Gateway (if execute operation is available)**

```bash
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "postgres",
    "database": "shared-users-db",
    "operation": "execute",
    "query": "$(cat projects/admin/migrations/001_create_admin_schema.sql)"
  },
  "id": "migration-001"
}
EOF
```

### Verifying Migration

After running the migration, verify tables were created:

```bash
# List admin tables
psql $SHARED_USERS_DB_URL -c "\dt admin_*"

# Count seed data
psql $SHARED_USERS_DB_URL -c "SELECT COUNT(*) FROM admin_roles;"
psql $SHARED_USERS_DB_URL -c "SELECT COUNT(*) FROM admin_permissions;"
```

Expected output:
- 4 roles (super_admin, ka_admin, ol_admin, support)
- 14 permissions (users, videos, courses, system)

### Rollback

To rollback the migration (development only):

```bash
psql $SHARED_USERS_DB_URL <<EOF
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_audit_logs CASCADE;
DROP TABLE IF EXISTS admin_permissions CASCADE;
DROP TABLE IF EXISTS admin_roles CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
EOF
```

**WARNING:** This will delete all admin data!

## Migration Safety

All migrations are designed to be **idempotent**:
- Tables use `CREATE TABLE IF NOT EXISTS`
- Indexes use `CREATE INDEX IF NOT EXISTS`
- Seed data uses `ON CONFLICT DO NOTHING`

You can safely run migrations multiple times without errors.

## Troubleshooting

### Error: relation "users" does not exist

The `admin_users` table has a foreign key to the `users` table. Ensure the `users` table exists in `shared_users_db` before running this migration.

### Error: permission denied

Ensure your database user has the necessary permissions:
- CREATE (for tables and indexes)
- INSERT (for seed data)
- REFERENCES (for foreign keys)

### Error: database "shared_users_db" does not exist

Create the database first:

```bash
createdb shared_users_db
```

Or via psql:

```sql
CREATE DATABASE shared_users_db;
```
