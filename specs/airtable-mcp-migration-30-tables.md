# Plan: Airtable MCP Migration (33 Tables)

## Quick Reference

**Target Database:** `ozean-licht-db` (NOT shared-users-db!)

**MCP Gateway:** `http://127.0.0.1:8100` (use IPv4, NOT localhost - IPv6 has issues)

**Migration Script:** `tools/mcp-gateway/scripts/migrate-courses.ts`

---

## Session Context (2025-11-28)

### What Was Accomplished
1. Created first migration script for `courses` table
2. Successfully migrated **64 courses** from Airtable to `ozean-licht-db`
3. Created `ozean-licht-db` database on the existing Coolify postgres server
4. Connected admin dashboard DIRECTLY to PostgreSQL (no MCP Gateway dependency for reads)
5. Fixed field mapping for lowercase Airtable field names

### Key Learnings
- Airtable fields are lowercase (e.g., `title` not `Title`)
- Use `is_public` field to determine `published` status
- Airtable `slug` should be preserved, not regenerated
- Price is in EUR, stored as cents (295 EUR = 29500 cents)
- Category can be extracted from `tags` array

### Database Architecture (VERIFIED 2025-12-02)

**IMPORTANT:** There are TWO PostgreSQL containers. Use the correct one!

```
┌─────────────────────────────────────────────────────────────────────┐
│ CORRECT: iccc0wo0wkgsws4cowk4440c (port 32771)                      │
├─────────────────────────────────────────────────────────────────────┤
│ shared-users-db     → Auth for Admin + Ozean Licht                  │
│   ├── admin_users, admin_sessions, admin_permissions                │
│   └── users (platform users - shared between Admin & OL)            │
│                                                                     │
│ ozean-licht-db      → Content (USE THIS!)                           │
│   ├── courses: 64 records (59 published, 5 draft)                   │
│   ├── videos: 571 records                                           │
│   ├── projects: 658 records                                         │
│   ├── tasks: 9,114 records                                          │
│   └── process_templates: 89 records                                 │
│                                                                     │
│ kids-ascension-db   → Kids Ascension platform (SEPARATE auth)       │
│ orchestrator-db     → Agent orchestration                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ OUTDATED: zo8g4ogg8g0gss0oswkcs84w (port 32770) - DO NOT USE        │
├─────────────────────────────────────────────────────────────────────┤
│ ozean-licht-db      → Only 64 courses (incomplete migration!)       │
│ mem0                → Memory service                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Auth Clarification

| App | Auth Database | Notes |
|-----|---------------|-------|
| Admin Dashboard | `shared-users-db` | NextAuth sessions |
| Ozean Licht Platform | `shared-users-db` | Same auth as admin (shared users) |
| Kids Ascension | `kids-ascension-db` | **Separate** auth system |

### Connection Strings

**Admin Dashboard (.env.local):**
```bash
# Auth (NextAuth)
DATABASE_URL=postgresql://postgres:XXX@localhost:32771/shared-users-db

# Content (courses, videos, projects, tasks)
OZEAN_LICHT_DB_URL=postgresql://postgres:XXX@localhost:32771/ozean-licht-db
```

### App Connections

```
Admin Dashboard:
├── DATABASE_URL       → shared-users-db (auth)
└── OZEAN_LICHT_DB_URL → ozean-licht-db (content)

Ozean Licht Platform:
├── DATABASE_URL       → shared-users-db (auth)
└── OZEAN_LICHT_DB_URL → ozean-licht-db (content)

Kids Ascension:
└── DATABASE_URL       → kids-ascension-db (separate auth + content)

