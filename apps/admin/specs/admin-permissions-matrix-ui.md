# Plan: Admin Permissions Matrix UI (Spec 1.8)

## Task Description

Build an advanced permissions management interface that visualizes and enables editing of the permission matrix (role × permission grid), custom per-user permission overrides, permission inheritance visualization, and comprehensive audit logging for all permission changes. This is **Spec 1.8** from Phase 1 of the Admin Dashboard Roadmap - a P2 (Important) specification that provides granular permission management beyond basic role-based access control.

## Objective

Create a production-ready permissions management system that:

1. **Visualizes** the permission matrix as a role × permission grid with checkboxes
2. **Displays** default role permissions alongside custom user permissions
3. **Enables** super_admin to assign custom permissions to individual admin users
4. **Shows** permission inheritance (role defaults + user overrides + wildcards)
5. **Validates** permission changes (prevent privilege escalation, enforce entity scope)
6. **Audits** all permission changes with before/after state diffing
7. **Provides** permission search/filter by category, entity scope, action type
8. **Exports** permission matrix to CSV for documentation and compliance

## Problem Statement

The current RBAC implementation (Spec 1.4) provides:
- ✅ Four predefined roles (super_admin, ka_admin, ol_admin, support)
- ✅ Default permissions per role defined in `ROLE_CONFIG`
- ✅ Route-based access control using `canAccessRoute()`
- ✅ Permission storage in `admin_users.permissions` (JSON array)
- ✅ Permission checking with wildcard support (`*`, `category.*`, `*.action`)
- ✅ Database schema with `admin_permissions` table (14 seed permissions)

However, critical gaps exist:
- ❌ **No permission UI** - Cannot view or edit permissions beyond role assignment
- ❌ **No custom permissions** - Cannot grant/revoke specific permissions to individual users
- ❌ **No permission visualization** - Cannot see full permission matrix
- ❌ **No inheritance display** - Cannot distinguish role defaults from user overrides
- ❌ **Limited permissions** - Only 14 seed permissions (need comprehensive CRUD for all resources)
- ❌ **No permission categories UI** - Cannot filter by category (users, content, courses, system)
- ❌ **No bulk operations** - Cannot assign multiple permissions at once

This limits flexibility for edge cases (e.g., granting read-only video approval access to support, temporary elevated permissions, cross-entity access exceptions).

## Solution Approach

**Strategy:** Build a layered permissions management system with matrix view, permission editor, and audit integration.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: UI (Permission Matrix Page)                       │
│ - Permission matrix grid (role × permission)               │
│ - Per-user permission editor                               │
│ - Permission inheritance visualizer                        │
│ - Category filters (users, content, courses, system)       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: API Routes (/api/permissions)                     │
│ - GET /api/permissions (list all permissions)              │
│ - GET /api/permissions/matrix (role × permission grid)     │
│ - PATCH /api/admin-users/[id]/permissions (update)         │
│ - GET /api/permissions/check (check user permission)       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Permission Utilities (`lib/rbac/permissions.ts`)  │
│ - computeEffectivePermissions() - Role + user overrides    │
│ - expandWildcards() - Expand `*`, `category.*`, `*.action` │
│ - validatePermissionChange() - Prevent privilege escalation│
│ - formatPermissionMatrix() - Transform for UI grid         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: MCP Client (Already Implemented)                  │
│ - listAdminPermissions() - Fetch from admin_permissions    │
│ - checkPermission() - Wildcard-aware permission check      │
│ - updateAdminUser() - Update permissions array             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Database: admin_permissions, admin_users (PostgreSQL)      │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Two-Level Permission System**:
   - **Role permissions**: Defined in `ROLE_CONFIG`, applied by default when role assigned
   - **User permissions**: Custom overrides stored in `admin_users.permissions`, merged with role defaults
   - **Effective permissions**: Computed as `roleDefaults ∪ userOverrides` with wildcard expansion

