/**
 * Single Video API Route
 *
 * GET /api/videos/[id] - Get video by ID with platforms
 * PUT /api/videos/[id] - Update video
 * DELETE /api/videos/[id] - Soft delete video (archive)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/auth-utils';
import { getVideoWithPlatforms, updateVideo, deleteVideo } from '@/lib/db/videos';
import { validateUpdateVideo } from '@/lib/validations/video';
import { ZodError } from 'zod';

/**
 * GET /api/videos/[id]
 * Fetch a single video by ID with its platform distribution records
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Permission check
  if (!hasPermission(session, 'content.read')) {
    return NextResponse.json({ error: 'Forbidden: content.read permission required' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const video = await getVideoWithPlatforms(id);

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/videos/[id]
 * Update a video by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Permission check
  if (!hasPermission(session, 'content.write')) {
    return NextResponse.json({ error: 'Forbidden: content.write permission required' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input with Zod
    const validated = validateUpdateVideo(body);

    // Update video
    const updated = await updateVideo(id, validated);

    if (!updated) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/videos/[id]
 * Soft delete a video by setting status to 'archived'
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Permission check
  if (!hasPermission(session, 'content.delete')) {
    return NextResponse.json({ error: 'Forbidden: content.delete permission required' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteVideo(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
