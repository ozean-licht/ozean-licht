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
    name: 'ol-cloud',
    displayName: 'Ozean Cloud',
    description: 'Cloud storage for all Ozean Licht content',
    entityScope: 'shared',
  },
];

/**
 * Default bucket name
 */
export const DEFAULT_BUCKET = 'ol-cloud';
