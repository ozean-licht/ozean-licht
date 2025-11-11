# Admin Dashboard Context Map

**Single Source of Truth for AI Agent Navigation**

**Last Updated:** 2025-11-11
**Codebase Size:** ~14,107 LOC (142 TypeScript files)
**Structure:** Post-Spec 0.1 Cleanup (Functional Areas Organization)

---

## Quick Navigation Table

**"If working on X, start here..."**

| Task | Start Here | Line Range | Also Read |
|------|-----------|------------|-----------|
| **Authentication** | `lib/auth/config.ts` | Lines 62-151 | `middleware.ts`, `lib/auth-utils.ts` |
| **Permissions/RBAC** | `lib/rbac/permissions.ts` | Lines 15-127 | `lib/rbac/constants.ts`, `lib/rbac/permission-categories.ts:1-100` |
| **User Management UI** | `app/dashboard/access/users/page.tsx` | Full file | `lib/mcp-client/queries.ts:48-225`, `types/admin.ts` |
| **User Management API** | `app/api/admin-users/[id]/route.ts` | Full file | `lib/mcp-client/queries.ts:48-225` |
| **Permission Matrix** | `app/dashboard/access/permissions/page.tsx` | Full file | `components/permissions/PermissionMatrix.tsx` |
| **Health Monitoring** | `app/dashboard/system/health/page.tsx` | Full file | `lib/mcp-client/health.ts`, `app/dashboard/system/health/actions.ts` |
| **Database Queries** | `lib/mcp-client/queries.ts` | See §6 | `lib/mcp-client/client.ts` |
| **Navigation/Sidebar** | `components/dashboard/Sidebar.tsx` | Lines 44-98 | `lib/navigation/breadcrumb-utils.ts` |
| **UI Components** | `components/ui/<component>.tsx` | Full file | `lib/utils.ts` (cn function) |
| **API Endpoints** | `app/api/<endpoint>/route.ts` | Full file | `lib/auth/config.ts:163-204` |

---

## Context Boundaries

The admin dashboard is organized into **8 primary contexts**:

### 1. AUTH Context
**Responsibility:** Authentication, session management, JWT handling

**Core Files:**
```
lib/auth/config.ts (209 LOC)          # NextAuth configuration [CRITICAL]
  Lines 1-40:   Configuration and database pool
  Lines 62-151: Credentials provider & auth logic
  Lines 163-204: JWT and session callbacks

lib/auth-utils.ts                     # Password hashing, session helpers [CRITICAL]
middleware.ts                          # Route protection [CRITICAL]
```

**Supporting Files:**
```
lib/auth/adapter.ts                    # Database session adapter
lib/auth/constants.ts                  # Auth constants
lib/auth/middleware-auth.ts            # Middleware utilities
app/(auth)/login/page.tsx              # Login UI
components/auth/LoginForm.tsx          # Login form component
components/auth/LogoutButton.tsx       # Logout component
```

**Dependencies:** MCP_CLIENT (session queries), RBAC (role checks), UI (components)

---

### 2. RBAC Context
**Responsibility:** Role-based access control, permission management

**Core Files:**
```
lib/rbac/permissions.ts (350 LOC)      # Permission logic [CRITICAL]
  Lines 15-88:   computeEffectivePermissions(), expandWildcards()
  Lines 90-127:  hasPermission() checks
  Lines 129-175: getPermissionSource() detection
  Lines 181-260: validatePermissionChange() rules
  Lines 266-310: formatPermissionMatrix() UI helpers
  Lines 316-345: computePermissionDiff() audit

lib/rbac/permission-categories.ts (690 LOC)  # Permission definitions [CRITICAL]
  Lines 1-33:    Type definitions and structure
  Lines 38-71:   User management permissions (4)
  Lines 76-135:  Content management permissions (7)
  Lines 140-206: Course management permissions (7)
  Lines 211-260: Member management permissions (5)
  Lines 265-314: Classroom management permissions (5)
  Lines 319-359: Payment management permissions (4)
  Lines 364-398: Analytics permissions (3)
  Lines 403-473: Settings management permissions (6)
  Lines 478-537: System administration permissions (5)
  Lines 542-690: Admin management permissions (11)

lib/rbac/constants.ts (166 LOC)        # Role configurations [CRITICAL]
  - Role display metadata (labels, colors, icons)
  - Default permissions per role
  - Route access mappings (ROUTE_ROLES)
```

**Supporting Files:**
```
lib/rbac/utils.ts                      # RBAC utility functions
components/rbac/EntityBadge.tsx        # Entity badge component
components/rbac/RoleBadge.tsx          # Role badge component
components/rbac/RoleSelect.tsx         # Role selector dropdown
```

