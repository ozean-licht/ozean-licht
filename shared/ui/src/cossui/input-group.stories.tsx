/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { type Meta, type StoryObj } from '@storybook/react'
import {
  InputGroupRoot,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  SearchIcon,
  UserIcon,
  MailIcon,
  CopyIcon,
  XIcon,
  PhoneIcon,
  GlobeIcon,
} from './input-group'
import { Label } from './label'

const meta: Meta<typeof InputGroupRoot> = {
  title: 'Tier 1: Primitives/CossUI/InputGroup',
  component: InputGroupRoot,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Input Group component from Coss UI adapted for Ozean Licht design system. Combines input fields with addons (text, icons, buttons) for enhanced input experiences. Features glass morphism effects and multiple size variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the input group',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    readOnly: {
      control: 'boolean',
      description: 'Read-only state',
    },
  },
}

export default meta
type Story = StoryObj<typeof InputGroupRoot>

// Basic Examples - Leading Text Addons
export const WithLeadingDollarSign: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Price</Label>
      <InputGroupRoot size="md">
        <InputGroupAddon position="leading">$</InputGroupAddon>
        <InputGroupInput type="number" placeholder="0.00" step="0.01" />
      </InputGroupRoot>
    </div>
  ),
}

export const WithLeadingAtSign: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Username</Label>
      <InputGroupRoot size="md">
        <InputGroupAddon position="leading">@</InputGroupAddon>
        <InputGroupInput type="text" placeholder="username" />
      </InputGroupRoot>
    </div>
  ),
}

export const WithLeadingHttps: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Website URL</Label>
      <InputGroupRoot size="md">
        <InputGroupAddon position="leading">https://</InputGroupAddon>
        <InputGroupInput type="text" placeholder="example.com" />
      </InputGroupRoot>
    </div>
  ),
}

// Trailing Text Addons
export const WithTrailingDomain: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Email Domain</Label>
      <InputGroupRoot size="md">
        <InputGroupInput type="text" placeholder="username" />
        <InputGroupAddon position="trailing">@example.com</InputGroupAddon>
      </InputGroupRoot>
    </div>
  ),
}

export const WithTrailingKg: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Weight</Label>
      <InputGroupRoot size="md">
        <InputGroupInput type="number" placeholder="0" step="0.1" />
        <InputGroupAddon position="trailing">kg</InputGroupAddon>
      </InputGroupRoot>
    </div>
  ),
}

export const WithTrailingPercent: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Discount</Label>
      <InputGroupRoot size="md">
        <InputGroupInput type="number" placeholder="0" min="0" max="100" />
        <InputGroupAddon position="trailing">%</InputGroupAddon>
      </InputGroupRoot>
    </div>
  ),
}

// Leading Icon Addons
export const WithLeadingSearchIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Search</Label>
      <InputGroupRoot size="md">
        <InputGroupAddon position="leading">
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput type="search" placeholder="Search..." />
      </InputGroupRoot>
    </div>
  ),
}

export const WithLeadingUserIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Full Name</Label>
      <InputGroupRoot size="md">
        <InputGroupAddon position="leading">
          <UserIcon />
        </InputGroupAddon>
        <InputGroupInput type="text" placeholder="John Doe" />
      </InputGroupRoot>
    </div>
  ),
}

export const WithLeadingEmailIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Email Address</Label>
      <InputGroupRoot size="md">
        <InputGroupAddon position="leading">
          <MailIcon />
        </InputGroupAddon>
        <InputGroupInput type="email" placeholder="john@example.com" />
      </InputGroupRoot>
    </div>
  ),
}

export const WithLeadingPhoneIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Phone Number</Label>
      <InputGroupRoot size="md">
        <InputGroupAddon position="leading">
          <PhoneIcon />
        </InputGroupAddon>
        <InputGroupInput type="tel" placeholder="+1 (555) 000-0000" />
      </InputGroupRoot>
    </div>
  ),
}

