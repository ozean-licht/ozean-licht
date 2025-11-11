# Plan: Phase 3 - Tier 2 Branded Components

## Task Description

Implement Phase 3 of the Shared UI Components upgrade plan by creating Ozean Licht branded wrapper components that extend shadcn/ui primitives with the Ozean Licht design system (turquoise branding, glass morphism, cosmic theme, glow effects).

This phase transforms the base Tier 1 primitives (47 shadcn + 11 Catalyst components) into production-ready Tier 2 branded components that are the default import from `@ozean-licht/shared-ui`.

## Objective

Create 20+ Ozean Licht branded components that:
- Extend shadcn/ui primitives (NOT create from scratch)
- Use CSS variables instead of hardcoded colors
- Apply glass morphism, glow effects, and cosmic theme
- Support all existing variants plus new Ozean Licht-specific variants
- Export as default from `@ozean-licht/shared-ui`
- Enable easy migration from ozean-licht app components

## Problem Statement

Currently, the `/src/components/` directory contains basic branded components that:
1. Use hardcoded class names (`btn-base`) and Tailwind classes directly
2. Don't consistently use CSS variables from design tokens
3. Lack proper glass morphism and glow effects
4. Don't extend shadcn primitives properly
5. Missing key variants needed in production (e.g., "cta" button)

The ozean-licht app has ~80 custom components with Ozean Licht styling that should be consolidated into the shared library.

## Solution Approach

**Strategy: Extend, Don't Replace**
1. Import shadcn primitive (Tier 1)
2. Wrap with Ozean Licht styling using Class Variance Authority (CVA)
3. Add new variants specific to Ozean Licht brand
4. Use CSS variables for all colors (enables theme switching later)
5. Apply glass morphism and glow effects via utility classes
6. Export from `/src/components/index.ts` as Tier 2

**Design Token Integration:**
- Colors: Use `var(--primary)`, `var(--background)`, etc.
- Effects: Apply `.glass-card`, `.glow`, `.text-glow-primary` utilities
- Typography: Use `var(--font-decorative)`, `var(--font-sans)`, etc.
- Animations: Reference keyframes from globals.css

**Migration Path:**
- Phase 3a (Week 1): Core 5 components (Button, Card, Input, Dialog, Badge)
- Phase 3b (Week 2): Form components (Select, Checkbox, Radio, Switch, Textarea)
- Phase 3c (Week 3): Navigation components (Header, Footer, Nav)
- Phase 3d (Week 4): Data display (Table, Avatar, Accordion, Tabs)
- Phase 3e (Week 5): Feedback (Toast, Alert, Progress)

## Relevant Files

**Design System Foundation:**
- `/shared/ui-components/src/styles/globals.css` - CSS variables, glass morphism utilities, animations
- `/shared/ui-components/src/tokens/ozean-licht/colors.ts` - Color design tokens
- `/shared/ui-components/src/tokens/ozean-licht/effects.ts` - Glass effects, shadows, animations
- `/shared/ui-components/src/tokens/ozean-licht/typography.ts` - Font tokens
- `/shared/ui-components/src/utils/cn.ts` - Class name utility (tailwind-merge)

**Tier 1 Primitives to Extend:**
- `/shared/ui-components/src/ui/button.tsx` - Base Button from shadcn
- `/shared/ui-components/src/ui/card.tsx` - Base Card from shadcn
- `/shared/ui-components/src/ui/input.tsx` - Base Input from shadcn
- `/shared/ui-components/src/ui/dialog.tsx` - Base Dialog from shadcn
- `/shared/ui-components/src/ui/badge.tsx` - Base Badge from shadcn
- `/shared/ui-components/src/ui/select.tsx` - Base Select from shadcn
- `/shared/ui-components/src/ui/checkbox.tsx` - Base Checkbox from shadcn
- `/shared/ui-components/src/ui/textarea.tsx` - Base Textarea from shadcn

**Existing Branded Components (to improve):**
- `/shared/ui-components/src/components/Button.tsx` - Current implementation (needs refactor)
- `/shared/ui-components/src/components/Card.tsx` - Current implementation (needs refactor)
- `/shared/ui-components/src/components/Badge.tsx` - Current implementation (needs refactor)
- `/shared/ui-components/src/components/Input.tsx` - Current implementation (needs refactor)
- `/shared/ui-components/src/components/Select.tsx` - Current implementation (needs refactor)

