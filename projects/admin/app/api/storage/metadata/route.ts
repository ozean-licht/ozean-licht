/**
 * Storage Metadata API Route
 * Lists storage metadata with filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { MCPStorageClient } from '@/lib/mcp-client';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const bucket = searchParams.get('bucket') || undefined;
    const entityScope = searchParams.get('entityScope') as any;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Initialize storage client
    const storageClient = new MCPStorageClient({
      baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
      database: 'shared-users',
    });

    // List files with filters
    const files = await storageClient.listStorageMetadata({
      bucketName: bucket,
      entityScope,
      searchQuery: search,
      status: 'active',
      limit,
      offset,
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Metadata list error:', error);
    return NextResponse.json(
      {
        error: 'Failed to list files',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
