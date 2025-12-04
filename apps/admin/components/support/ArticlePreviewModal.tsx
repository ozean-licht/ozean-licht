/**
 * ArticlePreviewModal Component - Support Management System
 *
 * Modal for previewing knowledge base articles before publishing.
 * Displays article content, metadata, and provides action buttons.
 */

'use client';

import React, { useState } from 'react';
import { KnowledgeArticle, ArticleStatus, getRelativeTime } from '@/types/support';
import { sanitizeHtml } from '@/lib/utils/sanitize';
import {
  CossUISheet as Sheet,
  CossUISheetContent as SheetContent,
  CossUISheetHeader as SheetHeader,
  CossUISheetTitle as SheetTitle,
  CossUISheetFooter as SheetFooter,
  CossUISheetClose as SheetClose,
} from '@shared/ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ThumbsUp, Edit, CheckCircle, X, Loader2 } from 'lucide-react';

interface ArticlePreviewModalProps {
  /** Article to preview */
  article: KnowledgeArticle;
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Optional publish action callback */
  onPublish?: () => void;
  /** Optional edit action callback */
  onEdit?: () => void;
}

/**
 * ArticlePreviewModal renders a full preview of a knowledge base article
 *
 * Features:
 * - Full-height sheet drawer from the right
 * - Article title in Cinzel Decorative font
 * - Metadata display (category, status, views, helpful count, author, date)
 * - Tags display as badges
 * - Summary in highlighted box
 * - Sanitized HTML content rendering with prose styles
 * - Action buttons (Edit, Publish, Close)
 *
 * @example
 * ```tsx
 * <ArticlePreviewModal
 *   article={article}
 *   open={isPreviewOpen}
 *   onOpenChange={setIsPreviewOpen}
 *   onPublish={() => handlePublish()}
 *   onEdit={() => handleEdit()}
 * />
 * ```
 */
export default function ArticlePreviewModal({
  article,
  open,
  onOpenChange,
  onPublish,
  onEdit,
}: ArticlePreviewModalProps) {
  // Loading state for actions
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Get status badge variant based on article status
  const getStatusVariant = (status: ArticleStatus): 'default' | 'success' | 'destructive' => {
    const statusMap: Record<ArticleStatus, 'default' | 'success' | 'destructive'> = {
      draft: 'default',
      published: 'success',
      archived: 'destructive',
    };
    return statusMap[status] || 'default';
  };

  // Handle publish action with loading state
  const handlePublish = async () => {
    if (!onPublish) return;

    setIsActionLoading(true);
    try {
      await onPublish();
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle edit action with loading state
  const handleEdit = async () => {
    if (!onEdit) return;

    setIsActionLoading(true);
    try {
      await onEdit();
    } finally {
      setIsActionLoading(false);
    }
  };

  // Sanitize HTML content to prevent XSS
  const sanitizedContent = sanitizeHtml(article.content);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent position="right" size="xl" className="flex flex-col">
        {/* Header */}
        <SheetHeader>
          <div className="flex items-start justify-between gap-4">
            <SheetTitle className="font-decorative text-3xl text-white flex-1">
              {article.title}
            </SheetTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-[#C4C8D4] hover:text-white transition-colors"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            {/* Category */}
            {article.category && (
              <Badge variant="primary" className="text-xs">
                {article.category}
              </Badge>
            )}

            {/* Status */}
            <Badge variant={getStatusVariant(article.status)} className="text-xs">
              {article.status}
            </Badge>

            {/* View Count */}
            <div className="flex items-center gap-1.5 text-sm text-[#C4C8D4]">
              <Eye className="h-4 w-4" />
              <span>{article.viewCount}</span>
            </div>

            {/* Helpful Count */}
            {article.helpfulCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-[#C4C8D4]">
                <ThumbsUp className="h-4 w-4" />
                <span>{article.helpfulCount}</span>
              </div>
            )}

            {/* Author */}
            {article.author && (
              <span className="text-sm text-[#C4C8D4]">
                by {article.author.name}
              </span>
            )}

            {/* Published Date */}
            {article.publishedAt && (
              <span className="text-sm text-[#C4C8D4]">
                {getRelativeTime(article.publishedAt)}
              </span>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3">
              {article.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </SheetHeader>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Summary Box */}
          {article.summary && (
            <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
              <h3 className="text-sm font-sans font-semibold text-primary mb-2">
                Summary
              </h3>
              <p className="text-sm text-[#C4C8D4] leading-relaxed">
                {article.summary}
              </p>
            </div>
          )}

          {/* Article Content - Prose Styles */}
          <div
            className="prose prose-invert max-w-none
              prose-headings:text-white prose-headings:font-sans
              prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
              prose-p:text-[#C4C8D4] prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-em:text-[#C4C8D4]
              prose-code:bg-[#00070F] prose-code:px-1 prose-code:rounded prose-code:text-primary
              prose-pre:bg-[#00070F] prose-pre:border prose-pre:border-[#0E282E]
              prose-blockquote:border-primary/50 prose-blockquote:text-[#C4C8D4]
              prose-ul:text-[#C4C8D4] prose-ol:text-[#C4C8D4]
              prose-li:text-[#C4C8D4]
              prose-img:rounded-lg prose-img:border prose-img:border-primary/20"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>

        {/* Footer - Action Buttons */}
        <SheetFooter className="border-t border-primary/10 px-6 py-4">
          <div className="flex items-center gap-3 w-full">
            {/* Edit Button */}
            {onEdit && (
              <Button
                onClick={handleEdit}
                variant="outline"
                className="flex items-center gap-2"
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
                Edit
              </Button>
            )}

            {/* Publish Button (only show for drafts) */}
            {onPublish && article.status === 'draft' && (
              <Button
                onClick={handlePublish}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Publish
              </Button>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Close Button */}
            <SheetClose disabled={isActionLoading}>
              Close
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
