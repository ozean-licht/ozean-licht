/**
 * Project Activities API Endpoint
 *
 * GET /api/projects/[id]/activities
 * Returns activity history for a project (all task activities within the project)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getProjectTaskActivities } from '@/lib/db/tasks';

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

    // Get activities for this project
    const activities = await getProjectTaskActivities(id, Math.min(limit, 100));

    // Enrich activities with task info if needed
    // For now, return as-is since we're storing task info in the activity already

    return NextResponse.json({
      activities,
      total: activities.length,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching project activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
