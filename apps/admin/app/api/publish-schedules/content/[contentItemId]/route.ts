/**
 * Content Item Publish Schedules API
 * GET /api/publish-schedules/content/[contentItemId] - Get all schedules for a content item
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getSchedulesByContentItem } from '@/lib/db/publish-schedules';

interface RouteParams {
  params: Promise<{ contentItemId: string }>;
}

/**
 * GET /api/publish-schedules/content/[contentItemId]
 * Get all publish schedules for a specific content item
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
    const { contentItemId } = await params;
    const schedules = await getSchedulesByContentItem(contentItemId);

    return NextResponse.json({ schedules });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch schedules for content item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules for content item' },
      { status: 500 }
    );
  }
}
