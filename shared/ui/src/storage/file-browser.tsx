'use client';

/**
 * File Browser Component
 * Main orchestrator component that composes all storage components
 */

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../utils/cn'
import { FileDropzone } from './file-dropzone'
import { FileUploadQueue } from './file-upload-queue'
import { BulkActionsToolbar } from './bulk-actions-toolbar'
import { CreateFolderDialog } from './create-folder-dialog'
import type { StorageFile, UploadProgress, ViewMode, FileFilter } from './types'

export interface FileBrowserProps {
  files: StorageFile[]
  onUpload?: (files: File[]) => void
  onDownload?: (file: StorageFile) => void
  onDelete?: (file: StorageFile) => void
  onDeleteBulk?: (files: StorageFile[]) => void
  onDownloadBulk?: (files: StorageFile[]) => void
  onCreateFolder?: (folderName: string) => Promise<void>
  onNavigate?: (path: string) => void
  currentPath?: string
  uploads?: UploadProgress[]
  onCancelUpload?: (fileId: string) => void
  onRetryUpload?: (fileId: string) => void
  onClearUpload?: (fileId: string) => void
  isLoading?: boolean
  error?: string | null
  viewMode?: ViewMode
  filter?: FileFilter
  className?: string
  children?: React.ReactNode
  accept?: Record<string, string[]>
  maxFileSize?: number
  maxFiles?: number
  showDropzone?: boolean
  showBulkActions?: boolean
  showCreateFolder?: boolean
}

export function FileBrowser({
  files,
  onUpload,
  onDownload,
  onDelete,
  onDeleteBulk,
  onDownloadBulk,
  onCreateFolder,
  onNavigate,
  currentPath = '/',
  uploads = [],
  onCancelUpload,
  onRetryUpload,
  onClearUpload,
  isLoading = false,
  error = null,
  viewMode = 'list',
  filter,
  className,
  children,
  accept,
  maxFileSize,
  maxFiles,
  showDropzone = true,
  showBulkActions = true,
  showCreateFolder = true,
}: FileBrowserProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<StorageFile[]>([])
  const [createFolderOpen, setCreateFolderOpen] = React.useState(false)

  // Selection handlers
  const handleSelectFile = React.useCallback((file: StorageFile, selected: boolean) => {
    setSelectedFiles((prev) =>
      selected ? [...prev, file] : prev.filter((f) => f.id !== file.id)
    )
  }, [])

  const handleSelectAll = React.useCallback(() => {
    setSelectedFiles(files)
  }, [files])

  const handleClearSelection = React.useCallback(() => {
    setSelectedFiles([])
  }, [])

  // Bulk action handlers
  const handleBulkDownload = React.useCallback(async () => {
    if (onDownloadBulk) {
      await onDownloadBulk(selectedFiles)
    } else if (onDownload) {
      // Fallback to individual downloads
      for (const file of selectedFiles) {
        await onDownload(file)
      }
    }
  }, [selectedFiles, onDownloadBulk, onDownload])

  const handleBulkDelete = React.useCallback(async () => {
    if (onDeleteBulk) {
      await onDeleteBulk(selectedFiles)
    } else if (onDelete) {
      // Fallback to individual deletes
      for (const file of selectedFiles) {
        await onDelete(file)
      }
    }
    setSelectedFiles([])
  }, [selectedFiles, onDeleteBulk, onDelete])

  // Folder creation handler
  const handleCreateFolder = React.useCallback(
    async (folderName: string) => {
      if (onCreateFolder) {
        await onCreateFolder(folderName)
        setCreateFolderOpen(false)
      }
    },
    [onCreateFolder]
  )

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+A / CTRL+A - Select all
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault()
        handleSelectAll()
      }

      // ESC - Clear selection
      if (e.key === 'Escape' && selectedFiles.length > 0) {
        handleClearSelection()
      }

      // Delete - Delete selected files
      if (e.key === 'Delete' && selectedFiles.length > 0 && onDelete) {
        e.preventDefault()
        handleBulkDelete()
      }

      // CMD+N / CTRL+N - New folder
      if ((e.metaKey || e.ctrlKey) && e.key === 'n' && showCreateFolder) {
        e.preventDefault()
        setCreateFolderOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    selectedFiles,
    handleSelectAll,
    handleClearSelection,
    handleBulkDelete,
    onDelete,
    showCreateFolder,
  ])

  // Get existing folder names for duplicate check
  const existingFolders = React.useMemo(
    () => files.filter((f) => f.isFolder).map((f) => f.name),
    [files]
  )

  return (
    <div className={cn('relative flex flex-col gap-4', className)}>
      {/* Bulk Actions Toolbar */}
      {showBulkActions && selectedFiles.length > 0 && (
        <BulkActionsToolbar
          selectedFiles={selectedFiles}
          onDownloadAll={onDownloadBulk || onDownload ? handleBulkDownload : undefined}
          onDeleteSelected={onDeleteBulk || onDelete ? handleBulkDelete : undefined}
          onClearSelection={handleClearSelection}
          onSelectAll={handleSelectAll}
          totalFiles={files.length}
          isLoading={isLoading}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg glass-card border-destructive/30 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && files.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 glass-card rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-[#C4C8D4]">Loading files...</p>
        </div>
      )}

      {/* File Dropzone */}
      {showDropzone && onUpload && !isLoading && files.length === 0 && (
        <FileDropzone
          onFilesSelected={onUpload}
          accept={accept}
          maxSize={maxFileSize}
          maxFiles={maxFiles}
        />
      )}

      {/* File List/Grid (Pass through children) */}
      {!isLoading && files.length > 0 && children}

      {/* Upload Queue */}
      {uploads.length > 0 && (
        <FileUploadQueue
          uploads={uploads}
          onCancel={onCancelUpload}
          onRetry={onRetryUpload}
          onClear={onClearUpload}
        />
      )}

      {/* Create Folder Dialog */}
      {showCreateFolder && onCreateFolder && (
        <CreateFolderDialog
          open={createFolderOpen}
          onOpenChange={setCreateFolderOpen}
          onCreateFolder={handleCreateFolder}
          currentPath={currentPath}
          existingFolders={existingFolders}
        />
      )}
    </div>
  )
}

// Export a hook for managing file selection
export function useFileSelection(files: StorageFile[]) {
  const [selectedFiles, setSelectedFiles] = React.useState<StorageFile[]>([])

  const selectFile = React.useCallback((file: StorageFile) => {
    setSelectedFiles((prev) =>
      prev.find((f) => f.id === file.id) ? prev : [...prev, file]
    )
  }, [])

  const deselectFile = React.useCallback((file: StorageFile) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== file.id))
  }, [])

  const toggleFile = React.useCallback((file: StorageFile) => {
    setSelectedFiles((prev) =>
      prev.find((f) => f.id === file.id)
        ? prev.filter((f) => f.id !== file.id)
        : [...prev, file]
    )
  }, [])

  const selectAll = React.useCallback(() => {
    setSelectedFiles(files)
  }, [files])

  const clearSelection = React.useCallback(() => {
    setSelectedFiles([])
  }, [])

  const isSelected = React.useCallback(
    (file: StorageFile) => selectedFiles.some((f) => f.id === file.id),
    [selectedFiles]
  )

  return {
    selectedFiles,
    selectFile,
    deselectFile,
    toggleFile,
    selectAll,
    clearSelection,
    isSelected,
  }
}
