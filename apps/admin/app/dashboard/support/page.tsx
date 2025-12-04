/**
 * Support Dashboard Overview Page
 *
 * Displays support metrics, recent conversations, and quick links.
 * Server component that fetches stats from database.
 */

import { Metadata } from 'next';
import { requireAnyRole } from '@/lib/rbac/utils';
import { getSupportStats } from '@/lib/db/support-analytics';
import { getAllConversations } from '@/lib/db/support-conversations';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Clock, CheckCircle, TrendingUp, MessageCircle, BookOpen } from 'lucide-react';
import { formatResponseTime, getRelativeTime } from '@/types/support';

export const metadata: Metadata = {
  title: 'Support Dashboard | Admin',
  description: 'Support management overview and metrics',
};

export default async function SupportPage() {
  // RBAC check already handled by layout, but explicit for clarity
  await requireAnyRole(['super_admin', 'ol_admin', 'support']);

  // Fetch support statistics
  let stats;
  try {
    stats = await getSupportStats();
  } catch (error) {
    console.error('Failed to fetch support stats:', error);
    stats = {
      openConversations: 0,
      pendingConversations: 0,
      avgResponseTimeMinutes: 0,
      avgResolutionTimeMinutes: 0,
      csatScore: 0,
      conversationsToday: 0,
      resolvedToday: 0,
    };
  }

  // Fetch recent conversations (last 5)
  let recentConversations: Awaited<ReturnType<typeof getAllConversations>>['conversations'] = [];
  try {
    const result = await getAllConversations({
      limit: 5,
      orderBy: 'created_at',
      orderDirection: 'desc',
    });
    recentConversations = result.conversations;
  } catch (error) {
    console.error('Failed to fetch recent conversations:', error);
    recentConversations = [];
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-decorative text-white mb-2">Support Dashboard</h1>
        <p className="text-muted-foreground">
          Manage customer conversations and knowledge base
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Open Conversations */}
        <Card className="glass-card glass-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.openConversations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingConversations} pending response
            </p>
          </CardContent>
        </Card>

        {/* Today's Activity */}
        <Card className="glass-card glass-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.conversationsToday}</div>
            <p className="text-xs text-muted-foreground">
              {stats.resolvedToday} resolved
            </p>
          </CardContent>
        </Card>

        {/* Avg Response Time */}
        <Card className="glass-card glass-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatResponseTime(stats.avgResponseTimeMinutes)}
            </div>
            <p className="text-xs text-muted-foreground">
              First response to customers
            </p>
          </CardContent>
        </Card>

        {/* Resolution Time */}
        <Card className="glass-card glass-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatResponseTime(stats.avgResolutionTimeMinutes)}
            </div>
            <p className="text-xs text-muted-foreground">
              Time to resolve issues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Inbox Link */}
        <Link href="/dashboard/support/inbox">
          <Card className="glass-card glass-hover cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Inbox</CardTitle>
                  <CardDescription>View and respond to conversations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {stats.openConversations} conversations need attention
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Knowledge Base Link */}
        <Link href="/dashboard/support/knowledge">
          <Card className="glass-card glass-hover cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Knowledge Base</CardTitle>
                  <CardDescription>Manage help articles and documentation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and organize support articles
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Conversations */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl font-decorative">Recent Conversations</CardTitle>
          <CardDescription>Last 5 customer interactions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentConversations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No conversations yet
            </p>
          ) : (
            <div className="space-y-4">
              {recentConversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/dashboard/support/inbox/${conversation.id}`}
                  className="block"
                >
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors border border-border hover:border-primary/30">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-white truncate">
                          {conversation.contactName || conversation.contactEmail || 'Anonymous'}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          conversation.status === 'open' ? 'bg-green-500/20 text-green-400' :
                          conversation.status === 'resolved' ? 'bg-blue-500/20 text-blue-400' :
                          conversation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {conversation.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {conversation.channel} • {getRelativeTime(conversation.createdAt)}
                      </p>
                    </div>
                    {conversation.assignedAgent && (
                      <div className="text-sm text-muted-foreground">
                        Assigned to {conversation.assignedAgent.name}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-4 text-center">
            <Link
              href="/dashboard/support/inbox"
              className="text-sm text-primary hover:underline"
            >
              View all conversations →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
