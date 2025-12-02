/**
 * Entity Approvals API Route
 *
 * GET /api/approvals/entity?entityId={id}&entityType={type} - Get approvals for entity
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getApprovalsForEntity, type ApprovalEntityType } from '@/lib/db/approvals';

// GET /api/approvals/entity?entityId={id}&entityType={type}
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId');
    const entityType = searchParams.get('entityType');

    if (!entityId || !entityType) {
      return NextResponse.json(
        { error: 'entityId and entityType are required' },
        { status: 400 }
      );
    }

    // Validate entity type
    if (entityType !== 'task' && entityType !== 'content_item') {
      return NextResponse.json(
        { error: 'entityType must be task or content_item' },
        { status: 400 }
      );
    }

    const approvals = await getApprovalsForEntity(
      entityId,
      entityType as ApprovalEntityType
    );

    return NextResponse.json({ approvals });
  } catch (error) {
    console.error('Failed to fetch entity approvals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entity approvals' },
      { status: 500 }
    );
  }
}
