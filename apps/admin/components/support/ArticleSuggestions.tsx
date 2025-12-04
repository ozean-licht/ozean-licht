/**
 * ArticleSuggestions Component - Support Management System
 *
 * Displays suggested knowledge base articles based on conversation context
 * for Chatwoot integration. Helps agents quickly find relevant articles
 * to send to customers.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { KnowledgeArticle } from '@/types/support';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { BookOpen, Copy, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleSuggestionsProps {
  /** Conversation ID for context (optional, reserved for future use) */
  _conversationId?: string;
  /** Keywords extracted from conversation */
  keywords?: string[];
  /** Callback when article is selected to send to customer */
  onArticleSelect?: (article: KnowledgeArticle) => void;
  /** Optional className for styling */
  className?: string;
}

/**
 * ArticleSuggestions displays relevant knowledge base articles
 * based on conversation keywords.
 *
 * Features:
 * - Search articles using provided keywords
 * - Display top 3-5 most relevant articles
 * - Expandable article cards with summary preview
 * - Copy article link functionality
 * - Send to customer callback
 * - Only shows published articles
 *
 * @example
 * ```tsx
 * <ArticleSuggestions
 *   keywords={['payment', 'subscription', 'cancel']}
 *   onArticleSelect={(article) => sendArticleToCustomer(article)}
 * />
 * ```
 */
export default function ArticleSuggestions({
  _conversationId,
  keywords = [],
  onArticleSelect,
  className,
}: ArticleSuggestionsProps) {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [copiedArticleId, setCopiedArticleId] = useState<string | null>(null);

  // Fetch suggested articles based on keywords
  useEffect(() => {
    if (keywords.length === 0) {
      setArticles([]);
      setError(null);
      return;
    }

    const fetchArticles = async () => {
      setLoading(true);
      setError(null); // Clear error on new fetch
      try {
        // Search for each keyword and combine results
        const searchPromises = keywords.map(async (keyword) => {
          const response = await fetch(
            `/api/support/knowledge/search?q=${encodeURIComponent(keyword)}&limit=10`
          );

          if (!response.ok) {
            // Failed to search for keyword, return empty array
            return [];
          }

          const data = await response.json();
          return data.articles || [];
        });

        const results = await Promise.all(searchPromises);

        // Flatten and deduplicate results
        const allArticles = results.flat();
        const uniqueArticles = deduplicateArticles(allArticles);

        // Filter for published articles only
        const publishedArticles = uniqueArticles.filter(
          (article) => article.status === 'published'
        );

        // Sort by relevance (view count as proxy) and limit to top 5
        const sortedArticles = publishedArticles
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, 5);

        setArticles(sortedArticles);
      } catch (error) {
        console.error('[ArticleSuggestions] Failed to fetch:', error);
        setError('Failed to load suggestions');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [keywords]);

  // Deduplicate articles by ID
  const deduplicateArticles = (articles: KnowledgeArticle[]): KnowledgeArticle[] => {
    const seen = new Set<string>();
    return articles.filter((article) => {
      if (seen.has(article.id)) {
        return false;
      }
      seen.add(article.id);
      return true;
    });
  };

  // Copy article URL to clipboard
  const handleCopyLink = async (article: KnowledgeArticle) => {
    const baseUrl = window.location.origin;
    const articleUrl = `${baseUrl}/kb/${article.slug}`;

    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopiedArticleId(article.id);
      setTimeout(() => setCopiedArticleId(null), 2000);
    } catch (error) {
      // Failed to copy link to clipboard
      // Silently fail - user will retry if needed
    }
  };

  // Toggle article expansion
  const toggleArticle = (articleId: string) => {
    setExpandedArticleId(expandedArticleId === articleId ? null : articleId);
  };

  // Loading skeleton
  if (loading) {
    return (
      <Card className={cn('glass-subtle', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-sans font-medium text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0ec2bc]" />
            Suggested Articles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={cn('glass-subtle', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-sans font-medium text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0ec2bc]" />
            Suggested Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setError(null);
                // Trigger re-fetch by forcing useEffect to run
                setArticles([]);
              }}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (keywords.length === 0) {
    return (
      <Card className={cn('glass-subtle', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-sans font-medium text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0ec2bc]" />
            Suggested Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <BookOpen className="w-8 h-8 text-[#C4C8D4]/50 mx-auto mb-2" />
            <p className="text-sm font-sans font-light text-[#C4C8D4]">
              No keywords detected yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No articles found
  if (articles.length === 0) {
    return (
      <Card className={cn('glass-subtle', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-sans font-medium text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0ec2bc]" />
            Suggested Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <BookOpen className="w-8 h-8 text-[#C4C8D4]/50 mx-auto mb-2" />
            <p className="text-sm font-sans font-light text-[#C4C8D4]">
              No relevant articles found
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('glass-subtle', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-sans font-medium text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#0ec2bc]" />
          Suggested Articles
          <span className="ml-auto text-xs font-sans font-light text-[#C4C8D4]">
            {articles.length} found
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {articles.map((article) => {
          const isExpanded = expandedArticleId === article.id;
          const isCopied = copiedArticleId === article.id;

          return (
            <Collapsible
              key={article.id}
              open={isExpanded}
              onOpenChange={() => toggleArticle(article.id)}
            >
              <div className="rounded-lg border border-primary/10 bg-card/30 backdrop-blur-sm p-3 space-y-2 hover:border-primary/20 transition-colors">
                {/* Article Header */}
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-start gap-2 text-left group">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-sans font-medium text-white group-hover:text-[#0ec2bc] transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        {article.category && (
                          <span className="text-xs font-sans font-light text-[#0ec2bc]">
                            {article.category}
                          </span>
                        )}
                        <span className="text-xs font-sans font-light text-[#C4C8D4]/70">
                          {article.viewCount} views
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#C4C8D4] flex-shrink-0 mt-0.5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#C4C8D4] flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                </CollapsibleTrigger>

                {/* Expanded Content */}
                <CollapsibleContent className="space-y-2">
                  {/* Summary */}
                  {article.summary && (
                    <p className="text-sm font-sans font-light text-[#C4C8D4] line-clamp-3">
                      {article.summary}
                    </p>
                  )}

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs font-sans font-light px-2 py-0.5 rounded-full bg-primary/10 text-[#0ec2bc] border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyLink(article)}
                      className="flex-1 text-xs h-8 border-primary/20 hover:border-[#0ec2bc] hover:bg-[#0ec2bc]/10 transition-colors"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      {isCopied ? 'Copied!' : 'Copy Link'}
                    </Button>
                    {onArticleSelect && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onArticleSelect(article)}
                        className="flex-1 text-xs h-8 bg-[#0ec2bc] hover:bg-[#0ec2bc]/90 text-white"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Send
                      </Button>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
}
