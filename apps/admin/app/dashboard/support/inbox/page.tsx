/**
 * Support Inbox Page
 *
 * Client component for viewing and filtering conversations.
 * Displays conversation list with filters and pagination.
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Conversation, ConversationStatus, Team } from '@/types/support';
import { getRelativeTime } from '@/types/support';

export default function InboxPage() {
  const { status } = useSession();
  const router = useRouter();
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
    // Check auth status before fetching
    if (status === 'loading') {
      return; // Still checking auth
    }

    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

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
  }, [status, statusFilter, teamFilter, searchQuery, currentPage, router]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-decorative text-white mb-1 sm:mb-2">Inbox</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          View and manage customer conversations
        </p>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search - Full width on mobile */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="pl-10 h-11 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Filters Row - Stack on mobile, horizontal on tablet+ */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Status Filter */}
              <div className="w-full sm:w-auto sm:flex-1">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as ConversationStatus | 'all');
                    setCurrentPage(1);
                  }}
                  className="w-full h-11 px-3 rounded-md bg-input border border-input text-white text-sm sm:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="snoozed">Snoozed</option>
                </select>
              </div>

              {/* Team Filter */}
              <div className="w-full sm:w-auto sm:flex-1">
                <select
                  value={teamFilter}
                  onChange={(e) => {
                    setTeamFilter(e.target.value as Team | 'all');
                    setCurrentPage(1);
                  }}
                  className="w-full h-11 px-3 rounded-md bg-input border border-input text-white text-sm sm:text-base"
                >
                  <option value="all">All Teams</option>
                  <option value="general">General</option>
                  <option value="tech">Tech Support</option>
                  <option value="sales">Sales</option>
                  <option value="spiritual">Spiritual</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <Card className="glass-card">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">
              Conversations ({total})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading conversations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 sm:py-12">
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
            <div className="text-center py-8 sm:py-12">
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
                  <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors border border-border hover:border-primary/30 active:bg-card/80">
                    {/* Left: Contact Info */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-medium text-white truncate text-sm sm:text-base max-w-[200px] sm:max-w-none">
                          {conversation.contactName || conversation.contactEmail || 'Anonymous'}
                        </p>
                        {/* Status Badge */}
                        <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${
                          conversation.status === 'open' ? 'bg-green-500/20 text-green-400' :
                          conversation.status === 'resolved' ? 'bg-blue-500/20 text-blue-400' :
                          conversation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {conversation.status}
                        </span>
                        {/* Priority Badge - Hide on mobile if normal */}
                        {conversation.priority !== 'normal' && (
                          <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${
                            conversation.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                            conversation.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {conversation.priority}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                        <span className="capitalize">{conversation.channel}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{getRelativeTime(conversation.createdAt)}</span>
                        {/* Hide team on mobile to save space */}
                        {conversation.team && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="capitalize hidden sm:inline">{conversation.team}</span>
                          </>
                        )}
                      </div>
                      {/* Labels - Limit to 2 on mobile, 3 on larger screens */}
                      {conversation.labels.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {conversation.labels.slice(0, 2).map((label) => (
                            <span
                              key={label}
                              className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary sm:inline"
                            >
                              {label}
                            </span>
                          ))}
                          {/* Show 3rd label only on larger screens */}
                          {conversation.labels.length > 2 && conversation.labels[2] && (
                            <span
                              className="hidden sm:inline text-xs px-2 py-0.5 rounded bg-primary/10 text-primary"
                            >
                              {conversation.labels[2]}
                            </span>
                          )}
                          {/* Adjust counter for mobile vs desktop */}
                          {conversation.labels.length > 2 && (
                            <span className="text-xs px-2 py-0.5 text-muted-foreground sm:hidden">
                              +{conversation.labels.length - 2}
                            </span>
                          )}
                          {conversation.labels.length > 3 && (
                            <span className="hidden sm:inline text-xs px-2 py-0.5 text-muted-foreground">
                              +{conversation.labels.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Agent - Hide on mobile */}
                    {conversation.assignedAgent && (
                      <div className="hidden sm:block text-sm text-muted-foreground text-right shrink-0">
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
            <div className="flex items-center justify-between mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
              <p className="text-xs sm:text-sm text-muted-foreground">
                <span className="hidden sm:inline">Page </span>{currentPage}<span className="hidden sm:inline"> of {totalPages}</span>
                <span className="sm:hidden">/{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-9 sm:h-10 min-w-[44px]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-9 sm:h-10 min-w-[44px]"
                >
                  <span className="hidden sm:inline mr-1">Next</span>
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
