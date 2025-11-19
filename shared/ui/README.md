# @ozean-licht/shared-ui

**Shared UI Components and Design System for Ozean Licht Ecosystem**

Version: 0.2.0

---

## Overview

This package contains shared UI components, design tokens, and styles used across the Ozean Licht ecosystem:

- Ozean Licht Platform (`apps/ozean-licht/`)
- Admin Dashboard (`apps/admin/`)
- Any future Ozean Licht applications

**Branding:** All components use Ozean Licht design system (oceanic cyan-blue, deep ocean dark theme, glass effects).

**Exception:** Kids Ascension (`apps/kids-ascension/`) has separate branding but can use base component architecture with overridden tokens.

---

## Installation

### Within the Monorepo

```bash
# In your app's package.json
{
  "dependencies": {
    "@ozean-licht/shared-ui": "workspace:*"
  }
}

# Install
pnpm install
```

### Import Components

```typescript
// Import components
import { Button, Card, Badge, Input, Select } from '@ozean-licht/shared-ui'

// Import styles (in your app's globals.css or layout)
import '@ozean-licht/shared-ui/styles'
```

---

## Available Components

### Core Components

- **Button** - Primary, secondary, ghost, and destructive variants
- **Card** - Glass effect cards with hover states
- **Badge** - Status badges with semantic colors
- **Input** - Text inputs with focus states
- **Select** - Dropdown selects with custom styling

### Utilities

- **cn()** - Class name merger (clsx + tailwind-merge)
- Design tokens (colors, typography, spacing)
- Glass effect utilities

---

## Usage Examples

### Button

```typescript
import { Button } from '@ozean-licht/shared-ui'

// Primary button
<Button variant="primary" size="md">
  Click Me
</Button>

// Secondary button
<Button variant="secondary" size="md">
  Cancel
</Button>

// Ghost button
<Button variant="ghost" size="sm">
  Learn More
</Button>

// Destructive button
<Button variant="destructive" size="md">
  Delete
</Button>
```

### Card

```typescript
import { Card } from '@ozean-licht/shared-ui'

<Card className="p-6 space-y-4" hover>
  <h3 className="font-serif text-xl">Card Title</h3>
  <p className="text-muted-foreground">Card content goes here...</p>
  <Button variant="primary">Action</Button>
</Card>
```

### Badge

```typescript
import { Badge } from '@ozean-licht/shared-ui'

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Inactive</Badge>
<Badge variant="info">New</Badge>
```

### Input

```typescript
import { Input } from '@ozean-licht/shared-ui'

<Input
  type="text"
  placeholder="Enter your name..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

<Input
  type="email"
  placeholder="Enter your email..."
  required
/>
```

### Select

```typescript
import { Select } from '@ozean-licht/shared-ui'

<Select value={value} onChange={(e) => setValue(e.target.value)}>
  <option value="">Select an option</option>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</Select>
```

---

## Design Tokens

### Import Tokens

```typescript
import { colors, typography, spacing, animations } from '@ozean-licht/shared-ui/tokens'

// Use in components
const primaryColor = colors.primary.DEFAULT  // '#0ec2bc'
const headingFont = typography.fonts.decorative  // 'Cinzel Decorative'
const cardPadding = spacing[6]  // '1.5rem' (24px)
```

### Available Tokens

