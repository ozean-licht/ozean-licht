/**
 * Products List Page
 *
 * Manage products for Ozean Licht platform.
 * Server component that fetches data and passes to client data table.
 */

import { Metadata } from 'next';
import { requireAnyRole } from '@/lib/rbac/utils';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/admin/data-table-skeleton';
import { ProductsDataTable } from './ProductsDataTable';
import { Product } from '@/types/commerce';

export const metadata: Metadata = {
  title: 'Products | Admin Dashboard',
  description: 'Manage products for Ozean Licht platform',
};

// Mock products data for initial implementation
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Chakra Healing Master Course',
    description: 'Complete comprehensive course on chakra healing and energy work. Learn ancient techniques combined with modern practices.',
    shortDescription: 'Master the art of chakra healing',
    priceCents: 19900,
    compareAtPriceCents: 29900,
    currency: 'EUR',
    productType: 'course',
    sku: 'OL-COURSE-001',
    isActive: true,
    isFeatured: true,
    trackInventory: false,
    thumbnailUrl: '/images/products/chakra-course.jpg',
    images: ['/images/products/chakra-course.jpg'],
    entityScope: 'ozean_licht',
    createdAt: '2025-10-15T10:00:00Z',
    updatedAt: '2025-11-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'Premium Membership',
    description: 'Access to all courses, live sessions, and exclusive community features. Renewable monthly subscription.',
    shortDescription: 'Full access to all platform features',
    priceCents: 4900,
    currency: 'EUR',
    productType: 'membership',
    sku: 'OL-MEM-PREM',
    isActive: true,
    isFeatured: true,
    trackInventory: false,
    thumbnailUrl: '/images/products/membership.jpg',
    images: ['/images/products/membership.jpg'],
    entityScope: 'ozean_licht',
    createdAt: '2025-09-01T08:00:00Z',
    updatedAt: '2025-11-15T09:20:00Z',
  },
  {
    id: '3',
    name: 'Meditation Audio Collection',
    description: 'Curated collection of guided meditation audio tracks. Downloadable MP3 format with lifetime access.',
    shortDescription: '12 guided meditation tracks',
    priceCents: 2900,
    currency: 'EUR',
    productType: 'digital',
    sku: 'OL-AUDIO-MED-01',
    isActive: true,
    isFeatured: false,
    trackInventory: false,
    thumbnailUrl: '/images/products/meditation-audio.jpg',
    images: ['/images/products/meditation-audio.jpg'],
    entityScope: 'ozean_licht',
    createdAt: '2025-11-01T12:00:00Z',
    updatedAt: '2025-11-10T16:45:00Z',
  },
  {
    id: '4',
    name: 'Crystal Healing Set',
    description: 'Physical set of 7 chakra stones with instruction booklet. Ships within Austria and EU.',
    shortDescription: '7 premium healing crystals',
    priceCents: 4900,
    currency: 'EUR',
    productType: 'physical',
    sku: 'OL-CRYSTAL-SET-01',
    isActive: true,
    isFeatured: false,
    stockQuantity: 45,
    trackInventory: true,
    weightGrams: 350,
    thumbnailUrl: '/images/products/crystal-set.jpg',
    images: ['/images/products/crystal-set.jpg', '/images/products/crystal-set-detail.jpg'],
    entityScope: 'ozean_licht',
    createdAt: '2025-08-20T14:00:00Z',
    updatedAt: '2025-11-25T11:30:00Z',
  },
  {
    id: '5',
    name: 'Beginner Course Bundle',
    description: 'Bundle of 3 introductory courses at a special price. Perfect for those starting their spiritual journey.',
    shortDescription: '3 courses for beginners',
    priceCents: 14900,
    compareAtPriceCents: 24900,
    currency: 'EUR',
    productType: 'bundle',
    sku: 'OL-BUNDLE-BEG-01',
    isActive: true,
    isFeatured: true,
    trackInventory: false,
    thumbnailUrl: '/images/products/beginner-bundle.jpg',
    images: ['/images/products/beginner-bundle.jpg'],
    entityScope: 'ozean_licht',
    createdAt: '2025-10-01T09:00:00Z',
    updatedAt: '2025-11-22T13:15:00Z',
  },
  {
    id: '6',
    name: 'Archived Workshop Materials',
    description: 'Old workshop materials no longer sold. Kept for reference.',
    shortDescription: 'Discontinued product',
    priceCents: 9900,
    currency: 'EUR',
    productType: 'digital',
    sku: 'OL-WORKSHOP-OLD',
    isActive: false,
    isFeatured: false,
    trackInventory: false,
    thumbnailUrl: '/images/products/workshop-old.jpg',
    images: [],
    entityScope: 'ozean_licht',
    createdAt: '2025-06-10T10:00:00Z',
    updatedAt: '2025-09-01T15:00:00Z',
  },
];

interface ProductsPageProps {
  searchParams: {
    search?: string;
    productType?: string;
    status?: string;
    offset?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Require commerce management role (super_admin, ol_admin, or ol_commerce)
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_commerce']);

  // Use mock data for now, will integrate with MCP Gateway later
  // Apply basic filters to mock data
  let filteredProducts = [...MOCK_PRODUCTS];

  // Search filter (name or SKU)
  if (searchParams.search) {
    const search = searchParams.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.sku?.toLowerCase().includes(search) ||
        p.shortDescription?.toLowerCase().includes(search)
    );
  }

  // Product type filter
  if (searchParams.productType && searchParams.productType !== 'all') {
    filteredProducts = filteredProducts.filter((p) => p.productType === searchParams.productType);
  }

  // Status filter (active/inactive)
  if (searchParams.status && searchParams.status !== 'all') {
    const isActive = searchParams.status === 'active';
    filteredProducts = filteredProducts.filter((p) => p.isActive === isActive);
  }

  const products = filteredProducts;
  const total = filteredProducts.length;
  const limit = 50;
  const offset = searchParams.offset ? parseInt(searchParams.offset, 10) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage products and inventory for Ozean Licht platform
          </p>
        </div>
      </div>

      {/* Data Table */}
      <Suspense fallback={<DataTableSkeleton columns={7} rows={10} />}>
        <ProductsDataTable
          initialData={products}
          total={total}
          limit={limit}
          offset={offset}
        />
      </Suspense>
    </div>
  );
}
