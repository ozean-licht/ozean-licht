'use client';

/**
 * Toast Component - Ozean Licht Edition
 * Based on Radix UI Toast with Ozean Licht design system
 *
 * Features:
 * - Five semantic variants (default, success, warning, error, info)
 * - Glass morphism effects with backdrop blur
 * - Customizable positioning (6 positions)
 * - Auto-dismiss with configurable duration
 * - Action buttons support
 * - Keyboard accessible
 * - SVG icons (no emojis)
 * - Fixed width to prevent layout collapse
 * - Progress indicator support
 */

"use client"

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

// ============================================================================
// Toast Provider
// ============================================================================

const ToastProvider = ToastPrimitives.Provider

// ============================================================================
// Toast Viewport - Container for toasts
// ============================================================================

const toastViewportVariants = cva(
  'fixed z-[100] flex max-h-screen flex-col gap-2 p-4',
  {
    variants: {
      position: {
        'top-right': 'top-0 right-0 sm:max-w-[420px]',
        'top-left': 'top-0 left-0 sm:max-w-[420px]',
        'top-center': 'top-0 left-1/2 -translate-x-1/2 sm:max-w-[420px]',
        'bottom-right': 'bottom-0 right-0 sm:max-w-[420px]',
        'bottom-left': 'bottom-0 left-0 sm:max-w-[420px]',
        'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 sm:max-w-[420px]',
      },
    },
    defaultVariants: {
      position: 'top-right',
    },
  }
)

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> &
    VariantProps<typeof toastViewportVariants>
>(({ className, position, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(toastViewportVariants({ position }), className)}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

// ============================================================================
// Toast Root - Main toast container
// ============================================================================

const toastVariants = cva(
  [
    // Layout - FIXED WIDTH to prevent collapse bug
    'group pointer-events-auto relative flex w-full min-w-[320px] max-w-[420px] flex-shrink-0',
    'items-start gap-3 overflow-hidden rounded-lg border p-4 pr-8',
    // Glass morphism effect
    'backdrop-blur-12 shadow-lg',
    // Transitions
    'transition-all duration-300',
    // Animations - slide in from position
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0',
    'data-[swipe=cancel]:translate-x-0',
    'data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
    'data-[swipe=move]:transition-none',
    'data-[state=open]:slide-in-from-top-full',
    'data-[state=closed]:slide-out-to-right-full',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-card/70 border-primary/25 text-foreground hover:border-primary/40 hover:shadow-primary/15',
        success:
          'bg-card/70 border-[#10B981]/50 text-foreground hover:border-[#10B981]/70 hover:shadow-[#10B981]/15',
        warning:
          'bg-card/70 border-[#F59E0B]/50 text-foreground hover:border-[#F59E0B]/70 hover:shadow-[#F59E0B]/15',
        error:
          'bg-card/70 border-[#EF4444]/50 text-foreground hover:border-[#EF4444]/70 hover:shadow-[#EF4444]/15',
        info:
          'bg-card/70 border-[#3B82F6]/50 text-foreground hover:border-[#3B82F6]/70 hover:shadow-[#3B82F6]/15',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

// ============================================================================
// Toast Action - Action button
// ============================================================================

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border px-3',
      'text-sm font-sans font-medium transition-all',
      'bg-transparent border-primary/30 text-primary',
      'hover:bg-primary/10 hover:border-primary/50',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
      'disabled:pointer-events-none disabled:opacity-50',
      'group-[.error]:border-[#EF4444]/40 group-[.error]:text-[#EF4444]',
      'group-[.error]:hover:bg-[#EF4444]/10 group-[.error]:hover:border-[#EF4444]/60',
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

// ============================================================================
// Toast Close - Close button with SVG icon
// ============================================================================

const CloseIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
)

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 opacity-70 transition-all',
      'text-foreground/50 hover:text-foreground',
      'hover:opacity-100 focus:opacity-100',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
      'group-hover:opacity-100',
      'group-[.error]:text-[#EF4444]/70 group-[.error]:hover:text-[#EF4444]',
      className
    )}
    toast-close=""
    aria-label="Close notification"
    {...props}
  >
    <CloseIcon />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

// ============================================================================
// Toast Title
// ============================================================================

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      'text-sm font-sans font-medium leading-none tracking-tight text-white',
      '[&+div]:text-xs',
      className
    )}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

// ============================================================================
// Toast Description
// ============================================================================

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      'text-sm font-sans font-light text-[#C4C8D4] opacity-90 [&_p]:leading-relaxed',
      className
    )}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

// ============================================================================
// Toast Icon Container
// ============================================================================

const ToastIcon = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex-shrink-0 mt-0.5', className)}
    {...props}
  >
    {children}
  </div>
)
ToastIcon.displayName = 'ToastIcon'

// ============================================================================
// Toast Content Container
// ============================================================================

const ToastContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col gap-1 flex-1', className)}
    {...props}
  />
)
ToastContent.displayName = 'ToastContent'

// ============================================================================
// Toast Progress Indicator (for auto-dismiss)
// ============================================================================

interface ToastProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

const ToastProgress = React.forwardRef<HTMLDivElement, ToastProgressProps>(
  ({ className, duration = 5000, variant = 'default', ...props }, ref) => {
    const colorMap = {
      default: 'bg-primary',
      success: 'bg-[#10B981]',
      warning: 'bg-[#F59E0B]',
      error: 'bg-[#EF4444]',
      info: 'bg-[#3B82F6]',
    }

    return (
      <div
        ref={ref}
        className={cn('absolute bottom-0 left-0 h-1 w-full overflow-hidden', className)}
        {...props}
      >
        <div
          className={cn(
            'h-full animate-toast-progress origin-left',
            colorMap[variant]
          )}
          style={{
            animationDuration: `${duration}ms`,
            animationTimingFunction: 'linear',
          }}
        />
      </div>
    )
  }
)
ToastProgress.displayName = 'ToastProgress'

// ============================================================================
// Semantic Icon Components
// ============================================================================

const SuccessIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#10B981]"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      fill="currentColor"
    />
  </svg>
)

const WarningIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#F59E0B]"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      fill="currentColor"
    />
  </svg>
)

const ErrorIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#EF4444]"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      fill="currentColor"
    />
  </svg>
)

const InfoIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#3B82F6]"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      fill="currentColor"
    />
  </svg>
)

const DefaultIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-primary"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      fill="currentColor"
    />
  </svg>
)

// ============================================================================
// Type Exports
// ============================================================================

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

// ============================================================================
// Exports with CossUI prefix
// ============================================================================

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider as CossUIToastProvider,
  ToastViewport as CossUIToastViewport,
  Toast as CossUIToast,
  ToastTitle as CossUIToastTitle,
  ToastDescription as CossUIToastDescription,
  ToastClose as CossUIToastClose,
  ToastAction as CossUIToastAction,
  ToastIcon as CossUIToastIcon,
  ToastContent as CossUIToastContent,
  ToastProgress as CossUIToastProgress,
  // Icon exports
  SuccessIcon as CossUIToastSuccessIcon,
  WarningIcon as CossUIToastWarningIcon,
  ErrorIcon as CossUIToastErrorIcon,
  InfoIcon as CossUIToastInfoIcon,
  DefaultIcon as CossUIToastDefaultIcon,
}

// Also export without prefix for convenience
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
  ToastContent,
  ToastProgress,
  SuccessIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  DefaultIcon,
}
