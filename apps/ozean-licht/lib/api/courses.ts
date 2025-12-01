/**
 * Course API - Data layer for course operations
 *
 * Uses mock data in development, MCP Gateway in production.
 * All Supabase references have been removed.
 */

import { mockCourses } from '../mock-data/courses';

// MCP Gateway URL for database operations
const MCP_GATEWAY_URL = process.env.MCP_GATEWAY_URL || 'http://localhost:8100';

// MinIO S3 public URL for assets
const MINIO_PUBLIC_URL = process.env.MINIO_PUBLIC_URL || 'https://s3.ozean-licht.dev';

/**
 * Query the database via MCP Gateway
 */
async function queryDatabase(sql: string, params: unknown[] = []): Promise<any[]> {
  // In development/demo mode, return empty to use mock data
  if (process.env.NODE_ENV === 'development' || process.env.USE_MOCK_DATA === 'true') {
    return [];
  }

  try {
    const response = await fetch(`${MCP_GATEWAY_URL}/mcp/postgres/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        database: process.env.DATABASE_NAME || 'ozean_licht_db',
        query: sql,
        params,
      }),
    });

    if (!response.ok) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[Courses] MCP Gateway error: ${response.status}`);
      }
      return [];
    }

    const result = await response.json();
    return result.rows || [];
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Courses] Database query failed:', error);
    }
    return [];
  }
}

/**
 * Get all public courses
 */
export async function getCourses(limit: number = 50): Promise<any[]> {
  // Try database first
  const dbCourses = await queryDatabase(
    `SELECT id, slug, title, subtitle, description, price, is_public,
            thumbnail_url_desktop, thumbnail_url_mobile, course_code, tags,
            created_at, updated_at
     FROM courses
     WHERE is_public = true
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );

  if (dbCourses.length > 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Courses] Loaded ${dbCourses.length} courses from database`);
    }
    return dbCourses;
  }

  // Fallback to mock data
  const courses = mockCourses
    .filter(c => c.is_public)
    .slice(0, limit);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Courses] Loaded ${courses.length} courses from mock data`);
  }
  return courses;
}

/**
 * Get a single course by slug
 */
export async function getCourseBySlug(slug: string): Promise<any | null> {
  // Try database first
  const dbCourses = await queryDatabase(
    `SELECT id, slug, title, subtitle, description, price, is_public,
            thumbnail_url_desktop, thumbnail_url_mobile, course_code, tags,
            created_at, updated_at
     FROM courses
     WHERE slug = $1 AND is_public = true`,
    [slug]
  );

  if (dbCourses.length > 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Courses] Loaded course "${dbCourses[0].title}" from database`);
    }
    return dbCourses[0];
  }

  // Fallback to mock data
  const course = mockCourses.find(c => c.slug === slug && c.is_public);

  if (process.env.NODE_ENV !== 'production') {
    if (course) {
      console.log(`[Courses] Loaded course "${course.title}" from mock data`);
    } else {
      console.log(`[Courses] Course not found: ${slug}`);
    }
  }

  return course || null;
}

/**
 * Get courses for partner deals (high-value courses)
 */
export async function getPartnerCourses(): Promise<any[]> {
  const dbCourses = await queryDatabase(
    `SELECT id, slug, title, subtitle, description, price, is_public,
            thumbnail_url_desktop, course_code, tags
     FROM courses
     WHERE is_public = true AND price >= 100
     ORDER BY price DESC`,
    []
  );

  if (dbCourses.length > 0) {
    return dbCourses;
  }

  // Fallback to mock data
  return mockCourses.filter(c => c.is_public && (c.price || 0) >= 100);
}

/**
 * Create a fallback image URL for courses without thumbnails
 */
export function createFallbackImageUrl(title: string): string {
  const shortTitle = title.substring(0, 25);
  const svg = `<svg width="600" height="337" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="337" fill="#001212"/>
    <rect x="20" y="20" width="560" height="297" fill="#00D4FF" rx="12"/>
    <text x="300" y="168" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="20" font-weight="bold" dy=".3em">${shortTitle}...</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Transform asset URL to MinIO URL
 * Replaces legacy Supabase S3 URLs with MinIO
 */
export function transformAssetUrl(url: string | undefined): string | undefined {
  if (!url) return url;

  // Replace Supabase storage URLs with MinIO
  if (url.includes('supabase.co/storage')) {
    // Extract the path after /object/public/
    const match = url.match(/\/object\/public\/(.+)$/);
    if (match) {
      return `${MINIO_PUBLIC_URL}/${match[1]}`;
    }
  }

  return url;
}

// Legacy exports for compatibility
export const getCoursesFromEdge = getCourses;
export const getCourseFromEdge = getCourseBySlug;
export const getCoursesFromAirtable = getCourses;
export const getCoursesWithReliableImages = getCourses;
export const getCourseWithReliableImages = getCourseBySlug;
export const getCoursesForPartnerDeal = getPartnerCourses;