**Dependencies:** AUTH (user context), MCP_CLIENT (permission queries), UI (badges)

---

### 3. USER_MANAGEMENT Context
**Responsibility:** Admin user CRUD operations, user listing, user detail views

**Core Files:**
```
app/dashboard/access/users/page.tsx                      # User list page [ENTRY POINT]
app/dashboard/access/users/[id]/page.tsx                 # User detail page
app/dashboard/access/users/[id]/permissions/page.tsx     # Permission editor
app/dashboard/access/users/UsersDataTable.tsx            # Data table component
app/dashboard/access/users/columns.tsx                   # Table column definitions

app/api/admin-users/[id]/route.ts (122 LOC)              # User CRUD API [ENTRY POINT]
  - GET: Fetch admin user
  - PATCH: Update admin user (super_admin only)

app/api/admin-users/[id]/permissions/route.ts (122 LOC)  # Permission API
  - GET: Fetch user permissions
  - PATCH: Update user permissions (super_admin only)
```

**Supporting Components:**
```
app/dashboard/access/users/[id]/AdminUserForm.tsx        # User edit form
app/dashboard/access/users/[id]/UserDetailCard.tsx       # User info card
app/dashboard/access/users/[id]/permissions/permission-editor-client.tsx
```

**Dependencies:** AUTH, RBAC, PERMISSIONS, MCP_CLIENT, UI (data tables, forms)

---

### 4. PERMISSIONS Context
**Responsibility:** System-wide permission definitions, permission matrix UI

**Core Files:**
```
app/dashboard/access/permissions/page.tsx                # Permissions management page [ENTRY POINT]
components/permissions/PermissionMatrix.tsx              # Permission matrix grid
components/permissions/PermissionEditor.tsx              # Permission editor UI

app/api/permissions/route.ts (55 LOC)                    # List permissions API
app/api/permissions/matrix/route.ts (51 LOC)             # Permission matrix API
app/api/permissions/check/route.ts (84 LOC)              # Check permission API
```

**Supporting Components:**
```
components/permissions/CategoryFilter.tsx                # Filter by category
components/permissions/PermissionBadge.tsx               # Permission badge
components/permissions/PermissionCheckbox.tsx            # Checkbox with logic
```

**Dependencies:** AUTH, RBAC, MCP_CLIENT, UI

---

### 5. MCP_CLIENT Context
**Responsibility:** Database access layer via MCP Gateway, query execution

**Core Files:**
```
lib/mcp-client/client.ts (256 LOC)     # Base client [CRITICAL]
  - Connection management
  - Query execution (query, executeQuery)
  - Error handling

lib/mcp-client/queries.ts (799 LOC)    # Query extensions [CRITICAL - SEE §6 FOR LINE MAP]
  Lines 48-225:   Admin user operations (CRUD, filters)
  Lines 227-294:  Admin role operations
  Lines 296-374:  Permission operations
  Lines 376-486:  Audit log operations
  Lines 488-585:  Session operations
  Lines 587-798:  User operations (end-users)

lib/mcp-client/health.ts (299 LOC)     # Health checks [CRITICAL]
  Lines 100-158:  checkDatabaseHealth()
  Lines 165-210:  checkMCPGatewayHealth()
  Lines 217-275:  checkAllHealth()
```

**Supporting Files:**
```
lib/mcp-client/errors.ts               # Error types (MCPError, MCPClientError, MCPServerError)
lib/mcp-client/index.ts                # Public exports
```

**Dependencies:** None (Foundation layer)

---

### 6. HEALTH Context
**Responsibility:** System health monitoring, status reporting

**Core Files:**
```
app/dashboard/system/health/page.tsx   # Health dashboard [ENTRY POINT]
app/dashboard/system/health/actions.ts # Server actions for health checks
```

**Components:**
```
components/health/DatabaseHealthCard.tsx       # Database status
components/health/HealthMetricCard.tsx         # Generic metric card
components/health/MCPGatewayHealthCard.tsx     # MCP Gateway status
components/health/MetricRow.tsx                # Metric row component
components/health/ServerHealthCard.tsx         # Server metrics
```

**Dependencies:** MCP_CLIENT (health checks), UI (cards)

---

### 7. NAVIGATION Context
**Responsibility:** Dashboard navigation, sidebar, breadcrumbs, routing

