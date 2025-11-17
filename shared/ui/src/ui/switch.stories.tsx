import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import * as React from 'react';
import { Switch } from './switch';
import { Label } from './label';

/**
 * Switch component for binary on/off selection.
 * Built on Radix UI Switch primitive.
 *
 * ## Features
 * - Checked and unchecked states
 * - Keyboard accessible (Space to toggle)
 * - Disabled state support
 * - Focus ring with proper contrast
 * - Works with forms and labels
 * - Smooth transition animations
 *
 * ## Usage
 * ```tsx
 * <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
 * ```
 *
 * ## Accessibility
 * - Uses native switch role
 * - Keyboard navigation via Space key
 * - Focus visible state with ring indicator
 * - Screen reader friendly with proper labels
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A control that allows the user to toggle between on and off states. Use switches for settings that take effect immediately.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Checked state of switch',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable switch interaction',
    },
    onCheckedChange: {
      description: 'Callback when checked state changes',
    },
  },
  args: {
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default unchecked switch
 */
export const Default: Story = {
  args: {
    checked: false,
  },
};

/**
 * Checked switch with turquoise accent color (#0ec2bc)
 */
export const Checked: Story = {
  args: {
    checked: true,
  },
};

/**
 * Disabled switch (unchecked)
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    checked: false,
  },
};

/**
 * Disabled switch (checked)
 */
export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

/**
 * Switch with label
 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Airplane mode
      </Label>
    </div>
  ),
};

/**
 * Switch with description
 */
export const WithDescription: Story = {
  render: () => (
    <div className="flex items-start space-x-3">
      <Switch id="notifications" className="mt-1" />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="notifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Push notifications
        </Label>
        <p className="text-sm text-muted-foreground">
          Receive push notifications for important updates and messages.
        </p>
      </div>
    </div>
  ),
};

/**
 * Controlled switch with React state
 */
export const Controlled: Story = {
  render: () => {
    const [isChecked, setIsChecked] = React.useState(false);

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="controlled-switch"
            checked={isChecked}
            onCheckedChange={setIsChecked}
          />
          <Label htmlFor="controlled-switch">
            Toggle me
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Current state: <strong>{isChecked ? 'On' : 'Off'}</strong>
        </p>
      </div>
    );
  },
};

/**
 * Form example with multiple switches
 */
export const FormExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="marketing-emails">Marketing emails</Label>
          <p className="text-sm text-muted-foreground">
            Receive emails about new products and features
          </p>
        </div>
        <Switch id="marketing-emails" />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="security-emails">Security emails</Label>
          <p className="text-sm text-muted-foreground">
            Receive emails about your account security
          </p>
        </div>
        <Switch id="security-emails" defaultChecked />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="beta-features">Beta features</Label>
          <p className="text-sm text-muted-foreground">
            Try out new features before they launch
          </p>
        </div>
        <Switch id="beta-features" />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="premium-feature" className="text-muted-foreground">
            Premium feature
          </Label>
          <p className="text-sm text-muted-foreground">
            Available with Pro plan (coming soon)
          </p>
        </div>
        <Switch id="premium-feature" disabled />
      </div>
    </div>
  ),
};

/**
 * Settings panel example
 */
export const SettingsPanel: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="profile-visible">Public profile</Label>
              <p className="text-sm text-muted-foreground">
                Make your profile visible to everyone
              </p>
            </div>
            <Switch id="profile-visible" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-email">Show email</Label>
              <p className="text-sm text-muted-foreground">
                Display email on your profile
              </p>
            </div>
            <Switch id="show-email" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifs">Email notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified via email
              </p>
            </div>
            <Switch id="email-notifs" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifs">Push notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get browser push notifications
              </p>
            </div>
            <Switch id="push-notifs" defaultChecked />
          </div>
        </div>
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
        <Switch checked={false} />
        <span className="text-sm">Unchecked</span>
      </div>
      <div className="flex items-center space-x-2">
        <Switch checked={true} />
        <span className="text-sm">Checked (Turquoise #0ec2bc)</span>
      </div>
      <div className="flex items-center space-x-2">
        <Switch disabled checked={false} />
        <span className="text-sm text-muted-foreground">Disabled Unchecked</span>
      </div>
      <div className="flex items-center space-x-2">
        <Switch disabled checked={true} />
        <span className="text-sm text-muted-foreground">Disabled Checked</span>
      </div>
    </div>
  ),
};

/**
 * Size variations (custom styling)
 */
export const CustomSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch className="h-4 w-8 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-4" />
        <span className="text-sm">Small switch</span>
      </div>
      <div className="flex items-center space-x-2">
        <Switch />
        <span className="text-sm">Default switch</span>
      </div>
      <div className="flex items-center space-x-2">
        <Switch className="h-8 w-14 [&>span]:h-7 [&>span]:w-7 [&>span]:data-[state=checked]:translate-x-6" />
        <span className="text-sm">Large switch</span>
      </div>
    </div>
  ),
};
