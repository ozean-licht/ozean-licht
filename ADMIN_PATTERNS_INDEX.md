# Admin Patterns Documentation Index

This folder contains comprehensive documentation on how the Ozean Licht admin application is structured and how to build new admin features.

## Documents Overview

### 1. ADMIN_PATTERNS.md (READ THIS FIRST)
**Size:** 39KB | **Sections:** 7 | **Code Examples:** 5+

The comprehensive guide to understanding admin interface patterns. Contains:

- **Executive Summary** - What the admin app does and tech stack
- **Architecture Overview** - Directory structure and file organization
- **Data Table Pattern** - Generic table component with filtering, sorting, pagination
- **Dashboard Patterns** - Multi-section dashboards with tabs and cards
- **API Route Patterns** - RESTful CRUD endpoints with auth and validation
- **MCP Client Query Pattern** - Database operations and query builders
- **Type Definitions** - TypeScript types for data tables and domain models
- **Toolbar & Filtering** - Search, filters, bulk actions, export
- **Complete Example** - Step-by-step building a new resource dashboard

**Best for:** Understanding the "why" and "how" of admin patterns

### 2. ADMIN_PATTERNS_QUICK_REFERENCE.md (READ THIS SECOND)
**Size:** 17KB | **Sections:** 6 | **Code Snippets:** 6

The quick-start guide for implementing new admin features. Contains:

- **File Organization** - Where to create new files
- **Step-by-Step Checklist** - 6 implementation steps with time estimates
  1. Define Types (2-3 min)
  2. Add MCP Client Methods (5-10 min)
  3. Define Columns (5-10 min)
  4. Create DataTable Component (10-15 min)
  5. Create Server Page (5 min)
  6. Create API Routes (15-20 min)
- **Code Snippets** - Copy-paste templates for all components
- **Common Patterns** - Best practices and tips
- **Key Files to Reference** - Most important files to study
- **Time Estimates** - 45-75 minutes total for a complete resource

**Best for:** Getting code written quickly using proven templates

### 3. ADMIN_PATTERNS_FILE_REFERENCE.md (USE FOR NAVIGATION)
**Size:** 12KB | **Tables:** 10+ | **Files Documented:** 40+

The complete file listing and navigation guide. Contains:

- **Core Data Table Components** - All 7 data table components
- **Users Management** - Complete example with 8 files
- **Projects Dashboard** - Tabbed dashboard with 4 files
- **Other Dashboards** - Blog, courses, health pages
- **API Routes** - All endpoint implementations
- **MCP Client** - Database client classes
- **Utilities** - Helpers, hooks, auth, RBAC
- **Types** - All TypeScript definitions
- **Configuration** - tsconfig, tailwind, eslint, etc.
- **Quick Lookup Tables** - By feature (data tables, filtering, dashboards, etc.)

**Best for:** Finding the right file and understanding what it does

## Quick Start Flow

```
Start here (5 min read)
         ↓
    ADMIN_PATTERNS.md
    (Executive Summary)
         ↓
Need to find a file?
         ↓
ADMIN_PATTERNS_FILE_REFERENCE.md
(Quick Lookup Tables)
         ↓
Ready to code?
         ↓
ADMIN_PATTERNS_QUICK_REFERENCE.md
(Step-by-step + Code Snippets)
         ↓
Need details on a specific pattern?
         ↓
ADMIN_PATTERNS.md
(Section 1-7 deep dives)
```

## Key Patterns at a Glance

### Data Tables
- **Files:** `/components/data-table/*.tsx`
- **Generic:** `DataTable<TData, TValue>`
- **Features:** Pagination (client/server), filtering, sorting, row selection, export
- **Example:** `/app/dashboard/access/users/UsersDataTable.tsx`

### Dashboards
- **Pattern:** Server page (fetch) + Client component (interact)
- **Features:** Tabs, filters, cards, collapsible sections, stats
- **Example:** `/app/dashboard/tools/projects/ProjectsDashboard.tsx`