MCP Gateway:
├── Airtable service → Read/write Airtable data
├── Postgres service → READ-ONLY queries
└── Used for: data migration, AI agent access (NOT app queries)
```

---

## How to Use Airtable MCP

### 1. Health Check
```bash
curl -s -X POST http://127.0.0.1:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"mcp.execute","params":{"service":"airtable","operation":"health"},"id":"1"}'
```

### 2. List All Tables
```bash
curl -s -X POST http://127.0.0.1:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"mcp.execute","params":{"service":"airtable","operation":"list-tables"},"id":"1"}' | jq '.result.data.tables'
```

### 3. Get Table Schema
```bash
curl -s -X POST http://127.0.0.1:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"mcp.execute","params":{"service":"airtable","operation":"get-table-schema","args":{"tableName":"courses"}},"id":"1"}' | jq '.result.data.table.fields'
```

### 4. Read Records (with pagination)
```bash
curl -s -X POST http://127.0.0.1:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"mcp.execute","params":{"service":"airtable","operation":"read-records","args":{"tableName":"courses"},"options":{"limit":10}},"id":"1"}'
```

### 5. Available Operations
| Operation | Description | Required Args |
|-----------|-------------|---------------|
| `health` | Check service status | - |
| `list-bases` | List accessible bases | - |
| `list-tables` | List tables in base | `baseId` (optional) |
| `get-table-schema` | Get table fields | `tableName` |
| `read-records` | Read records | `tableName`, `filter`, `sort`, `fields`, `view`, `offset` |
| `get-record` | Get single record | `tableName`, `recordId` |
| `create-record` | Create record | `tableName`, `fields` |
| `create-records` | Batch create | `tableName`, `records` |
| `update-record` | Update record | `tableName`, `recordId`, `fields` |
| `update-records` | Batch update | `tableName`, `records` |
| `delete-record` | Delete record | `tableName`, `recordId` |
| `delete-records` | Batch delete | `tableName`, `recordIds` |

---

## How to Run Migration Scripts

### Prerequisites
1. MCP Gateway must be running (check: `curl http://127.0.0.1:8100/health`)
2. PostgreSQL tables must exist (run migrations first)
3. Environment variables set (or run from MCP Gateway container)

### Environment Variables

**For MCP Gateway (migration scripts):**
```bash
AIRTABLE_API_KEY=patXXXXXX.XXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
POSTGRES_SHARED_HOST=iccc0wo0wkgsws4cowk4440c  # Same server for all DBs
POSTGRES_SHARED_PORT=5432
POSTGRES_SHARED_USER=postgres
POSTGRES_SHARED_PASSWORD=XXXXX
```

**For Admin Dashboard (.env.local):**
```bash
# Auth database
DATABASE_URL=postgresql://postgres:XXX@localhost:32771/shared-users-db

# Content database (courses, videos, etc.)
OZEAN_LICHT_DB_URL=postgresql://postgres:XXX@localhost:32771/ozean-licht-db
```

**Note:** `ozean-licht-db` is on the SAME postgres server as `shared-users-db`, just a different database. Port 32771 is the external port mapped to container port 5432.

### Running Migration (from MCP Gateway container)

**Option 1: Direct container execution (RECOMMENDED)**
```bash
# Copy script to container
docker cp tools/mcp-gateway/scripts/migrate-courses.ts \
  mcp-gateway-o000okc80okco8s0sgcwwcwo-085218836457:/app/migrate-courses.ts

# Run migration
docker exec -w /app mcp-gateway-o000okc80okco8s0sgcwwcwo-085218836457 \
  npx tsx migrate-courses.ts --table courses --verbose
```

**Option 2: With specific options**
```bash
# Dry run (preview only)
docker exec -w /app mcp-gateway-o000okc80okco8s0sgcwwcwo-085218836457 \
  npx tsx migrate-courses.ts --table courses --dry-run --verbose

# Limit records
docker exec -w /app mcp-gateway-o000okc80okco8s0sgcwwcwo-085218836457 \
  npx tsx migrate-courses.ts --table courses --limit 10 --verbose
```

### Migration Script Options
| Option | Description |
|--------|-------------|
| `--dry-run` | Preview changes without writing |
| `--verbose` | Show detailed logging |
| `--limit N` | Migrate only N records |
| `--table NAME` | Airtable table name (default: 'Courses') |

