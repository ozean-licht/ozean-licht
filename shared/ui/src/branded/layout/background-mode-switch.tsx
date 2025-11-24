'use client'

import { Video, Image as ImageIcon, Power } from 'lucide-react'
import { cn } from '../../lib/utils'

export type BackgroundMode = 'video' | 'image' | 'none'

export interface BackgroundModeSwitchProps {
  mode?: BackgroundMode
  onModeChange?: (mode: BackgroundMode) => void
  isLoaded?: boolean
}

/**
 * Background mode switch component for Ozean Licht platform
 *
 * Allows users to toggle between video, image, or no background.
 * Features a neumorphic design with inset shadows for active state.
 *
 * @example
 * ```tsx
 * const [mode, setMode] = useState<BackgroundMode>('video')
 *
 * <BackgroundModeSwitch
 *   mode={mode}
 *   onModeChange={setMode}
 *   isLoaded={true}
 * />
 * ```
 */
export function BackgroundModeSwitch({
  mode: controlledMode,
  onModeChange,
  isLoaded = true
}: BackgroundModeSwitchProps) {
  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) {
    return null
  }

  // If mode not provided, try to use context (if available in consuming app)
  const mode = controlledMode || 'video'

  const handleModeChange = (newMode: BackgroundMode) => {
    if (onModeChange) {
      onModeChange(newMode)
    } else {
      // Try to use context if available
      try {
        // @ts-ignore - This will be handled by consuming app's context
        const { changeMode } = require('./background-mode-context').useBackgroundMode()
        changeMode(newMode)
      } catch (error) {
        console.warn('BackgroundModeSwitch: No onModeChange handler or context provided')
      }
    }
  }

  const modes: Array<{ value: BackgroundMode; icon: typeof Video }> = [
    { value: 'video', icon: Video },
    { value: 'image', icon: ImageIcon },
    { value: 'none', icon: Power },
  ]

  return (
    <div className="px-3 py-4 border-t border-[#0E282E]">
      <div className="flex items-center justify-center gap-3 p-2 bg-gradient-to-b from-[#0A1A1A] to-[#0D1F1F] rounded-3xl">
        {modes.map(({ value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => handleModeChange(value)}
            className={cn(
              "relative w-12 h-12 rounded-xl transition-all duration-300",
              "flex items-center justify-center",
              mode === value
                ? [
                    "bg-gradient-to-br from-[#0A1A1A] to-[#050F0F]",
                    "text-primary",
                    "shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(25,45,50,0.1)]",
                    "scale-95"
                  ].join(" ")
                : "text-muted-foreground/30 hover:text-muted-foreground/50 hover:scale-105"
            )}
          >
            <Icon className={cn(
              "transition-all duration-300",
              mode === value ? "h-5 w-5" : "h-4.5 w-4.5"
            )} />
          </button>
        ))}
      </div>
    </div>
  )
}
