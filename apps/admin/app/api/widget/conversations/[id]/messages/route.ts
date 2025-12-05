/**
 * Widget Conversations Messages API
 *
 * PUBLIC endpoint for widget message operations using widget headers for authentication.
 *
 * GET /api/widget/conversations/[id]/messages - Get messages for conversation
 * POST /api/widget/conversations/[id]/messages - Send message
 *
 * Required headers:
 * - X-Widget-Platform-Key: Platform API key
 * - X-Widget-Session-Id: Unique session identifier
 */

import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db/index';
import { getWidgetCORSHeaders } from '@/lib/widget/cors';

// ============================================================================
// Types
// ============================================================================

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface Attachment {
  id: string;
  type: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderType: 'agent' | 'contact' | 'bot' | 'system';
  senderName: string | null;
  content: string;
  contentType: 'text' | 'image' | 'file' | 'system';
  attachments: Attachment[];
  createdAt: string; // ISO date
}

interface Contact {
  id: string;
  email?: string;
  name?: string;
  platform: string;
}

interface DBMessage {
  id: string;
  conversation_id: string;
  sender_type: string;
  sender_name: string | null;
  content: string | null;
  content_type: string;
  attachments: unknown;
  created_at: string;
}

interface DBContact {
  id: string;
  email: string | null;
  name: string | null;
  platform: string;
}

// ============================================================================
// Widget Authentication & Validation
// ============================================================================

/**
 * Validate widget authentication headers
 * Returns error response if validation fails, null if valid
 */
function validateWidgetHeaders(request: NextRequest): NextResponse | null {
  const platformKey = request.headers.get('X-Widget-Platform-Key');
  const sessionId = request.headers.get('X-Widget-Session-Id');
  const requestOrigin = request.headers.get('Origin');

  if (!platformKey || !sessionId) {
    return NextResponse.json(
      { error: 'Missing required widget headers: X-Widget-Platform-Key and X-Widget-Session-Id' },
      {
        status: 401,
        headers: getCORSHeaders(requestOrigin),
      }
    );
  }

  // Validate platform key format
  if (typeof platformKey !== 'string' || platformKey.length < 10) {
    return NextResponse.json(
      { error: 'Invalid X-Widget-Platform-Key format' },
      {
        status: 401,
        headers: getCORSHeaders(requestOrigin),
      }
    );
  }

  // Validate session ID format
  if (typeof sessionId !== 'string' || sessionId.length < 10) {
    return NextResponse.json(
      { error: 'Invalid X-Widget-Session-Id format' },
      {
        status: 401,
        headers: getCORSHeaders(requestOrigin),
      }
    );
  }

  return null; // Valid
}

/**
 * Get CORS headers for widget requests
 */
function getCORSHeaders(requestOrigin: string | null): HeadersInit {
  return getWidgetCORSHeaders(requestOrigin);
}

// ============================================================================
// Contact Management
// ============================================================================

/**
 * Find or create contact for widget session
 * Uses session metadata stored in conversation to identify contact
 */
async function findOrCreateContactForSession(
  sessionId: string,
  conversationId: string,
  platform: string = 'ozean_licht'
): Promise<Contact | null> {
  try {
    // First, try to get contact from conversation
    const conversationRows = await query<{ contact_id: string | null }>(
      `SELECT contact_id FROM conversations WHERE id = $1`,
      [conversationId]
    );

    if (conversationRows.length === 0) {
      return null; // Conversation not found
    }

    const contactId = conversationRows[0].contact_id;

    if (contactId) {
      // Fetch existing contact
      const contactRows = await query<DBContact>(
        `SELECT id, email, name, platform FROM contacts WHERE id = $1`,
        [contactId]
      );

      if (contactRows.length > 0) {
        const contact = contactRows[0];
        return {
          id: contact.id,
          email: contact.email || undefined,
          name: contact.name || undefined,
          platform: contact.platform,
        };
      }
    }

    // Contact not found - create anonymous contact for this session
    // In a real implementation, you might store session->contact mapping
    const newContactRows = await query<DBContact>(
      `INSERT INTO contacts (platform, custom_attributes, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING id, email, name, platform`,
      [platform, { sessionId, source: 'widget' }]
    );

    if (newContactRows.length > 0) {
      const contact = newContactRows[0];

      // Update conversation with new contact
      await execute(
        `UPDATE conversations SET contact_id = $1, updated_at = NOW() WHERE id = $2`,
        [contact.id, conversationId]
      );

      return {
        id: contact.id,
        email: contact.email || undefined,
        name: contact.name || undefined,
        platform: contact.platform,
      };
    }

    return null;
  } catch (error) {
    console.error('[Widget API] Failed to find/create contact:', error);
    return null;
  }
}

