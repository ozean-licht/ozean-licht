/**
 * Notification Preferences API
 * GET /api/notifications/preferences - Get user's notification preferences
 * PATCH /api/notifications/preferences - Update user's notification preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getOrCreatePreferences, updatePreferences } from '@/lib/db/notifications';

export async function GET(_request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const preferences = await getOrCreatePreferences(session.user.id);
    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Failed to fetch notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate email digest value if provided
    if (body.emailDigest !== undefined) {
      const validDigests = ['none', 'instant', 'daily', 'weekly'];
      if (!validDigests.includes(body.emailDigest)) {
        return NextResponse.json(
          { error: 'Invalid email digest value' },
          { status: 400 }
        );
      }
    }

    const preferences = await updatePreferences(session.user.id, {
      inApp: body.inApp,
      emailDigest: body.emailDigest,
      mentionNotify: body.mentionNotify,
      assignmentNotify: body.assignmentNotify,
      commentNotify: body.commentNotify,
      taskUpdateNotify: body.taskUpdateNotify,
      projectUpdateNotify: body.projectUpdateNotify,
      dueDateNotify: body.dueDateNotify,
      systemNotify: body.systemNotify,
    });

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Failed to update notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
}
