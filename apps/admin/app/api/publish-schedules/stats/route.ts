/**
 * Publish Schedule Statistics API Route
 *
 * GET /api/publish-schedules/stats - Get publish statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getPublishStats } from '@/lib/db/publish-schedules';

/**
 * GET /api/publish-schedules/stats
 * Get publishing statistics with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Build filters from query params
    const filters: {
      projectId?: string;
      scheduledAfter?: string;
      scheduledBefore?: string;
    } = {};

    if (searchParams.get('projectId')) {
      filters.projectId = searchParams.get('projectId')!;
    }

    if (searchParams.get('dateFrom')) {
      filters.scheduledAfter = searchParams.get('dateFrom')!;
    }

    if (searchParams.get('dateTo')) {
      filters.scheduledBefore = searchParams.get('dateTo')!;
    }

    const stats = await getPublishStats(filters);

    return NextResponse.json({ stats });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch publish statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch publish statistics' },
      { status: 500 }
    );
  }
}