### Running DDL Migrations (PostgreSQL)
```bash
# Copy migration file to container
docker cp shared/database/migrations/010_create_content_tables.sql \
  mcp-gateway-o000okc80okco8s0sgcwwcwo-085218836457:/tmp/

# Execute via Node.js (psql not available in container)
docker exec mcp-gateway-o000okc80okco8s0sgcwwcwo-085218836457 \
  node -e "
const { Pool } = require('pg');
const fs = require('fs');
const pool = new Pool({
  host: process.env.POSTGRES_OL_HOST,
  port: process.env.POSTGRES_OL_PORT,
  user: process.env.POSTGRES_OL_USER,
  password: process.env.POSTGRES_OL_PASSWORD,
  database: 'ozean-licht-db',
});
const sql = fs.readFileSync('/tmp/010_create_content_tables.sql', 'utf8');
pool.query(sql).then(() => {
  console.log('Migration completed!');
  pool.end();
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
"
```

---

## All Airtable Tables (33 Total)

| # | Table Name | Airtable ID | Fields | Category | Priority |
|---|------------|-------------|--------|----------|----------|
| 1 | courses | tblzDMDQSxtDippxy | 29 | Content | HIGH |
| 2 | videos | tbl5j77fy3lXjXeRS | 26 | Content | HIGH |
| 3 | course_modules | tblAsRSCbY0W75V3S | 10 | Content | HIGH |
| 4 | module_contents | tblvtZxrMy1VnDnGV | 16 | Content | HIGH |
| 5 | user_progress | tbl2aG3RoNjCngvcp | 9 | Content | MEDIUM |
| 6 | course_mapping | tblS5nhisQH2xsCPs | 3 | Content | LOW |
| 7 | shorts | tblCt7xZYuBVbUFes | 22 | Content | MEDIUM |
| 8 | posts | tblUQgSlufF3PLYdy | 17 | Content | MEDIUM |
| 9 | blogs | tblLqXJE22N6anVyQ | 20 | Content | MEDIUM |
| 10 | ablefy_orders | tble6wOMHRy6fXkl9 | 20 | Commerce | HIGH |
| 11 | ablefy_transactions | tblqaRqGbbYKRpE6W | 56 | Commerce | HIGH |
| 12 | abos | tbl1hjzTL7UscVoQh | 13 | Commerce | HIGH |
| 13 | members | tblrCmJYHWvYkHJub | 14 | Users | HIGH |
| 14 | team | tblmqrqr8rmPov8jV | 19 | Users | HIGH |
| 15 | projects | tblVs2bRAqU2I4w8J | 29 | Projects | HIGH |
| 16 | tasks | tblMg1uVs6ZMek8L4 | 22 | Projects | HIGH |
| 17 | milestones | tbljRkFDYUAdJFPHa | 20 | Projects | MEDIUM |
| 18 | process_templates | tbltVk2UzNe0TmxjD | 16 | Projects | MEDIUM |
| 19 | templates | tblqBbDYFKSrw9e7Q | 10 | Projects | LOW |
| 20 | task_guides | tblBXJYiu6FJ0j24g | 10 | Projects | LOW |
| 21 | events | tblUGTllL8VG71lJJ | 17 | Calendar | HIGH |
| 22 | connected_calendar | tblXT7VY24ZrQK9Vg | 16 | Calendar | MEDIUM |
| 23 | light_segments | tblc2rZjnOimI1EVr | 11 | Content | MEDIUM |
| 24 | departments | tblyuEX1JfaglVb32 | 15 | Organization | MEDIUM |
| 25 | announcements | tblyH1oTqjXV4AUBb | 20 | Communication | MEDIUM |
| 26 | updates | tblR0CnEZV7vXQRKZ | 10 | Communication | LOW |
| 27 | feedbacks | tbl3xWiQymOi0ubdd | 16 | CRM | MEDIUM |
| 28 | tickets | tblCFrKXAmdh9jA74 | 16 | CRM | HIGH |
| 29 | love_letters | tblgHZX0VVAZ43S5i | 18 | CRM | LOW |
| 30 | applications | tbl3eKgmAoggbOPUa | 12 | CRM | MEDIUM |
| 31 | backlog_ideas | tbloea2RCXvTZG0wa | 10 | Projects | LOW |
| 32 | components | tblyPLtJZvOpcLGkn | 10 | System | LOW |
| 33 | zendesk_makros | tblSjWIlcKQIDBvoq | 13 | CRM | LOW |

