/**
 * Task Activities API Endpoint
 *
 * GET /api/tasks/[id]/activities
 * Returns activity history for a specific task
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getTaskActivities } from '@/lib/db/tasks';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Get activities for this task
    const activities = await getTaskActivities(id, Math.min(limit, 100));

    return NextResponse.json({
      activities,
      total: activities.length,
    });
  } catch (error) {
    console.error('Error fetching task activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