// Trailing Buttons
export const WithTrailingSubmitButton: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Email Newsletter</Label>
      <InputGroupRoot size="md">
        <InputGroupInput type="email" placeholder="Enter your email" />
        <InputGroupButton variant="primary">Submit</InputGroupButton>
      </InputGroupRoot>
    </div>
  ),
}

export const WithTrailingCopyButton: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>API Key</Label>
      <InputGroupRoot size="md">
        <InputGroupInput type="text" value="sk-1234567890abcdef" readOnly />
        <InputGroupButton variant="secondary">
          <CopyIcon />
        </InputGroupButton>
      </InputGroupRoot>
    </div>
  ),
}

export const WithTrailingClearButton: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Search Query</Label>
      <InputGroupRoot size="md">
        <InputGroupInput type="search" placeholder="Type to search..." />
        <InputGroupButton variant="ghost">
          <XIcon />
        </InputGroupButton>
      </InputGroupRoot>
    </div>
  ),
}

// Combined Layouts
export const SearchWithIconAndButton: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Search Products</Label>
      <InputGroupRoot size="md">
        <InputGroupAddon position="leading">
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput type="search" placeholder="Search products..." />
        <InputGroupButton variant="primary">Search</InputGroupButton>
      </InputGroupRoot>
    </div>
  ),
}

export const URLInputWithProtocol: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Website URL</Label>
      <InputGroupRoot size="md">
        <InputGroupAddon position="leading">https://</InputGroupAddon>
        <InputGroupInput type="text" placeholder="www.example.com" />
        <InputGroupButton variant="secondary">
          <GlobeIcon />
        </InputGroupButton>
      </InputGroupRoot>
    </div>
  ),
}

export const EmailWithDomain: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Company Email</Label>
      <InputGroupRoot size="md">
        <InputGroupInput type="text" placeholder="username" />
        <InputGroupAddon position="trailing">@company.com</InputGroupAddon>
        <InputGroupButton variant="primary">Verify</InputGroupButton>
      </InputGroupRoot>
    </div>
  ),
}

export const PriceWithCurrency: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Product Price</Label>
      <InputGroupRoot size="md">
        <InputGroupAddon position="leading">$</InputGroupAddon>
        <InputGroupInput type="number" placeholder="0.00" step="0.01" />
        <InputGroupAddon position="trailing">USD</InputGroupAddon>
      </InputGroupRoot>
    </div>
  ),
}

export const UsernameWithAtPrefix: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Social Handle</Label>
      <InputGroupRoot size="md">
        <InputGroupAddon position="leading">@</InputGroupAddon>
        <InputGroupInput type="text" placeholder="username" />
        <InputGroupButton variant="secondary">Check</InputGroupButton>
      </InputGroupRoot>
    </div>
  ),
}

export const WebsiteURLBuilder: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full min-w-[400px]">
      <div className="flex flex-col gap-2">
        <Label>Full Website URL</Label>
        <InputGroupRoot size="md">
          <InputGroupAddon position="leading">https://</InputGroupAddon>
          <InputGroupInput type="text" placeholder="example.com" />
          <InputGroupAddon position="trailing">/page</InputGroupAddon>
        </InputGroupRoot>
      </div>
    </div>
  ),
}

export const PhoneNumberWithCountryCode: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Phone Number</Label>
      <InputGroupRoot size="md">
        <InputGroupAddon position="leading">+1</InputGroupAddon>
        <InputGroupInput type="tel" placeholder="(555) 000-0000" />
      </InputGroupRoot>
    </div>
  ),
}

