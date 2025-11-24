# Architectural Decision: Kids Ascension / Ozean Licht Admin Dashboard Separation

**Date:** 2025-11-24
**Status:** ✅ Implemented
**Decision Maker:** Sergej Goetz (via AI agents)

---

## Decision

Kids Ascension will have its own separate admin dashboard. The existing admin dashboard (`apps/admin/`) is now exclusively for the **Ozean Licht platform**.

---

## Context

Previously, the admin dashboard was designed as a unified interface serving both:
- Kids Ascension (educational platform)
- Ozean Licht (content/community platform)

This created complexity in:
- Role management (`ka_admin` vs `ol_admin`)
- Entity scoping (`kids_ascension` vs `ozean_licht`)
- Route organization
- Permission matrices
- Branding consistency

---

## Rationale

### Separation of Concerns
1. **Different Business Domains**: Educational platform vs. content platform have fundamentally different needs
2. **Independent Branding**: Each platform has distinct visual identity and user experience
3. **Clearer Authorization**: Simplified RBAC without cross-platform complexity
4. **Independent Evolution**: Each admin dashboard can evolve based on platform-specific requirements
5. **Reduced Complexity**: Eliminates entity switching and dual-platform navigation

### Benefits
- ✅ Simpler codebase (single platform focus)
- ✅ Clearer permissions model
- ✅ Better security isolation
- ✅ Easier to maintain and extend
- ✅ Platform-specific optimizations possible

---

## Implementation Summary

### Phase 1: Core Type System & RBAC (✅ Completed)

#### 1. Type Definitions Updated
**File:** `types/admin.ts`
- Changed `AdminRole` from `'super_admin' | 'ka_admin' | 'ol_admin' | 'support'`
  to `'super_admin' | 'ol_admin' | 'ol_editor' | 'support'`
- Changed `EntityScope` from `'kids_ascension' | 'ozean_licht' | null'`
  to `'ozean_licht' | null'`
- Added `ol_editor` role for content management

#### 2. RBAC Constants Restructured
**File:** `lib/rbac/constants.ts`
- ❌ Removed `ka_admin` role completely
- ✅ Added `ol_editor` role (Content Editor)
- ❌ Removed `kids_ascension` from `ENTITY_CONFIG`
- Updated `ROUTE_ROLES` to match new structure:
  - `/dashboard/access/users` → `['super_admin', 'ol_admin']`
  - `/dashboard/content` → `['super_admin', 'ol_admin', 'ol_editor']`
  - `/dashboard/members` → `['super_admin', 'ol_admin', 'ol_editor']`
  - `/dashboard/analytics` → `['super_admin', 'ol_admin', 'ol_editor']`

#### 3. RBAC Utilities Updated
**File:** `lib/rbac/utils.ts`
- Updated `canViewEntity()` to only accept `'ozean_licht'` entity
- Added `ol_editor` role support in entity checks

---

### Phase 2: API Layer (✅ Completed)

#### 1. API Route Updates
**Files Updated:**
- `app/api/admin-users/[id]/route.ts`
  - Changed database from `kids-ascension-db` to `shared-users-db`
  - Updated Zod schema: `['super_admin', 'ol_admin', 'ol_editor', 'support']`
  - Updated `entityScope` enum to `['ozean_licht']`

- `app/api/permissions/matrix/route.ts`
  - Updated roles array: `['super_admin', 'ol_admin', 'ol_editor', 'support']`

#### 2. Middleware
**Status:** ✅ Clean (no `ka_admin` references found)

---

### Phase 3: Component Layer (✅ Completed)

#### 1. RBAC Components
**File:** `components/rbac/RoleSelect.tsx`
- Updated roles array: `['super_admin', 'ol_admin', 'ol_editor', 'support']`

#### 2. Permission Components
**File:** `components/permissions/PermissionMatrix.tsx`
- Updated role labels (2 instances):
  ```typescript
  {
    super_admin: 'Super Admin',
    ol_admin: 'OL Admin',
    ol_editor: 'Content Editor',
    support: 'Support',
  }
  ```

#### 3. Page Components
**Files Updated:**
- `app/dashboard/access/permissions/page.tsx`
  - Updated roles array

