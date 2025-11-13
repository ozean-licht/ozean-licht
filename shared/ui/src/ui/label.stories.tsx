import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { Input } from './input';
import { Checkbox } from './checkbox';
import * as React from 'react';

/**
 * Label component for form field labels.
 * Built on Radix UI Label primitive.
 *
 * ## Features
 * - Semantic HTML label element
 * - Accessible form associations
 * - Click-through to associated input
 * - Disabled state styling (peer-disabled)
 * - Required field indicators
 * - Screen reader friendly
 *
 * ## Usage
 * Labels are essential for accessibility. Always associate labels with form controls
 * using the `htmlFor` prop matching the input's `id`.
 *
 * ## Accessibility
 * - Uses native HTML `<label>` element
 * - Properly associates with form controls via htmlFor/id
 * - Automatically disables cursor when input is disabled
 * - Reduces opacity when associated input is disabled
 * - Screen readers announce label text with form controls
 * - Clicking label focuses associated input (native browser behavior)
 *
 * ## Best Practices
 * - Always provide labels for form inputs (don't rely on placeholder alone)
 * - Use htmlFor to associate label with input id
 * - Add visual indicators for required fields
 * - Keep label text concise and descriptive
 * - Use helper text for additional context
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A text label component that provides accessible form field labeling with automatic disabled state handling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {
      control: 'text',
      description: 'ID of the associated form control',
    },
    children: {
      control: 'text',
      description: 'Label text content',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default label standalone
 */
export const Default: Story = {
  args: {
    children: 'Label Text',
  },
};

/**
 * Label with text input
 */
export const WithInput: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input
        type="email"
        id="email"
        placeholder="email@example.com"
      />
    </div>
  ),
};

/**
 * Label with checkbox
 */
export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">
        Accept terms and conditions
      </Label>
    </div>
  ),
};

/**
 * Label with radio button (using native HTML radio)
 */
export const WithRadio: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id="option1"
        name="options"
        className="h-4 w-4 border-gray-300 text-[#0ec2bc] focus:ring-[#0ec2bc]"
      />
      <Label htmlFor="option1">
        Option 1
      </Label>
    </div>
  ),
};

/**
 * Label with required indicator
 */
export const Required: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="fullname">
        Full Name <span className="text-red-500">*</span>
      </Label>
      <Input
        type="text"
        id="fullname"
        placeholder="John Doe"
        required
      />
    </div>
  ),
};

/**
 * Label with disabled input (demonstrates peer-disabled styling)
 */
export const Disabled: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="disabled-input">
        Disabled Field
      </Label>
      <Input
        type="text"
        id="disabled-input"
        disabled
        value="This field is disabled"
      />
    </div>
  ),
};

/**
 * Label with helper text
 */
export const WithHelperText: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="username">Username</Label>
      <Input
        type="text"
        id="username"
        placeholder="ozean_licht_user"
      />
      <p className="text-sm text-muted-foreground">
        Your username must be 3-20 characters and can only contain letters, numbers, and underscores.
      </p>
    </div>
  ),
};

/**
 * Label with error state
 */
export const WithError: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="email-error" className="text-red-500">
        Email
      </Label>
      <Input
        type="email"
        id="email-error"
        placeholder="email@example.com"
        className="border-red-500 focus-visible:ring-red-500"
        defaultValue="invalid-email"
      />
      <p className="text-sm text-red-500">
        Please enter a valid email address.
      </p>
    </div>
  ),
};

/**
 * Label with success state (using Ozean Licht turquoise)
 */
export const WithSuccess: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="email-success" className="text-[#0ec2bc]">
        Email
      </Label>
      <Input
        type="email"
        id="email-success"
        placeholder="email@example.com"
        className="border-[#0ec2bc] focus-visible:ring-[#0ec2bc]"
        value="valid@email.com"
        readOnly
      />
      <p className="text-sm text-[#0ec2bc]">
        ✓ Email is valid and available
      </p>
    </div>
  ),
};

/**
 * Label with description and input
 */
