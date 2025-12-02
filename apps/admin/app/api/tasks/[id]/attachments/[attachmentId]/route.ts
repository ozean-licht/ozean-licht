/**
 * Single Task Attachment API
 * GET /api/tasks/[id]/attachments/[attachmentId] - Get attachment details
 * DELETE /api/tasks/[id]/attachments/[attachmentId] - Delete attachment
 *
 * Phase 11 of Project Management MVP
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { Client } from 'minio';
import {
  getAttachmentById,
  deleteAttachment,
  getTaskAttachmentCount,
} from '@/lib/db/attachments';
import { getTaskById } from '@/lib/db/tasks';

interface RouteParams {
  params: Promise<{ id: string; attachmentId: string }>;
}

// Validate required environment variables
const REQUIRED_ENV_VARS = ['MINIO_ENDPOINT', 'MINIO_ACCESS_KEY', 'MINIO_SECRET_KEY'] as const;
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

// Initialize MinIO client (lazy)
let minioClient: Client | null = null;

function getMinioClient(): Client {
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required MinIO environment variables: ${missingEnvVars.join(', ')}`);
  }

  if (!minioClient) {
    minioClient = new Client({
      endPoint: process.env.MINIO_ENDPOINT!,
      port: parseInt(process.env.MINIO_PORT || '9000', 10),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
    });
  }
  return minioClient;
}

/**
 * GET /api/tasks/[id]/attachments/[attachmentId]
 * Get single attachment details
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, attachmentId } = await params;

    // Verify task exists
    const task = await getTaskById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Get attachment
    const attachment = await getAttachmentById(attachmentId);
    if (!attachment) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    }

    // Verify attachment belongs to task
    if (attachment.task_id !== id) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    }

    return NextResponse.json({ attachment });
  } catch (error) {
    console.error('[Attachment API] Failed to fetch attachment:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to fetch attachment',
        details: message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/[id]/attachments/[attachmentId]
 * Delete an attachment
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, attachmentId } = await params;

    // Verify task exists
    const task = await getTaskById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Get attachment to verify it belongs to task and get file key
    const attachment = await getAttachmentById(attachmentId);
    if (!attachment) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    }

    if (attachment.task_id !== id) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    }

    // Delete from MinIO storage if file_key exists
    if (attachment.file_key && attachment.bucket) {
      try {
        const client = getMinioClient();
        await client.removeObject(attachment.bucket, attachment.file_key);
      } catch (storageError) {
        // Log but don't fail - file might already be deleted
        console.warn('Failed to delete file from storage:', storageError);
      }
    }

    // Delete database record
    await deleteAttachment(attachmentId);

    // Get updated count
    const count = await getTaskAttachmentCount(id);

    return NextResponse.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('[Attachment API] Failed to delete attachment:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to delete attachment',
        details: message,
      },
      { status: 500 }
    );
  }
}
