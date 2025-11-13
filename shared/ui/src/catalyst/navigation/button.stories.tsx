import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './button';
import { Mail, ArrowRight, Download, Loader2, ChevronLeft, ChevronRight, Plus, Save, Trash2 } from 'lucide-react';

/**
 * Catalyst Button component built on Headless UI.
 *
 * **This is a Tier 1 Primitive** - Headless UI/Catalyst button component (DIFFERENT from shadcn button).
 * This is the official Catalyst button variant from Tailwind UI, not the shadcn/Radix button.
 *
 * ## Key Differences from shadcn Button
 *
 * **Catalyst Button** (this component):
 * - Built on @headlessui/react Button component
 * - Uses Tailwind CSS custom properties (--btn-bg, --btn-border, --btn-icon, etc.)
 * - 24+ color variants including Ozean Licht brand colors
 * - Three style modes: solid, outline, plain
 * - Optical border system with sophisticated shadow layering
 * - Automatic link rendering when `href` prop is provided
 * - TouchTarget component for 44×44px touch area on mobile
 *
 * **shadcn Button** (/shared/ui/src/ui/button.tsx):
 * - Built on @radix-ui/react-slot (Slot pattern)
 * - Uses class-variance-authority (cva) for variant management
 * - 6 variants: default, destructive, outline, secondary, ghost, link
 * - Simple CSS class-based styling
 * - Use `asChild` prop for custom element rendering
 *
 * ## When to Use Catalyst Button
 * - Navigation actions within Catalyst-based UIs
 * - When you need sophisticated color theming (24+ colors)
 * - When building admin interfaces or dashboards
 * - When automatic link/button switching is needed (href prop)
 * - When you need optical borders and advanced shadow effects
 * - For Ozean Licht branded buttons with turquoise/teal theme
 *
 * ## When to Use shadcn Button
 * - General purpose buttons in shadcn-based UIs
 * - When you need the Slot pattern (asChild prop)
 * - Simpler styling requirements
 * - Forms and standard UI interactions
 *
 * ## Catalyst Button Variants
 *
 * **Style Modes:**
 * - **solid** (default) - Filled button with background and optical border
 * - **outline** - Border-only with transparent background
 * - **plain** - Minimal styling, hover state only
 *
 * **Color Options (24+ colors):**
 * - Neutrals: dark/zinc, light, dark/white, dark, white, zinc
 * - Primary: indigo, blue, sky, violet, purple
 * - Success: green, emerald, teal, lime
 * - Warning: amber, yellow, orange
 * - Error: red, rose, pink
 * - Accent: cyan, fuchsia
 * - **Ozean Licht Brand: turquoise, ozean-licht** (#0ec2bc)
 *
 * ## Advanced Features
 *
 * **Optical Border System:**
 * - Uses layered pseudo-elements (::before, ::after) for sophisticated borders
 * - Drop shadows on light mode, subtle white outline on dark mode
 * - Inner highlight shadow for depth
 * - White overlay on hover for interaction feedback
 *
 * **Automatic Link Rendering:**
 * ```tsx
 * <Button href="/dashboard">Go to Dashboard</Button>
 * // Renders as: <Link href="/dashboard">...</Link>
 *
 * <Button onClick={handleClick}>Click Me</Button>
 * // Renders as: <Headless.Button onClick={handleClick}>...</Headless.Button>
 * ```
 *
 * **TouchTarget Enhancement:**
 * - Expands hit area to minimum 44×44px on touch devices
 * - Hidden on desktop (pointer-fine devices)
 * - Improves mobile accessibility automatically
 *
 * **Icon Slot System:**
 * - Any element with `data-slot="icon"` gets automatic styling
 * - Consistent size (20px mobile, 16px desktop)
 * - Color managed via --btn-icon custom property
 * - Forced colors mode support for accessibility
 *
 * ## Usage Examples
 *
 * ```tsx
 * // Solid button (default)
 * <Button color="indigo">Save Changes</Button>
 *
 * // Outline button
 * <Button outline>Cancel</Button>
 *
 * // Plain minimal button
 * <Button plain>Dismiss</Button>
 *
 * // Ozean Licht branded button
 * <Button color="ozean-licht">Start Journey</Button>
 *
 * // Automatic link rendering
 * <Button href="/settings" color="zinc">Settings</Button>
 *
 * // With icon
 * <Button color="green">
 *   <Save data-slot="icon" />
 *   Save
 * </Button>
 *
 * // Disabled state
 * <Button disabled color="red">Delete</Button>
 * ```
 *
 * @see /shared/ui/src/ui/button.tsx for shadcn Button component
 * @see https://catalyst.tailwindui.com/docs for Catalyst documentation
 */
