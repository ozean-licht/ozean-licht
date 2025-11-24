/**
 * File Grid Item Component
 *
 * Displays a single file as a card with large icon, thumbnail preview, and metadata.
 * Optimized for grid/card view with glass-card styling and Ozean Licht branding.
 */

import React from 'react'
import { Download, Eye, Trash2 } from 'lucide-react'
import { cn } from '../../utils'
import { FileTypeIcon } from './file-type-icon'
import { formatFileSize } from './utils/file-size-formatter'
import { Checkbox, CheckboxIndicator } from '../../cossui/checkbox'
import { Button } from '../../cossui/button'

export interface FileGridItemProps {
  file: {
    id: string
    name: string
    size: number
    modified: Date
    mimeType?: string
    thumbnailUrl?: string
    isFolder?: boolean
  }
  isSelected?: boolean
  onSelect?: (id: string) => void
  onAction?: (action: 'download' | 'preview' | 'delete', fileId: string) => void
  onClick?: (fileId: string) => void
  showCheckbox?: boolean
  className?: string
}

/**
 * FileGridItem Component
 *
 * Display a file as a card with:
 * - Large icon or thumbnail preview
 * - Truncated filename (max 2 lines)
 * - Formatted file size
 * - Checkbox overlay (top-left)
 * - Quick action buttons on hover (bottom-right)
 * - Glass-card styling with turquoise hover glow
 *
 * @example
 * // Basic file card
 * <FileGridItem
 *   file={{
 *     id: '1',
 *     name: 'photo.jpg',
 *     size: 2500000,
 *     modified: new Date(),
 *   }}
 * />
 *
 * @example
 * // With thumbnail and selection
 * <FileGridItem
 *   file={{
 *     id: '2',
 *     name: 'vacation.jpg',
 *     size: 3500000,
 *     modified: new Date(),
 *     thumbnailUrl: '/thumbnails/vacation.jpg',
 *   }}
 *   isSelected
 *   showCheckbox
 *   onSelect={(id) => console.log('Selected:', id)}
 * />
 *
 * @example
 * // Folder card with actions
 * <FileGridItem
 *   file={{
 *     id: '3',
 *     name: 'Documents',
 *     size: 0,
 *     modified: new Date(),
 *     isFolder: true,
 *   }}
 *   onAction={(action, id) => console.log(action, id)}
 *   onClick={(id) => console.log('Open folder:', id)}
 * />
 */
export const FileGridItem = React.forwardRef<HTMLDivElement, FileGridItemProps>(
  (
    {
      file,
      isSelected = false,
      onSelect,
      onAction,
      onClick,
      showCheckbox = true,
      className,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false)

    const handleCardClick = (e: React.MouseEvent) => {
      // Don't trigger card click if clicking on buttons or checkbox
      if (
        (e.target as HTMLElement).closest('button') ||
        (e.target as HTMLElement).closest('[role="checkbox"]')
      ) {
        return
      }

      if (onClick) {
        onClick(file.id)
      } else if (onSelect) {
        onSelect(file.id)
      }
    }

    const handleCheckboxChange = () => {
      if (onSelect) {
        onSelect(file.id)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          // Base card styling with glass effect
          'glass-card rounded-lg p-4',
          'relative overflow-hidden',
          'transition-all duration-200',
          // Hover effects
          'hover:glass-hover hover:scale-[1.02]',
          'cursor-pointer',
          // Selected state
          isSelected && 'border-2 border-primary shadow-lg shadow-primary/20',
          // Optional floating animation
          // 'animate-float',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        {...props}
      >
        {/* Checkbox overlay (top-left) */}
        {showCheckbox && (
          <div className="absolute top-2 left-2 z-10">
            <div
              className={cn(
                'rounded backdrop-blur-md bg-background/80 p-1',
                'transition-opacity duration-200',
                isHovered || isSelected ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={handleCheckboxChange}
                aria-label={`Select ${file.name}`}
              >
                <CheckboxIndicator />
              </Checkbox>
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex flex-col items-center gap-3">
          {/* Icon/Thumbnail area - aspect ratio 4:3 or square */}
          <div className="w-full aspect-square flex items-center justify-center">
            {file.thumbnailUrl ? (
              // Show thumbnail image for images
              <img
                src={file.thumbnailUrl}
                alt={file.name}
                className="w-full h-full object-cover rounded"
                loading="lazy"
              />
            ) : (
              // Show large file type icon
              <FileTypeIcon
                filename={file.name}
                mimeType={file.mimeType}
                isFolder={file.isFolder}
                size="2xl"
              />
            )}
          </div>

          {/* File metadata */}
          <div className="w-full text-center space-y-1">
            {/* Filename - truncate to 2 lines */}
            <p
              className="text-sm text-white font-medium line-clamp-2"
              title={file.name}
            >
              {file.name}
            </p>

            {/* File size - only show for files, not folders */}
            {!file.isFolder && (
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons (bottom-right) - appear on hover */}
        {onAction && (
          <div
            className={cn(
              'absolute bottom-2 right-2 z-10',
              'flex gap-1',
              'transition-opacity duration-200',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="flex gap-1 backdrop-blur-md bg-background/80 rounded p-1">
              {/* Preview button */}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction('preview', file.id)
                }}
                aria-label={`Preview ${file.name}`}
                className="h-7 w-7 hover:bg-primary/20"
              >
                <Eye className="h-4 w-4" />
              </Button>

              {/* Download button - only for files */}
              {!file.isFolder && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAction('download', file.id)
                  }}
                  aria-label={`Download ${file.name}`}
                  className="h-7 w-7 hover:bg-primary/20"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}

              {/* Delete button */}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction('delete', file.id)
                }}
                aria-label={`Delete ${file.name}`}
                className="h-7 w-7 hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }
)

FileGridItem.displayName = 'FileGridItem'
