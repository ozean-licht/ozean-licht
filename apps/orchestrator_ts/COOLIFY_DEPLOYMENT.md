# Coolify Deployment Guide - TypeScript Orchestrator

> **Goal**: Deploy TypeScript orchestrator on Coolify, reusing existing PostgreSQL instance with a fresh orchestrator_db

## Deployment Strategy

**Reuse Existing Infrastructure:**
- ✅ Existing PostgreSQL container (from Python orchestrator)
- ✅ Existing Coolify network
- ✅ Clean slate for orchestrator_db (drop and recreate)

## Prerequisites

Before deploying, gather this information from your existing Coolify setup:

1. **PostgreSQL Container Name**: Find your existing PostgreSQL container
2. **PostgreSQL Password**: Get from environment variables
3. **Coolify Network**: Usually `coolify`
4. **Repository Path**: Where ecosystem is cloned on server

## Step 1: Clean Existing Database

### Option A: Drop and Recreate Database (Recommended)

Connect to your existing PostgreSQL container:

```bash
# SSH into your Coolify server
ssh root@138.201.139.25

# Find your PostgreSQL container name
docker ps | grep postgres

# Connect to PostgreSQL (replace container name)
docker exec -it <postgres-container-name> psql -U postgres

# In PostgreSQL shell:
# Drop existing orchestrator_db (this deletes all old Python orchestrator data)
DROP DATABASE IF EXISTS orchestrator_db;

# Create fresh database
CREATE DATABASE orchestrator_db;

# Grant permissions
GRANT ALL PRIVILEGES ON DATABASE orchestrator_db TO postgres;

# Enable required extensions
\c orchestrator_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

# Exit
\q
```

### Option B: Keep Existing Tables (Not Recommended)

If you want to keep some old data:

```sql
-- Connect to orchestrator_db
\c orchestrator_db

-- Drop only old tables
DROP TABLE IF EXISTS orchestrator_agents CASCADE;
DROP TABLE IF EXISTS orchestrator_chat CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS prompts CASCADE;
DROP TABLE IF EXISTS agent_logs CASCADE;
DROP TABLE IF EXISTS system_logs CASCADE;

-- Continue with migration below
```

## Step 2: Run Database Migration

Apply the new schema with ADW tables:

```bash
# Still on your Coolify server
cd /opt/ozean-licht-ecosystem

# Apply migration (replace container name and password)
docker exec -i <postgres-container-name> psql -U postgres orchestrator_db < apps/orchestrator_db/migrations/005_add_adw_tables.sql

# Verify tables were created
docker exec -it <postgres-container-name> psql -U postgres orchestrator_db -c "\dt"

# You should see:
# - orchestrator_agents
# - orchestrator_chat
# - adw_workflows
# - adw_workflow_events
# - adw_agent_outputs
```

## Step 3: Prepare Environment Variables

Create a `.env` file for Coolify with your secrets:

```bash
# On your Coolify server
cd /opt/ozean-licht-ecosystem/apps/orchestrator_ts

# Create .env file
cat > .env << 'EOF'
# PostgreSQL - Update container name
POSTGRES_CONTAINER_NAME=your-postgres-container-name
POSTGRES_PASSWORD=your-postgres-password

# Database URL (will be set in docker-compose)
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@${POSTGRES_CONTAINER_NAME}:5432/orchestrator_db

# Anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here

# GitHub
GITHUB_TOKEN=ghp_your-token-here
GITHUB_WEBHOOK_SECRET=your-webhook-secret

# Cloudflare R2 (optional)
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=orchestrator-storage

# Orchestrator
ORCHESTRATOR_MODEL=claude-sonnet-4-20250514
LOG_LEVEL=info
EOF

# Secure the file
chmod 600 .env
```

## Step 4: Update docker-compose.coolify.yml

Edit `docker-compose.coolify.yml` with your PostgreSQL container name:

```yaml
services:
  orchestrator-ts:
    environment:
      # Update this line with your actual PostgreSQL container name
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@YOUR_POSTGRES_CONTAINER_NAME:5432/orchestrator_db
```

**Example**: If your container is named `postgres-main-abc123`:
```yaml
DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@postgres-main-abc123:5432/orchestrator_db
```

## Step 5: Build Docker Image

Test build locally first:

```bash
cd /opt/ozean-licht-ecosystem/apps/orchestrator_ts

# Build image
docker build -t orchestrator-ts:latest .

# Test run locally (optional)
docker run --rm \
  --env-file .env \
  -p 8003:8003 \
  orchestrator-ts:latest

# Check health
curl http://localhost:8003/health
```

## Step 6: Deploy to Coolify

### Option A: Using Coolify UI

1. **Create New Service**:
   - Go to Coolify dashboard
   - Click "New Resource" → "Docker Compose"
   - Name: `orchestrator-ts`

2. **Configure Service**:
   - Upload `docker-compose.coolify.yml`
   - Set environment variables from your `.env` file
   - Ensure it's on the `coolify` network

3. **Deploy**:
   - Click "Deploy"
   - Monitor logs for startup

### Option B: Using Docker Compose Directly

```bash
# On your Coolify server
cd /opt/ozean-licht-ecosystem/apps/orchestrator_ts

# Deploy with docker compose
docker compose -f docker-compose.coolify.yml up -d

# Check status
docker ps | grep orchestrator-ts

# View logs
docker logs -f orchestrator-ts
```

