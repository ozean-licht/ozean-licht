/**
 * Batch Video Operations API Route
 *
 * POST /api/videos/batch - Perform bulk updates on multiple videos
 *
 * Supported actions:
 * - archive: Set status to 'archived'
 * - visibility: Change visibility setting
 * - pipelineStage: Update pipeline stage
 * - migrationStatus: Update migration status
 * - addTags: Add tags (merged with existing)
 * - courseAssign: Assign/unassign to course/module
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/auth-utils';
import { bulkUpdateVideos, getVideosByIds } from '@/lib/db/videos';
import { validateModuleBelongsToCourse } from '@/lib/db/modules';
import { transaction } from '@/lib/db';
import { z, ZodError } from 'zod';
import {
  videoVisibilitySchema,
  videoPipelineStageSchema,
  videoMigrationStatusSchema,
} from '@/lib/validations/video';

// ================================================================
// Validation Schemas
// ================================================================

/**
 * Tag sanitization helper
 * - Trims whitespace
 * - Converts to lowercase for consistency
 * - Limits length
 */
const sanitizeTag = (tag: string): string => {
  return tag.trim().toLowerCase().slice(0, 50);
};

/**
 * Batch action type schemas
 */
const archiveActionSchema = z.object({
  type: z.literal('archive'),
});

const visibilityActionSchema = z.object({
  type: z.literal('visibility'),
  value: videoVisibilitySchema,
});

const pipelineStageActionSchema = z.object({
  type: z.literal('pipelineStage'),
  value: videoPipelineStageSchema,
});

const migrationStatusActionSchema = z.object({
  type: z.literal('migrationStatus'),
  value: videoMigrationStatusSchema,
});

const addTagsActionSchema = z.object({
  type: z.literal('addTags'),
  tags: z
    .array(
      z
        .string()
        .min(1, 'Tag cannot be empty')
        .max(50, 'Tag must be 50 characters or less')
    )
    .min(1, 'At least one tag is required')
    .max(20, 'Cannot add more than 20 tags at once')
    .transform((tags) => tags.map(sanitizeTag)),
});

const courseAssignActionSchema = z.object({
  type: z.literal('courseAssign'),
  courseId: z.string().uuid('Invalid course ID').nullable(),
  moduleId: z.string().uuid('Invalid module ID').nullable().optional(),
});

/**
 * Discriminated union of all batch action types
 */
const batchActionSchema = z.discriminatedUnion('type', [
  archiveActionSchema,
  visibilityActionSchema,
  pipelineStageActionSchema,
  migrationStatusActionSchema,
  addTagsActionSchema,
  courseAssignActionSchema,
]);

/**
 * Complete batch request schema
 */
const batchUpdateRequestSchema = z.object({
  ids: z
    .array(z.string().uuid('Invalid video ID'))
    .min(1, 'At least one video ID is required')
    .max(100, 'Cannot update more than 100 videos at once'),
  action: batchActionSchema,
});

// ================================================================
// Type Inference
// ================================================================

type BatchUpdateRequest = z.infer<typeof batchUpdateRequestSchema>;
// BatchAction type is inferred internally during validation

// ================================================================
// POST Handler
// ================================================================

/**
 * POST /api/videos/batch
 * Perform bulk operations on multiple videos
 */
export async function POST(request: NextRequest) {
  // ===============================================================
  // 1. Authentication & Authorization
  // ===============================================================
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Permission check - requires content.write for all batch operations
  if (!hasPermission(session, 'content.write')) {
    return NextResponse.json(
      { error: 'Forbidden: content.write permission required' },
      { status: 403 }
    );
  }

  // ===============================================================
  // 2. Request Validation
  // ===============================================================
  let body: BatchUpdateRequest;
  try {
    const rawBody = await request.json();
    body = batchUpdateRequestSchema.parse(rawBody);
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Error parsing batch request:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const { ids, action } = body;

  // ===============================================================
  // 3. Process Action & Build Update Object
  // ===============================================================
  try {
    // Wrap all batch operations in a transaction for atomicity
    const updatedCount = await transaction(async (client) => {
      let count: number;

      switch (action.type) {
        case 'archive': {
          // Set status to 'archived'
          count = await bulkUpdateVideos(ids, { status: 'archived' }, client);
          break;
        }

        case 'visibility': {
          // Update visibility setting
          count = await bulkUpdateVideos(ids, { visibility: action.value }, client);
          break;
        }

        case 'pipelineStage': {
          // Update pipeline stage
          count = await bulkUpdateVideos(ids, { pipelineStage: action.value }, client);
          break;
        }

        case 'migrationStatus': {
          // Update migration status
          count = await bulkUpdateVideos(ids, { migrationStatus: action.value }, client);
          break;
        }

        case 'addTags': {
          // Add tags (merge with existing tags)
          // Need to fetch existing videos to merge tags
          const newTags = action.tags;

          // Fetch all videos in a single query (fixes N+1 query issue)
          const videos = await getVideosByIds(ids);

          // Build tag merging updates for each video
          // Use a Map to batch by unique tag sets (optimization)
          const tagUpdateMap = new Map<string, string[]>();

          for (const video of videos) {
            // Merge existing tags with new tags (deduplicate)
            const existingTags = video.tags || [];
            const mergedTags = Array.from(new Set([...existingTags, ...newTags]));

            // Create unique key for this tag set
            const tagKey = mergedTags.sort().join(',');
            if (!tagUpdateMap.has(tagKey)) {
              tagUpdateMap.set(tagKey, []);
            }
            tagUpdateMap.get(tagKey)!.push(video.id);
          }

          // Handle videos that were not found
          const foundIds = new Set(videos.map(v => v.id));
          const notFoundIds = ids.filter(id => !foundIds.has(id));
          if (notFoundIds.length > 0) {
            console.warn(`Videos not found, skipping tag merge: ${notFoundIds.join(', ')}`);
          }

          // Execute batch updates per unique tag set (all within same transaction)
          let totalUpdated = 0;
          for (const [tagKey, videoIds] of tagUpdateMap.entries()) {
            const tags = tagKey.split(',');
            const updateCount = await bulkUpdateVideos(videoIds, { tags }, client);
            totalUpdated += updateCount;
          }

          count = totalUpdated;
          break;
        }

        case 'courseAssign': {
          // Validate that moduleId belongs to courseId (if both provided)
          if (action.courseId && action.moduleId) {
            const isValid = await validateModuleBelongsToCourse(action.moduleId, action.courseId);
            if (!isValid) {
              throw new Error(`Module ${action.moduleId} does not belong to course ${action.courseId}`);
            }
          }

          // Assign to course/module (or unassign with null)
          count = await bulkUpdateVideos(ids, {
            courseId: action.courseId,
            moduleId: action.moduleId ?? undefined,
          }, client);
          break;
        }

        default: {
          // TypeScript exhaustiveness check - should never reach here
          throw new Error('Unknown action type');
        }
      }

      return count;
    });

    // ===============================================================
    // 4. Return Success Response
    // ===============================================================
    return NextResponse.json({
      success: true,
      updatedCount,
      action: action.type,
    });
  } catch (error) {
    console.error('Error performing batch update:', error);
    return NextResponse.json(
      { error: 'Failed to perform batch update' },
      { status: 500 }
    );
  }
}
