# shared/ui

> Four-tier React component library: Primitives → CossUI → Branded → Compositions (Tailwind v4, Radix)

## Quick Nav

**Entry:** `src/index.ts` | **Components:** `src/cossui/` | **Branded:** `src/branded/`

## If You Need To...

| Task | Start Here | Flow |
|------|------------|------|
| Use a component | `src/cossui/` | Find component → Import from `@shared/ui` → Check `.stories.tsx` for usage |
| Add base component | `src/cossui/` | Create `{name}.tsx` + `{name}.stories.tsx` → Export from `src/cossui/index.ts` |
| Add branded component | `src/branded/` | Create component → Add story → Export from `src/branded/index.ts` |
| Add composition | `src/compositions/` | Combine branded components → Export from index → Enable in `src/index.ts` |
| Check component visually | Storybook | `pnpm --filter storybook dev` → Browse localhost:6006 |
| Build library | `pnpm build` | Runs tsup → Output to `dist/` |
| Add utility | `src/utils/` | Add to folder → Export from `src/utils/index.ts` |

## Structure

```
src/
├── cossui/              # Tier 1: Base components (~50)
│   ├── button.tsx       # Button, Input, Dialog, Card, Badge...
│   ├── *.stories.tsx    # Comprehensive Storybook coverage
│   └── index.ts         # All exports
├── ui/                  # ShadCN extras (16)
│   ├── calendar.tsx     # Calendar, Carousel, Chart
│   ├── command.tsx      # Command palette
│   └── navigation-menu.tsx
├── branded/             # Tier 2: Ozean Licht branded (~20)
│   ├── course-card.tsx  # Course display variants
│   ├── logo.tsx         # Brand logos
│   ├── light-rays.tsx   # Signature WebGL animation
│   ├── layout/          # Layout components
│   └── forms/           # Form compositions
├── compositions/        # Tier 3: Page sections (DISABLED)
│   ├── hero.tsx         # Hero sections
│   ├── footer.tsx       # Footer, FooterNav, LegalNav
│   └── cta-*.tsx        # Call-to-action variants
├── storage/             # File management (14)
│   ├── file-browser.tsx # Main browser component
│   ├── file-dropzone.tsx
│   └── share-dialog.tsx
├── magicui/             # Animation components
│   └── animated-gradient-text.tsx
├── hooks/               # use-toast
├── utils/               # cn() class merging
├── types/               # TypeScript definitions
├── styles/              # globals.css
└── index.ts             # Main barrel export
```

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `src/index.ts` | Main export barrel - tiers 0-2 + storage + utils + hooks | ●●● |
| `src/cossui/index.ts` | 50+ base components: Button, Input, Dialog, Card, Form, Table, etc. | ●●● |
| `src/utils/cn.ts` | `cn()` - merges Tailwind classes (clsx + tailwind-merge) | ●●● |
| `package.json` | Export paths: `@shared/ui`, `@shared/ui/compositions`, `/styles` | ●●● |
| `src/branded/index.ts` | 20 branded: CourseCard, Logo, LightRays, InfoCard, SpanBadge | ●● |
| `src/storage/index.ts` | 14 storage: FileBrowser, FileDropzone, ShareDialog, BucketSelector | ●● |
| `tsup.config.ts` | Build config - generates dist/ with ESM + CJS | ●● |

## Component Tiers

| Tier | Location | Count | Examples |
|------|----------|-------|----------|
| 0 | `primitives/` | 0 | Custom minimal (empty) |
| 1 | `cossui/` | ~50 | Button, Input, Dialog, Card, Badge, Form, Table, Tabs |
| 1 | `ui/` | ~16 | Calendar, Carousel, Chart, Command, NavigationMenu |
| 2 | `branded/` | ~20 | CourseCard, Logo, LightRays, FaqItem, NavButton |
| 3 | `compositions/` | ~12 | Hero, Footer, CTA, Testimonials (disabled) |
| - | `storage/` | ~14 | FileBrowser, FileDropzone, ShareDialog |

## Usage

```tsx
// Import components
import { Button, Card, Badge, Input, Dialog } from '@shared/ui'
import { CourseCard, Logo, LightRays } from '@shared/ui'
import { FileBrowser, FileDropzone } from '@shared/ui'

// Import styles (required in app root)
import '@shared/ui/styles/globals.css'
```

## Build

```bash
pnpm build          # Build to dist/
pnpm dev            # Watch mode
pnpm typecheck      # Type checking
pnpm clean          # Remove dist/
```

## Needs Deeper Mapping

- [ ] `src/cossui/` — 50+ components with comprehensive Storybook stories
- [ ] `src/branded/` — 20 Ozean Licht styled components
- [ ] `src/storage/` — 14 file management components

---

*Mapped: 2025-11-26 | Priority: high | Files: 100+ components*
