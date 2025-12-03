/**
 * @ozean-licht/shared-ui
 *
 * Four-tier component system:
 * - Tier 0: Custom Primitives - Custom minimal building blocks
 * - Tier 1: Primitives - ShadCN, MagicUI & CossUI base components
 * - Tier 2: Branded - Ozean Licht branded components
 * - Tier 3: Compositions - Complex sections combining multiple components
 */

// Tier 0: Export custom primitives
export * from './primitives'

// Tier 1: Export primitive libraries (ShadCN + MagicUI + CossUI)
export * from './ui'
export * from './magicui'
export * from './cossui'

// Tier 2: Export branded Ozean Licht components
export * from './branded'

// Tier 3: Export compositions (complex sections)
// TEMPORARILY DISABLED - compositions have import errors that need fixing
// export * from './compositions'

// Export storage components (but avoid conflicts with branded)
export type {
  StorageFile,
  StorageStats,
  SortField,
  SortOrder,
  FileAction,
  ViewMode as StorageViewMode,
  BreadcrumbItem as StorageBreadcrumbItem,
  UploadProgress,
  BulkActionItem,
  FileFilter,
} from './storage/types'
export * from './storage/file-browser'
export * from './storage/file-preview-dialog'
export * from './storage/file-upload-queue'
export * from './storage/storage-quota-card'
export * from './storage/storage-search-bar'
export * from './storage/storage-stats-widget'
export * from './storage/bucket-selector'
export * from './storage/bulk-actions-toolbar'

// Export utilities
export * from './utils'

// Export hooks
export * from './hooks'