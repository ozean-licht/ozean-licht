'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { KnowledgeArticle, ArticleStatus } from '@/types/support';
import {
  CossUIDialog,
  CossUIDialogPopup,
  CossUIDialogHeader,
  CossUIDialogFooter,
  CossUIDialogTitle,
  CossUIDialogDescription,
  CossUIDialogClose,
  CossUIButton,
  CossUIInput,
  CossUITextarea,
  CossUISelect,
  CossUISelectTrigger,
  CossUISelectValue,
  CossUISelectPopup,
  CossUISelectItem,
  CossUILabel,
  CossUISpinner,
  CossUIBadge,
} from '@shared/ui';
import RichTextEditor from '@/components/courses/RichTextEditor';
import { X } from 'lucide-react';
import { DEFAULT_ARTICLE_CATEGORIES, ARTICLE_LIMITS } from '@/lib/constants/support';

interface KnowledgeArticleEditorProps {
  /** Article to edit (if provided, edit mode; otherwise create mode) */
  article?: KnowledgeArticle;
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when article is saved */
  onSave: (article: KnowledgeArticle) => void;
}

interface FormErrors {
  title?: string;
  content?: string;
  summary?: string;
  category?: string;
  tags?: string;
  language?: string;
  status?: string;
}

// Language options
const LANGUAGE_OPTIONS = [
  { value: 'de', label: 'German (Deutsch)' },
  { value: 'en', label: 'English' },
];

