'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { UniversalVideoPlayer } from './universal-video-player'

/**
 * # UniversalVideoPlayer Component
 *
 * A versatile video player component that supports both YouTube and Vimeo videos
 * with custom controls, keyboard shortcuts, and callback functions.
 *
 * ## Features
 *
 * - **Multi-Platform Support** - YouTube and Vimeo videos with automatic detection
 * - **Custom Controls** - Play/pause, volume, progress bar, fullscreen, skip controls
 * - **Keyboard Shortcuts** - Space/K (play/pause), M (mute), F (fullscreen), Arrow keys (skip)
 * - **Mobile & Desktop** - Responsive controls optimized for different screen sizes
 * - **Callbacks** - onTimeUpdate for progress tracking, onEnded for completion
 * - **Auto-hide Controls** - Controls fade out during playback, reappear on interaction
 * - **Progress Tracking** - Real-time video progress with formatted time display
 *
 * ## Keyboard Shortcuts
 *
 * | Key | Action |
 * |-----|--------|
 * | Space / K | Play/Pause |
 * | M | Mute/Unmute |
 * | F | Toggle Fullscreen |
 * | Arrow Right | Skip forward 10 seconds |
 * | Arrow Left | Skip backward 10 seconds |
 *
 * ## Platform Detection
 *
 * The component automatically detects the video platform from the URL:
 * - **YouTube** - Patterns: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
 * - **Vimeo** - Pattern: vimeo.com/[video-id]
 * - **Unknown** - Shows error state for invalid URLs
 *
 * ## Layout Structure
 *
 * ```
 * ┌─────────────────────────────────┐
 * │  IFrame (YouTube/Vimeo)         │
 * ├─────────────────────────────────┤
 * │  Title Overlay (top gradient)   │
 * │  Platform badge                 │
 * ├─────────────────────────────────┤
 * │                                 │
 * │  Play Button Overlay (centered) │
 * │                                 │
 * ├─────────────────────────────────┤
 * │  Progress Bar                   │
 * │  Control Buttons & Time Display │
 * │  (Bottom gradient)              │
 * └─────────────────────────────────┘
 * ```
 */
