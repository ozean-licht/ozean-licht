/**
 * Transactions Database Module
 * Handles Ablefy transaction CRUD operations
 */

import { query, execute } from './index'

// Types
export interface Transaction {
  id: string
  trx_id: number | null
  relevante_id: string | null
  rechnungsnummer: string | null
  invoice_number: string | null
  stripe_payment_intent_id: string | null
  stripe_charge_id: string | null
  transaction_date: string | null
  datum_raw: string | null
  erfolgt_am: string | null
  status: string
  typ: string
  zahlungsart: string
  order_number: number | null
  product_id: number | null
  produkt: string | null
  psp: string | null
  course_id: number | null
  faelliger_betrag: number
  bezahlt: number
  bezahlt_minus_fee: number | null
  netto: number | null
  einnahmen_netto: number | null
  fees_total: number
  fees_service: number
  fees_payment_provider: number
  vat_rate: number
  ust: number
  steuerkategorie: string | null
  waehrung: string
  plan: string | null
  zahlungsplan_id: number | null
  faelligkeiten_id: number | null
  gutscheincode: string | null
  buyer_email: string
  buyer_first_name: string | null
  buyer_last_name: string | null
  buyer_phone: string | null
  buyer_land: string | null
  buyer_stadt: string | null
  buyer_strasse: string | null
  buyer_hausnummer: string | null
  buyer_plz: number | null
  buyer_adress_zusatz: string | null
  buyer_country_code: string | null
  buyer_ust_id: string | null
  buyer_unternehmen: string | null
  recipient_name: string | null
  recipient_email: string | null
  recipient_phone: string | null
  recipient_land: string | null
  recipient_strasse: string | null
  recipient_hausnummer: string | null
  recipient_firma: string | null
  rechnungs_id: number | null
  rechnungsdatum: string | null
  ext_id: string | null
  gutschrift: string | null
  account_type: string
  source_platform: string
  order_id: string | null
  user_id: string | null
  imported_from_ablefy: boolean
  imported_at: string | null
  created_at: string
  updated_at: string
}

export interface AblefyWebhookPayload {
  trx_id: number
  relevante_id?: string
  rechnungsnummer?: string
  datum: string
  erfolgt_am?: string
  status: string
  typ: string
  zahlungsart: string
  order_number?: number
  product_id?: number
  produkt?: string
  psp?: string
  faelliger_betrag?: number
  bezahlt?: number
  bezahlt_minus_fee?: number
  waehrung?: string
  fees_total?: number
  fees_service?: number
  fees_payment_provider?: number
  vat_rate?: number
  ust?: number
  plan?: string
  zahlungsplan_id?: number
  gutscheincode?: string
  vorname?: string
  nachname?: string
  email: string
  telefon?: string
  land?: string
  stadt?: string
  strasse?: string
  hausnummer?: string
  plz?: number
  ust_id?: string
  unternehmen?: string
  account_type?: 'old' | 'new'
}

