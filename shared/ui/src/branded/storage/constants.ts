/**
 * Storage Constants
 *
 * File type mappings, size limits, and configuration constants
 */

import type { FileTypeCategory } from './types'

/**
 * File type to MIME type mappings
 */
export const FILE_TYPE_MAPPINGS: Record<FileTypeCategory, string[]> = {
  image: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
  ],
  video: [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
  ],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'text/rtf',
  ],
  archive: [
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/x-tar',
    'application/gzip',
    'application/x-7z-compressed',
  ],
  audio: [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
    'audio/aac',
    'audio/flac',
  ],
  code: [
    'text/javascript',
    'text/typescript',
    'text/html',
    'text/css',
    'text/xml',
    'application/json',
    'application/javascript',
    'application/typescript',
    'text/x-python',
    'text/x-java',
    'text/x-c',
    'text/x-cpp',
  ],
  folder: [],
  unknown: [],
}

/**
 * File extension to MIME type mappings
 */
export const EXTENSION_TO_MIME: Record<string, string> = {
  // Images
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  ico: 'image/x-icon',

  // Videos
  mp4: 'video/mp4',
  webm: 'video/webm',
  ogg: 'video/ogg',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  mkv: 'video/x-matroska',

  // Documents
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  csv: 'text/csv',
  rtf: 'text/rtf',

  // Archives
  zip: 'application/zip',
  rar: 'application/x-rar-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',
  '7z': 'application/x-7z-compressed',

  // Audio
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  oga: 'audio/ogg', // OGG audio uses .oga extension to differentiate from video
  aac: 'audio/aac',
  flac: 'audio/flac',

  // Code
  js: 'text/javascript',
  jsx: 'text/javascript',
  ts: 'text/typescript',
  tsx: 'text/typescript',
  html: 'text/html',
  css: 'text/css',
  xml: 'text/xml',
  json: 'application/json',
  py: 'text/x-python',
  java: 'text/x-java',
  c: 'text/x-c',
  cpp: 'text/x-cpp',
  md: 'text/markdown',
  yaml: 'text/yaml',
  yml: 'text/yaml',
}

/**
 * File size limits
 */
export const FILE_SIZE_LIMITS = {
  /** Maximum file size for upload (100 MB) */
  MAX_FILE_SIZE: 100 * 1024 * 1024,
  /** Maximum file size for preview (50 MB) */
  MAX_PREVIEW_SIZE: 50 * 1024 * 1024,
  /** Maximum file size for thumbnail generation (10 MB) */
  MAX_THUMBNAIL_SIZE: 10 * 1024 * 1024,
  /** Warning threshold for large files (25 MB) */
  LARGE_FILE_WARNING: 25 * 1024 * 1024,
}

/**
 * Storage quota thresholds
 */
export const QUOTA_THRESHOLDS = {
  /** Warning threshold (70%) */
  WARNING: 70,
  /** Critical threshold (90%) */
  CRITICAL: 90,
}

/**
 * Upload configuration
 */
export const UPLOAD_CONFIG = {
  /** Maximum concurrent uploads */
  MAX_CONCURRENT_UPLOADS: 3,
  /** Upload chunk size (5 MB) */
  CHUNK_SIZE: 5 * 1024 * 1024,
  /** Auto-dismiss completed uploads after (milliseconds) */
  AUTO_DISMISS_DELAY: 3000,
  /** Retry attempts for failed uploads */
  RETRY_ATTEMPTS: 3,
}

/**
 * Presigned URL expiry times
 */
export const URL_EXPIRY_OPTIONS = [
  { label: '1 hour', value: 3600 },
  { label: '24 hours', value: 86400 },
  { label: '7 days', value: 604800 },
  { label: '30 days', value: 2592000 },
] as const

/**
 * File type categories display names
 */
export const FILE_TYPE_LABELS: Record<FileTypeCategory, string> = {
  image: 'Images',
  video: 'Videos',
  document: 'Documents',
  archive: 'Archives',
  audio: 'Audio',
  code: 'Code',
  folder: 'Folders',
  unknown: 'Other',
}

/**
 * Pagination defaults
 */
export const PAGINATION_DEFAULTS = {
  /** Default page size */
  PAGE_SIZE: 50,
  /** Page size options */
  PAGE_SIZE_OPTIONS: [25, 50, 100, 200],
}

/**
 * Search debounce delay (milliseconds)
 */
export const SEARCH_DEBOUNCE_DELAY = 300

/**
 * Virtual scrolling configuration
 */
export const VIRTUAL_SCROLL_CONFIG = {
  /** Estimated item height for list view (pixels) */
  LIST_ITEM_HEIGHT: 64,
  /** Estimated item height for grid view (pixels) */
  GRID_ITEM_HEIGHT: 220,
  /** Overscan count (render extra items outside viewport) */
  OVERSCAN: 5,
}

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  /** Select all files */
  SELECT_ALL: 'mod+a',
  /** Delete selected files */
  DELETE: 'Delete',
  /** Open search */
  SEARCH: 'mod+k',
  /** Close dialog/modal */
  CLOSE: 'Escape',
  /** Navigate up */
  UP: 'ArrowUp',
  /** Navigate down */
  DOWN: 'ArrowDown',
} as const
