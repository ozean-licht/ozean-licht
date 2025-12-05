/**
 * Realtime Client for Ozean Licht Widget
 *
 * Provides real-time communication capabilities using Pusher/Soketi for the
 * embeddable support chat widget. Handles message delivery, typing indicators,
 * and presence notifications.
 *
 * @module realtime
 */

import Pusher, { Channel } from 'pusher-js';

/**
 * Message sender types
 */
export type MessageSenderType = 'agent' | 'contact' | 'bot' | 'system';

/**
 * Message content types
 */
export type MessageContentType = 'text' | 'image' | 'file' | 'system';

/**
 * Attachment types
 */
export type AttachmentType = 'image' | 'file' | 'video' | 'audio';

/**
 * Attachment metadata
 */
export interface Attachment {
  id: string;
  type: AttachmentType;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
}

/**
 * Message structure
 */
export interface Message {
  id: string;
  conversationId: string;
  senderType: MessageSenderType;
  senderId: string | null;
  senderName: string | null;
  content: string | null;
  contentType: MessageContentType;
  threadId: string | null;
  replyCount: number;
  isPrivate: boolean;
  mentions: string[];
  attachments: Attachment[];
  externalId: string | null;
  externalStatus: 'sent' | 'delivered' | 'read' | 'failed' | null;
  editedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
}

/**
 * Typing event data
 */
export interface TypingData {
  userId: string;
  userName: string;
}

/**
 * Presence event data
 */
export interface PresenceData {
  online: boolean;
}

/**
 * Agent joined event data
 */
export interface AgentJoinedData {
  agentId: string;
  agentName: string;
  joinedAt: string;
}

/**
 * RealtimeClient constructor options
 */
export interface RealtimeClientOptions {
  /** Pusher application key */
  appKey: string;
  /** Pusher cluster (default: 'mt1') */
  cluster?: string;
  /** Callback for new messages */
  onMessage: (message: Message) => void;
  /** Callback for typing indicators */
  onTyping: (data: TypingData) => void;
  /** Callback for presence updates */
  onPresence: (data: PresenceData) => void;
}

/**
 * RealtimeClient
 *
 * Manages WebSocket connections to Soketi for real-time updates in the widget.
 * Handles subscription to conversation channels and event binding.
 *
 * @example
 * ```typescript
 * const client = new RealtimeClient({
 *   appKey: 'your-app-key',
 *   onMessage: (msg) => console.log('New message:', msg),
 *   onTyping: (data) => console.log('User typing:', data.userName),
 *   onPresence: (data) => console.log('Online:', data.online)
 * });
 *
 * client.connect();
 * client.subscribeToConversation('conv-123');
 * ```
 */
export class RealtimeClient {
  private pusher: Pusher | null = null;
  private channels: Map<string, Channel> = new Map();
  private options: RealtimeClientOptions;

  /**
   * Creates a new RealtimeClient instance
   *
   * @param options - Configuration options
   */
  constructor(options: RealtimeClientOptions) {
    this.options = {
      cluster: 'mt1',
      ...options,
    };
  }

  /**
   * Establishes connection to Soketi server
   *
   * Configures Pusher client with custom Soketi endpoint and security settings.
   * Uses TLS-enabled WebSocket connection to realtime.ozean-licht.dev.
   */
  connect(): void {
    if (this.pusher) {
      console.warn('[RealtimeClient] Already connected');
      return;
    }

    try {
      this.pusher = new Pusher(this.options.appKey, {
        wsHost: 'realtime.ozean-licht.dev',
        wsPort: 443,
        wssPort: 443,
        forceTLS: true,
        enabledTransports: ['ws', 'wss'],
        disableStats: true,
        cluster: this.options.cluster || 'mt1',
      });

      // Connection state logging
      this.pusher.connection.bind('connected', () => {
        console.log('[RealtimeClient] Connected to Soketi');
      });

      this.pusher.connection.bind('disconnected', () => {
        console.log('[RealtimeClient] Disconnected from Soketi');
      });

      this.pusher.connection.bind('error', (err: Error) => {
        console.error('[RealtimeClient] Connection error:', err);
      });

      console.log('[RealtimeClient] Connecting to Soketi...');
    } catch (error) {
      console.error('[RealtimeClient] Failed to create Pusher instance:', error);
      throw error;
    }
  }