/**
 * Verify session has access to conversation
 * For widget, we check if the conversation is a support ticket with web_widget channel
 */
async function verifySessionAccess(
  conversationId: string,
  sessionId: string
): Promise<boolean> {
  try {
    const rows = await query<{
      type: string;
      channel: string | null;
      metadata: unknown;
    }>(
      `SELECT type, channel, metadata FROM conversations WHERE id = $1`,
      [conversationId]
    );

    if (rows.length === 0) {
      return false; // Conversation doesn't exist
    }

    const conversation = rows[0];

    // Only allow access to support conversations via web_widget channel
    if (conversation.type !== 'support' || conversation.channel !== 'web_widget') {
      return false;
    }

    // Additional validation: check if session matches metadata
    // This is a simple implementation - in production you'd want more robust session tracking
    const metadata = conversation.metadata as Record<string, unknown> | null;
    if (metadata && metadata.sessionId && metadata.sessionId !== sessionId) {
      return false; // Session mismatch
    }

    return true;
  } catch (error) {
    console.error('[Widget API] Failed to verify session access:', error);
    return false;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Escape HTML entities to prevent XSS attacks
 * Preserves original content while making it safe for rendering
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Transform database message to API message format
 */
function transformMessage(row: DBMessage): Message {
  // Parse attachments from JSONB
  let attachments: Attachment[] = [];
  if (row.attachments && Array.isArray(row.attachments)) {
    attachments = row.attachments as Attachment[];
  }

  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderType: row.sender_type as 'agent' | 'contact' | 'bot' | 'system',
    senderName: row.sender_name,
    content: row.content || '',
    contentType: row.content_type as 'text' | 'image' | 'file' | 'system',
    attachments,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCORSHeaders(request.headers.get('Origin')),
  });
}

