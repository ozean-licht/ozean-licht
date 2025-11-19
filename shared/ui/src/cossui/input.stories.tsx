/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { type Meta, type StoryObj } from '@storybook/react'
import { Input as InputBase } from './input'
import { Label } from './label'

// Cast Input to allow string size values without type conflicts
const Input = InputBase as any

const meta: Meta<typeof InputBase> = {
  title: 'CossUI/Input',
  component: Input as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Input component from Coss UI adapted for Ozean Licht design system. Features glass morphism effects, multiple size variants, and support for all HTML input types.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size variant of the input field',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'date', 'tel', 'url', 'search'],
      description: 'HTML input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when input is empty',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

// Basic Stories - Single Size Variants
export const Default: Story = {
  render: () => <Input placeholder="Enter text here..." size="default" />,
}

export const Small: Story = {
  render: () => <Input placeholder="Small input field" size="sm" />,
}

export const Large: Story = {
  render: () => <Input placeholder="Large input field" size="lg" />,
}

// All Size Variants
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <Label>Small (height: 28px, text: xs)</Label>
        <Input size="sm" placeholder="Small input" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Default (height: 32px, text: sm)</Label>
        <Input size="default" placeholder="Default input" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Large (height: 36px, text: base)</Label>
        <Input size="lg" placeholder="Large input" />
      </div>
    </div>
  ),
}

// Input Types
export const TextInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="text-input">Full Name</Label>
      <Input
        id="text-input"
        type="text"
        placeholder="John Doe"
        size="default"
      />
    </div>
  ),
}

export const EmailInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="email-input">Email Address</Label>
      <Input
        id="email-input"
        type="email"
        placeholder="john@example.com"
        size="default"
      />
    </div>
  ),
}

export const PasswordInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="password-input">Password</Label>
      <Input
        id="password-input"
        type="password"
        placeholder="Enter your password"
        size="default"
      />
    </div>
  ),
}

export const NumberInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="number-input">Age</Label>
      <Input
        id="number-input"
        type="number"
        placeholder="25"
        min={0}
        max={120}
        size="default"
      />
    </div>
  ),
}

export const DateInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="date-input">Date of Birth</Label>
      <Input
        id="date-input"
        type="date"
        size="default"
      />
    </div>
  ),
}

export const TelephoneInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="tel-input">Phone Number</Label>
      <Input
        id="tel-input"
        type="tel"
        placeholder="+1 (555) 000-0000"
        size="default"
      />
    </div>
  ),
}

export const URLInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="url-input">Website</Label>
      <Input
        id="url-input"
        type="url"
        placeholder="https://example.com"
        size="default"
      />
    </div>
  ),
}

export const SearchInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="search-input">Search</Label>
      <Input
        id="search-input"
        type="search"
        placeholder="Search..."
        size="default"
      />
    </div>
  ),
}

// All Input Types
export const AllInputTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <Label htmlFor="text">Text</Label>
        <Input id="text" type="text" placeholder="Enter text" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="john@example.com" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter password" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="number">Number</Label>
        <Input id="number" type="number" placeholder="Enter number" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tel">Telephone</Label>
        <Input id="tel" type="tel" placeholder="+1 (555) 000-0000" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="url">URL</Label>
        <Input id="url" type="url" placeholder="https://example.com" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="search">Search</Label>
        <Input id="search" type="search" placeholder="Search..." />
      </div>
    </div>
  ),
}

// Disabled States
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <Label htmlFor="disabled-sm">Disabled (Small)</Label>
        <Input
          id="disabled-sm"
          size="sm"
          placeholder="Disabled small input"
          disabled
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="disabled-default">Disabled (Default)</Label>
        <Input
          id="disabled-default"
          size="default"
          placeholder="Disabled default input"
          disabled
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="disabled-lg">Disabled (Large)</Label>
        <Input
          id="disabled-lg"
          size="lg"
          placeholder="Disabled large input"
          disabled
        />
      </div>
    </div>
  ),
}

// With Label
export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="with-label">Full Name</Label>
      <Input
        id="with-label"
        placeholder="John Doe"
        size="default"
      />
      <p className="text-xs text-muted-foreground">Enter your full name</p>
    </div>
  ),
}

// With Helper Text
export const WithHelperText: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="with-helper">Email Address</Label>
      <Input
        id="with-helper"
        type="email"
        placeholder="john@example.com"
        size="default"
      />
      <p className="text-xs text-muted-foreground">
        We'll never share your email with anyone else.
      </p>
    </div>
  ),
}

