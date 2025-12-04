/**
 * Support Analytics API
 * GET /api/support/analytics - Get support metrics and statistics
 *
 * Provides dashboard metrics including:
 * - Current conversation counts (open, pending)
 * - Average response and resolution times
 * - CSAT scores
 * - Today's activity
 * - Historical snapshots (optional)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getSupportStats,
  getAnalyticsSnapshots,
} from '@/lib/db/support-analytics';

/**
 * GET /api/support/analytics
 * Fetch support statistics and metrics
 *
 * Query parameters:
 * - startDate: Optional start date for historical data (ISO 8601: YYYY-MM-DD)
 * - endDate: Optional end date for historical data (ISO 8601: YYYY-MM-DD)
 * - includeSnapshots: Include historical analytics snapshots (default: false)
 *
 * Returns:
 * - stats: Current support statistics
 * - snapshots: Historical analytics snapshots (if requested)
 */
export async function GET(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const includeSnapshots = searchParams.get('includeSnapshots') === 'true';

    // Validate date format if provided
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (startDate && !dateRegex.test(startDate)) {
      return NextResponse.json(
        { error: 'Invalid startDate format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    if (endDate && !dateRegex.test(endDate)) {
      return NextResponse.json(
        { error: 'Invalid endDate format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate date range if both provided
    if (startDate && endDate && startDate > endDate) {
      return NextResponse.json(
        { error: 'startDate must be before or equal to endDate' },
        { status: 400 }
      );
    }

    // Fetch current support stats (always included)
    const stats = await getSupportStats();

    // Optionally fetch historical snapshots
    let snapshots = undefined;
    if (includeSnapshots && startDate && endDate) {
      snapshots = await getAnalyticsSnapshots(startDate, endDate);
    }

    return NextResponse.json({
      stats,
      snapshots,
    });
  } catch (error) {
    console.error('[API] Failed to fetch support analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support analytics' },
      { status: 500 }
    );
  }
}
