# Docker Deployment Guide for Encoding Worker

This guide explains how to deploy the encoding worker using Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose V2
- At least 8GB RAM available for the encoding worker
- At least 4GB disk space for temporary encoding files

## Quick Start

1. **Create environment file**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Build and start services**:
   ```bash
   docker compose up -d
   ```

3. **View logs**:
   ```bash
   docker compose logs -f encoding-worker
   ```

4. **Stop services**:
   ```bash
   docker compose down
   ```

## Architecture

The docker-compose setup includes two services:

### 1. Redis (Job Queue)
- **Image**: redis:7-alpine
- **Port**: 6379
- **Volume**: redis-data (persistent storage)
- **Resources**: 256M-512M RAM, 0.25-0.5 CPU
- **Features**:
  - AOF persistence enabled
  - Health check every 10s
  - Auto-restart on failure

### 2. Encoding Worker
- **Build**: Local Dockerfile
- **Resources**: 4G-8G RAM, 2-4 CPUs
- **Volumes**:
  - `encoding-temp`: Persistent volume for temporary encoding files
  - `./logs`: Local directory for worker logs
- **Tmpfs**: 4GB RAM-based temporary storage for encoding operations
- **Features**:
  - FFmpeg with full codec support
  - BullMQ job processing
  - S3/Hetzner Object Storage upload
  - CDN (Bunny.net) integration
  - Webhook progress callbacks
  - Health check every 30s
  - Auto-restart on failure

## Environment Variables

### Required Variables
```bash
# S3/Object Storage (Hetzner)
S3_ENDPOINT=https://your-s3-endpoint.com
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# CDN (Bunny.net)
CDN_BASE_URL=https://your-cdn-url.com
```

### Optional Variables with Defaults
```bash
# Redis
REDIS_PASSWORD=           # Optional password
REDIS_DB=0               # Database number

# S3 Configuration
S3_BUCKET=video-hls
S3_REGION=eu-central-1
S3_USE_SSL=true
S3_FORCE_PATH_STYLE=true

# Worker Settings
MAX_CONCURRENT_JOBS=3
WORKER_CONCURRENCY=3
JOB_TIMEOUT_MS=3600000   # 1 hour
JOB_ATTEMPTS=3
JOB_BACKOFF_DELAY_MS=5000

# Encoding Settings
DEFAULT_VIDEO_CODEC=libx264
DEFAULT_AUDIO_CODEC=aac
HLS_SEGMENT_DURATION=6
HLS_PLAYLIST_TYPE=vod
ENABLE_ADAPTIVE_BITRATE=true
VIDEO_RESOLUTIONS=1080p,720p,480p,360p

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Webhooks (optional)
WEBHOOK_URL=https://your-api.com/webhooks/encoding
WEBHOOK_SECRET=your-secret

# Telegram Alerts (optional)
ALERTING_ENABLED=false
TELEGRAM_BOT_TOKEN=your-token
TELEGRAM_ALERT_CHAT_ID=your-chat-id
```

## Resource Configuration

The docker-compose.yml includes resource limits to prevent system overload:

### Redis
- **Limits**: 512M RAM, 0.5 CPU
- **Reservations**: 256M RAM, 0.25 CPU

### Encoding Worker
- **Limits**: 8G RAM, 4 CPUs
- **Reservations**: 4G RAM, 2 CPUs

### Temporary Storage
- **Volume**: `encoding-temp` (disk-based, persistent)
- **Tmpfs**: `/tmp/encoding-tmpfs` (RAM-based, 4G limit)

You can adjust these limits in `docker-compose.yml` based on your server capacity.

## Networking

All services communicate over a dedicated Docker network:
- **Network Name**: `encoding-network`
- **Type**: Bridge network
- **Redis Host**: `redis` (internal DNS)
- **Redis Port**: `6379`

## Volumes

### Persistent Volumes
1. **redis-data**: Redis AOF persistence
   - Location: Docker managed volume
   - Backup recommended for production

2. **encoding-temp**: Temporary encoding files
   - Location: Docker managed volume
   - Can be cleared periodically
   - Alternative to tmpfs for larger files

### Bind Mounts
1. **./logs**: Worker application logs
   - Location: `./logs` in project directory
   - Rotate regularly to prevent disk filling

