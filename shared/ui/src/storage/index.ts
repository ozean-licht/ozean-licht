/**
 * Storage Components
 * Ozean Cloud storage UI components for file management
 */

// Components
export { FileDropzone } from './file-dropzone'
export type { FileDropzoneProps } from './file-dropzone'

export { FileUploadQueue } from './file-upload-queue'
export type { FileUploadQueueProps } from './file-upload-queue'

export { FileContextMenu } from './file-context-menu'
export type { FileContextMenuProps } from './file-context-menu'

export { BulkActionsToolbar } from './bulk-actions-toolbar'
export type { BulkActionsToolbarProps } from './bulk-actions-toolbar'

export { CreateFolderDialog } from './create-folder-dialog'
export type { CreateFolderDialogProps } from './create-folder-dialog'

export { FileBrowser, useFileSelection } from './file-browser'
export type { FileBrowserProps } from './file-browser'

// Phase 3 Components
export { FilePreviewDialog } from './file-preview-dialog'
export type { FilePreviewDialogProps } from './file-preview-dialog'

export { StorageQuotaCard } from './storage-quota-card'
export type { StorageQuotaCardProps, FileTypeBreakdown } from './storage-quota-card'

export { StorageSearchBar } from './storage-search-bar'
export type { StorageSearchBarProps } from './storage-search-bar'

export { FileMetadataPanel } from './file-metadata-panel'
export type { FileMetadataPanelProps } from './file-metadata-panel'

export { BucketSelector } from './bucket-selector'
export type { BucketSelectorProps, Bucket } from './bucket-selector'

export { ShareDialog } from './share-dialog'
export type { ShareDialogProps } from './share-dialog'

export { StorageStatsWidget } from './storage-stats-widget'
export type { StorageStatsWidgetProps, StorageStatsData } from './storage-stats-widget'

// Types
export type {
  StorageFile,
  UploadProgress,
  FileAction,
  BulkActionItem,
  StorageStats,
  FileFilter,
  ViewMode,
  SortField,
  SortOrder,
  BreadcrumbItem,
} from './types'
