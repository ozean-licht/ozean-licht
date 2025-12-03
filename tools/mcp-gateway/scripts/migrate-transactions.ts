/**
 * Migrate Transactions from Supabase to Local PostgreSQL
 *
 * Usage: npx tsx scripts/migrate-transactions.ts
 *
 * Environment variables:
 * - SUPABASE_URL: Supabase project URL
 * - SUPABASE_KEY: Supabase anon or service role key
 * - DATABASE_URL: Local PostgreSQL connection string
 */

import { createClient } from '@supabase/supabase-js'
import { Pool } from 'pg'

const BATCH_SIZE = 500
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://suwevnhwtmcazjugfmps.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1d2V2bmh3dG1jYXpqdWdmbXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxODA5NzQsImV4cCI6MjA3Mjc1Njk3NH0.LBMjwzh3OmEur09Moqion1nNclri1w-Wx6gmRAuyGNw'
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:7M6jFrr7IYILOa67MxnfkpUxxNiDVp9IjHN60bkIR0QpbC40DRgzXkVAeVEkdWbJ@localhost:32771/ozean-licht-db'

interface Transaction {
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

async function migrate() {
  console.log('🚀 Starting transaction migration from Supabase to local PostgreSQL...\n')

  // Validate environment
  if (!SUPABASE_KEY) {
    console.error('❌ SUPABASE_KEY is required')
    process.exit(1)
  }

  // Initialize clients
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  const pool = new Pool({ connectionString: DATABASE_URL })

  try {
    // Test connections
    console.log('📡 Testing Supabase connection...')
    const { count: totalCount, error: countError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      throw new Error(`Supabase connection failed: ${countError.message}`)
    }
    console.log(`✅ Supabase connected. Total transactions: ${totalCount}\n`)

    console.log('📡 Testing PostgreSQL connection...')
    const pgTest = await pool.query('SELECT 1')
    console.log('✅ PostgreSQL connected.\n')

    // Check existing count in local DB
    const { rows: [{ count: existingCount }] } = await pool.query('SELECT COUNT(*) as count FROM transactions')
    console.log(`📊 Existing transactions in local DB: ${existingCount}\n`)

    if (parseInt(existingCount) > 0) {
      console.log('⚠️  Local database already has transactions.')
      console.log('   This migration will skip existing records (ON CONFLICT DO NOTHING).\n')
    }

    // Migrate in batches
    let offset = 0
    let totalMigrated = 0
    let totalSkipped = 0

    while (true) {
      console.log(`📦 Fetching batch: offset=${offset}, limit=${BATCH_SIZE}...`)

      const { data: transactions, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: true })
        .range(offset, offset + BATCH_SIZE - 1)

      if (fetchError) {
        throw new Error(`Failed to fetch batch: ${fetchError.message}`)
      }

      if (!transactions || transactions.length === 0) {
        console.log('✅ No more records to fetch.\n')
        break
      }

      console.log(`   Fetched ${transactions.length} records. Inserting...`)

      // Insert batch
      let batchInserted = 0
      for (const txn of transactions as Transaction[]) {
        try {
          const result = await pool.query(
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

          if (result.rowCount && result.rowCount > 0) {
            batchInserted++
          } else {
            totalSkipped++
          }
        } catch (err) {
          console.error(`   ⚠️ Failed to insert trx_id=${txn.trx_id}:`, err)
          totalSkipped++
        }
      }

      totalMigrated += batchInserted
      console.log(`   ✅ Inserted ${batchInserted}/${transactions.length} (total: ${totalMigrated})\n`)

      offset += BATCH_SIZE

      // Progress indicator
      const progress = Math.round((offset / (totalCount || 1)) * 100)
      console.log(`📊 Progress: ${Math.min(progress, 100)}%\n`)
    }

    // Final count
    const { rows: [{ count: finalCount }] } = await pool.query('SELECT COUNT(*) as count FROM transactions')

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 Migration Complete!')
    console.log(`   Source (Supabase):    ${totalCount} transactions`)
    console.log(`   Target (PostgreSQL):  ${finalCount} transactions`)
    console.log(`   Migrated:             ${totalMigrated}`)
    console.log(`   Skipped (duplicates): ${totalSkipped}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

migrate()