**Export Configuration:**
- `/shared/ui-components/src/components/index.ts` - Tier 2 exports
- `/shared/ui-components/src/index.ts` - Main package entry (exports from components)
- `/shared/ui-components/package.json` - Package exports configuration

**Components to Migrate:**
- `/apps/ozean-licht/components/cta-button.tsx` - Migrate to Button variant="cta"
- `/apps/ozean-licht/components/layout/badge.tsx` - Migrate to Badge with glow
- `/apps/ozean-licht/components/layout/header.tsx` - Extract reusable patterns
- `/apps/ozean-licht/components/layout/footer.tsx` - Extract reusable patterns

### New Files

New components to create in `/shared/ui-components/src/components/`:
- `Dialog.tsx` - Branded dialog with glass background
- `Checkbox.tsx` - Branded checkbox with turquoise accent
- `RadioGroup.tsx` - Branded radio group
- `Switch.tsx` - Branded switch component
- `Textarea.tsx` - Branded textarea
- `Alert.tsx` - Branded alert component
- `Toast.tsx` - Branded toast notifications
- `Progress.tsx` - Branded progress bar
- `Avatar.tsx` - Branded avatar component
- `Tabs.tsx` - Branded tabs component
- `Accordion.tsx` - Branded accordion
- `Table.tsx` - Branded table (may use Catalyst)
- `Tooltip.tsx` - Branded tooltip
- `Popover.tsx` - Branded popover
- `DropdownMenu.tsx` - Branded dropdown

## Implementation Phases

### Phase 1: Foundation (1 hour)
1. **Audit existing components** - Review current `/src/components/` implementations
2. **Setup CVA patterns** - Establish Class Variance Authority patterns
3. **Document design tokens** - Create quick reference guide for CSS variables
4. **Create template** - Build reusable component template with best practices

### Phase 2: Core Implementation (3 hours)
1. **Refactor Button** - Add cta variant, glow effects, extend shadcn Button
2. **Refactor Card** - Apply glass morphism, create GlassCard wrapper
3. **Refactor Input** - Add turquoise focus ring, glass background
4. **Create Dialog** - Modal with glass backdrop and cosmic theme
5. **Refactor Badge** - Add glow effect, arrow icon variant

### Phase 3: Integration & Polish (1 hour)
1. **Update exports** - Ensure all components export correctly from index.ts
2. **Test imports** - Validate all import paths work as expected
3. **Build verification** - Run TypeScript compilation and build
4. **Create examples** - Document usage examples in README
5. **Migration guide** - Write guide for migrating ozean-licht components

## Step by Step Tasks

### 1. Audit and Prepare

- Read all existing components in `/src/components/`
- Identify which use CSS variables vs hardcoded values
- Document patterns to keep and patterns to change
- Create a checklist of design token replacements needed
- Review shadcn primitives in `/src/ui/` to understand base implementations

### 2. Create Component Template and Guidelines

- Create `/src/components/_TEMPLATE.tsx` with best practices:
  - Import shadcn primitive
  - Use CVA for variant management
  - Use CSS variables exclusively
  - Apply glass/glow utilities where appropriate
  - Include JSDoc comments
  - Export types alongside components
- Document the template usage in `/src/components/README.md`
- List all CSS variables available for use
- List all utility classes from globals.css

### 3. Refactor Button Component

- Extend shadcn `Button` from `/src/ui/button.tsx`
- Replace hardcoded colors with CSS variables:
  - `bg-primary` → `bg-[var(--primary)]`
  - `text-primary-foreground` → `text-[var(--primary-foreground)]`
- Add new "cta" variant with gradient and glow:
  ```tsx
  cta: 'bg-gradient-to-r from-primary via-[#0FA8A3] to-primary border-2 border-primary/50 hover:shadow-xl glow'
  ```
- Add size variants: xs, sm, md, lg, xl
- Add `glow` prop for glow effect
- Add `icon` and `iconAfter` props for icons
- Add `loading` state with spinner
- Update JSDoc comments with usage examples
- Export ButtonProps type

### 4. Create GlassCard Component

