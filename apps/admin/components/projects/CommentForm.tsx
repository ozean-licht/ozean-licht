'use client';

/**
 * CommentForm Component
 *
 * Form for adding or editing comments:
 * - Textarea for content input
 * - Submit button with loading state
 * - Cancel button for edit mode
 * - Auto-resize textarea
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, X } from 'lucide-react';
import type { DBComment } from '@/lib/db/comments';

interface CommentFormProps {
  entityType: 'project' | 'task';
  entityId: string;
  parentCommentId?: string;
  editingComment?: DBComment;
  onSubmitted: (comment: DBComment) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function CommentForm({
  entityType,
  entityId,
  parentCommentId,
  editingComment,
  onSubmitted,
  onCancel,
  placeholder = 'Write a comment...',
  autoFocus = false,
}: CommentFormProps) {
  const [content, setContent] = useState(editingComment?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      let response: Response;

      if (editingComment) {
        // Update existing comment
        response = await fetch(`/api/comments/${editingComment.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: content.trim() }),
        });
      } else {
        // Create new comment
        const endpoint = entityType === 'project'
          ? `/api/projects/${entityId}/comments`
          : `/api/tasks/${entityId}/comments`;

        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: content.trim(),
            parent_comment_id: parentCommentId,
          }),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save comment');
      }

      const { comment } = await response.json();

      setContent('');
      onSubmitted(comment);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to save comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setContent('');
    setError(null);
    onCancel?.();
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl/Cmd + Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
    // Cancel on Escape
    if (e.key === 'Escape' && onCancel) {
      handleCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="bg-[#00111A] border-primary/20 text-white min-h-[80px] resize-none"
        disabled={isSubmitting}
      />

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#C4C8D4]">
          <kbd className="px-1 py-0.5 rounded bg-[#00111A] border border-primary/20 text-xs">
            Ctrl
          </kbd>
          {' + '}
          <kbd className="px-1 py-0.5 rounded bg-[#00111A] border border-primary/20 text-xs">
            Enter
          </kbd>
          {' to submit'}
        </p>

        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-[#C4C8D4]"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || isSubmitting}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Send className="w-4 h-4 mr-1" />
            {isSubmitting ? 'Sending...' : editingComment ? 'Update' : 'Comment'}
          </Button>
        </div>
      </div>
    </form>
  );
}
