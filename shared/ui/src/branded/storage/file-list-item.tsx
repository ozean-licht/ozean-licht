/**
 * File List Item Component
 *
 * Displays a single file as a table row with icon, name, size, date, and actions.
 * Used in table/list view of file browser.
 */

import * as React from 'react'
import { Download, Trash2, MoreVertical } from 'lucide-react'
import { cn } from '../../utils'
import { FileTypeIcon } from './file-type-icon'
import { formatFileSize } from './utils/file-size-formatter'
import { formatDate } from './utils/storage-helpers'
import { Checkbox, CheckboxIndicator } from '../../cossui/checkbox'
import { Button } from '../../cossui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'

export interface FileListItemProps {
  /** File data to display */
  file: {
    /** Unique file identifier */
    id: string
    /** Filename */
    name: string
    /** File size in bytes */
    size: number
    /** Last modified date */
    modified: Date
    /** MIME type (optional) */
    mimeType?: string
    /** Whether this is a folder */
    isFolder?: boolean
  }
  /** Whether the file is selected */
  isSelected?: boolean
  /** Callback when selection changes */
  onSelect?: (id: string) => void
  /** Callback when an action is triggered */
  onAction?: (action: 'download' | 'delete' | 'preview', fileId: string) => void
  /** Callback when the row is clicked */
  onClick?: (fileId: string) => void
  /** Whether to show the checkbox */
  showCheckbox?: boolean
  /** Custom CSS classes */
  className?: string
}

/**
 * FileListItem Component
 *
 * Displays a single file as a table row with icon, name, size, date, and actions.
 * Includes checkbox for multi-select, action buttons on hover, and glass-card effect.
 *
 * @example
 * // Basic usage
 * <FileListItem
 *   file={{
 *     id: '1',
 *     name: 'photo.jpg',
 *     size: 2500000,
 *     modified: new Date(),
 *   }}
 * />
 *
 * @example
 * // With selection and actions
 * <FileListItem
 *   file={{ id: '1', name: 'photo.jpg', size: 2500000, modified: new Date() }}
 *   isSelected
 *   showCheckbox
 *   onSelect={(id) => console.log('Selected:', id)}
 *   onAction={(action, id) => console.log('Action:', action, id)}
 * />
 */
export const FileListItem = React.forwardRef<HTMLTableRowElement, FileListItemProps>(
  (
    {
      file,
      isSelected = false,
      onSelect,
      onAction,
      onClick,
      showCheckbox = false,
      className,
    },
    ref
  ) => {
    const handleRowClick = (e: React.MouseEvent) => {
      // Don't trigger row click if clicking on checkbox, button, or dropdown
      const target = e.target as HTMLElement
      if (
        target.closest('button') ||
        target.closest('[role="checkbox"]') ||
        target.closest('[role="menu"]')
      ) {
        return
      }
      onClick?.(file.id)
    }

    const handleCheckboxChange = () => {
      onSelect?.(file.id)
    }

    const handleAction = (action: 'download' | 'delete' | 'preview') => {
      onAction?.(action, file.id)
    }

    return (
      <tr
        ref={ref}
        className={cn(
          'group',
          'border-b border-[#0E282E]/50',
          'transition-colors duration-200',
          'hover:bg-card/30 hover:backdrop-blur-12',
          onClick && 'cursor-pointer',
          className
        )}
        onClick={handleRowClick}
      >
        {/* Checkbox column (optional) */}
        {showCheckbox && (
          <td className="p-3 w-12">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleCheckboxChange}
              aria-label={`Select ${file.name}`}
            >
              <CheckboxIndicator />
            </Checkbox>
          </td>
        )}

        {/* File name column with icon */}
        <td className="p-3">
          <div className="flex items-center gap-3">
            <FileTypeIcon
              filename={file.name}
              mimeType={file.mimeType}
              isFolder={file.isFolder}
              size="md"
            />
            <span className="text-sm text-white truncate max-w-xs">
              {file.name}
            </span>
          </div>
        </td>

        {/* File size column */}
        <td className="p-3 text-sm text-[#C4C8D4]">
          {file.isFolder ? '—' : formatFileSize(file.size)}
        </td>

        {/* Modified date column (hidden on mobile) */}
        <td className="p-3 text-sm text-[#C4C8D4] hidden md:table-cell">
          {formatDate(file.modified, true)}
        </td>

        {/* Actions column */}
        <td className="p-3 w-32">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Download button (hidden on mobile, shown on hover on desktop) */}
            {!file.isFolder && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleAction('download')}
                aria-label={`Download ${file.name}`}
                className="hidden md:inline-flex"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}

            {/* Delete button (hidden on mobile, shown on hover on desktop) */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleAction('delete')}
              aria-label={`Delete ${file.name}`}
              className="hidden md:inline-flex text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            {/* More actions dropdown (always visible on mobile, hover on desktop) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`More actions for ${file.name}`}
                  className="md:hidden md:group-hover:inline-flex"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {!file.isFolder && (
                  <>
                    <DropdownMenuItem onClick={() => handleAction('preview')}>
                      <span className="text-sm">Preview</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('download')}>
                      <Download className="h-4 w-4" />
                      <span className="text-sm">Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => handleAction('delete')}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      </tr>
    )
  }
)

FileListItem.displayName = 'FileListItem'
