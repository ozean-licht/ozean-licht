# Storybook Auth Wrapper - Coolify Deployment Guide

**Subdomain:** `components.ozean-licht.dev`
**Service:** NextAuth-protected Storybook documentation
**Port:** 3002

---

## Pre-Deployment Checklist

- [ ] Cloudflare DNS configured for `components.ozean-licht.dev` → Server IP
- [ ] Storybook static build exists: `/opt/ozean-licht-ecosystem/storybook/build/`
- [ ] Database schema includes `admin_users` and `audit_logs` tables
- [ ] Test admin user exists in `shared-users-db`

---

## Step 1: Build Storybook Static Files

```bash
# SSH into server
ssh root@138.201.139.25

# Navigate to project
cd /opt/ozean-licht-ecosystem

# Build Storybook static files
pnpm build-storybook

# Verify build output
ls -la storybook/build/
# Should see: index.html, static/, assets/
```

---

## Step 2: Create Coolify Application

### A. Create New Resource

1. Login to Coolify: http://coolify.ozean-licht.dev:8000
2. Navigate to **Projects** → Select your project
3. Click **+ New Resource**
4. Select **Docker Compose**

### B. Repository Configuration

- **Name:** `storybook-auth-wrapper`
- **Description:** NextAuth-protected Storybook component documentation
- **Repository:** Link to your Git repository
- **Branch:** `main`
- **Build Pack:** Docker Compose
- **Docker Compose Location:** `storybook/auth-wrapper/docker-compose.yml`

### C. Domain Configuration

