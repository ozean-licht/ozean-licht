/**
 * Dialog Component
 *
 * Ozean Licht branded modal dialog with glass morphism and cosmic theme.
 * Extends shadcn Dialog primitive with turquoise branding.
 *
 * @example
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Dialog Title</DialogTitle>
 *       <DialogDescription>Dialog description text</DialogDescription>
 *     </DialogHeader>
 *     <div>Dialog content goes here</div>
 *     <DialogFooter>
 *       <Button variant="secondary">Cancel</Button>
 *       <Button>Confirm</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import {
  Dialog as ShadcnDialog,
  DialogTrigger as ShadcnDialogTrigger,
  DialogPortal as ShadcnDialogPortal,
  DialogClose as ShadcnDialogClose,
  DialogOverlay as ShadcnDialogOverlay,
} from '../ui/dialog'
import { cn } from '../utils/cn'

// Re-export primitives that don't need customization
const Dialog = ShadcnDialog
const DialogTrigger = ShadcnDialogTrigger
const DialogPortal = ShadcnDialogPortal
const DialogClose = ShadcnDialogClose

// ==================== Dialog Overlay ====================

const overlayVariants = cva(
  'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm',
  {
    variants: {
      cosmic: {
        true: 'bg-gradient-to-br from-black/90 via-[var(--primary)]/5 to-black/90',
        false: 'bg-black/80',
      },
    },
    defaultVariants: {
      cosmic: false,
    },
  }
)

export interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
    VariantProps<typeof overlayVariants> {}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, cosmic, ...props }, ref) => (
  <ShadcnDialogOverlay
    ref={ref}
    className={cn(overlayVariants({ cosmic }), className)}
    {...props}
  />
))

DialogOverlay.displayName = 'DialogOverlay'

// ==================== Dialog Content ====================

const contentVariants = cva(
  [
    'fixed left-[50%] top-[50%] z-50',
    'translate-x-[-50%] translate-y-[-50%]',
    'grid w-full max-w-lg gap-4 p-6',
    'duration-200',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
    'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
    'sm:rounded-lg',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'glass-card-strong',
        glass: 'glass-card',
        solid: 'bg-[var(--card)] border border-[var(--border)]',
      },
      glow: {
        true: 'glow',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      glow: false,
    },
  }
)

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof contentVariants> {
  /** Apply cosmic backdrop */
  cosmic?: boolean
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, variant, glow, cosmic = false, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay cosmic={cosmic} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(contentVariants({ variant, glow }), className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className={cn(
        'absolute right-4 top-4 rounded-sm',
        'opacity-70 transition-opacity hover:opacity-100',
        'ring-offset-[var(--background)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2',
        'disabled:pointer-events-none',
        'data-[state=open]:bg-[var(--accent)] data-[state=open]:text-[var(--muted-foreground)]'
      )}>
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))

DialogContent.displayName = 'DialogContent'

// ==================== Dialog Header ====================

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className
    )}
    {...props}
  />
)

DialogHeader.displayName = 'DialogHeader'

// ==================== Dialog Footer ====================

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2',
      className
    )}
    {...props}
  />
)

DialogFooter.displayName = 'DialogFooter'

// ==================== Dialog Title ====================

export interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'font-serif text-xl md:text-2xl font-semibold leading-none tracking-tight',
      'text-[var(--foreground)]',
      className
    )}
    {...props}
  />
))

DialogTitle.displayName = 'DialogTitle'

// ==================== Dialog Description ====================

export interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-[var(--muted-foreground)]', className)}
    {...props}
  />
))

DialogDescription.displayName = 'DialogDescription'

// ==================== Exports ====================

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  contentVariants,
  overlayVariants,
}