const meta = {
  title: 'Tier 1: Primitives/Catalyst/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Headless UI button component from Catalyst with 24+ color variants, optical borders, and automatic link rendering. This is the Catalyst variant - different from the shadcn button component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [
        'dark/zinc',
        'light',
        'dark/white',
        'dark',
        'white',
        'zinc',
        'indigo',
        'cyan',
        'red',
        'orange',
        'amber',
        'yellow',
        'lime',
        'green',
        'emerald',
        'teal',
        'sky',
        'blue',
        'violet',
        'purple',
        'fuchsia',
        'pink',
        'rose',
        'turquoise',
        'ozean-licht',
      ],
      description: 'Color variant (solid buttons only)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'dark/zinc' },
      },
    },
    outline: {
      control: 'boolean',
      description: 'Outline style (mutually exclusive with plain)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    plain: {
      control: 'boolean',
      description: 'Plain minimal style (mutually exclusive with outline)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button interaction',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    href: {
      control: 'text',
      description: 'If provided, button renders as Link component',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Catalyst button with solid style.
 *
 * The most basic button implementation using the default color (dark/zinc).
 * Includes optical border system with layered shadows and hover effects.
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * All 24+ color variants showcase.
 *
 * Displays all available color options for solid buttons.
 * Note the sophisticated color system with custom properties for bg, border, icon, and hover overlay.
 * Includes Ozean Licht brand colors (turquoise/ozean-licht).
 */
export const AllColorVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Neutrals</h3>
        <div className="flex flex-wrap gap-3">
          <Button color="dark/zinc">dark/zinc</Button>
          <Button color="light">light</Button>
          <Button color="dark/white">dark/white</Button>
          <Button color="dark">dark</Button>
          <Button color="white">white</Button>
          <Button color="zinc">zinc</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Primary Colors</h3>
        <div className="flex flex-wrap gap-3">
          <Button color="indigo">indigo</Button>
          <Button color="blue">blue</Button>
          <Button color="sky">sky</Button>
          <Button color="violet">violet</Button>
          <Button color="purple">purple</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Success Colors</h3>
        <div className="flex flex-wrap gap-3">
          <Button color="green">green</Button>
          <Button color="emerald">emerald</Button>
          <Button color="teal">teal</Button>
          <Button color="lime">lime</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Warning Colors</h3>
        <div className="flex flex-wrap gap-3">
          <Button color="amber">amber</Button>
          <Button color="yellow">yellow</Button>
          <Button color="orange">orange</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Error Colors</h3>
        <div className="flex flex-wrap gap-3">
          <Button color="red">red</Button>
          <Button color="rose">rose</Button>
          <Button color="pink">pink</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Accent Colors</h3>
        <div className="flex flex-wrap gap-3">
          <Button color="cyan">cyan</Button>
          <Button color="fuchsia">fuchsia</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Ozean Licht Brand</h3>
        <div className="flex flex-wrap gap-3">
          <Button color="turquoise">turquoise</Button>
          <Button color="ozean-licht">ozean-licht</Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Three style modes: solid, outline, and plain.
 *
 * Demonstrates the three fundamental styling approaches.
 * Style modes are mutually exclusive - use only one at a time.
 */
export const AllStyleModes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button color="indigo">Solid (default)</Button>
      <Button outline>Outline</Button>
      <Button plain>Plain</Button>
    </div>
  ),
};

