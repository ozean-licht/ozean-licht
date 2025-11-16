# Component Pattern Library

**Version:** 1.0.0
**Last Updated:** 2025-11-12

---

## Overview

This document catalogs common component patterns, composition techniques, and best practices for building with the Ozean Licht component library.

**Purpose:**
- Provide reusable patterns for common UI needs
- Document composition techniques
- Show anti-patterns to avoid
- Accelerate development with proven solutions

---

## Table of Contents

1. [Form Patterns](#form-patterns)
2. [Feedback Patterns](#feedback-patterns)
3. [Layout Patterns](#layout-patterns)
4. [Composition Patterns](#composition-patterns)
5. [State Management Patterns](#state-management-patterns)
6. [Anti-Patterns](#anti-patterns)

---

## Form Patterns

### Pattern: Form Field with Label and Error

**Use Case:** Standard form input with label and validation feedback

**Implementation:**
```tsx
<div className="space-y-2">
  <label htmlFor="email" className="text-sm font-medium">
    Email <span className="text-red-500">*</span>
  </label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
    className={errors.email ? 'border-red-500' : ''}
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {errors.email && (
    <p id="email-error" className="text-sm text-red-500">
      {errors.email}
    </p>
  )}
</div>
```

**Key Points:**
- Always associate label with input (htmlFor/id)
- Mark required fields visually
- Use aria-invalid for screen readers
- Use aria-describedby to link error message
- Apply error styling conditionally

---

### Pattern: Form Group with Help Text

**Use Case:** Form field with additional explanatory text

**Implementation:**
```tsx
<div className="space-y-2">
  <label htmlFor="username" className="text-sm font-medium">
    Username
  </label>
  <Input
    id="username"
    placeholder="johndoe"
    aria-describedby="username-help"
  />
  <p id="username-help" className="text-sm text-muted-foreground">
    Choose a unique username. Letters, numbers, and underscores only.
  </p>
</div>
```

**Key Points:**
- Help text goes below input
- Link help text with aria-describedby
- Use muted color for help text
- Keep help text concise

---

### Pattern: Input with Icons

**Use Case:** Input with decorative or functional icons

**Implementation:**
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input
    placeholder="Search..."
    className="pl-10"
  />
</div>
```

**Key Points:**
- Use relative positioning on container
- Position icon absolutely
- Add padding to input to avoid overlap
- Use appropriate icon size (typically h-4 w-4)

---

### Pattern: Form with Sections

**Use Case:** Multi-section form with clear grouping

**Implementation:**
```tsx
<form onSubmit={handleSubmit} className="space-y-8">
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Personal Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <FormField label="First Name" name="firstName" />
      <FormField label="Last Name" name="lastName" />
    </div>
  </div>

  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Contact Details</h3>
    <FormField label="Email" name="email" type="email" />
    <FormField label="Phone" name="phone" type="tel" />
  </div>

  <div className="flex justify-end gap-4">
    <Button type="button" variant="ghost" onClick={onCancel}>
      Cancel
    </Button>
    <Button type="submit" variant="primary">
      Save
    </Button>
  </div>
</form>
```

**Key Points:**
- Use consistent spacing (space-y-8 for sections, space-y-4 within)
- Section headings clarify grouping
- Grid layout for horizontal fields
- Action buttons at bottom, right-aligned
- Primary action is rightmost

---

## Feedback Patterns

### Pattern: Success Feedback

**Use Case:** Confirm successful action

**Implementation:**
```tsx
{isSuccess && (
  <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950">
    <CheckCircle2 className="h-4 w-4 text-green-600" />
    <AlertTitle>Success!</AlertTitle>
    <AlertDescription>
      Your changes have been saved successfully.
    </AlertDescription>
  </Alert>
)}
```

**Key Points:**
- Use semantic green color
- Include success icon
- Clear, positive message
- Auto-dismiss after 5 seconds (optional)

---

### Pattern: Inline Validation

**Use Case:** Real-time form validation

**Implementation:**
```tsx
const [value, setValue] = useState('');
const [error, setError] = useState('');

const validate = (val: string) => {
  if (val.length < 3) {
    setError('Must be at least 3 characters');
  } else if (!/^[a-z0-9_]+$/.test(val)) {
    setError('Only lowercase, numbers, and underscores');
  } else {
    setError('');
  }
};

return (
  <div className="space-y-2">
    <Input
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        validate(e.target.value);
      }}
      onBlur={() => validate(value)}
      className={error ? 'border-red-500' : ''}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
```

**Key Points:**
- Validate on blur (not every keystroke)
- Show errors immediately after blur
- Clear errors when fixed
- Don't validate until first blur

---

### Pattern: Loading State

**Use Case:** Indicate async operation in progress

**Implementation:**
```tsx
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

**Key Points:**
- Disable button during loading
- Show spinner icon
- Update button text
- Use semantic loading state

---

### Pattern: Status Badge

**Use Case:** Display status or category

**Implementation:**
```tsx
const statusConfig = {
  active: { variant: 'success', label: 'Active' },
  pending: { variant: 'warning', label: 'Pending' },
  inactive: { variant: 'outline', label: 'Inactive' },
} as const;

<Badge variant={statusConfig[status].variant}>
  {statusConfig[status].label}
</Badge>
```

**Key Points:**
- Map status to visual variant
- Use consistent colors across app
- Consider icon prefix
- Keep labels short (1-2 words)

---

## Layout Patterns

### Pattern: Card Grid

**Use Case:** Display multiple cards in responsive grid

**Implementation:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <Card key={item.id} className="glass-card">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{item.description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  ))}
</div>
```

**Key Points:**
- Use responsive grid (1 col mobile, 2-3 desktop)
- Consistent gap spacing
- Apply glass-card class for Ozean Licht style
- Semantic card sections (Header, Content, Footer)

---

### Pattern: Dashboard Stats

**Use Case:** Display key metrics in cards

**Implementation:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map((stat) => (
    <Card key={stat.label} className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
          <stat.icon className="h-8 w-8 text-primary" />
        </div>
        {stat.change && (
          <p className={cn(
            "text-sm mt-2",
            stat.change > 0 ? "text-green-600" : "text-red-600"
          )}>
            {stat.change > 0 ? '+' : ''}{stat.change}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  ))}
</div>
```

**Key Points:**
- Large, prominent value
- Descriptive label
- Optional icon
- Trend indicator (up/down)
- Responsive grid

---

### Pattern: Two-Column Layout

**Use Case:** Main content with sidebar

**Implementation:**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  <main className="lg:col-span-8">
    {/* Main content */}
  </main>
  <aside className="lg:col-span-4">
    {/* Sidebar */}
  </aside>
</div>
```

**Key Points:**
- Use 12-column grid for flexibility
- Stack on mobile (1 column)
- Side-by-side on desktop
- Main content is wider (8 vs 4 columns)

---

## Composition Patterns

### Pattern: Compound Components

**Use Case:** Related components that work together

**Example: Alert with all parts**
```tsx
<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the CLI.
  </AlertDescription>
</Alert>
```

**Key Points:**
- Components work together semantically
- Flexible composition
- Each part is optional (except root)
- Maintains accessibility

---

### Pattern: Slot Pattern

**Use Case:** Inject content into predefined slots

**Example: Card with icon slot**
```tsx
<Card>
  <CardHeader>
    <div className="flex items-center gap-3">
      {icon && <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>}
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent>{children}</CardContent>
</Card>
```

**Key Points:**
- Named slots for specific content
- Optional slots
- Consistent positioning
- Flexible content

---

### Pattern: Render Props

**Use Case:** Share component logic

**Example: Data fetching with render prop**
```tsx
<DataFetcher url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <Skeleton />
    if (error) return <Alert variant="destructive">{error.message}</Alert>
    return <UserList users={data} />
  }}
</DataFetcher>
```

**Key Points:**
- Separation of logic and presentation
- Flexible rendering
- Type-safe with TypeScript
- Reusable patterns

---

## State Management Patterns

### Pattern: Controlled vs Uncontrolled

**Controlled (Recommended for complex logic):**
```tsx
const [value, setValue] = useState('');

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Uncontrolled (Simpler for basic forms):**
```tsx
const inputRef = useRef<HTMLInputElement>(null);

const handleSubmit = () => {
  console.log(inputRef.current?.value);
};

<Input ref={inputRef} defaultValue="initial" />
```

**When to use:**
- Controlled: Complex validation, dynamic updates, multiple dependent fields
- Uncontrolled: Simple forms, less re-renders, performance critical

---

### Pattern: Form State with React Hook Form

**Use Case:** Complex form with validation

**Implementation:**
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    // Submit logic
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email">Email</label>
        <Input {...register('email')} id="email" />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
};
```

**Key Points:**
- Schema validation with Zod
- Type-safe form data
- Automatic error handling
- Performance optimized

---

## Anti-Patterns

### ❌ Don't: Hardcode Colors

```tsx
// Bad
<div className="bg-[#0ec2bc] text-white">Content</div>