- Extend shadcn `Card` from `/src/ui/card.tsx`
- Add `glass` prop (default: true) to apply `.glass-card`
- Add glass variants via CVA:
  - `standard` → `.glass-card`
  - `strong` → `.glass-card-strong`
  - `subtle` → `.glass-subtle`
- Add `hover` prop to apply `.glass-hover`
- Add `glow` prop to add glow on hover
- Keep CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- All sub-components should inherit glass styling
- Export all card components and types

### 5. Refactor Input Component

- Extend shadcn `Input` from `/src/ui/input.tsx`
- Apply `.input-base` utility class
- Add turquoise focus ring using CSS variable:
  ```tsx
  focus:ring-[var(--ring)]
  ```
- Add glass background option via `glass` prop
- Add icon support (leftIcon, rightIcon)
- Create matching Textarea component
- Create matching Label component
- Export InputProps, TextareaProps, LabelProps

### 6. Create Dialog Component

- Extend shadcn `Dialog` from `/src/ui/dialog.tsx`
- Apply glass morphism to DialogContent:
  ```tsx
  className="glass-card-strong"
  ```
- Add cosmic backdrop overlay
- Add glow to dialog border on focus
- Support all shadcn Dialog sub-components
- Add animation variants (slide, fade, scale)
- Export DialogProps and all sub-component types

### 7. Refactor Badge Component

- Extend shadcn `Badge` from `/src/ui/badge.tsx`
- Add glow effect via `.glow-subtle`
- Add arrow icon variant (optional ArrowRight icon)
- Add colorful variant with gradient background
- Use CSS variables for all colors
- Add size variants: sm, md, lg
- Support dot indicator option
- Export BadgeProps type

### 8. Create Additional Form Components

**Checkbox:**
- Extend shadcn Checkbox
- Turquoise check color using `var(--primary)`
- Glow on focus state
- Support indeterminate state

**RadioGroup:**
- Extend shadcn RadioGroup
- Turquoise selected state
- Glow on focus

**Switch:**
- Extend shadcn Switch
- Turquoise active state
- Glass background
- Smooth animation

**Select:**
- Already exists but needs refactor
- Apply glass to dropdown menu
- Turquoise selected state
- Smooth animations

### 9. Create Feedback Components

**Alert:**
- Extend shadcn Alert
- Glass background variants
- Color-coded borders (success, warning, error, info)
- Glow effect for important alerts
- Icon support

**Toast:**
- Extend shadcn Toast (Sonner)
- Glass background
- Glow effect
- Color-coded variants
- Smooth slide-in animation

**Progress:**
- Extend shadcn Progress
- Turquoise progress bar
- Glow effect on progress
- Animated gradient option

### 10. Create Navigation Components

**Tabs:**
- Extend shadcn Tabs
- Glass background for tab panel
- Turquoise active state
- Glow on hover
- Smooth transition

**Accordion:**
- Extend shadcn Accordion
- Glass background
- Turquoise expand indicator
- Smooth accordion-down/up animations
- Glow on focus

### 11. Create Data Display Components

**Avatar:**
- Extend shadcn Avatar
- Glow effect for active users
- Border with primary color
- Status indicator support

**Table:**
- Consider using Catalyst Table instead of shadcn
- Glass background for rows
- Hover glow effect
- Striped rows option
- Turquoise selected state

**Tooltip:**
- Extend shadcn Tooltip
- Glass background
- Glow effect
- Smooth fade animation

**Popover:**
- Extend shadcn Popover
- Glass background
- Glow border
- Smooth scale animation

**DropdownMenu:**
- Extend shadcn DropdownMenu
- Glass background
- Turquoise selected state
- Smooth animations

### 12. Update Export Configuration

- Update `/src/components/index.ts` to export all new components
- Ensure all types are exported alongside components
- Verify package.json exports point to correct paths
- Update main `/src/index.ts` to re-export from components

### 13. Create Migration Guide

- Document import path changes:
  ```tsx
  // Before (ozean-licht app)
  import { Button } from "@/components/ui/button"
  import { CtaButton } from "@/components/cta-button"

  // After (shared-ui)
  import { Button } from "@ozean-licht/shared-ui"
  // Use: <Button variant="cta">
  ```
- List all components available
- Show variant examples for each component
- Document prop changes
- Provide migration checklist

### 14. Documentation and Examples

