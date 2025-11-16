# Storybook Auth Cleanup Checklist

## Files to DELETE (if using BasicAuth Option 1)

### 1. Auth Wrapper Directory (ENTIRE DIRECTORY)
```bash
rm -rf storybook/auth-wrapper/
```

**Contains:**
- Next.js application
- NextAuth configuration
- PostgreSQL connection pool
- Login pages and components
- Middleware
- Docker configs
- 368 node_modules folders
- ~230KB package-lock.json

**Why delete:** Unnecessary complexity. BasicAuth via Traefik handles authentication without application code.

---

### 2. Related Documentation (Optional Cleanup)
```bash
rm storybook/protecting-storybook.md  # Outdated approach
```

**Why:** This document describes the complex approach we're abandoning.

---

## Files to UPDATE

### 1. storybook/docker-compose.yml
**Action:** Add BasicAuth middleware labels

**Before (current - no auth):**
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.storybook.rule=Host(`storybook.ozean-licht.dev`)"
  - "traefik.http.routers.storybook.entrypoints=https"
  - "traefik.http.routers.storybook.tls=true"
  - "traefik.http.routers.storybook.tls.certresolver=letsencrypt"
  - "traefik.http.services.storybook.loadbalancer.server.port=6006"
```

**After (with BasicAuth):**
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.docker.network=coolify"

  # HTTP Router (redirect to HTTPS)
  - "traefik.http.routers.storybook-http.rule=Host(`storybook.ozean-licht.dev`)"
  - "traefik.http.routers.storybook-http.entrypoints=http"
  - "traefik.http.routers.storybook-http.middlewares=https-redirect"

  # HTTPS Router with BasicAuth
  - "traefik.http.routers.storybook.rule=Host(`storybook.ozean-licht.dev`)"
  - "traefik.http.routers.storybook.entrypoints=https"
  - "traefik.http.routers.storybook.tls=true"
  - "traefik.http.routers.storybook.tls.certresolver=letsencrypt"
  - "traefik.http.routers.storybook.middlewares=storybook-auth"

  # BasicAuth Middleware
  # User: admin | Password: <set-your-password>
  - "traefik.http.middlewares.storybook-auth.basicauth.users=admin:$$2y$$05$$REPLACE_WITH_GENERATED_HASH"

  # HTTPS Redirect Middleware
  - "traefik.http.middlewares.https-redirect.redirectscheme.scheme=https"
  - "traefik.http.middlewares.https-redirect.redirectscheme.permanent=true"

  # Service
  - "traefik.http.services.storybook.loadbalancer.server.port=6006"

  # Metadata
  - "com.ozean-licht.app=storybook"
  - "com.ozean-licht.project=ozean-licht-ecosystem"
  - "com.ozean-licht.tier=documentation"
```

**Generate password hash:**
```bash
# Replace "YourPasswordHere" with actual password
docker run --rm httpd:2.4-alpine htpasswd -nbB admin "YourPasswordHere"

# Output will be: admin:$2y$05$...hash...
# Copy the hash part (after "admin:") and paste into docker-compose.yml
# Remember to escape $ as $$
```

---

### 2. storybook/README.md
**Action:** Update deployment section to reflect BasicAuth approach

**Add section:**
```markdown
## Authentication

Storybook is protected with HTTP BasicAuth via Traefik middleware.

**Credentials:**
- Username: `admin`
- Password: (ask team lead)

**To change password:**
```bash
# Generate new hash
docker run --rm httpd:2.4-alpine htpasswd -nbB admin "NewPassword"

# Update storybook/docker-compose.yml
# Find the basicauth.users label and replace hash
# Redeploy: docker-compose up -d
```

**Access:** https://storybook.ozean-licht.dev
- Browser will prompt for username/password on first visit
- Credentials cached by browser for future visits
```

---

### 3. .gitignore (Check if auth-wrapper should be explicitly ignored)
**Action:** Remove auth-wrapper ignore rules if any exist

**Check:**
```bash
grep -r "auth-wrapper" .gitignore
```

**If found:** Remove those lines (since directory is deleted)

---

## Coolify Dashboard Changes

### 1. Remove "components" Deployment
**Location:** Coolify Dashboard → Resources → Applications

**What to delete:**
- Application name: `components` or `storybook-auth-wrapper` or similar
- Domain: `components.ozean-licht.dev`

**How:**
1. Go to Coolify dashboard
2. Find the auth-wrapper deployment
3. Stop the application
4. Delete the resource

---

