/**
 * Entity Labels Sync API Route
 *
 * POST /api/labels/entity/sync - Sync all labels for an entity (replace entire label set)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { syncEntityLabels } from '@/lib/db/labels';
import { z } from 'zod';
import { parsePostgresError } from '@/lib/utils/validation';

// Validation schema for syncing entity labels
const syncLabelsSchema = z.object({
  entityId: z.string().uuid('Entity ID must be a valid UUID'),
  entityType: z.enum(['project', 'task', 'content_item']),
  labelIds: z.array(z.string().uuid('Each label ID must be a valid UUID')),
});

// POST /api/labels/entity/sync
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = syncLabelsSchema.parse(body);

    const labels = await syncEntityLabels(
      validated.entityId,
      validated.entityType,
      validated.labelIds
    );

    return NextResponse.json({ labels });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to sync entity labels:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