/**
 * Solid buttons with popular colors.
 *
 * The default style with filled background and optical border system.
 * Uses sophisticated layering with ::before and ::after pseudo-elements.
 */
export const SolidVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button color="dark/zinc">Dark Zinc</Button>
      <Button color="indigo">Indigo</Button>
      <Button color="blue">Blue</Button>
      <Button color="green">Green</Button>
      <Button color="red">Red</Button>
      <Button color="amber">Amber</Button>
      <Button color="ozean-licht">Ozean Licht</Button>
    </div>
  ),
};

/**
 * Outline button variant.
 *
 * Border-only button with transparent background.
 * Uses zinc colors with hover states in light and dark modes.
 */
export const OutlineVariant: Story = {
  args: {
    outline: true,
    children: 'Outline Button',
  },
};

/**
 * Plain minimal button variant.
 *
 * Minimal styling with only hover state feedback.
 * Perfect for subtle actions or when visual weight should be minimal.
 */
export const PlainVariant: Story = {
  args: {
    plain: true,
    children: 'Plain Button',
  },
};

/**
 * Buttons with icons using slot system.
 *
 * Any element with `data-slot="icon"` receives automatic styling:
 * - Size: 20px on mobile (size-5), 16px on desktop (size-4)
 * - Color: Managed via --btn-icon custom property
 * - Spacing: Automatic negative margin adjustments
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Button color="blue">
          <Mail data-slot="icon" className="size-4" />
          Send Email
        </Button>
        <Button color="green">
          <Save data-slot="icon" className="size-4" />
          Save Changes
        </Button>
        <Button color="red">
          <Trash2 data-slot="icon" className="size-4" />
          Delete
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button outline>
          <Download data-slot="icon" className="size-4" />
          Download
        </Button>
        <Button outline>
          <Plus data-slot="icon" className="size-4" />
          Add New
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button plain>
          <ArrowRight data-slot="icon" className="size-4" />
          Continue
        </Button>
        <Button plain>
          <ChevronLeft data-slot="icon" className="size-4" />
          Back
        </Button>
      </div>
    </div>
  ),
};

/**
 * Icon positioning variations.
 *
 * Icons can be placed before or after text, or used alone.
 * The gap-x-2 utility provides consistent spacing.
 */
export const IconPositions: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Button color="indigo">
          <Mail data-slot="icon" className="size-4" />
          Icon Before
        </Button>
        <Button color="indigo">
          Icon After
          <ArrowRight data-slot="icon" className="size-4" />
        </Button>
        <Button color="indigo">
          <Mail data-slot="icon" className="size-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button outline>
          <Save data-slot="icon" className="size-4" />
          Save
        </Button>
        <Button outline>
          Next
          <ChevronRight data-slot="icon" className="size-4" />
        </Button>
      </div>
    </div>
  ),
};

/**
 * Multiple icons in a single button.
 *
 * Demonstrates that multiple icons can be used together.
 * All elements with data-slot="icon" receive automatic styling.
 */
export const MultipleIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button color="blue">
        <ChevronLeft data-slot="icon" className="size-4" />
        Previous
        <Download data-slot="icon" className="size-4" />
      </Button>
      <Button outline>
        <Save data-slot="icon" className="size-4" />
        Save
        <ArrowRight data-slot="icon" className="size-4" />
      </Button>
    </div>
  ),
};

/**
 * Disabled button states.
 *
 * Disabled buttons have:
 * - opacity-50 for visual indication
 * - data-disabled attribute for styling hooks
 * - Removed shadows (before:shadow-none after:shadow-none)
 * - Proper disabled attribute for accessibility
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Button disabled color="indigo">
          Solid Disabled
        </Button>
        <Button disabled outline>
          Outline Disabled
        </Button>
        <Button disabled plain>
          Plain Disabled
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button disabled color="blue">
          <Mail data-slot="icon" className="size-4" />
          With Icon
        </Button>
        <Button disabled color="green">
          <Save data-slot="icon" className="size-4" />
          Save
        </Button>
      </div>
    </div>
  ),
};

/**
 * Loading state with animated spinner.
 *
 * Common pattern for async actions. Use Loader2 icon with animate-spin
 * and disable the button during loading operations.
 */
