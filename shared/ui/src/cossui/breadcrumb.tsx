/**
 * Breadcrumb Component - Ozean Licht Edition
 * Based on Coss UI with Ozean Licht design system styling
 *
 * Semantic breadcrumb navigation with ARIA attributes.
 * Supports link rendering via render prop pattern.
 */

import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../utils/cn'

/**
 * Breadcrumb - Root container
 * Provides semantic <nav> element with ARIA label
 */
const Breadcrumb = React.forwardRef<
  HTMLNavElement,
  React.HTMLAttributes<HTMLNavElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    aria-label="breadcrumb"
    className={cn('relative', className)}
    {...props}
  />
))
Breadcrumb.displayName = 'Breadcrumb'

/**
 * BreadcrumbList - Ordered list of breadcrumb items
 * Semantic <ol> element for proper HTML structure
 */
const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn('flex flex-wrap items-center gap-2', className)}
    {...props}
  />
))
BreadcrumbList.displayName = 'BreadcrumbList'

/**
 * BreadcrumbItem - Individual breadcrumb item
 * Semantic <li> element for proper HTML structure
 */
const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('inline-flex items-center gap-2', className)}
    {...props}
  />
))
BreadcrumbItem.displayName = 'BreadcrumbItem'

/**
 * BreadcrumbLink - Navigable breadcrumb link
 * Supports render prop for custom link components (e.g., Next.js Link)
 *
 * @example
 * // With anchor tag
 * <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
 *
 * // With Next.js Link
 * <BreadcrumbLink render={<Link href="/docs" />}>Documentation</BreadcrumbLink>
 */
export interface BreadcrumbLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Render prop to wrap the link (replaces asChild from shadcn/ui)
   * Example: <BreadcrumbLink render={<Link href="/docs" />}>Docs</BreadcrumbLink>
   */
  render?: React.ReactElement
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, render, children, ...props }, ref) => {
    const baseStyles = cn(
      'text-[#0ec2bc] font-sans font-medium transition-all duration-200',
      'hover:underline hover:text-[#0ec2bc]/90',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0ec2bc]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'active:scale-95',
      className
    )

    // If render prop is provided, clone the element and apply styles
    if (render) {
      return React.cloneElement(render, {
        ...render.props,
        className: cn(baseStyles, render.props.className),
        ref,
        ...props,
        children,
      })
    }

    // Otherwise, use standard anchor tag
    return (
      <a ref={ref} className={baseStyles} {...props}>
        {children}
      </a>
    )
  }
)
BreadcrumbLink.displayName = 'BreadcrumbLink'

/**
 * BreadcrumbPage - Current page indicator
 * Shows the current page in the breadcrumb trail
 * Uses aria-current="page" for accessibility
 *
 * @example
 * <BreadcrumbItem>
 *   <BreadcrumbPage>Current Page</BreadcrumbPage>
 * </BreadcrumbItem>
 */
const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="doc-pagebreak"
    aria-current="page"
    className={cn(
      'text-[#C4C8D4] font-sans font-medium',
      'flex items-center gap-2',
      className
    )}
    {...props}
  />
))
BreadcrumbPage.displayName = 'BreadcrumbPage'

/**
 * BreadcrumbSeparator - Visual separator between breadcrumb items
 * Default separator is a chevron right icon
 * Can be customized with custom icon or text
 *
 * @example
 * // Default (chevron right)
 * <BreadcrumbSeparator />
 *
 * // Custom text separator
 * <BreadcrumbSeparator>/</BreadcrumbSeparator>
 */
export interface BreadcrumbSeparatorProps
  extends React.HTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode
}

const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ className, children, ...props }, ref) => (
  <li
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={cn('flex items-center gap-2', className)}
    {...props}
  >
    {children ?? (
      <ChevronRight className="h-4 w-4 text-[#C4C8D4] shrink-0" />
    )}
  </li>
))
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

/**
 * BreadcrumbEllipsis - Ellipsis indicator for collapsed breadcrumb items
 * Used to indicate there are more breadcrumb items that aren't shown
 *
 * @example
 * <BreadcrumbItem>
 *   <BreadcrumbEllipsis />
 * </BreadcrumbItem>
 */
const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={cn(
      'flex h-8 w-8 items-center justify-center text-[#C4C8D4]',
      className
    )}
    {...props}
  >
    <span className="text-lg font-semibold leading-none">…</span>
  </span>
))
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
