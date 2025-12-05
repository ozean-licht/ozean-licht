/**
 * Unified Messaging System Types
 *
 * Types for the unified conversation system supporting:
 * - Support tickets (customer → agent)
 * - Team channels (internal broadcast)
 * - Direct messages (1:1 team chat)
 * - Internal tickets (team → dev/tech escalation)
 */

// ============================================================================
// Enums and Union Types
// ============================================================================

export type ConversationType =
  | 'support'
  | 'team_channel'
  | 'direct_message'
  | 'internal_ticket';

/**
 * Conversation status - unified for all conversation types
 *
 * Database schema supports:
 * - Support tickets: 'open', 'pending', 'resolved', 'archived', 'snoozed'
 * - Team channels: 'active', 'archived'
 * - Direct messages: 'active'
 * - Internal tickets: 'open', 'in_progress', 'resolved', 'closed'
 *
 * Note: 'snoozed' is mapped to 'pending' during migration but kept for backwards compatibility
 */
export type ConversationStatus =
  | 'active'
  | 'open'
  | 'pending'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'archived'
  | 'snoozed';

/**
 * Ticket-specific status (for internal_ticket type only)
 * This is a subset of ConversationStatus
 */
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type Priority = 'low' | 'normal' | 'high' | 'urgent';

export type AssignedTeam = 'support' | 'dev' | 'tech' | 'admin' | 'spiritual';

export type MessageSenderType = 'agent' | 'contact' | 'bot' | 'system';

export type MessageContentType = 'text' | 'image' | 'file' | 'system';

export type AttachmentType = 'image' | 'file' | 'video' | 'audio';

export type ParticipantRole = 'owner' | 'admin' | 'member' | 'observer';

export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline';

export type Platform = 'ozean_licht' | 'kids_ascension';

export type Channel = 'web_widget' | 'whatsapp' | 'telegram' | 'email';

// ============================================================================
// Core Entities
// ============================================================================

export interface Contact {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  avatarUrl: string | null;
  userId: string | null;
  whatsappId: string | null;
  telegramId: string | null;
  customAttributes: Record<string, unknown>;
  blocked: boolean;
  lastActivityAt: Date | null;
  platform: Platform;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  status: ConversationStatus;
  platform: Platform;

  // Support fields
  contactId: string | null;
  contactEmail: string | null;
  contactName: string | null;
  contact?: Contact;
  channel: Channel | null;
  priority: Priority | null;
  assignedAgentId: string | null;
  assignedAgent?: AdminUserBasic;
  assignedTeam: AssignedTeam | null;
  firstResponseAt: Date | null;
  resolvedAt: Date | null;
  csatRating: number | null;
  labels: string[];

  // Channel fields
  title: string | null;
  slug: string | null;
  description: string | null;
  isPrivate: boolean;
  isArchived: boolean;

  // Internal ticket fields
  ticketNumber: string | null;
  requesterId: string | null;
  requester?: AdminUserBasic;
  linkedConversationId: string | null;
  linkedConversation?: Conversation;

  // Computed fields
  unreadCount?: number;
  messageCount?: number;
  participantCount?: number;
  lastMessage?: Message;

  // Timestamps
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  messages?: Message[];
  participants?: Participant[];

  // Metadata
  metadata: Record<string, unknown>;
}

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
  sentiment?: SentimentScore;
  intent?: string;
  editedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  type: AttachmentType;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
}

export interface SentimentScore {
  score: number;
  label: 'positive' | 'neutral' | 'negative';
  confidence: number;
}

export interface Participant {
  id: string;
  conversationId: string;
  userId: string | null;
  contactId: string | null;
  user?: AdminUserBasic;
  contact?: Contact;
  role: ParticipantRole;
  joinedAt: Date;
  leftAt: Date | null;
  lastReadAt: Date | null;
  lastReadMessageId: string | null;
  unreadCount: number;
  notificationsEnabled: boolean;
  notifyAllMessages: boolean;
  notifySoundEnabled: boolean;
}

export interface UserPresence {
  userId: string;
  status: PresenceStatus;
  statusText: string | null;
  lastSeenAt: Date;
  currentConversationId: string | null;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string | null;
  startedAt: Date;
  expiresAt: Date;
}

// Basic admin user info for references
export interface AdminUserBasic {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

// ============================================================================
// Input Types for CRUD Operations
// ============================================================================

export interface CreateConversationInput {
  type: ConversationType;
  platform?: Platform;

  // Support
  contactId?: string;
  contactEmail?: string;
  contactName?: string;
  channel?: Channel;
  priority?: Priority;
  assignedAgentId?: string;
  assignedTeam?: AssignedTeam;
  labels?: string[];

  // Channel
  title?: string;
  slug?: string;
  description?: string;
  isPrivate?: boolean;

  // Internal ticket
  requesterId?: string;
  linkedConversationId?: string;