- `app/dashboard/access/users/[id]/page.tsx`
  - Changed `requireAnyRole()` to `['super_admin', 'ol_admin']`

- `app/dashboard/access/users/page.tsx`
  - Updated comments and metadata
  - Changed from "both platforms" to "Ozean Licht platform"
  - Updated `requireAnyRole()` to `['super_admin', 'ol_admin']`

---

### Phase 4: Documentation (✅ Completed)

#### 1. Agent Instructions
**File:** `.claude/CLAUDE.md`
- Title: "Ozean Licht Admin Dashboard - AI Agent Development Guide"
- Added scope: "Ozean Licht platform ONLY"
- Updated all examples to use `ol_admin`, `ol_editor`
- Changed database references to `ozean-licht-db`
- Updated functional areas

#### 2. README
**File:** `README.md`
- Changed from "Unified admin interface" to "Admin interface for Ozean Licht platform"
- Added note about KA separation
- Documented architectural decision
- Updated success criteria

#### 3. Context Map
**File:** `CONTEXT-MAP.md`
- Added scope to header
- Updated all role references
- Updated route structure
- Changed navigation patterns

#### 4. Platform Layout
**File:** `app/dashboard/platforms/layout.tsx`
- Updated comment to remove Kids Ascension reference

---

### Phase 5: Tests (✅ Completed)

#### 1. RBAC Tests
**File:** `tests/unit/rbac/utils.test.ts`
- Complete rewrite to reflect new route structure
- Removed all `ka_admin` references
- Updated route paths:
  - `/dashboard/kids-ascension` → `/dashboard/content`
  - `/dashboard/ozean-licht` → `/dashboard/members`
- Added tests for `ol_editor` role
- Updated access control tests for new routes

---

## New Role Structure

### Ozean Licht Roles

| Role | Label | Description | Access Level |
|------|-------|-------------|--------------|
| `super_admin` | Super Admin | Full system access | All routes |
| `ol_admin` | Ozean Licht Admin | Full platform access | All Ozean Licht routes |
| `ol_editor` | Content Editor | Content management | Content, Members, Analytics only |
| `support` | Support | Read-only support | System routes only |

### Default Permissions

**super_admin:**
- Wildcard: `['*']` (all permissions)

**ol_admin:**
- `users.read`, `users.write`
- `courses.read`, `courses.write`, `courses.publish`
- `members.read`, `members.write`
- `payments.read`
- `analytics.read`
- `settings.read`, `settings.write`

**ol_editor:**
- `users.read`
- `courses.read`, `courses.write`, `courses.publish`
- `content.read`, `content.write`
- `members.read`
- `analytics.read`

**support:**
- `users.read`
- `courses.read`
- `members.read`
- `content.read`
- `analytics.read`

---

## New Route Structure

```
/dashboard
├── /access          # User Management & RBAC
│   ├── /users       # User list & details [super_admin, ol_admin]
│   └── /permissions # Permission matrix [super_admin, ol_admin]
├── /system          # System Administration
│   └── /health      # Health monitoring [all roles]
├── /content         # Content Management (Phase 2)
│   ├── /courses     # Future [super_admin, ol_admin, ol_editor]
│   ├── /lessons     # Future [super_admin, ol_admin, ol_editor]
│   └── /media       # Future [super_admin, ol_admin, ol_editor]
├── /members         # Member Management (Phase 2)
│   ├── /overview    # Future [super_admin, ol_admin, ol_editor]
│   ├── /subscriptions # Future [super_admin, ol_admin]
│   └── /engagement  # Future [super_admin, ol_admin, ol_editor]
├── /analytics       # Analytics (Phase 3)
│   ├── /overview    # Future [super_admin, ol_admin, ol_editor]
│   ├── /content     # Future [super_admin, ol_admin, ol_editor]
│   └── /members     # Future [super_admin, ol_admin, ol_editor]
├── /settings        # Platform Settings
│   └── ...          # Future [super_admin, ol_admin]
└── /audit           # Audit Logs
    └── ...          # Future [super_admin only]
```

---

## Database Strategy