// Parse date strings from Ablefy format
function parseDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null

  // Handle ISO format
  if (dateStr.includes('T')) {
    return new Date(dateStr).toISOString()
  }

  // Parse DD.MM.YYYY HH:mm format
  const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})/)
  if (match) {
    const [, day, month, year, hour, minute] = match
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00.000Z`).toISOString()
  }

  return null
}

/**
 * Upsert a transaction from Ablefy webhook
 */
export async function upsertTransaction(payload: AblefyWebhookPayload): Promise<Transaction> {
  const transactionDate = parseDate(payload.datum)

  const result = await execute<Transaction>(
    `INSERT INTO transactions (
      trx_id, relevante_id, rechnungsnummer,
      transaction_date, datum_raw, erfolgt_am,
      status, typ, zahlungsart,
      order_number, product_id, produkt, psp,
      faelliger_betrag, bezahlt, bezahlt_minus_fee,
      fees_total, fees_service, fees_payment_provider,
      vat_rate, ust, waehrung,
      plan, zahlungsplan_id, gutscheincode,
      buyer_email, buyer_first_name, buyer_last_name,
      buyer_phone, buyer_land, buyer_stadt,
      buyer_strasse, buyer_hausnummer, buyer_plz,
      buyer_ust_id, buyer_unternehmen,
      account_type, source_platform, imported_from_ablefy
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
      $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
      $31, $32, $33, $34, $35, $36, $37, $38, $39
    )
    ON CONFLICT (trx_id) WHERE trx_id IS NOT NULL
    DO UPDATE SET
      relevante_id = EXCLUDED.relevante_id,
      rechnungsnummer = EXCLUDED.rechnungsnummer,
      transaction_date = EXCLUDED.transaction_date,
      datum_raw = EXCLUDED.datum_raw,
      erfolgt_am = EXCLUDED.erfolgt_am,
      status = EXCLUDED.status,
      typ = EXCLUDED.typ,
      zahlungsart = EXCLUDED.zahlungsart,
      order_number = EXCLUDED.order_number,
      product_id = EXCLUDED.product_id,
      produkt = EXCLUDED.produkt,
      psp = EXCLUDED.psp,
      faelliger_betrag = EXCLUDED.faelliger_betrag,
      bezahlt = EXCLUDED.bezahlt,
      bezahlt_minus_fee = EXCLUDED.bezahlt_minus_fee,
      fees_total = EXCLUDED.fees_total,
      fees_service = EXCLUDED.fees_service,
      fees_payment_provider = EXCLUDED.fees_payment_provider,
      vat_rate = EXCLUDED.vat_rate,
      ust = EXCLUDED.ust,
      waehrung = EXCLUDED.waehrung,
      plan = EXCLUDED.plan,
      zahlungsplan_id = EXCLUDED.zahlungsplan_id,
      gutscheincode = EXCLUDED.gutscheincode,
      buyer_email = EXCLUDED.buyer_email,
      buyer_first_name = EXCLUDED.buyer_first_name,
      buyer_last_name = EXCLUDED.buyer_last_name,
      buyer_phone = EXCLUDED.buyer_phone,
      buyer_land = EXCLUDED.buyer_land,
      buyer_stadt = EXCLUDED.buyer_stadt,
      buyer_strasse = EXCLUDED.buyer_strasse,
      buyer_hausnummer = EXCLUDED.buyer_hausnummer,
      buyer_plz = EXCLUDED.buyer_plz,
      buyer_ust_id = EXCLUDED.buyer_ust_id,
      buyer_unternehmen = EXCLUDED.buyer_unternehmen,
      account_type = EXCLUDED.account_type,
      updated_at = NOW()
    RETURNING *`,
    [
      payload.trx_id,
      payload.relevante_id || null,
      payload.rechnungsnummer || null,
      transactionDate,
      payload.datum || null,
      payload.erfolgt_am || null,
      payload.status,
      payload.typ,
      payload.zahlungsart,
      payload.order_number || null,
      payload.product_id || null,
      payload.produkt || null,
      payload.psp || null,
      payload.faelliger_betrag || 0,
      payload.bezahlt || 0,
      payload.bezahlt_minus_fee || null,
      payload.fees_total || 0,
      payload.fees_service || 0,
      payload.fees_payment_provider || 0,
      payload.vat_rate || 0,
      payload.ust || 0,
      payload.waehrung || 'EUR',
      payload.plan || null,
      payload.zahlungsplan_id || null,
      payload.gutscheincode || null,
      payload.email,
      payload.vorname || null,
      payload.nachname || null,
      payload.telefon || null,
      payload.land || null,
      payload.stadt || null,
      payload.strasse || null,
      payload.hausnummer || null,
      payload.plz || null,
      payload.ust_id || null,
      payload.unternehmen || null,
      payload.account_type || 'new',
      'ablefy',
      true
    ]
  )

  return result.rows[0]
}

/**
 * Get transaction by trx_id
 */
export async function getTransactionByTrxId(trxId: number): Promise<Transaction | null> {
  const rows = await query<Transaction>(
    'SELECT * FROM transactions WHERE trx_id = $1',
    [trxId]
  )
  return rows[0] || null
}

/**
 * Get transactions with filters
 */
export async function getTransactions(options: {
  status?: string
  email?: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}): Promise<{ transactions: Transaction[]; total: number }> {
  const conditions: string[] = []
  const params: unknown[] = []
  let paramIndex = 1

  if (options.status) {
    conditions.push(`status = $${paramIndex++}`)
    params.push(options.status)
  }

  if (options.email) {
    conditions.push(`buyer_email ILIKE $${paramIndex++}`)
    params.push(`%${options.email}%`)
  }

  if (options.startDate) {
    conditions.push(`transaction_date >= $${paramIndex++}`)
    params.push(options.startDate)
  }

  if (options.endDate) {
    conditions.push(`transaction_date <= $${paramIndex++}`)
    params.push(options.endDate)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  // Get total count
  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM transactions ${whereClause}`,
    params
  )
  const total = parseInt(countResult[0]?.count || '0', 10)

  // Get paginated results
  const limit = options.limit || 50
  const offset = options.offset || 0

  const transactions = await query<Transaction>(
    `SELECT * FROM transactions ${whereClause}
     ORDER BY transaction_date DESC
     LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
    [...params, limit, offset]
  )

  return { transactions, total }
}

/**
 * Get transaction statistics
 */
export async function getTransactionStats(): Promise<{
  total: number
  successful: number
  pending: number
  failed: number
  totalRevenue: number
  last24Hours: number
  last7Days: number
}> {
  const result = await query<{
    total: string
    successful: string
    pending: string
    failed: string
    total_revenue: string
    last_24_hours: string
    last_7_days: string
  }>(`
    SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN status IN ('Erfolgreich', 'successful') THEN 1 END) as successful,
      COUNT(CASE WHEN status IN ('Ausstehend', 'pending', 'waiting') THEN 1 END) as pending,
      COUNT(CASE WHEN status IN ('Fehlgeschlagen', 'failed', 'error') THEN 1 END) as failed,
      COALESCE(SUM(bezahlt), 0) as total_revenue,
      COUNT(CASE WHEN transaction_date > NOW() - INTERVAL '1 day' THEN 1 END) as last_24_hours,
      COUNT(CASE WHEN transaction_date > NOW() - INTERVAL '7 days' THEN 1 END) as last_7_days
    FROM transactions
  `)

  const stats = result[0]
  return {
    total: parseInt(stats?.total || '0', 10),
    successful: parseInt(stats?.successful || '0', 10),
    pending: parseInt(stats?.pending || '0', 10),
    failed: parseInt(stats?.failed || '0', 10),
    totalRevenue: parseFloat(stats?.total_revenue || '0'),
    last24Hours: parseInt(stats?.last_24_hours || '0', 10),
    last7Days: parseInt(stats?.last_7_days || '0', 10)
  }
}

/**
 * Bulk insert transactions (for migration)
 */
export async function bulkInsertTransactions(transactions: Partial<Transaction>[]): Promise<number> {
  if (transactions.length === 0) return 0

  // Use a transaction for bulk insert
  let insertedCount = 0

  for (const txn of transactions) {
    try {
      await execute(
        `INSERT INTO transactions (
          id, trx_id, relevante_id, rechnungsnummer, invoice_number,
          stripe_payment_intent_id, stripe_charge_id,
          transaction_date, datum_raw, erfolgt_am,
          status, typ, zahlungsart,
          order_number, product_id, produkt, psp, course_id,
          faelliger_betrag, bezahlt, bezahlt_minus_fee,
          netto, einnahmen_netto,
          fees_total, fees_service, fees_payment_provider,
          vat_rate, ust, steuerkategorie, waehrung,
          plan, zahlungsplan_id, faelligkeiten_id, gutscheincode,
          buyer_email, buyer_first_name, buyer_last_name,
          buyer_phone, buyer_land, buyer_stadt,
          buyer_strasse, buyer_hausnummer, buyer_plz,
          buyer_adress_zusatz, buyer_country_code,
          buyer_ust_id, buyer_unternehmen,
          recipient_name, recipient_email, recipient_phone,
          recipient_land, recipient_strasse, recipient_hausnummer, recipient_firma,
          rechnungs_id, rechnungsdatum, ext_id, gutschrift,
          account_type, source_platform,
          order_id, user_id,
          imported_from_ablefy, imported_at,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
          $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
          $41, $42, $43, $44, $45, $46, $47, $48, $49, $50,
          $51, $52, $53, $54, $55, $56, $57, $58, $59, $60,
          $61, $62, $63, $64, $65, $66
        )
        ON CONFLICT (trx_id) WHERE trx_id IS NOT NULL DO NOTHING`,
        [
          txn.id,
          txn.trx_id,
          txn.relevante_id,
          txn.rechnungsnummer,
          txn.invoice_number,
          txn.stripe_payment_intent_id,
          txn.stripe_charge_id,
          txn.transaction_date,
          txn.datum_raw,
          txn.erfolgt_am,
          txn.status || 'Ausstehend',
          txn.typ || 'unknown',
          txn.zahlungsart || 'unknown',
          txn.order_number,
          txn.product_id,
          txn.produkt,
          txn.psp,
          txn.course_id,
          txn.faelliger_betrag || 0,
          txn.bezahlt || 0,
          txn.bezahlt_minus_fee,
          txn.netto,
          txn.einnahmen_netto,
          txn.fees_total || 0,
          txn.fees_service || 0,
          txn.fees_payment_provider || 0,
          txn.vat_rate || 0,
          txn.ust || 0,
          txn.steuerkategorie,
          txn.waehrung || 'EUR',
          txn.plan,
          txn.zahlungsplan_id,
          txn.faelligkeiten_id,
          txn.gutscheincode,
          txn.buyer_email || 'unknown@unknown.com',
          txn.buyer_first_name,
          txn.buyer_last_name,
          txn.buyer_phone,
          txn.buyer_land,
          txn.buyer_stadt,
          txn.buyer_strasse,
          txn.buyer_hausnummer,
          txn.buyer_plz,
          txn.buyer_adress_zusatz,
          txn.buyer_country_code,
          txn.buyer_ust_id,
          txn.buyer_unternehmen,
          txn.recipient_name,
          txn.recipient_email,
          txn.recipient_phone,
          txn.recipient_land,
          txn.recipient_strasse,
          txn.recipient_hausnummer,
          txn.recipient_firma,
          txn.rechnungs_id,
          txn.rechnungsdatum,
          txn.ext_id,
          txn.gutschrift,
          txn.account_type || 'new',
          txn.source_platform || 'ablefy',
          txn.order_id,
          txn.user_id,
          txn.imported_from_ablefy ?? true,
          txn.imported_at || new Date().toISOString(),
          txn.created_at || new Date().toISOString(),
          txn.updated_at || new Date().toISOString()
        ]
      )
      insertedCount++
    } catch (error) {
      console.error(`Failed to insert transaction ${txn.trx_id}:`, error)
    }
  }

  return insertedCount
}
