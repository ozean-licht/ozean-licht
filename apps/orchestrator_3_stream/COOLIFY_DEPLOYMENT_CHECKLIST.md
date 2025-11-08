# Orchestrator 3 Stream - Coolify Deployment Checklist

**Domain:** intel.ozean-licht.com
**Status:** Ready to deploy

---

## ✅ Pre-Deployment Checklist

### Files Created
- [x] Dockerfile
- [x] docker-compose.yml
- [x] start.sh (executable)
- [x] DEPLOYMENT.md (full guide)
- [x] ADW Integration complete

### Database Ready
- [ ] PostgreSQL accessible from Coolify
- [ ] Database URL configured
- [ ] Migrations ready to run

---

## 🚀 Deployment Steps

### Step 1: Configure Database

**Option A: Use existing Coolify PostgreSQL**
```bash
# In Coolify PostgreSQL container
docker exec -it <postgres-container> psql -U postgres
CREATE DATABASE orchestrator_db;
```

**Option B: Use external PostgreSQL**
```bash
# Get DATABASE_URL from your existing setup
# Use DATABASE_URL from .env
```

### Step 2: Run Migrations

```bash
# SSH to server
cd /opt/ozean-licht-ecosystem

# Set DATABASE_URL
export DATABASE_URL="postgresql://user:pass@host:5432/orchestrator_db"

# Run migrations
uv run apps/orchestrator_db/run_migrations.py
```

Expected output:
```
✅ Migration 0_orchestrator_agents.sql completed
✅ Migration 1_agents.sql completed
✅ Migration 2_prompts.sql completed
✅ Migration 3_agent_logs.sql completed
✅ Migration 4_system_logs.sql completed
✅ Migration 5_indexes.sql completed
✅ Migration 6_functions.sql completed
✅ Migration 7_triggers.sql completed
✅ Migration 8_orchestrator_chat.sql completed
```

### Step 3: Create Application in Coolify

1. **Login to Coolify:** http://coolify.ozean-licht.dev:8000

2. **Create New Application**
   - Click "New Resource" → "Application"
   - Select "Docker Compose"

3. **Configure Application**
   - **Name:** `orchestrator-3-stream`
   - **Description:** "Multi-agent orchestration system with ADW integration"
   - **Project:** Select your project (or create new)

4. **Configure Git Source**
   - **Repository URL:** Your git repository
   - **Branch:** `main`
   - **Base Directory:** `apps/orchestrator_3_stream`
   - **Docker Compose File:** `docker-compose.yml`

### Step 4: Add Environment Variables

In Coolify application settings, add these environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/orchestrator_db

# API Keys (REQUIRED)
ANTHROPIC_API_KEY=sk-ant-your-key-here
GITHUB_PAT=ghp_your-token-here

# Model Configuration
ORCHESTRATOR_MODEL=claude-sonnet-4-20250514

# CORS (adjust as needed)
CORS_ORIGINS=https://intel.ozean-licht.com,https://admin.ozean-licht.dev

# Logging
LOG_LEVEL=INFO
```

### Step 5: Configure Domain

1. **In Coolify:**
   - Go to your application
   - Click "Domains" tab
   - Add domain: `intel.ozean-licht.com`
   - Enable "Generate SSL Certificate" (Let's Encrypt)

2. **In Cloudflare DNS:**
   ```
   Type: A
   Name: intel
   Content: 138.201.139.25
   Proxy status: Proxied (orange cloud)
   TTL: Auto
   ```

3. **Verify DNS:**
   ```bash
   dig intel.ozean-licht.com
   # Should resolve to 138.201.139.25
   ```

### Step 6: Configure Port Mapping

In Coolify, ensure these ports are mapped:

```yaml
Ports:
  - 9403:9403  # Backend API + WebSocket
  - 5175:5175  # Frontend
```

### Step 7: Deploy

1. Click "Deploy" button in Coolify
2. Monitor deployment logs
3. Wait for "Deployed successfully" message

### Step 8: Verify Deployment

```bash
# Health check
curl https://intel.ozean-licht.com/health

# Should return:
{
  "status": "healthy",
  "service": "orchestrator_3_stream",
  "websocket_connections": 0
}
```

### Step 9: Test Frontend

1. Open browser: https://intel.ozean-licht.com
2. Should see Orchestrator UI
3. Open browser console, check for errors
4. Try sending a test message

### Step 10: Test ADW Integration

In the orchestrator chat:
```
You: List all active ADW workflows
Expected: Uses list_adw_worktrees tool and returns results
```

---

## 🔍 Troubleshooting

### Container Won't Start

**Check logs in Coolify:**
- Go to Application → Logs tab
- Look for error messages

**Common issues:**
- DATABASE_URL not set or incorrect
- ANTHROPIC_API_KEY not set
- Port conflicts

**Fix:**
```bash
# SSH to server
docker logs orchestrator_3_stream

