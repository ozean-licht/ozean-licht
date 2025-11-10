# Plan: Admin Audit Logging Foundation (Spec 1.7)

## Task Description

Implement a comprehensive audit logging system for the Admin Dashboard that captures all admin actions with full context, provides a searchable/filterable audit log viewer, supports CSV export, and includes before/after state diffing. This is **Spec 1.7** from Phase 1 of the Admin Dashboard Roadmap - a P1 (Critical) specification that provides compliance tracking and transparency for all administrative operations.

## Objective

Build a production-ready audit logging infrastructure that:

1. **Captures** all admin actions automatically (create, update, delete, role changes, access grants)
2. **Records** actor, action, resource, timestamp, IP, user agent, and request metadata
3. **Displays** audit logs in a filterable, searchable DataTable with pagination
4. **Exports** audit logs to CSV for compliance reporting and offline analysis
5. **Shows** before/after state differences using JSON diffing
6. **Enforces** 90-day default retention policy with configurable extension
7. **Provides** role-based access to audit logs (super_admin sees all, entity admins see their scope)
8. **Integrates** seamlessly with existing MCP client operations

## Problem Statement

Currently, the admin dashboard has partial audit logging:
- ✅ Database schema exists (`admin_audit_logs` table)
- ✅ TypeScript types defined (`AdminAuditLog`, `CreateAuditLogInput`, `AuditLogFilters`)
- ✅ MCP client methods implemented (`createAuditLog`, `listAuditLogs`)
- ✅ Manual audit logging in some API routes (e.g., `/api/admin-users/[id]`)

However, critical gaps remain:
- ❌ **No audit log viewer** - No UI to view/search logs
- ❌ **No centralized middleware** - Each API route manually logs (inconsistent, error-prone)
- ❌ **No before/after diffing** - Can't see what changed
- ❌ **No CSV export** - Can't extract logs for compliance
- ❌ **No retention policy enforcement** - Logs grow unbounded
- ❌ **No automatic IP/user agent capture** - Metadata incomplete
- ❌ **Inconsistent metadata format** - No standard for `metadata` field

This creates compliance risks, makes troubleshooting difficult, and violates GDPR/audit trail requirements.

## Solution Approach

**Strategy:** Build a layered audit logging system with automatic capture, structured storage, and powerful querying.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: UI (Audit Log Viewer Page)                        │
│ - DataTable with filters (actor, action, entity, date)     │
│ - Detail modal with before/after diff                      │
│ - CSV export button                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: API Routes (/api/audit-logs)                      │
│ - GET /api/audit-logs (list with filters)                  │
│ - GET /api/audit-logs/[id] (detail view)                   │
│ - GET /api/audit-logs/export (CSV export)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Audit Helper (`lib/audit/logger.ts`)              │
│ - createAuditLog() - High-level wrapper                    │
│ - captureContext() - Extract IP, user agent, request ID    │
│ - createDiff() - JSON before/after diffing                 │
│ - auditAction() - Decorator/HOF for automatic logging      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: MCP Client (Already Implemented)                  │
│ - createAuditLog() - Database insert                       │
│ - listAuditLogs() - Query with filters                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Database: admin_audit_logs (PostgreSQL via MCP)            │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Centralized Audit Helper**: `lib/audit/logger.ts` provides reusable functions instead of duplicating logic in each API route
2. **Automatic Context Capture**: Extract IP, user agent, request ID from Next.js request headers
3. **JSON Diffing**: Use `diff` library to generate before/after state diffs stored in `metadata.changes`
4. **Standardized Metadata Format**:
   ```typescript
   metadata: {
     changes: { field: { old: value, new: value } },
     request: { ip, userAgent, requestId },
     context: { ... custom data ... }
   }
   ```
5. **Server-Side Pagination**: Audit logs can grow to 100k+ rows, require server-side pagination
6. **CSV Export**: Stream CSV generation for large exports (avoid memory issues)
7. **Retention Policy**: Background job (N8N cron) to delete logs older than 90 days

## Relevant Files

### Existing Files (To Modify)