### API Routes
- **Pattern:** RESTful CRUD (POST/GET/PATCH/DELETE)
- **Security:** Auth check → Permission check → Validate → Execute → Audit log
- **Example:** `/app/api/admin-users/[id]/route.ts`

### Database Operations
- **Client:** `MCPGatewayClientWithQueries`
- **Methods:** getXxx, listXxx, createXxx, updateXxx, deleteXxx
- **Features:** Filtering, pagination, sorting, parameterized queries
- **File:** `/lib/mcp-client/queries.ts`

### Types
- **Domain:** User, Resource, Project, etc.
- **Filters:** UserFilters, ResourceFilters, etc.
- **Response:** UserListResponse, ResourceListResponse, etc.
- **UI:** DataTableProps, BulkAction, etc.

## File Organization for New Resources

Create this structure:

```
types/
  your-resource.ts              # Domain types

app/
  dashboard/
    {section}/
      {resource}/
        page.tsx                # Server page (fetch data)
        columns.tsx             # DataTable columns
        YourDataTable.tsx       # DataTable wrapper
        [id]/
          page.tsx              # Detail page

api/
  {resource}/
    route.ts                    # POST (create), GET list
    [id]/
      route.ts                  # GET (read), PATCH (update), DELETE

lib/
  mcp-client/queries.ts         # Add query methods here
```

## Time to Implement New Resource

| Step | Time | Complexity |
|------|------|------------|
| Types | 2-3 min | Low |
| MCP Client | 5-10 min | Medium |
| Columns | 5-10 min | Low |
| DataTable Component | 10-15 min | Medium |
| Server Page | 5 min | Low |
| API Routes | 15-20 min | High |
| **Total** | **45-75 min** | **Medium** |

## Key Technologies

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Tables:** TanStack React Table v8
- **Database:** PostgreSQL via MCP Gateway (port 8100)
- **Auth:** NextAuth.js
- **RBAC:** Custom role-based access control
- **Validation:** Zod
- **UI:** Shadcn/ui + Tailwind CSS
- **Components:** @ozean-licht/shared-ui + local components

## Database Access

Always use MCP Gateway (port 8100):
- No direct database connections allowed
- Use `MCPGatewayClientWithQueries` class
- Endpoint pattern: `POST http://localhost:8100/mcp/{service}/{operation}`
- Services: postgres, minio, github, telegram, mem0

## Auth & RBAC

Every endpoint must:
1. Check authentication: `const session = await auth()`
2. Check authorization: `if (!canManageRoles(session))`
3. Return proper status codes: 401 (unauth), 403 (forbidden), 400 (bad data)
4. Log audit events: `await mcpClient.createAuditLog(...)`

## Most Important Files to Reference

1. **Data Table Base:** `/apps/admin/components/data-table/data-table.tsx`
2. **Users Example (BEST REFERENCE):** `/apps/admin/app/dashboard/access/users/`
3. **API Route Pattern:** `/apps/admin/app/api/admin-users/[id]/route.ts`
4. **MCP Queries:** `/apps/admin/lib/mcp-client/queries.ts`
5. **Dashboard Example:** `/apps/admin/app/dashboard/tools/projects/ProjectsDashboard.tsx`

## Questions?

- "How do I build a new data table?" → See ADMIN_PATTERNS.md Section 1
- "How do I add filtering?" → See ADMIN_PATTERNS.md Section 6
- "What's the folder structure?" → See ADMIN_PATTERNS_FILE_REFERENCE.md
- "How do I implement this quickly?" → See ADMIN_PATTERNS_QUICK_REFERENCE.md
- "Where's the Users example?" → `/apps/admin/app/dashboard/access/users/`

## Document Versions

All documents were generated on **2025-11-28** by analyzing the Ozean Licht admin app codebase.

- Total LOC analyzed: 6000-8000
- Files documented: 40+
- Code examples: 5+
- Documentation pages: 2247 lines

---

**Start reading:** [ADMIN_PATTERNS.md](./ADMIN_PATTERNS.md)
