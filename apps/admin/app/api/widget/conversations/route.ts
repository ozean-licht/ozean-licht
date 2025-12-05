/**
 * Widget Conversations API
 *
 * PUBLIC endpoint for embedded web widget conversation management.
 * Uses custom header-based authentication (not NextAuth session).
 *
 * Required headers:
 * - X-Widget-Platform-Key: Platform API key (validates against allowed keys)
 * - X-Widget-Session-Id: Anonymous session identifier
 *
 * POST /api/widget/conversations - Create conversation
 * GET /api/widget/conversations?id={conversationId} - Get conversation with messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import type {
  Platform,
  Channel,
  ConversationType,
  ConversationStatus,
} from '@/types/team-chat';
import { getWidgetCORSHeaders, validatePlatformKey } from '@/lib/widget/cors';

// ============================================================================
// Types
// ============================================================================

/**
 * Contact database row (snake_case)
 */
interface DBContact {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  avatar_url: string | null;
  user_id: string | null;
  whatsapp_id: string | null;
  telegram_id: string | null;
  custom_attributes: Record<string, unknown>;
  blocked: boolean;
  last_activity_at: string | null;
  platform: Platform;
  created_at: string;
  updated_at: string;
}

/**
 * Conversation database row (snake_case)
 */
interface DBConversation {
  id: string;
  type: ConversationType;
  status: ConversationStatus;
  platform: Platform;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  contact_id: string | null;
  contact_email: string | null;
  contact_name: string | null;
  channel: Channel | null;
  priority: string | null;
  metadata: Record<string, unknown>;
}

/**
 * Message database row (snake_case)
 */
interface DBMessage {
  id: string;
  conversation_id: string;
  sender_type: 'agent' | 'contact' | 'bot' | 'system';
  sender_id: string | null;
  sender_name: string | null;
  content: string | null;
  content_type: string;
  attachments: Array<{
    url: string;
    name: string;
    type: string;
    size: number;
  }>;
  is_private: boolean;
  created_at: string;
}

// DBParticipant interface not used in this file - participants are created via INSERT

/**
 * POST request body
 */
interface CreateConversationBody {
  contactEmail?: string;
  contactName?: string;
  platform?: Platform;
  customAttributes?: Record<string, unknown>;
}

/**
 * Response types
 */
interface ContactResponse {
  id: string;
  email?: string;
  name?: string;
}

interface ConversationResponse {
  conversationId: string;
  contact: ContactResponse;
}

