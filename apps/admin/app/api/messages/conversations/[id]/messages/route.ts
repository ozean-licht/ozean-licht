/**
 * Conversation Messages API
 * GET /api/messages/conversations/[id]/messages - Get messages for conversation with pagination
 * POST /api/messages/conversations/[id]/messages - Create new message
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getMessagesByConversation,
  createMessage,
} from '@/lib/db/messages';
import { recordFirstResponse, isUserParticipant } from '@/lib/db/conversations';
import { messageRateLimiter, checkRateLimit } from '@/lib/rate-limit';
import type {
  MessageSenderType,
  MessageContentType,
  CreateMessageInput,
} from '../../../../../../types/messaging';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/messages/conversations/[id]/messages
 * Get messages for a conversation with pagination and filtering
 *
 * Query parameters:
 * - limit: Results per page (default: 50, max: 100)
 * - offset: Pagination offset (default: 0)
 * - threadId: Filter by thread ID (null for top-level messages only)
 * - senderType: Filter by sender type (agent, contact, bot, system)
 * - includePrivate: Include private messages (default: false)
 * - before: ISO date string - messages before this timestamp
 * - after: ISO date string - messages after this timestamp
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // SECURITY: Verify user is a participant before showing messages
    const isParticipant = await isUserParticipant(id, session.user.id);
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden - you are not a participant in this conversation' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const threadId = searchParams.get('threadId');
    const senderType = searchParams.get('senderType') as MessageSenderType | null;
    const includePrivate = searchParams.get('includePrivate') === 'true';
    const beforeStr = searchParams.get('before');
    const afterStr = searchParams.get('after');

    // Validate pagination parameters
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: 'Limit must be a positive number' },
        { status: 400 }
      );
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { error: 'Offset must be zero or a positive number' },
        { status: 400 }
      );
    }

    // Validate sender type if provided
    if (senderType) {
      const validSenderTypes: MessageSenderType[] = ['agent', 'contact', 'bot', 'system'];
      if (!validSenderTypes.includes(senderType)) {
        return NextResponse.json(
          { error: `Invalid sender type. Must be one of: ${validSenderTypes.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Parse date filters
    const before = beforeStr ? new Date(beforeStr) : undefined;
    const after = afterStr ? new Date(afterStr) : undefined;

    // Validate dates
    if (before && isNaN(before.getTime())) {
      return NextResponse.json(
        { error: 'Invalid before date format. Use ISO 8601 format.' },
        { status: 400 }
      );
    }

    if (after && isNaN(after.getTime())) {
      return NextResponse.json(
        { error: 'Invalid after date format. Use ISO 8601 format.' },
        { status: 400 }
      );
    }

    // Fetch messages
    const result = await getMessagesByConversation({
      conversationId: id,
      threadId: (threadId && threadId !== 'null') ? threadId : undefined,
      senderType: senderType || undefined,
      includePrivate,
      limit,
      offset,
      before,
      after,
    });

    return NextResponse.json({
      messages: result.messages,
      total: result.total,
      hasMore: result.hasMore,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[API] Failed to fetch messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages/conversations/[id]/messages
 * Create a new message in the conversation
 *
 * Body parameters:
 * - senderType: Sender type (agent, contact, bot, system)
 * - senderId: Sender user/contact ID - optional
 * - senderName: Sender display name - optional
 * - content: Message content - required for text messages
 * - contentType: Content type (text, image, file, system) - optional, defaults to text
 * - threadId: Parent message ID for threaded replies - optional
 * - isPrivate: Private message flag - optional, defaults to false
 * - mentions: Array of user IDs mentioned - optional
 * - attachments: Array of attachment objects - optional
 * - externalId: External message ID (for integrations) - optional
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // SECURITY: Apply rate limiting (30 messages per minute per user)
    const rateLimit = checkRateLimit(messageRateLimiter, session.user.id);
    if (rateLimit.isLimited) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          resetInSeconds: Math.ceil(rateLimit.resetInMs / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateLimit.resetInMs / 1000).toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          },
        }
      );
    }

    // SECURITY: Verify user is a participant before allowing message creation
    const isParticipant = await isUserParticipant(id, session.user.id);
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden - you are not a participant in this conversation' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      senderType,
      senderId,
      senderName,
      content,
      contentType,
      threadId,
      isPrivate,
      mentions,
      attachments,
      externalId,
    } = body;

    // Validate required fields
    if (!senderType) {
      return NextResponse.json(
        { error: 'senderType is required' },
        { status: 400 }
      );
    }

    // Validate sender type
    const validSenderTypes: MessageSenderType[] = ['agent', 'contact', 'bot', 'system'];
    if (!validSenderTypes.includes(senderType)) {
      return NextResponse.json(
        { error: `Invalid sender type. Must be one of: ${validSenderTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate content type if provided
    if (contentType) {
      const validContentTypes: MessageContentType[] = ['text', 'image', 'file', 'system'];
      if (!validContentTypes.includes(contentType)) {
        return NextResponse.json(
          { error: `Invalid content type. Must be one of: ${validContentTypes.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Validate content is provided for text messages
    if ((!contentType || contentType === 'text') && !content && (!attachments || attachments.length === 0)) {
      return NextResponse.json(
        { error: 'Content or attachments are required' },
        { status: 400 }
      );
    }

    // Validate mentions is an array if provided
    if (mentions !== undefined && !Array.isArray(mentions)) {
      return NextResponse.json(
        { error: 'Mentions must be an array' },
        { status: 400 }
      );
    }

    // Validate attachments is an array if provided
    if (attachments !== undefined && !Array.isArray(attachments)) {
      return NextResponse.json(
        { error: 'Attachments must be an array' },
        { status: 400 }
      );
    }

    // SECURITY: Sanitize content - strip HTML tags to prevent XSS
    // Plain text only for messaging system
    const sanitizedContent = content?.replace(/<[^>]*>/g, '') || '';

    // Create the message
    const messageInput: CreateMessageInput = {
      conversationId: id,
      senderType,
      senderId,
      senderName,
      content: sanitizedContent,
      contentType,
      threadId,
      isPrivate,
      mentions,
      attachments,
      externalId,
    };

    const message = await createMessage(messageInput);

    // Record first response time if this is an agent message
    if (senderType === 'agent') {
      await recordFirstResponse(id);
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('[API] Failed to create message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
