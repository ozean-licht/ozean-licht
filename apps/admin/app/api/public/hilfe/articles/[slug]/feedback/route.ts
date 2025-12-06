/**
 * Public Help Center Article Feedback API
 * No authentication required - for public visitors
 *
 * Security Features:
 * - CSRF Protection via Origin header validation
 * - Zod Input Validation
 * - Session Hash for spam prevention
 * - In-memory rate limiting
 */
import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { createHash } from 'crypto';
import { getArticleBySlug, incrementHelpfulCount } from '@/lib/db/knowledge-articles';
import { execute } from '@/lib/db/index';

// =====================================================
// TYPES & SCHEMAS
// =====================================================

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * Feedback input validation schema
 */
const feedbackSchema = z.object({
  helpful: z.boolean({
    required_error: 'helpful field is required',
    invalid_type_error: 'helpful must be a boolean',
  }),
  feedback: z.string()
    .max(1000, 'Feedback must be 1000 characters or less')
    .optional()
    .transform(val => val?.trim() || undefined),
});

type FeedbackInput = z.infer<typeof feedbackSchema>;

// =====================================================
// RATE LIMITING
// =====================================================

/**
 * In-memory rate limiter for feedback submissions
 * Tracks IP + article pairs to prevent rapid spam
 */
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // 3 requests per minute per IP+article

/**
 * Clean up expired rate limit entries every 5 minutes
 */
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];

  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetAt) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => rateLimitMap.delete(key));
}, 5 * 60 * 1000);

/**
 * Check if request is rate limited
 * @returns true if rate limit exceeded
 */
function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    // Create new entry or reset expired entry
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count++;
  return false;
}

// =====================================================
// SECURITY HELPERS
// =====================================================

/**
 * Get client IP address from request headers
 */
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');

  if (forwarded) {
    // x-forwarded-for can be a comma-separated list, take the first one
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

/**
 * Generate session hash for spam prevention
 * Combines IP + article ID to create unique identifier
 */
function generateSessionHash(ip: string, articleId: string): string {
  return createHash('sha256')
    .update(`${ip}:${articleId}`)
    .digest('hex');
}

/**
 * Validate CSRF via Origin header
 * @returns true if origin is valid
 */
function validateOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');

  // Allowed origins based on environment
  const allowedOrigins = [
    'https://admin.ozean-licht.at',
    'https://ozean-licht.at',
    'https://www.ozean-licht.at',
    'https://kids-ascension.com',
    'https://www.kids-ascension.com',
    // Allow localhost in development
    ...(process.env.NODE_ENV === 'development'
      ? ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000']
      : []
    ),
  ];

  // Origin header must be present and in allowed list
  if (!origin) {
    return false;
  }

  return allowedOrigins.includes(origin);
}

// =====================================================
// API HANDLER
// =====================================================

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    // ====== 1. CSRF PROTECTION ======
    if (!validateOrigin(req)) {
      return NextResponse.json(
        { error: 'Forbidden: Invalid origin' },
        { status: 403 }
      );
    }

    // ====== 2. GET CLIENT IP & VALIDATE SLUG ======
    const { slug } = await params;
    const clientIp = getClientIp(req);

    // ====== 3. RATE LIMITING ======
    const rateLimitKey = `${clientIp}:${slug}`;
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // ====== 4. PARSE & VALIDATE INPUT ======
    let body: unknown;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const validated: FeedbackInput = feedbackSchema.parse(body);
    const { helpful, feedback } = validated;

    // ====== 5. VERIFY ARTICLE EXISTS ======
    const article = await getArticleBySlug(slug);
    if (!article || article.status !== 'published') {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // ====== 6. GENERATE SESSION HASH ======
    const sessionHash = generateSessionHash(clientIp, article.id);

    // ====== 7. STORE FEEDBACK ======
    // Increment helpful count if positive feedback
    if (helpful) {
      await incrementHelpfulCount(article.id);
    }

    // Store detailed feedback with session hash for spam prevention
    if (feedback) {
      await execute(
        `INSERT INTO article_feedback (article_id, helpful, feedback, session_hash, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (article_id, session_hash)
         WHERE session_hash IS NOT NULL
         DO NOTHING`,
        [article.id, helpful, feedback, sessionHash]
      ).catch((error) => {
        // Log error but don't fail the request if feedback table doesn't exist
        // eslint-disable-next-line no-console
        console.error('Failed to store detailed feedback:', error);
      });
    } else {
      // Even without feedback text, record the helpful/not helpful vote
      await execute(
        `INSERT INTO article_feedback (article_id, helpful, feedback, session_hash, created_at)
         VALUES ($1, $2, NULL, $3, NOW())
         ON CONFLICT (article_id, session_hash)
         WHERE session_hash IS NOT NULL
         DO NOTHING`,
        [article.id, helpful, sessionHash]
      ).catch((error) => {
        // Log error but don't fail the request
        // eslint-disable-next-line no-console
        console.error('Failed to store feedback vote:', error);
      });
    }

    // ====== 8. SUCCESS RESPONSE ======
    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback!'
    });

  } catch (error) {
    // ====== ERROR HANDLING ======

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Handle unexpected errors
    // eslint-disable-next-line no-console
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback. Please try again.' },
      { status: 500 }
    );
  }
}

// =====================================================
// CORS HEADERS (Optional)
// =====================================================

/**
 * Handle preflight OPTIONS requests for CORS
 */
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');

  if (!validateOrigin(req)) {
    return new NextResponse(null, { status: 403 });
  }

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}