interface ConversationWithMessagesResponse {
  conversation: {
    id: string;
    type: ConversationType;
    status: ConversationStatus;
    platform: Platform;
    contactId?: string;
    contactEmail?: string;
    contactName?: string;
    channel?: Channel;
    createdAt: string;
    updatedAt: string;
  };
  contact: ContactResponse;
  messages: Array<{
    id: string;
    senderType: string;
    senderName?: string;
    content?: string;
    contentType: string;
    attachments: Array<{
      url: string;
      name: string;
      type: string;
      size: number;
    }>;
    createdAt: string;
  }>;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate widget authentication headers
 *
 * @param req - NextRequest
 * @returns Headers or null if validation fails
 */
function validateWidgetHeaders(req: NextRequest): { platformKey: string; sessionId: string } | null {
  const platformKey = req.headers.get('X-Widget-Platform-Key');
  const sessionId = req.headers.get('X-Widget-Session-Id');

  if (!platformKey || !sessionId) {
    return null;
  }

  // Validate platform key format (non-empty string, reasonable length)
  if (platformKey.length < 10 || platformKey.length > 200) {
    return null;
  }

  // Validate session ID format (UUID or reasonable session identifier)
  if (sessionId.length < 8 || sessionId.length > 200) {
    return null;
  }

  return { platformKey, sessionId };
}

/**
 * Find or create a contact by session ID or email
 *
 * @param sessionId - Widget session identifier
 * @param email - Contact email (optional)
 * @param name - Contact name (optional)
 * @param platform - Platform identifier
 * @param customAttributes - Custom metadata
 * @returns Contact ID
 */
async function findOrCreateContact(
  sessionId: string,
  email?: string,
  name?: string,
  platform: Platform = 'ozean_licht',
  customAttributes: Record<string, unknown> = {}
): Promise<DBContact> {
  // First, try to find existing contact by session ID in custom_attributes
  const findBySessionSql = `
    SELECT *
    FROM contacts
    WHERE custom_attributes->>'sessionId' = $1
      AND platform = $2
    LIMIT 1
  `;

  const existingBySession = await query<DBContact>(findBySessionSql, [sessionId, platform]);

  if (existingBySession.length > 0) {
    const contact = existingBySession[0];

    // Update contact if email or name provided and different
    if ((email && email !== contact.email) || (name && name !== contact.name)) {
      const updateSql = `
        UPDATE contacts
        SET
          email = COALESCE($1, email),
          name = COALESCE($2, name),
          custom_attributes = custom_attributes || $3::jsonb,
          last_activity_at = NOW(),
          updated_at = NOW()
        WHERE id = $4
        RETURNING *
      `;

      const updated = await query<DBContact>(updateSql, [
        email || null,
        name || null,
        JSON.stringify({ ...customAttributes, sessionId }),
        contact.id,
      ]);

      return updated[0];
    }

    return contact;
  }

  // If email provided, try to find by email
  if (email) {
    const findByEmailSql = `
      SELECT *
      FROM contacts
      WHERE email = $1 AND platform = $2
      LIMIT 1
    `;

    const existingByEmail = await query<DBContact>(findByEmailSql, [email, platform]);

    if (existingByEmail.length > 0) {
      const contact = existingByEmail[0];

      // Update session ID in custom attributes
      const updateSql = `
        UPDATE contacts
        SET
          name = COALESCE($1, name),
          custom_attributes = custom_attributes || $2::jsonb,
          last_activity_at = NOW(),
          updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `;

      const updated = await query<DBContact>(updateSql, [
        name || null,
        JSON.stringify({ ...customAttributes, sessionId }),
        contact.id,
      ]);

      return updated[0];
    }
  }

  // Create new contact
  const createSql = `
    INSERT INTO contacts (
      email,
      name,
      platform,
      custom_attributes,
      last_activity_at
    ) VALUES ($1, $2, $3, $4, NOW())
    RETURNING *
  `;

  const created = await query<DBContact>(createSql, [
    email || null,
    name || null,
    platform,
    JSON.stringify({ ...customAttributes, sessionId }),
  ]);

  return created[0];
}

/**
 * Create a support conversation
 *
 * @param contactId - Contact UUID
 * @param sessionId - Widget session identifier
 * @param contactEmail - Contact email
 * @param contactName - Contact name
 * @param platform - Platform identifier
 * @returns Conversation ID
 */
async function createSupportConversation(
  contactId: string,
  sessionId: string,
  contactEmail?: string,
  contactName?: string,
  platform: Platform = 'ozean_licht'
): Promise<DBConversation> {
  const sql = `
    INSERT INTO conversations (
      type,
      status,
      platform,
      contact_id,
      contact_email,
      contact_name,
      channel,
      priority,
      metadata
    ) VALUES (
      'support',
      'open',
      $1,
      $2,
      $3,
      $4,
      'web_widget',
      'normal',
      $5::jsonb
    )
    RETURNING *
  `;

  const metadata = JSON.stringify({ sessionId });

  const rows = await query<DBConversation>(sql, [
    platform,
    contactId,
    contactEmail || null,
    contactName || null,
    metadata,
  ]);

  return rows[0];
}

/**
 * Add contact as participant to conversation
 *
 * @param conversationId - Conversation UUID
 * @param contactId - Contact UUID
 */
async function addContactParticipant(
  conversationId: string,
  contactId: string
): Promise<void> {
  const sql = `
    INSERT INTO conversation_participants (
      conversation_id,
      contact_id,
      role
    ) VALUES ($1, $2, 'member')
    ON CONFLICT (conversation_id, contact_id)
    DO NOTHING
  `;

  await execute(sql, [conversationId, contactId]);
}

/**
 * Verify contact has access to conversation
 *
 * @param conversationId - Conversation UUID
 * @param sessionId - Widget session identifier
 * @returns True if authorized, false otherwise
 */
async function verifyContactAccess(
  conversationId: string,
  sessionId: string
): Promise<boolean> {
  const sql = `
    SELECT EXISTS (
      SELECT 1
      FROM conversations c
      JOIN contacts ct ON c.contact_id = ct.id
      WHERE c.id = $1
        AND ct.custom_attributes->>'sessionId' = $2
    ) as has_access
  `;

  const rows = await query<{ has_access: boolean }>(sql, [conversationId, sessionId]);
  return rows.length > 0 && rows[0].has_access;
}

/**
 * Get conversation with messages
 *
 * @param conversationId - Conversation UUID
 * @returns Conversation with messages or null
 */
async function getConversationWithMessages(
  conversationId: string
): Promise<ConversationWithMessagesResponse | null> {
  // Get conversation
  const conversationSql = `
    SELECT *
    FROM conversations
    WHERE id = $1
  `;

  const conversations = await query<DBConversation>(conversationSql, [conversationId]);

  if (conversations.length === 0) {
    return null;
  }

  const conversation = conversations[0];

  // Get contact
  const contactSql = `
    SELECT *
    FROM contacts
    WHERE id = $1
  `;

  const contacts = await query<DBContact>(contactSql, [conversation.contact_id]);
  const contact = contacts.length > 0 ? contacts[0] : null;

  // Get messages
  const messagesSql = `
    SELECT *
    FROM messages
    WHERE conversation_id = $1
      AND deleted_at IS NULL
    ORDER BY created_at ASC
  `;

  const messages = await query<DBMessage>(messagesSql, [conversationId]);

  return {
    conversation: {
      id: conversation.id,
      type: conversation.type,
      status: conversation.status,
      platform: conversation.platform,
      contactId: conversation.contact_id || undefined,
      contactEmail: conversation.contact_email || undefined,
      contactName: conversation.contact_name || undefined,
      channel: conversation.channel || undefined,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
    },
    contact: {
      id: contact?.id || '',
      email: contact?.email || undefined,
      name: contact?.name || undefined,
    },
    messages: messages.map((msg) => ({
      id: msg.id,
      senderType: msg.sender_type,
      senderName: msg.sender_name || undefined,
      content: msg.content || undefined,
      contentType: msg.content_type,
      attachments: msg.attachments,
      createdAt: msg.created_at,
    })),
  };
}

/**
 * Add CORS headers for cross-origin requests from embedded widgets
 *
 * @param response - NextResponse
 * @param requestOrigin - Origin from request headers
 * @returns NextResponse with CORS headers
 */
function addCorsHeaders(response: NextResponse, requestOrigin: string | null): NextResponse {
  const corsHeaders = getWidgetCORSHeaders(requestOrigin);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * OPTIONS /api/widget/conversations
 * Handle CORS preflight requests
 */
export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response, req.headers.get('Origin'));
}

