'use client';

/**
 * Dialog Component - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 */

import * as React from 'react'
import { Dialog } from '@base-ui-components/react/dialog'
import { cn } from '../utils/cn'

/**
 * Dialog Root Component
 */
const DialogRoot = Dialog.Root

/**
 * Dialog Trigger - Opens the dialog
 */
const DialogTrigger = React.forwardRef<
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
DialogTrigger.displayName = 'DialogTrigger'

/**
 * Dialog Popup - The modal content container
 * Using DialogPopup instead of DialogContent (Coss UI convention)
 */
const DialogPopup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Dialog.Portal>
    <Dialog.Backdrop className="fixed inset-0 z-50 bg-[#00070F]/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <Dialog.Popup
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]',
        'bg-[#00111A]/[0.72] backdrop-blur-xl border border-primary/20 rounded-lg shadow-lg shadow-primary/10',
        'p-6 duration-200',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
        'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        className
      )}
      {...props}
    >
      {children}
    </Dialog.Popup>
  </Dialog.Portal>
))
DialogPopup.displayName = 'DialogPopup'

/**
 * Dialog Header - Container for title and description
 */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

/**
 * Dialog Footer - Container for action buttons
 */
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

/**
 * Dialog Title - Accessible title for the dialog
 */
const DialogTitle = React.forwardRef<
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
DialogTitle.displayName = 'DialogTitle'

/**
 * Dialog Description - Accessible description for the dialog
 */
const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn('text-sm text-[#C4C8D4] font-sans font-light', className)}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

/**
 * Dialog Close - Close button for the dialog
 *
 * Usage:
 * - Without children: renders default styled close button
 * - With children: wraps children with close functionality (children should be a button)
 */
const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { render?: React.ReactElement }
>(({ className, render, children, ...props }, ref) => {
  // If render prop or children provided, use them as the rendered element
  if (render || children) {
    const element = render || (children as React.ReactElement)
    return (
      <Dialog.Close
        render={React.cloneElement(element, {
          ...element.props,
          ...props,
          ref,
          className: cn(element.props?.className, className),
        })}
      />
    )
  }

  // Default close button
  return (
    <Dialog.Close
      render={
        <button
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2',
            'h-8 text-sm',
            'bg-card/70 text-primary border border-primary/30 backdrop-blur-sm font-sans font-medium',
            'hover:bg-primary/10 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15',
            'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            'active:scale-95 disabled:pointer-events-none disabled:opacity-50',
            className
          )}
          {...props}
        >
          Close
        </button>
      }
    />
  )
})
DialogClose.displayName = 'DialogClose'

export {
  DialogRoot as Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
