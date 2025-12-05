/**
 * MessagesPageClient - Main Team Chat & Messaging UI
 *
 * Full-featured messaging interface with:
 * - Conversation sidebar (left)
 * - Message list and composer (center)
 * - Participant list (right, collapsible)
 * - Real-time polling for updates
 * - Mobile responsive design
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ConversationSidebar from '@/components/messages/ConversationSidebar';
import MessageList from '@/components/messages/MessageList';
import MessageComposer from '@/components/messages/MessageComposer';
import ChannelHeader from '@/components/messages/ChannelHeader';
import ParticipantList from '@/components/messages/ParticipantList';
import NewChannelModal from '@/components/messages/NewChannelModal';
import NewDMModal from '@/components/messages/NewDMModal';
import NewTicketModal from '@/components/messages/NewTicketModal';
import ContextPanel from '@/components/messages/ContextPanel';
import TypeFilterTabs from '@/components/messages/TypeFilterTabs';
import EscalateToTicketButton from '@/components/messages/EscalateToTicketButton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  UnifiedConversation,
  UnifiedMessage,
  ConversationType,
  CreateInternalTicketInput,
  AssignedTeam,
} from '@/types/team-chat';
import { Menu, X, Users, PanelRightOpen, PanelRightClose } from 'lucide-react';

interface MessagesPageClientProps {
  /** Filter conversations by type */
  typeFilter?: ConversationType;
  /** Initial conversation ID (for deep linking) */
  initialConversationId?: string;
  /** Show unified inbox with type filter tabs */
  showUnifiedInbox?: boolean;
}

/**
 * MessagesPageClient Component
 *
 * Main messaging UI with three-column layout:
 * - Left: Conversation sidebar with search and grouping
 * - Center: Active conversation with messages and composer
 * - Right: Participant list (collapsible on mobile)
 *
 * Features:
 * - Auto-polling for new messages (every 5 seconds when focused)
 * - Mobile responsive (hamburger menu for sidebar)
 * - Loading and error states
 * - Support for channels, DMs, and internal tickets
 *
 * @example
 * ```tsx
 * <MessagesPageClient typeFilter="team_channel" />
 * <MessagesPageClient typeFilter="direct_message" />
 * <MessagesPageClient initialConversationId="conv_123" />
 * ```
 */
