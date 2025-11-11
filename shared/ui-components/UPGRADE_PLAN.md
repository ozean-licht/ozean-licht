# Shared UI Components - Master Roadmap

**Version:** 2.0.0
**Last Updated:** 2025-11-11
**Current Phase:** Phase 3 Ready
**Status:** Phases 1-2 Complete ✅

---

## Executive Summary

Master plan for upgrading `/shared/ui-components` with a **three-tier component architecture**:

1. **Tier 1 - Base Layer**: 47 shadcn/ui primitives + 11 Catalyst layouts ✅
2. **Tier 2 - Brand Layer**: Ozean Licht branded components (In Progress)
3. **Tier 3 - Context Layer**: Application-specific compositions (Planned)

**Goal**: Create a unified component library serving both Ozean Licht AND Kids Ascension with proper branding separation.

---

## Completed Work (Phases 1-2)

### Phase 1: Catalyst Integration ✅ COMPLETE

**Date:** 2025-11-11
**Duration:** ~3 hours
**Investment:** $250 (Catalyst UI Kit)

**What Was Built:**
- ✅ 11 Premium Catalyst components with Ozean Licht branding
- ✅ Complete dashboard layouts (SidebarLayout, StackedLayout, AuthLayout)
- ✅ Navigation components (Navbar, Sidebar) with glass effects
- ✅ Advanced components (Table with striping, Combobox autocomplete)
- ✅ Typography components (Heading, Text)
- ✅ Button with turquoise color variants

**Technical Details:**
```typescript
// Catalyst components use Headless UI (not Radix)
import { SidebarLayout } from '@ozean-licht/shared-ui/catalyst/layouts'
import { Navbar, Sidebar, Button } from '@ozean-licht/shared-ui/catalyst/navigation'
import { Table } from '@ozean-licht/shared-ui/catalyst/data'
import { Combobox } from '@ozean-licht/shared-ui/catalyst/forms'
import { Heading, Text } from '@ozean-licht/shared-ui/catalyst/typography'
```

**Branding Applied:**
- Primary color: `#0ec2bc` (turquoise)
- Glass effects: `glass-card-strong + backdrop-blur-lg`
- Borders: `border-primary/20`
- Current indicators: `bg-primary + glow-subtle`
- Hover states: `bg-primary/10`

**Dependencies Added:**
- `@headlessui/react@^2.2.9`
- `motion@^12.23.24`

**File Structure:**
```
src/catalyst/
├── layouts/          # SidebarLayout, StackedLayout, AuthLayout
├── navigation/       # Navbar, Sidebar, Button, Link
├── data/            # Table
├── forms/           # Combobox
└── typography/      # Heading, Text
```

### Phase 2: shadcn/ui Base Components ✅ COMPLETE

**Date:** 2025-11-11
**Component Count:** 47 primitives
**Status:** Production-ready

**What Was Built:**
- ✅ All 47 shadcn/ui primitive components installed
- ✅ Complete Radix UI integration
- ✅ Zero TypeScript compilation errors
- ✅ Full type safety and exports configured

**Component Inventory (47 total):**

**Form Components (12):**
Button, Input, Select, Checkbox, RadioGroup, Switch, Textarea, Form, Label, Slider, InputOtp, Sonner

**Layout Components (7):**
Card, Separator, Skeleton, AspectRatio, ScrollArea, Resizable, Collapsible

**Navigation Components (7):**
Tabs, DropdownMenu, NavigationMenu, Breadcrumb, Menubar, Command, Pagination

**Overlay Components (8):**
Dialog, Sheet, Popover, Tooltip, HoverCard, AlertDialog, ContextMenu, Drawer

**Feedback Components (4):**
Toast, Toaster, Alert, Progress

**Data Display Components (4):**
Table, Badge, Avatar, Accordion

**Advanced Components (5):**
Calendar, Carousel, Chart, Toggle, ToggleGroup

**Usage:**
```typescript
// Import shadcn primitives
import { Button, Card, Input, Dialog } from '@ozean-licht/shared-ui/ui'
```

**Key Fixes:**
- Fixed 5 TypeScript import errors in Catalyst components
- Verified all exports work correctly
- Created comprehensive index files

