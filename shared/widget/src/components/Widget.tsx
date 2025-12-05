/**
 * Widget Component
 *
 * Main orchestrating component for the embeddable support chat widget.
 * Manages state, lifecycle, API communication, real-time events, and offline queue.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WidgetLauncher } from './WidgetLauncher';
import { WidgetFrame } from './WidgetFrame';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import type {
  WidgetConfig,
  Message as TypeMessage,
  Attachment,
  Platform,
} from '../types';
import WidgetAPIClient from '../api';
import { RealtimeClient } from '../realtime';
import OfflineQueue from '../offline-queue';
import type { Message as APIMessage } from '../api';

// ============================================================================
// Component Props
// ============================================================================

export interface WidgetProps extends WidgetConfig {
  /** Widget title shown in header (optional override) */
  title?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a RFC4122 version 4 compliant UUID
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or create a session ID from localStorage
 */
function getOrCreateSessionId(): string {
  const storageKey = 'ozean_support_session';

  try {
    const existing = localStorage.getItem(storageKey);
    if (existing) {
      return existing;
    }

    const newSessionId = generateUUID();
    localStorage.setItem(storageKey, newSessionId);
    return newSessionId;
  } catch (error) {
    console.warn('Failed to access localStorage, using in-memory session ID:', error);
    return generateUUID();
  }
}

/**
 * Get stored conversation ID from localStorage
 */
function getStoredConversationId(platform: Platform): string | null {
  const storageKey = `ozean_support_conversation_${platform}`;

  try {
    return localStorage.getItem(storageKey);
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
    return null;
  }
}

/**
 * Store conversation ID in localStorage
 */
function storeConversationId(platform: Platform, conversationId: string): void {
  const storageKey = `ozean_support_conversation_${platform}`;

  try {
    localStorage.setItem(storageKey, conversationId);
  } catch (error) {
    console.warn('Failed to write to localStorage:', error);
  }
}

/**
 * Convert API message to widget message format
 */
function convertAPIMessage(apiMessage: APIMessage): TypeMessage {
  // Map external status to widget status (filter out unsupported values)
  let status: 'sending' | 'sent' | 'delivered' | 'failed' | undefined = undefined;
  if (apiMessage.externalStatus === 'sent' || apiMessage.externalStatus === 'delivered' || apiMessage.externalStatus === 'failed') {
    status = apiMessage.externalStatus;
  }

  return {
    id: apiMessage.id,
    conversationId: apiMessage.conversationId,
    senderType: apiMessage.senderType,
    senderName: apiMessage.senderName || null,
    content: apiMessage.content || '',
    contentType: apiMessage.contentType === 'video' || apiMessage.contentType === 'audio' ? 'file' : apiMessage.contentType,
    attachments: apiMessage.attachments,
    createdAt: new Date(apiMessage.createdAt),
    status,
  };
}

// ============================================================================
// Widget Component
// ============================================================================

/**
 * Main support chat widget component
 *
 * Features:
 * - Session management with localStorage persistence
 * - Conversation creation and message history loading
 * - Real-time message updates via Soketi/Pusher
 * - Offline message queuing with automatic retry
 * - File attachment support
 * - Typing indicators (debounced)
 * - Unread message counter
 *
 * @example
 * ```tsx
 * <Widget
 *   platformKey="pk_live_xxx"
 *   platform="ozean_licht"
 *   user={{ email: "user@example.com", name: "John Doe" }}
 *   position="right"
 *   primaryColor="#0ec2bc"
 *   greeting="How can we help you today?"
 * />
 * ```
 */
