'use client';

/**
 * CommentForm Component
 *
 * Form for adding or editing comments:
 * - Textarea for content input with @mention support
 * - Submit button with loading state
 * - Cancel button for edit mode
 * - Auto-resize textarea
 * - @mention autocomplete dropdown
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, X, AtSign, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DBComment } from '@/lib/types';
import { getMentionAtCursor, insertMention, extractMentions } from '@/lib/utils/mentions';

interface User {
  id: string;
  name: string;
  email: string;
}

interface CommentFormProps {
  entityType: 'project' | 'task';
  entityId: string;
  parentCommentId?: string;
  editingComment?: DBComment;
  onSubmitted: (comment: DBComment, mentionedUserIds?: string[]) => void;
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
  placeholder = 'Write a comment... (use @ to mention)',
  autoFocus = false,
}: CommentFormProps) {
  const [content, setContent] = useState(editingComment?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mention autocomplete state
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [unresolvedMentions, setUnresolvedMentions] = useState<string[]>([]);
  const mentionListRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Fetch users based on mention query (server-side search with debounce)
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if mentions aren't showing
    if (!showMentions) {
      setFilteredUsers([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const params = new URLSearchParams({
          limit: '10',
          ...(mentionQuery && { search: mentionQuery }),
        });
        const response = await fetch(`/api/admin-users?${params}`);
        if (response.ok) {
          const data = await response.json();
          setFilteredUsers(data.users || []);
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error('Failed to fetch users for mentions:', err);
        setFilteredUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    // Debounce search (300ms)
    searchTimeoutRef.current = setTimeout(() => {
      fetchUsers();
    }, 300);

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [mentionQuery, showMentions]);

  // Handle text change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPos = e.target.selectionStart;
    setContent(newContent);

    // Check for mention at cursor
    const mention = getMentionAtCursor(newContent, cursorPos);
    if (mention) {
      setShowMentions(true);
      setMentionQuery(mention.query);
      setMentionStart(mention.startIndex);
    } else {
      setShowMentions(false);
      setMentionQuery('');
      setMentionStart(null);
    }
  };

  // Select a user from mentions list
  const selectMention = useCallback((user: User) => {
    if (mentionStart !== null && textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      // Use email username part as the mention handle
      const username = user.email.split('@')[0];
      const newContent = insertMention(content, mentionStart, cursorPos, username);
      setContent(newContent);
      setShowMentions(false);
      setMentionQuery('');
      setMentionStart(null);

      // Focus textarea and set cursor after mention
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPos = mentionStart + username.length + 2; // @username + space
          textareaRef.current.setSelectionRange(newPos, newPos);
        }
      }, 0);
    }
  }, [content, mentionStart]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      setShowMentions(false);
      setUnresolvedMentions([]);

      // Extract mentioned usernames
      const mentionedUsernames = extractMentions(content);

      // Resolve usernames to user IDs with case-insensitive matching
      const unresolvedList: string[] = [];
      const mentionedUserIds: string[] = [];

      for (const username of mentionedUsernames) {
        // Fetch user by username with case-insensitive search
        try {
          const response = await fetch(`/api/admin-users?search=${encodeURIComponent(username)}&limit=1`);
          if (response.ok) {
            const data = await response.json();
            // Case-insensitive match: check if email starts with username (case-insensitive)
            const user = data.users?.find((u: User) =>
              u.email.toLowerCase().startsWith(username.toLowerCase() + '@') ||
              u.email.split('@')[0].toLowerCase() === username.toLowerCase()
            );
            if (user) {
              mentionedUserIds.push(user.id);
            } else {
              unresolvedList.push(username);
            }
          } else {
            unresolvedList.push(username);
          }
        } catch {
          unresolvedList.push(username);
        }
      }

      // Warn about unresolved mentions
      if (unresolvedList.length > 0) {
        setUnresolvedMentions(unresolvedList);
        // Show warning but allow submission to continue
      }

      let response: Response;

      if (editingComment) {
        // Update existing comment
        response = await fetch(`/api/comments/${editingComment.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: content.trim(),
            mentioned_user_ids: mentionedUserIds,
          }),
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
            mentioned_user_ids: mentionedUserIds,
          }),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save comment');
      }

      const { comment } = await response.json();

      setContent('');
      onSubmitted(comment, mentionedUserIds);
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
    setShowMentions(false);
    onCancel?.();
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle mention list navigation
    if (showMentions && filteredUsers.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredUsers.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        selectMention(filteredUsers[selectedIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowMentions(false);
        return;
      }
    }

    // Submit on Ctrl/Cmd + Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
    // Cancel on Escape (when not showing mentions)
    if (e.key === 'Escape' && onCancel && !showMentions) {
      handleCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 relative">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-[#00111A] border-primary/20 text-white min-h-[80px] resize-none pr-8"
          disabled={isSubmitting}
        />

        {/* @ hint icon */}
        <div className="absolute right-2 top-2 text-white/30">
          <AtSign className="w-4 h-4" />
        </div>

        {/* Mention autocomplete dropdown */}
        {showMentions && (
          <div
            ref={mentionListRef}
            className="absolute left-0 right-0 bottom-full mb-1 bg-[#00111A] border border-primary/20 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            {isLoadingUsers ? (
              <div className="px-3 py-2 flex items-center gap-2 text-[#C4C8D4] text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="px-3 py-2 text-[#C4C8D4] text-sm">
                No users found
              </div>
            ) : (
              <div className="max-h-[200px] overflow-y-auto">
                {filteredUsers.map((user, index) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => selectMention(user)}
                    className={cn(
                      'w-full px-3 py-2 flex items-center gap-2 text-left transition-colors',
                      index === selectedIndex
                        ? 'bg-primary/20 text-white'
                        : 'hover:bg-primary/10 text-[#C4C8D4]'
                    )}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{user.name}</div>
                      <div className="text-xs text-white/50 truncate">{user.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {unresolvedMentions.length > 0 && (
        <p className="text-sm text-yellow-400">
          Warning: Could not find users for @{unresolvedMentions.join(', @')}
        </p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#C4C8D4]">
          <kbd className="px-1 py-0.5 rounded bg-[#00111A] border border-primary/20 text-xs">
            @
          </kbd>
          {' to mention · '}
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
