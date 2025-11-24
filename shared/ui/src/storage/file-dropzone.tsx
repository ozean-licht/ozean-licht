/**
 * File Dropzone Component
 * Drag & drop file upload zone with visual feedback
 */

import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, AlertCircle, FileCheck } from 'lucide-react'
import { cn } from '../utils/cn'

export interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: Record<string, string[]>
  maxSize?: number // in bytes
  maxFiles?: number
  disabled?: boolean
  className?: string
  multiple?: boolean
}

export function FileDropzone({
  onFilesSelected,
  accept,
  maxSize = 100 * 1024 * 1024, // 100MB default
  maxFiles = 10,
  disabled = false,
  className,
  multiple = true,
}: FileDropzoneProps) {
  const [error, setError] = React.useState<string | null>(null)

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null)

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError(`File is too large. Maximum size is ${formatBytes(maxSize)}`)
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('File type not allowed')
        } else if (rejection.errors[0]?.code === 'too-many-files') {
          setError(`Too many files. Maximum is ${maxFiles}`)
        } else {
          setError('File rejected')
        }
        return
      }

      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles)
      }
    },
    [onFilesSelected, maxSize, maxFiles]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    disabled,
    multiple,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative rounded-lg border-2 border-dashed transition-all duration-200',
        'flex flex-col items-center justify-center p-8 md:p-12',
        'cursor-pointer',
        'glass-card',
        isDragActive && !isDragReject && [
          'border-primary bg-primary/5',
          'shadow-lg shadow-primary/15',
        ],
        isDragReject && 'border-destructive bg-destructive/5',
        disabled && 'opacity-50 cursor-not-allowed',
        !isDragActive && !disabled && 'hover:border-primary/40 hover:bg-primary/5',
        className
      )}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center space-y-4 text-center">
        {/* Icon */}
        <div
          className={cn(
            'rounded-full p-4 transition-all duration-200',
            isDragActive && !isDragReject && 'bg-primary/10 animate-pulse',
            isDragReject && 'bg-destructive/10',
            !isDragActive && 'bg-card'
          )}
        >
          {isDragReject ? (
            <AlertCircle className="h-8 w-8 text-destructive" />
          ) : isDragActive ? (
            <FileCheck className="h-8 w-8 text-primary" />
          ) : (
            <Upload
              className={cn(
                'h-8 w-8 transition-colors',
                disabled ? 'text-[#C4C8D4]/50' : 'text-primary'
              )}
            />
          )}
        </div>

        {/* Text */}
        <div className="space-y-2">
          <p className="font-sans text-base text-white">
            {isDragActive ? (
              isDragReject ? (
                'File type not allowed'
              ) : (
                'Drop files here'
              )
            ) : (
              <>
                <span className="text-primary font-medium">Click to upload</span> or drag and drop
              </>
            )}
          </p>
          <p className="text-sm text-[#C4C8D4]">
            {accept
              ? `Accepted: ${Object.keys(accept).join(', ')}`
              : 'All file types accepted'}
          </p>
          <p className="text-xs text-[#C4C8D4]/70">
            Maximum size: {formatBytes(maxSize)} • Maximum files: {maxFiles}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2 flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to format bytes
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
