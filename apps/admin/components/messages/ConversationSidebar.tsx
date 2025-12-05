/**
 * ConversationSidebar Component - Team Chat & Messaging System
 *
 * Left sidebar showing all conversations grouped by type
 */

'use client';

import React, { useState } from 'react';
import {
  UnifiedConversation,
  TeamChannel,
  DirectMessage,
  InternalTicket,
} from '@/types/team-chat';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UnreadBadge from './UnreadBadge';

interface ConversationSidebarProps {
  /** List of all conversations */
  conversations: UnifiedConversation[];
  /** Selected conversation ID */
  selectedId?: string;
  /** Callback when a conversation is selected */
  onSelect: (conversation: UnifiedConversation) => void;
  /** Callback to create a new channel */
  onNewChannel?: () => void;
  /** Callback to create a new DM */
  onNewDM?: () => void;
  /** Callback to create a new internal ticket */
  onNewTicket?: () => void;
  /** Current user ID for filtering */
  currentUserId?: string;
  /** Whether user can access internal tickets */
  canAccessInternalTickets?: boolean;
  /** Whether user can access support tickets */
  canAccessSupportTickets?: boolean;
}

/**
 * ConversationSidebar displays conversations grouped by type
 *
 * Features:
 * - Search input at top
 * - Support Tickets section with customer tickets (if user has access)
 * - Team Channels section with channel list
 * - Direct Messages section with DM list
 * - Internal Tickets section (if user has access)
 * - Each item shows: title/name, unread badge, last message preview, timestamp
 * - Active item highlighted with primary color
 * - "New Channel", "New DM", and "New Ticket" buttons
 *
 * @example
 * ```tsx
 * <ConversationSidebar
 *   conversations={conversations}
 *   selectedId={selectedConversationId}
 *   onSelect={(conv) => setSelectedConversation(conv)}
 *   onNewChannel={() => openNewChannelModal()}
 *   onNewDM={() => openNewDMModal()}
 *   currentUserId={userId}
 *   canAccessInternalTickets={true}
 * />
 * ```
 */
