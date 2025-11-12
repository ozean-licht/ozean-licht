import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';
import { ArrowRight, Download, Plus } from 'lucide-react';

/**
 * Button component with Ozean Licht branding.
 * Features gradient CTA variant, glow effects, and turquoise branding.
 *
 * ## Features
 * - Multiple variants (primary, secondary, ghost, destructive, outline, link, cta)
 * - Three sizes (sm, md, lg, icon)
 * - Loading states with spinner
 * - Icon support (before and after)
 * - Glow effects for emphasis
 * - Full width option
 */
const meta = {
  title: 'Shared UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Ozean Licht branded button extending shadcn Button primitive with turquoise branding and cosmic theme.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive', 'outline', 'link', 'cta'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
      description: 'Button size',
    },
    glow: {
      control: 'boolean',
      description: 'Enable glow effect',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Expand to full container width',
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
 * Default button with primary variant
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * Primary button - main call to action
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Action',
  },
};

/**
 * Secondary button - less prominent actions
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Action',
  },
};

/**
 * Ghost button - minimal visual weight
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

/**
 * Destructive button - dangerous actions
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Item',
  },
};

/**
 * Outline button - alternative style
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

/**
 * Link button - styled as hyperlink
 */
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

/**
 * CTA button - gradient with glow for maximum emphasis
 */
export const CTA: Story = {
  args: {
    variant: 'cta',
    children: 'Call to Action',
    glow: true,
  },
};

/**
 * Small button size
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

/**
 * Large button size
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

/**
 * Icon-only button
 */
export const IconOnly: Story = {
  args: {
    size: 'icon',
    children: <Plus className="h-4 w-4" />,
    'aria-label': 'Add item',
  },
};

/**
 * Button with leading icon
 */
export const WithIcon: Story = {
  args: {
    children: 'Download',
    icon: <Download className="h-4 w-4" />,
  },
};

/**
 * Button with trailing icon
 */
export const WithIconAfter: Story = {
  args: {
    children: 'Continue',
    iconAfter: <ArrowRight className="h-4 w-4" />,
  },
};

/**
 * Button with glow effect
 */
export const WithGlow: Story = {
  args: {
    variant: 'primary',
    glow: true,
    children: 'Glowing Button',
  },
};

/**
 * Loading button with spinner
 */
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Processing...',
  },
};

/**
 * Disabled button
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

/**
 * Full width button
 */
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * All button variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="link">Link</Button>
      <Button variant="cta" glow>CTA with Glow</Button>
    </div>
  ),
};

/**
 * All button sizes showcase
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon"><Plus className="h-4 w-4" /></Button>
    </div>
  ),
};
