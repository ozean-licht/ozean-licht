/**
 * Chatwoot Webhook Endpoint
 * Receives events from Chatwoot for conversation and message sync
 *
 * POST /api/support/webhooks/chatwoot
 *
 * Supported events:
 * - conversation_created: New conversation started
 * - conversation_status_changed: Status updated (open, resolved, pending, snoozed)
 * - conversation_updated: Labels, team, or assignee changed
 * - message_created: New message in conversation
 *
 * @see https://www.chatwoot.com/docs/product/channels/api/send-messages
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  syncConversationFromChatwoot,
  getConversationByChatwootId,
  updateConversation,
  resolveConversation,
  recordFirstResponse,
} from '@/lib/db/support-conversations';
import { syncMessageFromChatwoot } from '@/lib/db/support-messages';
import type {
  ChatwootWebhookEvent,
  ConversationCreatedEvent,
  ConversationStatusChangedEvent,
  ConversationUpdatedEvent,
  MessageCreatedEvent,
  Channel,
  ConversationStatus,
  MessageSenderType,
} from '@/types/support';

// Webhook secret for HMAC signature verification
const WEBHOOK_SECRET = process.env.CHATWOOT_WEBHOOK_SECRET;

// Rate limiting configuration (simple in-memory store)
// In production, consider using Redis or a dedicated rate limiting service
const MAX_PAYLOAD_SIZE = 1 * 1024 * 1024; // 1MB max payload size
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 100; // Max 100 requests per minute
const requestTracker = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limiting check
 * Returns true if request should be allowed, false if rate limit exceeded
 */
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const tracker = requestTracker.get(identifier);

  if (!tracker || now > tracker.resetAt) {
    // New window or expired window
    requestTracker.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (tracker.count >= MAX_REQUESTS_PER_WINDOW) {
    // Rate limit exceeded
    return false;
  }

  // Increment count
  tracker.count++;
  return true;
}

