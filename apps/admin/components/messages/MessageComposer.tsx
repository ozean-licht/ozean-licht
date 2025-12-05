/**
 * MessageComposer Component - Team Chat & Messaging System
 *
 * Input area for composing and sending messages with attachments
 */

'use client';

import React, { useState, useRef, KeyboardEvent, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// SECURITY: File upload validation constants
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

interface MessageComposerProps {
  /** Callback when sending a message */
  onSend: (content: string, isPrivate: boolean, attachments: File[]) => void;
  /** Whether private notes are allowed */
  allowPrivateNotes?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Current typing users */
  typingUsers?: string[];
  /** Callback when user starts/stops typing */
  onTyping?: (isTyping: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * MessageComposer provides message input with features
 *
 * Features:
 * - Auto-resizing textarea
 * - Send button (keyboard: Cmd/Ctrl+Enter)
 * - Attachment button with file picker
 * - Emoji picker button (placeholder)
 * - Typing indicator display
 * - Private note toggle
 *
 * @example
 * ```tsx
 * <MessageComposer
 *   onSend={(content, isPrivate, files) => sendMessage(content, isPrivate, files)}
 *   allowPrivateNotes={true}
 *   placeholder="Type a message..."
 *   typingUsers={['Alice', 'Bob']}
 *   onTyping={(typing) => updateTypingStatus(typing)}
 * />
 * ```
 */
export default function MessageComposer({
  onSend,
  allowPrivateNotes = false,
  placeholder = 'Type a message...',
  typingUsers = [],
  onTyping,
  disabled = false,
}: MessageComposerProps) {
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea with debounced typing indicator
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;

    // SECURITY FIX: Improved typing indicator with state tracking and debouncing
    if (onTyping && e.target.value.length > 0) {
      // Only call onTyping(true) if not already typing
      if (!isTyping) {
        setIsTyping(true);
        onTyping(true);
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator (2 seconds)
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping(false);
      }, 2000);
    } else if (onTyping && e.target.value.length === 0 && isTyping) {
      // Clear typing if content is empty
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setIsTyping(false);
      onTyping(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear timeout on unmount
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Stop typing indicator if component unmounts
      if (isTyping && onTyping) {
        onTyping(false);
      }
    };
  }, [isTyping, onTyping]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl+Enter to send
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle send
  const handleSend = () => {
    if (!content.trim() && attachments.length === 0) return;
    if (disabled) return;

    onSend(content.trim(), isPrivate, attachments);

    // Reset state
    setContent('');
    setIsPrivate(false);
    setAttachments([]);
    setIsTyping(false);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Clear timeout and stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (onTyping) {
      onTyping(false);
    }
  };

  // Handle file selection with validation
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // SECURITY: Validate file uploads
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Check if adding these files would exceed max file count
    if (attachments.length + files.length > MAX_FILES) {
      alert(`Maximum ${MAX_FILES} files allowed. You currently have ${attachments.length} file(s).`);
      e.target.value = ''; // Reset file input
      return;
    }

    for (const file of files) {
      // Validate MIME type
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`File type not allowed: ${file.name} (${file.type})`);
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`File too large: ${file.name} (max 10MB)`);
        continue;
      }

      validFiles.push(file);
    }

    // Show errors if any
    if (errors.length > 0) {
      alert(`File validation errors:\n${errors.join('\n')}`);
    }

    // Add valid files
    if (validFiles.length > 0) {
      setAttachments((prev) => [...prev, ...validFiles]);
    }

    // Reset file input to allow re-selecting same file
    e.target.value = '';
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Trigger file input
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-t border-border bg-card/70 backdrop-blur-sm">
      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-xs font-sans font-light text-[#C4C8D4]">
          <span className="italic">
            {typingUsers.length === 1
              ? `${typingUsers[0]} is typing...`
              : typingUsers.length === 2
              ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
              : `${typingUsers.length} people are typing...`}
          </span>
        </div>
      )}

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-2">
          {attachments.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background/50 border border-border"
            >
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              <span className="text-xs font-sans font-light text-white truncate max-w-[150px]">
                {file.name}
              </span>
              <button
                onClick={() => removeAttachment(idx)}
                className="ml-1 text-[#C4C8D4] hover:text-red-400 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="p-4">
        <div className="flex gap-2">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-background/50 border border-border rounded-lg px-3 py-2 text-sm font-sans font-light text-white placeholder:text-[#C4C8D4]/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            style={{ minHeight: '40px', maxHeight: '200px' }}
          />

          {/* Action buttons */}
          <div className="flex items-end gap-2">
            {/* Attachment button */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleAttachmentClick}
              disabled={disabled}
              className="h-10 w-10 hover:bg-primary/10"
            >
              <svg
                className="w-5 h-5 text-[#C4C8D4]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </Button>

            {/* Emoji button (placeholder) */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={disabled}
              className="h-10 w-10 hover:bg-primary/10"
            >
              <svg
                className="w-5 h-5 text-[#C4C8D4]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Button>

            {/* Send button */}
            <Button
              type="button"
              size="icon"
              onClick={handleSend}
              disabled={disabled || (!content.trim() && attachments.length === 0)}
              className="h-10 w-10"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Private note toggle */}
        {allowPrivateNotes && (
          <div className="flex items-center gap-2 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                disabled={disabled}
                className="w-4 h-4 rounded border-border bg-background/50 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
              />
              <span className="text-xs font-sans font-light text-[#C4C8D4]">
                Private note (only visible to team)
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Hidden file input with MIME type restriction */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/gif,application/pdf,text/plain"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
