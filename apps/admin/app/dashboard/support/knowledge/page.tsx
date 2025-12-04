/**
 * Knowledge Base Management Page - Phase 3
 *
 * Full-featured knowledge base management with:
 * - Article CRUD with rich text editor
 * - Category filtering sidebar
 * - Article preview modal
 * - Publishing workflow
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Plus,
  Eye,
  FileText,
  Edit,
  Trash2,
  CheckCircle,
  ThumbsUp,
  BookOpen,
} from 'lucide-react';
import {
  KnowledgeArticleEditor,
  ArticlePreviewModal,
  CategoryManager,
} from '@/components/support';
import type { KnowledgeArticle, ArticleStatus } from '@/types/support';
import { getRelativeTime } from '@/types/support';
import { toast } from 'sonner';

export default function KnowledgeBasePage() {
  const { status } = useSession();
  const router = useRouter();

  // Article state
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Modal state
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | undefined>();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch articles
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      if (debouncedSearch) params.append('search', debouncedSearch);
      params.append('limit', '50');

      const response = await fetch(`/api/support/knowledge?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      setArticles(data.articles || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, debouncedSearch]);

  // Fetch on mount and filter changes
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    fetchArticles();
  }, [status, fetchArticles, router]);

  // Handle article save (create or update)
  const handleArticleSave = useCallback((article: KnowledgeArticle) => {
    setArticles((prev) => {
      const existingIndex = prev.findIndex((a) => a.id === article.id);
      if (existingIndex >= 0) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = article;
        return updated;
      }
      // Add new to front
      return [article, ...prev];
    });
    setTotal((prev) => prev + (selectedArticle ? 0 : 1));
  }, [selectedArticle]);

  // Handle article publish
  const handlePublish = useCallback(async (articleId: string) => {
    try {
      const response = await fetch(`/api/support/knowledge/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish article');
      }

      const data = await response.json();
      setArticles((prev) =>
        prev.map((a) => (a.id === articleId ? data.article : a))
      );
      toast.success('Article published successfully');
      setPreviewOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to publish article');
    }
  }, []);

  // Handle article archive
  const handleArchive = useCallback(async (articleId: string) => {
    if (!confirm('Are you sure you want to archive this article?')) return;

    try {
      const response = await fetch(`/api/support/knowledge/${articleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to archive article');
      }

      setArticles((prev) =>
        prev.map((a) =>
          a.id === articleId ? { ...a, status: 'archived' as ArticleStatus } : a
        )
      );
      toast.success('Article archived');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to archive article');
    }
  }, []);

  // Open editor for new article
  const handleNewArticle = useCallback(() => {
    setSelectedArticle(undefined);
    setEditorOpen(true);
  }, []);

  // Open editor for existing article
  const handleEditArticle = useCallback((article: KnowledgeArticle) => {
    setSelectedArticle(article);
    setEditorOpen(true);
  }, []);

  // Open preview
  const handlePreviewArticle = useCallback((article: KnowledgeArticle) => {
    setSelectedArticle(article);
    setPreviewOpen(true);
  }, []);

  // Stats
  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;

  return (
    <div className="flex gap-6">
      {/* Sidebar - Categories */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <CategoryManager
          selectedCategory={categoryFilter}
          onCategorySelect={setCategoryFilter}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-decorative text-white mb-2">Knowledge Base</h1>
            <p className="text-muted-foreground">
              Manage help articles and documentation
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleNewArticle}>
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </div>

        {/* Filters */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ArticleStatus | 'all')}
                  className="w-full h-10 px-3 rounded-md bg-[#00111A] border border-[#0E282E] text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Mobile Category Filter */}
              <div className="w-full md:w-48 lg:hidden">
                <select
                  value={categoryFilter || 'all'}
                  onChange={(e) => setCategoryFilter(e.target.value === 'all' ? null : e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-[#00111A] border border-[#0E282E] text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Categories</option>
                  <option value="Account & Billing">Account & Billing</option>
                  <option value="Courses & Learning">Courses & Learning</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Spiritual Practice">Spiritual Practice</option>
                  <option value="Getting Started">Getting Started</option>
                  <option value="FAQ">FAQ</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{total}</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Published
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-400">{publishedCount}</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Edit className="h-4 w-4 text-gray-400" />
                Drafts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-400">{draftCount}</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-primary" />
                Helpful
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">
                {articles.reduce((sum, a) => sum + a.helpfulCount, 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Articles Grid */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">Articles</CardTitle>
            <CardDescription>
              {total} {total === 1 ? 'article' : 'articles'} total
              {categoryFilter && ` in "${categoryFilter}"`}
              {debouncedSearch && ` matching "${debouncedSearch}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                <p className="mt-4 text-sm text-muted-foreground">Loading articles...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-sm text-destructive">{error}</p>
                <Button onClick={fetchArticles} variant="outline" className="mt-4">
                  Retry
                </Button>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  {debouncedSearch || categoryFilter
                    ? 'No articles match your filters'
                    : 'No articles yet'}
                </p>
                <Button onClick={handleNewArticle}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first article
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {articles.map((article) => (
                  <Card
                    key={article.id}
                    className="glass-card glass-hover cursor-pointer group"
                    onClick={() => handlePreviewArticle(article)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={`shrink-0 ${
                            article.status === 'published'
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : article.status === 'draft'
                              ? 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}
                        >
                          {article.status}
                        </Badge>
                      </div>
                      {article.summary && (
                        <CardDescription className="line-clamp-2">
                          {article.summary}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Category */}
                        {article.category && (
                          <div>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                              {article.category}
                            </Badge>
                          </div>
                        )}

                        {/* Tags */}
                        {article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {article.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs border-[#0E282E]">
                                {tag}
                              </Badge>
                            ))}
                            {article.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs border-[#0E282E]">
                                +{article.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{article.viewCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{article.helpfulCount}</span>
                          </div>
                        </div>

                        {/* Author & Date */}
                        <div className="text-xs text-muted-foreground pt-3 border-t border-[#0E282E]">
                          {article.author && <p>By {article.author.name}</p>}
                          <p>{getRelativeTime(article.updatedAt)}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditArticle(article);
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewArticle(article);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {article.status !== 'archived' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArchive(article.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Article Editor Modal */}
      <KnowledgeArticleEditor
        article={selectedArticle}
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSave={handleArticleSave}
      />

      {/* Article Preview Modal */}
      {selectedArticle && (
        <ArticlePreviewModal
          article={selectedArticle}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          onEdit={() => {
            setPreviewOpen(false);
            setEditorOpen(true);
          }}
          onPublish={
            selectedArticle.status === 'draft'
              ? () => handlePublish(selectedArticle.id)
              : undefined
          }
        />
      )}
    </div>
  );
}
