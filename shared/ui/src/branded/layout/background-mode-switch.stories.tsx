'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { BackgroundModeSwitch, type BackgroundMode } from './background-mode-switch'

/**
 * # BackgroundModeSwitch Component
 *
 * A neumorphic background mode selector allowing users to toggle between video,
 * image, or no background modes. Features an elegant inset shadow design with
 * smooth transitions and scale animations.
 *
 * ## Features
 * - **Three Modes**: Video, Image, and None (Power off)
 * - **Neumorphic Design**: Inset shadow effects for active state
 * - **Smooth Animations**: 300ms transitions with scale effects
 * - **Accessible**: Keyboard navigable button controls
 * - **Customizable**: Controlled or uncontrolled with optional callback
 * - **Hydration Safe**: Loading state prevents hydration mismatches
 *
 * ## Design System Context
 * - **Active State**: Scale 95% with inset shadow and primary color
 * - **Inactive State**: Muted foreground color with hover scale
 * - **Container**: Gradient background with rounded corners
 * - **Icons**: Video, Image, and Power icons from lucide-react
 *
 * ## Usage
 *
 * ```tsx
 * // Controlled mode
 * const [mode, setMode] = useState<BackgroundMode>('video')
 *
 * <BackgroundModeSwitch
 *   mode={mode}
 *   onModeChange={setMode}
 *   isLoaded={true}
 * />
 *
 * // With context
 * <BackgroundModeSwitch isLoaded={true} />
 * ```
 */
