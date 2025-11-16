# Storybook Simple Authentication Plan

## Problem Summary

Current setup has unnecessary complexity causing MIME type errors:
- Two separate deployments (storybook + auth-wrapper)
- Auth wrapper with full Next.js + NextAuth stack
- Trying to proxy to `/storybook-content/` but no route handler exists
- JavaScript requests get HTML login page responses → MIME type errors

## Root Cause

The auth-wrapper's `StorybookViewer.tsx` sets iframe URL to `/storybook-content/` in production, but there's no Next.js route handler to serve Storybook static files from that path. When browser requests `/storybook-content/vendor-J12O2Y-F.js`, middleware redirects to login, returning HTML instead of JavaScript.

## Three Simple Solutions

### Option 1: HTTP BasicAuth via Traefik (SIMPLEST) ⭐ RECOMMENDED

**Pros:**
- ✅ Zero application code needed
- ✅ One deployment (just Storybook)
- ✅ Built-in Traefik feature
- ✅ Works immediately
- ✅ Can generate users from shared-users-db via script

**Cons:**
- ❌ Browser password prompt (not SSO-like experience)
- ❌ No granular permissions (all admins have same access)
- ❌ Password shared among team

**Implementation:**
```yaml
# storybook/docker-compose.yml
labels:
  - "traefik.http.routers.storybook.middlewares=storybook-auth"
  - "traefik.http.middlewares.storybook-auth.basicauth.users=admin:$$2y$$05$$hash..."
```

**To generate password hash:**
```bash
docker run --rm httpd:2.4-alpine htpasswd -nbB admin "YourPassword"
```

**For multiple users from shared-users-db:**
```bash
# Run this script to generate htpasswd string from active admin users
psql -h localhost -p 32771 -U postgres -d shared-users-db -t -c \
  "SELECT email FROM users u JOIN admin_users au ON u.id = au.user_id WHERE au.is_active = true" \
  | xargs -I {} bash -c 'echo -n "{}:" && docker run --rm httpd:2.4-alpine htpasswd -nbB {} "shared-password" | cut -d: -f2'
```

**Effort:** 5 minutes
**Maintainability:** Very simple, just update Traefik labels

---

### Option 2: Traefik ForwardAuth to Simple Auth API

**Pros:**
- ✅ Validates against shared-users-db
- ✅ One password per user (email + their DB password)
- ✅ Moderate complexity
- ✅ Session cookies (better UX than BasicAuth)

**Cons:**
- ❌ Need to build simple auth service
- ❌ Two deployments (Storybook + auth-api)
- ❌ More complex than BasicAuth

**Implementation:**
```yaml
# Traefik ForwardAuth middleware
labels:
  - "traefik.http.routers.storybook.middlewares=storybook-forwardauth"
  - "traefik.http.middlewares.storybook-forwardauth.forwardauth.address=http://auth-api:3000/verify"
  - "traefik.http.middlewares.storybook-forwardauth.forwardauth.authResponseHeaders=X-Auth-User"
```

**Auth API (simple Express app):**
```typescript
// auth-api/index.ts
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  // Verify against shared-users-db
  const user = await verifyCredentials(email, password)
  if (user && user.isAdmin) {
    const token = jwt.sign({ email }, SECRET, { expiresIn: '7d' })
    res.cookie('auth-token', token, { httpOnly: true })
    res.redirect('/storybook')
  }
})

app.get('/verify', (req, res) => {
  const token = req.cookies['auth-token']
  if (jwt.verify(token, SECRET)) {
    res.status(200).send('OK')
  } else {
    res.status(401).send('Unauthorized')
  }
})
```

**Effort:** 2-3 hours
**Maintainability:** Moderate, need to maintain auth API

---

### Option 3: Fix Current Auth Wrapper (NOT RECOMMENDED)

**What's missing:** Add Next.js rewrites or API routes to actually serve Storybook static files.

**Why not recommended:**
- 🚫 Still overly complex (full Next.js app just to serve static files)
- 🚫 Future AI features need to live IN Storybook anyway (not in wrapper)
- 🚫 Two deployments still needed
- 🚫 High maintenance burden

**If you insist on fixing it:**

1. **Add Next.js rewrites:**
```javascript
// storybook/auth-wrapper/next.config.js
async rewrites() {
  return [
    {
      source: '/storybook-content/:path*',
      destination: 'http://ozean-licht-storybook:6006/:path*', // Internal container name
    },
  ]
}
```

2. **Or create API route:**
```typescript
// app/api/storybook-proxy/[...path]/route.ts
export async function GET(request: Request, { params }: { params: { path: string[] } }) {
  const storybookUrl = process.env.STORYBOOK_INTERNAL_URL || 'http://ozean-licht-storybook:6006'
  const path = params.path?.join('/') || ''
  const response = await fetch(`${storybookUrl}/${path}`)
  return response
}
```

