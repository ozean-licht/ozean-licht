/**
 * Attachment Utilities (Client-Safe)
 *
 * Utility functions for file attachments that are safe to use
 * in client components. This file contains NO database imports.
 *
 * Phase 11 of Project Management MVP
 */

// Re-export types from centralized types file
export type { DBAttachment, AttachmentFilters } from './types';

/**
 * Check if file type is an image
 */
export function isImageType(fileType: string | null): boolean {
  if (!fileType) return false;
  return fileType.startsWith('image/');
}

/**
 * Check if file type is a PDF
 */
export function isPdfType(fileType: string | null): boolean {
  if (!fileType) return false;
  return fileType === 'application/pdf';
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}
