# Admin Dashboard Audit Log Foundation - Implementation Spec

**Feature:** Comprehensive Audit Logging System
**Issue:** TBD
**ADW Type:** /feature
**Estimated Complexity:** Medium
**Target:** Week 1 - Day 5

---

## Overview

Implement a comprehensive audit logging system that tracks all admin actions across both Kids Ascension and Ozean Licht entities. This provides complete visibility, accountability, and compliance for all administrative operations.

### Goals
- Centralized audit logging for all admin actions
- Entity-aware logging (track which entity was affected)
- Rich context capture (IP address, user agent, changes made)
- Searchable and filterable audit log viewer
- Automatic logging integrated into all admin operations
- Real-time audit log display with pagination

### Success Criteria
- All admin actions automatically logged
- Audit log viewer page with filtering capabilities
- Filters work: date range, admin user, action type, entity
- Pagination handles large datasets efficiently
- Login, logout, and entity switch actions logged
- Performance: Log writes complete in <50ms
- Audit logs cannot be modified or deleted

---

## Database Foundation

The `admin_audit_logs` table is already created from Day 1-2 (Issue #1):

```sql
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admins(id) NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL CHECK (entity IN ('kids_ascension', 'ozean_licht', 'shared')),
  resource_type TEXT,
  resource_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_audit_log_admin ON admin_audit_logs(admin_id);
CREATE INDEX idx_audit_log_entity ON admin_audit_logs(entity);
CREATE INDEX idx_audit_log_action ON admin_audit_logs(action);
CREATE INDEX idx_audit_log_created ON admin_audit_logs(created_at DESC);
```

---

## Technical Approach

### 1. Audit Log Actions Taxonomy

**Authentication Actions:**
- `admin.login` - User logged in
- `admin.logout` - User logged out
- `admin.login_failed` - Login attempt failed
- `admin.session_expired` - Session expired

**Navigation Actions:**
- `admin.entity_switched` - User switched between entities
- `admin.page_viewed` - User viewed a page

**User Management Actions (Future):**
- `user.viewed` - Viewed user details
- `user.created` - Created new user
- `user.updated` - Modified user data
- `user.deleted` - Deleted user

**Content Actions (Future):**
- `video.viewed` - Viewed video details
- `video.approved` - Approved video for publishing
- `video.rejected` - Rejected video

**Settings Actions (Future):**
- `settings.updated` - Modified system settings
- `role.assigned` - Assigned role to admin
- `permission.granted` - Granted permission

### 2. Audit Logger Design

```typescript
interface AuditLogEntry {
  adminId: string
  action: string
  entity: 'kids_ascension' | 'ozean_licht' | 'shared'
  resourceType?: string
  resourceId?: string
  changes?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  durationMs?: number
}

// Simple logging interface
await auditLog({
  action: 'user.viewed',
  entity: 'kids_ascension',
  resourceType: 'user',
  resourceId: 'user-uuid'
})
```

### 3. Query and Filter Design

```typescript
interface AuditLogFilters {
  adminId?: string
  action?: string
  entity?: 'kids_ascension' | 'ozean_licht' | 'shared' | 'all'
  startDate?: Date
  endDate?: Date
  page?: number
  pageSize?: number
}

interface AuditLogResult {
  logs: AuditLogEntry[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

---

## Implementation Steps

### Step 1: Create Audit Logger Library

**File: `lib/audit-logger.ts`**
```typescript
import { AdminMCPClient } from './mcp-client'
import { getCurrentAdmin } from './auth-utils'
import { headers } from 'next/headers'

export interface AuditLogData {
  action: string
  entity: 'kids_ascension' | 'ozean_licht' | 'shared'
  resourceType?: string
  resourceId?: string
  changes?: Record<string, any>
  durationMs?: number
}

export async function auditLog(data: AuditLogData): Promise<void> {
  try {
    // Get current admin from session
    const admin = await getCurrentAdmin()

    // Get request headers for IP and user agent
    const headersList = headers()
    const ipAddress = headersList.get('x-forwarded-for') ||
                     headersList.get('x-real-ip') ||
                     null
    const userAgent = headersList.get('user-agent') || null

    // Create audit log entry
    const client = new AdminMCPClient()
    await client.createAuditLog({
      admin_id: admin.id,
      action: data.action,
      entity: data.entity,
      resource_type: data.resourceType || null,
      resource_id: data.resourceId || null,
      changes: data.changes ? JSON.stringify(data.changes) : null,
      ip_address: ipAddress,
      user_agent: userAgent,
      duration_ms: data.durationMs || null
    })
  } catch (error) {
    // Log error but don't throw - audit logging should never break the main flow
    console.error('[Audit Log] Failed to log action:', error)
  }
}

// Helper for tracking operation duration
export async function auditLogWithTiming<T>(
  data: Omit<AuditLogData, 'durationMs'>,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = Date.now()

  try {
    const result = await operation()
    const durationMs = Date.now() - startTime

    await auditLog({ ...data, durationMs })

    return result
  } catch (error) {
    const durationMs = Date.now() - startTime
    await auditLog({ ...data, durationMs })
    throw error
  }
}
```

**File: `lib/audit-logger/actions.ts`**
```typescript
// Pre-defined audit log helpers for common actions

import { auditLog } from '../audit-logger'

export async function logLogin(adminId: string) {
  await auditLog({
    action: 'admin.login',
    entity: 'shared'
  })
}

export async function logLogout(adminId: string) {
  await auditLog({
    action: 'admin.logout',
    entity: 'shared'
  })
}

export async function logEntitySwitch(
  entity: 'kids_ascension' | 'ozean_licht'
) {
  await auditLog({
    action: 'admin.entity_switched',
    entity
  })
}

export async function logPageView(
  path: string,
  entity: 'kids_ascension' | 'ozean_licht' | 'shared'
) {
  await auditLog({
    action: 'admin.page_viewed',
    entity,
    changes: { path }
  })
}
```

### Step 2: Extend MCP Client with Audit Queries

Add to `lib/mcp-client/queries.ts`:

```typescript
import { AdminMCPClient } from './client'

export interface AuditLogFilters {
  adminId?: string
  action?: string
  entity?: 'kids_ascension' | 'ozean_licht' | 'shared' | 'all'
  startDate?: string // ISO date string
  endDate?: string // ISO date string
  page?: number
  pageSize?: number
}

export interface AuditLogEntry {
  id: string
  admin_id: string
  admin_email: string // Joined from admins table
  action: string
  entity: string
  resource_type: string | null
  resource_id: string | null
  changes: any | null
  ip_address: string | null
  user_agent: string | null
  duration_ms: number | null
  created_at: string
}

export interface AuditLogResult {
  logs: AuditLogEntry[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export async function getAuditLogs(
  filters: AuditLogFilters
): Promise<AuditLogResult> {
  const client = new AdminMCPClient()

  const page = filters.page || 1
  const pageSize = filters.pageSize || 50
  const offset = (page - 1) * pageSize

  // Build WHERE conditions
  const conditions: string[] = ['1=1']
  const params: any[] = []
  let paramIndex = 1

  if (filters.adminId) {
    conditions.push(`al.admin_id = $${paramIndex}`)
    params.push(filters.adminId)
    paramIndex++
  }

  if (filters.action) {
    conditions.push(`al.action ILIKE $${paramIndex}`)
    params.push(`%${filters.action}%`)
    paramIndex++
  }

  if (filters.entity && filters.entity !== 'all') {
    conditions.push(`al.entity = $${paramIndex}`)
    params.push(filters.entity)
    paramIndex++
  }

  if (filters.startDate) {
    conditions.push(`al.created_at >= $${paramIndex}`)
    params.push(filters.startDate)
    paramIndex++
  }

  if (filters.endDate) {
    conditions.push(`al.created_at <= $${paramIndex}`)
    params.push(filters.endDate)
    paramIndex++
  }

  const whereClause = conditions.join(' AND ')

  // Get total count
  const countQuery = `
    SELECT COUNT(*) as total
    FROM admin_audit_logs al
    WHERE ${whereClause}
  `
  const countResult = await client.executeRawQuery('shared_users_db', countQuery, params)
  const total = parseInt(countResult[0]?.total || '0')

  // Get paginated logs with admin email
  const logsQuery = `
    SELECT
      al.id,
      al.admin_id,
      a.email as admin_email,
      al.action,
      al.entity,
      al.resource_type,
      al.resource_id,
      al.changes,
      al.ip_address,
      al.user_agent,
      al.duration_ms,
      al.created_at
    FROM admin_audit_logs al
    JOIN admins a ON al.admin_id = a.id
    WHERE ${whereClause}
    ORDER BY al.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `
  const logs = await client.executeRawQuery(
    'shared_users_db',
    logsQuery,
    [...params, pageSize, offset]
  )

  return {
    logs,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}
```

### Step 3: Create Audit Log Viewer Components

**File: `components/audit/AuditLogTable.tsx`**
```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AuditLogEntry } from '@/lib/mcp-client/queries'
import { formatDistanceToNow } from 'date-fns'

interface AuditLogTableProps {
  logs: AuditLogEntry[]
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const getActionColor = (action: string) => {
    if (action.includes('login')) return 'bg-blue-500'
    if (action.includes('created')) return 'bg-green-500'
    if (action.includes('updated')) return 'bg-yellow-500'
    if (action.includes('deleted')) return 'bg-red-500'
    return 'bg-slate-500'
  }

  const getEntityColor = (entity: string) => {
    switch (entity) {
      case 'kids_ascension':
        return 'bg-purple-500'
      case 'ozean_licht':
        return 'bg-cyan-500'
      case 'shared':
        return 'bg-slate-500'
      default:
        return 'bg-slate-500'
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-slate-500">
                No audit logs found
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm">
                  <div>{new Date(log.created_at).toLocaleString()}</div>
                  <div className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(log.created_at), {
                      addSuffix: true
                    })}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {log.admin_email}
                </TableCell>
                <TableCell>
                  <Badge className={getActionColor(log.action)}>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getEntityColor(log.entity)}>
                    {log.entity}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {log.resource_type && (
                    <div>
                      <div className="font-medium">{log.resource_type}</div>
                      {log.resource_id && (
                        <div className="text-xs text-slate-500">
                          {log.resource_id.slice(0, 8)}...
                        </div>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {log.ip_address || '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {log.duration_ms ? `${log.duration_ms}ms` : '-'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
```

**File: `components/audit/AuditLogFilters.tsx`**
```typescript
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface AuditLogFiltersProps {
  filters: {
    action: string
    entity: string
    startDate: string
    endDate: string
  }
  onFiltersChange: (filters: any) => void
  onReset: () => void
}

export function AuditLogFilters({
  filters,
  onFiltersChange,
  onReset
}: AuditLogFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="action">Action</Label>
        <Input
          id="action"
          placeholder="e.g., admin.login"
          value={filters.action}
          onChange={(e) =>
            onFiltersChange({ ...filters, action: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="entity">Entity</Label>
        <Select
          value={filters.entity}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, entity: value })
          }
        >
          <SelectTrigger id="entity">
            <SelectValue placeholder="All entities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            <SelectItem value="kids_ascension">Kids Ascension</SelectItem>
            <SelectItem value="ozean_licht">Ozean Licht</SelectItem>
            <SelectItem value="shared">Shared</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            onFiltersChange({ ...filters, startDate: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            onFiltersChange({ ...filters, endDate: e.target.value })
          }
        />
      </div>

      <div className="flex items-end md:col-span-4">
        <Button variant="outline" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
```

**File: `components/audit/AuditLogPagination.tsx`**
```typescript
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AuditLogPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function AuditLogPagination({
  page,
  totalPages,
  onPageChange
}: AuditLogPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
```

### Step 4: Create Audit Log Page

**File: `app/(dashboard)/audit/page.tsx`**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { AuditLogTable } from '@/components/audit/AuditLogTable'
import { AuditLogFilters } from '@/components/audit/AuditLogFilters'
import { AuditLogPagination } from '@/components/audit/AuditLogPagination'
import { Skeleton } from '@/components/ui/skeleton'
import { getAuditLogs, AuditLogResult } from '@/lib/mcp-client/queries'

export default function AuditLogPage() {
  const [data, setData] = useState<AuditLogResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    action: '',
    entity: 'all',
    startDate: '',
    endDate: '',
    page: 1
  })

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const result = await getAuditLogs({
        action: filters.action || undefined,
        entity: filters.entity as any,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page: filters.page,
        pageSize: 50
      })
      setData(result)
    } catch (error) {
      console.error('Failed to fetch audit logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [filters])

  const handleFiltersChange = (newFilters: any) => {
    setFilters({ ...newFilters, page: 1 })
  }

  const handleResetFilters = () => {
    setFilters({
      action: '',
      entity: 'all',
      startDate: '',
      endDate: '',
      page: 1
    })
  }

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Log</h1>
        <p className="text-slate-600 mt-2">
          Complete history of all administrative actions
        </p>
      </div>

      <AuditLogFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <>
          {data && (
            <>
              <div className="text-sm text-slate-600">
                Found {data.total} log {data.total === 1 ? 'entry' : 'entries'}
              </div>
              <AuditLogTable logs={data.logs} />
              <AuditLogPagination
                page={data.page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}
```

### Step 5: Integrate Audit Logging

**Update `lib/auth/config.ts`** to log authentication events:

```typescript
// In authorize callback, after successful login:
await mcpClient.createAuditLog({
  admin_id: admin.id,
  action: 'admin.login',
  entity: 'shared',
  resource_type: 'session',
  resource_id: admin.id,
  changes: null,
  ip_address: null,
  user_agent: null
})
```

**Update `components/auth/LogoutButton.tsx`** to log logout:

```typescript
import { auditLog } from '@/lib/audit-logger'

export function LogoutButton() {
  const handleLogout = async () => {
    await auditLog({
      action: 'admin.logout',
      entity: 'shared'
    })
    await signOut({ callbackUrl: '/login' })
  }

  return <Button onClick={handleLogout}>Logout</Button>
}
```

---

## Testing Requirements

### Unit Tests

**File: `tests/unit/audit/audit-logger.test.ts`**
- Test audit log entry creation
- Test timing wrapper
- Test error handling (logging failures shouldn't break main flow)

### Integration Tests

**File: `tests/integration/audit-log.test.ts`**
- Test audit log filters
- Test pagination
- Test date range queries
- Test action search

### Manual Testing Checklist

1. **Logging**
   - [ ] Login action logged with IP and user agent
   - [ ] Logout action logged
   - [ ] Entity switch logged
   - [ ] Page views logged (if implemented)

2. **Viewer**
   - [ ] Audit logs display in table
   - [ ] Pagination works correctly
   - [ ] Filters work: action, entity, date range
   - [ ] Reset button clears all filters

3. **Performance**
   - [ ] Page loads within 2 seconds
   - [ ] Filtering is responsive
   - [ ] Pagination doesn't cause lag
   - [ ] Large result sets handled gracefully

4. **Data Integrity**
   - [ ] All required fields populated
   - [ ] Timestamps accurate
   - [ ] IP addresses captured correctly
   - [ ] JSON changes field parses correctly

---

## Security Considerations

### 1. Immutability
- Audit logs should **never be deleted or modified**
- Consider read-only database role for audit log queries
- Future: Archive old logs to cold storage after 1 year

### 2. Sensitive Data
- **Never log passwords** or authentication tokens
- **Mask PII** in changes field if necessary
- Be careful logging full request/response bodies

### 3. Access Control
- Only admins with proper permissions can view audit logs
- Consider separate "auditor" role for compliance team
- Viewing audit logs should itself be logged

---

## Dependencies

**Required:**
- `date-fns` - Date formatting and relative time

**Shadcn Components:**
- `table` - Audit log table
- `badge` - Action and entity badges
- `input` - Filter inputs
- `select` - Entity dropdown
- `button` - Pagination and reset buttons
- `skeleton` - Loading states

**Icons:**
- `lucide-react` for ChevronLeft, ChevronRight

---

## Future Enhancements

- Export audit logs to CSV
- Advanced search with full-text search
- Audit log analytics dashboard
- Suspicious activity detection
- Email notifications for critical actions
- Audit log retention policies
- Compliance reports (GDPR, SOC2)

---

## Notes

- Consider implementing a separate read-replica for audit log queries at scale
- Audit logs should be backed up separately from main database
- Future compliance: Ensure audit logs meet GDPR, SOC2 requirements

---

**Spec Version:** 1.0
**Created:** 2025-10-24
**Status:** Ready for Implementation
