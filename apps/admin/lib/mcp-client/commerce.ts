/**
 * Commerce Query Operations - Products, Orders, Transactions, Coupons
 * Part of Airtable MCP Migration
 */

import { MCPGatewayClient } from './client';
import {
  Product,
  Order,
  OrderItem,
  Transaction,
  Coupon,
  ProductListOptions,
  OrderListOptions,
  TransactionListOptions,
  CouponListOptions,
  ProductListResult,
  OrderListResult,
  TransactionListResult,
  CouponListResult,
  CreateProductInput,
  UpdateProductInput,
  // CreateOrderInput and CreateOrderItemInput available if needed
  UpdateOrderInput,
  CreateTransactionInput,
  CreateCouponInput,
  UpdateCouponInput,
  CommerceStats,
  Address,
} from '../../types/commerce';

// Database row types (snake_case)
interface ProductRow {
  id: string;
  airtable_id: string | null;
  name: string;
  description: string | null;
  short_description: string | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  currency: string;
  product_type: string;
  sku: string | null;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  stock_quantity: number | null;
  track_inventory: boolean;
  weight_grams: number | null;
  thumbnail_url: string | null;
  images: string[] | null;
  entity_scope: string | null;
  course_id: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
}

interface OrderRow {
  id: string;
  airtable_id: string | null;
  order_number: string;
  user_id: string | null;
  status: string;
  subtotal_cents: number;
  discount_cents: number;
  tax_cents: number;
  shipping_cents: number;
  total_cents: number;
  currency: string;
  payment_method: string | null;
  payment_status: string;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  billing_email: string | null;
  billing_name: string | null;
  billing_address: Address | null;
  shipping_address: Address | null;
  shipping_method: string | null;
  tracking_number: string | null;
  notes: string | null;
  internal_notes: string | null;
  coupon_code: string | null;
  entity_scope: string | null;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  metadata: Record<string, unknown> | null;
}

interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price_cents: number;
  discount_cents: number;
  tax_cents: number;
  total_cents: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface TransactionRow {
  id: string;
  airtable_id: string | null;
  order_id: string | null;
  user_id: string | null;
  transaction_type: string;
  amount_cents: number;
  currency: string;
  status: string;
  payment_provider: string | null;
  provider_transaction_id: string | null;
  provider_fee_cents: number;
  net_amount_cents: number | null;
  description: string | null;
  failure_reason: string | null;
  entity_scope: string | null;
  processed_at: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

interface CouponRow {
  id: string;
  airtable_id: string | null;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  currency: string;
  minimum_order_cents: number | null;
  maximum_discount_cents: number | null;
  usage_limit: number | null;
  usage_count: number;
  per_user_limit: number;
  is_active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  applicable_products: string[] | null;
  applicable_categories: string[] | null;
  entity_scope: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Commerce Queries Extension for MCPGatewayClient
 */
export class CommerceQueries {
  constructor(private client: MCPGatewayClient) {}

  // ============================================================================
  // Product Operations
  // ============================================================================

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    const sql = `
      SELECT id, airtable_id, name, description, short_description,
             price_cents, compare_at_price_cents, currency, product_type,
             sku, stripe_product_id, stripe_price_id, is_active, is_featured,
             stock_quantity, track_inventory, weight_grams, thumbnail_url,
             images, entity_scope, course_id, created_at, updated_at, metadata
      FROM products
      WHERE id = $1
    `;

    const rows = await this.client.query<ProductRow>(sql, [id]);
    return rows.length > 0 ? this.mapProduct(rows[0]) : null;
  }

  /**
   * List products with filters and pagination
   */
  async listProducts(options: ProductListOptions = {}): Promise<ProductListResult> {
    const conditions: string[] = [];
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (options.entityScope) {
      conditions.push(`entity_scope = $${paramIndex++}`);
      params.push(options.entityScope);
    }

    if (options.productType) {
      conditions.push(`product_type = $${paramIndex++}`);
      params.push(options.productType);
    }

    if (options.isActive !== undefined) {
      conditions.push(`is_active = $${paramIndex++}`);
      params.push(options.isActive);
    }

    if (options.isFeatured !== undefined) {
      conditions.push(`is_featured = $${paramIndex++}`);
      params.push(options.isFeatured);
    }

    if (options.search) {
      conditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${options.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    // Validate pagination bounds
    const limit = Math.min(Math.max(options.limit || 50, 1), 100);
    const offset = Math.max(options.offset || 0, 0);
    // Allowlist for ORDER BY columns to prevent SQL injection
    const PRODUCT_SORTABLE_COLUMNS: Record<string, string> = {
      created_at: 'created_at',
      updated_at: 'updated_at',
      name: 'name',
      price_cents: 'price_cents',
    };
    const orderBy = PRODUCT_SORTABLE_COLUMNS[options.orderBy || 'created_at'] || 'created_at';
    const orderDir = options.orderDirection === 'asc' ? 'ASC' : 'DESC';

    // Count query
    const countSql = `SELECT COUNT(*) as count FROM products ${whereClause}`;
    const countRows = await this.client.query<{ count: string }>(countSql, params);
    const total = parseInt(countRows[0].count, 10);

    // Data query
    const sql = `
      SELECT id, airtable_id, name, description, short_description,
             price_cents, compare_at_price_cents, currency, product_type,
             sku, stripe_product_id, stripe_price_id, is_active, is_featured,
             stock_quantity, track_inventory, weight_grams, thumbnail_url,
             images, entity_scope, course_id, created_at, updated_at, metadata
      FROM products
      ${whereClause}
      ORDER BY ${orderBy} ${orderDir}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.client.query<ProductRow>(sql, params);

    return {
      data: rows.map(row => this.mapProduct(row)),
      total,
      limit,
      offset,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Create a new product
   */
  async createProduct(data: CreateProductInput): Promise<Product> {
    const sql = `
      INSERT INTO products (
        name, description, short_description, price_cents, compare_at_price_cents,
        currency, product_type, sku, is_active, is_featured,
        stock_quantity, track_inventory, weight_grams, thumbnail_url,
        images, entity_scope, course_id, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id, airtable_id, name, description, short_description,
                price_cents, compare_at_price_cents, currency, product_type,
                sku, stripe_product_id, stripe_price_id, is_active, is_featured,
                stock_quantity, track_inventory, weight_grams, thumbnail_url,
                images, entity_scope, course_id, created_at, updated_at, metadata
    `;

    const rows = await this.client.query<ProductRow>(sql, [
      data.name,
      data.description || null,
      data.shortDescription || null,
      data.priceCents,
      data.compareAtPriceCents || null,
      data.currency || 'EUR',
      data.productType,
      data.sku || null,
      data.isActive ?? true,
      data.isFeatured ?? false,
      data.stockQuantity || null,
      data.trackInventory ?? false,
      data.weightGrams || null,
      data.thumbnailUrl || null,
      JSON.stringify(data.images || []),
      data.entityScope || null,
      data.courseId || null,
      JSON.stringify(data.metadata || {}),
    ]);

    return this.mapProduct(rows[0]);
  }

  /**
   * Update a product
   */
  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    const updates: string[] = [];
    const params: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    const fields: Array<[keyof UpdateProductInput, string]> = [
      ['name', 'name'],
      ['description', 'description'],
      ['shortDescription', 'short_description'],
      ['priceCents', 'price_cents'],
      ['compareAtPriceCents', 'compare_at_price_cents'],
      ['currency', 'currency'],
      ['productType', 'product_type'],
      ['sku', 'sku'],
      ['isActive', 'is_active'],
      ['isFeatured', 'is_featured'],
      ['stockQuantity', 'stock_quantity'],
      ['trackInventory', 'track_inventory'],
      ['weightGrams', 'weight_grams'],
      ['thumbnailUrl', 'thumbnail_url'],
      ['entityScope', 'entity_scope'],
      ['courseId', 'course_id'],
    ];

    for (const [key, column] of fields) {
      if (data[key] !== undefined) {
        updates.push(`${column} = $${paramIndex++}`);
        params.push(data[key] as string | number | boolean | null);
      }
    }

    if (data.images !== undefined) {
      updates.push(`images = $${paramIndex++}`);
      params.push(JSON.stringify(data.images));
    }

    if (data.metadata !== undefined) {
      updates.push(`metadata = $${paramIndex++}`);
      params.push(JSON.stringify(data.metadata));
    }

    params.push(id);

    const sql = `
      UPDATE products
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, airtable_id, name, description, short_description,
                price_cents, compare_at_price_cents, currency, product_type,
                sku, stripe_product_id, stripe_price_id, is_active, is_featured,
                stock_quantity, track_inventory, weight_grams, thumbnail_url,
                images, entity_scope, course_id, created_at, updated_at, metadata
    `;

    const rows = await this.client.query<ProductRow>(sql, params);
    return this.mapProduct(rows[0]);
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    await this.client.execute('DELETE FROM products WHERE id = $1', [id]);
  }

  // ============================================================================
  // Order Operations
  // ============================================================================

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    const sql = `
      SELECT id, airtable_id, order_number, user_id, status,
             subtotal_cents, discount_cents, tax_cents, shipping_cents, total_cents,
             currency, payment_method, payment_status,
             stripe_payment_intent_id, stripe_checkout_session_id,
             billing_email, billing_name, billing_address, shipping_address,
             shipping_method, tracking_number, notes, internal_notes,
             coupon_code, entity_scope, created_at, updated_at,
             paid_at, shipped_at, completed_at, cancelled_at, metadata
      FROM orders
      WHERE id = $1
    `;

    const rows = await this.client.query<OrderRow>(sql, [id]);
    if (rows.length === 0) return null;

    const order = this.mapOrder(rows[0]);

    // Fetch order items
    const itemsSql = `
      SELECT id, order_id, product_id, product_name, product_sku,
             quantity, unit_price_cents, discount_cents, tax_cents,
             total_cents, metadata, created_at
      FROM order_items
      WHERE order_id = $1
      ORDER BY created_at ASC
    `;
    const itemRows = await this.client.query<OrderItemRow>(itemsSql, [id]);
    order.items = itemRows.map(row => this.mapOrderItem(row));

    return order;
  }

  /**
   * List orders with filters and pagination
   */
  async listOrders(options: OrderListOptions = {}): Promise<OrderListResult> {
    const conditions: string[] = [];
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (options.entityScope) {
      conditions.push(`entity_scope = $${paramIndex++}`);
      params.push(options.entityScope);
    }

    if (options.userId) {
      conditions.push(`user_id = $${paramIndex++}`);
      params.push(options.userId);
    }

    if (options.status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(options.status);
    }

    if (options.paymentStatus) {
      conditions.push(`payment_status = $${paramIndex++}`);
      params.push(options.paymentStatus);
    }

    if (options.startDate) {
      conditions.push(`created_at >= $${paramIndex++}`);
      params.push(options.startDate);
    }

    if (options.endDate) {
      conditions.push(`created_at <= $${paramIndex++}`);
      params.push(options.endDate);
    }

    if (options.search) {
      conditions.push(`(order_number ILIKE $${paramIndex} OR billing_email ILIKE $${paramIndex} OR billing_name ILIKE $${paramIndex})`);
      params.push(`%${options.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    // Validate pagination bounds
    const limit = Math.min(Math.max(options.limit || 50, 1), 100);
    const offset = Math.max(options.offset || 0, 0);
    // Allowlist for ORDER BY columns to prevent SQL injection
    const ORDER_SORTABLE_COLUMNS: Record<string, string> = {
      created_at: 'created_at',
      updated_at: 'updated_at',
      order_number: 'order_number',
      total_cents: 'total_cents',
      status: 'status',
    };
    const orderBy = ORDER_SORTABLE_COLUMNS[options.orderBy || 'created_at'] || 'created_at';
    const orderDir = options.orderDirection === 'asc' ? 'ASC' : 'DESC';

    // Count query
    const countSql = `SELECT COUNT(*) as count FROM orders ${whereClause}`;
    const countRows = await this.client.query<{ count: string }>(countSql, params);
    const total = parseInt(countRows[0].count, 10);

    // Data query
    const sql = `
      SELECT id, airtable_id, order_number, user_id, status,
             subtotal_cents, discount_cents, tax_cents, shipping_cents, total_cents,
             currency, payment_method, payment_status,
             stripe_payment_intent_id, stripe_checkout_session_id,
             billing_email, billing_name, billing_address, shipping_address,
             shipping_method, tracking_number, notes, internal_notes,
             coupon_code, entity_scope, created_at, updated_at,
             paid_at, shipped_at, completed_at, cancelled_at, metadata
      FROM orders
      ${whereClause}
      ORDER BY ${orderBy} ${orderDir}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.client.query<OrderRow>(sql, params);

    return {
      data: rows.map(row => this.mapOrder(row)),
      total,
      limit,
      offset,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, data: UpdateOrderInput): Promise<Order> {
    const updates: string[] = [];
    const params: (string | number | null)[] = [];
    let paramIndex = 1;

    const fields: Array<[keyof UpdateOrderInput, string]> = [
      ['status', 'status'],
      ['paymentStatus', 'payment_status'],
      ['shippingMethod', 'shipping_method'],
      ['trackingNumber', 'tracking_number'],
      ['notes', 'notes'],
      ['internalNotes', 'internal_notes'],
    ];

    for (const [key, column] of fields) {
      if (data[key] !== undefined) {
        updates.push(`${column} = $${paramIndex++}`);
        params.push(data[key] as string | null);
      }
    }

    if (data.metadata !== undefined) {
      updates.push(`metadata = $${paramIndex++}`);
      params.push(JSON.stringify(data.metadata));
    }

    // Auto-set timestamp fields based on status
    if (data.status === 'paid' || data.paymentStatus === 'paid') {
      updates.push(`paid_at = COALESCE(paid_at, NOW())`);
    }
    if (data.status === 'shipped') {
      updates.push(`shipped_at = COALESCE(shipped_at, NOW())`);
    }
    if (data.status === 'completed') {
      updates.push(`completed_at = COALESCE(completed_at, NOW())`);
    }
    if (data.status === 'cancelled') {
      updates.push(`cancelled_at = COALESCE(cancelled_at, NOW())`);
    }

    params.push(id);

    const sql = `
      UPDATE orders
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, airtable_id, order_number, user_id, status,
                subtotal_cents, discount_cents, tax_cents, shipping_cents, total_cents,
                currency, payment_method, payment_status,
                stripe_payment_intent_id, stripe_checkout_session_id,
                billing_email, billing_name, billing_address, shipping_address,
                shipping_method, tracking_number, notes, internal_notes,
                coupon_code, entity_scope, created_at, updated_at,
                paid_at, shipped_at, completed_at, cancelled_at, metadata
    `;

    const rows = await this.client.query<OrderRow>(sql, params);
    return this.mapOrder(rows[0]);
  }

  /**
   * Get order statistics
   */
  async getOrderStats(entityScope?: string): Promise<CommerceStats> {
    const scopeCondition = entityScope ? 'WHERE entity_scope = $1' : '';
    const params = entityScope ? [entityScope] : [];

    const sql = `
      SELECT
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_orders,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_orders,
        COALESCE(SUM(total_cents) FILTER (WHERE payment_status = 'paid'), 0) as total_revenue,
        COALESCE(AVG(total_cents) FILTER (WHERE payment_status = 'paid'), 0) as avg_order_value,
        COALESCE(SUM(total_cents) FILTER (WHERE status = 'refunded'), 0) as total_refunds
      FROM orders
      ${scopeCondition}
    `;

    const rows = await this.client.query<{
      total_orders: string;
      pending_orders: string;
      completed_orders: string;
      cancelled_orders: string;
      total_revenue: string;
      avg_order_value: string;
      total_refunds: string;
    }>(sql, params);

    return {
      totalOrders: parseInt(rows[0].total_orders, 10),
      pendingOrders: parseInt(rows[0].pending_orders, 10),
      completedOrders: parseInt(rows[0].completed_orders, 10),
      cancelledOrders: parseInt(rows[0].cancelled_orders, 10),
      totalRevenue: parseInt(rows[0].total_revenue, 10),
      averageOrderValue: parseInt(rows[0].avg_order_value, 10),
      totalRefunds: parseInt(rows[0].total_refunds, 10),
    };
  }

  // ============================================================================
  // Transaction Operations
  // ============================================================================

  /**
   * List transactions with filters and pagination
   */
  async listTransactions(options: TransactionListOptions = {}): Promise<TransactionListResult> {
    const conditions: string[] = [];
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (options.entityScope) {
      conditions.push(`entity_scope = $${paramIndex++}`);
      params.push(options.entityScope);
    }

    if (options.orderId) {
      conditions.push(`order_id = $${paramIndex++}`);
      params.push(options.orderId);
    }

    if (options.userId) {
      conditions.push(`user_id = $${paramIndex++}`);
      params.push(options.userId);
    }

    if (options.transactionType) {
      conditions.push(`transaction_type = $${paramIndex++}`);
      params.push(options.transactionType);
    }

    if (options.status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(options.status);
    }

    if (options.paymentProvider) {
      conditions.push(`payment_provider = $${paramIndex++}`);
      params.push(options.paymentProvider);
    }

    if (options.startDate) {
      conditions.push(`created_at >= $${paramIndex++}`);
      params.push(options.startDate);
    }

    if (options.endDate) {
      conditions.push(`created_at <= $${paramIndex++}`);
      params.push(options.endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    // Validate pagination bounds
    const limit = Math.min(Math.max(options.limit || 50, 1), 100);
    const offset = Math.max(options.offset || 0, 0);
    // Allowlist for ORDER BY columns to prevent SQL injection
    const TRANSACTION_SORTABLE_COLUMNS: Record<string, string> = {
      created_at: 'created_at',
      amount_cents: 'amount_cents',
      status: 'status',
      transaction_type: 'transaction_type',
    };
    const orderBy = TRANSACTION_SORTABLE_COLUMNS[options.orderBy || 'created_at'] || 'created_at';
    const orderDir = options.orderDirection === 'asc' ? 'ASC' : 'DESC';

    // Count query
    const countSql = `SELECT COUNT(*) as count FROM transactions ${whereClause}`;
    const countRows = await this.client.query<{ count: string }>(countSql, params);
    const total = parseInt(countRows[0].count, 10);

    // Data query
    const sql = `
      SELECT id, airtable_id, order_id, user_id, transaction_type,
             amount_cents, currency, status, payment_provider,
             provider_transaction_id, provider_fee_cents, net_amount_cents,
             description, failure_reason, entity_scope,
             processed_at, created_at, metadata
      FROM transactions
      ${whereClause}
      ORDER BY ${orderBy} ${orderDir}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.client.query<TransactionRow>(sql, params);

    return {
      data: rows.map(row => this.mapTransaction(row)),
      total,
      limit,
      offset,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Create a new transaction
   */
  async createTransaction(data: CreateTransactionInput): Promise<Transaction> {
    const sql = `
      INSERT INTO transactions (
        order_id, user_id, transaction_type, amount_cents, currency,
        status, payment_provider, provider_transaction_id,
        provider_fee_cents, description, entity_scope, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, airtable_id, order_id, user_id, transaction_type,
                amount_cents, currency, status, payment_provider,
                provider_transaction_id, provider_fee_cents, net_amount_cents,
                description, failure_reason, entity_scope,
                processed_at, created_at, metadata
    `;

    const rows = await this.client.query<TransactionRow>(sql, [
      data.orderId || null,
      data.userId || null,
      data.transactionType,
      data.amountCents,
      data.currency || 'EUR',
      data.status || 'pending',
      data.paymentProvider || null,
      data.providerTransactionId || null,
      data.providerFeeCents || 0,
      data.description || null,
      data.entityScope || null,
      JSON.stringify(data.metadata || {}),
    ]);

    return this.mapTransaction(rows[0]);
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats(entityScope?: string, transactionType?: string): Promise<{
    totalAmount: number;
    count: number;
    avgAmount: number;
    totalFees: number;
  }> {
    const conditions: string[] = [];
    const params: string[] = [];
    let paramIndex = 1;

    if (entityScope) {
      conditions.push(`entity_scope = $${paramIndex++}`);
      params.push(entityScope);
    }

    if (transactionType) {
      conditions.push(`transaction_type = $${paramIndex++}`);
      params.push(transactionType);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT
        COALESCE(SUM(amount_cents), 0) as total_amount,
        COUNT(*) as count,
        COALESCE(AVG(amount_cents), 0) as avg_amount,
        COALESCE(SUM(provider_fee_cents), 0) as total_fees
      FROM transactions
      ${whereClause}
    `;

    const rows = await this.client.query<{
      total_amount: string;
      count: string;
      avg_amount: string;
      total_fees: string;
    }>(sql, params);

    return {
      totalAmount: parseInt(rows[0].total_amount, 10),
      count: parseInt(rows[0].count, 10),
      avgAmount: parseInt(rows[0].avg_amount, 10),
      totalFees: parseInt(rows[0].total_fees, 10),
    };
  }

  // ============================================================================
  // Coupon Operations
  // ============================================================================

  /**
   * Get coupon by code
   */
  async getCouponByCode(code: string): Promise<Coupon | null> {
    const sql = `
      SELECT id, airtable_id, code, description, discount_type, discount_value,
             currency, minimum_order_cents, maximum_discount_cents,
             usage_limit, usage_count, per_user_limit, is_active,
             starts_at, expires_at, applicable_products, applicable_categories,
             entity_scope, created_by, created_at, updated_at
      FROM coupons
      WHERE code = $1
    `;

    const rows = await this.client.query<CouponRow>(sql, [code]);
    return rows.length > 0 ? this.mapCoupon(rows[0]) : null;
  }

  /**
   * List coupons with filters and pagination
   */
  async listCoupons(options: CouponListOptions = {}): Promise<CouponListResult> {
    const conditions: string[] = [];
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (options.entityScope) {
      conditions.push(`entity_scope = $${paramIndex++}`);
      params.push(options.entityScope);
    }

    if (options.isActive !== undefined) {
      conditions.push(`is_active = $${paramIndex++}`);
      params.push(options.isActive);
    }

    if (options.discountType) {
      conditions.push(`discount_type = $${paramIndex++}`);
      params.push(options.discountType);
    }

    if (options.search) {
      conditions.push(`(code ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${options.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = options.limit || 50;
    const offset = options.offset || 0;

    // Count query
    const countSql = `SELECT COUNT(*) as count FROM coupons ${whereClause}`;
    const countRows = await this.client.query<{ count: string }>(countSql, params);
    const total = parseInt(countRows[0].count, 10);

    // Data query
    const sql = `
      SELECT id, airtable_id, code, description, discount_type, discount_value,
             currency, minimum_order_cents, maximum_discount_cents,
             usage_limit, usage_count, per_user_limit, is_active,
             starts_at, expires_at, applicable_products, applicable_categories,
             entity_scope, created_by, created_at, updated_at
      FROM coupons
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.client.query<CouponRow>(sql, params);

    return {
      data: rows.map(row => this.mapCoupon(row)),
      total,
      limit,
      offset,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Create a new coupon
   */
  async createCoupon(data: CreateCouponInput): Promise<Coupon> {
    const sql = `
      INSERT INTO coupons (
        code, description, discount_type, discount_value, currency,
        minimum_order_cents, maximum_discount_cents, usage_limit,
        per_user_limit, is_active, starts_at, expires_at,
        applicable_products, applicable_categories, entity_scope
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id, airtable_id, code, description, discount_type, discount_value,
                currency, minimum_order_cents, maximum_discount_cents,
                usage_limit, usage_count, per_user_limit, is_active,
                starts_at, expires_at, applicable_products, applicable_categories,
                entity_scope, created_by, created_at, updated_at
    `;

    const rows = await this.client.query<CouponRow>(sql, [
      data.code,
      data.description || null,
      data.discountType,
      data.discountValue,
      data.currency || 'EUR',
      data.minimumOrderCents || null,
      data.maximumDiscountCents || null,
      data.usageLimit || null,
      data.perUserLimit ?? 1,
      data.isActive ?? true,
      data.startsAt || null,
      data.expiresAt || null,
      JSON.stringify(data.applicableProducts || []),
      JSON.stringify(data.applicableCategories || []),
      data.entityScope || null,
    ]);

    return this.mapCoupon(rows[0]);
  }

  /**
   * Update a coupon
   */
  async updateCoupon(id: string, data: UpdateCouponInput): Promise<Coupon> {
    const updates: string[] = [];
    const params: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    const fields: Array<[keyof UpdateCouponInput, string]> = [
      ['description', 'description'],
      ['discountType', 'discount_type'],
      ['discountValue', 'discount_value'],
      ['minimumOrderCents', 'minimum_order_cents'],
      ['maximumDiscountCents', 'maximum_discount_cents'],
      ['usageLimit', 'usage_limit'],
      ['perUserLimit', 'per_user_limit'],
      ['isActive', 'is_active'],
      ['startsAt', 'starts_at'],
      ['expiresAt', 'expires_at'],
    ];

    for (const [key, column] of fields) {
      if (data[key] !== undefined) {
        updates.push(`${column} = $${paramIndex++}`);
        params.push(data[key] as string | number | boolean | null);
      }
    }

    if (data.applicableProducts !== undefined) {
      updates.push(`applicable_products = $${paramIndex++}`);
      params.push(JSON.stringify(data.applicableProducts));
    }

    if (data.applicableCategories !== undefined) {
      updates.push(`applicable_categories = $${paramIndex++}`);
      params.push(JSON.stringify(data.applicableCategories));
    }

    params.push(id);

    const sql = `
      UPDATE coupons
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, airtable_id, code, description, discount_type, discount_value,
                currency, minimum_order_cents, maximum_discount_cents,
                usage_limit, usage_count, per_user_limit, is_active,
                starts_at, expires_at, applicable_products, applicable_categories,
                entity_scope, created_by, created_at, updated_at
    `;

    const rows = await this.client.query<CouponRow>(sql, params);
    return this.mapCoupon(rows[0]);
  }

  // ============================================================================
  // Mapping Functions
  // ============================================================================

  private mapProduct(row: ProductRow): Product {
    return {
      id: row.id,
      airtableId: row.airtable_id || undefined,
      name: row.name,
      description: row.description || undefined,
      shortDescription: row.short_description || undefined,
      priceCents: row.price_cents,
      compareAtPriceCents: row.compare_at_price_cents || undefined,
      currency: row.currency,
      productType: row.product_type as Product['productType'],
      sku: row.sku || undefined,
      stripeProductId: row.stripe_product_id || undefined,
      stripePriceId: row.stripe_price_id || undefined,
      isActive: row.is_active,
      isFeatured: row.is_featured,
      stockQuantity: row.stock_quantity || undefined,
      trackInventory: row.track_inventory,
      weightGrams: row.weight_grams || undefined,
      thumbnailUrl: row.thumbnail_url || undefined,
      images: row.images || [],
      entityScope: row.entity_scope as Product['entityScope'],
      courseId: row.course_id || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      metadata: row.metadata || undefined,
    };
  }

  private mapOrder(row: OrderRow): Order {
    return {
      id: row.id,
      airtableId: row.airtable_id || undefined,
      orderNumber: row.order_number,
      userId: row.user_id || undefined,
      status: row.status as Order['status'],
      subtotalCents: row.subtotal_cents,
      discountCents: row.discount_cents,
      taxCents: row.tax_cents,
      shippingCents: row.shipping_cents,
      totalCents: row.total_cents,
      currency: row.currency,
      paymentMethod: row.payment_method || undefined,
      paymentStatus: row.payment_status as Order['paymentStatus'],
      stripePaymentIntentId: row.stripe_payment_intent_id || undefined,
      stripeCheckoutSessionId: row.stripe_checkout_session_id || undefined,
      billingEmail: row.billing_email || undefined,
      billingName: row.billing_name || undefined,
      billingAddress: row.billing_address || undefined,
      shippingAddress: row.shipping_address || undefined,
      shippingMethod: row.shipping_method || undefined,
      trackingNumber: row.tracking_number || undefined,
      notes: row.notes || undefined,
      internalNotes: row.internal_notes || undefined,
      couponCode: row.coupon_code || undefined,
      entityScope: row.entity_scope as Order['entityScope'],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      paidAt: row.paid_at || undefined,
      shippedAt: row.shipped_at || undefined,
      completedAt: row.completed_at || undefined,
      cancelledAt: row.cancelled_at || undefined,
      metadata: row.metadata || undefined,
    };
  }

  private mapOrderItem(row: OrderItemRow): OrderItem {
    return {
      id: row.id,
      orderId: row.order_id,
      productId: row.product_id || undefined,
      productName: row.product_name,
      productSku: row.product_sku || undefined,
      quantity: row.quantity,
      unitPriceCents: row.unit_price_cents,
      discountCents: row.discount_cents,
      taxCents: row.tax_cents,
      totalCents: row.total_cents,
      metadata: row.metadata || undefined,
      createdAt: row.created_at,
    };
  }

  private mapTransaction(row: TransactionRow): Transaction {
    return {
      id: row.id,
      airtableId: row.airtable_id || undefined,
      orderId: row.order_id || undefined,
      userId: row.user_id || undefined,
      transactionType: row.transaction_type as Transaction['transactionType'],
      amountCents: row.amount_cents,
      currency: row.currency,
      status: row.status as Transaction['status'],
      paymentProvider: row.payment_provider || undefined,
      providerTransactionId: row.provider_transaction_id || undefined,
      providerFeeCents: row.provider_fee_cents,
      netAmountCents: row.net_amount_cents || undefined,
      description: row.description || undefined,
      failureReason: row.failure_reason || undefined,
      entityScope: row.entity_scope as Transaction['entityScope'],
      processedAt: row.processed_at || undefined,
      createdAt: row.created_at,
      metadata: row.metadata || undefined,
    };
  }

  private mapCoupon(row: CouponRow): Coupon {
    return {
      id: row.id,
      airtableId: row.airtable_id || undefined,
      code: row.code,
      description: row.description || undefined,
      discountType: row.discount_type as Coupon['discountType'],
      discountValue: row.discount_value,
      currency: row.currency,
      minimumOrderCents: row.minimum_order_cents || undefined,
      maximumDiscountCents: row.maximum_discount_cents || undefined,
      usageLimit: row.usage_limit || undefined,
      usageCount: row.usage_count,
      perUserLimit: row.per_user_limit,
      isActive: row.is_active,
      startsAt: row.starts_at || undefined,
      expiresAt: row.expires_at || undefined,
      applicableProducts: row.applicable_products || [],
      applicableCategories: row.applicable_categories || [],
      entityScope: row.entity_scope as Coupon['entityScope'],
      createdBy: row.created_by || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
