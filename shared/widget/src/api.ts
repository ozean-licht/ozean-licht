/**
 * Widget API Client
 *
 * API client for widget operations to communicate with the Ozean Licht admin backend.
 * Handles conversation creation, message sending, file uploads, and user identification.
 */

import type { Attachment } from './types';

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Contact entity from the backend
 */
export interface Contact {
  id: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  userId?: string | null;
  whatsappId?: string | null;
  telegramId?: string | null;
  customAttributes: Record<string, unknown>;
  blocked: boolean;
  lastActivityAt?: string | null;
  platform: 'ozean_licht' | 'kids_ascension';
  createdAt: string;
  updatedAt: string;
}

/**
 * Message entity from the backend
 */
export interface Message {
  id: string;
  conversationId: string;
  senderType: 'agent' | 'contact' | 'bot' | 'system';
  senderId?: string | null;
  senderName?: string | null;
  content?: string | null;
  contentType: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system';
  threadId?: string | null;
  replyCount: number;
  isPrivate: boolean;
  mentions: string[];
  attachments: Attachment[];
  externalId?: string | null;
  externalStatus?: 'sent' | 'delivered' | 'read' | 'failed' | null;
  editedAt?: string | null;
  deletedAt?: string | null;
  createdAt: string;
}

/**
 * Conversation entity from the backend
 */
export interface Conversation {
  id: string;
  type: 'support' | 'team_channel' | 'direct_message' | 'internal_ticket';
  status: 'active' | 'open' | 'pending' | 'resolved' | 'archived' | 'snoozed' | 'in_progress' | 'closed';
  platform: 'ozean_licht' | 'kids_ascension';
  contactId?: string | null;
  contactEmail?: string | null;
  contactName?: string | null;
  contact?: Contact;
  channel?: 'web_widget' | 'whatsapp' | 'telegram' | 'email' | 'phone' | null;
  priority?: 'low' | 'normal' | 'high' | 'urgent' | null;
  assignedAgentId?: string | null;
  assignedTeam?: 'support' | 'dev' | 'tech' | 'admin' | 'spiritual' | 'sales' | null;
  firstResponseAt?: string | null;
  resolvedAt?: string | null;
  csatRating?: number | null;
  labels: string[];
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  isPrivate: boolean;
  isArchived: boolean;
  ticketNumber?: string | null;
  requesterId?: string | null;
  linkedConversationId?: string | null;
  unreadCount?: number;
  messageCount?: number;
  participantCount?: number;
  lastMessage?: Message;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
  metadata: Record<string, unknown>;
}

// ============================================================================
// API Request Types
// ============================================================================

/**
 * Create conversation request payload
 */
export interface CreateConversationData {
  contactEmail?: string;
  contactName?: string;
  platform: string;
  customAttributes?: Record<string, unknown>;
}

/**
 * Create conversation response
 */
export interface CreateConversationResponse {
  conversationId: string;
  contact: Contact;
}

/**
 * Send message request payload
 */
export interface SendMessageData {
  content: string;
  attachments?: Attachment[];
}

/**
 * Get messages response
 */
export interface GetMessagesResponse {
  messages: Message[];
  hasMore: boolean;
}

/**
 * Identify user request payload
 */
export interface IdentifyUserData {
  email: string;
  name?: string;
  hmac?: string;
}

/**
 * Upload attachment request payload
 */
export interface UploadAttachmentRequest {
  conversationId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

/**
 * Upload attachment response
 */
export interface UploadAttachmentResponse {
  fileId: string;
  uploadUrl: string;
  method: string;
  headers: Record<string, string>;
  confirmUrl: string;
}

/**
 * Confirm attachment response
 */
export interface ConfirmAttachmentResponse {
  attachment: Attachment;
}

// ============================================================================
// API Error Types
// ============================================================================

/**
 * API error structure
 */
export class WidgetAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'WidgetAPIError';
  }
}

// ============================================================================
// Widget API Client
// ============================================================================

/**
 * Configuration options for the Widget API Client
 */
export interface WidgetAPIClientOptions {
  /** Base URL for the API (defaults to https://admin.ozean-licht.at) */
  baseUrl?: string;
  /** Platform key for authentication */
  platformKey: string;
  /** Session ID for tracking anonymous users */
  sessionId: string;
}

/**
 * Widget API Client
 *
 * Handles all API communication between the widget and the backend.
 * Supports conversation management, messaging, file uploads, and user identification.
 */
export default class WidgetAPIClient {
  private baseUrl: string;
  private platformKey: string;
  private sessionId: string;

  /**
   * Create a new Widget API Client
   *
   * @param options - Configuration options
   */
  constructor(options: WidgetAPIClientOptions) {
    this.baseUrl = options.baseUrl || 'https://admin.ozean-licht.at';
    this.platformKey = options.platformKey;
    this.sessionId = options.sessionId;
  }

