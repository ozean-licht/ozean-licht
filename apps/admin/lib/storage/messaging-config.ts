/**
 * Messaging System Storage Configuration
 *
 * Configuration for attachment handling in the unified messaging system.
 * Defines size limits, allowed file types, thumbnail settings, and presigned URL expiry.
 */

import type { AttachmentType } from '@/types/messaging';

// ============================================================================
// Configuration Constants
// ============================================================================

/**
 * Attachment configuration for messaging system
 */
export const ATTACHMENT_CONFIG = {
  // Size limits (in bytes)
  size: {
    maxFileSize: 25 * 1024 * 1024, // 25MB - maximum size for a single file
    maxImageSize: 10 * 1024 * 1024, // 10MB - maximum size for images
    maxTotalPerMessage: 50 * 1024 * 1024, // 50MB - maximum total size for all attachments in one message
  },

  // Allowed MIME types organized by category
  mimeTypes: {
    images: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'image/tiff',
    ],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'text/plain',
      'text/csv',
      'text/markdown',
      'application/rtf',
    ],
    archives: [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-tar',
      'application/gzip',
      'application/x-7z-compressed',
    ],
    audio: [
      'audio/mpeg', // .mp3
      'audio/wav',
      'audio/ogg',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/flac',
    ],
    video: [
      'video/mp4',
      'video/webm',
      'video/quicktime', // .mov
      'video/x-msvideo', // .avi
      'video/mpeg',
      'video/ogg',
    ],
  },

  // Thumbnail generation settings
  thumbnails: {
    small: { width: 200, height: 200 },
    medium: { width: 800, height: 800 },
  },

  // Thumbnail sizes array (for generateThumbnails function)
  thumbnailSizes: [
    { width: 200, height: 200, name: 'small' },
    { width: 400, height: 400, name: 'medium' },
    { width: 800, height: 800, name: 'large' },
  ],

  // Presigned URL expiry times (in seconds)
  presignedUrls: {
    uploadUrlExpiry: 5 * 60, // 5 minutes for upload URLs
    downloadUrlExpiry: 60 * 60, // 1 hour for download URLs
  },

  // Storage bucket name
  bucketName: 'messaging-attachments',
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a MIME type is allowed
 *
 * @param mimeType - The MIME type to check
 * @returns true if the MIME type is allowed, false otherwise
 */
export function isAllowedMimeType(mimeType: string): boolean {
  const normalizedMimeType = mimeType.toLowerCase().trim();

  // Check all allowed MIME type categories using type assertion for readonly arrays
  return (
    (ATTACHMENT_CONFIG.mimeTypes.images as readonly string[]).includes(normalizedMimeType) ||
    (ATTACHMENT_CONFIG.mimeTypes.documents as readonly string[]).includes(normalizedMimeType) ||
    (ATTACHMENT_CONFIG.mimeTypes.archives as readonly string[]).includes(normalizedMimeType) ||
    (ATTACHMENT_CONFIG.mimeTypes.audio as readonly string[]).includes(normalizedMimeType) ||
    (ATTACHMENT_CONFIG.mimeTypes.video as readonly string[]).includes(normalizedMimeType)
  );
}

/**
 * Determine attachment type from MIME type
 *
 * @param mimeType - The MIME type to categorize
 * @returns The attachment type: 'image', 'file', 'video', or 'audio'
 */
export function getAttachmentType(mimeType: string): AttachmentType {
  const normalizedMimeType = mimeType.toLowerCase().trim();

  // Check in order of specificity using type assertion for readonly arrays
  if ((ATTACHMENT_CONFIG.mimeTypes.images as readonly string[]).includes(normalizedMimeType)) {
    return 'image';
  }

  if ((ATTACHMENT_CONFIG.mimeTypes.video as readonly string[]).includes(normalizedMimeType)) {
    return 'video';
  }

  if ((ATTACHMENT_CONFIG.mimeTypes.audio as readonly string[]).includes(normalizedMimeType)) {
    return 'audio';
  }

  // Default to 'file' for documents, archives, and any other type
  return 'file';
}

/**
 * Format file size in human-readable format
 *
 * @param bytes - The file size in bytes
 * @returns Human-readable file size string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
}

// ============================================================================
// Type Guards and Validation
// ============================================================================

/**
 * Validate file size against limits
 *
 * @param size - File size in bytes
 * @param isImage - Whether the file is an image
 * @returns Object with validation result and error message if invalid
 */
export function validateFileSize(
  size: number,
  isImage: boolean
): { valid: boolean; error?: string } {
  const maxSize = isImage
    ? ATTACHMENT_CONFIG.size.maxImageSize
    : ATTACHMENT_CONFIG.size.maxFileSize;

  if (size > maxSize) {
    return {
      valid: false,
      error: `File size (${formatFileSize(size)}) exceeds maximum allowed (${formatFileSize(maxSize)})`,
    };
  }

  return { valid: true };
}

/**
 * Validate total size of multiple attachments
 *
 * @param sizes - Array of file sizes in bytes
 * @returns Object with validation result and error message if invalid
 */
export function validateTotalSize(sizes: number[]): { valid: boolean; error?: string } {
  const totalSize = sizes.reduce((sum, size) => sum + size, 0);

  if (totalSize > ATTACHMENT_CONFIG.size.maxTotalPerMessage) {
    return {
      valid: false,
      error: `Total attachment size (${formatFileSize(totalSize)}) exceeds maximum allowed (${formatFileSize(ATTACHMENT_CONFIG.size.maxTotalPerMessage)})`,
    };
  }

  return { valid: true };
}

/**
 * Get file extension from MIME type
 *
 * @param mimeType - The MIME type
 * @returns The file extension (without dot) or empty string if unknown
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExtension: Record<string, string> = {
    // Images
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',

    // Documents
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'text/plain': 'txt',
    'text/csv': 'csv',
    'text/markdown': 'md',
    'application/rtf': 'rtf',

    // Archives
    'application/zip': 'zip',
    'application/x-rar-compressed': 'rar',
    'application/x-tar': 'tar',
    'application/gzip': 'gz',
    'application/x-7z-compressed': '7z',

    // Audio
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    'audio/webm': 'weba',
    'audio/mp4': 'm4a',
    'audio/aac': 'aac',
    'audio/flac': 'flac',

    // Video
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'video/mpeg': 'mpeg',
    'video/ogg': 'ogv',
  };

  return mimeToExtension[mimeType.toLowerCase()] || '';
}
