# Chatwoot Support System

Production-ready deployment of self-hosted Chatwoot for the Ozean Licht ecosystem.

## Overview

Chatwoot is an open-source customer engagement platform that provides:
- **Unified Inbox**: Manage conversations from website chat, WhatsApp, email, and Telegram in one place
- **Team Collaboration**: Assign conversations, use private notes, and collaborate on responses
- **Multi-channel Support**: Connect multiple communication channels
- **Rich Customer Context**: View customer details alongside conversations
- **Automation**: Create canned responses, automatic assignments, and routing rules
- **Analytics**: Track response times, CSAT scores, and team performance

### Purpose in Ozean Licht Ecosystem

Chatwoot serves as the conversational layer for customer support across both Ozean Licht Akademie and Kids Ascension platforms. It integrates with the admin dashboard to provide:
- Real-time customer support
- Context-enriched conversations (user profiles, course progress, payment history)
- AI-assisted triage and routing
- Knowledge base for self-service
- Performance analytics

## Architecture

```
┌─────────────────────┐      ┌──────────────────┐      ┌─────────────────────┐
│   Chat Widget       │      │   Chatwoot       │      │  Admin Dashboard    │
│  (ozean-licht.at)   │─────▶│  chatwoot.dev    │◀─────│  /dashboard/support │
└─────────────────────┘      │                  │      └─────────────────────┘
                             │  - Web UI        │
┌─────────────────────┐      │  - API           │      ┌─────────────────────┐
│   WhatsApp          │─────▶│  - Webhooks      │      │  PostgreSQL         │
└─────────────────────┘      │  - Background    │      │  (separate DB)      │
                             │    Workers       │      └─────────────────────┘
┌─────────────────────┐      └──────────────────┘
│   Email/Telegram    │             │
└─────────────────────┘             │
                                    ▼
                             ┌──────────────────┐
                             │   Redis Cache    │
                             │   & Job Queue    │
                             └──────────────────┘
```

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Domain with DNS configured: `chatwoot.ozean-licht.dev`
- SMTP credentials for email notifications
- Nginx or Traefik for reverse proxy (if not using Coolify)
- Minimum 2GB RAM, 2 CPU cores

## Environment Variables

Create a `.env` file in `/opt/ozean-licht-ecosystem/tools/chatwoot/` with the following variables:

### Required Variables

```env
# Chatwoot Base URL (must match your domain)
CHATWOOT_BASE_URL=https://chatwoot.ozean-licht.dev

# Rails Secret Key (generate with: openssl rand -hex 64)
SECRET_KEY_BASE=your_generated_secret_key_here

# PostgreSQL Configuration
CHATWOOT_POSTGRES_DATABASE=chatwoot
CHATWOOT_POSTGRES_USERNAME=chatwoot
CHATWOOT_POSTGRES_PASSWORD=your_secure_postgres_password

# Redis Configuration
CHATWOOT_REDIS_PASSWORD=your_secure_redis_password

# SMTP Configuration (for email notifications)
CHATWOOT_SMTP_ADDRESS=smtp.example.com
CHATWOOT_SMTP_PORT=587
CHATWOOT_SMTP_USERNAME=support@ozean-licht.at
CHATWOOT_SMTP_PASSWORD=your_smtp_password
CHATWOOT_SMTP_DOMAIN=ozean-licht.at

# Webhook Secret (generate with: openssl rand -hex 32)
CHATWOOT_WEBHOOK_SECRET=your_webhook_secret_here

# Email Sender
CHATWOOT_MAILER_SENDER_EMAIL=support@ozean-licht.at
```

### Optional Variables

