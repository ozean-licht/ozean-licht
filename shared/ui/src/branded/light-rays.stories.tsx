import type { Meta, StoryObj } from '@storybook/react';
import { LightRays } from './light-rays';

/**
 * LightRays - Animated WebGL light rays background effect.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **WebGL Rendering**: High-performance shader-based animation
 * - **Oceanic Cyan Theme**: Default color matches Ozean Licht primary (#0ec2bc)
 * - **Mouse Interaction**: Rays follow mouse movement (optional)
 * - **Customizable Origin**: Rays can emanate from 8 different positions
 * - **Pulsating Animation**: Optional pulsing effect
 * - **Performance Optimized**: Uses Intersection Observer to only render when visible
 * - **Fully Customizable**: Speed, spread, length, color, and more
 *
 * ## Props
 * - **raysOrigin**: 'top-center' | 'top-left' | 'top-right' | 'right' | 'left' | 'bottom-center' | 'bottom-right' | 'bottom-left'
 * - **raysColor**: string - Hex color for rays (default: #0ec2bc)
 * - **raysSpeed**: number - Animation speed (default: 1)
 * - **lightSpread**: number - How much rays spread (default: 1)
 * - **rayLength**: number - Length of rays (default: 2)
 * - **pulsating**: boolean - Enable pulsing animation (default: false)
 * - **fadeDistance**: number - Fade distance (default: 1.0)
 * - **saturation**: number - Color saturation (default: 1.0)
 * - **followMouse**: boolean - Enable mouse tracking (default: true)
 * - **mouseInfluence**: number - How much mouse affects rays (default: 0.1)
 * - **noiseAmount**: number - Add noise texture (default: 0.0)
 * - **distortion**: number - Wave distortion (default: 0.0)
 * - **className**: string - Additional CSS classes
 *
 * ## Usage
 * Use as a background element in layouts, hero sections, or any area needing ambient lighting effects.
 * Perfect for creating depth and oceanic atmosphere in the Ozean Licht ecosystem.
 */
