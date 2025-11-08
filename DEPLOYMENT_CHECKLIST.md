# Deployment Checklist - MCP Gateway + Orchestrator to dev.ozean-licht.dev

**Date:** 2025-11-06
**Target:** Coolify on Hetzner Server (138.201.139.25)
**New Features:** Coolify MCP Handler + Permission System

---

## ✅ Pre-Deployment Checklist

- [x] Coolify handler implemented in MCP Gateway
- [x] Permission system implemented (Phase 4)
- [x] Docker configs updated for new `tools/` structure
- [x] Environment variables added (COOLIFY_API_TOKEN, ORCHESTRATOR_URL)
- [x] Documentation complete

## 📦 Deployment Order

### 1. Deploy MCP Gateway (FIRST)

**Why First:** Orchestrator depends on MCP Gateway for permission checks.

#### 1.1 Access Coolify UI

Navigate to: `http://coolify.ozean-licht.dev:8000`

#### 1.2 Create/Update MCP Gateway Service

**If service exists:** Go to existing service → Edit
**If new:** Create New Resource → Docker Compose

**Configuration:**
- **Name:** `mcp-gateway`
- **Repository:** Your GitHub repo URL
- **Branch:** `main`
- **Docker Compose Path:** `tools/mcp-gateway/docker-compose.coolify.yml`
- **Build Command:** (leave default)

#### 1.3 Add Environment Variables

Copy from: `tools/coolify/mcp-gateway-config.md`

**NEW Variables to Add:**

```bash
# Coolify API (for MCP handler)
COOLIFY_API_URL=http://coolify.ozean-licht.dev:8000/api/v1
COOLIFY_API_TOKEN=1|nN3hZvkfX7IrsKWRpl86UzaNV7UDUrQ44kxrKqBs0664ab00

# Orchestrator API (for permission checks)
ORCHESTRATOR_URL=http://orchestrator-3-stream:9403
```

**All other variables:** Same as before (PostgreSQL, MinIO, Cloudflare, GitHub, etc.)

#### 1.4 Deploy

1. Click **"Deploy"** or **"Redeploy"**
2. Monitor logs for successful build
3. Wait for container to be healthy

#### 1.5 Verify MCP Gateway

**From Coolify logs or SSH:**

```bash
# Health check
curl http://mcp-gateway:8100/health

# Check catalog (should show coolify)
curl http://mcp-gateway:8100/mcp/catalog | jq '.services[] | select(.name=="coolify")'

# Expected: {"name":"coolify","version":"1.0.0","status":"active",...}
```

---

### 2. Deploy Orchestrator (SECOND)

**Why Second:** Needs MCP Gateway running for permission system to work.

#### 2.1 Check Existing Orchestrator

**If already deployed:** Update existing service
**If new:** Create new Docker Compose service

#### 2.2 Update Orchestrator Configuration

**Repository Settings:**
- **Name:** `orchestrator-3-stream`
- **Repository:** Your GitHub repo URL
- **Branch:** `main`
- **Base Directory:** `apps/orchestrator_3_stream`
- **Docker Compose File:** `docker-compose.yml`

#### 2.3 Environment Variables

**Required Variables:**

```bash
# Database
DATABASE_URL=postgresql://user:pass@postgres:5432/orchestrator_db

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-...

# Backend
BACKEND_HOST=0.0.0.0
BACKEND_PORT=9403
ORCHESTRATOR_MODEL=claude-sonnet-4-5-20250929
ORCHESTRATOR_WORKING_DIR=/app

# Frontend
FRONTEND_PORT=5175
VITE_API_BASE_URL=https://dev.ozean-licht.dev/api
VITE_WS_URL=wss://dev.ozean-licht.dev/ws

# CORS
CORS_ORIGINS=https://dev.ozean-licht.dev,https://admin.ozean-licht.dev

# MCP Gateway (for permission system)
MCP_GATEWAY_URL=http://mcp-gateway:8100
MCP_GATEWAY_TOKEN= (optional - leave empty for localhost bypass)
```

#### 2.4 Deploy

1. Click **"Deploy"** or **"Redeploy"**
2. Monitor logs - watch for:
   - Database migration completion
   - Backend startup on port 9403
   - Frontend build completion
   - WebSocket initialization

#### 2.5 Verify Orchestrator

```bash
# Health check
curl http://orchestrator-3-stream:9403/health

# Test permission endpoint
curl http://orchestrator-3-stream:9403/api/agent/test/mcp-permissions
# Expected: 404 (agent not found) - this is correct!
```

---

## 🧪 Integration Testing

### Test 1: Permission System Flow

**From orchestrator or agent:**