- Update `/shared/ui-components/README.md` with:
  - All available components
  - Import examples
  - Variant showcases
  - Design token reference
  - Utility class reference
- Create usage examples for each component
- Document theming approach
- Add troubleshooting section

### 15. Build and Test

- Run TypeScript compilation: `pnpm typecheck`
- Build the package: `pnpm build`
- Verify dist/ output has all components
- Test imports in admin app:
  ```tsx
  import { Button, Card, Badge } from '@ozean-licht/shared-ui'
  ```
- Check for any TypeScript errors
- Verify tree-shaking works correctly

### 16. Validate Component Quality

**For each component, verify:**
- [ ] Extends shadcn primitive (not created from scratch)
- [ ] Uses CSS variables exclusively (no hardcoded colors)
- [ ] Applies appropriate glass morphism utilities
- [ ] Includes glow effects where appropriate
- [ ] Has proper TypeScript types
- [ ] Exports component and props type
- [ ] Includes JSDoc comments
- [ ] Follows CVA pattern for variants
- [ ] Supports all shadcn variants
- [ ] Adds Ozean Licht-specific variants
- [ ] Works with ref forwarding
- [ ] Accessible (ARIA attributes)

## Testing Strategy

**Manual Testing:**
1. **Visual Testing** - Render each component with all variants
   - Verify glass morphism appears correctly
   - Check glow effects on hover/focus
   - Test dark mode compatibility
   - Verify animations are smooth

2. **Integration Testing** - Use components in admin app
   - Import from `@ozean-licht/shared-ui`
   - Test all variants in real UI
   - Verify styling matches design system
   - Check responsive behavior

3. **Accessibility Testing**
   - Keyboard navigation works
   - Focus indicators visible
   - ARIA attributes present
   - Screen reader compatible

**Unit Testing (Future):**
- Test variant class combinations (CVA)
- Test prop forwarding to shadcn primitives
- Test ref forwarding
- Test accessibility attributes

**Edge Cases:**
- Very long text in buttons
- Empty card content
- Disabled states
- Loading states
- Error states
- Extreme viewport sizes

## Acceptance Criteria

**Quantitative:**
- [ ] 20+ branded components created in `/src/components/`
- [ ] All components use CSS variables (0 hardcoded colors)
- [ ] All components extend shadcn primitives
- [ ] TypeScript compilation succeeds (0 errors)
- [ ] Package builds successfully
- [ ] All components export correctly
- [ ] Tree-shaking verified (bundle size analysis)

**Qualitative:**
- [ ] Consistent Ozean Licht branding (turquoise, glass, cosmic)
- [ ] Glass morphism applied where appropriate
- [ ] Glow effects enhance visual hierarchy
- [ ] Smooth animations and transitions
- [ ] Components feel premium and polished
- [ ] Easy to use and well-documented
- [ ] Accessible (keyboard navigation, focus states)
- [ ] Responsive on all screen sizes

**Migration Ready:**
- [ ] Migration guide created
- [ ] Example usage documented
- [ ] Admin app can import successfully
- [ ] No breaking changes for existing users
- [ ] Backward compatibility maintained

## Validation Commands

Execute these commands to validate the work:

**TypeScript Compilation:**
```bash
cd /opt/ozean-licht-ecosystem/shared/ui-components
pnpm typecheck
# Expected: No TypeScript errors
```

**Build Package:**
```bash
cd /opt/ozean-licht-ecosystem/shared/ui-components
pnpm build
# Expected: dist/ folder created with all components
```

**Verify Exports:**
```bash
cd /opt/ozean-licht-ecosystem/shared/ui-components
ls -la dist/components/
# Expected: All component files present
```

**Check Import Paths:**
```bash
# From admin app
cd /opt/ozean-licht-ecosystem/apps/admin
# Add to test file:
# import { Button, Card, Badge } from '@ozean-licht/shared-ui'
pnpm typecheck
# Expected: No import errors
```

**Bundle Size Analysis (Optional):**
```bash
cd /opt/ozean-licht-ecosystem/shared/ui-components
npx bundlesize
# Expected: Individual components tree-shakeable
```

**Visual Inspection:**
```bash
# Start admin app with new components
cd /opt/ozean-licht-ecosystem/apps/admin
pnpm dev
# Navigate to http://localhost:9200
# Expected: Components render with glass morphism and glow effects
```

