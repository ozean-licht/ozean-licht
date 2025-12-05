'use client';

/**
 * FileDropzone Component
 *
 * A wrapper component that provides drag-and-drop file upload functionality.
 * Displays an overlay when files are being dragged over, and filters files
 * based on allowed MIME types and size limits from messaging configuration.
 *
 * Part of the unified messaging system for Support Management.
 */

import React, { useState, useCallback, DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ATTACHMENT_CONFIG, isAllowedMimeType } from '@/lib/storage/messaging-config';

interface FileDropzoneProps {
  children: React.ReactNode;
  onFilesDropped: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * FileDropzone wraps content and adds drag-and-drop file upload capability.
 * Validates files against allowed MIME types and size limits before passing to parent.
 */
export default function FileDropzone({
  children,
  onFilesDropped,
  disabled = false,
  className,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Handle drag enter - show drop overlay
   */
  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  /**
   * Handle drag leave - hide drop overlay
   * Only hide if we're actually leaving the dropzone (not entering a child element)
   */
  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Check if we're leaving the dropzone entirely
      // currentTarget is the element the listener is attached to
      // relatedTarget is where the mouse is going
      if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragging(false);
      }
    },
    []
  );

  /**
   * Handle drag over - required to allow drop
   */
  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    },
    []
  );

  /**
   * Handle drop - process files and pass valid ones to parent
   */
  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) {
        return;
      }

      // Extract files from drag event
      const droppedFiles = Array.from(e.dataTransfer.files);

      // Filter files based on allowed MIME types and size limits
      const validFiles = droppedFiles.filter((file) => {
        // Check MIME type
        if (!isAllowedMimeType(file.type)) {
          console.warn(`File "${file.name}" has invalid MIME type: ${file.type}`);
          return false;
        }

        // Check file size based on whether it's an image
        const isImage = file.type.startsWith('image/');
        const maxSize = isImage
          ? ATTACHMENT_CONFIG.size.maxImageSize
          : ATTACHMENT_CONFIG.size.maxFileSize;

        if (file.size > maxSize) {
          console.warn(
            `File "${file.name}" exceeds size limit: ${(file.size / 1024 / 1024).toFixed(2)}MB > ${(maxSize / 1024 / 1024).toFixed(2)}MB`
          );
          return false;
        }

        return true;
      });

      // Pass valid files to parent
      if (validFiles.length > 0) {
        onFilesDropped(validFiles);
      }
    },
    [disabled, onFilesDropped]
  );

  return (
    <div
      className={cn('relative', className)}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Normal content */}
      {children}

      {/* Drop overlay - shown when dragging files over */}
      {isDragging && !disabled && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-primary/10 border-2 border-dashed border-primary rounded-lg transition-colors">
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-primary">Drop files here</p>
            <p className="text-sm text-primary/80">
              Images, documents, audio, and video supported
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
