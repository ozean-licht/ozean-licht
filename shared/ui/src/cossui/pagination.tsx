'use client';

/**
 * Pagination Component - Ozean Licht Edition
 * Based on Coss UI patterns with Ozean Licht design system
 *
 * Semantic pagination navigation with ARIA attributes.
 * Supports link rendering via render prop pattern.
 */

import * as React from 'react'
import { cn } from '../utils/cn'

/**
 * SVG Icons for Pagination
 */
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('h-4 w-4', className)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
)

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('h-4 w-4', className)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
)

const DotsHorizontalIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('h-4 w-4', className)}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M6 12a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

/**
 * Pagination - Root container
 * Provides semantic <nav> element with ARIA label
 */
const Pagination = React.forwardRef<
  HTMLElement,
  React.ComponentProps<'nav'>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
))
Pagination.displayName = 'Pagination'

/**
 * PaginationContent - Container for pagination items
 * Semantic <ul> element for proper HTML structure
 */
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

/**
 * PaginationItem - Individual pagination item
 * Semantic <li> element for proper HTML structure
 */
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

/**
 * PaginationLink - Navigable pagination link
 * Supports render prop for custom link components (e.g., Next.js Link)
 *
 * @example
 * // With button (for onClick handlers)
 * <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
 *
 * // With anchor tag
 * <PaginationLink href="?page=1">1</PaginationLink>
 *
 * // With Next.js Link
 * <PaginationLink render={<Link href="?page=1" />}>1</PaginationLink>
 */
export interface PaginationLinkProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Render prop to wrap the link (replaces asChild from shadcn/ui)
   * Example: <PaginationLink render={<Link href="?page=1" />}>1</PaginationLink>
   */
  render?: React.ReactElement
  /**
   * Whether the pagination link is active (current page)
   */
  isActive?: boolean
  /**
   * Size variant
   */
  size?: 'default' | 'icon'
}

const PaginationLink = React.forwardRef<
  HTMLButtonElement,
  PaginationLinkProps
>(({ className, isActive, size = 'default', render, children, ...props }, ref) => {
  const baseStyles = cn(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md font-sans font-medium transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-95',
    // Size variants with proper padding to avoid overflow
    size === 'default' && 'min-w-[2.5rem] h-9 px-3 text-sm',
    size === 'icon' && 'h-9 w-9',
    // State variants
    isActive
      ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30'
      : 'bg-card/50 text-[#C4C8D4] border border-border backdrop-blur-8 hover:bg-primary/10 hover:text-primary hover:border-primary/30 hover:shadow-sm hover:shadow-primary/10',
    className
  )

  // If render prop is provided, clone the element and apply styles
  if (render) {
    return React.cloneElement(render, {
      ...render.props,
      className: cn(baseStyles, render.props.className),
      'aria-current': isActive ? 'page' : undefined,
      ref,
      ...props,
      children,
    })
  }

  // Otherwise, use button element
  return (
    <button
      ref={ref}
      aria-current={isActive ? 'page' : undefined}
      className={baseStyles}
      {...props}
    >
      {children}
    </button>
  )
})
PaginationLink.displayName = 'PaginationLink'

/**
 * PaginationPrevious - Previous page button
 * Includes proper ARIA label and icon
 *
 * @example
 * <PaginationPrevious onClick={() => setPage(p => p - 1)} disabled={page === 1} />
 * <PaginationPrevious href="?page=1">Previous</PaginationPrevious>
 */
export interface PaginationPreviousProps extends PaginationLinkProps {
  /**
   * Show label text alongside icon
   */
  showLabel?: boolean
}

const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  PaginationPreviousProps
>(({ className, showLabel = true, children, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="Go to previous page"
    size={showLabel ? 'default' : 'icon'}
    className={cn('gap-1', showLabel && 'pl-2.5', className)}
    {...props}
  >
    <ChevronLeftIcon className="text-primary" aria-hidden="true" />
    {showLabel && <span>{children || 'Previous'}</span>}
  </PaginationLink>
))
PaginationPrevious.displayName = 'PaginationPrevious'

/**
 * PaginationNext - Next page button
 * Includes proper ARIA label and icon
 *
 * @example
 * <PaginationNext onClick={() => setPage(p => p + 1)} disabled={page === totalPages} />
 * <PaginationNext href="?page=3">Next</PaginationNext>
 */
export interface PaginationNextProps extends PaginationLinkProps {
  /**
   * Show label text alongside icon
   */
  showLabel?: boolean
}

const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  PaginationNextProps
>(({ className, showLabel = true, children, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="Go to next page"
    size={showLabel ? 'default' : 'icon'}
    className={cn('gap-1', showLabel && 'pr-2.5', className)}
    {...props}
  >
    {showLabel && <span>{children || 'Next'}</span>}
    <ChevronRightIcon className="text-primary" aria-hidden="true" />
  </PaginationLink>
))
PaginationNext.displayName = 'PaginationNext'

/**
 * PaginationEllipsis - Ellipsis indicator for skipped pages
 * Used to indicate there are more pages that aren't shown
 *
 * @example
 * <PaginationItem>
 *   <PaginationEllipsis />
 * </PaginationItem>
 */
const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<'span'>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(
      'flex h-9 w-9 items-center justify-center text-[#C4C8D4]',
      className
    )}
    {...props}
  >
    <DotsHorizontalIcon className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
))
PaginationEllipsis.displayName = 'PaginationEllipsis'

/**
 * Export components with CossUI prefix to avoid conflicts
 */
export {
  Pagination as CossUIPagination,
  PaginationContent as CossUIPaginationContent,
  PaginationItem as CossUIPaginationItem,
  PaginationLink as CossUIPaginationLink,
  PaginationPrevious as CossUIPaginationPrevious,
  PaginationNext as CossUIPaginationNext,
  PaginationEllipsis as CossUIPaginationEllipsis,
}

// Also export without prefix for internal use
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
