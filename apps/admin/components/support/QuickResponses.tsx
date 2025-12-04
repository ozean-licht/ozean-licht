/**
 * QuickResponses Component - Support Management System
 *
 * Searchable, filterable list of canned response templates for support agents.
 * Supports team-wide and personal responses with category filtering.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { QuickResponse } from '@/types/support';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface QuickResponsesProps {
  /** List of available quick responses */
  responses: QuickResponse[];
  /** Loading state */
  loading?: boolean;
  /** Callback when response is selected */
  onSelect: (response: QuickResponse) => void;
  /** Optional callback to create new response */
  onCreateNew?: () => void;
  /** Current user ID for filtering personal responses */
  currentUserId?: string;
}

type ResponseScope = 'all' | 'team' | 'personal';

/**
 * QuickResponses displays a searchable list of canned response templates
 *
 * Features:
 * - Search by title and content
 * - Filter by category
 * - Toggle between all/team/personal responses
 * - Click-to-select functionality
 * - Usage count display
 * - Create new response button
 *
 * @example
 * ```tsx
 * <QuickResponses
 *   responses={quickResponses}
 *   loading={isLoading}
 *   onSelect={(response) => insertResponse(response)}
 *   onCreateNew={() => openCreateDialog()}
 *   currentUserId={session.user.id}
 * />
 * ```
 */
export default function QuickResponses({
  responses,
  loading = false,
  onSelect,
  onCreateNew,
  currentUserId,
}: QuickResponsesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScope, setSelectedScope] = useState<ResponseScope>('all');

  // Extract unique categories from responses
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    responses.forEach((response) => {
      if (response.category) {
        categorySet.add(response.category);
      }
    });
    return Array.from(categorySet).sort();
  }, [responses]);

  // Filter responses based on search, category, and scope
  const filteredResponses = useMemo(() => {
    let filtered = responses;

    // Filter by scope
    if (selectedScope === 'team') {
      filtered = filtered.filter((r) => !r.isPersonal);
    } else if (selectedScope === 'personal') {
      filtered = filtered.filter(
        (r) => r.isPersonal && r.createdBy === currentUserId
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((r) => r.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.content.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [responses, searchQuery, selectedCategory, selectedScope, currentUserId]);

  // Loading skeleton
  if (loading) {
    return (
      <Card className="bg-[#00111A]/70 backdrop-blur-md border border-primary/20">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-9 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#00111A]/70 backdrop-blur-md border border-primary/20 hover:border-primary/30 transition-all">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-sans font-medium text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Quick Responses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4C8D4]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            type="text"
            placeholder="Search responses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Scope Toggle */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={selectedScope === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedScope('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={selectedScope === 'team' ? 'default' : 'outline'}
            onClick={() => setSelectedScope('team')}
          >
            Team
          </Button>
          <Button
            size="sm"
            variant={selectedScope === 'personal' ? 'default' : 'outline'}
            onClick={() => setSelectedScope('personal')}
          >
            Personal
          </Button>
        </div>

        {/* Category Filter Pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`text-xs font-sans font-medium px-3 py-1 rounded-full transition-all ${
                selectedCategory === null
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'bg-card/50 text-[#C4C8D4] hover:bg-card/70 border border-primary/20'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs font-sans font-medium px-3 py-1 rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'bg-card/50 text-[#C4C8D4] hover:bg-card/70 border border-primary/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Response List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {filteredResponses.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 text-[#C4C8D4]/30 mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-sm font-sans font-light text-[#C4C8D4]">
                No responses found
              </p>
              <p className="text-xs font-sans font-light text-[#C4C8D4]/70 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredResponses.map((response) => (
              <button
                key={response.id}
                onClick={() => onSelect(response)}
                className="w-full text-left p-4 rounded-lg bg-card/50 border border-primary/10 hover:border-primary/30 hover:bg-card/70 transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-sans font-medium text-white group-hover:text-primary transition-colors">
                    {response.title}
                  </h4>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {response.isPersonal && (
                      <Badge variant="outline" className="text-xs">
                        Personal
                      </Badge>
                    )}
                    {response.category && (
                      <Badge variant="secondary" className="text-xs">
                        {response.category}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content Preview */}
                <p className="text-sm font-sans font-light text-[#C4C8D4] line-clamp-2 mb-2">
                  {response.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs font-sans font-light text-[#C4C8D4]/70">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      {response.usageCount} uses
                    </span>
                    {response.language && response.language !== 'en' && (
                      <Badge variant="outline" className="text-xs">
                        {response.language.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <span className="text-primary group-hover:underline">
                    Click to use
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Create New Button */}
        {onCreateNew && (
          <Button
            onClick={onCreateNew}
            className="w-full"
            variant="outline"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Response
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
