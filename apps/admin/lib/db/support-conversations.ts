/**
 * Support Conversations Database Queries
 *
 * Database queries for support management via direct PostgreSQL connection.
 * Handles conversation sync from Chatwoot, local updates, and message history.
 * Uses the query/execute functions from index.ts for connection pooling.
 */

import { query, execute, transaction, type PoolClient } from './index';
import type {
  Conversation,
  Message,
  ConversationListOptions,
  ConversationListResult,
  UpdateConversationInput,
  ConversationStatus,
  ConversationPriority,
  Channel,
  Team,
  MessageSenderType,
  MessageType,
} from '../../types/support';

// ============================================================================
// Database Row Types (snake_case)
// ============================================================================

/**
 * Database row type for support_conversations table
 */
export interface DBConversation {
  id: string;
  chatwoot_id: number;
  user_id: string | null;
  contact_email: string | null;
  contact_name: string | null;
  channel: Channel;
  status: ConversationStatus;
  priority: ConversationPriority;
  team: Team | null;
  assigned_agent_id: string | null;
  labels: string[];
  first_response_at: string | null;
  resolved_at: string | null;
  csat_rating: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Database row type for support_messages table
 */
export interface DBMessage {
  id: string;
  conversation_id: string;
  chatwoot_id: number | null;
  sender_type: MessageSenderType;
  sender_name: string | null;
  content: string | null;
  message_type: MessageType;
  is_private: boolean;
  created_at: string;
}

/**
 * Extended database row with joined agent data
 */
interface DBConversationWithAgent extends DBConversation {
  agent_name: string | null;
  agent_email: string | null;
}

// ============================================================================
// Transformation Functions
// ============================================================================

/**
 * Transform database row to Conversation object (camelCase)
 */
function transformConversation(row: DBConversationWithAgent): Conversation {
  return {
    id: row.id,
    chatwootId: row.chatwoot_id,
    userId: row.user_id || undefined,
    contactEmail: row.contact_email || undefined,
    contactName: row.contact_name || undefined,
    channel: row.channel,
    status: row.status,
    priority: row.priority,
    team: row.team || undefined,
    assignedAgentId: row.assigned_agent_id || undefined,
    labels: row.labels,
    firstResponseAt: row.first_response_at || undefined,
    resolvedAt: row.resolved_at || undefined,
    csatRating: row.csat_rating || undefined,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // Include agent info if available
    assignedAgent: row.assigned_agent_id && row.agent_name && row.agent_email
      ? {
          id: row.assigned_agent_id,
          name: row.agent_name,
          email: row.agent_email,
        }
      : undefined,
  };
}

/**
 * Transform database row to Message object (camelCase)
 */
function transformMessage(row: DBMessage): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    chatwootId: row.chatwoot_id || undefined,
    senderType: row.sender_type,
    senderName: row.sender_name || undefined,
    content: row.content || undefined,
    messageType: row.message_type,
    isPrivate: row.is_private,
    createdAt: row.created_at,
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
 *   status: 'open',
 *   team: 'tech',
 *   limit: 20,
 *   orderBy: 'created_at',
 *   orderDirection: 'desc'
 * });
 */