```env
# Chatwoot Version
CHATWOOT_VERSION=latest

# Port Configuration (default: 3000)
CHATWOOT_PORT=3000

# Storage Configuration (use S3 for production)
ACTIVE_STORAGE_SERVICE=local  # or 's3'

# S3 Configuration (if using S3 storage)
CHATWOOT_S3_BUCKET_NAME=chatwoot-attachments
CHATWOOT_AWS_ACCESS_KEY_ID=your_access_key
CHATWOOT_AWS_SECRET_ACCESS_KEY=your_secret_key
CHATWOOT_AWS_REGION=eu-central-1
CHATWOOT_S3_ENDPOINT=https://s3.eu-central-1.amazonaws.com

# SMTP Advanced Settings
CHATWOOT_SMTP_AUTHENTICATION=plain
CHATWOOT_SMTP_ENABLE_STARTTLS_AUTO=true
CHATWOOT_SMTP_OPENSSL_VERIFY_MODE=none

# Inbound Email Domain (for email channel)
CHATWOOT_MAILER_INBOUND_EMAIL_DOMAIN=support.ozean-licht.at

# Security
CHATWOOT_FORCE_SSL=true

# Features
CHATWOOT_ENABLE_ACCOUNT_SIGNUP=false  # Disable public signups
CHATWOOT_USE_INBOX_AVATAR_FOR_BOT=true

# Performance
CHATWOOT_RAILS_MAX_THREADS=5

# Logging
CHATWOOT_LOG_LEVEL=info
CHATWOOT_LOG_SIZE=500

# Telemetry
CHATWOOT_TELEMETRY_ENABLED=false
```

## Quick Start

### 1. Generate Secrets

Generate required secrets before deployment:

```bash
# Navigate to chatwoot directory
cd /opt/ozean-licht-ecosystem/tools/chatwoot

# Generate SECRET_KEY_BASE
echo "SECRET_KEY_BASE=$(openssl rand -hex 64)"

# Generate CHATWOOT_WEBHOOK_SECRET
echo "CHATWOOT_WEBHOOK_SECRET=$(openssl rand -hex 32)"

# Generate secure PostgreSQL password
echo "CHATWOOT_POSTGRES_PASSWORD=$(openssl rand -base64 32)"

# Generate secure Redis password
echo "CHATWOOT_REDIS_PASSWORD=$(openssl rand -base64 32)"
```

### 2. Configure Environment

Create `.env` file with all required variables (see Environment Variables section above).

### 3. Deploy Services

```bash
# Start all services
docker compose up -d

# Check service status
docker compose ps

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f chatwoot-web
docker compose logs -f chatwoot-sidekiq
```

### 4. Initialize Database

On first deployment, run database migrations:

```bash
# Run migrations
docker compose exec chatwoot-web bundle exec rails db:chatwoot_prepare

# Alternative: if above fails, run separately
docker compose exec chatwoot-web bundle exec rails db:create
docker compose exec chatwoot-web bundle exec rails db:migrate
docker compose exec chatwoot-web bundle exec rails db:seed
```

### 5. Create Super Admin Account

```bash
# Create super admin via Rails console
docker compose exec chatwoot-web bundle exec rails console

# In the Rails console, run:
# User.create!(
#   email: 'admin@ozean-licht.at',
#   password: 'SuperSecurePassword123!',
#   name: 'Admin',
#   confirmed_at: Time.now,
#   role: :administrator
# )
```

Or use the Chatwoot CLI:

```bash
docker compose exec chatwoot-web bundle exec rails runner "
  User.create!(
    email: 'admin@ozean-licht.at',
    password: 'SuperSecurePassword123!',
    name: 'Admin',
    confirmed_at: Time.now,
    role: :administrator
  )
"
```

### 6. Access Chatwoot UI

Navigate to `https://chatwoot.ozean-licht.dev` and log in with your admin credentials.

## Nginx Reverse Proxy Configuration

If not using Coolify/Traefik, configure Nginx as a reverse proxy:

### Option 1: Nginx Configuration File

Create `/etc/nginx/sites-available/chatwoot.ozean-licht.dev`:

```nginx
upstream chatwoot {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    listen [::]:80;
    server_name chatwoot.ozean-licht.dev;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name chatwoot.ozean-licht.dev;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/chatwoot.ozean-licht.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chatwoot.ozean-licht.dev/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logging
    access_log /var/log/nginx/chatwoot-access.log;
    error_log /var/log/nginx/chatwoot-error.log;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Max upload size for attachments
    client_max_body_size 50M;

    # Proxy settings
    location / {
        proxy_pass http://chatwoot;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        # Timeouts
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        send_timeout 300;
    }

    # WebSocket support for ActionCable
    location /cable {
        proxy_pass http://chatwoot;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/chatwoot.ozean-licht.dev /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Option 2: Let's Encrypt SSL Certificate

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d chatwoot.ozean-licht.dev

# Auto-renewal is configured by default
```