export const Widget: React.FC<WidgetProps> = ({
  platformKey,
  platform,
  user,
  customAttributes,
  position = 'right',
  primaryColor = '#0ec2bc',
  greeting = 'Hallo! Wie können wir Ihnen helfen?',
  language = 'de',
  title = 'Ozean Licht Support',
}) => {
  // ============================================================================
  // State Management
  // ============================================================================

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<TypeMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState<string>(() => getOrCreateSessionId());
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // ============================================================================
  // Refs for API and Realtime Clients
  // ============================================================================

  const apiClientRef = useRef<WidgetAPIClient | null>(null);
  const realtimeClientRef = useRef<RealtimeClient | null>(null);
  const offlineQueueRef = useRef<OfflineQueue | null>(null);

  // ============================================================================
  // Initialization Effect
  // ============================================================================

  useEffect(() => {
    // Initialize API client
    apiClientRef.current = new WidgetAPIClient({
      platformKey,
      sessionId,
    });

    // Get Soketi app key from runtime config or environment
    const soketiAppKey =
      (window as any).__OZEAN_WIDGET_CONFIG__?.soketiAppKey || 'ozean-licht-widget-key';

    // Initialize Realtime client
    realtimeClientRef.current = new RealtimeClient({
      appKey: soketiAppKey,
      onMessage: handleRealtimeMessage,
      onTyping: handleTypingIndicator,
      onPresence: handlePresenceUpdate,
    });

    // Connect to Soketi
    realtimeClientRef.current.connect();

    // Initialize offline queue
    offlineQueueRef.current = new OfflineQueue();
    offlineQueueRef.current.init().catch((error) => {
      console.error('Failed to initialize offline queue:', error);
    });

    // Set send message function for offline queue
    offlineQueueRef.current.setSendMessageFunction(async (convId, content, attachments) => {
      try {
        await apiClientRef.current!.sendMessage(convId, {
          content,
          attachments,
        });
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    // Check for existing conversation
    const storedConvId = getStoredConversationId(platform);
    if (storedConvId) {
      loadExistingConversation(storedConvId);
    }

    // Cleanup on unmount
    return () => {
      if (realtimeClientRef.current) {
        realtimeClientRef.current.disconnect();
      }
      if (offlineQueueRef.current) {
        offlineQueueRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================================
  // Conversation Management
  // ============================================================================

  /**
   * Load an existing conversation and its messages
   */
  const loadExistingConversation = async (convId: string) => {
    setIsLoading(true);

    try {
      const conversation = await apiClientRef.current!.getConversation(convId);

      // Set conversation ID
      setConversationId(convId);

      // Load messages if available
      if (conversation.messages && conversation.messages.length > 0) {
        const convertedMessages = conversation.messages.map(convertAPIMessage);
        setMessages(convertedMessages);
      } else {
        // Fetch messages separately if not included
        const messagesResponse = await apiClientRef.current!.getMessages(convId);
        const convertedMessages = messagesResponse.messages.map(convertAPIMessage);
        setMessages(convertedMessages);
      }

      // Subscribe to realtime updates
      if (realtimeClientRef.current) {
        realtimeClientRef.current.subscribeToConversation(convId);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
      // Clear invalid conversation ID
      setConversationId(null);
      storeConversationId(platform, '');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new conversation
   */
  const createConversation = async () => {
    setIsLoading(true);

    try {
      const response = await apiClientRef.current!.createConversation({
        platform,
        contactEmail: user?.email,
        contactName: user?.name,
        customAttributes,
      });

      const newConvId = response.conversationId;

      // Store conversation ID
      setConversationId(newConvId);
      storeConversationId(platform, newConvId);

      // Subscribe to realtime updates
      if (realtimeClientRef.current) {
        realtimeClientRef.current.subscribeToConversation(newConvId);
      }

      return newConvId;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // Message Handlers
  // ============================================================================

  /**
   * Handle sending a message
   */
  const handleSendMessage = async (content: string, attachmentFiles: File[]) => {
    // Ensure we have a conversation
    let convId = conversationId;
    if (!convId) {
      try {
        convId = await createConversation();
      } catch (error) {
        console.error('Failed to create conversation for message:', error);
        return;
      }
    }

    // Upload attachments if any
    let attachments: Attachment[] = [];
    if (attachmentFiles.length > 0) {
      try {
        const uploadPromises = attachmentFiles.map((file) =>
          apiClientRef.current!.uploadAttachment(convId!, file)
        );
        attachments = await Promise.all(uploadPromises);
      } catch (error) {
        console.error('Failed to upload attachments:', error);
        // Continue without attachments on error (or show error to user)
      }
    }

    // Try to send message
    try {
      if (navigator.onLine) {
        // Online: send immediately
        const sentMessage = await apiClientRef.current!.sendMessage(convId, {
          content,
          attachments,
        });

        // Add to local messages (realtime will also add it, but this is faster feedback)
        const convertedMessage = convertAPIMessage(sentMessage);
        setMessages((prev) => [...prev, convertedMessage]);
      } else {
        // Offline: queue for later
        await offlineQueueRef.current!.add(convId, content, attachments);

        // Add optimistic message to UI
        const optimisticMessage: TypeMessage = {
          id: `temp-${generateUUID()}`,
          conversationId: convId,
          senderType: 'contact',
          senderName: user?.name || null,
          content,
          contentType: 'text',
          attachments,
          createdAt: new Date(),
          status: 'sending',
        };
        setMessages((prev) => [...prev, optimisticMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);

      // Queue message for retry
      try {
        await offlineQueueRef.current!.add(convId, content, attachments);
      } catch (queueError) {
        console.error('Failed to queue message:', queueError);
      }
    }
  };

  /**
   * Handle typing indicator (debounced)
   */
  const handleTyping = useCallback(() => {
    // In a full implementation, this would send a typing event to the server
    // For now, it's a placeholder for future enhancement
    console.log('User is typing...');
  }, []);

  /**
   * Handle incoming realtime message
   */
  const handleRealtimeMessage = useCallback((message: any) => {
    console.log('Realtime message received:', message);

    // Convert API message to widget format
    const convertedMessage = convertAPIMessage(message);

    // Add to messages if not already present
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === convertedMessage.id);
      if (exists) return prev;
      return [...prev, convertedMessage];
    });

    // Increment unread count if widget is closed and message is from agent/bot
    setUnreadCount((prev) => {
      if (
        !isOpen &&
        (convertedMessage.senderType === 'agent' || convertedMessage.senderType === 'bot')
      ) {
        return prev + 1;
      }
      return prev;
    });
  }, [isOpen]);

  /**
   * Handle typing indicator from realtime
   */
  const handleTypingIndicator = useCallback((data: any) => {
    console.log('Typing indicator:', data.userName);
    // In a full implementation, show typing indicator in UI
  }, []);

  /**
   * Handle presence updates from realtime
   */
  const handlePresenceUpdate = useCallback((data: any) => {
    console.log('Presence update:', data.online);
    // In a full implementation, show online/offline status
  }, []);

  // ============================================================================
  // Widget Control Handlers
  // ============================================================================

  /**
   * Handle opening the widget
   */
  const handleOpen = async () => {
    setIsOpen(true);

    // Reset unread count when opening
    setUnreadCount(0);

    // Create conversation if none exists
    if (!conversationId) {
      try {
        await createConversation();
      } catch (error) {
        console.error('Failed to create conversation on open:', error);
      }
    } else {
      // Mark conversation as read
      try {
        await apiClientRef.current!.markAsRead(conversationId);
      } catch (error) {
        console.error('Failed to mark conversation as read:', error);
      }
    }
  };

  /**
   * Handle closing the widget
   */
  const handleClose = () => {
    setIsOpen(false);
  };

  /**
   * Handle toggling the widget
   */
  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <>
      {/* Widget Launcher Button */}
      <WidgetLauncher
        isOpen={isOpen}
        onClick={handleToggle}
        position={position}
        primaryColor={primaryColor}
        unreadCount={unreadCount}
      />

      {/* Widget Frame */}
      <WidgetFrame
        isOpen={isOpen}
        onClose={handleClose}
        position={position}
        primaryColor={primaryColor}
        greeting={greeting}
        title={title}
      >
        {/* Only render content if we have messages or a conversation */}
        {(messages.length > 0 || conversationId) && (
          <>
            {/* Message List */}
            <MessageList
              messages={messages}
              isLoading={isLoading}
              primaryColor={primaryColor}
              onLoadMore={async () => {
                // Load more messages (pagination)
                if (conversationId && messages.length > 0) {
                  try {
                    const oldestMessage = messages[0];
                    const response = await apiClientRef.current!.getMessages(
                      conversationId,
                      oldestMessage.id
                    );
                    const olderMessages = response.messages.map(convertAPIMessage);
                    setMessages((prev) => [...olderMessages, ...prev]);
                  } catch (error) {
                    console.error('Failed to load more messages:', error);
                  }
                }
              }}
            />

            {/* Message Composer */}
            <MessageComposer
              onSend={handleSendMessage}
              onTyping={handleTyping}
              disabled={isLoading}
              placeholder={language === 'de' ? 'Nachricht schreiben...' : 'Type a message...'}
              primaryColor={primaryColor}
            />
          </>
        )}
      </WidgetFrame>
    </>
  );
};

export default Widget;
