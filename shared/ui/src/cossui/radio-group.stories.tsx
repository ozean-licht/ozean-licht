import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { RadioGroup, Radio } from './radio-group'
import { Label } from './label'

const meta: Meta<typeof RadioGroup> = {
  title: 'Tier 1: Primitives/CossUI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'RadioGroup component from Coss UI adapted for Ozean Licht design system. Built on Base UI with glass morphism effects, Ozean turquoise (#0ec2bc) accent color, and full accessibility support. Use for selecting a single option from multiple choices.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable all radio buttons in the group',
    },
  },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

// ============================================================================
// BASIC STATE STORIES
// ============================================================================

/**
 * Default radio group - uncontrolled with internal state management
 */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="">
      <div className="flex items-center gap-2">
        <Radio id="default-1" name="default" value="option-1" />
        <Label htmlFor="default-1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <Radio id="default-2" name="default" value="option-2" />
        <Label htmlFor="default-2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <Radio id="default-3" name="default" value="option-3" />
        <Label htmlFor="default-3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
}

/**
 * Radio group with a pre-selected option
 */
export const WithPreselection: Story = {
  render: () => (
    <RadioGroup defaultValue="option-2">
      <div className="flex items-center gap-2">
        <Radio id="presel-1" name="preselection" value="option-1" />
        <Label htmlFor="presel-1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <Radio id="presel-2" name="preselection" value="option-2" />
        <Label htmlFor="presel-2">Option 2 (Selected)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Radio id="presel-3" name="preselection" value="option-3" />
        <Label htmlFor="presel-3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
}

/**
 * Single radio button showing selected state
 */
export const SingleRadioSelected: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Radio id="single-radio" defaultChecked />
      <Label htmlFor="single-radio">Remember my preference</Label>
    </div>
  ),
}

/**
 * Disabled radio group - no interaction possible
 */
export const DisabledGroup: Story = {
  render: () => (
    <RadioGroup disabled>
      <div className="flex items-center gap-2">
        <Radio id="disabled-1" name="disabled-group" value="opt-1" />
        <Label htmlFor="disabled-1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <Radio id="disabled-2" name="disabled-group" value="opt-2" />
        <Label htmlFor="disabled-2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <Radio id="disabled-3" name="disabled-group" value="opt-3" />
        <Label htmlFor="disabled-3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
}

/**
 * Radio group with some disabled options
 */
export const WithDisabledOptions: Story = {
  render: () => (
    <RadioGroup defaultValue="available-1">
      <div className="flex items-center gap-2">
        <Radio id="mixed-disabled-1" name="mixed-disabled" value="available-1" />
        <Label htmlFor="mixed-disabled-1">Available Option</Label>
      </div>
      <div className="flex items-center gap-2">
        <Radio
          id="mixed-disabled-2"
          name="mixed-disabled"
          value="unavailable"
          disabled
        />
        <Label htmlFor="mixed-disabled-2">Unavailable (Disabled)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Radio id="mixed-disabled-3" name="mixed-disabled" value="available-2" />
        <Label htmlFor="mixed-disabled-3">Another Available Option</Label>
      </div>
    </RadioGroup>
  ),
}

// ============================================================================
// LAYOUT STORIES
// ============================================================================

/**
 * Vertical radio group (default layout)
 */
export const VerticalLayout: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">
          Choose your preference:
        </p>
      </div>
      <RadioGroup defaultValue="vertical-2">
        <div className="flex items-center gap-2">
          <Radio id="vert-1" name="vertical" value="vertical-1" />
          <Label htmlFor="vert-1">First Option</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="vert-2" name="vertical" value="vertical-2" />
          <Label htmlFor="vert-2">Second Option</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="vert-3" name="vertical" value="vertical-3" />
          <Label htmlFor="vert-3">Third Option</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="vert-4" name="vertical" value="vertical-4" />
          <Label htmlFor="vert-4">Fourth Option</Label>
        </div>
      </RadioGroup>
    </div>
  ),
}

