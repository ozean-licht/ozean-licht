/**
 * GET /api/waitlist/confirm/[token]
 *
 * Handles email confirmation via token and sends welcome email.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prismaKA } from '@/lib/db/prisma-client'
import { sendWelcomeEmail } from '@/lib/email/waitlist-emails'
import { WaitlistStatus } from '@/types/waitlist'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params

    if (!token || token.length !== 64) {
      return NextResponse.redirect(
        new URL('/waitlist/confirmed?error=invalid_token', request.url)
      )
    }

    // Find waitlist entry by token
    const waitlistEntry = await prismaKA.waitlist.findUnique({
      where: { token }
    })

    if (!waitlistEntry) {
      return NextResponse.redirect(
        new URL('/waitlist/confirmed?error=not_found', request.url)
      )
    }

    // If already confirmed, redirect with success message
    if (waitlistEntry.status === WaitlistStatus.CONFIRMED) {
      return NextResponse.redirect(
        new URL(
          `/waitlist/confirmed?email=${encodeURIComponent(waitlistEntry.email)}&already_confirmed=true`,
          request.url
        )
      )
    }

    // Update status to confirmed
    await prismaKA.waitlist.update({
      where: { token },
      data: {
        status: WaitlistStatus.CONFIRMED,
        confirmedAt: new Date()
      }
    })

    // Send welcome email (non-blocking)
    sendWelcomeEmail(waitlistEntry.email).catch((error) => {
      console.error('Failed to send welcome email:', error)
      // Don't fail the confirmation if welcome email fails
    })

    // Redirect to success page
    return NextResponse.redirect(
      new URL(
        `/waitlist/confirmed?email=${encodeURIComponent(waitlistEntry.email)}`,
        request.url
      )
    )
  } catch (error) {
    console.error('Waitlist confirmation error:', error)

    return NextResponse.redirect(
      new URL('/waitlist/confirmed?error=server_error', request.url)
    )
  }
}