**Core Files:**
```
components/dashboard/Sidebar.tsx (266 LOC)     # Main navigation [CRITICAL]
  Lines 44-98:   Navigation section definitions (Overview, Access, System, Platforms)
  Lines 100-119: Role-based filtering logic
  Lines 121-126: Active route detection
  Lines 128-264: Sidebar render (mobile overlay, logo, sections, collapse toggle)

lib/navigation/breadcrumb-utils.ts (162 LOC)   # Breadcrumb logic [CRITICAL]
  Lines 1-88:    Breadcrumb parsing and formatting
  Lines 107-148: Path-to-breadcrumb conversion
```

**Supporting Files:**
```
components/dashboard/Header.tsx                # Top navigation bar
components/dashboard/Breadcrumb.tsx            # Breadcrumb component
components/dashboard/EntitySwitcher.tsx        # Entity context switcher
components/dashboard/ThemeToggle.tsx           # Dark/light mode toggle
lib/navigation/keyboard-shortcuts.ts (151 LOC) # Keyboard navigation
```

**Dependencies:** AUTH (user context), RBAC (route access), UI (components)

---

### 8. UI Context
**Responsibility:** Shared UI components, design system

**Base Components (shadcn/ui):**
```
components/ui/                          # Generic UI primitives
  - alert.tsx, badge.tsx, button.tsx, card.tsx, checkbox.tsx
  - dialog.tsx, dropdown-menu.tsx, input.tsx, label.tsx
  - select.tsx, table.tsx, tabs.tsx, toast.tsx
  - (21 components total)
```

**Admin-Specific Components:**
```
components/admin/                       # Admin UI patterns
  - action-button.tsx                   # Standardized action buttons
  - card-skeleton.tsx                   # Loading state for cards
  - confirmation-modal.tsx              # Confirmation dialogs
  - data-table-skeleton.tsx             # Loading state for tables
  - empty-state.tsx                     # No data states
  - status-badge.tsx                    # Status indicators
  - form/                               # Form components (6 components)
    - checkbox-field.tsx, date-picker.tsx, radio-group-field.tsx
    - select-field.tsx, text-field.tsx, form-field-wrapper.tsx
```

**Data Table Components:**
```
components/data-table/                  # TanStack Table components
  - data-table.tsx                      # Main table component
  - data-table-column-header.tsx        # Sortable column headers
  - data-table-faceted-filter.tsx       # Faceted filtering
  - data-table-pagination.tsx           # Pagination controls
  - data-table-row-actions.tsx          # Row action menus
  - data-table-toolbar.tsx              # Table toolbar
  - data-table-view-options.tsx         # Column visibility toggle
```

**Dependencies:** None (Foundation layer)

---

## Line-Based Navigation (Large Files)

### lib/mcp-client/queries.ts (799 lines)

**Quick Jump Guide:**

| Feature | Lines | Key Methods |
|---------|-------|-------------|
| **Admin User Operations** | 48-225 | `getAdminUserById()` (51-61), `createAdminUser()` (81-100), `updateAdminUser()` (105-153), `listAdminUsers()` (158-193) |
| **Admin Role Operations** | 227-294 | `getAdminRoleById()` (234-244), `listAdminRoles()` (266-276) |
| **Permission Operations** | 296-374 | `listAdminPermissions()` (303-321), `checkPermission()` (326-359) |
| **Audit Log Operations** | 376-486 | `createAuditLog()` (383-406), `listAuditLogs()` (412-466) |
| **Session Operations** | 488-585 | `createSession()` (495-516), `getSessionByToken()` (522-531), `deleteExpiredSessions()` (562-568) |
| **User Operations (End-Users)** | 587-798 | `listUsers()` (594-700), `getUserById()` (705-732), `getUserDetail()` (737-771) |

**Usage Pattern:**
```typescript
// Jump to specific operation
// For admin user queries: Read lines 48-225
// For permissions: Read lines 296-374
// For audit logging: Read lines 376-486
```

---

### lib/rbac/permission-categories.ts (690 lines)

**Quick Jump Guide:**

| Category | Lines | Count |
|----------|-------|-------|
| **Structure & Types** | 1-33 | - |
| **User Management** | 38-71 | 4 permissions |
| **Content Management** | 76-135 | 7 permissions |
| **Course Management** | 140-206 | 7 permissions |
| **Member Management** | 211-260 | 5 permissions |
| **Classroom Management** | 265-314 | 5 permissions |
| **Payment Management** | 319-359 | 4 permissions |
| **Analytics** | 364-398 | 3 permissions |
| **Settings Management** | 403-473 | 6 permissions |
| **System Administration** | 478-537 | 5 permissions |
| **Admin Management** | 542-690 | 11 permissions |

