/**
 * Team Chat & Messaging System Types
 * Unified conversations: support tickets, team channels, direct messages, and internal tickets
 * Based on migration 025_unified_conversations.sql
 */

// ============================================================================
// Enums and Union Types
// ============================================================================

/**
 * Conversation type - Determines which field subset is used
 */
export type ConversationType = 'support' | 'team_channel' | 'direct_message' | 'internal_ticket';

/**
 * Conversation status across all types
 * - support: 'open', 'pending', 'resolved', 'snoozed'
 * - team_channel: 'active', 'archived'
 * - direct_message: 'active'
 * - internal_ticket: 'open', 'in_progress', 'resolved', 'closed'
 */
export type ConversationStatus = 'active' | 'open' | 'pending' | 'resolved' | 'archived' | 'snoozed' | 'in_progress' | 'closed';

/**
 * Participant role in a conversation
 */
export type ParticipantRole = 'owner' | 'admin' | 'member' | 'observer';

/**
 * Message sender type
 */
export type SenderType = 'agent' | 'contact' | 'bot' | 'system';

/**
 * Message content type
 */
export type ContentType = 'text' | 'image' | 'file' | 'audio' | 'video' | 'system';

/**
 * User presence status
 */
export type PresenceStatus = 'online' | 'away' | 'offline' | 'dnd';

/**
 * Team assignment for tickets
 */
export type AssignedTeam = 'support' | 'dev' | 'tech' | 'admin' | 'spiritual' | 'sales';

/**
 * Communication channel for support tickets
 */
export type Channel = 'web_widget' | 'whatsapp' | 'telegram' | 'email' | 'phone';

/**
 * Priority level for support tickets and internal tickets
 */
export type Priority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Platform identifier
 */
export type Platform = 'ozean_licht' | 'kids_ascension';

/**
 * External message delivery status
 */
export type ExternalStatus = 'sent' | 'delivered' | 'read' | 'failed';

// ============================================================================
// Core Entities
// ============================================================================

/**
 * Contact entity - External customers for messaging system
 */
