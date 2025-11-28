/**
 * Videos List Page
 *
 * Manage videos for Ozean Licht platform.
 * Server component that fetches data from ozean-licht-db.
 */

import { Metadata } from 'next';
import { requireAnyRole } from '@/lib/rbac/utils';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/admin/data-table-skeleton';
import { VideosDataTable } from './VideosDataTable';
import { listVideos } from '@/lib/db/videos';

export const metadata: Metadata = {
  title: 'Videos | Admin Dashboard',
  description: 'Manage videos for Ozean Licht platform',
};

interface VideosPageProps {
  searchParams: {
    search?: string;
    status?: string;
    offset?: string;
  };
}

export default async function VideosPage({ searchParams }: VideosPageProps) {
  // Require content management role (super_admin, ol_admin, or ol_content)
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_content']);

  const limit = 50;
  const offset = searchParams.offset ? parseInt(searchParams.offset, 10) : 0;

  // Fetch videos from database
  const { videos, total } = await listVideos({
    limit,
    offset,
    status: searchParams.status && searchParams.status !== 'all' ? searchParams.status : undefined,
    search: searchParams.search || undefined,
    orderBy: 'created_at',
    orderDirection: 'desc',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-decorative text-white text-glow-subtle">Videos</h1>
          <p className="text-muted-foreground">
            Manage video content for Ozean Licht platform ({total} videos)
          </p>
        </div>
      </div>

      {/* Data Table */}
      <Suspense fallback={<DataTableSkeleton columns={6} rows={10} />}>
        <VideosDataTable
          initialData={videos}
          total={total}
          limit={limit}
          offset={offset}
        />
      </Suspense>
    </div>
  );
}
