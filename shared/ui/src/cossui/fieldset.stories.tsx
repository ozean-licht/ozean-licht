import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import {
  FieldsetRoot,
  FieldsetLegend,
  FieldsetContent,
  FieldsetDescription,
  FieldsetHelper,
} from './fieldset'
import { Input } from './input'
import { Label } from './label'
import { RadioGroup, Radio } from './radio-group'
import { Checkbox, CheckboxIndicator } from './checkbox'

const meta: Meta<typeof FieldsetRoot> = {
  title: 'CossUI/Fieldset',
  component: FieldsetRoot,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Fieldset component for grouping related form controls with legend, description, and helper text. Built with semantic HTML and adapted for Ozean Licht design system with glass morphism effects and Ozean turquoise (#0ec2bc) accent color.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'card'],
      description: 'Visual variant of the fieldset',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all form controls within the fieldset',
    },
  },
}

export default meta
type Story = StoryObj<typeof FieldsetRoot>

// ============================================================================
// BASIC VARIANTS
// ============================================================================

/**
 * Default fieldset with basic border styling
 */
export const Default: Story = {
  render: () => (
    <FieldsetRoot className="w-full max-w-md">
      <FieldsetLegend>Account Information</FieldsetLegend>
      <FieldsetContent>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="Enter your username" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email@example.com" />
        </div>
      </FieldsetContent>
    </FieldsetRoot>
  ),
}

/**
 * Bordered variant with Ozean Licht border color
 */
export const Bordered: Story = {
  render: () => (
    <FieldsetRoot variant="bordered" className="w-full max-w-md">
      <FieldsetLegend>Contact Details</FieldsetLegend>
      <FieldsetContent>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" placeholder="+43 123 456 789" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" placeholder="Street, City, Country" />
        </div>
      </FieldsetContent>
    </FieldsetRoot>
  ),
}

/**
 * Card variant with glass morphism background
 */
export const CardVariant: Story = {
  render: () => (
    <FieldsetRoot variant="card" className="w-full max-w-md">
      <FieldsetLegend>Shipping Information</FieldsetLegend>
      <FieldsetContent>
        <div className="space-y-2">
          <Label htmlFor="ship-name">Full Name</Label>
          <Input id="ship-name" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ship-address">Shipping Address</Label>
          <Input id="ship-address" placeholder="123 Main St, Vienna" />
        </div>
      </FieldsetContent>
    </FieldsetRoot>
  ),
}

// ============================================================================
// WITH DESCRIPTION AND HELPER TEXT
// ============================================================================

/**
 * Fieldset with description text
 */
export const WithDescription: Story = {
  render: () => (
    <FieldsetRoot variant="bordered" className="w-full max-w-md">
      <FieldsetLegend>Privacy Settings</FieldsetLegend>
      <FieldsetDescription>
        Control how your information is shared with others
      </FieldsetDescription>
      <FieldsetContent>
        <div className="flex items-center gap-2">
          <Checkbox id="privacy-profile">
            <CheckboxIndicator />
          </Checkbox>
          <Label htmlFor="privacy-profile">Make profile public</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="privacy-email">
            <CheckboxIndicator />
          </Checkbox>
          <Label htmlFor="privacy-email">Show email address</Label>
        </div>
      </FieldsetContent>
    </FieldsetRoot>
  ),
}

/**
 * Fieldset with helper text
 */
export const WithHelper: Story = {
  render: () => (
    <FieldsetRoot variant="bordered" className="w-full max-w-md">
      <FieldsetLegend>Password Requirements</FieldsetLegend>
      <FieldsetContent>
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input id="new-password" type="password" placeholder="••••••••" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input id="confirm-password" type="password" placeholder="••••••••" />
        </div>
      </FieldsetContent>
      <FieldsetHelper>
        Password must be at least 8 characters with uppercase, lowercase, and numbers
      </FieldsetHelper>
    </FieldsetRoot>
  ),
}

/**
 * Fieldset with both description and helper text
 */
export const WithDescriptionAndHelper: Story = {
  render: () => (
    <FieldsetRoot variant="card" className="w-full max-w-md">
      <FieldsetLegend>Notification Preferences</FieldsetLegend>
      <FieldsetDescription>
        Choose how you want to be notified about updates
      </FieldsetDescription>
      <FieldsetContent>
        <div className="flex items-center gap-2">
          <Checkbox id="notif-email" defaultChecked>
            <CheckboxIndicator />
          </Checkbox>
          <Label htmlFor="notif-email">Email notifications</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="notif-push" defaultChecked>
            <CheckboxIndicator />
          </Checkbox>
          <Label htmlFor="notif-push">Push notifications</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="notif-sms">
            <CheckboxIndicator />
          </Checkbox>
          <Label htmlFor="notif-sms">SMS notifications</Label>
        </div>
      </FieldsetContent>
      <FieldsetHelper>
        You can change these preferences at any time in your account settings
      </FieldsetHelper>
    </FieldsetRoot>
  ),
}