2. **Permission Matrix Display**:
   ```
   ┌────────────────┬───────────┬──────────┬──────────┬─────────┐
   │ Permission     │ super_adm │ ka_admin │ ol_admin │ support │
   ├────────────────┼───────────┼──────────┼──────────┼─────────┤
   │ users.read     │     ✓*    │    ✓     │    ✓     │    ✓    │
   │ users.create   │     ✓*    │    ✓     │    ✓     │    ✗    │
   │ users.update   │     ✓*    │    ✓     │    ✓     │    ✗    │
   │ users.delete   │     ✓*    │    ✓     │    ✓     │    ✗    │
   │ ka.videos.read │     ✓*    │    ✓     │    ✗     │    ✗    │
   │ ol.courses.read│     ✓*    │    ✗     │    ✓     │    ✗    │
   └────────────────┴───────────┴──────────┴──────────┴─────────┘
   * = wildcard grant (has `*` permission)
   ```

3. **User Permission Editor**:
   - Show role permissions (read-only, gray background)
   - Show user overrides (editable, white background, green for granted, red for explicitly denied)
   - Visual diff: `✓ (role)` vs `✓+ (custom grant)` vs `✗- (custom deny)`

4. **Permission Validation**:
   - Only super_admin can edit permissions
   - Cannot grant permissions outside entity scope (e.g., ka_admin cannot get ol.* permissions)
   - Cannot self-grant permissions (prevent privilege escalation)
   - Wildcard permissions (`*`, `category.*`) shown with warning badge

5. **Comprehensive Permission Seed**:
   - Expand from 14 to 50+ permissions covering all resources
   - Categories: users, content, courses, members, classrooms, payments, analytics, settings, system
   - Actions: read, create, update, delete, approve, publish, assign, export

6. **Audit Integration**:
   - Log all permission changes using `createAuditLog()` from Spec 1.7
   - Metadata includes before/after permission arrays with diff
   - Action: `admin_user.permissions_updated`

## Relevant Files

### Existing Files (To Modify/Extend)

- **`lib/rbac/constants.ts`** - Role definitions with default permissions (extend with permission categories)
- **`lib/rbac/utils.ts`** - RBAC utility functions (extend with permission computation)
- **`lib/mcp-client/queries.ts:302-362`** - Permission MCP methods (already implemented, use as-is)
- **`types/admin.ts:82-93`** - AdminPermission type (already implemented)
- **`types/database.ts:40-49`** - AdminPermissionRow type (already implemented)
- **`migrations/001_create_admin_schema.sql:42-52`** - admin_permissions table (already created)
- **`migrations/001_create_admin_schema.sql:115-139`** - Permission seed data (extend to 50+ permissions)
- **`app/api/admin-users/[id]/route.ts`** - Admin user update API (extend for permission updates)
- **`components/dashboard/Sidebar.tsx`** - Add "Permissions" menu item under "Settings" section
- **`app/(dashboard)/layout-client.tsx`** - Add breadcrumb for permissions page

### New Files (To Create)

#### Core Permission Infrastructure
- **`lib/rbac/permissions.ts`** - Permission computation, validation, and formatting utilities
- **`lib/rbac/permission-categories.ts`** - Comprehensive permission definitions (50+ permissions)
- **`migrations/002_extend_permissions.sql`** - Extend permission seed data to 50+ permissions

#### API Routes
- **`app/api/permissions/route.ts`** - GET list of all permissions, grouped by category
- **`app/api/permissions/matrix/route.ts`** - GET permission matrix (role × permission grid)
- **`app/api/admin-users/[id]/permissions/route.ts`** - PATCH update user permissions
- **`app/api/permissions/check/route.ts`** - POST check if user has specific permission

#### UI Components
- **`app/(dashboard)/permissions/page.tsx`** - Permission matrix viewer (role defaults)
- **`app/(dashboard)/users/[id]/permissions/page.tsx`** - User-specific permission editor
- **`components/permissions/PermissionMatrix.tsx`** - Matrix grid component (role × permission)
- **`components/permissions/PermissionEditor.tsx`** - User permission editor with inheritance
- **`components/permissions/PermissionCheckbox.tsx`** - Tri-state checkbox (role, granted, denied)
- **`components/permissions/PermissionBadge.tsx`** - Badge showing permission state (inherited, custom, wildcard)
- **`components/permissions/CategoryFilter.tsx`** - Filter permissions by category
- **`components/permissions/PermissionCard.tsx`** - Card showing permission details

