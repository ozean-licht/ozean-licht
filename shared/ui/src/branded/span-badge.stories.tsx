import type { Meta, StoryObj } from '@storybook/react';
import SpanBadge from './span-badge';

/**
 * SpanBadge component with icon and text.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **Icon Support**: 8 different lucide-react icons (star, heart, lightbulb, magicwand, moon, feedback, users, sparkle)
 * - **Flexible Content**: Accepts text prop or children
 * - **Two Variants**: default (with icon) and justText (text only)
 * - **Glass Effect**: Subtle secondary background with primary border
 *
 * ## Icons Available
 * - **star** - Default star icon
 * - **heart** - Heart icon
 * - **lightbulb** - Lightbulb icon
 * - **magicwand** - Wand2 icon
 * - **moon** - Moon icon
 * - **feedback** - MessageCircle icon
 * - **users** - Users icon
 * - **sparkle** - Sparkle icon
 *
 * ## Usage
 * Use for small labels, tags, or category badges with icons.
 */
const meta = {
  title: 'Tier 2: Branded/SpanBadge',
  component: SpanBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A small badge component with icon support and Ozean Licht styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ['star', 'heart', 'lightbulb', 'magicwand', 'moon', 'feedback', 'users', 'sparkle'],
      description: 'Icon to display',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'star' },
      },
    },
    text: {
      control: 'text',
      description: 'Badge text (alternative to children)',
    },
    children: {
      control: 'text',
      description: 'Badge content (overrides text prop)',
    },
    variant: {
      control: 'select',
      options: ['default', 'justText'],
      description: 'Display variant',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
  },
} satisfies Meta<typeof SpanBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default badge with star icon.
 */
export const Default: Story = {
  args: {
    text: 'Featured',
  },
};

/**
 * All icon variants showcase.
 */
export const AllIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <SpanBadge icon="star" text="Star" />
      <SpanBadge icon="heart" text="Heart" />
      <SpanBadge icon="lightbulb" text="Lightbulb" />
      <SpanBadge icon="magicwand" text="Magic Wand" />
      <SpanBadge icon="moon" text="Moon" />
      <SpanBadge icon="feedback" text="Feedback" />
      <SpanBadge icon="users" text="Users" />
      <SpanBadge icon="sparkle" text="Sparkle" />
    </div>
  ),
};

/**
 * Text-only variant (no icon).
 */
export const JustText: Story = {
  args: {
    variant: 'justText',
    text: 'No Icon',
  },
};

/**
 * Using children instead of text prop.
 */
export const WithChildren: Story = {
  args: {
    icon: 'sparkle',
    children: 'Custom Content',
  },
};

/**
 * Common use cases.
 */
export const UseCases: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <SpanBadge icon="star" text="Premium" />
      <SpanBadge icon="heart" text="Beliebt" />
      <SpanBadge icon="users" text="1.2k Teilnehmer" />
      <SpanBadge icon="lightbulb" text="Neu" />
      <SpanBadge icon="sparkle" text="Exklusiv" />
    </div>
  ),
};

/**
 * Different text lengths.
 */
export const TextLengths: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <SpanBadge icon="star" text="Hi" />
      <SpanBadge icon="heart" text="Medium Text" />
      <SpanBadge icon="users" text="A Longer Badge With More Content" />
    </div>
  ),
};
