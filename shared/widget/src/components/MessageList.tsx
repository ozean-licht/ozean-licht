/**
 * MessageList Component
 *
 * Displays chat messages in the support widget.
 * Handles message rendering, auto-scrolling, loading states, and pagination.
 */

import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';

// ============================================================================
// Component Props
// ============================================================================

export interface MessageListProps {
  /** Array of messages to display */
  messages: Message[];
  /** Whether messages are currently loading */
  isLoading: boolean;
  /** Callback to load older messages (pagination) */
  onLoadMore?: () => void;
  /** Primary brand color for contact message bubbles */
  primaryColor?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format timestamp to readable time string
 */
function formatTimestamp(date: Date): string {
  const now = new Date();
  const messageDate = new Date(date);
  const isToday =
    now.getDate() === messageDate.getDate() &&
    now.getMonth() === messageDate.getMonth() &&
    now.getFullYear() === messageDate.getFullYear();

  if (isToday) {
    // Show only time for today's messages
    return messageDate.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    // Show date and time for older messages
    return messageDate.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

/**
 * Determine if file is an image based on MIME type
 */
function isImageAttachment(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Get file icon emoji based on MIME type
 */
function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
  if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
  return '📎';
}

// ============================================================================
// Skeleton Loader Component
// ============================================================================

const SkeletonMessage: React.FC<{ align: 'left' | 'right' }> = ({ align }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
    marginBottom: '8px',
  };

  const skeletonStyle: React.CSSProperties = {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '16px',
    backgroundColor: '#e5e7eb',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };

  const lineStyle: React.CSSProperties = {
    height: '14px',
    backgroundColor: '#d1d5db',
    borderRadius: '4px',
    marginBottom: '8px',
  };

  return (
    <div style={containerStyle}>
      <div style={skeletonStyle}>
        <div style={{ ...lineStyle, width: '180px' }}></div>
        <div style={{ ...lineStyle, width: '120px', marginBottom: '0' }}></div>
      </div>
    </div>
  );
};

// ============================================================================
// Main MessageList Component
// ============================================================================

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  onLoadMore,
  primaryColor = '#0ec2bc',
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // ============================================================================
  // Styles
  // ============================================================================

  const containerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const loadMoreButtonStyle: React.CSSProperties = {
    alignSelf: 'center',
    padding: '8px 16px',
    marginBottom: '16px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    fontSize: '13px',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const loadMoreButtonHoverStyle: React.CSSProperties = {
    backgroundColor: '#e5e7eb',
  };

  // ============================================================================
  // Render Functions
  // ============================================================================

  const renderAttachment = (attachment: any, index: number) => {
    const isImage = isImageAttachment(attachment.mimeType);

    if (isImage) {
      const imageStyle: React.CSSProperties = {
        maxWidth: '200px',
        borderRadius: '8px',
        marginTop: '8px',
        cursor: 'pointer',
      };

      return (
        <img
          key={attachment.id || index}
          src={attachment.thumbnailUrl || attachment.url}
          alt={attachment.name}
          style={imageStyle}
          onClick={() => window.open(attachment.url, '_blank')}
        />
      );
    } else {
      const fileLinkStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '8px',
        padding: '8px 12px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        textDecoration: 'none',
        color: 'inherit',
        fontSize: '13px',
      };

      const fileNameStyle: React.CSSProperties = {
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      };

      const fileSizeStyle: React.CSSProperties = {
        fontSize: '11px',
        opacity: 0.7,
      };

      return (
        <a
          key={attachment.id || index}
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          style={fileLinkStyle}
        >
          <span>{getFileIcon(attachment.mimeType)}</span>
          <span style={fileNameStyle}>{attachment.name}</span>
          <span style={fileSizeStyle}>
            {(attachment.size / 1024).toFixed(1)} KB
          </span>
        </a>
      );
    }
  };

  const renderMessage = (message: Message) => {
    const isContact = message.senderType === 'contact';
    const isSystem = message.senderType === 'system';

    // System messages (centered, italic, gray)
    if (isSystem) {
      const systemMessageStyle: React.CSSProperties = {
        textAlign: 'center',
        fontSize: '13px',
        color: '#9ca3af',
        fontStyle: 'italic',
        padding: '8px 0',
      };

      return (
        <div key={message.id} style={systemMessageStyle}>
          {message.content}
        </div>
      );
    }

    // Regular messages (agent/bot or contact)
    const messageContainerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: isContact ? 'flex-end' : 'flex-start',
      gap: '4px',
    };

    const senderNameStyle: React.CSSProperties = {
      fontSize: '12px',
      color: '#6b7280',
      paddingLeft: isContact ? '0' : '16px',
      paddingRight: isContact ? '16px' : '0',
    };

    const bubbleStyle: React.CSSProperties = {
      maxWidth: '80%',
      padding: '12px 16px',
      borderRadius: '16px',
      backgroundColor: isContact ? primaryColor : '#f3f4f6',
      color: isContact ? '#ffffff' : '#1f2937',
      wordWrap: 'break-word',
      // Flatten corner on sender side
      ...(isContact
        ? { borderBottomRightRadius: '4px' }
        : { borderBottomLeftRadius: '4px' }),
    };

    const contentStyle: React.CSSProperties = {
      fontSize: '14px',
      lineHeight: '1.5',
      margin: 0,
      whiteSpace: 'pre-wrap',
    };

    const timestampStyle: React.CSSProperties = {
      fontSize: '11px',
      color: '#9ca3af',
      paddingLeft: isContact ? '0' : '16px',
      paddingRight: isContact ? '16px' : '0',
      textAlign: isContact ? 'right' : 'left',
    };

    return (
      <div key={message.id} style={messageContainerStyle}>
        {/* Show sender name for agent/bot messages */}
        {!isContact && message.senderName && (
          <div style={senderNameStyle}>{message.senderName}</div>
        )}

        {/* Message bubble */}
        <div style={bubbleStyle}>
          {message.content && (
            <p style={contentStyle}>{message.content}</p>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div>
              {message.attachments.map((attachment, index) =>
                renderAttachment(attachment, index)
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div style={timestampStyle}>
          {formatTimestamp(message.createdAt)}
        </div>
      </div>
    );
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div ref={containerRef} style={containerStyle}>
      {/* Load more button */}
      {onLoadMore && messages.length > 0 && (
        <button
          style={loadMoreButtonStyle}
          onClick={onLoadMore}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, loadMoreButtonHoverStyle);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
        >
          Load earlier messages
        </button>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <>
          <SkeletonMessage align="left" />
          <SkeletonMessage align="right" />
          <SkeletonMessage align="left" />
        </>
      )}

      {/* Message list */}
      {!isLoading && messages.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '14px',
            padding: '32px 16px',
          }}
        >
          No messages yet. Start a conversation!
        </div>
      )}

      {!isLoading && messages.map(renderMessage)}

      {/* Auto-scroll anchor */}
      <div ref={messagesEndRef} />

      {/* Pulse animation for skeleton */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>
    </div>
  );
};
