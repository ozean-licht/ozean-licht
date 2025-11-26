/**
 * Ozean Cloud Layout
 *
 * Layout wrapper for the cloud storage section.
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ozean Cloud | Admin Dashboard',
  description: 'Cloud storage management for Ozean Licht ecosystem',
};

export default function CloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