## Implementation Phases

### Phase 1: Permission Data Foundation
**Goal:** Expand permission seed data and create computation utilities

1. Create comprehensive permission definitions (50+ permissions)
2. Create migration to insert extended permissions
3. Build permission computation utilities (effective permissions, wildcard expansion)
4. Add permission validation functions

### Phase 2: Permission Matrix View (Read-Only)
**Goal:** Build visual permission matrix for viewing role defaults

1. Create API endpoint for permission matrix
2. Create matrix grid component
3. Create permission matrix page
4. Add category filtering
5. Add CSV export

### Phase 3: User Permission Editor (Edit Mode)
**Goal:** Enable custom permission assignment for individual users

1. Create user permission update API
2. Create permission editor component with inheritance visualization
3. Create user permissions page (under /users/[id]/permissions)
4. Integrate audit logging for permission changes
5. Add validation and security checks

### Phase 4: Testing & Documentation
**Goal:** Validate all permission flows and document the system

1. Write unit tests for permission computation
2. Write integration tests for permission API routes
3. Test permission inheritance edge cases
4. Update RBAC guide documentation
5. Create permission management tutorial

## Step by Step Tasks

### 1. Create Comprehensive Permission Definitions

- Create `lib/rbac/permission-categories.ts`:
  ```typescript
  export const PERMISSION_DEFINITIONS = {
    // Users (4 permissions)
    users: [
      { key: 'users.read', label: 'Read Users', description: '...', actions: ['read'] },
      { key: 'users.create', label: 'Create Users', ... },
      { key: 'users.update', label: 'Update Users', ... },
      { key: 'users.delete', label: 'Delete Users', ... },
    ],
    // Content (7 permissions)
    content: [
      { key: 'content.read', label: 'Read Content', ... },
      { key: 'content.create', label: 'Create Content', ... },
      { key: 'content.update', label: 'Update Content', ... },
      { key: 'content.delete', label: 'Delete Content', ... },
      { key: 'content.approve', label: 'Approve Content', ... },
      { key: 'content.publish', label: 'Publish Content', ... },
      { key: 'content.moderate', label: 'Moderate Content', ... },
    ],
    // ... courses (7), members (5), classrooms (5), payments (4), analytics (3), settings (6), system (5)
  };
  ```

- Define 50+ permissions across 9 categories
- Include entity scope for platform-specific permissions
- Document permission hierarchy and wildcards

### 2. Create Permission Seed Migration

- Create `migrations/002_extend_permissions.sql`:
  ```sql
  INSERT INTO admin_permissions (permission_key, permission_label, description, category, entity_scope)
  VALUES
    -- Expand from 14 to 50+ permissions
    ('content.read', 'Read Content', '...', 'content', NULL),
    ('content.create', 'Create Content', '...', 'content', NULL),
    -- ... all 50+ permissions
  ON CONFLICT (permission_key) DO NOTHING;
  ```

- Run migration via MCP Gateway or direct psql
- Verify all permissions inserted: `SELECT COUNT(*) FROM admin_permissions;`

### 3. Create Permission Computation Utilities