export async function getAllConversations(
  options: ConversationListOptions = {}
): Promise<ConversationListResult> {
  const {
    status,
    channel,
    team,
    assignedAgentId,
    search,
    limit: requestedLimit = 50,
    offset = 0,
    orderBy = 'created_at',
    orderDirection = 'desc',
  } = options;

  // Cap limit at 100 to prevent DoS attacks
  const limit = Math.min(requestedLimit, 100);

  // Build WHERE conditions
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (status) {
    conditions.push(`sc.status = $${paramIndex++}`);
    params.push(status);
  }

  if (channel) {
    conditions.push(`sc.channel = $${paramIndex++}`);
    params.push(channel);
  }

  if (team) {
    conditions.push(`sc.team = $${paramIndex++}`);
    params.push(team);
  }

  if (assignedAgentId) {
    conditions.push(`sc.assigned_agent_id = $${paramIndex++}`);
    params.push(assignedAgentId);
  }

  if (search) {
    conditions.push(
      `(sc.contact_name ILIKE $${paramIndex} OR sc.contact_email ILIKE $${paramIndex})`
    );
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate orderBy to prevent SQL injection - use type-safe whitelist
  const validOrderColumns = [
    'created_at',
    'updated_at',
    'status',
    'priority',
    'channel',
    'team',
    'first_response_at',
    'resolved_at',
  ] as const;
  type ValidOrderColumn = typeof validOrderColumns[number];

  const isValidOrderColumn = (value: string): value is ValidOrderColumn => {
    return (validOrderColumns as readonly string[]).includes(value);
  };

  const safeOrderBy = isValidOrderColumn(orderBy) ? orderBy : 'created_at';
  const safeOrderDir = orderDirection === 'asc' ? 'ASC' : 'DESC';

  // Count query
  const countSql = `SELECT COUNT(*) as count FROM support_conversations sc ${whereClause}`;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query with LEFT JOIN to get agent info
  // Add LIMIT and OFFSET to params for proper parameterization
  params.push(limit);
  const limitParamIndex = paramIndex++;
  params.push(offset);
  const offsetParamIndex = paramIndex++;

  const dataSql = `
    SELECT
      sc.id, sc.chatwoot_id, sc.user_id, sc.contact_email, sc.contact_name,
      sc.channel, sc.status, sc.priority, sc.team, sc.assigned_agent_id,
      sc.labels, sc.first_response_at, sc.resolved_at, sc.csat_rating,
      sc.metadata, sc.created_at, sc.updated_at,
      au.name as agent_name,
      au.email as agent_email
    FROM support_conversations sc
    LEFT JOIN admin_users au ON sc.assigned_agent_id = au.id
    ${whereClause}
    ORDER BY sc.${safeOrderBy} ${safeOrderDir}
    LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
  `;

  const rows = await query<DBConversationWithAgent>(dataSql, params);
  const conversations = rows.map(transformConversation);

  return {
    conversations,
    total,
  };
}

/**
 * Get a single conversation by ID with messages
 *
 * @param id - Conversation UUID
 * @returns Conversation with messages or null if not found
 *
 * @example
 * const conversation = await getConversationById('uuid-here');
 * if (conversation) {
 *   console.log(`Conversation has ${conversation.messages?.length} messages`);
 * }
 */
export async function getConversationById(id: string): Promise<Conversation | null> {
  const sql = `
    SELECT
      sc.id, sc.chatwoot_id, sc.user_id, sc.contact_email, sc.contact_name,
      sc.channel, sc.status, sc.priority, sc.team, sc.assigned_agent_id,
      sc.labels, sc.first_response_at, sc.resolved_at, sc.csat_rating,
      sc.metadata, sc.created_at, sc.updated_at,
      au.name as agent_name,
      au.email as agent_email
    FROM support_conversations sc
    LEFT JOIN admin_users au ON sc.assigned_agent_id = au.id
    WHERE sc.id = $1
  `;

  const rows = await query<DBConversationWithAgent>(sql, [id]);
  if (rows.length === 0) return null;

  const conversation = transformConversation(rows[0]);

  // Fetch messages for this conversation
  const messagesSql = `
    SELECT
      id, conversation_id, chatwoot_id, sender_type, sender_name,
      content, message_type, is_private, created_at
    FROM support_messages
    WHERE conversation_id = $1
    ORDER BY created_at ASC
  `;

  const messageRows = await query<DBMessage>(messagesSql, [id]);
  conversation.messages = messageRows.map(transformMessage);

  return conversation;
}

/**
 * Get a conversation by Chatwoot ID (for sync operations)
 *
 * @param chatwootId - Chatwoot conversation ID
 * @returns Conversation or null if not found
 *
 * @example
 * const conversation = await getConversationByChatwootId(12345);
 */
export async function getConversationByChatwootId(
  chatwootId: number
): Promise<Conversation | null> {
  const sql = `
    SELECT
      sc.id, sc.chatwoot_id, sc.user_id, sc.contact_email, sc.contact_name,
      sc.channel, sc.status, sc.priority, sc.team, sc.assigned_agent_id,
      sc.labels, sc.first_response_at, sc.resolved_at, sc.csat_rating,
      sc.metadata, sc.created_at, sc.updated_at,
      au.name as agent_name,
      au.email as agent_email
    FROM support_conversations sc
    LEFT JOIN admin_users au ON sc.assigned_agent_id = au.id
    WHERE sc.chatwoot_id = $1
  `;

  const rows = await query<DBConversationWithAgent>(sql, [chatwootId]);
  return rows.length > 0 ? transformConversation(rows[0]) : null;
}

/**
 * Sync/upsert conversation from Chatwoot webhook
 *
 * @param data - Conversation data from Chatwoot
 * @returns Created or updated conversation
 *
 * @example
 * const conversation = await syncConversationFromChatwoot({
 *   chatwootId: 12345,
 *   contactEmail: 'user@example.com',
 *   contactName: 'John Doe',
 *   channel: 'web_widget',
 *   status: 'open',
 *   labels: ['billing', 'urgent'],
 *   assigneeEmail: 'agent@example.com'
 * });
 */
export async function syncConversationFromChatwoot(data: {
  chatwootId: number;
  contactEmail?: string;
  contactName?: string;
  channel: Channel;
  status: ConversationStatus;
  labels?: string[];
  assigneeEmail?: string;
}): Promise<Conversation> {
  // Wrap in transaction for atomicity
  return transaction(async (client: PoolClient) => {
    // Look up admin user by email if assignee is provided
    let assignedAgentId: string | null = null;
    if (data.assigneeEmail) {
      const agentSql = `SELECT id FROM admin_users WHERE email = $1`;
      const agentResult = await client.query(agentSql, [data.assigneeEmail]);
      if (agentResult.rows.length > 0) {
        assignedAgentId = agentResult.rows[0].id;
      }
    }

    // Look up user by email if contact email is provided
    let userId: string | null = null;
    if (data.contactEmail) {
      const userSql = `SELECT id FROM users WHERE email = $1`;
      const userResult = await client.query(userSql, [data.contactEmail]);
      if (userResult.rows.length > 0) {
        userId = userResult.rows[0].id;
      }
    }

    // Upsert conversation (INSERT ... ON CONFLICT UPDATE)
    const sql = `
      INSERT INTO support_conversations (
        chatwoot_id, user_id, contact_email, contact_name,
        channel, status, labels, assigned_agent_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      )
      ON CONFLICT (chatwoot_id) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        contact_email = EXCLUDED.contact_email,
        contact_name = EXCLUDED.contact_name,
        status = EXCLUDED.status,
        labels = EXCLUDED.labels,
        assigned_agent_id = EXCLUDED.assigned_agent_id,
        updated_at = NOW()
      RETURNING
        id, chatwoot_id, user_id, contact_email, contact_name,
        channel, status, priority, team, assigned_agent_id,
        labels, first_response_at, resolved_at, csat_rating,
        metadata, created_at, updated_at
    `;

    const params = [
      data.chatwootId,
      userId,
      data.contactEmail || null,
      data.contactName || null,
      data.channel,
      data.status,
      data.labels || [],
      assignedAgentId,
    ];

    const result = await client.query(sql, params);
    const conversation = result.rows[0] as DBConversation;

    // Fetch agent info if assigned
    if (conversation.assigned_agent_id) {
      const agentSql = `SELECT id, name, email FROM admin_users WHERE id = $1`;
      const agentResult = await client.query(agentSql, [conversation.assigned_agent_id]);
      if (agentResult.rows.length > 0) {
        const agent = agentResult.rows[0];
        return transformConversation({
          ...conversation,
          agent_name: agent.name,
          agent_email: agent.email
        });
      }
    }

    return transformConversation({ ...conversation, agent_name: null, agent_email: null });
  });
}

/**
 * Update local conversation fields (team, priority, labels)
 *
 * @param id - Conversation UUID
 * @param data - Fields to update
 * @returns Updated conversation or null if not found
 *
 * @example
 * const updated = await updateConversation('uuid-here', {
 *   team: 'tech',
 *   priority: 'high',
 *   labels: ['bug', 'urgent']
 * });
 */
export async function updateConversation(
  id: string,
  data: UpdateConversationInput
): Promise<Conversation | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Build dynamic SET clause for each provided field
  const fieldMappings: Array<{ key: keyof UpdateConversationInput; column: string }> = [
    { key: 'status', column: 'status' },
    { key: 'team', column: 'team' },
    { key: 'priority', column: 'priority' },
    { key: 'labels', column: 'labels' },
    { key: 'assignedAgentId', column: 'assigned_agent_id' },
  ];

  for (const { key, column } of fieldMappings) {
    if (data[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(data[key]);
    }
  }

  if (setClauses.length === 0) {
    // No fields to update, return current conversation
    return getConversationById(id);
  }

  // The updated_at trigger will automatically update the timestamp

  params.push(id);
  const sql = `
    UPDATE support_conversations
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING
      id, chatwoot_id, user_id, contact_email, contact_name,
      channel, status, priority, team, assigned_agent_id,
      labels, first_response_at, resolved_at, csat_rating,
      metadata, created_at, updated_at
  `;

  const rows = await query<DBConversation>(sql, params);
  if (rows.length === 0) return null;

  const conversation = rows[0];

  // Fetch agent info if assigned
  if (conversation.assigned_agent_id) {
    const agentSql = `SELECT id, name, email FROM admin_users WHERE id = $1`;
    const agentRows = await query<{ id: string; name: string; email: string }>(
      agentSql,
      [conversation.assigned_agent_id]
    );
    if (agentRows.length > 0) {
      return transformConversation({
        ...conversation,
        agent_name: agentRows[0].name,
        agent_email: agentRows[0].email,
      });
    }
  }

  return transformConversation({ ...conversation, agent_name: null, agent_email: null });
}

/**
 * Get all conversations for a specific user (for customer context)
 *
 * @param userId - User UUID
 * @returns List of conversations for the user
 *
 * @example
 * const conversations = await getConversationsByUser('user-uuid');
 * console.log(`User has ${conversations.length} previous conversations`);
 */
export async function getConversationsByUser(userId: string): Promise<Conversation[]> {
  const sql = `
    SELECT
      sc.id, sc.chatwoot_id, sc.user_id, sc.contact_email, sc.contact_name,
      sc.channel, sc.status, sc.priority, sc.team, sc.assigned_agent_id,
      sc.labels, sc.first_response_at, sc.resolved_at, sc.csat_rating,
      sc.metadata, sc.created_at, sc.updated_at,
      au.name as agent_name,
      au.email as agent_email
    FROM support_conversations sc
    LEFT JOIN admin_users au ON sc.assigned_agent_id = au.id
    WHERE sc.user_id = $1
    ORDER BY sc.created_at DESC
  `;

  const rows = await query<DBConversationWithAgent>(sql, [userId]);
  return rows.map(transformConversation);
}

/**
 * Mark conversation as resolved with optional CSAT rating
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
    UPDATE support_conversations
    SET
      status = 'resolved',
      resolved_at = NOW(),
      csat_rating = COALESCE($2, csat_rating)
    WHERE id = $1
    RETURNING
      id, chatwoot_id, user_id, contact_email, contact_name,
      channel, status, priority, team, assigned_agent_id,
      labels, first_response_at, resolved_at, csat_rating,
      metadata, created_at, updated_at
  `;

  const rows = await query<DBConversation>(sql, [id, csatRating || null]);
  if (rows.length === 0) return null;

  const conversation = rows[0];

  // Fetch agent info if assigned
  if (conversation.assigned_agent_id) {
    const agentSql = `SELECT id, name, email FROM admin_users WHERE id = $1`;
    const agentRows = await query<{ id: string; name: string; email: string }>(
      agentSql,
      [conversation.assigned_agent_id]
    );
    if (agentRows.length > 0) {
      return transformConversation({
        ...conversation,
        agent_name: agentRows[0].name,
        agent_email: agentRows[0].email,
      });
    }
  }

  return transformConversation({ ...conversation, agent_name: null, agent_email: null });
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
    UPDATE support_conversations
    SET first_response_at = NOW()
    WHERE id = $1 AND first_response_at IS NULL
  `;

  await execute(sql, [id]);
}
