import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from './input';
import { Label } from './label';
import * as React from 'react';

/**
 * Input component for single-line text input.
 * Built on native HTML input element with enhanced styling.
 *
 * ## Features
 * - Multiple input types (text, email, password, number, etc.)
 * - Focus ring with proper contrast
 * - Disabled and readonly states
 * - Placeholder text support
 * - Full form support with labels
 * - File upload styling
 * - Keyboard accessible
 *
 * ## Input Types Supported
 * - text (default)
 * - email
 * - password
 * - number
 * - search
 * - tel
 * - url
 * - date
 * - file
 *
 * ## Accessibility
 * - Always pair with a Label for accessibility
 * - Use placeholder as hint, not replacement for label
 * - Ensure focus ring is visible for keyboard navigation
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A single-line text input field with support for various input types and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url', 'date', 'file'],
      description: 'HTML input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input interaction',
    },
    readOnly: {
      control: 'boolean',
      description: 'Make input read-only',
    },
    value: {
      control: 'text',
      description: 'Input value',
    },
  },
  args: {
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default text input
 */
export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
};

/**
 * Input with value
 */
export const WithValue: Story = {
  args: {
    type: 'text',
    value: 'Pre-filled value',
  },
};

/**
 * Email input type
 */
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

/**
 * Password input type
 */
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

/**
 * Number input type
 */
export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0',
  },
};

/**
 * Search input type
 */
export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

/**
 * Telephone input type
 */
export const Telephone: Story = {
  args: {
    type: 'tel',
    placeholder: '+43 123 456 789',
  },
};

/**
 * URL input type
 */
export const URL: Story = {
  args: {
    type: 'url',
    placeholder: 'https://example.com',
  },
};

/**
 * Date input type
 */
export const Date: Story = {
  args: {
    type: 'date',
  },
};

/**
 * File input type with custom file selector styling
 */
export const File: Story = {
  args: {
    type: 'file',
  },
};

/**
 * Disabled input state
 */
export const Disabled: Story = {
  args: {
    type: 'text',
    disabled: true,
    value: 'This input is disabled',
  },
};

/**
 * Readonly input state
 */
export const ReadOnly: Story = {
  args: {
    type: 'text',
    readOnly: true,
    value: 'This input is read-only',
  },
};

/**
 * Input with label
 */
export const WithLabel: Story = {
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
 * Input with label and description
 */
export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="username">Username</Label>
      <Input
        type="text"
        id="username"
        placeholder="ozean_licht_user"
      />
      <p className="text-sm text-muted-foreground">
        This is your public display name. It can be your real name or a pseudonym.
      </p>
    </div>
  ),
};

/**
 * Input with error state (custom styling)
 */
export const WithError: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="email-error">Email</Label>
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
 * Input with success state (custom styling with Ozean Licht turquoise)
 */
export const WithSuccess: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="email-success">Email</Label>
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
 * Input with button (search example)
 */
export const WithButton: Story = {
  render: () => (
    <div className="flex w-full items-center space-x-2">
      <Input
        type="search"
        placeholder="Search..."
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-[#0ec2bc] px-4 py-2 text-sm font-medium text-white hover:bg-[#0db3ad] focus:outline-none focus:ring-2 focus:ring-[#0ec2bc] focus:ring-offset-2"
      >
        Search
      </button>
    </div>
  ),
};

/**
 * Form example with multiple input types
 */
export const FormExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="name">Full Name</Label>
        <Input
          type="text"
          id="name"
          placeholder="Max Mustermann"
        />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="email-form">Email</Label>
        <Input
          type="email"
          id="email-form"
          placeholder="max@example.com"
        />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input
          type="tel"
          id="phone"
          placeholder="+43 123 456 789"
        />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="website">Website</Label>
        <Input
          type="url"
          id="website"
          placeholder="https://ozean-licht.dev"
        />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="birthdate">Birth Date</Label>
        <Input
          type="date"
          id="birthdate"
        />
      </div>
    </div>
  ),
};

/**
 * Password input with toggle visibility example
 */
export const PasswordWithToggle: Story = {
  render: () => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor="password-toggle">Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password-toggle"
            placeholder="Enter password..."
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
    );
  },
};

/**
 * Input with character counter
 */
export const WithCharacterCounter: Story = {
  render: () => {
    const maxLength = 50;
    const [value, setValue] = React.useState('');

    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Input
          type="text"
          id="bio"
          placeholder="Tell us about yourself..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
        />
        <p className="text-sm text-muted-foreground text-right">
          {value.length}/{maxLength} characters
        </p>
      </div>
    );
  },
};

/**
 * Input with validation
 */
export const WithValidation: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);
    const showValidation = value.length > 0;

    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor="email-validation">Email</Label>
        <Input
          type="email"
          id="email-validation"
          placeholder="email@example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={showValidation ? (isValid ? 'border-[#0ec2bc] focus-visible:ring-[#0ec2bc]' : 'border-red-500 focus-visible:ring-red-500') : ''}
        />
        {showValidation && (
          <p className={`text-sm ${isValid ? 'text-[#0ec2bc]' : 'text-red-500'}`}>
            {isValid ? '✓ Valid email address' : '✗ Invalid email address'}
          </p>
        )}
      </div>
    );
  },
};

/**
 * All input types showcase
 */
export const AllTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="text">Text</Label>
        <Input type="text" id="text" placeholder="Text input" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="email-all">Email</Label>
        <Input type="email" id="email-all" placeholder="email@example.com" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="password-all">Password</Label>
        <Input type="password" id="password-all" placeholder="••••••••" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="number-all">Number</Label>
        <Input type="number" id="number-all" placeholder="123" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="search-all">Search</Label>
        <Input type="search" id="search-all" placeholder="Search..." />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="tel-all">Telephone</Label>
        <Input type="tel" id="tel-all" placeholder="+43 123 456 789" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="url-all">URL</Label>
        <Input type="url" id="url-all" placeholder="https://example.com" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="date-all">Date</Label>
        <Input type="date" id="date-all" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="file-all">File</Label>
        <Input type="file" id="file-all" />
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
      <div className="grid w-full gap-1.5">
        <Label>Default (Empty)</Label>
        <Input type="text" placeholder="Empty input" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label>With Value</Label>
        <Input type="text" value="Input with value" readOnly />
      </div>

      <div className="grid w-full gap-1.5">
        <Label>Focused</Label>
        <Input type="text" defaultValue="Click to see focus ring" autoFocus />
      </div>

      <div className="grid w-full gap-1.5">
        <Label className="text-muted-foreground">Disabled</Label>
        <Input type="text" disabled value="Disabled input" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label>Read-only</Label>
        <Input type="text" readOnly value="Read-only input" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label>Error State</Label>
        <Input
          type="text"
          value="Invalid value"
          className="border-red-500 focus-visible:ring-red-500"
          readOnly
        />
        <p className="text-sm text-red-500">This field has an error</p>
      </div>

      <div className="grid w-full gap-1.5">
        <Label>Success State</Label>
        <Input
          type="text"
          value="Valid value"
          className="border-[#0ec2bc] focus-visible:ring-[#0ec2bc]"
          readOnly
        />
        <p className="text-sm text-[#0ec2bc]">✓ This field is valid</p>
      </div>
    </div>
  ),
};
