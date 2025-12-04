/**
 * New Video Page
 *
 * Page for creating a new video in the Video Management System.
 * Server component with client wrapper for form handling.
 */

import { Metadata } from 'next';
import { requireAnyRole } from '@/lib/rbac/utils';
import NewVideoClient from './NewVideoClient';

export const metadata: Metadata = {
  title: 'Create Video | Admin Dashboard',
  description: 'Create a new video for the platform',
};

export default async function NewVideoPage() {
  // Require content management role (super_admin, ol_admin, or ol_content)
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_content']);

  return <NewVideoClient />;
}
