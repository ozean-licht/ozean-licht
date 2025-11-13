# Shared UI Component Library - Quick Reference

## Key Facts at a Glance

### Overview
- **Package:** @ozean-licht/shared-ui (workspace dependency)
- **Status:** v0.1.0 (active development, Phase 1)
- **Location:** /shared/ui/
- **Architecture:** 3-tier (57 primitives, 7 branded, 19 compositions)

### Current State: 95% Design System Implementation
```
✅ Colors: Turquoise #0ec2bc + cosmic dark #0A0F1A
✅ Typography: Cinzel Decorative + Montserrat + Montserrat Alternates
✅ Glass Morphism: 3 variants (standard, strong, subtle)
✅ Glow Animations: Complete with reduced motion support
✅ CSS Variables: 26 custom properties for runtime theming
⚠️  Storybook Coverage: Only 13/84 components (15.5%)
⚠️  Documentation: Compositions & Catalyst missing
```

---

## Component Inventory

### Tier 1: Primitives (57 total)
- **shadcn/ui:** 47 components (accordion, button, dialog, form, input, select, tabs, etc.)
  - Story coverage: 8/47 (17%)
- **Catalyst:** 11 components (sidebar-layout, navbar, combobox, heading, etc.)
  - Story coverage: 0/11 (0%)

### Tier 2: Branded (7 total)
- **Button** ✅ (primary, secondary, ghost, cta, destructive, outline, link)
- **Card** ✅ (default, strong, subtle, solid + CardHeader, CardTitle, etc.)
- **Badge** ✅ (7 variants with glow)
- **Input** ✅ (text, email, password, etc. + Textarea + Label)
- **Select** ✅ (dropdown with FormGroup)
- **Dialog** ❌ Missing story (has component)
- **Textarea** ❌ Missing story (has component)
- Story coverage: 5/7 (71%)

### Tier 3: Compositions (19 total)
- **Cards (6):** CourseCard, TestimonialCard, PricingCard, BlogCard, FeatureCard, StatsCard
- **Forms (5):** LoginForm, RegisterForm, PasswordResetForm, MagicLinkForm, ContactForm
- **Layouts (3):** DashboardLayout, MarketingLayout, AuthLayout
- **Sections (5):** HeroSection, CTASection, FeatureSection, TestimonialsSection, PricingSection
- Story coverage: 0/19 (0%) - CRITICAL GAP

---

## Design System Implementation Status

### Colors (COMPLETE)
```typescript
import { ozeanLichtColors } from '@ozean-licht/shared-ui/tokens'

primary: #0ec2bc (turquoise, 50-900 palette)
background: #0A0F1A (cosmic dark)
card: #1A1F2E
semantic: success (#10B981), warning (#F59E0B), destructive (#EF4444), info (#3B82F6)
glass: rgba colors with 0.5-0.8 opacity + 8-16px blur
```

### Typography (COMPLETE)
```typescript
import { ozeanLichtTypography } from '@ozean-licht/shared-ui/tokens'

Fonts:
- H1, H2: Cinzel Decorative (SPARINGLY - only main headings)
- H3, H4: Cinzel or Montserrat
- H5, H6, Labels: Montserrat Alternates
- Body: Montserrat (16px base, light 300 weight)
- Code: Fira Code

Sizes: 12px - 72px semantic scale
Weights: 300 (light) - 900 (black)
Text Effects: glow on h1/h2 (text-shadow + opacity)
```

### Glass Morphism (COMPLETE)
```css
.glass-card          /* Standard: 0.7 opacity, 12px blur */
.glass-card-strong   /* Strong: 0.8 opacity, 16px blur */
.glass-subtle        /* Subtle: 0.5 opacity, 8px blur */
.glass-hover         /* Hover glow effect */
.glow, .glow-strong, .glow-subtle
```

### Animations (COMPLETE)
```css
glow (2s)           /* Box shadow pulse */
float (6s)          /* Vertical 10px movement */
shine (2s)          /* Gradient sweep */
Accessibility: @prefers-reduced-motion respected
```

---

## Key Files & Locations

```
Design Tokens:
- /src/tokens/ozean-licht/colors.ts        → All color definitions
- /src/tokens/ozean-licht/typography.ts    → Font families & sizes
- /src/tokens/ozean-licht/effects.ts       → Animations & effects
- /src/tokens/ozean-licht/spacing.ts       → Spacing scale

Global Styles:
- /src/styles/globals.css                  → 585 lines (CSS variables, glass, utilities)
- /tailwind.config.js                      → Tailwind config

Branded Components:
- /src/components/Button.tsx               → 7 variants
- /src/components/Card.tsx                 → 4 variants
- /src/components/Badge.tsx, Input.tsx, Select.tsx, Dialog.tsx

Compositions:
- /src/compositions/cards/CourseCard.tsx   → Example composition
- /src/compositions/forms/, /layouts/, /sections/

Configuration:
- /package.json                            → 41 npm dependencies
- /components.json                         → shadcn config
- /tsconfig.json                           → TypeScript strict mode
```

