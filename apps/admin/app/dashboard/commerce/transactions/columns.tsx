'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Transaction } from '@/types/commerce';
import { formatPrice, getTransactionTypeColor } from '@/types/commerce';
import { Button, Badge } from '@/lib/ui';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Eye, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/lib/ui';

/**
 * Get badge variant and className for transaction type
 */
function getTransactionTypeConfig(type: Transaction['transactionType']): { className: string; label: string } {
  const color = getTransactionTypeColor(type);
  const baseClasses = 'border';
  const colorClasses: Record<string, string> = {
    green: 'bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-400',
    orange: 'bg-orange-500/20 text-orange-700 border-orange-500/30 dark:text-orange-400',
    red: 'bg-red-500/20 text-red-700 border-red-500/30 dark:text-red-400',
    blue: 'bg-blue-500/20 text-blue-700 border-blue-500/30 dark:text-blue-400',
    purple: 'bg-purple-500/20 text-purple-700 border-purple-500/30 dark:text-purple-400',
    gray: 'bg-gray-500/20 text-gray-700 border-gray-500/30 dark:text-gray-400',
  };

  const labels: Record<Transaction['transactionType'], string> = {
    payment: 'Payment',
    refund: 'Refund',
    chargeback: 'Chargeback',
    payout: 'Payout',
    adjustment: 'Adjustment',
    fee: 'Fee',
  };

  return {
    className: `${baseClasses} ${colorClasses[color] || colorClasses.gray}`,
    label: labels[type] || type,
  };
}

/**
 * Get badge variant and className for transaction status
 */
function getTransactionStatusConfig(status: Transaction['status']): { className: string; label: string } {
  const baseClasses = 'border';
  const colorClasses: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-700 border-blue-500/30 dark:text-blue-400',
    completed: 'bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-400',
    failed: 'bg-red-500/20 text-red-700 border-red-500/30 dark:text-red-400',
    cancelled: 'bg-gray-500/20 text-gray-700 border-gray-500/30 dark:text-gray-400',
    reversed: 'bg-orange-500/20 text-orange-700 border-orange-500/30 dark:text-orange-400',
  };

  const labels: Record<Transaction['status'], string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
    reversed: 'Reversed',
  };

  return {
    className: `${baseClasses} ${colorClasses[status] || colorClasses.pending}`,
    label: labels[status] || status,
  };
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'id',
    header: 'Transaction ID',
    cell: ({ row }) => {
      const transaction = row.original;
      const truncatedId = transaction.id.length > 12
        ? `${transaction.id.slice(0, 12)}...`
        : transaction.id;

      return (
        <div className="flex flex-col">
          <button
            onClick={() => navigator.clipboard.writeText(transaction.id)}
            className="font-medium font-mono text-sm text-left hover:text-primary transition-colors flex items-center gap-1 group"
            title="Click to copy"
          >
            {truncatedId}
            <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          {transaction.orderId && (
            <Link
              href={`/dashboard/commerce/orders/${transaction.orderId}`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Order: {transaction.orderId}
            </Link>
          )}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'transactionType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.transactionType;
      const config = getTransactionTypeConfig(type);

      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
    enableSorting: true,
    filterFn: (row, _id, value) => {
      if (value === 'all') return true;
      return row.original.transactionType === value;
    },
  },
  {
    accessorKey: 'amountCents',
    header: 'Amount',
    cell: ({ row }) => {
      const transaction = row.original;
      const amount = formatPrice(transaction.amountCents, transaction.currency);
      const isNegative = transaction.transactionType === 'refund' || transaction.transactionType === 'chargeback';

      return (
        <div className="flex flex-col">
          <span className={`font-medium ${isNegative ? 'text-red-600 dark:text-red-400' : ''}`}>
            {isNegative ? '-' : ''}{amount}
          </span>
          {transaction.providerFeeCents > 0 && (
            <span className="text-xs text-muted-foreground">
              Fee: {formatPrice(transaction.providerFeeCents, transaction.currency)}
            </span>
          )}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const config = getTransactionStatusConfig(status);

      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
    enableSorting: true,
    filterFn: (row, _id, value) => {
      if (value === 'all') return true;
      return row.original.status === value;
    },
  },
  {
    accessorKey: 'paymentProvider',
    header: 'Provider',
    cell: ({ row }) => {
      const provider = row.original.paymentProvider;

      if (!provider) return <span className="text-muted-foreground">—</span>;

      const providerLabels: Record<string, string> = {
        stripe: 'Stripe',
        paypal: 'PayPal',
        bank_transfer: 'Bank Transfer',
      };

      return (
        <span className="text-sm capitalize">
          {providerLabels[provider] || provider}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const dateString = row.original.createdAt;
      const date = new Date(dateString);
      // Use fixed format to avoid hydration mismatch between server/client locales
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;

      return (
        <div className="flex flex-col">
          <span className="text-sm">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {formattedDate}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transaction.id)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Transaction ID
              </DropdownMenuItem>
              {transaction.providerTransactionId && (
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(transaction.providerTransactionId!)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Provider ID
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {transaction.orderId && (
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/commerce/orders/${transaction.orderId}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Order
                  </Link>
                </DropdownMenuItem>
              )}
              {transaction.providerTransactionId && transaction.paymentProvider === 'stripe' && (
                <DropdownMenuItem asChild>
                  <a
                    href={`https://dashboard.stripe.com/payments/${transaction.providerTransactionId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View in Stripe
                  </a>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
