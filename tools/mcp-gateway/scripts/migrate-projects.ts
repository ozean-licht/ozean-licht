#!/usr/bin/env npx ts-node
/**
 * Airtable Projects Migration Script
 *
 * Migrates project management data from Airtable to PostgreSQL (ozean-licht-db).
 * Handles: process_templates, projects, tasks (in that order)
 *
 * Usage:
 *   npx tsx migrate-projects.ts [options]
 *
 * Options:
 *   --dry-run           Preview changes without writing to database
 *   --limit N           Limit number of records per table (default: all)
 *   --table NAME        Migrate only specific table (process_templates, projects, tasks)
 *   --verbose           Show detailed logging
 *   --skip-dedup        Skip deduplication for tasks (faster but may have duplicates)
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
  dryRun: boolean;
  limit: number | null;
  verbose: boolean;
  table: string | null;  // null = all tables
  skipDedup: boolean;
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
      case '--skip-dedup':
        config.skipDedup = true;
        break;
      case '--limit':
        config.limit = parseInt(args[++i], 10);
        break;
      case '--table':
        config.table = args[++i];
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
    dryRun: args.dryRun || false,
    limit: args.limit || null,
    verbose: args.verbose || false,
    table: args.table || null,
    skipDedup: args.skipDedup || false,
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

interface MigrationResult {
  table: string;
  totalRecords: number;
  successCount: number;
  failureCount: number;
  skippedCount: number;
  duplicatesFound: number;
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
      timeout: 60000,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getAllRecords(tableName: string, limit?: number | null, verbose = false): Promise<AirtableRecord[]> {
    const allRecords: AirtableRecord[] = [];
    let offset: string | undefined;
    let pageCount = 0;

    do {
      const params: Record<string, any> = {
        pageSize: 100,
      };
      if (limit && (limit - allRecords.length) < 100) {
        params.maxRecords = limit - allRecords.length;
      }
      if (offset) params.offset = offset;

      const response = await this.client.get<AirtableListResponse>(
        `/${this.baseId}/${encodeURIComponent(tableName)}`,
        { params }
      );

      allRecords.push(...response.data.records);
      offset = response.data.offset;
      pageCount++;

      if (verbose && pageCount % 10 === 0) {
        console.log(`  [${tableName}] Fetched ${allRecords.length} records (page ${pageCount})...`);
      }

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
    this.pool = new Pool({
      host: process.env.POSTGRES_SHARED_HOST || 'iccc0wo0wkgsws4cowk4440c',
      port: parseInt(process.env.POSTGRES_SHARED_PORT || '5432'),
      user: process.env.POSTGRES_SHARED_USER || 'postgres',
      password: process.env.POSTGRES_SHARED_PASSWORD || '',
      database: 'ozean-licht-db',
      max: 10,
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
// Status Mappings (German to English)
// ============================================================================

const PROJECT_STATUS_MAP: Record<string, string> = {
  'aktiv': 'active',
  'abgeschlossen': 'completed',
  'pausiert': 'paused',
  'nicht gestartet': 'not_started',
  'to do': 'todo',
};

const TASK_STATUS_MAP: Record<string, string> = {
  'to do': 'todo',
  'überfällig': 'overdue',
  'in bearbeitung': 'in_progress',
  'abgeschlossen': 'completed',
  'geplant': 'planned',
  'pausiert': 'paused',
  'done': 'done',
};

const TEMPLATE_STATUS_MAP: Record<string, string> = {
  'to do': 'active',
  'überfallig': 'active',
  'in bearbeitung': 'active',
  'abgeschlossen': 'inactive',
  'geplant': 'draft',
  'pausiert': 'inactive',
};

function mapProjectStatus(status: string | undefined): string {
  if (!status) return 'planning';
  const lower = status.toLowerCase();
  return PROJECT_STATUS_MAP[lower] || 'planning';
}

function mapTaskStatus(status: string | undefined): string {
  if (!status) return 'todo';
  const lower = status.toLowerCase();
  return TASK_STATUS_MAP[lower] || 'todo';
}

function mapTemplateStatus(status: string | undefined): string {
  if (!status) return 'active';
  const lower = status.toLowerCase();
  return TEMPLATE_STATUS_MAP[lower] || 'active';
}

// ============================================================================
// Transform Functions
// ============================================================================

function extractUserInfo(userField: any): { name: string | null; email: string | null } {
  if (!userField) return { name: null, email: null };
  return {
    name: userField.name || null,
    email: userField.email || null,
  };
}

function transformProcessTemplate(record: AirtableRecord): Record<string, any> {
  const f = record.fields;
  const createdBy = extractUserInfo(f['created_by']);
  const updatedBy = extractUserInfo(f['updated_by']);

  return {
    airtable_id: record.id,
    name: f['name'] || 'Unnamed Template',
    description: f['description'] || null,
    template_type: f['type'] || null,
    status: mapTemplateStatus(f['status']),
    task_order: f['task_order'] || 0,
    offset_days_to_anchor: f['offset_days_to_anchor'] || 0,
    duration_days: f['duration_days'] || 1,
    is_anchor_point: f['anchor_point'] === true,
    assigned_to_ids: JSON.stringify(f['assigned_to'] || []),
    linked_lightguides: JSON.stringify(f['linked_lightguides'] || []),
    linked_anchor: JSON.stringify(f['linked_anchor'] || []),
    linked_set: JSON.stringify(f['linked_set'] || []),
    created_by_name: createdBy.name,
    created_by_email: createdBy.email,
    updated_by_name: updatedBy.name,
    updated_by_email: updatedBy.email,
    airtable_created_at: f['created_at'] || record.createdTime,
    airtable_updated_at: f['updated_at'] || null,
    metadata: JSON.stringify({
      airtable_created_time: record.createdTime,
    }),
  };
}

function transformProject(record: AirtableRecord): Record<string, any> {
  const f = record.fields;
  const createdBy = extractUserInfo(f['created_by']);
  const updatedBy = extractUserInfo(f['updated_by']);

  // Progress is a decimal (0-1), convert to percentage
  const progress = f['progress'] ? Math.round(f['progress'] * 100) : 0;

  return {
    airtable_id: record.id,
    title: f['title'] || 'Untitled Project',
    description: f['description'] || null,
    project_type: f['project_type'] || null,
    interval_type: f['intervall'] || null,
    status: mapProjectStatus(f['status']),
    progress_percent: progress,
    tasks_total: f['tasks_total'] || 0,
    tasks_done: f['tasks_done'] || 0,
    used_template: f['used_template'] === true,
    start_date: f['start_day'] || null,
    target_date: f['target_day'] || null,
    day_of_publish: f['day_of_publish'] || null,
    duration_days: f['duration_days'] || null,
    auto_start: f['auto_start'] || null,
    auto_target: f['auto_target'] || null,
    start_day_calculated: f['start_day_calculated'] || null,
    target_day_calculated: f['target_day_calculated'] || null,
    event_start: f['event_start'] || null,
    event_finish: f['event_finish'] || null,
    assignee_ids: JSON.stringify(f['assignee'] || []),
    linked_task_ids: JSON.stringify(f['linked_tasks'] || []),
    linked_event_ids: JSON.stringify(f['linked_events'] || []),
    linked_course_ids: JSON.stringify(f['linked_course'] || []),
    linked_video_ids: JSON.stringify(f['linked_videos'] || []),
    linked_short_ids: JSON.stringify(f['linked_shorts'] || []),
    created_by_name: createdBy.name,
    created_by_email: createdBy.email,
    updated_by_name: updatedBy.name,
    updated_by_email: updatedBy.email,
    airtable_created_at: f['created_at'] || record.createdTime,
    airtable_updated_at: f['updated_at'] || null,
    metadata: JSON.stringify({
      airtable_created_time: record.createdTime,
    }),
  };
}

function transformTask(record: AirtableRecord): Record<string, any> {
  const f = record.fields;
  const createdBy = extractUserInfo(f['created_by']);
  const updatedBy = extractUserInfo(f['updated_by']);

  // Get the first linked project ID (tasks typically belong to one project)
  const linkedProjects = f['linked_projects'] || [];
  const projectAirtableId = linkedProjects.length > 0 ? linkedProjects[0] : null;

  // day_of_publish is a lookup field that returns an array
  const dayOfPublish = Array.isArray(f['day_of_publish'])
    ? f['day_of_publish'][0]
    : f['day_of_publish'];

  return {
    airtable_id: record.id,
    airtable_auto_number: f['id'] || null,  // Airtable auto-increment ID
    name: f['name'] || 'Unnamed Task',
    description: f['description'] || null,
    status: mapTaskStatus(f['status']),
    is_done: f['is_done'] === true,
    task_order: f['task_order'] || 0,
    start_date: f['start_day'] || null,
    target_date: f['target_day'] || null,
    finished_at: f['finished_timestamp'] || null,
    duration_days: f['duration_days'] || null,
    offset_days_to_anchor: f['offset_days_to_anchor'] || null,
    day_of_publish: dayOfPublish || null,
    auto_start: f['auto_start'] || null,
    auto_finished: f['auto_finished'] || null,
    project_airtable_id: projectAirtableId,
    assignee_ids: JSON.stringify(f['assignees'] || []),
    milestone_ids: JSON.stringify(f['Meilensteine'] || []),
    department_ids: JSON.stringify(f['Abteilung'] || []),
    created_by_name: createdBy.name,
    created_by_email: createdBy.email,
    updated_by_name: updatedBy.name,
    updated_by_email: updatedBy.email,
    airtable_created_at: f['created_at'] || record.createdTime,
    airtable_updated_at: f['updated_at'] || null,
    metadata: JSON.stringify({
      airtable_created_time: record.createdTime,
      linked_projects_all: f['linked_projects'] || [],
    }),
  };
}

// ============================================================================
// Migration Logic
// ============================================================================

class ProjectsMigration {
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
  }

  async ensureTablesExist(): Promise<void> {
    // Check if tables exist, if not provide guidance
    const tables = ['process_templates', 'projects', 'tasks'];
    for (const table of tables) {
      try {
        await this.postgres.query(`SELECT 1 FROM ${table} LIMIT 1`);
        this.log(`Table ${table} exists`);
      } catch {
        throw new Error(
          `Table ${table} does not exist. Run migration 030_create_project_tables_standalone.sql first.`
        );
      }
    }
  }

  // ---- Process Templates ----
  async migrateProcessTemplates(): Promise<MigrationResult> {
    const startTime = Date.now();
    const result: MigrationResult = {
      table: 'process_templates',
      totalRecords: 0,
      successCount: 0,
      failureCount: 0,
      skippedCount: 0,
      duplicatesFound: 0,
      errors: [],
      duration: 0,
    };

    this.log('Fetching process_templates from Airtable...');
    const records = await this.airtable.getAllRecords('process_templates', this.config.limit, this.config.verbose);
    result.totalRecords = records.length;
    this.log(`Found ${records.length} process_templates`);

    for (const record of records) {
      try {
        const data = transformProcessTemplate(record);
        this.verbose(`Processing template: ${data.name}`);

        if (this.config.dryRun) {
          this.verbose(`[DRY RUN] Would insert: ${data.name}`);
          result.successCount++;
        } else {
          await this.postgres.execute(`
            INSERT INTO process_templates (
              airtable_id, name, description, template_type, status, task_order,
              offset_days_to_anchor, duration_days, is_anchor_point, assigned_to_ids,
              linked_lightguides, linked_anchor, linked_set, created_by_name,
              created_by_email, updated_by_name, updated_by_email, airtable_created_at,
              airtable_updated_at, metadata
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            ON CONFLICT (airtable_id) DO UPDATE SET
              name = EXCLUDED.name,
              description = EXCLUDED.description,
              template_type = EXCLUDED.template_type,
              status = EXCLUDED.status,
              task_order = EXCLUDED.task_order,
              offset_days_to_anchor = EXCLUDED.offset_days_to_anchor,
              duration_days = EXCLUDED.duration_days,
              is_anchor_point = EXCLUDED.is_anchor_point,
              assigned_to_ids = EXCLUDED.assigned_to_ids,
              linked_lightguides = EXCLUDED.linked_lightguides,
              linked_anchor = EXCLUDED.linked_anchor,
              linked_set = EXCLUDED.linked_set,
              updated_by_name = EXCLUDED.updated_by_name,
              updated_by_email = EXCLUDED.updated_by_email,
              airtable_updated_at = EXCLUDED.airtable_updated_at,
              metadata = EXCLUDED.metadata,
              updated_at = NOW()
          `, [
            data.airtable_id, data.name, data.description, data.template_type, data.status,
            data.task_order, data.offset_days_to_anchor, data.duration_days, data.is_anchor_point,
            data.assigned_to_ids, data.linked_lightguides, data.linked_anchor, data.linked_set,
            data.created_by_name, data.created_by_email, data.updated_by_name, data.updated_by_email,
            data.airtable_created_at, data.airtable_updated_at, data.metadata
          ]);
          result.successCount++;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        result.errors.push({ airtableId: record.id, error: errorMessage });
        result.failureCount++;
      }
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  // ---- Projects ----
  async migrateProjects(): Promise<MigrationResult> {
    const startTime = Date.now();
    const result: MigrationResult = {
      table: 'projects',
      totalRecords: 0,
      successCount: 0,
      failureCount: 0,
      skippedCount: 0,
      duplicatesFound: 0,
      errors: [],
      duration: 0,
    };

    this.log('Fetching projects from Airtable...');
    const records = await this.airtable.getAllRecords('projects', this.config.limit, this.config.verbose);
    result.totalRecords = records.length;
    this.log(`Found ${records.length} projects`);

    for (const record of records) {
      try {
        const data = transformProject(record);
        this.verbose(`Processing project: ${data.title}`);

        if (this.config.dryRun) {
          this.verbose(`[DRY RUN] Would insert: ${data.title}`);
          result.successCount++;
        } else {
          await this.postgres.execute(`
            INSERT INTO projects (
              airtable_id, title, description, project_type, interval_type, status,
              progress_percent, tasks_total, tasks_done, used_template, start_date,
              target_date, day_of_publish, duration_days, auto_start, auto_target,
              start_day_calculated, target_day_calculated, event_start, event_finish,
              assignee_ids, linked_task_ids, linked_event_ids, linked_course_ids,
              linked_video_ids, linked_short_ids, created_by_name, created_by_email,
              updated_by_name, updated_by_email, airtable_created_at, airtable_updated_at, metadata
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)
            ON CONFLICT (airtable_id) DO UPDATE SET
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              project_type = EXCLUDED.project_type,
              interval_type = EXCLUDED.interval_type,
              status = EXCLUDED.status,
              progress_percent = EXCLUDED.progress_percent,
              tasks_total = EXCLUDED.tasks_total,
              tasks_done = EXCLUDED.tasks_done,
              used_template = EXCLUDED.used_template,
              start_date = EXCLUDED.start_date,
              target_date = EXCLUDED.target_date,
              day_of_publish = EXCLUDED.day_of_publish,
              duration_days = EXCLUDED.duration_days,
              auto_start = EXCLUDED.auto_start,
              auto_target = EXCLUDED.auto_target,
              start_day_calculated = EXCLUDED.start_day_calculated,
              target_day_calculated = EXCLUDED.target_day_calculated,
              event_start = EXCLUDED.event_start,
              event_finish = EXCLUDED.event_finish,
              assignee_ids = EXCLUDED.assignee_ids,
              linked_task_ids = EXCLUDED.linked_task_ids,
              linked_event_ids = EXCLUDED.linked_event_ids,
              linked_course_ids = EXCLUDED.linked_course_ids,
              linked_video_ids = EXCLUDED.linked_video_ids,
              linked_short_ids = EXCLUDED.linked_short_ids,
              updated_by_name = EXCLUDED.updated_by_name,
              updated_by_email = EXCLUDED.updated_by_email,
              airtable_updated_at = EXCLUDED.airtable_updated_at,
              metadata = EXCLUDED.metadata,
              updated_at = NOW()
          `, [
            data.airtable_id, data.title, data.description, data.project_type, data.interval_type,
            data.status, data.progress_percent, data.tasks_total, data.tasks_done, data.used_template,
            data.start_date, data.target_date, data.day_of_publish, data.duration_days,
            data.auto_start, data.auto_target, data.start_day_calculated, data.target_day_calculated,
            data.event_start, data.event_finish, data.assignee_ids, data.linked_task_ids,
            data.linked_event_ids, data.linked_course_ids, data.linked_video_ids, data.linked_short_ids,
            data.created_by_name, data.created_by_email, data.updated_by_name, data.updated_by_email,
            data.airtable_created_at, data.airtable_updated_at, data.metadata
          ]);
          result.successCount++;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        result.errors.push({ airtableId: record.id, error: errorMessage });
        result.failureCount++;
      }
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  // ---- Tasks with Deduplication ----
  async migrateTasks(): Promise<MigrationResult> {
    const startTime = Date.now();
    const result: MigrationResult = {
      table: 'tasks',
      totalRecords: 0,
      successCount: 0,
      failureCount: 0,
      skippedCount: 0,
      duplicatesFound: 0,
      errors: [],
      duration: 0,
    };

    this.log('Fetching tasks from Airtable (this may take a while for 9k+ records)...');
    const records = await this.airtable.getAllRecords('tasks', this.config.limit, this.config.verbose);
    result.totalRecords = records.length;
    this.log(`Found ${records.length} tasks`);

    // Deduplication: Track by (name, project_airtable_id) combination
    // Also track by airtable_auto_number if available
    const seenKeys = new Map<string, string>();  // key -> airtable_id (first seen)
    const seenAutoNumbers = new Map<number, string>();  // auto_number -> airtable_id

    let processedCount = 0;
    for (const record of records) {
      try {
        const data = transformTask(record);
        processedCount++;

        if (processedCount % 500 === 0) {
          this.log(`  Processing task ${processedCount}/${records.length}...`);
        }

        // Deduplication check (unless --skip-dedup)
        if (!this.config.skipDedup) {
          // Check by auto number first (most reliable)
          if (data.airtable_auto_number) {
            const existingId = seenAutoNumbers.get(data.airtable_auto_number);
            if (existingId && existingId !== data.airtable_id) {
              this.verbose(`Duplicate auto_number ${data.airtable_auto_number}: ${data.airtable_id} vs ${existingId}`);
              result.duplicatesFound++;
              result.skippedCount++;
              continue;
            }
            seenAutoNumbers.set(data.airtable_auto_number, data.airtable_id);
          }

          // Check by (name, project) combination for orphans without auto_number
          const dedupKey = `${data.name}::${data.project_airtable_id || 'orphan'}`;
          const existingId = seenKeys.get(dedupKey);
          if (existingId && existingId !== data.airtable_id && !data.airtable_auto_number) {
            this.verbose(`Potential duplicate task: "${data.name}" in project ${data.project_airtable_id}`);
            // Keep the one with more data (has dates, description, etc.)
            // For now, keep first one seen
            result.duplicatesFound++;
            result.skippedCount++;
            continue;
          }
          seenKeys.set(dedupKey, data.airtable_id);
        }

        this.verbose(`Processing task: ${data.name} (order: ${data.task_order})`);

        if (this.config.dryRun) {
          this.verbose(`[DRY RUN] Would insert: ${data.name}`);
          result.successCount++;
        } else {
          await this.postgres.execute(`
            INSERT INTO tasks (
              airtable_id, airtable_auto_number, name, description, status, is_done,
              task_order, start_date, target_date, finished_at, duration_days,
              offset_days_to_anchor, day_of_publish, auto_start, auto_finished,
              project_airtable_id, assignee_ids, milestone_ids, department_ids,
              created_by_name, created_by_email, updated_by_name, updated_by_email,
              airtable_created_at, airtable_updated_at, metadata
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
            ON CONFLICT (airtable_id) DO UPDATE SET
              airtable_auto_number = EXCLUDED.airtable_auto_number,
              name = EXCLUDED.name,
              description = EXCLUDED.description,
              status = EXCLUDED.status,
              is_done = EXCLUDED.is_done,
              task_order = EXCLUDED.task_order,
              start_date = EXCLUDED.start_date,
              target_date = EXCLUDED.target_date,
              finished_at = EXCLUDED.finished_at,
              duration_days = EXCLUDED.duration_days,
              offset_days_to_anchor = EXCLUDED.offset_days_to_anchor,
              day_of_publish = EXCLUDED.day_of_publish,
              auto_start = EXCLUDED.auto_start,
              auto_finished = EXCLUDED.auto_finished,
              project_airtable_id = EXCLUDED.project_airtable_id,
              assignee_ids = EXCLUDED.assignee_ids,
              milestone_ids = EXCLUDED.milestone_ids,
              department_ids = EXCLUDED.department_ids,
              updated_by_name = EXCLUDED.updated_by_name,
              updated_by_email = EXCLUDED.updated_by_email,
              airtable_updated_at = EXCLUDED.airtable_updated_at,
              metadata = EXCLUDED.metadata,
              updated_at = NOW()
          `, [
            data.airtable_id, data.airtable_auto_number, data.name, data.description,
            data.status, data.is_done, data.task_order, data.start_date, data.target_date,
            data.finished_at, data.duration_days, data.offset_days_to_anchor, data.day_of_publish,
            data.auto_start, data.auto_finished, data.project_airtable_id, data.assignee_ids,
            data.milestone_ids, data.department_ids, data.created_by_name, data.created_by_email,
            data.updated_by_name, data.updated_by_email, data.airtable_created_at,
            data.airtable_updated_at, data.metadata
          ]);
          result.successCount++;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (!errorMessage.includes('duplicate key')) {
          result.errors.push({ airtableId: record.id, error: errorMessage });
        }
        result.failureCount++;
      }
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  // ---- Link Tasks to Projects (post-migration) ----
  async linkTasksToProjects(): Promise<number> {
    this.log('Linking tasks to projects using project_airtable_id...');

    if (this.config.dryRun) {
      this.log('[DRY RUN] Would link tasks to projects');
      return 0;
    }

    const result = await this.postgres.execute(`
      UPDATE tasks t
      SET project_id = p.id
      FROM projects p
      WHERE t.project_airtable_id = p.airtable_id
        AND t.project_id IS NULL
    `);

    this.log(`Linked ${result} tasks to their projects`);
    return result;
  }

  async cleanup(): Promise<void> {
    await this.postgres.close();
  }

  async run(): Promise<MigrationResult[]> {
    const results: MigrationResult[] = [];

    try {
      await this.checkPrerequisites();
      await this.ensureTablesExist();

      const tablesToMigrate = this.config.table
        ? [this.config.table]
        : ['process_templates', 'projects', 'tasks'];

      for (const table of tablesToMigrate) {
        this.log(`\n${'='.repeat(60)}`);
        this.log(`Starting migration for: ${table}`);
        this.log('='.repeat(60));

        let result: MigrationResult;
        switch (table) {
          case 'process_templates':
            result = await this.migrateProcessTemplates();
            break;
          case 'projects':
            result = await this.migrateProjects();
            break;
          case 'tasks':
            result = await this.migrateTasks();
            break;
          default:
            throw new Error(`Unknown table: ${table}`);
        }

        results.push(result);
        this.printResult(result);
      }

      // Link tasks to projects if we migrated both
      if (tablesToMigrate.includes('projects') && tablesToMigrate.includes('tasks')) {
        await this.linkTasksToProjects();
      }

      return results;
    } finally {
      await this.cleanup();
    }
  }

  private printResult(result: MigrationResult): void {
    console.log(`\n  Results for ${result.table}:`);
    console.log(`    Total Records: ${result.totalRecords}`);
    console.log(`    Successful: ${result.successCount}`);
    console.log(`    Failed: ${result.failureCount}`);
    console.log(`    Skipped: ${result.skippedCount}`);
    console.log(`    Duplicates Found: ${result.duplicatesFound}`);
    console.log(`    Duration: ${(result.duration / 1000).toFixed(2)}s`);

    if (result.errors.length > 0 && result.errors.length <= 10) {
      console.log(`  Errors:`);
      for (const error of result.errors) {
        console.log(`    - ${error.airtableId}: ${error.error}`);
      }
    } else if (result.errors.length > 10) {
      console.log(`  First 10 errors (${result.errors.length} total):`);
      for (const error of result.errors.slice(0, 10)) {
        console.log(`    - ${error.airtableId}: ${error.error}`);
      }
    }
  }
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function main(): Promise<void> {
  console.log('');
  console.log('='.repeat(60));
  console.log('  Airtable Projects Migration Script');
  console.log('  Tables: process_templates, projects, tasks');
  console.log('='.repeat(60));
  console.log('');

  try {
    const config = loadConfig();

    console.log('Configuration:');
    console.log(`  - Tables: ${config.table || 'ALL (process_templates, projects, tasks)'}`);
    console.log(`  - Dry Run: ${config.dryRun}`);
    console.log(`  - Limit: ${config.limit || 'none'}`);
    console.log(`  - Verbose: ${config.verbose}`);
    console.log(`  - Skip Dedup: ${config.skipDedup}`);
    console.log('');

    const migration = new ProjectsMigration(config);
    const results = await migration.run();

    console.log('');
    console.log('='.repeat(60));
    console.log('  Migration Summary');
    console.log('='.repeat(60));

    let totalSuccess = 0;
    let totalFailed = 0;
    let totalSkipped = 0;
    let totalDuplicates = 0;

    for (const result of results) {
      totalSuccess += result.successCount;
      totalFailed += result.failureCount;
      totalSkipped += result.skippedCount;
      totalDuplicates += result.duplicatesFound;
    }

    console.log(`  Total Successful: ${totalSuccess}`);
    console.log(`  Total Failed: ${totalFailed}`);
    console.log(`  Total Skipped: ${totalSkipped}`);
    console.log(`  Total Duplicates Found: ${totalDuplicates}`);
    console.log('');

    if (config.dryRun) {
      console.log('NOTE: This was a dry run. No data was written to the database.');
      console.log('Run without --dry-run to actually migrate the data.');
      console.log('');
    }

    if (totalFailed > 0) {
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
