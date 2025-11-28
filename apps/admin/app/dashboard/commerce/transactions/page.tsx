/**
 * Transactions List Page
 *
 * Manage transactions for Ozean Licht platform.
 * Server component that fetches data and passes to client data table.
 */

import { Metadata } from 'next';
import { requireAnyRole } from '@/lib/rbac/utils';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/admin/data-table-skeleton';
import { TransactionsDataTable } from './TransactionsDataTable';
import { Transaction } from '@/types/commerce';

export const metadata: Metadata = {
  title: 'Transactions | Admin Dashboard',
  description: 'Manage transactions for Ozean Licht platform',
};

// Mock transactions data for initial implementation
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_1',
    orderId: '1',
    userId: '1',
    transactionType: 'payment',
    amountCents: 23681,
    currency: 'EUR',
    status: 'completed',
    paymentProvider: 'stripe',
    providerTransactionId: 'pi_1234567890',
    providerFeeCents: 710,
    netAmountCents: 22971,
    description: 'Payment for order OL-2025-001',
    entityScope: 'ozean_licht',
    processedAt: '2025-11-15T10:35:00Z',
    createdAt: '2025-11-15T10:30:00Z',
  },
  {
    id: 'txn_2',
    orderId: '2',
    userId: '2',
    transactionType: 'payment',
    amountCents: 15958,
    currency: 'EUR',
    status: 'completed',
    paymentProvider: 'stripe',
    providerTransactionId: 'pi_0987654321',
    providerFeeCents: 479,
    netAmountCents: 15479,
    description: 'Payment for order OL-2025-002',
    entityScope: 'ozean_licht',
    processedAt: '2025-11-20T15:50:00Z',
    createdAt: '2025-11-20T15:45:00Z',
  },
  {
    id: 'txn_3',
    orderId: '3',
    userId: '3',
    transactionType: 'payment',
    amountCents: 36071,
    currency: 'EUR',
    status: 'pending',
    paymentProvider: 'bank_transfer',
    providerFeeCents: 0,
    description: 'Bank transfer payment for order OL-2025-003',
    entityScope: 'ozean_licht',
    createdAt: '2025-11-25T09:15:00Z',
  },
  {
    id: 'txn_4',
    orderId: '5',
    userId: '5',
    transactionType: 'refund',
    amountCents: 23681,
    currency: 'EUR',
    status: 'completed',
    paymentProvider: 'stripe',
    providerTransactionId: 're_1234567890',
    providerFeeCents: 0,
    netAmountCents: -23681,
    description: 'Refund for cancelled order OL-2025-005',
    entityScope: 'ozean_licht',
    processedAt: '2025-11-19T10:15:00Z',
    createdAt: '2025-11-19T10:10:00Z',
  },
  {
    id: 'txn_5',
    userId: '6',
    transactionType: 'chargeback',
    amountCents: 14900,
    currency: 'EUR',
    status: 'completed',
    paymentProvider: 'paypal',
    providerTransactionId: 'cb_5678901234',
    providerFeeCents: 1490,
    netAmountCents: -16390,
    description: 'Chargeback disputed by customer',
    failureReason: 'Customer dispute: unauthorized transaction',
    entityScope: 'ozean_licht',
    processedAt: '2025-11-23T14:20:00Z',
    createdAt: '2025-11-22T08:30:00Z',
  },
  {
    id: 'txn_6',
    orderId: '4',
    userId: '4',
    transactionType: 'payment',
    amountCents: 12271,
    currency: 'EUR',
    status: 'failed',
    paymentProvider: 'stripe',
    providerFeeCents: 0,
    description: 'Failed payment attempt for order OL-2025-004',
    failureReason: 'Insufficient funds',
    entityScope: 'ozean_licht',
    createdAt: '2025-11-21T16:45:00Z',
  },
];

interface TransactionsPageProps {
  searchParams: {
    search?: string;
    transactionType?: string;
    status?: string;
    offset?: string;
  };
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  // Require commerce management role (super_admin, ol_admin, or ol_commerce)
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_commerce']);

  // Use mock data for now, will integrate with MCP Gateway later
  // Apply basic filters to mock data
  let filteredTransactions = [...MOCK_TRANSACTIONS];

  // Search filter (transaction ID or order ID)
  if (searchParams.search) {
    const search = searchParams.search.toLowerCase();
    filteredTransactions = filteredTransactions.filter(
      (t) =>
        t.id.toLowerCase().includes(search) ||
        t.orderId?.toLowerCase().includes(search) ||
        t.providerTransactionId?.toLowerCase().includes(search)
    );
  }

  // Transaction type filter
  if (searchParams.transactionType && searchParams.transactionType !== 'all') {
    filteredTransactions = filteredTransactions.filter((t) => t.transactionType === searchParams.transactionType);
  }

  // Status filter
  if (searchParams.status && searchParams.status !== 'all') {
    filteredTransactions = filteredTransactions.filter((t) => t.status === searchParams.status);
  }

  const transactions = filteredTransactions;
  const total = filteredTransactions.length;
  const limit = 50;
  const offset = searchParams.offset ? parseInt(searchParams.offset, 10) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage payment transactions for Ozean Licht platform
          </p>
        </div>
      </div>

      {/* Data Table */}
      <Suspense fallback={<DataTableSkeleton columns={7} rows={10} />}>
        <TransactionsDataTable
          initialData={transactions}
          total={total}
          limit={limit}
          offset={offset}
        />
      </Suspense>
    </div>
  );
}