---

## Migration Checklist

### Database: ozean-licht-db

**IMPORTANT:** All migrations should target `ozean-licht-db` (port 5431), NOT `shared-users-db`.

Update PostgresClient in migration scripts:
```typescript
this.pool = new Pool({
  host: process.env.POSTGRES_OL_HOST || 'zo8g4ogg8g0gss0oswkcs84w',
  port: parseInt(process.env.POSTGRES_OL_PORT || '5431'),
  user: process.env.POSTGRES_OL_USER || 'postgres',
  password: process.env.POSTGRES_OL_PASSWORD || '',
  database: process.env.POSTGRES_OL_DATABASE || 'ozean-licht-db',
});
```

---

### Phase 1: Content Tables (Priority: HIGH)

#### 1. courses - COMPLETE
- [x] Schema created (`020_create_courses_standalone.sql`)
- [x] Migration script created (`migrate-courses.ts`)
- [x] **MIGRATED: 64 records to ozean-licht-db** (2025-11-28)
- [x] Admin dashboard connected via direct PostgreSQL
- [x] Verified data integrity

#### 2. videos - COMPLETE
- [x] Schema created (`021_create_videos_standalone.sql`)
- [x] Migration script created (`migrate-videos.ts`)
- [x] **MIGRATED: 571 records to ozean-licht-db** (2025-11-28)
- [x] Fixed pagination bug (was using maxRecords instead of pageSize)
- [x] Verified data integrity

#### 3. course_modules - NEEDS ARCHITECTURE
- [x] **EMPTY in Airtable** - Courses were in Ablefy (formerly Elopage)
- [ ] **NEW: Design course builder system** for team to rebuild 64 courses
- [ ] Design schema for modules (sections within a course)
- Note: Not a migration - building new CMS functionality

#### 4. module_contents - NEEDS ARCHITECTURE
- [x] **EMPTY in Airtable**
- [ ] Design schema for lessons/content within modules
- [ ] Content types: video, text, quiz, download, etc.
- Note: Part of course builder system design

#### 5. user_progress
- [ ] **Create standalone schema** (lesson_progress table)
- [ ] Create migration script
- [ ] Link to users (need user migration first)
- [ ] Test and migrate

#### 6. shorts
- [ ] **Create schema** (similar to videos)
- [ ] Create migration script
- [ ] Test and migrate

#### 7. posts
- [ ] **Create schema**
- [ ] Create migration script
- [ ] Test and migrate

#### 8. blogs
- [ ] **Create schema**
- [ ] Create migration script
- [ ] Test and migrate

---

### Phase 2: Commerce Tables (Priority: HIGH)

#### 9. ablefy_orders
- [ ] **Create standalone schema** (orders table)
- [ ] Create migration script (`migrate-orders.ts`)
- [ ] Map Ablefy fields to order schema
- [ ] Test with 3 records
- [ ] Migrate all records

#### 10. ablefy_transactions
- [ ] **Create standalone schema** (transactions table)
- [ ] Create migration script (`migrate-transactions.ts`)
- [ ] Handle 56 fields (use metadata JSONB for extras)
- [ ] Test with 3 records
- [ ] Migrate all records

#### 11. abos - LOW PRIORITY
- [ ] **NOT user subscriptions** - Ozean Licht has no subscription model yet
- [ ] Used for in-house tool subscriptions (Zendesk, Airtable, etc.)
- [ ] Move to Phase 8 (Low Priority)

---

### Phase 3: User Tables (Priority: HIGH)

#### 12. members
- [ ] **Create schema** (members table or extend users)
- [ ] Create migration script
- [ ] Handle email deduplication
- [ ] Test and migrate

#### 13. team
- [ ] **Create schema** (team table or extend users with role)
- [ ] Create migration script
- [ ] Test and migrate