// Good
<div className="bg-primary text-white">Content</div>
```

**Why:** Hard to maintain, breaks theming, inconsistent

---

### ❌ Don't: Use Div for Interactive Elements

```tsx
// Bad
<div onClick={handleClick} className="cursor-pointer">Click me</div>

// Good
<button onClick={handleClick}>Click me</button>
```

**Why:** Inaccessible, no keyboard support, wrong semantics

---

### ❌ Don't: Skip Error Boundaries

```tsx
// Bad
<SomeComponent />

// Good
<ErrorBoundary fallback={<Alert variant="destructive">Error loading component</Alert>}>
  <SomeComponent />
</ErrorBoundary>
```

**Why:** Unhandled errors crash entire app

---

### ❌ Don't: Ignore Loading States

```tsx
// Bad
{data && <UserList users={data} />}

// Good
{isLoading ? (
  <Skeleton />
) : error ? (
  <Alert variant="destructive">{error.message}</Alert>
) : (
  <UserList users={data} />
)}
```

**Why:** Poor UX, confusing to users

---

### ❌ Don't: Use Inline Styles

```tsx
// Bad
<Button style={{ backgroundColor: '#0ec2bc', padding: '12px' }}>Click</Button>

// Good
<Button variant="primary" size="lg">Click</Button>
```

**Why:** Not responsive, hard to maintain, inconsistent

---

### ❌ Don't: Nest Components Too Deeply

```tsx
// Bad (6+ levels deep)
<Card>
  <CardContent>
    <div>
      <div>
        <div>
          <div>Content</div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

