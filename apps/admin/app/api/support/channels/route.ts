/**
 * Channel Configurations API
 *
 * GET  /api/support/channels - List all channel configurations
 * POST /api/support/channels - Bulk update channel settings (admin only)
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAllChannelConfigs, getAllWidgetSettings } from '@/lib/db/support-channels';
import type { Platform } from '@/types/support';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') as Platform | null;

    const [channels, widgetSettings] = await Promise.all([
      getAllChannelConfigs(platform || undefined),
      getAllWidgetSettings(),
    ]);

    return NextResponse.json({
      channels,
      widgetSettings,
    });
  } catch (error) {
    // TODO: Replace with structured logging service (e.g., Winston, Pino)
    // Log detailed error server-side only, never expose to clients
    console.error('[API Error] Failed to fetch channel configurations:', error);

    // Return generic error message to client
    return NextResponse.json(
      {
        error: 'Failed to fetch channel configurations',
        code: 'CHANNEL_CONFIG_FETCH_ERROR'
      },
      { status: 500 }
    );
  }
}
