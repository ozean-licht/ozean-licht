# Contributing to Ozean Licht Storybook

**Version:** 1.0.0
**Last Updated:** 2025-11-12
**Status:** Official Contributor Guide

---

## Welcome!

Thank you for contributing to the Ozean Licht component library documentation! This guide will help you add, update, and maintain component stories in our Storybook.

**What is Storybook?**
Storybook is an interactive documentation and development environment for UI components. It allows us to develop components in isolation, document their API, and showcase different use cases.

---

## Quick Start

### Adding a New Component Story

**Time required:** 15-30 minutes

1. **Run the story generator:**
   ```bash
   npm run generate-story ComponentName
   ```

2. **Edit the generated story file:**
   ```bash
   # Location depends on component type:
   shared/ui-components/src/components/ComponentName.stories.tsx
   apps/admin/components/ui/ComponentName.stories.tsx
   ```

3. **Start Storybook:**
   ```bash
   npm run storybook
   ```

4. **View your component at:**
   ```
   http://localhost:6006/
   ```

5. **Test and iterate** until your story meets the requirements below

---

## Story Requirements

Every component story MUST include:

### 1. Default Story
```tsx
export const Default: Story = {
  args: {
    // Default props
  },
};
```

### 2. All Variants
```tsx
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Component variant="primary" />
      <Component variant="secondary" />
      <Component variant="ghost" />
    </div>
  ),
};
```

### 3. Interactive Examples
```tsx
export const Interactive: Story = {
  args: {
    // Interactive props with controls
  },
};
```

### 4. Real-World Usage
```tsx
export const RealWorldExample: Story = {
  render: () => (
    // Actual usage scenario
  ),
};
```

### 5. Documentation
- Component description
- Props documentation (via TypeScript + argTypes)
- Usage examples
- Accessibility notes (if relevant)

---

## File Structure

### Shared UI Components
```
shared/ui-components/src/
├── components/
│   └── ComponentName.stories.tsx    # CSF 3.0 story file
└── ui/
    ├── component-name.tsx           # Component implementation
    └── component-name.stories.tsx   # Alternative location
```

### Admin Components
```
apps/admin/components/
└── ui/
    ├── component-name.tsx
    └── component-name.stories.tsx
```

### Naming Conventions
- **Story files:** `ComponentName.stories.tsx` (PascalCase)
- **Story exports:** `export const StoryName: Story` (PascalCase)
- **Meta title:** `'Shared UI/ComponentName'` or `'Admin/ComponentName'`

---

## Story Patterns

### CSF 3.0 Format (Required)

We use **Component Story Format 3.0** for all stories:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './component-name';

/**
 * ComponentName description goes here.
 *
 * ## Features
 * - Feature 1
 * - Feature 2
 *
 * ## Usage
 * ```tsx
 * <ComponentName prop="value" />
 * ```
 */
const meta = {
  title: 'Shared UI/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Brief description for auto-docs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Component size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// Stories go here...
```

### Essential Stories

**1. Default Story**
```tsx
/**
 * Default component with standard props
 */
export const Default: Story = {
  args: {
    variant: 'primary',
    children: 'Label',
  },
};
```

**2. All Variants Showcase**
```tsx
/**
 * Showcase all available variants
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <ComponentName variant="primary">Primary</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
      <ComponentName variant="ghost">Ghost</ComponentName>
    </div>
  ),
};
```

**3. All Sizes**
```tsx
/**
 * Component in different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="md">Medium</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
};
```

**4. States (Disabled, Loading, Error)**
```tsx
/**
 * Component in different states
 */
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <ComponentName>Normal</ComponentName>
      <ComponentName disabled>Disabled</ComponentName>
      <ComponentName loading>Loading</ComponentName>
      <ComponentName error>Error</ComponentName>
    </div>
  ),
};
```

**5. Real-World Examples**
```tsx
/**
 * Realistic usage scenarios
 */
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3>Login Form</h3>
        <ComponentName type="submit" variant="primary">
          Sign In
        </ComponentName>
      </div>
      <div>
        <h3>Navigation</h3>
        <ComponentName variant="ghost">
          Go Back
        </ComponentName>
      </div>
    </div>
  ),
};
```

---

## Advanced Features

### Play Functions (Interaction Testing)

Add interactive tests to your stories:

```tsx
import { userEvent, within, expect } from '@storybook/test';

