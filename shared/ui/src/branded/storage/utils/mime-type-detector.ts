/**
 * MIME Type Detector
 *
 * Utility functions for detecting and working with MIME types
 */

import { EXTENSION_TO_MIME, FILE_TYPE_MAPPINGS } from '../constants'
import type { FileTypeCategory } from '../types'

/**
 * Get MIME type from file extension
 *
 * @param filename - File name or path
 * @returns MIME type string, or 'application/octet-stream' if unknown
 *
 * @example
 * getMimeType("document.pdf") // "application/pdf"
 * getMimeType("image.jpg") // "image/jpeg"
 * getMimeType("unknown.xyz") // "application/octet-stream"
 */
export function getMimeType(filename: string): string {
  const extension = getFileExtension(filename)
  if (!extension) return 'application/octet-stream'

  return EXTENSION_TO_MIME[extension] || 'application/octet-stream'
}

/**
 * Get file extension from filename
 *
 * @param filename - File name or path
 * @returns File extension (lowercase, without dot), or empty string if none
 *
 * @example
 * getFileExtension("document.pdf") // "pdf"
 * getFileExtension("archive.tar.gz") // "gz"
 * getFileExtension("no-extension") // ""
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1 || lastDot === 0) return ''

  return filename.slice(lastDot + 1).toLowerCase()
}

/**
 * Get file name without extension
 *
 * @param filename - File name or path
 * @returns File name without extension
 *
 * @example
 * getFileNameWithoutExtension("document.pdf") // "document"
 * getFileNameWithoutExtension("archive.tar.gz") // "archive.tar"
 */
export function getFileNameWithoutExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1 || lastDot === 0) return filename

  return filename.slice(0, lastDot)
}

/**
 * Categorize file type based on MIME type
 *
 * @param mimeType - MIME type string
 * @returns File type category
 *
 * @example
 * categorizeFileType("image/jpeg") // "image"
 * categorizeFileType("application/pdf") // "document"
 * categorizeFileType("application/unknown") // "unknown"
 */
export function categorizeFileType(mimeType: string): FileTypeCategory {
  const normalizedMimeType = mimeType.toLowerCase().trim()

  // Check each category
  for (const [category, mimeTypes] of Object.entries(FILE_TYPE_MAPPINGS)) {
    if (mimeTypes.includes(normalizedMimeType)) {
      return category as FileTypeCategory
    }
  }

  return 'unknown'
}

/**
 * Categorize file by filename
 *
 * @param filename - File name or path
 * @returns File type category
 *
 * @example
 * categorizeFile("photo.jpg") // "image"
 * categorizeFile("video.mp4") // "video"
 * categorizeFile("document.pdf") // "document"
 */
export function categorizeFile(filename: string): FileTypeCategory {
  const mimeType = getMimeType(filename)
  return categorizeFileType(mimeType)
}

/**
 * Check if file is an image
 *
 * @param mimeType - MIME type string
 * @returns True if image type
 *
 * @example
 * isImageType("image/jpeg") // true
 * isImageType("video/mp4") // false
 */
export function isImageType(mimeType: string): boolean {
  return categorizeFileType(mimeType) === 'image'
}

/**
 * Check if file is a video
 *
 * @param mimeType - MIME type string
 * @returns True if video type
 */
export function isVideoType(mimeType: string): boolean {
  return categorizeFileType(mimeType) === 'video'
}

/**
 * Check if file is a document
 *
 * @param mimeType - MIME type string
 * @returns True if document type
 */
export function isDocumentType(mimeType: string): boolean {
  return categorizeFileType(mimeType) === 'document'
}

/**
 * Check if file is an archive
 *
 * @param mimeType - MIME type string
 * @returns True if archive type
 */
export function isArchiveType(mimeType: string): boolean {
  return categorizeFileType(mimeType) === 'archive'
}

/**
 * Check if file is audio
 *
 * @param mimeType - MIME type string
 * @returns True if audio type
 */
export function isAudioType(mimeType: string): boolean {
  return categorizeFileType(mimeType) === 'audio'
}

/**
 * Check if file is code
 *
 * @param mimeType - MIME type string
 * @returns True if code type
 */
export function isCodeType(mimeType: string): boolean {
  return categorizeFileType(mimeType) === 'code'
}

/**
 * Check if file can be previewed inline
 *
 * @param mimeType - MIME type string
 * @param maxSize - Maximum file size for preview (bytes)
 * @param fileSize - Actual file size (bytes)
 * @returns True if file can be previewed
 *
 * @example
 * canPreview("image/jpeg", 50_000_000, 1_000_000) // true
 * canPreview("application/zip", 50_000_000, 1_000_000) // false
 * canPreview("image/jpeg", 50_000_000, 60_000_000) // false
 */
export function canPreview(
  mimeType: string,
  maxSize: number = 50 * 1024 * 1024,
  fileSize?: number
): boolean {
  // Check file size limit
  if (fileSize !== undefined && fileSize > maxSize) {
    return false
  }

  // Only images, videos, and PDFs can be previewed
  const category = categorizeFileType(mimeType)
  return ['image', 'video'].includes(category) || mimeType === 'application/pdf'
}

/**
 * Check if file needs thumbnail
 *
 * @param mimeType - MIME type string
 * @returns True if thumbnail should be generated
 *
 * @example
 * needsThumbnail("image/jpeg") // true
 * needsThumbnail("video/mp4") // true
 * needsThumbnail("application/pdf") // false
 */
export function needsThumbnail(mimeType: string): boolean {
  const category = categorizeFileType(mimeType)
  return ['image', 'video'].includes(category)
}

/**
 * Get human-readable file type label
 *
 * @param mimeType - MIME type string
 * @returns Human-readable label
 *
 * @example
 * getFileTypeLabel("image/jpeg") // "JPEG Image"
 * getFileTypeLabel("video/mp4") // "MP4 Video"
 * getFileTypeLabel("application/pdf") // "PDF Document"
 */
export function getFileTypeLabel(mimeType: string): string {
  const parts = mimeType.split('/')
  if (parts.length !== 2) return 'Unknown File'

  const [type, subtype] = parts
  const extension = subtype.toUpperCase()

  switch (type) {
    case 'image':
      return `${extension} Image`
    case 'video':
      return `${extension} Video`
    case 'audio':
      return `${extension} Audio`
    case 'application':
      if (subtype === 'pdf') return 'PDF Document'
      if (subtype.includes('zip')) return 'ZIP Archive'
      if (subtype.includes('json')) return 'JSON File'
      return `${extension} File`
    case 'text':
      if (subtype === 'plain') return 'Text File'
      if (subtype === 'html') return 'HTML Document'
      return `${extension.toUpperCase()} File`
    default:
      return 'Unknown File'
  }
}

/**
 * Validate file type against allowed types
 *
 * @param mimeType - MIME type string
 * @param allowedTypes - Array of allowed MIME types or patterns
 * @returns True if file type is allowed
 *
 * @example
 * validateFileType("image/jpeg", ["image/*"]) // true
 * validateFileType("video/mp4", ["image/*", "video/*"]) // true
 * validateFileType("application/zip", ["image/*"]) // false
 */
export function validateFileType(
  mimeType: string,
  allowedTypes: string[]
): boolean {
  if (allowedTypes.length === 0) return true

  return allowedTypes.some((allowed) => {
    // Exact match
    if (allowed === mimeType) return true

    // Wildcard match (e.g., "image/*")
    if (allowed.endsWith('/*')) {
      const prefix = allowed.slice(0, -2)
      return mimeType.startsWith(prefix + '/')
    }

    return false
  })
}