### Current Databases
- `shared-users-db` - Authentication and shared user data
- `ozean-licht-db` - Ozean Licht platform data
- ❌ `kids-ascension-db` - Not used in this admin dashboard

### Kids Ascension
- Will have separate admin dashboard
- Will use `kids-ascension-db`
- Will share `shared-users-db` for SSO

---

## Files Modified

### Core Files (11 files)
1. `.claude/CLAUDE.md`
2. `README.md`
3. `CONTEXT-MAP.md`
4. `types/admin.ts`
5. `lib/rbac/constants.ts`
6. `lib/rbac/utils.ts`
7. `app/api/admin-users/[id]/route.ts`
8. `app/api/permissions/matrix/route.ts`
9. `components/rbac/RoleSelect.tsx`
10. `components/permissions/PermissionMatrix.tsx`
11. `tests/unit/rbac/utils.test.ts`

### Page Files (3 files)
12. `app/dashboard/access/permissions/page.tsx`
13. `app/dashboard/access/users/[id]/page.tsx`
14. `app/dashboard/access/users/page.tsx`

### Layout Files (1 file)
15. `app/dashboard/platforms/layout.tsx`

**Total: 15 files modified**

---

## Remaining Work

### Still Contains References
The following file types still contain `ka_admin` or Kids Ascension references:

1. **Spec Files** (6 files) - Historical documentation
   - `specs/admin-cleanup-foundation-0.1.md`
   - `specs/admin-permissions-matrix-ui.md`
   - `specs/admin-audit-logging-foundation.md`
   - `specs/admin-user-management-actions.md`
   - `specs/admin-user-management-list.md`
   - `specs/admin-basic-rbac.md`

2. **Documentation Files** (~15 files)
   - Various docs in `docs/` folder
   - Requirement documents
   - Reports and architecture docs

3. **Database References**
   - Need to audit `kids_ascension_db` usage
   - Ensure only `shared-users-db` and `ozean-licht-db` are used

### Priority
- Low priority (historical documentation)
- Can be cleaned up incrementally
- Core functionality is completely updated

---

## Migration Impact

### Breaking Changes
- ❌ `ka_admin` role no longer exists
- ❌ `kids_ascension` entity scope removed
- ❌ Old routes (`/dashboard/kids-ascension`) no longer valid

### New Features
- ✅ `ol_editor` role for content editors
- ✅ Simplified permission model
- ✅ Clear Ozean Licht focus
- ✅ Future-ready for OL-specific features

### Database Changes Required
- Update `admin_users` table:
  - Change `ka_admin` roles to appropriate OL roles
  - Update `entity_scope` from `kids_ascension` to `ozean_licht` or `null`
- Update `admin_roles` table if exists
- Audit log entries will show old role names (historical data preserved)

---

## Success Metrics

### Code Quality
- ✅ All TypeScript types updated
- ✅ All components updated
- ✅ All API routes updated
- ✅ Tests updated and passing
- ✅ Zero `ka_admin` references in active code

### Documentation
- ✅ Agent instructions updated
- ✅ README updated
- ✅ Context map updated
- ⏳ Spec files (low priority)

### Functionality
- ✅ RBAC system works with new roles
- ✅ Permission matrix displays correctly
- ✅ Route protection enforced
- ✅ User management functional

---

## Lessons Learned

1. **Early Separation**: Separating concerns early prevents complexity accumulation
2. **Type Safety**: TypeScript helped catch all role references during refactor
3. **Systematic Approach**: Todo list and systematic file-by-file approach was effective
4. **Test Updates**: Tests needed complete rewrite, not just role name changes
5. **Documentation Scope**: Active code takes priority over historical docs

---

## References

- Original Issue: Architectural decision for admin dashboard separation
- Implementation Date: 2025-11-24
- Files Changed: See "Files Modified" section above
- Related Decisions:
  - `cleanup-summary.md` - Previous cleanup (Spec 0.1)
  - `storage-feature-status.md` - Storage feature decision

---

**Implemented by:** Claude Code AI Agent
**Reviewed by:** Pending
**Status:** ✅ Core implementation complete, documentation cleanup ongoing
