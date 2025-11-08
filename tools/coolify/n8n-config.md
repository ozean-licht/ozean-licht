# N8N Configuration for Coolify

## Deployment via Coolify

### 1. Create New Service in Coolify

**Service Type**: Docker Compose

### 2. Docker Compose Configuration

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.ozean-licht.at
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.ozean-licht.at/
      - N8N_EDITOR_BASE_URL=https://n8n.ozean-licht.at/
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=168
      - GENERIC_TIMEZONE=Europe/Vienna
      - N8N_METRICS=true
      - N8N_METRICS_INCLUDE_DEFAULT_METRICS=true
      - N8N_DIAGNOSTICS_ENABLED=false
      # Database configuration
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n_user
      - DB_POSTGRESDB_PASSWORD=${N8N_DB_PASSWORD}
      # Authentication
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_ADMIN_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_ADMIN_PASSWORD}
      # Encryption key for credentials
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
    volumes:
      - n8n_data:/home/node/.n8n
      - n8n_files:/files
    networks:
      - coolify
      - n8n_network
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    container_name: n8n_postgres
    restart: always
    environment:
      - POSTGRES_USER=n8n_user
      - POSTGRES_PASSWORD=${N8N_DB_PASSWORD}
      - POSTGRES_DB=n8n
      - PGDATA=/var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - n8n_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U n8n_user -d n8n"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  n8n_data:
  n8n_files:
  postgres_data:

networks:
  n8n_network:
  coolify:
    external: true
```

### 3. Environment Variables (Set in Coolify)

```env
# Database
N8N_DB_PASSWORD=<generate-strong-password>

# Admin credentials
N8N_ADMIN_USER=admin
N8N_ADMIN_PASSWORD=<generate-strong-password>

# Encryption key (generate with: openssl rand -hex 32)
N8N_ENCRYPTION_KEY=<generate-encryption-key>
```

### 4. Generate Required Secrets

```bash
# Generate database password
openssl rand -base64 32

# Generate admin password
openssl rand -base64 24

# Generate encryption key
openssl rand -hex 32
```

## N8N Workflows for Ozean Licht

### Priority Workflows to Implement

1. **User Registration Flow**
   - Webhook trigger for new signups
   - Create user in database
   - Send welcome email
   - Add to newsletter (if opted in)
   - Notify admin

2. **Content Publishing Pipeline**
   - Watch for new content uploads
   - Trigger video processing
   - Generate thumbnails
   - Update database
   - Clear CDN cache
   - Notify subscribers

3. **Daily Reports**
   - Aggregate usage statistics
   - Check system health
   - Generate reports
   - Send to stakeholders

4. **Backup Automation**
   - Trigger database backups
   - Upload to Hetzner Storage Box
   - Verify backup integrity
   - Clean old backups
   - Send status notifications

5. **Kids Ascension Workflows**
   - Parent notification system
   - Content review assignments
   - Creator payout calculations
   - Angel donor reports

## Integration Points

### APIs to Connect
- PostgreSQL databases
- Cloudflare (CDN, DNS)
- MinIO (object storage)
- SendGrid/Postmark (email)
- Stripe (payments - future)
- Discord/Slack (notifications)

### Webhooks to Implement
- GitHub (deployment triggers)
- Stripe (payment events)
- Video platform (processing complete)
- Form submissions

## Security Considerations

1. **Network Isolation**
   - N8N on internal Docker network
   - Only expose via Coolify proxy

2. **Credential Management**
   - Use N8N's built-in credential store
   - Encrypt all sensitive data
   - Regular key rotation

3. **Access Control**
   - Strong admin password
   - Consider OAuth2 integration later
   - IP whitelist for admin access

4. **Audit & Monitoring**
   - Enable execution logs
   - Set up alerts for failures
   - Monitor resource usage

## Backup Strategy

```bash
# Backup N8N data
docker exec n8n_postgres pg_dump -U n8n_user n8n > n8n_backup_$(date +%Y%m%d).sql

# Backup workflows
docker cp n8n:/home/node/.n8n/workflows ./n8n_workflows_backup_$(date +%Y%m%d)

# Backup credentials (encrypted)
docker cp n8n:/home/node/.n8n/credentials ./n8n_credentials_backup_$(date +%Y%m%d)
```

## Monitoring

### Health Check Endpoint
- URL: `https://n8n.ozean-licht.at/healthz`
- Expected response: 200 OK

### Metrics Endpoint
- URL: `https://n8n.ozean-licht.at/metrics`
- Format: Prometheus metrics

### Key Metrics to Monitor
- Execution success rate
- Execution duration
- Queue size
- Memory usage
- Active workflows

## Troubleshooting

### Common Issues

1. **Workflow execution fails**
   ```bash
   docker logs n8n
   docker exec n8n n8n execute --id <workflow-id>
   ```

2. **Database connection issues**
   ```bash
   docker exec n8n_postgres pg_isready
   docker logs n8n_postgres
   ```

3. **High memory usage**
   ```bash
   # Restart N8N
   docker restart n8n

   # Check and adjust memory limits
   docker update --memory="2g" n8n
   ```

## Maintenance

### Weekly Tasks
- Review execution logs
- Clean up old executions
- Check for N8N updates

### Monthly Tasks
- Rotate credentials
- Backup workflows
- Review and optimize slow workflows

---

**Last Updated**: 2025-10-20
**Deployment Status**: Pending
**Access URL**: https://n8n.ozean-licht.at (after setup)