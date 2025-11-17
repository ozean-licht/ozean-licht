import type { Meta, StoryObj } from '@storybook/react';
import { Badge, badgeVariants } from './badge';
import { Check, X, AlertCircle, Clock, Star, Zap } from 'lucide-react';

/**
 * Badge primitive component from shadcn/ui.
 *
 * **This is a Tier 1 Primitive** - minimal styling with base shadcn/ui design.
 * For Ozean Licht branded badges with turquoise gradients, glow effects, and animated dots,
 * see **Tier 2 Branded/Badge**.
 *
 * ## shadcn/ui Badge Features
 * - **Minimal Styling**: Clean, simple badge design with border and padding
 * - **CVA Variants**: Uses class-variance-authority for variant management
 * - **Semantic Colors**: Default, secondary, destructive, and outline variants
 * - **Flexible**: Accepts all HTML div attributes
 * - **Composable**: Can wrap any content (text, icons, numbers)
 *
 * ## Component Structure
 * ```tsx
 * <Badge variant="default">Badge Text</Badge>
 * <Badge variant="secondary">Secondary</Badge>
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="outline">Outline</Badge>
 * ```
 *
 * ## Common Use Cases
 * - **Status Indicators**: Show state (active, pending, error)
 * - **Count Badges**: Notification counts, unread messages
 * - **Tags/Labels**: Categorization, metadata display
 * - **Feature Flags**: Beta, New, Premium indicators
 * - **Role Badges**: User roles, permissions
 *
 * ## Styling Notes
 * - Uses `rounded-full` for pill shape
 * - `text-xs` with `font-semibold` for legibility
 * - `transition-colors` for smooth hover effects
 * - `focus:ring-2` for keyboard accessibility
 * - Variants use CSS variables for theming (e.g., `bg-primary`, `text-destructive-foreground`)
 *
 * ## Accessibility
 * - Semantic HTML (div element)
 * - Proper color contrast ratios
 * - Focus ring for keyboard navigation
 * - Can include `aria-label` for screen readers when using icon-only badges
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A badge is a small status descriptor for UI elements. This is the base shadcn/ui primitive without Ozean Licht branding.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Visual style variant',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default badge variant.
 *
 * Uses primary color with white text. Ideal for primary status indicators.
 */
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

/**
 * All badge variants showcase.
 *
 * Demonstrates the four built-in variants: default, secondary, destructive, and outline.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

/**
 * Secondary badge variant.
 *
 * Muted secondary background for less prominent information.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

/**
 * Destructive badge variant.
 *
 * Red background for errors, warnings, or destructive actions.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Error',
  },
};

/**
 * Outline badge variant.
 *
 * Transparent background with border. Subtle, minimal appearance.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

/**
 * Badges with icons.
 *
 * Shows how to combine badges with Lucide React icons for enhanced semantics.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge variant="default">
        <Check className="w-3 h-3 mr-1" />
        Success
      </Badge>
      <Badge variant="destructive">
        <X className="w-3 h-3 mr-1" />
        Failed
      </Badge>
      <Badge variant="secondary">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
      <Badge variant="outline">
        <AlertCircle className="w-3 h-3 mr-1" />
        Info
      </Badge>
    </div>
  ),
};

/**
 * Icon-only badges.
 *
 * Compact badges with just an icon. Useful for tight spaces.
 * Remember to add `aria-label` for accessibility.
 */
export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge variant="default" aria-label="Verified">
        <Check className="w-3 h-3" />
      </Badge>
      <Badge variant="destructive" aria-label="Error">
        <X className="w-3 h-3" />
      </Badge>
      <Badge variant="secondary" aria-label="Pending">
        <Clock className="w-3 h-3" />
      </Badge>
      <Badge variant="outline" aria-label="Star">
        <Star className="w-3 h-3" />
      </Badge>
    </div>
  ),
};

/**
 * Count badges.
 *
 * Common pattern for notification counts, unread messages, or quantity indicators.
 */
