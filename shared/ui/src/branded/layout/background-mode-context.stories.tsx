'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect } from 'react'
import { BackgroundModeProvider, useBackgroundMode, type BackgroundMode } from './background-mode-context'
import { Card } from '../../cossui/card'
import { Button } from '../../cossui/button'
import { Video, Image as ImageIcon, Power, RefreshCw, Trash2, Download, Upload } from 'lucide-react'

/**
 * # BackgroundModeProvider & useBackgroundMode Hook
 *
 * A Context-based state management system for managing background display modes
 * across the Ozean Licht platform. Provides persistent storage via localStorage
 * with hydration-safe state management for Next.js applications.
 *
 * ## Features
 *
 * - **Three Modes**: Video, Image, and None (disabled)
 * - **Persistent Storage**: Automatically saves preference to localStorage
 * - **Hydration Safe**: Includes `isLoaded` flag to prevent hydration mismatches
 * - **Type Safe**: Full TypeScript support with proper type definitions
 * - **Context-Based**: Clean API using React Context and custom hooks
 * - **Error Handling**: Throws descriptive error if hook used outside provider
 *
 * ## Context API
 *
 * ### BackgroundModeContextType
 * ```typescript
 * interface BackgroundModeContextType {
 *   mode: BackgroundMode                    // Current mode: 'video' | 'image' | 'none'
 *   changeMode: (mode: BackgroundMode) => void  // Update mode and persist
 *   isLoaded: boolean                       // Hydration safety flag
 * }
 * ```
 *
 * ### useBackgroundMode Hook
 * Returns the context value or throws error if outside provider:
 * ```typescript
 * const { mode, changeMode, isLoaded } = useBackgroundMode()
 * ```
 *
 * ## Storage
 *
 * - **Key**: `ozean-licht-background-mode`
 * - **Default**: `'video'`
 * - **Validation**: Only valid modes are restored from storage
 * - **Format**: Plain string in localStorage
 *
 * ## Integration Points
 *
 * - Wraps entire application (typically in root layout)
 * - Used by BackgroundModeSwitch component for mode selection
 * - Used by background rendering components to display appropriate content
 * - Compatible with Next.js App Router and Pages Router
 *
 * ## Design System Context
 *
 * - **Primary Color**: Oceanic cyan (#0ec2bc, `text-primary`)
 * - **Dark Background**: Deep ocean (#00070F, #0A1A1A)
 * - **Border Color**: Muted teal (#0E282E)
 * - **Typography**: Montserrat font family
 */

