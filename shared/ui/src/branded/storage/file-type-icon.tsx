'use client';

/**
 * File Type Icon Component
 *
 * Displays appropriate icon for file type with Ozean Licht styling
 */

import React from 'react'
import { cn } from '../../utils'
import {
  getIconForFile,
  getIconColorForFile,
  getIconSize,
  type IconSize,
} from './utils/file-icon-mapper'
import { categorizeFile } from './utils/mime-type-detector'
import type { FileTypeCategory } from './types'

export interface FileTypeIconProps {
  /** Filename or file path */
  filename?: string
  /** MIME type (alternative to filename) */
  mimeType?: string
  /** File type category (alternative to filename/mimeType) */
  category?: FileTypeCategory
  /** Whether the item is a folder */
  isFolder?: boolean
  /** Whether the folder is open (only for folders) */
  isOpen?: boolean
  /** Icon size preset */
  size?: IconSize
  /** Custom CSS classes */
  className?: string
  /** Accessible label */
  'aria-label'?: string
}

/**
 * FileTypeIcon Component
 *
 * Displays the appropriate Lucide icon for a file type with Ozean Licht branding.
 * Icons are colored based on file category (primary turquoise for images/videos/folders).
 *
 * @example
 * // By filename
 * <FileTypeIcon filename="photo.jpg" size="md" />
 *
 * @example
 * // Folder icon
 * <FileTypeIcon filename="My Folder" isFolder isOpen size="lg" />
 *
 * @example
 * // By category
 * <FileTypeIcon category="video" size="xl" />
 */
export const FileTypeIcon = React.forwardRef<SVGSVGElement, FileTypeIconProps>(
  (
    {
      filename,
      mimeType,
      category,
      isFolder = false,
      isOpen = false,
      size = 'md',
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    // Determine icon and color
    let IconComponent
    let iconColor

    if (category) {
      // Use provided category
      const { getIconForCategory, getIconColor } = require('./utils/file-icon-mapper')
      IconComponent = getIconForCategory(category, isOpen)
      iconColor = getIconColor(category)
    } else if (filename) {
      // Determine from filename
      IconComponent = getIconForFile(filename, isFolder, isOpen)
      iconColor = getIconColorForFile(filename, isFolder)
    } else if (mimeType) {
      // Determine from MIME type
      const { getIconForMimeType, getIconColorForMimeType } = require('./utils/file-icon-mapper')
      IconComponent = getIconForMimeType(mimeType)
      iconColor = getIconColorForMimeType(mimeType)
    } else {
      // Fallback to generic file icon
      const { File } = require('lucide-react')
      IconComponent = File
      iconColor = 'text-[#C4C8D4]'
    }

    // Determine accessible label
    const label =
      ariaLabel ||
      (() => {
        if (isFolder) return isOpen ? 'Open folder' : 'Folder'
        if (category) return `${category} file`
        if (filename) {
          const fileCategory = categorizeFile(filename)
          return `${fileCategory} file: ${filename}`
        }
        return 'File'
      })()

    return (
      <IconComponent
        ref={ref}
        className={cn(getIconSize(size), iconColor, className)}
        aria-label={label}
        {...props}
      />
    )
  }
)

FileTypeIcon.displayName = 'FileTypeIcon'
