/**
 * Table Component - Ozean Licht Edition
 * Based on Coss UI with glass morphism and Ozean Licht design system
 *
 * A semantic HTML table component with Ozean Licht styling, glass morphism effects,
 * and proper accessibility features. Uses standard HTML table elements without
 * additional Base UI dependencies.
 */

import * as React from 'react'
import { cn } from '../utils/cn'

/**
 * Table - Root component for the table structure
 * Wraps the entire table with glass morphism styling
 */
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className={cn('relative w-full overflow-auto rounded-lg', 'border border-border')}>
    <table
      ref={ref}
      className={cn(
        'w-full caption-bottom text-sm',
        'border-collapse',
        className
      )}
      {...props}
    />
  </div>
))
Table.displayName = 'Table'

/**
 * TableHeader - Container for header rows (thead)
 * Provides glass morphism background for column headers
 */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'bg-card/70 backdrop-blur-12',
      'border-b border-border',
      'sticky top-0 z-10',
      className
    )}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

/**
 * TableBody - Container for body rows (tbody)
 * Main content area of the table
 */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

/**
 * TableFooter - Container for footer rows (tfoot)
 * Optional footer section with same styling as header
 */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'bg-card/70 backdrop-blur-12',
      'border-t-2 border-border',
      'font-medium',
      className
    )}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

/**
 * TableRow - Individual row component (tr)
 * Includes hover effects with primary color glow
 * Proper WCAG AA accessibility with focus states
 */
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-border transition-all duration-200',
      'hover:bg-primary/5',
      'focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-inset',
      'data-[state=selected]:bg-primary/10',
      className
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

/**
 * TableHead - Header cell component (th)
 * Styled for column headers with appropriate text styling
 */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle',
      'font-sans font-semibold text-sm',
      'text-white',
      'bg-transparent',
      '[&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

/**
 * TableCell - Data cell component (td)
 * Includes interactive states and proper text styling
 */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-4 align-middle',
      'font-sans font-normal text-sm',
      'text-[#C4C8D4]',
      'transition-colors duration-150',
      '[&:has([role=checkbox])]:pr-0',
      'group-hover:text-primary/90',
      className
    )}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

/**
 * TableCaption - Caption component for table accessibility
 * Provides descriptive text for screen readers
 */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      'mt-4 text-sm',
      'font-sans font-light',
      'text-[#C4C8D4]',
      className
    )}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}
