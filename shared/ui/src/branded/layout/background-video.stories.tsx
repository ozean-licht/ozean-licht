'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { BackgroundVideo } from './background-video'

/**
 * # BackgroundVideo Component
 *
 * A fullscreen background component that supports video, image, and overlay modes.
 * Provides responsive media selection and customizable overlay effects for text readability.
 *
 * ## Features
 *
 * - **Multiple Display Modes** - Video, static image, or hidden
 * - **Responsive Media** - Separate desktop and mobile URLs for optimal performance
 * - **Smart Overlay System** - Configurable opacity and color for text readability
 * - **Poster Image Support** - Fallback image while video loads
 * - **Auto-play Video** - Smooth fade-in transition when video is ready
 * - **Vignette Effect** - Radial gradient overlay for aesthetic enhancement
 * - **Performance Optimized** - Fixed positioning with z-index management
 *
 * ## Layout Structure
 *
 * ```
 * ┌─────────────────────────────────────────┐
 * │    BackgroundVideo (fixed inset-0)      │
 * │  ┌─────────────────────────────────────┐│
 * │  │  Video/Image Content (z-0)          ││
 * │  └─────────────────────────────────────┘│
 * │  ┌─────────────────────────────────────┐│
 * │  │  Overlay Layer (rgba with opacity)  ││
 * │  └─────────────────────────────────────┘│
 * │  ┌─────────────────────────────────────┐│
 * │  │  Vignette Effect (radial gradient)  ││
 * │  └─────────────────────────────────────┘│
 * └─────────────────────────────────────────┘
 * ```
 */
const meta = {
  title: 'Tier 2: Branded/Layout/BackgroundVideo',
  component: BackgroundVideo,
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
          'Fullscreen background component supporting video playback, static images, and configurable overlays. Handles responsive media selection and provides fallback imagery for optimal UX.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['video', 'image', 'none'],
      description: 'Display mode: video playback, static image, or hidden',
      table: {
        defaultValue: { summary: 'video' },
      },
    },
    overlayOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Opacity of the overlay layer (0-1) for text readability',
      table: {
        defaultValue: { summary: '0.3' },
      },
    },
    overlayColor: {
      control: 'color',
      description: 'Color of the overlay layer (default: black)',
      table: {
        defaultValue: { summary: 'black' },
      },
    },
    desktopVideoUrl: {
      control: 'text',
      description: 'Desktop video URL (1920x1080)',
      table: {
        defaultValue: { summary: '/videos/electric-water-desktop.mp4' },
      },
    },
    mobileVideoUrl: {
      control: 'text',
      description: 'Mobile video URL (optimized for smaller screens)',
      table: {
        defaultValue: { summary: '/videos/electric-water-mobile.mp4' },
      },
    },
    desktopImageUrl: {
      control: 'text',
      description: 'Desktop image URL (for image mode)',
      table: {
        defaultValue: { summary: '/images/backgrounds/electric-water-desktop.webp' },
      },
    },
    mobileImageUrl: {
      control: 'text',
      description: 'Mobile image URL (for image mode)',
      table: {
        defaultValue: { summary: '/images/backgrounds/electric-water-mobile.webp' },
      },
    },
    posterImage: {
      control: 'text',
      description: 'Fallback image shown while video loads',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling',
    },
  },
} satisfies Meta<typeof BackgroundVideo>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default Video Mode - Primary background with video content
 *
 * Shows the typical video background with:
 * - Auto-playing ocean wave video
 * - Subtle overlay for text readability
 * - Responsive video selection based on viewport
 * - Smooth fade-in animation when loaded
 */
