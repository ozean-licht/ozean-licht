/**
 * Storage Helpers
 *
 * Common utility functions for storage operations
 */

import { format, formatDistanceToNow } from 'date-fns'

/**
 * Parse file path into components
 *
 * @param path - File path (e.g., "bucket/folder/subfolder/file.txt")
 * @returns Path components
 *
 * @example
 * parsePath("bucket/folder/file.txt")
 * // { bucket: "bucket", folder: "folder", filename: "file.txt", fullPath: "bucket/folder/file.txt" }
 */
export function parsePath(path: string): {
  bucket: string | null
  folder: string | null
  filename: string | null
  fullPath: string
  segments: string[]
} {
  const segments = path.split('/').filter(Boolean)

  return {
    bucket: segments[0] || null,
    folder: segments.length > 2 ? segments.slice(1, -1).join('/') : null,
    filename: segments[segments.length - 1] || null,
    fullPath: path,
    segments,
  }
}

/**
 * Build file path from components
 *
 * @param bucket - Bucket name
 * @param folder - Folder path (optional)
 * @param filename - File name
 * @returns Complete file path
 *
 * @example
 * buildPath("my-bucket", "folder/subfolder", "file.txt")
 * // "my-bucket/folder/subfolder/file.txt"
 */
export function buildPath(
  bucket: string,
  folder: string | null,
  filename: string
): string {
  const parts = [bucket]
  if (folder) parts.push(folder)
  parts.push(filename)
  return parts.join('/')
}

/**
 * Get parent folder path
 *
 * @param path - Current path
 * @returns Parent folder path, or null if at root
 *
 * @example
 * getParentPath("bucket/folder/subfolder/file.txt")
 * // "bucket/folder/subfolder"
 * getParentPath("bucket/file.txt")
 * // "bucket"
 * getParentPath("bucket")
 * // null
 */
export function getParentPath(path: string): string | null {
  const segments = path.split('/').filter(Boolean)
  if (segments.length <= 1) return null

  return segments.slice(0, -1).join('/')
}

/**
 * Validate filename
 *
 * @param filename - Filename to validate
 * @returns Validation result
 *
 * @example
 * validateFilename("valid-file.txt")
 * // { valid: true, errors: [] }
 * validateFilename("invalid/file.txt")
 * // { valid: false, errors: ["Filename cannot contain '/' characters"] }
 */
