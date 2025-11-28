/**
 * Commerce Types - Products, Orders, Transactions, Coupons
 * Part of Airtable MCP Migration
 */

// Entity scope for multi-tenant support
export type CommerceEntityScope = 'ozean_licht' | 'kids_ascension';

// Product type
export type ProductType = 'course' | 'membership' | 'digital' | 'physical' | 'bundle' | 'subscription';

// Order status
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed';

// Payment status
export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

// Transaction type
export type TransactionType = 'payment' | 'refund' | 'chargeback' | 'payout' | 'adjustment' | 'fee';

// Transaction status
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'reversed';

// Discount type
export type DiscountType = 'percentage' | 'fixed_amount' | 'free_shipping';

/**
 * Product entity
 */
export interface Product {
  id: string;
  airtableId?: string;
  name: string;
  description?: string;
  shortDescription?: string;
  priceCents: number;
  compareAtPriceCents?: number;
  currency: string;
  productType: ProductType;
  sku?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  isActive: boolean;
  isFeatured: boolean;
  stockQuantity?: number;
  trackInventory: boolean;
  weightGrams?: number;
  thumbnailUrl?: string;
  images: string[];
  entityScope?: CommerceEntityScope;
  courseId?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
  // Computed/joined fields
  course?: {
    id: string;
    title: string;
    slug: string;
  };
}

/**
 * Order entity
 */
export interface Order {
  id: string;
  airtableId?: string;
  orderNumber: string;
  userId?: string;
  status: OrderStatus;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
  paymentMethod?: string;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;
  billingEmail?: string;
  billingName?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
  internalNotes?: string;
  couponCode?: string;
  entityScope?: CommerceEntityScope;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  metadata?: Record<string, unknown>;
  // Computed/joined fields
  items?: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
  transactions?: Transaction[];
}

/**
 * Order item entity
 */
export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  productName: string;
  productSku?: string;
  quantity: number;
  unitPriceCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  // Computed/joined fields
  product?: Product;
}

/**
 * Transaction entity
 */
export interface Transaction {
  id: string;
  airtableId?: string;
  orderId?: string;
  userId?: string;
  transactionType: TransactionType;
  amountCents: number;
  currency: string;
  status: TransactionStatus;
  paymentProvider?: string;
  providerTransactionId?: string;
  providerFeeCents: number;
  netAmountCents?: number;
  description?: string;
  failureReason?: string;
  entityScope?: CommerceEntityScope;
  processedAt?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
  // Computed/joined fields
  order?: Order;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Coupon entity
 */
export interface Coupon {
  id: string;
  airtableId?: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  currency: string;
  minimumOrderCents?: number;
  maximumDiscountCents?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit: number;
  isActive: boolean;
  startsAt?: string;
  expiresAt?: string;
  applicableProducts: string[];
  applicableCategories: string[];
  entityScope?: CommerceEntityScope;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Address type
 */
export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

// Input types for CRUD operations

export interface CreateProductInput {
  name: string;
  description?: string;
  shortDescription?: string;
  priceCents: number;
  compareAtPriceCents?: number;
  currency?: string;
  productType: ProductType;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  stockQuantity?: number;
  trackInventory?: boolean;
  weightGrams?: number;
  thumbnailUrl?: string;
  images?: string[];
  entityScope?: CommerceEntityScope;
  courseId?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  shortDescription?: string;
  priceCents?: number;
  compareAtPriceCents?: number;
  currency?: string;
  productType?: ProductType;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  stockQuantity?: number;
  trackInventory?: boolean;
  weightGrams?: number;
  thumbnailUrl?: string;
  images?: string[];
  entityScope?: CommerceEntityScope;
  courseId?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateOrderInput {
  userId?: string;
  status?: OrderStatus;
  items: CreateOrderItemInput[];
  discountCents?: number;
  taxCents?: number;
  shippingCents?: number;
  currency?: string;
  billingEmail?: string;
  billingName?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  shippingMethod?: string;
  notes?: string;
  couponCode?: string;
  entityScope?: CommerceEntityScope;
  metadata?: Record<string, unknown>;
}

export interface CreateOrderItemInput {
  productId?: string;
  productName: string;
  productSku?: string;
  quantity: number;
  unitPriceCents: number;
  discountCents?: number;
  taxCents?: number;
}

export interface UpdateOrderInput {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
  internalNotes?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateTransactionInput {
  orderId?: string;
  userId?: string;
  transactionType: TransactionType;
  amountCents: number;
  currency?: string;
  status?: TransactionStatus;
  paymentProvider?: string;
  providerTransactionId?: string;
  providerFeeCents?: number;
  description?: string;
  entityScope?: CommerceEntityScope;
  metadata?: Record<string, unknown>;
}

export interface CreateCouponInput {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  currency?: string;
  minimumOrderCents?: number;
  maximumDiscountCents?: number;
  usageLimit?: number;
  perUserLimit?: number;
  isActive?: boolean;
  startsAt?: string;
  expiresAt?: string;
  applicableProducts?: string[];
  applicableCategories?: string[];
  entityScope?: CommerceEntityScope;
}

export interface UpdateCouponInput {
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  minimumOrderCents?: number;
  maximumDiscountCents?: number;
  usageLimit?: number;
  perUserLimit?: number;
  isActive?: boolean;
  startsAt?: string;
  expiresAt?: string;
  applicableProducts?: string[];
  applicableCategories?: string[];
}

// List options

export interface ProductListOptions {
  entityScope?: CommerceEntityScope;
  productType?: ProductType;
  isActive?: boolean;
  isFeatured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface OrderListOptions {
  entityScope?: CommerceEntityScope;
  userId?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface TransactionListOptions {
  entityScope?: CommerceEntityScope;
  orderId?: string;
  userId?: string;
  transactionType?: TransactionType;
  status?: TransactionStatus;
  paymentProvider?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface CouponListOptions {
  entityScope?: CommerceEntityScope;
  isActive?: boolean;
  discountType?: DiscountType;
  search?: string;
  limit?: number;
  offset?: number;
}

// Paginated results

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export type ProductListResult = PaginatedResult<Product>;
export type OrderListResult = PaginatedResult<Order>;
export type TransactionListResult = PaginatedResult<Transaction>;
export type CouponListResult = PaginatedResult<Coupon>;

// Stats types

export interface CommerceStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalRefunds: number;
}

export interface RevenueByPeriod {
  period: string;
  revenue: number;
  orders: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
}

// Display helpers

export function formatPrice(cents: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending: 'yellow',
    processing: 'blue',
    paid: 'green',
    shipped: 'purple',
    delivered: 'teal',
    completed: 'green',
    cancelled: 'red',
    refunded: 'orange',
    failed: 'red',
  };
  return colors[status] || 'gray';
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    pending: 'yellow',
    authorized: 'blue',
    paid: 'green',
    failed: 'red',
    refunded: 'orange',
    partially_refunded: 'orange',
  };
  return colors[status] || 'gray';
}

export function getTransactionTypeColor(type: TransactionType): string {
  const colors: Record<TransactionType, string> = {
    payment: 'green',
    refund: 'orange',
    chargeback: 'red',
    payout: 'blue',
    adjustment: 'purple',
    fee: 'gray',
  };
  return colors[type] || 'gray';
}
