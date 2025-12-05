-- Migration: 026_stripe_integration.sql
-- Description: Add Stripe integration columns to courses table for payment links
-- Date: 2025-12-05

-- Add Stripe columns to courses table
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS stripe_product_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_link_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_link_url TEXT;

-- Add indexes for Stripe lookups
CREATE INDEX IF NOT EXISTS idx_courses_stripe_product_id ON courses(stripe_product_id) WHERE stripe_product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_courses_stripe_price_id ON courses(stripe_price_id) WHERE stripe_price_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN courses.stripe_product_id IS 'Stripe Product ID (prod_xxx)';
COMMENT ON COLUMN courses.stripe_price_id IS 'Stripe Price ID (price_xxx)';
COMMENT ON COLUMN courses.stripe_payment_link_id IS 'Stripe Payment Link ID (plink_xxx)';
COMMENT ON COLUMN courses.stripe_payment_link_url IS 'Public Stripe Payment Link URL';