// Status options
const STATUS_OPTIONS: { value: ArticleStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export default function KnowledgeArticleEditor({
  article,
  open,
  onOpenChange,
  onSave,
}: KnowledgeArticleEditorProps) {
  const isEditing = !!article;

  // Form state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>('de');
  const [status, setStatus] = useState<ArticleStatus>('draft');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens or article changes
  useEffect(() => {
    if (open) {
      if (article) {
        setTitle(article.title);
        setSummary(article.summary || '');
        setCategory(article.category || '');
        setTags(article.tags || []);
        setTagsInput(article.tags?.join(', ') || '');
        setLanguage(article.language);
        setStatus(article.status);
        setContent(article.content);
      } else {
        setTitle('');
        setSummary('');
        setCategory('');
        setTags([]);
        setTagsInput('');
        setLanguage('de');
        setStatus('draft');
        setContent('');
      }
      setErrors({});
    }
  }, [open, article]);

  // Update tags array when input changes
  useEffect(() => {
    const tagArray = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0 && tag.length <= ARTICLE_LIMITS.TAG_MAX_LENGTH);
    setTags(tagArray);
  }, [tagsInput]);

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > ARTICLE_LIMITS.TITLE_MAX_LENGTH) {
      newErrors.title = `Title must be ${ARTICLE_LIMITS.TITLE_MAX_LENGTH} characters or less`;
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length > ARTICLE_LIMITS.CONTENT_MAX_LENGTH) {
      newErrors.content = `Content must be ${ARTICLE_LIMITS.CONTENT_MAX_LENGTH} characters or less`;
    }

    if (summary && summary.length > ARTICLE_LIMITS.SUMMARY_MAX_LENGTH) {
      newErrors.summary = `Summary must be ${ARTICLE_LIMITS.SUMMARY_MAX_LENGTH} characters or less`;
    }

    if (category && category.length > ARTICLE_LIMITS.CATEGORY_MAX_LENGTH) {
      newErrors.category = `Category must be ${ARTICLE_LIMITS.CATEGORY_MAX_LENGTH} characters or less`;
    }

    if (tags.length > ARTICLE_LIMITS.MAX_TAGS_COUNT) {
      newErrors.tags = `Maximum ${ARTICLE_LIMITS.MAX_TAGS_COUNT} tags allowed`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const endpoint = isEditing
        ? `/api/support/knowledge/${article!.id}`
        : `/api/support/knowledge`;

      const method = isEditing ? 'PATCH' : 'POST';

      const body = {
        title: title.trim(),
        content: content.trim(),
        summary: summary.trim() || undefined,
        category: category.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        language,
        status,
      };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} article`);
      }

      const result = await response.json();
      const savedArticle = result.article || result;

      onSave(savedArticle);
      onOpenChange(false);

      // Show success toast
      toast.success(isEditing ? 'Article updated' : 'Article created', {
        description: `"${savedArticle.title}" has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });
    } catch (error) {
      console.error('Failed to save article:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

      // Show error toast
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} article`, {
        description: errorMessage,
      });

      setErrors({
        title: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setTagsInput(updatedTags.join(', '));
  };

  return (
    <CossUIDialog open={open} onOpenChange={onOpenChange}>
      <CossUIDialogPopup className="max-w-3xl max-h-[90vh] overflow-y-auto glass-card">
        <form onSubmit={handleSubmit}>
          <CossUIDialogHeader>
            <CossUIDialogTitle>
              {isEditing ? 'Edit Article' : 'Create Article'}
            </CossUIDialogTitle>
            <CossUIDialogDescription>
              {isEditing
                ? 'Update the knowledge base article details below.'
                : 'Create a new article for the knowledge base.'}
            </CossUIDialogDescription>
          </CossUIDialogHeader>

          <div className="space-y-4 py-4">
            {/* Title Field */}
            <div className="space-y-2">
              <CossUILabel className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </CossUILabel>
              <CossUIInput
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="e.g., How to reset your password"
                className={errors.title ? 'border-destructive' : ''}
                disabled={isSubmitting}
                maxLength={ARTICLE_LIMITS.TITLE_MAX_LENGTH}
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-1">
                {title.length}/{ARTICLE_LIMITS.TITLE_MAX_LENGTH} characters
              </p>
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Summary Field */}
            <div className="space-y-2">
              <CossUILabel className="text-sm font-medium">
                Summary
              </CossUILabel>
              <CossUITextarea
                value={summary}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSummary(e.target.value)}
                placeholder="A brief description of this article..."
                rows={2}
                disabled={isSubmitting}
                maxLength={ARTICLE_LIMITS.SUMMARY_MAX_LENGTH}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {summary.length}/{ARTICLE_LIMITS.SUMMARY_MAX_LENGTH} characters
              </p>
              {errors.summary && (
                <p className="text-sm text-destructive">{errors.summary}</p>
              )}
            </div>

            {/* Category and Language Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Category Field */}
              <div className="space-y-2">
                <CossUILabel className="text-sm font-medium">
                  Category
                </CossUILabel>
                <CossUISelect
                  value={category}
                  onValueChange={(value: string) => setCategory(value)}
                  disabled={isSubmitting}
                >
                  <CossUISelectTrigger className="w-full">
                    <CossUISelectValue placeholder="Select or enter category" />
                  </CossUISelectTrigger>
                  <CossUISelectPopup>
                    {DEFAULT_ARTICLE_CATEGORIES.map((cat) => (
                      <CossUISelectItem key={cat} value={cat}>
                        {cat}
                      </CossUISelectItem>
                    ))}
                  </CossUISelectPopup>
                </CossUISelect>
                {/* Custom category input */}
                <CossUIInput
                  value={category}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
                  placeholder="Or enter custom category"
                  disabled={isSubmitting}
                  maxLength={ARTICLE_LIMITS.CATEGORY_MAX_LENGTH}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {category.length}/{ARTICLE_LIMITS.CATEGORY_MAX_LENGTH} characters
                </p>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>

              {/* Language Field */}
              <div className="space-y-2">
                <CossUILabel className="text-sm font-medium">
                  Language
                </CossUILabel>
                <CossUISelect
                  value={language}
                  onValueChange={(value: string) => setLanguage(value)}
                  disabled={isSubmitting}
                >
                  <CossUISelectTrigger className="w-full">
                    <CossUISelectValue placeholder="Select language" />
                  </CossUISelectTrigger>
                  <CossUISelectPopup>
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <CossUISelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </CossUISelectItem>
                    ))}
                  </CossUISelectPopup>
                </CossUISelect>
              </div>
            </div>

            {/* Tags Field */}
            <div className="space-y-2">
              <CossUILabel className="text-sm font-medium">
                Tags
              </CossUILabel>
              <CossUIInput
                value={tagsInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagsInput(e.target.value)}
                placeholder="e.g., password, account, security (comma-separated)"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {tags.length}/{ARTICLE_LIMITS.MAX_TAGS_COUNT} tags (max {ARTICLE_LIMITS.TAG_MAX_LENGTH} characters each)
              </p>
              {errors.tags && (
                <p className="text-sm text-destructive">{errors.tags}</p>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <CossUIBadge
                      key={index}
                      variant="default"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        disabled={isSubmitting}
                        className="ml-1 hover:text-destructive transition-colors"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </CossUIBadge>
                  ))}
                </div>
              )}
            </div>

            {/* Status Field */}
            <div className="space-y-2">
              <CossUILabel className="text-sm font-medium">
                Status
              </CossUILabel>
              <CossUISelect
                value={status}
                onValueChange={(value: string) => setStatus(value as ArticleStatus)}
                disabled={isSubmitting}
              >
                <CossUISelectTrigger className="w-full">
                  <CossUISelectValue placeholder="Select status" />
                </CossUISelectTrigger>
                <CossUISelectPopup>
                  {STATUS_OPTIONS.map((statusOption) => (
                    <CossUISelectItem key={statusOption.value} value={statusOption.value}>
                      {statusOption.label}
                    </CossUISelectItem>
                  ))}
                </CossUISelectPopup>
              </CossUISelect>
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <CossUILabel className="text-sm font-medium">
                Content <span className="text-destructive">*</span>
              </CossUILabel>
              <p className="text-xs text-muted-foreground">
                Rich text editor with formatting, images, and video embeds
              </p>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your article content here..."
                disabled={isSubmitting}
                error={errors.content}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {content.length}/{ARTICLE_LIMITS.CONTENT_MAX_LENGTH} characters
              </p>
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content}</p>
              )}
            </div>
          </div>

          <CossUIDialogFooter className="gap-2">
            <CossUIDialogClose>
              <CossUIButton
                type="button"
                variant="outline"
                disabled={isSubmitting}
              >
                Cancel
              </CossUIButton>
            </CossUIDialogClose>
            <CossUIButton type="submit" disabled={isSubmitting}>
              {isSubmitting && <CossUISpinner className="mr-2 h-4 w-4" />}
              {isEditing ? 'Save Changes' : 'Create Article'}
            </CossUIButton>
          </CossUIDialogFooter>
        </form>
      </CossUIDialogPopup>
    </CossUIDialog>
  );
}
