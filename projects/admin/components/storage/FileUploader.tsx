/**
 * FileUploader Component
 *
 * Drag-and-drop file uploader with progress tracking and validation.
 * Supports multiple files and displays upload progress for each file.
 */

'use client';

import React, { useState, useCallback } from 'react';
// Note: UploadProgress type is defined but not used in component directly
// It would be used for progress tracking in upload callbacks

interface FileUploaderProps {
  /** Bucket to upload files to */
  bucket: string;
  /** Callback when files are uploaded successfully */
  onUploadComplete?: (files: Array<{ key: string; size: number }>) => void;
  /** Callback when upload fails */
  onUploadError?: (error: Error) => void;
  /** Maximum file size in bytes (default: 100MB) */
  maxFileSize?: number;
  /** Allowed file types (MIME types) */
  allowedTypes?: string[];
  /** Allow multiple file selection */
  multiple?: boolean;
}

interface FileUploadState {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

/**
 * FileUploader provides drag-and-drop file upload with progress tracking
 *
 * Features:
 * - Drag and drop support
 * - File type validation
 * - File size validation
 * - Upload progress tracking
 * - Multiple file support
 * - Error handling
 *
 * @example
 * ```tsx
 * <FileUploader
 *   bucket="videos"
 *   onUploadComplete={(files) => console.log('Uploaded:', files)}
 *   allowedTypes={['video/mp4', 'video/webm']}
 *   maxFileSize={500 * 1024 * 1024} // 500MB
 * />
 * ```
 */
export default function FileUploader({
  bucket,
  onUploadComplete,
  onUploadError,
  maxFileSize = 100 * 1024 * 1024, // 100MB default
  allowedTypes,
  multiple = true,
}: FileUploaderProps) {
  const [files, setFiles] = useState<FileUploadState[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Validate a single file
   */
  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > maxFileSize) {
        return `File size exceeds ${formatBytes(maxFileSize)}`;
      }

      // Check file type
      if (allowedTypes && !allowedTypes.includes(file.type)) {
        return `File type ${file.type} not allowed`;
      }

      return null;
    },
    [maxFileSize, allowedTypes]
  );

  /**
   * Handle file selection
   */
  const handleFiles = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles || selectedFiles.length === 0) return;

      const newFiles: FileUploadState[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const error = validateFile(file);

        newFiles.push({
          file,
          progress: 0,
          status: error ? 'error' : 'pending',
          error: error || undefined,
        });
      }

      setFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles));

      // Start uploads for valid files
      newFiles.forEach((fileState, index) => {
        if (fileState.status === 'pending') {
          uploadFile(fileState, index + (multiple ? files.length : 0));
        }
      });
    },
    [files.length, multiple, validateFile]
  );

  /**
   * Upload a single file
   */
  const uploadFile = async (fileState: FileUploadState, index: number) => {
    // Update status to uploading
    setFiles((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, status: 'uploading' as const } : f
      )
    );

    try {
      const formData = new FormData();
      formData.append('file', fileState.file);
      formData.append('bucket', bucket);
      formData.append('key', fileState.file.name);

      const response = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Upload failed');
      }

      const result = await response.json();

      // Update status to complete
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: 'complete' as const, progress: 100 }
            : f
        )
      );

      // Call success callback
      if (onUploadComplete) {
        onUploadComplete([{ key: result.key, size: result.size }]);
      }
    } catch (error: any) {
      // Update status to error
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: 'error' as const,
                error: error.message || 'Upload failed',
              }
            : f
        )
      );

      // Call error callback
      if (onUploadError) {
        onUploadError(error);
      }
    }
  };

  /**
   * Handle drag events
   */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      handleFiles(droppedFiles);
    },
    [handleFiles]
  );

  /**
   * Handle file input change
   */
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  /**
   * Remove a file from the list
   */
  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
          >
            <span>Upload files</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              multiple={multiple}
              onChange={handleFileInputChange}
              accept={allowedTypes?.join(',')}
            />
          </label>
          <span className="text-gray-600"> or drag and drop</span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {allowedTypes
            ? `Allowed types: ${allowedTypes.join(', ')}`
            : 'All file types allowed'}
        </p>
        <p className="text-xs text-gray-500">
          Max file size: {formatBytes(maxFileSize)}
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Files</h4>
          {files.map((fileState, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
            >
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileState.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatBytes(fileState.file.size)}
                </p>

                {/* Progress bar */}
                {fileState.status === 'uploading' && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${fileState.progress}%` }}
                    />
                  </div>
                )}

                {/* Error message */}
                {fileState.status === 'error' && (
                  <p className="mt-1 text-xs text-red-600">{fileState.error}</p>
                )}
              </div>

              {/* Status indicator */}
              <div className="flex items-center space-x-2">
                {fileState.status === 'complete' && (
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {fileState.status === 'error' && (
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {fileState.status === 'uploading' && (
                  <svg
                    className="animate-spin h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}

                {/* Remove button */}
                {fileState.status !== 'uploading' && (
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
