'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Product, ProductType } from '@/types/commerce';
import { formatPrice } from '@/types/commerce';
import { Button, Badge } from '@/lib/ui';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Eye, Edit, Trash2, Package } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/lib/ui';

/**
 * Get badge variant and className for product type
 */
function getProductTypeConfig(type: ProductType): { className: string; label: string } {
  const colorClasses: Record<ProductType, string> = {
    course: 'bg-blue-500/20 text-blue-700 border-blue-500/30 dark:text-blue-400',
    membership: 'bg-purple-500/20 text-purple-700 border-purple-500/30 dark:text-purple-400',
    digital: 'bg-teal-500/20 text-teal-700 border-teal-500/30 dark:text-teal-400',
    physical: 'bg-orange-500/20 text-orange-700 border-orange-500/30 dark:text-orange-400',
    bundle: 'bg-pink-500/20 text-pink-700 border-pink-500/30 dark:text-pink-400',
    subscription: 'bg-indigo-500/20 text-indigo-700 border-indigo-500/30 dark:text-indigo-400',
  };

  const labels: Record<ProductType, string> = {
    course: 'Course',
    membership: 'Membership',
    digital: 'Digital',
    physical: 'Physical',
    bundle: 'Bundle',
    subscription: 'Subscription',
  };

  return {
    className: `border ${colorClasses[type] || 'bg-gray-500/20 text-gray-700 border-gray-500/30 dark:text-gray-400'}`,
    label: labels[type] || type,
  };
}

/**
 * Get badge config for product status (active/inactive)
 */
function getStatusConfig(isActive: boolean): { className: string; label: string } {
  if (isActive) {
    return {
      className: 'border bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-400',
      label: 'Active',
    };
  }
  return {
    className: 'border bg-gray-500/20 text-gray-700 border-gray-500/30 dark:text-gray-400',
    label: 'Inactive',
  };
}

export const columns: ColumnDef<Product>[] = [
  {
    id: 'product',
    header: 'Product',
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex items-center gap-3 min-w-[250px]">
          {/* Thumbnail */}
          <div className="w-12 h-12 rounded-md bg-muted flex-shrink-0 overflow-hidden">
            {product.thumbnailUrl ? (
              <img
                src={product.thumbnailUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Name & Description */}
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium text-sm truncate">{product.name}</span>
            {product.shortDescription && (
              <span className="text-xs text-muted-foreground truncate">
                {product.shortDescription}
              </span>
            )}
            {product.isFeatured && (
              <Badge variant="outline" className="mt-1 w-fit h-4 px-1 text-[10px] border-yellow-500/30 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                Featured
              </Badge>
            )}
          </div>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'productType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.productType;
      const config = getProductTypeConfig(type);

      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
    enableSorting: true,
    filterFn: (row, _id, value) => {
      if (value === 'all') return true;
      return row.original.productType === value;
    },
  },
  {
    accessorKey: 'priceCents',
    header: 'Price',
    cell: ({ row }) => {
      const product = row.original;
      const price = formatPrice(product.priceCents, product.currency);

      return (
        <div className="flex flex-col">
          <span className="font-medium">{price}</span>
          {product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtPriceCents, product.currency)}
            </span>
          )}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      const config = getStatusConfig(isActive);

      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
    enableSorting: true,
    filterFn: (row, _id, value) => {
      if (value === 'all') return true;
      const isActive = value === 'active';
      return row.original.isActive === isActive;
    },
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ row }) => {
      const sku = row.original.sku;

      return (
        <span className="font-mono text-sm text-muted-foreground">
          {sku || '—'}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    id: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const product = row.original;

      if (!product.trackInventory) {
        return <span className="text-sm text-muted-foreground">—</span>;
      }

      const stock = product.stockQuantity ?? 0;
      const isLowStock = stock > 0 && stock <= 10;
      const isOutOfStock = stock === 0;

      return (
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-600 dark:text-red-400' : isLowStock ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>
            {stock}
          </span>
          {isLowStock && (
            <Badge variant="outline" className="h-4 px-1 text-[10px] border-yellow-500/30 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
              Low
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="outline" className="h-4 px-1 text-[10px] border-red-500/30 bg-red-500/20 text-red-700 dark:text-red-400">
              Out
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
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
      const product = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/commerce/products/${product.id}`}>
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
                <Link href={`/dashboard/commerce/products/${product.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/commerce/products/${product.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(product.id)}
              >
                Copy Product ID
              </DropdownMenuItem>
              {product.sku && (
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(product.sku!)}
                >
                  Copy SKU
                </DropdownMenuItem>
              )}
              {product.stripeProductId && (
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(product.stripeProductId!)}
                >
                  Copy Stripe Product ID
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