// ============================================================================
// FORM SECTIONS
// ============================================================================

/**
 * Personal information form section
 */
export const PersonalInformationSection: Story = {
  render: () => (
    <FieldsetRoot variant="card" className="w-full max-w-md">
      <FieldsetLegend>Personal Information</FieldsetLegend>
      <FieldsetDescription>
        Tell us about yourself
      </FieldsetDescription>
      <FieldsetContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input id="first-name" placeholder="John" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input id="last-name" placeholder="Doe" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birth-date">Date of Birth</Label>
          <Input id="birth-date" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone-personal">Phone Number</Label>
          <Input id="phone-personal" type="tel" placeholder="+43 123 456 789" />
        </div>
      </FieldsetContent>
    </FieldsetRoot>
  ),
}

/**
 * Address form section
 */
export const AddressFormSection: Story = {
  render: () => (
    <FieldsetRoot variant="bordered" className="w-full max-w-md">
      <FieldsetLegend>Billing Address</FieldsetLegend>
      <FieldsetDescription>
        Where should we send your invoices?
      </FieldsetDescription>
      <FieldsetContent>
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input id="street" placeholder="123 Main Street" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Vienna" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal">Postal Code</Label>
            <Input id="postal" placeholder="1010" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" placeholder="Austria" />
        </div>
      </FieldsetContent>
    </FieldsetRoot>
  ),
}

/**
 * Payment details section
 */
export const PaymentDetailsSection: Story = {
  render: () => (
    <FieldsetRoot variant="card" className="w-full max-w-md">
      <FieldsetLegend>Payment Information</FieldsetLegend>
      <FieldsetDescription>
        Secure payment processing
      </FieldsetDescription>
      <FieldsetContent>
        <div className="space-y-2">
          <Label htmlFor="card-number">Card Number</Label>
          <Input id="card-number" placeholder="1234 5678 9012 3456" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input id="expiry" placeholder="MM/YY" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" type="password" placeholder="123" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardholder">Cardholder Name</Label>
          <Input id="cardholder" placeholder="John Doe" />
        </div>
      </FieldsetContent>
      <FieldsetHelper>
        Your payment information is encrypted and secure
      </FieldsetHelper>
    </FieldsetRoot>
  ),
}

// ============================================================================
// WITH RADIO GROUPS
// ============================================================================

/**
 * Fieldset with radio group for single selection
 */
export const WithRadioGroup: Story = {
  render: () => (
    <FieldsetRoot variant="bordered" className="w-full max-w-md">
      <FieldsetLegend>Subscription Plan</FieldsetLegend>
      <FieldsetDescription>
        Choose the plan that works best for you
      </FieldsetDescription>
      <FieldsetContent>
        <RadioGroup defaultValue="pro">
          <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-card/50 transition-colors">
            <Radio id="plan-free" name="plan" value="free" />
            <div className="flex-1">
              <Label htmlFor="plan-free" className="font-medium cursor-pointer">
                Free Plan
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Basic features for getting started
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
            <Radio id="plan-pro" name="plan" value="pro" />
            <div className="flex-1">
              <Label htmlFor="plan-pro" className="font-medium cursor-pointer">
                Pro Plan - €29/month
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Advanced features for professionals
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-card/50 transition-colors">
            <Radio id="plan-enterprise" name="plan" value="enterprise" />
            <div className="flex-1">
              <Label htmlFor="plan-enterprise" className="font-medium cursor-pointer">
                Enterprise Plan - Custom
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Custom solutions for organizations
              </p>
            </div>
          </div>
        </RadioGroup>
      </FieldsetContent>
    </FieldsetRoot>
  ),
}

/**
 * Multiple radio groups in separate fieldsets
 */
