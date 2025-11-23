/**
 * Alert Dialog Component - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 *
 * AlertDialog is a modal dialog that interrupts the user with important content
 * and expects a response. It's commonly used for confirmations, warnings, or
 * critical information that requires user acknowledgment.
 */

import * as React from 'react'
import { AlertDialog } from '@base-ui-components/react/alert-dialog'
import { cn } from '../utils/cn'

/**
 * Alert Dialog Root Component
 */
const AlertDialogRoot = AlertDialog.Root

/**
 * Alert Dialog Trigger - Opens the alert dialog
 */
const AlertDialogTrigger = React.forwardRef<
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
    <AlertDialog.Trigger
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
    </AlertDialog.Trigger>
  )
})
AlertDialogTrigger.displayName = 'AlertDialogTrigger'

/**
 * Alert Dialog Portal - Portal for alert dialog content
 */
const AlertDialogPortal = AlertDialog.Portal

/**
 * Alert Dialog Backdrop - Backdrop overlay for alert dialog
 */
const AlertDialogBackdrop = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <AlertDialog.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-[#00070F]/80 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
AlertDialogBackdrop.displayName = 'AlertDialogBackdrop'

/**
 * Alert Dialog Content - The modal content container
 * Using AlertDialogContent instead of AlertDialogPopup for clarity (Alert Dialog convention)
 */
const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogBackdrop />
    <AlertDialog.Popup
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]',
        'bg-card/90 backdrop-blur-16 border border-primary/20 rounded-lg shadow-lg shadow-primary/10',
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
    </AlertDialog.Popup>
  </AlertDialogPortal>
))
AlertDialogContent.displayName = 'AlertDialogContent'

/**
 * Alert Dialog Header - Container for title and description
 */
const AlertDialogHeader = ({
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
AlertDialogHeader.displayName = 'AlertDialogHeader'

/**
 * Alert Dialog Footer - Container for action buttons
 */
const AlertDialogFooter = ({
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
AlertDialogFooter.displayName = 'AlertDialogFooter'

/**
 * Alert Dialog Title - Accessible title for the alert dialog
 */
const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <AlertDialog.Title
    ref={ref}
    className={cn(
      'font-decorative text-2xl font-normal leading-none tracking-tight text-white',
      className
    )}
    {...props}
  />
))
AlertDialogTitle.displayName = 'AlertDialogTitle'

/**
 * Alert Dialog Description - Accessible description for the alert dialog
 */
const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <AlertDialog.Description
    ref={ref}
    className={cn('text-sm text-[#C4C8D4] font-sans font-light', className)}
    {...props}
  />
))
AlertDialogDescription.displayName = 'AlertDialogDescription'

/**
 * Alert Dialog Action - Confirm/action button
 * The primary action button that confirms the alert dialog action
 */
const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { render?: React.ReactElement }
>(({ className, render, children, ...props }, ref) => {
  if (render) {
    return (
      <AlertDialog.Close>
        {React.cloneElement(render, {
          ...render.props,
          ...props,
          ref,
          children: children || render.props.children,
        })}
      </AlertDialog.Close>
    )
  }

  return (
    <AlertDialog.Close
      render={
        <button
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2',
            'h-8 text-sm',
            'bg-primary text-white font-sans font-medium',
            'hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/15',
            'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            'active:scale-95 disabled:pointer-events-none disabled:opacity-50',
            className
          )}
          {...props}
        >
          {children || 'Continue'}
        </button>
      }
    />
  )
})
AlertDialogAction.displayName = 'AlertDialogAction'

/**
 * Alert Dialog Cancel - Cancel button
 * The secondary action button that dismisses the alert dialog
 */
const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { render?: React.ReactElement }
>(({ className, render, children, ...props }, ref) => {
  if (render) {
    return (
      <AlertDialog.Close>
        {React.cloneElement(render, {
          ...render.props,
          ...props,
          ref,
          children: children || render.props.children,
        })}
      </AlertDialog.Close>
    )
  }

  return (
    <AlertDialog.Close
      render={
        <button
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2',
            'h-8 text-sm',
            'bg-card/70 text-primary border border-primary/30 backdrop-blur-12 font-sans font-medium',
            'hover:bg-primary/10 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15',
            'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            'active:scale-95 disabled:pointer-events-none disabled:opacity-50',
            className
          )}
          {...props}
        >
          {children || 'Cancel'}
        </button>
      }
    />
  )
})
AlertDialogCancel.displayName = 'AlertDialogCancel'

export {
  AlertDialogRoot as AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
