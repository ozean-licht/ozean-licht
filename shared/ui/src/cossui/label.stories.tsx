/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { type Meta, type StoryObj } from '@storybook/react'
import { Label } from './label'
import { Input } from './input'
import { Textarea } from './textarea'

const meta: Meta<typeof Label> = {
  title: 'Tier 1: Primitives/CossUI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Label component from Coss UI adapted for Ozean Licht design system. Provides accessible labels for form controls with Montserrat Alternates typography and support for required/optional field indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disabled state styling',
    },
    htmlFor: {
      control: 'text',
      description: 'Associated form control ID for accessibility',
    },
    children: {
      control: 'text',
      description: 'Label text content',
    },
  },
}

export default meta
type Story = StoryObj<typeof Label>

// Basic Stories
export const Default: Story = {
  render: () => <Label>Default Label</Label>,
}

export const BasicLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label>First Name</Label>
    </div>
  ),
}

// Label with Input
export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="input-example">Email Address</Label>
      <Input
        id="input-example"
        type="email"
        placeholder="john@example.com"
        size="default"
      />
    </div>
  ),
}

// Label with Textarea
export const WithTextarea: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="textarea-example">Message</Label>
      <Textarea
        id="textarea-example"
        placeholder="Enter your message here..."
        rows={4}
      />
    </div>
  ),
}

// Required Field Indicator
export const RequiredField: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="required-field">
        Full Name <span className="text-red-500">*</span>
      </Label>
      <Input
        id="required-field"
        type="text"
        placeholder="John Doe"
        size="default"
        aria-required="true"
      />
    </div>
  ),
}

// Optional Field Indicator
export const OptionalField: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="optional-field">
        Phone Number <span className="text-muted-foreground text-xs">(optional)</span>
      </Label>
      <Input
        id="optional-field"
        type="tel"
        placeholder="+1 (555) 000-0000"
        size="default"
      />
    </div>
  ),
}

// Label with Helper Text
export const WithHelperText: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="helper-text">Password</Label>
      <Input
        id="helper-text"
        type="password"
        placeholder="Enter your password"
        size="default"
      />
      <p className="text-xs text-muted-foreground">
        Must be at least 8 characters long with uppercase, numbers, and symbols.
      </p>
    </div>
  ),
}

// Multiple Form Fields with Labels
export const FormFieldGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <Label htmlFor="form-first-name">First Name</Label>
        <Input
          id="form-first-name"
          type="text"
          placeholder="John"
          size="default"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="form-last-name">Last Name</Label>
        <Input
          id="form-last-name"
          type="text"
          placeholder="Doe"
          size="default"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="form-email">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="form-email"
          type="email"
          placeholder="john@example.com"
          size="default"
          aria-required="true"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="form-message">Message</Label>
        <Textarea
          id="form-message"
          placeholder="Enter your message..."
          rows={4}
        />
      </div>
    </div>
  ),
}

// Small Label
export const Small: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="small-label" className="text-xs">
        Small Label
      </Label>
      <Input
        id="small-label"
        type="text"
        placeholder="Small label example"
        size="sm"
      />
    </div>
  ),
}

// Large Label
export const Large: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="large-label" className="text-base font-semibold">
        Large Label
      </Label>
      <Input
        id="large-label"
        type="text"
        placeholder="Large label example"
        size="lg"
      />
    </div>
  ),
}

// Label with Medium Weight (Default)
export const MediumWeight: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="medium-weight">Medium Weight Label (Default)</Label>
      <Input
        id="medium-weight"
        type="text"
        placeholder="Standard label weight"
        size="default"
      />
    </div>
  ),
}

// Label with Bold Weight
export const BoldWeight: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="bold-weight" className="font-bold">
        Bold Weight Label
      </Label>
      <Input
        id="bold-weight"
        type="text"
        placeholder="Bold label example"
        size="default"
      />
    </div>
  ),
}

// Disabled State
export const DisabledState: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="disabled-label">Disabled Field</Label>
      <Input
        id="disabled-label"
        type="text"
        placeholder="This field is disabled"
        size="default"
        disabled
      />
    </div>
  ),
}

// Multiple Disabled Fields
export const MultipleDisabledFields: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <Label htmlFor="disabled-1">Read-only Email</Label>
        <Input
          id="disabled-1"
          type="email"
          value="john@example.com"
          disabled
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="disabled-2">Account Status</Label>
        <Input
          id="disabled-2"
          type="text"
          value="Active"
          disabled
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="disabled-3">Registration Date</Label>
        <Input
          id="disabled-3"
          type="date"
          value="2024-01-15"
          disabled
        />
      </div>
    </div>
  ),
}

// Label with Custom Styling
export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="custom-style" className="text-primary font-bold">
        Custom Styled Label
      </Label>
      <Input
        id="custom-style"
        type="text"
        placeholder="Label with custom styling"
        size="default"
      />
    </div>
  ),
}

// Label Alignment Examples
export const AlignmentExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <Label htmlFor="align-1">Stacked Label (Default)</Label>
        <Input
          id="align-1"
          type="text"
          placeholder="Label above input"
          size="default"
        />
      </div>

      <div className="flex gap-4 items-center w-full">
        <Label htmlFor="align-2" className="w-32 flex-shrink-0">
          Inline Label
        </Label>
        <Input
          id="align-2"
          type="text"
          placeholder="Label beside input"
          size="default"
          className="flex-1"
        />
      </div>

      <div className="flex gap-2 items-start w-full">
        <Input
          type="checkbox"
          id="align-3"
          className="mt-1"
        />
        <Label htmlFor="align-3" className="cursor-pointer">
          I agree to the terms and conditions
        </Label>
      </div>
    </div>
  ),
}