export const MultipleRadioGroups: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <FieldsetRoot variant="bordered">
        <FieldsetLegend>Delivery Method</FieldsetLegend>
        <FieldsetContent>
          <RadioGroup defaultValue="standard">
            <div className="flex items-center gap-2">
              <Radio id="delivery-standard" name="delivery" value="standard" />
              <Label htmlFor="delivery-standard">Standard Shipping (5-7 days)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio id="delivery-express" name="delivery" value="express" />
              <Label htmlFor="delivery-express">Express Shipping (2-3 days)</Label>
            </div>
          </RadioGroup>
        </FieldsetContent>
      </FieldsetRoot>

      <FieldsetRoot variant="bordered">
        <FieldsetLegend>Payment Method</FieldsetLegend>
        <FieldsetContent>
          <RadioGroup defaultValue="credit">
            <div className="flex items-center gap-2">
              <Radio id="payment-credit" name="payment" value="credit" />
              <Label htmlFor="payment-credit">Credit Card</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio id="payment-paypal" name="payment" value="paypal" />
              <Label htmlFor="payment-paypal">PayPal</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio id="payment-bank" name="payment" value="bank" />
              <Label htmlFor="payment-bank">Bank Transfer</Label>
            </div>
          </RadioGroup>
        </FieldsetContent>
      </FieldsetRoot>
    </div>
  ),
}

// ============================================================================
// WITH CHECKBOX GROUPS
// ============================================================================

/**
 * Fieldset with checkbox group for multiple selections
 */
export const WithCheckboxGroup: Story = {
  render: () => (
    <FieldsetRoot variant="card" className="w-full max-w-md">
      <FieldsetLegend>Newsletter Preferences</FieldsetLegend>
      <FieldsetDescription>
        Select which newsletters you'd like to receive
      </FieldsetDescription>
      <FieldsetContent>
        <div className="flex items-center gap-2">
          <Checkbox id="news-product" defaultChecked>
            <CheckboxIndicator />
          </Checkbox>
          <Label htmlFor="news-product">Product Updates</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="news-tips" defaultChecked>
            <CheckboxIndicator />
          </Checkbox>
          <Label htmlFor="news-tips">Tips & Tutorials</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="news-promotions">
            <CheckboxIndicator />
          </Checkbox>
          <Label htmlFor="news-promotions">Promotional Offers</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="news-events">
            <CheckboxIndicator />
          </Checkbox>
          <Label htmlFor="news-events">Events & Webinars</Label>
        </div>
      </FieldsetContent>
      <FieldsetHelper>
        You can unsubscribe from any newsletter at any time
      </FieldsetHelper>
    </FieldsetRoot>
  ),
}

/**
 * Multiple checkbox groups
 */
export const MultipleCheckboxGroups: Story = {
  render: () => (
    <FieldsetRoot variant="card" className="w-full max-w-md">
      <FieldsetLegend>User Permissions</FieldsetLegend>
      <FieldsetDescription>
        Configure access permissions for this user
      </FieldsetDescription>
      <FieldsetContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Content</p>
            <div className="space-y-2 ml-4">
              <div className="flex items-center gap-2">
                <Checkbox id="perm-read" defaultChecked>
                  <CheckboxIndicator />
                </Checkbox>
                <Label htmlFor="perm-read">Read content</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="perm-write" defaultChecked>
                  <CheckboxIndicator />
                </Checkbox>
                <Label htmlFor="perm-write">Write content</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="perm-delete">
                  <CheckboxIndicator />
                </Checkbox>
                <Label htmlFor="perm-delete">Delete content</Label>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Users</p>
            <div className="space-y-2 ml-4">
              <div className="flex items-center gap-2">
                <Checkbox id="perm-view-users" defaultChecked>
                  <CheckboxIndicator />
                </Checkbox>
                <Label htmlFor="perm-view-users">View users</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="perm-manage-users">
                  <CheckboxIndicator />
                </Checkbox>
                <Label htmlFor="perm-manage-users">Manage users</Label>
              </div>
            </div>
          </div>
        </div>
      </FieldsetContent>
    </FieldsetRoot>
  ),
}

// ============================================================================
// NESTED FIELDSETS
// ============================================================================

/**
 * Nested fieldsets for complex forms
 */
