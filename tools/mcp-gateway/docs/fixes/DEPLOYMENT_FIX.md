# MCP Gateway Coolify Deployment Fix

## Issue
When deploying via Coolify, the build fails with:
```
Dockerfile not found for service mcp-gateway at Dockerfile, skipping ARG injection.
failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory
```

## Root Cause
The original `docker-compose.yml` uses a relative build context (`.`) which works when running from the `infrastructure/mcp-gateway/` directory locally, but fails when Coolify clones the repository and runs from the root directory.

## Solution
Created a Coolify-specific Docker Compose file: `docker-compose.coolify.yml`

### Key Changes:
1. **Build context path**: Changed from `.` to `./infrastructure/mcp-gateway`
2. **Removed unnecessary services**: Only includes the MCP Gateway service (removed Redis, Grafana, Prometheus for now)
3. **Coolify network**: Uses external `coolify` network only
4. **Updated container names**: Uses Coolify container naming for service references

## Deployment Steps

### 1. Push Changes to Repository
```bash
git add infrastructure/mcp-gateway/docker-compose.coolify.yml
git add infrastructure/coolify/mcp-gateway-config.md
git add infrastructure/mcp-gateway/DEPLOYMENT_FIX.md
git commit -m "fix: add Coolify-specific docker-compose with correct build context"
git push origin main
```

### 2. Update Coolify Configuration
1. Login to Coolify: `http://coolify.ozean-licht.dev:8000`
2. Go to your MCP Gateway service
3. Update the Docker Compose file path to: `infrastructure/mcp-gateway/docker-compose.coolify.yml`
4. Click "Redeploy"

### 3. Environment Variables
Ensure these are set in Coolify:
```env
# MinIO Configuration (REQUIRED)
MINIO_ENDPOINT=138.201.139.25
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=XaUhUCZaXGczIZQHBE1I
MINIO_SECRET_KEY=fKbKQl0Ue1NUoCLovUpJeP1zShECfzn6znRgqcFK

# PostgreSQL Passwords (REQUIRED)
POSTGRES_KA_PASSWORD=7M6jFrr7IYILOa67MxnfkpUxxNiDVp9IjHN60bkIR0QpbC40DRgzXkVAeVEkdWbJ
POSTGRES_OL_PASSWORD=7M6jFrr7IYILOa67MxnfkpUxxNiDVp9IjHN60bkIR0QpbC40DRgzXkVAeVEkdWbJ

# Other services...
```

## Verification
After deployment, verify the service is running:
```bash
# From the server
docker ps | grep mcp-gateway
docker logs [container-id] --tail 50

# Check health
curl http://localhost:8100/health

# Check services
curl http://localhost:8100/mcp/catalog | jq .
```

## Alternative: Pre-built Image
If build issues persist, consider using a pre-built Docker image:
1. Build locally: `docker build -t mcp-gateway:latest ./infrastructure/mcp-gateway`
2. Push to registry (Docker Hub, GitHub Container Registry, etc.)
3. Update Coolify to pull the image instead of building

## Notes
- The Coolify-specific compose file is simplified for production use
- Additional monitoring services (Grafana, Prometheus) can be deployed separately if needed
- Redis is optional and removed for simplicity