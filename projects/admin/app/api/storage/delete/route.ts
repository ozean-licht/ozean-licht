/**
 * Storage Delete API Route
 * Handles file deletion
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { MCPStorageClient } from '@/lib/mcp-client';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { fileKey, bucket } = body;

    if (!fileKey) {
      return NextResponse.json(
        { error: 'Missing fileKey' },
        { status: 400 }
      );
    }

    // Initialize storage client
    const storageClient = new MCPStorageClient({
      baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
      database: 'shared-users-db',
    });

    // Get file metadata to determine bucket if not provided
    let fileBucket = bucket;
    if (!fileBucket) {
      const metadata = await storageClient.getStorageMetadata(fileKey);
      if (!metadata) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      fileBucket = metadata.bucketName;
    }

    // Delete file
    await storageClient.deleteFile({
      bucket: fileBucket,
      fileKey,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      {
        error: 'Delete failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