**Colors:**
- `colors.primary` - Oceanic cyan palette (50-900)
- `colors.background` - Deep ocean dark background (#00070F)
- `colors.secondaryBackground` - Secondary background for badges (#000F1F)
- `colors.card` - Card background (#00111A)
- `colors.border` - Border color (#0E282E)
- `colors.mutedAccent` - Muted accent for buttons (#055D75)
- `colors.semantic` - Success, warning, destructive, info

**Typography:**
- `typography.fonts` - Font family definitions
- `typography.sizes` - Font size scale
- `typography.weights` - Font weights

**Spacing:**
- `spacing` - 8px base unit scale (0-24)

**Animations:**
- `animations.glow` - Pulsing glow effect
- `animations.float` - Floating animation
- `animations.shine` - Shimmer effect

---

## Glass Effect Utilities

All components support Ozean Licht's signature glass morphism effect:

```typescript
// Apply glass effect to any element
<div className="glass-card rounded-lg p-6">
  Content with standard glass effect
</div>

// Strong glass effect
<div className="glass-card-strong rounded-lg p-8">
  Important content with stronger glass effect
</div>

// Subtle glass effect
<div className="glass-subtle rounded-lg p-4">
  Background content with subtle glass effect
</div>

// Add hover glow
<div className="glass-card glass-hover rounded-lg p-6">
  Interactive card with hover glow
</div>
```

---

## Styling with Tailwind

All components are built with Tailwind CSS and support className prop:

```typescript
<Button
  variant="primary"
  className="w-full mt-4 animate-glow"
>
  Custom Styled Button
</Button>

<Card
  className="glass-card-strong rounded-lg p-8 space-y-6"
  hover
>
  <h2 className="font-decorative text-3xl">
    Custom Card
  </h2>
</Card>
```

---

## Typography Classes

### Heading Classes

```typescript
<h1 className="font-decorative text-4xl">
  Main Page Title
</h1>

<h2 className="font-decorative text-3xl">
  Section Heading
</h2>

<h3 className="font-decorative text-2xl">
  Subsection Heading
</h3>

<h4 className="font-serif text-xl">
  Card Title
</h4>

<h5 className="font-alt text-lg">
  Component Title
</h5>
```

### Body Text Classes

```typescript
<p className="body-l">
  Large body text (18px)
</p>

<p className="body-m">
  Medium body text (16px)
</p>

<p className="body-s">
  Small body text (14px)
</p>
```

---

## Theming

### Default Theme (Ozean Licht)

All components use Ozean Licht theme by default:
- Primary: Oceanic Cyan (#0ec2bc)
- Background: Deep Ocean Dark (#00070F)
- Card Background: #00111A
- Muted Accent: #055D75
- Paragraph Text: #C4C8D4
- Glass effects enabled
- Cinzel Decorative + Montserrat fonts

### Overriding for Kids Ascension

If using in Kids Ascension app, override tokens:

```typescript
// In your tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B6B',  // Kids Ascension red
          // ... other shades
        },
        background: '#FFFFFF',  // Light background
      },
      fontFamily: {
        decorative: ['Comic Sans MS', 'cursive'],  // Kid-friendly font
      }
    }
  }
}
```

---

## Development

### Building the Library

```bash
# Build once
pnpm build

# Watch mode (for development)
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Clean build artifacts
pnpm clean
```

### Adding New Components

1. Create component in `src/components/`
2. Export from `src/components/index.ts`
3. Update main `src/index.ts` export
4. Build and test in consuming apps
5. Document usage in this README

**Example:**

```typescript
// src/components/MyComponent.tsx
import { cn } from '@/utils/cn'

export interface MyComponentProps {
  className?: string
  children: React.ReactNode
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn('glass-card rounded-lg p-6', className)}>
      {children}
    </div>
  )
}

// src/components/index.ts
export { MyComponent } from './MyComponent'

// src/index.ts
export { MyComponent } from './components'
```

---

## File Structure

```
shared/ui-components/
├── src/
│   ├── components/          # React components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── index.ts
│   ├── tokens/              # Design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── animations.ts
│   │   └── index.ts
│   ├── styles/              # Global styles
│   │   └── globals.css
│   ├── utils/               # Utility functions
│   │   ├── cn.ts
│   │   └── index.ts
│   └── index.ts             # Main export
├── dist/                    # Build output
├── package.json
├── tsconfig.json
└── README.md
```

---

## Design System Reference

For complete design system documentation, see:
- [Design System](/design-system.md) - Complete design tokens and patterns
- [Branding Guidelines](/BRANDING.md) - Brand identity and usage rules

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All modern browsers with CSS Grid, CSS Variables, and `backdrop-filter` support.

---

## Contributing

1. Follow Ozean Licht design system guidelines
2. Use TypeScript for all components
3. Include proper TypeScript types
4. Test components in both admin and platform apps
5. Document props and usage examples
6. Ensure accessibility (WCAG AA)

---

## License

**UNLICENSED** - Private package for Ozean Licht Ecosystem

---

## Changelog

### v0.2.0 (2025-11-16)

**Design System Alignment - Color Correction**
- ✅ Updated primary color: #0EA6C1 → #0ec2bc (oceanic cyan)
- ✅ Updated background: #0A0F1A → #00070F (deep ocean dark)
- ✅ Updated card background: #1A1F2E → #00111A
- ✅ Updated border color: #2A2F3E → #0E282E
- ✅ Added secondary background color: #000F1F (badges, spans)
- ✅ Added muted accent color: #055D75 (buttons)
- ✅ Added specific paragraph color: #C4C8D4
- ✅ Corrected branding from "turquoise" to "oceanic cyan-blue"
- ✅ All colors now match true Ozean Licht branding

### v0.1.0 (2025-11-11)

**Initial Release**
- Core components: Button, Card, Badge, Input, Select
- Design tokens: colors, typography, spacing, animations
- Glass effect utilities
- Global styles with cosmic theme
- TypeScript support
- Full Ozean Licht branding integration

---

**Maintained by:** Ozean Licht Platform Team + AI Agents
**Questions:** See `/design-system.md` or create issue in repository
