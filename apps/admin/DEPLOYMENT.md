# Admin Dashboard Deployment

## Overview
The admin dashboard is a Next.js application for managing the Ozean Licht ecosystem, including file storage via MinIO, system health monitoring, and entity management.

## Prerequisites
- Coolify instance running
- GitHub repository access
- Environment variables configured in Coolify

## Deployment to Coolify

### Method 1: Via Coolify Web Interface

1. **Create New Application**:
   - Navigate to Infrastructure project in Coolify
   - Click "New Resource" > "Application"
   - Select "GitHub Repository"

2. **Configure Repository**:
   - Repository: `ozean-licht/ozean-licht`
   - Branch: `main`
   - Build Path: `/projects/admin`

3. **Build Configuration**:
   - Build Pack: `Dockerfile`
   - Dockerfile Location: `/projects/admin/Dockerfile`
   - Build Context: `/projects/admin`

4. **Environment Variables**:
   ```bash
   # Authentication
   AUTH_SECRET=<generate-secure-secret>
   NEXTAUTH_URL=https://dashboard.ozean-licht.dev

   # Database
   DATABASE_URL=postgresql://postgres:password@localhost:5432/kids-ascension-db

   # MCP Gateway
   MCP_GATEWAY_URL=http://mcp-gateway:8100

   # MinIO Configuration
   MINIO_ENDPOINT=http://138.201.139.25:9000
   MINIO_ACCESS_KEY=<minio-access-key>
   MINIO_SECRET_KEY=<minio-secret-key>
   MINIO_USE_SSL=false
   MINIO_REGION=eu-central-1
   MINIO_DEFAULT_BUCKET=ozean-ecosystem
   ```

5. **Domain Configuration**:
   - Domain: `dashboard.ozean-licht.dev`
   - HTTPS: Enabled
   - Force HTTPS: Yes

6. **Deploy**:
   - Click "Deploy" to start the deployment process
   - Monitor logs for any issues

### Method 2: Via Docker Compose

1. **SSH to server**:
   ```bash
   ssh adw-user@138.201.139.25
   ```

2. **Navigate to project**:
   ```bash
   cd /opt/ozean-licht-ecosystem/projects/admin
   ```

3. **Create .env file**:
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

4. **Deploy with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

### Method 3: Manual Docker Build

1. **Build the image**:
   ```bash
   cd /opt/ozean-licht-ecosystem/projects/admin
   docker build -t admin-dashboard:latest .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     --name admin-dashboard \
     --network coolify \
     -p 3000:3000 \
     --env-file .env \
     admin-dashboard:latest
   ```

## Environment Variables

### Required Variables
- `AUTH_SECRET`: Random string for NextAuth session encryption (min 32 characters)
- `DATABASE_URL`: PostgreSQL connection string
- `MCP_GATEWAY_URL`: URL to MCP Gateway service
- `MINIO_ENDPOINT`: MinIO server endpoint
- `MINIO_ACCESS_KEY`: MinIO access key
- `MINIO_SECRET_KEY`: MinIO secret key

### Optional Variables
- `NEXTAUTH_URL`: Full URL where app is hosted (default: https://dashboard.ozean-licht.dev)
- `MINIO_USE_SSL`: Use SSL for MinIO (default: false)
- `MINIO_REGION`: MinIO region (default: eu-central-1)
- `MINIO_DEFAULT_BUCKET`: Default bucket name (default: ozean-ecosystem)

## Health Checks

The application exposes the following health check endpoints:
- `/api/health` - Basic health check
- `/api/health/ready` - Readiness check (includes database connectivity)

## Monitoring

### Logs
View application logs in Coolify or via Docker:
```bash
docker logs -f admin-dashboard
```

### Metrics
The dashboard includes built-in metrics at `/dashboard/health`:
- Database connection status
- MinIO storage availability
- MCP Gateway connectivity
- System resource usage

## Troubleshooting

### Build Failures
1. Check Node.js version compatibility (requires v18+)
2. Ensure all dependencies are properly installed
3. Verify environment variables are set

### Runtime Issues
1. Check database connectivity
2. Verify MinIO credentials and endpoint
3. Ensure MCP Gateway is accessible
4. Check network connectivity between services

### Common Errors

**Error: ECONNREFUSED to MCP Gateway**
- Solution: Ensure MCP Gateway is running and accessible on the Docker network

**Error: Invalid AUTH_SECRET**
- Solution: Generate a new secret with: `openssl rand -base64 32`

**Error: MinIO connection failed**
- Solution: Verify MinIO endpoint and credentials

## Rollback

To rollback to a previous version:
1. In Coolify: Navigate to deployments and click "Rollback" on a previous successful deployment
2. Via Docker: Pull and run a previous image tag

## Security Considerations

1. **AUTH_SECRET**: Must be unique and secure
2. **Database Access**: Use read-only credentials where possible
3. **MinIO Access**: Create dedicated access keys with minimal permissions
4. **Network Security**: Ensure services communicate over internal Docker networks
5. **HTTPS**: Always use HTTPS in production (handled by Coolify/Traefik)

## Performance Optimization

1. **Caching**: Next.js automatic caching is enabled
2. **Image Optimization**: Next.js Image component optimizes images automatically
3. **Database Pooling**: Connection pooling is configured in Prisma
4. **Static Assets**: Served via CDN when possible

## Backup and Recovery

1. **Database**: Regular PostgreSQL backups via pg_dump
2. **MinIO Data**: Replicated to Cloudflare R2 for redundancy
3. **Configuration**: Store environment variables securely in Coolify

## Support

For deployment issues:
1. Check application logs in Coolify
2. Review GitHub Actions for CI/CD status
3. Contact infrastructure team for server-level issues