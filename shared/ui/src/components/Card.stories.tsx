import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

/**
 * Card component with Ozean Licht glass morphism effects.
 * Perfect for containing related content with visual elevation.
 *
 * ## Features
 * - Glass morphism styling
 * - Multiple variants (default, strong, subtle, solid)
 * - Hover effects
 * - Glow effects for emphasis
 * - Semantic component parts (Header, Title, Description, Content, Footer)
 */
const meta = {
  title: 'Tier 2: Branded/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Ozean Licht branded card with glass morphism effects, extending shadcn Card primitive.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'strong', 'subtle', 'solid'],
      description: 'Visual style variant',
    },
    hover: {
      control: 'boolean',
      description: 'Enable hover effects',
    },
    glow: {
      control: 'boolean',
      description: 'Enable glow effect',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default card with glass morphism
 */
export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the card content area. Add any content you need here.</p>
        </CardContent>
      </>
    ),
  },
};

/**
 * Card with all parts
 */
export const Complete: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>This card has all component parts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This card demonstrates the header, content, and footer sections working together.
            Each section has appropriate spacing and styling.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="primary" size="sm">
            Action
          </Button>
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
        </CardFooter>
      </>
    ),
  },
};

/**
 * Strong variant with more opacity
 */
export const Strong: Story = {
  args: {
    variant: 'strong',
    children: (
      <>
        <CardHeader>
          <CardTitle>Strong Card</CardTitle>
          <CardDescription>Higher opacity glass effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This variant has more prominent glass morphism.</p>
        </CardContent>
      </>
    ),
  },
};

/**
 * Subtle variant with minimal effects
 */
export const Subtle: Story = {
  args: {
    variant: 'subtle',
    children: (
      <>
        <CardHeader>
          <CardTitle>Subtle Card</CardTitle>
          <CardDescription>Minimal glass effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This variant has a more subtle appearance.</p>
        </CardContent>
      </>
    ),
  },
};

/**
 * Solid variant without transparency
 */
export const Solid: Story = {
  args: {
    variant: 'solid',
    children: (
      <>
        <CardHeader>
          <CardTitle>Solid Card</CardTitle>
          <CardDescription>No transparency</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This variant has a solid background without glass effects.</p>
        </CardContent>
      </>
    ),
  },
};

/**
 * Card with hover effects
 */
export const WithHover: Story = {
  args: {
    hover: true,
    children: (
      <>
        <CardHeader>
          <CardTitle>Hover Me</CardTitle>
          <CardDescription>Card with hover effects</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Hover over this card to see the transition effects.</p>
        </CardContent>
      </>
    ),
  },
};

/**
 * Card with glow effect
 */
export const WithGlow: Story = {
  args: {
    glow: true,
    children: (
      <>
        <CardHeader>
          <CardTitle>Glowing Card</CardTitle>
          <CardDescription>Card with glow effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has a subtle glow effect around its border.</p>
        </CardContent>
      </>
    ),
  },
};

/**
 * Interactive card with all effects
 */
export const Interactive: Story = {
  args: {
    variant: 'strong',
    hover: true,
    glow: true,
    className: 'cursor-pointer',
    children: (
      <>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Interactive Card</CardTitle>
            <Badge variant="success" dot>
              Active
            </Badge>
          </div>
          <CardDescription>Hover, glow, and click ready</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            This card combines hover effects, glow, and cursor pointer for a fully interactive experience.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="cta" size="sm" fullWidth>
            Click to Continue
          </Button>
        </CardFooter>
      </>
    ),
  },
};

/**
 * Dashboard stats card example
 */
export const StatsCard: Story = {
  args: {
    variant: 'default',
    hover: true,
    children: (
      <>
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-4xl">12,543</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm">
            <Badge variant="success" size="sm" className="mr-2">
              +12.5%
            </Badge>
            <span className="text-muted-foreground">from last month</span>
          </div>
        </CardContent>
      </>
    ),
  },
};

/**
 * All card variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Card variant="default">
        <CardHeader>
          <CardTitle>Default</CardTitle>
        </CardHeader>
        <CardContent>Glass morphism</CardContent>
      </Card>
      <Card variant="strong">
        <CardHeader>
          <CardTitle>Strong</CardTitle>
        </CardHeader>
        <CardContent>More opacity</CardContent>
      </Card>
      <Card variant="subtle">
        <CardHeader>
          <CardTitle>Subtle</CardTitle>
        </CardHeader>
        <CardContent>Minimal effect</CardContent>
      </Card>
      <Card variant="solid">
        <CardHeader>
          <CardTitle>Solid</CardTitle>
        </CardHeader>
        <CardContent>No transparency</CardContent>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
