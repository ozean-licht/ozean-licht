/**
 * POST /api/waitlist/subscribe
 *
 * Handles waitlist subscription with email validation and double opt-in flow.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import { prismaKA } from '@/lib/db/prisma-client'
import { sendConfirmationEmail } from '@/lib/email/waitlist-emails'
import { WaitlistStatus } from '@/types/waitlist'
import type { WaitlistSubscribeResponse } from '@/types/waitlist'

// Email validation schema
const subscribeSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse')
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validationResult = subscribeSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json<WaitlistSubscribeResponse>(
        {
          success: false,
          message: 'Ungültige E-Mail-Adresse. Bitte überprüfe deine Eingabe.'
        },
        { status: 400 }
      )
    }

    const { email } = validationResult.data
    const normalizedEmail = email.toLowerCase().trim()

    // Get client information for spam detection
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null
    const userAgent = request.headers.get('user-agent') || null

    // Check if email already exists
    const existingEntry = await prismaKA.waitlist.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingEntry) {
      // If already confirmed, return appropriate message
      if (existingEntry.status === WaitlistStatus.CONFIRMED) {
        return NextResponse.json<WaitlistSubscribeResponse>(
          {
            success: true,
            message: 'Du bist bereits auf unserer Warteliste! Wir benachrichtigen dich, sobald es losgeht.',
            alreadyConfirmed: true
          },
          { status: 200 }
        )
      }

      // If pending, regenerate token and resend confirmation
      const newToken = randomBytes(32).toString('hex')

      await prismaKA.waitlist.update({
        where: { email: normalizedEmail },
        data: {
          token: newToken,
          ipAddress,
          userAgent,
          updatedAt: new Date()
        }
      })

      // Send new confirmation email
      await sendConfirmationEmail(normalizedEmail, newToken)

      return NextResponse.json<WaitlistSubscribeResponse>(
        {
          success: true,
          message: 'Bestätigungs-E-Mail wurde erneut gesendet. Bitte überprüfe deinen Posteingang.'
        },
        { status: 200 }
      )
    }

    // Create new waitlist entry
    const token = randomBytes(32).toString('hex')

    await prismaKA.waitlist.create({
      data: {
        email: normalizedEmail,
        token,
        status: WaitlistStatus.PENDING,
        ipAddress,
        userAgent
      }
    })

    // Send confirmation email
    await sendConfirmationEmail(normalizedEmail, token)

    return NextResponse.json<WaitlistSubscribeResponse>(
      {
        success: true,
        message: 'Fast geschafft! Bitte überprüfe deine E-Mails und bestätige deine Adresse.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Waitlist subscription error:', error)

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('email')) {
        return NextResponse.json<WaitlistSubscribeResponse>(
          {
            success: false,
            message: 'Es gab ein Problem beim Versenden der Bestätigungs-E-Mail. Bitte versuche es später erneut.'
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json<WaitlistSubscribeResponse>(
      {
        success: false,
        message: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.'
      },
      { status: 500 }
    )
  }
}
