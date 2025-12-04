/**
 * Widget Settings API
 *
 * GET   /api/support/widget/[platform] - Get widget settings
 * PATCH /api/support/widget/[platform] - Update widget settings
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getWidgetSettings,
  updateWidgetSettings,
  generateWidgetEmbedCode,
} from '@/lib/db/support-channels';
import type { Platform, UpdateWidgetSettingsInput } from '@/types/support';

interface RouteParams {
  params: Promise<{ platform: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform } = await params;

    // Validate platform
    const validPlatforms = ['ozean_licht', 'kids_ascension'];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    const settings = await getWidgetSettings(platform as Platform);
    if (!settings) {
      return NextResponse.json({ error: 'Widget settings not found' }, { status: 404 });
    }

    const embedCode = await generateWidgetEmbedCode(platform as Platform);

    return NextResponse.json({
      settings,
      embedCode,
    });
  } catch (error) {
    // TODO: Replace with structured logging service (e.g., Winston, Pino)
    // Log detailed error server-side only, never expose to clients
    console.error('[API Error] Failed to fetch widget settings:', error);

    // Return generic error message to client
    return NextResponse.json(
      {
        error: 'Failed to fetch widget settings',
        code: 'WIDGET_SETTINGS_GET_ERROR'
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

    // Check for admin role
    const userRole = session.user.adminRole;
    if (!userRole || !['super_admin', 'ol_admin'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { platform } = await params;

    // Validate platform
    const validPlatforms = ['ozean_licht', 'kids_ascension'];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    const body = await request.json();
    const updateData: UpdateWidgetSettingsInput = {};

    // Extract and validate fields
    if (body.primaryColor !== undefined) {
      updateData.primaryColor = String(body.primaryColor);
    }
    if (body.position !== undefined && ['left', 'right'].includes(body.position)) {
      updateData.position = body.position;
    }
    if (body.welcomeTitle !== undefined) {
      updateData.welcomeTitle = String(body.welcomeTitle);
    }
    if (body.welcomeSubtitle !== undefined) {
      updateData.welcomeSubtitle = String(body.welcomeSubtitle);
    }
    if (body.replyTime !== undefined) {
      updateData.replyTime = body.replyTime;
    }
    if (body.showBranding !== undefined) {
      updateData.showBranding = Boolean(body.showBranding);
    }
    if (body.logoUrl !== undefined) {
      updateData.logoUrl = body.logoUrl || undefined;
    }
    if (body.preChatFormEnabled !== undefined) {
      updateData.preChatFormEnabled = Boolean(body.preChatFormEnabled);
    }
    if (body.preChatFormFields !== undefined && Array.isArray(body.preChatFormFields)) {
      updateData.preChatFormFields = body.preChatFormFields;
    }
    if (body.hideMessageBubble !== undefined) {
      updateData.hideMessageBubble = Boolean(body.hideMessageBubble);
    }
    if (body.showPopupOnload !== undefined) {
      updateData.showPopupOnload = Boolean(body.showPopupOnload);
    }
    if (body.popupDelaySeconds !== undefined) {
      updateData.popupDelaySeconds = Number(body.popupDelaySeconds);
    }
    if (body.language !== undefined) {
      updateData.language = String(body.language);
    }
    if (body.customCss !== undefined) {
      updateData.customCss = body.customCss || undefined;
    }

    const updated = await updateWidgetSettings(platform as Platform, updateData);
    if (!updated) {
      return NextResponse.json({ error: 'Widget settings not found' }, { status: 404 });
    }

    return NextResponse.json({ settings: updated });
  } catch (error) {
    // TODO: Replace with structured logging service (e.g., Winston, Pino)
    // Log detailed error server-side only, never expose to clients
    console.error('[API Error] Failed to update widget settings:', error);

    // Return generic error message to client
    return NextResponse.json(
      {
        error: 'Failed to update widget settings',
        code: 'WIDGET_SETTINGS_UPDATE_ERROR'
      },
      { status: 500 }
    );
  }
}