**Total:** 57 permissions across 9 categories

---

### lib/rbac/permissions.ts (350 lines)

**Quick Jump Guide:**

| Feature | Lines | Key Functions |
|---------|-------|---------------|
| **Permission Computation** | 15-88 | `computeEffectivePermissions()` (23-32), `expandWildcards()` (46-88) |
| **Permission Checking** | 90-127 | `hasPermission()` (97-127) |
| **Permission Source** | 129-175 | `getPermissionSource()` (137-175) |
| **Permission Validation** | 181-260 | `validatePermissionChange()` (201-260) |
| **Permission Matrix UI** | 266-310 | `formatPermissionMatrix()` (282-310) |
| **Permission Diff** | 316-345 | `computePermissionDiff()` (329-345) |

---

### components/dashboard/Sidebar.tsx (266 lines)

**Quick Jump Guide:**

| Section | Lines | Purpose |
|---------|-------|---------|
| **Navigation Definitions** | 44-98 | Define all navigation sections (Overview, Access, System, Platforms) |
| **Role-Based Filtering** | 100-119 | Filter navigation by user role |
| **Active Route Detection** | 121-126 | Determine current active route |
| **Mobile Overlay** | 131-137 | Mobile sidebar overlay |
| **Logo Section** | 150-184 | Logo and branding |
| **Navigation Sections** | 187-231 | Render navigation items |
| **Collapse Toggle** | 234-249 | Desktop sidebar collapse |
| **Entity Switcher** | 252-260 | Entity context switcher |

---

## Route Structure & Context Mapping

### Complete Route Tree:

```
app/
├── (auth)/                           → AUTH Context
│   └── login/page.tsx
│
├── api/                              → API Layer
│   ├── auth/[...nextauth]/route.ts  → AUTH Context
│   ├── admin-users/
│   │   └── [id]/
│   │       ├── route.ts              → USER_MANAGEMENT Context
│   │       └── permissions/route.ts  → PERMISSIONS Context
│   └── permissions/
│       ├── route.ts                  → PERMISSIONS Context
│       ├── matrix/route.ts           → PERMISSIONS Context
│       └── check/route.ts            → PERMISSIONS Context
│
└── dashboard/                        → NAVIGATION Context
    ├── page.tsx                      → NAVIGATION Context (home)
    ├── layout.tsx                    → NAVIGATION Context (server layout)
    ├── layout-client.tsx             → NAVIGATION Context (client logic)
    │
    ├── access/                       → Access Management Area
    │   ├── layout.tsx
    │   ├── users/                    → USER_MANAGEMENT Context
    │   │   ├── page.tsx
    │   │   ├── columns.tsx
    │   │   ├── UsersDataTable.tsx
    │   │   └── [id]/
    │   │       ├── page.tsx
    │   │       ├── AdminUserForm.tsx
    │   │       ├── UserDetailCard.tsx
    │   │       ├── not-found.tsx
    │   │       └── permissions/
    │   │           ├── page.tsx
    │   │           └── permission-editor-client.tsx
    │   └── permissions/              → PERMISSIONS Context
    │       └── page.tsx
    │
    ├── system/                       → System Administration Area
    │   ├── layout.tsx
    │   └── health/                   → HEALTH Context
    │       ├── page.tsx
    │       └── actions.ts
    │
    ├── platforms/                    → Platform-Specific Area (Future)
    │   └── layout.tsx
    │       ├── kids-ascension/       → Future: KA Context
    │       └── ozean-licht/          → Future: OL Context
    │
    └── settings/                     → Future: Settings Context
```

### Route → Context Table:

| Route | Context(s) | RBAC | Files Involved |
|-------|-----------|------|----------------|
| `/login` | AUTH | Public | `app/(auth)/login/page.tsx`, `components/auth/LoginForm.tsx` |
| `/dashboard` | NAVIGATION | All admins | `app/dashboard/page.tsx`, `components/dashboard/Sidebar.tsx` |
| `/dashboard/access/users` | USER_MANAGEMENT, NAVIGATION | super_admin, ka_admin, ol_admin | `app/dashboard/access/users/page.tsx`, `lib/mcp-client/queries.ts:48-225` |
| `/dashboard/access/users/[id]` | USER_MANAGEMENT, RBAC | super_admin, ka_admin, ol_admin | `app/dashboard/access/users/[id]/page.tsx`, `components/rbac/RoleBadge.tsx` |
| `/dashboard/access/users/[id]/permissions` | USER_MANAGEMENT, PERMISSIONS, RBAC | super_admin only | `app/dashboard/access/users/[id]/permissions/page.tsx`, `lib/rbac/permissions.ts` |
| `/dashboard/access/permissions` | PERMISSIONS, RBAC | super_admin only | `app/dashboard/access/permissions/page.tsx`, `components/permissions/PermissionMatrix.tsx` |
| `/dashboard/system/health` | HEALTH | All admins | `app/dashboard/system/health/page.tsx`, `lib/mcp-client/health.ts` |
| `/api/admin-users/[id]` | USER_MANAGEMENT, AUTH, MCP_CLIENT | super_admin (PATCH), All (GET) | `app/api/admin-users/[id]/route.ts`, `lib/mcp-client/queries.ts:48-225` |
| `/api/permissions/*` | PERMISSIONS, AUTH, MCP_CLIENT | super_admin only | `app/api/permissions/*.ts`, `lib/rbac/permissions.ts` |