// Focus State
export const FocusState: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <Label>Focused Input (try clicking)</Label>
        <Input
          autoFocus
          placeholder="This input is auto-focused"
          size="default"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Normal Input</Label>
        <Input placeholder="Click the input above to see focus state" size="default" />
      </div>
    </div>
  ),
}

// Form Example - Sign Up
export const SignUpForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">Create Account</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Join us to get started
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-name">Full Name</Label>
        <Input
          id="signup-name"
          type="text"
          placeholder="John Doe"
          size="default"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-email">Email Address</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="john@example.com"
          size="default"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Create a strong password"
          size="default"
        />
        <p className="text-xs text-muted-foreground">
          Must be at least 8 characters long
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-confirm">Confirm Password</Label>
        <Input
          id="signup-confirm"
          type="password"
          placeholder="Confirm your password"
          size="default"
        />
      </div>

      <button className="mt-2 w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        Create Account
      </button>
    </div>
  ),
}

// Form Example - Login
export const LoginForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">Sign In</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your credentials to continue
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-email">Email Address</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="john@example.com"
          size="default"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          placeholder="Enter your password"
          size="default"
        />
      </div>

      <button className="w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        Sign In
      </button>

      <p className="text-xs text-center text-muted-foreground">
        Don't have an account?{' '}
        <a href="#" className="text-primary hover:underline">
          Sign up
        </a>
      </p>
    </div>
  ),
}

// Placeholder Variations
export const PlaceholderVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <Label>With Placeholder</Label>
        <Input placeholder="This is a placeholder" size="default" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Without Placeholder</Label>
        <Input size="default" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Long Placeholder</Label>
        <Input
          placeholder="This is a longer placeholder text that spans..."
          size="default"
        />
      </div>
    </div>
  ),
}

// Search Bar Variant
export const SearchBar: Story = {
  render: () => (
    <div className="w-full">
      <Input
        type="search"
        placeholder="Search for users, projects, or documents..."
        size="lg"
        className="w-full"
      />
    </div>
  ),
}

// With Glass Effect Background
export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-primary/20 rounded-lg space-y-6">
      <div className="flex flex-col gap-2 w-full">
        <Label className="text-foreground/90">Username</Label>
        <Input
          placeholder="Enter your username"
          size="default"
          className="glass-card"
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label className="text-foreground/90">Email</Label>
        <Input
          type="email"
          placeholder="your@email.com"
          size="default"
          className="glass-card-strong"
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label className="text-foreground/90">Message</Label>
        <Input
          placeholder="Type your message..."
          size="lg"
          className="glass-subtle"
        />
      </div>
    </div>
  ),
}

// Size Comparison in Form
export const SizeComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <Label>Small - Contact Number</Label>
        <Input
          type="tel"
          placeholder="Small (xs font, 28px height)"
          size="sm"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Default - First Name</Label>
        <Input
          type="text"
          placeholder="Default (sm font, 32px height)"
          size="default"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Large - Full Name</Label>
        <Input
          type="text"
          placeholder="Large (base font, 36px height)"
          size="lg"
        />
      </div>
    </div>
  ),
}

// Accessibility Example
export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <Label htmlFor="accessible-input-1">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="accessible-input-1"
          type="text"
          placeholder="John Doe"
          size="default"
          aria-required="true"
          aria-label="Full name input"
        />
        <p id="name-description" className="text-xs text-muted-foreground">
          Enter your first and last name
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="accessible-input-2">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="accessible-input-2"
          type="email"
          placeholder="john@example.com"
          size="default"
          aria-required="true"
          aria-label="Email input"
        />
      </div>

      <button
        type="submit"
        className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90"
      >
        Submit
      </button>
    </div>
  ),
}

// Validation States
export const ValidationStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <Label htmlFor="valid-input">Valid Email</Label>
        <Input
          id="valid-input"
          type="email"
          placeholder="john@example.com"
          size="default"
          defaultValue="john@example.com"
          className="border-green-500/50 focus-visible:ring-green-500"
        />
        <p className="text-xs text-green-500">Email is valid</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="invalid-input">Invalid Email</Label>
        <Input
          id="invalid-input"
          type="email"
          placeholder="john@example.com"
          size="default"
          defaultValue="not-an-email"
          className="border-red-500/50 focus-visible:ring-red-500"
        />
        <p className="text-xs text-red-500">Please enter a valid email address</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="warning-input">Password Strength</Label>
        <Input
          id="warning-input"
          type="password"
          placeholder="Enter a strong password"
          size="default"
          defaultValue="weak"
          className="border-yellow-500/50 focus-visible:ring-yellow-500"
        />
        <p className="text-xs text-yellow-500">Password is weak, use uppercase, numbers, and symbols</p>
      </div>
    </div>
  ),
}