export const Loading: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Button disabled color="indigo">
          <Loader2 data-slot="icon" className="size-4 animate-spin" />
          Loading...
        </Button>
        <Button disabled outline>
          <Loader2 data-slot="icon" className="size-4 animate-spin" />
          Please wait
        </Button>
        <Button disabled plain>
          <Loader2 data-slot="icon" className="size-4 animate-spin" />
          Processing
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button disabled color="blue">
          <Loader2 data-slot="icon" className="size-4 animate-spin" />
          Saving changes...
        </Button>
        <Button disabled color="green">
          <Loader2 data-slot="icon" className="size-4 animate-spin" />
        </Button>
      </div>
    </div>
  ),
};

/**
 * Automatic link rendering with href prop.
 *
 * When `href` prop is provided, button automatically renders as Link component.
 * This provides semantic HTML and proper navigation behavior.
 */
export const AsLink: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Button href="/dashboard" color="indigo">
          Go to Dashboard
        </Button>
        <Button href="/settings" outline>
          Settings
        </Button>
        <Button href="/profile" plain>
          View Profile
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button href="/new" color="blue">
          <Plus data-slot="icon" className="size-4" />
          Create New
        </Button>
        <Button href="/help" outline>
          <ArrowRight data-slot="icon" className="size-4" />
          Learn More
        </Button>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mt-2">
        Note: href prop makes button render as Link component. Update Link component in
        /catalyst/navigation/link.tsx to integrate with your routing framework (Next.js, Remix, etc.)
      </p>
    </div>
  ),
};

/**
 * Ozean Licht branded buttons.
 *
 * Showcases the custom Ozean Licht turquoise brand color (#0ec2bc).
 * Available as both 'turquoise' and 'ozean-licht' color options.
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Solid Ozean Licht Buttons
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button color="turquoise">Discover Ocean Light</Button>
          <Button color="ozean-licht">
            <ArrowRight data-slot="icon" className="size-4" />
            Start Journey
          </Button>
          <Button color="turquoise">
            <Save data-slot="icon" className="size-4" />
            Save Progress
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Complementary Styles
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button color="ozean-licht">Primary CTA</Button>
          <Button outline>Secondary Action</Button>
          <Button plain>Tertiary Action</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          With Icons
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button color="turquoise">
            <Mail data-slot="icon" className="size-4" />
            Contact Us
          </Button>
          <Button color="ozean-licht">
            <Download data-slot="icon" className="size-4" />
            Download Resources
          </Button>
          <Button color="turquoise">
            Learn More
            <ArrowRight data-slot="icon" className="size-4" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Button Combinations
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button color="ozean-licht">
            <Plus data-slot="icon" className="size-4" />
            Create
          </Button>
          <Button color="green">
            <Save data-slot="icon" className="size-4" />
            Save
          </Button>
          <Button outline>Cancel</Button>
          <Button color="red">
            <Trash2 data-slot="icon" className="size-4" />
            Delete
          </Button>
        </div>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl">
        Brand Color: #0ec2bc (Ozean Licht Turquoise) - Use for primary CTAs and brand-focused actions
        in the Ozean Licht platform. Both 'turquoise' and 'ozean-licht' color values produce identical styling.
      </p>
    </div>
  ),
};

/**
 * Comparison with different button styles.
 *
 * Shows how the three style modes (solid, outline, plain) look
 * with various use cases and color combinations.
 */