### 2. Update "storybook" Deployment
**Location:** Coolify Dashboard → Resources → Applications → storybook

**What to verify:**
- Domain: `storybook.ozean-licht.dev` ✅
- Build command: `npm install && npm run build-storybook` ✅
- Port: `6006` ✅
- Traefik labels: Should auto-sync from docker-compose.yml ✅

---

## Files to KEEP

### Storybook Core
```bash
storybook/
├── build/              # ✅ Static build output
├── config/             # ✅ Storybook configuration
│   ├── main.ts         # ✅ Main config
│   ├── preview.ts      # ✅ Preview settings
│   └── docs/           # ✅ MDX documentation
├── docker/             # ✅ Docker build
│   ├── Dockerfile      # ✅ Multi-stage build
│   └── .dockerignore   # ✅ Build optimization
├── docs/               # ✅ Documentation
├── mocks/              # ✅ Next.js mocks for stories
├── templates/          # ✅ Story templates
├── ai-mvp/             # ✅ Future AI features
├── docker-compose.yml  # 🔧 UPDATE with BasicAuth
├── README.md           # 🔧 UPDATE deployment docs
├── package.json        # ✅ Dependencies
├── postcss.config.js   # ✅ Styling
└── tailwind.config.js  # ✅ Styling
```

### Root Files
```bash
.claude/
├── CLAUDE.md           # ✅ AI instructions (update if needed)
└── commands/           # ✅ Keep all commands

CONTEXT_MAP.md          # 🔧 UPDATE if auth-wrapper mentioned
README.md               # ✅ Keep
package.json            # ✅ Keep
```

---

## Verification Steps

After cleanup, verify:

### 1. Directory Structure
```bash
# Should NOT exist
ls storybook/auth-wrapper/
# Expected: No such file or directory

# Should exist
ls storybook/build/
# Expected: index.html, static files, etc.
```

### 2. Git Status
```bash
git status
# Expected:
# deleted: storybook/auth-wrapper/
# modified: storybook/docker-compose.yml
# modified: storybook/README.md
```

### 3. Docker Containers
```bash
docker ps | grep storybook
# Expected: Only ONE container (ozean-licht-storybook)
# NOT expected: auth-wrapper container
```

### 4. Access Test
```bash
curl -I https://storybook.ozean-licht.dev
# Expected: 401 Unauthorized (because no auth provided)

curl -u admin:YourPassword https://storybook.ozean-licht.dev
# Expected: 200 OK with HTML content
```

---

## Size Savings

**Before (with auth-wrapper):**
- 2 Docker containers
- ~370MB node_modules (auth-wrapper)
- ~230KB package-lock.json
- Full Next.js build (~50MB)
- **Total:** ~420MB + complexity

**After (BasicAuth only):**
- 1 Docker container
- 0 auth-wrapper overhead
- **Total:** Storybook build only (~7MB)

**Savings:** ~413MB + massive reduction in complexity

---

## Rollback Plan

If BasicAuth doesn't work out:

### Option A: Restore Auth Wrapper
```bash
git checkout HEAD~1 storybook/auth-wrapper/
git checkout HEAD~1 storybook/docker-compose.yml
docker-compose up -d
```

### Option B: Go to ForwardAuth (Option 2)
See `SIMPLE_AUTH_PLAN.md` → Option 2 for implementation.

---

## Timeline

**Deletion:** 2 minutes
**docker-compose.yml update:** 5 minutes (including password generation)
**README.md update:** 3 minutes
**Coolify cleanup:** 2 minutes
**Testing:** 2 minutes

**Total:** ~15 minutes

---

## Commit Message

```
simplify(storybook): replace auth-wrapper with Traefik BasicAuth

Removes unnecessary complexity:
- Delete auth-wrapper (Next.js + NextAuth + PostgreSQL)
- Add Traefik BasicAuth middleware to docker-compose.yml
- Single deployment vs two separate containers
- Fixes MIME type errors from proxy routing

Authentication now handled at reverse proxy level.
Simple, fast, maintainable.

Credentials:
- Username: admin
- Password: <set in docker-compose.yml>

To change password:
docker run --rm httpd:2.4-alpine htpasswd -nbB admin "NewPassword"

Closes: Storybook auth complexity
Fixes: MIME type errors in /storybook-content/

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Post-Cleanup

Return to main task:
- Continue building admin dashboard ✅
- Storybook accessible at https://storybook.ozean-licht.dev with simple login ✅
- Team can view components, no complex debugging needed ✅
