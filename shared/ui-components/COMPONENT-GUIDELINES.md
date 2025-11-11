# Component Usage Guidelines

**Ozean Licht Design System - Component Best Practices**

Version: 0.1.0
Last Updated: 2025-11-11

---

## Overview

This document provides detailed guidelines for using Ozean Licht shared components effectively. It covers when to use specific components, common patterns, accessibility considerations, and responsive design practices.

**Target Audience:**
- Frontend developers
- AI agents building features
- Designers implementing interfaces

**Related Documentation:**
- [Design System](/design-system.md) - Complete design tokens and patterns
- [Branding Guidelines](/BRANDING.md) - Brand identity and usage rules
- [Component Library README](/shared/ui-components/README.md) - Technical API documentation

---

## Table of Contents

1. [Glass Effects](#glass-effects)
2. [Button Usage](#button-usage)
3. [Card Patterns](#card-patterns)
4. [Badge Guidelines](#badge-guidelines)
5. [Form Patterns](#form-patterns)
6. [Typography Hierarchy](#typography-hierarchy)
7. [Layout Patterns](#layout-patterns)
8. [Responsive Design](#responsive-design)
9. [Accessibility](#accessibility)
10. [Performance Considerations](#performance-considerations)

---

## Glass Effects

### When to Use Glass Effects

**DO Use Glass Effects For:**
- ✅ Dashboard cards containing data or actions
- ✅ Modal dialogs and popovers
- ✅ Navigation elements (sidebar, header)
- ✅ Content containers over cosmic backgrounds
- ✅ Hero sections with layered content

**DON'T Use Glass Effects For:**
- ❌ Text-heavy content (articles, documentation)
- ❌ Forms with many input fields (readability)
- ❌ Print layouts
- ❌ Mobile views with many nested cards (performance)
- ❌ Over light backgrounds (doesn't work)

### Glass Effect Variants

```typescript
// Standard cards - Most common use case
<Card variant="default" padding="md">
  Standard dashboard card content
</Card>

// Important content - CTAs, featured items
<Card variant="strong" padding="lg" hover>
  Important featured content
</Card>

// Background layers - Less important info
<Card variant="subtle" padding="sm">
  Background or secondary information
</Card>
```

### Glass + Hover Pattern

Use `hover` prop for interactive cards:

```typescript
<Card variant="default" hover padding="md" className="cursor-pointer">
  <CardHeader>
    <CardTitle>Interactive Card</CardTitle>
  </CardHeader>
  <CardContent>
    Clickable card with hover glow effect
  </CardContent>
</Card>
```

### Glow Animation

Use glow animation sparingly for emphasis:

```typescript
// Featured CTA card
<Card variant="strong" glow padding="lg">
  <h3 className="font-decorative text-2xl">
    Premium Feature
  </h3>
  <Button variant="primary" size="lg">
    Upgrade Now
  </Button>
</Card>
```

**Performance Note:** Limit glow animations to 1-2 elements per viewport.

---

## Button Usage

### Button Variants

#### Primary Buttons
**Use For:** Main actions, CTAs, form submissions

```typescript
<Button variant="primary" size="md">
  Save Changes
</Button>
```

**When to Use:**
- Form submit buttons
- Primary page actions
- Call-to-action buttons
- Confirmation actions

**Limit:** 1 primary button per section to maintain visual hierarchy.

#### Secondary Buttons
**Use For:** Alternative actions, cancel buttons

```typescript
<Button variant="secondary" size="md">
  Cancel
</Button>
```

**When to Use:**
- Cancel/back actions
- Secondary form actions
- Alternative options
- Complementary actions to primary

#### Ghost Buttons
**Use For:** Tertiary actions, navigation

```typescript
<Button variant="ghost" size="sm">
  Learn More
</Button>
```

**When to Use:**
- Links styled as buttons
- Tertiary actions
- In-card navigation
- Less important actions

#### Destructive Buttons
**Use For:** Delete, remove, destructive actions

```typescript
<Button variant="destructive" size="md">
  Delete Account
</Button>
```

**When to Use:**
- Delete operations
- Permanent removal
- Destructive actions
- Always pair with confirmation dialog

### Button Sizes

```typescript
// Small - Inline actions, tables
<Button variant="ghost" size="sm">Edit</Button>

// Medium - Standard actions (default)
<Button variant="primary" size="md">Submit</Button>

// Large - Hero CTAs, important actions
<Button variant="primary" size="lg">Get Started</Button>
```

### Button with Icons

```typescript
// Icon before text
<Button variant="primary" icon={<PlusIcon />}>
  Add Item
</Button>

// Icon after text
<Button variant="ghost" iconAfter={<ArrowRightIcon />}>
  Next
</Button>
```

### Loading States

```typescript
<Button variant="primary" loading={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save Changes'}
</Button>
```

### Button Grouping

```typescript
// Horizontal button group
<div className="flex gap-3">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Confirm</Button>
</div>

// Vertical stack (mobile)
<div className="flex flex-col gap-2 sm:flex-row">
  <Button variant="secondary" fullWidth>Cancel</Button>
  <Button variant="primary" fullWidth>Confirm</Button>
</div>
```

---

## Card Patterns

### Basic Information Card

```typescript
<Card variant="default" padding="md">
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
    <CardDescription>Manage your account settings</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button variant="primary" size="sm">Edit</Button>
  </CardFooter>
</Card>
```

### Data Display Card

```typescript
<Card variant="default" padding="md">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle as="h5">Total Users</CardTitle>
      <Badge variant="success" dot>Active</Badge>
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-4xl font-decorative text-primary">
      1,247
    </div>
    <p className="text-sm text-muted-foreground mt-2">
      +12.5% from last month
    </p>
  </CardContent>
</Card>
```

### Interactive Card (Clickable)

```typescript
<Card
  variant="default"
  hover
  padding="md"
  className="cursor-pointer"
  onClick={() => router.push('/details')}
>
  <CardContent>
    <h4 className="font-serif text-lg mb-2">Click to View</h4>
    <p className="text-muted-foreground">
      Interactive card with hover effect
    </p>
  </CardContent>
</Card>
```

### Featured/Highlighted Card

```typescript
<Card variant="strong" glow padding="lg">
  <CardHeader>
    <CardTitle as="h3">Premium Feature</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Important featured content with glow animation</p>
  </CardContent>
  <CardFooter>
    <Button variant="primary" size="lg" fullWidth>
      Upgrade Now
    </Button>
  </CardFooter>
</Card>
```

### Card Grid Layout

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <Card key={item.id} variant="default" hover padding="md">
      <CardContent>
        {/* Card content */}
      </CardContent>
    </Card>
  ))}
</div>
```

---

## Badge Guidelines

### Status Badges

Use semantic colors for status indicators:

```typescript
// Success - Active, completed, verified
<Badge variant="success" dot>Active</Badge>

// Warning - Pending, in progress
<Badge variant="warning" dot>Pending</Badge>

// Destructive - Inactive, error, failed
<Badge variant="destructive" dot>Inactive</Badge>

// Info - New, informational
<Badge variant="info" dot>New</Badge>
```

### Role-Based Badges

```typescript
// Admin roles
<Badge variant="default">Super Admin</Badge>
<Badge variant="info">Admin</Badge>
<Badge variant="outline">Support</Badge>
```

### Count Badges

```typescript
// Notifications
<span className="relative">
  <BellIcon />
  <Badge variant="destructive" size="sm" className="absolute -top-1 -right-1">
    5
  </Badge>
</span>
```

### Badge Sizing

```typescript
// Small - Inline text, compact spaces
<Badge size="sm">Tag</Badge>

// Medium - Standard (default)
<Badge size="md">Category</Badge>

// Large - Emphasis
<Badge size="lg">Featured</Badge>
```

---

## Form Patterns

### Form Layout

```typescript
<form onSubmit={handleSubmit} className="space-y-6">
  {/* Form group with label */}
  <FormGroup label="Email Address" required error={errors.email}>
    <Input
      type="email"
      placeholder="you@example.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </FormGroup>

  {/* Form group with help text */}
  <FormGroup
    label="Username"
    helpText="Choose a unique username"
    error={errors.username}
  >
    <Input
      type="text"
      placeholder="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
  </FormGroup>

  {/* Select field */}
  <FormGroup label="Role" required>
    <Select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      options={[
        { value: '', label: 'Select a role...' },
        { value: 'admin', label: 'Administrator' },
        { value: 'user', label: 'User' },
      ]}
    />
  </FormGroup>

  {/* Textarea */}
  <FormGroup label="Description">
    <Textarea
      placeholder="Enter description..."
      rows={4}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />
  </FormGroup>

  {/* Form actions */}
  <div className="flex gap-3 pt-4">
    <Button type="button" variant="secondary">
      Cancel
    </Button>
    <Button type="submit" variant="primary" loading={isSubmitting}>
      Submit
    </Button>
  </div>
</form>
```

### Input with Icon

```typescript
<Input
  type="email"
  placeholder="Search..."
  icon={<SearchIcon className="w-4 h-4" />}
/>

<Input
  type="password"
  placeholder="Password"
  iconAfter={<EyeIcon className="w-4 h-4" />}
/>
```

### Error States

```typescript
<Input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError || "Please enter a valid email"}
/>
```

### Disabled States

```typescript
<Input
  type="text"
  value={readOnlyValue}
  disabled
  placeholder="Read only"
/>
```

---

## Typography Hierarchy

### Page Titles

```typescript
<h1 className="font-decorative text-4xl md:text-5xl font-bold mb-8">
  Dashboard
</h1>
```

### Section Headings

```typescript
<h2 className="font-decorative text-3xl md:text-4xl font-bold mb-6">
  User Management
</h2>
```

### Subsection Headings

```typescript
<h3 className="font-decorative text-2xl md:text-3xl mb-4">
  Active Users
</h3>
```

### Card Titles

```typescript
<CardTitle as="h4">
  User Profile
</CardTitle>
// Renders as h4 with font-serif text-xl md:text-2xl font-semibold
```

### Body Text

```typescript
// Large body text - Lead paragraphs
<p className="body-l text-foreground">
  Important introductory text
</p>

// Medium body text - Standard
<p className="body-m text-foreground">
  Standard paragraph text
</p>

// Small body text - Captions
<p className="body-s text-muted-foreground">
  Caption or help text
</p>
```

### Typography in Glass Cards

```typescript
<Card variant="default" padding="md">
  <h3 className="font-decorative text-2xl mb-4">
    Card Title with Glow
  </h3>
  <p className="text-foreground mb-4">
    Standard paragraph in glass card
  </p>
  <p className="text-muted-foreground text-sm">
    Secondary information
  </p>
</Card>
```

---

## Layout Patterns

### Page Layout

```typescript
<div className="min-h-screen bg-background">
  {/* Header */}
  <header className="glass-card border-b border-primary/20 px-6 py-4 sticky top-0 z-10">
    <h1 className="font-decorative text-2xl">Dashboard</h1>
  </header>

  {/* Main content */}
  <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
    <div className="space-y-8">
      {/* Content sections */}
    </div>
  </main>
</div>
```

### Dashboard Grid

```typescript
// Stats grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
  {stats.map((stat) => (
    <Card key={stat.id} variant="default" padding="md">
      <CardContent>
        <div className="text-3xl font-decorative text-primary">
          {stat.value}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {stat.label}
        </p>
      </CardContent>
    </Card>
  ))}
</div>
```

### Two-Column Layout

```typescript
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Main content (2/3 width) */}
  <div className="lg:col-span-2 space-y-6">
    {/* Primary content */}
  </div>

  {/* Sidebar (1/3 width) */}
  <div className="space-y-6">
    {/* Secondary content */}
  </div>
</div>
```

### Section Spacing

```typescript
<div className="space-y-8">
  <section>
    <h2 className="font-decorative text-3xl mb-6">Section 1</h2>
    {/* Section content */}
  </section>

  <section>
    <h2 className="font-decorative text-3xl mb-6">Section 2</h2>
    {/* Section content */}
  </section>
</div>
```

---

## Responsive Design

### Responsive Grid

```typescript
// Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {/* Grid items */}
</div>

// Mobile: 1 column, Desktop: 4 columns (dashboard stats)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Stat cards */}
</div>
```

### Responsive Typography

```typescript
// Responsive heading sizes
<h1 className="text-3xl md:text-4xl lg:text-5xl font-decorative">
  Responsive Heading
</h1>

// Responsive body text
<p className="text-sm md:text-base lg:text-lg">
  Responsive paragraph
</p>
```

### Responsive Padding

```typescript
// Responsive card padding
<Card padding="none" className="p-4 md:p-6 lg:p-8">
  {/* Content */}
</Card>

// Responsive page padding
<div className="px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
  {/* Page content */}
</div>
```

### Mobile-First Patterns

```typescript
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">
  <Button variant="secondary" fullWidth>Cancel</Button>
  <Button variant="primary" fullWidth>Confirm</Button>
</div>

// Hide on mobile, show on desktop
<div className="hidden md:block">
  Desktop only content
</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">
  Mobile only content
</div>
```

---

## Accessibility

### Keyboard Navigation

All interactive components support keyboard navigation:

```typescript
// Buttons receive focus
<Button variant="primary">
  Accessible Button
</Button>

// Cards with onClick need tabIndex
<Card
  variant="default"
  hover
  padding="md"
  onClick={handleClick}
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  role="button"
>
  Keyboard accessible card
</Card>
```

### Form Labels

Always associate labels with inputs:

```typescript
// Using Label component
<Label htmlFor="email" required>
  Email Address
</Label>
<Input id="email" type="email" />

// Using FormGroup (handles association)
<FormGroup label="Email Address" required>
  <Input type="email" />
</FormGroup>
```

### ARIA Attributes

```typescript
// Button with loading state
<Button
  variant="primary"
  loading={isLoading}
  disabled={isLoading}
  aria-label={isLoading ? 'Loading...' : 'Submit form'}
>
  Submit
</Button>

// Icon-only button
<Button
  variant="ghost"
  icon={<CloseIcon />}
  aria-label="Close dialog"
/>
```

### Focus States

All components have visible focus states:

```css
/* Automatically applied */
focus:outline-none focus:ring-2 focus:ring-primary
```

### Color Contrast

All Ozean Licht color combinations meet WCAG AA standards:
- Primary (#0ec2bc) on Background (#0A0F1A): Pass
- Foreground (#FFFFFF) on Background (#0A0F1A): Pass AAA
- Muted text (#94A3B8) on Background (#0A0F1A): Pass AAA

---

## Performance Considerations

### Glass Effects on Mobile

Limit glass effects on mobile for performance:

```typescript
// Conditional glass effect
<Card
  variant={isMobile ? 'default' : 'default'}
  className={!isMobile && 'glass-card'}
  padding="md"
>
  Content
</Card>

// Or use media queries in CSS
<Card variant="default" padding="md" className="md:glass-card">
  Content
</Card>
```

### Animation Performance

Use CSS transforms for animations (GPU accelerated):

```typescript
// Good - GPU accelerated
<div className="animate-float">Floating element</div>

// Avoid - Causes layout recalculation
<div style={{ marginTop: animatedValue }}>Avoid</div>
```

### Limit Glow Animations

```typescript
// Good - 1-2 glow animations per viewport
<Card variant="strong" glow>Featured</Card>

// Bad - Too many glow animations
{items.map(item => (
  <Card glow>{item.name}</Card> // Don't do this!
))}
```

### Lazy Loading

Lazy load card content when possible:

```typescript
import dynamic from 'next/dynamic'

const HeavyCard = dynamic(() => import('./HeavyCard'), {
  loading: () => <Card variant="subtle" padding="md">Loading...</Card>
})
```

---

## Common Patterns Checklist

When building a new feature, use this checklist:

### Layout
- [ ] Used cosmic background (#0A0F1A)
- [ ] Applied responsive padding (px-4 md:px-6 lg:px-8)
- [ ] Used appropriate grid/flex layouts
- [ ] Mobile-first responsive design

### Typography
- [ ] Page title uses font-decorative
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Body text uses Montserrat (default)
- [ ] Text contrast meets WCAG AA

### Components
- [ ] Glass cards for content containers
- [ ] Appropriate button variants (1 primary per section)
- [ ] Semantic badge colors for status
- [ ] Form fields have labels and error states

### Colors
- [ ] Primary color: #0ec2bc (turquoise)
- [ ] No light backgrounds
- [ ] Semantic colors for status (success, warning, destructive)

### Accessibility
- [ ] All interactive elements keyboard accessible
- [ ] Form labels associated with inputs
- [ ] Visible focus states
- [ ] ARIA labels where needed

### Performance
- [ ] Limited glass effects on mobile
- [ ] Max 1-2 glow animations per viewport
- [ ] Used CSS transforms for animations
- [ ] Lazy loaded heavy components

---

## Quick Reference

### Import Components

```typescript
import { Button, Card, Badge, Input, Select } from '@ozean-licht/shared-ui'
import { cn } from '@ozean-licht/shared-ui'
```

### Common Class Combinations

```typescript
// Standard card
className="glass-card rounded-lg p-6 space-y-4"

// Interactive card
className="glass-card glass-hover rounded-lg p-6 cursor-pointer"

// Featured card
className="glass-card-strong animate-glow rounded-lg p-8"

// Page container
className="container mx-auto px-4 md:px-6 lg:px-8 py-8"

// Card grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

---

## Getting Help

- **Design System:** See [/design-system.md](/design-system.md)
- **Branding:** See [/BRANDING.md](/BRANDING.md)
- **Component API:** See [/shared/ui-components/README.md](/shared/ui-components/README.md)
- **Issues:** Create issue in repository

---

**Version:** 0.1.0
**Maintained by:** Ozean Licht Platform Team + AI Agents
**Last Updated:** 2025-11-11
