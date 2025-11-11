/**
 * Storage Upload API Route
 * Handles file uploads to MinIO via MCP Gateway
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
    const { bucket, fileKey, fileBuffer, contentType, metadata } = body;

    // Validate required fields
    if (!bucket || !fileKey || !fileBuffer || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize storage client
    const storageClient = new MCPStorageClient({
      baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
      database: 'shared-users-db',
    });

    // Convert base64 buffer back to Buffer
    const buffer = Buffer.from(fileBuffer, 'base64');

    // Upload file
    const result = await storageClient.uploadFile({
      bucket,
      fileKey,
      fileBuffer: buffer,
      contentType,
      metadata: {
        ...metadata,
        uploadedBy: session.user.id || session.user.email || 'unknown',
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