---

## Smart Navigation Patterns

### Pattern 1: Feature Development Workflow

**Goal:** Implement a new feature in the admin dashboard

**Steps:**
1. **Identify Context** - Which functional area? (Access, System, Platforms)
2. **Find Entry Point** - Use Quick Navigation Table (§1)
3. **Read Minimal Set** - Read only critical files for that context
4. **Check Types** - Review `types/admin.ts` for data structures
5. **Review Patterns** - Look at similar existing features
6. **Implement** - Follow established patterns
7. **Update Navigation** - Add to `components/dashboard/Sidebar.tsx:44-98`
8. **Update Tests** - Add tests in `tests/unit/` or `tests/integration/`
9. **Update Docs** - Update `docs/routes.md` and this file (§8)

**Example: Adding a new "Audit Log" feature in System area**
```
1. Context: HEALTH (similar infrastructure feature)
2. Entry Point: Create app/dashboard/system/audit/page.tsx
3. Read: lib/mcp-client/queries.ts:376-486 (audit operations)
4. Types: types/admin.ts (AuditLog types)
5. Pattern: app/dashboard/system/health/page.tsx (similar structure)
6. Implement: Create page, components, API routes
7. Navigation: Add to Sidebar.tsx system section (lines 72-81)
8. Tests: tests/unit/audit/audit.test.ts
9. Docs: Update this file and docs/routes.md
```

---

### Pattern 2: Bug Investigation Workflow

**Goal:** Find and fix a bug in existing functionality

**Steps:**
1. **Identify Route** - Which page/route has the bug?
2. **Map to Context** - Use Route → Context Table (§8)
3. **Read Context Files** - Start with Core Files for that context (§2)
4. **Check API Layer** - If data-related, check `app/api/` routes
5. **Check MCP Client** - If database-related, check `lib/mcp-client/queries.ts` (use §6 for line jumps)
6. **Check RBAC** - If permission-related, check `lib/rbac/permissions.ts`
7. **Test Fix** - Write test to reproduce bug, then fix
8. **Verify** - Test in browser and run test suite

**Example: User list not filtering correctly**
```
1. Route: /dashboard/access/users
2. Context: USER_MANAGEMENT
3. Read: app/dashboard/access/users/page.tsx, UsersDataTable.tsx
4. API: Check app/api/admin-users/[id]/route.ts (not used for list)
5. MCP: Check lib/mcp-client/queries.ts:158-193 (listAdminUsers)
6. RBAC: Not relevant for filtering
7. Test: tests/integration/users/filtering.test.ts
8. Verify: npm test && npm run dev
```

---

### Pattern 3: Adding a New Route Workflow

**Goal:** Add a new page/route to the dashboard

**Steps:**
1. **Determine Area** - Access, System, or Platforms?
2. **Create Page** - Create `page.tsx` in appropriate directory
3. **Add RBAC** - Add role checks using `requireAnyRole()`
4. **Update Navigation** - Add to `components/dashboard/Sidebar.tsx:44-98`
5. **Add Route Config** - Add to `lib/rbac/constants.ts` ROUTE_ROLES
6. **Create Components** - Add feature-specific components
7. **Add API Routes** - Create API endpoints if needed
8. **Update Docs** - Update `docs/routes.md` and this file (§8)
9. **Test** - Manual test and add automated tests

**Example: Adding "Settings" page**
```
1. Area: System (infrastructure-related)
2. Create: app/dashboard/system/settings/page.tsx
3. RBAC: await requireAnyRole(['super_admin', 'ka_admin', 'ol_admin'])
4. Navigation: Add to Sidebar.tsx:72-81 (system section)
5. Route Config: lib/rbac/constants.ts ROUTE_ROLES['/dashboard/system/settings']
6. Components: components/settings/*.tsx
7. API: app/api/settings/route.ts (if needed)
8. Docs: Add to docs/routes.md and update §8 in this file
9. Test: Navigate to /dashboard/system/settings, verify RBAC
```

