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

### Design System Guidelines

Follow the Ozean Licht design system:
- **Primary Color:** Turquoise (#0ec2bc)
- **Background:** Cosmic dark (#0A0F1A)
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
