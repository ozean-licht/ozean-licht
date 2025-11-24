'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VideoPlayer, type VideoPlayerProps } from './video-player'

/**
 * # VideoPlayer Component
 *
 * A fully-featured HTML5 video player with glassmorphic controls, keyboard shortcuts, and responsive design.
 * Perfect for streaming educational content, spiritual teachings, and multimedia experiences.
 *
 * ## Features
 *
 * - **Full Playback Controls** - Play, pause, volume, mute, fullscreen
 * - **Progress Tracking** - Seek bar with buffering visualization and time display
 * - **Keyboard Shortcuts** - Intuitive shortcuts for accessibility and quick navigation
 * - **Responsive Design** - Mobile-optimized controls, adapts to screen size
 * - **Auto-hiding Controls** - Controls fade when playing, show on mouse movement
 * - **Title Display** - Optional gradient overlay with video title
 * - **Callbacks** - onTimeUpdate and onEnded for state synchronization
 * - **Buffering Visualization** - Shows download progress separate from playback
 *
 * ## Keyboard Shortcuts
 *
 * | Shortcut | Action |
 * |----------|--------|
 * | `Space` or `K` | Play/Pause |
 * | `M` | Mute/Unmute |
 * | `F` | Fullscreen toggle |
 * | `←` (Left Arrow) | Skip backward 10 seconds |
 * | `→` (Right Arrow) | Skip forward 10 seconds |
 *
 * ## Layout Structure
 *
 * ```
 * ┌─────────────────────────────────────┐
 * │     VideoPlayer Container           │
 * │  ┌───────────────────────────────┐  │
 * │  │  <video> Element              │  │
 * │  │  (plays video content)        │  │
 * │  └───────────────────────────────┘  │
 * │  ┌───────────────────────────────┐  │
 * │  │  Play Button Overlay          │  │
 * │  │  (pulsing when paused)        │  │
 * │  └───────────────────────────────┘  │
 * │  ┌───────────────────────────────┐  │
 * │  │  Title Overlay (optional)     │  │
 * │  │  (gradient background)        │  │
 * │  └───────────────────────────────┘  │
 * │  ┌───────────────────────────────┐  │
 * │  │  Progress Bar                 │  │
 * │  │  (buffered + current progress)│  │
 * │  └───────────────────────────────┘  │
 * │  ┌───────────────────────────────┐  │
 * │  │  Control Bar                  │  │
 * │  │  (mobile or desktop layout)   │  │
 * │  └───────────────────────────────┘  │
 * └─────────────────────────────────────┘
 * ```
 *
 * ## Component Usage Example
 *
 * ```tsx
 * import { VideoPlayer } from '@/branded/video/video-player'
 *
 * export default function ContentPage() {
 *   const [currentTime, setCurrentTime] = useState(0)
 *
 *   return (
 *     <div className="w-full h-screen bg-black">
 *       <VideoPlayer
 *         src="https://example.com/video.mp4"
 *         title="Enlightenment Journey"
 *         poster="https://example.com/poster.jpg"
 *         onTimeUpdate={(time) => setCurrentTime(time)}
 *         onEnded={() => console.log('Video finished')}
 *       />
 *     </div>
 *   )
 * }
 * ```
 */
