/**
 * Support Inbox Page
 *
 * Client component for viewing and filtering conversations.
 * Displays conversation list with filters and pagination.
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Conversation, ConversationStatus, Team } from '@/types/support';
import { getRelativeTime } from '@/types/support';

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | 'all'>('all');
  const [teamFilter, setTeamFilter] = useState<Team | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (teamFilter !== 'all') params.append('team', teamFilter);
        if (searchQuery) params.append('search', searchQuery);
        params.append('limit', limit.toString());
        params.append('offset', ((currentPage - 1) * limit).toString());

        const response = await fetch(`/api/support/conversations?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }

        const data = await response.json();
        setConversations(data.conversations || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [statusFilter, teamFilter, searchQuery, currentPage]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-decorative text-white mb-2">Inbox</h1>
        <p className="text-muted-foreground">
          View and manage customer conversations
        </p>
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
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as ConversationStatus | 'all');
                  setCurrentPage(1);
                }}
                className="w-full h-10 px-3 rounded-md bg-input border border-input text-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="snoozed">Snoozed</option>
              </select>
            </div>

            {/* Team Filter */}
            <div className="w-full md:w-48">
              <select
                value={teamFilter}
                onChange={(e) => {
                  setTeamFilter(e.target.value as Team | 'all');
                  setCurrentPage(1);
                }}
                className="w-full h-10 px-3 rounded-md bg-input border border-input text-white text-sm"
              >
                <option value="all">All Teams</option>
                <option value="general">General</option>
                <option value="tech">Tech Support</option>
                <option value="sales">Sales</option>
                <option value="spiritual">Spiritual</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              Conversations ({total})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading conversations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No conversations found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/dashboard/support/inbox/${conversation.id}`}
                  className="block"
                >
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors border border-border hover:border-primary/30">
                    {/* Left: Contact Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-white truncate">
                          {conversation.contactName || conversation.contactEmail || 'Anonymous'}
                        </p>
                        {/* Status Badge */}
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          conversation.status === 'open' ? 'bg-green-500/20 text-green-400' :
                          conversation.status === 'resolved' ? 'bg-blue-500/20 text-blue-400' :
                          conversation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {conversation.status}
                        </span>
                        {/* Priority Badge */}
                        {conversation.priority !== 'normal' && (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            conversation.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                            conversation.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {conversation.priority}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{conversation.channel}</span>
                        <span>•</span>
                        <span>{getRelativeTime(conversation.createdAt)}</span>
                        {conversation.team && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{conversation.team}</span>
                          </>
                        )}
                      </div>
                      {/* Labels */}
                      {conversation.labels.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {conversation.labels.slice(0, 3).map((label) => (
                            <span
                              key={label}
                              className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary"
                            >
                              {label}
                            </span>
                          ))}
                          {conversation.labels.length > 3 && (
                            <span className="text-xs px-2 py-0.5 text-muted-foreground">
                              +{conversation.labels.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Agent */}
                    {conversation.assignedAgent && (
                      <div className="text-sm text-muted-foreground text-right">
                        <p className="font-medium text-white">{conversation.assignedAgent.name}</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
