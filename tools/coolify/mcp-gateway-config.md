# MCP Gateway - Coolify Configuration

## Deployment Status
✅ **Production Ready** - Version 1.0.1
- Docker image: Optimized 221MB
- Ports: 8100 (API), 9090 (Metrics)
- 9 MCP services integrated (6 server-side, 3 local)

## Coolify Service Configuration

### Service Name
`mcp-gateway`

### Docker Compose Source
- Repository: `https://github.com/ozean-licht/ecosystem`
- Branch: `main`
- Docker Compose Path: `infrastructure/mcp-gateway/docker-compose.coolify.yml`

**Important:** Use `docker-compose.coolify.yml` instead of `docker-compose.yml` as it has the correct build context paths for Coolify deployment from repository root.

### Environment Variables (Required)
```env
# Server Configuration
NODE_ENV=production
PORT=8100
HOST=0.0.0.0

# PostgreSQL - Kids Ascension
POSTGRES_KA_HOST=iccc0wo0wkgsws4cowk4440c
POSTGRES_KA_PORT=5432
POSTGRES_KA_DATABASE=kids-ascension
POSTGRES_KA_USER=postgres
POSTGRES_KA_PASSWORD=7M6jFrr7IYILOa67MxnfkpUxxNiDVp9IjHN60bkIR0QpbC40DRgzXkVAeVEkdWbJ

# PostgreSQL - Ozean Licht
POSTGRES_OL_HOST=zo8g4ogg8g0gss0oswkcs84w
POSTGRES_OL_PORT=5432
POSTGRES_OL_DATABASE=ozean-licht
POSTGRES_OL_USER=postgres
POSTGRES_OL_PASSWORD=7M6jFrr7IYILOa67MxnfkpUxxNiDVp9IjHN60bkIR0QpbC40DRgzXkVAeVEkdWbJ

# MinIO Storage (S3-compatible object storage)
MINIO_ENDPOINT=138.201.139.25
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=XaUhUCZaXGczIZQHBE1I
MINIO_SECRET_KEY=fKbKQl0Ue1NUoCLovUpJeP1zShECfzn6znRgqcFK
MAX_FILE_SIZE_MB=500
ALLOWED_FILE_TYPES=video/*,image/*,application/pdf,application/zip
PRESIGNED_URL_EXPIRY_SECONDS=300

# Service URLs
MEM0_API_URL=http://mem0-uo8gc0kc0gswcskk44gc8wks:8090
N8N_API_URL=http://n8n-wgg0gsko808w4ow040gkgs0o:5678
N8N_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODI2ZGFmMS1lNzdjLTQ5ZmQtYmJmYi1lZjYwNGNlOGFjNWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxMTQzMzQwLCJleHAiOjE3Njg4NjM2MDB9.YgHly7agiQKKWkcR-cL30LQvTa0VOqhCHY-YRcKajuc

# Cloudflare
CLOUDFLARE_API_TOKEN=R7VMT1nwmnqUD-N4rch71tsp0hn4qvYEZ36X--z1
CLOUDFLARE_ACCOUNT_ID=c477d3d3184698d737c5343caf7975aa
CLOUDFLARE_ZONE_ID=d642c2d06d6ec06e644b1cad0ed23732

# GitHub App (IMPORTANT: Use global env vars in Coolify for private key)
GITHUB_APP_ID=2155835
GITHUB_INSTALLATION_ID=91032290
# GITHUB_PRIVATE_KEY should be set in Coolify's Global Environment Variables

# Security
JWT_SECRET=ozean_licht_mcp_gateway_jwt_secret_key_minimum_32_characters_long_2025_production
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090
LOG_LEVEL=info
LOG_FORMAT=json

# Database Pools
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_IDLE_TIMEOUT_MS=10000

# Timeouts
DEFAULT_TIMEOUT_MS=30000
DB_QUERY_TIMEOUT_MS=10000
HTTP_TIMEOUT_MS=30000
```

## Network Configuration

The service needs to join these networks:
- `coolify` - For service discovery
- `mcp-network` - Internal MCP communication

## Health Check

- Endpoint: `http://localhost:8100/health`
- Expected Response: `{"status":"healthy","timestamp":"...","version":"1.0.1"}`
- Interval: 30s
- Retries: 3

## Exposed Ports

- **8100**: Main API endpoint
  - JSON-RPC 2.0 interface
  - Slash command execution
  - Health checks