export const ClickTest: Story = {
  args: {
    onClick: fn(), // Mock function for testing
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Find button
    const button = canvas.getByRole('button');

    // Click it
    await userEvent.click(button);

    // Verify onClick was called
    await expect(args.onClick).toHaveBeenCalled();
  },
};
```

### Decorators (Wrappers)

Wrap stories with consistent styling:

```tsx
const meta = {
  // ... other config
  decorators: [
    (Story) => (
      <div className="max-w-md p-8 bg-gray-100 rounded">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ComponentName>;
```

### Custom Args (Dynamic Controls)

```tsx
export const CustomColors: Story = {
  args: {
    style: {
      backgroundColor: '#0ec2bc',
      color: '#ffffff',
    },
  },
  argTypes: {
    style: {
      control: 'object',
    },
  },
};
```

---

## Accessibility Requirements

All stories MUST be accessible. Test with the **A11y addon**:

### Required Practices

1. **Semantic HTML**
   ```tsx
   // Good
   <button type="button">Click me</button>

   // Bad
   <div onClick={...}>Click me</div>
   ```

2. **ARIA Labels**
   ```tsx
   <button aria-label="Close dialog">
     <X className="h-4 w-4" />
   </button>
   ```

3. **Keyboard Navigation**
   - Test with Tab, Enter, Space, Escape
   - Ensure focus indicators are visible

4. **Color Contrast**
   - Must meet WCAG AA standards (4.5:1 for text)
   - Use Ozean Licht palette (defined in BRANDING.md)

5. **Screen Reader Support**
   ```tsx
   <div role="alert" aria-live="polite">
     Success message
   </div>
   ```

### Testing Accessibility

1. Click the **Accessibility** tab in Storybook
2. Fix all violations marked as "Serious" or "Critical"
3. Document any known limitations

---

## Story Documentation

### Component Description (Required)

Add a JSDoc comment above the meta object:

```tsx
/**
 * Button component for user actions.
 *
 * ## Features
 * - Multiple variants (primary, secondary, ghost)
 * - All standard sizes (sm, md, lg)
 * - Loading and disabled states
 * - Full keyboard support
 *
 * ## Usage
 * ```tsx
 * import { Button } from '@/components/ui/button'
 *
 * <Button variant="primary" size="lg">
 *   Click me
 * </Button>
 * ```
 *
 * ## Accessibility
 * - Semantic <button> element
 * - Focus indicators
 * - Screen reader friendly
 */
const meta = {
  // ... config
};
```

### Story Descriptions (Recommended)

Add comments above each story:

```tsx
/**
 * Default button with primary styling.
 * This is the most common button variant used throughout the app.
 */
export const Default: Story = {
  // ... story config
};
```

### Props Documentation

Use `argTypes` to document component props:

```tsx
argTypes: {
  variant: {
    control: 'select',
    options: ['primary', 'secondary', 'ghost'],
    description: 'Visual style variant',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'primary' },
    },
  },
  disabled: {
    control: 'boolean',
    description: 'Disables the button and prevents interaction',
  },
}
```

---

## Testing Your Story

### Local Testing

1. **Start Storybook:**
   ```bash
   npm run storybook
   ```

2. **Visual Check:**
   - View your story in the browser
   - Test all variants
   - Try the interactive controls

3. **Accessibility Check:**
   - Open the **Accessibility** tab
   - Fix all violations

4. **Interaction Testing:**
   - Click, hover, focus on elements
   - Test keyboard navigation
   - Test screen reader (optional but recommended)

### Automated Testing

1. **Build Test:**
   ```bash
   npm run build-storybook
   ```
   Should complete without errors.

2. **Interaction Tests:**
   ```bash
   npm run test-storybook
   ```
   Should pass all play function tests.

---

## Common Patterns

### Form Components

```tsx
export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="input-1" className="text-sm font-medium">
        Email
      </label>
      <Input id="input-1" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="input-2">Email</label>
      <Input
        id="input-2"
        type="email"
        className="border-red-500"
        placeholder="you@example.com"
      />
      <p className="text-sm text-red-500">Invalid email address</p>
    </div>
  ),
};
```

### Card Layouts

```tsx
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Card>Card 1</Card>
      <Card>Card 2</Card>
      <Card>Card 3</Card>
    </div>
  ),
};
```

### Modal/Dialog Components

```tsx
import { useState } from 'react';

