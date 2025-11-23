/**
 * Sheet (Drawer) Component - Ozean Licht Edition
 * Based on Coss UI (Base UI Dialog) with Ozean Licht design system
 * Sheet slides in from the edge of the screen (left, right, top, bottom)
 */

import * as React from 'react'
import { Dialog } from '@base-ui-components/react/dialog'
import { cn } from '../utils/cn'

/**
 * Sheet Root Component
 */
const SheetRoot = Dialog.Root

type SheetPosition = 'left' | 'right' | 'top' | 'bottom'
type SheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: SheetPosition
  size?: SheetSize
}

/**
 * Sheet Trigger - Opens the sheet
 */
const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { render?: React.ReactElement }
>(({ className, render, children, ...props }, ref) => {
  if (render) {
    return React.cloneElement(render, {
      ...render.props,
      ...props,
      ref,
      children: children || render.props.children,
    })
  }

  return (
    <Dialog.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2',
        'bg-primary text-white font-sans font-medium transition-all',
        'hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/15',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'active:scale-95 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </Dialog.Trigger>
  )
})
SheetTrigger.displayName = 'SheetTrigger'

/**
 * Get size classes based on position and size prop
 */
const getSizeClasses = (position: SheetPosition, size: SheetSize) => {
  const isVertical = position === 'top' || position === 'bottom'

  if (size === 'full') {
    return isVertical ? 'h-screen' : 'w-screen'
  }

  if (isVertical) {
    switch (size) {
      case 'sm': return 'h-1/4'
      case 'md': return 'h-1/3'
      case 'lg': return 'h-1/2'
      case 'xl': return 'h-3/4'
      default: return 'h-1/3'
    }
  } else {
    switch (size) {
      case 'sm': return 'w-80'
      case 'md': return 'w-96'
      case 'lg': return 'w-[32rem]'
      case 'xl': return 'w-[48rem]'
      default: return 'w-96'
    }
  }
}

/**
 * Get position classes
 */
const getPositionClasses = (position: SheetPosition) => {
  switch (position) {
    case 'left':
      return 'top-0 left-0 h-full'
    case 'right':
      return 'top-0 right-0 h-full'
    case 'top':
      return 'top-0 left-0 w-full'
    case 'bottom':
      return 'bottom-0 left-0 w-full'
    default:
      return 'top-0 right-0 h-full'
  }
}

/**
 * Get animation classes
 */
const getAnimationClasses = (position: SheetPosition) => {
  switch (position) {
    case 'left':
      return cn(
        'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        'data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0'
      )
    case 'right':
      return cn(
        'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
        'data-[state=closed]:translate-x-full data-[state=open]:translate-x-0'
      )
    case 'top':
      return cn(
        'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        'data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0'
      )
    case 'bottom':
      return cn(
        'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        'data-[state=closed]:translate-y-full data-[state=open]:translate-y-0'
      )
    default:
      return ''
  }
}

/**
 * Sheet Content - The sliding panel container
 */
const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, children, position = 'right', size = 'md', ...props }, ref) => (
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-50 bg-[#00070F]/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Popup
        ref={ref}
        className={cn(
          'fixed z-50',
          'bg-[#00111A]/95 backdrop-blur-[12px] border shadow-lg shadow-primary/10',
          'duration-300 transition-transform',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          getPositionClasses(position),
          getSizeClasses(position, size),
          getAnimationClasses(position),
          position === 'left' && 'border-r border-primary/20',
          position === 'right' && 'border-l border-primary/20',
          position === 'top' && 'border-b border-primary/20 rounded-b-lg',
          position === 'bottom' && 'border-t border-primary/20 rounded-t-lg',
          className
        )}
        {...props}
      >
        <div className="flex flex-col h-full">
          {children}
        </div>
      </Dialog.Popup>
    </Dialog.Portal>
  )
)
SheetContent.displayName = 'SheetContent'

/**
 * Sheet Header - Container for title and description
 */
const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 p-6 border-b border-primary/10',
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = 'SheetHeader'

/**
 * Sheet Footer - Container for action buttons
 */
const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t border-primary/10 mt-auto',
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = 'SheetFooter'

/**
 * Sheet Title - Accessible title for the sheet
 */
const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn(
      'font-decorative text-2xl font-normal leading-none tracking-tight text-white',
      className
    )}
    {...props}
  />
))
SheetTitle.displayName = 'SheetTitle'

/**
 * Sheet Description - Accessible description for the sheet
 */
const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn('text-sm text-[#C4C8D4] font-sans font-light', className)}
    {...props}
  />
))
SheetDescription.displayName = 'SheetDescription'

/**
 * Sheet Close - Close button for the sheet
 */
const SheetClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { render?: React.ReactElement }
>(({ className, render, children, ...props }, ref) => {
  if (render) {
    return (
      <Dialog.Close>
        {React.cloneElement(render, {
          ...render.props,
          ...props,
          ref,
          children: children || render.props.children,
        })}
      </Dialog.Close>
    )
  }

  return (
    <Dialog.Close
      render={
        <button
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2',
            'h-9 text-sm',
            'bg-card/70 text-primary border border-primary/30 backdrop-blur-12 font-sans font-medium',
            'hover:bg-primary/10 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15',
            'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            'active:scale-95 disabled:pointer-events-none disabled:opacity-50',
            className
          )}
          {...props}
        >
          {children || 'Close'}
        </button>
      }
    />
  )
})
SheetClose.displayName = 'SheetClose'

export {
  SheetRoot as Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
}

export type { SheetPosition, SheetSize }
