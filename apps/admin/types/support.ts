/**
 * Support Management System Types
 * Conversational support with Chatwoot integration
 */

// ============================================================================
// Enums and Union Types
// ============================================================================

/**
 * Conversation status
 */
export type ConversationStatus = 'open' | 'resolved' | 'pending' | 'snoozed';

/**
 * Conversation priority level
 */
export type ConversationPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Communication channel
 */
export type Channel = 'web_widget' | 'whatsapp' | 'email' | 'telegram';

/**
 * Support team
 */
export type Team = 'tech' | 'sales' | 'spiritual' | 'general';

/**
 * Message sender type
 */
export type MessageSenderType = 'contact' | 'agent' | 'bot';

/**
 * Message type
 */
export type MessageType = 'text' | 'attachment' | 'template';

/**
 * Knowledge article status
 */
export type ArticleStatus = 'draft' | 'published' | 'archived';

// ============================================================================
// Core Entities
// ============================================================================

/**
 * Conversation entity - Synced from Chatwoot
 */
export interface Conversation {
  id: string;
  chatwootId: number;
  userId?: string;
  contactEmail?: string;
  contactName?: string;
  channel: Channel;
  status: ConversationStatus;
  priority: ConversationPriority;
  team?: Team;
  assignedAgentId?: string;
  labels: string[];
  firstResponseAt?: string;
  resolvedAt?: string;
  csatRating?: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  // Computed/joined fields
  messages?: Message[];
  assignedAgent?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Message entity - Conversation messages
 */
export interface Message {
  id: string;
  conversationId: string;
  chatwootId?: number;
  senderType: MessageSenderType;
  senderName?: string;
  content?: string;
  messageType: MessageType;
  isPrivate: boolean;
  createdAt: string;
}

/**
 * Knowledge article entity
 */
export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category?: string;
  tags: string[];
  language: string;
  status: ArticleStatus;
  viewCount: number;
  helpfulCount: number;
  createdBy?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Computed/joined fields
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Support analytics snapshot - Daily metrics
 */
export interface SupportAnalyticsSnapshot {
  id: string;
  date: string;
  totalConversations: number;
  newConversations: number;
  resolvedConversations: number;
  avgFirstResponseMinutes?: number;
  avgResolutionMinutes?: number;
  csatAverage?: number;
  conversationsByChannel: Record<Channel, number>;
  conversationsByTeam: Record<Team, number>;
  createdAt: string;
}

// ============================================================================
// Customer Context & Support Data
// ============================================================================

/**
 * Customer context for support agents - Enriched user data
 */
export interface CustomerContext {
  user?: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  courseEnrollments: Array<{
    courseId: string;
    courseName: string;
    progress: number;
    enrolledAt: string;
  }>;
  recentPayments: Array<{
    amount: number;
    currency: string;
    date: string;
    description: string;
  }>;
  previousConversations: Array<{
    id: string;
    status: ConversationStatus;
    createdAt: string;
    resolvedAt?: string;
  }>;
  totalPurchases: number;
  memberSince?: string;
}

/**
 * Support stats - Dashboard metrics
 */
export interface SupportStats {
  openConversations: number;
  pendingConversations: number;
  avgResponseTimeMinutes: number;
  avgResolutionTimeMinutes: number;
  csatScore: number;
  conversationsToday: number;
  resolvedToday: number;
}

/**
 * Agent performance metrics
 */
export interface AgentPerformance {
  agentId: string;
  agentName: string;
  conversationsHandled: number;
  avgResponseTimeMinutes: number;
  avgResolutionTimeMinutes: number;
  csatAverage?: number;
  totalMessages: number;
  resolutionRate: number;
}

// ============================================================================
// Input Types for CRUD Operations
// ============================================================================

/**
 * Create knowledge article input
 */
export interface CreateArticleInput {
  title: string;
  content: string;
  summary?: string;
  category?: string;
  tags?: string[];
  language?: string;
  status?: ArticleStatus;
}

/**
 * Update knowledge article input
 */
export interface UpdateArticleInput {
  title?: string;
  content?: string;
  summary?: string;
  category?: string;
  tags?: string[];
  language?: string;
  status?: ArticleStatus;
}

/**
 * Update conversation input
 */
export interface UpdateConversationInput {
  status?: ConversationStatus;
  team?: Team;
  priority?: ConversationPriority;
  labels?: string[];
  assignedAgentId?: string;
}

/**
 * Create internal note input
 */
export interface CreateInternalNoteInput {
  conversationId: string;
  content: string;
}

// ============================================================================
// List Options and Filters
// ============================================================================

/**
 * Conversation list options
 */
export interface ConversationListOptions {
  status?: ConversationStatus;
  channel?: Channel;
  team?: Team;
  assignedAgentId?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Knowledge article list options
 */
export interface ArticleListOptions {
  status?: ArticleStatus;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Analytics date range
 */
export interface AnalyticsDateRange {
  startDate: string;
  endDate: string;
}

// ============================================================================
// Paginated Results
// ============================================================================

/**
 * Conversation list result
 */
export interface ConversationListResult {
  conversations: Conversation[];
  total: number;
}

/**
 * Knowledge article list result
 */
export interface ArticleListResult {
  articles: KnowledgeArticle[];
  total: number;
}

// ============================================================================
// Chatwoot Webhook Event Types
// ============================================================================

/**
 * Base Chatwoot webhook event
 */
interface BaseChatwootEvent {
  event: string;
  id: string;
  account: {
    id: number;
    name: string;
  };
}

/**
 * Conversation created event
 */
export interface ConversationCreatedEvent extends BaseChatwootEvent {
  event: 'conversation_created';
  conversation: {
    id: number;
    contact: {
      id: number;
      name?: string;
      email?: string;
    };
    inbox: {
      id: number;
      name: string;
      channel_type: string;
    };
    status: string;
    assignee?: {
      id: number;
      name: string;
      email: string;
    };
    labels: string[];
    created_at: number;
  };
}

/**
 * Conversation status changed event
 */
export interface ConversationStatusChangedEvent extends BaseChatwootEvent {
  event: 'conversation_status_changed';
  conversation: {
    id: number;
    status: string;
    contact: {
      id: number;
      name?: string;
      email?: string;
    };
    inbox?: {
      id: number;
      name: string;
      channel_type: string;
    };
    assignee?: {
      id: number;
      name: string;
      email: string;
    };
    labels?: string[];
  };
  changed_attributes: {
    status: string[];
  };
}

/**
 * Message created event
 */
export interface MessageCreatedEvent extends BaseChatwootEvent {
  event: 'message_created';
  message: {
    id: number;
    content: string;
    message_type: number;
    private: boolean;
    sender?: {
      id: number;
      name: string;
      type: string;
    };
    created_at: number;
  };
  conversation: {
    id: number;
    status?: string;
    contact?: {
      id: number;
      name?: string;
      email?: string;
    };
    inbox?: {
      id: number;
      name: string;
      channel_type: string;
    };
    assignee?: {
      id: number;
      name: string;
      email: string;
    };
    labels?: string[];
  };
}

/**
 * Conversation updated event
 */
export interface ConversationUpdatedEvent extends BaseChatwootEvent {
  event: 'conversation_updated';
  conversation: {
    id: number;
    status: string;
    contact?: {
      id: number;
      name?: string;
      email?: string;
    };
    inbox?: {
      id: number;
      name: string;
      channel_type: string;
    };
    assignee?: {
      id: number;
      name: string;
      email: string;
    };
    team?: {
      id: number;
      name: string;
    };
    labels: string[];
    custom_attributes?: Record<string, unknown>;
  };
}

/**
 * Union of all Chatwoot webhook events
 */
export type ChatwootWebhookEvent =
  | ConversationCreatedEvent
  | ConversationStatusChangedEvent
  | MessageCreatedEvent
  | ConversationUpdatedEvent;

// ============================================================================
// Display Helper Functions
// ============================================================================

/**
 * Get color for conversation status
 */
export function getConversationStatusColor(status: ConversationStatus): string {
  const colors: Record<ConversationStatus, string> = {
    open: 'green',
    resolved: 'blue',
    pending: 'yellow',
    snoozed: 'gray',
  };
  return colors[status] || 'gray';
}

/**
 * Get color for priority level
 */
export function getPriorityColor(priority: ConversationPriority): string {
  const colors: Record<ConversationPriority, string> = {
    low: 'gray',
    normal: 'blue',
    high: 'orange',
    urgent: 'red',
  };
  return colors[priority] || 'gray';
}

/**
 * Get icon for channel
 */
export function getChannelIcon(channel: Channel): string {
  const icons: Record<Channel, string> = {
    web_widget: 'message-circle',
    whatsapp: 'message-square',
    email: 'mail',
    telegram: 'send',
  };
  return icons[channel] || 'message-circle';
}

/**
 * Get label for team
 */
export function getTeamLabel(team: Team): string {
  const labels: Record<Team, string> = {
    tech: 'Technical Support',
    sales: 'Sales',
    spiritual: 'Spiritual Guidance',
    general: 'General Support',
  };
  return labels[team] || 'General Support';
}

/**
 * Get color for team
 */
export function getTeamColor(team: Team): string {
  const colors: Record<Team, string> = {
    tech: 'blue',
    sales: 'green',
    spiritual: 'purple',
    general: 'gray',
  };
  return colors[team] || 'gray';
}

/**
 * Get color for article status
 */
export function getArticleStatusColor(status: ArticleStatus): string {
  const colors: Record<ArticleStatus, string> = {
    draft: 'gray',
    published: 'green',
    archived: 'red',
  };
  return colors[status] || 'gray';
}

/**
 * Format response time in human-readable format
 */
export function formatResponseTime(minutes: number): string {
  if (minutes < 1) {
    return 'Less than 1 minute';
  }
  if (minutes < 60) {
    return `${Math.round(minutes)} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours < 24) {
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${mins}m`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (remainingHours === 0) return `${days} day${days > 1 ? 's' : ''}`;
  return `${days}d ${remainingHours}h`;
}

/**
 * Format CSAT score as percentage
 */
export function formatCSATScore(score: number): string {
  if (score < 1 || score > 5) return 'N/A';
  const percentage = ((score - 1) / 4) * 100;
  return `${Math.round(percentage)}%`;
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

// ============================================================================
// Routing & AI Assistance Types
// ============================================================================

/**
 * Routing suggestion from AI
 */
export interface RoutingSuggestion {
  team?: Team;
  priority?: ConversationPriority;
  confidence: number;
  reason: string;
}

/**
 * Quick response template
 */
export interface QuickResponse {
  id: string;
  title: string;
  content: string;
  category: string;
  language: string;
  isPersonal: boolean;
  usageCount: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create quick response input
 */
export interface CreateQuickResponseInput {
  title: string;
  content: string;
  category?: string;
  language?: string;
  isPersonal?: boolean;
}

/**
 * Update quick response input
 */
export interface UpdateQuickResponseInput {
  title?: string;
  content?: string;
  category?: string;
  language?: string;
  isPersonal?: boolean;
}

// ============================================================================
// Team & Agent Types
// ============================================================================

/**
 * Team configuration
 */
export interface TeamConfig {
  id: string;
  name: Team;
  displayName: string;
  description?: string;
  members: string[];
  autoAssign: boolean;
  workingHours?: {
    start: string;
    end: string;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Agent availability status
 */
export type AgentStatus = 'online' | 'busy' | 'away' | 'offline';

/**
 * Agent availability
 */
export interface AgentAvailability {
  agentId: string;
  agentName: string;
  status: AgentStatus;
  activeConversations: number;
  lastSeen?: string;
}

// ============================================================================
// Search & Filter Types
// ============================================================================

/**
 * Conversation search result
 */
export interface ConversationSearchResult {
  conversation: Conversation;
  matchedField: string;
  snippet: string;
  relevance: number;
}

/**
 * Knowledge article search result
 */
export interface ArticleSearchResult {
  article: KnowledgeArticle;
  snippet: string;
  relevance: number;
}

/**
 * Filter preset for saved searches
 */
export interface ConversationFilterPreset {
  id: string;
  name: string;
  filters: ConversationListOptions;
  isDefault?: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}
