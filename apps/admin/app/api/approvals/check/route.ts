/**
 * Check Approval Permission API Route
 *
 * GET /api/approvals/check?userId={id}&gateId={id} - Check if user can approve
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { canUserApprove } from '@/lib/db/approvals';

// GET /api/approvals/check?userId={id}&gateId={id}
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const gateId = searchParams.get('gateId');

    if (!userId || !gateId) {
      return NextResponse.json(
        { error: 'userId and gateId are required' },
        { status: 400 }
      );
    }

    const canApprove = await canUserApprove(userId, gateId);

    return NextResponse.json({ canApprove });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to check approval permission:', error);
    return NextResponse.json(
      { error: 'Failed to check approval permission' },
      { status: 500 }
    );
  }
}
