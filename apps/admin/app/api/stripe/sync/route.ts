/**
 * Stripe Sync API
 *
 * POST /api/stripe/sync - Sync courses to Stripe and create payment links
 * GET /api/stripe/sync - List courses needing sync
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  listCoursesNeedingStripeSync,
  updateCourseStripeInfo,
} from '@/lib/db/courses';
import {
  createFullPaymentLink,
  findExistingProduct,
  getProductPrices,
  createStripePrice,
  createPaymentLink,
} from '@/lib/stripe/client';

/**
 * Type guard for admin role validation
 */
function isValidAdminRole(role: unknown): role is string {
  return typeof role === 'string' && role.length > 0;
}

/**
 * Check if user has required admin role
 */
function hasAdminRole(role: unknown, allowedRoles: string[]): boolean {
  return isValidAdminRole(role) && allowedRoles.includes(role);
}

/**
 * Sanitize error for client response
 */
function sanitizeError(error: unknown): string {
  // Log full error server-side for debugging
  console.error('[Stripe Sync Error]', error);

  // Return generic message to client (never expose internal details)
  if (error instanceof Error) {
    // Only return safe, generic messages
    if (error.message.includes('API key')) {
      return 'Stripe configuration error';
    }
    if (error.message.includes('rate limit')) {
      return 'Rate limit exceeded, please try again later';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out, please try again';
    }
  }

  return 'An unexpected error occurred';
}

/**
 * Structured logging helper
 */
function logSyncOperation(
  operation: string,
  details: Record<string, unknown>
): void {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    operation: `stripe_sync_${operation}`,
    ...details,
  }));
}

