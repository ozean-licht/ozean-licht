/**
 * Storage Constants
 *
 * Bucket configuration and other constants for Ozean Cloud.
 * Separated from actions.ts because 'use server' files can only export async functions.
 */

import type { EntityScope } from '@/types/storage';

/**
 * Bucket configuration for Ozean Cloud
 */
export interface BucketInfo {
  name: string;
  displayName: string;
  description: string;
  entityScope: EntityScope;
}

/**
 * Available buckets in Ozean Cloud
 */
export const BUCKETS: BucketInfo[] = [
  {
    name: 'ozean-licht-assets',
    displayName: 'Ozean Licht Assets',
    description: 'Assets for Ozean Licht Akademie',
    entityScope: 'ozean_licht',
  },
  {
    name: 'shared-assets',
    displayName: 'Shared Assets',
    description: 'Shared files across platforms',
    entityScope: 'shared',
  },
];

/**
 * Default bucket name
 */
export const DEFAULT_BUCKET = 'ozean-licht-assets';