const meta = {
  title: 'Tier 2: Branded/Video/VideoPlayer',
  component: VideoPlayer,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#00070F' },
        { name: 'black', value: '#000000' },
      ],
    },
    docs: {
      description: {
        component:
          'A fully-featured HTML5 video player with glassmorphic controls, keyboard shortcuts, responsive design, and callback support for time updates and completion events.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Video source URL (MP4 format)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'BigBuckBunny.mp4' },
      },
    },
    poster: {
      control: 'text',
      description: 'Poster image URL shown before video plays',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    title: {
      control: 'text',
      description: 'Video title displayed in top overlay gradient',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    onTimeUpdate: {
      description: 'Callback fired when video playback time changes',
      action: 'onTimeUpdate',
      table: {
        type: { summary: '(currentTime: number) => void' },
      },
    },
    onEnded: {
      description: 'Callback fired when video finishes playing',
      action: 'onEnded',
      table: {
        type: { summary: '() => void' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes for custom styling',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof VideoPlayer>

export default meta
type Story = StoryObj<typeof meta>

// Sample video URLs for demos
const BIG_BUCK_BUNNY = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
const POSTER_IMAGE = 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop'
const SAMPLE_POSTER = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1920&h=1080&fit=crop'

/**
 * Default VideoPlayer - Basic video playback
 *
 * Demonstrates:
 * - Minimal setup with just video source
 * - Full control bar with play, volume, skip, fullscreen
 * - Auto-hiding controls on mouse leave during playback
 * - Play button overlay when paused
 */
export const Default: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full h-full max-w-6xl">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * With Title - Video title overlay
 *
 * Shows:
 * - Title text in gradient background overlay
 * - Title appears with controls at top of video
 * - Disappears when controls auto-hide
 * - Uses Cinzel font for elegant display
 */
export const WithTitle: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    title: 'The Essence of Consciousness',
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full h-full max-w-6xl">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * With Poster Image - Loading fallback
 *
 * Demonstrates:
 * - Poster image shown before video plays
 * - Provides visual feedback during load time
 * - Improves perceived performance
 * - Smooth transition when video becomes ready
 */
export const WithPosterImage: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    poster: SAMPLE_POSTER,
    title: 'Journey to Inner Peace',
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full h-full max-w-6xl">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * With Time Update Callback - Tracking playback progress
 *
 * Features:
 * - Real-time current time updates
 * - Useful for progress tracking, analytics, or syncing other UI
 * - Callback receives time in seconds
 * - Updates on every frame during playback
 */
export const WithTimeUpdateCallback: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    title: 'Meditation Guide - 10 Minutes',
    poster: SAMPLE_POSTER,
    onTimeUpdate: (currentTime) => {
      console.log(`Current playback time: ${currentTime.toFixed(2)}s`)
    },
  },
  decorators: [
    (Story) => {
      const [time, setTime] = useState(0)
      const [duration, setDuration] = useState(0)

      return (
        <div className="w-full h-screen bg-black flex flex-col items-center justify-center p-4">
          <div className="w-full h-4/5 max-w-6xl">
            <VideoPlayer
              src={BIG_BUCK_BUNNY}
              title="Meditation Guide - 10 Minutes"
              poster={SAMPLE_POSTER}
              onTimeUpdate={(t) => setTime(t)}
            />
          </div>
          <div className="w-full max-w-6xl mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-70">Current Time</p>
                <p className="text-2xl font-mono font-semibold">
                  {Math.floor(time / 60)}:{String(Math.floor(time % 60)).padStart(2, '0')}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-70">Playback Progress</p>
                <p className="text-2xl font-mono font-semibold">
                  {duration > 0 ? Math.round((time / duration) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
  ],
}

/**
 * With Ended Callback - Video completion handling
 *
 * Shows:
 * - onEnded fires when video finishes
 * - Useful for triggering next video, showing completion message
 * - Can be used for analytics or course progression
 * - Paired with state management for UX feedback
 */
export const WithEndedCallback: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    title: 'Complete This Lesson First',
    poster: SAMPLE_POSTER,
    onEnded: () => {
      console.log('Video playback completed')
    },
  },
  decorators: [
    (Story) => {
      const [isCompleted, setIsCompleted] = useState(false)

      return (
        <div className="w-full h-screen bg-black flex flex-col items-center justify-center p-4">
          <div className="w-full h-4/5 max-w-6xl">
            <VideoPlayer
              src={BIG_BUCK_BUNNY}
              title="Complete This Lesson First"
              poster={SAMPLE_POSTER}
              onEnded={() => setIsCompleted(true)}
            />
          </div>
          {isCompleted && (
            <div className="w-full max-w-6xl mt-6 bg-green-500/20 border border-green-500 rounded-lg p-6 text-white text-center animate-in fade-in">
              <h3 className="text-2xl font-bold mb-2">Video Completed!</h3>
              <p className="text-white/80">
                You've successfully completed this lesson. Ready for the next module?
              </p>
            </div>
          )}
        </div>
      )
    },
  ],
}

/**
 * Aspect Ratio 16:9 - Widescreen format
 *
 * Demonstrates:
 * - Standard widescreen aspect ratio (1920x1080)
 * - Most common video format
 * - Optimal for desktop viewing
 * - Better use of horizontal space
 */
export const AspectRatio16x9: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    title: 'Widescreen Content - 16:9',
    poster: SAMPLE_POSTER,
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-6xl aspect-video">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * Aspect Ratio 4:3 - Classic format
 *
 * Shows:
 * - Classic television aspect ratio
 * - Good for older recorded content
 * - More vertical space than 16:9
 * - Common for educational videos
 */
export const AspectRatio4x3: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    title: 'Classic Format - 4:3',
    poster: SAMPLE_POSTER,
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-3xl aspect-[4/3]">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * Aspect Ratio 1:1 - Square format
 *
 * Demonstrates:
 * - Square video format
 * - Perfect for mobile-first content
 * - Social media compatible
 * - Centered presentation
 */
export const AspectRatio1x1: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    title: 'Square Format - 1:1',
    poster: SAMPLE_POSTER,
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-2xl aspect-square">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * Mobile View - Responsive design on small screens
 *
 * Features:
 * - Simplified mobile control layout
 * - Play/Pause, time display, fullscreen
 * - No skip buttons on mobile
 * - Touch-optimized control sizes
 * - Full-screen video viewing
 */
export const MobileView: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    title: 'Mobile Optimized',
    poster: SAMPLE_POSTER,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen bg-black">
        <Story />
      </div>
    ),
  ],
}

/**
 * Tablet View - Medium screen size
 *
 * Shows:
 * - Desktop controls on medium screens
 * - Responsive behavior on tablets
 * - Balance between mobile and desktop
 * - Good use of tablet horizontal space
 */
export const TabletView: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    title: 'Tablet Experience',
    poster: SAMPLE_POSTER,
  },
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen bg-black">
        <Story />
      </div>
    ),
  ],
}

