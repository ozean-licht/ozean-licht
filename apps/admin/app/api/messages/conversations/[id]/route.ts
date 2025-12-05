/**
 * Single Conversation API
 * GET /api/messages/conversations/[id] - Get conversation by ID with participants
 * PATCH /api/messages/conversations/[id] - Update conversation
 * DELETE /api/messages/conversations/[id] - Archive conversation
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getConversationById,
  updateConversation,
  deleteConversation,
  isUserParticipant,
} from '@/lib/db/conversations';
import type {
  ConversationStatus,
  Priority,
  AssignedTeam,
  UpdateConversationInput,
} from '@/lib/db/conversations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/messages/conversations/[id]
 * Fetch a single conversation by ID with participants and recent messages
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

    // Fetch the conversation with participants
    const conversation = await getConversationById(id);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // SECURITY: Verify user is a participant
    const isParticipant = await isUserParticipant(id, session.user.id);
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden - you are not a participant in this conversation' },
        { status: 403 }
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
 * PATCH /api/messages/conversations/[id]
 * Update a conversation by ID
 *
 * Body parameters:
 * - status: Conversation status (open, pending, resolved, closed, active, archived, in_progress)
 * - priority: Priority level (low, normal, high, urgent)
 * - assignedAgentId: UUID of assigned agent
 * - assignedTeam: Assigned team (support, dev, tech, admin, spiritual)
 * - labels: Array of label strings
 * - title: Conversation title
 * - description: Description
 * - isPrivate: Private flag
 * - isArchived: Archived flag
 * - metadata: Additional metadata
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

    // SECURITY: Verify user is a participant before allowing updates
    const isParticipant = await isUserParticipant(id, session.user.id);
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden - you are not a participant in this conversation' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate enum values if provided
    const validStatuses: ConversationStatus[] = ['open', 'pending', 'resolved', 'closed', 'active', 'archived', 'in_progress'];
    const validPriorities: Priority[] = ['low', 'normal', 'high', 'urgent'];
    const validTeams: AssignedTeam[] = ['support', 'dev', 'tech', 'admin', 'spiritual'];

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

    if (body.assignedTeam && !validTeams.includes(body.assignedTeam)) {
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

    // Validate boolean fields
    if (body.isPrivate !== undefined && typeof body.isPrivate !== 'boolean') {
      return NextResponse.json(
        { error: 'isPrivate must be a boolean' },
        { status: 400 }
      );
    }

    if (body.isArchived !== undefined && typeof body.isArchived !== 'boolean') {
      return NextResponse.json(
        { error: 'isArchived must be a boolean' },
        { status: 400 }
      );
    }

    // Build update input object
    const updates: UpdateConversationInput = {};

    if (body.status !== undefined) {
      updates.status = body.status;
    }

    if (body.priority !== undefined) {
      updates.priority = body.priority;
    }

    if (body.assignedAgentId !== undefined) {
      updates.assignedAgentId = body.assignedAgentId;
    }

    if (body.assignedTeam !== undefined) {
      updates.assignedTeam = body.assignedTeam;
    }

    if (body.labels !== undefined) {
      updates.labels = body.labels;
    }

    if (body.title !== undefined) {
      updates.title = body.title;
    }

    if (body.description !== undefined) {
      updates.description = body.description;
    }

    if (body.isPrivate !== undefined) {
      updates.isPrivate = body.isPrivate;
    }

    if (body.isArchived !== undefined) {
      updates.isArchived = body.isArchived;
    }

    if (body.metadata !== undefined) {
      updates.metadata = body.metadata;
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

/**
 * DELETE /api/messages/conversations/[id]
 * Archive a conversation (soft delete)
 * Sets status to 'archived' for team_channel or 'closed' for other types
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // SECURITY: Verify user is a participant before allowing deletion
    const isParticipant = await isUserParticipant(id, session.user.id);
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden - you are not a participant in this conversation' },
        { status: 403 }
      );
    }

    // Archive the conversation
    const conversation = await deleteConversation(id);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('[API] Failed to archive conversation:', error);
    return NextResponse.json(
      { error: 'Failed to archive conversation' },
      { status: 500 }
    );
  }
}
