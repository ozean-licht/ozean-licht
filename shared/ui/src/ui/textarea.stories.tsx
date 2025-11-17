import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Textarea } from './textarea';
import { Label } from './label';

/**
 * Textarea component for multi-line text input.
 *
 * ## Features
 * - Auto-resizing height (min 80px)
 * - Focus ring with proper contrast
 * - Disabled state support
 * - Placeholder text
 * - Full form support
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A multi-line text input field for longer content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable textarea interaction',
    },
    rows: {
      control: 'number',
      description: 'Number of visible text rows',
    },
  },
  args: {
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default textarea
 */
export const Default: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
};

/**
 * Textarea with value
 */
export const WithValue: Story = {
  args: {
    value: 'This is a pre-filled textarea with some content.',
  },
};

/**
 * Disabled textarea
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'This textarea is disabled.',
  },
};

/**
 * Textarea with custom rows
 */
export const CustomRows: Story = {
  args: {
    rows: 10,
    placeholder: 'A taller textarea with 10 rows...',
  },
};

/**
 * Textarea with label
 */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea
        id="message"
        placeholder="Type your message here..."
      />
    </div>
  ),
};

/**
 * Textarea with label and description
 */
export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="bio">Biography</Label>
      <Textarea
        id="bio"
        placeholder="Tell us a little bit about yourself..."
        rows={5}
      />
      <p className="text-sm text-muted-foreground">
        You can use markdown formatting in your bio.
      </p>
    </div>
  ),
};

/**
 * Textarea with character count
 */
export const WithCharacterCount: Story = {
  render: () => {
    const maxLength = 280;
    const [value, setValue] = React.useState('');

    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor="tweet">Compose tweet</Label>
        <Textarea
          id="tweet"
          placeholder="What's happening?"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
          rows={4}
        />
        <p className="text-sm text-muted-foreground text-right">
          {value.length}/{maxLength} characters
        </p>
      </div>
    );
  },
};

/**
 * Form example with validation
 */
export const FormExample: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    const minLength = 10;
    const isValid = value.length >= minLength;

    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor="feedback">Feedback</Label>
        <Textarea
          id="feedback"
          placeholder="Share your thoughts..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          className={!isValid && value.length > 0 ? 'border-red-500' : ''}
        />
        {!isValid && value.length > 0 && (
          <p className="text-sm text-red-500">
            Minimum {minLength} characters required ({value.length}/{minLength})
          </p>
        )}
        {isValid && (
          <p className="text-sm text-green-600">
            ✓ Ready to submit
          </p>
        )}
      </div>
    );
  },
};

/**
 * All states showcase
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="grid w-full gap-1.5">
        <Label>Empty</Label>
        <Textarea placeholder="Empty textarea" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label>With Content</Label>
        <Textarea value="This textarea has content" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label>Focused</Label>
        <Textarea defaultValue="Click to see focus ring" autoFocus />
      </div>

      <div className="grid w-full gap-1.5">
        <Label className="text-muted-foreground">Disabled</Label>
        <Textarea disabled value="This is disabled" />
      </div>
    </div>
  ),
};

import * as React from 'react';