const meta = {
  title: 'Tier 2: Branded/Layout/BackgroundModeSwitch',
  component: BackgroundModeSwitch,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#00070F' },
        { name: 'light', value: '#FFFFFF' },
      ],
    },
    docs: {
      description: {
        component: 'Neumorphic background mode switch for toggling between video, image, or no background. Features inset shadows and smooth transitions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['video', 'image', 'none'],
      description: 'Current background mode',
      table: {
        defaultValue: { summary: 'video' },
      },
    },
    isLoaded: {
      control: 'boolean',
      description: 'Whether the component is loaded (prevents hydration mismatch)',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    onModeChange: {
      description: 'Callback when mode is changed',
      table: {
        type: { summary: '(mode: BackgroundMode) => void' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F] p-8 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BackgroundModeSwitch>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default state with video mode active.
 *
 * Shows the switch in its most common state with video background mode selected.
 * Demonstrates the neumorphic active state with inset shadow and primary color.
 */
export const Video: Story = {
  args: {
    mode: 'video',
    isLoaded: true,
  },
}

/**
 * Image mode active.
 *
 * Shows the switch with image background mode selected instead of video.
 * Demonstrates how the active state changes between different modes.
 */
export const Image: Story = {
  args: {
    mode: 'image',
    isLoaded: true,
  },
}

/**
 * None mode active (background disabled).
 *
 * Shows the switch with no background mode selected.
 * The power icon is highlighted, indicating no background is active.
 */
export const None: Story = {
  args: {
    mode: 'none',
    isLoaded: true,
  },
}

/**
 * Interactive state management.
 *
 * Fully interactive switch with internal state management using React hooks.
 * Click any button to change the mode and see the active state update.
 * Demonstrates how the component responds to user interaction.
 */
export const Interactive: Story = {
  render: () => {
    const [mode, setMode] = useState<BackgroundMode>('video')

    return (
      <div className="space-y-8">
        <BackgroundModeSwitch
          mode={mode}
          onModeChange={setMode}
          isLoaded={true}
        />
        <div className="text-center space-y-3 pt-6 border-t border-[#0E282E]">
          <p className="text-sm text-white/70 font-montserrat">
            Current Mode: <span className="text-primary font-semibold">{mode.toUpperCase()}</span>
          </p>
          <p className="text-xs text-white/50 max-w-xs mx-auto">
            Click any button above to change the background mode. The active button will show the neumorphic inset shadow effect.
          </p>
        </div>
      </div>
    )
  },
}

/**
 * Loading state (component hidden).
 *
 * Shows the switch in a loading/not-loaded state where the component
 * returns null to prevent hydration mismatches. This state is crucial
 * for Next.js server-side rendering scenarios.
 */
export const NotLoaded: Story = {
  args: {
    mode: 'video',
    isLoaded: false,
  },
  render: (args) => (
    <div className="space-y-8">
      <div className="h-20 flex items-center justify-center">
        <BackgroundModeSwitch {...args} />
      </div>
      <div className="text-center space-y-3 pt-6 border-t border-[#0E282E]">
        <p className="text-sm text-white/70 font-montserrat">
          Component is <span className="text-amber-400 font-semibold">NOT LOADED</span>
        </p>
        <p className="text-xs text-white/50 max-w-xs mx-auto">
          When isLoaded is false, the component returns null to prevent hydration mismatches in Next.js applications.
        </p>
      </div>
    </div>
  ),
}

/**
 * All modes comparison.
 *
 * Displays all three modes side by side for easy visual comparison.
 * Useful for design review and understanding the different active states.
 */
export const AllModes: Story = {
  render: () => (
    <div className="space-y-12">
      <div className="space-y-4">
        <p className="text-sm text-white/70 font-montserrat-alt uppercase tracking-wider">Video Mode</p>
        <BackgroundModeSwitch mode="video" isLoaded={true} />
      </div>

      <div className="space-y-4">
        <p className="text-sm text-white/70 font-montserrat-alt uppercase tracking-wider">Image Mode</p>
        <BackgroundModeSwitch mode="image" isLoaded={true} />
      </div>

      <div className="space-y-4">
        <p className="text-sm text-white/70 font-montserrat-alt uppercase tracking-wider">None Mode</p>
        <BackgroundModeSwitch mode="none" isLoaded={true} />
      </div>
    </div>
  ),
}

/**
 * Multi-state interactive demo.
 *
 * Advanced interactive example showing rapid mode switching with
 * visual feedback. Demonstrates smooth transitions between all three modes
 * and how the component maintains state consistency.
 */
export const InteractivePlayground: Story = {
  render: () => {
    const [mode, setMode] = useState<BackgroundMode>('video')
    const [changeCount, setChangeCount] = useState(0)

    const handleModeChange = (newMode: BackgroundMode) => {
      setMode(newMode)
      setChangeCount((prev) => prev + 1)
    }

    return (
      <div className="space-y-8 max-w-md">
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-white font-montserrat text-lg">Background Mode</h3>
            <p className="text-white/60 text-sm">
              Select your preferred background style for the platform
            </p>
          </div>

          <BackgroundModeSwitch
            mode={mode}
            onModeChange={handleModeChange}
            isLoaded={true}
          />

          <div className="space-y-4 pt-4 border-t border-[#0E282E]">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-white/40 text-xs mb-1">Current</p>
                <p className="text-primary font-montserrat-alt font-bold text-sm">
                  {mode === 'video' ? 'Video' : mode === 'image' ? 'Image' : 'Off'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/40 text-xs mb-1">Changes</p>
                <p className="text-white/80 font-montserrat-alt font-bold text-sm">
                  {changeCount}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/40 text-xs mb-1">Status</p>
                <p className="text-emerald-400 font-montserrat-alt font-bold text-sm">
                  Active
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-white/40 text-center">
            Try switching between modes to see the smooth transitions and state updates
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Compact integration example.
 *
 * Shows how the component would appear in a typical sidebar or compact panel.
 * Demonstrates the component's minimal footprint and clean integration.
 */
export const CompactIntegration: Story = {
  render: () => (
    <div className="w-80 glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#0E282E]">
        <h2 className="text-white font-montserrat text-sm font-semibold">Display Settings</h2>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Background Mode Switch */}
        <div className="space-y-2">
          <label className="text-white/70 text-xs uppercase tracking-wider font-montserrat-alt">
            Background Mode
          </label>
          <BackgroundModeSwitch mode="video" isLoaded={true} />
        </div>

        {/* Other settings */}
        <div className="space-y-2">
          <label className="text-white/70 text-xs uppercase tracking-wider font-montserrat-alt">
            Brightness
          </label>
          <div className="h-2 bg-[#0A1A1A] rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-primary rounded-full" />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#0E282E]">
          <button className="w-full px-3 py-2 text-xs text-white/60 hover:text-white/80 transition-colors font-montserrat">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  ),
}

/**
 * Accessibility demo.
 *
 * Shows keyboard navigation support. The component works with standard
 * React button elements, ensuring full keyboard accessibility.
 */
export const AccessibilityDemo: Story = {
  render: () => {
    const [mode, setMode] = useState<BackgroundMode>('video')

    return (
      <div className="space-y-8 max-w-md">
        <div className="space-y-3">
          <h3 className="text-white font-montserrat text-lg">Keyboard Navigation</h3>
          <p className="text-white/60 text-sm">
            Try using Tab to focus on the buttons and Space/Enter to activate
          </p>
        </div>

        <BackgroundModeSwitch
          mode={mode}
          onModeChange={setMode}
          isLoaded={true}
        />

        <div className="bg-[#0A1A1A] rounded-lg p-4 space-y-3 border border-[#0E282E]">
          <p className="text-xs uppercase tracking-wider text-white/50 font-montserrat-alt">
            Accessibility Features
          </p>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Keyboard accessible (Tab, Space, Enter)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Semantic HTML button elements</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Focus visible indicators</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>ARIA attributes supported</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Color not the only indicator</span>
            </li>
          </ul>
        </div>
      </div>
    )
  },
}

/**
 * Theme variation showcase.
 *
 * Demonstrates how the component adapts to different color themes.
 * Shows the component's visual consistency and design robustness.
 */
export const ThemeVariations: Story = {
  render: () => (
    <div className="space-y-12">
      <div className="space-y-4">
        <p className="text-sm text-white/70 font-montserrat-alt uppercase tracking-wider">
          Dark Theme (Default)
        </p>
        <div className="bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F] p-8 rounded-lg">
          <BackgroundModeSwitch mode="video" isLoaded={true} />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-white/70 font-montserrat-alt uppercase tracking-wider">
          Preview in Light Mode
        </p>
        <div className="bg-white p-8 rounded-lg">
          <BackgroundModeSwitch mode="video" isLoaded={true} />
        </div>
      </div>
    </div>
  ),
}