# Check if ports are available
netstat -tulpn | grep -E "(9403|5175)"
```

### Database Connection Failed

**Check:**
```bash
# Test database connection
docker exec orchestrator_3_stream pg_isready -d "$DATABASE_URL"

# Or manually
psql "$DATABASE_URL" -c "SELECT version();"
```

**Fix:**
- Verify DATABASE_URL format: `postgresql://user:pass@host:5432/dbname`
- Check PostgreSQL is running
- Verify network connectivity between containers

### Migrations Failed

**Manually run migrations:**
```bash
docker exec -it orchestrator_3_stream bash
cd /app
uv run python /app/orchestrator_db/run_migrations.py
```

### Frontend Not Loading

**Check:**
1. Frontend build succeeded?
   ```bash
   docker exec orchestrator_3_stream ls -la /app/frontend/dist
   ```

2. Frontend server running?
   ```bash
   docker exec orchestrator_3_stream ps aux | grep http.server
   ```

3. Access directly:
   ```bash
   curl http://138.201.139.25:5175
   ```

### WebSocket Not Connecting

**Check CORS settings:**
```bash
# Should include your domain
echo $CORS_ORIGINS
```

**Check WebSocket endpoint:**
```bash
# Test WebSocket
wscat -c wss://intel.ozean-licht.com/ws
```

**Fix:**
- Add domain to CORS_ORIGINS
- Verify SSL is enabled (wss:// not ws://)
- Check Coolify proxy settings

---

## 📊 Post-Deployment Verification

### Health Checks

```bash
# API Health
curl https://intel.ozean-licht.com/health

# Get Orchestrator
curl https://intel.ozean-licht.com/get_orchestrator

# WebSocket (requires wscat: npm install -g wscat)
wscat -c wss://intel.ozean-licht.com/ws
```

### Monitoring

**In Coolify:**
- Check CPU/Memory usage
- Monitor logs for errors
- Verify container is running

**Manual checks:**
```bash
# Container status
docker ps | grep orchestrator

# Resource usage
docker stats orchestrator_3_stream

# Logs
docker logs orchestrator_3_stream --tail 100 -f
```

---

## 🔐 Security Checklist

### Before Going Live

- [ ] SSL certificate active (https://)
- [ ] Firewall configured (only 80, 443 open)
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Database credentials strong
- [ ] API keys in environment (not code)
- [ ] Health endpoint accessible
- [ ] Logs rotating properly

### Optional: Add Authentication

See `DEPLOYMENT.md` for adding auth gateway integration with shared_users_db.

---

## 🔄 Updating the Application

### Deploy Updates

```bash
# Option 1: Auto-deploy on git push (configure in Coolify)
git push origin main

# Option 2: Manual deploy in Coolify
# Click "Deploy" button in Coolify dashboard

# Option 3: CLI deploy
coolify deploy orchestrator-3-stream
```

### Database Migrations

```bash
# SSH to server
docker exec -it orchestrator_3_stream bash

# Run new migrations
cd /app
uv run python /app/orchestrator_db/run_migrations.py
```

### Rollback

```bash
# In Coolify, go to Deployments
# Click on previous successful deployment
# Click "Redeploy"
```

---

## 📈 Success Criteria

✅ Container running without restarts
✅ Health endpoint returns 200
✅ Frontend loads at https://intel.ozean-licht.com
✅ WebSocket connects successfully
✅ Can send chat messages
✅ ADW tools accessible
✅ No errors in logs
✅ SSL certificate valid

---

## 🎯 Next Steps After Deployment

1. **Add to Admin Dashboard:**
   - Create link in admin sidebar
   - Or embed in iframe

2. **Configure Authentication:**
   - Integrate with shared_users_db
   - Add JWT verification
   - Protect endpoints

3. **Setup Monitoring:**
   - Add Grafana dashboard
   - Configure alerts
   - Set up log aggregation

4. **Documentation:**
   - User guide for team
   - API documentation
   - Troubleshooting guide

---

## 📞 Support

**Logs:** Coolify Dashboard → Application → Logs
**Container:** `docker exec -it orchestrator_3_stream bash`
**Database:** Check migrations in `apps/orchestrator_db/migrations/`

---

**Deployment Guide:** See `DEPLOYMENT.md` for full details
**Integration Guide:** See `app_docs/ADW_ORCHESTRATOR_INTEGRATION.md`
