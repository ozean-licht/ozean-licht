/**
 * Storage Constants
 *
 * Bucket configuration and other constants for Ozean Cloud.
 * Separated from actions.ts because 'use server' files can only export async functions.
 *
 * Bucket Strategy (v2):
 * - videos:  Raw footage, edits, exports (Cutters)
 * - content: Graphics, assets, general files (Content Team)
 * - docs:    PDFs, knowledge base, guides (All Team)
 * - founder: Contracts, finance, sensitive (Lia only)
 * - courses: Published course media (Public/CDN)
 */

import type { EntityScope } from '@/types/storage';

/**
 * Access level for bucket visibility
 */
export type BucketAccess = 'public' | 'team' | 'restricted' | 'founder';

/**
 * Bucket configuration for Ozean Cloud
 */
export interface BucketInfo {
  name: string;
  displayName: string;
  description: string;
  entityScope: EntityScope;
  icon: string;
  access: BucketAccess;
  /** Suggested folder structure for this bucket */
  suggestedFolders?: string[];
}

/**
 * Available buckets in Ozean Cloud
 *
 * Each bucket serves a specific purpose with clear access boundaries.
 */
export const BUCKETS: BucketInfo[] = [
  {
    name: 'ol-videos',
    displayName: 'Videos',
    description: 'Video production files for cutters and editors',
    entityScope: 'ozean_licht',
    icon: 'video',
    access: 'team',
    suggestedFolders: [
      '01_Raw_Footage/',
      '02_Projects/',
      '03_Exports/',
      '04_Archive/',
    ],
  },
  {
    name: 'ol-content',
    displayName: 'Content',
    description: 'Graphics, assets, and general content files',
    entityScope: 'ozean_licht',
    icon: 'image',
    access: 'team',
    suggestedFolders: [
      '01_Graphics/',
      '02_Social_Media/',
      '03_Marketing/',
      '04_Branding/',
      '05_Templates/',
    ],
  },
  {
    name: 'ol-docs',
    displayName: 'Docs',
    description: 'Knowledge base, guides, and PDF documents',
    entityScope: 'ozean_licht',
    icon: 'file-text',
    access: 'team',
    suggestedFolders: [
      '01_Guides/',
      '02_Processes/',
      '03_Research/',
      '04_Archive/',
    ],
  },
  {
    name: 'ol-founder',
    displayName: 'Founder',
    description: 'Contracts, finance, and confidential documents',
    entityScope: 'ozean_licht',
    icon: 'lock',
    access: 'founder',
    suggestedFolders: [
      '01_Contracts/',
      '02_Finance/',
      '03_Team/',
      '04_Legal/',
      '05_Strategy/',
    ],
  },
  {
    name: 'ol-courses',
    displayName: 'Courses',
    description: 'Published course media and learning materials',
    entityScope: 'ozean_licht',
    icon: 'graduation-cap',
    access: 'public',
    suggestedFolders: [
      '01_Published/',
      '02_Drafts/',
      '03_Assets/',
    ],
  },
];

/**
 * Default bucket name
 */
export const DEFAULT_BUCKET = 'ol-content';

/**
 * Legacy bucket (for migration reference)
 */
export const LEGACY_BUCKET = 'ol-cloud';