- **`lib/mcp-client/queries.ts:366-474`** - Audit log MCP methods (already implemented, review only)
- **`types/admin.ts:96-140`** - Audit log TypeScript types (already implemented, extend if needed)
- **`types/database.ts:54-66`** - Database row types for audit logs (already implemented)
- **`migrations/001_create_admin_schema.sql:56-68`** - Database schema (already applied)
- **`app/(dashboard)/layout-client.tsx`** - Add "Audit Logs" to sidebar navigation
- **`components/dashboard/Sidebar.tsx`** - Add audit logs menu item

### New Files (To Create)

#### Core Audit Infrastructure
- **`lib/audit/logger.ts`** - Centralized audit logging helper with context capture and diffing
- **`lib/audit/diff.ts`** - JSON diffing utility for before/after state comparison
- **`lib/audit/constants.ts`** - Audit action constants and retention policy config
- **`lib/audit/types.ts`** - Extended audit types (AuditContext, DiffResult, etc.)

#### API Routes
- **`app/api/audit-logs/route.ts`** - GET list of audit logs with filters, pagination
- **`app/api/audit-logs/[id]/route.ts`** - GET single audit log detail
- **`app/api/audit-logs/export/route.ts`** - GET CSV export (streaming)

#### UI Components
- **`app/(dashboard)/audit/page.tsx`** - Main audit log viewer page (server component)
- **`app/(dashboard)/audit/[id]/page.tsx`** - Audit log detail page with diff viewer
- **`components/audit/AuditLogTable.tsx`** - Client component with DataTable and filters
- **`components/audit/AuditLogFilters.tsx`** - Filter controls (date range, action, entity)
- **`components/audit/AuditLogDetailModal.tsx`** - Modal showing full log with diff
- **`components/audit/DiffViewer.tsx`** - Before/after diff visualization
- **`components/audit/ActionBadge.tsx`** - Badge showing action type (create, update, delete)

#### Retention Policy
- **`scripts/cleanup-audit-logs.ts`** - Retention policy enforcement script (run via N8N cron)

## Implementation Phases

### Phase 1: Foundation (Core Infrastructure)
**Goal:** Build audit logging helper and standardize metadata format

1. Create `lib/audit/constants.ts` with action constants
2. Create `lib/audit/types.ts` with extended types
3. Create `lib/audit/diff.ts` with JSON diffing logic
4. Create `lib/audit/logger.ts` with helper functions
5. Add tests for diffing and context capture

### Phase 2: API Routes (Data Access Layer)
**Goal:** Provide HTTP endpoints for fetching audit logs

1. Create `app/api/audit-logs/route.ts` (list with filters)
2. Create `app/api/audit-logs/[id]/route.ts` (detail view)
3. Create `app/api/audit-logs/export/route.ts` (CSV export)
4. Add request validation with Zod schemas
5. Add role-based access control (filter by entity scope)

### Phase 3: UI Components (Viewer & Filters)
**Goal:** Build user-facing audit log viewer

1. Create `components/audit/ActionBadge.tsx`
2. Create `components/audit/DiffViewer.tsx`
3. Create `components/audit/AuditLogFilters.tsx`
4. Create `components/audit/AuditLogDetailModal.tsx`
5. Create `components/audit/AuditLogTable.tsx` (with DataTable)
6. Add to Sidebar navigation

### Phase 4: Integration & Testing
**Goal:** Integrate into existing API routes and test end-to-end

1. Update `/api/admin-users/[id]` to use new audit helper
2. Add audit logging to future user management endpoints
3. Test full workflow: action → log → viewer → export
4. Test role-based filtering (entity admins see only their scope)
5. Performance test with 10k+ audit log records

### Phase 5: Retention Policy
**Goal:** Implement automated log cleanup

1. Create `scripts/cleanup-audit-logs.ts`
2. Configure N8N cron workflow (daily at 2 AM UTC)
3. Add environment variable `AUDIT_RETENTION_DAYS` (default: 90)
4. Test retention policy with old test data

## Step by Step Tasks

### 1. Create Audit Constants and Types

- Create `lib/audit/constants.ts`:
  ```typescript
  export const AUDIT_ACTIONS = {
    // User Management
    USER_CREATE: 'user.create',
    USER_UPDATE: 'user.update',
    USER_DELETE: 'user.delete',
    USER_ROLE_CHANGE: 'user.role_change',
    USER_ENTITY_ACCESS_GRANT: 'user.entity_access_grant',
    USER_ENTITY_ACCESS_REVOKE: 'user.entity_access_revoke',
    USER_DEACTIVATE: 'user.deactivate',
    USER_REACTIVATE: 'user.reactivate',
    // ... more actions
  } as const;

  export const AUDIT_RETENTION_DAYS = 90;
  ```