---

### Pattern 4: Permission Addition Workflow

**Goal:** Add a new permission to the system

**Steps:**
1. **Define Permission** - Add to `lib/rbac/permission-categories.ts` (appropriate category)
2. **Add to Roles** - Update `lib/rbac/constants.ts` role defaults
3. **Implement Checks** - Add permission checks in target features
4. **Database Migration** - Run migration to add permission to DB
5. **Update Matrix UI** - Verify permission appears in matrix
6. **Add Tests** - Test permission checks in relevant features
7. **Document** - Update `docs/rbac-guide.md`

**Example: Adding "audit.export" permission**
```
1. Define: lib/rbac/permission-categories.ts (add to System Administration category, lines 478-537)
   {
     name: 'audit.export',
     description: 'Export audit logs to CSV',
     category: 'SYSTEM_ADMINISTRATION',
     risks: ['Data exposure'],
   }
2. Roles: lib/rbac/constants.ts (add to super_admin default permissions)
3. Checks: In audit export handler, add hasPermission(session.user.permissions, 'audit.export')
4. Migration: CREATE migration to INSERT permission into admin_permissions table
5. Matrix: Load /dashboard/access/permissions, verify new permission visible
6. Tests: tests/unit/rbac/permissions.test.ts (test hasPermission with 'audit.export')
7. Document: docs/rbac-guide.md (add to permission list)
```

---

## Context Dependency Graph

**Layer 0 (Foundation)** - No dependencies:
```
├─ UI Context (components/ui/, components/admin/)
└─ MCP_CLIENT Context (lib/mcp-client/)
```

**Layer 1 (Core Services)** - Depends on Layer 0:
```
├─ AUTH Context
│   └─ Depends on: MCP_CLIENT, UI
├─ RBAC Context
│   └─ Depends on: AUTH, MCP_CLIENT, UI
└─ HEALTH Context
    └─ Depends on: MCP_CLIENT, UI
```

**Layer 2 (Features)** - Depends on Layers 0-1:
```
├─ PERMISSIONS Context
│   └─ Depends on: AUTH, RBAC, MCP_CLIENT, UI
└─ NAVIGATION Context
    └─ Depends on: AUTH, RBAC, UI
```

**Layer 3 (Applications)** - Depends on Layers 0-2:
```
└─ USER_MANAGEMENT Context
    └─ Depends on: AUTH, RBAC, PERMISSIONS, MCP_CLIENT, UI
```

**Visualization:**
```
                    ┌──────────────────────┐
                    │ USER_MANAGEMENT (L3) │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼──────────────────┐
             │                 │                  │
     ┌───────▼────────┐ ┌─────▼──────┐ ┌────────▼────────┐
     │ PERMISSIONS(L2)│ │NAVIGATION  │ │   HEALTH (L1)   │
     └───────┬────────┘ │   (L2)     │ └────────┬────────┘
             │          └─────┬──────┘          │
             │                │                 │
        ┌────▼────────────────▼────────────────▼────┐
        │            AUTH (L1), RBAC (L1)            │
        └────┬─────────────────────────────────┬────┘
             │                                  │
        ┌────▼─────────┐                 ┌─────▼──────┐
        │ MCP_CLIENT   │                 │ UI Context │
        │   (L0)       │                 │   (L0)     │
        └──────────────┘                 └────────────┘
```

---

## Critical vs Optional Files

### CRITICAL Files (Always Understand These)

**Core Infrastructure:**
```
types/admin.ts                          # All type definitions [READ FIRST]
lib/auth/config.ts                      # Authentication flow [CRITICAL]
lib/auth-utils.ts                       # Auth helper functions [CRITICAL]
lib/rbac/permissions.ts                 # Permission logic [CRITICAL]
lib/rbac/constants.ts                   # Role definitions [CRITICAL]
lib/mcp-client/queries.ts               # All database operations [CRITICAL]
lib/mcp-client/client.ts                # MCP client base [CRITICAL]
middleware.ts                           # Route protection [CRITICAL]
lib/utils.ts                            # Utility functions (cn, etc.) [CRITICAL]
components/dashboard/Sidebar.tsx        # Navigation structure [CRITICAL]
```

**Read these files FIRST when joining the project or investigating any issue.**

### OPTIONAL Files (Read When Needed)

**Health Monitoring (only if working on health features):**
```
lib/mcp-client/health.ts
components/health/*.tsx
app/dashboard/system/health/*
```