export function validateFilename(filename: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check if empty
  if (!filename || filename.trim().length === 0) {
    errors.push('Filename cannot be empty')
  }

  // Check length
  if (filename.length > 255) {
    errors.push('Filename must be less than 255 characters')
  }

  // Check for invalid characters
  const invalidChars = ['/', '\\', '<', '>', ':', '"', '|', '?', '*']
  const foundInvalidChars = invalidChars.filter((char) =>
    filename.includes(char)
  )
  if (foundInvalidChars.length > 0) {
    errors.push(
      `Filename cannot contain these characters: ${foundInvalidChars.join(', ')}`
    )
  }

  // Check for reserved names (Windows)
  const reservedNames = [
    'CON',
    'PRN',
    'AUX',
    'NUL',
    'COM1',
    'COM2',
    'COM3',
    'COM4',
    'COM5',
    'COM6',
    'COM7',
    'COM8',
    'COM9',
    'LPT1',
    'LPT2',
    'LPT3',
    'LPT4',
    'LPT5',
    'LPT6',
    'LPT7',
    'LPT8',
    'LPT9',
  ]
  const nameWithoutExt = filename.split('.')[0].toUpperCase()
  if (reservedNames.includes(nameWithoutExt)) {
    errors.push(`Filename "${filename}" is reserved and cannot be used`)
  }

  // Check for leading/trailing spaces or dots
  if (filename.startsWith(' ') || filename.endsWith(' ')) {
    errors.push('Filename cannot start or end with spaces')
  }
  if (filename.startsWith('.') || filename.endsWith('.')) {
    errors.push('Filename cannot start or end with a dot')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitize filename for safe use
 *
 * @param filename - Filename to sanitize
 * @returns Sanitized filename
 *
 * @example
 * sanitizeFilename("my/invalid\\file.txt")
 * // "my-invalid-file.txt"
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[/\\<>:"|?*]/g, '-') // Replace invalid chars with dash
    .replace(/\s+/g, '-') // Replace spaces with dash
    .replace(/\.+$/, '') // Remove trailing dots
    .replace(/^\.+/, '') // Remove leading dots
    .slice(0, 255) // Limit length
}

/**
 * Generate unique filename to avoid conflicts
 *
 * @param filename - Original filename
 * @param existingFilenames - List of existing filenames
 * @returns Unique filename
 *
 * @example
 * generateUniqueFilename("file.txt", ["file.txt"])
 * // "file (1).txt"
 * generateUniqueFilename("file.txt", ["file.txt", "file (1).txt"])
 * // "file (2).txt"
 */
export function generateUniqueFilename(
  filename: string,
  existingFilenames: string[]
): string {
  if (!existingFilenames.includes(filename)) {
    return filename
  }

  const lastDot = filename.lastIndexOf('.')
  const name = lastDot !== -1 ? filename.slice(0, lastDot) : filename
  const ext = lastDot !== -1 ? filename.slice(lastDot) : ''

  let counter = 1
  let uniqueName = `${name} (${counter})${ext}`

  while (existingFilenames.includes(uniqueName)) {
    counter++
    uniqueName = `${name} (${counter})${ext}`
  }

  return uniqueName
}

/**
 * Format date for display
 *
 * @param date - Date to format
 * @param relative - Use relative time (e.g., "2 hours ago")
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date(), false) // "Nov 24, 2025 at 12:00 PM"
 * formatDate(new Date(), true) // "less than a minute ago"
 */
export function formatDate(date: Date, relative: boolean = false): string {
  if (relative) {
    return formatDistanceToNow(date, { addSuffix: true })
  }

  return format(date, 'MMM dd, yyyy \'at\' h:mm a')
}

/**
 * Truncate filename for display
 *
 * @param filename - Filename to truncate
 * @param maxLength - Maximum length
 * @returns Truncated filename
 *
 * @example
 * truncateFilename("very-long-filename-that-needs-truncation.txt", 20)
 * // "very-lon...tion.txt"
 */
export function truncateFilename(
  filename: string,
  maxLength: number = 30
): string {
  if (filename.length <= maxLength) return filename

  const lastDot = filename.lastIndexOf('.')
  const ext = lastDot !== -1 ? filename.slice(lastDot) : ''
  const name = lastDot !== -1 ? filename.slice(0, lastDot) : filename

  const availableLength = maxLength - ext.length - 3 // 3 for "..."

  if (availableLength <= 0) {
    return filename.slice(0, maxLength - 3) + '...'
  }

  const truncatedName = name.slice(0, availableLength)
  return `${truncatedName}...${ext}`
}

/**
 * Sort files and folders
 *
 * @param items - Array of file/folder items
 * @param sortBy - Sort field
 * @param sortOrder - Sort order
 * @returns Sorted array
 */
export function sortFiles<T extends { name: string; size?: number; modified?: Date; isFolder?: boolean }>(
  items: T[],
  sortBy: 'name' | 'size' | 'modified' = 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
): T[] {
  const sorted = [...items].sort((a, b) => {
    // Folders always come first
    if (a.isFolder && !b.isFolder) return -1
    if (!a.isFolder && b.isFolder) return 1

    // Then sort by specified field
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name, undefined, { numeric: true })
      case 'size':
        return (a.size || 0) - (b.size || 0)
      case 'modified':
        return (a.modified?.getTime() || 0) - (b.modified?.getTime() || 0)
      default:
        return 0
    }
  })

  return sortOrder === 'desc' ? sorted.reverse() : sorted
}

/**
 * Filter files by search query
 *
 * @param items - Array of file items
 * @param query - Search query
 * @returns Filtered array
 */
export function filterFiles<T extends { name: string }>(
  items: T[],
  query: string
): T[] {
  if (!query || query.trim().length === 0) return items

  const lowerQuery = query.toLowerCase().trim()

  return items.filter((item) =>
    item.name.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Calculate total size of multiple files
 *
 * @param items - Array of file items with size
 * @returns Total size in bytes
 */
export function calculateTotalSize<T extends { size: number }>(
  items: T[]
): number {
  return items.reduce((total, item) => total + item.size, 0)
}

/**
 * Group files by date
 *
 * @param items - Array of file items with date
 * @returns Grouped files by date category
 */
export function groupFilesByDate<T extends { modified: Date }>(
  items: T[]
): Record<string, T[]> {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)
  const lastMonth = new Date(today)
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  const groups: Record<string, T[]> = {
    Today: [],
    Yesterday: [],
    'Last 7 days': [],
    'Last 30 days': [],
    Older: [],
  }

  items.forEach((item) => {
    const itemDate = new Date(item.modified)
    if (itemDate >= today) {
      groups.Today.push(item)
    } else if (itemDate >= yesterday) {
      groups.Yesterday.push(item)
    } else if (itemDate >= lastWeek) {
      groups['Last 7 days'].push(item)
    } else if (itemDate >= lastMonth) {
      groups['Last 30 days'].push(item)
    } else {
      groups.Older.push(item)
    }
  })

  // Remove empty groups
  return Object.fromEntries(
    Object.entries(groups).filter(([, items]) => items.length > 0)
  )
}
