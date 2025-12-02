/**
 * Ozean Cloud Storage Page
 *
 * Main cloud storage interface with file browser, upload, and management features.
 * Integrates with MinIO backend via MCP Gateway.
 *
 * Uses shared @ozean-licht/shared-ui storage components for consistency
 * with the design system. Custom implementations only where necessary
 * for admin-specific features like authentication and state management.
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, Trash2, Download, FolderOpen, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

// Shared storage components from @shared/ui
import {
  FileTypeIcon,
  StorageBreadcrumb,
  EmptyStorageState,
  BulkActionsToolbar,
  formatFileSize,
} from '@shared/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StoragePageHeader } from '@/components/storage/StoragePageHeader';
import { StorageToolbar, ViewMode } from '@/components/storage/StorageToolbar';
import {
  getStorageFiles,
  uploadStorageFile,
  deleteStorageFile,
  deleteStorageFilesBulk,
  getStorageUrl,
  createFolder,
  type StorageFileUI,
} from './actions';
import { BUCKETS, DEFAULT_BUCKET, type BucketInfo } from './constants';
import { cn } from '@/lib/utils';

/**
 * Maximum file size for upload (50MB)
 * This prevents memory issues with base64 encoding and browser crashes
 */
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Maximum concurrent uploads
 * Limits memory footprint and prevents server resource exhaustion
 */
const MAX_CONCURRENT_UPLOADS = 3;

/**
 * Format date to relative or absolute string
 */
function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

/**
 * Upload progress state
 */
interface UploadProgress {
  id: string;
  filename: string;
  progress: number;
  status: 'queued' | 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  file?: File; // Store file for retry functionality
}