- Create `lib/audit/types.ts`:
  ```typescript
  export interface AuditContext {
    ip?: string;
    userAgent?: string;
    requestId: string;
  }

  export interface DiffResult {
    [field: string]: {
      old: any;
      new: any;
    };
  }

  export interface AuditMetadata {
    changes?: DiffResult;
    request?: AuditContext;
    context?: Record<string, any>;
  }
  ```

### 2. Create JSON Diff Utility

- Create `lib/audit/diff.ts`:
  ```typescript
  export function createDiff(before: Record<string, any>, after: Record<string, any>): DiffResult
  ```
- Install `diff` package: `pnpm add diff @types/diff`
- Implement field-level diffing (skip unchanged fields)
- Handle nested objects, arrays, nulls
- Add unit tests for various scenarios

### 3. Create Audit Logger Helper

- Create `lib/audit/logger.ts`:
  ```typescript
  export async function createAuditLog(params: {...})
  export function captureContext(request: NextRequest): AuditContext
  export function auditAction(action: string, options: {...})
  ```
- Implement `captureContext()` to extract IP, user agent from Next.js headers
- Implement `createAuditLog()` wrapper around MCP client
- Implement `auditAction()` higher-order function for API route decoration
- Add JSDoc comments for all exports

### 4. Create Audit Logs API Route (List)

- Create `app/api/audit-logs/route.ts`:
  ```typescript
  GET /api/audit-logs?adminUserId=...&action=...&startDate=...&endDate=...&page=1&limit=50
  ```
- Require authentication (any admin role)
- Filter by entity scope if not super_admin
- Validate query params with Zod schema
- Return paginated results with total count
- Add error handling and logging

### 5. Create Audit Log Detail API Route

- Create `app/api/audit-logs/[id]/route.ts`:
  ```typescript
  GET /api/audit-logs/{id}
  ```
- Require authentication
- Check entity scope access
- Return full audit log with parsed metadata
- Handle not found (404)

### 6. Create CSV Export API Route

- Create `app/api/audit-logs/export/route.ts`:
  ```typescript
  GET /api/audit-logs/export?filters=...
  ```
- Require super_admin or support role
- Stream CSV generation (handle 10k+ rows)
- Include all fields: timestamp, actor, action, entity, IP, changes
- Set Content-Disposition header for download
- Use `csv-stringify` package: `pnpm add csv-stringify`

### 7. Create ActionBadge Component

- Create `components/audit/ActionBadge.tsx`:
  ```tsx
  <ActionBadge action="user.create" /> // Green badge
  <ActionBadge action="user.delete" /> // Red badge
  <ActionBadge action="user.update" /> // Blue badge
  ```
- Use shadcn/ui Badge component
- Color-code by action type (create=green, update=blue, delete=red, read=gray)
- Show icon + label
- Export from `components/audit/index.ts`

### 8. Create DiffViewer Component

- Create `components/audit/DiffViewer.tsx`:
  ```tsx
  <DiffViewer diff={changes} />
  ```
- Display before/after state side-by-side
- Highlight changed fields (green for added, red for removed, yellow for modified)
- Handle nested objects, arrays
- Use `react-diff-view` or custom implementation
- Add "Show all fields" toggle (show unchanged fields)

### 9. Create AuditLogFilters Component

- Create `components/audit/AuditLogFilters.tsx`:
  ```tsx
  <AuditLogFilters onFilterChange={(filters) => {...}} />
  ```
- Include filters:
  - Date range picker (start/end dates)
  - Action type select (dropdown with all actions)
  - Entity type select (user, course, video, etc.)
  - Actor search (admin user ID or email)
- Use shadcn/ui Form components
- Integrate with DataTable column filters
- Add "Clear filters" button

### 10. Create AuditLogDetailModal Component

- Create `components/audit/AuditLogDetailModal.tsx`:
  ```tsx
  <AuditLogDetailModal log={auditLog} open={true} onClose={() => {...}} />
  ```
