/**
 * Mark All Notifications as Read API
 * POST /api/notifications/read-all - Mark all notifications as read for user
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { markAllAsRead } from '@/lib/db/notifications';

export async function POST(_request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const count = await markAllAsRead(session.user.id);
    return NextResponse.json({ success: true, count });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to mark all notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark all notifications as read' },
      { status: 500 }
    );
  }
}
