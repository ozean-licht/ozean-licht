import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';
import { Button } from './button';

/**
 * RadioGroup primitive component built on Radix UI RadioGroup.
 *
 * **This is a Tier 1 Primitive** - unstyled Radix UI component with minimal default styling.
 * No Tier 2 branded version exists yet.
 *
 * ## Radix UI RadioGroup Features
 * - **Accessible**: Proper ARIA attributes, keyboard navigation (Arrow keys, Tab, Space)
 * - **Single Selection**: Ensures only one radio button can be selected at a time
 * - **Roving Tabindex**: Smart focus management for keyboard navigation
 * - **Controlled & Uncontrolled**: Supports both controlled (value/onValueChange) and uncontrolled (defaultValue) modes
 * - **Disabled State**: Can disable entire group or individual items
 * - **Required Support**: Form validation integration
 *
 * ## Component Structure
 * ```tsx
 * <RadioGroup> // Root - manages selection state
 *   <div> // Wrapper for each option
 *     <RadioGroupItem value="option1" id="option1" />
 *     <Label htmlFor="option1">Option 1</Label>
 *   </div>
 *   <div>
 *     <RadioGroupItem value="option2" id="option2" />
 *     <Label htmlFor="option2">Option 2</Label>
 *   </div>
 * </RadioGroup>
 * ```
 *
 * ## Usage Notes
 * - Always use Label with proper htmlFor to associate with RadioGroupItem
 * - Each RadioGroupItem needs a unique value prop
 * - Use id prop on RadioGroupItem to connect with Label
 * - RadioGroup uses grid gap-2 by default for vertical stacking
 * - Arrow keys navigate between options, Space selects
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time. Built on Radix UI RadioGroup primitive.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default radio group with basic options.
 *
 * The most basic radio group implementation showing essential structure.
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
 * Radio group with proper label association.
 *
 * Demonstrates best practices for accessibility with Label component.
 */
export const WithLabels: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose your plan</h3>
        <RadioGroup defaultValue="pro">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="free" id="free" />
            <Label htmlFor="free" className="cursor-pointer">
              Free Plan
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pro" id="pro" />
            <Label htmlFor="pro" className="cursor-pointer">
              Pro Plan
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="enterprise" id="enterprise" />
            <Label htmlFor="enterprise" className="cursor-pointer">
              Enterprise Plan
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
};

/**
 * Radio group with descriptions.
 *
 * Shows how to add additional context to each option.
 */
export const WithDescriptions: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <h3 className="text-lg font-semibold">Notification preferences</h3>
      <RadioGroup defaultValue="all">
        <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-primary/5">
          <RadioGroupItem value="all" id="all" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="all" className="cursor-pointer font-medium">
              All notifications
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Receive notifications for all activity, including comments, mentions, and updates.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-primary/5">
          <RadioGroupItem value="mentions" id="mentions" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="mentions" className="cursor-pointer font-medium">
              Mentions only
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Only receive notifications when you're directly mentioned by someone.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-primary/5">
          <RadioGroupItem value="none" id="none" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="none" className="cursor-pointer font-medium">
              No notifications
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Don't receive any notifications. You can still check activity manually.
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
};

/**
 * Disabled radio group.
 *
 * Shows entire group disabled - cannot change selection.
 */
export const Disabled: Story = {
  render: () => (
    <RadioGroup disabled defaultValue="option-two">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="disabled-one" />
        <Label htmlFor="disabled-one">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="disabled-two" />
        <Label htmlFor="disabled-two">Option Two (Selected)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="disabled-three" />
        <Label htmlFor="disabled-three">Option Three</Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * Radio group with specific disabled items.
 *
 * Shows how to disable individual options while keeping others interactive.
 */
export const DisabledItems: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <h3 className="text-lg font-semibold">Select shipping method</h3>
      <RadioGroup defaultValue="standard">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="express" id="express" disabled />
          <Label htmlFor="express" className="text-muted-foreground">
            Express Shipping (Unavailable)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="standard" id="standard" />
          <Label htmlFor="standard" className="cursor-pointer">
            Standard Shipping
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="economy" id="economy" />
          <Label htmlFor="economy" className="cursor-pointer">
            Economy Shipping
          </Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

/**
 * Controlled radio group state.
 *
 * Shows how to control radio group value programmatically using the `value` and `onValueChange` props.
 */
export const ControlledValue: Story = {
  render: () => {
    const ControlledRadioGroup = () => {
      const [value, setValue] = useState('comfortable');

      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Display density</h3>
            <RadioGroup value={value} onValueChange={setValue}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="compact" />
                <Label htmlFor="compact" className="cursor-pointer">
                  Compact
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="comfortable" />
                <Label htmlFor="comfortable" className="cursor-pointer">
                  Comfortable (Default)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spacious" id="spacious" />
                <Label htmlFor="spacious" className="cursor-pointer">
                  Spacious
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Current selection: <span className="font-semibold">{value}</span>
            </p>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setValue('compact')}
              >
                Set Compact
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setValue('comfortable')}
              >
                Set Comfortable
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setValue('spacious')}
              >
                Set Spacious
              </Button>
            </div>
          </div>
        </div>
      );
    };

    return <ControlledRadioGroup />;
  },
};

