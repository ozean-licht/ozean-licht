import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Separator } from './separator';
import { Label } from './label';

/**
 * Separator component for visual content dividers.
 * Built on Radix UI Separator primitive.
 *
 * ## Features
 * - Horizontal and vertical orientations
 * - Decorative or semantic separator roles
 * - Customizable thickness and color
 * - Accessible ARIA roles
 * - Works in content, navigation, and form layouts
 * - Zero-width when vertical, zero-height when horizontal
 *
 * ## Usage
 * Separators are visual dividers that help organize content into distinct sections.
 * Use them to create visual hierarchy and improve content scanability.
 *
 * ```tsx
 * // Horizontal separator (default)
 * <Separator />
 *
 * // Vertical separator
 * <Separator orientation="vertical" />
 *
 * // Non-decorative (semantic) separator
 * <Separator decorative={false} />
 * ```
 *
 * ## Accessibility
 * - Uses semantic separator role (when decorative={false})
 * - Properly announces orientation to screen readers
 * - Decorative separators are hidden from accessibility tree
 * - Follows ARIA separator pattern
 * - Use decorative={false} only when separator has semantic meaning
 *
 * ## Best Practices
 * - Use horizontal separators to divide content sections
 * - Use vertical separators in toolbars and navigation
 * - Keep decorative={true} for purely visual dividers
 * - Set decorative={false} when separator has semantic meaning (e.g., dividing form sections)
 * - Avoid overuse - too many separators can clutter the UI
 * - Consider using whitespace as an alternative
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A visual or semantic divider that separates content horizontally or vertically. Supports both decorative and semantic separator roles.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the separator',
    },
    decorative: {
      control: 'boolean',
      description: 'Whether separator is purely decorative (hidden from screen readers)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default horizontal separator
 */
export const Default: Story = {
  args: {
    orientation: 'horizontal',
    decorative: true,
  },
};

/**
 * Vertical separator (useful in navigation and toolbars)
 */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    decorative: true,
  },
  decorators: [
    (Story) => (
      <div className="h-20 flex items-center">
        <Story />
      </div>
    ),
  ],
};

/**
 * Separator in content sections
 */
export const InContent: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium leading-none">Ozean Licht</h4>
        <p className="text-sm text-muted-foreground mt-2">
          An Austrian association dedicated to spreading light and awareness.
        </p>
      </div>
      <Separator />
      <div>
        <h4 className="text-sm font-medium leading-none">Kids Ascension</h4>
        <p className="text-sm text-muted-foreground mt-2">
          Educational platform empowering children through learning.
        </p>
      </div>
      <Separator />
      <div>
        <h4 className="text-sm font-medium leading-none">Community</h4>
        <p className="text-sm text-muted-foreground mt-2">
          Join our vibrant community of learners and educators.
        </p>
      </div>
    </div>
  ),
};

/**
 * Separator in navigation menu
 */
export const InNavigation: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <a href="#home" className="text-sm font-medium hover:text-[#0ec2bc] transition-colors">
        Home
      </a>
      <Separator orientation="vertical" className="h-4" />
      <a href="#about" className="text-sm font-medium hover:text-[#0ec2bc] transition-colors">
        About
      </a>
      <Separator orientation="vertical" className="h-4" />
      <a href="#services" className="text-sm font-medium hover:text-[#0ec2bc] transition-colors">
        Services
      </a>
      <Separator orientation="vertical" className="h-4" />
      <a href="#contact" className="text-sm font-medium hover:text-[#0ec2bc] transition-colors">
        Contact
      </a>
    </div>
  ),
};

/**
 * Separator with text (using grid layout)
 */
export const WithText: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="bg-[#0ec2bc]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-[#0ec2bc] font-semibold">
            Ozean Licht
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-4 text-muted-foreground">
            Section Break
          </span>
        </div>
      </div>
    </div>
  ),
};

/**
 * Separator in card layout
 */
export const InCard: Story = {
  render: () => (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Account Settings</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account preferences and settings
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Email Notifications</Label>
            <span className="text-sm text-muted-foreground">Enabled</span>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Two-Factor Auth</Label>
            <span className="text-sm text-muted-foreground">Disabled</span>
          </div>
        </div>

        <Separator />

        <div>
          <button className="text-sm text-[#0ec2bc] hover:underline font-medium">
            View all settings
          </button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Separator in toolbar
 */
export const InToolbar: Story = {
  render: () => (
    <div className="flex items-center space-x-2 rounded-lg border border-border bg-card p-2">
      <button className="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded">
        Bold
      </button>
      <button className="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded">
        Italic
      </button>
      <button className="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded">
        Underline
      </button>

      <Separator orientation="vertical" className="h-6" />

      <button className="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded">
        Left
      </button>
      <button className="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded">
        Center
      </button>
      <button className="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded">
        Right
      </button>

      <Separator orientation="vertical" className="h-6" />

      <button className="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded">
        Link
      </button>
      <button className="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded">
        Image
      </button>
    </div>
  ),
};

/**
 * Separator thickness variations
 */
export const ThicknessVariations: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Thin (1px - default)</p>
        <Separator />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Medium (2px)</p>
        <Separator className="h-[2px]" />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Thick (4px)</p>
        <Separator className="h-[4px]" />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Extra Thick (8px)</p>
        <Separator className="h-[8px]" />
      </div>
    </div>
  ),
};

