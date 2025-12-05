/**
 * Ozean Licht Support Widget - Main Entry Point
 *
 * This file creates the global SDK API that websites embed via script tag.
 * It provides a public API for initializing and controlling the support chat widget.
 *
 * @module index
 * @exports window.OzeanLichtSupport - Main SDK API
 * @exports window.ozeanSupport - Legacy compatibility wrapper
 */

import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import type {
  WidgetConfig,
  WidgetAPI,
  WidgetUser,
  WidgetEventType,
  EventCallback,
  Message,
  Attachment,
} from './types';
import WidgetAPIClient from './api';

import OfflineQueue from './offline-queue';
import RealtimeClient from './realtime';
import type { Message as RealtimeMessage } from './realtime';
import { WidgetLauncher } from './components/WidgetLauncher';
import { WidgetFrame } from './components/WidgetFrame';
import { MessageList } from './components/MessageList';
import { MessageComposer } from './components/MessageComposer';

// ============================================================================
// Type Declarations
// ============================================================================

declare global {
  interface Window {
    OzeanLichtSupport: WidgetAPI;
    ozeanSupport?: any;
  }
}

// ============================================================================
// Internal State
// ============================================================================

/**
 * Internal widget state
 */
let config: WidgetConfig | null = null;
let mountedRoot: Root | null = null;
let container: HTMLDivElement | null = null;
let eventListeners: Map<WidgetEventType, Set<EventCallback>> = new Map();

// Widget UI state
let isOpen = false;
let isLoading = false;
let conversationId: string | null = null;
let messages: Message[] = [];
let unreadCount = 0;
let sessionId = '';

// Service instances
let apiClient: WidgetAPIClient | null = null;
let realtimeClient: RealtimeClient | null = null;
let offlineQueue: OfflineQueue | null = null;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a unique session ID for tracking anonymous users
 */
function generateSessionId(): string {
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
 * Validate widget configuration
 */
function validateConfig(cfg: WidgetConfig): void {
  if (!cfg.platformKey || typeof cfg.platformKey !== 'string') {
    throw new Error('Widget config requires a valid "platformKey" string');
  }

  if (!cfg.platform || !['ozean_licht', 'kids_ascension'].includes(cfg.platform)) {
    throw new Error('Widget config requires a valid "platform" ("ozean_licht" or "kids_ascension")');
  }
}

/**
 * Emit a widget event to all registered listeners
 */
function emitEvent(event: WidgetEventType, ...args: any[]): void {
  const listeners = eventListeners.get(event);
  if (listeners) {
    listeners.forEach((callback) => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`[Widget] Error in event listener for "${event}":`, error);
      }
    });
  }
}

/**
 * Convert API message format to widget message format
 */
function convertApiMessage(apiMessage: any): Message {
  // Map API content types to widget content types (filter out video/audio)
  let contentType: 'text' | 'image' | 'file' | 'system' = 'text';
  if (apiMessage.contentType === 'image' ||
      apiMessage.contentType === 'file' ||
      apiMessage.contentType === 'system') {
    contentType = apiMessage.contentType;
  } else if (apiMessage.contentType === 'video' || apiMessage.contentType === 'audio') {
    contentType = 'file'; // Treat audio/video as files
  }

  // Map API external status to widget message status (filter out 'read')
  let status: 'sending' | 'sent' | 'delivered' | 'failed' | undefined = undefined;
  if (apiMessage.externalStatus === 'sent' ||
      apiMessage.externalStatus === 'delivered' ||
      apiMessage.externalStatus === 'failed') {
    status = apiMessage.externalStatus;
  } else if (apiMessage.externalStatus === 'read') {
    status = 'delivered'; // Map 'read' to 'delivered'
  }

  return {
    id: apiMessage.id,
    conversationId: apiMessage.conversationId,
    senderType: apiMessage.senderType,
    senderName: apiMessage.senderName || null,
    content: apiMessage.content || '',
    contentType,
    attachments: apiMessage.attachments || [],
    createdAt: new Date(apiMessage.createdAt),
    status,
  };
}

/**
 * Convert realtime message format to widget message format
 */
