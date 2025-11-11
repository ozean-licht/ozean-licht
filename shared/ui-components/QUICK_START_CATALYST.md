# Catalyst UI - Quick Start Guide

**TL;DR:** You have 27 premium components from Tailwind CSS. The layouts are AMAZING - use them immediately!

---

## What You Got ($250 Value)

✅ **27 Production Components** from the Tailwind CSS team
⭐ **5 Complete Layouts** (SidebarLayout, StackedLayout, AuthLayout, Navbar, Sidebar)
💎 **Advanced Table** (striped rows, grid mode, clickable rows)
🎯 **Combobox** (autocomplete - not in shadcn)
🎨 **20+ Button Colors** with sophisticated styling

---

## Quick Decision Matrix

**Use Catalyst For:**
- ✅ Dashboard layouts (SidebarLayout) → Saves days of work
- ✅ Navigation (Navbar, Sidebar) → Professional looking
- ✅ Data tables → More features than shadcn
- ✅ Auth pages (AuthLayout) → Centered login/signup

**Keep shadcn For:**
- ✅ Calendar, Command, Toast, Tooltip → Not in Catalyst
- ✅ Form integration with react-hook-form → Already working
- ✅ Primitives (Checkbox, Radio, Select) → Already have 47 components

**Apply Ozean Licht On Both:**
- 🎨 Turquoise (#0ec2bc) instead of blue/cyan
- ✨ Glass morphism effects
- 🔤 Cinzel Decorative fonts
- 🌌 Cosmic dark theme

---

## Copy-Paste Commands (5 Minutes)

### 1. Install Dependencies

```bash
cd /opt/ozean-licht-ecosystem/shared/ui-components
npm install @headlessui/react motion clsx
```

### 2. Create Catalyst Folder Structure

```bash
mkdir -p src/catalyst/layouts
mkdir -p src/catalyst/navigation
mkdir -p src/catalyst/data
```

### 3. Copy Layouts (The Best Parts!)

```bash
cp catalyst-ui/typescript/sidebar-layout.tsx src/catalyst/layouts/
cp catalyst-ui/typescript/stacked-layout.tsx src/catalyst/layouts/
cp catalyst-ui/typescript/auth-layout.tsx src/catalyst/layouts/
cp catalyst-ui/typescript/navbar.tsx src/catalyst/navigation/
cp catalyst-ui/typescript/sidebar.tsx src/catalyst/navigation/
cp catalyst-ui/typescript/button.tsx src/catalyst/navigation/  # Required by layouts
cp catalyst-ui/typescript/link.tsx src/catalyst/navigation/    # Required by layouts
```

### 4. Copy Advanced Components

```bash
cp catalyst-ui/typescript/table.tsx src/catalyst/data/
cp catalyst-ui/typescript/combobox.tsx src/catalyst/forms/ 2>/dev/null || mkdir -p src/catalyst/forms && cp catalyst-ui/typescript/combobox.tsx src/catalyst/forms/
```

---

## Instant Dashboard Layout (2 Minutes)

### Create Index File

**File:** `src/catalyst/layouts/index.ts`

```typescript
export { SidebarLayout } from './sidebar-layout'
export { StackedLayout } from './stacked-layout'
export { AuthLayout } from './auth-layout'
```

**File:** `src/catalyst/navigation/index.ts`

```typescript
export { Navbar, NavbarItem, NavbarSection, NavbarSpacer, NavbarDivider, NavbarLabel } from './navbar'
export { Sidebar, SidebarHeader, SidebarBody, SidebarFooter, SidebarSection, SidebarItem, SidebarLabel } from './sidebar'
export { Button } from './button'
export { Link } from './link'
```

### Use in Admin Dashboard

**File:** `apps/admin/app/layout.tsx`

```tsx
import { SidebarLayout } from '@ozean-licht/shared-ui/catalyst/layouts'
import { Sidebar, SidebarHeader, SidebarBody, SidebarSection, SidebarItem } from '@ozean-licht/shared-ui/catalyst/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <NavbarItem href="/dashboard">Dashboard</NavbarItem>
            <NavbarItem href="/courses">Courses</NavbarItem>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <h2 className="font-decorative text-xl text-primary">Ozean Licht</h2>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/dashboard">Dashboard</SidebarItem>
              <SidebarItem href="/courses">Courses</SidebarItem>
              <SidebarItem href="/users">Users</SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
```

**Result:** Professional dashboard layout in 2 minutes!

---

## Branding for Ozean Licht (10 Minutes)

### Add Turquoise to Button

**Edit:** `src/catalyst/navigation/button.tsx`

Find the `colors` object (around line 59) and add:

```typescript
colors: {
  // ... existing colors (dark/zinc, light, white, etc.)

  // Add Ozean Licht turquoise
  'turquoise': [
    'text-white [--btn-bg:#0ec2bc] [--btn-border:#087E78]/90',
    '[--btn-hover-overlay:var(--color-white)]/10',
    '[--btn-icon:#66D5D2] data-active:[--btn-icon:#33C7C3] data-hover:[--btn-icon:#33C7C3]',
  ],
  'ozean-licht': [  // Alias
    'text-white [--btn-bg:#0ec2bc] [--btn-border:#087E78]/90',
    '[--btn-hover-overlay:var(--color-white)]/10',
    '[--btn-icon:#66D5D2] data-active:[--btn-icon:#33C7C3] data-hover:[--btn-icon:#33C7C3]',
  ],
}
```

### Add Glass Effects to Sidebar

**Edit:** `src/catalyst/navigation/sidebar.tsx`

Find the main container div and add glass classes:

```typescript
// Around line 15-20, in Sidebar component
<div className={clsx(
  'flex h-full flex-col',
  'glass-card-strong',          // Add: Ozean Licht glass effect
  'backdrop-blur-lg',            // Add: Enhance blur
  'border border-primary/20',    // Add: Turquoise border
  className
)}>
```

### Apply Cinzel Font to Headings

**Edit:** `src/catalyst/layouts/sidebar-layout.tsx`

Add font class to appropriate elements or wrap in a div with font class.

---

## Usage Examples

### Dashboard with Sidebar

```tsx
import { SidebarLayout } from '@/catalyst/layouts'
import { Sidebar, SidebarSection, SidebarItem } from '@/catalyst/navigation'

<SidebarLayout
  navbar={<YourNavbar />}
  sidebar={
    <Sidebar>
      <SidebarSection>
        <SidebarItem href="/dashboard">Dashboard</SidebarItem>
        <SidebarItem href="/courses">Courses</SidebarItem>
      </SidebarSection>
    </Sidebar>
  }
>
  <YourContent />
</SidebarLayout>
```

### Login Page

```tsx
import { AuthLayout } from '@/catalyst/layouts'

<AuthLayout>
  <div className="w-full max-w-md">
    <h1 className="font-decorative text-3xl mb-6">Sign In</h1>
    <LoginForm />
  </div>
</AuthLayout>
```

### Advanced Table

```tsx
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/catalyst/data'

<Table striped>
  <TableHead>
    <TableRow>
      <TableHeader>Name</TableHeader>
      <TableHeader>Email</TableHeader>
      <TableHeader>Role</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow href="/users/1">
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>Admin</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Branded Button

```tsx
import { Button } from '@/catalyst/navigation'

<Button color="turquoise">Primary Action</Button>
<Button color="ozean-licht">Same Thing</Button>
<Button outline>Secondary Action</Button>
```

---

## Integration Checklist

### Phase 1: Layouts (30 min) ✅ START HERE

- [ ] Install dependencies (`@headlessui/react`, `motion`)
- [ ] Copy layout components to `/src/catalyst/layouts/`
- [ ] Copy navigation components to `/src/catalyst/navigation/`
- [ ] Create index files for exports
- [ ] Test SidebarLayout in admin dashboard
- [ ] Test AuthLayout in login page

### Phase 2: Branding (1 hour)

- [ ] Add 'turquoise' and 'ozean-licht' colors to Button
- [ ] Apply glass effects to Sidebar
- [ ] Use Cinzel Decorative for heading elements
- [ ] Test branded components in app

### Phase 3: Advanced Components (1-2 hours)

- [ ] Copy Table component to `/src/catalyst/data/`
- [ ] Copy Combobox to `/src/catalyst/forms/`
- [ ] Create usage examples
- [ ] Document in Storybook

### Phase 4: Package Exports (30 min)

Update `package.json`:

```json
{
  "exports": {
    "./catalyst/layouts": {
      "types": "./src/catalyst/layouts/index.ts",
      "import": "./src/catalyst/layouts/index.ts"
    },
    "./catalyst/navigation": {
      "types": "./src/catalyst/navigation/index.ts",
      "import": "./src/catalyst/navigation/index.ts"
    }
  }
}
```

---

## Dependencies Added

```json
{
  "@headlessui/react": "^2.2.0",    // Headless UI components
  "motion": "^11.16.0",             // Framer Motion animations
  "clsx": "^2.1.1"                  // Class name utility (likely already have)
}
```

**Bundle Size:** +~100KB
**Development Time Saved:** Days to weeks

---

## Common Issues & Solutions

### Issue: Import errors for Button/Link

**Solution:** Copy dependencies first:

```bash
cp catalyst-ui/typescript/button.tsx src/catalyst/navigation/
cp catalyst-ui/typescript/link.tsx src/catalyst/navigation/
```

### Issue: Headless UI not found

**Solution:** Install dependencies:

```bash
npm install @headlessui/react motion
```

### Issue: Styles not appearing

**Solution:** Ensure Tailwind CSS v4 is installed and CSS variables are supported.

### Issue: TypeScript errors

**Solution:** Check that `motion/react` is installed (not `framer-motion`).

---

## Pro Tips

1. **Start with Layouts** - Biggest productivity boost
2. **Use Turquoise Everywhere** - Replace cyan/blue with your brand
3. **Glass Effects on Dark Backgrounds** - Looks amazing
4. **Combine with shadcn** - Best of both worlds
5. **Copy, Don't Import Initially** - Easier to customize

---

## Comparison Cheat Sheet

| Need | Use This | Not That |
|------|----------|----------|
| Dashboard layout | Catalyst SidebarLayout | Build from scratch |
| Login page | Catalyst AuthLayout | Custom centering |
| Navigation | Catalyst Navbar/Sidebar | shadcn NavigationMenu |
| Data table | Catalyst Table | shadcn table |
| Autocomplete | Catalyst Combobox | shadcn Command |
| Calendar | shadcn Calendar | Catalyst (doesn't have) |
| Toast | shadcn Toast | Catalyst (doesn't have) |
| Command palette | shadcn Command | Catalyst (doesn't have) |

---

## Next Steps

1. **Today:** Copy layouts and use in admin dashboard
2. **This Week:** Brand components with Ozean Licht colors
3. **Next Week:** Integrate advanced components (Table, Combobox)
4. **Eventually:** Build Storybook documentation

---

**Questions?**
- See full analysis: `CATALYST_ANALYSIS.md`
- Catalyst docs: https://catalyst.tailwindui.com/docs
- Headless UI docs: https://headlessui.dev

**Ready to build?** Start with Phase 1 - copy those layouts!
