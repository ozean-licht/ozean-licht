# Orchestrator TypeScript Configuration for Coolify

## Service Overview

**Name**: orchestrator-ts
**Image**: Custom build from `apps/orchestrator_ts/Dockerfile`
**Port**: 8003
**Network**: coolify
**Database**: Reuses existing PostgreSQL instance with fresh `orchestrator_db`

## Quick Deploy

### 1. Clean Existing Database

```bash
# SSH to Coolify server
ssh root@138.201.139.25

# Run cleanup script (replace with your postgres container name)
cd /opt/ozean-licht-ecosystem/apps/orchestrator_ts
./scripts/clean-database.sh <your-postgres-container-name>
```

### 2. Update docker-compose.coolify.yml

Edit `apps/orchestrator_ts/docker-compose.coolify.yml`:

```yaml
environment:
  DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@YOUR_POSTGRES_CONTAINER:5432/orchestrator_db
```

### 3. Deploy

```bash
cd /opt/ozean-licht-ecosystem/apps/orchestrator_ts
docker compose -f docker-compose.coolify.yml up -d
```

### 4. Verify

```bash
# Check health
curl http://localhost:8003/health

# Check logs
docker logs -f orchestrator-ts
```

## Environment Variables

### Required

```env
# Database
DATABASE_URL=postgresql://postgres:PASSWORD@CONTAINER:5432/orchestrator_db

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# GitHub
GITHUB_TOKEN=ghp_...
```

### Optional

```env
# Server
PORT=8003
HOST=0.0.0.0
NODE_ENV=production

# GitHub Webhooks
GITHUB_WEBHOOK_SECRET=your-secret

# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-key
R2_SECRET_ACCESS_KEY=your-secret
R2_BUCKET_NAME=orchestrator-storage

# ADW Configuration
ADW_WORKING_DIR=/opt/ozean-licht-ecosystem
ADW_BACKEND_PORT_START=9100
ADW_FRONTEND_PORT_START=9200
ADW_MAX_CONCURRENT_WORKFLOWS=15

# Orchestrator
ORCHESTRATOR_MODEL=claude-sonnet-4-20250514
ORCHESTRATOR_WORKING_DIR=/opt/ozean-licht-ecosystem

# Logging
LOG_LEVEL=info
```

## Database Schema

The `orchestrator_db` contains:

1. **orchestrator_agents** - Orchestrator instances and metadata
2. **orchestrator_chat** - Chat history with orchestrator
3. **adw_workflows** - ADW workflow state (NEW)
4. **adw_workflow_events** - ADW event log (NEW)
5. **adw_agent_outputs** - ADW agent outputs (NEW)

## Endpoints

- `GET /health` - Health check
- `GET /ws` - WebSocket endpoint for real-time events

## Traefik Configuration (Optional)

For external access with domain:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.services.orchestrator-ts.loadbalancer.server.port=8003"
  - "traefik.http.routers.orchestrator-ts.rule=Host(`orchestrator-ts.ozean-licht.dev`)"
  - "traefik.http.routers.orchestrator-ts.entrypoints=websecure"
  - "traefik.http.routers.orchestrator-ts.tls.certresolver=letsencrypt"
```

Don't forget to add DNS record: `orchestrator-ts.ozean-licht.dev → 138.201.139.25`

## Volume Mounts

### Ecosystem Repository (Required)
```yaml
volumes:
  - /opt/ozean-licht-ecosystem:/opt/ozean-licht-ecosystem
```

Needed for ADW operations (git worktrees, file access).

### Git Configuration (Optional)
```yaml
volumes:
  - /root/.gitconfig:/home/appuser/.gitconfig:ro
  - /root/.ssh:/home/appuser/.ssh:ro
```

Needed if ADW workflows require git push/pull operations.

## Resource Limits

Recommended:
- **Memory**: 2GB minimum, 4GB recommended
- **CPU**: 2 cores
- **Disk**: 10GB (mainly for git worktrees)

## Monitoring

### Health Check

```bash
# Simple health check
curl http://localhost:8003/health

# Expected: {"status":"ok","timestamp":"...","service":"orchestrator-ts"}
```

### Logs

```bash
# Follow logs
docker logs -f orchestrator-ts

# Last 100 lines
docker logs --tail 100 orchestrator-ts

# JSON formatted logs (structured)
docker logs orchestrator-ts | jq
```

### Database Monitoring

```bash
# Active connections
docker exec -it <postgres-container> psql -U postgres orchestrator_db -c "
SELECT count(*) FROM pg_stat_activity WHERE datname = 'orchestrator_db';
"

# Table sizes
docker exec -it <postgres-container> psql -U postgres orchestrator_db -c "
SELECT tablename, pg_size_pretty(pg_total_relation_size('public.'||tablename))
FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size('public.'||tablename) DESC;
"
```

## Troubleshooting

### Container Won't Start

1. Check logs: `docker logs orchestrator-ts`
2. Verify DATABASE_URL is correct
3. Ensure PostgreSQL container is running
4. Check environment variables are set

### Database Connection Failed

```bash
# Test from within container
docker exec -it orchestrator-ts sh
node -e "console.log(process.env.DATABASE_URL)"
```

### WebSocket Not Working

1. Check CORS settings in logs
2. Verify port 8003 is accessible
3. Test with: `wscat -c ws://localhost:8003/ws`

### Can't Access from External Domain

1. Verify Traefik labels are correct
2. Check DNS points to server
3. Verify container is on `coolify` network:
   ```bash
   docker inspect orchestrator-ts | grep -A 5 Networks
   ```

## Migration from Python Orchestrator

This TypeScript version replaces the Python orchestrator at `apps/orchestrator_3_stream`.

### Key Differences

| Python (Old) | TypeScript (New) |
|-------------|-----------------|
| Port 9403 | Port 8003 |
| FastAPI (Python) | Fastify (Node.js) |
| JSON file state | PostgreSQL state |
| Claude CLI subprocess | Agent SDK native |
| o-commands/a-commands | Unified commands |

### After Successful Deployment

1. Monitor TypeScript orchestrator for 24-48 hours
2. Verify ADW workflows work correctly
3. Stop Python orchestrator: `docker stop orchestrator_3_stream`
4. Remove Python orchestrator container (keep as backup initially)

## Backup Strategy

### Database Backup

```bash
# Backup orchestrator_db
docker exec <postgres-container> pg_dump -U postgres orchestrator_db > backup_orchestrator_db_$(date +%Y%m%d).sql

# Compress
gzip backup_orchestrator_db_*.sql
```

### Restore from Backup

```bash
# Restore database
gunzip backup_orchestrator_db_20251109.sql.gz
docker exec -i <postgres-container> psql -U postgres orchestrator_db < backup_orchestrator_db_20251109.sql
```

## Next Steps After Deployment

1. ✅ Verify health endpoint responds
2. ✅ Check database connection in logs
3. ✅ Test WebSocket connection
4. ✅ Create test ADW workflow
5. ✅ Monitor performance for first few hours
6. ✅ Set up automated backups
7. ✅ Update DNS/Traefik (if using external domain)
8. ✅ Stop old Python orchestrator

---

**Created**: 2025-11-09
**PostgreSQL**: Reuse existing with fresh orchestrator_db
**Port**: 8003
**Status**: Ready for deployment
