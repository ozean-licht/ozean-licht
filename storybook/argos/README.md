# Argos Self-Hosted Instance

Self-hosted visual regression testing platform for Ozean Licht Storybook.

**Location**: `/opt/ozean-licht-ecosystem/storybook/argos/`
**Deployment**: Coolify (http://coolify.ozean-licht.dev:8000)
**Domain**: https://argos.ozean-licht.dev

## Quick Start

### 1. Prerequisites

- Coolify access (http://coolify.ozean-licht.dev:8000)
- Domain configured: argos.ozean-licht.dev
- GitHub OAuth App credentials
- `COOLIFY_API_TOKEN` environment variable

### 2. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Configure:
   - **Application name**: Ozean Licht Argos
   - **Homepage URL**: https://argos.ozean-licht.dev
   - **Authorization callback URL**: https://argos.ozean-licht.dev/auth/github/callback
4. Copy Client ID and Client Secret

### 3. Deploy to Coolify

**Option A: Coolify Dashboard (Recommended)**

1. Log in to Coolify: http://coolify.ozean-licht.dev:8000
2. Create new resource → Docker Compose
3. **Name**: `argos-ci`
4. **Docker Compose File**: Upload `storybook/argos/docker-compose.yml`
5. **Environment Variables**:
   ```
   ARGOS_DB_PASSWORD=<generate with: openssl rand -base64 32>
   ARGOS_JWT_SECRET=<generate with: openssl rand -base64 32>
   GITHUB_CLIENT_ID=<from GitHub OAuth App>
   GITHUB_CLIENT_SECRET=<from GitHub OAuth App>
   ```
6. **Domain**: argos.ozean-licht.dev
7. **Enable SSL/TLS**: Yes (Let's Encrypt)
8. Click **Deploy**

**Option B: Coolify CLI (Advanced)**

```bash
# Using progressive disclosure tools
bash tools/deployment/deploy.sh argos-ci

# Or using Coolify API directly
curl -X POST http://coolify.ozean-licht.dev:8000/api/v1/applications \
  -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
  -F "compose_file=@storybook/argos/docker-compose.yml" \
  -F "name=argos-ci" \
  -F "domain=argos.ozean-licht.dev"
```

### 4. Initialize Database (First Time Only)

After deployment completes:

```bash
# Via Coolify dashboard: Applications → argos-ci → Terminal
# Or via CLI:
bash tools/containers/exec.sh argos-server "npm run db:migrate"

# Create admin user (optional)
bash tools/containers/exec.sh argos-server "npm run create-admin"
```

### 5. Verify Deployment

```bash
# Check health
curl https://argos.ozean-licht.dev/health

# Should return: {"status":"ok"}

# Or using monitoring tools
bash tools/monitoring/health-all.sh
```

## Usage

Once deployed, Argos will automatically process visual regression tests from GitHub Actions.

### Local Testing

```bash
# Build Storybook
npm run build-storybook

# Upload to Argos
npx @argos-ci/cli upload storybook-static \
  --token YOUR_ARGOS_TOKEN \
  --url https://argos.ozean-licht.dev
```

### View Results

Visit https://argos.ozean-licht.dev to view comparison results and manage projects.

## Management

### View Logs

```bash
# Using progressive disclosure tools
bash tools/containers/logs.sh argos-server 100

# Or via Coolify dashboard
# Applications → argos-ci → Logs
```

### Restart Services

```bash
# Using progressive disclosure tools
bash tools/containers/restart.sh argos-server

# Or via Coolify dashboard
# Applications → argos-ci → Restart
```

### Update Environment Variables

```bash
# Via Coolify dashboard
# Applications → argos-ci → Environment → Edit

# After changes, restart:
bash tools/containers/restart.sh argos-server
```

### Backup Database

```bash
# Using progressive disclosure tools
bash tools/database/backup.sh argos /backups/argos_$(date +%Y%m%d).sql

# Manual backup via container
bash tools/containers/exec.sh argos-postgres \
  "pg_dump -U argos argos" > argos_backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
# Using progressive disclosure tools
bash tools/database/restore.sh argos /backups/argos_20240101.sql

# Manual restore via container
cat argos_backup_20240101.sql | \
  bash tools/containers/exec.sh argos-postgres \
  "psql -U argos argos"
```

## Troubleshooting

### Services Won't Start

```bash
# Check deployment status
bash tools/deployment/status.sh <argos-app-id>

# View logs for errors
bash tools/containers/logs.sh argos-server 100

# Check Coolify dashboard
# http://coolify.ozean-licht.dev:8000/applications/argos-ci
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
bash tools/containers/ps.sh | grep argos-postgres

# Test database connection
bash tools/containers/exec.sh argos-postgres \
  "psql -U argos -d argos -c 'SELECT 1;'"

# Check database size
bash tools/database/size.sh argos
```

### GitHub Authentication Issues

1. Verify OAuth App settings in GitHub
2. Check callback URL matches exactly: https://argos.ozean-licht.dev/auth/github/callback
3. Verify environment variables in Coolify dashboard
4. Restart argos-server: `bash tools/containers/restart.sh argos-server`
5. Check logs: `bash tools/containers/logs.sh argos-server 50`

### Domain/SSL Issues

```bash
# Test connectivity
bash tools/monitoring/connectivity.sh argos.ozean-licht.dev

# Check SSL certificate
curl -vI https://argos.ozean-licht.dev

# Regenerate certificate in Coolify dashboard:
# Applications → argos-ci → Domain → Regenerate SSL
```

## Monitoring

### Health Checks

```bash
# Check all services
bash tools/monitoring/health-all.sh

# Check specific service
curl https://argos.ozean-licht.dev/health

# Check resources
bash tools/containers/stats.sh
```

### Grafana Integration

Monitor Argos metrics in Grafana:
- Dashboard: https://grafana.ozean-licht.dev
- Metrics: Container CPU, memory, request rate
- Alerts: Health check failures, high error rate

## Security

- **Never commit** `.env` file to git
- **Use strong passwords** for ARGOS_DB_PASSWORD and ARGOS_JWT_SECRET (32+ characters)
- **Rotate secrets** regularly via Coolify dashboard
- **Keep images updated** via Coolify's auto-update feature
- **Enable firewall rules** in Hetzner Cloud dashboard
- **Monitor access logs** in Coolify dashboard
- **Review GitHub OAuth** app permissions regularly

## Updates

### Update Argos Version

**Via Coolify Dashboard:**
1. Applications → argos-ci → Configuration
2. Check "Auto-update images" option
3. Or manually: Click "Redeploy"

**Via CLI:**
```bash
# Trigger redeployment (pulls latest images)
bash tools/deployment/deploy.sh argos-ci
```

### Run Migrations After Update

```bash
# Run database migrations
bash tools/containers/exec.sh argos-server "npm run db:migrate"

# Verify version
bash tools/containers/exec.sh argos-server "npm run --version"
```

## Local Development (Optional)

For local testing before deploying to Coolify:

```bash
# Navigate to argos directory
cd storybook/argos/

# Create .env file
cp .env.sample .env
nano .env

# Start with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Note**: Production deployment should always use Coolify.

## Resources

- [Coolify Dashboard](http://coolify.ozean-licht.dev:8000)
- [Grafana Monitoring](https://grafana.ozean-licht.dev)
- [Argos Documentation](https://argos-ci.com/docs)
- [GitHub OAuth Setup](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Storybook Integration Guide](../docs/ARGOS_SETUP.md)
- [Progressive Disclosure Tools](../../tools/README.md)

## Support

### Deployment Issues
- Check Coolify logs: Applications → argos-ci → Logs
- Run deployment health check: `bash tools/deployment/health.sh`
- Check deployment status: `bash tools/deployment/status.sh <app-id>`

### Argos-Specific Issues
- [Argos GitHub Issues](https://github.com/argos-ci/argos/issues)
- [Argos Community](https://argos-ci.com/community)

### Infrastructure Issues
- Check system resources: `bash tools/monitoring/resources.sh`
- Check connectivity: `bash tools/monitoring/connectivity.sh`
- Contact Hetzner support for server issues
