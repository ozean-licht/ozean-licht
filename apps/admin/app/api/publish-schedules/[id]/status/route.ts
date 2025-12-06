/**
 * Publish Schedule Status Transitions API
 * PATCH /api/publish-schedules/[id]/status - Update schedule status with transitions
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  markAsPublishing,
  markAsPublished,
  markAsFailed,
  cancelSchedule,
  reschedule,
} from '@/lib/db/publish-schedules';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Validation schema for status transitions
const statusTransitionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('publish'),
    publishedUrl: z.string().url('Invalid published URL'),
  }),
  z.object({
    action: z.literal('publishing'),
  }),
  z.object({
    action: z.literal('fail'),
    errorMessage: z.string().min(1, 'Error message is required'),
  }),
  z.object({
    action: z.literal('cancel'),
  }),
  z.object({
    action: z.literal('reschedule'),
    newScheduledAt: z.string().datetime('Invalid scheduled date'),
  }),
]);

/**
 * PATCH /api/publish-schedules/[id]/status
 * Update schedule status with specific transitions
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

    // Validate the request body
    const validated = statusTransitionSchema.parse(body);

    let schedule;

    switch (validated.action) {
      case 'publishing':
        schedule = await markAsPublishing(id);
        break;

      case 'publish':
        schedule = await markAsPublished(id, validated.publishedUrl);
        break;

      case 'fail':
        schedule = await markAsFailed(id, validated.errorMessage);
        break;

      case 'cancel':
        schedule = await cancelSchedule(id);
        break;

      case 'reschedule':
        schedule = await reschedule(id, validated.newScheduledAt);
        break;

      default:
        // TypeScript should never reach here due to discriminated union
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    if (!schedule) {
      return NextResponse.json(
        { error: 'Publish schedule not found or action not allowed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ schedule });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // eslint-disable-next-line no-console
    console.error('Failed to update publish schedule status:', error);
    return NextResponse.json(
      { error: 'Failed to update publish schedule status' },
      { status: 500 }
    );
  }
}
