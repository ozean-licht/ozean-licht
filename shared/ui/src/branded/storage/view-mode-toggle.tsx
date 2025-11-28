'use client';

/**
 * View Mode Toggle Component
 *
 * Toggle button group to switch between list and grid view modes with localStorage persistence.
 * Provides keyboard navigation and tooltips for accessibility.
 */

'use client'

import React, { useEffect, useState } from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { LayoutList, LayoutGrid } from 'lucide-react'
import { cn } from '../../utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../cossui/tooltip'

export interface ViewModeToggleProps {
  /** Current view mode (controlled) */
  value?: 'list' | 'grid'
  /** Callback when view mode changes */
  onChange?: (mode: 'list' | 'grid') => void
  /** localStorage key for persistence (default: 'storage-view-mode') */
  storageKey?: string
  /** Custom CSS classes */
  className?: string
}

/**
 * ViewModeToggle Component
 *
 * Toggle button group for switching between list and grid views.
 * Persists selection to localStorage and provides visual feedback with tooltips.
 *
 * @example
 * // Uncontrolled with localStorage persistence
 * <ViewModeToggle />
 *
 * @example
 * // Controlled mode
 * <ViewModeToggle value={viewMode} onChange={setViewMode} />
 *
 * @example
 * // Custom storage key
 * <ViewModeToggle storageKey="file-browser-view" />
 */
export const ViewModeToggle = React.forwardRef<
  HTMLDivElement,
  ViewModeToggleProps
>(({ value, onChange, storageKey = 'storage-view-mode', className }, ref) => {
  const [internalValue, setInternalValue] = useState<'list' | 'grid'>('list')
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)

    if (value === undefined) {
      const stored = localStorage.getItem(storageKey)
      if (stored === 'list' || stored === 'grid') {
        setInternalValue(stored)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  // Determine current value (controlled vs uncontrolled)
  const currentValue = value ?? internalValue

  // Handle value change
  const handleValueChange = (newValue: string) => {
    // ToggleGroup requires a value, so we prevent deselection
    if (!newValue) return

    const mode = newValue as 'list' | 'grid'

    // Update internal state if uncontrolled
    if (value === undefined) {
      setInternalValue(mode)
      // Persist to localStorage
      if (mounted) {
        localStorage.setItem(storageKey, mode)
      }
    }

    // Call onChange callback
    onChange?.(mode)
  }

  return (
    <TooltipProvider>
      <ToggleGroupPrimitive.Root
        ref={ref}
        type="single"
        value={currentValue}
        onValueChange={handleValueChange}
        className={cn(
          'inline-flex items-center rounded-lg border border-[#0E282E] bg-card/30',
          className
        )}
        aria-label="View mode toggle"
      >
        {/* List View Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupPrimitive.Item
              value="list"
              aria-label="List view"
              className={cn(
                'flex items-center justify-center p-2 transition-all duration-200',
                'rounded-l-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                currentValue === 'list'
                  ? 'bg-primary text-white'
                  : 'text-[#C4C8D4] hover:text-primary hover:bg-primary/10'
              )}
            >
              <LayoutList className="w-4 h-4" aria-hidden="true" />
            </ToggleGroupPrimitive.Item>
          </TooltipTrigger>
          <TooltipContent>
            <p>List view</p>
          </TooltipContent>
        </Tooltip>

        {/* Grid View Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupPrimitive.Item
              value="grid"
              aria-label="Grid view"
              className={cn(
                'flex items-center justify-center p-2 transition-all duration-200',
                'rounded-r-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                currentValue === 'grid'
                  ? 'bg-primary text-white'
                  : 'text-[#C4C8D4] hover:text-primary hover:bg-primary/10'
              )}
            >
              <LayoutGrid className="w-4 h-4" aria-hidden="true" />
            </ToggleGroupPrimitive.Item>
          </TooltipTrigger>
          <TooltipContent>
            <p>Grid view</p>
          </TooltipContent>
        </Tooltip>
      </ToggleGroupPrimitive.Root>
    </TooltipProvider>
  )
})

ViewModeToggle.displayName = 'ViewModeToggle'