export const WithDescription: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <div className="space-y-0.5">
        <Label htmlFor="bio">Bio</Label>
        <p className="text-sm text-muted-foreground">
          Tell us a little bit about yourself
        </p>
      </div>
      <Input
        type="text"
        id="bio"
        placeholder="I am a..."
      />
    </div>
  ),
};

/**
 * Label positioning variants
 */
export const LabelPositions: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="top">Label Above (Standard)</Label>
        <Input type="text" id="top" placeholder="Input below label" />
      </div>

      <div className="flex items-center gap-4">
        <Label htmlFor="left" className="min-w-[120px]">Label Left</Label>
        <Input type="text" id="left" placeholder="Input to the right" />
      </div>

      <div className="flex items-start gap-4">
        <Input type="checkbox" id="right" className="mt-1" />
        <div className="grid gap-1">
          <Label htmlFor="right">Label to the Right</Label>
          <p className="text-sm text-muted-foreground">
            With additional description text
          </p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Multiple labels in a form group
 */
export const FormGroup: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="firstname">
          First Name <span className="text-red-500">*</span>
        </Label>
        <Input type="text" id="firstname" placeholder="John" required />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="lastname">
          Last Name <span className="text-red-500">*</span>
        </Label>
        <Input type="text" id="lastname" placeholder="Doe" required />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="email-form">Email</Label>
        <Input type="email" id="email-form" placeholder="john.doe@example.com" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input type="tel" id="phone" placeholder="+43 123 456 789" />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" />
        <Label htmlFor="newsletter">
          Subscribe to newsletter
        </Label>
      </div>
    </div>
  ),
};

/**
 * Label with custom styling
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="bold" className="text-base font-bold">
          Bold Label
        </Label>
        <Input type="text" id="bold" placeholder="Custom bold label" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="uppercase" className="text-xs uppercase tracking-wider">
          Uppercase Label
        </Label>
        <Input type="text" id="uppercase" placeholder="Small uppercase label" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="colored" className="text-[#0ec2bc] font-semibold">
          Ozean Licht Branded Label
        </Label>
        <Input type="text" id="colored" placeholder="Turquoise colored label" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="large" className="text-lg font-semibold">
          Large Label
        </Label>
        <Input type="text" id="large" placeholder="Larger label text" />
      </div>
    </div>
  ),
};

/**
 * All label states showcase
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="default-state">Default State</Label>
        <Input type="text" id="default-state" placeholder="Normal input" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="required-state">
          Required State <span className="text-red-500">*</span>
        </Label>
        <Input type="text" id="required-state" placeholder="Required input" required />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="disabled-state" className="cursor-not-allowed opacity-70">
          Disabled State
        </Label>
        <Input type="text" id="disabled-state" disabled value="Disabled input" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="error-state" className="text-red-500">
          Error State
        </Label>
        <Input
          type="text"
          id="error-state"
          className="border-red-500 focus-visible:ring-red-500"
          defaultValue="Invalid value"
        />
        <p className="text-sm text-red-500">This field has an error</p>
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="success-state" className="text-[#0ec2bc]">
          Success State
        </Label>
        <Input
          type="text"
          id="success-state"
          className="border-[#0ec2bc] focus-visible:ring-[#0ec2bc]"
          value="Valid value"
          readOnly
        />
        <p className="text-sm text-[#0ec2bc]">✓ This field is valid</p>
      </div>
    </div>
  ),
};

/**
 * Accessibility demonstration
 */
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 font-semibold">Proper Label Association</h3>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="accessible">
            Email Address
          </Label>
          <Input
            type="email"
            id="accessible"
            placeholder="email@example.com"
            aria-describedby="email-description"
          />
          <p id="email-description" className="text-sm text-muted-foreground">
            We'll never share your email with anyone else.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 font-semibold">Required Field Indicator</h3>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="required-demo">
            Password <span className="text-red-500" aria-label="required">*</span>
          </Label>
          <Input
            type="password"
            id="required-demo"
            placeholder="Enter password"
            required
            aria-required="true"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 font-semibold">Disabled Field</h3>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="disabled-demo">
            Read-only Field
          </Label>
          <Input
            type="text"
            id="disabled-demo"
            disabled
            value="This field cannot be edited"
            aria-disabled="true"
          />
        </div>
      </div>
    </div>
  ),
};