/**
 * Radio group in a form.
 *
 * Demonstrates form integration with submit handling.
 */
export const InForm: Story = {
  render: () => {
    const FormExample = () => {
      const [submittedValue, setSubmittedValue] = useState<string>('');

      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const selectedValue = formData.get('contact-method');
        setSubmittedValue(selectedValue as string);
      };

      return (
        <div className="space-y-4 max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Preferred contact method
              </h3>
              <RadioGroup name="contact-method" defaultValue="email" required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="contact-email" />
                  <Label htmlFor="contact-email" className="cursor-pointer">
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="contact-phone" />
                  <Label htmlFor="contact-phone" className="cursor-pointer">
                    Phone
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms" id="contact-sms" />
                  <Label htmlFor="contact-sms" className="cursor-pointer">
                    SMS
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit">Submit</Button>
          </form>
          {submittedValue && (
            <div className="p-4 bg-card rounded-md">
              <p className="text-sm">
                Submitted value: <strong>{submittedValue}</strong>
              </p>
            </div>
          )}
        </div>
      );
    };

    return <FormExample />;
  },
};

/**
 * Payment methods selection.
 *
 * Realistic example showing payment method selection with card icons.
 */
export const PaymentMethods: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <h3 className="text-lg font-semibold">Payment method</h3>
      <RadioGroup defaultValue="card">
        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-primary/5 cursor-pointer">
          <RadioGroupItem value="card" id="payment-card" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="payment-card" className="cursor-pointer font-medium">
              Credit or Debit Card
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Pay with Visa, Mastercard, American Express, or Discover
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-primary/5 cursor-pointer">
          <RadioGroupItem value="paypal" id="payment-paypal" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="payment-paypal" className="cursor-pointer font-medium">
              PayPal
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Pay securely using your PayPal account
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-primary/5 cursor-pointer">
          <RadioGroupItem value="bank" id="payment-bank" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="payment-bank" className="cursor-pointer font-medium">
              Bank Transfer
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Transfer directly from your bank account
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-primary/5 cursor-pointer opacity-50">
          <RadioGroupItem value="crypto" id="payment-crypto" className="mt-1" disabled />
          <div className="flex-1">
            <Label htmlFor="payment-crypto" className="font-medium">
              Cryptocurrency
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Coming soon - Pay with Bitcoin, Ethereum, or other cryptocurrencies
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
};

/**
 * Shipping options selection.
 *
 * Realistic example showing shipping options with pricing and delivery estimates.
 */
export const ShippingOptions: Story = {
  render: () => (
    <div className="space-y-4 max-w-lg">
      <h3 className="text-lg font-semibold">Shipping options</h3>
      <RadioGroup defaultValue="standard">
        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-primary/5 cursor-pointer">
          <RadioGroupItem value="express" id="ship-express" className="mt-1" />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <Label htmlFor="ship-express" className="cursor-pointer font-medium">
                Express Shipping
              </Label>
              <span className="font-semibold">$15.00</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Delivery in 1-2 business days
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 border-2 border-primary rounded-lg bg-primary/5 cursor-pointer">
          <RadioGroupItem value="standard" id="ship-standard" className="mt-1" />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <Label htmlFor="ship-standard" className="cursor-pointer font-medium">
                Standard Shipping
              </Label>
              <span className="font-semibold">$5.00</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Delivery in 3-5 business days
            </p>
            <p className="text-xs text-primary mt-1 font-medium">
              Recommended
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-primary/5 cursor-pointer">
          <RadioGroupItem value="economy" id="ship-economy" className="mt-1" />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <Label htmlFor="ship-economy" className="cursor-pointer font-medium">
                Economy Shipping
              </Label>
              <span className="font-semibold">FREE</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Delivery in 7-10 business days
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
};

/**
 * Interactive test with play function.
 *
 * Tests radio group selection and keyboard navigation using Storybook interactions.
 */
export const InteractiveTest: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one" data-testid="radio-group">
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="option-one"
          id="test-option-one"
          data-testid="radio-option-one"
        />
        <Label htmlFor="test-option-one">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="option-two"
          id="test-option-two"
          data-testid="radio-option-two"
        />
        <Label htmlFor="test-option-two">Option Two</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="option-three"
          id="test-option-three"
          data-testid="radio-option-three"
        />
        <Label htmlFor="test-option-three">Option Three</Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Option one should be selected by default
    const optionOne = canvas.getByTestId('radio-option-one');
    await expect(optionOne).toHaveAttribute('data-state', 'checked');

    // Click option two
    const optionTwo = canvas.getByTestId('radio-option-two');
    await userEvent.click(optionTwo);

    // Wait for state update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Option two should now be selected
    await expect(optionTwo).toHaveAttribute('data-state', 'checked');
    await expect(optionOne).toHaveAttribute('data-state', 'unchecked');
  },
};

