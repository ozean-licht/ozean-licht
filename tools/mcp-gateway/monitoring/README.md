# MCP Gateway Monitoring Setup

Complete monitoring and observability stack for the MCP Gateway using **Prometheus** + **Grafana**.

## Architecture

```
┌─────────────────┐
│  MCP Gateway    │──┐
│  (Port 8100)    │  │
└─────────────────┘  │
                     │ Scrapes metrics
┌─────────────────┐  │ (Port 9090)
│  Prometheus     │◄─┘
│  (Embedded)     │
└────────┬────────┘
         │
         │ Data Source
         │
┌────────▼────────┐
│    Grafana      │
│  (Port 3000)    │
└─────────────────┘
```

## Components

### 1. Prometheus Metrics (Built-in)
- **Port**: 9090
- **Endpoint**: `http://localhost:9090/metrics`
- **Status**: ✅ Already operational
- **Metrics Collected**:
  - HTTP request duration & counts
  - MCP operation duration & counts
  - Token usage by service and agent
  - Database connection pool status
  - Active requests
  - Rate limit hits
  - Error tracking by type and service
  - Node.js default metrics (memory, CPU, event loop)

### 2. Grafana Dashboards (New)
- **Port**: 3000
- **Default Login**: admin/admin (change in production!)
- **Status**: Ready to deploy
- **Features**:
  - Pre-configured Prometheus datasource
  - Auto-provisioned MCP Gateway dashboard
  - Real-time metrics visualization
  - Alerting rules

### 3. Alerting Rules
- **File**: `provisioning/alerting/rules.yml`
- **Alerts Configured**:
  - High/Critical error rates
  - Service downtime detection
  - Rate limit violations
  - Slow response times
  - Connection pool exhaustion
  - High memory usage
  - Operation failure rates
  - Token usage spikes

## Quick Start

### Local Development

1. **Start the stack**:
   ```bash
   cd infrastructure/mcp-gateway
   docker-compose up -d
   ```

2. **Access Grafana**:
   - URL: http://localhost:3000
   - Username: `admin`
   - Password: `admin` (change on first login)

3. **View the dashboard**:
   - Navigate to: Dashboards → MCP Gateway → Overview
   - Or direct link: http://localhost:3000/d/mcp-gateway-overview

### Production Deployment (Coolify)

#### Option 1: Via Docker Compose (Recommended)

1. **Set environment variables** in Coolify:
   ```bash
   GRAFANA_ADMIN_USER=admin
   GRAFANA_ADMIN_PASSWORD=<secure-password>
   GRAFANA_ROOT_URL=http://grafana.ozean-licht.dev
   GRAFANA_DOMAIN=grafana.ozean-licht.dev
   ```

2. **Deploy via Git Push**:
   ```bash
   git add .
   git commit -m "feat: add Grafana monitoring"
   git push origin main
   ```

   Coolify will auto-deploy the updated docker-compose.yml.