export interface Contact {
  id: string;
  // Contact information
  email?: string;
  phone?: string;
  name?: string;
  avatarUrl?: string;
  // Link to registered user
  userId?: string;
  // External platform identifiers
  whatsappId?: string;
  telegramId?: string;
  // Additional metadata
  customAttributes: Record<string, unknown>;
  blocked: boolean;
  lastActivityAt?: string;
  // Platform scope
  platform: Platform;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Unified conversation entity - Supports all conversation types
 *
 * This is the full conversation object with all fields for all types.
 * Specific conversation types will use subsets of these fields.
 */
export interface UnifiedConversation {
  id: string;
  // Core properties
  type: ConversationType;
  status: ConversationStatus;
  platform: Platform;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  // Support ticket fields
  contactId?: string;
  contactEmail?: string;
  contactName?: string;
  channel?: Channel;
  priority?: Priority;
  assignedAgentId?: string;
  assignedTeam?: AssignedTeam;
  firstResponseAt?: string;
  resolvedAt?: string;
  csatRating?: number;
  labels?: string[];
  // Team channel fields
  title?: string;
  slug?: string;
  description?: string;
  isPrivate?: boolean;
  isArchived?: boolean;
  // Internal ticket fields
  ticketNumber?: string;
  requesterId?: string;
  linkedConversationId?: string;
  // Metadata
  metadata: Record<string, unknown>;
  // Computed/joined fields
  contact?: Contact;
  assignedAgent?: {
    id: string;
    name: string;
    email: string;
  };
  requester?: {
    id: string;
    name: string;
    email: string;
  };
  participants?: ConversationParticipant[];
  messages?: UnifiedMessage[];
  unreadCount?: number;
  lastMessage?: UnifiedMessage;
}

/**
 * Team channel - Subset of UnifiedConversation for team channels
 * Slack-like channels for team communication
 */
export interface TeamChannel {
  id: string;
  type: 'team_channel';
  status: ConversationStatus;
  platform: Platform;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  // Channel-specific fields
  title: string;
  slug: string;
  description?: string;
  isPrivate: boolean;
  isArchived: boolean;
  labels?: string[];
  metadata: Record<string, unknown>;
  // Computed/joined fields
  participants?: ConversationParticipant[];
  messages?: UnifiedMessage[];
  unreadCount?: number;
  lastMessage?: UnifiedMessage;
}

/**
 * Direct message - Subset of UnifiedConversation for DMs
 * 1:1 or group chat between team members
 */
export interface DirectMessage {
  id: string;
  type: 'direct_message';
  status: ConversationStatus;
  platform: Platform;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  // DM-specific fields
  title?: string;
  labels?: string[];
  metadata: Record<string, unknown>;
  // Computed/joined fields
  participants?: ConversationParticipant[];
  messages?: UnifiedMessage[];
  unreadCount?: number;
  lastMessage?: UnifiedMessage;
}

/**
 * Internal ticket - Subset of UnifiedConversation for internal work items
 * Bug tracking, feature requests, tasks
 */
export interface InternalTicket {
  id: string;
  type: 'internal_ticket';
  status: ConversationStatus;
  platform: Platform;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  // Ticket-specific fields
  title: string;
  ticketNumber: string;
  requesterId?: string;
  linkedConversationId?: string;
  priority?: Priority;
  assignedAgentId?: string;
  assignedTeam?: AssignedTeam;
  labels: string[];
  resolvedAt?: string;
  metadata: Record<string, unknown>;
  // Computed/joined fields
  requester?: {
    id: string;
    name: string;
    email: string;
  };
  assignedAgent?: {
    id: string;
    name: string;
    email: string;
  };
  participants?: ConversationParticipant[];
  messages?: UnifiedMessage[];
  unreadCount?: number;
  lastMessage?: UnifiedMessage;
}

/**
 * Conversation participant - Many-to-many relationship
 * Tracks membership, read status, and notification preferences
 */
export interface ConversationParticipant {
  id: string;
  conversationId: string;
  // Participant identity (one of these will be set)
  userId?: string;
  contactId?: string;
  // Participant role
  role: ParticipantRole;
  // Participation tracking
  joinedAt: string;
  leftAt?: string;
  // Read tracking
  lastReadAt?: string;
  lastReadMessageId?: string;
  unreadCount: number;
  // Notification preferences
  notificationsEnabled: boolean;
  notifyAllMessages: boolean;
  notifySoundEnabled: boolean;
  // Computed/joined fields
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  contact?: Contact;
}

/**
 * Message attachment object
 */
export interface MessageAttachment {
  url: string;
  name: string;
  type: string;
  size: number;
}

/**
 * AI sentiment analysis result
 */
export interface SentimentAnalysis {
  score: number;
  label: 'positive' | 'neutral' | 'negative';
}

/**
 * Unified message entity - All messages across all conversation types
 * Supports threading, mentions, attachments, and rich content
 */
export interface UnifiedMessage {
  id: string;
  conversationId: string;
  // Sender information
  senderType: SenderType;
  senderId?: string;
  senderName?: string;
  // Message content
  content?: string;
  contentType: ContentType;
  // Threading support
  threadId?: string;
  replyCount: number;
  // Visibility and privacy
  isPrivate: boolean;
  // Social features
  mentions: string[];
  // Attachments
  attachments: MessageAttachment[];
  // External integration
  externalId?: string;
  externalStatus?: ExternalStatus;
  // AI analysis
  sentiment?: SentimentAnalysis;
  intent?: string;
  // Editing and deletion
  editedAt?: string;
  deletedAt?: string;
  // Timestamp
  createdAt: string;
  // Computed/joined fields
  sender?: {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
  };
  thread?: UnifiedMessage;
  replies?: UnifiedMessage[];
}

/**
 * User presence - Real-time online/away/offline status
 */
export interface UserPresence {
  userId: string;
  status: PresenceStatus;
  statusText?: string;
  lastSeenAt: string;
  currentConversationId?: string;
  updatedAt: string;
  // Computed/joined fields
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

/**
 * Typing indicator - Ephemeral typing status
 * Auto-expires after 5 seconds
 */
export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  startedAt: string;
  expiresAt: string;
}

// ============================================================================
// Input Types for CRUD Operations
// ============================================================================

/**
 * Create team channel input
 */
export interface CreateTeamChannelInput {
  title: string;
  slug: string;
  description?: string;
  isPrivate?: boolean;
  platform?: Platform;
  metadata?: Record<string, unknown>;
}

/**
 * Create direct message input
 */
export interface CreateDirectMessageInput {
  participantIds: string[];
  title?: string;
  platform?: Platform;
  metadata?: Record<string, unknown>;
}

/**
 * Create internal ticket input
 */
export interface CreateInternalTicketInput {
  title: string;
  priority?: Priority;
  assignedAgentId?: string;
  assignedTeam?: AssignedTeam;
  linkedConversationId?: string;
  labels?: string[];
  platform?: Platform;
  metadata?: Record<string, unknown>;
}

/**
 * Create message input
 */
export interface CreateMessageInput {
  conversationId: string;
  content?: string;
  contentType?: ContentType;
  threadId?: string;
  isPrivate?: boolean;
  mentions?: string[];
  attachments?: MessageAttachment[];
}

/**
 * Update conversation input - Works across all conversation types
 */
export interface UpdateConversationInput {
  status?: ConversationStatus;
  // Support ticket fields
  priority?: Priority;
  assignedAgentId?: string;
  assignedTeam?: AssignedTeam;
  labels?: string[];
  csatRating?: number;
  // Channel fields
  title?: string;
  description?: string;
  isPrivate?: boolean;
  isArchived?: boolean;
  // Metadata
  metadata?: Record<string, unknown>;
}

/**
 * Update message input
 */
export interface UpdateMessageInput {
  content?: string;
  attachments?: MessageAttachment[];
}

/**
 * Create contact input
 */
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

/**
 * Update contact input
 */
export interface UpdateContactInput {
  email?: string;
  phone?: string;
  name?: string;
  avatarUrl?: string;
  customAttributes?: Record<string, unknown>;
  blocked?: boolean;
}

/**
 * Add participant input
 */
export interface AddParticipantInput {
  conversationId: string;
  userId?: string;
  contactId?: string;
  role?: ParticipantRole;
}

/**
 * Update participant input
 */
export interface UpdateParticipantInput {
  role?: ParticipantRole;
  notificationsEnabled?: boolean;
  notifyAllMessages?: boolean;
  notifySoundEnabled?: boolean;
}

/**
 * Mark conversation as read input
 */
export interface MarkAsReadInput {
  conversationId: string;
  messageId?: string;
}

/**
 * Set typing indicator input
 */
export interface SetTypingInput {
  conversationId: string;
}

/**
 * Update presence input
 */
export interface UpdatePresenceInput {
  status: PresenceStatus;
  statusText?: string;
  currentConversationId?: string;
}

// ============================================================================
// List Options and Filters
// ============================================================================

/**
 * Conversation list options - Filters for querying conversations
 */
export interface ConversationListOptions {
  type?: ConversationType;
  status?: ConversationStatus;
  platform?: Platform;
  // Support ticket filters
  channel?: Channel;
  priority?: Priority;
  assignedAgentId?: string;
  assignedTeam?: AssignedTeam;
  contactId?: string;
  // Channel filters
  isPrivate?: boolean;
  isArchived?: boolean;
  // Internal ticket filters
  ticketNumber?: string;
  requesterId?: string;
  // Participant filters
  participantId?: string;
  hasUnread?: boolean;
  // Search and pagination
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'updated_at' | 'created_at' | 'title';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Message list options - Filters for querying messages
 */
export interface MessageListOptions {
  conversationId: string;
  senderType?: SenderType;
  senderId?: string;
  contentType?: ContentType;
  threadId?: string;
  isPrivate?: boolean;
  limit?: number;
  offset?: number;
  before?: string; // Message ID or timestamp
  after?: string; // Message ID or timestamp
  orderBy?: 'created_at';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Participant list options - Filters for querying participants
 */
export interface ParticipantListOptions {
  conversationId?: string;
  userId?: string;
  role?: ParticipantRole;
  hasUnread?: boolean;
  isActive?: boolean; // leftAt is null
  limit?: number;
  offset?: number;
}

/**
 * Contact list options - Filters for querying contacts
 */
export interface ContactListOptions {
  platform?: Platform;
  blocked?: boolean;
  hasUserId?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'last_activity_at' | 'name';
  orderDirection?: 'asc' | 'desc';
}

// ============================================================================
// Paginated Results
// ============================================================================

/**
 * Conversation list result with pagination
 */
export interface ConversationListResult {
  conversations: UnifiedConversation[];
  total: number;
}

/**
 * Message list result with pagination
 */
export interface MessageListResult {
  messages: UnifiedMessage[];
  total: number;
  hasMore: boolean;
}

/**
 * Participant list result with pagination
 */
export interface ParticipantListResult {
  participants: ConversationParticipant[];
  total: number;
}

/**
 * Contact list result with pagination
 */
export interface ContactListResult {
  contacts: Contact[];
  total: number;
}

// ============================================================================
// Real-time Event Types
// ============================================================================

/**
 * Real-time event type
 */
export type RealtimeEventType =
  | 'conversation_created'
  | 'conversation_updated'
  | 'conversation_deleted'
  | 'message_created'
  | 'message_updated'
  | 'message_deleted'
  | 'participant_added'
  | 'participant_updated'
  | 'participant_removed'
  | 'typing_start'
  | 'typing_stop'
  | 'presence_updated'
  | 'read_receipt';

/**
 * Base real-time event
 */
interface BaseRealtimeEvent {
  type: RealtimeEventType;
  timestamp: string;
  userId?: string;
}

/**
 * Conversation created event
 */
export interface ConversationCreatedEvent extends BaseRealtimeEvent {
  type: 'conversation_created';
  conversation: UnifiedConversation;
}

/**
 * Conversation updated event
 */
export interface ConversationUpdatedEvent extends BaseRealtimeEvent {
  type: 'conversation_updated';
  conversationId: string;
  changes: Partial<UnifiedConversation>;
}

/**
 * Message created event
 */
export interface MessageCreatedEvent extends BaseRealtimeEvent {
  type: 'message_created';
  message: UnifiedMessage;
}

/**
 * Message updated event
 */
export interface MessageUpdatedEvent extends BaseRealtimeEvent {
  type: 'message_updated';
  messageId: string;
  conversationId: string;
  changes: Partial<UnifiedMessage>;
}

/**
 * Typing indicator event
 */
export interface TypingEvent extends BaseRealtimeEvent {
  type: 'typing_start' | 'typing_stop';
  conversationId: string;
  userId: string;
  userName: string;
}

/**
 * Presence updated event
 */
export interface PresenceUpdatedEvent extends BaseRealtimeEvent {
  type: 'presence_updated';
  presence: UserPresence;
}

/**
 * Read receipt event
 */
export interface ReadReceiptEvent extends BaseRealtimeEvent {
  type: 'read_receipt';
  conversationId: string;
  userId: string;
  lastReadAt: string;
  lastReadMessageId?: string;
}

/**
 * Union of all real-time events
 */
export type RealtimeEvent =
  | ConversationCreatedEvent
  | ConversationUpdatedEvent
  | MessageCreatedEvent
  | MessageUpdatedEvent
  | TypingEvent
  | PresenceUpdatedEvent
  | ReadReceiptEvent;

// ============================================================================
// Statistics and Analytics
// ============================================================================

/**
 * Conversation statistics - Dashboard metrics
 */
export interface ConversationStats {
  totalConversations: number;
  activeConversations: number;
  openConversations: number;
  resolvedConversations: number;
  unreadCount: number;
  // By type
  conversationsByType: Record<ConversationType, number>;
  // By team
  conversationsByTeam: Record<AssignedTeam, number>;
}

/**
 * Team channel statistics
 */
export interface ChannelStats {
  totalChannels: number;
  publicChannels: number;
  privateChannels: number;
  archivedChannels: number;
  myChannels: number;
  totalMessages: number;
  activeMembers: number;
}

/**
 * User messaging statistics
 */
export interface UserMessagingStats {
  totalMessages: number;
  messagesSent: number;
  messagesReceived: number;
  activeConversations: number;
  unreadCount: number;
  mentionsCount: number;
}

// ============================================================================
// Display Helper Functions
// ============================================================================

/**
 * Get display name for conversation type
 */
export function getConversationTypeLabel(type: ConversationType): string {
  const labels: Record<ConversationType, string> = {
    support: 'Support Ticket',
    team_channel: 'Team Channel',
    direct_message: 'Direct Message',
    internal_ticket: 'Internal Ticket',
  };
  return labels[type] || type;
}

/**
 * Get color for conversation type
 */
export function getConversationTypeColor(type: ConversationType): string {
  const colors: Record<ConversationType, string> = {
    support: 'blue',
    team_channel: 'purple',
    direct_message: 'green',
    internal_ticket: 'orange',
  };
  return colors[type] || 'gray';
}

/**
 * Get color for conversation status
 */
export function getConversationStatusColor(status: ConversationStatus): string {
  const colors: Record<ConversationStatus, string> = {
    active: 'green',
    open: 'blue',
    pending: 'yellow',
    resolved: 'gray',
    archived: 'gray',
    snoozed: 'purple',
    in_progress: 'orange',
    closed: 'gray',
  };
  return colors[status] || 'gray';
}

/**
 * Get color for presence status
 */
export function getPresenceStatusColor(status: PresenceStatus): string {
  const colors: Record<PresenceStatus, string> = {
    online: 'green',
    away: 'yellow',
    offline: 'gray',
    dnd: 'red',
  };
  return colors[status] || 'gray';
}

/**
 * Get label for presence status
 */
export function getPresenceStatusLabel(status: PresenceStatus): string {
  const labels: Record<PresenceStatus, string> = {
    online: 'Online',
    away: 'Away',
    offline: 'Offline',
    dnd: 'Do Not Disturb',
  };
  return labels[status] || status;
}

/**
 * Get color for participant role
 */
export function getParticipantRoleColor(role: ParticipantRole): string {
  const colors: Record<ParticipantRole, string> = {
    owner: 'purple',
    admin: 'blue',
    member: 'gray',
    observer: 'gray',
  };
  return colors[role] || 'gray';
}

/**
 * Get label for participant role
 */
export function getParticipantRoleLabel(role: ParticipantRole): string {
  const labels: Record<ParticipantRole, string> = {
    owner: 'Owner',
    admin: 'Admin',
    member: 'Member',
    observer: 'Observer',
  };
  return labels[role] || role;
}

/**
 * Get color for priority level
 */
export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    low: 'gray',
    normal: 'blue',
    high: 'orange',
    urgent: 'red',
  };
  return colors[priority] || 'gray';
}

/**
 * Get label for team
 */
export function getTeamLabel(team: AssignedTeam): string {
  const labels: Record<AssignedTeam, string> = {
    support: 'Support',
    dev: 'Development',
    tech: 'Technical',
    admin: 'Admin',
    spiritual: 'Spiritual',
    sales: 'Sales',
  };
  return labels[team] || team;
}

/**
 * Get color for team
 */
export function getTeamColor(team: AssignedTeam): string {
  const colors: Record<AssignedTeam, string> = {
    support: 'blue',
    dev: 'purple',
    tech: 'cyan',
    admin: 'gray',
    spiritual: 'indigo',
    sales: 'green',
  };
  return colors[team] || 'gray';
}

/**
 * Get icon name for channel
 */
export function getChannelIcon(channel: Channel): string {
  const icons: Record<Channel, string> = {
    web_widget: 'message-circle',
    whatsapp: 'message-square',
    telegram: 'send',
    email: 'mail',
    phone: 'phone',
  };
  return icons[channel] || 'message-circle';
}

/**
 * Get display name for channel
 */
export function getChannelLabel(channel: Channel): string {
  const labels: Record<Channel, string> = {
    web_widget: 'Website Chat',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    email: 'Email',
    phone: 'Phone',
  };
  return labels[channel] || channel;
}

/**
 * Get icon name for content type
 */
export function getContentTypeIcon(contentType: ContentType): string {
  const icons: Record<ContentType, string> = {
    text: 'message-square',
    image: 'image',
    file: 'file',
    audio: 'mic',
    video: 'video',
    system: 'info',
  };
  return icons[contentType] || 'message-square';
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get relative time string
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

/**
 * Check if conversation is a support ticket
 */
export function isSupportTicket(conversation: UnifiedConversation): boolean {
  return conversation.type === 'support';
}

/**
 * Check if conversation is a team channel
 */
export function isTeamChannel(conversation: UnifiedConversation): conversation is TeamChannel {
  return conversation.type === 'team_channel';
}

/**
 * Check if conversation is a direct message
 */
export function isDirectMessage(conversation: UnifiedConversation): conversation is DirectMessage {
  return conversation.type === 'direct_message';
}

/**
 * Check if conversation is an internal ticket
 */
export function isInternalTicket(conversation: UnifiedConversation): conversation is InternalTicket {
  return conversation.type === 'internal_ticket';
}

/**
 * Check if message is a thread reply
 */
export function isThreadReply(message: UnifiedMessage): boolean {
  return message.threadId !== undefined && message.threadId !== null;
}

/**
 * Check if message has attachments
 */
export function hasAttachments(message: UnifiedMessage): boolean {
  return message.attachments && message.attachments.length > 0;
}

/**
 * Check if user is mentioned in message
 */
export function isUserMentioned(message: UnifiedMessage, userId: string): boolean {
  return message.mentions && message.mentions.includes(userId);
}

/**
 * Get conversation display title
 * Returns appropriate title based on conversation type
 */
export function getConversationTitle(conversation: UnifiedConversation): string {
  if (conversation.title) return conversation.title;

  switch (conversation.type) {
    case 'support':
      return conversation.contactName || conversation.contactEmail || 'Support Ticket';
    case 'team_channel':
      return `#${conversation.slug || 'channel'}`;
    case 'direct_message':
      // For DMs, title should be set based on participants
      return conversation.title || 'Direct Message';
    case 'internal_ticket':
      return conversation.ticketNumber || 'Internal Ticket';
    default:
      return 'Conversation';
  }
}

/**
 * Get unread count badge color
 */
export function getUnreadBadgeColor(count: number): string {
  if (count === 0) return 'gray';
  if (count < 5) return 'blue';
  if (count < 10) return 'orange';
  return 'red';
}

/**
 * Check if typing indicator is expired
 */
export function isTypingExpired(indicator: TypingIndicator): boolean {
  return new Date(indicator.expiresAt) < new Date();
}

/**
 * Get participant display name
 */
export function getParticipantName(participant: ConversationParticipant): string {
  if (participant.user) return participant.user.name;
  if (participant.contact) return participant.contact.name || participant.contact.email || 'Unknown';
  return 'Unknown';
}