/**
 * Horizontal radio group layout for compact displays
 */
export const HorizontalLayout: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">
          Select size:
        </p>
      </div>
      <div className="flex gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Radio id="horiz-sm" name="size" value="small" />
          <Label htmlFor="horiz-sm">Small</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="horiz-md" name="size" value="medium" defaultChecked />
          <Label htmlFor="horiz-md">Medium</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="horiz-lg" name="size" value="large" />
          <Label htmlFor="horiz-lg">Large</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="horiz-xl" name="size" value="extra-large" />
          <Label htmlFor="horiz-xl">Extra Large</Label>
        </div>
      </div>
    </div>
  ),
}

// ============================================================================
// WITH DESCRIPTIONS / HELPER TEXT
// ============================================================================

/**
 * Radio options with descriptions below each option
 */
export const WithDescriptions: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">
          Select shipping method:
        </p>
      </div>
      <RadioGroup defaultValue="standard">
        <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-card/50 transition-colors cursor-pointer">
          <Radio id="ship-standard" name="shipping" value="standard" />
          <div className="flex-1 pt-0.5">
            <Label htmlFor="ship-standard" className="font-medium cursor-pointer">
              Standard Shipping
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              5-7 business days. Free for orders over $50.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-card/50 transition-colors cursor-pointer">
          <Radio id="ship-express" name="shipping" value="express" />
          <div className="flex-1 pt-0.5">
            <Label htmlFor="ship-express" className="font-medium cursor-pointer">
              Express Shipping
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              2-3 business days. $15.99
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-card/50 transition-colors cursor-pointer">
          <Radio id="ship-overnight" name="shipping" value="overnight" />
          <div className="flex-1 pt-0.5">
            <Label htmlFor="ship-overnight" className="font-medium cursor-pointer">
              Overnight Shipping
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Next business day. $49.99
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
}

/**
 * Radio group with pricing information
 */
export const WithPricing: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">
          Choose your plan:
        </p>
      </div>
      <RadioGroup defaultValue="pro">
        <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card/50 hover:border-primary/50 transition-colors cursor-pointer">
          <Radio id="plan-starter" name="plan" value="starter" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="plan-starter" className="font-medium cursor-pointer">
                Starter
              </Label>
              <span className="text-sm font-semibold text-foreground">Free</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Perfect for getting started
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5 hover:border-primary/60 transition-colors cursor-pointer">
          <Radio id="plan-pro" name="plan" value="pro" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="plan-pro" className="font-medium cursor-pointer">
                Pro
              </Label>
              <span className="text-sm font-semibold text-primary">$29/mo</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Most popular for professionals
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card/50 hover:border-primary/50 transition-colors cursor-pointer">
          <Radio id="plan-enterprise" name="plan" value="enterprise" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="plan-enterprise" className="font-medium cursor-pointer">
                Enterprise
              </Label>
              <span className="text-sm font-semibold text-foreground">
                Custom
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For large organizations
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
}

// ============================================================================
// FORM INTEGRATION STORIES
// ============================================================================

/**
 * Radio group in a form context - payment method selection
 */
export const PaymentMethodForm: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          Select Payment Method
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how you'd like to pay
        </p>
      </div>

      <RadioGroup defaultValue="credit-card" name="payment-method">
        <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-card/30 transition-colors">
          <Radio id="pay-credit" name="payment" value="credit-card" />
          <div className="flex-1 pt-0.5">
            <Label
              htmlFor="pay-credit"
              className="font-medium cursor-pointer block"
            >
              Credit/Debit Card
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Visa, Mastercard, Amex
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-card/30 transition-colors">
          <Radio id="pay-paypal" name="payment" value="paypal" />
          <div className="flex-1 pt-0.5">
            <Label
              htmlFor="pay-paypal"
              className="font-medium cursor-pointer block"
            >
              PayPal
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Fast and secure payment
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-card/30 transition-colors">
          <Radio id="pay-apple" name="payment" value="apple-pay" />
          <div className="flex-1 pt-0.5">
            <Label
              htmlFor="pay-apple"
              className="font-medium cursor-pointer block"
            >
              Apple Pay
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Quick checkout with Apple Wallet
            </p>
          </div>
        </div>
      </RadioGroup>

      <button className="w-full h-10 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        Continue
      </button>
    </div>
  ),
}