export default function ConversationSidebar({
  conversations,
  selectedId,
  onSelect,
  onNewChannel,
  onNewDM,
  onNewTicket,
  currentUserId,
  canAccessInternalTickets = false,
  canAccessSupportTickets = false,
}: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations by search query
  const filteredConversations = conversations.filter((conv) => {
    const query = searchQuery.toLowerCase();
    const title = (conv.title || '').toLowerCase();
    const participantNames =
      conv.participants
        ?.map((p) => p.user?.name?.toLowerCase() || '')
        .join(' ') || '';
    // Also search by contact info for support tickets
    const contactInfo = [
      conv.contactName || '',
      conv.contactEmail || '',
    ].join(' ').toLowerCase();
    // Search by ticket number for internal tickets
    const ticketNumber = (conv.ticketNumber || '').toLowerCase();

    return title.includes(query) ||
           participantNames.includes(query) ||
           contactInfo.includes(query) ||
           ticketNumber.includes(query);
  });

  // Group conversations by type
  const supportTickets = filteredConversations.filter(
    (c) => c.type === 'support'
  );
  const channels = filteredConversations.filter(
    (c) => c.type === 'team_channel'
  ) as TeamChannel[];
  const directMessages = filteredConversations.filter(
    (c) => c.type === 'direct_message'
  ) as DirectMessage[];
  const internalTickets = filteredConversations.filter(
    (c) => c.type === 'internal_ticket'
  ) as InternalTicket[];

  // Format timestamp
  const getRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return time.toLocaleDateString();
  };

  // Render conversation item
  const renderConversationItem = (conv: UnifiedConversation) => {
    const isSelected = conv.id === selectedId;
    const unreadCount = conv.unreadCount || 0;
    const lastMessage = conv.lastMessage;

    // Get title based on conversation type
    let title = '';
    let icon: React.ReactNode = null;
    let statusBadge: React.ReactNode = null;

    if (conv.type === 'support') {
      title = conv.contactName || conv.contactEmail || 'Support Ticket';
      // Headset icon for support
      icon = (
        <svg
          className="w-4 h-4 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      );
      // Show status badge for support tickets
      const statusColors: Record<string, string> = {
        open: 'bg-green-500/20 text-green-400',
        pending: 'bg-yellow-500/20 text-yellow-400',
        resolved: 'bg-gray-500/20 text-gray-400',
        snoozed: 'bg-blue-500/20 text-blue-400',
      };
      statusBadge = (
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusColors[conv.status] || statusColors.open}`}>
          {conv.status}
        </span>
      );
    } else if (conv.type === 'team_channel') {
      title = conv.title || 'Unnamed Channel';
      icon = (
        <svg
          className="w-4 h-4 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
          />
        </svg>
      );
    } else if (conv.type === 'direct_message') {
      const participantNames =
        conv.participants
          ?.filter((p) => p.user?.id !== currentUserId)
          .map((p) => p.user?.name)
          .join(', ') || 'Direct Message';
      title = participantNames;
      icon = (
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-xs font-sans font-medium text-primary">
            {participantNames.charAt(0)?.toUpperCase() || '?'}
          </span>
        </div>
      );
    } else if (conv.type === 'internal_ticket') {
      title = conv.title || `Ticket #${conv.ticketNumber}`;
      icon = (
        <svg
          className="w-4 h-4 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    }

    return (
      <button
        key={conv.id}
        onClick={() => onSelect(conv)}
        className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${
          isSelected
            ? 'bg-primary/10 border border-primary/30'
            : 'hover:bg-card/50 border border-transparent'
        }`}
      >
        <div className="flex items-start gap-2">
          {/* Icon/Avatar */}
          <div className="flex-shrink-0 mt-0.5">{icon}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title and badges */}
            <div className="flex items-center gap-2 mb-1">
              <h4
                className={`text-sm font-sans font-medium truncate ${
                  isSelected ? 'text-white' : 'text-white'
                }`}
              >
                {title}
              </h4>
              {statusBadge}
              {unreadCount > 0 && <UnreadBadge count={unreadCount} />}
            </div>

            {/* Last message preview */}
            {lastMessage && (
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-sans font-light text-muted-foreground truncate">
                  {lastMessage.content || 'Attachment'}
                </p>
                <span className="text-xs font-sans font-light text-muted-foreground flex-shrink-0">
                  {getRelativeTime(lastMessage.createdAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="w-80 h-full border-r border-border bg-card/70 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-sans font-medium text-white mb-3">
          Messages
        </h2>

        {/* Search */}
        <Input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background/50 border-border text-white placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Conversation lists */}
      <div className="flex-1 overflow-y-auto">
        {/* Support Tickets */}
        {canAccessSupportTickets && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide">
                Support Tickets
              </h3>
            </div>
            <div className="space-y-1">
              {supportTickets.map((conv) => renderConversationItem(conv))}
              {supportTickets.length === 0 && (
                <p className="text-xs font-sans font-light text-muted-foreground italic px-3 py-2">
                  No support tickets
                </p>
              )}
            </div>
          </div>
        )}

        {/* Team Channels */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide">
              Team Channels
            </h3>
            {onNewChannel && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onNewChannel}
                className="h-6 px-2 text-primary hover:text-primary hover:bg-primary/10"
                aria-label="Create new channel"
              >
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </Button>
            )}
          </div>
          <div className="space-y-1">
            {channels.map((conv) => renderConversationItem(conv))}
            {channels.length === 0 && (
              <p className="text-xs font-sans font-light text-muted-foreground italic px-3 py-2">
                No channels
              </p>
            )}
          </div>
        </div>

        {/* Direct Messages */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide">
              Direct Messages
            </h3>
            {onNewDM && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onNewDM}
                className="h-6 px-2 text-primary hover:text-primary hover:bg-primary/10"
                aria-label="Create new direct message"
              >
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </Button>
            )}
          </div>
          <div className="space-y-1">
            {directMessages.map((conv) => renderConversationItem(conv))}
            {directMessages.length === 0 && (
              <p className="text-xs font-sans font-light text-muted-foreground italic px-3 py-2">
                No direct messages
              </p>
            )}
          </div>
        </div>

        {/* Internal Tickets */}
        {canAccessInternalTickets && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide">
                Internal Tickets
              </h3>
              {onNewTicket && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onNewTicket}
                  className="h-6 px-2 text-primary hover:text-primary hover:bg-primary/10"
                  aria-label="Create new internal ticket"
                >
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </Button>
              )}
            </div>
            <div className="space-y-1">
              {internalTickets.map((conv) => renderConversationItem(conv))}
              {internalTickets.length === 0 && (
                <p className="text-xs font-sans font-light text-muted-foreground italic px-3 py-2">
                  No internal tickets
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