- Create `lib/rbac/permissions.ts`:
  ```typescript
  export function computeEffectivePermissions(
    role: AdminRole,
    userPermissions: string[]
  ): string[] {
    const roleDefaults = ROLE_CONFIG[role].defaultPermissions;
    return [...new Set([...roleDefaults, ...userPermissions])];
  }

  export function expandWildcards(
    permissions: string[],
    allPermissions: AdminPermission[]
  ): string[] {
    // Expand `*` to all permissions
    // Expand `category.*` to all permissions in category
    // Expand `*.action` to all permissions with action
  }

  export function validatePermissionChange(
    currentUser: AdminUser,
    targetUser: AdminUser,
    newPermissions: string[]
  ): { valid: boolean; error?: string } {
    // Only super_admin can edit permissions
    // Cannot self-grant permissions
    // Cannot grant permissions outside entity scope
    // Wildcard permissions show warning
  }

  export function formatPermissionMatrix(
    roles: AdminRole[],
    permissions: AdminPermission[]
  ): PermissionMatrixRow[] {
    // Transform to grid data structure for UI
  }

  export interface PermissionMatrixRow {
    permissionKey: string;
    permissionLabel: string;
    category: string;
    entityScope: string | null;
    rolePermissions: Record<AdminRole, boolean | 'wildcard'>;
  }
  ```

- Implement comprehensive wildcard expansion logic
- Handle edge cases (nested wildcards, conflicts)
- Add TypeScript types for matrix data

### 4. Create Permission Matrix API (Read-Only)

- Create `app/api/permissions/route.ts`:
  ```typescript
  GET /api/permissions?category=users&entityScope=kids_ascension
  ```
  - Require authentication (any admin role)
  - Fetch all permissions from admin_permissions
  - Group by category
  - Filter by category and entity scope if provided
  - Return sorted by category, then permission_key

- Create `app/api/permissions/matrix/route.ts`:
  ```typescript
  GET /api/permissions/matrix
  ```
  - Require authentication (super_admin only)
  - Fetch all permissions and all roles
  - Compute permission matrix using `formatPermissionMatrix()`
  - Return grid data structure

### 5. Create PermissionBadge Component

- Create `components/permissions/PermissionBadge.tsx`:
  ```tsx
  <PermissionBadge
    state="inherited"  // gray badge with "Role Default"
    state="granted"    // green badge with "Custom Grant"
    state="denied"     // red badge with "Denied"
    state="wildcard"   // yellow badge with "Wildcard (*)"
  />
  ```
- Use shadcn/ui Badge component
- Color-code by state
- Show icon (Check, X, Asterisk)

### 6. Create CategoryFilter Component

- Create `components/permissions/CategoryFilter.tsx`:
  ```tsx
  <CategoryFilter
    categories={['users', 'content', 'courses', ...]}
    selected={selectedCategory}
    onSelect={(category) => {...}}
  />
  ```
- Use shadcn/ui Select component
- Show category with count (e.g., "Users (4)")
- Support "All Categories" option

### 7. Create PermissionMatrix Component

- Create `components/permissions/PermissionMatrix.tsx`:
  ```tsx
  'use client';
  <PermissionMatrix
    permissions={permissions}
    roles={['super_admin', 'ka_admin', 'ol_admin', 'support']}
  />
  ```
- Use DataTable component from Spec 1.3
- Columns: Permission, Category, super_admin, ka_admin, ol_admin, support
- Cells: Checkmark (✓) if role has permission, `✓*` if wildcard
- Enable column sorting by category, permission
- Enable filtering by category
- Add CSV export button

### 8. Create Permission Matrix Page

- Create `app/(dashboard)/permissions/page.tsx`:
  ```tsx
  export default async function PermissionsPage() {...}
  ```
- Server component
- Require super_admin role (read-only view for advanced RBAC)
- Fetch permission matrix from API
- Render PermissionMatrix component
- Add breadcrumb: Dashboard > Settings > Permissions
- Add page header with description

### 9. Create User Permission Update API

- Create `app/api/admin-users/[id]/permissions/route.ts`:
  ```typescript
  PATCH /api/admin-users/{id}/permissions
  Body: { permissions: string[] }
  ```
- Require super_admin role
- Validate permission change using `validatePermissionChange()`
- Fetch current user permissions (before state)
- Update admin_users.permissions via MCP client
- Create audit log with before/after diff
- Return updated user object

### 10. Create PermissionCheckbox Component