export const CountBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="relative">
        <button className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium">
          Messages
        </button>
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 px-1.5 min-w-[1.25rem] justify-center"
        >
          5
        </Badge>
      </div>
      <div className="relative">
        <button className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium">
          Notifications
        </button>
        <Badge
          variant="default"
          className="absolute -top-2 -right-2 px-1.5 min-w-[1.25rem] justify-center"
        >
          12
        </Badge>
      </div>
      <div className="relative">
        <button className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium">
          Cart
        </button>
        <Badge
          variant="secondary"
          className="absolute -top-2 -right-2 px-1.5 min-w-[1.25rem] justify-center"
        >
          3
        </Badge>
      </div>
    </div>
  ),
};

/**
 * Status indicators.
 *
 * Use badges to show system or user status. Combine with icons for clarity.
 */
export const StatusIndicators: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Server Status:</span>
        <Badge variant="default">
          <Check className="w-3 h-3 mr-1" />
          Online
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Build Status:</span>
        <Badge variant="destructive">
          <X className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Deploy Status:</span>
        <Badge variant="secondary">
          <Clock className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">User Status:</span>
        <Badge variant="outline">
          <AlertCircle className="w-3 h-3 mr-1" />
          Away
        </Badge>
      </div>
    </div>
  ),
};

/**
 * Tag collection.
 *
 * Use outline badges for tags, categories, or keywords.
 */
export const TagCollection: Story = {
  render: () => (
    <div className="max-w-md">
      <h3 className="text-sm font-semibold mb-2">Technologies</h3>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">React</Badge>
        <Badge variant="outline">TypeScript</Badge>
        <Badge variant="outline">Tailwind CSS</Badge>
        <Badge variant="outline">Next.js</Badge>
        <Badge variant="outline">Storybook</Badge>
        <Badge variant="outline">shadcn/ui</Badge>
        <Badge variant="outline">Radix UI</Badge>
        <Badge variant="outline">Vite</Badge>
      </div>
    </div>
  ),
};

/**
 * Feature flags.
 *
 * Common pattern for showing feature availability or status.
 */
export const FeatureFlags: Story = {
  render: () => (
    <div className="space-y-3 max-w-md">
      <div className="flex items-center justify-between">
        <span className="text-sm">Dark Mode</span>
        <Badge variant="default">
          <Zap className="w-3 h-3 mr-1" />
          New
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Advanced Analytics</span>
        <Badge variant="secondary">Beta</Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">AI Assistant</span>
        <Badge variant="outline">Coming Soon</Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Team Collaboration</span>
        <Badge variant="outline">
          <Star className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      </div>
    </div>
  ),
};

/**
 * User role badges.
 *
 * Display user roles or permissions with appropriate variants.
 */
export const UserRoles: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <span className="text-sm font-medium">John Doe</span>
        <Badge variant="destructive">Admin</Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <span className="text-sm font-medium">Jane Smith</span>
        <Badge variant="default">Editor</Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <span className="text-sm font-medium">Bob Johnson</span>
        <Badge variant="secondary">Viewer</Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <span className="text-sm font-medium">Alice Williams</span>
        <Badge variant="outline">Guest</Badge>
      </div>
    </div>
  ),
};

/**
 * Custom sizes.
 *
 * Override default sizing with custom className for different badge sizes.
 */
export const CustomSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge variant="default" className="text-[10px] px-2 py-0">
        Extra Small
      </Badge>
      <Badge variant="default" className="text-xs px-2.5 py-0.5">
        Small (Default)
      </Badge>
      <Badge variant="default" className="text-sm px-3 py-1">
        Medium
      </Badge>
      <Badge variant="default" className="text-base px-4 py-1.5">
        Large
      </Badge>
    </div>
  ),
};

/**
 * Custom colors.
 *
 * Use className to override colors with Tailwind utilities or custom CSS.
 */
export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge className="bg-blue-500 text-white hover:bg-blue-600">Blue</Badge>
      <Badge className="bg-green-500 text-white hover:bg-green-600">Green</Badge>
      <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">Yellow</Badge>
      <Badge className="bg-purple-500 text-white hover:bg-purple-600">Purple</Badge>
      <Badge className="bg-pink-500 text-white hover:bg-pink-600">Pink</Badge>
      <Badge className="bg-indigo-500 text-white hover:bg-indigo-600">Indigo</Badge>
    </div>
  ),
};