export const MeasurementWithUnits: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full min-w-[320px]">
      <div className="flex flex-col gap-2">
        <Label>Height</Label>
        <InputGroupRoot size="md">
          <InputGroupInput type="number" placeholder="0" step="0.1" />
          <InputGroupAddon position="trailing">cm</InputGroupAddon>
        </InputGroupRoot>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Width</Label>
        <InputGroupRoot size="md">
          <InputGroupInput type="number" placeholder="0" step="0.1" />
          <InputGroupAddon position="trailing">cm</InputGroupAddon>
        </InputGroupRoot>
      </div>
    </div>
  ),
}

// Size Variants
export const SizeSmall: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Small Size</Label>
      <InputGroupRoot size="sm">
        <InputGroupAddon position="leading">$</InputGroupAddon>
        <InputGroupInput type="number" placeholder="0.00" />
        <InputGroupButton variant="primary">Add</InputGroupButton>
      </InputGroupRoot>
    </div>
  ),
}

export const SizeMedium: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Medium Size (Default)</Label>
      <InputGroupRoot size="md">
        <InputGroupAddon position="leading">$</InputGroupAddon>
        <InputGroupInput type="number" placeholder="0.00" />
        <InputGroupButton variant="primary">Add</InputGroupButton>
      </InputGroupRoot>
    </div>
  ),
}

export const SizeLarge: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Large Size</Label>
      <InputGroupRoot size="lg">
        <InputGroupAddon position="leading">$</InputGroupAddon>
        <InputGroupInput type="number" placeholder="0.00" />
        <InputGroupButton variant="primary">Add</InputGroupButton>
      </InputGroupRoot>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full min-w-[320px]">
      <div className="flex flex-col gap-2">
        <Label>Small (height: 28px)</Label>
        <InputGroupRoot size="sm">
          <InputGroupAddon position="leading">@</InputGroupAddon>
          <InputGroupInput type="text" placeholder="username" />
          <InputGroupButton variant="primary">Check</InputGroupButton>
        </InputGroupRoot>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Medium (height: 32px)</Label>
        <InputGroupRoot size="md">
          <InputGroupAddon position="leading">@</InputGroupAddon>
          <InputGroupInput type="text" placeholder="username" />
          <InputGroupButton variant="primary">Check</InputGroupButton>
        </InputGroupRoot>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Large (height: 36px)</Label>
        <InputGroupRoot size="lg">
          <InputGroupAddon position="leading">@</InputGroupAddon>
          <InputGroupInput type="text" placeholder="username" />
          <InputGroupButton variant="primary">Check</InputGroupButton>
        </InputGroupRoot>
      </div>
    </div>
  ),
}

// States
export const DisabledState: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full min-w-[320px]">
      <div className="flex flex-col gap-2">
        <Label>Disabled Input Group</Label>
        <InputGroupRoot size="md" disabled>
          <InputGroupAddon position="leading">$</InputGroupAddon>
          <InputGroupInput type="number" placeholder="0.00" disabled />
          <InputGroupButton variant="primary" disabled>
            Submit
          </InputGroupButton>
        </InputGroupRoot>
      </div>
    </div>
  ),
}

export const ReadOnlyState: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Read-Only API Key</Label>
      <InputGroupRoot size="md" readOnly>
        <InputGroupInput type="text" value="sk-1234567890abcdef" readOnly />
        <InputGroupButton variant="secondary">
          <CopyIcon />
        </InputGroupButton>
      </InputGroupRoot>
    </div>
  ),
}

export const ErrorState: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full min-w-[320px]">
      <Label>Email Address</Label>
      <InputGroupRoot size="md" error>
        <InputGroupAddon position="leading">
          <MailIcon />
        </InputGroupAddon>
        <InputGroupInput type="email" placeholder="john@example.com" defaultValue="invalid-email" />
      </InputGroupRoot>
      <p className="text-xs text-destructive">Please enter a valid email address</p>
    </div>
  ),
}

