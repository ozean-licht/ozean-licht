import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './button';
import { Mail, ArrowRight, Download, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Button primitive component built on Radix UI Slot.
 *
 * **This is a Tier 1 Primitive** - unstyled shadcn/Radix UI component with minimal default styling.
 * For Ozean Licht branded buttons with gradient CTA, glow effects, and cosmic theme, see **Tier 2 Branded/Button**.
 *
 * ## Radix UI Slot Features
 * - **Slot Pattern**: Use `asChild` prop to merge button props into a child element
 * - **Flexible Composition**: Render as different elements (link, div, etc.) while maintaining button API
 * - **Type Safe**: Full TypeScript support with proper ButtonHTMLAttributes
 * - **Accessible**: Semantic HTML with proper ARIA attributes
 * - **Class Variance Authority**: Type-safe variant and size props
 *
 * ## Button Variants
 * - **default** - Primary filled button with background
 * - **destructive** - Red variant for dangerous actions
 * - **outline** - Border-only button with transparent background
 * - **secondary** - Lower emphasis filled button
 * - **ghost** - Minimal button with hover state only
 * - **link** - Text-only button styled as hyperlink
 *
 * ## Button Sizes
 * - **default** - Standard size (h-10, px-4, py-2)
 * - **sm** - Small size (h-9, px-3)
 * - **lg** - Large size (h-11, px-8)
 * - **icon** - Square icon-only button (h-10, w-10)
 *
 * ## Usage Notes
 * - Use `asChild` to render button as another element (e.g., `<a>`, `<Link>`)
 * - Button includes automatic icon sizing via `[&_svg]:size-4` utility
 * - Focus ring appears on keyboard navigation (focus-visible)
 * - Disabled state includes pointer-events-none for accessibility
 * - Gap utility (gap-2) automatically spaces icon + text
 *
 * ## Component Structure
 * ```tsx
 * <Button variant="default" size="default">
 *   <Icon /> // Icons automatically sized to 16px (size-4)
 *   Click me
 * </Button>
 *
 * // Render as link using Slot pattern
 * <Button asChild>
 *   <a href="/page">Navigate</a>
 * </Button>
 * ```
 *
 * @see Tier 2 Branded/Button for Ozean Licht themed buttons with advanced features
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A foundational button component built with Radix UI Slot pattern and styled with class-variance-authority. Provides flexible composition and type-safe variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual style variant',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    asChild: {
      control: 'boolean',
      description: 'Merge props into child element using Radix Slot',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button interaction',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button with primary styling.
 *
 * The most basic button implementation with default variant and size.
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * All button variants showcase.
 *
 * Displays all 6 button variants side-by-side to compare visual styles.
 * Use this reference when choosing the appropriate variant for your use case.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

/**
 * Default variant (primary button).
 *
 * Primary filled button for main actions. Uses primary color with hover state.
 */
export const DefaultVariant: Story = {
  args: {
    variant: 'default',
    children: 'Default Button',
  },
};

/**
 * Destructive variant for dangerous actions.
 *
 * Red button for destructive actions like delete, remove, or cancel.
 * Clearly signals to users that this action is potentially dangerous.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Account',
  },
};

/**
 * Outline variant with border.
 *
 * Border-only button with transparent background. Good for secondary actions
 * or when you need less visual weight than the default variant.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

/**
 * Secondary variant for lower emphasis.
 *
 * Filled button with secondary color. Use for less important actions
 * that still need more emphasis than ghost or outline variants.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Action',
  },
};

/**
 * Ghost variant with minimal styling.
 *
 * Minimal button with only hover state. Perfect for tertiary actions,
 * close buttons, or when you need maximum visual subtlety.
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

/**
 * Link variant styled as hyperlink.
 *
 * Text-only button styled like a hyperlink with underline on hover.
 * Use when button should visually appear as inline text link.
 */
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

/**
 * All button sizes showcase.
 *
 * Displays all 4 size variants including icon-only button.
 * Note how icon size remains consistent across all sizes.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Mail className="h-4 w-4" />
      </Button>
    </div>
  ),
};

/**
 * Small size button.
 *
 * Compact button (h-9, px-3) for tight spaces or dense UIs.
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

/**
 * Large size button.
 *
 * Larger button (h-11, px-8) for prominent CTAs or touch interfaces.
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

/**
 * Icon-only button.
 *
 * Square button (h-10, w-10) for icon-only actions.
 * Always include aria-label for accessibility when using icon-only buttons.
 */
export const IconOnly: Story = {
  args: {
    size: 'icon',
    children: <Mail className="h-4 w-4" />,
    'aria-label': 'Send email',
  },
};

/**
 * Buttons with icons.
 *
 * Shows various icon + text combinations. Icons are automatically sized
 * to 16px (size-4) via the [&_svg]:size-4 utility class.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button>
          <Mail className="h-4 w-4" />
          Email
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
      <div className="flex gap-4">
        <Button variant="secondary">
          Previous
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-4">
        <Button variant="ghost">
          <ArrowRight className="h-4 w-4" />
          Continue
        </Button>
        <Button size="icon" variant="outline">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      </div>
    </div>
  ),
};

/**
 * Icon-only buttons in all variants.
 *
 * Demonstrates icon-only buttons across different visual styles.
 * Remember to always include aria-label for screen readers.
 */
export const IconOnlyVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button size="icon" variant="default" aria-label="Mail">
        <Mail className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="destructive" aria-label="Delete">
        <Mail className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" aria-label="Mail">
        <Mail className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="secondary" aria-label="Mail">
        <Mail className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" aria-label="Mail">
        <Mail className="h-4 w-4" />
      </Button>
    </div>
  ),
};

