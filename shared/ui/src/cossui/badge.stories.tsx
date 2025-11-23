import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'Tier 1: Primitives/CossUI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Badge component from Coss UI adapted for Ozean Licht design system. Displays inline status indicators with various visual styles. Supports render prop for composability with other elements like links.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'destructive',
        'success',
        'warning',
        'info',
        'outline',
      ],
      description: 'Visual style variant of the badge',
    },
    children: {
      control: 'text',
      description: 'Badge content text',
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

/**
 * Default variant - dark background with primary accent
 */
export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Default',
  },
}

/**
 * Primary variant - vibrant cyan/teal primary color
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
}

/**
 * Secondary variant - subtle glass effect with backdrop blur
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
}

/**
 * Destructive variant - red/error status indicator
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Error',
  },
}

/**
 * Success variant - green status indicator
 */
export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
}

/**
 * Warning variant - yellow/orange status indicator
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
}

/**
 * Info variant - blue information indicator
 */
export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
}

/**
 * Outline variant - bordered primary color with transparent background
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
}

/**
 * All variants in a single view
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Filled Variants
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Outline Variant
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>
    </div>
  ),
}

/**
 * Status indicators - common use cases
 */
export const StatusIndicators: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Status Badges
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="destructive">Failed</Badge>
          <Badge variant="info">Processing</Badge>
          <Badge variant="primary">Featured</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          User Status
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Online</Badge>
          <Badge variant="warning">Away</Badge>
          <Badge variant="destructive">Offline</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Document Status
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Published</Badge>
          <Badge variant="warning">Draft</Badge>
          <Badge variant="info">Archived</Badge>
          <Badge variant="destructive">Deleted</Badge>
        </div>
      </div>
    </div>
  ),
}

/**
 * Badge with render prop - used with elements like links
 */
export const WithRenderProp: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider mb-2">
          Badge as Link
        </p>
        <Badge
          variant="primary"
          render={<a href="#pricing" className="cursor-pointer hover:opacity-90" />}
        >
          Pricing Plans
        </Badge>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider mb-2">
          Badge as Button
        </p>
        <Badge
          variant="outline"
          render={
            <button className="cursor-pointer hover:bg-primary/10 transition-colors" />
          }
        >
          Click Me
        </Badge>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider mb-2">
          Styled Custom Element
        </p>
        <Badge
          variant="success"
          render={
            <div className="hover:scale-110 transition-transform inline-block" />
          }
        >
          Hovered Element
        </Badge>
      </div>
    </div>
  ),
}

/**
 * Badges used in context - with cards/containers
 */
export const InContext: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      {/* Product Card Example */}
      <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-8">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-alt font-semibold">Premium Plan</h3>
          <Badge variant="primary">Popular</Badge>
        </div>
        <p className="text-xs text-[#C4C8D4] mb-4">
          Perfect for growing teams and enterprises
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="success">Included</Badge>
          <Badge variant="info">Advanced</Badge>
          <Badge variant="outline">Premium</Badge>
        </div>
      </div>

      {/* Project Status Example */}
      <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-8">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-alt font-semibold">Admin Dashboard</h3>
          <Badge variant="success">Active</Badge>
        </div>
        <p className="text-xs text-[#C4C8D4] mb-4">Development status and deployment info</p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="warning">In Review</Badge>
          <Badge variant="info">v2.1.0</Badge>
          <Badge variant="primary">Production</Badge>
        </div>
      </div>

      {/* Issue Tracker Example */}
      <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-8">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-alt font-semibold">
            Fix: Badge component rendering
          </h3>
          <Badge variant="success">Resolved</Badge>
        </div>
        <p className="text-xs text-[#C4C8D4] mb-4">GitHub issue #432 closed</p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="default">Bug Fix</Badge>
          <Badge variant="info">UI</Badge>
          <Badge variant="outline">Storybook</Badge>
        </div>
      </div>
    </div>
  ),
}

/**
 * Feature/Feature Label Combinations
 */
export const FeatureLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Feature Tags
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="primary">New</Badge>
          <Badge variant="success">Verified</Badge>
          <Badge variant="warning">Beta</Badge>
          <Badge variant="info">Enterprise</Badge>
          <Badge variant="outline">Experimental</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Pricing Tags
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Free</Badge>
          <Badge variant="primary">Pro</Badge>
          <Badge variant="destructive">Limited</Badge>
          <Badge variant="info">Enterprise</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Category Tags
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">React</Badge>
          <Badge variant="default">TypeScript</Badge>
          <Badge variant="default">UI</Badge>
          <Badge variant="default">Design System</Badge>
        </div>
      </div>
    </div>
  ),
}

/**
 * Badges with different text content lengths
 */
export const DifferentSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Short Content
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="primary">New</Badge>
          <Badge variant="success">OK</Badge>
          <Badge variant="warning">Fix</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Medium Content
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="primary">In Progress</Badge>
          <Badge variant="success">Completed</Badge>
          <Badge variant="warning">Pending Review</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Longer Content
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="primary">Currently Processing</Badge>
          <Badge variant="success">Successfully Deployed</Badge>
          <Badge variant="info">Awaiting Approval</Badge>
        </div>
      </div>
    </div>
  ),
}

/**
 * Multiple badges on same element
 */
export const MultipleBadges: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-alt font-semibold">Multi-Badge Example</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">Feature</Badge>
          <Badge variant="success">Verified</Badge>
          <Badge variant="info">2.1.0</Badge>
          <Badge variant="warning">Beta</Badge>
        </div>
      </div>

      <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-alt font-semibold">Tech Stack</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">React</Badge>
          <Badge variant="default">TypeScript</Badge>
          <Badge variant="default">Tailwind</Badge>
          <Badge variant="default">Next.js</Badge>
          <Badge variant="default">Storybook</Badge>
        </div>
      </div>

      <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-alt font-semibold">Status Timeline</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success">Design</Badge>
          <Badge variant="success">Development</Badge>
          <Badge variant="warning">Testing</Badge>
          <Badge variant="destructive">Blocked</Badge>
        </div>
      </div>
    </div>
  ),
}

/**
 * Glass effect with gradient backgrounds
 */
export const WithGlassBackground: Story = {
  render: () => (
    <div className="p-8 rounded-lg bg-gradient-to-br from-background via-card to-[#055D75]/20">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
            On Gradient Background
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Glass</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
            Dark Theme Integration
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge variant="info">Info</Badge>
            <Badge variant="default">Default</Badge>
            <Badge variant="destructive">Error</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Accessibility demo - color contrast
 */
export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          High Contrast Variants
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="primary">Primary (WCAG AAA)</Badge>
          <Badge variant="success">Success (WCAG AAA)</Badge>
          <Badge variant="destructive">Destructive (WCAG AAA)</Badge>
          <Badge variant="warning">Warning (WCAG AAA)</Badge>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          With Focus State
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge
            variant="primary"
            render={<button className="focus:outline-none" />}
            tabIndex={0}
          >
            Focusable Badge
          </Badge>
          <Badge
            variant="outline"
            render={<button className="focus:outline-none" />}
            tabIndex={0}
          >
            Focusable Outline
          </Badge>
        </div>
      </div>
    </div>
  ),
}
