/**
 * Empty Component - Ozean Licht Edition
 * Based on Coss UI patterns with Ozean Licht design system
 *
 * Provides empty state components for various scenarios:
 * - No data in tables
 * - No search results
 * - No notifications
 * - Empty folders/collections
 * - 404 and error states
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

// SVG Icons for Empty States
const InboxIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-16 h-16', className)}
  >
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
)

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-16 h-16', className)}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const FileIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-16 h-16', className)}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

const FolderIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-16 h-16', className)}
  >
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
  </svg>
)

const PackageIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-16 h-16', className)}
  >
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
)

const BellIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-16 h-16', className)}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
)

const ShoppingCartIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-16 h-16', className)}
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
)

const MessageSquareIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-16 h-16', className)}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-16 h-16', className)}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const AlertCircleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-16 h-16', className)}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
)

const LockIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-16 h-16', className)}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-16 h-16', className)}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const emptyRootVariants = cva(
  'flex flex-col items-center justify-center text-center transition-all',
  {
    variants: {
      size: {
        sm: 'py-8 px-4',
        md: 'py-12 px-6',
        lg: 'py-16 px-8',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const emptyIconVariants = cva('text-primary mb-4 transition-all', {
  variants: {
    size: {
      sm: 'w-12 h-12',
      md: 'w-16 h-16',
      lg: 'w-24 h-24',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const emptyTitleVariants = cva(
  'font-decorative font-normal leading-none tracking-tight text-white mb-2',
  {
    variants: {
      size: {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const emptyDescriptionVariants = cva('text-[#C4C8D4] font-sans font-light mb-6', {
  variants: {
    size: {
      sm: 'text-xs max-w-xs',
      md: 'text-sm max-w-sm',
      lg: 'text-base max-w-md',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// EmptyRoot - Main container
export interface EmptyRootProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyRootVariants> {}

const EmptyRoot = React.forwardRef<HTMLDivElement, EmptyRootProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn(emptyRootVariants({ size }), className)}
      {...props}
    />
  )
)
EmptyRoot.displayName = 'EmptyRoot'

// EmptyIcon - Icon display
export interface EmptyIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyIconVariants> {}

const EmptyIcon = React.forwardRef<HTMLDivElement, EmptyIconProps>(
  ({ className, size, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(emptyIconVariants({ size }), className)}
      {...props}
    >
      {children}
    </div>
  )
)
EmptyIcon.displayName = 'EmptyIcon'

// EmptyTitle - Title text
export interface EmptyTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof emptyTitleVariants> {}

const EmptyTitle = React.forwardRef<HTMLHeadingElement, EmptyTitleProps>(
  ({ className, size, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(emptyTitleVariants({ size }), className)}
      {...props}
    />
  )
)
EmptyTitle.displayName = 'EmptyTitle'

// EmptyDescription - Description text
export interface EmptyDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof emptyDescriptionVariants> {}

const EmptyDescription = React.forwardRef<HTMLParagraphElement, EmptyDescriptionProps>(
  ({ className, size, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(emptyDescriptionVariants({ size }), className)}
      {...props}
    />
  )
)
EmptyDescription.displayName = 'EmptyDescription'

// EmptyAction - Action button/link container
const EmptyAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col sm:flex-row gap-2 items-center', className)}
    {...props}
  />
))
EmptyAction.displayName = 'EmptyAction'

export {
  EmptyRoot,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  EmptyAction,
  // Export icon components
  InboxIcon,
  SearchIcon,
  FileIcon,
  FolderIcon,
  PackageIcon,
  BellIcon,
  ShoppingCartIcon,
  MessageSquareIcon,
  StarIcon,
  AlertCircleIcon,
  LockIcon,
  ClockIcon,
}
