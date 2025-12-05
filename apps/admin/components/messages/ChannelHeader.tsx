/**
 * ChannelHeader Component - Team Chat & Messaging System
 *
 * Header bar for conversation view showing title, description, and actions
 */

'use client';

import React, { useState } from 'react';
import {
  UnifiedConversation,
  TeamChannel,
  DirectMessage,
  InternalTicket,
} from '@/types/team-chat';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ChannelHeaderProps {
  /** Conversation data */
  conversation: UnifiedConversation | TeamChannel | DirectMessage | InternalTicket;
  /** Callback when starring/pinning */
  onStar?: () => void;
  /** Whether conversation is starred */
  isStarred?: boolean;
  /** Callback when archiving */
  onArchive?: () => void;
  /** Callback when leaving */
  onLeave?: () => void;
}

/**
 * ChannelHeader displays conversation title and actions
 *
 * Features:
 * - Channel name/title or DM participant names
 * - Description (for channels)
 * - Member count badge
 * - Star/pin button
 * - Settings dropdown (Archive, Leave, etc.)
 * - Internal ticket number and status
 *
 * @example
 * ```tsx
 * <ChannelHeader
 *   conversation={channel}
 *   isStarred={false}
 *   onStar={() => toggleStar()}
 *   onArchive={() => archiveChannel()}
 *   onLeave={() => leaveChannel()}
 * />
 * ```
 */
export default function ChannelHeader({
  conversation,
  onStar,
  isStarred = false,
  onArchive,
  onLeave,
}: ChannelHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const getTitle = () => {
    if (conversation.type === 'team_channel') {
      return conversation.title || 'Unnamed Channel';
    }
    if (conversation.type === 'direct_message') {
      // For DMs, show participant names
      const participantNames =
        conversation.participants
          ?.filter((p) => p.user)
          .map((p) => p.user?.name)
          .join(', ') || 'Direct Message';
      return participantNames;
    }
    if (conversation.type === 'internal_ticket') {
      return conversation.title || `Ticket #${conversation.ticketNumber}`;
    }
    return 'Conversation';
  };

  const getDescription = () => {
    if (conversation.type === 'team_channel') {
      return conversation.description;
    }
    return undefined;
  };

  const getMemberCount = () => {
    return conversation.participants?.length || 0;
  };

  const getStatusBadge = () => {
    if (conversation.type === 'internal_ticket') {
      const statusVariant =
        conversation.status === 'resolved'
          ? 'success'
          : conversation.status === 'pending'
          ? 'warning'
          : 'info';

      return (
        <Badge variant={statusVariant} className="ml-3">
          {conversation.status}
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card/70 backdrop-blur-sm">
      {/* Left: Title and description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {/* Channel icon or DM icon */}
          {conversation.type === 'team_channel' && (
            <svg
              className="w-5 h-5 text-primary flex-shrink-0"
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
          )}
          {conversation.type === 'direct_message' && (
            <svg
              className="w-5 h-5 text-primary flex-shrink-0"
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
          )}
          {conversation.type === 'internal_ticket' && (
            <svg
              className="w-5 h-5 text-primary flex-shrink-0"
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
          )}

          {/* Title */}
          <h2 className="text-lg font-sans font-medium text-white truncate">
            {getTitle()}
          </h2>

          {/* Status badge for internal tickets */}
          {getStatusBadge()}

          {/* Private badge */}
          {conversation.type === 'team_channel' && conversation.isPrivate && (
            <Badge variant="outline" className="ml-2">
              Private
            </Badge>
          )}
        </div>

        {/* Description or member count */}
        <div className="flex items-center gap-3 text-sm font-sans font-light text-[#C4C8D4]">
          {getDescription() ? (
            <p className="truncate">{getDescription()}</p>
          ) : (
            <span>{getMemberCount()} members</span>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Star/Pin button */}
        {onStar && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onStar}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <svg
              className={`w-4 h-4 ${
                isStarred ? 'text-amber-400 fill-amber-400' : 'text-[#C4C8D4]'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </Button>
        )}

        {/* Settings dropdown */}
        <div className="relative">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowDropdown(!showDropdown)}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <svg
              className="w-4 h-4 text-[#C4C8D4]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </Button>

          {/* Dropdown menu */}
          {showDropdown && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card/95 backdrop-blur-sm shadow-lg z-20">
                <div className="py-1">
                  {onArchive && (
                    <button
                      onClick={() => {
                        onArchive();
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm font-sans font-light text-[#C4C8D4] hover:bg-primary/10 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                          />
                        </svg>
                        Archive
                      </div>
                    </button>
                  )}
                  {onLeave && (
                    <button
                      onClick={() => {
                        onLeave();
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm font-sans font-light text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Leave
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
