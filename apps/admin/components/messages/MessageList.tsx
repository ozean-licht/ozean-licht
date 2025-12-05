/**
 * MessageList Component - Team Chat & Messaging System
 *
 * Displays messages in a conversation with support for threads,
 * attachments, private notes, and different sender types
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { UnifiedMessage, ConversationType } from '@/types/team-chat';
import { Skeleton } from '@/components/ui/skeleton';

interface MessageListProps {
  /** Array of messages to display */
  messages: UnifiedMessage[];
  /** Conversation type for layout decisions */
  conversationType: ConversationType;
  /** Current user ID for message alignment */
  currentUserId?: string;
  /** Loading state */
  loading?: boolean;
  /** Callback when expanding a thread */
  onExpandThread?: (threadId: string) => void;
}

/**
 * MessageList displays conversation messages
 *
 * Features:
 * - Message bubbles (alignment based on sender and conversation type)
 * - Sender avatar, name, timestamp
 * - Private notes with yellow background
 * - Thread replies expandable
 * - Attachments (images inline, files as downloads)
 * - Loading skeleton
 * - Empty state
 * - Auto-scroll to bottom
 *
 * Layout rules:
 * - Channels: All messages left-aligned
 * - DMs: Current user right, others left
 * - Support/Tickets: Contact left, agent right
 *
 * @example
 * ```tsx
 * <MessageList
 *   messages={messages}
 *   conversationType="team_channel"
 *   currentUserId={userId}
 *   loading={false}
 *   onExpandThread={(id) => loadThread(id)}
 * />
 * ```
 */
export default function MessageList({
  messages,
  conversationType,
  currentUserId,
  loading = false,
  onExpandThread,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format timestamp to relative time
  const getRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now.getTime() - messageTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return messageTime.toLocaleDateString();
  };

  // Determine if message should be right-aligned
  const isRightAligned = (message: UnifiedMessage): boolean => {
    // Channels: all left-aligned
    if (conversationType === 'team_channel') return false;

    // DMs: current user right, others left
    if (conversationType === 'direct_message') {
      return message.senderId === currentUserId;
    }

    // Support/Internal tickets: agent right, contact left
    return message.senderType === 'agent';
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={i % 2 === 0 ? 'flex justify-start' : 'flex justify-end'}
          >
            <Skeleton className="h-20 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (messages.length === 0) {
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
          No messages yet
        </h3>
        <p className="text-sm font-sans font-light text-[#C4C8D4]">
          Start the conversation by sending a message
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 overflow-y-auto max-h-[600px]">
      {messages.map((message) => {
        const isRight = isRightAligned(message);
        const isPrivate = message.isPrivate;
        const hasAttachments = message.attachments?.length > 0;
        const hasThread = message.replyCount > 0;

        return (
          <div
            key={message.id}
            className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] ${
                isRight ? 'items-end' : 'items-start'
              } flex flex-col`}
            >
              {/* Sender info (name + avatar for left-aligned) */}
              {!isRight && (
                <div className="flex items-center gap-2 mb-1">
                  {/* Avatar */}
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-sans font-medium text-primary">
                      {message.senderName?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  {/* Name */}
                  <span className="text-xs font-sans font-medium text-[#C4C8D4]">
                    {message.senderName || 'Unknown'}
                    {isPrivate && (
                      <span className="ml-2 text-amber-400">(Private Note)</span>
                    )}
                  </span>
                </div>
              )}

              {/* Sender info for right-aligned */}
              {isRight && (
                <div className="text-xs font-sans font-medium text-primary mb-1">
                  {message.senderName || 'You'}
                  {isPrivate && (
                    <span className="ml-2 text-amber-400">(Private Note)</span>
                  )}
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`rounded-lg px-4 py-2.5 ${
                  isPrivate
                    ? 'bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm'
                    : isRight
                    ? 'bg-primary/20 border border-primary/30 backdrop-blur-sm'
                    : 'bg-card/70 border border-border backdrop-blur-sm'
                }`}
              >
                {/* Message content */}
                {message.content && (
                  <p
                    className={`text-sm font-sans font-light whitespace-pre-wrap ${
                      isPrivate ? 'text-amber-100' : 'text-white'
                    }`}
                  >
                    {message.content}
                  </p>
                )}

                {/* Attachments */}
                {hasAttachments && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment, idx) => {
                      const isImage = attachment.type.startsWith('image/');

                      if (isImage) {
                        return (
                          <div key={idx} className="rounded overflow-hidden">
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="max-w-full h-auto"
                            />
                          </div>
                        );
                      }

                      return (
                        <a
                          key={idx}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 rounded bg-background/50 hover:bg-background/70 transition-colors"
                        >
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
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-sans font-medium text-white truncate">
                              {attachment.name}
                            </p>
                            <p className="text-xs font-sans font-light text-[#C4C8D4]">
                              {(attachment.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
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
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                )}

                {/* Thread indicator */}
                {hasThread && onExpandThread && (
                  <button
                    onClick={() => onExpandThread(message.id)}
                    className="mt-2 text-xs font-sans font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
                  </button>
                )}
              </div>

              {/* Timestamp */}
              <div
                className={`text-xs font-sans font-light text-[#C4C8D4] mt-1 ${
                  isRight ? 'text-right' : 'text-left'
                }`}
              >
                {getRelativeTime(message.createdAt)}
                {message.editedAt && (
                  <span className="ml-1 italic">(edited)</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