/**
 * Separator color variations (using Ozean Licht branding)
 */
export const ColorVariations: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Default (border color)</p>
        <Separator />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Ozean Licht Turquoise (#0ec2bc)</p>
        <Separator className="bg-[#0ec2bc]" />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Subtle (muted)</p>
        <Separator className="bg-muted" />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Accent (foreground)</p>
        <Separator className="bg-foreground" />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Gradient</p>
        <Separator className="h-[2px] bg-gradient-to-r from-transparent via-[#0ec2bc] to-transparent" />
      </div>
    </div>
  ),
};

/**
 * Semantic separator (non-decorative)
 */
export const Semantic: Story = {
  render: () => (
    <div className="space-y-4">
      <section aria-labelledby="personal-info">
        <h3 id="personal-info" className="text-lg font-semibold mb-2">
          Personal Information
        </h3>
        <p className="text-sm text-muted-foreground">
          Your basic profile information
        </p>
      </section>

      <Separator decorative={false} aria-label="End of personal information section" />

      <section aria-labelledby="security">
        <h3 id="security" className="text-lg font-semibold mb-2">
          Security Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage your account security
        </p>
      </section>

      <Separator decorative={false} aria-label="End of security section" />

      <section aria-labelledby="preferences">
        <h3 id="preferences" className="text-lg font-semibold mb-2">
          Preferences
        </h3>
        <p className="text-sm text-muted-foreground">
          Customize your experience
        </p>
      </section>
    </div>
  ),
};

/**
 * Separator in list items
 */
export const InList: Story = {
  render: () => (
    <div className="space-y-1">
      <div className="p-3 hover:bg-muted rounded-lg transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Profile Settings</p>
            <p className="text-xs text-muted-foreground">Manage your profile information</p>
          </div>
          <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <Separator />

      <div className="p-3 hover:bg-muted rounded-lg transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Notification Preferences</p>
            <p className="text-xs text-muted-foreground">Control your notifications</p>
          </div>
          <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <Separator />

      <div className="p-3 hover:bg-muted rounded-lg transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Privacy & Security</p>
            <p className="text-xs text-muted-foreground">Manage privacy settings</p>
          </div>
          <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <Separator />

      <div className="p-3 hover:bg-muted rounded-lg transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Billing & Payments</p>
            <p className="text-xs text-muted-foreground">Manage subscriptions</p>
          </div>
          <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  ),
};

/**
 * Vertical separator in sidebar
 */
export const VerticalInSidebar: Story = {
  render: () => (
    <div className="flex h-[400px] rounded-lg border border-border bg-card">
      <div className="w-48 p-4 space-y-2">
        <h3 className="text-sm font-semibold mb-4">Navigation</h3>
        <a href="#dashboard" className="block px-3 py-2 text-sm rounded hover:bg-muted">Dashboard</a>
        <a href="#projects" className="block px-3 py-2 text-sm rounded hover:bg-muted">Projects</a>
        <a href="#team" className="block px-3 py-2 text-sm rounded hover:bg-muted">Team</a>
        <a href="#settings" className="block px-3 py-2 text-sm rounded hover:bg-muted">Settings</a>
      </div>

      <Separator orientation="vertical" className="h-auto" />

      <div className="flex-1 p-6">
        <h2 className="text-xl font-bold mb-4">Main Content Area</h2>
        <p className="text-sm text-muted-foreground">
          This is the main content area separated from the sidebar navigation
          by a vertical separator. The separator spans the full height of the container.
        </p>
      </div>
    </div>
  ),
};

/**
 * Responsive separator usage
 */
export const ResponsiveUsage: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium">Mobile-friendly stacked layout</p>
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg">
            <p className="text-sm">Section 1</p>
          </div>
          <Separator />
          <div className="p-4 border border-border rounded-lg">
            <p className="text-sm">Section 2</p>
          </div>
          <Separator />
          <div className="p-4 border border-border rounded-lg">
            <p className="text-sm">Section 3</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Desktop horizontal layout with vertical separators</p>
        <div className="flex items-stretch">
          <div className="flex-1 p-4 border border-border rounded-l-lg">
            <p className="text-sm">Section 1</p>
          </div>
          <Separator orientation="vertical" className="h-auto" />
          <div className="flex-1 p-4 border-y border-border">
            <p className="text-sm">Section 2</p>
          </div>
          <Separator orientation="vertical" className="h-auto" />
          <div className="flex-1 p-4 border border-border rounded-r-lg">
            <p className="text-sm">Section 3</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * All separator orientations and styles
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h4 className="text-sm font-medium mb-3">Horizontal Separators</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Default</p>
            <Separator />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Thick</p>
            <Separator className="h-[2px]" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Turquoise</p>
            <Separator className="bg-[#0ec2bc]" />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Vertical Separators</h4>
        <div className="flex items-center space-x-4 h-20">
          <div className="text-xs text-muted-foreground">Default</div>
          <Separator orientation="vertical" />
          <div className="text-xs text-muted-foreground">Thick</div>
          <Separator orientation="vertical" className="w-[2px]" />
          <div className="text-xs text-muted-foreground">Turquoise</div>
          <Separator orientation="vertical" className="bg-[#0ec2bc]" />
        </div>
      </div>
    </div>
  ),
};