/**
 * In context with other components.
 *
 * Shows badges used alongside other UI elements in realistic scenarios.
 */
export const InContext: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      {/* Card with status badge */}
      <div className="border rounded-lg p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold">Project Alpha</h3>
          <Badge variant="default">
            <Check className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Main development project for Q4 2025
        </p>
        <div className="flex gap-2">
          <Badge variant="outline">React</Badge>
          <Badge variant="outline">TypeScript</Badge>
          <Badge variant="outline">Next.js</Badge>
        </div>
      </div>

      {/* List item with notification badge */}
      <div className="border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h4 className="font-medium">Inbox</h4>
            <p className="text-xs text-gray-500">5 unread messages</p>
          </div>
          <Badge variant="destructive">5</Badge>
        </div>
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h4 className="font-medium">Drafts</h4>
            <p className="text-xs text-gray-500">2 pending drafts</p>
          </div>
          <Badge variant="secondary">2</Badge>
        </div>
        <div className="flex items-center justify-between p-4">
          <div>
            <h4 className="font-medium">Sent</h4>
            <p className="text-xs text-gray-500">All messages sent</p>
          </div>
          <Badge variant="outline">0</Badge>
        </div>
      </div>

      {/* Table row with status badges */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 font-medium">Service</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Environment</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="p-3">API Gateway</td>
              <td className="p-3">
                <Badge variant="default">
                  <Check className="w-3 h-3 mr-1" />
                  Healthy
                </Badge>
              </td>
              <td className="p-3">
                <Badge variant="outline">Production</Badge>
              </td>
            </tr>
            <tr>
              <td className="p-3">Database</td>
              <td className="p-3">
                <Badge variant="secondary">
                  <Clock className="w-3 h-3 mr-1" />
                  Maintenance
                </Badge>
              </td>
              <td className="p-3">
                <Badge variant="outline">Production</Badge>
              </td>
            </tr>
            <tr>
              <td className="p-3">Cache Server</td>
              <td className="p-3">
                <Badge variant="destructive">
                  <X className="w-3 h-3 mr-1" />
                  Down
                </Badge>
              </td>
              <td className="p-3">
                <Badge variant="outline">Staging</Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
};

/**
 * Clickable badges.
 *
 * While badges are typically static, you can wrap them in buttons or use onClick handlers.
 * For interactive tags, consider using the Button component instead.
 */
export const ClickableBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Filter by tags (click to remove)</h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="default"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => alert('Clicked React')}
          >
            React
            <X className="w-3 h-3 ml-1" />
          </Badge>
          <Badge
            variant="default"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => alert('Clicked TypeScript')}
          >
            TypeScript
            <X className="w-3 h-3 ml-1" />
          </Badge>
          <Badge
            variant="default"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => alert('Clicked Next.js')}
          >
            Next.js
            <X className="w-3 h-3 ml-1" />
          </Badge>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Add tags (click to select)</h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => alert('Clicked Tailwind')}
          >
            Tailwind CSS
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => alert('Clicked Storybook')}
          >
            Storybook
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => alert('Clicked Vite')}
          >
            Vite
          </Badge>
        </div>
      </div>
    </div>
  ),
};

/**
 * Comparison: Primitive vs Branded.
 *
 * Shows the difference between Tier 1 shadcn/ui primitive and Tier 2 Ozean Licht branded badges.
 */
export const PrimitiveVsBranded: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Tier 1: shadcn/ui Primitives</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Clean, minimal styling. Uses CSS variables for theming.
        </p>
      </div>
      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold mb-3">Tier 2: Ozean Licht Branded</h3>
        <p className="text-sm text-gray-600 mb-2">
          For turquoise gradient badges with glow effects, animated dots, and enhanced branding,
          see the <strong>Tier 2: Branded/Badge</strong> story.
        </p>
        <p className="text-xs text-gray-500">
          Features: gradient backgrounds, glow effects, animated status dots, arrow icons,
          size variants (sm/md/lg), and Ozean Licht turquoise color (#0ec2bc).
        </p>
      </div>
    </div>
  ),
};