export const OpenDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Dialog content goes here.
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </>
    );
  },
};
```

---

## Do's and Don'ts

### Do

- ✅ Use CSF 3.0 format (`satisfies` syntax)
- ✅ Document all props with `argTypes`
- ✅ Show all component variants
- ✅ Include real-world examples
- ✅ Test accessibility with A11y addon
- ✅ Use TypeScript types
- ✅ Add JSDoc comments
- ✅ Follow Ozean Licht branding (see BRANDING.md)
- ✅ Test keyboard navigation
- ✅ Use semantic HTML

### Don't

- ❌ Use CSF 2.0 format (deprecated)
- ❌ Skip accessibility testing
- ❌ Hardcode colors (use design tokens)
- ❌ Forget to document props
- ❌ Mix Ozean Licht and Kids Ascension branding
- ❌ Add stories without variants
- ❌ Use `any` types
- ❌ Skip TypeScript types
- ❌ Forget the "All Variants" story
- ❌ Ignore A11y violations

---

## Review Checklist

Before submitting your story for review, ensure:

- [ ] Story uses CSF 3.0 format
- [ ] Component description is clear and complete
- [ ] All props are documented in `argTypes`
- [ ] Default story exists
- [ ] All variants are showcased
- [ ] Real-world examples are included
- [ ] Accessibility tab shows no critical violations
- [ ] Story builds without errors (`npm run build-storybook`)
- [ ] Story follows Ozean Licht branding
- [ ] TypeScript types are correct
- [ ] Code is formatted (Prettier)
- [ ] No console errors in browser

See `.storybook/REVIEW_CHECKLIST.md` for the complete checklist.

---

## Getting Help

### Resources

- **Storybook Docs:** https://storybook.js.org/docs/react
- **CSF 3.0 Guide:** https://storybook.js.org/docs/react/api/csf
- **Accessibility Guide:** `.storybook/TESTING_GUIDE.mdx`
- **Design Tokens:** `.storybook/DESIGN_TOKENS.mdx`
- **Component Guidelines:** `.storybook/COMPONENT_GUIDELINES.mdx`
- **Branding Guide:** `BRANDING.md`

### Ask for Help

- **Slack:** #storybook-help channel
- **GitHub Issues:** Tag with `storybook` label
- **Team:** Ask frontend team lead

### Common Issues

**Issue: "Cannot find module '@/components/ui/button'"**
- **Solution:** Use relative imports in shared UI components

**Issue: "Duplicate story export"**
- **Solution:** Ensure all story names are unique in the file

**Issue: "Accessibility violations"**
- **Solution:** Check the A11y tab, follow recommendations

**Issue: "Build fails"**
- **Solution:** Run `npm run build-storybook` locally, fix TypeScript errors

---

## Contributing Workflow

### 1. Create a Branch
```bash
git checkout -b feature/add-component-story
```

### 2. Generate Story
```bash
npm run generate-story ComponentName
```

### 3. Write Story
- Add required stories (Default, All Variants, etc.)
- Document props with `argTypes`
- Test accessibility

### 4. Test Locally
```bash
npm run storybook
npm run build-storybook
```

### 5. Commit Changes
```bash
git add .
git commit -m "feat(storybook): add ComponentName story"
```

### 6. Push and Create PR
```bash
git push origin feature/add-component-story
```

### 7. Request Review
- Tag frontend team lead
- Include screenshot of story
- Note any accessibility considerations

### 8. Address Feedback
- Fix requested changes
- Re-test locally
- Push updates

### 9. Merge
- Squash and merge when approved
- Delete feature branch
- Story will auto-deploy to production

---

## Advanced Topics

### Story Composition

Reuse stories in other stories:

```tsx
import { Default as ButtonDefault } from './Button.stories';

export const ButtonInCard: Story = {
  render: () => (
    <Card>
      <ButtonDefault.render {...ButtonDefault.args} />
    </Card>
  ),
};
```

### Mocking Data

Use MSW (Mock Service Worker) for API mocking:

```tsx
import { rest } from 'msw';

export const WithMockedData: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get('/api/users', (req, res, ctx) => {
          return res(ctx.json({ users: [...] }));
        }),
      ],
    },
  },
};
```

### Custom Theming

Override theme for specific stories:

```tsx
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};
```

---

## Maintenance

### Updating Stories

When updating a component:

1. Update the component implementation
2. Update the story to reflect changes
3. Add new variants if applicable
4. Test existing stories still work
5. Update documentation

### Deprecating Components

When deprecating a component:

1. Add deprecation notice to story description:
   ```tsx
   /**
    * @deprecated Use NewComponent instead
    */
   ```

2. Keep story for backward compatibility
3. Link to replacement component
4. Plan removal date (minimum 2 releases)

---

## Questions?

If you have questions not covered in this guide:

1. Check existing stories for examples
2. Read the Storybook official docs
3. Ask in #storybook-help Slack channel
4. Create a GitHub discussion

---

**Thank you for contributing to Ozean Licht Storybook!** 🚀

Your documentation helps the entire team build better, more accessible components.

---

**Document Maintained By:** Frontend Team Lead
**Last Updated:** 2025-11-12
**Next Review:** Quarterly (every 3 months)