---

### Phase 4: Project Tables (Priority: HIGH) - COMPLETE

#### 14. projects - COMPLETE
- [x] **Create standalone schema** (030_create_project_tables_standalone.sql)
- [x] Create migration script (`migrate-projects.ts`)
- [x] Test with 3 records
- [x] **MIGRATED: 658 records to ozean-licht-db** (2025-12-01)

#### 15. tasks - COMPLETE
- [x] **Create standalone schema** (030_create_project_tables_standalone.sql)
- [x] Create migration script (`migrate-projects.ts` - handles all 3 tables)
- [x] Link to projects (8,216 linked, 898 orphans)
- [x] **MIGRATED: 9,114 records to ozean-licht-db** (2025-12-01)
- [x] Deduplication logic included (no duplicates found)

#### 16. milestones
- [ ] **Create schema** (milestones table)
- [ ] Create migration script
- [ ] Test and migrate

#### 17. process_templates - COMPLETE
- [x] **Create standalone schema** (030_create_project_tables_standalone.sql)
- [x] Create migration script (`migrate-projects.ts`)
- [x] **MIGRATED: 89 records to ozean-licht-db** (2025-12-01)

---

### Phase 5: Calendar Tables (Priority: HIGH)

#### 18. events
- [ ] **Create standalone schema** (events table)
- [ ] Create migration script (`migrate-events.ts`)
- [ ] Test with 3 records
- [ ] Migrate all records

#### 19. connected_calendar
- [ ] Evaluate if needed (may be integration-specific)
- [ ] Create schema if needed
- [ ] Migrate if needed

---

### Phase 6: CRM Tables (Priority: MEDIUM)

#### 20. tickets
- [ ] Create schema (support tickets)
- [ ] Create migration script
- [ ] Test and migrate

#### 21. feedbacks
- [ ] Create schema
- [ ] Create migration script
- [ ] Test and migrate

#### 22. applications
- [ ] Create schema (job/program applications)
- [ ] Create migration script
- [ ] Test and migrate

#### 23. love_letters (Testimonials?)
- [ ] Create schema
- [ ] Create migration script
- [ ] Test and migrate

---

### Phase 7: Organization Tables (Priority: MEDIUM)

#### 24. departments
- [ ] Create schema
- [ ] Create migration script
- [ ] Test and migrate

#### 25. announcements
- [ ] Create schema
- [ ] Create migration script
- [ ] Test and migrate

#### 26. updates
- [ ] Create schema
- [ ] Create migration script
- [ ] Test and migrate

#### 27. light_segments
- [ ] Evaluate purpose
- [ ] Create schema if needed
- [ ] Migrate if needed

---

### Phase 8: Low Priority Tables

#### 28. course_mapping
- [ ] Evaluate if needed (only 3 fields)
- [ ] Create schema if needed
- [ ] Migrate if needed

#### 29. templates
- [ ] Create schema
- [ ] Migrate

#### 30. task_guides
- [ ] Create schema
- [ ] Migrate

#### 31. backlog_ideas
- [ ] Create schema
- [ ] Migrate

#### 32. components
- [ ] Evaluate purpose
- [ ] Migrate if needed

#### 33. zendesk_makros
- [ ] Evaluate if needed (Zendesk-specific)
- [ ] Migrate if needed

---

## Migration Script Template

Use this template for new migration scripts:

