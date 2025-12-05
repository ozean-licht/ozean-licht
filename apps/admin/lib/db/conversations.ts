/**
 * Unified Conversations Database Module
 *
 * Handles all conversation types in the unified messaging system:
 * - support: Customer support tickets
 * - team_channel: Internal team channels (#general, #dev)
 * - direct_message: 1-on-1 DMs between team members
 * - internal_ticket: Internal task tracking (DEV-042, TECH-018)
 *
 * Uses direct PostgreSQL connection via lib/db/index.ts
 */

import { query, execute } from './index';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Escape special characters in LIKE/ILIKE patterns to prevent SQL injection
 * Escapes: % (match any), _ (match one), \ (escape char)
 */
function escapeLikePattern(input: string): string {
  return input.replace(/[%_\\]/g, '\\$&');
}

// ============================================================================
// Type Imports
// ============================================================================

/**
 * Conversation types
 */
export type ConversationType = 'support' | 'team_channel' | 'direct_message' | 'internal_ticket';

/**
 * Conversation status (type-dependent)
 * - support: 'open', 'pending', 'resolved', 'closed'
 * - team_channel: 'active', 'archived'
 * - direct_message: 'active'
 * - internal_ticket: 'open', 'in_progress', 'resolved', 'closed'
 */
export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'closed' | 'active' | 'archived' | 'in_progress';

/**
 * Platform identifier
 */
export type Platform = 'ozean_licht' | 'kids_ascension';

/**
 * Priority level (for support and internal tickets)
 */
export type Priority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Team assignment
 */
export type AssignedTeam = 'support' | 'dev' | 'tech' | 'admin' | 'spiritual';

/**
 * Communication channel (for support)
 */
export type Channel = 'web_widget' | 'whatsapp' | 'telegram' | 'email';

// ============================================================================
// Database Row Types (snake_case)
// ============================================================================

/**
 * Database row type for conversations table
 */
export interface DBConversation {
  id: string;

  // Shared fields
  type: ConversationType;
  status: ConversationStatus;
  platform: Platform;
  created_by: string | null;
  created_at: string;
  updated_at: string;

  // Support ticket fields
  contact_id: string | null;
  contact_email: string | null;
  contact_name: string | null;
  channel: Channel | null;
  priority: Priority | null;
  assigned_agent_id: string | null;
  assigned_team: AssignedTeam | null;
  first_response_at: string | null;
  resolved_at: string | null;
  csat_rating: number | null;
  labels: string[] | null;

  // Team channel fields
  title: string | null;
  slug: string | null;
  description: string | null;
  is_private: boolean | null;
  is_archived: boolean | null;

  // Internal ticket fields
  ticket_number: string | null;
  requester_id: string | null;
  linked_conversation_id: string | null;

  // Metadata
  metadata: Record<string, unknown>;
}

/**
 * Extended database row with joined user data
 */
interface DBConversationWithJoins extends DBConversation {
  // Assigned agent info
  agent_name: string | null;
  agent_email: string | null;

  // Requester info (for internal tickets)
  requester_name: string | null;
  requester_email: string | null;

  // Last message preview
  last_message_content: string | null;
  last_message_at: string | null;

  // Participant count
  participant_count: number | null;
}

/**
 * Participant database row
 */
interface DBParticipant {
  id: string;
  conversation_id: string;
  user_id: string | null;
  contact_id: string | null;
  role: string;
  joined_at: string;
  left_at: string | null;
  last_read_at: string | null;
  unread_count: number;
}

// ============================================================================
// API Types (camelCase)
// ============================================================================

/**
 * Conversation entity (camelCase for API)
 */
export interface Conversation {
  id: string;

  // Shared fields
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
  lastMessage?: {
    content: string;
    timestamp: string;
  };
  participants?: Participant[];
  participantCount?: number;
}

/**
 * Participant entity
 */
export interface Participant {
  id: string;
  conversationId: string;
  userId?: string;
  contactId?: string;
  role: string;
  joinedAt: string;
  leftAt?: string;
  lastReadAt?: string;
  unreadCount: number;
}