/**
 * Disabled button states.
 *
 * Shows disabled state across all variants. Disabled buttons have:
 * - pointer-events-none to prevent interaction
 * - opacity-50 for visual indication
 * - Proper disabled attribute for accessibility
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled variant="default">
        Default Disabled
      </Button>
      <Button disabled variant="destructive">
        Destructive Disabled
      </Button>
      <Button disabled variant="outline">
        Outline Disabled
      </Button>
      <Button disabled variant="secondary">
        Secondary Disabled
      </Button>
      <Button disabled variant="ghost">
        Ghost Disabled
      </Button>
      <Button disabled variant="link">
        Link Disabled
      </Button>
    </div>
  ),
};

/**
 * Loading state with spinner icon.
 *
 * Common pattern for async actions. Use animated spinner icon
 * and optionally disable button during loading.
 */
export const Loading: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </Button>
      <Button disabled variant="outline">
        <Loader2 className="h-4 w-4 animate-spin" />
        Please wait
      </Button>
      <Button disabled size="icon">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    </div>
  ),
};

/**
 * Button as child element using Slot pattern.
 *
 * The `asChild` prop merges button props into the immediate child element.
 * This is useful for rendering buttons as links or other elements while
 * maintaining the button's visual styling and variant props.
 *
 * Common use cases:
 * - Render as Next.js Link or React Router Link
 * - Render as anchor tag for external links
 * - Render button styling on custom components
 */
export const AsChild: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button asChild>
        <a href="https://ozean-licht.dev" target="_blank" rel="noopener noreferrer">
          Visit Website (opens in new tab)
        </a>
      </Button>
      <Button asChild variant="outline">
        <a href="#section">
          Anchor Link
        </a>
      </Button>
      <Button asChild variant="secondary">
        <div role="button" tabIndex={0}>
          Custom Element as Button
        </div>
      </Button>
    </div>
  ),
};

/**
 * Ozean Licht turquoise accent examples.
 *
 * Demonstrates using the Ozean Licht primary color (#0ec2bc) with base primitive.
 * For full branded experience with gradient CTA and glow effects, see **Tier 2 Branded/Button**.
 */
export const OzeanLichtAccent: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button
        style={{
          backgroundColor: '#0ec2bc',
          color: 'white',
        }}
      >
        Turquoise Filled
      </Button>
      <Button
        variant="outline"
        style={{
          borderColor: '#0ec2bc',
          color: '#0ec2bc',
        }}
      >
        Turquoise Outline
      </Button>
      <Button
        variant="ghost"
        style={{
          color: '#0ec2bc',
        }}
      >
        Turquoise Ghost
      </Button>
      <p className="text-xs text-muted-foreground max-w-[300px] mt-2">
        Note: For Ozean Licht branded buttons with gradient, glow, and cosmic effects,
        use the Tier 2 Branded/Button component.
      </p>
    </div>
  ),
};

/**
 * Responsive button layout.
 *
 * Shows how buttons adapt to different container sizes.
 * Use flex-wrap for multi-button layouts that stack on mobile.
 */
export const ResponsiveLayout: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button>Primary</Button>
        <Button variant="outline">Secondary</Button>
        <Button variant="ghost">Cancel</Button>
      </div>
      <div className="flex gap-2">
        <Button className="flex-1">Confirm</Button>
        <Button variant="outline" className="flex-1">Cancel</Button>
      </div>
      <Button className="w-full">Full Width Button</Button>
    </div>
  ),
};

/**
 * Button group pattern.
 *
 * Common pattern for related actions grouped together.
 * Use ghost or outline variants for subtle button groups.
 */
export const ButtonGroup: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <Button variant="outline" className="rounded-r-none">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="rounded-none border-x-0">
          Today
        </Button>
        <Button variant="outline" className="rounded-l-none">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="inline-flex gap-2" role="group">
        <Button variant="ghost" size="sm">
          Day
        </Button>
        <Button variant="ghost" size="sm">
          Week
        </Button>
        <Button variant="ghost" size="sm">
          Month
        </Button>
        <Button variant="ghost" size="sm">
          Year
        </Button>
      </div>
    </div>
  ),
};

/**
 * Variant combinations showcase.
 *
 * Comprehensive matrix showing all variant and size combinations.
 * Use as reference guide for choosing appropriate button styles.
 */
export const VariantCombinations: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Default Variant</h3>
        <div className="flex gap-2">
          <Button variant="default" size="sm">Small</Button>
          <Button variant="default" size="default">Default</Button>
          <Button variant="default" size="lg">Large</Button>
          <Button variant="default" size="icon"><Mail className="h-4 w-4" /></Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Outline Variant</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Small</Button>
          <Button variant="outline" size="default">Default</Button>
          <Button variant="outline" size="lg">Large</Button>
          <Button variant="outline" size="icon"><Mail className="h-4 w-4" /></Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Ghost Variant</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Small</Button>
          <Button variant="ghost" size="default">Default</Button>
          <Button variant="ghost" size="lg">Large</Button>
          <Button variant="ghost" size="icon"><Mail className="h-4 w-4" /></Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Destructive Variant</h3>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm">Small</Button>
          <Button variant="destructive" size="default">Default</Button>
          <Button variant="destructive" size="lg">Large</Button>
          <Button variant="destructive" size="icon"><Mail className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Focus states demonstration.
 *
 * Shows keyboard focus ring appearance. Press Tab to navigate between buttons
 * and see the focus-visible ring appear.
 */
export const FocusStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Press Tab to see focus rings (focus-visible)
      </p>
      <div className="flex gap-4">
        <Button>First Button</Button>
        <Button variant="outline">Second Button</Button>
        <Button variant="ghost">Third Button</Button>
      </div>
    </div>
  ),
};