**Data Tables (only if working on table features):**
```
components/data-table/*.tsx
lib/hooks/useServerPagination.ts
```

**Forms (only if working on form features):**
```
components/admin/form/*.tsx
```

**Breadcrumbs (only if working on navigation):**
```
lib/navigation/breadcrumb-utils.ts
components/dashboard/Breadcrumb.tsx
```

**API Routes (only if working on specific endpoints):**
```
app/api/<specific-endpoint>/*.ts
```

### Files That Should Be Read Together (Tight Coupling)

**Authentication Stack (3 files):**
```
1. middleware.ts                        # Entry point (route protection)
2. lib/auth/config.ts                   # NextAuth configuration
3. lib/auth-utils.ts                    # Helper functions
```

**Permission System (3 files):**
```
1. lib/rbac/constants.ts                # Role → Permission mapping
2. lib/rbac/permissions.ts              # Permission logic
3. lib/rbac/permission-categories.ts    # Permission definitions
```

**User Management Stack (4 files):**
```
1. app/dashboard/access/users/page.tsx         # UI entry point
2. app/api/admin-users/[id]/route.ts           # API layer
3. lib/mcp-client/queries.ts (lines 48-225)    # Data layer
4. types/admin.ts                               # Type definitions
```

**Data Table Pattern (3 files):**
```
1. components/data-table/data-table.tsx        # Component
2. app/dashboard/access/users/columns.tsx      # Usage example
3. lib/hooks/useServerPagination.ts            # Pagination hook
```

---

## Documentation Structure

### Entry Points by Role:

**For AI Agents:**
```
1. THIS FILE (CONTEXT-MAP.md)           # Navigation guide [START HERE]
2. .claude/CLAUDE.md                     # Development patterns
3. docs/routes.md                        # Route structure
4. docs/architecture.md                  # System architecture
```

**For Developers:**
```
1. README.md                             # Project overview [START HERE]
2. DEVELOPER_GUIDE.md                    # Quick reference
3. docs/architecture.md                  # System design
4. docs/development/credentials.md       # Test users
```

**For Operations:**
```
1. DEPLOYMENT.md                         # Quick deployment [START HERE]
2. docs/deployment/deployment.md         # Full deployment guide
3. docs/development/credentials.md       # Access credentials
```

**For Product/Planning:**
```
1. README.md                             # Overview [START HERE]
2. docs/roadmap-specs-list.md           # Implementation roadmap
3. specs/                                # Detailed specifications
```

### Documentation Files:

```
Root:
  CONTEXT-MAP.md                         # THIS FILE - Agent navigation [SSoT]
  README.md                              # Project overview
  DEVELOPER_GUIDE.md                     # Quick developer reference
  BRANDING.md                            # Brand guidelines
  DEPLOYMENT.md                          # Deployment quick reference
  CHANGELOG.md                           # Version history
  .claude/CLAUDE.md                      # AI agent development guide

docs/:
  README.md                              # Documentation index
  architecture.md                        # Architecture overview
  routes.md                              # Route map
  design-system.md                       # UI/UX guidelines
  rbac-guide.md                          # RBAC usage guide
  roadmap-specs-list.md                  # Implementation roadmap

docs/features/:
  admin-db-schema-mcp-client.md          # Database schema
  minio-s3-storage-integration.md        # Storage integration
  nextauth-admin-authentication.md       # Auth implementation
  system-health-monitoring.md            # Health monitoring

docs/development/:
  credentials.md                         # Test credentials [IMPORTANT]
  dashboard-status-2025-11-09.md         # Current status

docs/deployment/:
  deployment.md                          # Full deployment guide

docs/decisions/:
  cleanup-summary.md                     # Spec 0.1 cleanup decision
  storage-feature-status.md              # Storage feature decision

docs/reports/:
  rbac-implementation-report.md          # RBAC implementation
  permissions-matrix-ui-implementation-report.md
  component-library-status.md            # Component library status
  (+ 6 more reports)

specs/:
  admin-cleanup-foundation-0.1.md        # Cleanup spec (completed)
  admin-layout-navigation.md             # Layout spec
  admin-basic-rbac.md                    # RBAC spec
  admin-user-management-list.md          # User management spec
  (+ 5 more specs)
```

---

## Agent Navigation Best Practices

### 1. Start with Context, Not Files

❌ **DON'T:** Jump straight to reading files
✅ **DO:** Identify the context first, then read minimal set

