import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Mail, Loader2, ChevronRight, Trash2, Download, Plus } from 'lucide-react';

/**
 * Button component - Primary interaction element
 * Used throughout the admin dashboard for actions and navigation.
 *
 * ## Features
 * - 6 variants: default, destructive, outline, secondary, ghost, link
 * - 4 sizes: default, sm, lg, icon
 * - Icon support
 * - Disabled state
 * - Loading state support
 */
const meta = {
  title: 'Admin/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Versatile button component with multiple variants and sizes for all interaction needs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Button visual style',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default primary button
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * Destructive variant for dangerous actions
 */
export const Destructive: Story = {
  render: () => (
    <Button variant="destructive">
      <Trash2 className="mr-2 h-4 w-4" />
      Delete User
    </Button>
  ),
};

/**
 * Outline variant for secondary actions
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

/**
 * Secondary variant
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

/**
 * Ghost variant for subtle actions
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

/**
 * Link variant that looks like a hyperlink
 */
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

/**
 * Small size button
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

/**
 * Large size button
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
export const Icon: Story = {
  render: () => (
    <Button variant="outline" size="icon">
      <ChevronRight className="h-4 w-4" />
    </Button>
  ),
};

/**
 * Button with icon and text
 */
export const WithIcon: Story = {
  render: () => (
    <Button>
      <Mail className="mr-2 h-4 w-4" />
      Send Email
    </Button>
  ),
};

/**
 * Loading state
 */
export const Loading: Story = {
  render: () => (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  ),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

/**
 * All variants comparison
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
 * All sizes comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  ),
};

/**
 * Real-world usage examples
 */
export const Examples: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <div className="flex gap-2">
        <Button className="flex-1">
          <Plus className="mr-2 h-4 w-4" />
          Create New User
        </Button>
      </div>

      <div className="flex gap-2 justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected
        </Button>
      </div>

      <Button variant="outline" className="w-full">
        <Mail className="mr-2 h-4 w-4" />
        Send Invitation Email
      </Button>
    </div>
  ),
};