const meta = {
  title: 'Tier 2: Branded/Video/UniversalVideoPlayer',
  component: UniversalVideoPlayer,
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
          'Versatile video player supporting YouTube and Vimeo with custom controls, keyboard shortcuts, and callbacks for progress tracking. Responsive design with auto-hiding controls and fullscreen support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    url: {
      control: 'text',
      description: 'YouTube or Vimeo video URL',
      table: {
        type: { summary: 'string' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional video title displayed in overlay',
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the container',
      table: {
        type: { summary: 'string' },
      },
    },
    onTimeUpdate: {
      description: 'Callback fired when video time updates (currentTime in seconds)',
      table: {
        type: { summary: '(currentTime: number) => void' },
      },
    },
    onEnded: {
      description: 'Callback fired when video finishes playing',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
} satisfies Meta<typeof UniversalVideoPlayer>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default YouTube Video - Standard player with YouTube content
 *
 * Shows the typical player setup with:
 * - YouTube video in fullscreen-ready container
 * - Default controls hidden until interaction
 * - Play button overlay centered
 * - Auto-hide controls during playback
 */
export const YouTubeDefault: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  decorators: [
    (Story: any) => (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full h-full">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * YouTube with Title - Video player with displayed title
 *
 * Demonstrates title overlay functionality:
 * - Video title displayed at top
 * - Platform badge (YouTube)
 * - Title fades out with controls during playback
 * - Gradient overlay for text readability
 */
export const YouTubeWithTitle: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up - Official Music Video',
  },
  decorators: [
    (Story: any) => (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full h-full">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * Vimeo Default - Vimeo video with standard controls
 *
 * Shows Vimeo platform integration:
 * - Vimeo video detection and initialization
 * - Same control features as YouTube
 * - Platform-specific API integration
 */
export const VimeoDefault: Story = {
  args: {
    url: 'https://vimeo.com/148751763',
  },
  decorators: [
    (Story: any) => (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full h-full">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * Vimeo with Title - Vimeo video with title overlay
 *
 * Demonstrates Vimeo integration with title:
 * - Vimeo video with custom title
 * - Platform badge shows "vimeo"
 * - Same responsive controls as YouTube
 */
export const VimeoWithTitle: Story = {
  args: {
    url: 'https://vimeo.com/148751763',
    title: 'Beautiful Ocean Waves - Nature Documentary',
  },
  decorators: [
    (Story: any) => (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full h-full">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * Invalid URL - Error state for unsupported URLs
 *
 * Shows error handling:
 * - Invalid or unsupported URL displays error message
 * - Graceful fallback UI
 * - Black background with centered error text
 */
export const InvalidURL: Story = {
  args: {
    url: 'https://example.com/invalid-video',
    title: 'This URL will fail',
  },
  decorators: [
    (Story: any) => (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full h-full">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * With Time Update Callback - Video progress tracking
 *
 * Demonstrates onTimeUpdate callback:
 * - Displays current playback time
 * - Updates in real-time as video plays
 * - Shows seconds elapsed since play started
 * - Useful for analytics and progress tracking
 */
export const WithTimeUpdateCallback: Story = {
  render: (args: any) => {
    const [currentTime, setCurrentTime] = useState<number>(0)

    return (
      <div className="relative w-full bg-black">
        <div className="relative w-full h-screen flex items-center justify-center">
          <div className="w-full h-full">
            <UniversalVideoPlayer
              {...args}
              onTimeUpdate={(time) => setCurrentTime(time)}
            />
          </div>
        </div>

        {/* Time Display Overlay */}
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg z-30">
          <p className="text-white text-sm font-medium">
            Current Time: {currentTime.toFixed(2)}s
          </p>
        </div>
      </div>
    )
  },
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Time Update Callback Demo',
  },
}

/**
 * With Ended Callback - Video completion tracking
 *
 * Demonstrates onEnded callback:
 * - Shows message when video finishes
 * - Tracks completion events
 * - Useful for quiz triggers or next-video recommendations
 */
export const WithEndedCallback: Story = {
  render: (args: any) => {
    const [hasEnded, setHasEnded] = useState<boolean>(false)

    return (
      <div className="relative w-full bg-black">
        <div className="relative w-full h-screen flex items-center justify-center">
          <div className="w-full h-full">
            <UniversalVideoPlayer
              {...args}
              onEnded={() => setHasEnded(true)}
            />
          </div>
        </div>

        {/* Completion Message */}
        {hasEnded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-40">
            <div className="bg-black/90 border border-primary/30 rounded-lg p-8 text-center max-w-md">
              <h2 className="text-2xl font-bold text-white mb-4">
                Video Completed!
              </h2>
              <p className="text-white/80 mb-6">
                The onEnded callback has been triggered.
              </p>
              <button
                onClick={() => setHasEnded(false)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    )
  },
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Watch to the end - Callback Demo',
  },
}

/**
 * Aspect Ratio 16:9 - Widescreen format
 *
 * Shows standard widescreen container:
 * - 16:9 aspect ratio (standard for most videos)
 * - Centered in container with padding
 * - Responsive sizing
 */
export const AspectRatio16by9: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Aspect Ratio 16:9 - Widescreen',
  },
  decorators: [
    (Story: any) => (
      <div className="bg-black min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <div className="absolute inset-0">
              <Story />
            </div>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Aspect Ratio 4:3 - Classic format
 *
 * Shows classic screen format:
 * - 4:3 aspect ratio (older TV standard)
 * - Centered with clear boundaries
 * - Useful for archival or educational content
 */
export const AspectRatio4by3: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Aspect Ratio 4:3 - Classic Format',
  },
  decorators: [
    (Story: any) => (
      <div className="bg-black min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '75%' }}>
            <div className="absolute inset-0">
              <Story />
            </div>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Aspect Ratio 1:1 - Square format
 *
 * Shows square container:
 * - 1:1 aspect ratio (social media format)
 * - Perfect for Instagram, TikTok-style embedding
 * - Useful for preview thumbnails
 */
export const AspectRatio1by1: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Aspect Ratio 1:1 - Square Format',
  },
  decorators: [
    (Story: any) => (
      <div className="bg-black min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '100%' }}>
            <div className="absolute inset-0">
              <Story />
            </div>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Fullscreen Ready - Container ready for fullscreen
 *
 * Shows fullscreen-optimized container:
 * - Full viewport height
 * - Full viewport width
 * - Press 'F' to toggle fullscreen
 * - Mobile responsive controls
 */
export const FullscreenReady: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Press F to Toggle Fullscreen',
  },
  decorators: [
    (Story: any) => (
      <div className="relative w-full h-screen bg-black">
        <Story />
        <div className="absolute top-4 left-4 bg-black/70 px-3 py-2 rounded text-white text-sm z-20">
          Press F for fullscreen
        </div>
      </div>
    ),
  ],
}

/**
 * Small Embedded Player - Sidebar or card container
 *
 * Shows compact player for embedded scenarios:
 * - Fixed dimensions (e.g., in sidebar)
 * - All controls still functional
 * - Mobile-optimized responsive behavior
 */
export const SmallEmbeddedPlayer: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Embedded Video',
  },
  decorators: [
    (Story: any) => (
      <div className="bg-gray-900 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content area */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-white mb-4">Course Content</h1>
              <div className="bg-black/40 rounded-lg p-6 text-white/80 space-y-4">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
            </div>

            {/* Sidebar with embedded player */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-black/50 rounded-lg overflow-hidden border border-primary/20">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute inset-0">
                    <Story />
                  </div>
                </div>
              </div>
              <div className="bg-black/40 rounded-lg p-4 text-white/80 text-sm">
                <h3 className="font-semibold text-white mb-2">Now Playing</h3>
                <p>Featured video in sidebar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Controls Showcase - Interactive demo of all controls
 *
 * Comprehensive controls demonstration:
 * - Play/Pause button (Space/K)
 * - Volume control with mute toggle (M)
 * - Progress bar with seek
 * - Skip forward/backward (Arrow keys)
 * - Fullscreen toggle (F)
 * - Time display with duration
 * - Keyboard shortcuts guide
 */
export const ControlsShowcase: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Interactive Controls Showcase',
  },
  decorators: [
    (Story: any) => (
      <div className="relative w-full bg-black">
        <div className="relative w-full h-screen flex items-center justify-center">
          <div className="w-full h-full">
            <Story />
          </div>
        </div>

        {/* Keyboard Shortcuts Guide */}
        <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-primary/30 z-20 max-w-sm">
          <h3 className="text-white font-semibold mb-3 text-sm">Keyboard Shortcuts</h3>
          <div className="text-white/80 text-xs space-y-2">
            <div className="flex justify-between">
              <span>Space / K</span>
              <span className="text-primary">Play/Pause</span>
            </div>
            <div className="flex justify-between">
              <span>M</span>
              <span className="text-primary">Mute/Unmute</span>
            </div>
            <div className="flex justify-between">
              <span>F</span>
              <span className="text-primary">Fullscreen</span>
            </div>
            <div className="flex justify-between">
              <span>← / →</span>
              <span className="text-primary">Skip ±10s</span>
            </div>
          </div>
        </div>

        {/* Control Tips */}
        <div className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-primary/30 z-20 max-w-sm">
          <h3 className="text-white font-semibold mb-2 text-sm">Control Tips</h3>
          <ul className="text-white/80 text-xs space-y-1">
            <li>• Hover/Move mouse to show controls</li>
            <li>• Click progress bar to seek</li>
            <li>• Drag volume slider to adjust</li>
            <li>• Controls auto-hide after 3 seconds</li>
          </ul>
        </div>
      </div>
    ),
  ],
}

/**
 * Multiple Variants - Side-by-side comparison
 *
 * Shows different video sources simultaneously:
 * - YouTube and Vimeo side-by-side
 * - With and without titles
 * - Demonstrates platform differences
 * - Useful for testing and comparison
 */
export const MultipleVariants: Story = {
  render: () => (
    <div className="bg-black min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Video Platform Comparison</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* YouTube */}
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-primary/20">
              <h2 className="text-xl font-semibold text-white mb-3">YouTube Video</h2>
              <div className="relative w-full bg-black rounded overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0">
                  <UniversalVideoPlayer
                    url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    title="YouTube Platform Test"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vimeo */}
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-primary/20">
              <h2 className="text-xl font-semibold text-white mb-3">Vimeo Video</h2>
              <div className="relative w-full bg-black rounded overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0">
                  <UniversalVideoPlayer
                    url="https://vimeo.com/148751763"
                    title="Vimeo Platform Test"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mt-12 bg-white/5 rounded-lg p-6 border border-primary/20">
          <h2 className="text-2xl font-semibold text-white mb-6">Supported Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-white/80 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-primary text-lg">✓</span>
              <span>Play/Pause Controls</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-lg">✓</span>
              <span>Volume Control & Mute</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-lg">✓</span>
              <span>Progress Bar & Seek</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-lg">✓</span>
              <span>Skip Forward/Backward</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-lg">✓</span>
              <span>Fullscreen Toggle</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-lg">✓</span>
              <span>Time Display & Duration</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-lg">✓</span>
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-lg">✓</span>
              <span>onTimeUpdate Callback</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-lg">✓</span>
              <span>onEnded Callback</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Responsive Behavior - Shows adaptation across screen sizes
 *
 * Demonstrates responsive features:
 * - Desktop: Full controls with skip buttons
 * - Mobile: Compact controls with essential buttons
 * - Automatic control switching based on viewport
 * - Try resizing your browser to see behavior change
 */
export const ResponsiveBehavior: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Responsive Controls Demo - Try Resizing',
  },
  decorators: [
    (Story: any) => (
      <div className="bg-black min-h-screen">
        <div className="relative w-full h-screen flex items-center justify-center">
          <div className="w-full h-full">
            <Story />
          </div>
        </div>

        {/* Responsive Info */}
        <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-primary/30 z-20 max-w-xs text-white/80 text-xs">
          <p className="font-semibold text-white mb-2">Responsive Behavior</p>
          <p className="hidden md:block text-green-400 text-xs">
            ✓ Desktop: Full controls visible
          </p>
          <p className="md:hidden text-blue-400 text-xs">
            ✓ Mobile: Compact controls
          </p>
          <p className="text-white/70 text-xs mt-2">
            Resize your browser to see changes
          </p>
        </div>
      </div>
    ),
  ],
}

/**
 * Loading State - Video initialization
 *
 * Shows loading overlay during video initialization:
 * - "Loading video..." message appears until ready
 * - Smooth fade-in of controls once loaded
 * - Player is ready when play button appears
 * - YouTube and Vimeo APIs load asynchronously
 */
export const LoadingState: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Watch for Loading State',
  },
  decorators: [
    (Story: any) => (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full h-full">
          <Story />
        </div>

        {/* Info */}
        <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-sm px-4 py-2 rounded text-white/80 text-sm z-20">
          Loading overlay appears briefly during video initialization
        </div>
      </div>
    ),
  ],
}