- Create `components/permissions/PermissionCheckbox.tsx`:
  ```tsx
  <PermissionCheckbox
    permission="users.read"
    value="inherited"  // gray checkbox (checked, disabled)
    value="granted"    // green checkbox (checked, editable)
    value="denied"     // red checkbox (unchecked, editable)
    onChange={(newValue) => {...}}
  />
  ```
- Three-state checkbox: inherited (role default), granted (custom), denied (revoked)
- Visual states:
  - **Inherited**: Gray background, checkmark, disabled, tooltip "From role: {roleName}"
  - **Granted**: Green checkmark, editable, tooltip "Custom grant"
  - **Denied**: Red X, editable, tooltip "Custom deny"
- Support bulk selection (select all in category)

### 11. Create PermissionEditor Component

- Create `components/permissions/PermissionEditor.tsx`:
  ```tsx
  'use client';
  <PermissionEditor
    adminUser={adminUser}
    permissions={allPermissions}
    onSave={(newPermissions) => {...}}
  />
  ```
- Display permissions grouped by category
- Show role permissions (gray, read-only)
- Show user custom permissions (editable)
- Visual inheritance:
  - Role default: `✓ (role)` - gray badge
  - Custom grant: `✓+ (custom)` - green badge
  - Custom deny: `✗- (denied)` - red badge
- Include CategoryFilter for filtering
- Include "Reset to role defaults" button
- Include "Save Changes" button (calls API)

### 12. Create User Permissions Page

- Create `app/(dashboard)/users/[id]/permissions/page.tsx`:
  ```tsx
  export default async function UserPermissionsPage({ params }) {...}
  ```
- Server component
- Require super_admin role
- Fetch admin user by ID
- Fetch all permissions
- Compute effective permissions
- Render PermissionEditor component
- Add breadcrumb: Dashboard > Users > {userName} > Permissions
- Add tab navigation: Profile | Permissions | Activity

### 13. Integrate Audit Logging

- Update `app/api/admin-users/[id]/permissions/route.ts`:
  - Import `createAuditLog` from `lib/audit/logger` (Spec 1.7)
  - After permission update, create audit log:
  ```typescript
  await createAuditLog({
    request,
    session,
    action: AUDIT_ACTIONS.USER_PERMISSIONS_CHANGE,
    entityType: 'admin_users',
    entityId: params.id,
    metadata: {
      changes: {
        permissions: {
          old: beforePermissions,
          new: afterPermissions,
        },
      },
      diff: createDiff({ permissions: beforePermissions }, { permissions: afterPermissions }),
    },
  });
  ```

### 14. Add Permission Check API (Utility)

- Create `app/api/permissions/check/route.ts`:
  ```typescript
  POST /api/permissions/check
  Body: { adminUserId: string, permissionKey: string }
  Response: { hasPermission: boolean, source: 'wildcard' | 'role' | 'custom' }
  ```
- Require authentication
- Call `mcpClient.checkPermission()` with wildcard expansion
- Determine permission source (wildcard, role default, custom grant)
- Return result
- Use for debugging/troubleshooting permission issues

### 15. Add Permissions to Sidebar

- Update `components/dashboard/Sidebar.tsx`:
  - Add "Permissions" menu item under "Settings" section
  - Icon: Key or Lock icon from lucide-react
  - Route: `/dashboard/permissions`
  - Visible to: super_admin only

- Update `app/(dashboard)/layout-client.tsx`:
  - Add "Permissions" to navigation structure
  - Define breadcrumb label: "Permissions"

### 16. Add Permission Management to User Detail Page

- Update `app/(dashboard)/users/[id]/page.tsx`:
  - Add "Permissions" tab to user detail page
  - Tab navigation: Profile | Permissions | Activity
  - Link to `/dashboard/users/[id]/permissions`
  - Show permission count badge (e.g., "Permissions (12)")

### 17. Add CSV Export for Permission Matrix

- Update `components/permissions/PermissionMatrix.tsx`:
  - Add "Export CSV" button to DataTable toolbar
  - Use DataTable's built-in CSV export (from Spec 1.3)
  - CSV format:
    ```csv
    Permission,Category,Entity Scope,super_admin,ka_admin,ol_admin,support
    users.read,users,NULL,✓*,✓,✓,✓
    users.create,users,NULL,✓*,✓,✓,✗
    ...
    ```

