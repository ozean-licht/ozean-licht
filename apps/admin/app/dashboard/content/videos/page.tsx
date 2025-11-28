/**
 * Videos List Page
 *
 * Manage videos for Ozean Licht platform.
 * Server component that fetches data and passes to client data table.
 */

import { Metadata } from 'next';
import { requireAnyRole } from '@/lib/rbac/utils';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/admin/data-table-skeleton';
import { VideosDataTable } from './VideosDataTable';
import { Video } from '@/types/content';

export const metadata: Metadata = {
  title: 'Videos | Admin Dashboard',
  description: 'Manage videos for Ozean Licht platform',
};

// Mock videos data for initial implementation
const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Introduction to Meditation',
    description: 'A beginner guide to meditation practices and techniques for inner peace',
    videoUrl: 'https://example.com/video1.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/meditation-intro.jpg',
    durationSeconds: 1800,
    status: 'published',
    entityScope: 'ozean_licht',
    createdBy: 'lia@ozean-licht.com',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-26T00:00:00Z',
  },
  {
    id: '2',
    title: 'Advanced Breathwork Techniques',
    description: 'Explore advanced breathing exercises for spiritual awakening and energy work',
    videoUrl: 'https://example.com/video2.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/breathwork.jpg',
    durationSeconds: 2400,
    status: 'published',
    entityScope: 'ozean_licht',
    createdBy: 'lia@ozean-licht.com',
    createdAt: '2025-11-05T00:00:00Z',
    updatedAt: '2025-11-25T00:00:00Z',
  },
  {
    id: '3',
    title: 'Chakra Healing Series - Part 1',
    description: 'Understanding the root chakra and grounding techniques',
    videoUrl: 'https://example.com/video3.mp4',
    thumbnailUrl: undefined,
    durationSeconds: 3600,
    status: 'draft',
    entityScope: 'ozean_licht',
    createdBy: 'sergej@ozean-licht.com',
    createdAt: '2025-11-10T00:00:00Z',
    updatedAt: '2025-11-27T00:00:00Z',
  },
  {
    id: '4',
    title: 'Crystal Energy and Healing',
    description: 'Learn how to work with crystals for healing and spiritual growth',
    videoUrl: 'https://example.com/video4.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/crystals.jpg',
    durationSeconds: 2700,
    status: 'published',
    entityScope: 'ozean_licht',
    createdBy: 'maria@ozean-licht.com',
    createdAt: '2025-11-12T00:00:00Z',
    updatedAt: '2025-11-26T00:00:00Z',
  },
  {
    id: '5',
    title: 'Sound Healing Workshop',
    description: 'Experience the transformative power of sound frequencies and vibrations',
    videoUrl: 'https://example.com/video5.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/sound-healing.jpg',
    durationSeconds: 4200,
    status: 'archived',
    entityScope: 'ozean_licht',
    createdBy: 'kristin@ozean-licht.com',
    createdAt: '2025-10-15T00:00:00Z',
    updatedAt: '2025-11-20T00:00:00Z',
  },
];

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

  // Use mock data for now, will integrate with MCP Gateway later
  // Apply basic filters to mock data
  let filteredVideos = [...MOCK_VIDEOS];

  // Search filter
  if (searchParams.search) {
    const search = searchParams.search.toLowerCase();
    filteredVideos = filteredVideos.filter(
      (v) =>
        v.title.toLowerCase().includes(search) ||
        v.description?.toLowerCase().includes(search)
    );
  }

  // Status filter
  if (searchParams.status && searchParams.status !== 'all') {
    filteredVideos = filteredVideos.filter((v) => v.status === searchParams.status);
  }

  const videos = filteredVideos;
  const total = filteredVideos.length;
  const limit = 50;
  const offset = searchParams.offset ? parseInt(searchParams.offset, 10) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
          <p className="text-muted-foreground">
            Manage video content for Ozean Licht platform
          </p>
        </div>
        {/* Add New Video button here - will be implemented with VideosDataTable */}
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