  /**
   * Subscribes to a conversation channel
   *
   * Widget conversations use public channels that don't require authentication.
   * This is appropriate since conversations are already scoped to sessionId/contact
   * and message content is validated server-side.
   *
   * @param conversationId - The conversation ID to subscribe to
   */
  subscribeToConversation(conversationId: string): void {
    if (!this.pusher) {
      throw new Error('[RealtimeClient] Not connected. Call connect() first.');
    }

    const channelName = `widget-conversation-${conversationId}`;

    // Check if already subscribed
    if (this.channels.has(channelName)) {
      console.warn(`[RealtimeClient] Already subscribed to ${channelName}`);
      return;
    }

    try {
      const channel = this.pusher.subscribe(channelName);

      // Bind to new-message event
      channel.bind('new-message', (data: Message) => {
        console.log('[RealtimeClient] New message received:', data.id);
        this.options.onMessage(data);
      });

      // Bind to typing event
      channel.bind('typing', (data: TypingData) => {
        console.log('[RealtimeClient] Typing indicator:', data.userName);
        this.options.onTyping(data);
      });

      // Bind to agent-joined event
      channel.bind('agent-joined', (data: AgentJoinedData) => {
        console.log('[RealtimeClient] Agent joined:', data.agentName);
        // Additional handling can be added if needed
      });

      // Channel subscription success
      channel.bind('pusher:subscription_succeeded', () => {
        console.log(`[RealtimeClient] Successfully subscribed to ${channelName}`);
      });

      // Channel subscription error
      channel.bind('pusher:subscription_error', (status: number) => {
        console.error(`[RealtimeClient] Subscription error for ${channelName}:`, status);
      });

      this.channels.set(channelName, channel);
    } catch (error) {
      console.error(`[RealtimeClient] Failed to subscribe to ${channelName}:`, error);
      throw error;
    }
  }

  /**
   * Unsubscribes from a conversation channel
   *
   * Removes all event bindings and unsubscribes from the channel.
   *
   * @param conversationId - The conversation ID to unsubscribe from
   */
  unsubscribeFromConversation(conversationId: string): void {
    const channelName = `widget-conversation-${conversationId}`;
    const channel = this.channels.get(channelName);

    if (!channel) {
      console.warn(`[RealtimeClient] Not subscribed to ${channelName}`);
      return;
    }

    try {
      // Unbind all events
      channel.unbind_all();

      // Unsubscribe from channel
      if (this.pusher) {
        this.pusher.unsubscribe(channelName);
      }

      // Remove from tracking
      this.channels.delete(channelName);

      console.log(`[RealtimeClient] Unsubscribed from ${channelName}`);
    } catch (error) {
      console.error(`[RealtimeClient] Failed to unsubscribe from ${channelName}:`, error);
      throw error;
    }
  }

  /**
   * Disconnects from Soketi server
   *
   * Unsubscribes from all channels and closes the WebSocket connection.
   */
  disconnect(): void {
    if (!this.pusher) {
      console.warn('[RealtimeClient] Not connected');
      return;
    }

    try {
      // Unsubscribe from all channels
      for (const [channelName] of this.channels) {
        const conversationId = channelName.replace('widget-conversation-', '');
        this.unsubscribeFromConversation(conversationId);
      }

      // Disconnect Pusher
      this.pusher.disconnect();
      this.pusher = null;

      console.log('[RealtimeClient] Disconnected');
    } catch (error) {
      console.error('[RealtimeClient] Error during disconnect:', error);
      throw error;
    }
  }

  /**
   * Returns current connection state
   *
   * @returns True if connected to Soketi, false otherwise
   */
  get isConnected(): boolean {
    return this.pusher?.connection.state === 'connected';
  }

  /**
   * Returns the current Pusher connection state string
   *
   * Possible states: 'initialized', 'connecting', 'connected',
   * 'unavailable', 'failed', 'disconnected'
   *
   * @returns Current connection state
   */
  get connectionState(): string {
    return this.pusher?.connection.state || 'disconnected';
  }

  /**
   * Returns list of currently subscribed channel names
   *
   * @returns Array of channel names
   */
  get subscribedChannels(): string[] {
    return Array.from(this.channels.keys());
  }
}

export default RealtimeClient;