/**
 * Radio group in settings/preferences form
 */
export const SettingsPreferencesForm: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          Appearance Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your experience
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Theme
          </h3>
          <RadioGroup defaultValue="dark" name="theme">
            <div className="flex items-center gap-2">
              <Radio id="theme-light" name="theme" value="light" />
              <Label htmlFor="theme-light">Light</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio id="theme-dark" name="theme" value="dark" />
              <Label htmlFor="theme-dark">Dark</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio id="theme-auto" name="theme" value="auto" />
              <Label htmlFor="theme-auto">Auto (System preference)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Font Size
          </h3>
          <RadioGroup defaultValue="medium" name="font-size">
            <div className="flex items-center gap-2">
              <Radio id="font-small" name="font-size" value="small" />
              <Label htmlFor="font-small">Small</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio id="font-medium" name="font-size" value="medium" />
              <Label htmlFor="font-medium">Medium</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio id="font-large" name="font-size" value="large" />
              <Label htmlFor="font-large">Large</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button className="flex-1 h-10 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90">
          Save Changes
        </button>
        <button className="flex-1 h-10 px-3 rounded-md border border-border text-foreground text-sm font-medium transition-all hover:bg-card">
          Cancel
        </button>
      </div>
    </div>
  ),
}

/**
 * Radio group in checkout/purchase form
 */
export const CheckoutForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Billing Address
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Where should we send your invoice?
        </p>
      </div>

      <RadioGroup defaultValue="same" name="billing">
        <div className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-card/30 transition-colors">
          <Radio id="billing-same" name="billing" value="same" />
          <Label htmlFor="billing-same" className="cursor-pointer flex-1">
            Same as shipping address
          </Label>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-card/30 transition-colors">
          <Radio id="billing-different" name="billing" value="different" />
          <Label htmlFor="billing-different" className="cursor-pointer flex-1">
            Use a different address
          </Label>
        </div>
      </RadioGroup>
    </div>
  ),
}

// ============================================================================
// CONTROLLED COMPONENT STORIES
// ============================================================================

/**
 * Controlled radio group with React state
 */
export const ControlledRadioGroup: Story = {
  render: () => {
    const [selected, setSelected] = React.useState('option-1')

    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            Controlled Selection (Managed by React state)
          </p>
        </div>

        <RadioGroup
          value={selected}
          onValueChange={(value) => setSelected(value as string)}
        >
          <div className="flex items-center gap-2">
            <Radio id="ctrl-1" name="controlled" value="option-1" />
            <Label htmlFor="ctrl-1">Option 1</Label>
          </div>
          <div className="flex items-center gap-2">
            <Radio id="ctrl-2" name="controlled" value="option-2" />
            <Label htmlFor="ctrl-2">Option 2</Label>
          </div>
          <div className="flex items-center gap-2">
            <Radio id="ctrl-3" name="controlled" value="option-3" />
            <Label htmlFor="ctrl-3">Option 3</Label>
          </div>
        </RadioGroup>

        <div className="p-3 rounded-lg bg-card/50 border border-border">
          <p className="text-xs text-muted-foreground">
            Currently selected:{' '}
            <span className="text-primary font-semibold">{selected}</span>
          </p>
        </div>
      </div>
    )
  },
}

/**
 * Uncontrolled radio group using default values
 */