- Show full audit log details:
  - Actor (admin user email + role)
  - Action (with badge)
  - Entity (type + ID)
  - Timestamp (formatted)
  - IP address, user agent
  - Request ID (for correlation)
  - Before/after diff (using DiffViewer)
- Use shadcn/ui Dialog component
- Add "Copy request ID" button

### 11. Create AuditLogTable Component

- Create `components/audit/AuditLogTable.tsx`:
  ```tsx
  'use client';
  <AuditLogTable logs={logs} totalPages={10} />
  ```
- Use DataTable component from Spec 1.3
- Define columns:
  - Timestamp (sortable)
  - Actor (admin email + role badge)
  - Action (ActionBadge component)
  - Entity (type + ID link)
  - IP Address
  - Actions (View Details button → opens modal)
- Enable server-side pagination
- Enable sorting by timestamp, action
- Enable filtering via AuditLogFilters
- Add CSV export button in toolbar

### 12. Create Audit Log Viewer Page

- Create `app/(dashboard)/audit/page.tsx`:
  ```tsx
  export default async function AuditLogsPage({ searchParams }) {...}
  ```
- Server component
- Require super_admin or support role (read-only audit access)
- Parse search params (page, filters)
- Fetch audit logs from API
- Render AuditLogTable with server-side data
- Add breadcrumb: Dashboard > Audit Logs
- Add page header with description

### 13. Create Audit Log Detail Page

- Create `app/(dashboard)/audit/[id]/page.tsx`:
  ```tsx
  export default async function AuditLogDetailPage({ params }) {...}
  ```
- Server component
- Fetch single audit log
- Display full details (similar to modal, but full page)
- Show DiffViewer for changes
- Add "Back to Audit Logs" link
- Add breadcrumb: Dashboard > Audit Logs > {timestamp}

### 14. Add Audit Logs to Sidebar Navigation

- Update `components/dashboard/Sidebar.tsx`:
  - Add "Audit Logs" menu item under "System" section
  - Icon: Shield or Eye icon from lucide-react
  - Route: `/dashboard/audit`
  - Visible to: super_admin, support roles only

- Update `app/(dashboard)/layout-client.tsx`:
  - Add "Audit Logs" to navigation structure
  - Define breadcrumb label

### 15. Integrate Audit Logger into Existing API Routes

- Update `app/api/admin-users/[id]/route.ts`:
  - Replace manual `mcpClient.createAuditLog()` with `auditLogger.createAuditLog()`
  - Use `captureContext()` to extract IP/user agent
  - Use `createDiff()` to generate before/after state
  - Pass request object to audit helper

- Pattern for future API routes:
  ```typescript
  import { createAuditLog, captureContext, createDiff } from '@/lib/audit/logger';

  // Before mutation
  const before = await mcpClient.getAdminUserById(id);

  // Perform mutation
  const after = await mcpClient.updateAdminUser(id, data);

  // Audit log
  await createAuditLog({
    request,
    session,
    action: AUDIT_ACTIONS.USER_UPDATE,
    entityType: 'admin_users',
    entityId: id,
    metadata: {
      changes: createDiff(before, after),
    },
  });
  ```

### 16. Create Retention Policy Script

- Create `scripts/cleanup-audit-logs.ts`:
  ```typescript
  async function cleanupOldAuditLogs() {
    const retentionDays = process.env.AUDIT_RETENTION_DAYS || 90;
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    const deletedCount = await mcpClient.execute(
      'DELETE FROM admin_audit_logs WHERE created_at < $1',
      [cutoffDate]
    );

    console.log(`Deleted ${deletedCount} audit logs older than ${retentionDays} days`);
  }
  ```

- Add to `package.json` scripts:
  ```json
  "scripts": {
    "cleanup:audit-logs": "tsx scripts/cleanup-audit-logs.ts"
  }
  ```

- Configure N8N workflow (separate task, not in this spec):
  - Trigger: Cron (daily at 2 AM UTC)
  - Action: HTTP Request to script or direct DB query
  - Notification: Send alert if deletion fails

### 17. Add Environment Variables

- Update `.env.example`:
  ```
  # Audit Logging
  AUDIT_RETENTION_DAYS=90  # Days to keep audit logs (default: 90)
  ```

- Document in `README.md` under "Environment Variables"