export const NestedFieldsets: Story = {
  render: () => (
    <FieldsetRoot variant="card" className="w-full max-w-2xl">
      <FieldsetLegend>Event Registration</FieldsetLegend>
      <FieldsetDescription>
        Complete the form to register for the event
      </FieldsetDescription>
      <FieldsetContent className="space-y-6">
        <FieldsetRoot variant="bordered">
          <FieldsetLegend className="text-base">Attendee Information</FieldsetLegend>
          <FieldsetContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="attendee-first">First Name</Label>
                <Input id="attendee-first" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendee-last">Last Name</Label>
                <Input id="attendee-last" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendee-email">Email</Label>
              <Input id="attendee-email" type="email" placeholder="john@example.com" />
            </div>
          </FieldsetContent>
        </FieldsetRoot>

        <FieldsetRoot variant="bordered">
          <FieldsetLegend className="text-base">Workshop Selection</FieldsetLegend>
          <FieldsetContent>
            <RadioGroup defaultValue="workshop-1">
              <div className="flex items-center gap-2">
                <Radio id="workshop-1" name="workshop" value="workshop-1" />
                <Label htmlFor="workshop-1">Introduction to React</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio id="workshop-2" name="workshop" value="workshop-2" />
                <Label htmlFor="workshop-2">Advanced TypeScript</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio id="workshop-3" name="workshop" value="workshop-3" />
                <Label htmlFor="workshop-3">Design Systems</Label>
              </div>
            </RadioGroup>
          </FieldsetContent>
        </FieldsetRoot>
      </FieldsetContent>
    </FieldsetRoot>
  ),
}

// ============================================================================
// DISABLED STATE
// ============================================================================

/**
 * Disabled fieldset - all child inputs are disabled
 */
export const DisabledFieldset: Story = {
  render: () => (
    <FieldsetRoot variant="bordered" className="w-full max-w-md" disabled>
      <FieldsetLegend>Locked Settings</FieldsetLegend>
      <FieldsetDescription>
        These settings are locked and cannot be modified
      </FieldsetDescription>
      <FieldsetContent>
        <div className="space-y-2">
          <Label htmlFor="locked-field-1">System Name</Label>
          <Input id="locked-field-1" value="Production Server" readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="locked-field-2">Environment</Label>
          <Input id="locked-field-2" value="Production" readOnly />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="locked-check" defaultChecked>
            <CheckboxIndicator />
          </Checkbox>
          <Label htmlFor="locked-check">Auto-deploy enabled</Label>
        </div>
      </FieldsetContent>
      <FieldsetHelper>
        Contact an administrator to modify these settings
      </FieldsetHelper>
    </FieldsetRoot>
  ),
}

// ============================================================================
// LAYOUT VARIANTS
// ============================================================================

/**
 * Compact layout for space-constrained interfaces
 */
export const CompactLayout: Story = {
  render: () => (
    <FieldsetRoot variant="default" className="w-full max-w-sm">
      <FieldsetLegend className="text-base mb-3">Quick Contact</FieldsetLegend>
      <FieldsetContent className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="compact-name" className="text-xs">Name</Label>
          <Input id="compact-name" size="sm" placeholder="Your name" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="compact-email" className="text-xs">Email</Label>
          <Input id="compact-email" size="sm" type="email" placeholder="email@example.com" />
        </div>
      </FieldsetContent>
    </FieldsetRoot>
  ),
}

/**
 * Wide layout for complex forms
 */
export const WideLayout: Story = {
  render: () => (
    <FieldsetRoot variant="card" className="w-full max-w-3xl">
      <FieldsetLegend>Project Details</FieldsetLegend>
      <FieldsetDescription>
        Provide detailed information about your project
      </FieldsetDescription>
      <FieldsetContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input id="project-name" placeholder="My Project" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-type">Type</Label>
            <Input id="project-type" placeholder="Web Application" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-status">Status</Label>
            <Input id="project-status" placeholder="In Progress" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input id="start-date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input id="end-date" type="date" />
          </div>
        </div>
      </FieldsetContent>
    </FieldsetRoot>
  ),
}

// ============================================================================
// COMPLETE FORM EXAMPLE
// ============================================================================

/**
 * Complete form with multiple fieldsets
 */