## Health Checks

Both services include health checks:

### Redis
- Command: `redis-cli ping`
- Interval: 10s
- Timeout: 3s
- Retries: 3

### Encoding Worker
- Command: `node -e "process.exit(0)"`
- Interval: 30s
- Timeout: 5s
- Retries: 3
- Start Period: 30s (allows time for worker to initialize)

## Production Deployment

### Security
1. **Set Redis password**:
   ```bash
   REDIS_PASSWORD=your-strong-password
   ```

2. **Configure webhook authentication**:
   ```bash
   WEBHOOK_SECRET=your-webhook-secret
   ```

3. **Review resource limits** based on your server capacity

### Monitoring
1. **View logs**:
   ```bash
   docker compose logs -f encoding-worker
   ```

2. **Check service health**:
   ```bash
   docker compose ps
   ```

3. **Inspect Redis queue**:
   ```bash
   docker compose exec redis redis-cli
   # Inside redis-cli:
   > KEYS *
   > LLEN bull:encoding:*
   ```

### Backup
1. **Redis data**:
   ```bash
   docker compose exec redis redis-cli BGSAVE
   docker compose cp redis:/data/dump.rdb ./backups/
   ```

2. **Logs**:
   ```bash
   tar -czf logs-backup-$(date +%Y%m%d).tar.gz logs/
   ```

## Troubleshooting

### Worker not starting
1. Check logs: `docker compose logs encoding-worker`
2. Verify environment variables are set correctly
3. Ensure Redis is healthy: `docker compose ps redis`
4. Check disk space: `df -h`

### Out of memory
1. Reduce `MAX_CONCURRENT_JOBS`
2. Increase Docker daemon memory limit
3. Reduce `VIDEO_RESOLUTIONS` to fewer quality levels
4. Reduce tmpfs size if using

### Redis connection issues
1. Verify Redis is running: `docker compose ps redis`
2. Check network connectivity: `docker compose exec encoding-worker ping redis`
3. Verify REDIS_HOST=redis (not localhost)

### Encoding failures
1. Check FFmpeg is available: `docker compose exec encoding-worker ffmpeg -version`
2. Verify S3 credentials are correct
3. Check webhook endpoint is reachable
4. Review job logs for specific errors

## Scaling

To scale horizontally:

1. **Multiple workers**:
   ```bash
   docker compose up -d --scale encoding-worker=3
   ```

2. **External Redis** (for multiple hosts):
   - Comment out local Redis service
   - Set `REDIS_URL` to external Redis instance
   - Update all workers to use same Redis

3. **Load balancing**:
   - BullMQ automatically distributes jobs across workers
   - No additional configuration needed

## Commands Reference

```bash
# Start services
docker compose up -d

# View logs (all services)
docker compose logs -f

# View logs (specific service)
docker compose logs -f encoding-worker
docker compose logs -f redis

# Restart services
docker compose restart

# Stop services
docker compose stop

# Stop and remove containers
docker compose down

# Stop and remove containers + volumes
docker compose down -v

# Rebuild and restart
docker compose up -d --build

# Scale workers
docker compose up -d --scale encoding-worker=3

# Execute command in container
docker compose exec encoding-worker sh
docker compose exec redis redis-cli

# View resource usage
docker stats

# Check service health
docker compose ps
```

## Development vs Production

### Development
```bash
# Use .env with development values
NODE_ENV=development
LOG_LEVEL=debug
LOG_FORMAT=pretty
```

### Production
```bash
# Use .env with production values
NODE_ENV=production
LOG_LEVEL=info
LOG_FORMAT=json
CLEANUP_TEMP_FILES=true
```

## Integration with Admin App

The admin app submits encoding jobs to Redis, which the worker processes:

1. **Admin creates job**: POST to `/api/videos` endpoint
2. **Job queued**: BullMQ adds job to Redis queue
3. **Worker picks up job**: Automatically when worker is available
4. **Encoding progresses**: Worker sends webhook updates (if configured)
5. **Upload to S3**: Worker uploads HLS files to object storage
6. **Job completes**: Worker updates job status in database via webhook

See the Video Management System spec for full integration details.
