/**
 * Admin Users API - List users
 * GET /api/admin-users - List admin users for @mention autocomplete
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
  const search = searchParams.get('search') || '';

  try {
    let users;
    if (search) {
      users = await query<{ id: string; name: string; email: string }>(
        `SELECT id, name, email FROM admin_users
         WHERE (name ILIKE $1 OR email ILIKE $1)
         AND is_active = true
         ORDER BY name
         LIMIT $2`,
        [`%${search}%`, limit]
      );
    } else {
      users = await query<{ id: string; name: string; email: string }>(
        `SELECT id, name, email FROM admin_users
         WHERE is_active = true
         ORDER BY name
         LIMIT $1`,
        [limit]
      );
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Failed to fetch admin users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
