/**
 * Storage Preview API Route
 *
 * Generates presigned URLs for file preview in the admin dashboard.
 * Redirects to MinIO presigned URL for direct file access.
 *
 * GET /api/storage/preview/[bucket]/[...path]
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getS3StorageClient } from '@/lib/storage/s3-client';

interface RouteParams {
  params: Promise<{
    bucket: string;
    path: string[];
  }>;
}

/**
 * Sanitize file path to prevent path traversal attacks
 */
function sanitizePath(path: string): string {
  if (path.includes('..')) {
    throw new Error('Invalid file path: path traversal detected');
  }
  if (path.includes('\0')) {
    throw new Error('Invalid file path: null byte detected');
  }
  return path.replace(/^\/+/, '').replace(/\\/g, '/').replace(/\/+/g, '/');
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract route parameters
    const { bucket, path: pathSegments } = await params;

    if (!bucket || !pathSegments || pathSegments.length === 0) {
      return NextResponse.json(
        { error: 'Bucket and file path are required' },
        { status: 400 }
      );
    }

    // Reconstruct and sanitize file path
    const fileKey = sanitizePath(pathSegments.join('/'));

    // Generate presigned URL (1 hour expiry)
    const client = getS3StorageClient();
    const result = await client.getFileUrl({
      bucket,
      fileKey,
      expirySeconds: 3600,
    });

    // Redirect to presigned URL for direct file access
    return NextResponse.redirect(result.url);
  } catch (error) {
    console.error('Preview URL generation failed:', error);

    const message = error instanceof Error ? error.message : 'Failed to generate preview URL';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
