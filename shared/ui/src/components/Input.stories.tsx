import type { Meta, StoryObj } from '@storybook/react';
import { Input, Textarea, Label } from './Input';
import { Search, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

/**
 * Input components with Ozean Licht branding.
 * Features turquoise focus rings, glass backgrounds, and icon support.
 *
 * ## Features
 * - Input and Textarea variants
 * - Glass morphism styling option
 * - Icon support (before and after)
 * - Error states with messages
 * - Three sizes (sm, md, lg)
 * - Label component with required indicator
 */
const meta = {
  title: 'Shared UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Ozean Licht branded form inputs with turquoise focus rings and icon support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass'],
      description: 'Visual style variant',
    },
    inputSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
    },
    error: {
      control: 'text',
      description: 'Error message (or true for error state only)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default input
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

/**
 * Input with label
 */
export const WithLabel: Story = {
  render: () => (
    <div>
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="Enter your name" />
    </div>
  ),
};

/**
 * Required input with label
 */
export const Required: Story = {
  render: () => (
    <div>
      <Label htmlFor="email" required>
        Email Address
      </Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

/**
 * Glass variant with transparency
 */
export const Glass: Story = {
  args: {
    variant: 'glass',
    placeholder: 'Glass input...',
  },
};

/**
 * Input with search icon
 */
export const WithSearchIcon: Story = {
  args: {
    icon: <Search className="h-4 w-4" />,
    placeholder: 'Search...',
  },
};

/**
 * Email input with icon
 */
export const EmailInput: Story = {
  args: {
    type: 'email',
    icon: <Mail className="h-4 w-4" />,
    placeholder: 'you@example.com',
  },
};

/**
 * Password input with icon
 */
export const PasswordInput: Story = {
  args: {
    type: 'password',
    icon: <Lock className="h-4 w-4" />,
    placeholder: 'Enter password',
  },
};

/**
 * Input with icon after
 */
export const WithIconAfter: Story = {
  args: {
    iconAfter: <Eye className="h-4 w-4" />,
    placeholder: 'Password',
    type: 'password',
  },
};

/**
 * Small input size
 */
export const Small: Story = {
  args: {
    inputSize: 'sm',
    placeholder: 'Small input',
  },
};

/**
 * Large input size
 */
export const Large: Story = {
  args: {
    inputSize: 'lg',
    placeholder: 'Large input',
  },
};

/**
 * Input with error state
 */
export const WithError: Story = {
  args: {
    error: 'This field is required',
    placeholder: 'Enter value',
  },
};

/**
 * Disabled input
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    value: 'Cannot edit',
  },
};

/**
 * Complete form field example
 */
export const FormField: Story = {
  render: () => (
    <div>
      <Label htmlFor="username" required>
        Username
      </Label>
      <Input
        id="username"
        placeholder="Choose a username"
        icon={<Search className="h-4 w-4" />}
      />
      <p className="mt-1.5 text-sm text-muted-foreground">
        This will be your public display name.
      </p>
    </div>
  ),
};

/**
 * Textarea default
 */
export const TextareaDefault: Story = {
  render: () => <Textarea placeholder="Enter your message..." />,
};

/**
 * Textarea with label
 */
export const TextareaWithLabel: Story = {
  render: () => (
    <div>
      <Label htmlFor="message" required>
        Message
      </Label>
      <Textarea id="message" placeholder="Type your message here..." />
    </div>
  ),
};

/**
 * Textarea with error
 */
export const TextareaWithError: Story = {
  render: () => (
    <Textarea error="Message must be at least 10 characters" placeholder="Too short..." />
  ),
};

/**
 * Interactive password visibility toggle
 */
export const PasswordToggle: Story = {
  render: function PasswordToggleExample() {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div>
        <Label htmlFor="password" required>
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            icon={<Lock className="h-4 w-4" />}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    );
  },
};

/**
 * All input sizes
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-3">
      <Input inputSize="sm" placeholder="Small" />
      <Input inputSize="md" placeholder="Medium (default)" />
      <Input inputSize="lg" placeholder="Large" />
    </div>
  ),
};

/**
 * All input types
 */
export const AllTypes: Story = {
  render: () => (
    <div className="space-y-3">
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="url" placeholder="URL input" />
      <Input type="tel" placeholder="Phone input" />
      <Input type="search" placeholder="Search input" />
    </div>
  ),
};