export const StyleComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Primary Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button color="indigo">Solid Primary</Button>
          <Button outline>Outline Secondary</Button>
          <Button plain>Plain Tertiary</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Success Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button color="green">
            <Save data-slot="icon" className="size-4" />
            Save Changes
          </Button>
          <Button outline>
            <Save data-slot="icon" className="size-4" />
            Save Draft
          </Button>
          <Button plain>
            <Save data-slot="icon" className="size-4" />
            Auto-save
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Destructive Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button color="red">
            <Trash2 data-slot="icon" className="size-4" />
            Delete Permanently
          </Button>
          <Button outline>
            <Trash2 data-slot="icon" className="size-4" />
            Move to Trash
          </Button>
          <Button plain>
            <Trash2 data-slot="icon" className="size-4" />
            Remove
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Navigation Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button color="blue">
            Continue
            <ArrowRight data-slot="icon" className="size-4" />
          </Button>
          <Button outline>
            Learn More
            <ArrowRight data-slot="icon" className="size-4" />
          </Button>
          <Button plain>
            Skip
            <ArrowRight data-slot="icon" className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * TouchTarget demonstration.
 *
 * All Catalyst buttons include automatic TouchTarget component.
 * Expands hit area to minimum 44×44px on touch devices for better accessibility.
 * Hidden on desktop (pointer-fine devices) to prevent interference with precise clicking.
 */
export const TouchTargetDemo: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-6">
        <Button color="indigo">
          <Mail data-slot="icon" className="size-4" />
        </Button>
        <Button color="green">
          <Save data-slot="icon" className="size-4" />
        </Button>
        <Button outline>
          <Plus data-slot="icon" className="size-4" />
        </Button>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md">
        All buttons include TouchTarget component that expands hit area to 44×44px on mobile devices.
        Try interacting with these buttons on a touch device - the tap target is larger than the
        visible button. Hidden on desktop via pointer-fine media query.
      </p>
    </div>
  ),
};

/**
 * Responsive button layouts.
 *
 * Shows how Catalyst buttons adapt to different container sizes.
 * Buttons automatically adjust padding for mobile (sm:) breakpoint.
 */
export const ResponsiveLayout: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Horizontal Group
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button color="indigo">Primary</Button>
          <Button outline>Secondary</Button>
          <Button plain>Cancel</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Full Width Buttons
        </h3>
        <div className="flex flex-col gap-2 w-full">
          <Button color="blue" className="w-full justify-center">
            <Save data-slot="icon" className="size-4" />
            Save and Continue
          </Button>
          <Button outline className="w-full justify-center">
            Cancel
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Split Buttons
        </h3>
        <div className="flex gap-2">
          <Button color="green" className="flex-1 justify-center">
            <Save data-slot="icon" className="size-4" />
            Save
          </Button>
          <Button outline className="flex-1 justify-center">
            Cancel
          </Button>
        </div>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        Note: Buttons automatically adjust padding at sm: breakpoint:
        <br />
        Mobile: px-[calc(theme(spacing.3.5)-1px)] py-[calc(theme(spacing.2.5)-1px)]
        <br />
        Desktop: px-[calc(theme(spacing.3)-1px)] py-[calc(theme(spacing.1.5)-1px)]
      </p>
    </div>
  ),
};

/**
 * Button group patterns.
 *
 * Common layout patterns for related button actions.
 * Shows navigation controls, toolbars, and action groups.
 */
export const ButtonGroups: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Pagination Controls
        </h3>
        <div className="inline-flex gap-0">
          <Button outline className="rounded-r-none border-r-0">
            <ChevronLeft data-slot="icon" className="size-4" />
          </Button>
          <Button outline className="rounded-none">
            1
          </Button>
          <Button outline className="rounded-none">
            2
          </Button>
          <Button outline className="rounded-none">
            3
          </Button>
          <Button outline className="rounded-l-none border-l-0">
            <ChevronRight data-slot="icon" className="size-4" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Action Toolbar
        </h3>
        <div className="inline-flex gap-2">
          <Button plain>
            <Save data-slot="icon" className="size-4" />
          </Button>
          <Button plain>
            <Download data-slot="icon" className="size-4" />
          </Button>
          <Button plain>
            <Trash2 data-slot="icon" className="size-4" />
          </Button>
          <div className="w-px bg-zinc-200 dark:bg-zinc-700 mx-1" />
          <Button plain>
            <Mail data-slot="icon" className="size-4" />
          </Button>
          <Button plain>
            <Plus data-slot="icon" className="size-4" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Modal Actions
        </h3>
        <div className="flex justify-end gap-3">
          <Button plain>Cancel</Button>
          <Button outline>Save Draft</Button>
          <Button color="indigo">Publish</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Destructive Confirmation
        </h3>
        <div className="flex justify-end gap-3">
          <Button outline>Keep</Button>
          <Button color="red">
            <Trash2 data-slot="icon" className="size-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Dark mode demonstration.
 *
 * Shows how buttons adapt to dark mode using Tailwind's dark: variants.
 * All color variants include specific dark mode adjustments.
 */