export default function OzeanCloudPage() {
  // State
  const [files, setFiles] = useState<StorageFileUI[]>([]);
  const [buckets] = useState<BucketInfo[]>(BUCKETS);
  const [currentBucket, setCurrentBucket] = useState(DEFAULT_BUCKET);
  const [currentPath, setCurrentPath] = useState('gdrive-backup');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [focusedFileIndex, setFocusedFileIndex] = useState(-1); // For keyboard navigation
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalSize, setTotalSize] = useState(0);

  // Upload state
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<StorageFileUI | null>(null);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    file: StorageFileUI;
  } | null>(null);

  // Operation loading states
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Load view mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ozean-cloud-view-mode');
    if (stored === 'list' || stored === 'grid') {
      setViewMode(stored);
    }
  }, []);

  // Save view mode to localStorage
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('ozean-cloud-view-mode', mode);
  };

  // Fetch files
  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getStorageFiles(currentBucket, currentPath || undefined);
      setFiles(result.files);
      setTotalFiles(result.count);

      // Calculate total size from visible files
      const size = result.files.reduce((sum, f) => sum + f.size, 0);
      setTotalSize(size);

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch files:', err);
      setError(err instanceof Error ? err.message : 'Failed to load files');
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentBucket, currentPath]);

  // Initial load and refresh on bucket/path change
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Filter files by search query
  const filteredFiles = React.useMemo(() => {
    if (!searchQuery.trim()) return files;

    const query = searchQuery.toLowerCase();
    return files.filter((file) => file.name.toLowerCase().includes(query));
  }, [files, searchQuery]);

  // Convert selected file IDs to file objects for BulkActionsToolbar
  const selectedFilesArray = React.useMemo(() => {
    return files.filter((f) => selectedFiles.has(f.id)).map((f) => ({
      id: f.id,
      name: f.name,
      size: f.size,
      mimeType: f.mimeType,
      isFolder: f.isFolder,
      path: f.path,
      uploadedAt: new Date(f.uploadedAt),
      bucket: currentBucket,
    }));
  }, [files, selectedFiles, currentBucket]);

  // Handle file selection
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  };

  const selectAllFiles = () => {
    const nonFolderFiles = filteredFiles.filter((f) => !f.isFolder);
    setSelectedFiles(new Set(nonFolderFiles.map((f) => f.id)));
  };

  const clearSelection = () => {
    setSelectedFiles(new Set());
  };

  // Handle bucket change
  const handleBucketChange = (bucket: string) => {
    setCurrentBucket(bucket);
    setCurrentPath('gdrive-backup');
    clearSelection();
    setFocusedFileIndex(-1);
  };

  // Handle folder double-click
  const handleFolderClick = (file: StorageFileUI) => {
    if (file.isFolder) {
      setCurrentPath(file.path.replace(/\/$/, ''));
      clearSelection();
      setFocusedFileIndex(-1);
    }
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbNavigate = (path: string) => {
    setCurrentPath(path);
    clearSelection();
    setFocusedFileIndex(-1);
  };

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, file: StorageFileUI) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      file,
    });
  };

  // Close context menu when clicking elsewhere
  useEffect(() => {
    if (!contextMenu) return;

    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [contextMenu]);

  // Build display path for breadcrumb (remove gdrive-backup prefix)
  const displayPath = React.useMemo(() => {
    if (!currentPath || currentPath === 'gdrive-backup') return '';
    return currentPath.replace(/^gdrive-backup\/?/, '');
  }, [currentPath]);

  // Handle breadcrumb navigation (convert display path back to full path)
  const handleBreadcrumbClick = (path: string) => {
    const fullPath = path ? `gdrive-backup/${path}` : 'gdrive-backup';
    handleBreadcrumbNavigate(fullPath);
  };

  // Upload a single file
  const uploadSingleFile = async (file: File, uploadId: string) => {
    try {
      // Set status to uploading
      setUploads((prev) =>
        prev.map((u) => (u.id === uploadId ? { ...u, status: 'uploading' as const } : u))
      );

      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', currentBucket);
      if (currentPath) {
        formData.append('path', currentPath);
      }

      await uploadStorageFile(formData);

      // Update upload status to completed
      setUploads((prev) =>
        prev.map((u) =>
          u.id === uploadId ? { ...u, progress: 100, status: 'completed' as const } : u
        )
      );
    } catch (err) {
      console.error('Upload failed:', err);
      setUploads((prev) =>
        prev.map((u) =>
          u.id === uploadId
            ? {
                ...u,
                status: 'error' as const,
                error: err instanceof Error ? err.message : 'Upload failed',
              }
            : u
        )
      );
      throw err; // Re-throw to handle in queue processor
    }
  };

  // Process upload queue with concurrency control
  const processUploadQueue = async (fileArray: File[], uploadsList: UploadProgress[]) => {
    // Process files in batches of MAX_CONCURRENT_UPLOADS
    for (let i = 0; i < fileArray.length; i += MAX_CONCURRENT_UPLOADS) {
      const batch = fileArray.slice(i, i + MAX_CONCURRENT_UPLOADS);

      // Get upload entries for this batch from the passed list
      const batchUploads = batch.map((file) =>
        uploadsList.find((u) => u.filename === file.name && u.file === file)
      ).filter(Boolean) as UploadProgress[];

      // Upload batch in parallel
      await Promise.allSettled(
        batch.map((file, index) => {
          const upload = batchUploads[index];
          if (upload) {
            return uploadSingleFile(file, upload.id);
          }
          return Promise.resolve();
        })
      );
    }

    // Refresh file list after all uploads complete
    fetchFiles();

    // Clear completed uploads after 3 seconds
    setTimeout(() => {
      setUploads((prev) => prev.filter((u) => u.status !== 'completed'));
    }, 3000);
  };

  // Handle retry upload
  const handleRetryUpload = async (uploadId: string) => {
    const upload = uploads.find((u) => u.id === uploadId);
    if (!upload || !upload.file) return;

    // Reset upload status
    setUploads((prev) =>
      prev.map((u) =>
        u.id === uploadId
          ? { ...u, status: 'pending' as const, error: undefined, progress: 0 }
          : u
      )
    );

    // Retry the upload
    await uploadSingleFile(upload.file, uploadId);

    // Refresh file list if successful
    const updatedUpload = uploads.find((u) => u.id === uploadId);
    if (updatedUpload?.status === 'completed') {
      fetchFiles();
    }
  };

  // Handle file upload
  const handleUpload = async (filesToUpload: FileList | File[]) => {
    const fileArray = Array.from(filesToUpload);

    // Validate file sizes before processing
    const oversizedFiles = fileArray.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map((f) => f.name).join(', ');
      setError(
        `File(s) too large: ${fileNames}. Maximum file size is ${formatFileSize(MAX_FILE_SIZE, { binary: false })}.`
      );
      return;
    }

    // Add all files to upload queue
    const newUploads: UploadProgress[] = fileArray.map((file) => ({
      id: crypto.randomUUID(),
      filename: file.name,
      progress: 0,
      status: 'pending' as const,
      file,
    }));

    setUploads((prev) => [...prev, ...newUploads]);

    // Process queue with concurrency control - pass uploads directly to avoid state timing issues
    await processUploadQueue(fileArray, newUploads);
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  // Handle file download
  const handleDownload = async (file: StorageFileUI) => {
    try {
      setError(null); // Clear previous errors
      const result = await getStorageUrl(currentBucket, file.path);
      // Open in new tab or trigger download
      window.open(result.url, '_blank');
    } catch (err) {
      console.error('Download failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to download file';
      setError(errorMessage);
    }
  };

  // Handle single file delete
  const handleDeleteClick = (file: StorageFileUI) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete || isDeleting) return;

    setIsDeleting(true);
    setError(null); // Clear previous errors

    // Optimistic update: remove from UI immediately
    const deletedFile = fileToDelete;
    const previousFiles = [...files];
    setFiles((prev) => prev.filter((f) => f.id !== deletedFile.id));
    setDeleteDialogOpen(false);
    setFileToDelete(null);

    try {
      await deleteStorageFile(currentBucket, deletedFile.path);
      // Success - refresh to ensure consistency
      await fetchFiles();
    } catch (err) {
      console.error('Delete failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file';
      setError(errorMessage);
      // Rollback: restore the file to the list
      setFiles(previousFiles);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0 || isBulkDeleting) return;

    setIsBulkDeleting(true);
    setError(null); // Clear previous errors

    // Optimistic update: remove selected files from UI immediately
    const fileKeys = Array.from(selectedFiles);
    const previousFiles = [...files];
    setFiles((prev) => prev.filter((f) => !selectedFiles.has(f.id)));
    clearSelection();

    try {
      const result = await deleteStorageFilesBulk(currentBucket, fileKeys);

      // Show errors for failed deletions and rollback those files
      if (result.failed.length > 0) {
        const failedNames = result.failed.map((f) => f.fileKey).join(', ');
        setError(`Failed to delete ${result.failed.length} file(s): ${failedNames}`);

        // Rollback failed deletions - restore those files
        const failedFileKeys = new Set(result.failed.map((f) => f.fileKey));
        const filesToRestore = previousFiles.filter((f) => failedFileKeys.has(f.path));
        setFiles((prev) => [...prev, ...filesToRestore].sort((a, b) => {
          if (a.isFolder && !b.isFolder) return -1;
          if (!a.isFolder && b.isFolder) return 1;
          return a.name.localeCompare(b.name);
        }));
      }

      // Refresh to ensure consistency
      await fetchFiles();
    } catch (err) {
      console.error('Bulk delete failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete files';
      setError(errorMessage);
      // Complete rollback on total failure
      setFiles(previousFiles);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  // Handle create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || isCreatingFolder) return;

    setIsCreatingFolder(true);
    try {
      setError(null); // Clear previous errors
      const folderPath = currentPath
        ? `${currentPath}/${newFolderName}`
        : newFolderName;
      await createFolder(currentBucket, folderPath);
      setNewFolderDialogOpen(false);
      setNewFolderName('');
      await fetchFiles();
    } catch (err) {
      console.error('Create folder failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create folder';
      setError(errorMessage);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Keyboard shortcuts and navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input fields
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // CMD+A - Select all
      if ((e.metaKey || e.ctrlKey) && e.key === 'a' && !e.shiftKey) {
        e.preventDefault();
        selectAllFiles();
      }

      // ESC - Clear selection
      if (e.key === 'Escape' && selectedFiles.size > 0) {
        clearSelection();
        setFocusedFileIndex(-1);
      }

      // Delete - Delete selected
      if (e.key === 'Delete' && selectedFiles.size > 0) {
        e.preventDefault();
        handleBulkDelete();
      }

      // CMD+N - New folder
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setNewFolderDialogOpen(true);
      }

      // Arrow key navigation
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const fileList = filteredFiles;
        if (fileList.length === 0) return;

        let newIndex = focusedFileIndex;
        if (e.key === 'ArrowDown') {
          newIndex = Math.min(focusedFileIndex + 1, fileList.length - 1);
        } else {
          newIndex = Math.max(focusedFileIndex - 1, 0);
        }

        setFocusedFileIndex(newIndex);

        // Auto-select on navigation
        const file = fileList[newIndex];
        if (file && !file.isFolder) {
          setSelectedFiles(new Set([file.id]));
        }
      }

      // Enter - Open folder or download file
      if (e.key === 'Enter' && focusedFileIndex >= 0) {
        e.preventDefault();
        const file = filteredFiles[focusedFileIndex];
        if (file) {
          if (file.isFolder) {
            handleFolderClick(file);
          } else {
            handleDownload(file);
          }
        }
      }

      // Space - Toggle selection
      if (e.key === ' ' && focusedFileIndex >= 0) {
        e.preventDefault();
        const file = filteredFiles[focusedFileIndex];
        if (file && !file.isFolder) {
          toggleFileSelection(file.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFiles, focusedFileIndex, filteredFiles]);

  return (
    <div
      className="p-6 space-y-6"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Page Header */}
      <StoragePageHeader
        totalFiles={totalFiles}
        totalSize={totalSize}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        currentBucket={buckets.find((b) => b.name === currentBucket)?.displayName}
        onUpload={() => fileInputRef.current?.click()}
        onCreateFolder={() => setNewFolderDialogOpen(true)}
        onRefresh={fetchFiles}
      />

      {/* Toolbar */}
      <StorageToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        buckets={buckets}
        currentBucket={currentBucket}
        onBucketChange={handleBucketChange}
        disabled={isLoading}
      />

      {/* Breadcrumb Navigation */}
      <StorageBreadcrumb
        path={displayPath}
        onNavigate={handleBreadcrumbClick}
        homeLabel="Home"
        maxSegments={5}
      />

      {/* Bulk Actions Bar */}
      <BulkActionsToolbar
        selectedFiles={selectedFilesArray}
        onDeleteSelected={handleBulkDelete}
        onClearSelection={clearSelection}
        onSelectAll={selectAllFiles}
        totalFiles={filteredFiles.filter((f) => !f.isFolder).length}
        isLoading={isBulkDeleting}
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Drop Zone Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="p-8 rounded-xl bg-white dark:bg-[#00111A] shadow-2xl border-2 border-dashed border-primary">
            <div className="text-center">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Drop files to upload</h3>
              <p className="text-sm text-white/50">
                Files will be uploaded to {currentPath || 'root'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 dark:bg-[#0E282E]/50"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{upload.filename}</p>
                {upload.error && (
                  <p className="text-xs text-red-400 truncate mt-0.5">{upload.error}</p>
                )}
                <div className="h-1.5 mt-1 bg-[#0E282E] rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      upload.status === 'error' ? 'bg-red-500' : 'bg-primary'
                    )}
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-xs font-medium',
                    upload.status === 'completed' && 'text-green-400',
                    upload.status === 'error' && 'text-red-400',
                    upload.status === 'uploading' && 'text-primary',
                    (upload.status === 'pending' || upload.status === 'queued') && 'text-white/50'
                  )}
                >
                  {upload.status === 'completed' && 'Done'}
                  {upload.status === 'error' && 'Failed'}
                  {upload.status === 'uploading' && 'Uploading...'}
                  {(upload.status === 'pending' || upload.status === 'queued') && 'Queued'}
                </span>
                {upload.status === 'error' && upload.file && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRetryUpload(upload.id)}
                    className="h-6 px-2 text-xs text-primary hover:text-primary/80"
                  >
                    Retry
                  </Button>
                )}
                <button
                  onClick={() => setUploads((prev) => prev.filter((u) => u.id !== upload.id))}
                  className="p-1 text-white/40 hover:text-white/70 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File List/Grid */}
      {isLoading && files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-white/50">Loading files...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <EmptyStorageState
          variant={searchQuery ? 'search' : 'folder'}
          primaryAction={!searchQuery ? {
            label: 'Upload Files',
            onClick: () => fileInputRef.current?.click(),
            icon: <Upload className="h-4 w-4" />,
          } : undefined}
          secondaryAction={searchQuery ? {
            label: 'Clear search',
            onClick: () => setSearchQuery(''),
          } : undefined}
        />
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#00111A]">
              <tr>
                <th className="w-12 p-3">
                  <Checkbox
                    checked={
                      selectedFiles.size > 0 &&
                      selectedFiles.size === filteredFiles.filter((f) => !f.isFolder).length
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        selectAllFiles();
                      } else {
                        clearSelection();
                      }
                    }}
                  />
                </th>
                <th className="text-left p-3 text-sm font-medium text-white/60">Name</th>
                <th className="text-left p-3 text-sm font-medium text-white/60 hidden md:table-cell">
                  Size
                </th>
                <th className="text-left p-3 text-sm font-medium text-white/60 hidden lg:table-cell">
                  Modified
                </th>
                <th className="w-32 p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file, index) => {
                const isFocused = index === focusedFileIndex;
                return (
                  <tr
                    key={file.id}
                    className={cn(
                      'group border-t border-[#0E282E]/30 hover:bg-[#0E282E]/30 transition-colors',
                      selectedFiles.has(file.id) && 'bg-primary/5',
                      isFocused && 'ring-2 ring-primary ring-inset'
                    )}
                    onContextMenu={(e) => handleContextMenu(e, file)}
                  >
                    <td className="p-3">
                      {!file.isFolder && (
                        <Checkbox
                          checked={selectedFiles.has(file.id)}
                          onCheckedChange={() => toggleFileSelection(file.id)}
                        />
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => file.isFolder && handleFolderClick(file)}
                        onDoubleClick={() => !file.isFolder && handleDownload(file)}
                        className={cn(
                          'flex items-center gap-3 text-left',
                          file.isFolder && 'cursor-pointer'
                        )}
                      >
                        <FileTypeIcon
                          filename={file.name}
                          mimeType={file.mimeType}
                          isFolder={file.isFolder}
                          size="md"
                        />
                        <span className="truncate max-w-xs">{file.name}</span>
                      </button>
                    </td>
                    <td className="p-3 text-sm text-white/50 hidden md:table-cell">
                      {file.isFolder ? '—' : formatFileSize(file.size, { binary: false })}
                    </td>
                    <td className="p-3 text-sm text-white/50 hidden lg:table-cell">
                      {formatDate(new Date(file.uploadedAt))}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!file.isFolder && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(file)}
                            className="h-8 w-8 text-white/50 hover:text-white/80"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(file)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredFiles.map((file) => {
            return (
              <div
                key={file.id}
                className={cn(
                  'group relative p-4 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer',
                  selectedFiles.has(file.id) && 'border-primary bg-primary/5'
                )}
                onClick={() => {
                  if (file.isFolder) {
                    handleFolderClick(file);
                  } else {
                    toggleFileSelection(file.id);
                  }
                }}
                onDoubleClick={() => !file.isFolder && handleDownload(file)}
              >
                {/* Checkbox */}
                {!file.isFolder && (
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Checkbox
                      checked={selectedFiles.has(file.id)}
                      onCheckedChange={() => toggleFileSelection(file.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}

                {/* File Icon */}
                <div className="flex justify-center mb-3">
                  <div className="p-4 rounded-lg bg-[#0E282E]/50">
                    <FileTypeIcon
                      filename={file.name}
                      mimeType={file.mimeType}
                      isFolder={file.isFolder}
                      size="2xl"
                    />
                  </div>
                </div>

                {/* File Name */}
                <p className="text-sm font-medium text-center truncate" title={file.name}>
                  {file.name}
                </p>

                {/* File Size */}
                {!file.isFolder && (
                  <p className="text-xs text-white/50 text-center mt-1">
                    {formatFileSize(file.size, { binary: false })}
                  </p>
                )}

                {/* Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  {!file.isFolder && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file);
                      }}
                      className="h-7 w-7 bg-[#00111A]/80"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(file);
                    }}
                    className="h-7 w-7 bg-[#00111A]/80 text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {fileToDelete?.isFolder ? 'Folder' : 'File'}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{fileToDelete?.name}"?
              {fileToDelete?.isFolder && ' All files inside will also be deleted.'}
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for the new folder.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFolder();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNewFolderDialogOpen(false);
                setNewFolderName('');
              }}
              disabled={isCreatingFolder}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={isCreatingFolder}>
              {isCreatingFolder ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 min-w-[160px] bg-[#00111A] border border-[#0E282E] rounded-lg shadow-xl py-1"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.file.isFolder ? (
            <button
              onClick={() => {
                handleFolderClick(contextMenu.file);
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-[#0E282E] hover:text-primary flex items-center gap-2 transition-colors"
            >
              <FolderOpen className="h-4 w-4" />
              Open Folder
            </button>
          ) : (
            <button
              onClick={() => {
                handleDownload(contextMenu.file);
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-[#0E282E] hover:text-primary flex items-center gap-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          )}
          <div className="border-t border-[#0E282E] my-1" />
          <button
            onClick={() => {
              handleDeleteClick(contextMenu.file);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center gap-2 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
