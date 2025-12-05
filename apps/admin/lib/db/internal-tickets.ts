/**
 * Internal Tickets Database Operations
 *
 * Specialized operations for internal tickets (type='internal_ticket').
 * Handles ticket number management, team assignment, and linked conversations.
 *
 * Internal tickets are used for:
 * - Development tasks (DEV-042)
 * - Technical issues (TECH-018)
 * - Administrative tasks (ADMIN-005)
 * - Support escalations (SUP-123)
 * - Spiritual guidance requests (SPIRIT-007)
 *
 * Uses direct PostgreSQL connection via lib/db/index.ts
 */

import { query } from './index';
import type {
  Priority,
  AssignedTeam,
  Conversation,
  ConversationListResult,
} from '../../types/messaging';

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
// Type Definitions
// ============================================================================

/**
 * Ticket status values for internal tickets
 */
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

/**
 * Input for creating internal ticket
 */
export interface CreateInternalTicketInput {
  title: string;
  description?: string;
  priority?: Priority;
  assignedAgentId?: string;
  assignedTeam: AssignedTeam; // Required - determines ticket prefix (DEV, TECH, etc.)
  linkedConversationId?: string;
  labels?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * List options for internal tickets
 */
export interface InternalTicketListOptions {
  status?: TicketStatus;
  statuses?: TicketStatus[];
  assignedAgentId?: string;
  assignedTeam?: AssignedTeam;
  requesterId?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'updated_at' | 'priority' | 'ticket_number';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Database row type for conversations table (snake_case)
 */
interface DBConversation {
  id: string;
  type: string;
  status: string;
  platform: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;

  // Internal ticket fields
  title: string | null;
  description: string | null;
  priority: Priority | null;
  assigned_agent_id: string | null;
  assigned_team: AssignedTeam | null;
  ticket_number: string | null;
  requester_id: string | null;
  linked_conversation_id: string | null;
  labels: string[] | null;
  resolved_at: string | null;

  // Metadata
  metadata: Record<string, unknown>;
}

/**
 * Extended database row with joined user data
 */
interface DBTicketWithJoins extends DBConversation {
  // Assigned agent info
  agent_name: string | null;
  agent_email: string | null;
  agent_avatar_url: string | null;

  // Requester info
  requester_name: string | null;
  requester_email: string | null;
  requester_avatar_url: string | null;

  // Linked conversation info
  linked_conversation_type: string | null;
  linked_conversation_contact_name: string | null;

