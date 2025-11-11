# Quick Start: shadcn/ui Components

**Version:** Phase 2 Complete (47 components)
**Last Updated:** 2025-11-11

---

## What's Available

The shared UI component library now includes **47 shadcn/ui primitive components** - accessible, headless, and ready to use. These are Tier 1 base components built on Radix UI.

---

## Quick Import Reference

### Basic Import Pattern

```typescript
// Import from the ui namespace
import { Button, Card, Input } from '@ozean-licht/shared-ui/ui'
```

### Category-Based Imports

```typescript
// Forms
import {
  Button, Input, Checkbox, RadioGroup, Select,
  Textarea, Switch, Slider, Label, Form
} from '@ozean-licht/shared-ui/ui'

// Layout
import {
  Card, Separator, Skeleton, AspectRatio,
  ScrollArea, Resizable, Collapsible
} from '@ozean-licht/shared-ui/ui'

// Navigation
import {
  Tabs, DropdownMenu, NavigationMenu, Breadcrumb,
  Menubar, Command, Pagination
} from '@ozean-licht/shared-ui/ui'

// Overlays
import {
  Dialog, Sheet, Popover, Tooltip, HoverCard,
  AlertDialog, ContextMenu, Drawer
} from '@ozean-licht/shared-ui/ui'

// Feedback
import {
  Toast, Toaster, SonnerToaster, Alert, Progress
} from '@ozean-licht/shared-ui/ui'

// Data Display
import {
  Table, Badge, Avatar, Accordion
} from '@ozean-licht/shared-ui/ui'

// Advanced
import {
  Calendar, Carousel, Chart, Toggle, ToggleGroup, InputOtp
} from '@ozean-licht/shared-ui/ui'
```

---

## Common Use Cases

### 1. Simple Form

```typescript
import { Card, Input, Label, Button } from '@ozean-licht/shared-ui/ui'

export function SimpleForm() {
  return (
    <Card className="glass-card p-6 max-w-md">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter your name" />
        </div>
        <Button className="w-full">Submit</Button>
      </div>
    </Card>
  )
}
```

### 2. Modal Dialog

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@ozean-licht/shared-ui/ui'

export function WelcomeDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card">
        <DialogHeader>
          <DialogTitle className="font-decorative text-2xl">
            Welcome to Ozean Licht
          </DialogTitle>
          <DialogDescription>
            Begin your journey of spiritual growth
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
```

### 3. Navigation Tabs

```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@ozean-licht/shared-ui/ui'

export function CourseTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="glass-card">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="lessons">Lessons</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="glass-card p-6 mt-4">
        <h3 className="font-serif text-xl mb-4">Course Overview</h3>
        <p className="body-m">Course details here...</p>
      </TabsContent>

      <TabsContent value="lessons">
        {/* Lesson content */}
      </TabsContent>

      <TabsContent value="resources">
        {/* Resources content */}
      </TabsContent>
    </Tabs>
  )
}
```

### 4. Data Table

```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@ozean-licht/shared-ui/ui'