**Effort:** 1-2 hours
**Maintainability:** Complex, not worth it

---

## Recommended Approach: Option 1 (BasicAuth)

### Why This Makes Sense

1. **Immediate Solution**: 5 minutes vs full day of debugging
2. **Proven Pattern**: Many teams use BasicAuth for internal tools
3. **AI Features Later**: When you add AI/commenting to Storybook:
   - Build those features INTO Storybook (as addons)
   - They'll have their own auth flow (API tokens from shared-users-db)
   - The BasicAuth just becomes "gate to enter", real features have real auth

### Migration Path

**Phase 1 (Now):**
- Use BasicAuth via Traefik
- One shared password for dev team
- Delete auth-wrapper entirely

**Phase 2 (When AI features are ready):**
- Build Storybook addon for AI/comments
- Addon connects to your backend API
- API validates tokens against shared-users-db
- BasicAuth remains as lightweight gate

**Phase 3 (Optional, if needed):**
- Replace BasicAuth with ForwardAuth (Option 2)
- Only if you need per-user access control
- By then, you'll know exactly what's needed

---

## What to Delete

If going with Option 1 (BasicAuth):

### Delete Completely:
```bash
rm -rf storybook/auth-wrapper/
```

### Update Files:
```bash
# storybook/docker-compose.yml - Add BasicAuth labels (see Option 1)
# Remove all auth-wrapper references from Coolify dashboard
```

### Keep:
```bash
storybook/
├── build/              # Storybook static build
├── config/             # Storybook configuration
├── docker/             # Dockerfile for Storybook
├── docker-compose.yml  # Update with BasicAuth (see Option 1)
└── README.md           # Update deployment instructions
```

---

## Implementation Steps (Option 1)

### 1. Update docker-compose.yml
```bash
# Add BasicAuth middleware labels
git checkout 2d031c6 -- storybook/docker-compose.yml
# This restores the working BasicAuth configuration
```

### 2. Generate Password
```bash
# Replace "your-password-here" with actual password
docker run --rm httpd:2.4-alpine htpasswd -nbB admin "your-password-here"
# Copy output and update docker-compose.yml label
```

### 3. Deploy
```bash
cd storybook
docker-compose up -d
```

### 4. Test
```bash
# Visit https://storybook.ozean-licht.dev
# Browser will prompt for username/password
# Username: admin
# Password: <what you set>
```

### 5. Cleanup
```bash
# Delete auth-wrapper deployment in Coolify
# Delete auth-wrapper directory
rm -rf storybook/auth-wrapper/
git add storybook/
git commit -m "simplify: use Traefik BasicAuth for Storybook"
```

---

## Cost-Benefit Analysis

| Approach | Setup Time | Maintenance | Complexity | Matches Requirements |
|----------|------------|-------------|------------|---------------------|
| **Option 1: BasicAuth** | 5 min | Trivial | Very Low | Partial (simple auth) |
| **Option 2: ForwardAuth** | 2-3 hrs | Medium | Medium | Full (DB validation) |
| **Option 3: Fix Wrapper** | 1-2 hrs | High | High | Full (but overkill) |

**Verdict:** Start with Option 1, upgrade to Option 2 only if per-user auth is truly needed.

---

## Future AI Features: How They'll Work

When you add AI features to Storybook:

1. **Build as Storybook Addon:**
   - `storybook/ai-mvp/` already exists
   - Create addon that shows in Storybook sidebar
   - Addon UI for comments, AI suggestions, etc.

2. **Authentication Flow:**
   - User enters Storybook (via BasicAuth gate)
   - Addon loads, shows "Connect to AI" button
   - User enters their shared-users-db email/password
   - Addon gets JWT token from your API
   - Token stored in localStorage, used for all AI requests

3. **Why This Works:**
   - BasicAuth is just "gate to enter building"
   - AI addon is "room inside building with its own lock"
   - Each has appropriate level of security

**Example Addon Code:**
```typescript
// storybook/ai-mvp/addon/AIPanel.tsx
function AIPanel() {
  const [token, setToken] = useState(localStorage.getItem('ai-token'))

  if (!token) {
    return <LoginForm onLogin={(t) => setToken(t)} />
  }

  return <AIFeatures token={token} />
}
```

This keeps auth simple at the gate, sophisticated where it matters.

---

## Decision

**Choose Option 1 (BasicAuth)** unless you have a specific requirement that mandates per-user authentication at the Storybook entry level.

**Next Steps:**
1. Review this plan
2. Confirm Option 1 is acceptable
3. Execute implementation steps (5 minutes)
4. Delete auth-wrapper
5. Return to building admin dashboard
