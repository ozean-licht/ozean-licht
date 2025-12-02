'use client';

/**
 * AttachmentPreview Component
 *
 * Preview attachments inline - images shown as thumbnails,
 * PDFs show first page, other files show icon.
 *
 * Phase 11 of Project Management MVP
 */

import React, { useState } from 'react';
import {
  File,
  FileImage,
  FileText,
  Download,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { isImageType, isPdfType, formatFileSize } from '@/lib/attachment-utils';
import type { DBAttachment } from '@/lib/attachment-utils';
import { cn } from '@/lib/utils';

interface AttachmentPreviewProps {
  attachment: DBAttachment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AttachmentPreview({
  attachment,
  open,
  onOpenChange,
}: AttachmentPreviewProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (!attachment) return null;

  const isImage = isImageType(attachment.file_type);
  const isPdf = isPdfType(attachment.file_type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-primary/20 max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            {isImage ? (
              <FileImage className="w-5 h-5 text-blue-400" />
            ) : isPdf ? (
              <FileText className="w-5 h-5 text-red-400" />
            ) : (
              <File className="w-5 h-5 text-[#C4C8D4]" />
            )}
            <span className="truncate">{attachment.file_name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Image preview */}
          {isImage && (
            <div className="relative bg-[#00111A] rounded-lg overflow-hidden">
              {imageLoading && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              )}
              {imageError ? (
                <div className="flex flex-col items-center justify-center py-12 text-[#C4C8D4]">
                  <FileImage className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">Failed to load image</p>
                </div>
              ) : (
                <img
                  src={attachment.file_url}
                  alt={attachment.file_name}
                  className={cn(
                    'max-w-full max-h-[60vh] mx-auto object-contain',
                    imageLoading && 'opacity-0'
                  )}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                  }}
                />
              )}
            </div>
          )}

          {/* PDF preview - use embed */}
          {isPdf && (
            <div className="bg-[#00111A] rounded-lg overflow-hidden">
              <embed
                src={attachment.file_url}
                type="application/pdf"
                width="100%"
                height="500px"
                className="rounded-lg"
              />
            </div>
          )}

          {/* Other file types - show icon and info */}
          {!isImage && !isPdf && (
            <div className="flex flex-col items-center justify-center py-12 bg-[#00111A] rounded-lg">
              <File className="w-16 h-16 text-[#C4C8D4] mb-4" />
              <p className="text-white font-medium mb-1">{attachment.file_name}</p>
              <p className="text-sm text-[#C4C8D4]">
                {formatFileSize(attachment.file_size_bytes)}
                {attachment.file_type && ` • ${attachment.file_type}`}
              </p>
            </div>
          )}

          {/* File info */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary/10">
            <div className="text-sm text-[#C4C8D4]">
              <span>{formatFileSize(attachment.file_size_bytes)}</span>
              {attachment.uploaded_by_name && (
                <span> • Uploaded by {attachment.uploaded_by_name}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30"
                onClick={() => window.open(attachment.file_url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30"
                asChild
              >
                <a href={attachment.file_url} download={attachment.file_name}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