export default function MessagesPageClient({
  typeFilter: initialTypeFilter,
  initialConversationId,
  showUnifiedInbox = false,
}: MessagesPageClientProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // State
  const [conversations, setConversations] = useState<UnifiedConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<UnifiedConversation | null>(null);
  const [messages, setMessages] = useState<UnifiedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Type filter for unified inbox
  const [activeTypeFilter, setActiveTypeFilter] = useState<ConversationType | 'all'>(
    initialTypeFilter || 'all'
  );

  // Compute effective filter for API calls
  const typeFilter = activeTypeFilter === 'all' ? undefined : activeTypeFilter;

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(true);
  const [contextPanelOpen, setContextPanelOpen] = useState(false);
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [showNewDMModal, setShowNewDMModal] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [escalationTeam, setEscalationTeam] = useState<AssignedTeam | null>(null);

  // Polling
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const windowFocused = useRef(true);

  // Track window focus for efficient polling
  useEffect(() => {
    const handleFocus = () => {
      windowFocused.current = true;
    };
    const handleBlur = () => {
      windowFocused.current = false;
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    try {
      const params = new URLSearchParams();
      if (typeFilter) params.append('type', typeFilter);
      params.append('limit', '100');

      const response = await fetch(`/api/messages/conversations?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      setConversations(data.conversations || []);

      // Auto-select initial conversation or first conversation
      if (initialConversationId && !selectedConversation) {
        const initial = data.conversations?.find((c: UnifiedConversation) => c.id === initialConversationId);
        if (initial) {
          setSelectedConversation(initial);
        }
      } else if (!selectedConversation && data.conversations?.length > 0) {
        setSelectedConversation(data.conversations[0]);
      }

      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversations';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [status, typeFilter, router, initialConversationId, selectedConversation, toast]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      const response = await fetch(`/api/messages/conversations/${conversationId}/messages?limit=100`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
      setMessages([]);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setMessagesLoading(false);
    }
  }, [toast]);

  // Send message
  const handleSendMessage = async (content: string, isPrivate: boolean, attachments: File[]) => {
    if (!selectedConversation || !session?.user) return;

    try {
      // SECURITY FIX: Send as JSON instead of FormData
      // TODO: Implement file upload separately via dedicated upload endpoint
      // For now, file attachments are validated but not yet uploaded
      if (attachments.length > 0) {
        alert('File upload support coming soon. Your message will be sent without attachments.');
      }

      const response = await fetch(`/api/messages/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          isPrivate,
          senderType: 'agent',
          senderId: session.user.id,
          senderName: session.user.name || session.user.email,
          attachments: [], // TODO: Implement file upload separately
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Add message to list immediately
      setMessages((prev) => [...prev, data.message]);

      // Refresh conversations to update last message
      fetchConversations();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation, fetchMessages]);

  // Polling for new messages (every 5 seconds when window focused)
  useEffect(() => {
    if (!selectedConversation) return;

    const poll = () => {
      if (windowFocused.current) {
        fetchMessages(selectedConversation.id);
      }
    };

    pollingIntervalRef.current = setInterval(poll, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [selectedConversation, fetchMessages]);

  // Handle conversation selection
  const handleSelectConversation = (conversation: UnifiedConversation) => {
    setSelectedConversation(conversation);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  // Handle new channel creation
  const handleNewChannel = () => {
    setShowNewChannelModal(true);
  };

  const handleNewDM = () => {
    setShowNewDMModal(true);
  };

  const handleNewTicket = () => {
    setEscalationTeam(null); // Reset escalation context
    setShowNewTicketModal(true);
  };

  // Handle escalation from support ticket to internal ticket
  const handleEscalate = (team: AssignedTeam) => {
    setEscalationTeam(team);
    setShowNewTicketModal(true);
  };

  // Handle conversation update (from ContextPanel)
  const handleConversationUpdate = async (updates: Partial<UnifiedConversation>) => {
    if (!selectedConversation) return;

    try {
      const response = await fetch(`/api/messages/conversations/${selectedConversation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        // Update selected conversation with new data
        setSelectedConversation(data.conversation);
        // Refresh conversations list
        await fetchConversations();
      } else {
        throw new Error('Failed to update conversation');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update conversation';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Calculate counts for type filter tabs
  const typeCounts = {
    all: conversations.length,
    team_channel: conversations.filter(c => c.type === 'team_channel').length,
    support: conversations.filter(c => c.type === 'support').length,
    direct_message: conversations.filter(c => c.type === 'direct_message').length,
    internal_ticket: conversations.filter(c => c.type === 'internal_ticket').length,
  };

  // Filter conversations for sidebar based on active filter
  const filteredConversations = activeTypeFilter === 'all'
    ? conversations
    : conversations.filter(c => c.type === activeTypeFilter);

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-sm font-sans font-light text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <p className="text-sm text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Unified Inbox Type Filter Tabs */}
      {showUnifiedInbox && (
        <div className="border-b border-border bg-card/70 backdrop-blur-sm">
          <TypeFilterTabs
            activeFilter={activeTypeFilter}
            onFilterChange={setActiveTypeFilter}
            counts={typeCounts}
          />
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Desktop: always visible, Mobile: overlay */}
        <aside
          className={`
            fixed lg:relative inset-y-0 left-0 z-30 lg:z-0
            w-80 transform transition-transform duration-200 ease-in-out
            lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <ConversationSidebar
            conversations={filteredConversations}
            selectedId={selectedConversation?.id}
            onSelect={handleSelectConversation}
            onNewChannel={handleNewChannel}
            onNewDM={handleNewDM}
            onNewTicket={handleNewTicket}
            currentUserId={session?.user?.id}
            canAccessInternalTickets={true}
            canAccessSupportTickets={true}
          />
        </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-2 lg:gap-0">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden ml-2"
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* Channel header */}
              <div className="flex-1">
                <ChannelHeader
                  conversation={selectedConversation}
                  onStar={() => {
                    // TODO: Implement star/pin functionality
                  }}
                  isStarred={false}
                />
              </div>

              {/* Escalate button for support tickets */}
              {selectedConversation.type === 'support' && (
                <div className="hidden lg:block mr-2">
                  <EscalateToTicketButton
                    conversationId={selectedConversation.id}
                    conversationTitle={selectedConversation.contactName || selectedConversation.contactEmail || 'Support Ticket'}
                    onEscalate={handleEscalate}
                  />
                </div>
              )}

              {/* Context panel toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setContextPanelOpen(!contextPanelOpen)}
                className="hidden lg:flex mr-2"
                aria-label={contextPanelOpen ? 'Hide details' : 'Show details'}
                title={contextPanelOpen ? 'Hide details' : 'Show details'}
              >
                {contextPanelOpen ? (
                  <PanelRightClose className="h-5 w-5" />
                ) : (
                  <PanelRightOpen className="h-5 w-5" />
                )}
              </Button>

              {/* Mobile participants toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setParticipantsOpen(!participantsOpen)}
                className="lg:hidden mr-2"
                aria-label={participantsOpen ? 'Hide participants' : 'Show participants'}
              >
                <Users className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
              <MessageList
                messages={messages}
                conversationType={selectedConversation.type}
                currentUserId={session?.user?.id}
                loading={messagesLoading}
              />
            </div>

            {/* Composer */}
            <MessageComposer
              onSend={handleSendMessage}
              allowPrivateNotes={selectedConversation.type === 'support' || selectedConversation.type === 'internal_ticket'}
              placeholder="Type a message..."
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md px-4">
              <svg
                className="w-16 h-16 text-primary mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="text-lg font-sans font-medium text-white mb-2">
                Select a conversation
              </h3>
              <p className="text-sm font-sans font-light text-muted-foreground">
                Choose a channel or direct message from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Context Panel - Desktop: collapsible, shows conversation details */}
      {selectedConversation && contextPanelOpen && (
        <aside className="hidden lg:block w-80 border-l border-border overflow-y-auto">
          <ContextPanel
            conversation={selectedConversation}
            onUpdate={handleConversationUpdate}
            canEdit={true}
          />
        </aside>
      )}

      {/* Participants panel (mobile only) */}
      {selectedConversation && participantsOpen && (
        <aside className="lg:hidden fixed inset-y-0 right-0 w-64 border-l border-border bg-card/70 backdrop-blur-sm overflow-y-auto p-4 z-30">
          <ParticipantList
            participants={selectedConversation.participants || []}
            currentUserId={session?.user?.id}
            canManage={false}
          />
        </aside>
      )}
      </div>

      {/* Modals */}
      {showNewChannelModal && (
        <NewChannelModal
          open={showNewChannelModal}
          onClose={() => setShowNewChannelModal(false)}
          onCreate={async (data) => {
            // Create channel via API
            try {
              const response = await fetch('/api/messages/channels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
              if (response.ok) {
                const result = await response.json();
                setShowNewChannelModal(false);
                await fetchConversations();
                if (result.conversation) {
                  setSelectedConversation(result.conversation);
                }
              } else {
                throw new Error('Failed to create channel');
              }
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Failed to create channel';
              toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
              });
            }
          }}
        />
      )}

      {showNewDMModal && (
        <NewDMModal
          open={showNewDMModal}
          onClose={() => setShowNewDMModal(false)}
          onCreate={async (userIds) => {
            // Create DM via API
            try {
              const response = await fetch('/api/messages/dm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIds }),
              });
              if (response.ok) {
                const result = await response.json();
                setShowNewDMModal(false);
                await fetchConversations();
                if (result.conversation) {
                  setSelectedConversation(result.conversation);
                }
              } else {
                throw new Error('Failed to create DM');
              }
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Failed to create DM';
              toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
              });
            }
          }}
        />
      )}

      {showNewTicketModal && (
        <NewTicketModal
          open={showNewTicketModal}
          onClose={() => {
            setShowNewTicketModal(false);
            setEscalationTeam(null);
          }}
          onCreate={async (data: CreateInternalTicketInput) => {
            // Create internal ticket via API
            try {
              // If escalating from a support ticket, add linked conversation
              const ticketData = {
                ...data,
                requesterId: session?.user?.id, // Required by API
                linkedConversationId: escalationTeam ? selectedConversation?.id : undefined,
                assignedTeam: escalationTeam || data.assignedTeam,
              };

              const response = await fetch('/api/messages/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData),
              });
              if (response.ok) {
                const result = await response.json();
                setShowNewTicketModal(false);
                setEscalationTeam(null);
                await fetchConversations();
                if (result.conversation) {
                  setSelectedConversation(result.conversation);
                }
              } else {
                throw new Error('Failed to create ticket');
              }
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Failed to create internal ticket';
              toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
              });
              throw error; // Re-throw to keep modal open
            }
          }}
          linkedConversationId={escalationTeam ? selectedConversation?.id : undefined}
          linkedConversationTitle={
            escalationTeam
              ? selectedConversation?.contactName || selectedConversation?.contactEmail || 'Support Ticket'
              : undefined
          }
        />
      )}
    </div>
  );
}
