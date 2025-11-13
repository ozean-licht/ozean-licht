import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

/**
 * Badge component with Ozean Licht branding.
 * Perfect for status indicators, tags, and labels.
 *
 * ## Features
 * - Semantic color variants (default, success, warning, destructive, info)
 * - Glow effects for emphasis
 * - Dot indicator for status
 * - Arrow icon for links
 * - Three sizes (sm, md, lg)
 */
const meta = {
  title: 'Tier 2: Branded/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Ozean Licht branded badge with glow effects and semantic colors for status indicators and labels.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'success', 'warning', 'destructive', 'info', 'outline', 'gradient'],
      description: 'Visual style variant with semantic meaning',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
    },
    glow: {
      control: 'boolean',
      description: 'Enable glow effect',
    },
    dot: {
      control: 'boolean',
      description: 'Show animated dot indicator',
    },
    arrow: {
      control: 'boolean',
      description: 'Show arrow icon',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default badge
 */
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

/**
 * Primary badge
 */
export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Primary',
  },
};

/**
 * Secondary badge
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

/**
 * Success badge for positive states
 */
export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

/**
 * Warning badge for caution states
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

/**
 * Destructive badge for errors
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Error',
  },
};

/**
 * Info badge for information
 */
export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
};

/**
 * Outline badge
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

/**
 * Gradient badge
 */
export const Gradient: Story = {
  args: {
    variant: 'gradient',
    children: 'Gradient',
  },
};

/**
 * Small badge size
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

/**
 * Large badge size
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

/**
 * Badge with glow effect
 */
export const WithGlow: Story = {
  args: {
    variant: 'success',
    glow: true,
    children: 'Glowing',
  },
};

/**
 * Badge with animated dot indicator
 */
export const WithDot: Story = {
  args: {
    variant: 'success',
    dot: true,
    children: 'Active',
  },
};

/**
 * Badge with arrow icon
 */
export const WithArrow: Story = {
  args: {
    variant: 'default',
    arrow: true,
    children: 'Click me',
  },
};

/**
 * Status badge with dot and glow
 */
export const StatusBadge: Story = {
  args: {
    variant: 'success',
    dot: true,
    glow: true,
    children: 'Online',
  },
};

/**
 * All badge variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="gradient">Gradient</Badge>
    </div>
  ),
};

/**
 * All badge sizes showcase
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2 p-4">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

/**
 * Status indicators showcase
 */
export const StatusIndicators: Story = {
  render: () => (
    <div className="flex flex-col gap-2 p-4">
      <Badge variant="success" dot glow>
        Online
      </Badge>
      <Badge variant="warning" dot>
        Away
      </Badge>
      <Badge variant="destructive" dot>
        Offline
      </Badge>
      <Badge variant="info" dot>
        Idle
      </Badge>
    </div>
  ),
};

/**
 * Tag collection example
 */
export const TagCollection: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-4 max-w-md">
      <Badge variant="outline" size="sm">React</Badge>
      <Badge variant="outline" size="sm">TypeScript</Badge>
      <Badge variant="outline" size="sm">Storybook</Badge>
      <Badge variant="outline" size="sm">Tailwind CSS</Badge>
      <Badge variant="outline" size="sm">Vite</Badge>
      <Badge variant="outline" size="sm">Next.js</Badge>
    </div>
  ),
};
