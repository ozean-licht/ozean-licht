'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { BackgroundWaterRaysDesign } from './background-water-rays-design'

/**
 * # BackgroundWaterRaysDesign Component
 *
 * A full-width background component featuring water ray video effects with
 * responsive video sources and gradient overlays. Designed for the Ozean Licht
 * oceanic aesthetic with cyan accents and dark backgrounds.
 *
 * ## Features
 * - **Responsive Videos** - Desktop, tablet, and mobile optimized video sources
 * - **Gradient Overlays** - Multiple gradient layers for visual depth and effect control
 * - **Customizable Height** - Flexible height control via className or height prop
 * - **Autoplay with Fallback** - Video plays automatically with silent/muted support
 * - **Pointer Events None** - Allows interaction with content layered on top
 * - **Oceanic Design** - Cyan color scheme (#0ec2bc) with dark backgrounds
 *
 * ## Design System Context
 * - **Primary Color**: Oceanic Cyan (#0ec2bc)
 * - **Background**: Dark gradient (from #00070F to #001a1a)
 * - **Gradient Overlays**:
 *   - Main overlay: Fades from transparent to background with 30-90% opacity
 *   - Light rays: Subtle white gradient for luminous effect
 *
 * ## Usage
 *
 * ```tsx
 * // Default height (h-96)
 * <BackgroundWaterRaysDesign />
 *
 * // Custom height
 * <BackgroundWaterRaysDesign height="h-screen" />
 *
 * // With custom video URLs
 * <BackgroundWaterRaysDesign
 *   height="h-96"
 *   desktopVideoUrl="/videos/custom-desktop.mp4"
 *   tabletVideoUrl="/videos/custom-tablet.mp4"
 *   mobileVideoUrl="/videos/custom-mobile.mp4"
 * />
 *
 * // With additional styling
 * <BackgroundWaterRaysDesign
 *   height="h-96"
 *   className="rounded-lg overflow-hidden"
 * />
 * ```
 */
const meta = {
  title: 'Tier 2: Branded/Layout/BackgroundWaterRaysDesign',
  component: BackgroundWaterRaysDesign,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#00070F' },
        { name: 'light', value: '#FFFFFF' },
      ],
    },
    docs: {
      description: {
        component:
          'Full-width background component with water ray video effects, responsive video sources, and gradient overlays. Features Ozean Licht oceanic aesthetic with cyan accents.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: 'select',
      options: ['h-64', 'h-96', 'h-[600px]', 'h-screen'],
      description: 'CSS height class for the container',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'h-96' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the container',
      table: {
        type: { summary: 'string' },
      },
    },
    desktopVideoUrl: {
      control: 'text',
      description: 'Video URL for desktop screens (min-width: 1024px)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '/videos/background-water-effect-desktop.mp4' },
      },
    },
    tabletVideoUrl: {
      control: 'text',
      description: 'Video URL for tablet screens (min-width: 768px)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '/videos/background-water-effect-tablet.mp4' },
      },
    },
    mobileVideoUrl: {
      control: 'text',
      description: 'Video URL for mobile screens',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '/videos/background-water-effect-mobile.mp4' },
      },
    },
  },
} satisfies Meta<typeof BackgroundWaterRaysDesign>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default height with placeholder video URLs.
 *
 * Shows the component in its default state with h-96 height and the standard
 * gradient overlay effects. Demonstrates the water ray background with
 * oceanic cyan aesthetic.
 */
export const Default: Story = {
  args: {
    height: 'h-96',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
    tabletVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
  },
}

/**
 * Small height variant.
 *
 * Uses h-64 for a more compact background. Ideal for section dividers
 * or header backgrounds where vertical space is limited.
 */
export const SmallHeight: Story = {
  args: {
    height: 'h-64',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
    tabletVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
  },
}

/**
 * Full screen height variant.
 *
 * Uses h-screen for a full-viewport-height background. Perfect for hero sections,
 * landing pages, or dramatic visual presentations. Shows the full impact of the
 * water ray effect.
 */
export const FullScreen: Story = {
  args: {
    height: 'h-screen',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
    tabletVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
  },
}

/**
 * Custom height with arbitrary value.
 *
 * Uses h-[600px] to demonstrate custom height control. Shows how to apply
 * specific pixel values for precise layout requirements.
 */
export const CustomHeight: Story = {
  args: {
    height: 'h-[600px]',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
    tabletVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
  },
}

