import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedGradientText } from './animated-gradient-text';
import { ChevronRight } from 'lucide-react';

/**
 * AnimatedGradientText - Animated gradient text effect from MagicUI.
 *
 * **MagicUI Component** - Imported from https://magicui.design/docs/components/animated-gradient-text
 *
 * ## Features
 * - Animated gradient background
 * - Customizable colors and speed
 * - Clean, simple API
 * - Two states: with icon or without icon
 */
const meta = {
  title: 'Tier 1: Primitives/MagicUI/AnimatedGradientText',
  component: AnimatedGradientText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Animated gradient text effect. Keep it simple - use with or without an icon.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    speed: {
      control: { type: 'range', min: 0.1, max: 5, step: 0.1 },
      description: 'Animation speed multiplier',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    colorFrom: {
      control: 'color',
      description: 'Starting gradient color',
      table: {
        defaultValue: { summary: '#ffaa40' },
      },
    },
    colorTo: {
      control: 'color',
      description: 'Ending gradient color',
      table: {
        defaultValue: { summary: '#9c40ff' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-12 bg-background rounded-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AnimatedGradientText>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Without icon - Simple text only in a bordered badge with animated gradient border
 */
export const WithoutIcon: Story = {
  render: () => (
    <div
      className="relative inline-flex items-center justify-center rounded-full bg-white/5 px-4 py-2 backdrop-blur-sm"
      style={{ '--bg-size': '300%' } as React.CSSProperties}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] p-[1px] animate-gradient">
        <div className="h-full w-full rounded-full bg-background" />
      </div>
      <div className="relative z-10">
        <AnimatedGradientText>
          Introducing Magic UI
        </AnimatedGradientText>
      </div>
    </div>
  ),
};

/**
 * With icon - Text with a trailing icon in a bordered badge with animated gradient border
 */
export const WithIcon: Story = {
  render: () => (
    <div
      className="relative inline-flex items-center justify-center gap-2 rounded-full bg-white/5 px-4 py-2 backdrop-blur-sm"
      style={{ '--bg-size': '300%' } as React.CSSProperties}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] p-[1px] animate-gradient">
        <div className="h-full w-full rounded-full bg-background" />
      </div>
      <div className="relative z-10 flex items-center gap-2">
        <AnimatedGradientText>
          🎉 Introducing Magic UI
        </AnimatedGradientText>
        <ChevronRight className="w-3 h-3 text-white/50" />
      </div>
    </div>
  ),
};