## Chatwoot Initial Configuration

### 1. First Login

1. Navigate to `https://chatwoot.ozean-licht.dev`
2. Log in with your admin credentials
3. Complete the onboarding wizard

### 2. Create Account

1. In Chatwoot UI, go to **Account Settings**
2. Create a new account: "Ozean Licht Support"
3. Note the **Account ID** (visible in URL or Settings)

### 3. Generate API Key

1. Go to **Profile Settings** → **Access Token**
2. Click **Add Personal Access Token**
3. Name: "Admin Dashboard Integration"
4. Copy the token and save it as `CHATWOOT_API_KEY` in admin app's `.env`

Example admin `.env` entry:
```env
CHATWOOT_BASE_URL=https://chatwoot.ozean-licht.dev
CHATWOOT_API_KEY=your_personal_access_token_here
CHATWOOT_WEBHOOK_SECRET=your_webhook_secret_from_chatwoot_env
CHATWOOT_ACCOUNT_ID=1
```

### 4. Create Inboxes

#### Website Chat Widget

1. Go to **Settings** → **Inboxes** → **Add Inbox**
2. Select **Website**
3. Configure:
   - **Name**: Ozean Licht Website
   - **Domain**: ozean-licht.at
   - **Welcome Message** (German):
     ```
     Herzlich willkommen! 👋

     Wie können wir dir heute helfen?
     ```
   - **Widget Color**: #0ec2bc (Ozean Licht brand color)
   - **Enable pre-chat form**: Yes
4. Copy the widget embed code
5. Save **Website Token** for later use

#### Email Inbox (Optional)

1. Go to **Settings** → **Inboxes** → **Add Inbox**
2. Select **Email**
3. Configure:
   - **Email**: support@ozean-licht.at
   - **SMTP Settings**: Use same settings as in `.env`

#### WhatsApp (Future)

1. Requires WhatsApp Business API access
2. Follow Chatwoot documentation for WhatsApp setup
3. Configure webhook in WhatsApp dashboard

#### Telegram (Future)

1. Create Telegram bot via @BotFather
2. Add Telegram inbox in Chatwoot
3. Configure bot token

### 5. Configure Webhooks

Set up webhooks to sync conversations with admin dashboard:

1. Go to **Settings** → **Integrations** → **Webhooks**
2. Click **Add Webhook**
3. Configure:
   - **URL**: `https://admin.ozean-licht.dev/api/support/webhooks/chatwoot`
   - **Events to Subscribe**:
     - `conversation_created`
     - `conversation_updated`
     - `conversation_status_changed`
     - `conversation_resolved`
     - `message_created`
     - `message_updated`
4. Save the webhook

**Important**: Ensure `CHATWOOT_WEBHOOK_SECRET` in both Chatwoot `.env` and Admin `.env` match for signature verification.

### 6. Set Up Teams

Create teams for proper conversation routing:

1. Go to **Settings** → **Teams**
2. Create the following teams:
   - **Tech Support**: Technical issues, login problems, platform bugs
   - **Sales**: Payment issues, subscription questions, refunds
   - **Spiritual Support**: Course content questions, spiritual guidance
   - **General**: All other inquiries

3. For each team:
   - Add team members (agents)
   - Set availability hours
   - Configure auto-assignment rules

### 7. Create Canned Responses

Add common responses for faster replies:

1. Go to **Settings** → **Canned Responses**
2. Create responses for:
   - Welcome message
   - Payment confirmation
   - Technical troubleshooting
   - Course access instructions
   - Refund policy
   - Closing messages

Example canned response:
```
Short Code: welcome-de
Content:
Herzlich willkommen! Vielen Dank für deine Nachricht.

Wir werden uns so schnell wie möglich bei dir melden. Bitte teile uns so viele Details wie möglich mit, damit wir dir am besten helfen können.

Mit Licht und Liebe,
Ozean Licht Support Team 🌊✨
```

### 8. Configure Automation Rules

Set up automation for smart routing:

