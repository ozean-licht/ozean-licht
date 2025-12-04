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

// ============================================================================
// Channel Configuration Types (Phase 5)
// ============================================================================

/**
 * Platform identifier
 */
export type Platform = 'ozean_licht' | 'kids_ascension';

/**
 * Widget position
 */
export type WidgetPosition = 'left' | 'right';

/**
 * Reply time indicator
 */
export type ReplyTime = 'in_a_few_minutes' | 'in_a_few_hours' | 'in_a_day';

/**
 * Channel configuration entity
 */
export interface ChannelConfig {
  id: string;
  channel: Channel;
  displayName: string;
  isEnabled: boolean;
  chatwootInboxId?: number;
  config: ChannelSpecificConfig;
  defaultTeam?: Team;
  autoResponseEnabled: boolean;
  autoResponseMessage?: string;
  businessHours: BusinessHours;
  platform: Platform;
  createdAt: string;
  updatedAt: string;
}

/**
 * Channel-specific configuration union type
 *
 * Discriminated union for different channel types. Each channel requires
 * different configuration parameters for integration with Chatwoot.
 *
 * @example Web Widget
 * ```typescript
 * const webConfig: WebWidgetConfig = {
 *   websiteToken: 'abc123xyz',
 *   allowedDomains: ['ozean-licht.de', 'kids-ascension.com']
 * };
 * ```
 *
 * @example WhatsApp Business API
 * ```typescript
 * const whatsappConfig: WhatsAppConfig = {
 *   phoneNumber: '+4912345678',
 *   businessId: 'biz_123',
 *   accessToken: 'encrypted_token', // Must be encrypted
 *   wabaId: 'waba_456'
 * };
 * ```
 */
export type ChannelSpecificConfig =
  | WebWidgetConfig
  | WhatsAppConfig
  | TelegramConfig
  | EmailConfig;

/**
 * Web widget configuration
 */
export interface WebWidgetConfig {
  websiteToken: string;
  allowedDomains: string[];
}

/**
 * WhatsApp Business API configuration
 *
 * TODO: SECURITY - accessToken must be encrypted before enabling this channel in production
 */
export interface WhatsAppConfig {
  phoneNumber: string;
  businessId: string;
  accessToken: string; // SENSITIVE: Must be encrypted at rest
  wabaId: string;
}

/**
 * Telegram bot configuration
 *
 * TODO: SECURITY - botToken must be encrypted before enabling this channel in production
 */
export interface TelegramConfig {
  botToken: string; // SENSITIVE: Must be encrypted at rest
  botUsername: string;
  webhookUrl: string;
}

/**
 * Email channel configuration
 *
 * TODO: SECURITY - password must be encrypted before storing
 */
export interface EmailConfig {
  imapAddress: string;
  smtpAddress: string;
  email: string;
  password: string; // SENSITIVE: Must be encrypted at rest
}

/**
 * Business hours configuration
 */
export interface BusinessHours {
  enabled?: boolean;
  timezone?: string;
  schedule?: {
    [day: string]: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
}

/**
 * Widget settings for web chat
 */
export interface WidgetSettings {
  id: string;
  platform: Platform;
  primaryColor: string;
  position: WidgetPosition;
  welcomeTitle: string;
  welcomeSubtitle: string;
  replyTime: ReplyTime;
  showBranding: boolean;
  logoUrl?: string;
  preChatFormEnabled: boolean;
  preChatFormFields: PreChatFormField[];
  hideMessageBubble: boolean;
  showPopupOnload: boolean;
  popupDelaySeconds: number;
  language: string;
  customCss?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pre-chat form field definition
 */
export interface PreChatFormField {
  name: string;
  type: 'text' | 'email' | 'select';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

/**
 * Update channel config input
 *
 * Partial update object for modifying channel configurations.
 * All fields are optional to allow targeted updates without replacing
 * the entire configuration.
 *
 * @property isEnabled - Toggle channel on/off
 * @property chatwootInboxId - Chatwoot inbox ID for routing conversations
 * @property config - Channel-specific settings (merged with existing)
 * @property defaultTeam - Team to auto-assign new conversations
 * @property autoResponseEnabled - Whether to send auto-response messages
 * @property autoResponseMessage - Message content for auto-response
 * @property businessHours - Operating hours configuration
 *
 * @example Enable channel with auto-response
 * ```typescript
 * const update: UpdateChannelConfigInput = {
 *   isEnabled: true,
 *   autoResponseEnabled: true,
 *   autoResponseMessage: 'Thanks! We\'ll respond within 24 hours.',
 *   defaultTeam: 'sales'
 * };
 * ```
 */
export interface UpdateChannelConfigInput {
  isEnabled?: boolean;
  chatwootInboxId?: number;
  config?: Partial<ChannelSpecificConfig>;
  defaultTeam?: Team;
  autoResponseEnabled?: boolean;
  autoResponseMessage?: string;
  businessHours?: BusinessHours;
}

/**
 * Update widget settings input
 *
 * Partial update object for modifying web chat widget appearance and behavior.
 * All fields are optional to allow targeted updates.
 *
 * @property primaryColor - Hex color for widget buttons and highlights
 * @property position - Widget bubble position (left or right side)
 * @property welcomeTitle - Greeting message shown when widget opens
 * @property welcomeSubtitle - Subtitle text in widget header
 * @property replyTime - Expected response time displayed to users
 * @property showBranding - Show/hide "Powered by Chatwoot" branding
 * @property logoUrl - Custom logo URL for widget header
 * @property preChatFormEnabled - Require form before chat starts
 * @property preChatFormFields - Fields to collect in pre-chat form
 * @property hideMessageBubble - Hide the floating bubble launcher
 * @property showPopupOnload - Auto-open widget on page load
 * @property popupDelaySeconds - Delay before auto-opening widget
 * @property language - Widget UI language (ISO 639-1 code)
 * @property customCss - Additional CSS to inject into widget
 *
 * @example Customize widget appearance
 * ```typescript
 * const update: UpdateWidgetSettingsInput = {
 *   primaryColor: '#6366f1',
 *   position: 'right',
 *   welcomeTitle: 'How can we help you today?',
 *   showPopupOnload: true,
 *   popupDelaySeconds: 5
 * };
 * ```
 */
export interface UpdateWidgetSettingsInput {
  primaryColor?: string;
  position?: WidgetPosition;
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  replyTime?: ReplyTime;
  showBranding?: boolean;
  logoUrl?: string;
  preChatFormEnabled?: boolean;
  preChatFormFields?: PreChatFormField[];
  hideMessageBubble?: boolean;
  showPopupOnload?: boolean;
  popupDelaySeconds?: number;
  language?: string;
  customCss?: string;
}

/**
 * Get display name for channel
 */
export function getChannelDisplayName(channel: Channel): string {
  const names: Record<Channel, string> = {
    web_widget: 'Website Chat',
    whatsapp: 'WhatsApp Business',
    email: 'Email',
    telegram: 'Telegram',
  };
  return names[channel] || channel;
}

/**
 * Get platform display name
 */
export function getPlatformDisplayName(platform: Platform): string {
  const names: Record<Platform, string> = {
    ozean_licht: 'Ozean Licht Akademie',
    kids_ascension: 'Kids Ascension',
  };
  return names[platform] || platform;
}
