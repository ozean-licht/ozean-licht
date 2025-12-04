/**
 * Edit Video Page
 *
 * Server component that fetches video data and passes to client component for editing.
 * Requires content management role.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireAnyRole } from '@/lib/rbac/utils';
import { getVideoById } from '@/lib/db/videos';
import EditVideoClient from './EditVideoClient';

export const metadata: Metadata = {
  title: 'Edit Video | Admin Dashboard',
  description: 'Edit video details for Ozean Licht platform',
};

interface EditVideoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVideoPage({ params }: EditVideoPageProps) {
  // Require content management role
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_content']);

  // Await params to get video ID
  const { id } = await params;

  // Fetch video from database
  const video = await getVideoById(id);

  // Return 404 if video not found
  if (!video) {
    notFound();
  }

  return <EditVideoClient video={video} />;
}