1. Go to **Settings** → **Automation**
2. Create rules for:
   - **Technical Keywords**: Route to Tech Support team
   - **Payment Keywords**: Route to Sales team
   - **Spiritual Keywords**: Route to Spiritual team
   - **Priority Detection**: Escalate urgent conversations

Example automation rule:
```
Name: Route Technical Issues
Trigger: Message Created
Conditions: Message contains "login", "error", "bug", "broken"
Actions:
  - Assign to team: Tech Support
  - Add label: technical
  - Set priority: high
```

### 9. Widget Customization

Customize the website chat widget:

1. Go to **Inbox Settings** → **Website** → **Configuration**
2. Customize:
   - **Widget Color**: #0ec2bc
   - **Position**: Bottom right
   - **Greeting Message**: Enabled
   - **Pre-chat Form**: Enabled (collect name and email)
   - **Business Hours**: Configure availability
   - **Away Message** (German):
     ```
     Wir sind gerade nicht verfügbar. Hinterlasse eine Nachricht und wir melden uns so bald wie möglich.
     ```

### 10. Embed Widget Code

Add the widget to the Ozean Licht website:

1. Copy the widget script from Inbox Settings
2. Add to website `<head>` or before closing `</body>` tag:

```html
<script>
  (function(d,t) {
    var BASE_URL="https://chatwoot.ozean-licht.dev";
    var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src=BASE_URL+"/packs/js/sdk.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g,s);
    g.onload=function(){
      window.chatwootSDK.run({
        websiteToken: 'YOUR_WEBSITE_TOKEN_HERE',
        baseUrl: BASE_URL
      })
    }
  })(document,"script");
</script>
```

3. Replace `YOUR_WEBSITE_TOKEN_HERE` with actual website token

## Integration with Admin Dashboard

### 1. Configure Environment Variables

Add to `apps/admin/.env`:

```env
# Chatwoot Integration
CHATWOOT_BASE_URL=https://chatwoot.ozean-licht.dev
CHATWOOT_API_KEY=your_personal_access_token
CHATWOOT_WEBHOOK_SECRET=your_webhook_secret
CHATWOOT_ACCOUNT_ID=1
```

### 2. Verify Webhook Endpoint

Ensure the webhook endpoint is accessible:

```bash
# Test endpoint (should return 405 Method Not Allowed for GET, which is expected)
curl -X GET https://admin.ozean-licht.dev/api/support/webhooks/chatwoot

# Webhook events will be POST requests from Chatwoot
```

### 3. Test Integration

1. Send a test message via the chat widget
2. Check Chatwoot inbox for the message
3. Check admin dashboard logs for webhook reception:
   ```bash
   docker compose logs -f admin
   ```
4. Verify conversation appears in admin dashboard (once support UI is built)

## Monitoring and Maintenance

### Health Checks

```bash
# Check all service health
docker compose ps

# Check Chatwoot web health
curl https://chatwoot.ozean-licht.dev/health

# Check database connection
docker compose exec postgres pg_isready -U chatwoot

# Check Redis connection
docker compose exec redis redis-cli --raw incr ping
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f chatwoot-web
docker compose logs -f chatwoot-sidekiq
docker compose logs -f postgres
docker compose logs -f redis

# Last 100 lines
docker compose logs --tail=100 chatwoot-web

# Filter by timestamp
docker compose logs --since 1h chatwoot-web
```

### Database Backups

```bash
# Create backup directory
mkdir -p /opt/ozean-licht-ecosystem/backups/chatwoot

# Manual backup
docker compose exec postgres pg_dump -U chatwoot chatwoot | gzip > /opt/ozean-licht-ecosystem/backups/chatwoot/chatwoot-backup-$(date +%Y%m%d-%H%M%S).sql.gz

# Restore from backup
gunzip -c /opt/ozean-licht-ecosystem/backups/chatwoot/chatwoot-backup-YYYYMMDD-HHMMSS.sql.gz | docker compose exec -T postgres psql -U chatwoot chatwoot
```

### Automated Backup Script

Create `/opt/ozean-licht-ecosystem/tools/chatwoot/backup.sh`:

```bash
#!/bin/bash
# Automated Chatwoot database backup script

BACKUP_DIR="/opt/ozean-licht-ecosystem/backups/chatwoot"
RETENTION_DAYS=30

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/chatwoot-backup-$TIMESTAMP.sql.gz"

docker compose -f /opt/ozean-licht-ecosystem/tools/chatwoot/docker-compose.yml exec -T postgres pg_dump -U chatwoot chatwoot | gzip > "$BACKUP_FILE"

# Check backup success
if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_FILE"

    # Remove old backups
    find "$BACKUP_DIR" -name "chatwoot-backup-*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "Old backups cleaned (retention: $RETENTION_DAYS days)"
else
    echo "Backup failed!"
    exit 1
fi
```

Make executable and add to crontab:

```bash
chmod +x /opt/ozean-licht-ecosystem/tools/chatwoot/backup.sh

# Add to crontab (daily at 2 AM)
# crontab -e
# 0 2 * * * /opt/ozean-licht-ecosystem/tools/chatwoot/backup.sh >> /var/log/chatwoot-backup.log 2>&1
```

### Performance Tuning

#### PostgreSQL Optimization

Edit `docker-compose.yml` to add PostgreSQL performance parameters:

```yaml
postgres:
  command:
    - postgres
    - -c
    - max_connections=200
    - -c
    - shared_buffers=256MB
    - -c
    - effective_cache_size=1GB
    - -c
    - work_mem=16MB
```

#### Redis Optimization

For high traffic, increase Redis memory:

```yaml
redis:
  command: redis-server --appendonly yes --requirepass ${CHATWOOT_REDIS_PASSWORD} --maxmemory 512mb --maxmemory-policy allkeys-lru
```

### Scaling

#### Horizontal Scaling (Multiple Sidekiq Workers)

Add more Sidekiq workers:

```yaml
chatwoot-sidekiq-2:
  extends: chatwoot-sidekiq
  container_name: chatwoot-sidekiq-2
```

#### Vertical Scaling (More Resources)

Adjust resource limits in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '4.0'
      memory: 4G
    reservations:
      cpus: '2.0'
      memory: 2G
```

## Troubleshooting

### Issue: Services Won't Start

```bash
# Check Docker logs
docker compose logs

# Check if ports are in use
sudo lsof -i :3000
sudo lsof -i :5432
sudo lsof -i :6379

# Restart services
docker compose down
docker compose up -d
```

### Issue: Database Connection Failed

```bash
# Check PostgreSQL is running
docker compose ps postgres

# Check PostgreSQL logs
docker compose logs postgres

# Verify credentials
docker compose exec postgres psql -U chatwoot -d chatwoot -c "SELECT 1;"

# Reset database (WARNING: deletes all data)
docker compose down -v
docker compose up -d
docker compose exec chatwoot-web bundle exec rails db:chatwoot_prepare
```

### Issue: Redis Connection Failed

```bash
# Check Redis is running
docker compose ps redis

# Test Redis connection
docker compose exec redis redis-cli --raw incr ping

# Check password
docker compose exec redis redis-cli -a "${CHATWOOT_REDIS_PASSWORD}" ping
```

### Issue: Sidekiq Not Processing Jobs

```bash
# Check Sidekiq logs
docker compose logs chatwoot-sidekiq

# Check Redis queue
docker compose exec redis redis-cli -a "${CHATWOOT_REDIS_PASSWORD}" LLEN queue:default

# Restart Sidekiq
docker compose restart chatwoot-sidekiq
```

### Issue: Webhooks Not Received

```bash
# Check admin logs for incoming webhooks
docker compose -f /opt/ozean-licht-ecosystem/apps/admin/docker-compose.yml logs -f admin

# Verify webhook configuration in Chatwoot
# Settings → Integrations → Webhooks

# Test webhook manually
curl -X POST https://admin.ozean-licht.dev/api/support/webhooks/chatwoot \
  -H "Content-Type: application/json" \
  -d '{"event":"test"}'

