import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { CtaButton } from './cta-button';
import { Sparkles, ArrowRight, Star } from 'lucide-react';

/**
 * CtaButton - Gradient CTA button with animated hover effect.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan gradient theme.
 *
 * ## Features
 * - **Gradient Background**: from-primary via-primary/80 to-primary
 * - **Animated Hover**: Gradient reverses direction on hover
 * - **Border with Glow**: 2px border with primary/50 opacity
 * - **Large & Rounded**: px-8, py-[22px], rounded-full
 * - **Shadow Effects**: shadow-lg with hover:shadow-xl
 * - **Montserrat Alternates Font**: Brand alternate font
 *
 * ## Usage
 * Use for high-priority CTAs, special offers, and premium actions that need maximum visual impact.
 * More prominent than PrimaryButton due to gradient effect.
 */
const meta = {
  title: 'Tier 2: Branded/CtaButton',
  component: CtaButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A high-impact CTA button with animated gradient background and border glow effect.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable button',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Button HTML type',
      table: {
        defaultValue: { summary: 'button' },
      },
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof CtaButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default gradient CTA button.
 */
export const Default: Story = {
  args: {
    children: 'Jetzt Kaufen',
  },
};

/**
 * With icons.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CtaButton>
        <Sparkles className="h-5 w-5" />
        Zugang Erhalten
      </CtaButton>
      <CtaButton>
        Jetzt Starten
        <ArrowRight className="h-5 w-5" />
      </CtaButton>
      <CtaButton>
        <Star className="h-5 w-5" />
        Zur Akademie
        <Star className="h-5 w-5" />
      </CtaButton>
    </div>
  ),
};

/**
 * Disabled state.
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled CTA',
    disabled: true,
  },
};

/**
 * Common use cases for high-priority actions.
 */
export const UseCases: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CtaButton>Jetzt Kaufen €99</CtaButton>
      <CtaButton>
        <Sparkles className="h-5 w-5" />
        Jetzt Einsteigen
      </CtaButton>
      <CtaButton>Mitgliedschaft Starten</CtaButton>
      <CtaButton>
        Sofort Zugang
        <ArrowRight className="h-5 w-5" />
      </CtaButton>
    </div>
  ),
};

/**
 * Custom sizes with className override.
 */
export const CustomSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <CtaButton className="px-6 py-3 text-sm">Kompakt</CtaButton>
      <CtaButton>Standard</CtaButton>
      <CtaButton className="px-12 py-6 text-xl">Groß</CtaButton>
    </div>
  ),
};

/**
 * Full width button.
 */
export const FullWidth: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <CtaButton className="w-full">
        Jetzt Anmelden - Kostenlos Testen
      </CtaButton>
    </div>
  ),
};

/**
 * Comparison with PrimaryButton.
 */
export const ComparisonWithPrimary: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">CtaButton (Gradient):</p>
        <CtaButton>Wichtige Aktion</CtaButton>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Note: For standard primary button without gradient, use PrimaryButton component</p>
      </div>
    </div>
  ),
};
