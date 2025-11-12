# Design Tokens

This directory contains the design tokens for the Ozean Licht ecosystem, built with Style Dictionary.

## Overview

Design tokens are the single source of truth for all design decisions in the Ozean Licht ecosystem. They ensure consistency across all applications and make design updates easier.

## File Structure

```
tokens/
├── design-tokens.json   # Source of truth (edit this file)
├── sd.config.js         # Style Dictionary configuration
├── build-tokens.js      # Legacy build script
└── build/               # Generated files (DO NOT EDIT)
    ├── css/
    │   └── variables.css      # CSS custom properties
    ├── js/
    │   ├── tokens.js          # JavaScript exports
    │   └── tokens.d.ts        # TypeScript declarations
    └── json/
        └── tokens.json        # Flat JSON format
```

## Making Changes

### 1. Edit Source Tokens

Edit `design-tokens.json` to add or modify tokens:

```json
{
  "ozean-licht": {
    "color": {
      "primary": {
        "500": {
          "value": "#0ec2bc",
          "type": "color",
          "description": "Base turquoise - Ozean Licht signature color"
        }
      }
    }
  }
}
```

### 2. Build Tokens

Run the build command to generate CSS/JS/JSON files:

```bash
npm run build:tokens
```

This generates:
- `build/css/variables.css` - CSS custom properties (imported in Storybook)
- `build/js/tokens.js` - JavaScript exports
- `build/js/tokens.d.ts` - TypeScript type definitions
- `build/json/tokens.json` - Flat JSON format

### 3. Commit Changes

Commit both the source file and generated files:

```bash
git add tokens/design-tokens.json tokens/build/
git commit -m "feat(tokens): update primary color shade"
```

## Using Tokens

### In CSS/SCSS

```css
.my-component {
  background-color: var(--ozean-licht-color-primary-500);
  padding: var(--ozean-licht-spacing-4);
  border-radius: var(--ozean-licht-border-radius-lg);
}
```

### In JavaScript/TypeScript

```tsx
import tokens from '../tokens/build/js/tokens.js';

const MyComponent = () => (
  <div style={{
    backgroundColor: tokens.ozeanLicht.color.primary['500'],
    padding: tokens.ozeanLicht.spacing['4'],
  }}>
    Content
  </div>
);
```

### In Tailwind Config

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'var(--ozean-licht-color-primary-500)',
          // ... other shades
        },
      },
    },
  },
};
```

## Token Categories

### Colors
- **Primary**: Turquoise (#0ec2bc) with 9 shades (50-900)
- **Background**: Cosmic dark (#0A0F1A), card (#1A1F2E)
- **Foreground**: White, muted, tertiary text colors
- **Border**: Default and primary accent borders
- **Semantic**: Success, warning, destructive, info
- **Glass**: Glass morphism effect backgrounds

### Typography
- **Font Families**: Cinzel Decorative, Cinzel, Montserrat, Montserrat Alternates, Fira Code
- **Font Sizes**: xs (12px) to 6xl (64px)
- **Font Weights**: light (300) to black (900)
- **Line Heights**: tight, normal, relaxed

### Spacing
- 13 values based on 8px base unit (0-24 scale, 0px-96px)

### Border Radius
- 6 values: none, sm, md, lg, xl, full

### Shadows
- Standard: sm, md, lg
- Glow effects: glow, glow-strong

### Blur Effects
- Glass morphism: glass, glass-strong, glass-subtle

### Animations
- Durations: fast (150ms), normal (200ms), slow (300ms)
- Easing: ease-in-out, ease-out, ease-in

## Naming Convention

Tokens follow this naming pattern:

```
--ozean-licht-{category}-{subcategory}-{variant}
```

Examples:
- `--ozean-licht-color-primary-500`
- `--ozean-licht-spacing-4`
- `--ozean-licht-font-size-xl`
- `--ozean-licht-border-radius-lg`

## Best Practices

### DO ✅
- Use tokens instead of hardcoded values
- Edit only `design-tokens.json`, never generated files
- Rebuild tokens after changes (`npm run build:tokens`)
- Commit both source and generated files
- Document new tokens with descriptions

### DON'T ❌
- Don't edit files in `build/` directory directly
- Don't use hardcoded colors/spacing in components
- Don't create component-specific tokens (keep them semantic)
- Don't forget to rebuild after editing tokens

## Integration

Tokens are automatically integrated into Storybook via `.storybook/preview.ts`:

```tsx
import '../tokens/build/css/variables.css';
```

This makes all CSS variables available to all stories.

## Resources

- [Style Dictionary Documentation](https://amzn.github.io/style-dictionary/)
- [Design Tokens W3C Community Group](https://www.w3.org/community/design-tokens/)
- [Ozean Licht Branding Guide](/BRANDING.md)
- [Design System Documentation](/design-system.md)

---

**Maintained by**: Ozean Licht Platform Team
**Last Updated**: 2025-11-12
**Version**: 1.0.0