export const VideoMode: Story = {
  args: {
    mode: 'video',
    overlayOpacity: 0.3,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    posterImage: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen overflow-hidden">
        <Story />
        {/* Content overlay for visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Video Background</h1>
            <p className="text-xl text-white/80">Responsive video with overlay</p>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Image Mode - Static background image
 *
 * Demonstrates static image background:
 * - Fixed image display without video
 * - Responsive image selection
 * - Overlay applied for text contrast
 * - Lower bandwidth than video mode
 */
export const ImageMode: Story = {
  args: {
    mode: 'image',
    overlayOpacity: 0.35,
    overlayColor: 'black',
    desktopImageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop',
    mobileImageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen overflow-hidden">
        <Story />
        {/* Content overlay for visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Static Background</h1>
            <p className="text-xl text-white/80">Responsive image without video</p>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Hidden Mode - No background displayed
 *
 * Returns null when mode is 'none':
 * - Useful for content-focused pages
 * - Allows parent layout to set custom background
 * - Minimal component footprint
 */
export const HiddenMode: Story = {
  args: {
    mode: 'none',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#001a1a] to-[#00070F]">
        <Story />
        {/* Content overlay for visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Hidden Mode</h1>
            <p className="text-xl text-white/80">Component returns null, no background</p>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * No Overlay - Video with maximum visibility
 *
 * Video background with no overlay:
 * - overlayOpacity set to 0
 * - Full visibility of background content
 * - Only vignette effect applied
 * - Best for hero sections with readable text already present
 */
export const NoOverlay: Story = {
  args: {
    mode: 'video',
    overlayOpacity: 0,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen overflow-hidden">
        <Story />
        {/* Content overlay for visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">No Overlay</h1>
            <p className="text-xl text-white/80 drop-shadow">Full video visibility</p>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Light Overlay - Subtle darkening effect
 *
 * Light overlay configuration:
 * - overlayOpacity: 0.15 for minimal dimming
 * - Good for preserving video details
 * - Suitable for bright background content
 */
export const LightOverlay: Story = {
  args: {
    mode: 'video',
    overlayOpacity: 0.15,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen overflow-hidden">
        <Story />
        {/* Content overlay for visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Light Overlay</h1>
            <p className="text-xl text-white/80 drop-shadow">Opacity: 0.15</p>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Medium Overlay - Balanced text readability
 *
 * Recommended overlay configuration:
 * - overlayOpacity: 0.3 for optimal readability
 * - Good contrast for white text on backgrounds
 * - Default setting, best for most use cases
 */
export const MediumOverlay: Story = {
  args: {
    mode: 'video',
    overlayOpacity: 0.3,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen overflow-hidden">
        <Story />
        {/* Content overlay for visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Medium Overlay</h1>
            <p className="text-xl text-white/80">Opacity: 0.3 (Recommended)</p>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Dark Overlay - Strong text contrast
 *
 * Heavy overlay configuration:
 * - overlayOpacity: 0.6 for maximum contrast
 * - Ensures text legibility on any background
 * - Good for dense text content
 */
export const DarkOverlay: Story = {
  args: {
    mode: 'video',
    overlayOpacity: 0.6,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen overflow-hidden">
        <Story />
        {/* Content overlay for visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Dark Overlay</h1>
            <p className="text-xl text-white/80">Opacity: 0.6</p>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Blue Overlay - Colored overlay effect
 *
 * Custom color overlay:
 * - overlayColor: 'rgba(59, 130, 246, 0.5)' for blue tint
 * - Creates branded aesthetic
 * - Useful for themed sections
 */
export const BlueOverlay: Story = {
  args: {
    mode: 'video',
    overlayOpacity: 0.4,
    overlayColor: 'rgba(59, 130, 246, 1)',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen overflow-hidden">
        <Story />
        {/* Content overlay for visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Blue Overlay</h1>
            <p className="text-xl text-white/80">Custom color: rgba(59, 130, 246, 1)</p>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Cyan Overlay - Ozean Licht themed overlay
 *
 * Brand-themed overlay:
 * - overlayColor: 'rgba(0, 200, 200, 1)' for cyan/turquoise tint
 * - Aligns with Ozean Licht design system
 * - Creates spiritual, ocean-inspired aesthetic
 */
export const CyanOverlay: Story = {
  args: {
    mode: 'video',
    overlayOpacity: 0.35,
    overlayColor: 'rgba(0, 200, 200, 1)',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen overflow-hidden">
        <Story />
        {/* Content overlay for visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Cyan Overlay</h1>
            <p className="text-xl text-white/80">Ozean Licht brand color</p>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Purple Overlay - Spiritual theme
 *
 * Spiritual-themed overlay:
 * - overlayColor: 'rgba(147, 51, 234, 1)' for purple tint
 * - Enhances mystical atmosphere
 * - Good for meditation or transformation content
 */
export const PurpleOverlay: Story = {
  args: {
    mode: 'video',
    overlayOpacity: 0.35,
    overlayColor: 'rgba(147, 51, 234, 1)',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen overflow-hidden">
        <Story />
        {/* Content overlay for visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Purple Overlay</h1>
            <p className="text-xl text-white/80">Spiritual theme color</p>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * With Poster Image - Video loading fallback
 *
 * Demonstrates poster image functionality:
 * - posterImage shown while video loads
 * - Smooth fade-in when video is ready
 * - Improves perceived performance
 * - Better user experience during load
 */
export const WithPosterImage: Story = {
  args: {
    mode: 'video',
    overlayOpacity: 0.3,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    posterImage: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen overflow-hidden">
        <Story />
        {/* Content overlay for visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">With Poster Image</h1>
            <p className="text-xl text-white/80">Fallback shown while video loads</p>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Full Width Hero - Complete hero section layout
 *
 * Comprehensive hero implementation:
 * - Video background with overlay
 * - Responsive content on top
 * - Call-to-action buttons
 * - Deep integration with layout
 */
export const FullWidthHero: Story = {
  args: {
    mode: 'video',
    overlayOpacity: 0.4,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    posterImage: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen overflow-hidden">
        <Story />
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
          <div className="text-center max-w-2xl space-y-6">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
                Spirituelle Transformation
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                Entdecken Sie die tiefsten Wahrheiten der Existenz mit Ozean Licht
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="px-8 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors">
                Jetzt beginnen
              </button>
              <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                Mehr erfahren
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 flex flex-col items-center gap-2">
            <p className="text-white/70 text-sm">Scroll to explore</p>
            <div className="animate-bounce">
              <svg
                className="w-6 h-6 text-white/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Responsive Behavior - Shows adaptation across screen sizes
 *
 * Demonstrates responsive features:
 * - Mobile video URL for smaller screens
 * - Desktop video URL for larger screens
 * - Proper aspect ratio maintenance
 * - Smooth transitions between breakpoints
 */
export const ResponsiveBehavior: Story = {
  args: {
    mode: 'video',
    overlayOpacity: 0.3,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen overflow-hidden">
        <Story />
        {/* Content overlay for visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Responsive Background
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-4">
              Try resizing your browser to see media selection
            </p>
            <div className="bg-black/50 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-sm text-white/70">
                Desktop width ≥ 1024px: Uses desktop video URL
              </p>
              <p className="text-sm text-white/70 mt-2">
                Mobile width {'<'} 1024px: Uses mobile video URL
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Custom Styling - Component with additional CSS classes
 *
 * Shows className prop for custom styling:
 * - Additional Tailwind classes
 * - Custom animations
 * - Special effects
 * - Theme modifications
 */
export const CustomStyling: Story = {
  args: {
    mode: 'video',
    overlayOpacity: 0.3,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    className: 'opacity-90 blur-sm',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen overflow-hidden">
        <Story />
        {/* Content overlay for visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Custom Styling</h1>
            <p className="text-xl text-white/80">Applied: opacity-90 blur-sm</p>
          </div>
        </div>
      </div>
    ),
  ],
}