```typescript
#!/usr/bin/env npx ts-node
/**
 * Airtable [TABLE_NAME] Migration Script
 *
 * Usage:
 *   docker exec -w /app mcp-gateway-XXXX npx tsx migrate-[table].ts --verbose
 */

import axios, { AxiosInstance } from 'axios';
import { randomUUID } from 'crypto';
import { Pool } from 'pg';

// === Configuration ===
interface MigrationConfig {
  airtableApiKey: string;
  airtableBaseId: string;
  tableName: string;
  dryRun: boolean;
  limit: number | null;
  verbose: boolean;
}

// === Airtable Client ===
class AirtableClient {
  private client: AxiosInstance;
  constructor(apiKey: string, private baseId: string) {
    this.client = axios.create({
      baseURL: 'https://api.airtable.com/v0',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  }

  async getAllRecords(tableName: string, limit?: number | null) {
    const records: any[] = [];
    let offset: string | undefined;
    do {
      const params: any = { maxRecords: limit ? Math.min(100, limit - records.length) : 100 };
      if (offset) params.offset = offset;
      const response = await this.client.get(`/${this.baseId}/${encodeURIComponent(tableName)}`, { params });
      records.push(...response.data.records);
      offset = response.data.offset;
      await new Promise(r => setTimeout(r, 200)); // Rate limit
      if (limit && records.length >= limit) break;
    } while (offset);
    return records;
  }
}

// === PostgreSQL Client (OZEAN-LICHT-DB) ===
class PostgresClient {
  private pool: Pool;
  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_OL_HOST || 'zo8g4ogg8g0gss0oswkcs84w',
      port: parseInt(process.env.POSTGRES_OL_PORT || '5431'),
      user: process.env.POSTGRES_OL_USER || 'postgres',
      password: process.env.POSTGRES_OL_PASSWORD || '',
      database: 'ozean-licht-db',
    });
  }
  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this.pool.query(sql, params);
    return result.rows;
  }
  async execute(sql: string, params?: any[]): Promise<number> {
    const result = await this.pool.query(sql, params);
    return result.rowCount || 0;
  }
  async close() { await this.pool.end(); }
}

// === Transform Function (CUSTOMIZE FOR EACH TABLE) ===
function transformRecord(record: any) {
  const fields = record.fields;
  return {
    airtable_id: record.id,
    // Map Airtable fields to PostgreSQL columns
    // title: fields['title'] || 'Untitled',
    // ...
    metadata: { airtable_created_time: record.createdTime },
  };
}

// === Main Migration ===
async function main() {
  const config: MigrationConfig = {
    airtableApiKey: process.env.AIRTABLE_API_KEY || '',
    airtableBaseId: process.env.AIRTABLE_BASE_ID || '',
    tableName: '[TABLE_NAME]',
    dryRun: process.argv.includes('--dry-run'),
    limit: null,
    verbose: process.argv.includes('--verbose'),
  };

  const airtable = new AirtableClient(config.airtableApiKey, config.airtableBaseId);
  const postgres = new PostgresClient();

  try {
    console.log(`Fetching records from Airtable: ${config.tableName}`);
    const records = await airtable.getAllRecords(config.tableName, config.limit);
    console.log(`Found ${records.length} records`);

    for (const record of records) {
      const data = transformRecord(record);
      if (config.dryRun) {
        console.log(`[DRY RUN] Would insert:`, data);
      } else {
        // INSERT with UPSERT
        await postgres.execute(`
          INSERT INTO [pg_table] (airtable_id, /* columns */)
          VALUES ($1, /* values */)
          ON CONFLICT (airtable_id) DO UPDATE SET
            /* column = EXCLUDED.column, */
            updated_at = NOW()
        `, [data.airtable_id, /* values */]);
      }
    }

    console.log('Migration complete!');
  } finally {
    await postgres.close();
  }
}

main().catch(console.error);
```

---

## Validation Queries

### Check Record Counts
```bash
# Airtable count
curl -s -X POST http://127.0.0.1:8100/mcp/rpc \
  -d '{"jsonrpc":"2.0","method":"mcp.execute","params":{"service":"airtable","operation":"read-records","args":{"tableName":"courses"},"options":{"limit":1}},"id":"1"}' | jq '.result.data.recordCount'

# PostgreSQL count (ozean-licht-db)
curl -s -X POST http://127.0.0.1:8100/mcp/rpc \
  -d '{"jsonrpc":"2.0","method":"mcp.execute","params":{"service":"postgres","database":"ozean-licht-db","operation":"query","args":["SELECT COUNT(*) FROM courses"]},"id":"1"}' | jq '.result.data.rows[0].count'
```