**Example:**
```
Task: "Fix bug in user permissions"

❌ BAD: Read all files in app/dashboard/access/
✅ GOOD:
  1. Identify context: PERMISSIONS + USER_MANAGEMENT
  2. Read minimal set:
     - lib/rbac/permissions.ts (lines 15-127)
     - app/dashboard/access/users/[id]/permissions/page.tsx
     - app/api/admin-users/[id]/permissions/route.ts
```

### 2. Use Line-Based Navigation for Large Files

❌ **DON'T:** Read entire 799-line queries.ts file
✅ **DO:** Jump to specific sections using §6

**Example:**
```
Task: "Add new admin user query method"

❌ BAD: Read lib/mcp-client/queries.ts (all 799 lines)
✅ GOOD: Read lines 48-225 only (Admin User Operations section)
```

### 3. Follow Dependency Layers

❌ **DON'T:** Start at Layer 3 (applications)
✅ **DO:** Understand Layer 0-1 first, then move up

**Example:**
```
Task: "Understand permission system"

❌ BAD: Start with app/dashboard/access/permissions/page.tsx
✅ GOOD:
  1. Layer 0: Read types/admin.ts (data structures)
  2. Layer 1: Read lib/rbac/permissions.ts (core logic)
  3. Layer 2: Read components/permissions/PermissionMatrix.tsx (UI)
  4. Layer 3: Read app/dashboard/access/permissions/page.tsx (integration)
```

### 4. Check Context Boundaries

❌ **DON'T:** Mix contexts when reading
✅ **DO:** Complete one context before moving to next

**Example:**
```
Task: "Add health check for new service"

✅ GOOD:
  1. Complete HEALTH context:
     - lib/mcp-client/health.ts (add check method)
     - app/dashboard/system/health/actions.ts (add server action)
     - components/health/NewServiceHealthCard.tsx (add component)
  2. Then move to NAVIGATION context if needed:
     - components/dashboard/Sidebar.tsx (add menu item)
```

### 5. Use Pattern Matching

❌ **DON'T:** Reinvent patterns
✅ **DO:** Find similar feature, copy pattern

**Example:**
```
Task: "Add new 'Videos' page in System area"

✅ GOOD:
  1. Find similar feature: app/dashboard/system/health/
  2. Copy structure:
     - page.tsx (server component with requireAuth)
     - actions.ts (server actions)
     - components/ (feature-specific components)
  3. Adapt for videos
```

---

## Maintenance

### When to Update This File

**ALWAYS update CONTEXT-MAP.md when:**
- ✅ Adding new route in `app/dashboard/`
- ✅ Creating new context/feature area
- ✅ Adding large file (>200 LOC) that needs line-based navigation
- ✅ Changing route structure (moving routes)
- ✅ Adding new critical file that all agents should know about
- ✅ Modifying context boundaries or dependencies
- ✅ Creating new patterns or workflows

**Update Process:**
1. Make code changes
2. Update relevant sections in CONTEXT-MAP.md:
   - §1 Quick Navigation Table (if new task type)
   - §2 Context Boundaries (if new context or files)
   - §6 Line-Based Navigation (if large file changed)
   - §8 Route Structure (if routes added/moved)
3. Commit both code and CONTEXT-MAP.md together

### Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-11 | 1.0.0 | Initial creation after Spec 0.1 cleanup |

---

## Quick Reference Card

**Copy this to your notes:**

```
ADMIN DASHBOARD QUICK REFERENCE

Working on...           Start Here                        Lines
─────────────────────────────────────────────────────────────────
Authentication          lib/auth/config.ts                62-151
Permissions/RBAC        lib/rbac/permissions.ts           15-127
User Management         app/dashboard/access/users/       -
User API                app/api/admin-users/[id]/         -
Permission Matrix       app/dashboard/access/permissions/ -
Health Monitoring       app/dashboard/system/health/      -
Database Queries        lib/mcp-client/queries.ts         See §6
Navigation              components/dashboard/Sidebar.tsx  44-98

Critical Files (Read First):
  types/admin.ts, lib/auth/config.ts, lib/rbac/permissions.ts,
  lib/mcp-client/queries.ts, middleware.ts

Context Layers:
  L0: UI, MCP_CLIENT
  L1: AUTH, RBAC, HEALTH
  L2: PERMISSIONS, NAVIGATION
  L3: USER_MANAGEMENT

Navigation Pattern:
  1. Identify context
  2. Read minimal set
  3. Check types
  4. Follow pattern
```

---

**END OF CONTEXT-MAP.md**

*This file is the Single Source of Truth for agent navigation in the admin dashboard.*
*Keep it updated and consult it FIRST when navigating the codebase.*
