/**
 * Waitlist Email Functions
 *
 * Business logic for sending waitlist-related emails using React Email templates.
 */

import { render } from '@react-email/components'
import KAWaitlistConfirm from '@shared/email-templates/emails/ka-waitlist-confirm'
import KAWaitlistWelcome from '@shared/email-templates/emails/ka-waitlist-welcome'
import { sendEmail } from './resend-client'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

/**
 * Send confirmation email with verification link
 */
export async function sendConfirmationEmail(email: string, token: string) {
  try {
    const confirmUrl = `${BASE_URL}/waitlist/confirm/${token}`

    const html = await render(
      KAWaitlistConfirm({
        confirmUrl
      })
    )

    await sendEmail({
      to: email,
      subject: 'Bestätige deine E-Mail-Adresse für Kids Ascension',
      html
    })

    console.log('Confirmation email sent:', { email, token: token.substring(0, 8) + '...' })
    return { success: true }
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    throw new Error('Failed to send confirmation email')
  }
}

/**
 * Send welcome email after successful confirmation
 */
export async function sendWelcomeEmail(email: string) {
  try {
    const html = await render(KAWaitlistWelcome({}))

    await sendEmail({
      to: email,
      subject: 'Willkommen bei Kids Ascension! 🎉',
      html
    })

    console.log('Welcome email sent:', { email })
    return { success: true }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    // Don't throw here - welcome email is not critical
    // User is already confirmed, just log the error
    return { success: false, error }
  }
}
