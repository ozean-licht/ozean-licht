# Grafana Monitoring - Production Deployment Guide

Step-by-step guide for deploying Grafana monitoring to production via Coolify.

## Prerequisites

- ✅ MCP Gateway deployed and running on Coolify
- ✅ Prometheus metrics endpoint operational (port 9090)
- ✅ All monitoring configuration files in place
- ⚠️ Secure admin password ready

## Deployment Strategy

### Option 1: Include in docker-compose.yml (Recommended)

This option deploys Grafana alongside MCP Gateway using the existing docker-compose.yml.

**Pros:**
- Single deployment unit
- Automatic container networking
- Simpler management

**Cons:**
- Grafana restarts when MCP Gateway restarts
- Shared resource limits

### Option 2: Separate Coolify Service

Deploy Grafana as a standalone service.

**Pros:**
- Independent lifecycle
- Separate resource allocation
- Better isolation

**Cons:**
- Manual network configuration
- Volume mount complexity

---

## Option 1: docker-compose.yml Deployment (Recommended)

### Step 1: Prepare Environment Variables

Add to Coolify environment configuration:

```bash
# Grafana Configuration
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=<generate-secure-password>
GRAFANA_ROOT_URL=http://grafana.ozean-licht.dev
GRAFANA_DOMAIN=grafana.ozean-licht.dev

# Redis (if not already set)
REDIS_PASSWORD=<generate-secure-password>
```

**Generate secure passwords**:
```bash
openssl rand -base64 32
```

### Step 2: Verify Configuration Files

Ensure all files exist:
```bash
ls -R infrastructure/mcp-gateway/monitoring/grafana/
```

Expected structure:
```
monitoring/grafana/
├── dashboards/
│   └── mcp-gateway-overview.json
└── provisioning/
    ├── datasources/
    │   └── prometheus.yml
    ├── dashboards/
    │   └── default.yml
    └── alerting/
        └── rules.yml
```

### Step 3: Commit and Push Changes

```bash
cd /opt/ozean-licht-ecosystem

# Stage all monitoring files
git add infrastructure/mcp-gateway/monitoring/
git add infrastructure/mcp-gateway/docker-compose.yml

# Commit
git commit -m "feat: add Grafana monitoring stack with dashboards and alerts

- Add Grafana service to docker-compose.yml
- Create comprehensive MCP Gateway dashboard
- Configure Prometheus datasource provisioning
- Add 14 alerting rules for monitoring
- Include deployment documentation

Phase 8: Monitoring & Observability"

# Push to trigger auto-deploy
git push origin main
```

### Step 4: Monitor Deployment

**Watch Coolify logs**:
1. Open Coolify dashboard: http://coolify.ozean-licht.dev:8000
2. Navigate to MCP Gateway service
3. Go to "Logs" tab
4. Watch for:
   ```
   mcp-grafana | Starting Grafana...
   mcp-grafana | provisioning datasources from configuration
   mcp-grafana | provisioning dashboards from configuration
   mcp-grafana | HTTP Server Listen on :3000
   ```

**Check container status**:
```bash
ssh -i ~/.ssh/ozean-automation root@138.201.139.25
docker ps | grep grafana
```

Expected output:
```
<container-id>  grafana/grafana:10.2.3  ...  Up X minutes  0.0.0.0:3000->3000/tcp  mcp-grafana
```

### Step 5: Configure Domain in Coolify

1. **Open MCP Gateway service** in Coolify
2. **Go to "Domains" tab**
3. **Add new domain**:
   - Domain: `grafana.ozean-licht.dev`
   - Port: `3000`
   - Container: `mcp-grafana`
4. **Enable SSL**:
   - Type: Let's Encrypt
   - Auto-renew: Enabled
5. **Save and wait** for SSL certificate generation

### Step 6: Verify Deployment

