/**
 * Push Notification Subscription API
 *
 * POST /api/push/subscribe - Register a push subscription for the current user
 * DELETE /api/push/subscribe - Unsubscribe from push notifications
 * GET /api/push/subscribe - Get public VAPID key for subscribing
 *
 * Part of Phase 12: Support Management System - Multi-channel Notifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { upsertPushSubscription, deletePushSubscription } from '@/lib/db/push-subscriptions';
import { z } from 'zod';

// Validation schema for subscription
const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
  deviceName: z.string().optional(),
});

/**
 * POST /api/push/subscribe
 * Register a push subscription for the current user
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = subscribeSchema.parse(body);

    const subscription = await upsertPushSubscription({
      userId: session.user.id,
      endpoint: parsed.endpoint,
      p256dh: parsed.keys.p256dh,
      auth: parsed.keys.auth,
      userAgent: request.headers.get('user-agent') || undefined,
      deviceName: parsed.deviceName,
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid subscription', details: error.errors },
        { status: 400 }
      );
    }
    // eslint-disable-next-line no-console
    console.error('Failed to save push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/push/subscribe
 * Unsubscribe from push notifications
 */
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint required' },
        { status: 400 }
      );
    }

    await deletePushSubscription(session.user.id, endpoint);
    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to delete push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscription' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/push/subscribe
 * Get public VAPID key for subscribing
 * Requires authentication to prevent enumeration
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY;

  if (!publicKey) {
    return NextResponse.json(
      { error: 'Push notifications not configured' },
      { status: 503 }
    );
  }

  return NextResponse.json({ publicKey });
}