// Accessibility Example with aria-describedby
export const AccessibilityWithDescription: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <Label htmlFor="accessible-1">
          Password <span className="text-red-500">*</span>
        </Label>
        <Input
          id="accessible-1"
          type="password"
          placeholder="Enter password"
          size="default"
          aria-required="true"
          aria-describedby="password-hint"
        />
        <p id="password-hint" className="text-xs text-muted-foreground">
          Must be at least 8 characters with numbers and symbols
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="accessible-2">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="accessible-2"
          type="email"
          placeholder="your@email.com"
          size="default"
          aria-required="true"
          aria-describedby="email-hint"
        />
        <p id="email-hint" className="text-xs text-muted-foreground">
          We'll use this to contact you
        </p>
      </div>
    </div>
  ),
}

// Form with Mix of Required and Optional Fields
export const MixedRequiredOptional: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          Contact Information
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fields marked with * are required
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-name">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="contact-name"
          type="text"
          placeholder="John Doe"
          size="default"
          aria-required="true"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="contact-email"
          type="email"
          placeholder="john@example.com"
          size="default"
          aria-required="true"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-phone">
          Phone <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Input
          id="contact-phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          size="default"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message">
          Message <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="contact-message"
          placeholder="How can we help you?"
          rows={4}
          aria-required="true"
        />
      </div>

      <button className="w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        Submit
      </button>
    </div>
  ),
}

// Label Typography Showcase
export const TypographyShowcase: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <Label className="text-xs">Extra Small Label</Label>
        <Input type="text" placeholder="xs text" size="sm" />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm">Small Label (Default)</Label>
        <Input type="text" placeholder="sm text" size="default" />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-base">Base Label</Label>
        <Input type="text" placeholder="base text" size="lg" />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-lg">Large Label</Label>
        <Input type="text" placeholder="lg text" size="lg" />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xl">Extra Large Label</Label>
        <Input type="text" placeholder="xl text" size="lg" />
      </div>
    </div>
  ),
}

// Labels with Icons (using emoji as placeholder)
export const WithIconPlaceholder: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <Label htmlFor="icon-email" className="flex items-center gap-2">
          <span>📧</span>
          Email Address
        </Label>
        <Input
          id="icon-email"
          type="email"
          placeholder="john@example.com"
          size="default"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="icon-phone" className="flex items-center gap-2">
          <span>📱</span>
          Phone Number
        </Label>
        <Input
          id="icon-phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          size="default"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="icon-location" className="flex items-center gap-2">
          <span>📍</span>
          Address
        </Label>
        <Input
          id="icon-location"
          type="text"
          placeholder="123 Main St, City, State"
          size="default"
        />
      </div>
    </div>
  ),
}

// Complex Form Example
export const ComplexFormExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          Application Form
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please fill in all required fields
        </p>
      </div>

      <div className="space-y-4">
        {/* Personal Information Section */}
        <div className="pt-2">
          <h3 className="text-sm font-alt font-semibold text-foreground mb-4">
            Personal Information
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="app-first-name">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="app-first-name"
                type="text"
                placeholder="John"
                size="default"
                aria-required="true"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="app-last-name">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="app-last-name"
                type="text"
                placeholder="Doe"
                size="default"
                aria-required="true"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="pt-2 border-t border-border">
          <h3 className="text-sm font-alt font-semibold text-foreground mb-4">
            Contact Information
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="app-email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="app-email"
                type="email"
                placeholder="john@example.com"
                size="default"
                aria-required="true"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="app-phone">
                Phone <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="app-phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                size="default"
              />
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="pt-2 border-t border-border">
          <h3 className="text-sm font-alt font-semibold text-foreground mb-4">
            Additional Information
          </h3>

          <div className="flex flex-col gap-2">
            <Label htmlFor="app-message">
              Comments <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="app-message"
              placeholder="Any additional information..."
              rows={4}
            />
          </div>
        </div>
      </div>

      <button className="w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 mt-4">
        Submit Application
      </button>
    </div>
  ),
}

// Label States Comparison
export const StatesComparison: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-alt font-semibold text-foreground">
          Normal State
        </h3>
        <div className="flex flex-col gap-2">
          <Label htmlFor="normal-state">Active Field</Label>
          <Input
            id="normal-state"
            type="text"
            placeholder="Type something..."
            size="default"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-alt font-semibold text-foreground">
          Disabled State
        </h3>
        <div className="flex flex-col gap-2">
          <Label htmlFor="disabled-state">Disabled Field</Label>
          <Input
            id="disabled-state"
            type="text"
            placeholder="Cannot interact"
            size="default"
            disabled
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-alt font-semibold text-foreground">
          Required Field
        </h3>
        <div className="flex flex-col gap-2">
          <Label htmlFor="required-state">
            Required <span className="text-red-500">*</span>
          </Label>
          <Input
            id="required-state"
            type="text"
            placeholder="Must fill..."
            size="default"
            aria-required="true"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-alt font-semibold text-foreground">
          Optional Field
        </h3>
        <div className="flex flex-col gap-2">
          <Label htmlFor="optional-state">
            Optional <span className="text-muted-foreground text-xs">(opt)</span>
          </Label>
          <Input
            id="optional-state"
            type="text"
            placeholder="You can skip..."
            size="default"
          />
        </div>
      </div>
    </div>
  ),
}
