-- Migration: 011_create_commerce_tables.sql
-- Description: Create commerce tables (products, orders, transactions)
-- Part of: Airtable MCP Migration
-- Created: 2025-11-28

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    price_cents INTEGER NOT NULL,
    compare_at_price_cents INTEGER,
    currency TEXT DEFAULT 'EUR',
    product_type TEXT CHECK (product_type IN ('course', 'membership', 'digital', 'physical', 'bundle', 'subscription')),
    sku TEXT UNIQUE,
    stripe_product_id TEXT,
    stripe_price_id TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    stock_quantity INTEGER,
    track_inventory BOOLEAN DEFAULT FALSE,
    weight_grams INTEGER,
    thumbnail_url TEXT,
    images JSONB DEFAULT '[]',
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    course_id UUID REFERENCES courses(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded', 'failed')),
    subtotal_cents INTEGER NOT NULL,
    discount_cents INTEGER DEFAULT 0,
    tax_cents INTEGER DEFAULT 0,
    shipping_cents INTEGER DEFAULT 0,
    total_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'EUR',
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'authorized', 'paid', 'failed', 'refunded', 'partially_refunded')),
    stripe_payment_intent_id TEXT,
    stripe_checkout_session_id TEXT,
    billing_email TEXT,
    billing_name TEXT,
    billing_address JSONB,
    shipping_address JSONB,
    shipping_method TEXT,
    tracking_number TEXT,
    notes TEXT,
    internal_notes TEXT,
    coupon_code TEXT,
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name TEXT NOT NULL,
    product_sku TEXT,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    unit_price_cents INTEGER NOT NULL,
    discount_cents INTEGER DEFAULT 0,
    tax_cents INTEGER DEFAULT 0,
    total_cents INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    order_id UUID REFERENCES orders(id),
    user_id UUID REFERENCES users(id),
    transaction_type TEXT CHECK (transaction_type IN ('payment', 'refund', 'chargeback', 'payout', 'adjustment', 'fee')),
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed')),
    payment_provider TEXT,
    provider_transaction_id TEXT,
    provider_fee_cents INTEGER DEFAULT 0,
    net_amount_cents INTEGER,
    description TEXT,
    failure_reason TEXT,
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_shipping')),
    discount_value INTEGER NOT NULL,
    currency TEXT DEFAULT 'EUR',
    minimum_order_cents INTEGER,
    maximum_discount_cents INTEGER,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    per_user_limit INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    applicable_products JSONB DEFAULT '[]',
    applicable_categories JSONB DEFAULT '[]',
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupon usage tracking
CREATE TABLE IF NOT EXISTS coupon_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id),
    discount_applied_cents INTEGER NOT NULL,
    used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for commerce tables
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_entity_scope ON products(entity_scope);
CREATE INDEX IF NOT EXISTS idx_products_stripe_id ON products(stripe_product_id);
CREATE INDEX IF NOT EXISTS idx_products_airtable_id ON products(airtable_id);
CREATE INDEX IF NOT EXISTS idx_products_course_id ON products(course_id);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_entity_scope ON orders(entity_scope);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_airtable_id ON orders(airtable_id);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_provider ON transactions(payment_provider);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_airtable_id ON transactions(airtable_id);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_entity_scope ON coupons(entity_scope);

CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon ON coupon_usages(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user ON coupon_usages(user_id);

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

DROP TRIGGER IF EXISTS coupons_updated_at ON coupons;
CREATE TRIGGER coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    prefix TEXT;
    seq_num INTEGER;
    order_num TEXT;
BEGIN
    prefix := 'OL-' || TO_CHAR(NOW(), 'YYYYMM');

    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 10) AS INTEGER)), 0) + 1
    INTO seq_num
    FROM orders
    WHERE order_number LIKE prefix || '%';

    order_num := prefix || '-' || LPAD(seq_num::TEXT, 5, '0');

    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE products IS 'Products available for purchase (courses, memberships, etc.)';
COMMENT ON TABLE orders IS 'Customer orders';
COMMENT ON TABLE order_items IS 'Individual items within an order';
COMMENT ON TABLE transactions IS 'Payment transactions (payments, refunds, etc.)';
COMMENT ON TABLE coupons IS 'Discount coupons and promo codes';
COMMENT ON TABLE coupon_usages IS 'Tracking of coupon usage per user/order';
COMMENT ON COLUMN orders.airtable_id IS 'Original Airtable record ID for migration tracking';
COMMENT ON COLUMN transactions.airtable_id IS 'Original Airtable record ID for migration tracking';