/**
 * GET - List courses that need Stripe sync
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Runtime validation of admin role
  if (!hasAdminRole(session.user.adminRole, ['super_admin', 'ol_admin'])) {
    logSyncOperation('access_denied', {
      userId: session.user.id,
      role: session.user.adminRole,
      endpoint: 'GET /api/stripe/sync',
    });
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    logSyncOperation('list_start', {
      userId: session.user.id,
    });

    const courses = await listCoursesNeedingStripeSync();

    logSyncOperation('list_complete', {
      userId: session.user.id,
      courseCount: courses.length,
    });

    return NextResponse.json({
      count: courses.length,
      courses: courses.map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        priceCents: c.priceCents,
        currency: c.currency,
        hasStripeProduct: !!c.stripeProductId,
        hasStripePrice: !!c.stripePriceId,
        hasPaymentLink: !!c.stripePaymentLinkUrl,
      })),
    });
  } catch (error) {
    const sanitized = sanitizeError(error);
    return NextResponse.json(
      { error: sanitized },
      { status: 500 }
    );
  }
}

interface SyncResult {
  courseId: string;
  title: string;
  success: boolean;
  error?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  stripePaymentLinkUrl?: string;
}

/**
 * POST - Sync courses to Stripe
 *
 * Body:
 *   - courseIds?: string[] - Specific course IDs to sync (default: all needing sync)
 *   - dryRun?: boolean - If true, just return what would be synced
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Runtime validation: Only super_admin can run sync
  if (!hasAdminRole(session.user.adminRole, ['super_admin'])) {
    logSyncOperation('access_denied', {
      userId: session.user.id,
      role: session.user.adminRole,
      endpoint: 'POST /api/stripe/sync',
    });
    return NextResponse.json(
      { error: 'Only super_admin can sync to Stripe' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { courseIds, dryRun = false } = body as {
      courseIds?: string[];
      dryRun?: boolean;
    };

    logSyncOperation('sync_start', {
      userId: session.user.id,
      courseIds: courseIds || 'all',
      dryRun,
    });

    // Get courses to sync
    let coursesToSync = await listCoursesNeedingStripeSync();

    // Filter to specific courses if provided
    if (courseIds && courseIds.length > 0) {
      coursesToSync = coursesToSync.filter((c) => courseIds.includes(c.id));
    }

    if (coursesToSync.length === 0) {
      logSyncOperation('sync_complete', {
        userId: session.user.id,
        status: 'no_courses',
      });
      return NextResponse.json({
        message: 'No courses need syncing',
        synced: 0,
        results: [],
      });
    }

    // Dry run - just return what would be synced
    if (dryRun) {
      logSyncOperation('sync_dry_run', {
        userId: session.user.id,
        courseCount: coursesToSync.length,
      });
      return NextResponse.json({
        message: 'Dry run - no changes made',
        wouldSync: coursesToSync.length,
        courses: coursesToSync.map((c) => ({
          id: c.id,
          title: c.title,
          priceCents: c.priceCents,
          priceFormatted: `${(c.priceCents / 100).toFixed(2)} ${c.currency}`,
        })),
      });
    }

    // Sync each course
    const results: SyncResult[] = [];
    let successCount = 0;
    let errorCount = 0;

    logSyncOperation('sync_progress', {
      userId: session.user.id,
      totalCourses: coursesToSync.length,
    });

    for (const course of coursesToSync) {
      try {
        logSyncOperation('course_sync_start', {
          courseId: course.id,
          courseTitle: course.title,
        });
        // Check if product already exists in Stripe
        let productId = course.stripeProductId;
        let priceId = course.stripePriceId;
        let paymentLinkUrl = course.stripePaymentLinkUrl;

        if (!productId) {
          // Check if there's an existing product by metadata
          const existingProduct = await findExistingProduct(course.id);
          if (existingProduct) {
            productId = existingProduct.id;
          }
        }

        if (productId && !priceId) {
          // Check for existing price
          const prices = await getProductPrices(productId);
          const matchingPrice = prices.find(
            (p) =>
              p.unit_amount === course.priceCents &&
              p.currency.toLowerCase() === course.currency.toLowerCase()
          );
          if (matchingPrice) {
            priceId = matchingPrice.id;
          }
        }

        // Create missing components
        if (!productId || !priceId || !paymentLinkUrl) {
          if (!productId) {
            // Create full chain
            const result = await createFullPaymentLink({
              id: course.id,
              title: course.title,
              description: course.description,
              thumbnailUrl: course.thumbnailUrl,
              priceCents: course.priceCents,
              currency: course.currency,
            });
            productId = result.productId;
            priceId = result.priceId;
            paymentLinkUrl = result.paymentLinkUrl;
          } else if (!priceId) {
            // Create price and payment link
            const price = await createStripePrice(
              productId,
              course.priceCents,
              course.currency
            );
            priceId = price.id;
            const link = await createPaymentLink(priceId, course.title);
            paymentLinkUrl = link.url;
          } else if (!paymentLinkUrl) {
            // Just create payment link
            const link = await createPaymentLink(priceId, course.title);
            paymentLinkUrl = link.url;
          }
        }

        // Update course in database
        await updateCourseStripeInfo(course.id, {
          stripeProductId: productId,
          stripePriceId: priceId,
          stripePaymentLinkUrl: paymentLinkUrl,
        });

        results.push({
          courseId: course.id,
          title: course.title,
          success: true,
          stripeProductId: productId,
          stripePriceId: priceId,
          stripePaymentLinkUrl: paymentLinkUrl || undefined,
        });
        successCount++;

        logSyncOperation('course_sync_success', {
          courseId: course.id,
          stripeProductId: productId,
          stripePriceId: priceId,
        });
      } catch (error) {
        const sanitized = sanitizeError(error);
        results.push({
          courseId: course.id,
          title: course.title,
          success: false,
          error: sanitized,
        });
        errorCount++;

        logSyncOperation('course_sync_error', {
          courseId: course.id,
          error: sanitized,
        });
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    logSyncOperation('sync_complete', {
      userId: session.user.id,
      totalCourses: coursesToSync.length,
      successCount,
      errorCount,
    });

    return NextResponse.json({
      message: `Synced ${successCount} courses, ${errorCount} errors`,
      synced: successCount,
      errors: errorCount,
      results,
    });
  } catch (error) {
    const sanitized = sanitizeError(error);
    return NextResponse.json(
      { error: sanitized },
      { status: 500 }
    );
  }
}
