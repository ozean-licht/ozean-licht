/**
 * Ablefy Webhook Endpoint
 * Receives transaction data directly from Ablefy
 *
 * POST /api/webhooks/ablefy
 */

import { NextRequest, NextResponse } from 'next/server'
import { upsertTransaction, type AblefyWebhookPayload } from '@/lib/db/transactions'

// Webhook secret for authentication
const WEBHOOK_SECRET = process.env.ABLEFY_WEBHOOK_SECRET || process.env.N8N_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get('authorization')
    const webhookSecret = request.headers.get('x-webhook-secret')

    // Accept either Bearer token or x-webhook-secret header
    const providedSecret = webhookSecret || authHeader?.replace('Bearer ', '')

    if (WEBHOOK_SECRET && providedSecret !== WEBHOOK_SECRET) {
      console.error('[Ablefy Webhook] Invalid webhook secret')
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid webhook secret' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()

    // Handle both single transaction and array of transactions
    const transactions: AblefyWebhookPayload[] = Array.isArray(body) ? body : [body]

    const results = []
    const errors = []

    for (const payload of transactions) {
      // Validate required fields
      if (!payload.trx_id) {
        errors.push({ trx_id: null, error: 'Missing required field: trx_id' })
        continue
      }

      if (!payload.email) {
        errors.push({ trx_id: payload.trx_id, error: 'Missing required field: email' })
        continue
      }

      if (!payload.typ) {
        errors.push({ trx_id: payload.trx_id, error: 'Missing required field: typ' })
        continue
      }

      if (!payload.zahlungsart) {
        errors.push({ trx_id: payload.trx_id, error: 'Missing required field: zahlungsart' })
        continue
      }

      try {
        const transaction = await upsertTransaction(payload)
        results.push({
          trx_id: payload.trx_id,
          id: transaction.id,
          status: 'success'
        })

        console.log(`[Ablefy Webhook] Processed transaction ${payload.trx_id} - ${payload.status} - €${payload.bezahlt}`)
      } catch (error) {
        console.error(`[Ablefy Webhook] Error processing transaction ${payload.trx_id}:`, error)
        errors.push({
          trx_id: payload.trx_id,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Return response
    if (errors.length > 0 && results.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'All transactions failed',
          errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} transaction(s)`,
      processed: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('[Ablefy Webhook] Unexpected error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'ablefy-webhook',
    timestamp: new Date().toISOString()
  })
}
