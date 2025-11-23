/**
 * Pagination Component - Ozean Licht Edition
 * Based on Coss UI with Ozean Licht design system
 *
 * Semantic pagination navigation with glass effect styling,
 * primary color accents, and glow effects for active states.
 */

"use client";

import * as React from "react";
import { cn } from "../utils/cn";

/**
 * Pagination Root Component
 * Semantic <nav> element for pagination navigation
 */
const Pagination = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"nav">
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    role="navigation"
    aria-label="Pagination Navigation"
    className={cn(
      "mx-auto flex w-full justify-center",
      className
    )}
    data-slot="pagination"
    {...props}
  />
));

Pagination.displayName = "Pagination";

/**
 * PaginationContent Component
 * Semantic <ul> list container for pagination items
 */
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "flex flex-row items-center gap-1",
      className
    )}
    data-slot="pagination-content"
    {...props}
  />
));

PaginationContent.displayName = "PaginationContent";

/**
 * PaginationItem Component
 * Semantic <li> wrapper for individual pagination items
 */
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("", className)}
    data-slot="pagination-item"
    {...props}
  />
));

PaginationItem.displayName = "PaginationItem";

/**
 * PaginationLink Component Props
 */
interface PaginationLinkProps extends React.ComponentProps<"a"> {
  /** Whether this is the currently active/selected page */
  isActive?: boolean;
  /** Optional render prop to compose with other components */
  render?: React.ReactElement;
}

/**
 * PaginationLink Component
 * Glass effect link button with primary border styling
 *
 * Features:
 * - Glass morphism background (card/70 with backdrop blur)
 * - Primary color border (#0ec2bc)
 * - Glow effect on hover
 * - Active page shows primary background
 * - Proper ARIA attributes for accessibility
 */
const PaginationLink = React.forwardRef<
  HTMLAnchorElement,
  PaginationLinkProps
>(
  (
    { className, isActive = false, render, children, ...props },
    ref
  ) => {
    const linkClasses = cn(
      // Base styles
      "inline-flex items-center justify-center h-9 w-9 px-3 py-2",
      "rounded-md text-sm font-sans font-medium",
      "transition-all duration-200 outline-none",
      // Focus visible
      "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      // Glass effect button with primary border
      "bg-card/70 backdrop-blur-12 border border-primary/40",
      // Disabled state
      "disabled:pointer-events-none disabled:opacity-50",
      // Hover state - glow effect
      "hover:border-primary/60 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/20",
      // Active page - primary background
      isActive && [
        "bg-primary text-white border-primary",
        "shadow-lg shadow-primary/30",
        "hover:bg-primary/90 hover:shadow-primary/40",
      ],
      className
    );

    if (render) {
      return React.cloneElement(render, {
        ref,
        "aria-current": isActive ? "page" : undefined,
        className: cn(linkClasses, render.props.className),
        ...props,
        ...render.props,
      });
    }

    return (
      <a
        ref={ref}
        aria-current={isActive ? "page" : undefined}
        className={linkClasses}
        data-slot="pagination-link"
        {...props}
      >
        {children}
      </a>
    );
  }
);

PaginationLink.displayName = "PaginationLink";

/**
 * PaginationPrevious Component
 * Navigation button to go to the previous page with left arrow icon
 *
 * Features:
 * - SVG arrow icon (not emoji)
 * - "Previous" text label
 * - Glass effect with primary border
 * - Proper ARIA label for accessibility
 * - Disabled state when on first page
 */
const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  PaginationLinkProps & { children?: React.ReactNode }
>(
  (
    { className, children, render, ...props },
    ref
  ) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      className={cn(
        "gap-2 pl-2.5 pr-3",
        className
      )}
      render={render}
      {...props}
    >
      <svg
        className="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span>
        {children || "Previous"}
      </span>
    </PaginationLink>
  )
);

PaginationPrevious.displayName = "PaginationPrevious";

/**
 * PaginationNext Component
 * Navigation button to go to the next page with right arrow icon
 *
 * Features:
 * - SVG arrow icon (not emoji)
 * - "Next" text label
 * - Glass effect with primary border
 * - Proper ARIA label for accessibility
 * - Disabled state when on last page
 */
const PaginationNext = React.forwardRef<
  HTMLAnchorElement,
  PaginationLinkProps & { children?: React.ReactNode }
>(
  (
    { className, children, render, ...props },
    ref
  ) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to next page"
      className={cn(
        "gap-2 pl-3 pr-2.5",
        className
      )}
      render={render}
      {...props}
    >
      <span>
        {children || "Next"}
      </span>
      <svg
        className="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </PaginationLink>
  )
);

PaginationNext.displayName = "PaginationNext";

/**
 * PaginationEllipsis Component
 * Visual indicator for truncated page ranges (ellipsis)
 *
 * Features:
 * - SVG three-dots icon
 * - Proper ARIA hidden (decorative only)
 * - Screen reader text for accessibility
 * - Consistent sizing with pagination links
 */
const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(
      "flex h-9 w-9 items-center justify-center",
      "text-muted-foreground cursor-default",
      className
    )}
    data-slot="pagination-ellipsis"
    {...props}
  >
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="6" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="18" cy="12" r="2" />
    </svg>
    <span className="sr-only">More pages</span>
  </span>
));

PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  type PaginationLinkProps,
};
