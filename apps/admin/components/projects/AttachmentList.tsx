'use client';

/**
 * AttachmentList Component
 *
 * Display list of file attachments with download and delete actions.
 * Shows file icon, name, size, and uploader info.
 *
 * Phase 11 of Project Management MVP
 */

import React from 'react';
import {
  File,
  FileImage,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  Trash2,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize, isImageType, isPdfType, getFileExtension } from '@/lib/attachment-utils';
import type { DBAttachment } from '@/lib/attachment-utils';
import { cn } from '@/lib/utils';

interface AttachmentListProps {
  attachments: DBAttachment[];
  onDelete?: (attachmentId: string) => void;
  onPreview?: (attachment: DBAttachment) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

// Get icon based on file type
function getFileIcon(attachment: DBAttachment) {
  const fileType = attachment.file_type;

  if (isImageType(fileType)) {
    return <FileImage className="w-5 h-5 text-blue-400" />;
  }

  if (isPdfType(fileType)) {
    return <FileText className="w-5 h-5 text-red-400" />;
  }

  const ext = getFileExtension(attachment.file_name);

  // Office documents
  if (['doc', 'docx'].includes(ext)) {
    return <FileText className="w-5 h-5 text-blue-500" />;
  }
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
  }
  if (['ppt', 'pptx'].includes(ext)) {
    return <FileText className="w-5 h-5 text-orange-500" />;
  }

  // Code files
  if (['js', 'ts', 'tsx', 'jsx', 'json', 'html', 'css', 'xml', 'md'].includes(ext)) {
    return <FileCode className="w-5 h-5 text-purple-400" />;
  }

  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return <FileArchive className="w-5 h-5 text-yellow-500" />;
  }

  return <File className="w-5 h-5 text-[#C4C8D4]" />;
}

// Format date for display
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function AttachmentList({
  attachments,
  onDelete,
  onPreview,
  isLoading = false,
  emptyMessage = 'No attachments',
}: AttachmentListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
        <span className="ml-2 text-sm text-[#C4C8D4]">Loading attachments...</span>
      </div>
    );
  }

  if (attachments.length === 0) {
    return (
      <p className="text-sm text-[#C4C8D4] text-center py-6 italic">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg',
            'bg-[#00111A]/50 border border-primary/10',
            'hover:border-primary/20 transition-colors group'
          )}
        >
          {/* File icon */}
          <div className="flex-shrink-0">
            {getFileIcon(attachment)}
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <button
              onClick={() => onPreview?.(attachment)}
              className="text-sm text-white hover:text-primary truncate block w-full text-left"
              title={attachment.file_name}
            >
              {attachment.file_name}
            </button>
            <div className="flex items-center gap-2 text-xs text-[#C4C8D4]">
              <span>{formatFileSize(attachment.file_size_bytes)}</span>
              <span>•</span>
              <span>{formatDate(attachment.created_at)}</span>
              {attachment.uploaded_by_name && (
                <>
                  <span>•</span>
                  <span>by {attachment.uploaded_by_name}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Download/Open */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#C4C8D4] hover:text-white"
              onClick={() => window.open(attachment.file_url, '_blank')}
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>

            {/* Delete */}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#C4C8D4] hover:text-red-400"
                onClick={() => onDelete(attachment.id)}
                title="Delete attachment"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