export const UncontrolledRadioGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <p className="text-sm text-muted-foreground">
        This radio group manages its own state without external control
      </p>
      <RadioGroup defaultValue="uncontrolled-2">
        <div className="flex items-center gap-2">
          <Radio id="unc-1" name="uncontrolled" value="uncontrolled-1" />
          <Label htmlFor="unc-1">Option 1</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="unc-2" name="uncontrolled" value="uncontrolled-2" />
          <Label htmlFor="unc-2">Option 2 (Pre-selected)</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="unc-3" name="uncontrolled" value="uncontrolled-3" />
          <Label htmlFor="unc-3">Option 3</Label>
        </div>
      </RadioGroup>
    </div>
  ),
}

// ============================================================================
// REAL-WORLD USE CASES
// ============================================================================

/**
 * Framework selector use case
 */
export const FrameworkSelector: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          Select Your Framework
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a JavaScript framework to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <RadioGroup defaultValue="react" name="framework">
          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50 hover:border-primary/50 hover:bg-card/70 transition-colors cursor-pointer">
            <Radio id="fw-react" name="framework" value="react" />
            <div className="flex-1">
              <Label htmlFor="fw-react" className="font-semibold cursor-pointer">
                React
              </Label>
              <p className="text-xs text-muted-foreground">
                Most popular library
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50 hover:border-primary/50 hover:bg-card/70 transition-colors cursor-pointer">
            <Radio id="fw-vue" name="framework" value="vue" />
            <div className="flex-1">
              <Label htmlFor="fw-vue" className="font-semibold cursor-pointer">
                Vue
              </Label>
              <p className="text-xs text-muted-foreground">
                Progressive framework
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50 hover:border-primary/50 hover:bg-card/70 transition-colors cursor-pointer">
            <Radio id="fw-angular" name="framework" value="angular" />
            <div className="flex-1">
              <Label htmlFor="fw-angular" className="font-semibold cursor-pointer">
                Angular
              </Label>
              <p className="text-xs text-muted-foreground">Full framework</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50 hover:border-primary/50 hover:bg-card/70 transition-colors cursor-pointer">
            <Radio id="fw-svelte" name="framework" value="svelte" />
            <div className="flex-1">
              <Label htmlFor="fw-svelte" className="font-semibold cursor-pointer">
                Svelte
              </Label>
              <p className="text-xs text-muted-foreground">Compiler-focused</p>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
}

/**
 * Shipping options use case
 */
export const ShippingOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Delivery Options
        </h3>
      </div>

      <RadioGroup defaultValue="standard" name="delivery">
        <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-card/50 transition-colors cursor-pointer">
          <Radio id="del-standard" name="delivery" value="standard" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="del-standard" className="font-semibold">
                Standard Shipping
              </Label>
              <span className="text-xs text-muted-foreground">Free</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated delivery: 5-7 business days
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-card/50 transition-colors cursor-pointer">
          <Radio id="del-express" name="delivery" value="express" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="del-express" className="font-semibold">
                Express Shipping
              </Label>
              <span className="text-xs font-medium text-foreground">+$9.99</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated delivery: 2-3 business days
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-card/50 transition-colors cursor-pointer">
          <Radio id="del-overnight" name="delivery" value="overnight" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="del-overnight" className="font-semibold">
                Overnight Shipping
              </Label>
              <span className="text-xs font-medium text-foreground">
                +$24.99
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated delivery: Next business day
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg border border-border opacity-60 hover:bg-card/50 transition-colors cursor-not-allowed">
          <Radio
            id="del-pickup"
            name="delivery"
            value="pickup"
            disabled
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="del-pickup" className="font-semibold">
                Store Pickup
              </Label>
              <span className="text-xs text-muted-foreground">Coming soon</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Not available for this item
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
}

/**
 * Subscription tier selection
 */
