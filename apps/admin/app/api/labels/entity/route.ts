/**
 * Entity Labels API Route
 *
 * GET /api/labels/entity - Get labels for an entity (query params: entityId, entityType)
 * POST /api/labels/entity - Add label to entity { entityId, entityType, labelId }
 * DELETE /api/labels/entity - Remove label from entity { entityId, entityType, labelId }
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getLabelsForEntity,
  addLabelToEntity,
  removeLabelFromEntity,
  type EntityType,
} from '@/lib/db/labels';
import { z } from 'zod';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

// GET /api/labels/entity
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId');
    const entityType = searchParams.get('entityType') as EntityType | null;

    // Validate required parameters
    if (!entityId || !entityType) {
      return NextResponse.json(
        { error: 'Missing required parameters: entityId and entityType' },
        { status: 400 }
      );
    }

    // Validate UUID
    const validation = validateUUID(entityId, 'Entity ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    // Validate entity type
    if (!['project', 'task', 'content_item'].includes(entityType)) {
      return NextResponse.json(
        { error: 'Invalid entity type. Must be: project, task, or content_item' },
        { status: 400 }
      );
    }

    const labels = await getLabelsForEntity(entityId, entityType);

    return NextResponse.json({ labels });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch entity labels:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// Validation schema for adding label to entity
const addLabelSchema = z.object({
  entityId: z.string().uuid('Entity ID must be a valid UUID'),
  entityType: z.enum(['project', 'task', 'content_item']),
  labelId: z.string().uuid('Label ID must be a valid UUID'),
});

// POST /api/labels/entity
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = addLabelSchema.parse(body);

    await addLabelToEntity(
      validated.entityId,
      validated.entityType,
      validated.labelId
    );

    // Return the updated list of labels for the entity
    const labels = await getLabelsForEntity(validated.entityId, validated.entityType);

    return NextResponse.json({ labels }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // eslint-disable-next-line no-console
    console.error('Failed to add label to entity:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// Validation schema for removing label from entity
const removeLabelSchema = z.object({
  entityId: z.string().uuid('Entity ID must be a valid UUID'),
  entityType: z.enum(['project', 'task', 'content_item']),
  labelId: z.string().uuid('Label ID must be a valid UUID'),
});

// DELETE /api/labels/entity
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = removeLabelSchema.parse(body);

    const success = await removeLabelFromEntity(
      validated.entityId,
      validated.entityType,
      validated.labelId
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Label relationship not found' },
        { status: 404 }
      );
    }

    // Return the updated list of labels for the entity
    const labels = await getLabelsForEntity(validated.entityId, validated.entityType);

    return NextResponse.json({ labels });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // eslint-disable-next-line no-console
    console.error('Failed to remove label from entity:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
