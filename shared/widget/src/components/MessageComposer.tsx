/**
 * MessageComposer Component
 * Input area for composing and sending messages in the support chat widget
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface MessageComposerProps {
  /** Callback fired when user sends a message */
  onSend: (content: string, attachments: File[]) => void;
  /** Optional callback fired when user is typing (debounced) */
  onTyping?: () => void;
  /** Whether the composer is disabled */
  disabled?: boolean;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Primary brand color for theming */
  primaryColor?: string;
}

interface FilePreview {
  file: File;
  previewUrl?: string;
  isImage: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSend,
  onTyping,
  disabled = false,
  placeholder = 'Nachricht schreiben...',
  primaryColor = '#0ec2bc',
}) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<FilePreview[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';

    // Calculate new height (min 1 row, max 4 rows)
    const lineHeight = 20; // Approximate line height in pixels
    const minHeight = lineHeight;
    const maxHeight = lineHeight * 4;
    const scrollHeight = textarea.scrollHeight;

    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, []);

  // Adjust height when content changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [content, adjustTextareaHeight]);

  // Handle text input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Debounced typing indicator
    if (onTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        onTyping();
      }, 1000);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift+Enter allows newline (default behavior)
  };

  // Handle send action
  const handleSend = () => {
    if (disabled) return;

    const trimmedContent = content.trim();
    const hasContent = trimmedContent.length > 0;
    const hasAttachments = attachments.length > 0;

    if (!hasContent && !hasAttachments) return;

    // Extract File objects from attachments
    const files = attachments.map(a => a.file);

    // Call onSend callback
    onSend(trimmedContent, files);

    // Reset state
    setContent('');
    setAttachments([]);

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newPreviews: FilePreview[] = files.map(file => {
      const isImage = file.type.startsWith('image/');
      const preview: FilePreview = {
        file,
        isImage,
      };

      // Create preview URL for images
      if (isImage) {
        preview.previewUrl = URL.createObjectURL(file);
      }

      return preview;
    });

    setAttachments(prev => [...prev, ...newPreviews]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle attachment removal
  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => {
      const updated = [...prev];
      const removed = updated[index];

      // Revoke object URL to free memory
      if (removed.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }

      updated.splice(index, 1);
      return updated;
    });
  };

  // Cleanup effect for preview URLs
  useEffect(() => {
    return () => {
      attachments.forEach(attachment => {
        if (attachment.previewUrl) {
          URL.revokeObjectURL(attachment.previewUrl);
        }
      });
    };
  }, [attachments]);

  // Check if send button should be disabled
  const isSendDisabled = disabled || (content.trim().length === 0 && attachments.length === 0);

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {/* Attachment preview bar */}
      {attachments.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            paddingBottom: '4px',
          }}
        >
          {attachments.map((attachment, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '6px 8px',
                fontSize: '12px',
                maxWidth: '200px',
              }}
            >
              {/* Preview thumbnail for images */}
              {attachment.isImage && attachment.previewUrl ? (
                <img
                  src={attachment.previewUrl}
                  alt={attachment.file.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                // File icon for non-images
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#6b7280',
                  }}
                >
                  📄
                </div>
              )}

              {/* File name */}
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: '#374151',
                  flex: 1,
                }}
              >
                {attachment.file.name}
              </span>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveAttachment(index)}
                disabled={disabled}
                style={{
                  width: '18px',
                  height: '18px',
                  padding: 0,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: '#6b7280',
                  flexShrink: 0,
                }}
                aria-label="Remove attachment"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
        }}
      >
        {/* Attachment button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          style={{
            width: '40px',
            height: '40px',
            padding: 0,
            border: 'none',
            backgroundColor: 'transparent',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: disabled ? '#d1d5db' : '#6b7280',
            flexShrink: 0,
            borderRadius: '50%',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Attach file"
        >
          📎
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={disabled}
        />

        {/* Text input */}
        <div
          style={{
            flex: 1,
            position: 'relative',
          }}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            style={{
              width: '100%',
              minHeight: '40px',
              maxHeight: '80px',
              padding: '10px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              fontSize: '14px',
              lineHeight: '20px',
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              backgroundColor: disabled ? '#f9fafb' : '#ffffff',
              color: disabled ? '#9ca3af' : '#1f2937',
              overflow: 'auto',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = primaryColor;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}20`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={isSendDisabled}
          style={{
            width: '40px',
            height: '40px',
            padding: 0,
            border: 'none',
            backgroundColor: isSendDisabled ? primaryColor : primaryColor,
            opacity: isSendDisabled ? 0.5 : 1,
            cursor: isSendDisabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            flexShrink: 0,
            transition: 'transform 0.2s, opacity 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!isSendDisabled) {
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Send message"
        >
          {/* Send arrow icon (SVG) */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: 'rotate(45deg)',
            }}
          >
            <path
              d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