/**
 * With rounded corners and overflow hidden.
 *
 * Demonstrates additional styling using the className prop. Adds rounded corners
 * and ensures content respects the border radius. Useful for card-based layouts
 * or contained sections.
 */
export const WithRoundedCorners: Story = {
  args: {
    height: 'h-96',
    className: 'rounded-lg overflow-hidden shadow-lg',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
    tabletVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
  },
}

/**
 * With additional border styling.
 *
 * Shows how to add borders and other decorative elements using className.
 * Demonstrates the component's flexibility for integration into various
 * design layouts.
 */
export const WithBorder: Story = {
  args: {
    height: 'h-96',
    className: 'border-2 border-[#0ec2bc]/30 rounded-xl',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
    tabletVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4',
  },
}

/**
 * Interactive height selector.
 *
 * Fully interactive demonstration allowing users to switch between different
 * heights and see how the gradient overlays adapt. Shows real-time feedback
 * on height changes.
 */
export const InteractiveHeightSelector: Story = {
  render: () => {
    const heights = [
      { label: 'Small (h-64)', value: 'h-64' },
      { label: 'Medium (h-96)', value: 'h-96' },
      { label: 'Large (h-[600px])', value: 'h-[600px]' },
      { label: 'Full Screen (h-screen)', value: 'h-screen' },
    ]
    const [selectedHeight, setSelectedHeight] = useState<string>('h-96')

    return (
      <div className="space-y-6">
        {/* Controls */}
        <div className="bg-[#0A1A1A]/50 border border-[#0E282E] rounded-lg p-6 space-y-4">
          <h3 className="text-white font-semibold">Height Selector</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {heights.map((h) => (
              <button
                key={h.value}
                onClick={() => setSelectedHeight(h.value)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  selectedHeight === h.value
                    ? 'bg-[#0ec2bc] text-[#00070F]'
                    : 'bg-[#0E282E] text-white hover:bg-[#0E282E]/80'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-white/60 mt-2">Selected: {selectedHeight}</p>
        </div>

        {/* Preview */}
        <div className="relative">
          <BackgroundWaterRaysDesign
            height={selectedHeight}
            desktopVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
            tabletVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
            mobileVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
          />
        </div>
      </div>
    )
  },
}

/**
 * Responsive demonstration.
 *
 * Shows how the component behaves across different screen sizes with
 * different video sources loaded. Demonstrates the responsive video
 * source selection based on media queries.
 */
export const ResponsiveDemo: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Info Card */}
      <div className="bg-[#0A1A1A]/50 border border-[#0E282E] rounded-lg p-6 space-y-3">
        <h3 className="text-white font-semibold">Responsive Video Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-white/60 mb-1">Desktop</p>
            <p className="text-[#0ec2bc] text-xs break-all">(min-width: 1024px)</p>
          </div>
          <div>
            <p className="text-white/60 mb-1">Tablet</p>
            <p className="text-[#0ec2bc] text-xs break-all">(min-width: 768px)</p>
          </div>
          <div>
            <p className="text-white/60 mb-1">Mobile</p>
            <p className="text-[#0ec2bc] text-xs break-all">Default fallback</p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <BackgroundWaterRaysDesign
        height="h-96"
        desktopVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
        tabletVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
        mobileVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
      />

      {/* Resize hint */}
      <div className="text-xs text-white/50 text-center">
        Try resizing your browser window to see responsive video source switching
      </div>
    </div>
  ),
}

/**
 * Gradient overlay showcase.
 *
 * Highlights the gradient overlay effects that create depth and visual interest.
 * Shows how the main gradient (from-transparent to background) and light rays
 * effect work together.
 */
export const GradientOverlayShowcase: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Explanation */}
      <div className="bg-[#0A1A1A]/50 border border-[#0E282E] rounded-lg p-6 space-y-4">
        <h3 className="text-white font-semibold">Gradient Overlay Effects</h3>
        <div className="space-y-3 text-sm">
          <div className="space-y-1">
            <p className="text-[#0ec2bc]">Primary Gradient</p>
            <p className="text-white/70">
              bg-gradient-to-b from-transparent via-background/30 to-background/90
            </p>
            <p className="text-white/50 text-xs">
              Fades video from top to bottom, creating visual hierarchy and ensuring text readability
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[#0ec2bc]">Light Rays Effect</p>
            <p className="text-white/70">
              bg-gradient-to-br from-white/8 via-transparent to-transparent
            </p>
            <p className="text-white/50 text-xs">
              Subtle diagonal gradient adding luminous quality and depth perception
            </p>
          </div>
        </div>
      </div>

      {/* Main Preview */}
      <BackgroundWaterRaysDesign
        height="h-96"
        desktopVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
        tabletVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
        mobileVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
      />
    </div>
  ),
}

