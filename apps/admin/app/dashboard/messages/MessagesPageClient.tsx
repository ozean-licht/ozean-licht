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
// Skeleton imported but used in loading states below
import { Button } from '@/components/ui/button';
import {
  UnifiedConversation,
  UnifiedMessage,
  ConversationType,
} from '@/types/team-chat';
import { Menu, X, Users } from 'lucide-react';

interface MessagesPageClientProps {
  /** Filter conversations by type */
  typeFilter?: ConversationType;
  /** Initial conversation ID (for deep linking) */
  initialConversationId?: string;
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
  typeFilter,
  initialConversationId,
}: MessagesPageClientProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State
  const [conversations, setConversations] = useState<UnifiedConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<UnifiedConversation | null>(null);
  const [messages, setMessages] = useState<UnifiedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(true);
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [showNewDMModal, setShowNewDMModal] = useState(false);

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
      console.error('Error fetching conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [status, typeFilter, router, initialConversationId, selectedConversation]);

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
      console.error('Error fetching messages:', err);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

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
      console.error('Error sending message:', err);
      alert('Failed to send message');
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

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-sm font-sans font-light text-[#C4C8D4]">Loading messages...</p>
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
    <div className="h-screen flex bg-background overflow-hidden">
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
          conversations={conversations}
          selectedId={selectedConversation?.id}
          onSelect={handleSelectConversation}
          onNewChannel={typeFilter === 'team_channel' ? handleNewChannel : undefined}
          onNewDM={typeFilter === 'direct_message' ? handleNewDM : undefined}
          currentUserId={session?.user?.id}
          canAccessInternalTickets={typeFilter === 'internal_ticket' || !typeFilter}
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

              {/* Mobile participants toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setParticipantsOpen(!participantsOpen)}
                className="lg:hidden mr-2"
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
              <p className="text-sm font-sans font-light text-[#C4C8D4]">
                Choose a channel or direct message from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Participants panel - Desktop: collapsible, Mobile: hidden */}
      {selectedConversation && participantsOpen && (
        <aside className="hidden lg:block w-64 border-l border-border bg-card/70 backdrop-blur-sm overflow-y-auto p-4">
          <ParticipantList
            participants={selectedConversation.participants || []}
            currentUserId={session?.user?.id}
            canManage={false}
          />
        </aside>
      )}

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
              }
            } catch (error) {
              console.error('[Messages] Failed to create channel:', error);
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
              }
            } catch (error) {
              console.error('[Messages] Failed to create DM:', error);
            }
          }}
        />
      )}
    </div>
  );
}
