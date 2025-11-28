#!/usr/bin/env npx ts-node
/**
 * Airtable Videos Migration Script
 *
 * Migrates video data from Airtable to PostgreSQL (ozean-licht-db).
 *
 * Usage:
 *   npx tsx migrate-videos.ts [options]
 *
 * Options:
 *   --dry-run      Preview changes without writing to database
 *   --limit N      Limit number of records to migrate (default: all)
 *   --table NAME   Airtable table name (default: 'videos')
 *   --verbose      Show detailed logging
 *
 * Environment Variables Required:
 *   AIRTABLE_API_KEY   - Airtable Personal Access Token
 *   AIRTABLE_BASE_ID   - Airtable Base ID
 *   POSTGRES_SHARED_*  - PostgreSQL connection settings
 */

import axios, { AxiosInstance } from 'axios';
import { Pool } from 'pg';

// ============================================================================
// Configuration
// ============================================================================

interface MigrationConfig {
  airtableApiKey: string;
  airtableBaseId: string;
  tableName: string;
  dryRun: boolean;
  limit: number | null;
  verbose: boolean;
}

function parseArgs(): Partial<MigrationConfig> {
  const args = process.argv.slice(2);
  const config: Partial<MigrationConfig> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--dry-run':
        config.dryRun = true;
        break;
      case '--verbose':
        config.verbose = true;
        break;
      case '--limit':
        config.limit = parseInt(args[++i], 10);
        break;
      case '--table':
        config.tableName = args[++i];
        break;
    }
  }

  return config;
}

function loadConfig(): MigrationConfig {
  const args = parseArgs();

  const config: MigrationConfig = {
    airtableApiKey: process.env.AIRTABLE_API_KEY || '',
    airtableBaseId: process.env.AIRTABLE_BASE_ID || '',
    tableName: args.tableName || 'videos',
    dryRun: args.dryRun || false,
    limit: args.limit || null,
    verbose: args.verbose || false,
  };

  if (!config.airtableApiKey) {
    throw new Error('AIRTABLE_API_KEY environment variable is required');
  }
  if (!config.airtableBaseId) {
    throw new Error('AIRTABLE_BASE_ID environment variable is required');
  }

  return config;
}

// ============================================================================
// Types
// ============================================================================

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}

interface VideoRecord {
  airtable_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  status: 'draft' | 'published' | 'archived';
  entity_scope: 'ozean_licht' | 'kids_ascension' | null;
  metadata: Record<string, any>;
}

interface MigrationResult {
  totalRecords: number;
  successCount: number;
  failureCount: number;
  skippedCount: number;
  errors: Array<{ airtableId: string; error: string }>;
  duration: number;
}

// ============================================================================
// Airtable Client
// ============================================================================

class AirtableClient {
  private client: AxiosInstance;

