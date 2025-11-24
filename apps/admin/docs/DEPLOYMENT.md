# Admin Dashboard - Coolify Deployment Guide

## Prerequisites

- Coolify instance running at `https://coolify.ozean-licht.dev`
- GitHub repository access
- Database (PostgreSQL) accessible from deployment

## Deployment Steps

### 1. Login to Coolify

Navigate to: `https://coolify.ozean-licht.dev/login`

### 2. Create New Application

1. Click **"+ New Resource"**
2. Select **"Application"**
3. Choose **"Public Repository"** or connect your GitHub account
4. Select the repository: `ozean-licht-ecosystem`
5. Set build pack: **Dockerfile**

### 3. Configure Build Settings

**Build Configuration:**
- **Dockerfile Location:** `apps/admin/Dockerfile`
- **Docker Context:** `apps/admin/`
- **Port:** `3000`

### 4. Set Environment Variables

Add these environment variables in Coolify:

```bash
# NextAuth
NEXTAUTH_URL=https://dashboard.ozean-licht.dev
NEXTAUTH_SECRET=<generate-secure-secret-32-chars-minimum>

# Database
DATABASE_URL=postgresql://postgres:<password>@<host>:32771/shared-users-db

# MCP Gateway (if using)
MCP_GATEWAY_URL=http://mcp-gateway:8100

# MinIO
MINIO_ENDPOINT=<your-minio-endpoint>
MINIO_PORT=9000
MINIO_ACCESS_KEY=<your-access-key>
MINIO_SECRET_KEY=<your-secret-key>
MINIO_USE_SSL=false

# Application
NODE_ENV=production
PORT=3000
```

### 5. Configure Domain

1. In Coolify, go to **"Domains"** tab
2. Add domain: `dashboard.ozean-licht.dev`
3. Enable **"Automatic HTTPS"** (Let's Encrypt)
4. Coolify will automatically configure Traefik

### 6. Deploy

1. Click **"Deploy"** button
2. Monitor build logs
3. Wait for deployment to complete (usually 3-5 minutes)

### 7. Verify Deployment

Once deployed, access:
- **URL:** `https://dashboard.ozean-licht.dev`
- **Login:** `https://dashboard.ozean-licht.dev/login`

**Test Credentials:**
- Email: `super@ozean-licht.dev`
- Password: `SuperAdmin123!`

## Troubleshooting

### Build Fails

**Check:**
1. Dockerfile path is correct: `apps/admin/Dockerfile`
2. Build context is set to: `apps/admin/`
3. All dependencies are in `package.json`

**Solution:**
- Review build logs in Coolify
- Ensure `next.config.js` has `output: 'standalone'` ✅ (already set)

### Database Connection Fails

**Check:**
1. `DATABASE_URL` is correctly set
2. PostgreSQL is accessible from the container
3. Database exists (`shared-users-db`)

**Solution:**
- Use internal Docker network: `postgresql://postgres:password@coolify-db:5432/shared-users-db`
- Or use host IP if database is external

### 404 Errors on Routes

**Check:**
1. `NEXTAUTH_URL` matches the deployed domain
2. Build completed successfully
3. Server is running on port 3000

**Solution:**
- Ensure `NEXTAUTH_URL=https://dashboard.ozean-licht.dev` (no port number)
- Check container logs in Coolify

### Environment Variables Not Loading

**Solution:**
- Restart the deployment after adding variables
- Ensure no quotes around values in Coolify UI
- Check logs for "Missing required environment variable" errors

## Manual Docker Build (Testing)

Test the Docker build locally before deploying:

```bash
cd apps/admin

# Build
docker build -t admin-dashboard .

# Run
docker run -p 3000:3000 \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  -e DATABASE_URL=postgresql://... \
  admin-dashboard
```

## Updating Deployment

### Option 1: Auto-Deploy (Recommended)

1. Push changes to GitHub
2. Coolify will automatically detect and deploy

### Option 2: Manual Deploy

1. Go to Coolify dashboard
2. Find the admin-dashboard application
3. Click **"Redeploy"**

## Health Checks

Coolify automatically monitors:
- HTTP response on port 3000
- Container health status

**Manual Health Check:**
```bash
curl https://dashboard.ozean-licht.dev/api/health
```

## Logs

View logs in Coolify:
1. Go to application
2. Click **"Logs"** tab
3. Stream real-time logs

Or via Docker:
```bash
docker logs -f <container-id>
```

## Rollback

If deployment fails:
1. Go to Coolify dashboard
2. Click **"Deployments"** tab
3. Select previous successful deployment
4. Click **"Rollback"**

## Production Checklist

Before going live:

- [ ] `NEXTAUTH_SECRET` is secure (32+ random characters)
- [ ] Database connection tested
- [ ] HTTPS certificate valid
- [ ] Test users can login
- [ ] Dashboard routes accessible
- [ ] MCP Gateway connectivity verified
- [ ] MinIO storage accessible
- [ ] Logs show no errors
- [ ] DNS pointing to correct server

## Security Notes

1. **Never commit** `.env.production` with real secrets
2. Use Coolify's encrypted environment variables
3. Enable HTTPS (automatic with Let's Encrypt)
4. Set strong `NEXTAUTH_SECRET`
5. Restrict database access to known IPs if possible

## URLs

- **Coolify Dashboard:** https://coolify.ozean-licht.dev
- **Admin Dashboard:** https://dashboard.ozean-licht.dev
- **Admin Login:** https://dashboard.ozean-licht.dev/login

---

**Created:** 2025-11-09
**Status:** Ready for deployment
**Next:** Deploy to Coolify and test
