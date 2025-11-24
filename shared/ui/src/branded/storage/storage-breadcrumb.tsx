/**
 * Storage Breadcrumb Component
 *
 * Display file path navigation as clickable breadcrumbs for storage UI
 */

"use client"

import React from 'react'
import { Home, ChevronRight } from 'lucide-react'
import { cn } from '../../utils'
import { parsePath } from './utils/storage-helpers'

export interface StorageBreadcrumbProps {
  /** File path (e.g., "bucket/folder/subfolder") */
  path: string
  /** Navigate callback */
  onNavigate?: (path: string) => void
  /** Maximum number of segments to display (default: 5) */
  maxSegments?: number
  /** Label for home/root (default: "Home") */
  homeLabel?: string
  /** Custom CSS classes */
  className?: string
}

/**
 * StorageBreadcrumb Component
 *
 * Displays current file path as clickable breadcrumb navigation.
 * Automatically truncates long paths and provides responsive layout.
 *
 * @example
 * // Basic usage
 * <StorageBreadcrumb
 *   path="bucket/documents/photos"
 *   onNavigate={(path) => console.log('Navigate to:', path)}
 * />
 *
 * @example
 * // Deep path with truncation
 * <StorageBreadcrumb
 *   path="bucket/a/b/c/d/e/f"
 *   maxSegments={4}
 * />
 */
export const StorageBreadcrumb = React.forwardRef<HTMLElement, StorageBreadcrumbProps>(
  (
    {
      path,
      onNavigate,
      maxSegments = 5,
      homeLabel = 'Home',
      className,
      ...props
    },
    ref
  ) => {
    // Parse path into segments
    const { segments } = parsePath(path)

    // Build breadcrumb items
    const buildBreadcrumbItems = () => {
      // Always include home
      const items: { label: string; path: string; isLast: boolean }[] = [
        { label: homeLabel, path: '', isLast: segments.length === 0 },
      ]

      if (segments.length === 0) {
        return items
      }

      // If path is short enough, show all segments
      if (segments.length <= maxSegments) {
        segments.forEach((segment, index) => {
          const pathUpToHere = segments.slice(0, index + 1).join('/')
          items.push({
            label: segment,
            path: pathUpToHere,
            isLast: index === segments.length - 1,
          })
        })
      } else {
        // Show first segment
        items.push({
          label: segments[0],
          path: segments[0],
          isLast: false,
        })

        // Add ellipsis
        items.push({
          label: '...',
          path: '', // Not clickable
          isLast: false,
        })

        // Show last (maxSegments - 2) segments
        const remainingCount = maxSegments - 2 // -2 because we show first and ellipsis
        const startIndex = segments.length - remainingCount

        for (let i = startIndex; i < segments.length; i++) {
          const pathUpToHere = segments.slice(0, i + 1).join('/')
          items.push({
            label: segments[i],
            path: pathUpToHere,
            isLast: i === segments.length - 1,
          })
        }
      }

      return items
    }

    const breadcrumbItems = buildBreadcrumbItems()

    const handleClick = (itemPath: string, isLast: boolean, isEllipsis: boolean) => {
      // Don't navigate if it's the current location, ellipsis, or no callback
      if (isLast || isEllipsis || !onNavigate) return
      onNavigate(itemPath)
    }

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb navigation"
        className={cn('flex items-center', className)}
        {...props}
      >
        <ol className="flex items-center flex-wrap gap-1 text-sm font-montserrat-alt">
          {breadcrumbItems.map((item, index) => {
            const isFirst = index === 0
            const isEllipsis = item.label === '...'
            const isClickable = !item.isLast && !isEllipsis && onNavigate

            return (
              <li key={index} className="flex items-center gap-1">
                {/* Show separator before all items except first */}
                {!isFirst && (
                  <ChevronRight
                    className="w-4 h-4 text-[#C4C8D4]/50 flex-shrink-0"
                    aria-hidden="true"
                  />
                )}

                {/* Breadcrumb item */}
                {isFirst ? (
                  // Home icon
                  isClickable ? (
                    <button
                      onClick={() => handleClick(item.path, item.isLast, isEllipsis)}
                      className={cn(
                        'flex items-center gap-1.5 transition-colors',
                        'text-primary hover:underline focus:outline-none focus:underline',
                        'hidden sm:flex' // Hide on mobile, show on tablet+
                      )}
                      aria-label={`Navigate to ${homeLabel}`}
                    >
                      <Home className="w-4 h-4" aria-hidden="true" />
                      <span className="hidden md:inline">{homeLabel}</span>
                    </button>
                  ) : (
                    <span
                      className={cn(
                        'flex items-center gap-1.5',
                        item.isLast ? 'text-white font-medium' : 'text-primary',
                        'hidden sm:flex' // Hide on mobile, show on tablet+
                      )}
                    >
                      <Home className="w-4 h-4" aria-hidden="true" />
                      <span className="hidden md:inline">{homeLabel}</span>
                    </span>
                  )
                ) : isEllipsis ? (
                  // Ellipsis (not clickable)
                  <span
                    className="text-[#C4C8D4]/50 px-1 hidden sm:inline"
                    aria-hidden="true"
                  >
                    {item.label}
                  </span>
                ) : (
                  // Regular segment
                  <>
                    {isClickable ? (
                      <button
                        onClick={() => handleClick(item.path, item.isLast, isEllipsis)}
                        className={cn(
                          'transition-colors truncate max-w-[150px]',
                          'text-primary hover:underline focus:outline-none focus:underline',
                          // Show last 2 segments on mobile, all on tablet+
                          index >= breadcrumbItems.length - 2 ? 'inline' : 'hidden sm:inline'
                        )}
                        aria-label={`Navigate to ${item.label}`}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span
                        className={cn(
                          'truncate max-w-[150px]',
                          item.isLast ? 'text-white font-medium' : 'text-[#C4C8D4]',
                          // Show last 2 segments on mobile, all on tablet+
                          index >= breadcrumbItems.length - 2 ? 'inline' : 'hidden sm:inline'
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }
)

StorageBreadcrumb.displayName = 'StorageBreadcrumb'
