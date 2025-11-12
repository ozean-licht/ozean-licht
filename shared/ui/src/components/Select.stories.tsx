import type { Meta, StoryObj } from '@storybook/react';
import { Select, FormGroup } from './Select';
import { Label } from './Input';

/**
 * Select component with Ozean Licht styling.
 * Native HTML select with custom styling and dropdown arrow.
 *
 * ## Features
 * - Native HTML select with custom styling
 * - Options array or children support
 * - Error states with messages
 * - Three sizes (sm, md, lg)
 * - FormGroup wrapper for complete form fields
 */
const meta = {
  title: 'Shared UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Native HTML select dropdown with Ozean Licht styling and custom arrow indicator.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Select size',
    },
    error: {
      control: 'text',
      description: 'Error message (or true for error state only)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable select',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default select with children options
 */
export const Default: Story = {
  args: {
    children: (
      <>
        <option value="">Choose an option...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </>
    ),
  },
};

/**
 * Select with options array
 */
export const WithOptionsArray: Story = {
  args: {
    options: [
      { value: '', label: 'Select a country...' },
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
      { value: 'au', label: 'Australia' },
      { value: 'de', label: 'Germany' },
    ],
  },
};

/**
 * Select with label
 */
export const WithLabel: Story = {
  render: () => (
    <div>
      <Label htmlFor="country">Country</Label>
      <Select id="country">
        <option value="">Select a country...</option>
        <option value="at">Austria</option>
        <option value="de">Germany</option>
        <option value="ch">Switzerland</option>
      </Select>
    </div>
  ),
};

/**
 * Required select with label
 */
export const Required: Story = {
  render: () => (
    <div>
      <Label htmlFor="role" required>
        Role
      </Label>
      <Select id="role">
        <option value="">Select a role...</option>
        <option value="admin">Administrator</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </Select>
    </div>
  ),
};

/**
 * Small select size
 */
export const Small: Story = {
  args: {
    selectSize: 'sm',
    options: [
      { value: '', label: 'Small select' },
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ],
  },
};

/**
 * Large select size
 */
export const Large: Story = {
  args: {
    selectSize: 'lg',
    options: [
      { value: '', label: 'Large select' },
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ],
  },
};

/**
 * Select with error state
 */
export const WithError: Story = {
  args: {
    error: 'Please select a valid option',
    children: (
      <>
        <option value="">Select an option...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </>
    ),
  },
};

/**
 * Disabled select
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <option value="1">Cannot change</option>
      </>
    ),
  },
};

/**
 * Select with default value
 */
export const WithDefaultValue: Story = {
  args: {
    defaultValue: '2',
    children: (
      <>
        <option value="">Choose...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2 (default)</option>
        <option value="3">Option 3</option>
      </>
    ),
  },
};

/**
 * FormGroup with select
 */
export const WithFormGroup: Story = {
  render: () => (
    <FormGroup
      label="Preferred Language"
      required
      helpText="Choose your preferred language for notifications"
    >
      <Select>
        <option value="">Select a language...</option>
        <option value="en">English</option>
        <option value="de">German</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
      </Select>
    </FormGroup>
  ),
};

/**
 * FormGroup with error
 */
export const FormGroupWithError: Story = {
  render: () => (
    <FormGroup
      label="Payment Method"
      required
      error="Please select a payment method"
    >
      <Select error>
        <option value="">Choose payment method...</option>
        <option value="card">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="bank">Bank Transfer</option>
      </Select>
    </FormGroup>
  ),
};

/**
 * Multiple selects in a form
 */
export const MultipleSelects: Story = {
  render: () => (
    <div className="space-y-4">
      <FormGroup label="Category" required>
        <Select>
          <option value="">Select category...</option>
          <option value="tech">Technology</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
        </Select>
      </FormGroup>

      <FormGroup label="Status" required>
        <Select>
          <option value="">Select status...</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </Select>
      </FormGroup>

      <FormGroup label="Priority">
        <Select>
          <option value="">Select priority...</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </FormGroup>
    </div>
  ),
};

/**
 * All select sizes
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-3">
      <Select selectSize="sm">
        <option>Small</option>
      </Select>
      <Select selectSize="md">
        <option>Medium (default)</option>
      </Select>
      <Select selectSize="lg">
        <option>Large</option>
      </Select>
    </div>
  ),
};

/**
 * Country selector example
 */
export const CountrySelector: Story = {
  render: () => (
    <FormGroup
      label="Country / Region"
      required
      helpText="Select your country or region"
    >
      <Select>
        <option value="">Select a country...</option>
        <optgroup label="Europe">
          <option value="at">Austria</option>
          <option value="de">Germany</option>
          <option value="ch">Switzerland</option>
          <option value="fr">France</option>
          <option value="it">Italy</option>
        </optgroup>
        <optgroup label="North America">
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="mx">Mexico</option>
        </optgroup>
        <optgroup label="Asia">
          <option value="jp">Japan</option>
          <option value="cn">China</option>
          <option value="in">India</option>
        </optgroup>
      </Select>
    </FormGroup>
  ),
};