## Step 7: Verify Deployment

### Check Health Endpoint

```bash
# From server
curl http://localhost:8003/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-11-09T12:00:00.000Z",
  "service": "orchestrator-ts"
}
```

### Check Database Connection

```bash
# Check logs for database connection
docker logs orchestrator-ts 2>&1 | grep "Database connected"

# Should see: "Database connected successfully"
```

### Test WebSocket

```bash
# Install wscat if needed
npm install -g wscat

# Connect to WebSocket
wscat -c ws://localhost:8003/ws

# Should receive:
{
  "type": "connection_established",
  "timestamp": "2025-11-09T12:00:00.000Z"
}
```

### Verify Database Tables

```bash
# Connect to PostgreSQL
docker exec -it <postgres-container-name> psql -U postgres orchestrator_db

# List tables
\dt

# Check data
SELECT * FROM orchestrator_agents;
SELECT * FROM adw_workflows;

# Exit
\q
```

## Step 8: Configure Traefik (Optional)

If you want external access with a domain:

### Update docker-compose.coolify.yml Labels

```yaml
services:
  orchestrator-ts:
    labels:
      - "traefik.enable=true"
      - "traefik.http.services.orchestrator-ts.loadbalancer.server.port=8003"
      - "traefik.http.routers.orchestrator-ts.rule=Host(`orchestrator-ts.ozean-licht.dev`)"
      - "traefik.http.routers.orchestrator-ts.entrypoints=websecure"
      - "traefik.http.routers.orchestrator-ts.tls.certresolver=letsencrypt"
```

### Add DNS Record

Point `orchestrator-ts.ozean-licht.dev` to your server IP: `138.201.139.25`

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs orchestrator-ts

# Common issues:
# 1. Database connection failed - Check DATABASE_URL
# 2. Missing API keys - Check environment variables
# 3. Port already in use - Check with: lsof -i :8003
```

### Database Connection Failed

```bash
# Test database connectivity
docker exec -it orchestrator-ts sh

# Inside container, test connection
node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect()
  .then(() => console.log('Connected!'))
  .catch(e => console.error('Error:', e))
  .finally(() => client.end());
"
```

### Can't Access from Outside

```bash
# Check if container is on coolify network
docker inspect orchestrator-ts | grep -A 5 Networks

# Should show "coolify" network
```

### WebSocket Not Working

```bash
# Check CORS settings
docker logs orchestrator-ts | grep CORS

# Verify WebSocket endpoint
curl -i http://localhost:8003/ws
# Should return: 426 Upgrade Required (this is correct)
```

## Rollback Plan

If deployment fails, rollback to Python orchestrator:

```bash
# Stop TypeScript orchestrator
docker stop orchestrator-ts
docker rm orchestrator-ts

# Restore database from backup (if you made one)
docker exec -i <postgres-container-name> psql -U postgres < backup_orchestrator_db.sql

# Restart Python orchestrator
cd /opt/ozean-licht-ecosystem/apps/orchestrator_3_stream
docker compose up -d
```

## Migration Checklist

- [ ] SSH into Coolify server
- [ ] Find existing PostgreSQL container name
- [ ] Drop old orchestrator_db database
- [ ] Create fresh orchestrator_db
- [ ] Run migration `005_add_adw_tables.sql`
- [ ] Verify tables created (5 tables)
- [ ] Create `.env` file with secrets
- [ ] Update `docker-compose.coolify.yml` with container name
- [ ] Build Docker image
- [ ] Deploy to Coolify
- [ ] Check health endpoint
- [ ] Verify database connection
- [ ] Test WebSocket connection
- [ ] Configure Traefik (optional)
- [ ] Stop old Python orchestrator

## Monitoring

### Check Resource Usage

```bash
# Container stats
docker stats orchestrator-ts

# Memory usage
docker exec orchestrator-ts sh -c "cat /proc/meminfo | grep MemAvailable"

# CPU usage
docker top orchestrator-ts
```

### View Logs

```bash
# Follow logs
docker logs -f orchestrator-ts

# Last 100 lines
docker logs --tail 100 orchestrator-ts

# With timestamps
docker logs -t orchestrator-ts
```

### Database Performance

```bash
# Check active connections
docker exec -it <postgres-container-name> psql -U postgres orchestrator_db -c "
SELECT count(*) FROM pg_stat_activity WHERE datname = 'orchestrator_db';
"

# Check table sizes
docker exec -it <postgres-container-name> psql -U postgres orchestrator_db -c "
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

## Next Steps After Deployment

1. **Test ADW Workflows**: Create a test workflow to verify ADW functionality
2. **Monitor Performance**: Watch logs and metrics for first few hours
3. **Backup Database**: Set up automated backups for orchestrator_db
4. **Update Documentation**: Document any environment-specific changes
5. **Decommission Python Orchestrator**: Once stable, remove old orchestrator

## Support

If you encounter issues:
1. Check logs: `docker logs orchestrator-ts`
2. Check database: Connect and verify schema
3. Check network: Verify container is on coolify network
4. Check environment: Verify all required env vars are set

---

**Created**: 2025-11-09
**Status**: Ready for deployment
**PostgreSQL Strategy**: Reuse existing with clean orchestrator_db
