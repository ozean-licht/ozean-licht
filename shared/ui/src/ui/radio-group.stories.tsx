import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';

/**
 * RadioGroup component for mutually exclusive selection.
 * Built on Radix UI RadioGroup primitive.
 *
 * ## Features
 * - Mutually exclusive selection
 * - Keyboard navigation (Arrow keys, Space)
 * - Disabled state support
 * - Focus ring with proper contrast
 * - Accessible ARIA attributes
 */
const meta = {
  title: 'Shared UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable all radio items',
    },
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description: 'Layout orientation',
    },
  },
  args: {
    onValueChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default radio group with labels
 */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Option Two</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="option-three" />
        <Label htmlFor="option-three">Option Three</Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * Radio group with descriptions
 */
export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-start space-x-3">
        <RadioGroupItem value="default" id="default" className="mt-1" />
        <div className="grid gap-1.5">
          <Label htmlFor="default" className="font-medium">
            Default
          </Label>
          <p className="text-sm text-muted-foreground">
            The default spacing for your application.
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <RadioGroupItem value="comfortable" id="comfortable" className="mt-1" />
        <div className="grid gap-1.5">
          <Label htmlFor="comfortable" className="font-medium">
            Comfortable
          </Label>
          <p className="text-sm text-muted-foreground">
            Increased spacing for better readability.
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <RadioGroupItem value="compact" id="compact" className="mt-1" />
        <div className="grid gap-1.5">
          <Label htmlFor="compact" className="font-medium">
            Compact
          </Label>
          <p className="text-sm text-muted-foreground">
            Reduced spacing to fit more content.
          </p>
        </div>
      </div>
    </RadioGroup>
  ),
};

/**
 * Radio group with disabled option
 */
export const WithDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="free">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="free" id="free" />
        <Label htmlFor="free">Free Plan</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="pro" id="pro" />
        <Label htmlFor="pro">Pro Plan</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="enterprise" id="enterprise" disabled />
        <Label htmlFor="enterprise" className="text-muted-foreground">
          Enterprise (Coming Soon)
        </Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * Horizontal layout
 */
export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="yes" className="flex space-x-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="yes" id="yes" />
        <Label htmlFor="yes">Yes</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="no" id="no" />
        <Label htmlFor="no">No</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="maybe" id="maybe" />
        <Label htmlFor="maybe">Maybe</Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * Form example with radio group
 */
export const FormExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-3">Notification Preferences</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-base">Email Notifications</Label>
            <RadioGroup defaultValue="all" className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="email-all" />
                <Label htmlFor="email-all">All notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="important" id="email-important" />
                <Label htmlFor="email-important">Important only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="email-none" />
                <Label htmlFor="email-none">None</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="pt-4 border-t">
            <Label className="text-base">Theme</Label>
            <RadioGroup defaultValue="system" className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system">System</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Payment method selection
 */
export const PaymentMethods: Story = {
  render: () => (
    <div className="space-y-3">
      <Label className="text-lg">Select Payment Method</Label>
      <RadioGroup defaultValue="card">
        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <RadioGroupItem value="card" id="card" className="mt-1" />
          <div className="grid gap-1.5 flex-1">
            <Label htmlFor="card" className="font-medium">
              Credit or Debit Card
            </Label>
            <p className="text-sm text-muted-foreground">
              Visa, Mastercard, American Express
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
          <div className="grid gap-1.5 flex-1">
            <Label htmlFor="paypal" className="font-medium">
              PayPal
            </Label>
            <p className="text-sm text-muted-foreground">
              Pay securely with your PayPal account
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <RadioGroupItem value="bank" id="bank" className="mt-1" />
          <div className="grid gap-1.5 flex-1">
            <Label htmlFor="bank" className="font-medium">
              Bank Transfer
            </Label>
            <p className="text-sm text-muted-foreground">
              Direct bank transfer (3-5 business days)
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
};

/**
 * All states showcase
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base mb-2">Unselected</Label>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option" id="unselected" />
            <Label htmlFor="unselected">Unselected option</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base mb-2">Selected</Label>
        <RadioGroup defaultValue="selected">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="selected" id="selected" />
            <Label htmlFor="selected">Selected option</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base mb-2 text-muted-foreground">Disabled</Label>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="disabled" id="disabled" disabled />
            <Label htmlFor="disabled" className="text-muted-foreground">
              Disabled option
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base mb-2 text-muted-foreground">Disabled Selected</Label>
        <RadioGroup defaultValue="disabled-selected">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="disabled-selected" id="disabled-selected" disabled />
            <Label htmlFor="disabled-selected" className="text-muted-foreground">
              Disabled selected option
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
};
