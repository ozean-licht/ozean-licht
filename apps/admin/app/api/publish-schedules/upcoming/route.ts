/**
 * Upcoming Publish Schedules API Route
 *
 * GET /api/publish-schedules/upcoming - Get upcoming schedules
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getUpcomingSchedules, type PublishPlatform } from '@/lib/db/publish-schedules';

/**
 * GET /api/publish-schedules/upcoming
 * Get upcoming publish schedules due within specified hours
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Parse hours parameter (default: 24)
    let hours = 24;
    const hoursParam = searchParams.get('hours');
    if (hoursParam) {
      const parsedHours = parseInt(hoursParam, 10);
      if (!isNaN(parsedHours) && parsedHours > 0) {
        hours = parsedHours;
      }
    }

    // Parse platform filter
    let platform: PublishPlatform | undefined;
    const platformParam = searchParams.get('platform');
    if (platformParam) {
      const validPlatforms: PublishPlatform[] = ['youtube', 'website', 'newsletter', 'social', 'podcast'];
      if (validPlatforms.includes(platformParam as PublishPlatform)) {
        platform = platformParam as PublishPlatform;
      }
    }

    const schedules = await getUpcomingSchedules(hours, platform);

    return NextResponse.json({ schedules });
  } catch (error) {
    console.error('Failed to fetch upcoming schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming schedules' },
      { status: 500 }
    );
  }
}