/**
 * Create conversation input
 */
export interface CreateConversationInput {
  type: ConversationType;
  status?: ConversationStatus;
  platform?: Platform;

  // Support ticket fields
  contactId?: string;
  contactEmail?: string;
  contactName?: string;
  channel?: Channel;
  priority?: Priority;
  assignedAgentId?: string;
  assignedTeam?: AssignedTeam;
  labels?: string[];

  // Team channel fields
  title?: string;
  slug?: string;
  description?: string;
  isPrivate?: boolean;

  // Internal ticket fields
  ticketNumber?: string;
  requesterId?: string;
  linkedConversationId?: string;

  // Metadata
  metadata?: Record<string, unknown>;
}

/**
 * Update conversation input
 */
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
  metadata?: Record<string, unknown>;
}

/**
 * Conversation list options
 */
export interface ConversationListOptions {
  type?: ConversationType;
  status?: ConversationStatus;
  platform?: Platform;
  channel?: Channel;
  assignedTeam?: AssignedTeam;
  assignedAgentId?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Conversation list result
 */
export interface ConversationListResult {
  conversations: Conversation[];
  total: number;
}

// ============================================================================
// Transformation Functions
// ============================================================================

/**
 * Transform database row to Conversation object (camelCase)
 */
function transformConversation(row: DBConversationWithJoins): Conversation {
  const conversation: Conversation = {
    id: row.id,
    type: row.type,
    status: row.status,
    platform: row.platform,
    createdBy: row.created_by || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    metadata: row.metadata,
  };

  // Support ticket fields
  if (row.contact_id) conversation.contactId = row.contact_id;
  if (row.contact_email) conversation.contactEmail = row.contact_email;
  if (row.contact_name) conversation.contactName = row.contact_name;
  if (row.channel) conversation.channel = row.channel;
  if (row.priority) conversation.priority = row.priority;
  if (row.assigned_agent_id) conversation.assignedAgentId = row.assigned_agent_id;
  if (row.assigned_team) conversation.assignedTeam = row.assigned_team;
  if (row.first_response_at) conversation.firstResponseAt = row.first_response_at;
  if (row.resolved_at) conversation.resolvedAt = row.resolved_at;
  if (row.csat_rating) conversation.csatRating = row.csat_rating;
  if (row.labels && row.labels.length > 0) conversation.labels = row.labels;

  // Team channel fields
  if (row.title) conversation.title = row.title;
  if (row.slug) conversation.slug = row.slug;
  if (row.description) conversation.description = row.description;
  if (row.is_private !== null) conversation.isPrivate = row.is_private;
  if (row.is_archived !== null) conversation.isArchived = row.is_archived;

  // Internal ticket fields
  if (row.ticket_number) conversation.ticketNumber = row.ticket_number;
  if (row.requester_id) conversation.requesterId = row.requester_id;
  if (row.linked_conversation_id) conversation.linkedConversationId = row.linked_conversation_id;

  // Joined fields - assigned agent
  if (row.assigned_agent_id && row.agent_name && row.agent_email) {
    conversation.assignedAgent = {
      id: row.assigned_agent_id,
      name: row.agent_name,
      email: row.agent_email,
    };
  }

  // Joined fields - requester
  if (row.requester_id && row.requester_name && row.requester_email) {
    conversation.requester = {
      id: row.requester_id,
      name: row.requester_name,
      email: row.requester_email,
    };
  }

  // Last message
  if (row.last_message_content && row.last_message_at) {
    conversation.lastMessage = {
      content: row.last_message_content,
      timestamp: row.last_message_at,
    };
  }

  // Participant count
  if (row.participant_count !== null) {
    conversation.participantCount = row.participant_count;
  }

  return conversation;
}

/**
 * Transform participant database row to API object
 */
function transformParticipant(row: DBParticipant): Participant {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    userId: row.user_id || undefined,
    contactId: row.contact_id || undefined,
    role: row.role,
    joinedAt: row.joined_at,
    leftAt: row.left_at || undefined,
    lastReadAt: row.last_read_at || undefined,
    unreadCount: row.unread_count,
  };
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * List all conversations with filtering and pagination
 *
 * @param options - Filter, pagination, and sort options
 * @returns Paginated list of conversations with total count
 *
 * @example
 * const result = await getAllConversations({
 *   type: 'support',
 *   status: 'open',
 *   assignedTeam: 'tech',
 *   limit: 20,
 *   orderBy: 'created_at',
 *   orderDirection: 'desc'
 * });
 */
export async function getAllConversations(
  options: ConversationListOptions = {}
): Promise<ConversationListResult> {
  const {
    type,
    status,
    platform,
    channel,
    assignedTeam,
    assignedAgentId,
    search,
    limit: requestedLimit = 50,
    offset: requestedOffset = 0,
    orderBy = 'updated_at',
    orderDirection = 'desc',
  } = options;

  // Cap limit at 100 to prevent DoS attacks
  const limit = Math.min(requestedLimit, 100);

  // Cap offset at 10000 to prevent performance issues with large offsets
  const MAX_OFFSET = 10000;
  const offset = Math.min(Math.max(0, requestedOffset), MAX_OFFSET);

  // Build WHERE conditions
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (type) {
    conditions.push(`c.type = $${paramIndex++}`);
    params.push(type);
  }

  if (status) {
    conditions.push(`c.status = $${paramIndex++}`);
    params.push(status);
  }

  if (platform) {
    conditions.push(`c.platform = $${paramIndex++}`);
    params.push(platform);
  }

  if (channel) {
    conditions.push(`c.channel = $${paramIndex++}`);
    params.push(channel);
  }

  if (assignedTeam) {
    conditions.push(`c.assigned_team = $${paramIndex++}`);
    params.push(assignedTeam);
  }

  if (assignedAgentId) {
    conditions.push(`c.assigned_agent_id = $${paramIndex++}`);
    params.push(assignedAgentId);
  }

  if (search) {
    conditions.push(
      `(c.title ILIKE $${paramIndex} OR c.contact_name ILIKE $${paramIndex} OR c.contact_email ILIKE $${paramIndex} OR c.ticket_number ILIKE $${paramIndex})`
    );
    params.push(`%${escapeLikePattern(search)}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate orderBy to prevent SQL injection - use type-safe whitelist
  const validOrderColumns = [
    'created_at',
    'updated_at',
    'status',
    'priority',
    'type',
    'title',
    'last_message_at',
  ] as const;
  type ValidOrderColumn = typeof validOrderColumns[number];

  const isValidOrderColumn = (value: string): value is ValidOrderColumn => {
    return (validOrderColumns as readonly string[]).includes(value);
  };

  const safeOrderBy = isValidOrderColumn(orderBy) ? orderBy : 'updated_at';
  const safeOrderDir = orderDirection === 'asc' ? 'ASC' : 'DESC';

  // Count query
  const countSql = `SELECT COUNT(*) as count FROM conversations c ${whereClause}`;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query with LEFT JOINs to get related data
  // Add LIMIT and OFFSET to params for proper parameterization
  params.push(limit);
  const limitParamIndex = paramIndex++;
  params.push(offset);
  const offsetParamIndex = paramIndex++;

  const dataSql = `
    SELECT
      c.id, c.type, c.status, c.platform, c.created_by, c.created_at, c.updated_at,
      c.contact_id, c.contact_email, c.contact_name, c.channel, c.priority,
      c.assigned_agent_id, c.assigned_team, c.first_response_at, c.resolved_at,
      c.csat_rating, c.labels, c.title, c.slug, c.description, c.is_private,
      c.is_archived, c.ticket_number, c.requester_id, c.linked_conversation_id,
      c.metadata,
      agent.name as agent_name,
      agent.email as agent_email,
      requester.name as requester_name,
      requester.email as requester_email,
      (
        SELECT m.content
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) as last_message_content,
      (
        SELECT m.created_at
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) as last_message_at,
      (
        SELECT COUNT(*)
        FROM conversation_participants cp
        WHERE cp.conversation_id = c.id AND cp.left_at IS NULL
      ) as participant_count
    FROM conversations c
    LEFT JOIN admin_users agent ON c.assigned_agent_id = agent.id
    LEFT JOIN admin_users requester ON c.requester_id = requester.id
    ${whereClause}
    ORDER BY c.${safeOrderBy} ${safeOrderDir}
    LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
  `;

  const rows = await query<DBConversationWithJoins>(dataSql, params);
  const conversations = rows.map(transformConversation);

  return {
    conversations,
    total,
  };
}

/**
 * Get a single conversation by ID with participants and last message
 *
 * @param id - Conversation UUID
 * @returns Conversation with participants or null if not found
 *
 * @example
 * const conversation = await getConversationById('uuid-here');
 * if (conversation) {
 *   console.log(`Conversation has ${conversation.participants?.length} participants`);
 * }
 */
export async function getConversationById(id: string): Promise<Conversation | null> {
  const sql = `
    SELECT
      c.id, c.type, c.status, c.platform, c.created_by, c.created_at, c.updated_at,
      c.contact_id, c.contact_email, c.contact_name, c.channel, c.priority,
      c.assigned_agent_id, c.assigned_team, c.first_response_at, c.resolved_at,
      c.csat_rating, c.labels, c.title, c.slug, c.description, c.is_private,
      c.is_archived, c.ticket_number, c.requester_id, c.linked_conversation_id,
      c.metadata,
      agent.name as agent_name,
      agent.email as agent_email,
      requester.name as requester_name,
      requester.email as requester_email,
      (
        SELECT m.content
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) as last_message_content,
      (
        SELECT m.created_at
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) as last_message_at,
      (
        SELECT COUNT(*)
        FROM conversation_participants cp
        WHERE cp.conversation_id = c.id AND cp.left_at IS NULL
      ) as participant_count
    FROM conversations c
    LEFT JOIN admin_users agent ON c.assigned_agent_id = agent.id
    LEFT JOIN admin_users requester ON c.requester_id = requester.id
    WHERE c.id = $1
  `;

  const rows = await query<DBConversationWithJoins>(sql, [id]);
  if (rows.length === 0) return null;

  const conversation = transformConversation(rows[0]);

  // Fetch participants for this conversation
  const participantsSql = `
    SELECT
      id, conversation_id, user_id, contact_id, role,
      joined_at, left_at, last_read_at, unread_count
    FROM conversation_participants
    WHERE conversation_id = $1
    ORDER BY joined_at ASC
  `;

  const participantRows = await query<DBParticipant>(participantsSql, [id]);
  conversation.participants = participantRows.map(transformParticipant);

  return conversation;
}

/**
 * Get a team channel conversation by slug
 *
 * @param slug - Channel slug (e.g., 'general', 'dev')
 * @returns Conversation or null if not found
 *
 * @example
 * const generalChannel = await getConversationBySlug('general');
 */
export async function getConversationBySlug(slug: string): Promise<Conversation | null> {
  const sql = `
    SELECT
      c.id, c.type, c.status, c.platform, c.created_by, c.created_at, c.updated_at,
      c.contact_id, c.contact_email, c.contact_name, c.channel, c.priority,
      c.assigned_agent_id, c.assigned_team, c.first_response_at, c.resolved_at,
      c.csat_rating, c.labels, c.title, c.slug, c.description, c.is_private,
      c.is_archived, c.ticket_number, c.requester_id, c.linked_conversation_id,
      c.metadata,
      agent.name as agent_name,
      agent.email as agent_email,
      requester.name as requester_name,
      requester.email as requester_email,
      (
        SELECT m.content
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) as last_message_content,
      (
        SELECT m.created_at
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) as last_message_at,
      (
        SELECT COUNT(*)
        FROM conversation_participants cp
        WHERE cp.conversation_id = c.id AND cp.left_at IS NULL
      ) as participant_count
    FROM conversations c
    LEFT JOIN admin_users agent ON c.assigned_agent_id = agent.id
    LEFT JOIN admin_users requester ON c.requester_id = requester.id
    WHERE c.slug = $1 AND c.type = 'team_channel'
  `;

  const rows = await query<DBConversationWithJoins>(sql, [slug]);
  return rows.length > 0 ? transformConversation(rows[0]) : null;
}

/**
 * Create a new conversation of any type
 *
 * @param input - Conversation data
 * @param createdBy - User ID creating the conversation
 * @returns Created conversation
 *
 * @example Support ticket
 * const ticket = await createConversation({
 *   type: 'support',
 *   contactEmail: 'user@example.com',
 *   contactName: 'John Doe',
 *   channel: 'web_widget',
 *   priority: 'normal',
 *   assignedTeam: 'support'
 * }, 'agent-uuid');
 *
 * @example Team channel
 * const channel = await createConversation({
 *   type: 'team_channel',
 *   title: 'Development',
 *   slug: 'dev',
 *   description: 'Development team discussion'
 * }, 'admin-uuid');
 */
export async function createConversation(
  input: CreateConversationInput,
  createdBy: string
): Promise<Conversation> {
  const {
    type,
    status,
    platform = 'ozean_licht',
    contactId,
    contactEmail,
    contactName,
    channel,
    priority = 'normal',
    assignedAgentId,
    assignedTeam,
    labels = [],
    title,
    slug,
    description,
    isPrivate = false,
    ticketNumber,
    requesterId,
    linkedConversationId,
    metadata = {},
  } = input;

  // Determine default status based on type
  const defaultStatus: ConversationStatus =
    type === 'team_channel' ? 'active' :
    type === 'direct_message' ? 'active' :
    status || 'open';

  const sql = `
    INSERT INTO conversations (
      type, status, platform, created_by,
      contact_id, contact_email, contact_name, channel, priority,
      assigned_agent_id, assigned_team, labels,
      title, slug, description, is_private,
      ticket_number, requester_id, linked_conversation_id,
      metadata
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8, $9,
      $10, $11, $12,
      $13, $14, $15, $16,
      $17, $18, $19,
      $20
    )
    RETURNING
      id, type, status, platform, created_by, created_at, updated_at,
      contact_id, contact_email, contact_name, channel, priority,
      assigned_agent_id, assigned_team, first_response_at, resolved_at,
      csat_rating, labels, title, slug, description, is_private,
      is_archived, ticket_number, requester_id, linked_conversation_id,
      metadata
  `;

  const params = [
    type,
    defaultStatus,
    platform,
    createdBy,
    contactId || null,
    contactEmail || null,
    contactName || null,
    channel || null,
    priority || null,
    assignedAgentId || null,
    assignedTeam || null,
    labels,
    title || null,
    slug || null,
    description || null,
    isPrivate,
    ticketNumber || null,
    requesterId || null,
    linkedConversationId || null,
    metadata,
  ];

  const rows = await query<DBConversation>(sql, params);
  const conversation = rows[0];

  // Fetch joined data for return
  return getConversationById(conversation.id) as Promise<Conversation>;
}

/**
 * Update conversation fields
 *
 * @param id - Conversation UUID
 * @param input - Fields to update
 * @returns Updated conversation or null if not found
 *
 * @example
 * const updated = await updateConversation('uuid-here', {
 *   status: 'resolved',
 *   priority: 'high',
 *   assignedAgentId: 'agent-uuid'
 * });
 */
export async function updateConversation(
  id: string,
  input: UpdateConversationInput
): Promise<Conversation | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Build dynamic SET clause for each provided field
  const fieldMappings: Array<{ key: keyof UpdateConversationInput; column: string }> = [
    { key: 'status', column: 'status' },
    { key: 'priority', column: 'priority' },
    { key: 'assignedAgentId', column: 'assigned_agent_id' },
    { key: 'assignedTeam', column: 'assigned_team' },
    { key: 'labels', column: 'labels' },
    { key: 'title', column: 'title' },
    { key: 'description', column: 'description' },
    { key: 'isPrivate', column: 'is_private' },
    { key: 'isArchived', column: 'is_archived' },
    { key: 'metadata', column: 'metadata' },
  ];

  for (const { key, column } of fieldMappings) {
    if (input[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(input[key]);
    }
  }

  if (setClauses.length === 0) {
    // No fields to update, return current conversation
    return getConversationById(id);
  }

  // Always update updated_at
  setClauses.push(`updated_at = NOW()`);

  params.push(id);
  const sql = `
    UPDATE conversations
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id
  `;

  const rows = await query<{ id: string }>(sql, params);
  if (rows.length === 0) return null;

  // Fetch full conversation with joins
  return getConversationById(id);
}

/**
 * Soft delete conversation (set status to closed/archived)
 *
 * @param id - Conversation UUID
 * @returns Updated conversation or null if not found
 *
 * @example
 * const deleted = await deleteConversation('uuid-here');
 */
export async function deleteConversation(id: string): Promise<Conversation | null> {
  // Fetch conversation to determine appropriate status
  const conversation = await getConversationById(id);
  if (!conversation) return null;

  const newStatus: ConversationStatus =
    conversation.type === 'team_channel' ? 'archived' : 'closed';

  const sql = `
    UPDATE conversations
    SET
      status = $1,
      is_archived = TRUE,
      updated_at = NOW()
    WHERE id = $2
    RETURNING id
  `;

  const rows = await query<{ id: string }>(sql, [newStatus, id]);
  if (rows.length === 0) return null;

  return getConversationById(id);
}

/**
 * Resolve a support conversation or internal ticket
 *
 * @param id - Conversation UUID
 * @param csatRating - Optional customer satisfaction rating (1-5)
 * @returns Updated conversation or null if not found
 *
 * @example
 * const resolved = await resolveConversation('uuid-here', 5);
 */
export async function resolveConversation(
  id: string,
  csatRating?: number
): Promise<Conversation | null> {
  const sql = `
    UPDATE conversations
    SET
      status = 'resolved',
      resolved_at = NOW(),
      csat_rating = COALESCE($2, csat_rating),
      updated_at = NOW()
    WHERE id = $1
    RETURNING id
  `;

  const rows = await query<{ id: string }>(sql, [id, csatRating || null]);
  if (rows.length === 0) return null;

  return getConversationById(id);
}

/**
 * Get all conversations for a specific participant (user or contact)
 *
 * @param userId - User UUID (for team members)
 * @param options - Filter and pagination options
 * @returns List of conversations the user participates in
 *
 * @example
 * const myConversations = await getConversationsByParticipant('user-uuid', {
 *   type: 'team_channel',
 *   status: 'active',
 *   limit: 50
 * });
 */
export async function getConversationsByParticipant(
  userId: string,
  options: ConversationListOptions = {}
): Promise<ConversationListResult> {
  const {
    type,
    status,
    limit: requestedLimit = 50,
    offset: requestedOffset = 0,
    orderBy = 'updated_at',
    orderDirection = 'desc',
  } = options;

  const limit = Math.min(requestedLimit, 100);

  // Cap offset at 10000 to prevent performance issues with large offsets
  const MAX_OFFSET = 10000;
  const offset = Math.min(Math.max(0, requestedOffset), MAX_OFFSET);

  // Build WHERE conditions
  const conditions: string[] = ['cp.user_id = $1', 'cp.left_at IS NULL'];
  const params: unknown[] = [userId];
  let paramIndex = 2;

  if (type) {
    conditions.push(`c.type = $${paramIndex++}`);
    params.push(type);
  }

  if (status) {
    conditions.push(`c.status = $${paramIndex++}`);
    params.push(status);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  // Validate orderBy
  const validOrderColumns = ['created_at', 'updated_at', 'last_message_at'] as const;
  type ValidOrderColumn = typeof validOrderColumns[number];

  const isValidOrderColumn = (value: string): value is ValidOrderColumn => {
    return (validOrderColumns as readonly string[]).includes(value);
  };

  const safeOrderBy: ValidOrderColumn = isValidOrderColumn(orderBy) ? orderBy : 'updated_at';
  const safeOrderDir = orderDirection === 'asc' ? 'ASC' : 'DESC';

  // Count query
  const countSql = `
    SELECT COUNT(*) as count
    FROM conversation_participants cp
    JOIN conversations c ON cp.conversation_id = c.id
    ${whereClause}
  `;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query
  params.push(limit);
  const limitParamIndex = paramIndex++;
  params.push(offset);
  const offsetParamIndex = paramIndex++;

  const dataSql = `
    SELECT DISTINCT ON (c.id)
      c.id, c.type, c.status, c.platform, c.created_by, c.created_at, c.updated_at,
      c.contact_id, c.contact_email, c.contact_name, c.channel, c.priority,
      c.assigned_agent_id, c.assigned_team, c.first_response_at, c.resolved_at,
      c.csat_rating, c.labels, c.title, c.slug, c.description, c.is_private,
      c.is_archived, c.ticket_number, c.requester_id, c.linked_conversation_id,
      c.metadata,
      agent.name as agent_name,
      agent.email as agent_email,
      requester.name as requester_name,
      requester.email as requester_email,
      (
        SELECT m.content
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) as last_message_content,
      (
        SELECT m.created_at
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) as last_message_at,
      (
        SELECT COUNT(*)
        FROM conversation_participants cp2
        WHERE cp2.conversation_id = c.id AND cp2.left_at IS NULL
      ) as participant_count
    FROM conversation_participants cp
    JOIN conversations c ON cp.conversation_id = c.id
    LEFT JOIN admin_users agent ON c.assigned_agent_id = agent.id
    LEFT JOIN admin_users requester ON c.requester_id = requester.id
    ${whereClause}
    ORDER BY c.id, c.${safeOrderBy} ${safeOrderDir}
    LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
  `;

  const rows = await query<DBConversationWithJoins>(dataSql, params);
  const conversations = rows.map(transformConversation);

  return {
    conversations,
    total,
  };
}

/**
 * Record first response time for a conversation
 *
 * @param id - Conversation UUID
 *
 * @example
 * await recordFirstResponse('uuid-here');
 */
export async function recordFirstResponse(id: string): Promise<void> {
  const sql = `
    UPDATE conversations
    SET
      first_response_at = NOW(),
      updated_at = NOW()
    WHERE id = $1 AND first_response_at IS NULL
  `;

  await execute(sql, [id]);
}

/**
 * Add a participant to a conversation
 *
 * @param conversationId - Conversation UUID
 * @param userId - User UUID (for team members)
 * @param role - Participant role (default: 'member')
 * @returns Created participant
 *
 * @example
 * await addParticipant('conversation-uuid', 'user-uuid', 'admin');
 */
export async function addParticipant(
  conversationId: string,
  userId: string,
  role: string = 'member'
): Promise<Participant> {
  const sql = `
    INSERT INTO conversation_participants (
      conversation_id, user_id, role
    ) VALUES ($1, $2, $3)
    ON CONFLICT (conversation_id, user_id)
    DO UPDATE SET
      left_at = NULL,
      role = EXCLUDED.role,
      joined_at = NOW()
    RETURNING
      id, conversation_id, user_id, contact_id, role,
      joined_at, left_at, last_read_at, unread_count
  `;

  const rows = await query<DBParticipant>(sql, [conversationId, userId, role]);
  return transformParticipant(rows[0]);
}

/**
 * Remove a participant from a conversation (soft delete)
 *
 * @param conversationId - Conversation UUID
 * @param userId - User UUID
 *
 * @example
 * await removeParticipant('conversation-uuid', 'user-uuid');
 */
export async function removeParticipant(
  conversationId: string,
  userId: string
): Promise<void> {
  const sql = `
    UPDATE conversation_participants
    SET left_at = NOW()
    WHERE conversation_id = $1 AND user_id = $2
  `;

  await execute(sql, [conversationId, userId]);
}