/**
 * Dark Background - Full black background
 *
 * Shows:
 * - Pure black background for minimal distraction
 * - Maximum focus on video content
 * - Professional presentation
 * - Ideal for spiritual or educational content
 */
export const DarkBackground: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    title: 'Deep Contemplation',
    poster: SAMPLE_POSTER,
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full h-full max-w-6xl">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * Custom Styling - With additional CSS classes
 *
 * Demonstrates:
 * - Custom className prop for additional styling
 * - Shadow effects for depth
 * - Border radius for rounded corners
 * - Custom positioning and sizing
 */
export const CustomStyling: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    title: 'Styled Video Player',
    poster: SAMPLE_POSTER,
    className: 'rounded-xl shadow-2xl',
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * No Title - Minimal UI
 *
 * Shows:
 * - Clean player without title overlay
 * - Minimal visual elements
 * - Focus on content only
 * - Less UI distraction
 */
export const NoTitle: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    poster: SAMPLE_POSTER,
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full h-full max-w-6xl">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * Interactive Controls - Full control interaction demo
 *
 * Demonstrates:
 * - All interactive controls
 * - Play/Pause state
 * - Volume control with slider
 * - Seek bar interaction
 * - Fullscreen capability
 * - Time display format
 */
export const InteractiveControls: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    title: 'Interactive Video Player Demo',
    poster: SAMPLE_POSTER,
    onTimeUpdate: (time) => console.log(`Time: ${time.toFixed(2)}s`),
    onEnded: () => console.log('Video ended'),
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <Story />
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 max-w-2xl bg-cyan-500/20 border border-cyan-500/50 rounded-lg p-4 backdrop-blur-sm">
          <h4 className="text-cyan-400 font-semibold text-sm mb-2">Keyboard Shortcuts:</h4>
          <div className="grid grid-cols-2 gap-2 text-white/80 text-xs">
            <div>Space / K: Play/Pause</div>
            <div>M: Mute/Unmute</div>
            <div>F: Fullscreen</div>
            <div>← / →: Skip ±10s</div>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Multiple Aspects - Comparison view
 *
 * Shows:
 * - Same content in different aspect ratios
 * - Side-by-side or stacked comparison
 * - How player adapts to container size
 * - Design responsiveness
 */