  // Message count
  message_count: number | null;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Transform database row to Conversation object (matching messaging types)
 */
function transformTicket(row: DBTicketWithJoins): Conversation {
  const conversation: Conversation = {
    id: row.id,
    type: 'internal_ticket',
    status: row.status as TicketStatus,
    platform: row.platform as 'ozean_licht' | 'kids_ascension',
    createdBy: row.created_by || null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    metadata: row.metadata,

    // Internal ticket specific fields
    title: row.title || null,
    description: row.description || null,
    priority: row.priority || null,
    assignedAgentId: row.assigned_agent_id || null,
    assignedTeam: row.assigned_team || null,
    ticketNumber: row.ticket_number || null,
    requesterId: row.requester_id || null,
    linkedConversationId: row.linked_conversation_id || null,
    labels: row.labels || [],
    resolvedAt: row.resolved_at ? new Date(row.resolved_at) : null,

    // Computed fields
    isPrivate: false,
    isArchived: row.status === 'closed',
    contactId: null,
    contactEmail: null,
    contactName: null,
    channel: null,
    firstResponseAt: null,
    csatRating: null,
    slug: null,
  };

  // Add assigned agent info
  if (row.assigned_agent_id && row.agent_name && row.agent_email) {
    conversation.assignedAgent = {
      id: row.assigned_agent_id,
      name: row.agent_name,
      email: row.agent_email,
      avatarUrl: row.agent_avatar_url || undefined,
    };
  }

  // Add requester info
  if (row.requester_id && row.requester_name && row.requester_email) {
    conversation.requester = {
      id: row.requester_id,
      name: row.requester_name,
      email: row.requester_email,
      avatarUrl: row.requester_avatar_url || undefined,
    };
  }

  // Add linked conversation preview (partial object for display purposes)
  if (row.linked_conversation_id && row.linked_conversation_type) {
    conversation.linkedConversation = {
      id: row.linked_conversation_id,
      type: row.linked_conversation_type as 'support' | 'team_channel' | 'direct_message' | 'internal_ticket',
      status: 'active',
      platform: row.platform as 'ozean_licht' | 'kids_ascension',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {},
      createdBy: null,
      contactId: null,
      contactEmail: null,
      contactName: row.linked_conversation_contact_name || null,
      channel: null,
      priority: null,
      assignedAgentId: null,
      assignedTeam: null,
      firstResponseAt: null,
      resolvedAt: null,
      csatRating: null,
      labels: [],
      title: null,
      slug: null,
      description: null,
      isPrivate: false,
      isArchived: false,
      ticketNumber: null,
      requesterId: null,
      linkedConversationId: null,
    };
  }

  // Add message count
  if (row.message_count !== null) {
    conversation.messageCount = row.message_count;
  }

  return conversation;
}

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Create internal ticket with auto-generated ticket number
 *
 * The ticket_number is automatically generated by the database trigger based on assigned_team:
 * - dev → DEV-001, DEV-002, etc.
 * - tech → TECH-001, TECH-002, etc.
 * - admin → ADMIN-001, ADMIN-002, etc.
 * - support → SUP-001, SUP-002, etc.
 * - spiritual → SPIRIT-001, SPIRIT-002, etc.
 *
 * @param input - Ticket data
 * @param createdBy - User ID creating the ticket (becomes requester_id)
 * @returns Created ticket with generated ticket_number
 *
 * @example
 * const ticket = await createInternalTicket({
 *   title: 'Fix login bug',
 *   description: 'Users cannot login with Google OAuth',
 *   priority: 'high',
 *   assignedTeam: 'dev',
 *   assignedAgentId: 'agent-uuid',
 *   labels: ['bug', 'authentication']
 * }, 'requester-uuid');
 *
 * console.log(ticket.ticketNumber); // 'DEV-042'
 */
export async function createInternalTicket(
  input: CreateInternalTicketInput,
  createdBy: string
): Promise<Conversation> {
  const {
    title,
    description,
    priority = 'normal',
    assignedAgentId,
    assignedTeam,
    linkedConversationId,
    labels = [],
    metadata = {},
  } = input;

  const sql = `
    INSERT INTO conversations (
      type,
      status,
      platform,
      created_by,
      title,
      description,
      priority,
      assigned_agent_id,
      assigned_team,
      requester_id,
      linked_conversation_id,
      labels,
      metadata
    ) VALUES (
      'internal_ticket',
      'open',
      'ozean_licht',
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $1,
      $7,
      $8,
      $9
    )
    RETURNING
      id,
      type,
      status,
      platform,
      created_by,
      created_at,
      updated_at,
      title,
      description,
      priority,
      assigned_agent_id,
      assigned_team,
      ticket_number,
      requester_id,
      linked_conversation_id,
      labels,
      resolved_at,
      metadata
  `;

  const params = [
    createdBy,
    title,
    description || null,
    priority,
    assignedAgentId || null,
    assignedTeam,
    linkedConversationId || null,
    labels,
    metadata,
  ];

  const rows = await query<DBConversation>(sql, params);
  const ticket = rows[0];

  // Fetch full ticket with joined data
  return getTicketById(ticket.id) as Promise<Conversation>;
}

/**
 * Get internal tickets with filtering and pagination
 *
 * @param options - Filter, pagination, and sort options
 * @returns Paginated list of tickets with total count
 *
 * @example
 * const result = await getInternalTickets({
 *   status: 'open',
 *   assignedTeam: 'dev',
 *   priority: 'high',
 *   limit: 20,
 *   orderBy: 'priority',
 *   orderDirection: 'desc'
 * });
 */
export async function getInternalTickets(
  options: InternalTicketListOptions = {}
): Promise<ConversationListResult> {
  const {
    status,
    statuses,
    assignedAgentId,
    assignedTeam,
    requesterId,
    search,
    limit: requestedLimit = 50,
    offset: requestedOffset = 0,
    orderBy = 'created_at',
    orderDirection = 'desc',
  } = options;

  // Cap limit at 100 to prevent DoS
  const limit = Math.min(requestedLimit, 100);

  // Cap offset at 10000 to prevent performance issues with large offsets
  const MAX_OFFSET = 10000;
  const offset = Math.min(Math.max(0, requestedOffset), MAX_OFFSET);

  // Build WHERE conditions
  const conditions: string[] = ["c.type = 'internal_ticket'"];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (status) {
    conditions.push(`c.status = $${paramIndex++}`);
    params.push(status);
  }

  if (statuses && statuses.length > 0) {
    conditions.push(`c.status = ANY($${paramIndex++})`);
    params.push(statuses);
  }

  if (assignedAgentId) {
    conditions.push(`c.assigned_agent_id = $${paramIndex++}`);
    params.push(assignedAgentId);
  }

  if (assignedTeam) {
    conditions.push(`c.assigned_team = $${paramIndex++}`);
    params.push(assignedTeam);
  }

  if (requesterId) {
    conditions.push(`c.requester_id = $${paramIndex++}`);
    params.push(requesterId);
  }

  if (search) {
    conditions.push(
      `(c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex} OR c.ticket_number ILIKE $${paramIndex})`
    );
    params.push(`%${escapeLikePattern(search)}%`);
    paramIndex++;
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  // Validate orderBy to prevent SQL injection
  const validOrderColumns = ['created_at', 'updated_at', 'priority', 'ticket_number'] as const;
  type ValidOrderColumn = typeof validOrderColumns[number];
  const isValidOrderColumn = (value: string): value is ValidOrderColumn => {
    return (validOrderColumns as readonly string[]).includes(value);
  };

  const safeOrderBy = isValidOrderColumn(orderBy) ? orderBy : 'created_at';
  const safeOrderDir = orderDirection === 'asc' ? 'ASC' : 'DESC';

  // Count query
  const countSql = `SELECT COUNT(*) as count FROM conversations c ${whereClause}`;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query with JOINs
  params.push(limit);
  const limitParamIndex = paramIndex++;
  params.push(offset);
  const offsetParamIndex = paramIndex++;

  const dataSql = `
    SELECT
      c.id,
      c.type,
      c.status,
      c.platform,
      c.created_by,
      c.created_at,
      c.updated_at,
      c.title,
      c.description,
      c.priority,
      c.assigned_agent_id,
      c.assigned_team,
      c.ticket_number,
      c.requester_id,
      c.linked_conversation_id,
      c.labels,
      c.resolved_at,
      c.metadata,
      agent.name as agent_name,
      agent.email as agent_email,
      agent.avatar_url as agent_avatar_url,
      requester.name as requester_name,
      requester.email as requester_email,
      requester.avatar_url as requester_avatar_url,
      linked.type as linked_conversation_type,
      linked.contact_name as linked_conversation_contact_name,
      (
        SELECT COUNT(*)
        FROM messages m
        WHERE m.conversation_id = c.id
      ) as message_count
    FROM conversations c
    LEFT JOIN admin_users agent ON c.assigned_agent_id = agent.id
    LEFT JOIN admin_users requester ON c.requester_id = requester.id
    LEFT JOIN conversations linked ON c.linked_conversation_id = linked.id
    ${whereClause}
    ORDER BY c.${safeOrderBy} ${safeOrderDir}
    LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
  `;

  const rows = await query<DBTicketWithJoins>(dataSql, params);
  const conversations = rows.map(transformTicket);

  return {
    conversations,
    total,
  };
}

/**
 * Get ticket by ID with all joined data
 *
 * @param id - Ticket UUID
 * @returns Ticket or null if not found
 *
 * @example
 * const ticket = await getTicketById('uuid-here');
 * if (ticket) {
 *   console.log(`Ticket ${ticket.ticketNumber}: ${ticket.title}`);
 * }
 */
async function getTicketById(id: string): Promise<Conversation | null> {
  const sql = `
    SELECT
      c.id,
      c.type,
      c.status,
      c.platform,
      c.created_by,
      c.created_at,
      c.updated_at,
      c.title,
      c.description,
      c.priority,
      c.assigned_agent_id,
      c.assigned_team,
      c.ticket_number,
      c.requester_id,
      c.linked_conversation_id,
      c.labels,
      c.resolved_at,
      c.metadata,
      agent.name as agent_name,
      agent.email as agent_email,
      agent.avatar_url as agent_avatar_url,
      requester.name as requester_name,
      requester.email as requester_email,
      requester.avatar_url as requester_avatar_url,
      linked.type as linked_conversation_type,
      linked.contact_name as linked_conversation_contact_name,
      (
        SELECT COUNT(*)
        FROM messages m
        WHERE m.conversation_id = c.id
      ) as message_count
    FROM conversations c
    LEFT JOIN admin_users agent ON c.assigned_agent_id = agent.id
    LEFT JOIN admin_users requester ON c.requester_id = requester.id
    LEFT JOIN conversations linked ON c.linked_conversation_id = linked.id
    WHERE c.id = $1 AND c.type = 'internal_ticket'
  `;

  const rows = await query<DBTicketWithJoins>(sql, [id]);
  if (rows.length === 0) return null;

  return transformTicket(rows[0]);
}

/**
 * Find ticket by ticket number (e.g., 'DEV-042', 'TECH-018')
 *
 * @param ticketNumber - Ticket number (case-insensitive)
 * @returns Ticket or null if not found
 *
 * @example
 * const ticket = await getTicketByNumber('DEV-042');
 * if (ticket) {
 *   console.log(`Found ticket: ${ticket.title}`);
 * }
 */
export async function getTicketByNumber(ticketNumber: string): Promise<Conversation | null> {
  const sql = `
    SELECT
      c.id,
      c.type,
      c.status,
      c.platform,
      c.created_by,
      c.created_at,
      c.updated_at,
      c.title,
      c.description,
      c.priority,
      c.assigned_agent_id,
      c.assigned_team,
      c.ticket_number,
      c.requester_id,
      c.linked_conversation_id,
      c.labels,
      c.resolved_at,
      c.metadata,
      agent.name as agent_name,
      agent.email as agent_email,
      agent.avatar_url as agent_avatar_url,
      requester.name as requester_name,
      requester.email as requester_email,
      requester.avatar_url as requester_avatar_url,
      linked.type as linked_conversation_type,
      linked.contact_name as linked_conversation_contact_name,
      (
        SELECT COUNT(*)
        FROM messages m
        WHERE m.conversation_id = c.id
      ) as message_count
    FROM conversations c
    LEFT JOIN admin_users agent ON c.assigned_agent_id = agent.id
    LEFT JOIN admin_users requester ON c.requester_id = requester.id
    LEFT JOIN conversations linked ON c.linked_conversation_id = linked.id
    WHERE UPPER(c.ticket_number) = UPPER($1) AND c.type = 'internal_ticket'
  `;

  const rows = await query<DBTicketWithJoins>(sql, [ticketNumber]);
  if (rows.length === 0) return null;

  return transformTicket(rows[0]);
}

/**
 * Update ticket status
 *
 * Automatically sets resolved_at timestamp when status changes to 'resolved'.
 *
 * @param id - Ticket UUID
 * @param status - New status
 * @returns Updated ticket or null if not found
 *
 * @example
 * const ticket = await updateTicketStatus('uuid-here', 'in_progress');
 */
export async function updateTicketStatus(
  id: string,
  status: TicketStatus
): Promise<Conversation | null> {
  const sql = `
    UPDATE conversations
    SET
      status = $1,
      resolved_at = CASE WHEN $1 = 'resolved' THEN NOW() ELSE resolved_at END,
      updated_at = NOW()
    WHERE id = $2 AND type = 'internal_ticket'
    RETURNING id
  `;

  const rows = await query<{ id: string }>(sql, [status, id]);
  if (rows.length === 0) return null;

  return getTicketById(id);
}

/**
 * Assign ticket to agent and/or team
 *
 * Note: Changing assigned_team does NOT change the ticket_number prefix.
 * The ticket_number is set once on creation and never changes.
 *
 * @param id - Ticket UUID
 * @param agentId - Agent user ID (optional)
 * @param team - Team name (optional)
 * @returns Updated ticket or null if not found
 *
 * @example
 * // Assign to specific agent
 * const ticket = await assignTicket('uuid-here', 'agent-uuid', 'dev');
 *
 * // Reassign to different team (ticket number stays the same)
 * const ticket = await assignTicket('uuid-here', undefined, 'tech');
 */
export async function assignTicket(
  id: string,
  agentId?: string,
  team?: AssignedTeam
): Promise<Conversation | null> {
  const setClauses: string[] = ['updated_at = NOW()'];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (agentId !== undefined) {
    setClauses.push(`assigned_agent_id = $${paramIndex++}`);
    params.push(agentId);
  }

  if (team !== undefined) {
    setClauses.push(`assigned_team = $${paramIndex++}`);
    params.push(team);
  }

  if (setClauses.length === 1) {
    // No fields to update besides updated_at
    return getTicketById(id);
  }

  params.push(id);
  const sql = `
    UPDATE conversations
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex} AND type = 'internal_ticket'
    RETURNING id
  `;

  const rows = await query<{ id: string }>(sql, params);
  if (rows.length === 0) return null;

  return getTicketById(id);
}

/**
 * Link internal ticket to a support conversation
 *
 * Use this to escalate a support ticket to an internal ticket
 * or to track which support conversation spawned this internal task.
 *
 * @param ticketId - Internal ticket UUID
 * @param conversationId - Support conversation UUID to link
 * @returns Updated ticket or null if not found
 *
 * @example
 * // Support agent escalates a support ticket to dev team
 * const supportTicket = await createConversation({
 *   type: 'support',
 *   contactEmail: 'customer@example.com',
 *   contactName: 'Jane Customer'
 * }, 'agent-uuid');
 *
 * const devTicket = await createInternalTicket({
 *   title: 'Investigate API timeout issue',
 *   assignedTeam: 'dev',
 *   linkedConversationId: supportTicket.id
 * }, 'agent-uuid');
 */
export async function linkToConversation(
  ticketId: string,
  conversationId: string
): Promise<Conversation | null> {
  const sql = `
    UPDATE conversations
    SET
      linked_conversation_id = $1,
      updated_at = NOW()
    WHERE id = $2 AND type = 'internal_ticket'
    RETURNING id
  `;

  const rows = await query<{ id: string }>(sql, [conversationId, ticketId]);
  if (rows.length === 0) return null;

  return getTicketById(ticketId);
}

/**
 * Get all internal tickets linked to a specific conversation
 *
 * Useful for seeing all internal tasks spawned from a support conversation.
 *
 * @param conversationId - Conversation UUID
 * @returns List of linked internal tickets
 *
 * @example
 * const linkedTickets = await getLinkedTickets('support-conversation-uuid');
 * console.log(`Found ${linkedTickets.length} linked tickets`);
 */
export async function getLinkedTickets(conversationId: string): Promise<Conversation[]> {
  const sql = `
    SELECT
      c.id,
      c.type,
      c.status,
      c.platform,
      c.created_by,
      c.created_at,
      c.updated_at,
      c.title,
      c.description,
      c.priority,
      c.assigned_agent_id,
      c.assigned_team,
      c.ticket_number,
      c.requester_id,
      c.linked_conversation_id,
      c.labels,
      c.resolved_at,
      c.metadata,
      agent.name as agent_name,
      agent.email as agent_email,
      agent.avatar_url as agent_avatar_url,
      requester.name as requester_name,
      requester.email as requester_email,
      requester.avatar_url as requester_avatar_url,
      linked.type as linked_conversation_type,
      linked.contact_name as linked_conversation_contact_name,
      (
        SELECT COUNT(*)
        FROM messages m
        WHERE m.conversation_id = c.id
      ) as message_count
    FROM conversations c
    LEFT JOIN admin_users agent ON c.assigned_agent_id = agent.id
    LEFT JOIN admin_users requester ON c.requester_id = requester.id
    LEFT JOIN conversations linked ON c.linked_conversation_id = linked.id
    WHERE c.linked_conversation_id = $1 AND c.type = 'internal_ticket'
    ORDER BY c.created_at DESC
  `;

  const rows = await query<DBTicketWithJoins>(sql, [conversationId]);
  return rows.map(transformTicket);
}
