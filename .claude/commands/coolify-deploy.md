# Coolify Deployment Command

**Quick deploy any Coolify application via API**

## Usage

```bash
# Deploy MCP Gateway
/coolify-deploy o000okc80okco8s0sgcwwcwo

# Or use alias
/deploy mcp-gateway
```

## API Command

```bash
curl -X POST \
  -H "Authorization: Bearer 1|nN3hZvkfX7IrsKWRpl86UzaNV7UDUrQ44kxrKqBs0664ab00" \
  -H "Content-Type: application/json" \
  http://localhost:8000/api/v1/deploy?uuid=<application-uuid>
```

## Application UUIDs

- **mcp-gateway**: `o000okc80okco8s0sgcwwcwo`

## Response

```json
{
  "deployments": [{
    "message": "Application mcp-gateway deployment queued.",
    "resource_uuid": "o000okc80okco8s0sgcwwcwo",
    "deployment_uuid": "ro04ok80o8oc4kkcco8kow8s"
  }]
}
```

## Monitoring Deployment

```bash
# Watch containers being recreated
watch -n 2 'docker ps --filter "name=o000okc80okco8s0sgcwwcwo" --format "table {{.Names}}\t{{.Status}}\t{{.CreatedAt}}"'

# Check deployment logs (in Coolify UI)
# Navigate to: Application → Deployments → Click latest deployment
```

## What Deployment Does

1. **Pulls latest code** from configured git repository
2. **Builds new image** (if needed)
3. **Recreates containers** with updated docker-compose.yml
4. **Applies new environment variables** from Coolify settings
5. **Runs health checks** to verify startup

## Notes

- Deployment is queued, not immediate
- Containers are recreated with new IDs
- Downtime during deployment: ~5-10 seconds
- Old containers are automatically removed
- Volumes persist across deployments
