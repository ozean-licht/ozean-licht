# Admin Dashboard Scripts

This directory contains utility scripts for managing the admin dashboard.

## Available Scripts

### seed-test-admin.ts

Creates a test super admin user for development and testing purposes.

**Test Credentials:**
- Email: `admin@ozean-licht.dev`
- Password: `admin123`
- Role: `super_admin`
- Permissions: `["*"]` (all permissions)

**Usage:**

```bash
# From the projects/admin directory
npm run seed:test-admin

# Or directly with ts-node
ts-node scripts/seed-test-admin.ts
```

**Requirements:**
- MCP Gateway must be running at `http://localhost:8100`
- `shared_users_db` database must exist
- Admin schema (from issue #1) must be applied

**Behavior:**
- Idempotent - safe to run multiple times
- Will not create duplicate users if one already exists
- Prints credentials and login URL after successful creation

**Environment Variables:**
- `MCP_GATEWAY_URL` - MCP Gateway URL (default: `http://localhost:8100`)
- `DATABASE_NAME` - Database name (default: `shared-users-db`)
- `FRONTEND_PORT` - Frontend port for login URL (default: `9200`)

**Example Output:**

```
🌱 Seeding test admin user...

Checking if test user already exists...
Hashing password...
Creating base user...
✅ Base user created
Creating admin user record...
✅ Admin user created

🎉 Test admin user created successfully!

Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Email:       admin@ozean-licht.dev
   Password:    admin123
   Role:        super_admin
   Permissions: ["*"] (all permissions)
   User ID:     a0000000-0000-0000-0000-000000000001
   Admin ID:    b0000000-0000-0000-0000-000000000001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You can now log in to the admin dashboard at:
http://localhost:9200/login
```

## Security Notes

⚠️ **Important:** The test admin credentials are hardcoded for development purposes only.

**Never use these credentials in production!**

For production deployments:
1. Create admin users through a secure process
2. Use strong, unique passwords
3. Enable 2FA (when available)
4. Regularly rotate credentials
5. Audit admin access logs

## Troubleshooting

### "Connection refused" error

**Problem:** Cannot connect to MCP Gateway

**Solution:**
1. Verify MCP Gateway is running: `curl http://localhost:8100/health`
2. Check if port 8100 is accessible
3. Verify `MCP_GATEWAY_URL` environment variable

### "Database does not exist" error

**Problem:** `shared_users_db` database not found

**Solution:**
1. Ensure PostgreSQL is running
2. Create the database if needed
3. Apply admin schema migrations (from issue #1)

### "Table does not exist" error

**Problem:** Admin tables not created

**Solution:**
1. Run database migrations from issue #1
2. Verify tables exist: `psql shared_users_db -c "\dt"`

### "User already exists" message

**Behavior:** Script detects existing user and exits gracefully

**Action:** No action needed - this is expected behavior