export const SubscriptionTiers: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-3xl">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          Choose Your Plan
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select the perfect plan for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RadioGroup defaultValue="pro" name="subscription">
          <label className="flex items-start gap-3 p-4 rounded-lg border-2 border-border bg-card/30 hover:border-primary/50 transition-colors cursor-pointer">
            <Radio
              id="sub-starter"
              name="subscription"
              value="starter"
              className="mt-1"
            />
            <div className="flex-1">
              <span className="font-semibold text-foreground block">
                Starter
              </span>
              <span className="text-2xl font-bold text-foreground">Free</span>
              <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                <li>✓ 3 projects</li>
                <li>✓ 1GB storage</li>
                <li>✓ Community support</li>
              </ul>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-lg border-2 border-primary/50 bg-primary/5 hover:border-primary transition-colors cursor-pointer ring-2 ring-primary/20">
            <Radio
              id="sub-pro"
              name="subscription"
              value="pro"
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Pro</span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                  POPULAR
                </span>
              </div>
              <span className="text-2xl font-bold text-primary">$29</span>
              <span className="text-xs text-muted-foreground">/month</span>
              <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                <li>✓ Unlimited projects</li>
                <li>✓ 100GB storage</li>
                <li>✓ Email support</li>
              </ul>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-lg border-2 border-border bg-card/30 hover:border-primary/50 transition-colors cursor-pointer">
            <Radio
              id="sub-enterprise"
              name="subscription"
              value="enterprise"
              className="mt-1"
            />
            <div className="flex-1">
              <span className="font-semibold text-foreground block">
                Enterprise
              </span>
              <span className="text-2xl font-bold text-foreground">Custom</span>
              <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                <li>✓ Everything in Pro</li>
                <li>✓ Custom storage</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
          </label>
        </RadioGroup>
      </div>
    </div>
  ),
}

// ============================================================================
// ACCESSIBILITY & FOCUS STATES
// ============================================================================

/**
 * Focus state demonstration for keyboard navigation
 */
export const FocusStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="p-3 rounded-lg bg-card/50 border border-border">
        <p className="text-xs text-muted-foreground">
          Try tabbing through the radio buttons to see focus states with
          Ozean turquoise ring
        </p>
      </div>

      <RadioGroup>
        <div className="flex items-center gap-2">
          <Radio id="focus-1" name="focus-demo" value="focus-1" />
          <Label htmlFor="focus-1">First option (Tab to focus)</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="focus-2" name="focus-demo" value="focus-2" />
          <Label htmlFor="focus-2">Second option</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="focus-3" name="focus-demo" value="focus-3" autoFocus />
          <Label htmlFor="focus-3">Third option (auto-focused)</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="focus-4" name="focus-demo" value="focus-4" />
          <Label htmlFor="focus-4">Fourth option</Label>
        </div>
      </RadioGroup>
    </div>
  ),
}

/**
 * Accessibility example with ARIA attributes and descriptions
 */
export const AccessibilityExample: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="p-3 rounded-lg bg-card/50 border border-border">
        <p className="text-xs text-muted-foreground">
          These radio buttons include proper ARIA attributes for screen readers
        </p>
      </div>

      <RadioGroup
        defaultValue="a11y-standard"
        name="accessibility-demo"
        aria-label="Accessibility demonstration"
      >
        <div className="flex items-start gap-3">
          <Radio
            id="a11y-standard"
            name="a11y"
            value="a11y-standard"
            aria-describedby="a11y-standard-desc"
          />
          <div className="flex-1 pt-0.5">
            <Label htmlFor="a11y-standard" className="font-medium">
              Standard Delivery <span className="text-primary">*</span>
            </Label>
            <p id="a11y-standard-desc" className="text-xs text-muted-foreground mt-1">
              5-7 business days. Required selection.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Radio
            id="a11y-express"
            name="a11y"
            value="a11y-express"
            aria-describedby="a11y-express-desc"
          />
          <div className="flex-1 pt-0.5">
            <Label htmlFor="a11y-express" className="font-medium">
              Express Delivery
            </Label>
            <p id="a11y-express-desc" className="text-xs text-muted-foreground mt-1">
              2-3 business days. Additional charges apply.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Radio
            id="a11y-pickup"
            name="a11y"
            value="a11y-pickup"
            disabled
            aria-describedby="a11y-pickup-desc"
          />
          <div className="flex-1 pt-0.5">
            <Label htmlFor="a11y-pickup" className="font-medium opacity-50">
              Store Pickup
            </Label>
            <p id="a11y-pickup-desc" className="text-xs text-muted-foreground mt-1">
              Not available for this item.
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
}

