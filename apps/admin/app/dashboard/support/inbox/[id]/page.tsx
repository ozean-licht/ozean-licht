/**
 * Conversation Detail Page
 *
 * Displays conversation messages and customer context.
 * Split layout: message thread (left 2/3) and customer panel (right 1/3).
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, User, CreditCard, BookOpen, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import type { Conversation, CustomerContext, KnowledgeArticle } from '@/types/support';
import { getRelativeTime } from '@/types/support';
import { ArticleSuggestions } from '@/components/support';
import { toast } from 'sonner';

// Move keyword patterns to module level to prevent recreation on each render
const KEYWORD_PATTERNS = [
  // Account & Billing
  { pattern: /(?:payment|zahlung|bezahlung|rechnung|invoice)/gi, keyword: 'payment' },
  { pattern: /(?:account|konto|anmelden|login)/gi, keyword: 'account' },
  { pattern: /(?:password|passwort|kennwort)/gi, keyword: 'password' },
  { pattern: /(?:subscription|abo|abonnement)/gi, keyword: 'subscription' },
  // Courses & Learning
  { pattern: /(?:course|kurs|lektion|lesson)/gi, keyword: 'course' },
  { pattern: /(?:video|video)/gi, keyword: 'video' },
  { pattern: /(?:certificate|zertifikat)/gi, keyword: 'certificate' },
  { pattern: /(?:progress|fortschritt)/gi, keyword: 'progress' },
  // Technical
  { pattern: /(?:error|fehler|problem)/gi, keyword: 'error' },
  { pattern: /(?:download|herunterladen)/gi, keyword: 'download' },
  { pattern: /(?:mobile|handy|app)/gi, keyword: 'mobile' },
  // Spiritual
  { pattern: /(?:meditation|meditat)/gi, keyword: 'meditation' },
  { pattern: /(?:practice|praxis|übung)/gi, keyword: 'practice' },
] as const;

export default function ConversationDetailPage() {
  const { status } = useSession();
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [customerContext, setCustomerContext] = useState<CustomerContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize keyword extraction to prevent recalculation on every render
  const extractedKeywords = useMemo(
    () => extractKeywordsFromConversation(conversation),
    [conversation?.id, conversation?.messages?.length]
  );

  // Fetch conversation details
  useEffect(() => {
    // Check auth status before fetching
    if (status === 'loading') {
      return; // Still checking auth
    }

    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch conversation
        const convResponse = await fetch(`/api/support/conversations/${conversationId}`);
        if (!convResponse.ok) {
          throw new Error('Failed to fetch conversation');
        }
        const convData = await convResponse.json();
        setConversation(convData.conversation);

        // Fetch customer context
        try {
          const contextResponse = await fetch(`/api/support/conversations/${conversationId}/context`);
          if (contextResponse.ok) {
            const contextData = await contextResponse.json();
            setCustomerContext(contextData);
          }
        } catch (err) {
          console.warn('Failed to fetch customer context:', err);
          // Non-critical, continue without context
        }
      } catch (err) {
        console.error('Error fetching conversation:', err);
        setError(err instanceof Error ? err.message : 'Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchData();
    }
  }, [status, conversationId, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inbox
        </Button>
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <p className="text-sm text-destructive">{error || 'Conversation not found'}</p>
            <Button onClick={() => router.push('/dashboard/support/inbox')} className="mt-4">
              Return to Inbox
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-decorative text-white">
              {conversation.contactName || conversation.contactEmail || 'Anonymous'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {conversation.channel} • {getRelativeTime(conversation.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span className={`text-sm px-3 py-1 rounded ${
            conversation.status === 'open' ? 'bg-green-500/20 text-green-400' :
            conversation.status === 'resolved' ? 'bg-blue-500/20 text-blue-400' :
            conversation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {conversation.status}
          </span>
        </div>
      </div>

      {/* Conversation Info */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Team</p>
              <p className="text-sm font-medium text-white capitalize">
                {conversation.team || 'Not assigned'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Priority</p>
              <p className="text-sm font-medium text-white capitalize">
                {conversation.priority}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assigned Agent</p>
              <p className="text-sm font-medium text-white">
                {conversation.assignedAgent?.name || 'Unassigned'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CSAT Rating</p>
              <p className="text-sm font-medium text-white">
                {conversation.csatRating ? `${conversation.csatRating}/5` : 'Not rated'}
              </p>
            </div>
          </div>
          {conversation.labels.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Labels</p>
              <div className="flex flex-wrap gap-2">
                {conversation.labels.map((label) => (
                  <span
                    key={label}
                    className="text-xs px-2 py-1 rounded bg-primary/10 text-primary"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content: Message Thread + Customer Context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Thread (2/3) */}
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Conversation Thread
              </CardTitle>
              <CardDescription>
                {conversation.messages?.length || 0} messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!conversation.messages || conversation.messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No messages yet
                </p>
              ) : (
                <div className="space-y-4">
                  {conversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.senderType === 'agent'
                            ? 'bg-primary/20 text-white'
                            : 'bg-card/80 text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-xs font-medium">
                            {message.senderName || message.senderType}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.isPrivate && (
                          <p className="text-xs text-yellow-400 mt-2">Private note</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customer Context Panel (1/3) */}
        <div className="space-y-4">
          {/* Customer Info */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-4 w-4 text-primary" />
                Customer Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium text-white">
                  {customerContext?.user?.name || conversation.contactName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-white">
                  {customerContext?.user?.email || conversation.contactEmail || 'N/A'}
                </p>
              </div>
              {customerContext?.memberSince && (
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="text-sm font-medium text-white">
                    {new Date(customerContext.memberSince).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Purchase History */}
          {customerContext && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Purchases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Purchases</p>
                    <p className="text-lg font-bold text-white">
                      €{customerContext.totalPurchases.toFixed(2)}
                    </p>
                  </div>
                  {customerContext.recentPayments.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Recent Payments</p>
                      <div className="space-y-2">
                        {customerContext.recentPayments.slice(0, 3).map((payment, idx) => (
                          <div key={idx} className="text-xs">
                            <p className="text-white">{payment.description}</p>
                            <p className="text-muted-foreground">
                              €{payment.amount} • {new Date(payment.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enrollments */}
          {customerContext && customerContext.courseEnrollments.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Course Enrollments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customerContext.courseEnrollments.slice(0, 3).map((enrollment) => (
                    <div key={enrollment.courseId} className="text-xs">
                      <p className="text-white font-medium">{enrollment.courseName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-card rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground">{enrollment.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Previous Conversations */}
          {customerContext && customerContext.previousConversations.length > 1 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Previous Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {customerContext.previousConversations
                    .filter((conv) => conv.id !== conversationId)
                    .slice(0, 3)
                    .map((conv) => (
                      <Link
                        key={conv.id}
                        href={`/dashboard/support/inbox/${conv.id}`}
                        className="block text-xs p-2 rounded bg-card/50 hover:bg-card/70 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded ${
                            conv.status === 'resolved'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {conv.status}
                          </span>
                          <span className="text-muted-foreground">
                            {getRelativeTime(conv.createdAt)}
                          </span>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Article Suggestions - Chatwoot Integration */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-4 w-4 text-primary" />
                Suggested Articles
              </CardTitle>
              <CardDescription>
                Relevant knowledge base articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ArticleSuggestions
                keywords={extractedKeywords}
                onArticleSelect={(article: KnowledgeArticle) => {
                  // Copy article link to clipboard for easy sharing
                  navigator.clipboard.writeText(`${window.location.origin}/kb/${article.slug}`);
                  toast.success(`Article "${article.title}" link copied!`);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * Extract keywords from conversation messages for article suggestions
 * Now uses module-level KEYWORD_PATTERNS to avoid recreating regex objects
 */
function extractKeywordsFromConversation(conversation: Conversation | null): string[] {
  if (!conversation?.messages || conversation.messages.length === 0) {
    // Fall back to labels if no messages
    return conversation?.labels || [];
  }

  // Combine all message content
  const allText = conversation.messages
    .map((m) => m.content || '')
    .join(' ')
    .toLowerCase();

  const foundKeywords: string[] = [];

  // Use module-level patterns to avoid recreation
  for (const { pattern, keyword } of KEYWORD_PATTERNS) {
    // Reset regex lastIndex to ensure proper testing (global flag)
    pattern.lastIndex = 0;
    if (pattern.test(allText) && !foundKeywords.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  }

  // Add conversation labels as keywords
  if (conversation.labels.length > 0) {
    for (const label of conversation.labels) {
      if (!foundKeywords.includes(label.toLowerCase())) {
        foundKeywords.push(label.toLowerCase());
      }
    }
  }

  // Limit to 5 keywords max for API performance
  return foundKeywords.slice(0, 5);
}
