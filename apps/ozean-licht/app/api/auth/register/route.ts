/**
 * User Registration API Endpoint
 *
 * Handles new user registration with email/password.
 * - Validates input (email, password strength)
 * - Hashes password with bcrypt (12 rounds)
 * - Inserts user into database via MCP Gateway
 * - Returns success/error response
 *
 * SECURITY NOTES:
 * - Minimum password length: 12 characters
 * - Generic error messages prevent email enumeration
 * - TODO: Add rate limiting to prevent abuse (5 attempts per IP per 15 minutes)
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// MCP Gateway URL for database operations
const MCP_GATEWAY_URL = process.env.MCP_GATEWAY_URL || 'http://localhost:8100';

/**
 * Query the database via MCP Gateway
 */
async function queryDatabase(sql: string, params: unknown[] = []): Promise<any> {
  try {
    const response = await fetch(`${MCP_GATEWAY_URL}/mcp/postgres/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        database: process.env.DATABASE_NAME || 'ozean_licht_db',
        query: sql,
        params,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`MCP Gateway error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result.rows || [];
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Registration API] Database query failed:', error);
    }
    throw error;
  }
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Requirements: Minimum 12 characters
 */
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 12) {
    return {
      valid: false,
      error: 'Das Passwort muss mindestens 12 Zeichen lang sein.',
    };
  }

  return { valid: true };
}

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, newsletterAccepted } = body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Alle Pflichtfelder müssen ausgefüllt werden.' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = await queryDatabase(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUsers.length > 0) {
      // Use generic error message to prevent email enumeration
      return NextResponse.json(
        { error: 'Die Registrierung konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.' },
        { status: 400 }
      );
    }

    // Hash password with bcrypt (12 rounds)
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert new user into database
    const insertResult = await queryDatabase(
      `INSERT INTO users (email, password_hash, full_name, newsletter_subscribed, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, email, full_name, created_at`,
      [email.toLowerCase(), passwordHash, fullName, newsletterAccepted || false]
    );

    if (insertResult.length === 0) {
      throw new Error('Failed to create user');
    }

    const newUser = insertResult[0];

    // Return success response (201 Created)
    return NextResponse.json(
      {
        success: true,
        message: 'Registrierung erfolgreich! Sie können sich jetzt anmelden.',
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Registration API] Error:', error);
    }

    // Return generic error message to prevent information disclosure
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}