/**
 * POST /api/widget/conversations
 * Create a new support conversation from web widget
 *
 * Required headers:
 * - X-Widget-Platform-Key: Platform API key
 * - X-Widget-Session-Id: Session identifier
 *
 * Body:
 * - contactEmail?: string - Contact email (optional)
 * - contactName?: string - Contact name (optional)
 * - platform?: Platform - Platform identifier (default: ozean_licht)
 * - customAttributes?: Record<string, unknown> - Custom metadata (optional)
 *
 * Returns:
 * - conversationId: string - Created conversation ID
 * - contact: { id, email, name } - Contact information
 */
export async function POST(req: NextRequest) {
  const requestOrigin = req.headers.get('Origin');

  try {
    // Validate headers
    const headers = validateWidgetHeaders(req);
    if (!headers) {
      const response = NextResponse.json(
        { error: 'Missing or invalid required headers: X-Widget-Platform-Key, X-Widget-Session-Id' },
        { status: 401 }
      );
      return addCorsHeaders(response, requestOrigin);
    }

    const { platformKey, sessionId } = headers;

    // Validate platform key
    const platformValidation = validatePlatformKey(platformKey);
    if (!platformValidation.valid) {
      const response = NextResponse.json(
        { error: 'Invalid platform key' },
        { status: 403 }
      );
      return addCorsHeaders(response, requestOrigin);
    }

    // Parse request body
    let body: CreateConversationBody;
    try {
      body = await req.json();
    } catch (error) {
      const response = NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
      return addCorsHeaders(response, requestOrigin);
    }

    const {
      contactEmail,
      contactName,
      platform = 'ozean_licht',
      customAttributes = {},
    } = body;

    // Validate custom attributes size
    const MAX_CUSTOM_ATTRIBUTES_SIZE = 10 * 1024; // 10KB

    if (customAttributes) {
      const attributesSize = JSON.stringify(customAttributes).length;
      if (attributesSize > MAX_CUSTOM_ATTRIBUTES_SIZE) {
        const response = NextResponse.json(
          { error: 'Custom attributes too large (max 10KB)' },
          { status: 400 }
        );
        return addCorsHeaders(response, requestOrigin);
      }
    }

    // Validate email format if provided
    if (contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail)) {
        const response = NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
        return addCorsHeaders(response, requestOrigin);
      }

      // Max email length
      if (contactEmail.length > 255) {
        const response = NextResponse.json(
          { error: 'Email too long (max 255 characters)' },
          { status: 400 }
        );
        return addCorsHeaders(response, requestOrigin);
      }
    }

    // Validate name length if provided
    if (contactName && contactName.length > 255) {
      const response = NextResponse.json(
        { error: 'Name too long (max 255 characters)' },
        { status: 400 }
      );
      return addCorsHeaders(response, requestOrigin);
    }

    // Validate platform
    const validPlatforms: Platform[] = ['ozean_licht', 'kids_ascension'];
    if (!validPlatforms.includes(platform)) {
      const response = NextResponse.json(
        { error: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}` },
        { status: 400 }
      );
      return addCorsHeaders(response, requestOrigin);
    }

    // Find or create contact
    const contact = await findOrCreateContact(
      sessionId,
      contactEmail,
      contactName,
      platform,
      customAttributes
    );

    // Create conversation
    const conversation = await createSupportConversation(
      contact.id,
      sessionId,
      contact.email || undefined,
      contact.name || undefined,
      platform
    );

    // Add contact as participant
    await addContactParticipant(conversation.id, contact.id);

    const responseData: ConversationResponse = {
      conversationId: conversation.id,
      contact: {
        id: contact.id,
        email: contact.email || undefined,
        name: contact.name || undefined,
      },
    };

    const response = NextResponse.json(responseData, { status: 201 });
    return addCorsHeaders(response, requestOrigin);
  } catch (error) {
    console.error('[Widget API] Failed to create conversation:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return addCorsHeaders(response, req.headers.get('Origin'));
  }
}

/**
 * GET /api/widget/conversations?id={conversationId}
 * Get conversation with messages
 *
 * Required headers:
 * - X-Widget-Platform-Key: Platform API key
 * - X-Widget-Session-Id: Session identifier
 *
 * Query parameters:
 * - id: Conversation UUID
 *
 * Returns:
 * - conversation: Conversation object
 * - contact: Contact information
 * - messages: Array of messages
 */
export async function GET(req: NextRequest) {
  const requestOrigin = req.headers.get('Origin');

  try {
    // Validate headers
    const headers = validateWidgetHeaders(req);
    if (!headers) {
      const response = NextResponse.json(
        { error: 'Missing or invalid required headers: X-Widget-Platform-Key, X-Widget-Session-Id' },
        { status: 401 }
      );
      return addCorsHeaders(response, requestOrigin);
    }

    const { platformKey, sessionId } = headers;

    // Validate platform key
    const platformValidation = validatePlatformKey(platformKey);
    if (!platformValidation.valid) {
      const response = NextResponse.json(
        { error: 'Invalid platform key' },
        { status: 403 }
      );
      return addCorsHeaders(response, requestOrigin);
    }

    // Get conversation ID from query params
    const searchParams = req.nextUrl.searchParams;
    const conversationId = searchParams.get('id');

    if (!conversationId) {
      const response = NextResponse.json(
        { error: 'Missing conversation ID parameter' },
        { status: 400 }
      );
      return addCorsHeaders(response, requestOrigin);
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(conversationId)) {
      const response = NextResponse.json(
        { error: 'Invalid conversation ID format' },
        { status: 400 }
      );
      return addCorsHeaders(response, requestOrigin);
    }

    // Verify access
    const hasAccess = await verifyContactAccess(conversationId, sessionId);
    if (!hasAccess) {
      const response = NextResponse.json(
        { error: 'Access denied to this conversation' },
        { status: 403 }
      );
      return addCorsHeaders(response, requestOrigin);
    }

    // Get conversation with messages
    const data = await getConversationWithMessages(conversationId);

    if (!data) {
      const response = NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
      return addCorsHeaders(response, requestOrigin);
    }

    const response = NextResponse.json(data);
    return addCorsHeaders(response, requestOrigin);
  } catch (error) {
    console.error('[Widget API] Failed to get conversation:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return addCorsHeaders(response, req.headers.get('Origin'));
  }
}