// ============================================================================
// STATE COMPARISON
// ============================================================================

/**
 * All radio states side by side for comparison
 */
export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Normal States</h3>
        <div className="flex items-center gap-2">
          <Radio id="state-unselected" name="compare-1" value="unselected" />
          <Label htmlFor="state-unselected">Unselected</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio
            id="state-selected"
            name="compare-1"
            value="selected"
            defaultChecked
          />
          <Label htmlFor="state-selected">Selected</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="state-hovered" name="compare-1" value="hovered" />
          <Label htmlFor="state-hovered">Hover state (try it)</Label>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Disabled States</h3>
        <div className="flex items-center gap-2">
          <Radio
            id="state-disabled-unsel"
            name="compare-2"
            value="disabled-unsel"
            disabled
          />
          <Label htmlFor="state-disabled-unsel">Disabled (unselected)</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio
            id="state-disabled-sel"
            name="compare-2"
            value="disabled-sel"
            defaultChecked
            disabled
          />
          <Label htmlFor="state-disabled-sel">Disabled (selected)</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio
            id="state-disabled-focus"
            name="compare-2"
            value="disabled-focus"
            disabled
          />
          <Label htmlFor="state-disabled-focus">Disabled (cannot focus)</Label>
        </div>
      </div>
    </div>
  ),
}

// ============================================================================
// GLASS MORPHISM EFFECTS
// ============================================================================

/**
 * Radio options with glass morphism styling
 */
export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-primary/20 rounded-lg space-y-3">
      <RadioGroup defaultValue="glass-2">
        <label className="flex items-center gap-3 p-4 rounded-lg bg-card/30 backdrop-blur-md border border-primary/20 hover:bg-card/40 transition-colors cursor-pointer">
          <Radio id="glass-1" name="glass" value="glass-1" />
          <span className="font-medium">Glass-morphism option 1</span>
        </label>

        <label className="flex items-center gap-3 p-4 rounded-lg bg-card/30 backdrop-blur-md border border-primary/20 hover:bg-card/40 transition-colors cursor-pointer ring-2 ring-primary/20">
          <Radio id="glass-2" name="glass" value="glass-2" />
          <span className="font-medium">Glass-morphism option 2 (Selected)</span>
        </label>

        <label className="flex items-center gap-3 p-4 rounded-lg bg-card/30 backdrop-blur-md border border-primary/20 hover:bg-card/40 transition-colors cursor-pointer">
          <Radio id="glass-3" name="glass" value="glass-3" />
          <span className="font-medium">Glass-morphism option 3</span>
        </label>
      </RadioGroup>
    </div>
  ),
}

// ============================================================================
// CUSTOM SIZING
// ============================================================================

/**
 * Radio buttons with different sizes
 */
export const CustomSizing: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Radio Button Sizes
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Radio id="size-sm" name="size-demo" value="small" className="h-4 w-4" />
          <Label htmlFor="size-sm">Small radio (4x4)</Label>
        </div>

        <div className="flex items-center gap-2">
          <Radio id="size-md" name="size-demo" value="medium" />
          <Label htmlFor="size-md">Default radio (5x5)</Label>
        </div>

        <div className="flex items-center gap-2">
          <Radio id="size-lg" name="size-demo" value="large" className="h-6 w-6" />
          <Label htmlFor="size-lg">Large radio (6x6)</Label>
        </div>

        <div className="flex items-center gap-2">
          <Radio id="size-xl" name="size-demo" value="xlarge" className="h-7 w-7" />
          <Label htmlFor="size-xl">Extra large radio (7x7)</Label>
        </div>
      </div>
    </div>
  ),
}