export function UserTable({ users }) {
  return (
    <div className="glass-card p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{user.role}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

### 5. Toast Notifications

```typescript
import { Button, Toaster } from '@ozean-licht/shared-ui/ui'
import { useToast } from '@ozean-licht/shared-ui/hooks'

export function NotificationExample() {
  const { toast } = useToast()

  return (
    <>
      <Button
        onClick={() => {
          toast({
            title: "Success",
            description: "Your changes have been saved.",
            variant: "default"
          })
        }}
      >
        Show Toast
      </Button>

      <Toaster />
    </>
  )
}
```

### 6. Dropdown Menu

```typescript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@ozean-licht/shared-ui/ui'
import { Button } from '@ozean-licht/shared-ui/ui'

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">Open Menu</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="glass-card">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## Styling with Design Tokens

All components automatically use Ozean Licht design tokens from `globals.css`:

### Available CSS Classes

```typescript
// Glass morphism (from globals.css)
className="glass-card"          // Standard glass effect
className="glass-card-strong"   // Stronger blur
className="glass-subtle"        // Subtle glass effect
className="glass-hover"         // Hover with glow

// Glow effects
className="glow"                // Standard glow
className="glow-strong"         // Strong glow
className="glow-subtle"         // Subtle glow

// Typography
className="font-decorative"     // Cinzel Decorative
className="font-serif"          // Cinzel
className="font-alt"            // Montserrat Alternates

className="body-l"              // Body large
className="body-m"              // Body medium
className="body-s"              // Body small

className="text-glow"           // Text glow effect
className="text-glow-primary"   // Primary color glow

// Layout utilities
className="container-page"      // Page container
className="stack-normal"        // Vertical spacing
className="grid-cards"          // Card grid layout
```

### Color System (CSS Variables)

```css
/* Primary colors */
--primary: #0ec2bc          /* Ozean Licht turquoise */
--background: #0A0F1A       /* Cosmic dark */
--foreground: #FFFFFF       /* White text */

/* Card colors */
--card: #1A1F2E
--card-foreground: #FFFFFF

/* Semantic colors */
--destructive: #EF4444      /* Red */
--success: #10B981          /* Green */
--warning: #F59E0B          /* Amber */
--info: #3B82F6             /* Blue */

/* UI elements */
--border: #2A2F3E
--input: #2A2F3E
--ring: #0ec2bc             /* Focus ring */
```

---

## Component Variants

Most components support variants through the `className` prop:

```typescript
// Button variants (apply with className)
<Button className="bg-primary hover:bg-primary/90">
  Primary Action
</Button>

<Button className="bg-destructive hover:bg-destructive/90">
  Delete
</Button>

<Button variant="outline" className="border-primary text-primary">
  Outlined
</Button>

<Button variant="ghost">
  Ghost
</Button>

// Card variants
<Card className="glass-card">
  Glass card
</Card>

<Card className="glass-card-strong">
  Strong glass
</Card>

// Badge variants
<Badge variant="default">Default</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
```

---

## Form Handling with react-hook-form

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button
} from '@ozean-licht/shared-ui/ui'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  function onSubmit(values) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>
                Your email address for login
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </Form>
  )
}
```

---

## Complete Component List (47)

### Forms (12)
- `Button` - Accessible button
- `Checkbox` - Checkbox input
- `Form` - Form wrapper (react-hook-form)
- `Input` - Text input
- `InputOtp` - One-time password input
- `Label` - Form label
- `RadioGroup` - Radio buttons
- `Select` - Select dropdown
- `Slider` - Range slider
- `Switch` - Toggle switch
- `Textarea` - Multi-line input
- `Sonner` - Toast system (alternative)

### Layout (7)
- `Card` - Card container
- `Separator` - Divider line
- `Skeleton` - Loading placeholder
- `AspectRatio` - Maintain aspect ratios
- `ScrollArea` - Custom scrollable area
- `Resizable` - Resizable panels
- `Collapsible` - Collapsible sections

### Navigation (7)
- `Tabs` - Tab navigation
- `DropdownMenu` - Dropdown menu
- `NavigationMenu` - Complex navigation
- `Breadcrumb` - Breadcrumb trail
- `Menubar` - Application menu
- `Command` - Command palette (Cmd+K)
- `Pagination` - Page navigation

### Overlays (8)
- `Dialog` - Modal dialog
- `Sheet` - Slide-out panel
- `Popover` - Popover content
- `Tooltip` - Hover tooltip
- `HoverCard` - Rich hover card
- `AlertDialog` - Confirmation dialog
- `ContextMenu` - Right-click menu
- `Drawer` - Bottom drawer (mobile)

### Feedback (4)
- `Toast` - Toast notifications
- `Toaster` - Toast container
- `Alert` - Alert messages
- `Progress` - Progress bar

### Data Display (4)
- `Table` - Data table
- `Badge` - Status badge
- `Avatar` - User avatar
- `Accordion` - Expandable sections

### Advanced (5)
- `Calendar` - Date picker
- `Carousel` - Content carousel
- `Chart` - Chart components
- `Toggle` - Toggle button
- `ToggleGroup` - Toggle group

---

## Best Practices

### 1. Always Use Design Tokens

```typescript
// ✅ Good - Uses design tokens
<Card className="glass-card border-primary">

// ❌ Bad - Hardcoded colors
<Card className="bg-[#1A1F2E] border-[#0ec2bc]">
```

### 2. Leverage Utility Classes

```typescript
// ✅ Good - Uses utility classes
<div className="stack-normal grid-cards">

// ❌ Bad - Inline styles
<div style={{ display: 'grid', gap: '24px' }}>
```

### 3. Combine with Catalyst for Rich UIs

```typescript
// Mix Tier 1 (shadcn) with Tier 2 (Catalyst)
import { Dialog } from '@ozean-licht/shared-ui/ui'
import { Button } from '@ozean-licht/shared-ui/catalyst'

export function RichDialog() {
  return (
    <Dialog>
      <DialogContent className="glass-card">
        <DialogTitle>Rich Dialog</DialogTitle>
        <Button color="cyan">Catalyst Button</Button>
      </DialogContent>
    </Dialog>
  )
}
```

### 4. Accessibility First

```typescript
// ✅ Good - Proper labels and aria
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" aria-describedby="email-hint" />
<FormDescription id="email-hint">We'll never share your email</FormDescription>

// ❌ Bad - No labels or context
<Input type="email" />
```

### 5. Use TypeScript Types

```typescript
// ✅ Good - Typed props
import type { ButtonProps } from '@ozean-licht/shared-ui/ui'

interface MyButtonProps extends ButtonProps {
  loading?: boolean
}

// ❌ Bad - Any types
function MyButton(props: any) { }
```

---

## Next Steps

After Phase 3 (Branded Components), you'll have:

```typescript
// Tier 1: Primitives (Current)
import { Button } from '@ozean-licht/shared-ui/ui'

// Tier 2: Branded (Phase 3)
import { Button } from '@ozean-licht/shared-ui/components'

// Tier 3: Compositions (Phase 4)
import { CourseCard } from '@ozean-licht/shared-ui/compositions'
```

---

## Troubleshooting

### Import Not Found

```bash
# Make sure package is built
cd /opt/ozean-licht-ecosystem/shared/ui-components
npm run build
```

### Type Errors

```bash
# Run type check
npm run typecheck
```

### Styling Not Applied

1. Make sure globals.css is imported in your app
2. Check that Tailwind config includes shared-ui paths
3. Verify CSS variables are defined

```typescript
// In your app's layout or _app
import '@ozean-licht/shared-ui/styles'
```

---

## Resources

- **Full Report:** `PHASE_2_COMPLETION_REPORT.md`
- **Upgrade Plan:** `UPGRADE_PLAN.md`
- **Design System:** `/design-system.md`
- **Catalyst Guide:** `QUICK_START_CATALYST.md`

---

**Last Updated:** 2025-11-11
**Components:** 47 shadcn/ui primitives
**Status:** Production Ready ✅