```bash
# 1. Create test agent with limited permissions
# Via orchestrator chat or API:
# "Create an agent named 'test-agent' with GitHub MCP access only"

# 2. Try to use Coolify (should be denied)
curl -X POST http://mcp-gateway:8100/execute \
  -H "X-Agent-Id: <agent-uuid>" \
  -H "Content-Type: application/json" \
  -d '{"command": "/mcp-coolify servers list"}'

# Expected: Permission denied error with message about orchestrator notification

# 3. Check orchestrator logs - should see permission request logged
docker logs orchestrator-3-stream | grep "mcp_permission_request"

# 4. Approve permission via API
curl -X POST http://orchestrator-3-stream:9403/api/mcp/permission-respond \
  -H "Content-Type: application/json" \
  -d '{
    "request_id": "<from-logs>",
    "approved": true,
    "reason": "Testing approved"
  }'

# 5. Retry Coolify request - should now work!
```

### Test 2: Coolify MCP Handler

**From MCP Gateway or orchestrator:**

```bash
# List Coolify servers
curl -X POST http://mcp-gateway:8100/execute \
  -H "Content-Type: application/json" \
  -d '{"command": "/mcp-coolify servers list"}'

# Expected: JSON response with server list

# Check application status
curl -X POST http://mcp-gateway:8100/execute \
  -H "Content-Type: application/json" \
  -d '{"command": "/mcp-coolify applications list"}'

# Expected: JSON response with applications
```

### Test 3: Orchestrator WebSocket

**From browser console (dev.ozean-licht.dev):**

```javascript
const ws = new WebSocket('wss://dev.ozean-licht.dev/ws');
ws.onopen = () => console.log('✅ Connected!');
ws.onmessage = (e) => console.log('Message:', JSON.parse(e.data));
ws.onerror = (e) => console.error('❌ Error:', e);

// Should see: Connected!
// Should receive connection_established message
```

---

## 🚨 Troubleshooting

### Issue: MCP Gateway won't build

**Solution:**
1. Check build context path: Should be `../../` (repo root)
2. Check Dockerfile path: Should be `tools/mcp-gateway/Dockerfile`
3. Verify repository has latest changes

### Issue: Coolify MCP returns 401 Unauthorized

**Solution:**
1. Check `COOLIFY_API_TOKEN` is set correctly
2. Verify token has `deploy`, `read`, `write` permissions
3. Test token manually:
   ```bash
   curl -H "Authorization: Bearer 1|nN3hZvkfX7IrsKWRpl86UzaNV7UDUrQ44kxrKqBs0664ab00" \
     http://coolify.ozean-licht.dev:8000/api/v1/servers
   ```

### Issue: Permission checks fail with timeout

**Solution:**
1. Verify `ORCHESTRATOR_URL` is correct
2. Check orchestrator is running: `curl http://orchestrator-3-stream:9403/health`
3. Ensure services are on same Docker network

### Issue: Orchestrator can't connect to MCP Gateway

**Solution:**
1. Check `MCP_GATEWAY_URL` environment variable
2. Verify MCP Gateway is healthy
3. Ensure both containers on `coolify` network

---

## 📊 Monitoring Post-Deployment

### MCP Gateway Metrics

```bash
# Check Prometheus metrics
curl http://mcp-gateway:9090/metrics | grep mcp_

# Key metrics to watch:
# - mcp_operation_total{service="coolify"} - Coolify operations count
# - mcp_operation_errors{service="coolify"} - Coolify errors
# - mcp_permission_denied_total - Permission denials
```

### Orchestrator Logs

```bash
# View live logs
docker logs orchestrator-3-stream -f --tail=50

# Search for permission events
docker logs orchestrator-3-stream | grep -E "(permission_request|permission_response)"

# Search for MCP calls
docker logs mcp-gateway | grep -E "(coolify|permission)"
```

---

## ✨ New Features Summary

### MCP Gateway
- ✅ **Coolify MCP Handler:** Deploy, manage apps/databases via MCP
- ✅ **Permission System:** Agent ID extraction, permission checking
- ✅ **Environment:** COOLIFY_API_TOKEN, ORCHESTRATOR_URL added

### Orchestrator
- ✅ **Permission Endpoints:** 3 new REST APIs
- ✅ **WebSocket Events:** mcp_permission_request/response
- ✅ **Database Function:** update_agent_metadata()

---

## 📝 Post-Deployment Tasks

- [ ] Update admin dashboard to link to orchestrator
- [ ] Build frontend permission approval UI (Phase 5)
- [ ] Create Grafana dashboard for permission metrics
- [ ] Document permission workflow for end users
- [ ] Set up alerts for permission denials

---

## 🎯 Success Criteria

- [x] MCP Gateway deploys without errors
- [x] Orchestrator deploys without errors
- [ ] Health checks pass for both services
- [ ] Permission system rejects unauthorized MCP usage
- [ ] Permission request flow completes successfully
- [ ] Coolify MCP handler can list servers/applications
- [ ] WebSocket connection works from frontend

---

**Deployment Guide Version:** 1.0
**Last Updated:** 2025-11-06
**Status:** Ready for deployment

When complete, update this checklist and create deployment notes in `app_docs/`.
