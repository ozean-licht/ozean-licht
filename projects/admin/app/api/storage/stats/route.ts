/**
 * Storage Stats API Route
 * Returns storage statistics
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
    const entityScope = searchParams.get('entityScope') as any;

    // Initialize storage client
    const storageClient = new MCPStorageClient({
      baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
      database: 'shared-users',
    });

    // Get statistics
    const stats = await storageClient.getStorageStats(entityScope);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