  /**
   * Make an authenticated API request
   *
   * @param endpoint - API endpoint path (e.g., '/api/widget/conversations')
   * @param options - Fetch options
   * @returns Parsed JSON response
   * @throws {WidgetAPIError} If the request fails
   */
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Widget-Platform-Key': this.platformKey,
      'X-Widget-Session-Id': this.sessionId,
      ...options?.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Parse response body
      let data: unknown;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        data = { message: text };
      }

      // Handle errors
      if (!response.ok) {
        const errorData = data as { error?: string; message?: string; code?: string };
        throw new WidgetAPIError(
          errorData.error || errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData.code,
          data
        );
      }

      return data as T;
    } catch (error) {
      // Re-throw WidgetAPIError as-is
      if (error instanceof WidgetAPIError) {
        throw error;
      }

      // Wrap network errors
      if (error instanceof Error) {
        throw new WidgetAPIError(
          `Network error: ${error.message}`,
          0,
          'NETWORK_ERROR',
          error
        );
      }

      // Unknown error
      throw new WidgetAPIError('Unknown error occurred', 0, 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Create a new conversation
   *
   * @param data - Conversation creation data
   * @returns Created conversation and contact information
   */
  async createConversation(data: CreateConversationData): Promise<CreateConversationResponse> {
    return this.request<CreateConversationResponse>('/api/widget/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get a conversation by ID
   *
   * @param id - Conversation ID
   * @returns Conversation details with messages
   */
  async getConversation(id: string): Promise<Conversation> {
    return this.request<Conversation>(`/api/widget/conversations/${id}`);
  }

  /**
   * Send a message in a conversation
   *
   * @param conversationId - Conversation ID
   * @param data - Message content and attachments
   * @returns Created message
   */
  async sendMessage(conversationId: string, data: SendMessageData): Promise<Message> {
    return this.request<Message>(`/api/widget/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get messages from a conversation
   *
   * @param conversationId - Conversation ID
   * @param before - Optional cursor for pagination (message ID)
   * @returns Messages and pagination info
   */
  async getMessages(conversationId: string, before?: string): Promise<GetMessagesResponse> {
    const params = new URLSearchParams();
    if (before) {
      params.set('before', before);
    }

    const queryString = params.toString();
    const endpoint = `/api/widget/conversations/${conversationId}/messages${
      queryString ? `?${queryString}` : ''
    }`;

    return this.request<GetMessagesResponse>(endpoint);
  }

  /**
   * Upload an attachment to a conversation
   *
   * Implements the presigned upload flow:
   * 1. Request presigned URL from backend
   * 2. Upload file directly to storage (MinIO)
   * 3. Confirm upload with backend
   *
   * @param conversationId - Conversation ID
   * @param file - File to upload
   * @returns Uploaded attachment information
   */
  async uploadAttachment(conversationId: string, file: File): Promise<Attachment> {
    // Step 1: Request presigned upload URL
    const uploadRequest: UploadAttachmentRequest = {
      conversationId,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    };

    const uploadData = await this.request<UploadAttachmentResponse>(
      '/api/widget/attachments/upload',
      {
        method: 'POST',
        body: JSON.stringify(uploadRequest),
      }
    );

    // Step 2: Upload file to presigned URL
    try {
      const uploadResponse = await fetch(uploadData.uploadUrl, {
        method: uploadData.method,
        headers: uploadData.headers,
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new WidgetAPIError(
          'Failed to upload file to storage',
          uploadResponse.status,
          'UPLOAD_FAILED'
        );
      }
    } catch (error) {
      if (error instanceof WidgetAPIError) {
        throw error;
      }
      throw new WidgetAPIError(
        'Failed to upload file to storage',
        0,
        'UPLOAD_NETWORK_ERROR',
        error
      );
    }

    // Step 3: Confirm upload with backend
    const confirmData = await this.request<ConfirmAttachmentResponse>(
      `/api/widget/attachments/${uploadData.fileId}/confirm`,
      {
        method: 'POST',
        body: JSON.stringify({
          conversationId,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        }),
      }
    );

    return confirmData.attachment;
  }

  /**
   * Identify a user (update or create contact)
   *
   * @param user - User identification data
   * @returns Updated/created contact
   */
  async identify(user: IdentifyUserData): Promise<Contact> {
    return this.request<Contact>('/api/widget/identify', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  /**
   * Mark a conversation as read
   *
   * @param conversationId - Conversation ID
   */
  async markAsRead(conversationId: string): Promise<void> {
    await this.request<void>(`/api/widget/conversations/${conversationId}/read`, {
      method: 'POST',
    });
  }
}
