/**
 * Magic Link Authentication API Endpoint (STUB)
 *
 * This is a stub endpoint for magic link (passwordless) authentication.
 * Full implementation will include:
 * - Generate secure one-time token
 * - Store token with expiry in database
 * - Send magic link email via MCP Gateway
 * - Create verification page that accepts token and creates session
 *
 * TODO: Implement full magic link flow before production deployment
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/magic-link
 * Request magic link (STUB)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist erforderlich.' },
        { status: 400 }
      );
    }

    // TODO: Implement magic link logic:
    // 1. Verify email exists in database (without revealing if it does)
    // 2. Generate secure one-time token (crypto.randomBytes)
    // 3. Store token in database with 15-minute expiry
    // 4. Send magic link email via MCP Gateway
    // 5. Return success message (even if email doesn't exist to prevent enumeration)

    // For now, return a helpful message
    return NextResponse.json(
      {
        success: true,
        message: 'Magic Link Authentifizierung wird derzeit implementiert. Bitte verwenden Sie die normale Anmeldung mit E-Mail und Passwort.',
      },
      { status: 200 }
    );

  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Magic Link API] Error:', error);
    }

    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}