3. **Configure domain in Coolify**:
   - Add domain: `grafana.ozean-licht.dev`
   - Enable SSL (Let's Encrypt)
   - Map to port: 3000

#### Option 2: Separate Coolify Service

1. Create new service in Coolify
2. **Service Type**: Docker Image
3. **Image**: `grafana/grafana:10.2.3`
4. **Ports**: Expose 3000
5. **Volumes**:
   - `/var/lib/grafana` → Named volume for persistence
   - Mount provisioning directories from repo
6. **Environment**: Same as above
7. **Network**: Join `coolify` network
8. **Domain**: `grafana.ozean-licht.dev`

## Dashboard Panels

The **MCP Gateway Overview** dashboard includes:

### Overview Stats (Top Row)
1. **HTTP Requests/sec** - Total incoming HTTP traffic
2. **MCP Operations/sec** - MCP operation rate
3. **Errors/sec** - Error rate (color-coded thresholds)
4. **Active Requests** - Current concurrent requests

### Performance Metrics
5. **HTTP Request Duration (Percentiles)** - p50, p95, p99 by service
6. **HTTP Request Rate by Service** - Traffic breakdown
7. **MCP Operation Duration (Percentiles)** - p50, p95, p99 by service/operation
8. **MCP Operations Rate by Service** - Operation breakdown

### Resource Metrics
9. **Token Usage Rate by Service** - Token consumption
10. **Database Connection Pool Status** - Active, idle, waiting connections
11. **Rate Limit Hits by Agent** - Rate limiting activity
12. **Error Rate by Type and Service** - Error categorization

## Alert Configuration

Alerts are automatically provisioned from `provisioning/alerting/rules.yml`.

### Severity Levels

- 🟢 **Info** - Informational only, no action needed
- 🟡 **Warning** - Needs attention, not urgent
- 🔴 **Critical** - Immediate action required

### Alert Summary

| Alert | Threshold | Duration | Severity |
|-------|-----------|----------|----------|
| HighErrorRate | >0.1 errors/sec | 2min | Warning |
| CriticalErrorRate | >1 error/sec | 1min | Critical |
| ServiceNoRequests | 0 requests | 5min | Warning |
| HighRateLimitHits | >0.5 hits/sec | 2min | Warning |
| SlowResponseTime | p95 >5s | 5min | Warning |
| VerySlowResponseTime | p95 >10s | 2min | Critical |
| ConnectionPoolNearExhaustion | >80% used | 5min | Warning |
| ConnectionPoolExhausted | >95% used | 2min | Critical |
| HighActiveRequests | >50 | 5min | Warning |
| GatewayDown | No metrics | 1min | Critical |
| HighMemoryUsage | >512MB | 5min | Warning |
| VeryHighMemoryUsage | >1GB | 2min | Critical |
| HighOperationFailureRate | >10% failures | 3min | Warning |
| TokenUsageSpike | >1000 tokens/sec | 3min | Warning |

## Alert Notification Channels

### Configure in Grafana UI

1. **Go to**: Alerting → Contact points
2. **Add contact point**:
   - **Name**: `mcp-gateway-alerts`
   - **Type**: Choose from:
     - Email (SMTP)
     - Slack
     - Discord
     - Webhook (for N8N)
     - PagerDuty
     - Telegram
     - Microsoft Teams

3. **Example: Slack**:
   ```
   Webhook URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

4. **Example: N8N Webhook**:
   ```
   Webhook URL: http://n8n.ozean-licht.dev/webhook/grafana-alerts
   HTTP Method: POST
   ```

5. **Test the contact point**

### Alert Routing

1. **Go to**: Alerting → Notification policies
2. **Edit default policy**:
   - Match label: `component=mcp-gateway`
   - Contact point: `mcp-gateway-alerts`
   - Group by: `severity`, `service`
   - Group wait: 30s
   - Group interval: 5m
   - Repeat interval: 4h

## Querying Metrics

### Useful Prometheus Queries

```promql
# Request rate by service (last 5 min)
sum(rate(mcp_gateway_http_requests_total[5m])) by (service)

# Error rate
sum(rate(mcp_errors_total[5m]))

# P95 operation duration
histogram_quantile(0.95, sum(rate(mcp_operation_duration_seconds_bucket[5m])) by (le, service))

# Token usage by agent
sum(rate(mcp_token_usage_total[5m])) by (agent_id)

# Connection pool utilization
mcp_connection_pool_connections{state="active"} / mcp_connection_pool_connections{state="total"}

# Top 5 slowest operations
topk(5, histogram_quantile(0.95, sum(rate(mcp_operation_duration_seconds_bucket[5m])) by (le, service, operation)))
```

## Customization

### Adding New Panels

1. **Edit the dashboard** in Grafana UI
2. **Add Panel** → Choose visualization
3. **Configure query** with Prometheus
4. **Export JSON**:
   - Dashboard settings → JSON Model
   - Copy to `dashboards/mcp-gateway-overview.json`
   - Commit to repo

### Adding New Alerts

1. **Edit** `provisioning/alerting/rules.yml`
2. **Add new rule**:
   ```yaml
   - alert: MyNewAlert
     expr: my_metric > threshold
     for: 5m
     labels:
       severity: warning
       component: mcp-gateway
     annotations:
       summary: "Brief description"
       description: "Detailed explanation with {{ $value }}"
   ```
3. **Reload Grafana** (restart container or wait for provisioning interval)

## Troubleshooting

### Grafana shows "No data"

**Check Prometheus endpoint**:
```bash
curl http://localhost:9090/metrics
```

**Verify Grafana can reach Prometheus**:
```bash
docker exec mcp-grafana wget -O- http://mcp-gateway:9090/metrics
```

**Check datasource in Grafana**:
- Go to: Configuration → Data sources → Prometheus
- Click "Test" button

### Dashboards not appearing

**Check provisioning logs**:
```bash
docker logs mcp-grafana | grep -i provision
```

**Verify volume mounts**:
```bash
docker exec mcp-grafana ls -la /etc/grafana/provisioning/dashboards
```

### Alerts not firing

**Check alert rules in Grafana**:
- Go to: Alerting → Alert rules
- Verify rules are loaded

**Check Prometheus metrics**:
```bash
# Manually run alert query
curl -G http://localhost:9090/api/v1/query --data-urlencode 'query=sum(rate(mcp_errors_total[5m]))'
```

**Check notification channels**:
- Go to: Alerting → Contact points
- Test the contact point

## Security Best Practices

### Production Deployment

1. **Change default password**:
   ```bash
   GRAFANA_ADMIN_PASSWORD=<strong-random-password>
   ```

2. **Restrict access**:
   - Use Coolify domain with SSL
   - Enable firewall rules (allow only VPN/trusted IPs)
   - Consider OAuth integration

3. **Secure Prometheus endpoint**:
   - Currently on port 9090 (internal network only)
   - Do NOT expose publicly
   - Use Docker network isolation

4. **Backup Grafana data**:
   ```bash
   docker run --rm -v mcp-grafana-data:/data -v $(pwd):/backup alpine tar czf /backup/grafana-backup.tar.gz /data
   ```

## Metrics Retention

- **Prometheus**: In-memory (resets on restart)
- **Grafana**: Persistent via `mcp-grafana-data` volume
- **Logs**: Rotated daily in `logs/` directory

For long-term metrics storage, consider:
- **Prometheus with persistent volume** (separate deployment)
- **Thanos** (long-term storage solution)
- **VictoriaMetrics** (Prometheus-compatible TSDB)

## Resources

- **Grafana Docs**: https://grafana.com/docs/
- **Prometheus Docs**: https://prometheus.io/docs/
- **PromQL Guide**: https://prometheus.io/docs/prometheus/latest/querying/basics/
- **Grafana Dashboards**: https://grafana.com/grafana/dashboards/ (community templates)

## Support

For issues or questions:
- Check logs: `docker logs mcp-grafana`
- Review this README
- Consult `infrastructure/mcp-gateway/README.md`
- Open issue in repository

---

**Status**: ✅ Ready for deployment
**Last Updated**: 2025-10-23
**Phase**: 8 - Monitoring & Observability