// Good (extract components)
<Card>
  <CardContent>
    <ContentSection>Content</ContentSection>
  </CardContent>
</Card>
```

**Why:** Hard to read, performance issues, difficult debugging

---

## Best Practices Summary

### Do
- ✅ Use semantic HTML
- ✅ Follow accessibility guidelines
- ✅ Use design tokens (Tailwind classes)
- ✅ Extract reusable components
- ✅ Add loading and error states
- ✅ Use TypeScript types
- ✅ Test with keyboard navigation
- ✅ Document complex patterns

### Don't
- ❌ Hardcode values
- ❌ Skip error handling
- ❌ Ignore accessibility
- ❌ Use inline styles
- ❌ Over-engineer simple patterns
- ❌ Copy-paste code (extract component)
- ❌ Skip loading states
- ❌ Forget responsive design

---

## Contributing Patterns

Found a useful pattern? Add it to this library:

1. **Document the pattern:**
   - Name and purpose
   - Implementation code
   - Key points
   - When to use

2. **Create a story:**
   - Add to Storybook
   - Show variations
   - Include best practices

3. **Submit PR:**
   - Update this document
   - Add example to Storybook
   - Get team review

---

**Maintained By:** Frontend Team Lead
**Last Updated:** 2025-11-12
**Next Review:** Monthly (add new patterns as discovered)
