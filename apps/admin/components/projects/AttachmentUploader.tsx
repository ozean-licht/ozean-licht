'use client';

/**
 * AttachmentUploader Component
 *
 * Upload files to a task with drag-and-drop support.
 * Shows upload progress and handles errors.
 *
 * Phase 11 of Project Management MVP
 */

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DBAttachment } from '@/lib/attachment-utils';

interface AttachmentUploaderProps {
  taskId: string;
  onUpload: (attachment: DBAttachment) => void;
  onError?: (error: string) => void;
  maxSize?: number; // in MB
  compact?: boolean;
}

const MAX_FILE_SIZE_MB = 25;

export default function AttachmentUploader({
  taskId,
  onUpload,
  onError,
  maxSize = MAX_FILE_SIZE_MB,
  compact = false,
}: AttachmentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    // Validate size
    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      onError?.(`File too large. Maximum size is ${maxSize}MB`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadingFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use XMLHttpRequest for progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percentComplete);
          }
        });

        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              onUpload(data.attachment);
              resolve();
            } catch (parseError) {
              reject(new Error('Failed to parse response'));
            }
          } else {
            try {
              const data = JSON.parse(xhr.responseText);
              reject(new Error(data.error || 'Upload failed'));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        });

        // Handle errors
        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload cancelled'));
        });

        // Send request
        xhr.open('POST', `/api/tasks/${taskId}/attachments`);
        xhr.send(formData);
      });

      setUploadProgress(0);
      setUploadingFileName(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      onError?.(message);
      setUploadProgress(0);
      setUploadingFileName(null);
    } finally {
      setIsUploading(false);
    }
  }, [taskId, maxSize, onUpload, onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  }, [handleUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [handleUpload]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={openFilePicker}
          disabled={isUploading}
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {uploadProgress > 0 ? `${uploadProgress}%` : 'Uploading...'}
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Add File
            </>
          )}
        </Button>
        {isUploading && uploadingFileName && (
          <span className="text-xs text-[#C4C8D4] truncate max-w-[200px]">
            {uploadingFileName}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-primary/20 hover:border-primary/40',
        isUploading && 'opacity-50 pointer-events-none'
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      <div className="flex flex-col items-center gap-3">
        {isUploading ? (
          <>
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-[#C4C8D4] truncate">{uploadingFileName}</p>
                <p className="text-sm text-primary font-medium">{uploadProgress}%</p>
              </div>
              <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-white mb-1">
                Drag and drop a file here, or{' '}
                <button
                  onClick={openFilePicker}
                  className="text-primary hover:underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-[#C4C8D4]">
                Max file size: {maxSize}MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