---

## Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  (apps/ozean-licht, apps/admin, apps/kids-ascension)       │
│  - Page layouts, business logic, data fetching             │
│  - Uses Tier 2 & Tier 3 components                         │
└─────────────────────────────────────────────────────────────┘
                            ↓ imports
┌─────────────────────────────────────────────────────────────┐
│  Tier 3: Context Layer (Application Compositions)           │
│  Location: /src/compositions/                               │
│  - CourseCard, TestimonialCard, PricingTable, etc.        │
│  - Pre-built sections and patterns                         │
│  - Export: @ozean-licht/shared-ui/compositions             │
└─────────────────────────────────────────────────────────────┘
                            ↓ uses
┌─────────────────────────────────────────────────────────────┐
│  Tier 2: Brand Layer (Ozean Licht Branded)                 │
│  Location: /src/components/                                 │
│  - Applies OL branding to Tier 1 primitives                │
│  - Uses design tokens for theming                          │
│  - Examples: BrandedButton, GlassCard, CosmicBadge        │
│  - Export: @ozean-licht/shared-ui (default)                │
└─────────────────────────────────────────────────────────────┘
                            ↓ extends
┌─────────────────────────────────────────────────────────────┐
│  Tier 1: Base Layer (Primitives)                           │
│  Location: /src/ui/ + /src/catalyst/                       │
│  - 47 shadcn/ui components (Radix UI)                      │
│  - 11 Catalyst components (Headless UI)                    │
│  - Export: @ozean-licht/shared-ui/ui                       │
│  - Export: @ozean-licht/shared-ui/catalyst                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Current File Structure

```
shared/ui-components/
├── src/
│   ├── ui/                      # 47 shadcn primitives ✅
│   ├── catalyst/                # 11 Catalyst components ✅
│   │   ├── layouts/
│   │   ├── navigation/
│   │   ├── data/
│   │   ├── forms/
│   │   └── typography/
│   ├── components/              # Branded components (Phase 3)
│   ├── compositions/            # Complex patterns (Phase 4)
│   ├── tokens/                  # Design tokens ✅
│   │   └── ozean-licht/
│   ├── themes/                  # Theme configurations
│   ├── hooks/                   # React hooks
│   ├── utils/                   # Utilities ✅
│   ├── styles/                  # Global styles ✅
│   │   └── globals.css
│   └── index.ts
├── catalyst-ui/                 # Original Catalyst files (reference)
├── package.json                 # ✅ Exports configured
├── tsconfig.json
├── tailwind.config.js
├── README.md                    # Package documentation
└── UPGRADE_PLAN.md             # This file
```

---

## Upcoming Phases

### Phase 3: Tier 2 - Branded Components (4-5 hours)

**Goal:** Create Ozean Licht branded wrapper components

**Status:** 🔜 Ready to Start

**Priority Components (Week 1):**
1. **Button** - Cosmic button with glow effects and variants
2. **Card** - Glass card with backdrop blur
3. **Input** - Themed input with turquoise focus ring
4. **Dialog** - Modal with glass background
5. **Badge** - Badge with glow effect

**Migration from ozean-licht app:**
- `cta-button.tsx` → Button variant="cta"
- `layout/badge.tsx` → Badge with glow
- `layout/header.tsx` → Navigation component
- `layout/footer.tsx` → Footer component

**Tasks:**
1. Create `/src/components/` directory
2. Build branded Button extending shadcn Button
3. Create GlassCard component with effects
4. Implement themed Input with focus glow
5. Build Dialog with cosmic backdrop
6. Create Badge with glow animations

**Deliverables:**
- 20+ branded components in `/src/components/`
- All use Ozean Licht design tokens
- Export from `@ozean-licht/shared-ui` (default)

### Phase 4: Tier 3 - Compositions (3-4 hours)

**Goal:** Build complex, pre-composed patterns

**Status:** Planned

**Components to Build:**
- CourseCard (from ozean-licht CourseCardModern)
- TestimonialCard
- PricingCard
- FeatureSection
- CTASection
- AuthForms (Login, PasswordReset, MagicLink)
- BlogCard

