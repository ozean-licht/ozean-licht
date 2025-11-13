import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Checkbox } from './checkbox';
import { Label } from './label';

/**
 * Checkbox component for boolean selection.
 * Built on Radix UI Checkbox primitive.
 *
 * ## Features
 * - Checked, unchecked, and indeterminate states
 * - Keyboard accessible (Space to toggle)
 * - Disabled state support
 * - Focus ring with proper contrast
 * - Works with forms and labels
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A control that allows the user to toggle between checked and unchecked states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'radio',
      options: [true, false, 'indeterminate'],
      description: 'Checked state of checkbox',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable checkbox interaction',
    },
  },
  args: {
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default unchecked checkbox
 */
export const Default: Story = {
  args: {
    checked: false,
  },
};

/**
 * Checked checkbox
 */
export const Checked: Story = {
  args: {
    checked: true,
  },
};

/**
 * Indeterminate state (partial selection)
 */
export const Indeterminate: Story = {
  args: {
    checked: 'indeterminate',
  },
};

/**
 * Disabled checkbox (unchecked)
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    checked: false,
  },
};

/**
 * Disabled checkbox (checked)
 */
export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

/**
 * Checkbox with label
 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Accept terms and conditions
      </Label>
    </div>
  ),
};

/**
 * Checkbox with description
 */
export const WithDescription: Story = {
  render: () => (
    <div className="flex items-start space-x-3">
      <Checkbox id="marketing" className="mt-1" />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="marketing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Marketing emails
        </Label>
        <p className="text-sm text-muted-foreground">
          Receive emails about new products, features, and more.
        </p>
      </div>
    </div>
  ),
};

/**
 * Form example with multiple checkboxes
 */
export const FormExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="notifications" defaultChecked />
        <Label htmlFor="notifications">Enable notifications</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="two-factor" />
        <Label htmlFor="two-factor">Enable two-factor authentication</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="analytics" defaultChecked />
        <Label htmlFor="analytics">Share analytics data</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="beta" disabled />
        <Label htmlFor="beta" className="text-muted-foreground">
          Beta features (coming soon)
        </Label>
      </div>
    </div>
  ),
};

/**
 * All states showcase
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox checked={false} />
        <span className="text-sm">Unchecked</span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox checked={true} />
        <span className="text-sm">Checked</span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox checked="indeterminate" />
        <span className="text-sm">Indeterminate</span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox disabled checked={false} />
        <span className="text-sm text-muted-foreground">Disabled Unchecked</span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox disabled checked={true} />
        <span className="text-sm text-muted-foreground">Disabled Checked</span>
      </div>
    </div>
  ),
};
