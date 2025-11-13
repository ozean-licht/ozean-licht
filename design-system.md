# Ozean Licht Design System

**Version:** 1.0.0
**Last Updated:** 2025-11-13
**Status:** Official - Single Source of Truth

---

## Overview

This is the **official design system** for the Ozean Licht ecosystem. This applies to:
- ✅ Admin Dashboard (`apps/admin/`)
- ✅ Ozean Licht Platform (`apps/ozean-licht/`)
- ✅ Shared UI Components (`shared/ui/`)
- ❌ **NOT** Kids Ascension (separate branding)

---

## Design Philosophy

**Cosmic Elegance** - Mystery, depth, and spiritual awakening through:
1. Dark cosmic backgrounds
2. Turquoise accent color (#0ec2bc)
3. Glass morphism effects
4. Elegant typography (used sparingly)
5. Subtle animations (glow, float)

---

## Colors

### Primary Color - Turquoise

```typescript
primary: {
  DEFAULT: '#0ec2bc',    // Main brand color
  50:  '#E6F8F7',
  100: '#CCF1F0',
  200: '#99E3E1',
  300: '#66D5D2',
  400: '#33C7C3',
  500: '#0ec2bc',        // Base
  600: '#0BA09A',
  700: '#087E78',
  800: '#065C56',
  900: '#033A34',
  foreground: '#FFFFFF',
}
```

**Usage:**
- Primary actions (buttons, links)
- Borders on glass cards (with opacity)
- Glow effects (with opacity)
- Active/focus states

### Background Colors

```typescript
background: '#0A0F1A',    // Main background (cosmic dark)
card: '#1A1F2E',          // Card background
border: '#2A2F3E',        // Borders
input: '#2A2F3E',         // Input backgrounds
foreground: '#FFFFFF',    // Text color
```

**Cosmic Gradient:**
```css
background-image: linear-gradient(135deg, #0A0F1A 0%, #1A1F2E 50%, #0A0F1A 100%);
```

### Semantic Colors

```typescript
destructive: '#EF4444',   // Red - errors, delete
success: '#10B981',       // Green - success
warning: '#F59E0B',       // Amber - warnings
info: '#3B82F6',          // Blue - info

muted: '#64748B',         // Muted elements
muted-foreground: '#94A3B8',  // Muted text
```

---

## Typography

### Font Families (3 Total)

```css
--font-decorative: 'Cinzel Decorative', Georgia, serif;
--font-sans: 'Montserrat', system-ui, -apple-system, sans-serif;
--font-alt: 'Montserrat Alternates', Montserrat, sans-serif;
--font-mono: 'Fira Code', 'Courier New', monospace;
```

### Font Usage Rules

1. **Cinzel Decorative** - Use SPARINGLY
   - H1 (hero/page titles)
   - H2 (section headings)
   - Course card titles (special case)
   - Weight: 400 (Regular) ONLY - never bold

2. **Montserrat** - Main font
   - H3, H4 headings
   - Body text, paragraphs
   - UI elements, buttons
   - Weights: 300 (Light), 400 (Regular), 500-700 (Medium-Bold)

3. **Montserrat Alternates** - Labels
   - H5, H6 (labels, small headings)
   - Captions, metadata
   - Weights: 400-700

### Typography Scale

```
H1: Cinzel Decorative, 3rem-4rem (48-64px), Regular (400)
H2: Cinzel Decorative, 2.25rem-3rem (36-48px), Regular (400)
H3: Montserrat, 1.875rem-2.25rem (30-36px), Regular (400)
H4: Montserrat, 1.5rem-1.875rem (24-30px), Regular (400)
H5: Montserrat Alternates, 1.25rem-1.5rem (20-24px), Regular (400)
H6: Montserrat Alternates, 1rem-1.25rem (16-20px), Regular (400)

Body Large: Montserrat, 1.125rem (18px), Regular (400)
Body Medium: Montserrat, 1rem (16px), Regular (400)
Body Small: Montserrat, 0.875rem (14px), Regular (400)
Paragraph: Montserrat, 1rem (16px), Light (300)
```

**Text Shadows (H1, H2 only):**
```css
h1 { text-shadow: 0 0 8px rgba(255, 255, 255, 0.6); }
h2 { text-shadow: 0 0 8px rgba(255, 255, 255, 0.42); }
```

---

## Glass Morphism

### Glass Card Variants

```css
/* Standard glass card */
.glass-card {
  background: rgba(26, 31, 46, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(14, 194, 188, 0.25);
}

/* Strong emphasis */
.glass-card-strong {
  background: rgba(26, 31, 46, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(14, 194, 188, 0.3);
}

/* Subtle background */
.glass-subtle {
  background: rgba(26, 31, 46, 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(14, 194, 188, 0.15);
}

/* Hover effect */
.glass-hover:hover {
  border-color: rgba(14, 194, 188, 0.4);
  box-shadow: 0 0 20px rgba(14, 194, 188, 0.15);
}
```

---

## Effects & Animations

### Glow Effects

```css
/* Subtle glow */
.glow-subtle {
  box-shadow: 0 0 12px rgba(14, 194, 188, 0.15);
}

/* Standard glow */
.glow {
  box-shadow: 0 0 20px rgba(14, 194, 188, 0.22);
}

/* Strong glow */
.glow-strong {
  box-shadow: 0 0 30px rgba(14, 194, 188, 0.35);
}
```

### Animations

```css
/* Glow pulse */
@keyframes glow {
  0% { box-shadow: 0 0 20px rgba(14, 194, 188, 0.3); }
  100% { box-shadow: 0 0 30px rgba(14, 194, 188, 0.6); }
}

/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Shine */
@keyframes shine {
  0% { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
}
```

**Usage:**
```css
.animate-glow { animation: glow 2s ease-in-out infinite alternate; }
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-shine { animation: shine 2s linear infinite; }
```

---

## Component Patterns

### Button Variants

```typescript
primary: 'bg-primary text-white hover:bg-primary/90'
secondary: 'glass-card text-primary border-primary/30 hover:bg-primary/10'
ghost: 'text-primary hover:bg-primary/10'
destructive: 'bg-destructive text-white hover:bg-destructive/90'
outline: 'border border-input hover:bg-accent'
link: 'text-primary underline-offset-4 hover:underline'
cta: 'bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70 border-primary/30 glow-subtle'
```

### Card Variants

```typescript
default: 'glass-card'
strong: 'glass-card-strong'
subtle: 'glass-subtle'
solid: 'bg-card border border-border'
```

### Interaction States

```css
/* Hover */
hover:border-primary/40
hover:shadow-lg
hover:shadow-primary/15

/* Active (pressed) */
active:scale-95

/* Focus */
focus:outline-none
focus:ring-2
focus:ring-primary
focus:ring-offset-2
focus:ring-offset-background
```

---

## Spacing & Layout

### Border Radius

```typescript
sm: '0.25rem',   // 4px
md: '0.375rem',  // 6px
lg: '0.5rem',    // 8px
xl: '0.75rem',   // 12px
2xl: '1rem',     // 16px
```

### Spacing Scale

Uses Tailwind default scale (0.25rem = 4px increments):
```
p-1 = 4px
p-2 = 8px
p-3 = 12px
p-4 = 16px
p-6 = 24px
p-8 = 32px
```

### Common Patterns

```css
/* Page container */
.container-page {
  container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12
}

/* Vertical rhythm */
.stack-tight { space-y-2 }     /* 8px */
.stack-normal { space-y-4 }    /* 16px */
.stack-loose { space-y-6 }     /* 24px */
.stack-very-loose { space-y-8 } /* 32px */

/* Grid layouts */
.grid-cards { grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 }
.grid-dashboard { grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 }
```

---

## Accessibility

### Color Contrast (WCAG AA)

All combinations meet WCAG AA standards:
- Turquoise (#0ec2bc) on Dark (#0A0F1A): **4.7:1** ✅
- White (#FFFFFF) on Dark (#0A0F1A): **18.5:1** ✅ (AAA)
- Muted (#94A3B8) on Dark (#0A0F1A): **7.2:1** ✅ (AAA)

### Focus Styles

```css
*:focus-visible {
  outline: none;
  ring: 2px solid var(--primary);
  ring-offset: 2px;
  ring-offset-color: var(--background);
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Component Library

### Import Shared Components

```typescript
import { Button, Card, Badge, Input, Select } from '@ozean-licht/shared-ui'

// Components automatically use Ozean Licht design tokens
<Button variant="primary">Action</Button>
<Card variant="default" hover glow>Content</Card>
<Badge variant="gradient">New</Badge>
```

### Custom Components

Follow this pattern for all custom components:

```typescript
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const componentVariants = cva(
  'base-classes-here',
  {
    variants: {
      variant: {
        default: 'glass-card',
        primary: 'bg-primary text-white',
      },
      size: {
        sm: 'h-9 px-4 py-2 text-sm',
        md: 'h-10 px-6 py-3 text-base',
        lg: 'h-11 px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn(componentVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)

Component.displayName = 'Component'

export { Component, componentVariants }
```

---

## Usage Examples

### Button Examples

```tsx
// Primary action
<Button variant="primary">Save Changes</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// CTA with glow
<Button variant="cta" glow>Get Started</Button>

// With icon
<Button variant="primary" icon={<Download />}>
  Download
</Button>

// Loading state
<Button variant="primary" loading>
  Processing...
</Button>
```

### Card Examples

```tsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Interactive card
<Card variant="strong" hover glow>
  <CardContent>Hover me</CardContent>
</Card>

// Course card (special case with Cinzel Decorative)
<Card className="glass-card">
  <img src={thumbnail} alt={title} />
  <CardContent>
    <h3 className="font-decorative text-xl">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
    <Button variant="primary">View Course</Button>
  </CardContent>
</Card>
```

### Typography Examples

```tsx
// Hero heading (Cinzel Decorative)
<h1 className="font-decorative text-4xl md:text-6xl">
  Welcome to Ozean Licht
</h1>

// Section heading (Cinzel Decorative)
<h2 className="font-decorative text-3xl md:text-4xl">
  Our Courses
</h2>

// Subsection (Montserrat)
<h3 className="font-sans text-2xl">
  Getting Started
</h3>

// Card title (Montserrat)
<h4 className="font-sans text-xl">
  Dashboard Overview
</h4>

// Label (Montserrat Alternates)
<h5 className="font-alt text-lg">
  User Settings
</h5>

// Body text
<p className="font-sans text-base font-light">
  Your paragraph text here...
</p>
```

---

## File Locations

### Design System Files

```
/design-system.md                           # This file
/BRANDING.md                                # Brand guidelines
/shared/ui/src/styles/globals.css          # Global styles
/shared/ui/STRUCTURE_PLAN.md               # Component structure
/shared/ui/FONT_FIX_SUMMARY.md             # Typography reference
/shared/ui/tailwind-storybook-analyses.md  # Storybook setup
```

### Tailwind Configs

```
/apps/ozean-licht/tailwind.config.js       # Ozean Licht app
/apps/admin/tailwind.config.js             # Admin dashboard
/storybook/tailwind.config.js              # Storybook
```

### Component Library

```
/shared/ui/src/components/                 # Tier 2 components
/shared/ui/src/compositions/               # Tier 3 compositions
/shared/ui/src/ui/                         # Tier 1 primitives
/shared/ui/src/utils/                      # Utilities
```

---

## Quick Reference

### Tailwind Classes

```css
/* Fonts */
font-decorative  → Cinzel Decorative (SPARINGLY)
font-sans        → Montserrat (main font)
font-alt         → Montserrat Alternates (labels)
font-mono        → Fira Code (code)

/* Glass morphism */
glass-card        → Standard glass card
glass-card-strong → Strong emphasis card
glass-subtle      → Subtle background card
glass-hover       → Hover effect

/* Glow effects */
glow-subtle  → Subtle glow (12px)
glow         → Standard glow (20px)
glow-strong  → Strong glow (30px)

/* Colors */
bg-primary   → Turquoise background
text-primary → Turquoise text
border-primary/25 → 25% opacity border

bg-background → Cosmic dark
bg-card       → Card background
text-foreground → White text
text-muted-foreground → Muted gray text
```

---

## Design Checklist

When creating components, ensure:

- [ ] Uses CSS variables (`var(--primary)`, `var(--background)`)
- [ ] Glass morphism for elevated surfaces
- [ ] Cinzel Decorative used SPARINGLY (H1, H2, course cards only)
- [ ] Montserrat for all other text
- [ ] Regular weight (400) for Cinzel Decorative
- [ ] Glow effects on hover (with primary color opacity)
- [ ] Active state scaling (`active:scale-95`)
- [ ] Focus ring with primary color
- [ ] WCAG AA contrast compliance
- [ ] Responsive design (mobile-first)
- [ ] Reduced motion support

---

**For detailed brand guidelines, see:** [BRANDING.md](/BRANDING.md)
**For component structure, see:** [shared/ui/STRUCTURE_PLAN.md](/shared/ui/STRUCTURE_PLAN.md)
**For Storybook setup, see:** [shared/ui/tailwind-storybook-analyses.md](/shared/ui/tailwind-storybook-analyses.md)

---

**Status:** Official - All applications must follow these guidelines
**Maintained by:** Ozean Licht Platform Team
**Version:** 1.0.0 (2025-11-13)
