# Ozean Licht Design System

**Version:** 2.0.0
**Last Updated:** 2025-11-16
**Status:** Official - Single Source of Truth

---

## Overview

This is the **official design system** for the Ozean Licht ecosystem:
- ✅ Admin Dashboard (`apps/admin/`)
- ✅ Ozean Licht Platform (`apps/ozean-licht/`)
- ✅ Shared UI Components (`shared/ui/`)
- ❌ **NOT** Kids Ascension (separate branding)

---

## Design Philosophy

**Oceanic Depth** - Deep water mystery through:
1. Very dark blue-black backgrounds
2. Turquoise accent color (#0ec2bc)
3. Glass morphism effects
4. Elegant typography (Cinzel Decorative sparingly)
5. Subtle animations (glow, float)

---

## Colors

### Core Palette

```typescript
// Backgrounds
background: '#00070F',           // Main background (deep ocean)
secondaryBackground: '#000F1F',  // Badges, spans, highlights
card: '#00111A',                 // Card background

// Accents
primary: '#0ec2bc',             // Main accent (turquoise)
mutedAccent: '#055D75',         // Buttons, secondary actions

// Borders
border: '#0E282E',              // Card borders, dividers

// Text
heading: '#fff',                // Headings (h1-h6)
paragraph: '#C4C8D4',           // Body text, paragraphs
```

### Primary Color - Turquoise

```typescript
primary: {
  DEFAULT: '#0ec2bc',           // Main brand color
  50:  '#E6F9F8',
  100: '#CCF3F1',
  200: '#99E7E3',
  300: '#66DBD5',
  400: '#33CFC7',
  500: '#0ec2bc',               // Base
  600: '#0B9B96',
  700: '#087470',
  800: '#055D75',               // Muted accent
  900: '#033B4D',
  foreground: '#fff',
}
```

### Semantic Colors

```typescript
destructive: '#EF4444',         // Red - errors, delete
success: '#10B981',             // Green - success
warning: '#F59E0B',             // Amber - warnings
info: '#3B82F6',                // Blue - info
```

---

## Typography

### Font Families

```css
--font-decorative: 'Cinzel Decorative', Georgia, serif;
--font-sans: 'Montserrat', system-ui, -apple-system, sans-serif;
--font-alt: 'Montserrat Alternates', Montserrat, sans-serif;
--font-mono: 'Fira Code', 'Courier New', monospace;
```

### Font Usage Rules

**1. Cinzel Decorative** - Use SPARINGLY
- H1, H2 only (hero titles, section headings)
- Weight: 400 (Regular) ONLY - never bold
- Special case: Course card titles

**2. Montserrat** - Main font
- H3, H4 headings
- Body text, UI elements, buttons
- Weights: 300 (Light), 400 (Regular), 500-600 (Medium)
- **NEVER use bold (700+)** - Medium (500-600) is the maximum weight

**3. Montserrat Alternates** - Labels
- H5, H6 (small headings, labels)
- Captions, metadata, badges
- Weights: 400-600 (Regular to Medium)
- **NEVER use bold (700+)** - Medium (600) is the maximum weight

### Font Weight Guidelines

**Important:** We use a subtle, elegant typographic hierarchy:
- Light (300): Body text, descriptions
- Regular (400): Headings, UI elements
- Medium (500-600): Emphasis, active states, labels
- **Bold (700+): NEVER USE** - Too heavy for our design aesthetic

### Typography Scale

```
H1: Cinzel Decorative, 3rem-4rem (48-64px), Regular (400), color: #fff
H2: Cinzel Decorative, 2.25rem-3rem (36-48px), Regular (400), color: #fff
H3: Montserrat, 1.875rem-2.25rem (30-36px), Regular (400), color: #fff
H4: Montserrat, 1.5rem-1.875rem (24-30px), Regular (400), color: #fff
H5: Montserrat Alternates, 1.25rem-1.5rem (20-24px), Regular (400), color: #fff
H6: Montserrat Alternates, 1rem-1.25rem (16-20px), Regular (400), color: #fff

Body: Montserrat, 1rem (16px), Light (300), color: #C4C8D4
```

**Text Shadows (H1, H2 only):**
```css
h1 { text-shadow: 0 0 8px rgba(255, 255, 255, 0.6); }
h2 { text-shadow: 0 0 8px rgba(255, 255, 255, 0.42); }
```

---

## Icons & Visual Elements

### Icon Usage Guidelines

**Use SVG Icons (not emojis) for:**
- ✅ UI components (buttons, menus, navigation)
- ✅ Interactive elements (triggers, actions)
- ✅ Status indicators
- ✅ Form inputs and controls
- ✅ Data tables and lists

**Why SVG icons:**
- Single-color theming with primary color (`text-primary`)
- Scalable without quality loss
- Consistent styling across platforms
- Accessible with proper ARIA labels
- Professional appearance

**Emojis are acceptable for:**
- ✅ User-generated content (comments, posts)
- ✅ Chat messages
- ✅ Documentation examples (sparingly)
- ✅ Marketing content (occasionally)

**Emojis should NEVER be used in:**
- ❌ UI components (buttons, triggers, menu items)
- ❌ Navigation elements
- ❌ Form controls
- ❌ Data displays
- ❌ System messages

### Icon Styling

**Standard Icon Pattern:**
```tsx
// Single-color SVG icon in primary color
const SettingsIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
  </svg>
)

// Usage in component
<Button>
  <SettingsIcon />
  Settings
</Button>
```

**Icon Sizes:**
- `w-4 h-4` (16px) - Buttons, inline text
- `w-5 h-5` (20px) - Navigation, larger buttons
- `w-6 h-6` (24px) - Headers, prominent actions

**Icon Colors:**
- Primary actions: `text-primary` (#0ec2bc)
- Neutral elements: `text-[#C4C8D4]`
- Active states: `text-white`
- Destructive actions: `text-red-400`

---

## Glass Morphism

### Card Variants

```css
/* Standard glass card */
.glass-card {
  background: rgba(0, 17, 26, 0.7);         /* #00111A with 70% opacity */
  backdrop-filter: blur(12px);
  border: 1px solid rgba(14, 166, 193, 0.25);  /* primary/25 */
}

/* Strong emphasis */
.glass-card-strong {
  background: rgba(0, 17, 26, 0.8);         /* #00111A with 80% opacity */
  backdrop-filter: blur(16px);
  border: 1px solid rgba(14, 166, 193, 0.3);   /* primary/30 */
}

/* Subtle background */
.glass-subtle {
  background: rgba(0, 17, 26, 0.5);         /* #00111A with 50% opacity */
  backdrop-filter: blur(8px);
  border: 1px solid rgba(14, 166, 193, 0.15);  /* primary/15 */
}

/* Hover effect */
.glass-hover:hover {
  border-color: rgba(14, 166, 193, 0.4);       /* primary/40 */
  box-shadow: 0 0 20px rgba(14, 166, 193, 0.15);
}
```

---

## Effects & Animations

### Glow Effects

```css
/* Subtle glow */
.glow-subtle {
  box-shadow: 0 0 12px rgba(14, 166, 193, 0.15);
}

/* Standard glow */
.glow {
  box-shadow: 0 0 20px rgba(14, 166, 193, 0.22);
}

/* Strong glow */
.glow-strong {
  box-shadow: 0 0 30px rgba(14, 166, 193, 0.35);
}
```

### Animations

```css
/* Glow pulse */
@keyframes glow {
  0% { box-shadow: 0 0 20px rgba(14, 166, 193, 0.3); }
  100% { box-shadow: 0 0 30px rgba(14, 166, 193, 0.6); }
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
muted: 'bg-mutedAccent hover:bg-mutedAccent/90 text-white'
ghost: 'text-primary hover:bg-primary/10'
destructive: 'bg-destructive text-white hover:bg-destructive/90'
outline: 'border border-border hover:bg-accent'
link: 'text-primary underline-offset-4 hover:underline'
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

### Common Patterns

```css
/* Page container */
.container-page {
  container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12
}

/* Vertical spacing */
.stack-tight { space-y-2 }          /* 8px */
.stack-normal { space-y-4 }         /* 16px */
.stack-loose { space-y-6 }          /* 24px */
.stack-very-loose { space-y-8 }     /* 32px */

/* Grid layouts */
.grid-cards { grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 }
```

---

## Accessibility

### Color Contrast (WCAG AA)

All combinations meet WCAG AA standards:
- Turquoise (#0ec2bc) on Dark (#00070F): **4.5:1** ✅
- White (#fff) on Dark (#00070F): **21:1** ✅ (AAA)
- Paragraph (#C4C8D4) on Dark (#00070F): **8.2:1** ✅ (AAA)

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

## Quick Reference

### Tailwind Classes

```css
/* Fonts */
font-decorative  → Cinzel Decorative (H1, H2 ONLY)
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
bg-primary        → Oceanic cyan background
text-primary      → Oceanic cyan text
bg-[#055D75]      → Muted accent background
bg-[#000F1F]      → Secondary background (badges)

bg-background     → Deep ocean dark (#00070F)
bg-card           → Card background (#00111A)
text-[#fff]       → Headings
text-[#C4C8D4]    → Paragraphs
border-[#0E282E]  → Borders
```

---

## Design Checklist

When creating components, ensure:

**Colors & Styling:**
- [ ] Uses correct colors (#0ec2bc primary, #00070F background)
- [ ] Glass morphism for elevated surfaces
- [ ] Glow effects on hover (with primary color opacity)
- [ ] Active state scaling (`active:scale-95`)
- [ ] Focus ring with primary color

**Typography:**
- [ ] Cinzel Decorative used SPARINGLY (H1, H2 only)
- [ ] Montserrat for body text with Light (300) weight
- [ ] Paragraph text uses #C4C8D4
- [ ] Regular weight (400) for Cinzel Decorative
- [ ] **NEVER use bold (700+)** - Medium (500-600) max
- [ ] Font weights: Light (300), Regular (400), Medium (500-600) only

**Icons & Visual Elements:**
- [ ] SVG icons in UI components (not emojis)
- [ ] Icons use `text-primary` color for theming
- [ ] Emojis only in content, NEVER in UI components
- [ ] Icon sizes: w-4 (16px) for buttons, w-5 (20px) for nav

**Accessibility & Responsiveness:**
- [ ] WCAG AA contrast compliance
- [ ] Responsive design (mobile-first)
- [ ] Reduced motion support
- [ ] Proper ARIA labels on icons

---

**Status:** Official - All applications must follow these guidelines
**Maintained by:** Ozean Licht Platform Team
**Version:** 2.1.0 (2025-11-19)

---

## Changelog

### v2.1.0 (2025-11-19)
- ✅ Added comprehensive icon usage guidelines
- ✅ Clarified: SVG icons for UI components, emojis NEVER in UI
- ✅ Updated font weight guidelines: NEVER use bold (700+), Medium (500-600) max
- ✅ Added icon styling patterns and examples
- ✅ Updated design checklist with icon and typography rules

### v2.0.0 (2025-11-16)
- ✅ Initial official design system documentation
- ✅ Core color palette and typography rules
- ✅ Glass morphism effects and animations
