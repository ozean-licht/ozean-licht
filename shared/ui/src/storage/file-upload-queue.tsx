'use client';

/**
 * File Upload Queue Component
 * Upload progress tracking with individual file progress bars
 */

import * as React from 'react'
import { X, CheckCircle2, AlertCircle, Loader2, XCircle } from 'lucide-react'
import { cn } from '../utils/cn'
import { Progress } from '../cossui/progress'
import type { UploadProgress } from './types'

export interface FileUploadQueueProps {
  uploads: UploadProgress[]
  onCancel?: (fileId: string) => void
  onRetry?: (fileId: string) => void
  onClear?: (fileId: string) => void
  className?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export function FileUploadQueue({
  uploads,
  onCancel,
  onRetry,
  onClear,
  className,
  position = 'bottom-right',
}: FileUploadQueueProps) {
  // Auto-dismiss completed uploads after 3 seconds
  React.useEffect(() => {
    const completedUploads = uploads.filter((u) => u.status === 'completed')
    if (completedUploads.length > 0 && onClear) {
      const timers = completedUploads.map((upload) =>
        setTimeout(() => onClear(upload.fileId), 3000)
      )
      return () => timers.forEach(clearTimeout)
    }
    return undefined;
  }, [uploads, onClear])

  if (uploads.length === 0) return null

  const activeUploads = uploads.filter((u) => u.status !== 'completed')
  const totalProgress =
    activeUploads.length > 0
      ? activeUploads.reduce((sum, u) => sum + u.percentage, 0) / activeUploads.length
      : 100

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  }

  return (
    <div
      className={cn(
        'fixed z-50 w-full max-w-md',
        positionClasses[position],
        'animate-in slide-in-from-bottom-5 duration-300',
        className
      )}
    >
      <div className="rounded-lg border border-primary/30 shadow-lg shadow-primary/10 bg-[#00111A]/95 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0E282E] px-4 py-3">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <h3 className="font-sans text-sm font-medium text-white">
              Uploading {activeUploads.length} {activeUploads.length === 1 ? 'file' : 'files'}
            </h3>
          </div>
          <div className="text-xs text-[#C4C8D4]">{Math.round(totalProgress)}%</div>
        </div>

        {/* Upload List */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          <div className="space-y-2">
            {uploads.map((upload) => (
              <UploadItem
                key={upload.fileId}
                upload={upload}
                onCancel={onCancel}
                onRetry={onRetry}
                onClear={onClear}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface UploadItemProps {
  upload: UploadProgress
  onCancel?: (fileId: string) => void
  onRetry?: (fileId: string) => void
  onClear?: (fileId: string) => void
}

function UploadItem({ upload, onCancel, onRetry, onClear }: UploadItemProps) {
  const { fileId, fileName, size, percentage, status, error } = upload

  return (
    <div className="group rounded-lg bg-card/50 p-3 transition-colors hover:bg-card/80">
      <div className="flex items-start justify-between gap-3">
        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Status Icon */}
            {status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />}
            {status === 'error' && <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />}
            {status === 'cancelled' && <XCircle className="h-4 w-4 text-[#C4C8D4] flex-shrink-0" />}
            {(status === 'uploading' || status === 'pending') && (
              <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />
            )}

            {/* File Name */}
            <p className="truncate text-sm text-white font-medium">{fileName}</p>
          </div>

          {/* File Size & Progress */}
          <div className="mt-1 flex items-center gap-2 text-xs text-[#C4C8D4]">
            <span>{formatBytes(size)}</span>
            {status === 'uploading' && <span>• {percentage}%</span>}
            {status === 'completed' && <span className="text-green-500">• Complete</span>}
            {status === 'error' && <span className="text-destructive">• Failed</span>}
            {status === 'cancelled' && <span>• Cancelled</span>}
          </div>

          {/* Error Message */}
          {error && <p className="mt-1 text-xs text-destructive">{error}</p>}

          {/* Progress Bar */}
          {(status === 'uploading' || status === 'pending') && (
            <div className="mt-2">
              <Progress value={percentage} className="h-1" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {status === 'uploading' && onCancel && (
            <button
              onClick={() => onCancel(fileId)}
              className="rounded p-1 hover:bg-card transition-colors"
              aria-label="Cancel upload"
            >
              <X className="h-4 w-4 text-[#C4C8D4] hover:text-white" />
            </button>
          )}

          {status === 'error' && onRetry && (
            <button
              onClick={() => onRetry(fileId)}
              className="rounded px-2 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              Retry
            </button>
          )}

          {(status === 'completed' || status === 'cancelled' || status === 'error') && onClear && (
            <button
              onClick={() => onClear(fileId)}
              className="rounded p-1 hover:bg-card transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Clear"
            >
              <X className="h-4 w-4 text-[#C4C8D4] hover:text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
