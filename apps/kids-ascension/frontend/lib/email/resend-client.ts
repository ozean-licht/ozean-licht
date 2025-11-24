/**
 * Resend Email Client
 *
 * Wrapper around the Resend SDK with error handling and logging.
 */

import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set')
}

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY)

// Default sender email
// In development: use onboarding@resend.dev
// In production: use noreply@kids-ascension.dev (after domain verification)
export const DEFAULT_FROM_EMAIL =
  process.env.NODE_ENV === 'production'
    ? 'Kids Ascension <noreply@kids-ascension.dev>'
    : 'Kids Ascension <onboarding@resend.dev>'

// Email sending helper with error handling
export async function sendEmail({
  to,
  subject,
  html,
  from = DEFAULT_FROM_EMAIL
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html
    })

    if (error) {
      console.error('Resend API error:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    console.log('Email sent successfully:', { to, subject, id: data?.id })
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
