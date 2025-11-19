import type { Meta, StoryObj } from '@storybook/react';
import SpanDesign from './span-design';

/**
 * SpanDesign - Decorative text element with accent images.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **Decorative Accents**: Left and right decorative images (mirrored)
 * - **Turquoise Text**: Primary color (#0ec2bc) text
 * - **Montserrat Alternates Font**: Uses brand alternate font
 * - **Centered Layout**: Flexbox layout with gap spacing
 *
 * ## Usage
 * Use for section titles, highlights, or decorative text elements that need emphasis with Ozean Licht branding.
 * Decorative accent images are placeholders - replace with actual brand assets.
 */
const meta = {
  title: 'Tier 2: Branded/SpanDesign',
  component: SpanDesign,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A decorative text element with mirrored accent images on both sides, styled with Ozean Licht primary color.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Text content to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof SpanDesign>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default decorative text.
 */
export const Default: Story = {
  args: {
    children: 'Ozean Licht',
  },
};

/**
 * Section title example.
 */
export const SectionTitle: Story = {
  args: {
    children: 'Unsere Kurse',
  },
};

/**
 * Short text.
 */
export const ShortText: Story = {
  args: {
    children: 'Neu',
  },
};

/**
 * Longer text.
 */
export const LongerText: Story = {
  args: {
    children: 'Entdecke Deine Spirituelle Reise',
  },
};

/**
 * With custom styling.
 */
export const CustomStyling: Story = {
  args: {
    children: 'Große Schrift',
    className: 'text-2xl',
  },
};

/**
 * Common use cases.
 */
export const UseCases: Story = {
  render: () => (
    <div className="flex flex-col gap-8 items-center">
      <SpanDesign>Willkommen</SpanDesign>
      <SpanDesign>Über Uns</SpanDesign>
      <SpanDesign>Unsere Mission</SpanDesign>
      <SpanDesign>Kontakt</SpanDesign>
    </div>
  ),
};

/**
 * In dark background context.
 */
export const OnDarkBackground: Story = {
  render: () => (
    <div className="bg-background p-8 rounded-lg">
      <SpanDesign>Text on Dark Background</SpanDesign>
    </div>
  ),
};
