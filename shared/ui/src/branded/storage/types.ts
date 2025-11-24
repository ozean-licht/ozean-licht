/**
 * Storage Component Types
 *
 * TypeScript types for storage UI components.
 * Extends types from apps/admin/types/storage.ts
 */

import { ReactNode } from 'react'

/**
 * File view mode
 */
export type ViewMode = 'list' | 'grid'

/**
 * File type category
 */
export type FileTypeCategory =
  | 'image'
  | 'video'
  | 'document'
  | 'archive'
  | 'audio'
  | 'code'
  | 'folder'
  | 'unknown'

/**
 * File item for display
 */
export interface FileItem {
  id: string
  name: string
  type: FileTypeCategory
  mimeType: string
  size: number
  sizeFormatted: string
  modified: Date
  modifiedFormatted: string
  isFolder?: boolean
  thumbnailUrl?: string
  canPreview?: boolean
  canDownload?: boolean
  canDelete?: boolean
  canShare?: boolean
}

/**
 * File selection state
 */
export interface FileSelection {
  selectedFiles: Set<string>
  isAllSelected: boolean
}

/**
 * Upload queue item
 */
export interface UploadQueueItem {
  id: string
  file: File
  filename: string
  size: number
  sizeFormatted: string
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
  uploadedSize?: number
  speed?: number
  timeRemaining?: number
}

/**
 * File action event
 */
export interface FileActionEvent {
  type: 'download' | 'delete' | 'rename' | 'share' | 'preview' | 'details'
  fileId: string
  fileName: string
}

/**
 * Storage search filters
 */
export interface StorageFilters {
  searchQuery?: string
  fileType?: FileTypeCategory
  dateFrom?: Date
  dateTo?: Date
  minSize?: number
  maxSize?: number
  tags?: string[]
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  id: string
  label: string
  path: string
  isActive: boolean
}

/**
 * Storage quota display data
 */
export interface StorageQuotaDisplay {
  used: number
  usedFormatted: string
  total: number
  totalFormatted: string
  percentage: number
  status: 'ok' | 'warning' | 'critical'
  fileCount: number
  breakdown?: {
    category: FileTypeCategory
    size: number
    sizeFormatted: string
    percentage: number
  }[]
}

/**
 * File preview data
 */
export interface FilePreviewData {
  fileId: string
  filename: string
  contentType: string
  size: number
  sizeFormatted: string
  url: string
  canZoom?: boolean
  canRotate?: boolean
  metadata?: Record<string, any>
}

/**
 * Drag and drop zone props
 */
export interface DropzoneProps {
  onFilesAccepted: (files: File[]) => void
  onFilesRejected?: (files: File[]) => void
  accept?: Record<string, string[]>
  maxSize?: number
  maxFiles?: number
  multiple?: boolean
  disabled?: boolean
  className?: string
}

/**
 * File context menu action
 */
export interface ContextMenuAction {
  id: string
  label: string
  icon: ReactNode
  onClick: () => void
  disabled?: boolean
  destructive?: boolean
  separator?: boolean
}

/**
 * Bulk operation type
 */
export type BulkOperationType = 'download' | 'delete' | 'move' | 'tag' | 'archive'

/**
 * Bulk operation payload
 */
export interface BulkOperationPayload {
  type: BulkOperationType
  fileIds: string[]
  options?: Record<string, any>
}
