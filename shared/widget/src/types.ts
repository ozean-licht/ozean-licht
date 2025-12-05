/**
 * Support Chat Widget Types
 * TypeScript type definitions for the embeddable support chat widget
 */

// ============================================================================
// Enums and Union Types
// ============================================================================

/**
 * Platform identifier
 */
export type Platform = 'ozean_licht' | 'kids_ascension';

/**
 * Widget position on screen
 */
export type WidgetPosition = 'left' | 'right';

/**
 * Supported languages
 */
export type Language = 'de' | 'en';

/**
 * Message sender type
 */
export type SenderType = 'agent' | 'contact' | 'bot' | 'system';

/**
 * Message content type
 */
export type ContentType = 'text' | 'image' | 'file' | 'system';

/**
 * Message delivery status
 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'failed';

/**
 * Attachment file type
 */
export type AttachmentType = 'image' | 'file' | 'video' | 'audio';

/**
 * Widget event types
 */
export type WidgetEventType =
  | 'ready'
  | 'open'
  | 'close'
  | 'message_sent'
  | 'message_received'
  | 'conversation_started'
  | 'typing_start'
  | 'typing_stop'
  | 'error';

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * User identification data for authenticated users
 */
export interface WidgetUser {
  /** User ID (if registered) */
  id?: string;
  /** User email address */
  email?: string;
  /** User display name */
  name?: string;
  /** HMAC signature for identity verification */
  hmac?: string;
}

/**
 * Widget configuration for initialization
 */
export interface WidgetConfig {
  /** Public API key for platform authentication */
  platformKey: string;
  /** Platform identifier */
  platform: Platform;
  /** User identification (optional for anonymous users) */
  user?: WidgetUser;
  /** Custom attributes for user context */
  customAttributes?: Record<string, unknown>;
  /** Widget position on screen (default: 'right') */
  position?: WidgetPosition;
  /** Primary brand color in hex format (default: '#0ec2bc') */
  primaryColor?: string;
  /** Greeting message shown when widget opens */
  greeting?: string;
  /** Widget language (default: 'de') */
  language?: Language;
}

// ============================================================================
// Core Entity Types
// ============================================================================

/**
 * Message attachment object
 */
export interface Attachment {
  /** Unique attachment identifier */
  id: string;
  /** Attachment type */
  type: AttachmentType;
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  mimeType: string;
  /** Public URL for accessing the file */
  url: string;
  /** Thumbnail URL (for images/videos) */
  thumbnailUrl?: string;
}

/**
 * Chat message
 */
export interface Message {
  /** Unique message identifier */
  id: string;
  /** Conversation ID this message belongs to */
  conversationId: string;
  /** Type of sender */
  senderType: SenderType;
  /** Sender display name */
  senderName: string | null;
  /** Message text content */
  content: string;
  /** Content type */
  contentType: ContentType;
  /** File attachments */
  attachments: Attachment[];
  /** Message creation timestamp */
  createdAt: Date;
  /** Message delivery status (for outgoing messages) */
  status?: MessageStatus;
}

/**
 * Contact information
 */
export interface Contact {
  /** Unique contact identifier */
  id: string;
  /** Contact email address */
  email?: string;
  /** Contact display name */
  name?: string;
  /** Contact avatar URL */
  avatarUrl?: string;
}

// ============================================================================
// Widget State Management
// ============================================================================

/**
 * Internal widget state
 */
export interface WidgetState {
  /** Whether widget is currently open */
  isOpen: boolean;
  /** Whether widget is loading */
  isLoading: boolean;
  /** Current conversation ID */
  conversationId: string | null;
  /** Session identifier for analytics */
  sessionId: string;
  /** All messages in current conversation */
  messages: Message[];
  /** Number of unread messages */
  unreadCount: number;
}

/**
 * Queued message for offline support
 */
export interface QueuedMessage {
  /** Temporary local message ID */
  id: string;
  /** Conversation ID */
  conversationId: string;
  /** Message content */
  content: string;
  /** Message attachments */
  attachments: Attachment[];
  /** Timestamp when message was queued */
  queuedAt: number;
  /** Number of send retry attempts */
  retryCount: number;
}

