/**
 * Storage Component Types
 * TypeScript interfaces for Ozean Cloud storage UI components
 */

export interface StorageFile {
  id: string
  name: string
  path: string
  size: number
  mimeType: string
  uploadedAt: Date
  uploadedBy?: string
  bucket: string
  entityScope?: string
  md5Hash?: string
  metadata?: Record<string, unknown>
  tags?: string[]
  isFolder?: boolean
}

export interface UploadProgress {
  fileId: string
  fileName: string
  size: number
  loaded: number
  percentage: number
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'cancelled'
  error?: string
}

export interface FileAction {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (file: StorageFile) => void
  disabled?: boolean
  variant?: 'default' | 'destructive'
}

export interface BulkActionItem {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (files: StorageFile[]) => void | Promise<void>
  disabled?: boolean
  variant?: 'default' | 'destructive'
}

export interface StorageStats {
  totalFiles: number
  totalSize: number
  usedSpace: number
  totalSpace: number
  filesByType: Record<string, number>
}

export interface FileFilter {
  searchQuery?: string
  fileType?: string
  dateRange?: {
    from: Date
    to: Date
  }
  sizeRange?: {
    min: number
    max: number
  }
}

export type ViewMode = 'list' | 'grid'

export type SortField = 'name' | 'size' | 'uploadedAt' | 'mimeType'
export type SortOrder = 'asc' | 'desc'

export interface BreadcrumbItem {
  label: string
  path: string
  isLast?: boolean
}