const meta = {
  title: 'Tier 2: Branded/LightRays',
  component: LightRays,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Animated WebGL light rays background with Ozean Licht oceanic cyan theme. High-performance shader-based effect with mouse interaction.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    raysOrigin: {
      control: 'select',
      options: ['top-center', 'top-left', 'top-right', 'right', 'left', 'bottom-center', 'bottom-right', 'bottom-left'],
      description: 'Origin point for light rays',
      table: {
        defaultValue: { summary: 'top-center' },
      },
    },
    raysColor: {
      control: 'color',
      description: 'Color of the light rays',
      table: {
        defaultValue: { summary: '#0ec2bc' },
      },
    },
    raysSpeed: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
      description: 'Animation speed',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    lightSpread: {
      control: { type: 'range', min: 0.1, max: 5, step: 0.1 },
      description: 'How much the rays spread',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    rayLength: {
      control: { type: 'range', min: 0.5, max: 5, step: 0.1 },
      description: 'Length of the rays',
      table: {
        defaultValue: { summary: '2' },
      },
    },
    pulsating: {
      control: 'boolean',
      description: 'Enable pulsating animation',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    fadeDistance: {
      control: { type: 'range', min: 0, max: 2, step: 0.1 },
      description: 'Fade distance',
      table: {
        defaultValue: { summary: '1.0' },
      },
    },
    saturation: {
      control: { type: 'range', min: 0, max: 2, step: 0.1 },
      description: 'Color saturation',
      table: {
        defaultValue: { summary: '1.0' },
      },
    },
    followMouse: {
      control: 'boolean',
      description: 'Enable mouse tracking',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    mouseInfluence: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'How much mouse affects rays',
      table: {
        defaultValue: { summary: '0.1' },
      },
    },
    noiseAmount: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Amount of noise texture',
      table: {
        defaultValue: { summary: '0.0' },
      },
    },
    distortion: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Wave distortion amount',
      table: {
        defaultValue: { summary: '0.0' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LightRays>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Ozean Licht light rays from top center.
 * Oceanic cyan color (#0ec2bc) with mouse interaction enabled.
 */
export const Default: Story = {
  args: {
    raysOrigin: 'top-center',
    raysColor: '#0ec2bc',
    raysSpeed: 1,
    lightSpread: 1,
    rayLength: 2,
    pulsating: false,
    fadeDistance: 1.0,
    saturation: 1.0,
    followMouse: true,
    mouseInfluence: 0.1,
    noiseAmount: 0.0,
    distortion: 0.0,
  },
};

/**
 * Pulsating rays with stronger glow effect.
 * Perfect for hero sections or attention-grabbing areas.
 */
export const Pulsating: Story = {
  args: {
    raysOrigin: 'top-center',
    raysColor: '#0ec2bc',
    raysSpeed: 1.5,
    lightSpread: 1.2,
    rayLength: 2.5,
    pulsating: true,
    fadeDistance: 1.2,
    saturation: 1.2,
    followMouse: true,
    mouseInfluence: 0.15,
  },
};

/**
 * Subtle background effect with reduced intensity.
 * Great for content-heavy pages where you need ambient lighting without distraction.
 */
export const Subtle: Story = {
  args: {
    raysOrigin: 'top-center',
    raysColor: '#0ec2bc',
    raysSpeed: 0.5,
    lightSpread: 0.8,
    rayLength: 1.5,
    pulsating: false,
    fadeDistance: 0.7,
    saturation: 0.6,
    followMouse: true,
    mouseInfluence: 0.05,
  },
};

/**
 * Bottom origin rays, creating underwater depth effect.
 * Perfect for footer sections or page bottoms.
 */
export const FromBottom: Story = {
  args: {
    raysOrigin: 'bottom-center',
    raysColor: '#0ec2bc',
    raysSpeed: 1,
    lightSpread: 1.5,
    rayLength: 2,
    pulsating: false,
    fadeDistance: 1.0,
    saturation: 1.0,
    followMouse: true,
    mouseInfluence: 0.1,
  },
};

/**
 * Corner rays from bottom-left.
 * Creates diagonal lighting effect.
 */
export const BottomLeft: Story = {
  args: {
    raysOrigin: 'bottom-left',
    raysColor: '#0ec2bc',
    raysSpeed: 1,
    lightSpread: 1,
    rayLength: 2.5,
    pulsating: false,
    fadeDistance: 1.0,
    saturation: 1.0,
    followMouse: true,
    mouseInfluence: 0.1,
  },
};

/**
 * Fast-moving rays with high energy.
 * Great for dynamic, interactive sections.
 */
export const FastEnergy: Story = {
  args: {
    raysOrigin: 'top-center',
    raysColor: '#0ec2bc',
    raysSpeed: 3,
    lightSpread: 1.5,
    rayLength: 3,
    pulsating: true,
    fadeDistance: 1.5,
    saturation: 1.3,
    followMouse: true,
    mouseInfluence: 0.2,
  },
};

/**
 * Rays with noise texture for organic feel.
 * Adds graininess for artistic effect.
 */
export const WithNoise: Story = {
  args: {
    raysOrigin: 'top-center',
    raysColor: '#0ec2bc',
    raysSpeed: 1,
    lightSpread: 1,
    rayLength: 2,
    pulsating: false,
    fadeDistance: 1.0,
    saturation: 1.0,
    followMouse: true,
    mouseInfluence: 0.1,
    noiseAmount: 0.3,
  },
};

/**
 * Distorted wavy rays.
 * Creates fluid, water-like movement perfect for Ozean Licht ocean theme.
 */
export const WavyDistortion: Story = {
  args: {
    raysOrigin: 'top-center',
    raysColor: '#0ec2bc',
    raysSpeed: 1,
    lightSpread: 1.2,
    rayLength: 2,
    pulsating: false,
    fadeDistance: 1.0,
    saturation: 1.0,
    followMouse: true,
    mouseInfluence: 0.1,
    distortion: 0.5,
  },
};

/**
 * Wide spread rays covering more area.
 * Perfect for full-page backgrounds.
 */
export const WideSpread: Story = {
  args: {
    raysOrigin: 'top-center',
    raysColor: '#0ec2bc',
    raysSpeed: 1,
    lightSpread: 3,
    rayLength: 2.5,
    pulsating: false,
    fadeDistance: 1.5,
    saturation: 1.0,
    followMouse: true,
    mouseInfluence: 0.15,
  },
};

/**
 * Static rays without mouse interaction.
 * Pure background ambiance without user interaction.
 */
export const Static: Story = {
  args: {
    raysOrigin: 'top-center',
    raysColor: '#0ec2bc',
    raysSpeed: 0.8,
    lightSpread: 1,
    rayLength: 2,
    pulsating: false,
    fadeDistance: 1.0,
    saturation: 1.0,
    followMouse: false,
    mouseInfluence: 0,
  },
};

/**
 * All rays origins preview.
 * Demonstrates all 8 possible origin points.
 */
export const AllOrigins: Story = {
  render: () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-8 bg-background">
      {(['top-center', 'top-left', 'top-right', 'right', 'left', 'bottom-center', 'bottom-right', 'bottom-left'] as const).map((origin) => (
        <div key={origin} className="relative h-64 border border-border rounded-lg overflow-hidden">
          <LightRays
            raysOrigin={origin}
            raysColor="#0ec2bc"
            raysSpeed={1}
            lightSpread={1.5}
            rayLength={2}
            followMouse={false}
          />
          <div className="absolute bottom-4 left-4 text-white/80 font-montserrat-alt text-sm">
            {origin}
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Hero section example with content overlay.
 * Shows how to use LightRays as a background with content on top.
 */
export const HeroSection: Story = {
  render: () => (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Background Light Rays */}
      <div className="absolute inset-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#0ec2bc"
          raysSpeed={1.2}
          lightSpread={1.5}
          rayLength={2.5}
          pulsating={true}
          followMouse={true}
          mouseInfluence={0.15}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="font-decorative text-6xl md:text-7xl text-white mb-6">
          Ozean Licht
        </h1>
        <p className="font-montserrat text-xl md:text-2xl text-white/80 max-w-2xl mb-8">
          Tauche ein in eine Welt voller Wissen und Erleuchtung
        </p>
        <button className="px-8 py-4 bg-primary text-white font-montserrat-alt rounded-lg hover:bg-primary/90 transition-colors">
          Jetzt Entdecken
        </button>
      </div>
    </div>
  ),
};