**1. Health Check**:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "commit": "...",
  "database": "ok",
  "version": "10.2.3"
}
```

**2. Access Grafana UI**:
- URL: http://grafana.ozean-licht.dev
- Username: `admin`
- Password: `<your-secure-password>`

**3. Change Admin Password**:
- First login will prompt password change
- Set a new secure password
- Store in password manager

**4. Verify Datasource**:
- Go to: Configuration (⚙️) → Data sources
- Click: Prometheus
- Scroll down and click: "Test"
- Should see: ✅ "Data source is working"

**5. Verify Dashboard**:
- Go to: Dashboards (📊) → Browse
- Folder: "MCP Gateway"
- Click: "MCP Gateway - Overview"
- Should see: Live metrics and graphs

**6. Verify Alerts**:
- Go to: Alerting (🔔) → Alert rules
- Should see: 14 rules loaded
- Status: All should show "Normal" (green)

### Step 7: Configure Alerting (Optional)

**Add notification channel**:

1. **Go to**: Alerting → Contact points
2. **Add contact point**
3. **Choose notification method**:

**Option A: Slack**
```yaml
Name: mcp-gateway-slack
Type: Slack
Webhook URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
Channel: #alerts
Username: Grafana MCP Gateway
Icon: :robot_face:
```

**Option B: Discord**
```yaml
Name: mcp-gateway-discord
Type: Discord
Webhook URL: https://discord.com/api/webhooks/YOUR/WEBHOOK/ID
Message: {{ template "discord.default.message" . }}
```

**Option C: N8N Webhook**
```yaml
Name: mcp-gateway-n8n
Type: Webhook
URL: http://n8n.ozean-licht.dev/webhook/grafana-alerts
HTTP Method: POST
```

4. **Test the contact point**
5. **Edit notification policy**:
   - Default policy → Edit
   - Contact point: Select your new contact point
   - Save

---

## Option 2: Separate Coolify Service

### Step 1: Create Grafana Service

1. **Go to Coolify** → New Resource
2. **Select**: Docker Image
3. **Configure**:
   - Name: `mcp-grafana`
   - Image: `grafana/grafana:10.2.3`
   - Restart Policy: `unless-stopped`

### Step 2: Configure Ports

- Internal Port: `3000`
- Published Port: `3000`

### Step 3: Configure Environment Variables

Add all variables from Option 1, Step 1.

### Step 4: Configure Volumes

**Problem**: Coolify doesn't easily support mounting repo directories.

**Solution**: Use Git repository mount or copy files manually.

**Manual approach**:
1. Create named volume: `mcp-grafana-data`
2. SSH to server
3. Copy provisioning files:
   ```bash
   docker cp monitoring/grafana/provisioning/. mcp-grafana:/etc/grafana/provisioning/
   docker restart mcp-grafana
   ```

**Better approach**: Use Option 1 (docker-compose).

### Step 5: Configure Network

1. **Networks tab**
2. **Add**: `coolify` (to communicate with MCP Gateway)
3. **Save**

### Step 6: Deploy

Click "Deploy" and follow verification steps from Option 1.

---

## Post-Deployment

### Security Hardening

1. **Restrict Grafana access** to internal network:
   - Coolify → MCP Grafana → Domains
   - Remove public domain
   - Access via VPN or SSH tunnel only

2. **SSH Tunnel for secure access**:
   ```bash
   ssh -L 3000:localhost:3000 -i ~/.ssh/ozean-automation root@138.201.139.25
   ```
   Then access: http://localhost:3000

3. **Enable OAuth** (optional):
   - Grafana supports OAuth with GitHub, Google, etc.
   - Configure in Grafana settings

### Backup Configuration

**Export Grafana data**:
```bash
ssh -i ~/.ssh/ozean-automation root@138.201.139.25
docker run --rm -v mcp-grafana-data:/data -v /root/backups:/backup alpine \
  tar czf /backup/grafana-$(date +%Y%m%d).tar.gz /data
```

**Restore Grafana data**:
```bash
docker run --rm -v mcp-grafana-data:/data -v /root/backups:/backup alpine \
  tar xzf /backup/grafana-YYYYMMDD.tar.gz -C /
```

### Monitoring the Monitoring

Set up alerts for Grafana itself:

1. **Create Uptime Monitor** (e.g., UptimeRobot)
   - URL: http://grafana.ozean-licht.dev/api/health
   - Interval: 5 minutes
   - Notify: When down

2. **Resource Monitoring**:
   ```bash
   # Check Grafana container resource usage
   docker stats mcp-grafana
   ```

---

## Troubleshooting

### Grafana container won't start

**Check logs**:
```bash
docker logs mcp-grafana --tail 50
```

**Common issues**:
- Permission issues with volumes
- Invalid provisioning configuration
- Port conflict

**Solution**:
```bash
# Remove and recreate
docker rm -f mcp-grafana
docker compose up -d grafana
```

### Dashboard shows "No data"

**Check Prometheus endpoint from Grafana container**:
```bash
docker exec mcp-grafana wget -O- http://mcp-gateway:9090/metrics
```

**If connection fails**:
- Verify both containers are on same network
- Check MCP Gateway is running
- Verify port 9090 is exposed

### Alerts not firing

**Check alert rules in Grafana**:
- Alerting → Alert rules
- Look for errors in rule evaluation

**Manually test alert query**:
```bash
curl 'http://localhost:9090/api/v1/query?query=sum(rate(mcp_errors_total[5m]))'
```

### SSL certificate not generating

**Check Coolify logs**:
- Domain configuration
- DNS propagation (can take up to 24h)

**Temporary workaround**:
```bash
# Access via HTTP
curl http://grafana.ozean-licht.dev:3000
```

---

## Rollback Procedure

If deployment fails:

1. **Revert Git commit**:
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Or manually stop Grafana**:
   ```bash
   ssh -i ~/.ssh/ozean-automation root@138.201.139.25
   docker stop mcp-grafana
   docker rm mcp-grafana
   ```

3. **MCP Gateway continues running** unaffected

---

## Success Criteria

✅ **Deployment successful when**:
- [ ] Grafana container running and healthy
- [ ] Accessible via domain with SSL
- [ ] Prometheus datasource connected
- [ ] MCP Gateway dashboard loading with live data
- [ ] All 14 alert rules loaded and evaluating
- [ ] Admin password changed from default
- [ ] Notification channels configured (optional)

---

## Next Steps

After successful deployment:

1. **Customize dashboard** for your needs
2. **Set up alert notifications** (Slack/Discord/N8N)
3. **Create additional dashboards** for specific services
4. **Integrate with external monitoring** (Uptime Robot, etc.)
5. **Schedule regular backups** of Grafana data

---

**Estimated Deployment Time**: 15-30 minutes
**Difficulty**: Intermediate
**Prerequisites**: Docker, Coolify, SSH access
**Support**: See monitoring/README.md for detailed documentation
