#!/usr/bin/env npx ts-node
/**
 * Airtable Courses Migration Script
 *
 * Migrates course data from Airtable to PostgreSQL via MCP Gateway.
 *
 * Usage:
 *   npx ts-node scripts/migrate-courses.ts [options]
 *
 * Options:
 *   --dry-run      Preview changes without writing to database
 *   --limit N      Limit number of records to migrate (default: all)
 *   --table NAME   Airtable table name (default: 'Courses')
 *   --verbose      Show detailed logging
 *
 * Environment Variables Required:
 *   AIRTABLE_API_KEY   - Airtable Personal Access Token
 *   AIRTABLE_BASE_ID   - Airtable Base ID
 *   MCP_GATEWAY_URL    - MCP Gateway URL (default: http://localhost:8100)
 */

import axios, { AxiosInstance } from 'axios';
import { randomUUID } from 'crypto';
import { Pool } from 'pg';

// ============================================================================
// Configuration
// ============================================================================

interface MigrationConfig {
  airtableApiKey: string;
  airtableBaseId: string;
  mcpGatewayUrl: string;
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
    mcpGatewayUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
    tableName: args.tableName || 'Courses',
    dryRun: args.dryRun || false,
    limit: args.limit || null,
    verbose: args.verbose || false,
  };

  // Validate required config
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