**Layout Templates:**
- DashboardLayout (using Catalyst SidebarLayout)
- MarketingLayout
- AuthLayout (using Catalyst AuthLayout)

**Deliverables:**
- 15+ composition components
- Layout templates
- Usage examples

### Phase 5: Tailwind Plus Integration (2-3 hours)

**Goal:** Download and integrate Tailwind Plus components

**Status:** Planned (Optional)

**Tasks:**
1. Download full Tailwind Plus catalog
2. Filter relevant components
3. Convert to React + OL branding
4. Document integration

### Phase 6: Kids Ascension Theme (2-3 hours)

**Goal:** Create second brand theme

**Status:** Planned

**Tasks:**
1. Define KA design tokens (bright, playful colors)
2. Create theme overrides
3. Test all components with KA theme
4. Document theme switching

### Phase 7: Documentation & Testing (3-4 hours)

**Goal:** Comprehensive docs and QA

**Status:** Planned

**Tasks:**
1. Set up Storybook
2. Write component documentation
3. Create usage examples
4. Write tests for core components
5. Accessibility audit (WCAG AA)
6. Performance optimization

---

## Quick Reference

### Import Patterns

```typescript
// Tier 1: Base primitives
import { Button, Card, Input } from '@ozean-licht/shared-ui/ui'
import { SidebarLayout, Navbar } from '@ozean-licht/shared-ui/catalyst'

// Tier 2: Branded components (Phase 3)
import { Button, Card, Badge } from '@ozean-licht/shared-ui'

// Tier 3: Compositions (Phase 4)
import { CourseCard, PricingTable } from '@ozean-licht/shared-ui/compositions'

// Design tokens
import { colors, typography } from '@ozean-licht/shared-ui/tokens'

// Styles
import '@ozean-licht/shared-ui/styles'
```

### Catalyst Quick Start

```typescript
// Dashboard with glass sidebar
import { SidebarLayout } from '@ozean-licht/shared-ui/catalyst/layouts'
import { Sidebar, SidebarBody, SidebarItem } from '@ozean-licht/shared-ui/catalyst/navigation'

<SidebarLayout
  navbar={<YourNavbar />}
  sidebar={
    <Sidebar>
      <SidebarBody>
        <SidebarItem href="/dashboard">Dashboard</SidebarItem>
      </SidebarBody>
    </Sidebar>
  }
>
  {children}
</SidebarLayout>
```

### shadcn Quick Start

```typescript
// Use primitives directly
import { Button, Card, Input } from '@ozean-licht/shared-ui/ui'

<Card className="p-6 glass-card">
  <Input type="email" placeholder="Email..." />
  <Button>Submit</Button>
</Card>
```

---

## Design Tokens

### Ozean Licht Theme (Default)

```typescript
// Colors
primary: '#0ec2bc'          // Turquoise
background: '#0A0F1A'        // Cosmic dark
card: '#1A1F2E'             // Card background

// Fonts
decorative: 'Cinzel Decorative'
serif: 'Cinzel'
sans: 'Montserrat'
alt: 'Montserrat Alternates'

// Effects
glass-card                   // Standard glass morphism
glass-card-strong           // Enhanced glass
glass-subtle                // Subtle glass
glow                        // Turquoise glow
```

### Kids Ascension Theme (Planned)

```typescript
// Colors (TBD)
primary: '#FF6B6B'          // Bright, playful
background: '#FFFFFF'        // Light background

// Fonts (TBD)
decorative: 'Comic Sans MS' // Kid-friendly
```

---

## Success Metrics

**Quantitative:**
- ✅ 47 shadcn components installed
- ✅ 11 Catalyst components integrated
- 🔜 20+ branded OL components (Phase 3)
- 🔜 15+ composition patterns (Phase 4)
- 🔜 2 complete theme systems (OL + KA)
- 🔜 100% Storybook coverage (Phase 7)
- 🔜 WCAG AA accessibility compliance

**Qualitative:**
- ✅ Zero TypeScript errors
- ✅ Production-ready builds
- ✅ Consistent Ozean Licht branding
- 🔜 3x faster feature development
- 🔜 Reduced code duplication
- 🔜 Easy theme switching for KA

