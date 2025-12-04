/**
 * ConversationList Component - Support Management System
 *
 * Displays a table/list view of support conversations with status badges,
 * channel icons, priority indicators, and contact information.
 */

'use client';

import React from 'react';
import { Conversation } from '@/types/support';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  /** Array of conversations to display */
  conversations: Conversation[];
  /** Selected conversation ID */
  selectedId?: string;
  /** Callback when a conversation is selected */
  onSelect: (conversation: Conversation) => void;
  /** Loading state */
  loading?: boolean;
}

/**
 * ConversationList displays support conversations in a table format
 *
 * Features:
 * - Status badges with color coding
 * - Channel icons
 * - Priority indicators
 * - Contact information
 * - Last activity timestamps
 * - Clickable rows
 *
 * @example
 * ```tsx
 * <ConversationList
 *   conversations={conversations}
 *   selectedId={selectedConversationId}
 *   onSelect={(conv) => setSelectedConversation(conv)}
 *   loading={isLoading}
 * />
 * ```
 */
export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  loading = false,
}: ConversationListProps) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  // Empty state
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg
          className="w-12 h-12 text-primary mb-4"
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
          No conversations found
        </h3>
        <p className="text-sm font-sans font-light text-[#C4C8D4]">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card/70 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-border">
            <TableHead className="font-sans font-medium text-[#C4C8D4]">
              Contact
            </TableHead>
            <TableHead className="font-sans font-medium text-[#C4C8D4]">
              Status
            </TableHead>
            <TableHead className="font-sans font-medium text-[#C4C8D4]">
              Channel
            </TableHead>
            <TableHead className="font-sans font-medium text-[#C4C8D4]">
              Priority
            </TableHead>
            <TableHead className="font-sans font-medium text-[#C4C8D4]">
              Team
            </TableHead>
            <TableHead className="font-sans font-medium text-[#C4C8D4]">
              Agent
            </TableHead>
            <TableHead className="font-sans font-medium text-[#C4C8D4] text-right">
              Last Activity
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={conversation.id === selectedId}
              onClick={() => onSelect(conversation)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
