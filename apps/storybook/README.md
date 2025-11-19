# Ozean Licht Design System - Storybook

**Component documentation for the Ozean Licht ecosystem.**

Version: 1.0.0 (Fresh Setup - November 2025)

---

## Overview

This Storybook showcases all UI components from the `@shared/ui` package, providing:
- Interactive component demos
- Props documentation
- Accessibility testing
- Design token reference
- Usage examples

**Design System:** Oceanic cyan (#0ec2bc), deep ocean dark theme, glass morphism effects

---

## Quick Start

### Development Server

```bash
# From repository root
pnpm --filter storybook dev

# Or from this directory
pnpm dev
```

Visit: http://localhost:6006

### Build Static Site

```bash
# From repository root
pnpm --filter storybook build

# Or from this directory
pnpm build
```

Output: `dist/` (ready for deployment)

---

## Architecture

### Stories Location

Stories live **with their components** in `shared/ui/src/ui/`:
```
shared/ui/src/ui/
├── button.tsx
├── button.stories.tsx   ← Story for button
├── card.tsx
├── card.stories.tsx     ← Story for card
└── ...
```

### Storybook Configuration

```
apps/storybook/
├── .storybook/
│   ├── main.ts         # Imports stories from @shared/ui
│   ├── preview.tsx     # Global config, backgrounds, controls
│   └── manager.ts      # Ozean Licht branding
├── dist/               # Build output
└── package.json        # Minimal dependencies
```

### Dependencies

- **Runtime:** `@shared/ui` (workspace dependency)
- **Dev:** Storybook 8.6.14 + Vite + React

**Total:** ~40MB node_modules (vs 226MB in old setup)

---

## Deployment

### Option A: Cloudflare Pages (Recommended)

**Why Cloudflare Pages:**
- Free hosting (unlimited bandwidth)
- Global CDN (faster than single server)
- Automatic SSL/HTTPS
- No containers, no health checks
- Password protection for internal use

**Setup:**
```bash
# Install Wrangler
pnpm add -g wrangler

# Login
wrangler login

# Deploy
pnpm build
wrangler pages deploy dist --project-name=ozean-licht-storybook
```

**Result:** https://ozean-licht-storybook.pages.dev

**Access Control:**
1. Go to Cloudflare Dashboard → Pages
2. Select project → Settings → Access
3. Enable Cloudflare Access
4. Add policy (email domain or password)

### Option B: Static Hosting

Deploy `dist/` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static host

### Option C: Self-Hosted (Not Recommended)

Use nginx/serve to host the `dist/` folder.

---

## Component Coverage

**50+ shadcn/ui components** with Ozean Licht theming:

- **Inputs:** Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider
- **Layout:** Card, Separator, Tabs, Accordion, Collapsible
- **Navigation:** Navigation Menu, Breadcrumb, Pagination
- **Overlays:** Dialog, Drawer, Sheet, Popover, Tooltip, Hover Card
- **Feedback:** Alert, Toast, Sonner, Progress, Skeleton
- **Data:** Table, Calendar, Chart, Form
- **Advanced:** Command, Context Menu, Dropdown Menu, Menubar

All components include:
- Interactive demos
- Props table
- Accessibility tests (WCAG AA)
- Multiple variants
- Usage examples

---

## Design System Reference

### Colors

```typescript
Primary: '#0ec2bc'        // Oceanic cyan
Background: '#00070F'     // Deep ocean dark
Card: '#00111A'           // Card background
Border: '#0E282E'         // Borders
Text: '#C4C8D4'           // Paragraphs
Heading: '#FFFFFF'        // Headings
```

### Typography

- **Decorative:** Cinzel Decorative (H1, H2 only)
- **Sans:** Montserrat (body, UI)
- **Alt:** Montserrat Alternates (labels)
- **Mono:** Fira Code (code)

### Effects

- Glass morphism (backdrop-filter: blur)
- Glow effects (box-shadow with primary color)
- Animations (glow, float, shine)

---

## Troubleshooting

### Stories Not Appearing

Check that stories are in `shared/ui/src/**/*.stories.tsx`:
```bash
ls -la ../../shared/ui/src/ui/*.stories.tsx
```

### Import Errors

Ensure `@shared/ui` is built:
```bash
pnpm --filter @shared/ui build
```

### Style Issues

Verify `globals.css` is imported in `.storybook/preview.tsx`:
```typescript
import '@shared/ui/styles/globals.css';
```

### Port Already in Use

Change port in `package.json`:
```json
"dev": "storybook dev -p 6007"
```

---

## Comparison: Old vs New

| Aspect | Old (shared/ui) | New (apps/storybook) |
|--------|----------------|---------------------|
| Location | `shared/ui/.storybook/` | `apps/storybook/` |
| Dependencies | 53 packages | 14 packages |
| node_modules | 226MB | ~40MB |
| Deployment | Coolify + Docker | Cloudflare Pages |
| Health Checks | Required (failing) | Not needed |
| Cost | Server resources | $0/month |

---

## Contributing

1. Add component to `shared/ui/src/ui/`
2. Create `.stories.tsx` file next to component
3. Stories automatically appear in Storybook
4. Test locally: `pnpm --filter storybook dev`
5. Deploy: `pnpm --filter storybook build`

---

## Links

- **Design System Docs:** `/design-system.md`
- **Component Library:** `@shared/ui` package
- **Live Storybook:** (Add URL after deployment)
- **Repository:** https://github.com/ozean-licht/ozean-licht

---

**Maintained by:** Ozean Licht Platform Team + AI Agents
**Status:** Production-ready (Internal use only)
