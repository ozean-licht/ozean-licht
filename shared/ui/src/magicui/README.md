# MagicUI Components (Tier 1: Primitives)

Components imported from [MagicUI](https://magicui.design) - a collection of animated components built with React, TypeScript, Tailwind CSS, and Framer Motion.

MagicUI is part of **Tier 1: Primitives** alongside ShadCN - providing base animated components without branding.

## About MagicUI

MagicUI is a free and open-source library of 150+ animated components. We import components as-is without modification to maintain simplicity and compatibility.

## Installation

MagicUI components are installed via shadcn CLI:

```bash
npx shadcn@latest add "https://magicui.design/r/[component-name]"
```

## Current Components

- **AnimatedGradientText** - Animated gradient text effect with customizable colors and speed

## Guidelines

1. **Keep Simple** - Import components without modification
2. **Default Colors** - Use MagicUI default colors, don't override
3. **Minimal Stories** - Simple stories showing basic usage (with/without icons)
4. **Documentation** - Link to official MagicUI docs in component comments

## Usage

```typescript
import { AnimatedGradientText } from '@ozean-licht/shared-ui'

<AnimatedGradientText>
  🎉 Introducing Magic UI
</AnimatedGradientText>
```

## Resources

- **Official Site**: https://magicui.design
- **Component Docs**: https://magicui.design/docs/components
- **GitHub**: https://github.com/magicuidesign/magicui
