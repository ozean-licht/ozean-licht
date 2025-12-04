/**
 * MessageThread Component - Support Management System
 *
 * Displays conversation messages in a threaded view with support for
 * different sender types and private notes.
 */

'use client';

import React from 'react';
import { Message } from '@/types/support';
import { getRelativeTime } from '@/types/support';
import { Skeleton } from '@/components/ui/skeleton';

interface MessageThreadProps {
  /** Array of messages to display */
  messages: Message[];
  /** Loading state */
  loading?: boolean;
}

/**
 * MessageThread displays conversation messages in chronological order
 *
 * Features:
 * - Contact messages (left-aligned)
 * - Agent messages (right-aligned)
 * - Private notes (highlighted with amber background)
 * - Relative timestamps
 * - Sender name display
 * - Auto-scroll to bottom
 *
 * @example
 * ```tsx
 * <MessageThread
 *   messages={conversation.messages}
 *   loading={isLoading}
 * />
 * ```
 */
export default function MessageThread({
  messages,
  loading = false,
}: MessageThreadProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={i % 2 === 0 ? 'flex justify-start' : 'flex justify-end'}>
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
        const isContactMessage = message.senderType === 'contact';
        const isPrivate = message.isPrivate;

        return (
          <div
            key={message.id}
            className={`flex ${isContactMessage ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[75%] ${
                isContactMessage ? 'items-start' : 'items-end'
              } flex flex-col`}
            >
              {/* Sender name */}
              <div
                className={`text-xs font-sans font-medium mb-1 ${
                  isContactMessage ? 'text-[#C4C8D4]' : 'text-primary'
                }`}
              >
                {message.senderName || (isContactMessage ? 'Contact' : 'Agent')}
                {isPrivate && (
                  <span className="ml-2 text-amber-400">(Private Note)</span>
                )}
              </div>

              {/* Message bubble */}
              <div
                className={`rounded-lg px-4 py-2.5 ${
                  isPrivate
                    ? 'bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm'
                    : isContactMessage
                    ? 'bg-card/70 border border-border backdrop-blur-sm'
                    : 'bg-primary/20 border border-primary/30 backdrop-blur-sm'
                }`}
              >
                <p
                  className={`text-sm font-sans font-light whitespace-pre-wrap ${
                    isPrivate ? 'text-amber-100' : 'text-white'
                  }`}
                >
                  {message.content}
                </p>
              </div>

              {/* Timestamp */}
              <div
                className={`text-xs font-sans font-light text-[#C4C8D4] mt-1 ${
                  isContactMessage ? 'text-left' : 'text-right'
                }`}
              >
                {getRelativeTime(message.createdAt)}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
