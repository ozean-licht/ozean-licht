# Ozean Licht Component Documentation

Component documentation and design system gallery built with Storybook.

## Overview

This Storybook instance serves as the living documentation for all Ozean Licht UI components across the ecosystem:
- Admin Dashboard components
- Ozean Licht platform components
- Shared UI library components

**Access:** https://storybook.ozean-licht.dev (public, no authentication required)

## Development

### Local Development

```bash
# From repository root
pnpm storybook

# Or from this directory
pnpm dev
```

The development server will start at http://localhost:6006

### Building

```bash
# From repository root
pnpm build-storybook

# Or from this directory
pnpm build
```

Build output goes to `storybook-static/` directory.

## Deployment

### Production Deployment

The Storybook is automatically deployed to Coolify when changes are pushed to the `main` branch.

**Deployment Configuration:**
- **Location:** `apps/storybook/docker-compose.yml`
- **Domain:** https://storybook.ozean-licht.dev
- **Port:** 6006
- **Authentication:** None (public access)

### Manual Deployment

```bash
cd apps/storybook
docker-compose build
docker-compose up -d
```

## Project Structure

```
apps/storybook/
├── .storybook/          # Storybook configuration
│   ├── main.ts          # Main config (stories, addons, Vite)
│   ├── preview.ts       # Preview config (decorators, parameters)
│   └── manager.ts       # Manager config (UI customization)
├── storybook-static/    # Built output (gitignored)
├── ai-mvp/              # AI-powered iteration features
├── docs/                # Documentation pages
├── mocks/               # Next.js mocks for compatibility
├── templates/           # Story templates
├── Dockerfile           # Production Docker image
├── docker-compose.yml   # Coolify deployment config
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS/Tailwind config
└── tailwind.config.js   # Tailwind config
```

## Component Stories

Stories are located in component directories across the monorepo:

```
apps/admin/components/**/*.stories.tsx
apps/ozean-licht/components/**/*.stories.tsx
shared/ui/src/**/*.stories.tsx
```

## Configuration

### Storybook Configuration

- **Framework:** React + Vite
- **Version:** 8.6.14
- **Addons:**
  - Essentials (docs, controls, actions, viewport, backgrounds, etc.)
  - Interactions (play functions, testing)
  - Accessibility (a11y)

### Build Configuration

The build is optimized for production with:
- Terser minification
- Deterministic chunk splitting
- Pre-bundled React dependencies
- Gzip compression
- No source maps (smaller bundle)

### Styling

- **CSS Framework:** Tailwind CSS
- **PostCSS:** Enabled
- **Fonts:** Cinzel Decorative + Montserrat (Google Fonts)
- **Theme:** Ozean Licht cosmic dark design system

## Next.js Compatibility

Storybook includes mocks for Next.js modules to allow stories for Next.js components:
- `next/link` → Custom Link mock
- `next/image` → Custom Image mock
- `next/navigation` → Router mock
- `next/server` → Server components mock

## AI Features (Development Only)

The AI MVP features are available in development mode:
- Component iteration suggestions
- Design feedback
- Code improvements

**Note:** AI features are disabled in production builds.

## Authentication

**Public Access:** This Storybook is publicly accessible without authentication. Component documentation is not considered sensitive and serves as a public design system reference.

**Future Plans:** When AI commenting/collaboration features are added, those will require authentication via shared-users-db.

## Troubleshooting

### Build Fails

1. **Clear cache and rebuild:**
   ```bash
   rm -rf node_modules apps/storybook/storybook-static
   pnpm install
   pnpm build-storybook
   ```

2. **Check story paths:** Ensure component stories exist at the configured paths

3. **Verify dependencies:** Run `pnpm install --frozen-lockfile`

### Port Already in Use

```bash
# Kill process on port 6006
lsof -ti:6006 | xargs kill -9
```

### Docker Build Issues

```bash
# Rebuild without cache
docker-compose build --no-cache

# Check logs
docker logs ozean-licht-storybook
```

## Authentication

### Overview

Storybook includes optional authentication powered by NextAuth.js and shared_users_db. Authentication enables enhanced features while maintaining public access by default.

**Public Access (Default):**
- View all components
- Read documentation
- Test component variations

**Authenticated Access (Enhanced):**
- Comment on components (future)
- AI chat assistance (future)
- Save preferences (future)
- Bookmark components (future)

### Configuration

**1. Environment Variables**

Copy `.env.example` to `.env.local`:

```bash
cd apps/storybook
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Shared Users Database (required)
SHARED_USERS_DB_URL=postgresql://postgres:password@host:5432/shared_users_db

# NextAuth Secret (generate with: openssl rand -base64 48)
AUTH_SECRET=your-secret-here
NEXTAUTH_SECRET=your-secret-here

# Production URL
NEXTAUTH_URL=https://storybook.ozean-licht.dev
```

**2. Generate Secret**

```bash
openssl rand -base64 48
```

### Usage

**Sign In:**
1. Click "Sign In" button in Storybook toolbar (top-right)
2. Enter your Ozean Licht credentials
3. User menu appears after successful authentication

**Sign Out:**
1. Click on your user menu (top-right)
2. Click "Sign Out"

**Access Requirements:**
- Must have account in `shared_users_db`
- Must have `OZEAN_LICHT` or `ADMIN` entity access
- Account must be active

### Architecture

**Authentication Flow:**
```
Browser → Login Modal → NextAuth API (/api/auth/signin)
  → shared_users_db (users + user_entities)
  → Password Verification (bcrypt)
  → JWT Session Token → SessionProvider → User Menu
```

**Key Components:**
- `lib/auth/config.ts` - NextAuth.js configuration
- `lib/db/auth-pool.ts` - Direct PostgreSQL connection
- `components/auth/LoginModal.tsx` - Login UI
- `components/auth/UserMenu.tsx` - User menu dropdown
- `.storybook/addons/auth-toolbar.tsx` - Toolbar integration

**Security Features:**
- Bcrypt password hashing
- HTTPS-only cookies in production
- CSRF protection (NextAuth default)
- JWT session tokens
- Direct database connection (5-10ms latency)

### Development

**Start with Authentication:**

```bash
# Set environment variables in .env.local
pnpm storybook
# Navigate to http://localhost:6006
```

**Test Authentication Flow:**
1. Ensure `shared_users_db` is accessible
2. Create test user (see admin dashboard scripts)
3. Test login/logout cycle
4. Verify session persists on refresh

### Deployment

**Coolify Configuration:**

Add these environment variables in Coolify:
- `SHARED_USERS_DB_URL` - Database connection string
- `AUTH_SECRET` - Generated secret (same as local)
- `NEXTAUTH_URL` - `https://storybook.ozean-licht.dev`
- `NODE_ENV` - `production`

**Cookie Domain:**
- Production: `.ozean-licht.dev` (allows subdomains)
- Secure flag: `true` (HTTPS only)
- SameSite: `lax`

### Troubleshooting

**"Database connection failed"**
- Verify `SHARED_USERS_DB_URL` is correct
- Test: `psql $SHARED_USERS_DB_URL -c "SELECT 1"`

**"Invalid credentials"**
- Check user exists in `users` table
- Verify password hash in database
- Ensure user has active `user_entities` record

**"Session not persisting"**
- Check cookie domain: `.ozean-licht.dev` in production
- Verify `AUTH_SECRET` is set
- Clear browser cookies and retry

**"NextAuth API routes not found"**
- Ensure file structure: `app/api/auth/[...nextauth]/route.ts`
- Check build output for API routes

## Contributing

### Adding New Stories

1. Create a `.stories.tsx` file next to your component
2. Use Component Story Format (CSF 3.0)
3. Add interactive controls and documentation
4. Test with `pnpm storybook`

Example:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};
```

### Using Authentication in Stories

```tsx
import { useSession } from '@/lib/auth/session-provider';

export const AuthenticatedFeature: Story = {
  render: () => {
    const { data: session, status } = useSession();

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'unauthenticated') return <div>Please sign in</div>;

    return <div>Welcome, {session?.user?.email}!</div>;
  },
};
```

### Design System Guidelines

Follow the Ozean Licht design system:
- **Primary Color:** Oceanic Cyan (#0EA6C1)
- **Background:** Cosmic dark (#00070F)
- **Typography:** Cinzel Decorative (headings) + Montserrat (body)
- **Effects:** Glass morphism, subtle gradients

## Links

- **Production:** https://storybook.ozean-licht.dev
- **Storybook Docs:** https://storybook.js.org/docs
- **Component Story Format:** https://storybook.js.org/docs/api/csf

## Support

For issues or questions:
- Check the troubleshooting section above
- Review Storybook logs: `docker logs ozean-licht-storybook`
- Consult team documentation in `/docs`
