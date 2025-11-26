/**
 * Vortex Component - Storybook Stories
 *
 * Animated particle vortex effect from MagicUI.
 * Creates a mesmerizing particle animation perfect for hero sections and backgrounds.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Vortex } from './vortex'

const meta = {
  title: 'Tier 1: Primitives/MagicUI/Vortex',
  component: Vortex,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Animated particle vortex effect that creates a dynamic, flowing background using simplex noise and canvas rendering. Perfect for hero sections and attention-grabbing backgrounds. Component has transparent background - style the container as needed.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Content to display on top of the vortex effect',
    },
    className: {
      control: 'text',
      description: 'Additional classes for the content container (z-10)',
    },
    containerClassName: {
      control: 'text',
      description: 'Additional classes for the outer container',
    },
    particleCount: {
      control: { type: 'number', min: 100, max: 2000, step: 100 },
      description: 'Number of particles in the vortex',
    },
    rangeY: {
      control: { type: 'number', min: 50, max: 500, step: 50 },
      description: 'Vertical range for particle spawning',
    },
    baseHue: {
      control: { type: 'number', min: 0, max: 360, step: 10 },
      description: 'Base hue color for particles (0-360)',
    },
    baseSpeed: {
      control: { type: 'number', min: 0, max: 2, step: 0.1 },
      description: 'Base movement speed of particles',
    },
    rangeSpeed: {
      control: { type: 'number', min: 0, max: 3, step: 0.1 },
      description: 'Speed variation range',
    },
    baseRadius: {
      control: { type: 'number', min: 0.5, max: 5, step: 0.5 },
      description: 'Base radius of particles',
    },
    rangeRadius: {
      control: { type: 'number', min: 0.5, max: 5, step: 0.5 },
      description: 'Radius variation range',
    },
  },
} satisfies Meta<typeof Vortex>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default Vortex with oceanic cyan particles
 */
export const Default: Story = {
  args: {
    particleCount: 700,
    rangeY: 100,
    baseHue: 175, // Oceanic cyan
    baseSpeed: 0.0,
    rangeSpeed: 1.5,
    baseRadius: 1,
    rangeRadius: 2,
    containerClassName: 'h-screen bg-background',
    className: '',
    children: (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="font-decorative text-5xl md:text-7xl text-white mb-4">
          Vortex Effect
        </h1>
        <p className="text-xl md:text-2xl text-[#C4C8D4] max-w-2xl">
          Flowing particle animation
        </p>
      </div>
    ),
  },
}

/**
 * Purple theme variation
 */
export const PurpleTheme: Story = {
  args: {
    particleCount: 800,
    rangeY: 100,
    baseHue: 270, // Purple
    baseSpeed: 0.2,
    rangeSpeed: 1.5,
    baseRadius: 1.5,
    rangeRadius: 2,
    containerClassName: 'h-screen bg-[#0A0F1A]',
    children: (
      <div className="flex items-center justify-center h-full">
        <h1 className="font-decorative text-6xl text-white">Purple Vortex</h1>
      </div>
    ),
  },
}

/**
 * Minimal - Low particle count for subtle effect
 */
export const Minimal: Story = {
  args: {
    particleCount: 200,
    rangeY: 80,
    baseHue: 175,
    baseSpeed: 0.0,
    rangeSpeed: 1.0,
    baseRadius: 2,
    rangeRadius: 3,
    containerClassName: 'h-screen bg-background',
    children: (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="font-decorative text-5xl text-white mb-2">Subtle</h1>
          <p className="text-[#C4C8D4]">Less is more</p>
        </div>
      </div>
    ),
  },
}

/**
 * Intense - High particle count for dramatic effect
 */
export const Intense: Story = {
  args: {
    particleCount: 1500,
    rangeY: 150,
    baseHue: 175,
    baseSpeed: 0.3,
    rangeSpeed: 2.0,
    baseRadius: 0.5,
    rangeRadius: 2,
    containerClassName: 'h-screen bg-background',
    children: (
      <div className="flex items-center justify-center h-full">
        <div className="glass-card-strong rounded-2xl p-12 text-center">
          <h1 className="font-decorative text-6xl text-white mb-4">Intense</h1>
          <p className="text-[#C4C8D4] text-xl">
            Maximum particle density
          </p>
        </div>
      </div>
    ),
  },
}
