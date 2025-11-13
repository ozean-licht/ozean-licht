# Storybook Ozean Licht Branding Implementation

**Date:** 2025-11-13
**Status:** ✅ Complete - Branding Applied
**Next Phase:** Component Foundation Review

---

## Summary

Successfully applied Ozean Licht cosmic dark branding to Storybook. The Storybook UI now matches the Ozean Licht design system with turquoise (#0ec2bc) accents, cosmic dark backgrounds (#0A0F1A), and proper theme switching.

---

## Changes Applied

### 1. Manager UI Customization (`storybook/config/manager.ts`)

Created custom Storybook theme with:
- **Base Theme:** Dark mode
- **Primary Color:** #0ec2bc (Turquoise)
- **Background:** #0A0F1A (Cosmic dark)
- **Content BG:** #0A0F1A (Consistent with main background)
- **Toolbar BG:** #1A1F2E (Card background)
- **Borders:** #2A2F3E (Subtle borders)
- **Typography:** Montserrat (sans), Fira Code (mono)

### 2. Preview Configuration Updates (`storybook/config/preview.ts`)

#### Background Options
Added cosmic dark backgrounds to the backgrounds addon:
- `cosmic-dark` (#0A0F1A) - Default
- `card` (#1A1F2E) - Card background
- `cosmic-gradient` - Full gradient background
- `white` (#FFFFFF) - Light mode fallback

#### Theme Switching
- Changed default theme from `light` to `dark`
- Updated toolbar icon to reflect dark as default
- Added theme decorator to apply `.dark` class to document root

#### Theme Decorator
Added React decorator that:
1. Applies `.dark` class to `<html>` element for Tailwind dark mode
2. Sets cosmic background color (#0A0F1A)
3. Wraps stories in proper theme context
4. Handles theme switching dynamically

### 3. Main Config Updates (`storybook/config/main.ts`)

- Added `managerHead` customization to inject Montserrat font
- Ensures consistent typography across Storybook UI

---

## Component Adherence Analysis

### ✅ Components Following Brand Guidelines

#### Button Component (`shared/ui/src/components/Button.tsx`)
- ✅ Uses CSS variables (`var(--primary)`, `var(--foreground)`)
- ✅ Implements all brand variants (primary, secondary, ghost, destructive, outline, link, CTA)
- ✅ Includes glow effects (`glow-subtle` class)
- ✅ Has proper glass morphism on secondary variant (`glass-card`)
- ✅ Supports turquoise gradient CTA variant
- ✅ Active state scaling (`active:scale-95`)
- ✅ Shadow effects with primary color opacity

**Recommendation:** No changes needed. Component perfectly follows design system.

#### Card Component (`shared/ui/src/components/Card.tsx`)
- ✅ Uses CSS variables for colors
- ✅ Implements glass morphism variants (default, strong, subtle, solid)
- ✅ Glass hover effects with glow
- ✅ Proper font hierarchy (serif for titles, sans for descriptions)
- ✅ Border with primary color opacity
- ✅ Consistent spacing and padding

**Recommendation:** No changes needed. Component perfectly follows design system.

### CSS Variables System

Both components use CSS variables which are properly defined in:
1. `apps/admin/app/globals.css` - Admin-specific variables
2. `shared/ui/src/styles/globals.css` - Shared design system variables

All variables match the Ozean Licht design system:
```css
:root {
  --primary: #0ec2bc;          /* Turquoise */
  --background: #0A0F1A;       /* Cosmic dark */
  --card: #1A1F2E;             /* Card background */
  --border: #2A2F3E;           /* Subtle borders */
  --foreground: #FFFFFF;       /* White text */

  /* Fonts - ONLY 3 fonts used */
  --font-decorative: 'Cinzel Decorative', Georgia, serif;  /* SPARINGLY */
  --font-sans: 'Montserrat', system-ui, -apple-system, sans-serif;
  --font-alt: 'Montserrat Alternates', Montserrat, sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;
  /* ... all semantic colors defined */
}
```

**Typography Hierarchy (Updated):**
- H1, H2: Cinzel Decorative Regular (400) - Used SPARINGLY
- H3, H4: Montserrat Regular (400)
- H5, H6: Montserrat Alternates Regular (400)
- Special: Course card titles use Cinzel Decorative

### Utility Classes

All components use standardized utility classes from `globals.css`:
- `.glass-card`, `.glass-card-strong`, `.glass-subtle` - Glass morphism effects
- `.glow`, `.glow-strong`, `.glow-subtle` - Glow effects
- `.btn-base`, `.card-base`, `.input-base`, `.badge-base` - Component bases
- Custom animations: `glow`, `float`, `shine`, `gentle-pulse`

---

## Storybook Setup Verification

### File Structure
```
storybook/
├── config/
│   ├── main.ts          ✅ Vite config with Tailwind processing
│   ├── preview.ts       ✅ Theme decorator + cosmic backgrounds
│   ├── manager.ts       ✅ Custom Ozean Licht theme
│   └── plugins/
│       └── inject-react-shim.ts
├── tailwind.config.js   ✅ Matches Ozean Licht theme
├── postcss.config.js    ✅ Tailwind processing enabled
└── build/               ✅ Generated bundle files
```

### CSS Loading
- Imports `apps/admin/app/globals.css` which includes all Tailwind layers
- PostCSS processes Tailwind directives
- CSS variables available globally
- Font families loaded (Montserrat, Cinzel, Cinzel Decorative, Fira Code)

### Story Configuration
Stories found in:
- `shared/ui/src/components/*.stories.tsx` (5 stories)
- `shared/ui/src/ui/*.stories.tsx` (8 stories)
- `apps/admin/components/ui/*.stories.tsx` (2 stories)

All stories use:
- Proper Meta/StoryObj types
- `tags: ['autodocs']` for auto-documentation
- Clear descriptions and examples
- Proper argTypes for controls

---

## Next Steps: Component Foundation Phase

### Phase 1: Review Existing Components (Priority Order)

#### Tier 1: Core Primitives (Immediate)
1. **Badge** (`shared/ui/src/components/Badge.tsx`)
   - Verify brand adherence
   - Check glass morphism variants
   - Ensure proper semantic colors

2. **Input** (`shared/ui/src/components/Input.tsx`)
   - Verify focus states with primary ring
   - Check glass effect backgrounds
   - Validate error states

3. **Select** (`shared/ui/src/components/Select.tsx`)
   - Verify dropdown styling
   - Check glass morphism on menu
   - Validate focus states

#### Tier 2: UI Primitives (High Priority)
4. **Checkbox** (`shared/ui/src/ui/checkbox.stories.tsx`)
5. **Textarea** (`shared/ui/src/ui/textarea.stories.tsx`)
6. **Tabs** (`shared/ui/src/ui/tabs.stories.tsx`)
7. **Accordion** (`shared/ui/src/ui/accordion.stories.tsx`)
8. **Dialog** (`shared/ui/src/ui/dialog.stories.tsx`)
9. **Tooltip** (`shared/ui/src/ui/tooltip.stories.tsx`)
10. **Radio Group** (`shared/ui/src/ui/radio-group.stories.tsx`)
11. **Alert** (`shared/ui/src/ui/alert.stories.tsx`)

#### Tier 3: Admin Components (Medium Priority)
12. **Admin Alert** (`apps/admin/components/ui/alert.stories.tsx`)
13. **Admin Button** (`apps/admin/components/ui/button.stories.tsx`)

### Phase 2: Build Missing Components

Based on design system requirements, build:

#### Layout Components
- **Container** - Page/section containers with cosmic gradient
- **Grid** - Dashboard and card grid layouts
- **Stack** - Vertical rhythm utilities
- **Divider** - Separator with primary glow

#### Form Components
- **Form** - Form wrapper with validation
- **FormField** - Field wrapper with label + error
- **Switch** - Toggle switch with primary accent
- **Slider** - Range slider with primary track
- **Combobox** - Searchable select with glass morphism
- **DatePicker** - Calendar with cosmic theme

#### Feedback Components
- **Toast** - Notification system with glass morphism
- **Progress** - Loading bars with primary color
- **Spinner** - Loading spinner with primary glow
- **Skeleton** - Loading placeholders with pulse

#### Navigation Components
- **Breadcrumb** - Navigation trail
- **Pagination** - Page navigation
- **Tabs** - Enhanced tab system (if needed)
- **Menu** - Dropdown menu with glass morphism

#### Overlay Components
- **Modal** - Enhanced dialog with cosmic backdrop
- **Drawer** - Side drawer with glass morphism
- **Popover** - Enhanced popover with glow
- **Sheet** - Sliding panel

#### Data Display Components
- **Table** - Data table with glass rows
- **Avatar** - User avatar with primary border
- **Badge** - Status badges (enhance existing)
- **Stat Card** - Dashboard metric card

#### Typography Components
- **Heading** - Semantic headings with glow
- **Text** - Body text with variants
- **Code** - Code block with Fira Code
- **Link** - Branded hyperlinks

### Phase 3: Documentation

For each component, create:
1. **Story file** - Comprehensive examples
2. **Props documentation** - TypeScript + JSDoc
3. **Usage examples** - Common patterns
4. **Accessibility notes** - WCAG compliance details
5. **Design tokens** - Which variables used

### Phase 4: Testing

1. **Visual regression** - Screenshot comparison
2. **Accessibility audit** - WCAG 2.1 AA compliance
3. **Responsive testing** - Mobile, tablet, desktop
4. **Theme switching** - Light/dark modes
5. **Browser compatibility** - Chrome, Firefox, Safari, Edge

---

## Implementation Strategy

### For AI Agents Working on Components:

1. **Start with Design System** - Read `/design-system.md` first
2. **Check Existing Patterns** - Look at Button/Card as reference
3. **Use CSS Variables** - Always use `var(--primary)`, `var(--background)`, etc.
4. **Apply Utility Classes** - Use `.glass-card`, `.glow`, `.btn-base` patterns
5. **Follow Typography Hierarchy** - Use correct font families
6. **Add Glow Effects** - Use primary color with opacity for shadows/glows
7. **Implement Hover States** - Border intensification + shadow
8. **Active States** - Scale down (`active:scale-95`)
9. **Focus Styles** - Primary ring with offset
10. **Write Stories** - Comprehensive examples with all variants
11. **Document Props** - TypeScript interfaces + JSDoc
12. **Test Accessibility** - Run a11y addon checks

### Code Pattern Template:

```typescript
/**
 * ComponentName
 *
 * Brief description following Ozean Licht design system.
 * Features glass morphism, glow effects, and turquoise branding.
 */
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const componentVariants = cva(
  'component-base', // Use appropriate base class
  {
    variants: {
      variant: {
        default: 'glass-card',
        primary: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
        // ... other variants
      },
      size: {
        sm: '...',
        md: '...',
        lg: '...',
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

## Verification Checklist

### Storybook Branding ✅
- [x] Manager UI uses Ozean Licht colors
- [x] Preview has cosmic dark background
- [x] Theme switcher defaults to dark
- [x] Typography uses Montserrat/Cinzel
- [x] All addons properly configured

### Component System ✅
- [x] CSS variables properly defined
- [x] Utility classes working
- [x] Glass morphism effects active
- [x] Glow animations working
- [x] Font families loaded

### Next Phase ⏳
- [ ] Review all 15 existing component stories
- [ ] Identify components needing updates
- [ ] Build missing components (30+ needed)
- [ ] Create comprehensive documentation
- [ ] Add visual regression tests

---

## Testing Storybook

To view the branded Storybook:

```bash
# Start Storybook dev server
cd storybook
npm run storybook

# Or from root
pnpm --filter storybook storybook

# Build static Storybook
cd storybook
npm run build-storybook
```

**Expected Result:**
- Cosmic dark background (#0A0F1A)
- Turquoise accents throughout UI
- Montserrat font in toolbar
- Components render with glass morphism
- Theme switcher in toolbar (defaults to dark)
- Entity switcher for multi-tenant testing

---

## Resources

- [Design System](/design-system.md) - Complete design tokens
- [Branding Guide](/BRANDING.md) - Logo usage and brand identity
- [Component Guidelines](/shared/ui/COMPONENT-GUIDELINES.md) - Development patterns
- [Shared UI Structure](/shared/ui/STRUCTURE_PLAN.md) - Package organization
- [Tailwind Config](/apps/ozean-licht/tailwind.config.js) - Theme configuration
- [Global Styles](/shared/ui/src/styles/globals.css) - CSS utilities

---

## Questions?

For AI agents: Reference this document when working on Storybook or UI components. All patterns are established and should be followed consistently.

For humans: This is the authoritative source for Storybook branding decisions. Any deviations should be documented here.