### 18. Write Tests

- Create `tests/lib/audit/diff.test.ts`:
  - Test field-level diffing
  - Test nested objects
  - Test arrays
  - Test null/undefined handling

- Create `tests/lib/audit/logger.test.ts`:
  - Test context capture
  - Test audit log creation
  - Mock MCP client

- Create `tests/api/audit-logs.test.ts`:
  - Test GET /api/audit-logs (list)
  - Test pagination
  - Test filtering
  - Test role-based access control

## Testing Strategy

### Unit Tests
- **Diff utility**: Test all edge cases (nested objects, arrays, nulls, circular refs)
- **Context capture**: Mock Next.js request headers
- **Audit logger**: Mock MCP client, verify correct parameters

### Integration Tests
- **API routes**: Test with real MCP Gateway (dev mode)
- **Pagination**: Create 100 test logs, verify page 1, 2, 3
- **Filtering**: Verify filters work correctly
- **CSV export**: Generate export, parse CSV, verify row count

### E2E Tests (Manual)
1. **Create audit log**: Update admin user role → verify log created
2. **View audit logs**: Navigate to `/dashboard/audit` → see logs
3. **Filter logs**: Filter by action type → verify results
4. **View detail**: Click "View Details" → see modal with diff
5. **Export CSV**: Click export → download and verify file
6. **Role filtering**: Login as ka_admin → verify only sees kids_ascension logs

### Performance Tests
- **Load 10k logs**: Insert 10,000 audit logs → verify page load < 2s
- **Export 10k logs**: Export 10,000 logs → verify streaming works (no memory spike)
- **Filter performance**: Filter 10k logs by date range → verify query < 500ms

## Acceptance Criteria

### Functional Requirements
- [ ] All admin actions logged with full context (actor, action, resource, timestamp, IP, user agent)
- [ ] Audit log viewer displays logs in DataTable with pagination
- [ ] Filters work: action type, entity type, date range, actor
- [ ] Sorting works: timestamp (default: descending)
- [ ] Detail modal shows before/after diff for update actions
- [ ] CSV export generates downloadable file with all fields
- [ ] Role-based access: super_admin sees all, entity admins see their scope only
- [ ] Retention policy script deletes logs older than 90 days

### Non-Functional Requirements
- [ ] Audit log viewer loads in < 2s (1000+ logs)
- [ ] CSV export streams data (handles 10k+ rows without memory issues)
- [ ] Database queries use indexes (created_at, admin_user_id, action)
- [ ] No sensitive data in logs (e.g., passwords, tokens)
- [ ] All audit log operations audited (meta-auditing: who viewed logs)
- [ ] TypeScript strict mode compliance (no `any` types)
- [ ] Accessibility: keyboard navigation, screen reader support

### Code Quality
- [ ] All new code has JSDoc comments
- [ ] Unit tests for diff, logger, API routes
- [ ] Integration tests for end-to-end workflows
- [ ] Error handling for all failure modes (DB errors, auth failures)
- [ ] Consistent code style (Prettier, ESLint)

## Validation Commands

Execute these commands to validate the task is complete:

### 1. Type Checking
```bash
cd apps/admin
pnpm run type-check
```
**Expected:** No TypeScript errors

### 2. Run Unit Tests
```bash
pnpm test lib/audit
```
**Expected:** All tests pass (diff, logger, context capture)

### 3. Run API Tests
```bash
pnpm test api/audit-logs
```
**Expected:** All tests pass (list, detail, export, role filtering)

### 4. Start Dev Server
```bash
pnpm --filter admin dev
```
**Expected:** Server starts on port 9200

### 5. Verify MCP Gateway Connection
```bash
curl http://localhost:8100/health
```
**Expected:** `{"status": "ok"}`

### 6. Create Test Audit Log
```bash
# In Next.js API route or test script
curl -X POST http://localhost:9200/api/test/create-audit-log \
  -H "Content-Type: application/json" \
  -d '{"action": "test.action"}'
```
**Expected:** 201 Created with log ID

### 7. Fetch Audit Logs
```bash
curl http://localhost:9200/api/audit-logs?limit=10
```
**Expected:** JSON response with audit logs array

### 8. Export CSV
```bash
curl http://localhost:9200/api/audit-logs/export -o audit-logs.csv
head -n 5 audit-logs.csv
```
**Expected:** CSV file with headers and data rows

