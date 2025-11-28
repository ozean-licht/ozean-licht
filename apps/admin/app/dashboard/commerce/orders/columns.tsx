'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Order } from '@/types/commerce';
import { formatPrice, getOrderStatusColor, getPaymentStatusColor } from '@/types/commerce';
import { Button, Badge } from '@/lib/ui';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Eye, Package, FileText, CreditCard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Get badge variant and className for order status
 */
function getOrderStatusConfig(status: Order['status']): { className: string; label: string } {
  const color = getOrderStatusColor(status);
  const baseClasses = 'border';
  const colorClasses: Record<string, string> = {
    yellow: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:text-yellow-400',
    blue: 'bg-blue-500/20 text-blue-700 border-blue-500/30 dark:text-blue-400',
    green: 'bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-400',
    purple: 'bg-purple-500/20 text-purple-700 border-purple-500/30 dark:text-purple-400',
    teal: 'bg-teal-500/20 text-teal-700 border-teal-500/30 dark:text-teal-400',
    red: 'bg-red-500/20 text-red-700 border-red-500/30 dark:text-red-400',
    orange: 'bg-orange-500/20 text-orange-700 border-orange-500/30 dark:text-orange-400',
    gray: 'bg-gray-500/20 text-gray-700 border-gray-500/30 dark:text-gray-400',
  };

  const labels: Record<Order['status'], string> = {
    pending: 'Pending',
    processing: 'Processing',
    paid: 'Paid',
    shipped: 'Shipped',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
    failed: 'Failed',
  };

  return {
    className: `${baseClasses} ${colorClasses[color] || colorClasses.gray}`,
    label: labels[status] || status,
  };
}

/**
 * Get badge variant and className for payment status
 */
function getPaymentStatusConfig(status: Order['paymentStatus']): { className: string; label: string } {
  const color = getPaymentStatusColor(status);
  const baseClasses = 'border';
  const colorClasses: Record<string, string> = {
    yellow: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:text-yellow-400',
    blue: 'bg-blue-500/20 text-blue-700 border-blue-500/30 dark:text-blue-400',
    green: 'bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-400',
    red: 'bg-red-500/20 text-red-700 border-red-500/30 dark:text-red-400',
    orange: 'bg-orange-500/20 text-orange-700 border-orange-500/30 dark:text-orange-400',
    gray: 'bg-gray-500/20 text-gray-700 border-gray-500/30 dark:text-gray-400',
  };

  const labels: Record<Order['paymentStatus'], string> = {
    pending: 'Pending',
    authorized: 'Authorized',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
    partially_refunded: 'Partially Refunded',
  };

  return {
    className: `${baseClasses} ${colorClasses[color] || colorClasses.gray}`,
    label: labels[status] || status,
  };
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'orderNumber',
    header: 'Order Number',
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex flex-col">
          <span className="font-medium font-mono text-sm">{order.orderNumber}</span>
          {order.couponCode && (
            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Badge variant="outline" className="h-4 px-1 text-[10px]">
                {order.couponCode}
              </Badge>
            </span>
          )}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{order.billingName || '—'}</span>
          <span className="text-xs text-muted-foreground">{order.billingEmail || '—'}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const config = getOrderStatusConfig(status);

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
    accessorKey: 'paymentStatus',
    header: 'Payment',
    cell: ({ row }) => {
      const paymentStatus = row.original.paymentStatus;
      const config = getPaymentStatusConfig(paymentStatus);

      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
    enableSorting: true,
    filterFn: (row, _id, value) => {
      if (value === 'all') return true;
      return row.original.paymentStatus === value;
    },
  },
  {
    accessorKey: 'totalCents',
    header: 'Total',
    cell: ({ row }) => {
      const order = row.original;
      const total = formatPrice(order.totalCents, order.currency);

      return (
        <div className="flex flex-col">
          <span className="font-medium">{total}</span>
          {order.discountCents > 0 && (
            <span className="text-xs text-green-600 dark:text-green-400">
              -{formatPrice(order.discountCents, order.currency)} discount
            </span>
          )}
        </div>
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
      const order = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/commerce/orders/${order.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/commerce/orders/${order.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              {order.status === 'paid' && (
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/commerce/orders/${order.id}/ship`}>
                    <Package className="h-4 w-4 mr-2" />
                    Mark as Shipped
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order.id)}
              >
                Copy Order ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order.orderNumber)}
              >
                Copy Order Number
              </DropdownMenuItem>
              {order.billingEmail && (
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(order.billingEmail!)}
                >
                  Copy Customer Email
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/commerce/orders/${order.id}/invoice`}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Invoice
                </Link>
              </DropdownMenuItem>
              {order.stripePaymentIntentId && (
                <DropdownMenuItem asChild>
                  <a
                    href={`https://dashboard.stripe.com/payments/${order.stripePaymentIntentId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
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
