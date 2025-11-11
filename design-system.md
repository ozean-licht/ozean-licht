# Ozean Licht Design System

**Version:** 0.1.0
**Last Updated:** 2025-11-11
**Status:** Official - Single Source of Truth

---

## Overview

This is the **official design system** for the Ozean Licht ecosystem. All applications in the monorepo (admin dashboard, Ozean Licht platform, and shared components) should reference this document when building UI components.

**Purpose:**
- Provide clear, authoritative design guidance for human developers and AI agents
- Ensure consistent branding across all Ozean Licht applications
- Document all design tokens, patterns, and utilities
- Enable rapid, correct-by-default component development

**Scope:**
- Ozean Licht platform (`apps/ozean-licht/`)
- Admin dashboard (`apps/admin/`)
- Shared UI components (`shared/ui-components/`)

**Exception:** Kids Ascension has separate branding (see [BRANDING.md](/BRANDING.md))

---

## Design Philosophy

**Cosmic Elegance** - Ozean Licht embodies a sense of mystery, depth, and spiritual awakening through:

1. **Dark Cosmic Theme** - Deep space backgrounds with subtle gradients
2. **Turquoise Accent** - Vibrant #0ec2bc represents clarity and transformation
3. **Glass Morphism** - Layered, translucent cards create depth
4. **Ethereal Typography** - Elegant serif headings with glowing effects
5. **Fluid Animations** - Gentle floating and glowing for life and energy

---

## Color System

### Primary Color - Turquoise

Ozean Licht's signature color represents clarity, transformation, and spiritual awakening.

```typescript
// Primary turquoise palette
primary: {
  DEFAULT: '#0ec2bc',    // Main brand color
  50:  '#E6F8F7',        // Lightest tint
  100: '#CCF1F0',
  200: '#99E3E1',
  300: '#66D5D2',
  400: '#33C7C3',
  500: '#0ec2bc',        // Base
  600: '#0BA09A',
  700: '#087E78',
  800: '#065C56',
  900: '#033A34',        // Darkest shade
  foreground: '#FFFFFF',
}
```

**Usage Guidelines:**
- Use `primary-500` for primary actions (buttons, links, CTAs)
- Use `primary-400/300` for hover states
- Use `primary-700/800` for pressed states
- Use `primary-50/100` for light backgrounds (rare)
- Use `primary` with opacity for borders and glows

### Background Colors

Dark cosmic backgrounds create depth and focus.

```typescript
// Background system
background: '#0A0F1A',           // Main background (dark space)
card: '#1A1F2E',                 // Card background (lighter layer)
popover: '#1A1F2E',              // Dropdown/popover background
border: '#2A2F3E',               // Subtle borders
input: '#2A2F3E',                // Input field backgrounds
```

**Cosmic Gradient:**
```css
background-image: linear-gradient(135deg, #0A0F1A 0%, #1A1F2E 50%, #0A0F1A 100%);
```

### Semantic Colors

```typescript
// Semantic color system
destructive: {
  DEFAULT: '#EF4444',            // Red for errors/delete
  foreground: '#FFFFFF',
},
success: {
  DEFAULT: '#10B981',            // Green for success
  foreground: '#FFFFFF',
},
warning: {
  DEFAULT: '#F59E0B',            // Amber for warnings
  foreground: '#000000',
},
info: {
  DEFAULT: '#3B82F6',            // Blue for info
  foreground: '#FFFFFF',
},
```

### Text Colors

```typescript
// Text color system
foreground: '#FFFFFF',           // Primary text (white)
muted: {
  DEFAULT: '#64748B',            // Secondary text
  foreground: '#94A3B8',         // Tertiary text
},
```