---

## Review Results

**Code Review Score:** 8.75/10
**Status:** Production-ready
**Date:** 2025-11-11

**Findings:**
- 🚨 Blockers: 0
- ⚠️ High Risk: 0
- ⚡ Medium Risk: 5 (optimization opportunities)
- 💡 Low Risk: 4 (quality improvements)

**Top Recommendations:**
1. Replace hardcoded colors with CSS variables (1 hour)
2. Add unit tests for Catalyst components (1 day)
3. Set up Storybook for visual testing (2-3 days)

**Full Report:** `app_review/review_catalyst-shadcn-integration_2025-11-11_23-45.md`

---

## Timeline

**Completed:**
- ✅ Phase 1: Catalyst Integration (Nov 11, 2025)
- ✅ Phase 2: shadcn Base Components (Nov 11, 2025)

**Recommended Schedule:**
- **Week 1:** Phase 3 (Branded Components)
- **Week 2:** Phase 4 (Compositions) + Phase 5 (Tailwind Plus)
- **Week 3:** Phase 6 (KA Theme) + Phase 7 (Docs + Testing)

**Fast Track (Priority):**
- **Today:** Start Phase 3 - core branded components
- **Tomorrow:** Button, Card, Input, Dialog branded
- **Day 3:** Badge, remaining components + migration

---

## Next Actions

### Immediate (Phase 3 Start)

1. **Create branded Button:**
   ```bash
   # Extend shadcn Button with OL branding
   # Add cosmic theme, glow effects
   # Support all variants + new "cta" variant
   ```

2. **Create GlassCard:**
   ```bash
   # Extend shadcn Card
   # Apply glass-card-strong by default
   # Add hover glow option
   ```

3. **Create themed Input:**
   ```bash
   # Extend shadcn Input
   # Turquoise focus ring
   # Glass background
   ```

### Migration Strategy

**From ozean-licht app to shared:**
```typescript
// Before
import { Button } from "@/components/ui/button"
import { CourseCardModern } from "@/components/layout/course-card-modern"

// After (Phase 3)
import { Button } from "@ozean-licht/shared-ui"
import { CourseCard } from "@ozean-licht/shared-ui/compositions"
```

---

## Dependencies

**Installed:**
- `@headlessui/react@^2.2.9` (Catalyst)
- `motion@^12.23.24` (Catalyst animations)
- `@radix-ui/*` (24 packages for shadcn)
- `clsx@^2.1.0` (class merging)
- `tailwind-merge@^2.2.0` (Tailwind class merging)
- `class-variance-authority@^0.7.1` (variant handling)
- Plus 15+ other shadcn dependencies

**Total Bundle Size:** ~130KB (Catalyst + shadcn + dependencies)
**Tree-shakeable:** Yes ✅

---

## Documentation

**Package Documentation:**
- `README.md` - Package overview and usage guide

**This Roadmap:**
- `UPGRADE_PLAN.md` - Master plan (this file)

**Additional Resources:**
- `/design-system.md` - Complete design system documentation
- `/BRANDING.md` - Brand identity and guidelines
- `app_review/` - Code review reports

---

## Notes

**Catalyst vs shadcn:**
- **Catalyst:** Use for layouts, navigation, advanced tables
- **shadcn:** Use for primitives, forms, overlays, feedback
- **Best Approach:** Use both together (complementary)

**Headless UI vs Radix UI:**
- Both are production-ready
- Both have excellent accessibility
- No conflicts when used together
- Different API patterns but both work well

**Build Commands:**
```bash
pnpm build       # Build once
pnpm dev         # Watch mode
pnpm typecheck   # TypeScript check
pnpm clean       # Clean dist/
```

---

**Version History:**
- v2.0.0 (2025-11-11) - Consolidated all documentation, Phases 1-2 complete
- v1.1.0 (2025-11-11) - Phase 2 complete notes
- v1.0.0 (2025-11-11) - Initial plan

**Maintained by:** Ozean Licht Platform Team + AI Agents
**Last Review:** 2025-11-11