function convertRealtimeMessage(realtimeMessage: RealtimeMessage): Message {
  // Map content types to widget content types (filter out video/audio)
  let contentType: 'text' | 'image' | 'file' | 'system' = 'text';
  if (realtimeMessage.contentType === 'image' ||
      realtimeMessage.contentType === 'file' ||
      realtimeMessage.contentType === 'system') {
    contentType = realtimeMessage.contentType;
  }

  // Map external status to widget message status (filter out 'read')
  let status: 'sending' | 'sent' | 'delivered' | 'failed' | undefined = undefined;
  if (realtimeMessage.externalStatus === 'sent' ||
      realtimeMessage.externalStatus === 'delivered' ||
      realtimeMessage.externalStatus === 'failed') {
    status = realtimeMessage.externalStatus;
  } else if (realtimeMessage.externalStatus === 'read') {
    status = 'delivered'; // Map 'read' to 'delivered'
  }

  return {
    id: realtimeMessage.id,
    conversationId: realtimeMessage.conversationId,
    senderType: realtimeMessage.senderType,
    senderName: realtimeMessage.senderName || null,
    content: realtimeMessage.content || '',
    contentType,
    attachments: realtimeMessage.attachments || [],
    createdAt: realtimeMessage.createdAt, // Already a Date object
    status,
  };
}

/**
 * Store session data in localStorage for persistence across page loads
 */
function storeSessionData(): void {
  if (!sessionId || !config) return;

  const sessionData = {
    sessionId,
    conversationId,
    platform: config.platform,
    lastActivity: Date.now(),
  };

  try {
    localStorage.setItem('ozean-widget-session', JSON.stringify(sessionData));
  } catch (error) {
    console.warn('[Widget] Failed to store session data:', error);
  }
}

/**
 * Load session data from localStorage
 */
function loadSessionData(): void {
  try {
    const stored = localStorage.getItem('ozean-widget-session');
    if (stored) {
      const data = JSON.parse(stored);

      // Use stored session ID if valid (less than 30 days old)
      const age = Date.now() - (data.lastActivity || 0);
      const MAX_SESSION_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

      if (age < MAX_SESSION_AGE && data.platform === config?.platform) {
        sessionId = data.sessionId || generateSessionId();
        conversationId = data.conversationId || null;
      } else {
        // Session expired, generate new
        sessionId = generateSessionId();
      }
    } else {
      sessionId = generateSessionId();
    }
  } catch (error) {
    console.warn('[Widget] Failed to load session data:', error);
    sessionId = generateSessionId();
  }
}

/**
 * Initialize API client and services
 */