---

## Usage Examples

### Import Branded Components
```typescript
import { Button, Card, Badge, Input } from '@ozean-licht/shared-ui'

<Button variant="primary">Action</Button>
<Card variant="strong" hover glow>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>Content</Card.Content>
</Card>
```

### Import Primitives
```typescript
import { Button, Dialog } from '@ozean-licht/shared-ui/ui'

<Dialog>
  <DialogContent>
    <DialogTitle>Dialog Title</DialogTitle>
  </DialogContent>
</Dialog>
```

### Import Design Tokens
```typescript
import { ozeanLichtColors, ozeanLichtTypography } from '@ozean-licht/shared-ui/tokens'

const primaryColor = ozeanLichtColors.primary.DEFAULT  // #0ec2bc
const decorativeFont = ozeanLichtTypography.fontFamily.decorative
```

### Use Global Styles
```typescript
// In app's globals.css
import '@ozean-licht/shared-ui/styles'

// In JSX
<div className="glass-card p-6 rounded-lg">
  <h1 className="font-decorative text-4xl">Title</h1>
  <p className="body-m text-glow-subtle">Subtitle</p>
</div>
```

---

## Critical Gaps to Address

### Phase 2 (Immediate)
- [ ] Dialog.stories.tsx (add 1 story)
- [ ] Textarea.stories.tsx (add 1 story)

### Phase 3 (This Week)
- [ ] Add 19 composition component stories (cards, forms, layouts, sections)
- [ ] Create usage patterns documentation

### Phase 4 (Next Week)
- [ ] Add 11 Catalyst component stories
- [ ] Create component-index.json catalog

### Phase 5 (Future)
- [ ] Kids Ascension brand tokens (currently placeholder)
- [ ] Visual regression testing

---

## Architecture Highlights

### Three-Tier Design
1. **Tier 1 (Primitives)** → Headless, universal components
2. **Tier 2 (Branded)** → Ozean Licht styled versions
3. **Tier 3 (Compositions)** → Ready-to-use patterns

### Key Patterns
- **CVA (Class Variance Authority)** for type-safe variants
- **CSS Variables** for runtime theming
- **forwardRef** for Radix UI compatibility
- **Composition over inheritance** in Tier 3
- **Glass morphism as base** styling philosophy

### Dependencies (41 packages)
- Radix UI (14 packages) + Headless UI
- Form: react-hook-form + zod
- Animations: motion, sonner
- Icons: lucide-react
- Tailwind: tailwindcss-animate + tailwind-merge

---

## Quick Checks

### Is a component documented?
1. Check if it has a `.stories.tsx` file
2. If not, it's in the 71% undocumented gap
3. Tier 2 (branded) has 5/7 stories (good)
4. Tier 3 (compositions) has 0/19 stories (critical)

### What design token should I use?
- Colors: Imported from `/tokens/ozean-licht/colors.ts` or CSS var `--primary`
- Typography: Use Tailwind classes or CSS var `--font-decorative`
- Spacing: 8px base unit (Tailwind spacing scale)
- Animations: Use keyframes from globals.css

### How do I override the theme?
1. All colors use CSS variables
2. Override in your app's CSS root
3. Kids Ascension should use custom tokens
4. Example: Set `--primary: #FF6B6B` for Kids theme

---

## File Structure (Simplified)

```
shared/ui/src/
├── ui/              (47 primitives - Radix/shadcn)
├── catalyst/        (11 primitives - Headless UI)
├── components/      (7 branded - Tier 2)
├── compositions/    (19 patterns - Tier 3)
├── tokens/          (Colors, typography, effects, spacing)
├── styles/          (Global CSS with glass, animations, utilities)
├── hooks/           (React hooks)
├── utils/           (cn utility, etc.)
└── index.ts         (Main export barrel)
```

---

## Production Readiness

### Ready Now ✅
- Tier 1 primitives (57 components)
- Tier 2 branded components (5/7 with stories)
- Design tokens (colors, typography, effects)
- Global styles (glass, animations, utilities)
- Build system (tsup with ESM/CJS/types)

### Ready Soon (Phase 2-3)
- All Tier 2 components (add 2 missing stories)
- Tier 3 compositions (add 19 stories + patterns)

### Needs Work (Phase 4+)
- Catalyst components documentation
- Component catalog/discovery index
- Kids Ascension brand tokens

---

## Contact & Documentation

**Full Report:** /shared/ui/UI_LIBRARY_EXPLORATION.md (11,000+ words)
**Upgrade Plan:** /shared/ui/UPGRADE_PLAN.md
**Structure Plan:** /shared/ui/STRUCTURE_PLAN.md
**Font Implementation:** /shared/ui/FONT_FIX_SUMMARY.md
**Component README:** /shared/ui/README.md

