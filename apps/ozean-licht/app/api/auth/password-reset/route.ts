/**
 * Password Reset API Endpoint (STUB)
 *
 * This is a stub endpoint for password reset functionality.
 * Full implementation will include:
 * - Generate secure reset token
 * - Store token with expiry in database
 * - Send password reset email via MCP Gateway
 * - Create reset confirmation page
 *
 * TODO: Implement full password reset flow before production deployment
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/password-reset
 * Request password reset (STUB)
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

    // TODO: Implement password reset logic:
    // 1. Verify email exists in database (without revealing if it does)
    // 2. Generate secure reset token (crypto.randomBytes)
    // 3. Store token in database with 30-minute expiry
    // 4. Send password reset email via MCP Gateway
    // 5. Return success message (even if email doesn't exist to prevent enumeration)

    // For now, return a helpful message
    return NextResponse.json(
      {
        success: true,
        message: 'Passwort-Reset wird derzeit implementiert. Bitte kontaktieren Sie den Support unter support@ozean-licht.de für Unterstützung.',
      },
      { status: 200 }
    );

  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Password Reset API] Error:', error);
    }

    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}