### Verify Data
```bash
# Sample courses
curl -s -X POST http://127.0.0.1:8100/mcp/rpc \
  -d '{"jsonrpc":"2.0","method":"mcp.execute","params":{"service":"postgres","database":"ozean-licht-db","operation":"query","args":["SELECT title, slug, status, price_cents FROM courses LIMIT 5"]},"id":"1"}' | jq '.result.data.rows'
```

---

## Notes

### Database Configuration
All databases on same PostgreSQL server (iccc0wo0wkgsws4cowk4440c):
- **ozean-licht-db**: Content database (courses, videos, modules)
- **shared-users-db**: Auth/sessions (NextAuth)
- **kids-ascension-db**: Kids platform

External port: `localhost:32771` (maps to container :5432)

### Rate Limits
- Airtable: 5 requests/second per base
- Migration script includes 200ms delay between requests

### Rollback Strategy
1. All records have `airtable_id` for tracking
2. UPSERT allows re-running migrations safely
3. Original data preserved in `metadata` JSONB column

### Next Session: Continue Migration
1. Create standalone schema and migration for `course_modules` (modules table)
2. Create standalone schema and migration for `module_contents` (lessons table)
3. Then commerce tables: orders, transactions
4. Then users: members, team

**Important:** Each table needs TWO steps:
1. Create standalone SQL schema (no FK constraints to `users` table)
2. Create and run migration script

---

## Implementation Status

**Last Updated:** 2025-12-02

### Database Consolidation (COMPLETED 2025-12-02)

`shared-users-db` has been merged into `ozean-licht-db`. All auth + content now in single database.

**Before:**
```
shared-users-db → auth tables (admin_users, users, etc.)
ozean-licht-db  → content tables (courses, videos, etc.)
```

**After:**
```
ozean-licht-db → EVERYTHING (auth + content)
  ├── users, admin_users, admin_roles, admin_permissions (auth)
  ├── courses, videos (content)
  └── projects, tasks, process_templates (operations)
```

**Connection:** `OZEAN_LICHT_DB_URL` (single connection string for everything)

**To complete migration:**
1. Restart admin app: `cd apps/admin && pnpm dev`
2. Test login at http://localhost:9200/login
3. If working, drop shared-users-db: `docker exec iccc0wo0wkgsws4cowk4440c psql -U postgres -c "DROP DATABASE \"shared-users-db\";"`

---

| Phase | Tables | Status |
|-------|--------|--------|
| Content (Core) | courses, videos, modules, lessons | **2/4 migrated (courses + videos DONE)** |
| Content (Extended) | shorts, posts, blogs, light_segments | Not started |
| Commerce | orders, transactions, abos | Not started |
| Users | members, team | Not started |
| Projects | projects, tasks, milestones, templates | **3/4 migrated (projects + tasks + templates DONE)** |
| Calendar | events, connected_calendar | Not started |
| CRM | tickets, feedbacks, applications | Not started |
| Organization | departments, announcements | Not started |
| Low Priority | 6 tables | Not started |

**Total Progress:** 5/33 tables (15%) - migrated to ozean-licht-db

### Tables Created in ozean-licht-db
- [x] `courses` - 64 records (020_create_courses_standalone.sql)
- [x] `videos` - 571 records (021_create_videos_standalone.sql)
- [x] `process_templates` - 89 records (030_create_project_tables_standalone.sql)
- [x] `projects` - 658 records (030_create_project_tables_standalone.sql)
- [x] `tasks` - 9,114 records (030_create_project_tables_standalone.sql)
  - 8,216 tasks linked to projects via `project_id`
  - 898 orphan tasks (no project linked in Airtable)

### Admin Dashboard Integration
- [x] Direct PostgreSQL connection (no MCP dependency)
- [x] Environment variables configured
- [x] Courses page fetches from ozean-licht-db (64 records)
- [x] Videos page fetches from ozean-licht-db (571 records)
- [ ] Projects page (needs integration)
- [ ] Tasks page (needs integration)
- [ ] Modules, lessons pages (need migration first)