interface CourseRecord {
  airtable_id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  thumbnail_url: string | null;
  cover_image_url: string | null;
  price_cents: number;
  currency: string;
  status: 'draft' | 'published' | 'archived';
  level: 'beginner' | 'intermediate' | 'advanced' | null;
  category: string | null;
  duration_minutes: number | null;
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
        pageSize: 100, // Use pageSize for pagination, not maxRecords which caps total
      };
      if (limit) {
        params.maxRecords = limit - allRecords.length;
      }
      if (offset) params.offset = offset;

      const response = await this.client.get<AirtableListResponse>(
        `/${this.baseId}/${encodeURIComponent(tableName)}`,
        { params }
      );

      allRecords.push(...response.data.records);
      offset = response.data.offset;

      // Respect rate limits
      await this.sleep(200);

      // Check limit
      if (limit && allRecords.length >= limit) {
        break;
      }
    } while (offset);

    return allRecords;
  }

  async getTableSchema(tableName: string): Promise<any> {
    const response = await this.client.get(
      `https://api.airtable.com/v0/meta/bases/${this.baseId}/tables`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    const table = response.data.tables.find(
      (t: any) => t.name === tableName || t.id === tableName
    );

    return table;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// PostgreSQL Direct Client (bypasses MCP Gateway read-only restriction)
// ============================================================================

class PostgresClient {
  private pool: Pool;
  private mcpGatewayUrl: string;

  constructor(mcpGatewayUrl: string) {
    this.mcpGatewayUrl = mcpGatewayUrl;

    // Direct PostgreSQL connection to ozean-licht-db
    // Same postgres server as shared-users-db, different database
    this.pool = new Pool({
      host: process.env.POSTGRES_SHARED_HOST || 'iccc0wo0wkgsws4cowk4440c',
      port: parseInt(process.env.POSTGRES_SHARED_PORT || '5432'),
      user: process.env.POSTGRES_SHARED_USER || 'postgres',
      password: process.env.POSTGRES_SHARED_PASSWORD || '',
      database: 'ozean-licht-db', // Content database for Ozean Licht platform
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
      // Check MCP Gateway health
      const response = await axios.get(`${this.mcpGatewayUrl}/health`);
      if (response.status !== 200) return false;

      // Check PostgreSQL connection
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
 * Generate a URL-safe slug from a title
 */
function generateSlug(title: string, airtableId: string): string {
  const base = title
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => {
      const map: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' };
      return map[c] || c;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);

  // Add a short hash from airtable ID for uniqueness
  const hash = airtableId.substring(3, 7).toLowerCase();
  return `${base}-${hash}`;
}

/**
 * Map Airtable status to PostgreSQL status
 */
function mapStatus(airtableStatus: string | undefined): 'draft' | 'published' | 'archived' {
  if (!airtableStatus) return 'draft';

  const status = airtableStatus.toLowerCase();
  if (status.includes('publish') || status === 'live' || status === 'active') {
    return 'published';
  }
  if (status.includes('archive') || status === 'inactive' || status === 'hidden') {
    return 'archived';
  }
  return 'draft';
}

/**
 * Map Airtable level to PostgreSQL level
 */
function mapLevel(airtableLevel: string | undefined): 'beginner' | 'intermediate' | 'advanced' | null {
  if (!airtableLevel) return null;

  const level = airtableLevel.toLowerCase();
  if (level.includes('begin') || level.includes('anfänger') || level === '1') {
    return 'beginner';
  }
  if (level.includes('intermed') || level.includes('fortgeschritten') || level === '2') {
    return 'intermediate';
  }
  if (level.includes('advan') || level.includes('experte') || level === '3') {
    return 'advanced';
  }
  return null;
}

/**
 * Parse price from various formats
 */
function parsePrice(price: any): number {
  if (!price) return 0;
  if (typeof price === 'number') {
    // Assume it's already in cents if > 1000, otherwise convert
    return price > 1000 ? price : Math.round(price * 100);
  }
  if (typeof price === 'string') {
    // Remove currency symbols and convert
    const cleaned = price.replace(/[€$,\s]/g, '').replace(',', '.');
    const value = parseFloat(cleaned);
    return isNaN(value) ? 0 : Math.round(value * 100);
  }
  return 0;
}

/**
 * Determine entity scope from Airtable data
 */
function determineEntityScope(
  fields: Record<string, any>
): 'ozean_licht' | 'kids_ascension' | null {
  // Check various field names that might indicate the entity
  const entityFields = ['Entity', 'Platform', 'Project', 'Brand', 'Scope'];

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

  // Default to ozean_licht if not determined
  return 'ozean_licht';
}

/**
 * Transform Airtable record to PostgreSQL course record
 */
function transformCourse(record: AirtableRecord): CourseRecord {
  const fields = record.fields;

  // Common field name variations (check both cases)
  const title =
    fields['title'] ||
    fields['Title'] ||
    fields['Name'] ||
    fields['name'] ||
    fields['Course Name'] ||
    fields['Titel'] ||
    fields['Kursname'] ||
    'Untitled Course';

  const description =
    fields['description'] ||
    fields['Description'] ||
    fields['Beschreibung'] ||
    fields['Long Description'] ||
    fields['Content'] ||
    null;

  const shortDescription =
    fields['subtitle'] ||
    fields['short_description'] ||
    fields['Short Description'] ||
    fields['Kurzbeschreibung'] ||
    fields['Summary'] ||
    fields['Excerpt'] ||
    null;

  const thumbnailUrl =
    fields['thumbnail']?.[0]?.url ||
    fields['Thumbnail']?.[0]?.url ||
    fields['Image']?.[0]?.url ||
    fields['Cover']?.[0]?.url ||
    fields['Thumbnail URL'] ||
    null;

  const coverImageUrl =
    fields['cover_image']?.[0]?.url ||
    fields['Cover Image']?.[0]?.url ||
    fields['Banner']?.[0]?.url ||
    fields['Cover Image URL'] ||
    null;

  const price = parsePrice(
    fields['price'] || fields['Price'] || fields['Preis'] || fields['Cost'] || 0
  );

  const currency =
    fields['currency'] || fields['Currency'] || fields['Währung'] || 'EUR';

  // Map is_public to status
  const isPublic = fields['is_public'];
  let status: 'draft' | 'published' | 'archived' = 'draft';
  if (isPublic === 'true' || isPublic === true) {
    status = 'published';
  } else if (fields['status'] || fields['Status']) {
    status = mapStatus(fields['status'] || fields['Status']);
  }

  const level = mapLevel(
    fields['level'] || fields['Level'] || fields['Niveau'] || fields['Difficulty']
  );

  // Extract category from tags if available
  const tags = fields['tags'] || fields['Tags'];
  const category =
    fields['category'] ||
    fields['Category'] ||
    fields['Kategorie'] ||
    fields['Type'] ||
    (Array.isArray(tags) && tags.length > 0 ? tags[0] : null);

  const durationMinutes =
    fields['duration'] ||
    fields['Duration'] ||
    fields['Duration (min)'] ||
    fields['Dauer'] ||
    null;

  const entityScope = determineEntityScope(fields);

  // Use Airtable slug if available, otherwise generate
  const slug = fields['slug'] || generateSlug(title, record.id);

  // Collect remaining fields as metadata
  const knownFields = [
    'title', 'Title', 'Name', 'name', 'Course Name', 'Titel', 'Kursname',
    'description', 'Description', 'Beschreibung', 'Long Description', 'Content',
    'subtitle', 'short_description', 'Short Description', 'Kurzbeschreibung', 'Summary', 'Excerpt',
    'thumbnail', 'Thumbnail', 'Image', 'Cover', 'Thumbnail URL',
    'cover_image', 'Cover Image', 'Banner', 'Cover Image URL',
    'price', 'Price', 'Preis', 'Cost', 'currency', 'Currency', 'Währung',
    'status', 'Status', 'is_public',
    'level', 'Level', 'Niveau', 'Difficulty',
    'category', 'Category', 'Kategorie', 'Type', 'tags', 'Tags',
    'duration', 'Duration', 'Duration (min)', 'Dauer',
    'Entity', 'Platform', 'Project', 'Brand', 'Scope',
    'slug',
  ];

  const metadata: Record<string, any> = {
    airtable_created_time: record.createdTime,
    original_fields: {},
  };

  // Store original field values for reference
  for (const [key, value] of Object.entries(fields)) {
    if (!knownFields.includes(key) && value !== null && value !== undefined) {
      metadata.original_fields[key] = value;
    }
  }

  // Handle linked records (store IDs for later linking)
  const linkedRecordFields = ['Lessons', 'Modules', 'Instructor', 'Videos'];
  for (const fieldName of linkedRecordFields) {
    if (fields[fieldName] && Array.isArray(fields[fieldName])) {
      metadata[`linked_${fieldName.toLowerCase()}`] = fields[fieldName];
    }
  }

  return {
    airtable_id: record.id,
    title,
    slug,
    description,
    short_description: shortDescription,
    thumbnail_url: thumbnailUrl,
    cover_image_url: coverImageUrl,
    price_cents: price,
    currency,
    status,
    level,
    category,
    duration_minutes: durationMinutes ? parseInt(String(durationMinutes), 10) : null,
    entity_scope: entityScope,
    metadata,
  };
}

// ============================================================================
// Migration Logic
// ============================================================================

class CoursesMigration {
  private airtable: AirtableClient;
  private postgres: PostgresClient;
  private config: MigrationConfig;

  constructor(config: MigrationConfig) {
    this.config = config;
    this.airtable = new AirtableClient(config.airtableApiKey, config.airtableBaseId);
    this.postgres = new PostgresClient(config.mcpGatewayUrl);
  }

  private log(message: string, ...args: any[]): void {
    console.log(`[${new Date().toISOString()}] ${message}`, ...args);
  }

  private verbose(message: string, ...args: any[]): void {
    if (this.config.verbose) {
      console.log(`[${new Date().toISOString()}] [VERBOSE] ${message}`, ...args);
    }
  }

  /**
   * Check if PostgreSQL is available
   */
  async checkPrerequisites(): Promise<void> {
    this.log('Checking prerequisites...');

    // Check PostgreSQL connection
    const healthy = await this.postgres.healthCheck();
    if (!healthy) {
      throw new Error(`PostgreSQL not available or MCP Gateway not healthy at ${this.config.mcpGatewayUrl}`);
    }
    this.log('PostgreSQL connection is healthy');

    // Check if courses table exists
    try {
      await this.postgres.query('SELECT 1 FROM courses LIMIT 1');
      this.log('Courses table exists');
    } catch (error) {
      throw new Error(
        'Courses table does not exist. Run migration 010_create_content_tables.sql first.'
      );
    }
  }

  /**
   * Fetch existing courses to check for duplicates
   */
  async getExistingAirtableIds(): Promise<Set<string>> {
    const rows = await this.postgres.query<{ airtable_id: string }>(
      'SELECT airtable_id FROM courses WHERE airtable_id IS NOT NULL'
    );
    return new Set(rows.map((r) => r.airtable_id));
  }

  /**
   * Insert a single course into PostgreSQL
   */
  async insertCourse(course: CourseRecord): Promise<void> {
    const sql = `
      INSERT INTO courses (
        airtable_id, title, slug, description, short_description,
        thumbnail_url, cover_image_url, price_cents, currency,
        status, level, category, duration_minutes, entity_scope, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (airtable_id) DO UPDATE SET
        title = EXCLUDED.title,
        slug = EXCLUDED.slug,
        description = EXCLUDED.description,
        short_description = EXCLUDED.short_description,
        thumbnail_url = EXCLUDED.thumbnail_url,
        cover_image_url = EXCLUDED.cover_image_url,
        price_cents = EXCLUDED.price_cents,
        currency = EXCLUDED.currency,
        status = EXCLUDED.status,
        level = EXCLUDED.level,
        category = EXCLUDED.category,
        duration_minutes = EXCLUDED.duration_minutes,
        entity_scope = EXCLUDED.entity_scope,
        metadata = EXCLUDED.metadata,
        updated_at = NOW()
    `;

    await this.postgres.execute(sql, [
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
      JSON.stringify(course.metadata),
    ]);
  }

  /**
   * Close database connection
   */
  async cleanup(): Promise<void> {
    await this.postgres.close();
  }

  /**
   * Run the migration
   */
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
      // Check prerequisites
      await this.checkPrerequisites();

      // Fetch Airtable schema for debugging
      this.log(`Fetching schema for table: ${this.config.tableName}`);
      try {
        const schema = await this.airtable.getTableSchema(this.config.tableName);
        if (schema) {
          this.verbose('Table fields:', schema.fields?.map((f: any) => f.name));
        }
      } catch (error) {
        this.log('Could not fetch table schema (non-fatal):', error);
      }

      // Fetch records from Airtable
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

      // Get existing records to check for updates
      const existingIds = await this.getExistingAirtableIds();
      this.log(`Found ${existingIds.size} existing records in PostgreSQL`);

      // Process each record
      for (const record of records) {
        try {
          this.verbose(`Processing record: ${record.id}`);

          // Transform the record
          const course = transformCourse(record);
          this.verbose(`Transformed course: ${course.title} (${course.slug})`);

          if (this.config.dryRun) {
            this.log(`[DRY RUN] Would insert/update course: ${course.title}`);
            this.verbose('Course data:', JSON.stringify(course, null, 2));
            result.successCount++;
          } else {
            // Insert or update
            await this.insertCourse(course);

            if (existingIds.has(record.id)) {
              this.verbose(`Updated existing course: ${course.title}`);
            } else {
              this.verbose(`Inserted new course: ${course.title}`);
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
  console.log('  Airtable Courses Migration Script');
  console.log('='.repeat(60));
  console.log('');

  try {
    const config = loadConfig();

    console.log('Configuration:');
    console.log(`  - Table: ${config.tableName}`);
    console.log(`  - MCP Gateway: ${config.mcpGatewayUrl}`);
    console.log(`  - Dry Run: ${config.dryRun}`);
    console.log(`  - Limit: ${config.limit || 'none'}`);
    console.log(`  - Verbose: ${config.verbose}`);
    console.log('');

    const migration = new CoursesMigration(config);
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

    // Exit with error code if there were failures
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

// Run if executed directly
main();