**Accessibility:**
- Turquoise (#0ec2bc) on dark background (#0A0F1A) = **WCAG AA compliant**
- All semantic colors meet WCAG AA standards
- Use text shadows sparingly for enhanced readability

---

## Typography

### Font Families

Ozean Licht uses a three-font system for hierarchy and elegance:

```typescript
// Font family system
fontFamily: {
  sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
  serif: ['Cinzel', 'Georgia', 'serif'],
  decorative: ['Cinzel Decorative', 'Georgia', 'serif'],
  alt: ['Montserrat Alternates', 'Montserrat', 'sans-serif'],
  mono: ['Fira Code', 'Courier New', 'monospace'],
}
```

**Load fonts in app layout:**
```typescript
import { Cinzel_Decorative, Cinzel, Montserrat, Montserrat_Alternates } from 'next/font/google'

const cinzelDecorative = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-decorative'
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif'
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans'
})

const montserratAlternates = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-alt'
})
```

### Typography Hierarchy

```typescript
// Heading hierarchy
h1: {
  font: 'Cinzel Decorative',
  size: '3rem - 4rem',        // 48px - 64px
  weight: 700,
  textShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
  usage: 'Page titles, hero headings'
}

h2: {
  font: 'Cinzel Decorative',
  size: '2.25rem - 3rem',     // 36px - 48px
  weight: 700,
  textShadow: '0 0 8px rgba(255, 255, 255, 0.42)',
  usage: 'Section headings'
}

h3: {
  font: 'Cinzel Decorative',
  size: '1.875rem - 2.25rem', // 30px - 36px
  weight: 400,
  usage: 'Subsection headings'
}

h4: {
  font: 'Cinzel',
  size: '1.5rem - 1.875rem',  // 24px - 30px
  weight: 600,
  usage: 'Card titles'
}

h5: {
  font: 'Montserrat Alternates',
  size: '1.25rem - 1.5rem',   // 20px - 24px
  weight: 600,
  usage: 'Component titles'
}

h6: {
  font: 'Montserrat Alternates',
  size: '1rem - 1.25rem',     // 16px - 20px
  weight: 600,
  usage: 'Small headings'
}
```

### Body Text Sizes

```typescript
// Body text scale
body-l: {
  font: 'Montserrat',
  size: '1.125rem',           // 18px
  weight: 400,
  usage: 'Large body text, lead paragraphs'
}

body-m: {
  font: 'Montserrat',
  size: '1rem',               // 16px
  weight: 400,
  usage: 'Standard body text'
}

body-s: {
  font: 'Montserrat',
  size: '0.875rem',           // 14px
  weight: 400,
  usage: 'Small text, captions'
}

// Default paragraph styling
p: {
  font: 'Montserrat',
  weight: 300,                // Light weight for readability
}
```

---

## Spacing System

8px base unit for consistent rhythm:

```typescript
// Spacing scale
spacing: {
  0: '0px',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px   - BASE UNIT
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
}
```

**Guidelines:**
- Use `space-4` (16px) for standard component padding
- Use `space-6` (24px) for section spacing
- Use `space-8` (32px) for major section gaps
- Use `space-2` (8px) for tight spacing (badges, chips)

---

## Border Radius

```typescript
// Border radius scale
borderRadius: {
  sm: '0.25rem',   // 4px  - Small elements
  md: '0.375rem',  // 6px  - Standard
  lg: '0.5rem',    // 8px  - Cards
  xl: '0.75rem',   // 12px - Large cards
  full: '9999px',  // Fully rounded
}
```

**Default:** Use `rounded-lg` (8px) for cards and major components

---

## Glass Morphism

Signature Ozean Licht effect - translucent cards with backdrop blur.

### Glass Card Variants

```css
/* Standard glass card */
.glass-card {
  background: rgba(26, 31, 46, 0.7);      /* card with 70% opacity */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(14, 194, 188, 0.25);  /* primary/25 */
}

/* Strong emphasis card */
.glass-card-strong {
  background: rgba(26, 31, 46, 0.8);      /* card with 80% opacity */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(14, 194, 188, 0.3);   /* primary/30 */
}

/* Subtle background card */
.glass-subtle {
  background: rgba(26, 31, 46, 0.5);      /* card with 50% opacity */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(14, 194, 188, 0.15);  /* primary/15 */
}

/* Hover effect with glow */
.glass-hover {
  transition: all 0.3s ease;
}

.glass-hover:hover {
  border-color: rgba(14, 194, 188, 0.4);  /* primary/40 */
  box-shadow: 0 0 20px rgba(14, 194, 188, 0.15);
}

/* Standalone glow utility */
.glow {
  box-shadow: 0 0 20px rgba(14, 194, 188, 0.3);
}
```

**Usage Guidelines:**
- Use `.glass-card` for standard dashboard cards
- Use `.glass-card-strong` for important content (CTAs, featured items)
- Use `.glass-subtle` for background layers, less important content
- Add `.glass-hover` for interactive cards
- Combine: `glass-card glass-hover rounded-lg p-6`

**Performance:**
- Limit `backdrop-filter` usage on mobile (expensive)
- Avoid nested glass effects (visual confusion)
- Use solid backgrounds for text-heavy content

---

## Animations

### Animation System

```typescript
// Animation definitions
animations: {
  glow: 'glow 2s ease-in-out infinite alternate',
  float: 'float 6s ease-in-out infinite',
  shine: 'shine 2s linear infinite',
}

// Keyframes
keyframes: {
  glow: {
    '0%': { boxShadow: '0 0 20px rgba(14, 194, 188, 0.3)' },
    '100%': { boxShadow: '0 0 30px rgba(14, 194, 188, 0.6)' },
  },
  float: {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
  },
  shine: {
    '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
    '100%': { transform: 'translateX(200%) skewX(-12deg)' },
  },
}
```

**Usage:**
- `animate-glow` - Pulsing glow for important elements
- `animate-float` - Gentle floating for hero elements
- `animate-shine` - Shimmer effect for loading states

**Example:**
```html
<div class="glass-card animate-glow">
  Featured Content
</div>
```

---

## Component Patterns

### Button Variants

```typescript
// Button pattern
<button className="
  bg-primary hover:bg-primary-400
  text-white font-medium
  px-6 py-3 rounded-lg
  transition-all duration-200
  hover:shadow-lg hover:shadow-primary/20
  active:scale-95
">
  Primary Action
</button>

// Secondary button
<button className="
  bg-card border border-primary/30
  text-primary hover:bg-primary/10
  px-6 py-3 rounded-lg
  transition-all duration-200
">
  Secondary Action
</button>

// Ghost button
<button className="
  text-primary hover:bg-primary/10
  px-6 py-3 rounded-lg
  transition-all duration-200
">
  Ghost Action
</button>
```

### Card Pattern

```typescript
// Standard card
<div className="glass-card glass-hover rounded-lg p-6 space-y-4">
  <h4 className="font-serif text-2xl">Card Title</h4>
  <p className="text-muted-foreground">Card content goes here...</p>
</div>

// Featured card with glow
<div className="glass-card-strong animate-glow rounded-lg p-8 space-y-6">
  <h3 className="font-decorative text-3xl">Featured Content</h3>
  <p>Important content with emphasis...</p>
</div>
```

### Badge Pattern

```typescript
// Status badge
<span className="
  inline-flex items-center
  bg-primary/20 text-primary
  border border-primary/30
  px-3 py-1 rounded-full
  text-sm font-medium
">
  Active
</span>

// Role badge
<span className="
  inline-flex items-center
  bg-success/20 text-success
  border border-success/30
  px-3 py-1 rounded-full
  text-sm font-medium
">
  Admin
</span>
```

### Input Pattern

```typescript
// Text input
<input
  type="text"
  className="
    w-full bg-input border border-border
    text-foreground placeholder:text-muted-foreground
    px-4 py-3 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-primary
    transition-all duration-200
  "
  placeholder="Enter text..."
/>

// Select dropdown
<select className="
  w-full bg-input border border-border
  text-foreground
  px-4 py-3 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-primary
  transition-all duration-200
">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

---

## Layout Patterns

### Page Layout

```typescript
// Standard page structure
<div className="min-h-screen bg-background text-foreground">
  {/* Header */}
  <header className="glass-card border-b border-primary/20 px-6 py-4">
    <h1 className="font-decorative text-4xl">Page Title</h1>
  </header>

  {/* Main content */}
  <main className="container mx-auto px-6 py-8 space-y-8">
    <section className="space-y-6">
      {/* Content sections */}
    </section>
  </main>
</div>
```

### Dashboard Grid

```typescript
// Dashboard card grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="glass-card glass-hover rounded-lg p-6">
    {/* Card content */}
  </div>
  {/* More cards */}
</div>
```

### Data Table

```typescript
// Table with glass effect
<div className="glass-card rounded-lg overflow-hidden">
  <table className="w-full">
    <thead className="bg-card/50 border-b border-primary/20">
      <tr>
        <th className="px-6 py-4 text-left font-alt text-sm">Header</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-border">
      <tr className="hover:bg-primary/5 transition-colors">
        <td className="px-6 py-4">Cell content</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## AI Agent Instructions

**For AI Agents building Ozean Licht features:**

### Decision Tree

```
Is this feature for admin dashboard or Ozean Licht platform?
├─ YES → Use Ozean Licht design system (this document)
│   ├─ Use primary color: #0ec2bc (turquoise)
│   ├─ Use cosmic background: #0A0F1A
│   ├─ Apply glass-card utilities
│   └─ Use Cinzel Decorative for headings
│
└─ NO → Is this for Kids Ascension?
    └─ YES → Use Kids Ascension branding (see BRANDING.md)
```

### Component Templates

**Creating a new card:**
```typescript
<div className="glass-card glass-hover rounded-lg p-6 space-y-4">
  <h4 className="font-serif text-xl text-foreground">
    {title}
  </h4>
  <p className="text-muted-foreground">
    {description}
  </p>
  <button className="bg-primary hover:bg-primary-400 text-white px-4 py-2 rounded-lg transition-all">
    Action
  </button>
</div>
```

**Creating a new page:**
```typescript
export default function MyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <h1 className="font-decorative text-4xl mb-8">
          Page Title
        </h1>

        <div className="grid gap-6">
          {/* Content grid */}
        </div>
      </div>
    </div>
  )
}
```

### DO and DON'T Examples

**DO:**
- ✅ Use `glass-card` for dashboard cards
- ✅ Use `font-decorative` for h1/h2 headings
- ✅ Use `primary` (#0ec2bc) for CTAs and links
- ✅ Use `bg-background` (#0A0F1A) for page backgrounds
- ✅ Add hover states with `glass-hover`
- ✅ Use `space-y-*` utilities for vertical rhythm

**DON'T:**
- ❌ Use solid white backgrounds (breaks cosmic theme)
- ❌ Use generic sans-serif for headings (use Cinzel)
- ❌ Use blue or purple as primary color (use turquoise)
- ❌ Nest glass effects (performance and visual issues)
- ❌ Use text shadows on body text (headings only)
- ❌ Mix Kids Ascension colors in Ozean Licht features

### Checklist for New Features

```markdown
- [ ] Used turquoise (#0ec2bc) as primary color
- [ ] Applied dark cosmic background (#0A0F1A)
- [ ] Used glass-card utilities for cards
- [ ] Applied Cinzel Decorative to h1/h2 headings
- [ ] Used Montserrat for body text
- [ ] Added hover states to interactive elements
- [ ] Tested on dark background
- [ ] No white/light backgrounds
- [ ] Spacing uses 8px base unit
- [ ] Accessible color contrast (WCAG AA)
```

---

## Design Token Reference

### Quick Copy-Paste Values

```typescript
// Colors
PRIMARY: '#0ec2bc'
BACKGROUND: '#0A0F1A'
CARD: '#1A1F2E'
BORDER: '#2A2F3E'
FOREGROUND: '#FFFFFF'
MUTED: '#64748B'

// Fonts
HEADING_DECORATIVE: 'Cinzel Decorative'
HEADING_SERIF: 'Cinzel'
HEADING_ALT: 'Montserrat Alternates'
BODY: 'Montserrat'
MONO: 'Fira Code'

// Glass Card (rgba)
GLASS_CARD_BG: 'rgba(26, 31, 46, 0.7)'
GLASS_CARD_BORDER: 'rgba(14, 194, 188, 0.25)'
GLASS_BLUR: 'blur(12px)'

// Spacing (rem)
SPACE_SM: '0.5rem'   // 8px
SPACE_MD: '1rem'     // 16px
SPACE_LG: '1.5rem'   // 24px
SPACE_XL: '2rem'     // 32px

// Border Radius
RADIUS_SM: '0.25rem' // 4px
RADIUS_MD: '0.375rem' // 6px
RADIUS_LG: '0.5rem'  // 8px
```

---

## Importing Shared Components

```typescript
// Import from shared UI library
import { Button, Card, Badge } from '@ozean-licht/shared-ui'

// Usage
<Button variant="primary">Click Me</Button>
<Card className="glass-card">Content</Card>
<Badge variant="success">Active</Badge>
```

**Note:** Shared components automatically use Ozean Licht design tokens.

---

## Browser Support

- **Modern browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Backdrop filter:** Fully supported (with -webkit- prefix)
- **CSS Grid:** Fully supported
- **CSS Variables:** Fully supported

**Fallbacks:**
- Provide solid backgrounds for browsers without `backdrop-filter`
- Use progressive enhancement for animations

---

## Accessibility

### Color Contrast

All color combinations meet **WCAG AA** standards:
- Primary (#0ec2bc) on Background (#0A0F1A): **Pass**
- Foreground (#FFFFFF) on Background (#0A0F1A): **Pass**
- Muted text (#94A3B8) on Background (#0A0F1A): **Pass**

### Focus States

Always include visible focus states:
```css
focus:outline-none focus:ring-2 focus:ring-primary
```

### Screen Readers

- Use semantic HTML (`<header>`, `<main>`, `<nav>`, `<article>`)
- Provide `aria-label` for icon-only buttons
- Use proper heading hierarchy (h1 → h2 → h3)

---

## Resources

### Documentation
- [BRANDING.md](/BRANDING.md) - Brand guidelines and asset locations
- [Shared Components](/shared/ui-components/README.md) - Component library docs
- [Admin README](/apps/admin/README.md) - Admin dashboard docs

### Design Tools
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [shadcn/ui](https://ui.shadcn.com/) - Component inspiration

### Fonts
- [Google Fonts - Cinzel Decorative](https://fonts.google.com/specimen/Cinzel+Decorative)
- [Google Fonts - Cinzel](https://fonts.google.com/specimen/Cinzel)
- [Google Fonts - Montserrat](https://fonts.google.com/specimen/Montserrat)
- [Google Fonts - Montserrat Alternates](https://fonts.google.com/specimen/Montserrat+Alternates)

---

## Version History

**v0.1.0** (2025-11-11)
- Initial design system documentation
- Unified Ozean Licht branding across admin and platform
- Documented all design tokens and patterns
- Added AI agent instructions and templates

---

**Maintained by:** Ozean Licht Platform Team + AI Agents
**Status:** Active - Single Source of Truth
**Questions:** Refer to this document first, then check BRANDING.md or component library docs
