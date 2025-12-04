/**
 * Single Channel Configuration API
 *
 * GET   /api/support/channels/[channel] - Get channel config
 * PATCH /api/support/channels/[channel] - Update channel config
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getChannelConfig,
  updateChannelConfig,
  generateWidgetEmbedCode,
} from '@/lib/db/support-channels';
import type { Channel, UpdateChannelConfigInput } from '@/types/support';

interface RouteParams {
  params: Promise<{ channel: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { channel } = await params;

    // Validate channel type
    const validChannels = ['web_widget', 'whatsapp', 'email', 'telegram'];
    if (!validChannels.includes(channel)) {
      return NextResponse.json({ error: 'Invalid channel' }, { status: 400 });
    }

    const config = await getChannelConfig(channel as Channel);
    if (!config) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    // If web_widget, include embed code
    let embedCode: string | undefined;
    if (channel === 'web_widget') {
      embedCode = await generateWidgetEmbedCode(config.platform);
    }

    return NextResponse.json({
      channel: config,
      embedCode,
    });
  } catch (error) {
    // TODO: Replace with structured logging service (e.g., Winston, Pino)
    // Log detailed error server-side only, never expose to clients
    console.error('[API Error] Failed to fetch channel configuration:', error);

    // Return generic error message to client
    return NextResponse.json(
      {
        error: 'Failed to fetch channel configuration',
        code: 'CHANNEL_CONFIG_GET_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for admin role (super_admin or ol_admin required)
    const userRole = session.user.adminRole;
    if (!userRole || !['super_admin', 'ol_admin'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { channel } = await params;

    // Validate channel type
    const validChannels = ['web_widget', 'whatsapp', 'email', 'telegram'];
    if (!validChannels.includes(channel)) {
      return NextResponse.json({ error: 'Invalid channel' }, { status: 400 });
    }

    const body = await request.json();
    const updateData: UpdateChannelConfigInput = {};

    // Validate and extract fields
    if (body.isEnabled !== undefined) {
      updateData.isEnabled = Boolean(body.isEnabled);
    }
    if (body.chatwootInboxId !== undefined) {
      updateData.chatwootInboxId = body.chatwootInboxId ? Number(body.chatwootInboxId) : undefined;
    }
    if (body.config !== undefined && typeof body.config === 'object') {
      updateData.config = body.config;
    }
    if (body.defaultTeam !== undefined) {
      const validTeams = ['tech', 'sales', 'spiritual', 'general', null];
      if (validTeams.includes(body.defaultTeam)) {
        updateData.defaultTeam = body.defaultTeam;
      }
    }
    if (body.autoResponseEnabled !== undefined) {
      updateData.autoResponseEnabled = Boolean(body.autoResponseEnabled);
    }
    if (body.autoResponseMessage !== undefined) {
      updateData.autoResponseMessage = String(body.autoResponseMessage || '');
    }
    if (body.businessHours !== undefined && typeof body.businessHours === 'object') {
      updateData.businessHours = body.businessHours;
    }

    const updated = await updateChannelConfig(channel as Channel, updateData);
    if (!updated) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    return NextResponse.json({ channel: updated });
  } catch (error) {
    // TODO: Replace with structured logging service (e.g., Winston, Pino)
    // Log detailed error server-side only, never expose to clients
    console.error('[API Error] Failed to update channel configuration:', error);

    // Return generic error message to client
    return NextResponse.json(
      {
        error: 'Failed to update channel configuration',
        code: 'CHANNEL_CONFIG_UPDATE_ERROR'
      },
      { status: 500 }
    );
  }
}