/**
 * Ozean Licht themed examples.
 *
 * Multiple radio groups showcasing the Ozean Licht turquoise color (#0ec2bc).
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="space-y-8 max-w-lg">
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#0ec2bc' }}>
          Course Difficulty Level
        </h3>
        <RadioGroup defaultValue="intermediate">
          <div
            className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-primary/5 cursor-pointer"
            style={{ borderColor: '#e5e7eb' }}
          >
            <RadioGroupItem
              value="beginner"
              id="level-beginner"
              className="mt-1"
              style={
                {
                  '--tw-ring-color': '#0ec2bc',
                  borderColor: '#0ec2bc',
                } as React.CSSProperties
              }
            />
            <div className="flex-1">
              <Label htmlFor="level-beginner" className="cursor-pointer font-medium">
                Beginner
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Perfect for those just starting their learning journey
              </p>
            </div>
          </div>
          <div
            className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer"
            style={{ borderColor: '#0ec2bc', backgroundColor: 'rgba(14, 194, 188, 0.05)' }}
          >
            <RadioGroupItem
              value="intermediate"
              id="level-intermediate"
              className="mt-1"
              style={
                {
                  '--tw-ring-color': '#0ec2bc',
                  borderColor: '#0ec2bc',
                } as React.CSSProperties
              }
            />
            <div className="flex-1">
              <Label htmlFor="level-intermediate" className="cursor-pointer font-medium">
                Intermediate
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Build on your existing knowledge and skills
              </p>
              <p className="text-xs mt-1 font-medium" style={{ color: '#0ec2bc' }}>
                Recommended for you
              </p>
            </div>
          </div>
          <div
            className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-primary/5 cursor-pointer"
            style={{ borderColor: '#e5e7eb' }}
          >
            <RadioGroupItem
              value="advanced"
              id="level-advanced"
              className="mt-1"
              style={
                {
                  '--tw-ring-color': '#0ec2bc',
                  borderColor: '#0ec2bc',
                } as React.CSSProperties
              }
            />
            <div className="flex-1">
              <Label htmlFor="level-advanced" className="cursor-pointer font-medium">
                Advanced
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Master complex concepts and advanced techniques
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#0ec2bc' }}>
          Learning Path
        </h3>
        <RadioGroup defaultValue="guided">
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-primary/5 cursor-pointer">
            <RadioGroupItem
              value="guided"
              id="path-guided"
              style={
                {
                  '--tw-ring-color': '#0ec2bc',
                  borderColor: '#0ec2bc',
                } as React.CSSProperties
              }
            />
            <Label htmlFor="path-guided" className="cursor-pointer">
              Guided Learning (Structured curriculum)
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-primary/5 cursor-pointer">
            <RadioGroupItem
              value="self-paced"
              id="path-self"
              style={
                {
                  '--tw-ring-color': '#0ec2bc',
                  borderColor: '#0ec2bc',
                } as React.CSSProperties
              }
            />
            <Label htmlFor="path-self" className="cursor-pointer">
              Self-Paced (Learn at your own speed)
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-primary/5 cursor-pointer">
            <RadioGroupItem
              value="mentored"
              id="path-mentored"
              style={
                {
                  '--tw-ring-color': '#0ec2bc',
                  borderColor: '#0ec2bc',
                } as React.CSSProperties
              }
            />
            <Label htmlFor="path-mentored" className="cursor-pointer">
              Mentored (One-on-one guidance)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="pt-4">
        <Button
          style={{
            backgroundColor: '#0ec2bc',
            color: 'white',
          }}
        >
          Continue with Selected Options
        </Button>
      </div>
    </div>
  ),
};
