# Coss UI Components - Ozean Licht Edition

**Coss UI components adapted for the Ozean Licht design system**

Version: 1.0.0

---

## Overview

This directory contains components from [Coss UI](https://coss.com/ui) - a modern React component library built on **Base UI** (not Radix UI like shadcn/ui). All components have been adapted to follow the Ozean Licht design system.

**Key Differences from shadcn/ui:**
- Built on Base UI instead of Radix UI
- Uses `render` prop instead of `asChild` for component composition
- Different prop names (e.g., `onClick` instead of `onSelect` for menu items)
- Different component names (e.g., `CardPanel` instead of `CardContent`)

---

## Design System Integration

All Coss UI components have been adapted to use:

### Colors
```typescript
Primary: '#0ec2bc'           // Oceanic cyan
Background: '#00070F'        // Deep ocean dark
Card: '#00111A'              // Card background
Border: '#0E282E'            // Borders
Muted Accent: '#055D75'      // Secondary buttons
```

### Typography
- **Cinzel Decorative** for headings (H1, H2)
- **Montserrat** for body text and UI elements
- **Montserrat Alternates** for labels and captions

### Effects
- Glass morphism with `backdrop-filter: blur(12px)`
- Glow effects on hover with primary color
- Subtle animations (glow, float, shine)

---

## Available Components

### Form Components
- `Button` - Multiple variants with render prop support
- `Input` - Text input with size variants (sm, md, lg)
- `Textarea` - Multi-line text input
- `Checkbox` - Checkbox with CheckboxGroup
- `RadioGroup` - Radio button group
- `Select` - Dropdown select with custom styling
- `Switch` - Toggle switch
- `Slider` - Range slider with labels
- `Toggle` - Toggle button
- `ToggleGroup` - Group of toggle buttons

### Layout Components
- `Card` - Glass effect cards with CardHeader, CardPanel, CardFooter
- `Frame` - Container component
- `Group` - Grouping component with separators
- `Separator` - Visual divider
- `Accordion` - Collapsible content panels
- `Collapsible` - Simple collapsible content
- `Tabs` - Tabbed interface

### Feedback Components
- `Alert` - Alert messages
- `Badge` - Status badges
- `Progress` - Progress bar with labels
- `Spinner` - Loading spinner
- `Skeleton` - Loading skeleton
- `Toast` - Toast notifications via toastManager
- `Empty` - Empty state component

### Overlay Components
- `Dialog` - Modal dialog
- `AlertDialog` - Confirmation dialog
- `Sheet` - Slide-out panel
- `Popover` - Popover with trigger
- `Tooltip` - Hover tooltip with TooltipProvider
- `PreviewCard` - Preview card on hover

### Navigation Components
- `Breadcrumb` - Breadcrumb navigation
- `Pagination` - Pagination controls
- `Menu` - Dropdown menu with submenus
- `Toolbar` - Action toolbar

### Data Display
- `Avatar` - User avatar
- `Table` - Data table
- `Kbd` - Keyboard shortcut indicator
- `Meter` - Meter/gauge component
- `ScrollArea` - Custom scrollable area

---

## Key Differences from Standard Coss UI

### 1. Render Prop Pattern
All components that support composition use the `render` prop:

```tsx
// Standard Coss UI
<Button render={<Link href="/login" />}>Login</Button>

// Ozean Licht styled
<Button render={<Link href="/login" />} className="glass-card-strong">
  Login
</Button>
```

### 2. Color Variants
Variants have been adapted to Ozean Licht colors:

```tsx
// Button variants
primary    → bg-primary (#0ec2bc) with glow
secondary  → glass-card with border
muted      → bg-mutedAccent (#055D75)
ghost      → transparent with hover
destructive→ bg-destructive (red)
```

### 3. Glass Effects
All cards and elevated surfaces use glass morphism:

```tsx
<Card className="glass-card">
  <CardHeader>
    <CardTitle className="font-decorative">Title</CardTitle>
  </CardHeader>
  <CardPanel>Content with glass effect</CardPanel>
</Card>
```

---

## Usage Examples

### Button
```tsx
import { Button } from '@ozean-licht/shared-ui/cossui'

<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
```

### Card
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
  CardFooter
} from '@ozean-licht/shared-ui/cossui'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardPanel>Main content goes here</CardPanel>
  <CardFooter>Footer content</CardFooter>
</Card>
```

### Dialog
```tsx
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@ozean-licht/shared-ui/cossui'

<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>
    Open Dialog
  </DialogTrigger>
  <DialogPopup>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
      <DialogClose render={<Button variant="primary" />}>Confirm</DialogClose>
    </DialogFooter>
  </DialogPopup>
</Dialog>
```

### Toast Notifications
```tsx
import { toastManager } from '@ozean-licht/shared-ui/cossui'

// Show toast
toastManager.add({
  title: "Success!",
  description: "Your changes have been saved.",
})
```

---

## Installation Notes

These components require:
- `@base-ui-components/react` - Base UI primitives
- `react` and `react-dom` - React framework
- `tailwindcss` - Styling framework

All dependencies are already included in the shared/ui package.

---

## Migrating from shadcn/ui

If you're familiar with shadcn/ui, here are the key changes:

| shadcn/ui | Coss UI (Ozean Licht) |
|-----------|----------------------|
| `asChild` prop | `render` prop |
| `CardContent` | `CardPanel` |
| `AccordionContent` | `AccordionPanel` |
| `onSelect` (menu) | `onClick` |
| `type="multiple"` | `multiple={true}` |
| Radix UI base | Base UI base |

---

## Contributing

When adding new Coss UI components:

1. Fetch component from Context7 MCP or Coss UI docs
2. Adapt colors to Ozean Licht palette
3. Add glass morphism effects where appropriate
4. Use proper Ozean Licht typography
5. Test with Storybook
6. Update this README

---

**Maintained by:** Ozean Licht Platform Team + AI Agents
**Upstream:** https://coss.com/ui
**License:** UNLICENSED (Private)
