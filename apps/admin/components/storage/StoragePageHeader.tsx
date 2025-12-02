/**
 * Storage Page Header Component
 *
 * Displays page title, storage statistics, and quick action buttons.
 * Uses shared formatFileSize from @ozean-licht/shared-ui for consistency.
 */

'use client';

import React from 'react';
import { Cloud, Upload, FolderPlus, RefreshCw, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@shared/ui';
import { cn } from '@/lib/utils';

export interface StoragePageHeaderProps {
  /** Total files count */
  totalFiles: number;
  /** Total storage size in bytes */
  totalSize: number;
  /** Whether data is currently loading */
  isLoading?: boolean;
  /** Last refresh timestamp */
  lastUpdated?: Date | null;
  /** Callback for upload action */
  onUpload?: () => void;
  /** Callback for new folder action */
  onCreateFolder?: () => void;
  /** Callback for refresh action */
  onRefresh?: () => void;
  /** Current bucket display name */
  currentBucket?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * StoragePageHeader Component
 */
export function StoragePageHeader({
  totalFiles,
  totalSize,
  isLoading = false,
  lastUpdated,
  onUpload,
  onCreateFolder,
  onRefresh,
  currentBucket,
  className,
}: StoragePageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Cloud className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-decorative text-gray-900 dark:text-white drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]">
              Ozean Cloud
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentBucket ? `${currentBucket} Storage` : 'Cloud Storage Management'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}

          {onCreateFolder && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateFolder}
              disabled={isLoading}
              className="gap-2"
            >
              <FolderPlus className="h-4 w-4" />
              <span className="hidden sm:inline">New Folder</span>
            </Button>
          )}

          {onUpload && (
            <Button
              variant="default"
              size="sm"
              onClick={onUpload}
              disabled={isLoading}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4" />
          <span>
            <strong className="text-gray-900 dark:text-white">{totalFiles.toLocaleString()}</strong>{' '}
            {totalFiles === 1 ? 'file' : 'files'}
          </span>
        </div>

        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />

        <div>
          <span>
            <strong className="text-gray-900 dark:text-white">{formatFileSize(totalSize, { binary: false })}</strong>{' '}
            total
          </span>
        </div>

        {lastUpdated && (
          <>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="text-xs">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
