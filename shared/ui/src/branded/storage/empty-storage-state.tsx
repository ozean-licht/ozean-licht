'use client';

/**
 * Empty Storage State Component
 *
 * Displays friendly empty state with icon, message, and call-to-action.
 * Used for empty folders, search results, or initial storage views.
 */

import React from 'react'
import { Upload, Search, FolderOpen } from 'lucide-react'
import { cn } from '../../utils'
import { Button } from '../../cossui/button'

export interface EmptyStorageStateProps {
  /** State variant to display */
  variant?: 'empty' | 'search' | 'folder'
  /** Custom title (overrides default) */
  title?: string
  /** Optional description text */
  description?: string
  /** Primary action button */
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  /** Secondary action link */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  /** Custom icon (overrides default variant icon) */
  icon?: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

// Default messages for each variant
const variantDefaults = {
  empty: {
    title: 'No files yet',
    description: 'Upload your first file to get started',
    icon: Upload,
  },
  search: {
    title: 'No results found',
    description: 'Try adjusting your search criteria',
    icon: Search,
  },
  folder: {
    title: 'This folder is empty',
    description: 'Upload files or create subfolders',
    icon: FolderOpen,
  },
}

/**
 * EmptyStorageState Component
 *
 * Displays a friendly empty state UI with icon, message, and optional actions.
 * Automatically selects appropriate icon and message based on variant.
 *
 * @example
 * // Empty folder state
 * <EmptyStorageState
 *   variant="empty"
 *   primaryAction={{
 *     label: "Upload Files",
 *     onClick: handleUpload,
 *     icon: <Upload size={16} />
 *   }}
 * />
 *
 * @example
 * // Search results empty state
 * <EmptyStorageState
 *   variant="search"
 *   secondaryAction={{
 *     label: "Clear filters",
 *     onClick: handleClearFilters
 *   }}
 * />
 *
 * @example
 * // Custom empty state
 * <EmptyStorageState
 *   title="No shared files"
 *   description="Share files with others to see them here"
 *   icon={<Share2 size={48} />}
 * />
 */
export const EmptyStorageState = React.forwardRef<
  HTMLDivElement,
  EmptyStorageStateProps
>(
  (
    {
      variant = 'empty',
      title,
      description,
      primaryAction,
      secondaryAction,
      icon,
      className,
      ...props
    },
    ref
  ) => {
    // Get defaults for the selected variant
    const defaults = variantDefaults[variant]
    const DefaultIcon = defaults.icon

    // Use custom values or fall back to defaults
    const displayTitle = title || defaults.title
    const displayDescription = description || defaults.description
    const displayIcon = icon || <DefaultIcon size={48} />

    return (
      <div
        ref={ref}
        className={cn(
          'glass-subtle rounded-lg p-12 text-center max-w-md mx-auto',
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Icon */}
          <div
            className="text-primary"
            aria-hidden="true"
          >
            {displayIcon}
          </div>

          {/* Title */}
          <h3 className="font-decorative text-2xl text-white mb-2">
            {displayTitle}
          </h3>

          {/* Description */}
          {displayDescription && (
            <p className="text-[#C4C8D4] text-sm mb-6 max-w-xs mx-auto">
              {displayDescription}
            </p>
          )}

          {/* Actions */}
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              {primaryAction && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={primaryAction.onClick}
                  className="gap-2"
                >
                  {primaryAction.icon && primaryAction.icon}
                  {primaryAction.label}
                </Button>
              )}

              {secondaryAction && (
                <Button
                  variant="link"
                  size="lg"
                  onClick={secondaryAction.onClick}
                  className="text-primary hover:text-primary/80"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
)

EmptyStorageState.displayName = 'EmptyStorageState'