- **9090**: Prometheus metrics
  - Service metrics
  - Operation counts
  - Token usage tracking

## Available MCP Services

### Server-Side Services
1. **PostgreSQL** - Database operations for Kids Ascension & Ozean Licht
2. **Mem0** - Persistent memory and context management
3. **Cloudflare** - CDN, DNS, and video streaming
4. **GitHub** - Repository and PR management
5. **N8N** - Workflow automation
6. **MinIO** - S3-compatible object storage

### Local Services (References)
7. **Playwright** - Browser automation
8. **ShadCN** - UI components
9. **MagicUI** - Enhanced UI components

## Deployment Steps in Coolify

1. **Create New Resource**
   - Type: Docker Compose
   - Name: `mcp-gateway`

2. **Configure Source**
   - Repository: Your GitHub repository URL
   - Branch: `main`
   - Docker Compose Path: `infrastructure/mcp-gateway/docker-compose.coolify.yml`

3. **Add Environment Variables**
   - Copy all variables from the section above
   - For `GITHUB_PRIVATE_KEY`, use Coolify's Global Environment Variables

4. **Network Settings**
   - Ensure service can access internal Coolify network
   - Service will be accessible internally as `mcp-gateway`

5. **Deploy**
   - Click "Deploy"
   - Monitor logs for successful initialization

6. **Verify Deployment**
   ```bash
   # From server SSH
   curl http://mcp-gateway:8100/health
   curl http://mcp-gateway:8100/mcp/catalog
   ```

## Post-Deployment Verification

```bash
# Check service health
curl http://localhost:8100/health

# List available services
curl http://localhost:8100/mcp/catalog | jq .

# Test MinIO connectivity
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.execute",
    "params": {
      "service": "minio",
      "operation": "health"
    },
    "id": "test-1"
  }'

# Check metrics
curl http://localhost:9090/metrics | grep mcp_
```

## Troubleshooting

### Service Won't Start
- Check all environment variables are set
- Verify database credentials
- Ensure MinIO is accessible at configured endpoint
- Check Docker logs: `docker logs mcp-gateway`

### MinIO Connection Failed
- Verify MinIO is running at `138.201.139.25:9000`
- Test credentials directly
- Check network connectivity from container

### Database Connection Issues
- Verify PostgreSQL container names match HOST variables
- Check passwords are correct
- Ensure databases exist (`kids-ascension`, `ozean-licht`)

### Authentication Errors
- Localhost/Docker requests bypass authentication
- External requests need JWT token
- Verify JWT_SECRET is at least 32 characters

## Monitoring

### Grafana Dashboard
Access at: `http://grafana.ozean-licht.dev`
- Request rates by service
- Error rates
- Token usage
- Connection pool metrics

### Prometheus Metrics
Direct access: `http://localhost:9091`
- `mcp_operation_total` - Operation counts
- `mcp_operation_duration_seconds` - Latencies
- `mcp_token_usage_total` - Token consumption
- `mcp_connection_pool_size` - DB connections

## Security Notes

1. **Authentication**: Localhost and Docker network requests bypass auth
2. **Rate Limiting**: 100 requests/minute per agent
3. **Container Security**: Runs as non-root user (nodejs)
4. **Secrets**: Never commit credentials to Git
5. **Network Isolation**: Uses dedicated Docker network

## Integration with Admin Dashboard

The admin dashboard connects to MCP Gateway via:
```env
MCP_GATEWAY_URL=http://mcp-gateway:8100
```

This allows the admin dashboard to:
- Query databases via PostgreSQL MCP
- Upload files via MinIO MCP
- Manage DNS via Cloudflare MCP
- Create PRs via GitHub MCP
- Trigger workflows via N8N MCP

## Maintenance

### Log Rotation
Logs are stored in `/app/logs` with automatic rotation

### Updating
1. Push changes to repository
2. In Coolify, click "Redeploy"
3. Service will rebuild and restart

### Backup
- Environment variables are stored in Coolify
- No persistent data (stateless service)
- Configuration in Git repository

## Support

- **Documentation**: `/infrastructure/mcp-gateway/README.md`
- **Architecture**: `/infrastructure/mcp-gateway/docs/architecture.md`
- **Server SSH**: `root@138.201.139.25`
- **Coolify UI**: `http://coolify.ozean-licht.dev:8000`