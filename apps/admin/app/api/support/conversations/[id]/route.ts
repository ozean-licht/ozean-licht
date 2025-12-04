/**
 * Single Conversation API
 * GET /api/support/conversations/[id] - Get conversation by ID with messages
 * PATCH /api/support/conversations/[id] - Update conversation
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getConversationById,
  updateConversation,
} from '@/lib/db/support-conversations';
import type {
  ConversationStatus,
  ConversationPriority,
  Team,
  UpdateConversationInput,
} from '@/types/support';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/support/conversations/[id]
 * Fetch a single conversation by ID with its messages
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Fetch the conversation with messages
    const conversation = await getConversationById(id);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('[API] Failed to fetch conversation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/support/conversations/[id]
 * Update a conversation by ID
 *
 * Body parameters:
 * - status: Conversation status (open, resolved, pending, snoozed)
 * - team: Assigned team (tech, sales, spiritual, general)
 * - priority: Priority level (low, normal, high, urgent)
 * - labels: Array of label strings
 * - assignedAgentId: UUID of assigned agent
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate enum values if provided
    const validStatuses: ConversationStatus[] = ['open', 'resolved', 'pending', 'snoozed'];
    const validPriorities: ConversationPriority[] = ['low', 'normal', 'high', 'urgent'];
    const validTeams: Team[] = ['tech', 'sales', 'spiritual', 'general'];

    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.priority && !validPriorities.includes(body.priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.team && !validTeams.includes(body.team)) {
      return NextResponse.json(
        { error: `Invalid team. Must be one of: ${validTeams.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate labels is an array if provided
    if (body.labels !== undefined && !Array.isArray(body.labels)) {
      return NextResponse.json(
        { error: 'Labels must be an array' },
        { status: 400 }
      );
    }

    // Build update input object
    const updates: UpdateConversationInput = {};

    if (body.status !== undefined) {
      updates.status = body.status;
    }

    if (body.team !== undefined) {
      updates.team = body.team;
    }

    if (body.priority !== undefined) {
      updates.priority = body.priority;
    }

    if (body.labels !== undefined) {
      updates.labels = body.labels;
    }

    if (body.assignedAgentId !== undefined) {
      updates.assignedAgentId = body.assignedAgentId;
    }

    // Check if there are any valid fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update the conversation
    const conversation = await updateConversation(id, updates);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('[API] Failed to update conversation:', error);
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
}