// Clean up expired entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, tracker] of requestTracker.entries()) {
    if (now > tracker.resetAt) {
      requestTracker.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Verify Chatwoot webhook signature
 * Chatwoot sends HMAC-SHA256 signature in X-Chatwoot-Signature header
 */
function verifySignature(payload: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn('[Chatwoot Webhook] No webhook secret configured, skipping verification');
    return true;
  }

  if (!signature) {
    console.error('[Chatwoot Webhook] Missing signature header');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Map Chatwoot channel type to our channel enum
 */
function mapChannel(channelType: string): Channel {
  const channelMap: Record<string, Channel> = {
    'Channel::WebWidget': 'web_widget',
    'Channel::Whatsapp': 'whatsapp',
    'Channel::Email': 'email',
    'Channel::Telegram': 'telegram',
    'web_widget': 'web_widget',
    'whatsapp': 'whatsapp',
    'email': 'email',
    'telegram': 'telegram',
  };
  return channelMap[channelType] || 'web_widget';
}

/**
 * Map Chatwoot status to our status enum
 */
function mapStatus(status: string): ConversationStatus {
  const statusMap: Record<string, ConversationStatus> = {
    'open': 'open',
    'resolved': 'resolved',
    'pending': 'pending',
    'snoozed': 'snoozed',
  };
  return statusMap[status] || 'open';
}

/**
 * Map Chatwoot message sender type to our enum
 */
function mapSenderType(messageType: number): MessageSenderType {
  // Chatwoot message_type: 0 = incoming (contact), 1 = outgoing (agent), 2 = activity, 3 = template
  if (messageType === 0) return 'contact';
  if (messageType === 1) return 'agent';
  return 'bot';
}

/**
 * Handle conversation_created event
 */
async function handleConversationCreated(event: ConversationCreatedEvent): Promise<void> {
  const { conversation } = event;

  await syncConversationFromChatwoot({
    chatwootId: conversation.id,
    contactEmail: conversation.contact?.email,
    contactName: conversation.contact?.name,
    channel: mapChannel(conversation.inbox?.channel_type || 'web_widget'),
    status: mapStatus(conversation.status),
    labels: conversation.labels || [],
    assigneeEmail: conversation.assignee?.email,
  });

  console.log(`[Chatwoot Webhook] Created conversation ${conversation.id}`);
}

/**
 * Handle conversation_status_changed event
 */
async function handleConversationStatusChanged(event: ConversationStatusChangedEvent): Promise<void> {
  const { conversation } = event;
  const newStatus = mapStatus(conversation.status);

  const existing = await getConversationByChatwootId(conversation.id);
  if (!existing) {
    // Conversation doesn't exist locally, create it
    await syncConversationFromChatwoot({
      chatwootId: conversation.id,
      contactEmail: conversation.contact?.email,
      contactName: conversation.contact?.name,
      channel: mapChannel(conversation.inbox?.channel_type || 'web_widget'),
      status: newStatus,
      labels: conversation.labels || [],
      assigneeEmail: conversation.assignee?.email,
    });
    console.log(`[Chatwoot Webhook] Created missing conversation ${conversation.id} with status ${newStatus}`);
    return;
  }

  if (newStatus === 'resolved') {
    await resolveConversation(existing.id);
    console.log(`[Chatwoot Webhook] Resolved conversation ${conversation.id}`);
  } else {
    await updateConversation(existing.id, { status: newStatus });
    console.log(`[Chatwoot Webhook] Updated conversation ${conversation.id} status to ${newStatus}`);
  }
}

/**
 * Handle conversation_updated event
 */
async function handleConversationUpdated(event: ConversationUpdatedEvent): Promise<void> {
  const { conversation } = event;

  const existing = await getConversationByChatwootId(conversation.id);
  if (!existing) {
    // Conversation doesn't exist locally, create it
    await syncConversationFromChatwoot({
      chatwootId: conversation.id,
      contactEmail: conversation.contact?.email,
      contactName: conversation.contact?.name,
      channel: mapChannel(conversation.inbox?.channel_type || 'web_widget'),
      status: mapStatus(conversation.status),
      labels: conversation.labels || [],
      assigneeEmail: conversation.assignee?.email,
    });
    console.log(`[Chatwoot Webhook] Created missing conversation ${conversation.id}`);
    return;
  }

  // Update labels and assignee
  await syncConversationFromChatwoot({
    chatwootId: conversation.id,
    contactEmail: conversation.contact?.email,
    contactName: conversation.contact?.name,
    channel: mapChannel(conversation.inbox?.channel_type || 'web_widget'),
    status: mapStatus(conversation.status),
    labels: conversation.labels || [],
    assigneeEmail: conversation.assignee?.email,
  });

  console.log(`[Chatwoot Webhook] Updated conversation ${conversation.id}`);
}

/**
 * Handle message_created event
 */
async function handleMessageCreated(event: MessageCreatedEvent): Promise<void> {
  const { message, conversation } = event;

  // Ensure conversation exists
  let existingConversation = await getConversationByChatwootId(conversation.id);
  if (!existingConversation) {
    // Create the conversation first
    existingConversation = await syncConversationFromChatwoot({
      chatwootId: conversation.id,
      contactEmail: conversation.contact?.email,
      contactName: conversation.contact?.name,
      channel: mapChannel(conversation.inbox?.channel_type || 'web_widget'),
      status: mapStatus(conversation.status || 'open'),
      labels: conversation.labels || [],
      assigneeEmail: conversation.assignee?.email,
    });
    console.log(`[Chatwoot Webhook] Created missing conversation ${conversation.id} for message`);
  }

  // Sync the message
  await syncMessageFromChatwoot({
    conversationId: existingConversation.id,
    chatwootId: message.id,
    senderType: mapSenderType(message.message_type),
    senderName: message.sender?.name,
    content: message.content,
    messageType: 'text', // Chatwoot provides content_type but we simplify
    isPrivate: message.private || false,
    createdAt: message.created_at ? new Date(message.created_at * 1000).toISOString() : undefined,
  });

  // Record first response time if this is an agent message and first response not recorded
  if (message.message_type === 1 && !existingConversation.firstResponseAt) {
    await recordFirstResponse(existingConversation.id);
    console.log(`[Chatwoot Webhook] Recorded first response for conversation ${conversation.id}`);
  }

  console.log(`[Chatwoot Webhook] Synced message ${message.id} for conversation ${conversation.id}`);
}

/**
 * Main webhook handler
 */
export async function POST(request: NextRequest) {
  try {
    // Check payload size before reading body
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_SIZE) {
      console.error(`[Chatwoot Webhook] Payload too large: ${contentLength} bytes`);
      return NextResponse.json(
        { error: 'Payload Too Large', message: 'Request body exceeds maximum size of 1MB' },
        { status: 413 }
      );
    }

    // Rate limiting check (use IP address as identifier)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      console.error(`[Chatwoot Webhook] Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Verify signature
    const signature = request.headers.get('x-chatwoot-signature');
    if (!verifySignature(rawBody, signature)) {
      console.error('[Chatwoot Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse the webhook event
    const event = JSON.parse(rawBody) as ChatwootWebhookEvent;

    // Runtime validation - check required fields exist
    if (!event || typeof event !== 'object') {
      console.error('[Chatwoot Webhook] Invalid event payload: not an object');
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid event payload' },
        { status: 400 }
      );
    }

    if (!event.event || typeof event.event !== 'string') {
      console.error('[Chatwoot Webhook] Invalid event payload: missing or invalid event type');
      return NextResponse.json(
        { error: 'Bad Request', message: 'Missing or invalid event type' },
        { status: 400 }
      );
    }

    // Log event for debugging
    console.log(`[Chatwoot Webhook] Received event: ${event.event}`);

    // Route to appropriate handler based on event type
    switch (event.event) {
      case 'conversation_created':
        await handleConversationCreated(event as ConversationCreatedEvent);
        break;

      case 'conversation_status_changed':
        await handleConversationStatusChanged(event as ConversationStatusChangedEvent);
        break;

      case 'conversation_updated':
        await handleConversationUpdated(event as ConversationUpdatedEvent);
        break;

      case 'message_created':
        await handleMessageCreated(event as MessageCreatedEvent);
        break;

      default:
        console.log(`[Chatwoot Webhook] Ignoring unhandled event type: ${(event as { event: string }).event}`);
    }

    // Return 200 OK quickly to acknowledge receipt
    return NextResponse.json({
      success: true,
      event: event.event,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[Chatwoot Webhook] Error processing webhook:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'chatwoot-webhook',
    configured: !!WEBHOOK_SECRET,
    timestamp: new Date().toISOString(),
  });
}