### 18. Update RBAC Guide Documentation

- Update `apps/admin/docs/rbac-guide.md`:
  - Add section: "Permission Management"
  - Explain two-level permission system (role + user)
  - Document wildcard syntax (`*`, `category.*`, `*.action`)
  - Provide examples of custom permission grants
  - Document permission validation rules
  - Add screenshots of permission matrix and user editor

### 19. Write Tests

- Create `tests/lib/rbac/permissions.test.ts`:
  - Test `computeEffectivePermissions()` with various role + user combinations
  - Test `expandWildcards()` for `*`, `category.*`, `*.action`
  - Test `validatePermissionChange()` for all security rules
  - Test `formatPermissionMatrix()` output structure

- Create `tests/api/permissions.test.ts`:
  - Test GET /api/permissions (list)
  - Test GET /api/permissions/matrix (grid)
  - Test PATCH /api/admin-users/[id]/permissions (update)
  - Test role-based access control (super_admin only)
  - Test permission validation (cannot self-grant, entity scope)

- Create `tests/components/permissions/PermissionEditor.test.tsx`:
  - Test permission checkbox state changes
  - Test category filtering
  - Test save button disabled when no changes
  - Test reset to role defaults

### 20. Validate Implementation

- Verify all 50+ permissions seeded in database
- Test permission matrix loads in <1s
- Test user permission editor shows inheritance correctly
- Test permission changes saved and enforced immediately
- Test audit logging captures all permission changes
- Test CSV export includes all data
- Review TypeScript strict mode compliance
- Review accessibility (keyboard navigation, screen readers)

## Testing Strategy

### Unit Tests
- **Permission computation**: Test `computeEffectivePermissions()` with all role combinations
- **Wildcard expansion**: Test `expandWildcards()` for `*`, `users.*`, `*.read`, nested wildcards
- **Validation**: Test `validatePermissionChange()` for all security rules
- **Matrix formatting**: Test `formatPermissionMatrix()` output structure

### Integration Tests
- **Permission API**: Test all API endpoints with various query params
- **User permission update**: Test full flow (fetch → edit → save → verify)
- **Audit logging**: Verify permission changes logged correctly
- **Role-based access**: Test super_admin can edit, others cannot

### E2E Tests (Manual)
1. **View permission matrix**: Navigate to `/dashboard/permissions` → see grid
2. **Filter by category**: Select "Users" category → see only user permissions
3. **Edit user permissions**: Navigate to `/dashboard/users/[id]/permissions` → grant custom permission
4. **Save changes**: Click "Save" → verify success toast, audit log created
5. **Verify enforcement**: Login as that user → verify new permission works
6. **Export CSV**: Click "Export" → download and verify file
7. **Reset permissions**: Click "Reset to role defaults" → verify reverts to role permissions

### Security Tests
- **Privilege escalation prevention**: Try to self-grant super_admin permissions → blocked
- **Entity scope enforcement**: Try to grant ka_admin ol.* permissions → blocked
- **Wildcard warnings**: Grant `*` permission → see warning badge
- **Audit trail**: All permission changes logged with full context

## Acceptance Criteria

### Functional Requirements
- [ ] Permission matrix loads in < 1s with 50+ permissions and 4 roles
- [ ] Permission changes saved and enforced immediately (session refresh required)
- [ ] All permission changes audited with before/after state diff
- [ ] Default permissions for each role visible in matrix
- [ ] User-specific permissions editable by super_admin only
- [ ] Category filtering works (users, content, courses, etc.)
- [ ] CSV export includes all permissions and roles
- [ ] Wildcard permissions (`*`, `category.*`, `*.action`) expanded correctly
- [ ] Permission inheritance visualized (role vs custom)