// Glass Effect Variants
export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-primary/20 rounded-lg space-y-6 min-w-[400px]">
      <div className="flex flex-col gap-2">
        <Label className="text-foreground/90">Search with Icon</Label>
        <InputGroupRoot size="md" className="glass-card">
          <InputGroupAddon position="leading">
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput type="search" placeholder="Search..." />
        </InputGroupRoot>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-foreground/90">Price Input</Label>
        <InputGroupRoot size="md" className="glass-card-strong">
          <InputGroupAddon position="leading">$</InputGroupAddon>
          <InputGroupInput type="number" placeholder="0.00" />
          <InputGroupAddon position="trailing">USD</InputGroupAddon>
        </InputGroupRoot>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-foreground/90">Email with Button</Label>
        <InputGroupRoot size="md" className="glass-subtle">
          <InputGroupInput type="email" placeholder="Enter email" />
          <InputGroupButton variant="primary">Subscribe</InputGroupButton>
        </InputGroupRoot>
      </div>
    </div>
  ),
}

// Form Integration Example
export const CheckoutForm: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full min-w-[400px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">Checkout</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Complete your purchase
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="checkout-email">Email</Label>
        <InputGroupRoot size="md">
          <InputGroupAddon position="leading">
            <MailIcon />
          </InputGroupAddon>
          <InputGroupInput
            id="checkout-email"
            type="email"
            placeholder="john@example.com"
          />
        </InputGroupRoot>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="checkout-phone">Phone Number</Label>
        <InputGroupRoot size="md">
          <InputGroupAddon position="leading">+1</InputGroupAddon>
          <InputGroupInput
            id="checkout-phone"
            type="tel"
            placeholder="(555) 000-0000"
          />
        </InputGroupRoot>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="checkout-discount">Discount Code</Label>
        <InputGroupRoot size="md">
          <InputGroupInput
            id="checkout-discount"
            type="text"
            placeholder="Enter code"
          />
          <InputGroupButton variant="secondary">Apply</InputGroupButton>
        </InputGroupRoot>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="checkout-total">Total Amount</Label>
        <InputGroupRoot size="lg">
          <InputGroupAddon position="leading">$</InputGroupAddon>
          <InputGroupInput
            id="checkout-total"
            type="text"
            value="299.99"
            readOnly
          />
          <InputGroupAddon position="trailing">USD</InputGroupAddon>
        </InputGroupRoot>
      </div>

      <button className="mt-2 w-full h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        Complete Purchase
      </button>
    </div>
  ),
}

// Button Variants
export const ButtonVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full min-w-[320px]">
      <div className="flex flex-col gap-2">
        <Label>Primary Button</Label>
        <InputGroupRoot size="md">
          <InputGroupInput type="email" placeholder="Enter email" />
          <InputGroupButton variant="primary">Subscribe</InputGroupButton>
        </InputGroupRoot>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Secondary Button</Label>
        <InputGroupRoot size="md">
          <InputGroupInput type="text" placeholder="API Key" />
          <InputGroupButton variant="secondary">
            <CopyIcon />
          </InputGroupButton>
        </InputGroupRoot>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Ghost Button</Label>
        <InputGroupRoot size="md">
          <InputGroupInput type="search" placeholder="Search..." />
          <InputGroupButton variant="ghost">
            <XIcon />
          </InputGroupButton>
        </InputGroupRoot>
      </div>
    </div>
  ),
}

// Accessibility Example
export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full min-w-[320px]">
      <div className="flex flex-col gap-2">
        <Label htmlFor="accessible-search">
          Search Products <span className="text-muted-foreground text-xs">(Required)</span>
        </Label>
        <InputGroupRoot size="md">
          <InputGroupAddon position="leading">
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            id="accessible-search"
            type="search"
            placeholder="Search..."
            aria-required="true"
            aria-label="Product search input"
          />
          <InputGroupButton variant="primary" aria-label="Submit search">
            Search
          </InputGroupButton>
        </InputGroupRoot>
        <p className="text-xs text-muted-foreground">
          Press Enter to search or click the Search button
        </p>
      </div>
    </div>
  ),
}
