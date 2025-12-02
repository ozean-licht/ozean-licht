'use client';

/**
 * CommentThread Component
 *
 * Displays threaded comments with:
 * - Author avatar/name and timestamp
 * - Comment content with edit indicator
 * - Reply button for threading
 * - Edit/delete buttons for own comments
 * - Nested replies with indentation
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Reply,
  Edit2,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CommentForm from './CommentForm';
import type { DBComment } from '@/lib/db/comments';
import { cn } from '@/lib/utils';

interface CommentThreadProps {
  comments: DBComment[];
  entityType: 'project' | 'task';
  entityId: string;
  currentUserEmail?: string;
  isAdmin?: boolean;
  onCommentAdded?: (comment: DBComment) => void;
  onCommentUpdated?: (comment: DBComment) => void;
  onCommentDeleted?: (commentId: string) => void;
}

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

// Get initials for avatar
function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Single comment component
function Comment({
  comment,
  currentUserEmail,
  isAdmin,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
}: {
  comment: DBComment;
  currentUserEmail?: string;
  isAdmin?: boolean;
  onReply: (parentId: string) => void;
  onEdit: (comment: DBComment) => void;
  onDelete: (commentId: string) => void;
  depth?: number;
}) {
  const isOwner = currentUserEmail && comment.author_email === currentUserEmail;
  const canModify = isOwner || isAdmin;

  return (
    <div
      className={cn(
        'group',
        depth > 0 && 'ml-6 mt-3 pl-4 border-l-2 border-primary/20'
      )}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-primary">
            {getInitials(comment.author_name)}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-white">
              {comment.author_name || 'Anonymous'}
            </span>
            <span className="text-xs text-[#C4C8D4]">
              {formatDate(comment.created_at)}
            </span>
            {comment.is_edited && (
              <Badge variant="outline" className="text-[10px] h-4 px-1 border-primary/20 text-[#C4C8D4]">
                edited
              </Badge>
            )}
          </div>

          <p className="text-sm text-[#C4C8D4] whitespace-pre-wrap">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-[#C4C8D4] hover:text-primary"
              onClick={() => onReply(comment.id)}
            >
              <Reply className="w-3 h-3 mr-1" />
              Reply
            </Button>

            {canModify && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-[#C4C8D4]">
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-card border-primary/20">
                  {isOwner && (
                    <DropdownMenuItem
                      onClick={() => onEdit(comment)}
                      className="text-[#C4C8D4] focus:text-white"
                    >
                      <Edit2 className="w-3 h-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => onDelete(comment.id)}
                    className="text-red-400 focus:text-red-300"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              currentUserEmail={currentUserEmail}
              isAdmin={isAdmin}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentThread({
  comments,
  entityType,
  entityId,
  currentUserEmail,
  isAdmin,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
}: CommentThreadProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<DBComment | null>(null);

  // Handle reply
  const handleReply = (parentId: string) => {
    setReplyingTo(parentId);
    setEditingComment(null);
  };

  // Handle edit
  const handleEdit = (comment: DBComment) => {
    setEditingComment(comment);
    setReplyingTo(null);
  };

  // Handle delete
  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      onCommentDeleted?.(commentId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete comment:', error);
    }
  };

  // Handle comment submitted
  const handleCommentSubmitted = (comment: DBComment) => {
    if (editingComment) {
      onCommentUpdated?.(comment);
      setEditingComment(null);
    } else {
      onCommentAdded?.(comment);
      setReplyingTo(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* New comment form (top-level) */}
      <CommentForm
        entityType={entityType}
        entityId={entityId}
        onSubmitted={handleCommentSubmitted}
        placeholder="Add a comment..."
      />

      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              <Comment
                comment={comment}
                currentUserEmail={currentUserEmail}
                isAdmin={isAdmin}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              {/* Reply form */}
              {replyingTo === comment.id && (
                <div className="ml-11 mt-3">
                  <CommentForm
                    entityType={entityType}
                    entityId={entityId}
                    parentCommentId={comment.id}
                    onSubmitted={handleCommentSubmitted}
                    onCancel={() => setReplyingTo(null)}
                    placeholder={`Reply to ${comment.author_name || 'Anonymous'}...`}
                    autoFocus
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-primary/30 mx-auto mb-3" />
          <p className="text-[#C4C8D4]">No comments yet</p>
          <p className="text-sm text-[#C4C8D4]/60 mt-1">
            Be the first to comment!
          </p>
        </div>
      )}

      {/* Edit modal/inline form */}
      {editingComment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 max-w-lg w-full border border-primary/20">
            <h3 className="text-lg font-medium text-white mb-4">Edit Comment</h3>
            <CommentForm
              entityType={entityType}
              entityId={entityId}
              editingComment={editingComment}
              onSubmitted={handleCommentSubmitted}
              onCancel={() => setEditingComment(null)}
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
}