### Security Requirements
- [ ] Only super_admin can view permission matrix
- [ ] Only super_admin can edit user permissions
- [ ] Cannot self-grant permissions (prevent privilege escalation)
- [ ] Cannot grant permissions outside entity scope (ka_admin cannot get ol.*)
- [ ] Wildcard permissions show warning badge
- [ ] All permission changes require confirmation

### Non-Functional Requirements
- [ ] Permission matrix supports 100+ permissions (scalable)
- [ ] UI responsive on desktop, tablet, mobile
- [ ] Accessibility: keyboard navigation, screen readers, ARIA labels
- [ ] TypeScript strict mode compliance (no `any` types)
- [ ] Unit test coverage >80% for permission utilities

### Documentation Requirements
- [ ] RBAC guide updated with permission management section
- [ ] Permission definitions documented in code
- [ ] API endpoints documented with examples
- [ ] Permission validation rules documented

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
pnpm test lib/rbac/permissions
```
**Expected:** All tests pass (permission computation, wildcard expansion, validation)

### 3. Run API Tests
```bash
pnpm test api/permissions
```
**Expected:** All tests pass (list, matrix, update, check)

### 4. Start Dev Server
```bash
pnpm --filter admin dev
```
**Expected:** Server starts on port 9200

### 5. Check Permission Seed
```bash
# Via MCP Gateway or direct psql
SELECT category, COUNT(*) as count
FROM admin_permissions
GROUP BY category
ORDER BY category;
```
**Expected:** 9 categories with 50+ total permissions

### 6. Fetch Permission Matrix
```bash
curl http://localhost:9200/api/permissions/matrix \
  -H "Cookie: next-auth.session-token=..." \
  | jq '.matrix | length'
```
**Expected:** 50+ rows (one per permission)

### 7. Update User Permissions
```bash
curl -X PATCH http://localhost:9200/api/admin-users/{id}/permissions \
  -H "Cookie: next-auth.session-token=..." \
  -H "Content-Type: application/json" \
  -d '{"permissions": ["users.read", "content.read"]}'
```
**Expected:** 200 OK with updated user object

### 8. Export CSV
```bash
curl http://localhost:9200/api/permissions/matrix \
  -H "Accept: text/csv" \
  -o permissions.csv
head -n 10 permissions.csv
```
**Expected:** CSV file with permission matrix

### 9. Verify Audit Log
```bash
# Check audit logs for permission changes
SELECT action, metadata FROM admin_audit_logs
WHERE action = 'admin_user.permissions_updated'
ORDER BY created_at DESC
LIMIT 1;
```
**Expected:** Latest permission change logged with before/after diff

### 10. Check Wildcard Expansion
```bash
# Via API or test
curl -X POST http://localhost:9200/api/permissions/check \
  -H "Content-Type: application/json" \
  -d '{"adminUserId": "...", "permissionKey": "users.read"}'
```
**Expected:** `{"hasPermission": true, "source": "wildcard"}` if user has `*` or `users.*` or `*.read`

### 11. Manual UI Test
1. Navigate to `http://localhost:9200/dashboard/permissions`
2. Verify permission matrix renders with 4 roles and 50+ permissions
3. Filter by "Users" category
4. Navigate to `/dashboard/users/{id}/permissions`
5. Toggle a permission checkbox
6. Click "Save Changes"
7. Verify toast notification
8. Check audit logs page for new entry

**Expected:** All UI interactions work without errors

### 12. Lint Check
```bash
pnpm run lint
```
**Expected:** No linting errors

## Notes

### Dependencies
- **No new dependencies** - Uses existing:
  - shadcn/ui components (Checkbox, Select, Badge, Table)
  - TanStack Table (DataTable from Spec 1.3)
  - MCP Gateway client (permission queries)
  - Audit logger (from Spec 1.7)
  - Lucide React icons

### Permission Naming Convention
- **Format**: `{category}.{action}` or `{entityPrefix}.{category}.{action}`
- **Examples**:
  - `users.read`, `users.create`, `users.update`, `users.delete`
  - `ka.videos.approve`, `ol.courses.publish`