export const MultipleAspects: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    title: 'Aspect Ratio Comparison',
    poster: SAMPLE_POSTER,
  },
  render: (args) => (
    <div className="w-full bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">16:9 Widescreen</h3>
          <div className="aspect-video rounded-lg overflow-hidden">
            <VideoPlayer {...args} />
          </div>
        </div>

        <div>
          <h3 className="text-white text-lg font-semibold mb-4">4:3 Classic</h3>
          <div className="max-w-2xl aspect-[4/3] rounded-lg overflow-hidden">
            <VideoPlayer {...args} />
          </div>
        </div>

        <div>
          <h3 className="text-white text-lg font-semibold mb-4">1:1 Square</h3>
          <div className="max-w-xl aspect-square rounded-lg overflow-hidden">
            <VideoPlayer {...args} />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Embedded Player - Responsive container
 *
 * Demonstrates:
 * - Player within a content container
 * - Responsive sizing
 * - Integration with surrounding content
 * - Real-world usage scenario
 */
export const EmbeddedPlayer: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    title: 'Embedded Video Experience',
    poster: SAMPLE_POSTER,
  },
  render: (args) => (
    <div className="w-full bg-gradient-to-b from-slate-900 to-black min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Video Section */}
        <div className="mb-8">
          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
            <VideoPlayer {...args} />
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
          <h1 className="text-3xl font-bold text-white mb-4">
            The Art of Digital Enlightenment
          </h1>
          <p className="text-white/70 mb-6 leading-relaxed">
            In this comprehensive video journey, we explore the intersection of technology and spiritual growth.
            Discover how meditation practices can enhance your digital wellness and create meaningful connections
            in the modern world.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-2">45:32</div>
              <div className="text-white/60 text-sm">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-2">Advanced</div>
              <div className="text-white/60 text-sm">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-2">2024</div>
              <div className="text-white/60 text-sm">Year</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * All Props Demo - Complete feature showcase
 *
 * Features:
 * - All props in action simultaneously
 * - Title display
 * - Poster image
 * - Time tracking
 * - Completion handling
 * - Custom styling
 * - Perfect for testing all functionality
 */
export const AllPropsDemo: Story = {
  args: {
    src: BIG_BUCK_BUNNY,
    title: 'Complete VideoPlayer Feature Demo',
    poster: SAMPLE_POSTER,
    className: 'rounded-lg shadow-2xl',
    onTimeUpdate: (time) => {
      if (Math.floor(time) % 10 === 0) {
        console.log(`Milestone: ${Math.floor(time)}s reached`)
      }
    },
    onEnded: () => {
      console.log('Video completed! Triggering next lesson...')
    },
  },
  decorators: [
    (Story) => {
      const [currentTime, setCurrentTime] = useState(0)
      const [isCompleted, setIsCompleted] = useState(false)

      return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-5xl">
            <div className="mb-6">
              <Story />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                <p className="text-white/60 text-sm mb-2">Current Time</p>
                <p className="text-2xl font-mono text-cyan-400 font-semibold">
                  {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                <p className="text-white/60 text-sm mb-2">Buffering</p>
                <p className="text-lg text-white font-semibold">
                  Detecting...
                </p>
              </div>

              <div className={`rounded-lg p-4 border transition-all ${
                isCompleted
                  ? 'bg-green-500/20 border-green-500'
                  : 'bg-white/5 border-white/10 backdrop-blur-md'
              }`}>
                <p className="text-white/60 text-sm mb-2">Status</p>
                <p className={`text-lg font-semibold ${isCompleted ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isCompleted ? 'Completed!' : 'Playing...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
  ],
}
