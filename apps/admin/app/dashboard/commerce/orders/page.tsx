/**
 * Orders List Page
 *
 * Manage orders for Ozean Licht platform.
 * Server component that fetches data and passes to client data table.
 */

import { Metadata } from 'next';
import { requireAnyRole } from '@/lib/rbac/utils';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/admin/data-table-skeleton';
import { OrdersDataTable } from './OrdersDataTable';
import { Order } from '@/types/commerce';

export const metadata: Metadata = {
  title: 'Orders | Admin Dashboard',
  description: 'Manage orders for Ozean Licht platform',
};

// Mock orders data for initial implementation
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'OL-2025-001',
    userId: '1',
    status: 'completed',
    subtotalCents: 19900,
    discountCents: 0,
    taxCents: 3781,
    shippingCents: 0,
    totalCents: 23681,
    currency: 'EUR',
    paymentMethod: 'stripe',
    paymentStatus: 'paid',
    stripePaymentIntentId: 'pi_1234567890',
    billingEmail: 'customer1@example.com',
    billingName: 'Anna Müller',
    billingAddress: {
      line1: 'Hauptstraße 123',
      city: 'Vienna',
      postalCode: '1010',
      country: 'AT',
    },
    entityScope: 'ozean_licht',
    createdAt: '2025-11-15T10:30:00Z',
    updatedAt: '2025-11-16T14:20:00Z',
    paidAt: '2025-11-15T10:35:00Z',
    completedAt: '2025-11-16T14:20:00Z',
  },
  {
    id: '2',
    orderNumber: 'OL-2025-002',
    userId: '2',
    status: 'paid',
    subtotalCents: 14900,
    discountCents: 1490,
    taxCents: 2548,
    shippingCents: 0,
    totalCents: 15958,
    currency: 'EUR',
    paymentMethod: 'stripe',
    paymentStatus: 'paid',
    stripePaymentIntentId: 'pi_0987654321',
    billingEmail: 'customer2@example.com',
    billingName: 'Marcus Schmidt',
    couponCode: 'WELCOME10',
    entityScope: 'ozean_licht',
    createdAt: '2025-11-20T15:45:00Z',
    updatedAt: '2025-11-20T15:50:00Z',
    paidAt: '2025-11-20T15:50:00Z',
  },
  {
    id: '3',
    orderNumber: 'OL-2025-003',
    userId: '3',
    status: 'pending',
    subtotalCents: 29900,
    discountCents: 0,
    taxCents: 5681,
    shippingCents: 490,
    totalCents: 36071,
    currency: 'EUR',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'pending',
    billingEmail: 'customer3@example.com',
    billingName: 'Sarah Weber',
    billingAddress: {
      line1: 'Musterweg 45',
      city: 'Salzburg',
      postalCode: '5020',
      country: 'AT',
    },
    shippingAddress: {
      line1: 'Musterweg 45',
      city: 'Salzburg',
      postalCode: '5020',
      country: 'AT',
    },
    entityScope: 'ozean_licht',
    createdAt: '2025-11-25T09:15:00Z',
    updatedAt: '2025-11-25T09:15:00Z',
  },
  {
    id: '4',
    orderNumber: 'OL-2025-004',
    userId: '4',
    status: 'shipped',
    subtotalCents: 9900,
    discountCents: 0,
    taxCents: 1881,
    shippingCents: 490,
    totalCents: 12271,
    currency: 'EUR',
    paymentMethod: 'stripe',
    paymentStatus: 'paid',
    stripePaymentIntentId: 'pi_5678901234',
    billingEmail: 'customer4@example.com',
    billingName: 'Thomas Klein',
    trackingNumber: 'TRACK123456789',
    shippingMethod: 'standard',
    billingAddress: {
      line1: 'Bahnhofstraße 78',
      city: 'Graz',
      postalCode: '8010',
      country: 'AT',
    },
    shippingAddress: {
      line1: 'Bahnhofstraße 78',
      city: 'Graz',
      postalCode: '8010',
      country: 'AT',
    },
    entityScope: 'ozean_licht',
    createdAt: '2025-11-22T11:00:00Z',
    updatedAt: '2025-11-24T16:30:00Z',
    paidAt: '2025-11-22T11:05:00Z',
    shippedAt: '2025-11-24T16:30:00Z',
  },
  {
    id: '5',
    orderNumber: 'OL-2025-005',
    userId: '5',
    status: 'cancelled',
    subtotalCents: 19900,
    discountCents: 0,
    taxCents: 3781,
    shippingCents: 0,
    totalCents: 23681,
    currency: 'EUR',
    paymentMethod: 'stripe',
    paymentStatus: 'refunded',
    billingEmail: 'customer5@example.com',
    billingName: 'Lisa Berger',
    notes: 'Customer requested cancellation',
    internalNotes: 'Full refund processed',
    entityScope: 'ozean_licht',
    createdAt: '2025-11-18T13:20:00Z',
    updatedAt: '2025-11-19T10:15:00Z',
    paidAt: '2025-11-18T13:25:00Z',
    cancelledAt: '2025-11-19T10:15:00Z',
  },
];

interface OrdersPageProps {
  searchParams: {
    search?: string;
    status?: string;
    paymentStatus?: string;
    offset?: string;
  };
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  // Require commerce management role (super_admin, ol_admin, or ol_commerce)
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_commerce']);

  // Use mock data for now, will integrate with MCP Gateway later
  // Apply basic filters to mock data
  let filteredOrders = [...MOCK_ORDERS];

  // Search filter (order number or email)
  if (searchParams.search) {
    const search = searchParams.search.toLowerCase();
    filteredOrders = filteredOrders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(search) ||
        o.billingEmail?.toLowerCase().includes(search) ||
        o.billingName?.toLowerCase().includes(search)
    );
  }

  // Status filter
  if (searchParams.status && searchParams.status !== 'all') {
    filteredOrders = filteredOrders.filter((o) => o.status === searchParams.status);
  }

  // Payment status filter
  if (searchParams.paymentStatus && searchParams.paymentStatus !== 'all') {
    filteredOrders = filteredOrders.filter((o) => o.paymentStatus === searchParams.paymentStatus);
  }

  const orders = filteredOrders;
  const total = filteredOrders.length;
  const limit = 50;
  const offset = searchParams.offset ? parseInt(searchParams.offset, 10) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage orders and transactions for Ozean Licht platform
          </p>
        </div>
      </div>

      {/* Data Table */}
      <Suspense fallback={<DataTableSkeleton columns={7} rows={10} />}>
        <OrdersDataTable
          initialData={orders}
          total={total}
          limit={limit}
          offset={offset}
        />
      </Suspense>
    </div>
  );
}
