/**
 * Customer Context API
 * GET /api/support/conversations/[id]/context - Get enriched customer context for a conversation
 *
 * Provides support agents with comprehensive customer information including:
 * - User profile
 * - Course enrollments and progress
 * - Payment history
 * - Previous support conversations
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getConversationById,
  getConversationsByUser,
} from '@/lib/db/support-conversations';
import { query } from '@/lib/db';
import type { CustomerContext } from '@/types/support';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Database row type for user lookup
 */
interface DBUser {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
}

/**
 * Database row type for enrollment lookup
 */
interface DBEnrollment {
  course_id: string;
  course_name: string;
  progress: number;
  enrolled_at: string;
}

/**
 * Database row type for payment lookup
 */
interface DBPayment {
  amount: number;
  currency: string;
  created_at: string;
  description: string | null;
}

/**
 * GET /api/support/conversations/[id]/context
 * Fetch enriched customer context for a conversation
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
    const { id } = await params;

    // Fetch the conversation to get user/contact info
    const conversation = await getConversationById(id);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Initialize customer context
    const context: CustomerContext = {
      user: undefined,
      courseEnrollments: [],
      recentPayments: [],
      previousConversations: [],
      totalPurchases: 0,
      memberSince: undefined,
    };

    // If we have a userId, fetch detailed user info
    if (conversation.userId) {
      // Fetch user profile
      const userSql = `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = $1
      `;
      const userRows = await query<DBUser>(userSql, [conversation.userId]);

      if (userRows.length > 0) {
        const user = userRows[0];
        context.user = {
          id: user.id,
          name: user.name || user.email,
          email: user.email,
          createdAt: user.created_at,
        };
        context.memberSince = user.created_at;

        // Fetch course enrollments
        const enrollmentSql = `
          SELECT
            e.course_id,
            c.title as course_name,
            COALESCE(e.progress, 0) as progress,
            e.created_at as enrolled_at
          FROM enrollments e
          LEFT JOIN courses c ON e.course_id = c.id
          WHERE e.user_id = $1
          ORDER BY e.created_at DESC
          LIMIT 10
        `;
        const enrollmentRows = await query<DBEnrollment>(enrollmentSql, [conversation.userId]);

        context.courseEnrollments = enrollmentRows.map(row => ({
          courseId: row.course_id,
          courseName: row.course_name || 'Unknown Course',
          progress: row.progress,
          enrolledAt: row.enrolled_at,
        }));

        // Fetch recent payments (assuming payments table exists)
        // Note: Adjust table/column names based on actual payment schema
        const paymentSql = `
          SELECT
            amount,
            currency,
            created_at,
            description
          FROM payments
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT 10
        `;

        try {
          const paymentRows = await query<DBPayment>(paymentSql, [conversation.userId]);

          context.recentPayments = paymentRows.map(row => ({
            amount: row.amount,
            currency: row.currency,
            date: row.created_at,
            description: row.description || 'Payment',
          }));

          // Calculate total purchases
          context.totalPurchases = paymentRows.reduce(
            (sum, payment) => sum + payment.amount,
            0
          );
        } catch (paymentError) {
          // If payments table doesn't exist or query fails, just skip it
          console.warn('[API] Could not fetch payment history:', paymentError);
          context.recentPayments = [];
          context.totalPurchases = 0;
        }

        // Fetch previous support conversations
        const previousConversations = await getConversationsByUser(conversation.userId);

        // Filter out the current conversation and map to simplified format
        context.previousConversations = previousConversations
          .filter(conv => conv.id !== id)
          .map(conv => ({
            id: conv.id,
            status: conv.status,
            createdAt: conv.createdAt,
            resolvedAt: conv.resolvedAt,
          }));
      }
    } else if (conversation.contactEmail) {
      // If no userId but we have an email, try to look up user by email
      const userSql = `
        SELECT id, name, email, created_at
        FROM users
        WHERE email = $1
      `;
      const userRows = await query<DBUser>(userSql, [conversation.contactEmail]);

      if (userRows.length > 0) {
        const user = userRows[0];
        context.user = {
          id: user.id,
          name: user.name || user.email,
          email: user.email,
          createdAt: user.created_at,
        };
        context.memberSince = user.created_at;

        // Could fetch more info here, but keeping it simple for unlinked contacts
      }
    }

    return NextResponse.json({ context });
  } catch (error) {
    console.error('[API] Failed to fetch customer context:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer context' },
      { status: 500 }
    );
  }
}