/**
 * Hero section integration example.
 *
 * Shows how the background component integrates with content overlays.
 * Demonstrates the pointer-events-none property allowing interactive
 * content to appear on top of the background.
 */
export const HeroSectionIntegration: Story = {
  render: () => (
    <div className="relative">
      <BackgroundWaterRaysDesign
        height="h-96"
        desktopVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
        tabletVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
        mobileVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-4 pointer-events-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Oceanic Transformation
          </h1>
          <p className="text-[#0ec2bc] text-lg md:text-xl max-w-2xl mx-auto">
            Experience the power of water energy and oceanic wisdom
          </p>
          <button className="mt-6 px-8 py-3 bg-[#0ec2bc] text-[#00070F] rounded-lg font-semibold hover:bg-[#0ec2bc]/80 transition-colors">
            Explore Now
          </button>
        </div>
      </div>
    </div>
  ),
}

/**
 * Multiple sections with different heights.
 *
 * Demonstrates using the component in different contexts with varying heights.
 * Shows how the component adapts to different layout requirements while
 * maintaining visual consistency.
 */
export const MultiSectionLayout: Story = {
  render: () => (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative">
        <h2 className="text-2xl font-bold text-white mb-4">Hero Section (Full Height)</h2>
        <BackgroundWaterRaysDesign
          height="h-96"
          desktopVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
          tabletVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
          mobileVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
        />
      </div>

      {/* Content Section */}
      <div className="bg-[#0A1A1A]/30 p-8 rounded-lg border border-[#0E282E]">
        <h3 className="text-white text-lg font-semibold mb-2">Content Section</h3>
        <p className="text-white/70">
          Content can flow naturally between background sections. The pointer-events-none
          property ensures the background doesn't interfere with interactive elements.
        </p>
      </div>

      {/* Divider Section */}
      <div className="relative">
        <h2 className="text-2xl font-bold text-white mb-4">Divider Section (Compact)</h2>
        <BackgroundWaterRaysDesign
          height="h-64"
          className="rounded-lg overflow-hidden"
          desktopVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
          tabletVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
          mobileVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
        />
      </div>

      {/* Bottom Content */}
      <div className="bg-[#0A1A1A]/30 p-8 rounded-lg border border-[#0E282E]">
        <h3 className="text-white text-lg font-semibold mb-2">Footer Content Section</h3>
        <p className="text-white/70">
          Multiple background sections can be used throughout a page to create visual breaks
          and maintain the oceanic aesthetic.
        </p>
      </div>
    </div>
  ),
}

/**
 * Ocean-themed section example.
 *
 * Showcases the component in an oceanic context with water droplet icons
 * and cyan accent colors that match the Ozean Licht design system.
 */
export const OceanThemedSection: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="relative">
        <BackgroundWaterRaysDesign
          height="h-[500px]"
          className="rounded-xl overflow-hidden"
          desktopVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
          tabletVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
          mobileVideoUrl="https://videos.pexels.com/video-files/3045163/3045163-hd_1280_720_25fps.mp4"
        />

        {/* Centered Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center space-y-6 pointer-events-auto">
            <div className="flex justify-center">
              <div className="text-5xl">💧</div>
            </div>
            <h2 className="text-3xl font-bold text-white">Water Ray Energy</h2>
            <p className="text-[#0ec2bc] max-w-md text-sm">
              Harness the transformative power of oceanic energy rays
            </p>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="bg-gradient-to-r from-[#0ec2bc]/10 to-transparent border border-[#0ec2bc]/30 rounded-lg p-6 space-y-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <span className="text-[#0ec2bc]">✦</span> About Water Ray Energy
        </h3>
        <p className="text-white/70 text-sm">
          The water rays represent the flow of oceanic consciousness and energetic transformation.
          This visual element is central to the Ozean Licht platform's identity and spiritual message.
        </p>
      </div>
    </div>
  ),
}