# Check Nginx/proxy logs
sudo tail -f /var/log/nginx/chatwoot-access.log
sudo tail -f /var/log/nginx/chatwoot-error.log
```

### Issue: Widget Not Loading

1. Check browser console for errors
2. Verify `CHATWOOT_BASE_URL` is accessible
3. Check CORS configuration
4. Ensure website token is correct
5. Verify widget script is loaded

```javascript
// Check in browser console
console.log(window.chatwootSDK);
```

### Issue: Email Notifications Not Sending

```bash
# Check Sidekiq logs for email errors
docker compose logs chatwoot-sidekiq | grep -i mail

# Test SMTP connection manually
docker compose exec chatwoot-web bundle exec rails console

# In Rails console:
# ActionMailer::Base.mail(
#   from: 'support@ozean-licht.at',
#   to: 'test@example.com',
#   subject: 'Test',
#   body: 'Test email'
# ).deliver_now
```

### Issue: High Memory Usage

```bash
# Check container stats
docker stats

# Check database size
docker compose exec postgres psql -U chatwoot -d chatwoot -c "SELECT pg_size_pretty(pg_database_size('chatwoot'));"

# Check Redis memory
docker compose exec redis redis-cli -a "${CHATWOOT_REDIS_PASSWORD}" INFO memory

# Consider increasing resource limits or optimizing queries
```

### Issue: Slow Performance

1. **Check database queries**: Enable slow query log in PostgreSQL
2. **Check Redis memory**: Increase if needed
3. **Check Sidekiq queues**: Ensure workers are processing jobs
4. **Check network**: Verify latency between services
5. **Optimize asset delivery**: Use CDN for static assets
6. **Scale horizontally**: Add more Sidekiq workers

## Upgrading Chatwoot

```bash
# Pull latest image
docker compose pull

# Backup database before upgrade
./backup.sh

# Stop services
docker compose down

# Start with new image
docker compose up -d

# Run migrations
docker compose exec chatwoot-web bundle exec rails db:migrate

# Check logs
docker compose logs -f chatwoot-web
```

## Security Best Practices

1. **Use Strong Passwords**: Generate secure passwords for all services
2. **Enable SSL**: Always use HTTPS in production
3. **Restrict Access**: Use firewall rules to limit access to ports
4. **Regular Updates**: Keep Docker images and dependencies updated
5. **Backup Regularly**: Automate database backups
6. **Monitor Logs**: Set up log aggregation and alerting
7. **API Key Rotation**: Rotate API keys periodically
8. **Webhook Signature Verification**: Always verify webhook signatures
9. **Rate Limiting**: Implement rate limiting on webhooks
10. **Network Isolation**: Use Docker networks to isolate services

## Useful Commands

```bash
# Restart all services
docker compose restart

# Stop all services
docker compose stop

# Remove all containers (keeps data)
docker compose down

# Remove all containers and volumes (deletes data)
docker compose down -v

# View resource usage
docker stats

# Execute Rails console
docker compose exec chatwoot-web bundle exec rails console

# Run Rails migrations
docker compose exec chatwoot-web bundle exec rails db:migrate

# Check Chatwoot version
docker compose exec chatwoot-web cat /app/VERSION

# Export conversations
docker compose exec postgres pg_dump -U chatwoot -t conversations chatwoot > conversations.sql

# Import conversations
docker compose exec -T postgres psql -U chatwoot chatwoot < conversations.sql
```

## References

- [Chatwoot Official Documentation](https://www.chatwoot.com/docs)
- [Chatwoot GitHub Repository](https://github.com/chatwoot/chatwoot)
- [Chatwoot Docker Installation](https://www.chatwoot.com/docs/self-hosted/deployment/docker)
- [Chatwoot API Documentation](https://www.chatwoot.com/developers/api)
- [Chatwoot Webhooks](https://www.chatwoot.com/docs/product/channels/api/webhook-setup)

## Support

For Chatwoot-specific issues:
- Community Forum: https://github.com/chatwoot/chatwoot/discussions
- Discord: https://discord.gg/cJXdrwS

For Ozean Licht ecosystem integration:
- Check admin dashboard documentation
- Review webhook implementation in `apps/admin/app/api/support/webhooks/chatwoot/`
- Contact platform team

---

**Maintained by**: Ozean Licht Platform Team
**Last Updated**: 2025-12-04
**Version**: 1.0.0
