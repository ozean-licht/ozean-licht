/**
 * Single Time Entry API
 * GET /api/tasks/[id]/time-entries/[entryId] - Get single time entry
 * PATCH /api/tasks/[id]/time-entries/[entryId] - Update time entry
 * DELETE /api/tasks/[id]/time-entries/[entryId] - Delete time entry
 *
 * Phase 9 of Project Management MVP
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getTimeEntryById,
  updateTimeEntry,
  deleteTimeEntry,
  getTaskTimeStats,
} from '@/lib/db/time-entries';

interface RouteParams {
  params: Promise<{ id: string; entryId: string }>;
}

/**
 * GET /api/tasks/[id]/time-entries/[entryId]
 * Get a single time entry
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
    const { entryId } = await params;
    const entry = await getTimeEntryById(entryId);

    if (!entry) {
      return NextResponse.json({ error: 'Time entry not found' }, { status: 404 });
    }

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Failed to fetch time entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time entry' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tasks/[id]/time-entries/[entryId]
 * Update a time entry
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
    const { id, entryId } = await params;
    const body = await request.json();

    // Verify entry exists
    const existingEntry = await getTimeEntryById(entryId);
    if (!existingEntry) {
      return NextResponse.json({ error: 'Time entry not found' }, { status: 404 });
    }

    // Verify ownership - only entry creator or admin can modify/delete
    if (existingEntry.user_id !== session.user.id) {
      // Check if user is admin (has elevated permissions)
      const isAdmin = session.user.adminRole === 'super_admin' || session.user.adminRole === 'admin';
      if (!isAdmin) {
        return NextResponse.json({ error: 'Not authorized to modify this time entry' }, { status: 403 });
      }
    }

    // Validate duration_minutes if provided
    if (body.duration_minutes !== undefined) {
      if (typeof body.duration_minutes !== 'number' || body.duration_minutes <= 0) {
        return NextResponse.json(
          { error: 'duration_minutes must be a positive number' },
          { status: 400 }
        );
      }
    }

    const entry = await updateTimeEntry(entryId, {
      description: body.description,
      duration_minutes: body.duration_minutes,
      started_at: body.started_at,
      ended_at: body.ended_at,
      work_date: body.work_date,
      is_billable: body.is_billable,
    });

    // Get updated stats
    const stats = await getTaskTimeStats(id);

    return NextResponse.json({ entry, stats });
  } catch (error) {
    console.error('Failed to update time entry:', error);
    return NextResponse.json(
      { error: 'Failed to update time entry' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/[id]/time-entries/[entryId]
 * Delete a time entry
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
    const { id, entryId } = await params;

    // Verify entry exists
    const existingEntry = await getTimeEntryById(entryId);
    if (!existingEntry) {
      return NextResponse.json({ error: 'Time entry not found' }, { status: 404 });
    }

    // Verify ownership - only entry creator or admin can modify/delete
    if (existingEntry.user_id !== session.user.id) {
      // Check if user is admin (has elevated permissions)
      const isAdmin = session.user.adminRole === 'super_admin' || session.user.adminRole === 'admin';
      if (!isAdmin) {
        return NextResponse.json({ error: 'Not authorized to modify this time entry' }, { status: 403 });
      }
    }

    const deleted = await deleteTimeEntry(entryId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete time entry' },
        { status: 500 }
      );
    }

    // Get updated stats
    const stats = await getTaskTimeStats(id);

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Failed to delete time entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete time entry' },
      { status: 500 }
    );
  }
}
