/**
 * Widget Identify API
 * POST /api/widget/identify - Identify/update widget user
 *
 * PUBLIC endpoint - validates via widget headers
 *
 * Required headers:
 * - X-Widget-Platform-Key: string
 * - X-Widget-Session-Id: string
 *
 * Body:
 * - email: string (required)
 * - name?: string (optional)
 * - hmac?: string (optional, for identity verification)
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/index';
import { createHmac } from 'crypto';
import { getWidgetCORSHeaders, validatePlatformKey } from '@/lib/widget/cors';

// Environment configuration
const WIDGET_HMAC_SECRET = process.env.WIDGET_HMAC_SECRET;

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getWidgetCORSHeaders(request.headers.get('Origin')) });
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate HMAC for email verification
 */
function generateHmac(email: string, secret: string): string {
  return createHmac('sha256', secret).update(email).digest('hex');
}

/**
 * Validate widget authentication headers
 */
function validateWidgetAuth(request: NextRequest): { valid: boolean; error?: string } {
  const platformKey = request.headers.get('X-Widget-Platform-Key');
  const sessionId = request.headers.get('X-Widget-Session-Id');

  if (!platformKey) {
    return { valid: false, error: 'Missing X-Widget-Platform-Key header' };
  }

  if (!sessionId) {
    return { valid: false, error: 'Missing X-Widget-Session-Id header' };
  }

  // Validate platform key against environment variables
  const platformValidation = validatePlatformKey(platformKey);
  if (!platformValidation.valid) {
    return { valid: false, error: 'Invalid platform key' };
  }

  return { valid: true };
}

/**
 * Database row type for contacts
 */
interface DBContact {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  custom_attributes: Record<string, unknown>;
  platform: string;
  created_at: string;
  updated_at: string;
}

/**
 * Find or create contact by email or session
 */
async function findOrCreateContact(
  email: string,
  sessionId: string,
  name?: string,
  platform: string = 'ozean_licht'
): Promise<DBContact> {
  // Step 1: Try to find contact by email
  const existingByEmail = await query<DBContact>(
    `SELECT * FROM contacts WHERE email = $1 AND platform = $2 LIMIT 1`,
    [email, platform]
  );

  if (existingByEmail.length > 0) {
    const contact = existingByEmail[0];

    // Update name if provided and different
    if (name && name !== contact.name) {
      const updated = await query<DBContact>(
        `UPDATE contacts
         SET name = $1,
             custom_attributes = jsonb_set(
               COALESCE(custom_attributes, '{}'::jsonb),
               '{widget_session_id}',
               $2::jsonb
             ),
             updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [name, JSON.stringify(sessionId), contact.id]
      );
      return updated[0];
    }

    // Update session tracking
    const updatedSession = await query<DBContact>(
      `UPDATE contacts
       SET custom_attributes = jsonb_set(
         COALESCE(custom_attributes, '{}'::jsonb),
         '{widget_session_id}',
         $1::jsonb
       ),
       updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(sessionId), contact.id]
    );

    return updatedSession[0];
  }

  // Step 2: Try to find contact by session ID
  const existingBySession = await query<DBContact>(
    `SELECT * FROM contacts
     WHERE custom_attributes->>'widget_session_id' = $1
     AND platform = $2
     LIMIT 1`,
    [sessionId, platform]
  );

  if (existingBySession.length > 0) {
    const contact = existingBySession[0];

    // Update email and name (contact was anonymous, now identified)
    const updated = await query<DBContact>(
      `UPDATE contacts
       SET email = $1,
           name = COALESCE($2, name),
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [email, name || null, contact.id]
    );

    return updated[0];
  }

  // Step 3: Create new contact
  const customAttributes = {
    widget_session_id: sessionId,
    identified_at: new Date().toISOString(),
  };

  const created = await query<DBContact>(
    `INSERT INTO contacts (email, name, platform, custom_attributes)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [email, name || null, platform, JSON.stringify(customAttributes)]
  );

  return created[0];
}

/**
 * POST handler - Identify or update widget user
 */
export async function POST(request: NextRequest) {
  const requestOrigin = request.headers.get('Origin');
  const corsHeaders = getWidgetCORSHeaders(requestOrigin);

  try {
    // Step 1: Validate widget authentication headers
    const authValidation = validateWidgetAuth(request);
    if (!authValidation.valid) {
      return NextResponse.json(
        { error: authValidation.error },
        { status: 401, headers: corsHeaders }
      );
    }

    const sessionId = request.headers.get('X-Widget-Session-Id')!;

    // Step 2: Parse and validate request body
    let body: { email: string; name?: string; hmac?: string };
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { email, name, hmac } = body;

    // Validate email presence
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate email length
    if (email.length > 255) {
      return NextResponse.json(
        { error: 'Email is too long (max 255 characters)' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate name length if provided
    if (name && name.length > 255) {
      return NextResponse.json(
        { error: 'Name is too long (max 255 characters)' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Step 3: Optional HMAC verification
    if (hmac && WIDGET_HMAC_SECRET) {
      const expectedHmac = generateHmac(email, WIDGET_HMAC_SECRET);
      if (hmac !== expectedHmac) {
        console.warn('[Widget Identify] HMAC verification failed', {
          email,
          sessionId,
          providedHmac: hmac.substring(0, 8) + '...',
          expectedHmac: expectedHmac.substring(0, 8) + '...',
        });
        return NextResponse.json(
          { error: 'HMAC verification failed' },
          { status: 403, headers: corsHeaders }
        );
      }
    }

    // Step 4: Find or create contact
    const contact = await findOrCreateContact(email, sessionId, name);

    // Step 5: Return contact information
    const response = {
      id: contact.id,
      email: contact.email,
      name: contact.name,
      avatarUrl: contact.avatar_url,
    };

    console.log('[Widget Identify] Contact identified:', {
      contactId: contact.id,
      email: contact.email,
      sessionId,
      isNew: !contact.custom_attributes.identified_at,
    });

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('[Widget Identify] Unexpected error:', error);

    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'Contact with this email already exists' },
        { status: 409, headers: getWidgetCORSHeaders(request.headers.get('Origin')) }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: getWidgetCORSHeaders(request.headers.get('Origin')) }
    );
  }
}
