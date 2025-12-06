/**
 * Knowledge Base Admin List Page
 *
 * Displays all knowledge articles with status filtering and management actions.
 * Server component that fetches articles from database.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { requireAnyRole } from '@/lib/rbac/utils';
import { getAllArticles } from '@/lib/db/knowledge-articles';
import {
  Plus,
  Eye,
  Edit,
  ExternalLink,
  Globe,
  FileText,
  CheckCircle,
  Clock,
  Archive,
} from 'lucide-react';
import { getRelativeTime } from '@/types/support';
import type { ArticleStatus } from '@/types/support';
import DeleteArticleButton from './DeleteArticleButton';

export const metadata: Metadata = {
  title: 'Knowledge Base | Support',
  description: 'Manage knowledge base articles and documentation',
};

interface PageProps {
  searchParams: {
    status?: ArticleStatus;
  };
}

export default async function KnowledgeBasePage({ searchParams }: PageProps) {
  // RBAC check - support, admin, and moderator roles
  await requireAnyRole(['super_admin', 'ol_admin', 'support']);

  // Get filter from search params
  const statusFilter = searchParams.status;

  // Fetch articles based on filter
  let allArticles: Awaited<ReturnType<typeof getAllArticles>>['articles'] = [];
  try {
    const result = await getAllArticles({
      status: statusFilter,
      limit: 100,
    });
    allArticles = result.articles;
  } catch (error) {
    console.error('Failed to fetch knowledge articles:', error);
    allArticles = [];
  }

  // Count articles by status
  const draftCount = allArticles.filter(a => a.status === 'draft').length;
  const publishedCount = allArticles.filter(a => a.status === 'published').length;
  const archivedCount = allArticles.filter(a => a.status === 'archived').length;

  // Filter articles based on current status filter
  const filteredArticles = statusFilter
    ? allArticles.filter(a => a.status === statusFilter)
    : allArticles;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-decorative text-white mb-2">Knowledge Base</h1>
          <p className="text-[#C4C8D4]">
            Manage help articles and documentation for the public help center
          </p>
        </div>
        <Link
          href="/dashboard/support/knowledge/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Article
        </Link>
      </div>

      {/* Public Help Center Link */}
      <div className="bg-[#00111A] border border-[#0E282E] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-white font-medium">Public Help Center</p>
            <p className="text-sm text-[#C4C8D4]">
              View published articles as customers see them
            </p>
          </div>
          <Link
            href="/hilfe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00070F] border border-[#0E282E] text-primary rounded-lg hover:bg-[#001A26] transition-colors"
          >
            Visit Help Center
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-b border-[#0E282E]">
        <Link
          href="/dashboard/support/knowledge"
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            !statusFilter
              ? 'text-primary border-b-2 border-primary'
              : 'text-[#C4C8D4] hover:text-white'
          }`}
        >
          All ({allArticles.length})
        </Link>
        <Link
          href="/dashboard/support/knowledge?status=draft"
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            statusFilter === 'draft'
              ? 'text-primary border-b-2 border-primary'
              : 'text-[#C4C8D4] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Draft ({draftCount})
          </div>
        </Link>
        <Link
          href="/dashboard/support/knowledge?status=published"
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            statusFilter === 'published'
              ? 'text-primary border-b-2 border-primary'
              : 'text-[#C4C8D4] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Published ({publishedCount})
          </div>
        </Link>
        <Link
          href="/dashboard/support/knowledge?status=archived"
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            statusFilter === 'archived'
              ? 'text-primary border-b-2 border-primary'
              : 'text-[#C4C8D4] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archived ({archivedCount})
          </div>
        </Link>
      </div>

      {/* Articles List */}
      <div className="bg-[#00111A] border border-[#0E282E] rounded-lg overflow-hidden">
        {filteredArticles.length === 0 ? (
          // Empty State
          <div className="text-center py-12 px-4">
            <FileText className="h-12 w-12 text-[#0E282E] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {statusFilter
                ? `No ${statusFilter} articles`
                : 'No articles yet'}
            </h3>
            <p className="text-[#C4C8D4] mb-6">
              {statusFilter
                ? `There are no ${statusFilter} articles at the moment.`
                : 'Get started by creating your first knowledge base article.'}
            </p>
            <Link
              href="/dashboard/support/knowledge/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create First Article
            </Link>
          </div>
        ) : (
          // Articles Table
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#0E282E]">
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#C4C8D4] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#C4C8D4] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#C4C8D4] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-[#C4C8D4] uppercase tracking-wider">
                    Views
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-[#C4C8D4] uppercase tracking-wider">
                    Helpful
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#C4C8D4] uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-[#C4C8D4] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0E282E]">
                {filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-[#001A26] transition-colors"
                  >
                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-[#C4C8D4] mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/support/knowledge/${article.id}`}
                            className="text-white font-medium hover:text-primary transition-colors line-clamp-1"
                          >
                            {article.title}
                          </Link>
                          {article.summary && (
                            <p className="text-sm text-[#C4C8D4] line-clamp-1 mt-1">
                              {article.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      {article.category ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#00070F] border border-[#0E282E] text-[#C4C8D4]">
                          {article.category}
                        </span>
                      ) : (
                        <span className="text-sm text-[#C4C8D4]">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : article.status === 'draft'
                            ? 'bg-gray-500/20 text-gray-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {article.status === 'published' && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {article.status === 'draft' && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {article.status === 'archived' && (
                          <Archive className="h-3 w-3 mr-1" />
                        )}
                        {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-white">
                        {article.viewCount.toLocaleString()}
                      </span>
                    </td>

                    {/* Helpful */}
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-white">
                        {article.helpfulCount.toLocaleString()}
                      </span>
                    </td>

                    {/* Updated */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#C4C8D4]">
                        {getRelativeTime(article.updatedAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit */}
                        <Link
                          href={`/dashboard/support/knowledge/${article.id}`}
                          className="p-2 text-[#C4C8D4] hover:text-primary hover:bg-[#00070F] rounded-lg transition-colors"
                          title="Edit article"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>

                        {/* View on public site (only for published) */}
                        {article.status === 'published' && (
                          <Link
                            href={`/hilfe/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[#C4C8D4] hover:text-primary hover:bg-[#00070F] rounded-lg transition-colors"
                            title="View on public site"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}

                        {/* Delete */}
                        <DeleteArticleButton
                          articleId={article.id}
                          articleTitle={article.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {filteredArticles.length > 0 && (
        <div className="text-sm text-[#C4C8D4] text-center">
          Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
          {statusFilter && ` with status: ${statusFilter}`}
        </div>
      )}
    </div>
  );
}