async function initializeServices(): Promise<void> {
  if (!config) {
    throw new Error('Widget not initialized. Call init() first.');
  }

  // Create API client
  apiClient = new WidgetAPIClient({
    platformKey: config.platformKey,
    sessionId,
  });

  // Initialize offline queue
  offlineQueue = new OfflineQueue();
  await offlineQueue.init();

  // Set send message function for offline queue
  offlineQueue.setSendMessageFunction(async (convId, content, attachments) => {
    if (!apiClient) {
      return { success: false, error: 'API client not initialized' };
    }

    try {
      const message = await apiClient.sendMessage(convId, {
        content,
        attachments,
      });
      return { success: true, messageId: message.id };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  // Initialize realtime client
  realtimeClient = new RealtimeClient({
    appKey: config.platformKey, // Using platformKey as Pusher app key
    onMessage: (message) => {
      // Convert and add message to local state
      const convertedMessage = convertRealtimeMessage(message);
      messages = [...messages, convertedMessage];

      // Increment unread count if widget is closed
      if (!isOpen) {
        unreadCount++;
      }

      // Re-render widget
      render();

      // Emit event
      emitEvent('message_received', convertedMessage);
    },
    onTyping: (_data) => {
      emitEvent('typing_start', _data);
    },
    onPresence: (_data) => {
      // Handle presence updates if needed
    },
  });

  // Connect to realtime server
  realtimeClient.connect();

  console.log('[Widget] Services initialized');
}

/**
 * Create or get existing conversation
 */
async function ensureConversation(): Promise<string> {
  if (conversationId) {
    return conversationId;
  }

  if (!apiClient || !config) {
    throw new Error('Widget not initialized');
  }

  // Create new conversation
  const response = await apiClient.createConversation({
    platform: config.platform,
    contactEmail: config.user?.email,
    contactName: config.user?.name,
    customAttributes: config.customAttributes,
  });

  conversationId = response.conversationId;
  storeSessionData();

  // Subscribe to realtime updates for this conversation
  if (realtimeClient) {
    realtimeClient.subscribeToConversation(conversationId);
  }

  emitEvent('conversation_started', conversationId);

  return conversationId;
}

/**
 * Send a message in the current conversation
 */
async function sendMessageInternal(content: string, attachments: File[] = []): Promise<void> {
  if (!apiClient || !config) {
    throw new Error('Widget not initialized');
  }

  try {
    // Ensure we have a conversation
    const convId = await ensureConversation();

    // Upload attachments if any
    const uploadedAttachments: Attachment[] = [];
    for (const file of attachments) {
      try {
        const attachment = await apiClient.uploadAttachment(convId, file);
        uploadedAttachments.push(attachment);
      } catch (error) {
        console.error('[Widget] Failed to upload attachment:', file.name, error);
        // Continue with other attachments
      }
    }

    // Send message
    if (navigator.onLine) {
      // Send immediately if online
      const apiMessage = await apiClient.sendMessage(convId, {
        content,
        attachments: uploadedAttachments,
      });

      // Convert and add to local messages
      const message = convertApiMessage(apiMessage);
      messages = [...messages, message];
      render();

      emitEvent('message_sent', message);
    } else {
      // Queue for later if offline
      if (offlineQueue) {
        await offlineQueue.add(convId, content, uploadedAttachments);
      }
    }
  } catch (error) {
    console.error('[Widget] Failed to send message:', error);
    emitEvent('error', error);
    throw error;
  }
}

/**
 * Load messages for the current conversation
 */
async function loadMessages(): Promise<void> {
  if (!apiClient || !conversationId) return;

  isLoading = true;
  render();

  try {
    const response = await apiClient.getMessages(conversationId);
    messages = response.messages.map(convertApiMessage);
  } catch (error) {
    console.error('[Widget] Failed to load messages:', error);
    emitEvent('error', error);
  } finally {
    isLoading = false;
    render();
  }
}

/**
 * Render the widget React component
 */
function render(): void {
  if (!mountedRoot || !container || !config) return;

  const handleOpen = () => {
    isOpen = true;
    unreadCount = 0; // Reset unread count when opening
    render();
    emitEvent('open');

    // Load messages when opening
    if (conversationId) {
      loadMessages();
    }
  };

  const handleClose = () => {
    isOpen = false;
    render();
    emitEvent('close');
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const handleSendMessage = async (content: string, attachments: File[]) => {
    try {
      await sendMessageInternal(content, attachments);
    } catch (error) {
      console.error('[Widget] Error sending message:', error);
    }
  };

  // Create the widget UI
  const widgetElement = React.createElement(
    React.Fragment,
    null,
    // Launcher button
    React.createElement(WidgetLauncher, {
      isOpen,
      onClick: handleToggle,
      position: config.position || 'right',
      primaryColor: config.primaryColor || '#0ec2bc',
      unreadCount,
    }),
    // Widget frame (chat window)
    React.createElement(
      WidgetFrame,
      {
        isOpen,
        onClose: handleClose,
        position: config.position || 'right',
        primaryColor: config.primaryColor || '#0ec2bc',
        greeting: config.greeting || 'Hallo! Wie können wir Ihnen helfen?',
        title: config.platform === 'kids_ascension' ? 'Kids Ascension Support' : 'Ozean Licht Support',
      },
      messages.length > 0 || isLoading
        ? React.createElement(
            React.Fragment,
            null,
            // Message list
            React.createElement(MessageList, {
              messages,
              isLoading,
              primaryColor: config.primaryColor || '#0ec2bc',
            }),
            // Message composer
            React.createElement(MessageComposer, {
              onSend: handleSendMessage,
              disabled: isLoading,
              placeholder: config.language === 'en' ? 'Type a message...' : 'Nachricht schreiben...',
              primaryColor: config.primaryColor || '#0ec2bc',
            })
          )
        : null
    )
  );

  mountedRoot.render(widgetElement);
}

// ============================================================================
// Public SDK API Implementation
// ============================================================================

const SDK: WidgetAPI = {
  /**
   * Initialize the widget with configuration
   */
  init(cfg: WidgetConfig): void {
    try {
      // Validate configuration
      validateConfig(cfg);

      // Store configuration
      config = {
        position: 'right',
        primaryColor: '#0ec2bc',
        language: 'de',
        ...cfg,
      };

      // Load or generate session ID
      loadSessionData();

      // Create container div
      container = document.createElement('div');
      container.id = 'ozean-widget-container';
      container.style.cssText = `
        position: fixed;
        z-index: 2147483647;
        pointer-events: none;
      `;

      // All children should be able to receive pointer events
      container.addEventListener('click', (e) => e.stopPropagation());

      document.body.appendChild(container);

      // Create React root
      mountedRoot = createRoot(container);

      // Initialize services
      initializeServices()
        .then(() => {
          // Initial render
          render();
          emitEvent('ready');
        })
        .catch((error) => {
          console.error('[Widget] Failed to initialize services:', error);
          emitEvent('error', error);
        });

      console.log('[Widget] Initialized successfully');
    } catch (error) {
      console.error('[Widget] Initialization failed:', error);
      throw error;
    }
  },

  /**
   * Identify the current user
   */
  identify(user: WidgetUser): void {
    if (!config) {
      throw new Error('Widget not initialized. Call init() first.');
    }

    // Update config with user data
    config.user = user;

    // Update contact information with API if we have a conversation
    if (apiClient && conversationId) {
      apiClient
        .identify({
          email: user.email || '',
          name: user.name,
          hmac: user.hmac,
        })
        .catch((error) => {
          console.error('[Widget] Failed to identify user:', error);
          emitEvent('error', error);
        });
    }

    console.log('[Widget] User identified:', user.email || user.name);
  },

  /**
   * Open the widget
   */
  open(): void {
    if (!mountedRoot) {
      console.warn('[Widget] Cannot open: widget not initialized');
      return;
    }

    isOpen = true;
    unreadCount = 0;
    render();
    emitEvent('open');

    // Load messages if we have a conversation
    if (conversationId) {
      loadMessages();
    }
  },

  /**
   * Close the widget
   */
  close(): void {
    if (!mountedRoot) {
      console.warn('[Widget] Cannot close: widget not initialized');
      return;
    }

    isOpen = false;
    render();
    emitEvent('close');
  },

  /**
   * Toggle widget open/closed state
   */
  toggle(): void {
    if (isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  /**
   * Send a message programmatically
   */
  sendMessage(content: string): void {
    if (!config) {
      throw new Error('Widget not initialized. Call init() first.');
    }

    sendMessageInternal(content).catch((error) => {
      console.error('[Widget] Failed to send message:', error);
    });
  },

  /**
   * Register an event listener
   */
  on(event: WidgetEventType, callback: EventCallback): void {
    if (!eventListeners.has(event)) {
      eventListeners.set(event, new Set());
    }

    eventListeners.get(event)!.add(callback);
  },

  /**
   * Unregister an event listener
   */
  off(event: WidgetEventType, callback: EventCallback): void {
    const listeners = eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  },
};

// ============================================================================
// Process Queued Commands
// ============================================================================

/**
 * Process any commands that were queued before the script loaded
 */
function processQueuedCommands(): void {
  if (typeof window.ozeanSupport === 'function') {
    // ozeanSupport was a function that queued commands
    return;
  }

  if (Array.isArray(window.ozeanSupport)) {
    const queue = window.ozeanSupport;

    queue.forEach((item: any[]) => {
      if (Array.isArray(item) && item.length > 0) {
        const [command, ...args] = item;
        if (typeof command === 'string' && command in SDK) {
          try {
            (SDK as any)[command](...args);
          } catch (error) {
            console.error(`[Widget] Error processing queued command "${command}":`, error);
          }
        }
      }
    });
  }
}

// ============================================================================
// Global Exposure
// ============================================================================

// Expose main SDK API
window.OzeanLichtSupport = SDK;

// Backwards compatibility wrapper (allows inline script usage)
window.ozeanSupport = function (command: string, ...args: any[]) {
  if (typeof command === 'string' && command in SDK) {
    try {
      return (SDK as any)[command](...args);
    } catch (error) {
      console.error(`[Widget] Error executing command "${command}":`, error);
      throw error;
    }
  } else {
    console.error(`[Widget] Unknown command: "${command}"`);
  }
};

// Process any queued commands
processQueuedCommands();

// ============================================================================
// Module Exports (for potential module usage)
// ============================================================================

export default SDK;
export type {
  WidgetConfig,
  WidgetAPI,
  WidgetUser,
  WidgetEventType,
  EventCallback,
  Message,
  Attachment,
};