1. Go to **Domains** tab
2. Add domain: `components.ozean-licht.dev`
3. Enable **HTTPS** (Let's Encrypt automatic)
4. Save configuration

---

## Step 3: Configure Environment Variables

Navigate to **Environment Variables** tab and add:

### Required Variables

```env
# NextAuth Configuration
NEXTAUTH_URL=https://components.ozean-licht.dev
NEXTAUTH_SECRET=<generate-secure-32-char-secret>
AUTH_SECRET=<same-as-nextauth-secret>

# Database Configuration (PostgreSQL)
DATABASE_URL=postgresql://postgres:<password>@postgres:5432/shared-users-db
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DATABASE=shared-users-db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<your-postgres-password>

# Environment
NODE_ENV=production

# Port (internal)
STORYBOOK_AUTH_PORT=3002
```

### Generate Secure Secrets

On your server:
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

Copy the output and use it for both `NEXTAUTH_SECRET` and `AUTH_SECRET`.

---

## Step 4: Network Configuration

### Ensure Shared Network Exists

The auth wrapper needs to connect to PostgreSQL.

1. In Coolify, go to **Networks**
2. Verify `ozean-licht-network` exists (or create it)
3. Ensure PostgreSQL container is on this network
4. Ensure auth wrapper docker-compose uses this network (already configured)

---

## Step 5: Deploy Application

### A. Trigger Deployment

1. Go to **Deployments** tab
2. Click **Deploy**
3. Watch build logs for errors

### B. Monitor Build Process

Expected build stages:
```
1. Building Storybook static files...
2. Building Next.js wrapper...
3. Creating production runtime...
4. Container starting...
5. Health check passing...
```

Build time: ~3-5 minutes

### C. Verify Deployment

Check deployment logs for:
```
✓ Next.js production server started
✓ Listening on port 3002
✓ Database connection pool created
```

---

## Step 6: Test Authentication Flow

### A. Access Application

1. Open browser: https://components.ozean-licht.dev
2. Should redirect to: https://components.ozean-licht.dev/login

### B. Test Login

1. Use admin credentials from shared-users-db
2. Example: `super@ozean-licht.dev` + password
3. On success → redirects to `/storybook`
4. Storybook docs should load in iframe

### C. Verify Features

- [ ] Login page displays with Ozean Licht branding
- [ ] Valid credentials grant access
- [ ] Invalid credentials show error message
- [ ] Non-admin users are rejected
- [ ] Storybook documentation loads correctly
- [ ] Deep links work (e.g., `/storybook?path=/docs/admin-alert--default`)
- [ ] Logout button works
- [ ] Session persists across page reloads

---

## Step 7: SSL/HTTPS Verification

1. Check SSL certificate: Click padlock in browser
2. Should show: **Let's Encrypt** certificate
3. Valid for: `components.ozean-licht.dev`
4. Expires: ~90 days (auto-renewed by Coolify)

---

## Step 8: Health Monitoring

### A. Coolify Health Check

Coolify automatically monitors:
- **Endpoint:** `/api/auth/session`
- **Expected:** HTTP 200
- **Interval:** 30s
- **Retries:** 3

### B. Manual Health Check

```bash
# From server
curl -I https://components.ozean-licht.dev/api/auth/session

# Expected response:
# HTTP/2 200
```

---

## Step 9: Database Audit Logs (Optional)

### Verify Audit Logging

```bash
# SSH into server
ssh root@138.201.139.25

# Connect to database
psql -U postgres -d shared-users-db

# Check recent logins
SELECT
  action,
  metadata->>'email' as email,
  created_at
FROM audit_logs
WHERE action LIKE 'storybook.%'
ORDER BY created_at DESC
LIMIT 10;
```

Expected output:
```
       action        |         email         |         created_at
---------------------+-----------------------+----------------------------
 storybook.login.success | user@example.com | 2025-11-16 12:00:00.000000
```

---

## Troubleshooting

### Issue: "502 Bad Gateway"

**Cause:** Container not started or crashed
**Fix:**
1. Check Coolify logs: **Deployments** → Latest deployment → **Logs**
2. Look for errors in build or startup
3. Verify environment variables are set correctly
4. Restart deployment

### Issue: "Login fails with valid credentials"

**Cause:** Database connection issue
**Fix:**
```bash
# Check database connectivity
docker exec -it storybook-auth-wrapper node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT 1').then(() => console.log('✓ DB OK')).catch(e => console.error('✗ DB Error:', e));
"
```

### Issue: "Audit log errors"

**Cause:** `audit_logs` table doesn't exist
**Fix:**
```bash
# Create audit_logs table
psql -U postgres -d shared-users-db -c "
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
"
```

### Issue: "Storybook not loading in iframe"

**Cause:** Storybook static build missing
**Fix:**
```bash
# Verify build exists
ls -la /opt/ozean-licht-ecosystem/storybook/build/

# Rebuild if needed
cd /opt/ozean-licht-ecosystem
pnpm build-storybook
```

### Issue: "Session not persisting"

**Cause:** Cookie domain mismatch
**Fix:**
- Verify `NEXTAUTH_URL` matches actual domain
- Check browser allows cookies for `.ozean-licht.dev`
- Clear browser cookies and try again

---

## Rollback Procedure

If deployment fails:

1. Go to **Deployments** tab in Coolify
2. Find last successful deployment
3. Click **Redeploy** on that version
4. Wait for deployment to complete
5. Verify service is working

---

## Post-Deployment Tasks

- [ ] Add monitoring alerts in Grafana
- [ ] Document admin user creation process
- [ ] Share access instructions with team
- [ ] Schedule regular security audits
- [ ] Test backup/restore procedure

---

## Security Checklist

- [ ] HTTPS enabled and working
- [ ] Secure cookies configured (httpOnly, secure)
- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] PostgreSQL password is secure
- [ ] No secrets in Git repository
- [ ] Audit logging enabled and working
- [ ] Only admin users can access
- [ ] Session timeout configured (7 days)

---

## Maintenance

### Update Deployment

1. Make code changes locally
2. Push to Git repository
3. In Coolify: **Deployments** → **Deploy**
4. Monitor logs for successful deployment

### Restart Service

In Coolify: **Actions** → **Restart**

### View Logs

**Real-time logs:**
Coolify → **Logs** tab → Enable "Follow"

**Historical logs:**
Server: `docker logs storybook-auth-wrapper`

---

## Support

**Issues:** Check Coolify logs first
**Database:** Verify PostgreSQL connectivity
**Auth:** Check NextAuth session cookies
**Network:** Verify DNS and SSL certificate

**Documentation:**
- Auth wrapper README: `storybook/auth-wrapper/README.md`
- Coolify docs: https://coolify.io/docs
- NextAuth docs: https://authjs.dev

---

**Deployment Date:** {DATE}
**Deployed By:** {YOUR_NAME}
**Version:** 1.0.0
**Status:** ✅ Production Ready