const meta = {
  title: 'Tier 2: Branded/Layout/Background Mode Context',
  component: BackgroundModeProvider,
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
          'Context provider for managing background display modes with persistent localStorage storage. Provides type-safe hook for consuming components with hydration safety.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F] p-8 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BackgroundModeProvider>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Demo component that consumes the BackgroundMode context
 * Shows current mode, provides controls to change it, and displays state info
 */
function BackgroundModeDemo({ showDetails = true }: { showDetails?: boolean }) {
  const { mode, changeMode, isLoaded } = useBackgroundMode()
  const [changeCount, setChangeCount] = useState(0)

  const handleModeChange = (newMode: BackgroundMode) => {
    changeMode(newMode)
    setChangeCount((prev) => prev + 1)
  }

  const modes: Array<{ value: BackgroundMode; label: string; icon: typeof Video; description: string }> = [
    {
      value: 'video',
      label: 'Video',
      icon: Video,
      description: 'Animated video background for dynamic visual experience',
    },
    {
      value: 'image',
      label: 'Image',
      icon: ImageIcon,
      description: 'Static image background for a cleaner look',
    },
    {
      value: 'none',
      label: 'Disabled',
      icon: Power,
      description: 'No background, focus on content',
    },
  ]

  return (
    <div className="space-y-6 w-full max-w-2xl">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white font-montserrat">Background Mode Selection</h2>
        <p className="text-white/60 text-sm">
          {isLoaded ? 'Choose your preferred background mode. Your selection will be saved.' : 'Loading...'}
        </p>
      </div>

      {/* Mode Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {modes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => handleModeChange(value)}
            className={`relative px-4 py-4 rounded-xl transition-all duration-300 border flex flex-col items-center gap-2 ${
              mode === value
                ? 'bg-primary/20 border-primary/50 text-primary shadow-[0_0_20px_rgba(14,194,188,0.3)]'
                : 'bg-[#0A1A1A]/50 border-[#0E282E] text-muted-foreground/60 hover:border-primary/30 hover:text-white/80'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
          </button>
        ))}
      </div>

      {/* Mode Details */}
      {showDetails && (
        <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-6 space-y-4">
          <div className="space-y-3">
            {modes.map(({ value, description }) => (
              <div
                key={value}
                className={`p-3 rounded-lg transition-all ${
                  mode === value
                    ? 'bg-primary/10 border border-primary/30'
                    : 'bg-transparent border border-transparent opacity-40'
                }`}
              >
                <p className={`text-sm ${mode === value ? 'text-primary font-semibold' : 'text-white/60'}`}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* State Display */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60 mb-1">Current Mode</p>
            <p className="text-2xl font-bold text-primary font-montserrat-alt">
              {mode === 'video' ? 'Video' : mode === 'image' ? 'Image' : 'Disabled'}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60 mb-1">Status</p>
            <p className="text-sm text-white font-semibold flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isLoaded ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {isLoaded ? 'Loaded' : 'Loading'}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-primary/20">
          <p className="text-xs text-white/50">Changes made: {changeCount}</p>
        </div>
      </Card>
    </div>
  )
}

/**
 * Basic usage - Simple context provider with consumer
 *
 * Shows the most basic implementation: wrapping a component in BackgroundModeProvider
 * and using the useBackgroundMode hook to access state.
 */
export const Basic: Story = {
  render: () => (
    <BackgroundModeProvider>
      <BackgroundModeDemo showDetails={false} />
    </BackgroundModeProvider>
  ),
}

/**
 * Default - Complete demo with all features
 *
 * Shows a fully functional context demo with:
 * - Mode selection buttons
 * - Current state display
 * - Detailed mode descriptions
 * - Hydration status indicator
 */
export const Default: Story = {
  render: () => (
    <BackgroundModeProvider>
      <BackgroundModeDemo />
    </BackgroundModeProvider>
  ),
}

/**
 * With State Persistence Demo
 *
 * Demonstrates how the context saves state to localStorage and
 * restores it on page reload. The demo shows:
 * - Current stored value in localStorage
 * - Export/Import functionality for testing
 * - Validation of persisted data
 */
export const StatePersistence: Story = {
  render: () => {
    const [storageInfo, setStorageInfo] = useState<{
      exists: boolean
      value: string | null
      isValid: boolean
    } | null>(null)

    useEffect(() => {
      // Check localStorage state
      const stored = localStorage.getItem('ozean-licht-background-mode')
      const isValid = stored && ['video', 'image', 'none'].includes(stored)
      setStorageInfo({
        exists: stored !== null,
        value: stored,
        isValid: !!isValid,
      })
    }, [])

    return (
      <BackgroundModeProvider>
        <div className="space-y-8 w-full max-w-3xl">
          {/* Demo Component */}
          <BackgroundModeDemo />

          {/* Storage Information */}
          <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">LocalStorage Information</h3>

            {storageInfo && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Storage Key</p>
                    <p className="font-mono text-sm text-primary">ozean-licht-background-mode</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Status</p>
                    <p className={`text-sm font-semibold ${storageInfo.exists ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {storageInfo.exists ? 'Stored' : 'Not Found'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-2">Current Value</p>
                    <div className="bg-[#0E282E]/50 rounded px-3 py-2 font-mono text-sm text-white/80 break-all">
                      {storageInfo.value || '(empty)'}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#0E282E] flex gap-3">
                  <Button
                    variant="outline"
                    className="text-xs gap-2"
                    onClick={() => {
                      localStorage.removeItem('ozean-licht-background-mode')
                      setStorageInfo({ exists: false, value: null, isValid: false })
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear Storage
                  </Button>
                  <Button
                    variant="outline"
                    className="text-xs gap-2"
                    onClick={() => {
                      const stored = localStorage.getItem('ozean-licht-background-mode')
                      setStorageInfo({
                        exists: stored !== null,
                        value: stored,
                        isValid: stored ? ['video', 'image', 'none'].includes(stored) : false,
                      })
                    }}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Refresh
                  </Button>
                </div>
              </div>
            )}

            <div className="bg-primary/10 border border-primary/30 rounded p-3 text-sm text-primary/90">
              <p className="text-xs font-semibold mb-1">Note:</p>
              <p>
                Change the mode above and refresh the page. The selected mode will be restored from localStorage,
                demonstrating persistence.
              </p>
            </div>
          </Card>
        </div>
      </BackgroundModeProvider>
    )
  },
}

/**
 * Multiple Consumers
 *
 * Demonstrates that multiple components can consume the same context
 * and stay synchronized. Useful for showing how the context enables
 * global state management across the application.
 */
export const MultipleConsumers: Story = {
  render: () => {
    function ConsumerPanel({ title, variant }: { title: string; variant: 'primary' | 'secondary' }) {
      const { mode, changeMode, isLoaded } = useBackgroundMode()

      return (
        <Card
          className={`p-6 border ${
            variant === 'primary' ? 'bg-[#0A1A1A]/50 border-[#0E282E]' : 'bg-primary/5 border-primary/30'
          }`}
        >
          <h3 className={`text-sm font-semibold mb-4 ${variant === 'primary' ? 'text-white' : 'text-primary'}`}>
            {title}
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-white/60 mb-2">Current Mode</p>
              <p className="text-lg font-bold text-primary">{mode.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-2">Loaded Status</p>
              <p className={`text-sm ${isLoaded ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isLoaded ? 'Ready' : 'Loading'}
              </p>
            </div>
            <button
              onClick={() => changeMode(mode === 'video' ? 'image' : 'none')}
              className="w-full mt-3 px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-semibold rounded transition-colors"
            >
              Change Mode
            </button>
          </div>
        </Card>
      )
    }

    return (
      <BackgroundModeProvider>
        <div className="space-y-8 w-full max-w-3xl">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Multiple Consumers in Sync</h2>
            <p className="text-white/60 text-sm">
              All components below share the same context state. Changing mode in one panel updates all others.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ConsumerPanel title="Panel A" variant="primary" />
            <ConsumerPanel title="Panel B" variant="secondary" />
            <ConsumerPanel title="Panel C" variant="primary" />
            <ConsumerPanel title="Panel D" variant="secondary" />
          </div>

          <Card className="bg-primary/10 border border-primary/30 p-6">
            <p className="text-primary text-sm">
              All four panels above consume the same BackgroundModeProvider context. Try changing the mode in any panel
              and observe how all panels update synchronously.
            </p>
          </Card>
        </div>
      </BackgroundModeProvider>
    )
  },
}

/**
 * Integration with BackgroundModeSwitch
 *
 * Shows how the context works with the BackgroundModeSwitch component
 * for a complete background mode selection UI pattern.
 */
export const WithSwitch: Story = {
  render: () => {
    // Import here to avoid circular dependencies in demo
    const BackgroundModeSwitch = ({ mode, onModeChange }: any) => (
      <div className="flex gap-3 justify-center">
        {['video', 'image', 'none'].map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m as BackgroundMode)}
            className={`w-12 h-12 rounded-xl transition-all flex items-center justify-center ${
              mode === m
                ? 'bg-gradient-to-br from-[#0A1A1A] to-[#050F0F] text-primary shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6)]'
                : 'bg-[#0E282E]/50 text-muted-foreground/30 hover:text-muted-foreground/50'
            }`}
          >
            {m === 'video' ? <Video className="w-5 h-5" /> : m === 'image' ? <ImageIcon className="w-5 h-5" /> : <Power className="w-5 h-5" />}
          </button>
        ))}
      </div>
    )

    function SwitchDemoComponent() {
      const { mode, changeMode } = useBackgroundMode()

      return (
        <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-8 space-y-6 max-w-md">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Integrated Switch</h3>
            <p className="text-white/60 text-sm">Uses the context provider for state management</p>
          </div>

          <BackgroundModeSwitch mode={mode} onModeChange={changeMode} />

          <div className="pt-4 border-t border-[#0E282E] space-y-2">
            <p className="text-xs text-white/60">Current Selection:</p>
            <p className="text-primary font-bold text-lg">{mode === 'video' ? 'Video' : mode === 'image' ? 'Image' : 'None'}</p>
          </div>
        </Card>
      )
    }

    return (
      <BackgroundModeProvider>
        <div className="space-y-8 flex flex-col items-center w-full max-w-3xl">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">BackgroundModeSwitch Integration</h2>
            <p className="text-white/60 text-sm">Switch component + Context Provider = Complete pattern</p>
          </div>
          <SwitchDemoComponent />
        </div>
      </BackgroundModeProvider>
    )
  },
}

/**
 * Hydration Safety
 *
 * Demonstrates how the isLoaded flag prevents hydration mismatches
 * in Next.js applications. Shows the component behavior during
 * server-side rendering and client-side hydration.
 */
export const HydrationSafety: Story = {
  render: () => {
    function HydrationAwareComponent() {
      const { mode, isLoaded } = useBackgroundMode()
      const [mounted, setMounted] = useState(false)

      useEffect(() => {
        setMounted(true)
      }, [])

      return (
        <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Hydration Aware Component</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Context Loaded</p>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isLoaded ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <p className="text-sm font-semibold text-white">{isLoaded ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Client Mounted</p>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${mounted ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <p className="text-sm font-semibold text-white">{mounted ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {isLoaded && mounted && (
            <div className="bg-primary/10 border border-primary/30 rounded p-3">
              <p className="text-sm text-primary">Both server and client are synchronized. Current mode: {mode}</p>
            </div>
          )}

          {!isLoaded && (
            <div className="bg-amber-400/10 border border-amber-400/30 rounded p-3">
              <p className="text-sm text-amber-400">Context is loading. Component will render once available.</p>
            </div>
          )}
        </Card>
      )
    }

    return (
      <BackgroundModeProvider>
        <div className="space-y-8 w-full max-w-2xl">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Hydration Safety Demo</h2>
            <p className="text-white/60 text-sm">
              In Next.js apps, the isLoaded flag ensures server and client stay in sync during hydration.
            </p>
          </div>

          <HydrationAwareComponent />

          <Card className="bg-primary/5 border border-primary/30 p-6 space-y-3">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">How It Works:</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex gap-2">
                <span className="text-primary">1.</span>
                <span>Initial render uses default value (video mode)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">2.</span>
                <span>useEffect loads localStorage and sets isLoaded=true</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">3.</span>
                <span>Client hydration matches server output (no mismatch)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">4.</span>
                <span>Consumed components can render once isLoaded is true</span>
              </li>
            </ul>
          </Card>
        </div>
      </BackgroundModeProvider>
    )
  },
}

/**
 * Error Handling
 *
 * Demonstrates what happens when useBackgroundMode is used outside
 * of a BackgroundModeProvider. Shows the error boundary behavior
 * and proper error messages.
 */
export const ErrorHandling: Story = {
  render: () => {
    function ComponentWithoutProvider() {
      try {
        // This will throw an error because we're outside the provider
        const _ = useBackgroundMode()
        return null
      } catch (error) {
        return (
          <Card className="bg-red-900/20 border border-red-500/50 p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <h3 className="text-lg font-semibold text-red-300">Error Caught</h3>
              </div>
              <div className="bg-red-950/50 rounded px-3 py-2 font-mono text-xs text-red-200">
                {error instanceof Error ? error.message : String(error)}
              </div>
            </div>
          </Card>
        )
      }
    }

    return (
      <div className="space-y-8 w-full max-w-3xl">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Error Handling</h2>
          <p className="text-white/60 text-sm">
            Shows what happens when the hook is used outside its provider
          </p>
        </div>

        {/* Component WITHOUT provider - should error */}
        <div className="space-y-2">
          <p className="text-sm text-white/80 font-semibold">Without Provider:</p>
          <ComponentWithoutProvider />
        </div>

        {/* Component WITH provider - should work */}
        <div className="space-y-2">
          <p className="text-sm text-white/80 font-semibold">With Provider:</p>
          <BackgroundModeProvider>
            <Card className="bg-emerald-900/20 border border-emerald-500/50 p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h3 className="text-lg font-semibold text-emerald-300">Working Correctly</h3>
                </div>
                <p className="text-emerald-200/80 text-sm">
                  Context is properly provided and the hook works without error.
                </p>
              </div>
            </Card>
          </BackgroundModeProvider>
        </div>

        <Card className="bg-primary/10 border border-primary/30 p-6 space-y-3">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">Best Practice:</p>
          <p className="text-sm text-white/80">
            Always wrap your application (or a significant portion of it) with BackgroundModeProvider at a high level in
            your component tree, typically in the root layout component.
          </p>
        </Card>
      </div>
    )
  },
}

/**
 * Advanced: Mode Transitions
 *
 * Shows smooth transitions between modes with visual feedback
 * and demonstrates how the context handles rapid mode changes.
 */
export const ModeTransitions: Story = {
  render: () => {
    function TransitionDemo() {
      const { mode, changeMode } = useBackgroundMode()
      const [history, setHistory] = useState<Array<{ mode: BackgroundMode; timestamp: number }>>([])

      const handleChangeMode = (newMode: BackgroundMode) => {
        changeMode(newMode)
        setHistory((prev) => [...prev, { mode: newMode, timestamp: Date.now() }].slice(-5))
      }

      const modes: BackgroundMode[] = ['video', 'image', 'none']
      const nextMode = modes[(modes.indexOf(mode) + 1) % modes.length] as BackgroundMode

      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider mb-3">Current Mode</p>
              <div className="relative h-24 bg-gradient-to-br from-[#0A1A1A] to-[#050F0F] rounded-lg border border-[#0E282E] flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background:
                      mode === 'video'
                        ? 'linear-gradient(45deg, #0ec2bc, #00070F)'
                        : mode === 'image'
                          ? 'linear-gradient(135deg, #0ec2bc, #0A1A1A)'
                          : 'linear-gradient(90deg, #0A1A1A, #001a1a)',
                  }}
                />
                <div className="relative text-center">
                  <p className="text-4xl font-bold text-primary font-montserrat-alt">
                    {mode === 'video' ? 'Video' : mode === 'image' ? 'Image' : 'Off'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {modes.map((m) => (
                <button
                  key={m}
                  onClick={() => handleChangeMode(m)}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                    mode === m
                      ? 'bg-primary/30 text-primary border border-primary/50 shadow-[0_0_20px_rgba(14,194,188,0.2)]'
                      : 'bg-[#0E282E]/50 text-white/60 border border-[#0E282E] hover:border-primary/30'
                  }`}
                >
                  {m === 'video' ? 'Video' : m === 'image' ? 'Image' : 'Disable'}
                </button>
              ))}
            </div>

            <Button
              className="w-full gap-2 bg-primary text-white hover:bg-primary/80"
              onClick={() => handleChangeMode(nextMode)}
            >
              <RefreshCw className="w-4 h-4" />
              Cycle to {nextMode === 'video' ? 'Video' : nextMode === 'image' ? 'Image' : 'Disabled'}
            </Button>
          </div>

          {/* Transition History */}
          {history.length > 0 && (
            <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-4">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-3">Recent Changes</p>
              <div className="space-y-2 text-sm">
                {[...history].reverse().map((entry, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-[#0E282E] last:border-0">
                    <span className="text-white/80">
                      {entry.mode === 'video' ? 'Video' : entry.mode === 'image' ? 'Image' : 'Disabled'}
                    </span>
                    <span className="text-white/40 text-xs">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )
    }

    return (
      <BackgroundModeProvider>
        <div className="space-y-8 w-full max-w-2xl">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Mode Transitions & History</h2>
            <p className="text-white/60 text-sm">Demonstrates smooth transitions and tracks mode change history</p>
          </div>

          <TransitionDemo />

          <Card className="bg-primary/10 border border-primary/30 p-6 space-y-3">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">Transition Features:</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Instant state updates via context</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Automatic localStorage persistence</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Change history tracking</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Smooth CSS transitions in consuming components</span>
              </li>
            </ul>
          </Card>
        </div>
      </BackgroundModeProvider>
    )
  },
}

/**
 * Testing Template
 *
 * A template story useful for testing the context behavior,
 * state persistence, and integration with consuming components.
 * Can be used as a reference for writing unit tests.
 */
export const TestingTemplate: Story = {
  render: () => {
    function TestableComponent() {
      const { mode, changeMode, isLoaded } = useBackgroundMode()
      const [testResults, setTestResults] = useState<string[]>([])

      const runTests = () => {
        const results: string[] = []

        // Test 1: Context is available
        results.push(isLoaded ? 'PASS: Context loaded' : 'FAIL: Context not loaded')

        // Test 2: Mode is one of the valid values
        if (['video', 'image', 'none'].includes(mode)) {
          results.push(`PASS: Mode is valid (${mode})`)
        } else {
          results.push(`FAIL: Mode is invalid (${mode})`)
        }

        // Test 3: changeMode function works
        try {
          changeMode('image')
          results.push('PASS: changeMode function callable')
        } catch (e) {
          results.push(`FAIL: changeMode threw error`)
        }

        setTestResults(results)
      }

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-4">
              <p className="text-xs text-white/60 mb-2">Current Mode</p>
              <p className="text-xl font-bold text-primary">{mode}</p>
            </Card>
            <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-4">
              <p className="text-xs text-white/60 mb-2">Is Loaded</p>
              <p className="text-xl font-bold text-white">{isLoaded ? 'true' : 'false'}</p>
            </Card>
          </div>

          <Button onClick={runTests} className="w-full gap-2 bg-primary text-white hover:bg-primary/80">
            <RefreshCw className="w-4 h-4" />
            Run Tests
          </Button>

          {testResults.length > 0 && (
            <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-4 space-y-2">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-3">Test Results</p>
              {testResults.map((result, i) => {
                const isPassing = result.startsWith('PASS')
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 py-2 px-3 rounded text-sm font-mono ${
                      isPassing ? 'bg-emerald-900/30 text-emerald-300' : 'bg-red-900/30 text-red-300'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isPassing ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {result}
                  </div>
                )
              })}
            </Card>
          )}
        </div>
      )
    }

    return (
      <BackgroundModeProvider>
        <div className="space-y-8 w-full max-w-2xl">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Testing Template</h2>
            <p className="text-white/60 text-sm">Demonstrates testable context behavior for unit tests</p>
          </div>

          <TestableComponent />

          <Card className="bg-primary/10 border border-primary/30 p-6 space-y-3">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">Testable Properties:</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>mode returns correct BackgroundMode type</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>isLoaded boolean reflects context state</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>changeMode updates all consumers</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>localStorage persists mode changes</span>
              </li>
            </ul>
          </Card>
        </div>
      </BackgroundModeProvider>
    )
  },
}
