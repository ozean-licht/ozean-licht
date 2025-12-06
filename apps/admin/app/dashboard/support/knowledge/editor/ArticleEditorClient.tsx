'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Save, Eye, Send, Loader2 } from 'lucide-react';
import type { KnowledgeArticle } from '@/types/support';
import {
  CossUIButton,
  CossUIInput,
  CossUILabel,
  CossUISelect,
  CossUISelectTrigger,
  CossUISelectValue,
  CossUISelectPopup,
  CossUISelectItem,
  CossUITextarea,
} from '@shared/ui';

// Dynamic import for TipTap editor (no SSR)
const RichTextEditor = dynamic(
  () => import('@/components/courses/RichTextEditor'),
  { ssr: false, loading: () => <div className="h-[300px] bg-[#00111A] rounded-lg animate-pulse" /> }
);

interface ArticleEditorClientProps {
  article?: KnowledgeArticle;
}

export default function ArticleEditorClient({ article }: ArticleEditorClientProps) {
  const router = useRouter();
  const isEditing = !!article;

  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [summary, setSummary] = useState(article?.summary || '');
  const [category, setCategory] = useState(article?.category || '');
  const [tags, setTags] = useState(article?.tags?.join(', ') || '');
  const [status, setStatus] = useState(article?.status || 'draft');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (publish = false) => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const payload = {
        title: title.trim(),
        content,
        summary: summary.trim() || undefined,
        category: category.trim() || undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        status: publish ? 'published' : status,
      };

      const url = isEditing
        ? `/api/support/knowledge/${article.id}`
        : '/api/support/knowledge';

      const res = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save article');
      }

      router.push('/dashboard/support/knowledge');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/support/knowledge"
              className="p-2 text-[#C4C8D4] hover:text-white rounded-lg hover:bg-[#00111A] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-medium text-white">
              {isEditing ? 'Edit Article' : 'New Article'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isEditing && article.status === 'published' && (
              <Link
                href={`/hilfe/${article.slug}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 text-[#C4C8D4] hover:text-white transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Link>
            )}
            <CossUIButton
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </CossUIButton>
            <CossUIButton
              onClick={() => handleSave(true)}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Publish
            </CossUIButton>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <CossUILabel>Title *</CossUILabel>
            <CossUIInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title..."
              className="text-lg"
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <CossUILabel>Summary</CossUILabel>
            <CossUITextarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief description for search results..."
              rows={2}
            />
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <CossUILabel>Category</CossUILabel>
              <CossUIInput
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Getting Started, Billing, FAQ"
              />
            </div>
            <div className="space-y-2">
              <CossUILabel>Tags (comma separated)</CossUILabel>
              <CossUIInput
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. account, password, login"
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <CossUILabel>Content *</CossUILabel>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your article content here..."
            />
          </div>

          {/* Status (only for editing) */}
          {isEditing && (
            <div className="space-y-2">
              <CossUILabel>Status</CossUILabel>
              <CossUISelect value={status} onValueChange={setStatus}>
                <CossUISelectTrigger className="w-48">
                  <CossUISelectValue />
                </CossUISelectTrigger>
                <CossUISelectPopup>
                  <CossUISelectItem value="draft">Draft</CossUISelectItem>
                  <CossUISelectItem value="published">Published</CossUISelectItem>
                  <CossUISelectItem value="archived">Archived</CossUISelectItem>
                </CossUISelectPopup>
              </CossUISelect>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
