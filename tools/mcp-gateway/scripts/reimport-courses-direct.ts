#!/usr/bin/env npx ts-node
/**
 * Direct Airtable Courses Reimport Script
 *
 * Reimports courses from Airtable to PostgreSQL using direct connections
 * (no MCP Gateway required)
 *
 * Usage:
 *   npx ts-node scripts/reimport-courses-direct.ts
 */

import axios from 'axios';
import { Pool } from 'pg';

// Configuration from environment
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const DATABASE_URL = process.env.OZEAN_LICHT_DB_URL;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !DATABASE_URL) {
  console.error('Missing required environment variables:');
  console.error('  AIRTABLE_API_KEY:', AIRTABLE_API_KEY ? 'set' : 'MISSING');
  console.error('  AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID ? 'set' : 'MISSING');
  console.error('  OZEAN_LICHT_DB_URL:', DATABASE_URL ? 'set' : 'MISSING');
  process.exit(1);
}

// Initialize PostgreSQL pool
const pool = new Pool({ connectionString: DATABASE_URL });

// Airtable API client
const airtable = axios.create({
  baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`,
  headers: {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
}

interface CourseData {
  airtable_id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  thumbnail_url: string | null;
  cover_image_url: string | null;
  price_cents: number;
  currency: string;
  status: string;
  level: string | null;
  category: string | null;
  duration_minutes: number | null;
  entity_scope: string;
}

/**
 * Extract URL from Airtable attachment field
 */
function getAttachmentUrl(attachments: any): string | null {
  if (!attachments) return null;
  if (Array.isArray(attachments) && attachments.length > 0) {
    return attachments[0]?.url || null;
  }
  if (typeof attachments === 'object' && attachments.url) {
    return attachments.url;
  }
  return null;
}

/**
 * Generate slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[char] || char))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Fetch all courses from Airtable
 */
async function fetchAirtableCourses(): Promise<AirtableRecord[]> {
  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const params: any = { pageSize: 100 };
    if (offset) params.offset = offset;

    const response = await airtable.get('/Courses', { params });
    allRecords.push(...response.data.records);
    offset = response.data.offset;

    console.log(`  Fetched ${allRecords.length} records...`);
  } while (offset);

  return allRecords;
}

/**
 * Transform Airtable record to course data
 */
function transformRecord(record: AirtableRecord): CourseData {
  const fields = record.fields;

  return {
    airtable_id: record.id,
    title: fields.title || fields.Title || 'Untitled',
    slug: fields.slug || fields.Slug || generateSlug(fields.title || fields.Title || 'untitled'),
    description: fields.description || fields.Description || null,
    short_description: fields.short_description || fields['Short Description'] || null,
    thumbnail_url: getAttachmentUrl(fields.thumbnail || fields.Thumbnail),
    cover_image_url: getAttachmentUrl(fields.cover_image || fields['Cover Image']),
    price_cents: Math.round((fields.price || fields.Price || 0) * 100),
    currency: 'EUR',
    status: (fields.is_public || fields['Is Public']) ? 'published' : 'draft',
    level: (fields.level || fields.Level || '').toLowerCase() || null,
    category: Array.isArray(fields.tags || fields.Tags) ? (fields.tags || fields.Tags)[0] : null,
    duration_minutes: fields.duration || fields.Duration || null,
    entity_scope: 'ozean_licht',
  };
}

/**
 * Upsert a course to PostgreSQL
 */
async function upsertCourse(course: CourseData): Promise<'inserted' | 'updated'> {
  const sql = `
    INSERT INTO courses (
      airtable_id, title, slug, description, short_description,
      thumbnail_url, cover_image_url, price_cents, currency,
      status, level, category, duration_minutes, entity_scope
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    ON CONFLICT (airtable_id) DO UPDATE SET
      title = EXCLUDED.title,
      slug = EXCLUDED.slug,
      description = EXCLUDED.description,
      short_description = EXCLUDED.short_description,
      thumbnail_url = EXCLUDED.thumbnail_url,
      cover_image_url = EXCLUDED.cover_image_url,
      price_cents = EXCLUDED.price_cents,
      status = EXCLUDED.status,
      level = EXCLUDED.level,
      category = EXCLUDED.category,
      duration_minutes = EXCLUDED.duration_minutes,
      updated_at = NOW()
    RETURNING id, airtable_id,
      CASE WHEN xmax = 0 THEN 'inserted' ELSE 'updated' END as operation
  `;

  const result = await pool.query(sql, [
    course.airtable_id,
    course.title,
    course.slug,
    course.description,
    course.short_description,
    course.thumbnail_url,
    course.cover_image_url,
    course.price_cents,
    course.currency,
    course.status,
    course.level,
    course.category,
    course.duration_minutes,
    course.entity_scope,
  ]);

  return result.rows[0]?.operation || 'updated';
}

/**
 * Main migration function
 */
async function main() {
  console.log('============================================================');
  console.log('  Airtable Courses Reimport (Direct)');
  console.log('============================================================\n');

  let inserted = 0;
  let updated = 0;
  let failed = 0;

  try {
    // Test database connection
    console.log('[1/3] Testing database connection...');
    await pool.query('SELECT 1');
    console.log('  ✓ Database connected\n');

    // Fetch courses from Airtable
    console.log('[2/3] Fetching courses from Airtable...');
    const records = await fetchAirtableCourses();
    console.log(`  ✓ Found ${records.length} courses\n`);

    // Upsert each course
    console.log('[3/3] Upserting courses to PostgreSQL...');
    for (const record of records) {
      try {
        const course = transformRecord(record);
        const operation = await upsertCourse(course);

        if (operation === 'inserted') {
          inserted++;
          console.log(`  + Inserted: ${course.title}`);
        } else {
          updated++;
          console.log(`  ~ Updated: ${course.title}`);
        }
      } catch (error: any) {
        failed++;
        console.error(`  ✗ Failed: ${record.fields.title || record.id} - ${error.message}`);
      }
    }

    console.log('\n============================================================');
    console.log('  Results');
    console.log('============================================================');
    console.log(`  Total:    ${records.length}`);
    console.log(`  Inserted: ${inserted}`);
    console.log(`  Updated:  ${updated}`);
    console.log(`  Failed:   ${failed}`);
    console.log('============================================================\n');

  } catch (error: any) {
    console.error('\nMigration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
