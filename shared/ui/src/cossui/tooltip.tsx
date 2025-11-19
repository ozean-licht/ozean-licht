/**
 * Tooltip Component - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 */

import * as React from 'react'
import { Tooltip as BaseTooltip } from '@base-ui-components/react/tooltip'
import { cn } from '../utils/cn'

/**
 * Tooltip Provider - Wraps multiple tooltips for instant display
 * Use this to group tooltips that should open instantly after the first opens
 */
const TooltipProvider = BaseTooltip.Provider

/**
 * Tooltip Root Component
 */
const Tooltip = BaseTooltip.Root

/**
 * Tooltip Trigger - Element that shows the tooltip on hover
 */
const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Trigger> & {
    render?: React.ReactElement
  }
>(({ className, render, children, ...props }, ref) => {
  if (render) {
    return (
      <BaseTooltip.Trigger>
        {React.cloneElement(render, {
          ...render.props,
          ...props,
          ref,
          children: children || render.props.children,
        })}
      </BaseTooltip.Trigger>
    )
  }

  return (
    <BaseTooltip.Trigger
      ref={ref}
      className={cn('cursor-help', className)}
      {...props}
    >
      {children}
    </BaseTooltip.Trigger>
  )
})
TooltipTrigger.displayName = 'TooltipTrigger'

/**
 * Tooltip Popup - The tooltip content
 * Using TooltipPopup instead of TooltipContent (Coss UI convention)
 */
const TooltipPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Popup> & {
    sideOffset?: number
  }
>(({ className, children, sideOffset = 4, ...props }, ref) => (
  <BaseTooltip.Popup
    ref={ref}
    className={cn(
      'z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs',
      'bg-card/95 backdrop-blur-16 border border-primary/30',
      'text-[#C4C8D4] font-sans font-light',
      'shadow-md shadow-primary/20',
      'animate-in fade-in-0 zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    style={{
      marginTop: sideOffset,
    }}
    {...props}
  >
    {children}
  </BaseTooltip.Popup>
))
TooltipPopup.displayName = 'TooltipPopup'

/**
 * Tooltip Content - Alias for TooltipPopup (for shadcn/ui compatibility)
 * Use TooltipPopup for new code following Coss UI conventions
 */
const TooltipContent = TooltipPopup

/**
 * Tooltip Arrow - Optional arrow pointing to the trigger
 */
const TooltipArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Arrow>
>(({ className, ...props }, ref) => (
  <BaseTooltip.Arrow
    ref={ref}
    className={cn('fill-card border-primary/30', className)}
    {...props}
  />
))
TooltipArrow.displayName = 'TooltipArrow'

export {
  Tooltip,
  TooltipTrigger,
  TooltipPopup,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
}
