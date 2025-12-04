/**
 * ConversationItem Component - Support Management System
 *
 * Single conversation row displaying contact info, status, channel, and metadata.
 */

'use client';

import React from 'react';
import { Conversation } from '@/types/support';
import {
  getConversationStatusColor,
  getPriorityColor,
  getChannelIcon,
  getRelativeTime,
} from '@/types/support';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import RoutingBadge from './RoutingBadge';

interface ConversationItemProps {
  /** Conversation data */
  conversation: Conversation;
  /** Whether this conversation is selected */
  isSelected: boolean;
  /** Click handler */
  onClick: () => void;
}

/**
 * ConversationItem renders a single conversation row in the table
 *
 * Features:
 * - Contact name and email
 * - Status badge with color coding
 * - Channel icon
 * - Priority indicator
 * - Team badge
 * - Assigned agent avatar
 * - Relative timestamp
 *
 * @example
 * ```tsx
 * <ConversationItem
 *   conversation={conversation}
 *   isSelected={selectedId === conversation.id}
 *   onClick={() => handleSelect(conversation)}
 * />
 * ```
 */
export default function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: ConversationItemProps) {
  // Get channel icon name
  const channelIconName = getChannelIcon(conversation.channel);

  // Map icon names to SVG paths
  const channelIcons: Record<string, React.ReactNode> = {
    'message-circle': (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    ),
    'message-square': (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      />
    ),
    mail: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
    send: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    ),
  };

  // Get status badge variant
  const getStatusVariant = (
    status: string
  ): 'success' | 'info' | 'warning' | 'default' => {
    const colorMap: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
      green: 'success',
      blue: 'info',
      yellow: 'warning',
      gray: 'default',
    };
    return colorMap[getConversationStatusColor(status as any)] || 'default';
  };

  // Get priority badge variant
  const getPriorityVariant = (
    priority: string
  ): 'default' | 'info' | 'warning' | 'destructive' => {
    const colorMap: Record<string, 'default' | 'info' | 'warning' | 'destructive'> = {
      gray: 'default',
      blue: 'info',
      orange: 'warning',
      red: 'destructive',
    };
    return colorMap[getPriorityColor(priority as any)] || 'default';
  };

  return (
    <TableRow
      onClick={onClick}
      className={`cursor-pointer transition-colors border-b border-border ${
        isSelected
          ? 'bg-primary/10 hover:bg-primary/15'
          : 'hover:bg-card/50'
      }`}
    >
      {/* Contact */}
      <TableCell>
        <div className="flex flex-col">
          <span className="font-sans font-medium text-white">
            {conversation.contactName || 'Unknown'}
          </span>
          <span className="text-sm font-sans font-light text-[#C4C8D4]">
            {conversation.contactEmail || 'No email'}
          </span>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant={getStatusVariant(conversation.status)}>
          {conversation.status}
        </Badge>
      </TableCell>

      {/* Channel */}
      <TableCell>
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {channelIcons[channelIconName]}
          </svg>
          <span className="text-sm font-sans font-light text-[#C4C8D4] capitalize">
            {conversation.channel.replace('_', ' ')}
          </span>
        </div>
      </TableCell>

      {/* Priority */}
      <TableCell>
        <Badge variant={getPriorityVariant(conversation.priority)}>
          {conversation.priority}
        </Badge>
      </TableCell>

      {/* Team */}
      <TableCell>
        <RoutingBadge team={conversation.team} />
      </TableCell>

      {/* Agent */}
      <TableCell>
        {conversation.assignedAgent ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-sans font-medium text-primary">
                {conversation.assignedAgent.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-sans font-light text-[#C4C8D4]">
              {conversation.assignedAgent.name}
            </span>
          </div>
        ) : (
          <span className="text-sm font-sans font-light text-[#C4C8D4] italic">
            Unassigned
          </span>
        )}
      </TableCell>

      {/* Last Activity */}
      <TableCell className="text-right">
        <span className="text-sm font-sans font-light text-[#C4C8D4]">
          {getRelativeTime(conversation.updatedAt)}
        </span>
      </TableCell>
    </TableRow>
  );
}
