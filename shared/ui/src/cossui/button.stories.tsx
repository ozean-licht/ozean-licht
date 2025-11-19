import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'CossUI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Button component from Coss UI adapted for Ozean Licht design system. Built on Base UI with `render` prop support instead of `asChild`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'muted',
        'destructive',
        'destructive-outline',
        'outline',
        'ghost',
        'link',
      ],
      description: 'Visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl', 'icon', 'icon-sm', 'icon-lg'],
      description: 'Size variant of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Muted: Story = {
  args: {
    variant: 'muted',
    children: 'Muted Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Account',
  },
}

export const DestructiveOutline: Story = {
  args: {
    variant: 'destructive-outline',
    children: 'Delete',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 flex-wrap">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="muted">Muted</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="destructive-outline">Destructive Outline</Button>
      </div>
      <div className="flex gap-4 flex-wrap">
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
}

export const IconButtons: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button size="icon-sm" variant="outline" aria-label="Small icon">
        ⭐
      </Button>
      <Button size="icon" variant="outline" aria-label="Default icon">
        ⭐
      </Button>
      <Button size="icon-lg" variant="outline" aria-label="Large icon">
        ⭐
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Button disabled>Primary Disabled</Button>
      <Button variant="secondary" disabled>
        Secondary Disabled
      </Button>
      <Button variant="outline" disabled>
        Outline Disabled
      </Button>
    </div>
  ),
}

export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background to-card rounded-lg">
      <div className="flex gap-4 flex-wrap">
        <Button variant="primary" className="glass-hover">
          Primary with Glass
        </Button>
        <Button variant="secondary" className="glass-card-strong">
          Secondary Glass
        </Button>
        <Button variant="outline" className="glass-subtle">
          Outline Glass
        </Button>
      </div>
    </div>
  ),
}
