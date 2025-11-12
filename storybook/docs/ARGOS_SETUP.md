# Argos Setup Guide

Self-hosted visual regression testing for Ozean Licht Storybook.

**Deployment Platform**: Coolify (http://coolify.ozean-licht.dev:8000)
**Instance URL**: https://argos.ozean-licht.dev

## Quick Start

### 1. Create GitHub OAuth App

Before deploying, create a GitHub OAuth App for authentication:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Configure:
   - **Application name**: Ozean Licht Argos
   - **Homepage URL**: https://argos.ozean-licht.dev
   - **Authorization callback URL**: https://argos.ozean-licht.dev/auth/github/callback
4. Copy **Client ID** and **Client Secret** (you'll need these in step 2)

### 2. Deploy Argos to Coolify

**Via Coolify Dashboard:**

1. Log in to [Coolify](http://coolify.ozean-licht.dev:8000)
2. Navigate to **Resources** → **New Resource**
3. Select **Docker Compose**
4. Configure deployment:
   - **Name**: `argos-ci`
   - **Docker Compose File**: Upload `/opt/ozean-licht-ecosystem/storybook/argos/docker-compose.yml`
   - **Domain**: `argos.ozean-licht.dev`
   - **SSL/TLS**: Enable (Let's Encrypt)
5. Add **Environment Variables**:
   ```bash
   # Generate secure passwords first:
   openssl rand -base64 32  # Use for ARGOS_DB_PASSWORD
   openssl rand -base64 32  # Use for ARGOS_JWT_SECRET

   # Then add these variables in Coolify:
   ARGOS_DB_PASSWORD=<generated-password>
   ARGOS_JWT_SECRET=<generated-secret>
   GITHUB_CLIENT_ID=<from-step-1>
   GITHUB_CLIENT_SECRET=<from-step-1>
   ```
6. Click **Deploy** and wait for completion

**Via Progressive Disclosure Tools:**

```bash
# Using ecosystem deployment tools
export COOLIFY_API_TOKEN="your-token"
bash tools/deployment/deploy.sh argos-ci
```

### 3. Initialize Database

After deployment completes:

```bash
# Run database migrations
bash tools/containers/exec.sh argos-server "npm run db:migrate"

# Verify Argos is running
curl https://argos.ozean-licht.dev/health
# Expected: {"status":"ok"}
```

### 4. Create Argos Project

```bash
# Log in to Argos CLI
npx @argos-ci/cli login --url https://argos.ozean-licht.dev

# Create project for Storybook
npx @argos-ci/cli project create ozean-licht-storybook

# Get project token (save this for GitHub secrets)
npx @argos-ci/cli token show ozean-licht-storybook
```

### 5. Add GitHub Secret

1. Go to your GitHub repository settings
2. Navigate to **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `ARGOS_TOKEN`
5. Value: Token from step 4
6. Click **Add secret**

## Usage

### Automatic Testing (GitHub Actions)

Visual regression tests run automatically on every pull request via `.github/workflows/argos.yml`.

The workflow will:
1. Build Storybook
2. Upload screenshots to Argos
3. Comment on PR with comparison results

### Manual Testing

```bash
# Build Storybook
npm run build-storybook

# Upload to Argos
npx @argos-ci/cli upload storybook-static \
  --token YOUR_ARGOS_TOKEN \
  --url https://argos.ozean-licht.dev
```

### Viewing Results

Visit https://argos.ozean-licht.dev to:
- View visual comparison results
- Approve/reject changes
- Manage baseline screenshots
- Configure project settings

## Management

### View Logs

```bash
# Using progressive disclosure tools
bash tools/containers/logs.sh argos-server 100

# Or via Coolify dashboard
# http://coolify.ozean-licht.dev:8000 → Applications → argos-ci → Logs
```

### Restart Service

```bash
# Using progressive disclosure tools
bash tools/containers/restart.sh argos-server

# Or via Coolify dashboard
# Applications → argos-ci → Restart
```

### Update Argos

```bash
# Via Coolify dashboard: Applications → argos-ci → Redeploy

# Via CLI
bash tools/deployment/deploy.sh argos-ci

# Run migrations after update
bash tools/containers/exec.sh argos-server "npm run db:migrate"
```

### Backup Database

```bash
# Create backup
bash tools/database/backup.sh argos /backups/argos_$(date +%Y%m%d).sql

# Restore from backup
bash tools/database/restore.sh argos /backups/argos_20240101.sql
```

## Monitoring

### Health Checks

```bash
# Check Argos health
curl https://argos.ozean-licht.dev/health

# Check all services
bash tools/monitoring/health-all.sh

# Check container resources
bash tools/containers/stats.sh
```

### Grafana Dashboard

Monitor Argos metrics:
- URL: https://grafana.ozean-licht.dev
- Metrics: CPU usage, memory, request rate, error rate
- Alerts: Health check failures, high resource usage

## Troubleshooting

### Deployment Failed

```bash
# Check deployment status
bash tools/deployment/status.sh <argos-app-id>

# View deployment logs
bash tools/deployment/logs.sh <argos-app-id> 100

# Check Coolify dashboard for errors
# http://coolify.ozean-licht.dev:8000
```

### Authentication Issues

1. Verify GitHub OAuth App settings
2. Check callback URL: `https://argos.ozean-licht.dev/auth/github/callback`
3. Verify environment variables in Coolify
4. Restart service: `bash tools/containers/restart.sh argos-server`
5. Check logs: `bash tools/containers/logs.sh argos-server 50`

### Database Connection Issues

```bash
# Check PostgreSQL status
bash tools/containers/ps.sh | grep argos-postgres

# Test connection
bash tools/containers/exec.sh argos-postgres \
  "psql -U argos -d argos -c 'SELECT 1;'"

# Check database size
bash tools/database/size.sh argos
```

### GitHub Actions Workflow Issues

1. **Check ARGOS_TOKEN secret**: Verify it's set in GitHub repository secrets
2. **Check workflow runs**: GitHub → Actions tab
3. **Verify Argos URL**: Should be `https://argos.ozean-licht.dev`
4. **Test manual upload**: Run `npm run argos` locally
5. **Check PR comments**: Ensure bot has permissions

### SSL/TLS Issues

```bash
# Test SSL certificate
curl -vI https://argos.ozean-licht.dev

# Check connectivity
bash tools/monitoring/connectivity.sh argos.ozean-licht.dev

# Regenerate certificate in Coolify:
# Applications → argos-ci → Domain → Regenerate SSL
```

## Advanced

### Custom Configuration

Edit Argos project configuration:

```bash
# Location: storybook/deployment/argos-config.yml
# After changes, upload via Argos dashboard
```

### Environment Variables

Update via Coolify dashboard:
- **ARGOS_DB_PASSWORD**: Database password
- **ARGOS_JWT_SECRET**: JWT signing secret
- **GITHUB_CLIENT_ID**: GitHub OAuth client ID
- **GITHUB_CLIENT_SECRET**: GitHub OAuth client secret

After updating, restart: `bash tools/containers/restart.sh argos-server`

### Performance Tuning

Optimize screenshot upload speed:

```yaml
# In .github/workflows/argos.yml
- name: Upload screenshots to Argos
  run: |
    npx @argos-ci/cli upload storybook-static \
      --token ${{ secrets.ARGOS_TOKEN }} \
      --parallel \
      --parallel-total 4  # Increase for faster uploads
```

## Resources

- **Coolify Dashboard**: http://coolify.ozean-licht.dev:8000
- **Argos Instance**: https://argos.ozean-licht.dev
- **Grafana Monitoring**: https://grafana.ozean-licht.dev
- **Argos Documentation**: https://argos-ci.com/docs
- **GitHub OAuth Setup**: https://docs.github.com/en/developers/apps/building-oauth-apps
- **Detailed Deployment Guide**: [storybook/argos/README.md](../argos/README.md)
- **Progressive Disclosure Tools**: [tools/README.md](../../tools/README.md)

## Support

### Quick Help

```bash
# List all Storybook commands
bash tools/discover.sh

# Learn about a specific command
bash tools/learn.sh "deploy argos"

# Check what tool to use
bash tools/what.sh "view argos logs"
```

### Get Help

- **Deployment Issues**: Check Coolify dashboard and logs
- **Argos Issues**: [GitHub Issues](https://github.com/argos-ci/argos/issues)
- **Infrastructure**: Contact server admin or check Grafana

See [Argos documentation](https://argos-ci.com/docs) for detailed troubleshooting guides.