### 9. Check Database Indexes
```bash
# Via MCP Gateway or direct psql
SELECT indexname FROM pg_indexes WHERE tablename = 'admin_audit_logs';
```
**Expected:** Indexes on `admin_user_id`, `action`, `entity_type`, `entity_id`, `created_at`

### 10. Verify Retention Policy Script
```bash
pnpm run cleanup:audit-logs
```
**Expected:** Script runs, logs deletion count

### 11. Manual UI Test
1. Navigate to `http://localhost:9200/dashboard/audit`
2. Verify audit logs table renders
3. Test filters (date range, action type)
4. Click "View Details" on a log
5. Verify diff viewer shows changes
6. Click "Export CSV"
7. Verify file downloads

**Expected:** All UI interactions work without errors

### 12. Lint Check
```bash
pnpm run lint
```
**Expected:** No linting errors

## Notes

### Dependencies
- **`diff`** (`^5.x.x`) - JSON diffing for before/after state comparison
- **`csv-stringify`** (`^6.x.x`) - CSV generation for export functionality
- **`date-fns`** (already installed) - Date formatting in UI
- **`zod`** (already installed) - Request validation

Install via:
```bash
cd apps/admin
pnpm add diff csv-stringify
pnpm add -D @types/diff
```

### Security Considerations
1. **Never log sensitive data**: Passwords, tokens, API keys, credit card numbers
2. **Sanitize metadata**: Strip sensitive fields before logging
3. **Role-based access**: Enforce entity scope filtering for non-super_admin users
4. **Audit log immutability**: No UPDATE or DELETE operations on `admin_audit_logs` (except retention policy)
5. **Meta-auditing**: Log who viewed/exported audit logs (future enhancement)

### Performance Optimization
1. **Database indexes**: Already created in migration (lines 96-100)
2. **Pagination**: Always use LIMIT/OFFSET or cursor-based pagination
3. **Streaming CSV**: Use Node.js streams to avoid loading all data in memory
4. **Selective fields**: Only fetch required columns in list view (exclude large `metadata` field)

### Future Enhancements (Out of Scope)
- Real-time audit log streaming (WebSocket or SSE)
- Audit log alerts (email on suspicious actions)
- Advanced search (full-text search on metadata)
- Audit log retention policy UI (configure per-entity)
- External audit log export (S3, CloudWatch, Elasticsearch)

### Implementation Order Rationale
1. **Foundation first**: Build diff, logger, types before UI
2. **API before UI**: Validate data layer before building UI
3. **UI components**: Build reusable components before pages
4. **Integration last**: Wire up existing routes after infrastructure is solid
5. **Retention policy last**: Non-blocking, can be added post-deployment

### Database Considerations
- **Retention policy**: 90 days default balances compliance (30-90 days typical) with storage costs
- **Index maintenance**: Monitor `admin_audit_logs` index bloat, consider monthly REINDEX
- **Partitioning**: For 1M+ logs, consider table partitioning by month (future optimization)
- **Archival**: Consider archiving old logs to S3 before deletion (compliance requirement)

### Related Specifications
- **Spec 1.3**: Admin Data Tables Foundation (DataTable component used here)
- **Spec 1.4**: Admin Basic RBAC (role-based audit log filtering)
- **Spec 1.5**: Admin User Management List (audit logs for user actions)
- **Spec 1.6**: Admin User Management Actions (actions to be audited)

### Cross-References
- **Roadmap**: `apps/admin/docs/admin-dashboard-roadmap.md` (Phase 1, lines 83-84)
- **Specs List**: `apps/admin/docs/ROADMAP-SPECS-LIST.md` (Spec 1.7, lines 170-190)
- **Database Schema**: `apps/admin/migrations/001_create_admin_schema.sql` (lines 54-68)
- **MCP Client**: `apps/admin/lib/mcp-client/queries.ts` (lines 366-474)

---

**Document Version:** 1.0
**Created:** 2025-11-09
**Status:** Ready for Implementation
**Estimated Effort:** 24 hours
**Priority:** P1 (Critical)
**Dependencies:** Spec 1.6 (User Management Actions)
**Blocks:** Phase 2+ (all features need audit logging)