  constructor(private apiKey: string, private baseId: string) {
    this.client = axios.create({
      baseURL: 'https://api.airtable.com/v0',
      timeout: 30000,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getAllRecords(tableName: string, limit?: number | null): Promise<AirtableRecord[]> {
    const allRecords: AirtableRecord[] = [];
    let offset: string | undefined;

    do {
      const params: Record<string, any> = {
        maxRecords: limit ? Math.min(100, limit - allRecords.length) : 100,
      };
      if (offset) params.offset = offset;

      const response = await this.client.get<AirtableListResponse>(
        `/${this.baseId}/${encodeURIComponent(tableName)}`,
        { params }
      );

      allRecords.push(...response.data.records);
      offset = response.data.offset;

      // Respect rate limits
      await this.sleep(200);

      if (limit && allRecords.length >= limit) {
        break;
      }
    } while (offset);

    return allRecords;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// PostgreSQL Client (ozean-licht-db)
// ============================================================================

class PostgresClient {
  private pool: Pool;

  constructor() {
    // Direct PostgreSQL connection to ozean-licht-db
    this.pool = new Pool({
      host: process.env.POSTGRES_SHARED_HOST || 'iccc0wo0wkgsws4cowk4440c',
      port: parseInt(process.env.POSTGRES_SHARED_PORT || '5432'),
      user: process.env.POSTGRES_SHARED_USER || 'postgres',
      password: process.env.POSTGRES_SHARED_PASSWORD || '',
      database: 'ozean-licht-db',
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this.pool.query(sql, params);
    return result.rows;
  }

  async execute(sql: string, params?: any[]): Promise<number> {
    const result = await this.pool.query(sql, params);
    return result.rowCount || 0;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// ============================================================================
// Data Transformation
// ============================================================================

/**
 * Parse duration string to seconds
 * Formats: "01:21:01" (HH:MM:SS), "21:01" (MM:SS), "121" (seconds)
 */
function parseDuration(duration: any): number | null {
  if (!duration) return null;

  const str = String(duration).trim();

  // Already seconds
  if (/^\d+$/.test(str)) {
    return parseInt(str, 10);
  }

  // HH:MM:SS or MM:SS format
  const parts = str.split(':').map(p => parseInt(p, 10));
  if (parts.some(isNaN)) return null;

  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  }

  return null;
}

/**
 * Map Airtable status/is_public to PostgreSQL status
 */
function mapStatus(fields: Record<string, any>): 'draft' | 'published' | 'archived' {
  const isPublic = fields['is_public'];
  const status = fields['status'];

  // Check is_public first
  if (isPublic === 'true' || isPublic === true) {
    return 'published';
  }

  // Then check status field
  if (status) {
    const lower = String(status).toLowerCase();
    if (lower === 'published' || lower === 'live' || lower === 'active') {
      return 'published';
    }
    if (lower === 'archived' || lower === 'hidden' || lower === 'inactive') {
      return 'archived';
    }
  }

  return 'draft';
}

/**
 * Determine entity scope from Airtable data
 */
function determineEntityScope(fields: Record<string, any>): 'ozean_licht' | 'kids_ascension' | null {
  const entityFields = ['Entity', 'Platform', 'Project', 'Brand', 'Scope', 'category'];

  for (const fieldName of entityFields) {
    const value = fields[fieldName];
    if (value) {
      const lower = String(value).toLowerCase();
      if (lower.includes('kids') || lower.includes('ascension') || lower.includes('ka')) {
        return 'kids_ascension';
      }
      if (lower.includes('ozean') || lower.includes('licht') || lower.includes('ol')) {
        return 'ozean_licht';
      }
    }
  }

  // Default to ozean_licht
  return 'ozean_licht';
}

/**
 * Transform Airtable record to PostgreSQL video record
 */
function transformVideo(record: AirtableRecord): VideoRecord {
  const fields = record.fields;

  const title = fields['title'] || fields['Title'] || 'Untitled Video';

  // Use subtitle or transcription for description
  const description =
    fields['subtitle'] ||
    fields['description'] ||
    fields['transcription']?.substring(0, 1000) || // Limit transcription length
    null;

  const videoUrl = fields['video_url'] || fields['Video URL'] || null;

  // Extract thumbnail URL from attachment
  const thumbnailUrl =
    fields['thumbnail']?.[0]?.url ||
    fields['Thumbnail']?.[0]?.url ||
    null;

  const durationSeconds = parseDuration(fields['duration']);

  const status = mapStatus(fields);
  const entityScope = determineEntityScope(fields);

  // Collect extra fields as metadata
  const metadata: Record<string, any> = {
    airtable_created_time: record.createdTime,
    video_id: fields['video_id'],
    type: fields['type'],
    slug: fields['slug'],
    published_at: fields['published_at'],
    category: fields['category'],
    tags: fields['tags'],
    display_in_videothek: fields['display_in_videothek'],
    kern_impuls: fields['kern-impuls'],
    highlights: fields['highlights'],
    transcription: fields['transcription'],
    linked_course: fields['linked_course'],
    linked_project: fields['linked_project'],
    linked_shorts: fields['linked_shorts'],
    created_by_airtable: fields['created_by'],
    updated_by_airtable: fields['updated_by'],
  };

  // Remove undefined values from metadata
  Object.keys(metadata).forEach(key => {
    if (metadata[key] === undefined) {
      delete metadata[key];
    }
  });

  return {
    airtable_id: record.id,
    title,
    description,
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl,
    duration_seconds: durationSeconds,
    status,
    entity_scope: entityScope,
    metadata,
  };
}

// ============================================================================
// Migration Logic
// ============================================================================

class VideosMigration {
  private airtable: AirtableClient;
  private postgres: PostgresClient;
  private config: MigrationConfig;

  constructor(config: MigrationConfig) {
    this.config = config;
    this.airtable = new AirtableClient(config.airtableApiKey, config.airtableBaseId);
    this.postgres = new PostgresClient();
  }

  private log(message: string, ...args: any[]): void {
    console.log(`[${new Date().toISOString()}] ${message}`, ...args);
  }

  private verbose(message: string, ...args: any[]): void {
    if (this.config.verbose) {
      console.log(`[${new Date().toISOString()}] [VERBOSE] ${message}`, ...args);
    }
  }

  async checkPrerequisites(): Promise<void> {
    this.log('Checking prerequisites...');

    const healthy = await this.postgres.healthCheck();
    if (!healthy) {
      throw new Error('PostgreSQL not available');
    }
    this.log('PostgreSQL connection is healthy');

    // Check if videos table exists
    try {
      await this.postgres.query('SELECT 1 FROM videos LIMIT 1');
      this.log('Videos table exists');
    } catch (error) {
      throw new Error(
        'Videos table does not exist. Run migration 010_create_content_tables.sql first.'
      );
    }
  }

  async getExistingAirtableIds(): Promise<Set<string>> {
    const rows = await this.postgres.query<{ airtable_id: string }>(
      'SELECT airtable_id FROM videos WHERE airtable_id IS NOT NULL'
    );
    return new Set(rows.map((r) => r.airtable_id));
  }

  async insertVideo(video: VideoRecord): Promise<void> {
    const sql = `
      INSERT INTO videos (
        airtable_id, title, description, video_url, thumbnail_url,
        duration_seconds, status, entity_scope, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (airtable_id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        video_url = EXCLUDED.video_url,
        thumbnail_url = EXCLUDED.thumbnail_url,
        duration_seconds = EXCLUDED.duration_seconds,
        status = EXCLUDED.status,
        entity_scope = EXCLUDED.entity_scope,
        metadata = EXCLUDED.metadata,
        updated_at = NOW()
    `;

    await this.postgres.execute(sql, [
      video.airtable_id,
      video.title,
      video.description,
      video.video_url,
      video.thumbnail_url,
      video.duration_seconds,
      video.status,
      video.entity_scope,
      JSON.stringify(video.metadata),
    ]);
  }

  async cleanup(): Promise<void> {
    await this.postgres.close();
  }

  async run(): Promise<MigrationResult> {
    const startTime = Date.now();
    const result: MigrationResult = {
      totalRecords: 0,
      successCount: 0,
      failureCount: 0,
      skippedCount: 0,
      errors: [],
      duration: 0,
    };

    try {
      await this.checkPrerequisites();

      this.log(`Fetching records from Airtable table: ${this.config.tableName}`);
      const records = await this.airtable.getAllRecords(
        this.config.tableName,
        this.config.limit
      );
      result.totalRecords = records.length;
      this.log(`Found ${records.length} records in Airtable`);

      if (records.length === 0) {
        this.log('No records to migrate');
        result.duration = Date.now() - startTime;
        return result;
      }

      const existingIds = await this.getExistingAirtableIds();
      this.log(`Found ${existingIds.size} existing records in PostgreSQL`);

      for (const record of records) {
        try {
          this.verbose(`Processing record: ${record.id}`);

          const video = transformVideo(record);
          this.verbose(`Transformed video: ${video.title}`);

          if (this.config.dryRun) {
            this.log(`[DRY RUN] Would insert/update video: ${video.title}`);
            this.verbose('Video data:', JSON.stringify(video, null, 2));
            result.successCount++;
          } else {
            await this.insertVideo(video);

            if (existingIds.has(record.id)) {
              this.verbose(`Updated existing video: ${video.title}`);
            } else {
              this.verbose(`Inserted new video: ${video.title}`);
            }
            result.successCount++;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.log(`Error processing record ${record.id}: ${errorMessage}`);
          result.errors.push({
            airtableId: record.id,
            error: errorMessage,
          });
          result.failureCount++;
        }
      }

      result.duration = Date.now() - startTime;
      return result;
    } catch (error) {
      result.duration = Date.now() - startTime;
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function main(): Promise<void> {
  console.log('');
  console.log('='.repeat(60));
  console.log('  Airtable Videos Migration Script');
  console.log('='.repeat(60));
  console.log('');

  try {
    const config = loadConfig();

    console.log('Configuration:');
    console.log(`  - Table: ${config.tableName}`);
    console.log(`  - Dry Run: ${config.dryRun}`);
    console.log(`  - Limit: ${config.limit || 'none'}`);
    console.log(`  - Verbose: ${config.verbose}`);
    console.log('');

    const migration = new VideosMigration(config);
    const result = await migration.run();

    console.log('');
    console.log('='.repeat(60));
    console.log('  Migration Results');
    console.log('='.repeat(60));
    console.log(`  Total Records: ${result.totalRecords}`);
    console.log(`  Successful: ${result.successCount}`);
    console.log(`  Failed: ${result.failureCount}`);
    console.log(`  Skipped: ${result.skippedCount}`);
    console.log(`  Duration: ${(result.duration / 1000).toFixed(2)}s`);
    console.log('');

    if (result.errors.length > 0) {
      console.log('Errors:');
      for (const error of result.errors) {
        console.log(`  - ${error.airtableId}: ${error.error}`);
      }
      console.log('');
    }

    if (config.dryRun) {
      console.log('NOTE: This was a dry run. No data was written to the database.');
      console.log('Run without --dry-run to actually migrate the data.');
      console.log('');
    }

    if (result.failureCount > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('');
    console.error('Migration failed:', error instanceof Error ? error.message : error);
    console.error('');
    process.exit(1);
  }
}

main();
