'use client';

/**
 * MessageComposer Component
 *
 * A React component for composing messages with file attachments.
 * Features:
 * - Text input with textarea
 * - File attachment support with preview
 * - Validation of file size and type
 * - Direct upload to S3 via presigned URLs
 * - Upload progress indication
 * - Remove attachments before sending
 *
 * Part of the unified messaging system.
 */

import React, { useState, useRef, useCallback } from 'react';
import { Paperclip, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import AttachmentPreview from './AttachmentPreview';
import type { Attachment } from '@/types/messaging';
import {
  ATTACHMENT_CONFIG,
  isAllowedMimeType,
  validateFileSize,
  validateTotalSize,
} from '@/lib/storage/messaging-config';
import { cn } from '@/lib/utils';

// ============================================================================
// Component Props
// ============================================================================

interface MessageComposerProps {
  conversationId: string;
  onSend: (message: { content: string; attachments: Attachment[] }) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

interface UploadUrlResponse {
  fileId: string;
  uploadUrl: string;
  method: string;
  headers: {
    'Content-Type': string;
  };
  confirmUrl: string;
}

interface ConfirmUploadResponse {
  attachment: Attachment;
}

// ============================================================================
// Component
// ============================================================================

export default function MessageComposer({
  conversationId,
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
}: MessageComposerProps) {
  // State
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sending, setSending] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ============================================================================
  // File Upload Logic
  // ============================================================================

  /**
   * Handle file selection from input
   */
  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      setUploadProgress(0);

      const fileArray = Array.from(files);
      const newAttachments: Attachment[] = [];
      let successCount = 0;
      const errorMessages: string[] = [];

      try {
        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i];

          // Update progress
          setUploadProgress(Math.round(((i + 1) / fileArray.length) * 100));

          try {
            // Validate file type
            if (!isAllowedMimeType(file.type)) {
              errorMessages.push(
                `${file.name}: File type not allowed (${file.type})`
              );
              continue;
            }

            // Validate file size
            const sizeValidation = validateFileSize(
              file.size,
              file.type.startsWith('image/')
            );
            if (!sizeValidation.valid) {
              errorMessages.push(
                `${file.name}: ${sizeValidation.error}`
              );
              continue;
            }

            // Validate total size with existing attachments
            const currentSizes = attachments.map((a) => a.size);
            const newSizes = newAttachments.map((a) => a.size);
            const allSizes = [...currentSizes, ...newSizes, file.size];
            const totalSizeValidation = validateTotalSize(allSizes);
            if (!totalSizeValidation.valid) {
              errorMessages.push(
                `Cannot add ${file.name}: ${totalSizeValidation.error}`
              );
              break; // Stop processing more files if total size exceeded
            }

            // Step 1: Get presigned upload URL
            const uploadUrlResponse = await fetch(
              '/api/messaging/attachments/upload',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  conversationId,
                  fileName: file.name,
                  fileSize: file.size,
                  mimeType: file.type,
                }),
              }
            );

            if (!uploadUrlResponse.ok) {
              const errorData = await uploadUrlResponse.json();
              errorMessages.push(
                `${file.name}: ${errorData.error || 'Failed to get upload URL'}`
              );
              continue;
            }

            const uploadData: UploadUrlResponse =
              await uploadUrlResponse.json();

            // Step 2: Upload file to presigned URL
            const uploadResponse = await fetch(uploadData.uploadUrl, {
              method: uploadData.method,
              headers: uploadData.headers,
              body: file,
            });

            if (!uploadResponse.ok) {
              errorMessages.push(
                `${file.name}: Failed to upload file to storage`
              );
              continue;
            }

            // Step 3: Confirm upload and get attachment object
            const confirmResponse = await fetch(uploadData.confirmUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                conversationId,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
              }),
            });

            if (!confirmResponse.ok) {
              const errorData = await confirmResponse.json();
              errorMessages.push(
                `${file.name}: ${errorData.error || 'Failed to confirm upload'}`
              );
              continue;
            }

            const confirmData: ConfirmUploadResponse =
              await confirmResponse.json();

            // Add to new attachments
            newAttachments.push(confirmData.attachment);
            successCount++;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            errorMessages.push(`${file.name}: ${errorMessage}`);
          }
        }

        // Add successful uploads to state
        if (newAttachments.length > 0) {
          setAttachments((prev) => [...prev, ...newAttachments]);
        }

        // Show errors if any
        if (errorMessages.length > 0) {
          toast.error('Upload completed with errors', {
            description: errorMessages.join('\n'),
            duration: 5000,
          });
        } else if (successCount > 0) {
          // Success message
          toast.success(`Successfully uploaded ${successCount} file(s)`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error('Failed to upload files', {
          description: errorMessage,
          duration: 5000,
        });
      } finally {
        setUploading(false);
        setUploadProgress(0);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [conversationId, attachments]
  );

  /**
   * Trigger file input click
   */
  const handleAttachClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Remove attachment from list
   */
  const handleRemoveAttachment = useCallback((attachmentId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  }, []);

  // ============================================================================
  // Send Message Logic
  // ============================================================================

  /**
   * Handle send message
   */
  const handleSend = useCallback(async () => {
    // Don't send if uploading
    if (uploading) {
      return;
    }

    // Don't send if no content and no attachments
    const trimmedContent = content.trim();
    if (!trimmedContent && attachments.length === 0) {
      return;
    }

    // Prevent multiple sends
    if (sending) {
      return;
    }

    try {
      setSending(true);

      // Call onSend handler
      await onSend({
        content: trimmedContent,
        attachments,
      });

      // Clear state on success
      setContent('');
      setAttachments([]);

      // Focus textarea
      textareaRef.current?.focus();
    } finally {
      setSending(false);
    }
  }, [content, attachments, uploading, sending, onSend]);

  /**
   * Handle Enter key to send (Shift+Enter for new line)
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // ============================================================================
  // Build accept attribute for file input
  // ============================================================================

  const acceptedFileTypes = Object.values(ATTACHMENT_CONFIG.mimeTypes)
    .flat()
    .join(',');

  // ============================================================================
  // Render
  // ============================================================================

  const isDisabled = disabled || uploading || sending;
  const canSend = !isDisabled && (content.trim() || attachments.length > 0);

  return (
    <div className="border-t border-border p-4 bg-card">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((attachment) => (
            <AttachmentPreview
              key={attachment.id}
              attachment={attachment}
              onRemove={() => handleRemoveAttachment(attachment.id)}
              showRemove={!isDisabled}
              size="md"
            />
          ))}
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Uploading files... {uploadProgress}%</span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Composer input row */}
      <div className="flex items-end gap-2">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isDisabled}
        />

        {/* Attach button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleAttachClick}
          disabled={isDisabled}
          className="shrink-0 hover:bg-primary/10"
          title="Attach files"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Message textarea */}
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled}
          className={cn(
            'min-h-[60px] max-h-[200px] resize-none',
            'bg-card/70 backdrop-blur-sm',
            'border-primary/25 focus-visible:border-primary/40'
          )}
          rows={2}
        />

        {/* Send button */}
        <Button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="shrink-0"
          size="icon"
          title="Send message"
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