- **Wildcards**:
  - `*` - All permissions (super_admin only)
  - `users.*` - All user permissions (read, create, update, delete)
  - `*.read` - All read permissions across all categories

### Permission Categories
1. **users** (4) - User account management
2. **content** (7) - Generic content (videos, articles)
3. **courses** (7) - Course management (Ozean Licht)
4. **members** (5) - Member management (Ozean Licht)
5. **classrooms** (5) - Classroom management (Kids Ascension)
6. **payments** (4) - Payment monitoring (Ozean Licht)
7. **analytics** (3) - Analytics and reporting
8. **settings** (6) - System settings
9. **system** (5) - System administration

**Total**: 50+ permissions (expandable)

### Security Validation Rules
1. **Super admin only**: Only super_admin can edit permissions
2. **No self-grant**: Cannot edit own permissions (prevent privilege escalation)
3. **Entity scope**: Cannot grant permissions outside entity scope
   - ka_admin: Only `ka.*` or cross-platform permissions
   - ol_admin: Only `ol.*` or cross-platform permissions
   - support: Only read permissions (`*.read`)
4. **Wildcard warning**: Show warning when granting `*`, `category.*`, `*.action`
5. **Audit all changes**: Every permission change logged

### UI/UX Considerations
- **Permission inheritance**: Clearly distinguish role defaults (gray) from custom grants (green/red)
- **Bulk operations**: Select all permissions in category for bulk grant/deny
- **Search**: Add search box to filter permissions by key or label
- **Tooltips**: Show permission description on hover
- **Confirmation**: Require confirmation for permission changes (especially wildcard grants)
- **Session refresh**: Warn user that permission changes require logout/login to take effect

### Future Enhancements (Out of Scope)
- Permission groups (e.g., "Content Manager" = content.* + analytics.read)
- Time-based permissions (temporary elevated access)
- Permission request workflow (users request, super_admin approves)
- Permission templates (copy permissions from one user to another)
- Permission history (view all changes over time per user)
- Real-time permission enforcement (WebSocket updates, no logout required)

### Implementation Order Rationale
1. **Data foundation first**: Create comprehensive permission definitions and seed data
2. **Read-only matrix**: Build visualization before editing to validate data model
3. **User editor**: Add editing capability after matrix works
4. **Audit integration**: Wire up audit logging last (depends on Spec 1.7)

### Performance Considerations
- **Permission matrix**: Fetch once, cache in React state (avoid re-fetching on filter)
- **Wildcard expansion**: Compute on server-side (avoid sending all permissions to client)
- **CSV export**: Stream generation for large permission sets (avoid memory issues)
- **Database indexes**: Already created in migration (permission_key, category, entity_scope)

### Related Specifications
- **Spec 1.4**: Admin Basic RBAC (role system, this builds on it)
- **Spec 1.7**: Admin Audit Logging Foundation (audit integration)
- **Spec 1.3**: Admin Data Tables Foundation (DataTable for matrix)
- **Spec 1.5**: Admin User Management List (user list links to permission editor)

### Cross-References
- **Roadmap**: `apps/admin/docs/admin-dashboard-roadmap.md` (Phase 1, line 84)
- **Specs List**: `apps/admin/docs/ROADMAP-SPECS-LIST.md` (Spec 1.8, lines 193-212)
- **RBAC Report**: `apps/admin/specs/reports/RBAC_IMPLEMENTATION_REPORT.md` (Spec 1.4 complete)
- **Database Schema**: `apps/admin/migrations/001_create_admin_schema.sql` (lines 42-52)
- **MCP Client**: `apps/admin/lib/mcp-client/queries.ts` (lines 302-362)
- **RBAC Constants**: `apps/admin/lib/rbac/constants.ts` (role defaults)

---

**Document Version:** 1.0
**Created:** 2025-11-09
**Status:** Ready for Implementation
**Estimated Effort:** 16 hours
**Priority:** P2 (Important)
**Dependencies:** Spec 1.4 (Basic RBAC), Spec 1.7 (Audit Logging)
**Blocks:** None (nice-to-have feature, not blocking core functionality)
