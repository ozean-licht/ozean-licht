# GitHub Auto-Deploy Webhook Setup

## Current Status

The MCP Gateway application is configured with GitHub App integration in Coolify:
- **Application UUID**: `o000okc80okco8s0sgcwwcwo`
- **Repository**: `ozean-licht/ozean-licht`
- **Branch**: `main`
- **Source Type**: GitHub App (ID: 0)

## Auto-Deploy Configuration

### Method 1: GitHub App Integration (RECOMMENDED - Currently Active)

Coolify uses GitHub App integration which automatically receives webhooks from GitHub. No manual webhook configuration needed!

**To enable auto-deploy on push:**

1. Open Coolify UI: http://coolify.ozean-licht.dev:8000
2. Navigate to: Applications → mcp-gateway
3. Go to "General" tab
4. Find "Auto Deploy" section
5. Enable: **"Deploy on Push"** toggle
6. Optional: Set "Watch Paths" to only deploy on specific file changes (e.g., `infrastructure/mcp-gateway/*`)

**How it works:**
- GitHub App sends webhook to Coolify on every push event
- Coolify checks if auto-deploy is enabled for the application
- If enabled, triggers deployment automatically
- No authentication issues - GitHub App handles auth


### Method 2: Manual Deployment API (Fallback)

If GitHub App integration fails, use manual deployment:

```bash
# Via Coolify API
curl -X POST \
  -H "Authorization: Bearer 1|nN3hZvkfX7IrsKWRpl86UzaNV7UDUrQ44kxrKqBs0664ab00" \
  http://localhost:8000/api/v1/deploy?uuid=o000okc80okco8s0sgcwwcwo

# Via slash command
/coolify-deploy o000okc80okco8s0sgcwwcwo
```

### Method 3: N8N Webhook Automation (Advanced)

Create an N8N workflow that:
1. Receives GitHub webhook (push events)
2. Filters by branch (only `main`)
3. Calls Coolify deployment API with Bearer token
4. Sends notification to Telegram on success/failure

**Workflow Template:**
```
GitHub Webhook → Filter (branch=main) → HTTP Request (Coolify API) → Telegram Notification
```

## Environment Variables

All configuration centralized in `.env`:

```bash
# Coolify Configuration
COOLIFY_URL=http://coolify.ozean-licht.dev:8000
COOLIFY_API_TOKEN=1|nN3hZvkfX7IrsKWRpl86UzaNV7UDUrQ44kxrKqBs0664ab00
COOLIFY_MCP_GATEWAY_UUID=o000okc80okco8s0sgcwwcwo
```

## Verification

### Test Auto-Deploy

1. Make a small change to any file in `infrastructure/mcp-gateway/`
2. Commit and push to `main` branch
3. Check Coolify UI → Deployments tab
4. Should see new deployment triggered automatically within 10-30 seconds

### Monitor Deployment

```bash
# Watch container recreation
watch -n 2 'docker ps --filter "name=o000okc80okco8s0sgcwwcwo"'

# Check deployment logs in Coolify UI
# Navigate to: Application → Deployments → Click latest deployment
```

## Troubleshooting

### Auto-Deploy Not Triggering

1. **Verify GitHub App Permissions**
   - Go to GitHub → Settings → Applications → Coolify
   - Ensure "Repository contents" read permission is granted
   - Ensure "Push" webhook event is enabled

2. **Check Coolify Logs**
   ```bash
   docker logs coolify-realtime -f | grep "webhook"
   ```

3. **Verify GitHub App Connection**
   - Coolify UI → Sources → GitHub App
   - Should show "Connected" status
   - Click "Refresh" if needed

4. **Manual Webhook Trigger Test**
   ```bash
   # Trigger GitHub webhook manually (debugging)
   gh api repos/ozean-licht/ozean-licht/hooks/HOOK_ID/test
   ```

### Deployment Fails

1. **Check Build Logs** in Coolify UI
2. **Verify docker-compose.yml** syntax
3. **Check environment variables** are set correctly
4. **Review container health checks**

## Next Steps

1. ✅ Environment variables added to `.env`
2. ⏳ **ACTION REQUIRED**: Enable "Deploy on Push" in Coolify UI
3. ⏳ Test auto-deploy with small commit
4. ⏳ Set up Telegram notifications for deployment events
5. ⏳ Optional: Create N8N workflow for advanced automation

## Documentation References

- Coolify Auto-Deploy: https://coolify.io/docs/knowledge-base/git/automatic-deployments
- GitHub App Webhooks: https://docs.github.com/en/developers/apps/managing-github-apps
- Coolify API: http://localhost:8000/api/documentation

---

**Last Updated**: 2025-10-23
**Status**: GitHub App integration active, awaiting auto-deploy toggle in UI
Auto-deploy test successful - Thu Oct 23 08:42:53 PM CEST 2025
# Auto-Deploy Working! - Thu Oct 23 08:47:57 PM CEST 2025
