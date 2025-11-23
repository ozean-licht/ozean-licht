/**
 * Toast Component - Ozean Licht Edition
 * Based on Coss UI with Ozean Licht design system
 * Uses Radix UI Toast primitives for accessibility and functionality
 */

'use client'

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '../utils/cn'

/**
 * Toast Provider - Required wrapper for toast functionality
 * Manages the toast queue and context
 */
const ToastProvider = ToastPrimitives.Provider

/**
 * Toast Viewport - Container for rendered toasts
 * Positions toasts in the viewport with proper z-index
 */
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> & {
    position?: 'top' | 'top-right' | 'bottom' | 'bottom-right'
  }
>(({ className, position = 'top-right', ...props }, ref) => {
  const positionClasses = {
    top: 'top-0 left-0 right-0 flex flex-col',
    'top-right': 'top-0 right-0 flex flex-col',
    bottom: 'bottom-0 left-0 right-0 flex flex-col-reverse',
    'bottom-right': 'bottom-0 right-0 flex flex-col-reverse',
  }

  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        'fixed z-[100] flex max-h-screen w-full p-4 sm:max-w-[420px]',
        positionClasses[position],
        className
      )}
      {...props}
    />
  )
})
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

/**
 * Toast variants using CVA
 * Supports 5 variants: default, success, warning, destructive, info
 * Each with appropriate glass morphism styling
 */
const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center gap-4 overflow-hidden rounded-lg border px-4 py-3 pr-8 backdrop-blur-12 transition-all duration-200 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full data-[state=closed]:fade-out-80 sm:data-[state=open]:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        // Default variant: primary color with glass morphism
        default:
          'border-primary/50 bg-gradient-to-br from-[#0ec2bc]/15 to-[#0ec2bc]/5 text-foreground shadow-lg shadow-primary/10',
        // Success variant: emerald green
        success:
          'border-[#10B981]/50 bg-gradient-to-br from-[#10B981]/15 to-[#10B981]/5 text-[#10B981] shadow-lg shadow-[#10B981]/10',
        // Warning variant: amber/orange
        warning:
          'border-[#F59E0B]/50 bg-gradient-to-br from-[#F59E0B]/15 to-[#F59E0B]/5 text-[#F59E0B] shadow-lg shadow-[#F59E0B]/10',
        // Destructive variant: red
        destructive:
          'border-[#EF4444]/50 bg-gradient-to-br from-[#EF4444]/15 to-[#EF4444]/5 text-[#EF4444] shadow-lg shadow-[#EF4444]/10',
        // Info variant: blue
        info:
          'border-[#3B82F6]/50 bg-gradient-to-br from-[#3B82F6]/15 to-[#3B82F6]/5 text-[#3B82F6] shadow-lg shadow-[#3B82F6]/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

/**
 * Toast Root Component
 * Wraps the toast content with variant styling and animations
 */
const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
))
Toast.displayName = ToastPrimitives.Root.displayName

/**
 * Toast Title Component
 * Displays the main message of the toast
 * Uses semibold font for hierarchy
 */
const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('font-sans font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

/**
 * Toast Description Component
 * Secondary content for additional information
 * Uses lighter font weight for visual hierarchy
 */
const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm font-sans font-light opacity-90', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

/**
 * Toast Close Button
 * Manually dismisses the toast
 * Shows on hover with primary color and smooth transitions
 * Hidden by default, visible on group hover
 */
const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-md',
      'text-foreground/50 opacity-0 transition-all duration-200',
      'hover:bg-primary/10 hover:text-primary',
      'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'group-hover:opacity-100',
      'active:scale-95',
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

/**
 * Toast Action Button
 * Optional action button within the toast
 * Styled with primary color and glass morphism
 */
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md',
      'border border-primary/30 bg-card/70 px-3 text-sm font-medium',
      'text-primary backdrop-blur-8',
      'transition-all duration-200',
      'hover:bg-primary/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/15',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'active:scale-95',
      'disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

/**
 * Type exports for usage in hooks and external code
 */
type ToastProps = React.ComponentPropsWithoutRef<typeof Toast> &
  VariantProps<typeof toastVariants>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  toastVariants,
}