// ============================================================================
// API and SDK Types
// ============================================================================

/**
 * Event callback function
 */
export type EventCallback = (...args: any[]) => void;

/**
 * Public SDK API methods
 * Main interface for interacting with the widget
 */
export interface WidgetAPI {
  /**
   * Initialize the widget with configuration
   * @param config Widget configuration object
   */
  init(config: WidgetConfig): void;

  /**
   * Identify the current user
   * @param user User identification data
   */
  identify(user: WidgetUser): void;

  /**
   * Open the widget
   */
  open(): void;

  /**
   * Close the widget
   */
  close(): void;

  /**
   * Toggle widget open/closed state
   */
  toggle(): void;

  /**
   * Send a message in the current conversation
   * @param content Message text content
   */
  sendMessage(content: string): void;

  /**
   * Register an event listener
   * @param event Event type to listen for
   * @param callback Function to call when event fires
   */
  on(event: WidgetEventType, callback: EventCallback): void;

  /**
   * Unregister an event listener
   * @param event Event type to stop listening for
   * @param callback Function to remove from listeners
   */
  off(event: WidgetEventType, callback: EventCallback): void;
}

// ============================================================================
// WebSocket/Real-time Event Types
// ============================================================================

/**
 * Real-time message event from server
 */
export interface MessageReceivedEvent {
  type: 'message_received';
  message: Message;
  conversationId: string;
}

/**
 * Typing indicator event
 */
export interface TypingEvent {
  type: 'typing_start' | 'typing_stop';
  conversationId: string;
  agentName: string;
}

/**
 * Conversation created event
 */
export interface ConversationStartedEvent {
  type: 'conversation_started';
  conversationId: string;
  timestamp: string;
}

/**
 * Error event
 */
export interface ErrorEvent {
  type: 'error';
  error: Error;
  message: string;
}

/**
 * Union of all widget events
 */
export type WidgetEvent =
  | MessageReceivedEvent
  | TypingEvent
  | ConversationStartedEvent
  | ErrorEvent;

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Request to create a new conversation
 */
export interface CreateConversationRequest {
  platform: Platform;
  platformKey: string;
  contact: {
    email?: string;
    name?: string;
  };
  customAttributes?: Record<string, unknown>;
}

/**
 * Response from creating a conversation
 */
export interface CreateConversationResponse {
  conversationId: string;
  contact: Contact;
}

/**
 * Request to send a message
 */
export interface SendMessageRequest {
  conversationId: string;
  content: string;
  contentType?: ContentType;
  attachments?: Attachment[];
}

/**
 * Response from sending a message
 */
export interface SendMessageResponse {
  message: Message;
}

/**
 * Request to fetch message history
 */
export interface FetchMessagesRequest {
  conversationId: string;
  limit?: number;
  before?: string; // Message ID
}

/**
 * Response with message history
 */
export interface FetchMessagesResponse {
  messages: Message[];
  hasMore: boolean;
}

/**
 * Request to upload a file
 */
export interface UploadFileRequest {
  conversationId: string;
  file: File;
}

/**
 * Response from file upload
 */
export interface UploadFileResponse {
  attachment: Attachment;
}

// ============================================================================
// Storage Types (IndexedDB)
// ============================================================================

/**
 * Stored conversation data in IndexedDB
 */
export interface StoredConversation {
  id: string;
  platform: Platform;
  contactId: string;
  lastMessageAt: number;
  messages: Message[];
  queuedMessages: QueuedMessage[];
}

/**
 * Widget preferences stored in localStorage
 */
export interface WidgetPreferences {
  /** Whether sound notifications are enabled */
  soundEnabled: boolean;
  /** User's preferred language */
  language: Language;
  /** Last session ID */
  lastSessionId?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Network connectivity status
 */
export interface NetworkStatus {
  isOnline: boolean;
  lastOnlineAt?: number;
}