export const CompleteFormExample: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-2xl p-6 bg-background/50 rounded-lg">
      <div>
        <h2 className="text-2xl font-decorative text-white mb-2">User Registration</h2>
        <p className="text-sm text-muted-foreground">Complete all sections to create your account</p>
      </div>

      <FieldsetRoot variant="card">
        <FieldsetLegend>Account Details</FieldsetLegend>
        <FieldsetDescription>
          Choose your username and password
        </FieldsetDescription>
        <FieldsetContent>
          <div className="space-y-2">
            <Label htmlFor="reg-username">Username</Label>
            <Input id="reg-username" placeholder="johndoe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input id="reg-email" type="email" placeholder="john@example.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reg-password">Password</Label>
              <Input id="reg-password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-confirm">Confirm Password</Label>
              <Input id="reg-confirm" type="password" placeholder="••••••••" />
            </div>
          </div>
        </FieldsetContent>
      </FieldsetRoot>

      <FieldsetRoot variant="card">
        <FieldsetLegend>Personal Information</FieldsetLegend>
        <FieldsetContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reg-first">First Name</Label>
              <Input id="reg-first" placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-last">Last Name</Label>
              <Input id="reg-last" placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-phone">Phone Number</Label>
            <Input id="reg-phone" type="tel" placeholder="+43 123 456 789" />
          </div>
        </FieldsetContent>
      </FieldsetRoot>

      <FieldsetRoot variant="card">
        <FieldsetLegend>Preferences</FieldsetLegend>
        <FieldsetContent>
          <div className="flex items-center gap-2">
            <Checkbox id="reg-newsletter" defaultChecked>
              <CheckboxIndicator />
            </Checkbox>
            <Label htmlFor="reg-newsletter">Subscribe to newsletter</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="reg-terms">
              <CheckboxIndicator />
            </Checkbox>
            <Label htmlFor="reg-terms">I agree to the terms and conditions</Label>
          </div>
        </FieldsetContent>
      </FieldsetRoot>

      <div className="flex gap-3 pt-4">
        <button className="flex-1 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90">
          Create Account
        </button>
        <button className="h-10 px-4 rounded-md border border-border text-foreground text-sm font-medium transition-all hover:bg-card">
          Cancel
        </button>
      </div>
    </div>
  ),
}

// ============================================================================
// GLASS EFFECT VARIANTS
// ============================================================================

/**
 * Fieldsets with enhanced glass morphism effects
 */
export const GlassEffectVariants: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-primary/20 rounded-lg space-y-6 w-full max-w-md">
      <FieldsetRoot
        variant="card"
        className="bg-card/30 backdrop-blur-md border-primary/20"
      >
        <FieldsetLegend>Glass Effect Card</FieldsetLegend>
        <FieldsetDescription>
          Enhanced glass morphism styling
        </FieldsetDescription>
        <FieldsetContent>
          <div className="space-y-2">
            <Label htmlFor="glass-field-1">Field Label</Label>
            <Input id="glass-field-1" placeholder="Enter value" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="glass-check">
              <CheckboxIndicator />
            </Checkbox>
            <Label htmlFor="glass-check">Glass styled checkbox</Label>
          </div>
        </FieldsetContent>
      </FieldsetRoot>

      <FieldsetRoot
        variant="bordered"
        className="bg-card/20 backdrop-blur-sm border-primary/30"
      >
        <FieldsetLegend>Subtle Glass Effect</FieldsetLegend>
        <FieldsetContent>
          <div className="space-y-2">
            <Label htmlFor="glass-field-2">Another Field</Label>
            <Input id="glass-field-2" placeholder="Enter value" />
          </div>
        </FieldsetContent>
      </FieldsetRoot>
    </div>
  ),
}

// ============================================================================
// ACCESSIBILITY EXAMPLE
// ============================================================================

/**
 * Accessibility example with proper ARIA attributes
 */
export const AccessibilityExample: Story = {
  render: () => (
    <FieldsetRoot
      variant="card"
      className="w-full max-w-md"
      aria-describedby="fieldset-desc"
    >
      <FieldsetLegend>Accessible Form Section</FieldsetLegend>
      <FieldsetDescription id="fieldset-desc">
        This fieldset includes proper ARIA attributes for screen readers
      </FieldsetDescription>
      <FieldsetContent>
        <div className="space-y-2">
          <Label htmlFor="a11y-field-1">
            Required Field <span className="text-red-500">*</span>
          </Label>
          <Input
            id="a11y-field-1"
            aria-required="true"
            aria-describedby="a11y-field-1-helper"
            placeholder="This field is required"
          />
          <p id="a11y-field-1-helper" className="text-xs text-muted-foreground">
            Please provide a value for this required field
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="a11y-check"
            aria-label="Accept terms and conditions"
            aria-describedby="a11y-check-desc"
          >
            <CheckboxIndicator />
          </Checkbox>
          <div>
            <Label htmlFor="a11y-check">Accept Terms</Label>
            <p id="a11y-check-desc" className="text-xs text-muted-foreground">
              You must accept the terms to continue
            </p>
          </div>
        </div>
      </FieldsetContent>
      <FieldsetHelper role="status" aria-live="polite">
        All required fields must be completed before submission
      </FieldsetHelper>
    </FieldsetRoot>
  ),
}