  metadata?: Record<string, unknown>;
}

export interface UpdateConversationInput {
  status?: ConversationStatus;
  priority?: Priority;
  assignedAgentId?: string;
  assignedTeam?: AssignedTeam;
  labels?: string[];
  title?: string;
  description?: string;
  isPrivate?: boolean;
  isArchived?: boolean;
  csatRating?: number;
  metadata?: Record<string, unknown>;
}

export interface CreateMessageInput {
  conversationId: string;
  senderType: MessageSenderType;
  senderId?: string;
  senderName?: string;
  content?: string;
  contentType?: MessageContentType;
  threadId?: string;
  isPrivate?: boolean;
  mentions?: string[];
  attachments?: Attachment[];
  externalId?: string;
}

export interface CreateContactInput {
  email?: string;
  phone?: string;
  name?: string;
  avatarUrl?: string;
  userId?: string;
  whatsappId?: string;
  telegramId?: string;
  customAttributes?: Record<string, unknown>;
  platform?: Platform;
}

export interface UpdateContactInput {
  email?: string;
  phone?: string;
  name?: string;
  avatarUrl?: string;
  userId?: string;
  whatsappId?: string;
  telegramId?: string;
  customAttributes?: Record<string, unknown>;
  blocked?: boolean;
}

export interface AddParticipantInput {
  conversationId: string;
  userId?: string;
  contactId?: string;
  role?: ParticipantRole;
}

export interface UpdateParticipantInput {
  role?: ParticipantRole;
  notificationsEnabled?: boolean;
  notifyAllMessages?: boolean;
  notifySoundEnabled?: boolean;
}

// ============================================================================
// List Options and Filters
// ============================================================================

export interface ConversationListOptions {
  type?: ConversationType;
  types?: ConversationType[];
  status?: ConversationStatus;
  statuses?: ConversationStatus[];
  platform?: Platform;
  channel?: Channel;
  assignedAgentId?: string;
  assignedTeam?: AssignedTeam;
  contactId?: string;
  requesterId?: string;
  participantUserId?: string;
  search?: string;
  hasUnread?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'updated_at' | 'priority';
  orderDirection?: 'asc' | 'desc';
}

export interface MessageListOptions {
  conversationId: string;
  threadId?: string;
  senderType?: MessageSenderType;
  includePrivate?: boolean;
  limit?: number;
  offset?: number;
  before?: Date;
  after?: Date;
}

// ============================================================================
// Result Types
// ============================================================================

export interface ConversationListResult {
  conversations: Conversation[];
  total: number;
}

export interface MessageListResult {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

export interface ParticipantListResult {
  participants: Participant[];
  total: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

export function getConversationStatusColor(status: ConversationStatus): string {
  const colors: Record<ConversationStatus, string> = {
    active: 'green',
    open: 'green',
    pending: 'yellow',
    in_progress: 'blue',
    resolved: 'gray',
    closed: 'gray',
    archived: 'gray',
    snoozed: 'blue',
  };
  return colors[status] || 'gray';
}

export function getTicketStatusColor(status: TicketStatus): string {
  const colors: Record<TicketStatus, string> = {
    open: 'green',
    in_progress: 'blue',
    resolved: 'gray',
    closed: 'gray',
  };
  return colors[status] || 'gray';
}

export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    low: 'gray',
    normal: 'blue',
    high: 'orange',
    urgent: 'red',
  };
  return colors[priority] || 'gray';
}

export function getConversationTypeIcon(type: ConversationType): string {
  const icons: Record<ConversationType, string> = {
    support: 'headphones',
    team_channel: 'hash',
    direct_message: 'message-circle',
    internal_ticket: 'ticket',
  };
  return icons[type] || 'message-circle';
}

export function getConversationTypeLabel(type: ConversationType): string {
  const labels: Record<ConversationType, string> = {
    support: 'Support',
    team_channel: 'Channel',
    direct_message: 'Direct Message',
    internal_ticket: 'Internal Ticket',
  };
  return labels[type] || type;
}

export function getChannelIcon(channel: Channel): string {
  const icons: Record<Channel, string> = {
    web_widget: 'message-circle',
    whatsapp: 'message-square',
    email: 'mail',
    telegram: 'send',
  };
  return icons[channel] || 'message-circle';
}

export function getTeamLabel(team: AssignedTeam): string {
  const labels: Record<AssignedTeam, string> = {
    support: 'Support',
    dev: 'Development',
    tech: 'Technical',
    admin: 'Administration',
    spiritual: 'Spiritual Guidance',
  };
  return labels[team] || team;
}

export function getPresenceStatusColor(status: PresenceStatus): string {
  const colors: Record<PresenceStatus, string> = {
    online: 'green',
    away: 'yellow',
    busy: 'red',
    offline: 'gray',
  };
  return colors[status] || 'gray';
}
