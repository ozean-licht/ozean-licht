/**
 * Notifications API - List notifications
 * GET /api/notifications - Get user's notifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getNotifications } from '@/lib/db/notifications';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const unreadOnly = searchParams.get('unreadOnly') === 'true';
  const type = searchParams.get('type') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  try {
    const result = await getNotifications({
      userId: session.user.id,
      unreadOnly,
      type: type as any,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
