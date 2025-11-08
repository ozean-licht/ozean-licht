# MinIO Connection Fix for MCP Gateway

## Issue
MCP Gateway cannot connect to MinIO, resulting in timeout error:
```
{"error":{"address":"138.201.139.25","code":"ETIMEDOUT","errno":-110,"port":9000,"syscall":"connect"}
```

## Root Cause
- MCP Gateway container is on network `o000okc80okco8s0sgcwwcwo`
- MinIO container is on network `c8wscw0kg4o8koocg40kc8os`
- Containers on different networks cannot communicate directly
- Using public IP (138.201.139.25) from within container may not work due to NAT loopback issues

## Solutions

### Solution 1: Use Container Name (Recommended for Coolify)
Update the MinIO endpoint in Coolify environment variables:
```env
MINIO_ENDPOINT=minio-c8wscw0kg4o8koocg40kc8os
```

### Solution 2: Use Host Network Mode
If MinIO is exposed on host ports, use special Docker hostname:
```env
# For Linux with extra_hosts configuration
MINIO_ENDPOINT=host.docker.internal

# Or use the Docker host IP (find with: ip addr show docker0)
MINIO_ENDPOINT=172.17.0.1
```

### Solution 3: Add Both Containers to Same Network
Add MCP Gateway to MinIO's network:
```yaml
networks:
  - coolify
  - c8wscw0kg4o8koocg40kc8os  # MinIO's network
```

### Solution 4: Use Public IP with Proper Routing
Ensure iptables/firewall allows container-to-host communication:
```bash
# Check if MinIO is accessible from container
docker exec mcp-gateway-container curl -I http://138.201.139.25:9000
```

## Quick Fix for Current Deployment

### Option A: Update Environment Variable in Coolify
1. Go to Coolify Dashboard
2. Find MCP Gateway service
3. Update environment variable:
   ```
   MINIO_ENDPOINT=minio-c8wscw0kg4o8koocg40kc8os
   ```
4. Redeploy

### Option B: Use Localhost (if on same host)
Since MinIO is exposed on host port 9000, try:
```env
MINIO_ENDPOINT=172.17.0.1  # Docker bridge IP
```

## Testing the Fix
After updating, verify MinIO connectivity:
```bash
# Check if MCP Gateway can reach MinIO
docker exec [mcp-container] curl -I http://[minio-endpoint]:9000/minio/health/live

# Test via MCP Gateway API
curl -4 -X POST http://127.0.0.1:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.execute",
    "params": {
      "service": "minio",
      "operation": "health"
    },
    "id": "minio-test"
  }'
```

## Current Status
✅ **MCP Gateway is operational** (9 services registered)
✅ **API is accessible** via IPv4 (http://127.0.0.1:8100)
⚠️ **MinIO connection failing** (timeout to 138.201.139.25:9000)
ℹ️ **Other services working** (PostgreSQL, Cloudflare, GitHub, etc.)

## Important Notes
- The gateway starts successfully even if MinIO fails to connect
- MinIO is marked as "error" status but doesn't block other services
- Health endpoint responds normally: `http://127.0.0.1:8100/health`
- Use IPv4 (127.0.0.1) instead of localhost to avoid IPv6 issues