/**
 * GET /api/widget/conversations/[id]/messages
 * Get messages for a conversation with pagination
 *
 * Query parameters:
 * - before: Message ID or timestamp for pagination (optional)
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const requestOrigin = request.headers.get('Origin');

  // Validate widget headers
  const validationError = validateWidgetHeaders(request);
  if (validationError) {
    return validationError;
  }

  const sessionId = request.headers.get('X-Widget-Session-Id')!;

  try {
    const { id: conversationId } = await params;

    // Verify session has access to conversation
    const hasAccess = await verifySessionAccess(conversationId, sessionId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied - invalid conversation or session' },
        {
          status: 403,
          headers: getCORSHeaders(requestOrigin),
        }
      );
    }

    // Get pagination cursor
    const searchParams = request.nextUrl.searchParams;
    const beforeCursor = searchParams.get('before');

    // Build query
    const conditions: string[] = [
      'conversation_id = $1',
      'deleted_at IS NULL',
      'is_private = FALSE', // Don't show private/internal messages to widget users
    ];
    const queryParams: unknown[] = [conversationId];
    let paramIndex = 2;

    // Add before cursor for pagination
    if (beforeCursor) {
      conditions.push(`created_at < (SELECT created_at FROM messages WHERE id = $${paramIndex})`);
      queryParams.push(beforeCursor);
      paramIndex++;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    // Fetch messages (limit 50, ordered newest first)
    const limit = 50;
    queryParams.push(limit + 1); // Fetch one extra to check hasMore
    const limitParam = paramIndex;

    const sql = `
      SELECT
        id, conversation_id, sender_type, sender_name, content, content_type,
        attachments, created_at
      FROM messages
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${limitParam}
    `;

    const rows = await query<DBMessage>(sql, queryParams);

    // Check if there are more messages
    const hasMore = rows.length > limit;
    const messages = rows.slice(0, limit).map(transformMessage);

    return NextResponse.json(
      {
        messages,
        hasMore,
      },
      {
        headers: getCORSHeaders(requestOrigin),
      }
    );
  } catch (error) {
    console.error('[Widget API] Failed to fetch messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      {
        status: 500,
        headers: getCORSHeaders(request.headers.get('Origin')),
      }
    );
  }
}

/**
 * POST /api/widget/conversations/[id]/messages
 * Send a message in the conversation
 *
 * Body parameters:
 * - content: Message content (required unless attachments provided)
 * - attachments: Array of attachment objects (optional)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  const requestOrigin = request.headers.get('Origin');

  // Validate widget headers
  const validationError = validateWidgetHeaders(request);
  if (validationError) {
    return validationError;
  }

  const sessionId = request.headers.get('X-Widget-Session-Id')!;
  const platformKey = request.headers.get('X-Widget-Platform-Key')!;

  try {
    const { id: conversationId } = await params;

    // Verify session has access to conversation
    const hasAccess = await verifySessionAccess(conversationId, sessionId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied - invalid conversation or session' },
        {
          status: 403,
          headers: getCORSHeaders(requestOrigin),
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { content, attachments } = body;

    // Validate input
    if (!content && (!attachments || attachments.length === 0)) {
      return NextResponse.json(
        { error: 'Content or attachments are required' },
        {
          status: 400,
          headers: getCORSHeaders(requestOrigin),
        }
      );
    }

    // Validate content is not empty string
    if (content !== undefined && typeof content === 'string' && content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content cannot be empty' },
        {
          status: 400,
          headers: getCORSHeaders(requestOrigin),
        }
      );
    }

    // Validate attachments array if provided
    if (attachments !== undefined && !Array.isArray(attachments)) {
      return NextResponse.json(
        { error: 'Attachments must be an array' },
        {
          status: 400,
          headers: getCORSHeaders(requestOrigin),
        }
      );
    }

    // Determine platform from platform key (simplified - in production, validate against database)
    const platform = platformKey.includes('kids') ? 'kids_ascension' : 'ozean_licht';

    // Find or create contact for this session
    const contact = await findOrCreateContactForSession(sessionId, conversationId, platform);
    if (!contact) {
      return NextResponse.json(
        { error: 'Failed to identify contact for session' },
        {
          status: 500,
          headers: getCORSHeaders(requestOrigin),
        }
      );
    }

    // Sanitize content - escape HTML entities to prevent XSS
    const sanitizedContent = content ? escapeHtml(content) : null;

    // Prepare attachments JSONB
    const attachmentsJson = attachments && attachments.length > 0
      ? JSON.stringify(attachments)
      : '[]';

    // Insert message
    const messageRows = await query<DBMessage>(
      `INSERT INTO messages (
        conversation_id, sender_type, sender_id, sender_name,
        content, content_type, attachments, is_private,
        mentions, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, NOW()
      )
      RETURNING id, conversation_id, sender_type, sender_name,
                content, content_type, attachments, created_at`,
      [
        conversationId,
        'contact',
        contact.id,
        contact.name || contact.email || 'Guest',
        sanitizedContent,
        'text',
        attachmentsJson,
        false, // is_private
        [], // mentions
      ]
    );

    if (messageRows.length === 0) {
      throw new Error('Failed to insert message');
    }

    // Update conversation updated_at timestamp
    await execute(
      `UPDATE conversations SET updated_at = NOW() WHERE id = $1`,
      [conversationId]
    );

    // Transform and return the created message
    const message = transformMessage(messageRows[0]);

    return NextResponse.json(
      { message },
      {
        status: 201,
        headers: getCORSHeaders(requestOrigin),
      }
    );
  } catch (error) {
    console.error('[Widget API] Failed to send message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      {
        status: 500,
        headers: getCORSHeaders(request.headers.get('Origin')),
      }
    );
  }
}
