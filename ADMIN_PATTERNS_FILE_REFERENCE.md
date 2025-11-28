# Admin Patterns - File Location Reference

## All Key Files in the Admin App

### Core Data Table Components

| File | Purpose | Key Export |
|------|---------|------------|
| `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/data-table.tsx` | Main table wrapper (generic) | `DataTable<TData, TValue>` |
| `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/data-table-toolbar.tsx` | Filters, search, bulk actions | `DataTableToolbar<TData>` |
| `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/data-table-pagination.tsx` | Pagination controls | `DataTablePagination<TData>` |
| `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/data-table-view-options.tsx` | Column visibility toggle | `DataTableViewOptions<TData>` |
| `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/data-table-column-header.tsx` | Sortable column header | `DataTableColumnHeader<TData, TValue>` |
| `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/data-table-faceted-filter.tsx` | Multi-value filter | `DataTableFacetedFilter<TData, TValue>` |
| `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/data-table-row-actions.tsx` | Row action dropdown | `DataTableRowActions<TData>` |

### Users Management (Complete Example)

| File | Purpose | Component/Type |
|------|---------|---|
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/access/users/page.tsx` | Server page - fetches users | Page component |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/access/users/UsersDataTable.tsx` | Client data table wrapper | `UsersDataTable` |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/access/users/columns.tsx` | Column definitions | `columns: ColumnDef<User>[]` |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/access/users/[id]/page.tsx` | User detail page | Detail page |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/access/users/[id]/UserDetailCard.tsx` | User info display | Component |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/access/users/[id]/AdminUserForm.tsx` | User edit form | Form component |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/access/users/[id]/permissions/page.tsx` | Permission editor page | Page |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/access/users/[id]/permissions/permission-editor-client.tsx` | Permission editor UI | Component |

### Projects Dashboard (Tabbed Dashboard Example)

| File | Purpose | Component |
|------|---------|-----------|
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/tools/projects/page.tsx` | Server page | Page component |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/tools/projects/ProjectsDashboard.tsx` | Main dashboard component | Client component |
| `/opt/ozean-licht-ecosystem/apps/admin/components/projects/ProjectCard.tsx` | Project card (grid/list) | Card component |
| `/opt/ozean-licht-ecosystem/apps/admin/components/projects/MyTasksWidget.tsx` | Tasks widget | Widget component |
| `/opt/ozean-licht-ecosystem/apps/admin/components/projects/ProcessTemplatesWidget.tsx` | Templates widget | Widget component |

### Other Dashboards

| File | Purpose |
|------|---------|
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/content/blog/page.tsx` | Blog page |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/content/blog/BlogWriter.tsx` | Blog editor |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/platforms/courses/page.tsx` | Courses page |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/platforms/courses/CoursesDashboard.tsx` | Courses dashboard |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/system/health/page.tsx` | Health check page |

### Dashboard Layout

| File | Purpose |
|------|---------|
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/layout.tsx` | Dashboard wrapper layout |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/layout-client.tsx` | Dashboard client layout |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/page.tsx` | Dashboard home/index |
| `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/DashboardCharts.tsx` | Chart components |

### API Routes

| File | Methods | Purpose |
|------|---------|---------|
| `/opt/ozean-licht-ecosystem/apps/admin/app/api/admin-users/[id]/route.ts` | GET, PATCH | User detail API |
| `/opt/ozean-licht-ecosystem/apps/admin/app/api/admin-users/[id]/permissions/route.ts` | GET, PATCH | User permissions API |
| `/opt/ozean-licht-ecosystem/apps/admin/app/api/permissions/route.ts` | GET | List permissions |
| `/opt/ozean-licht-ecosystem/apps/admin/app/api/permissions/check/route.ts` | POST | Check permission |
| `/opt/ozean-licht-ecosystem/apps/admin/app/api/permissions/matrix/route.ts` | GET | Permission matrix |
| `/opt/ozean-licht-ecosystem/apps/admin/app/api/auth/[...nextauth]/route.ts` | NextAuth routes | Auth |

### MCP Client & Queries