export const DarkMode: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6 rounded-lg bg-zinc-900">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-100">Solid Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <Button color="dark/zinc">Dark Zinc</Button>
          <Button color="indigo">Indigo</Button>
          <Button color="blue">Blue</Button>
          <Button color="green">Green</Button>
          <Button color="ozean-licht">Ozean Licht</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-100">Outline & Plain</h3>
        <div className="flex flex-wrap gap-3">
          <Button outline>Outline</Button>
          <Button plain>Plain</Button>
          <Button outline>
            <Save data-slot="icon" className="size-4" />
            Save
          </Button>
        </div>
      </div>

      <p className="text-xs text-zinc-400 max-w-md">
        Dark mode styling:
        <br />
        - Solid: bg set to button color, border-white/5
        <br />
        - Outline: border-white/15, hover:bg-white/5
        <br />
        - Plain: hover:bg-white/10
        <br />
        - Icons: Adjusted lightness via --btn-icon
      </p>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Focus states demonstration.
 *
 * Shows keyboard focus ring appearance with Headless UI data-focus.
 * Uses data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500.
 */
export const FocusStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
        Press Tab to navigate and see focus rings. Catalyst buttons use data-focus attribute
        from Headless UI for focus management.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button color="indigo">First Button</Button>
        <Button outline>Second Button</Button>
        <Button plain>Third Button</Button>
        <Button color="green">
          <Save data-slot="icon" className="size-4" />
          Fourth Button
        </Button>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md">
        Focus ring: 2px solid blue-500, 2px offset
        <br />
        Fallback: focus:not-data-focus:outline-hidden for accessibility
      </p>
    </div>
  ),
};

/**
 * All features combined showcase.
 *
 * Comprehensive demonstration of all Catalyst button capabilities:
 * - 24+ color variants including Ozean Licht brand
 * - 3 style modes (solid, outline, plain)
 * - Icon slot system
 * - Disabled and loading states
 * - Link rendering
 * - TouchTarget for mobile
 * - Optical border system
 * - Dark mode support
 */
export const AllFeatures: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Style Modes
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button color="indigo">Solid</Button>
          <Button outline>Outline</Button>
          <Button plain>Plain</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Popular Colors
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button color="indigo">Indigo</Button>
          <Button color="blue">Blue</Button>
          <Button color="green">Green</Button>
          <Button color="red">Red</Button>
          <Button color="amber">Amber</Button>
          <Button color="ozean-licht">Ozean Licht</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          With Icons
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button color="blue">
            <Mail data-slot="icon" className="size-4" />
            Email
          </Button>
          <Button color="green">
            <Save data-slot="icon" className="size-4" />
            Save
          </Button>
          <Button outline>
            <Download data-slot="icon" className="size-4" />
            Download
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          States
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button disabled color="indigo">
            Disabled
          </Button>
          <Button disabled color="blue">
            <Loader2 data-slot="icon" className="size-4 animate-spin" />
            Loading
          </Button>
          <Button href="/link" color="green">
            <ArrowRight data-slot="icon" className="size-4" />
            As Link
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Button Group
        </h3>
        <div className="flex gap-3">
          <Button color="ozean-licht">
            <Save data-slot="icon" className="size-4" />
            Save Changes
          </Button>
          <Button outline>Cancel</Button>
          <Button color="red">
            <Trash2 data-slot="icon" className="size-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  ),
};