## Notes

**Dependencies:**
All required dependencies are already installed:
- `class-variance-authority@^0.7.1` - For variant management
- `clsx@^2.1.0` - Class name merging
- `tailwind-merge@^2.2.0` - Tailwind class merging
- All `@radix-ui/*` packages for shadcn primitives
- `lucide-react@^0.553.0` - For icons

**Design Token Reference:**

**CSS Variables (use with var()):**
```css
--primary: #0ec2bc          /* Turquoise */
--background: #0A0F1A        /* Cosmic dark */
--card: #1A1F2E             /* Card background */
--border: #2A2F3E           /* Border color */
--ring: #0ec2bc             /* Focus ring */
--destructive: #EF4444      /* Error red */
--success: #10B981          /* Success green */
--warning: #F59E0B          /* Warning amber */
--info: #3B82F6             /* Info blue */
```

**Utility Classes (apply directly):**
```css
/* Glass Morphism */
.glass-card              /* Standard glass */
.glass-card-strong       /* Strong glass */
.glass-subtle            /* Subtle glass */
.glass-hover             /* Hover effect */

/* Glow Effects */
.glow                    /* Standard glow */
.glow-strong             /* Strong glow */
.glow-subtle             /* Subtle glow */
.text-glow               /* Text glow (white) */
.text-glow-primary       /* Text glow (turquoise) */

/* Component Bases */
.btn-base                /* Button base styles */
.card-base               /* Card base styles */
.input-base              /* Input base styles */
.badge-base              /* Badge base styles */

/* Typography */
.font-decorative         /* Cinzel Decorative */
.font-serif              /* Cinzel */
.font-alt                /* Montserrat Alternates */

/* Backgrounds */
.bg-cosmic-gradient      /* Cosmic gradient */
```

**Component Pattern Example:**

**Extending shadcn with CVA:**
```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Button as ShadcnButton } from '../ui/button'
import { cn } from '../utils/cn'

const buttonVariants = cva(
  'btn-base', // base styles
  {
    variants: {
      variant: {
        primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:shadow-xl',
        secondary: 'glass-card text-primary hover:glass-hover',
        ghost: 'hover:bg-[var(--primary)]/10',
        cta: 'bg-gradient-to-r from-primary to-primary/80 glow',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
      glow: {
        true: 'glow',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      glow: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, glow, loading, children, ...props }, ref) => {
    return (
      <ShadcnButton
        ref={ref}
        className={cn(buttonVariants({ variant, size, glow }), className)}
        disabled={loading}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </ShadcnButton>
    )
  }
)

Button.displayName = 'Button'
```

**Migration Priority:**

**Week 1 (Core 5 - MUST HAVE):**
1. Button (with cta variant)
2. Card (GlassCard)
3. Input (with Textarea, Label)
4. Dialog
5. Badge

**Week 2 (Forms - HIGH PRIORITY):**
6. Select
7. Checkbox
8. RadioGroup
9. Switch
10. Form (wrapper)

**Week 3 (Navigation - MEDIUM PRIORITY):**
11. Tabs
12. Accordion
13. DropdownMenu
14. Tooltip
15. Popover

**Week 4 (Data Display - MEDIUM PRIORITY):**
16. Table
17. Avatar
18. Progress
19. Alert
20. Toast

**Performance Considerations:**
- Use CSS variables for runtime theme switching
- Leverage tree-shaking via named exports
- Minimize component bundle size
- Lazy load heavy components (Table, Chart)
- Use React.memo for expensive renders
- Avoid inline object/array creation in render

**Accessibility Requirements:**
- All focusable elements must have visible focus indicators
- Use semantic HTML (button, nav, article, etc.)
- Include ARIA attributes where needed
- Support keyboard navigation
- Test with screen readers
- Ensure color contrast meets WCAG AA standards
- Support reduced motion preference

**Future Enhancements (Phase 4+):**
- Storybook integration for visual testing
- Unit tests for all components
- Visual regression testing
- Component playground
- Figma design kit
- Kids Ascension theme variant
- Component composition examples (Tier 3)

---

**Last Updated:** 2025-11-11
**Phase:** 3 of 7
**Status:** Ready to Implement
**Estimated Duration:** 4-5 hours (Core 5 components)
**Dependencies:** Phases 1-2 Complete ✅
