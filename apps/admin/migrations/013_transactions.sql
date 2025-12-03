-- Migration: 013_transactions.sql
-- Description: Create transactions table for Ablefy transaction data
-- Date: 2025-12-03

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Ablefy IDs
  trx_id BIGINT,
  relevante_id TEXT,
  rechnungsnummer TEXT,
  invoice_number TEXT,

  -- Stripe IDs (for future use)
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,

  -- Transaction dates
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  datum_raw TEXT,
  erfolgt_am TEXT,

  -- Status and type
  status TEXT DEFAULT 'Ausstehend',
  typ TEXT NOT NULL,
  zahlungsart TEXT NOT NULL,

  -- Order and product
  order_number BIGINT,
  product_id INTEGER,
  produkt TEXT,
  psp TEXT,
  course_id BIGINT,

  -- Financial data
  faelliger_betrag NUMERIC DEFAULT 0,
  bezahlt NUMERIC DEFAULT 0,
  bezahlt_minus_fee NUMERIC,
  netto NUMERIC,
  einnahmen_netto NUMERIC,
  fees_total NUMERIC DEFAULT 0,
  fees_service NUMERIC DEFAULT 0,
  fees_payment_provider NUMERIC DEFAULT 0,
  vat_rate NUMERIC DEFAULT 0,
  ust NUMERIC DEFAULT 0,
  steuerkategorie TEXT,
  waehrung TEXT DEFAULT 'EUR',

  -- Payment plan
  plan TEXT,
  zahlungsplan_id BIGINT,
  faelligkeiten_id BIGINT,
  gutscheincode TEXT,

  -- Buyer information
  buyer_email TEXT DEFAULT 'unknown@unknown.com',
  buyer_first_name TEXT,
  buyer_last_name TEXT,
  buyer_phone TEXT,
  buyer_land TEXT,
  buyer_stadt TEXT,
  buyer_strasse TEXT,
  buyer_hausnummer TEXT,
  buyer_plz INTEGER,
  buyer_adress_zusatz TEXT,
  buyer_country_code TEXT,
  buyer_ust_id TEXT,
  buyer_unternehmen TEXT,

  -- Recipient information (for gifts)
  recipient_name TEXT,
  recipient_email TEXT,
  recipient_phone TEXT,
  recipient_land TEXT,
  recipient_strasse TEXT,
  recipient_hausnummer TEXT,
  recipient_firma TEXT,

  -- Invoice data
  rechnungs_id BIGINT,
  rechnungsdatum TEXT,
  ext_id TEXT,
  gutschrift TEXT,

  -- Account and source
  account_type TEXT NOT NULL DEFAULT 'new',
  source_platform TEXT DEFAULT 'ablefy',

  -- Relations (no FK constraints for now - can add later)
  order_id UUID,
  user_id UUID,

  -- Import metadata
  imported_from_ablefy BOOLEAN DEFAULT false,
  imported_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique partial index on trx_id (for upsert support)
CREATE UNIQUE INDEX IF NOT EXISTS transactions_trx_id_key
ON transactions (trx_id) WHERE trx_id IS NOT NULL;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transactions_trx_id ON transactions (trx_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order_number ON transactions (order_number);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_email ON transactions (buyer_email);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_date ON transactions (transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_product_id ON transactions (product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_course_id ON transactions (course_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions (status);
CREATE INDEX IF NOT EXISTS idx_transactions_source_platform ON transactions (source_platform);
CREATE INDEX IF NOT EXISTS idx_transactions_account_type ON transactions (account_type);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_transactions_email_status ON transactions (buyer_email, status);
CREATE INDEX IF NOT EXISTS idx_transactions_date_status ON transactions (transaction_date, status);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_transactions_updated_at ON transactions;
CREATE TRIGGER trigger_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transactions_updated_at();

-- Comment on table
COMMENT ON TABLE transactions IS 'Ablefy transaction records - migrated from Supabase, receives live webhook data';