| File | Purpose | Main Class |
|------|---------|------------|
| `/opt/ozean-licht-ecosystem/apps/admin/lib/mcp-client/client.ts` | Base MCP client | `MCPGatewayClient` |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/mcp-client/queries.ts` | Query builders | `MCPGatewayClientWithQueries` |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/mcp-client/storage.ts` | Storage operations | Storage methods |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/mcp-client/health.ts` | Health checks | Health methods |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/mcp-client/errors.ts` | Error classes | Custom errors |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/mcp-client/index.ts` | Exports | Main exports |

### Utilities

| File | Purpose |
|------|---------|
| `/opt/ozean-licht-ecosystem/apps/admin/lib/data-table/utils.ts` | CSV export, date formatting |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/data-table/hooks/useServerPagination.ts` | Server pagination hook |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/auth/config.ts` | NextAuth configuration |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/auth/adapter.ts` | NextAuth adapter |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/auth/utils.ts` | Auth utilities |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/auth-utils.ts` | Auth helpers |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/rbac/utils.ts` | RBAC utilities |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/rbac/permissions.ts` | Permission definitions |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/rbac/permission-categories.ts` | Permission categories |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/hooks/use-debounce.ts` | Debounce hook |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/hooks/useToast.ts` | Toast hook |
| `/opt/ozean-licht-ecosystem/apps/admin/lib/ui.ts` | UI component exports |

### Types

| File | Purpose | Key Types |
|------|---------|-----------|
| `/opt/ozean-licht-ecosystem/apps/admin/types/data-table.ts` | Data table types | `DataTableProps`, `BulkAction` |
| `/opt/ozean-licht-ecosystem/apps/admin/types/user.ts` | User domain types | `User`, `UserEntity`, `UserFilters` |
| `/opt/ozean-licht-ecosystem/apps/admin/types/admin.ts` | Admin user types | `AdminUser`, `AdminRole` |
| `/opt/ozean-licht-ecosystem/apps/admin/types/database-users.ts` | DB user types | Database row types |
| `/opt/ozean-licht-ecosystem/apps/admin/types/database.ts` | DB entity types | Database row types |
| `/opt/ozean-licht-ecosystem/apps/admin/types/health.ts` | Health check types | Health status |
| `/opt/ozean-licht-ecosystem/apps/admin/types/mcp.ts` | MCP types | MCP operations |
| `/opt/ozean-licht-ecosystem/apps/admin/types/next-auth.d.ts` | NextAuth types | Session, user types |
| `/opt/ozean-licht-ecosystem/apps/admin/types/admin-components.ts` | Component types | Component prop types |

### Configuration Files

| File | Purpose |
|------|---------|
| `/opt/ozean-licht-ecosystem/apps/admin/tsconfig.json` | TypeScript config |
| `/opt/ozean-licht-ecosystem/apps/admin/next.config.js` | Next.js config |
| `/opt/ozean-licht-ecosystem/apps/admin/tailwind.config.ts` | Tailwind config |
| `/opt/ozean-licht-ecosystem/apps/admin/.eslintrc.json` | ESLint config |
| `/opt/ozean-licht-ecosystem/apps/admin/package.json` | Dependencies |
| `/opt/ozean-licht-ecosystem/apps/admin/components.json` | Component scaffolding |

### Tests

| File | Purpose |
|------|---------|
| `/opt/ozean-licht-ecosystem/apps/admin/tests/setup.ts` | Test setup |
| `/opt/ozean-licht-ecosystem/apps/admin/tests/unit/rbac/utils.test.ts` | RBAC tests |
| `/opt/ozean-licht-ecosystem/apps/admin/tests/unit/auth/utils.test.ts` | Auth tests |
| `/opt/ozean-licht-ecosystem/apps/admin/tests/lib/mcp-client/client.test.ts` | MCP client tests |
| `/opt/ozean-licht-ecosystem/apps/admin/tests/lib/mcp-client/health.test.ts` | Health tests |

### Root Admin Files

| File | Purpose |
|------|---------|
| `/opt/ozean-licht-ecosystem/apps/admin/README.md` | Admin app documentation |
| `/opt/ozean-licht-ecosystem/apps/admin/.claude/CLAUDE.md` | Claude instructions for admin app |

---

## Quick Lookup by Feature

### To understand Data Tables:
1. Start: `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/data-table.tsx`
2. Example: `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/access/users/UsersDataTable.tsx`
3. Types: `/opt/ozean-licht-ecosystem/apps/admin/types/data-table.ts`

### To understand Filtering:
1. Toolbar: `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/data-table-toolbar.tsx`
2. Usage: `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/access/users/UsersDataTable.tsx`
3. Debounce: `/opt/ozean-licht-ecosystem/apps/admin/lib/hooks/use-debounce.ts`

### To understand Dashboards:
1. Projects: `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/tools/projects/ProjectsDashboard.tsx`
2. Cards: `/opt/ozean-licht-ecosystem/apps/admin/components/projects/ProjectCard.tsx`
3. Widgets: `/opt/ozean-licht-ecosystem/apps/admin/components/projects/`

### To understand API Routes:
1. Example: `/opt/ozean-licht-ecosystem/apps/admin/app/api/admin-users/[id]/route.ts`
2. Auth: `/opt/ozean-licht-ecosystem/apps/admin/lib/auth/config.ts`
3. RBAC: `/opt/ozean-licht-ecosystem/apps/admin/lib/rbac/utils.ts`

### To understand MCP Client:
1. Base client: `/opt/ozean-licht-ecosystem/apps/admin/lib/mcp-client/client.ts`
2. Queries: `/opt/ozean-licht-ecosystem/apps/admin/lib/mcp-client/queries.ts`
3. Usage: `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/access/users/page.tsx`

### To understand Types:
1. Data table: `/opt/ozean-licht-ecosystem/apps/admin/types/data-table.ts`
2. Domain (users): `/opt/ozean-licht-ecosystem/apps/admin/types/user.ts`
3. Admin: `/opt/ozean-licht-ecosystem/apps/admin/types/admin.ts`

---

## File Size Reference

| Category | Files | Est. Lines |
|----------|-------|-----------|
| Data Table Components | 7 files | 500-800 LOC |
| Users Example | 7 files | 800-1200 LOC |
| Projects Dashboard | 4 files | 500-800 LOC |
| MCP Client | 5 files | 1000-1500 LOC |
| Types | 8 files | 400-600 LOC |
| API Routes | 5 files | 300-500 LOC |
| Auth/RBAC | 6 files | 600-900 LOC |
| **Total** | **~40 files** | **~6000-8000 LOC** |

---

## Navigation Tips

1. **New Resource**: Copy Users example structure
2. **Understand Flow**: Start with `/page.tsx` then follow component tree
3. **API Route Pattern**: Reference `/app/api/admin-users/[id]/route.ts`
4. **Type Safe**: Always define types before implementation
5. **Test Reference**: Look at existing tests for patterns

