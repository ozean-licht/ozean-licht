# Admin Interface Patterns - Ozean Licht Ecosystem

## Executive Summary

The Ozean Licht admin app demonstrates a mature, well-architected pattern for building admin interfaces with data management, dashboards, and CRUD operations. The stack uses Next.js 14 with TypeScript, TanStack React Table, and a centralized MCP Gateway client for all data operations.

---

## Architecture Overview

### Directory Structure

```
apps/admin/
├── app/
│   ├── api/                          # API routes for CRUD operations
│   │   └── admin-users/[id]/        # Resource-specific endpoints
│   └── dashboard/                    # Dashboard pages
│       ├── access/users/            # Users data table & detail pages
│       ├── platforms/courses/       # Course management
│       ├── content/blog/            # Blog writer
│       ├── tools/projects/          # Project dashboard
│       └── system/health/           # System monitoring
├── components/
│   ├── data-table/                  # Core data table components
│   │   ├── data-table.tsx           # Main table wrapper
│   │   ├── data-table-toolbar.tsx   # Filters, search, bulk actions
│   │   ├── data-table-pagination.tsx
│   │   └── data-table-*.tsx         # Support components
│   └── projects/                    # Domain-specific components
│       ├── ProjectCard.tsx
│       ├── MyTasksWidget.tsx
│       └── ProcessTemplatesWidget.tsx
├── lib/
│   ├── mcp-client/                  # MCP Gateway integration
│   │   ├── client.ts                # Base client
│   │   └── queries.ts               # Query builders
│   ├── data-table/
│   │   └── utils.ts                 # CSV export, formatting
│   └── rbac/                        # Auth & permissions
└── types/                           # TypeScript interfaces
    ├── data-table.ts
    ├── user.ts
    └── admin.ts
```

---

## 1. Data Table Pattern

### Core Component: `DataTable<TData, TValue>`

**Location:** `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/data-table.tsx`

**Key Features:**
- Generic component supporting any data type via TypeScript generics
- Supports both client-side and server-side pagination
- Built on TanStack React Table (React Query Table)
- Enables sorting, filtering, column visibility, row selection

**Configuration:**

```typescript
interface DataTableProps<TData, TValue> {
  // Data & columns
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  // Pagination modes
  pagination?: 'client' | 'server';
  pageCount?: number;
  onPaginationChange?: (page: number, pageSize: number) => void;

  // Sorting & filtering
  enableSorting?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;

  // Row selection & bulk operations
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  bulkActions?: BulkAction<TData>[];

  // Export & UX
  enableExport?: boolean;
  exportFilename?: string;
  isLoading?: boolean;
  emptyState?: { title; description?; action? };
}
```

**Usage Example - Users Table:**

```typescript
// In page.tsx (server component)
export default async function UsersPage({ searchParams }) {
  const filters: UserFilters = {
    search: searchParams.search,
    offset: parseInt(searchParams.offset || '0'),
    limit: 50,
  };

  const { users, total, limit, offset } = await mcpClient.listUsers(filters);

  return (
    <Suspense fallback={<DataTableSkeleton columns={5} rows={10} />}>
      <UsersDataTable
        initialData={users}
        total={total}
        limit={limit}
        offset={offset}
      />
    </Suspense>
  );
}

// In UsersDataTable.tsx (client component)
export function UsersDataTable({ initialData, total, limit, offset }) {
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 300);

  // Auto-sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (offset > 0) params.set('offset', offset.toString());
    router.replace(`/dashboard/access/users?${params.toString()}`);
  }, [debouncedSearch, offset]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          {/* Filter options */}
        </Select>
        {hasFilters && (
          <Button onClick={handleClearFilters}>Clear</Button>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={initialData}
        pagination="server"
        pageCount={Math.ceil(total / limit)}
        onPaginationChange={(page, pageSize) => {
          // Update URL with new offset
          const newOffset = page * pageSize;
          router.replace(
            `/dashboard/access/users?offset=${newOffset}`
          );
        }}
        enableSorting
        enableExport
      />

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {offset + 1} to {Math.min(offset + limit, total)} of {total}
      </div>
    </div>
  );
}
```

### Column Definition Pattern

**Location:** `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/access/users/columns.tsx`

```typescript
export const columns: ColumnDef<User>[] = [
  // Simple column with custom cell renderer
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.original.name;
      const isTeam = row.original.entities.some(e => e.role === 'team');
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{name || 'Unknown'}</span>
          {isTeam && <Badge>TEAM</Badge>}
        </div>
      );
    },
    enableSorting: true,
  },

  // Column with custom filter function
  {
    id: 'entities',
    header: 'Platform Access',
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        {row.original.entities.map(entity => (
          <EntityBadge
            key={entity.id}
            entity={entity.entityId}
            compact
          />
        ))}
      </div>
    ),
    filterFn: (row, _id, value) => {
      const entityIds = row.original.entities.map(e => e.entityId);
      if (value === 'all') return true;
      if (value === 'both') return entityIds.length === 2;
      return entityIds.includes(value);
    },
  },

  // Status column with badge
  {
    accessorKey: 'emailVerified',
    header: 'Email Status',
    cell: ({ row }) =>
      row.original.emailVerified ? (
        <Badge variant="default">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      ) : (
        <Badge variant="outline">
          <XCircle className="h-3 w-3 mr-1" />
          Unverified
        </Badge>
      ),
    enableSorting: true,
  },

  // Date column with formatting
  {
    accessorKey: 'createdAt',
    header: 'Registered',
    cell: ({ row }) => {
      const date = row.original.createdAt;
      const formatted = `${date.getDate()}...`;
      return (
        <div className="flex flex-col">
          <span className="text-sm">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">{formatted}</span>
        </div>
      );
    },
    enableSorting: true,
  },

  // Action column with dropdown menu
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/access/users/${row.original.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(row.original.id)}
            >
              Copy User ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
```

---

## 2. Dashboard Patterns

### Dashboard Layout Structure

**Key Pattern:** Server component for data fetching, client component for interactivity

**File:** `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/tools/projects/page.tsx`

```typescript
// Server component - fetches data and auth
export const metadata: Metadata = {
  title: 'Projects - Admin Dashboard',
};

export default async function ProjectsPage() {
  const session = await requireAuth();
  const { user } = session;

  return <ProjectsDashboard user={user} />;
}
```

### Dashboard Components: ProjectsDashboard

**File:** `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/tools/projects/ProjectsDashboard.tsx`

**Architecture:**

```
ProjectsDashboard
├── Header (Title + Actions)
├── Stats Grid (4 metric cards)
├── My Tasks Widget
├── Tabbed Main Section
│   ├── Projects Tab
│   │   ├── Filter Controls
│   │   └── View Toggle (Grid/List)
│   │   └── Project Cards (dynamic based on view)
│   └── Templates Tab
│       └── Process Templates Widget
└── Recent Activity (Collapsible)
```

**Key Features:**

1. **State Management for Multiple Views**
```typescript
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
const [projectFilter, setProjectFilter] = useState<'all' | 'active' | 'recurring'>('all');
const [mainTab, setMainTab] = useState<'projects' | 'templates'>('projects');
const [activityExpanded, setActivityExpanded] = useState(false);
```

2. **Dynamic Data Filtering**
```typescript
const filteredProjects = mockProjects.filter(project => {
  if (projectFilter === 'all') return true;
  if (projectFilter === 'active') return project.status === 'active';
  if (projectFilter === 'recurring') return project.type === 'recurring';
  return true;
});
```

3. **Stats Calculation**
```typescript
const totalProjects = mockProjects.length;
const activeProjects = mockProjects.filter(p => p.status === 'active').length;
const totalTasks = mockProjects.reduce((sum, p) => sum + p.totalTasks, 0);
const completedTasks = mockProjects.reduce((sum, p) => sum + p.completedTasks, 0);
const completionRate = Math.round((completedTasks / totalTasks) * 100);
```

4. **Tabbed Navigation**
```typescript
<Tabs value={mainTab} onValueChange={(v) => setMainTab(v)}>
  <TabsList>
    <TabsTrigger value="projects">Projects</TabsTrigger>
    <TabsTrigger value="templates">Templates</TabsTrigger>
  </TabsList>

  <TabsContent value="projects">
    {viewMode === 'grid' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    ) : (
      <div className="space-y-3">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} compact />
        ))}
      </div>
    )}
  </TabsContent>

  <TabsContent value="templates">
    <ProcessTemplatesWidget maxTemplates={8} />
  </TabsContent>
</Tabs>
```

### Card Component Pattern: ProjectCard

**File:** `/opt/ozean-licht-ecosystem/apps/admin/components/projects/ProjectCard.tsx`

**Design:**

```typescript
interface ProjectCardProps {
  project: Project;
  onClick?: (projectId: string) => void;
  onActionClick?: (projectId: string, action: string) => void;
  compact?: boolean;
}

export default function ProjectCard({
  project,
  onClick,
  onActionClick,
  compact = false,
}) {
  // Compact view - single row
  if (compact) {
    return (
      <div className="p-4 rounded-xl border cursor-pointer">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isRecurring && <RefreshCw className="w-4 h-4" />}
            <h4 className="text-sm font-medium">{project.name}</h4>
          </div>
          <Badge>{statusConfig.text}</Badge>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span>{project.completedTasks}/{project.totalTasks} tasks</span>
          <span>{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-1 mt-2" />
      </div>
    );
  }

  // Full card view
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isRecurring ? (
                <RefreshCw className="w-4 h-4 text-primary" />
              ) : (
                <FolderOpen className="w-4 h-4" />
              )}
              <CardTitle>{project.name}</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
          </div>
          <Badge>{statusConfig.text}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm">Progress</span>
            <span className="text-sm font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">
                {isRecurring ? 'Next Run' : 'Due Date'}
              </p>
              <p className="text-sm">{formatDate(project.endDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Team</p>
              <p className="text-sm">{project.teamMembers} members</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 3. API Route Patterns

### Pattern: RESTful CRUD with Authentication & RBAC

**File:** `/opt/ozean-licht-ecosystem/apps/admin/app/api/admin-users/[id]/route.ts`

```typescript
import { auth } from '@/lib/auth/config';
import { canManageRoles } from '@/lib/rbac/utils';
import { z } from 'zod';

const updateAdminUserSchema = z.object({
  adminRole: z.enum(['super_admin', 'ol_admin', 'ol_editor', 'support']).optional(),
  entityScope: z.enum(['ozean_licht']).nullable().optional(),
  isActive: z.boolean().optional(),
});

/**
 * PATCH /api/admin-users/[id]
 * Update admin user role and entity access
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Require authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check authorization
    if (!canManageRoles(session)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    // 3. Validate input
    const body = await request.json();
    const validatedData = updateAdminUserSchema.parse(body);

    // 4. Execute operation
    const updatedUser = await mcpClient.updateAdminUser(params.id, {
      ...validatedData,
      updatedBy: session.user.adminUserId,
    });

    // 5. Audit log
    await mcpClient.createAuditLog({
      adminUserId: session.user.adminUserId,
      action: 'admin_user.role_updated',
      entityType: 'admin_users',
      entityId: params.id,
      metadata: {
        oldRole: body.oldRole,
        newRole: validatedData.adminRole,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    // Error handling with proper status codes
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin-users/[id]
 * Get admin user details
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = await mcpClient.getAdminUserById(params.id);

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    return NextResponse.json({ user: adminUser });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### API Route Template for New Resources

```typescript
// Validation schema
const createResourceSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  // ... other fields
});

// CREATE
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check specific permission for this resource
    if (!hasPermission(session, 'resources.create')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createResourceSchema.parse(body);

    const resource = await mcpClient.createResource(validatedData);

    // Audit
    await mcpClient.createAuditLog({
      action: 'resource.created',
      entityType: 'resources',
      entityId: resource.id,
    });

    return NextResponse.json({ success: true, resource }, { status: 201 });
  } catch (error) {
    // ... error handling
  }
}

// READ
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const resource = await mcpClient.getResourceById(params.id);
    if (!resource) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ resource });
  } catch (error) {
    // ... error handling
  }
}

// UPDATE
export async function PATCH(request: NextRequest, { params }) {
  // Similar pattern - auth, validate, update, audit
}

// DELETE
export async function DELETE(request: NextRequest, { params }) {
  // Similar pattern - auth, validate, delete, audit
}
```

---

## 4. MCP Client Query Pattern

**File:** `/opt/ozean-licht-ecosystem/apps/admin/lib/mcp-client/queries.ts`

### Pattern for Data Operations

```typescript
export class MCPGatewayClientWithQueries extends MCPGatewayClient {
  // ============================================================================
  // Entity Operations
  // ============================================================================

  /**
   * Get entity by ID
   */
  async getResourceById(id: string): Promise<Resource | null> {
    const sql = `
      SELECT id, name, description, status, created_at, updated_at
      FROM resources
      WHERE id = $1
    `;

    const rows = await this.query<ResourceRow>(sql, [id]);
    return rows.length > 0 ? this._mapResource(rows[0]) : null;
  }

  /**
   * List entities with filtering
   */
  async listResources(filters: ResourceFilters): Promise<ResourceListResponse> {
    let sql = `
      SELECT id, name, description, status, created_at, updated_at
      FROM resources
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    // Apply filters
    if (filters.search) {
      sql += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
      paramCount++;
    }

    if (filters.status) {
      sql += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    // Pagination
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    // Get total count
    const countResult = await this.query<{ count: number }>(
      `SELECT COUNT(*) as count FROM resources WHERE 1=1${
        filters.search ? ` AND (name ILIKE $1 OR description ILIKE $1)` : ''
      }`,
      filters.search ? [`%${filters.search}%`] : []
    );

    // Apply pagination
    sql += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const rows = await this.query<ResourceRow>(sql, params);

    return {
      resources: rows.map(row => this._mapResource(row)),
      total: parseInt(countResult[0].count),
      limit,
      offset,
    };
  }

  /**
   * Create entity
   */
  async createResource(data: CreateResourceInput): Promise<Resource> {
    const sql = `
      INSERT INTO resources (
        name, description, status, created_by
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, description, status, created_at, updated_at
    `;

    const rows = await this.query<ResourceRow>(sql, [
      data.name,
      data.description || null,
      data.status || 'active',
      data.createdBy || null,
    ]);

    return this._mapResource(rows[0]);
  }

  /**
   * Update entity
   */
  async updateResource(
    id: string,
    data: Partial<CreateResourceInput>
  ): Promise<Resource> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(data.name);
    }

    if (data.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(data.description);
    }

    if (data.status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(data.status);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const sql = `
      UPDATE resources
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const rows = await this.query<ResourceRow>(sql, values);
    return this._mapResource(rows[0]);
  }

  /**
   * Delete entity
   */
  async deleteResource(id: string): Promise<void> {
    const sql = 'DELETE FROM resources WHERE id = $1';
    await this.query(sql, [id]);
  }

  // ============================================================================
  // Helper: Map database row to domain type
  // ============================================================================

  private _mapResource(row: ResourceRow): Resource {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
```

---

## 5. Type Definitions Pattern

### Data Table Types

**File:** `/opt/ozean-licht-ecosystem/apps/admin/types/data-table.ts`

```typescript
export type PaginationMode = 'client' | 'server';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: PaginationMode;
  pageCount?: number;
  onPaginationChange?: (page: number, pageSize: number) => void;
  enableSorting?: boolean;
  onSortingChange?: (sorting: SortingState) => void;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  onGlobalFilterChange?: (filter: string) => void;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  bulkActions?: BulkAction<TData>[];
  enableExport?: boolean;
  exportFilename?: string;
  isLoading?: boolean;
  emptyState?: { title; description?; action? };
}

export interface BulkAction<TData> {
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedRows: TData[]) => void | Promise<void>;
  variant?: 'default' | 'destructive';
}
```

### Domain Types Example: User

**File:** `/opt/ozean-licht-ecosystem/apps/admin/types/user.ts`

```typescript
export type EntityType = 'kids_ascension' | 'ozean_licht';

export interface UserEntity {
  id: string;
  userId: string;
  entityId: EntityType;
  role: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  entities: UserEntity[];
}

export interface UserFilters {
  search?: string;
  entityId?: EntityType | 'both';
  emailVerified?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  limit?: number;
  offset?: number;
}

export interface UserListResponse {
  users: User[];
  total: number;
  limit: number;
  offset: number;
}
```

---

## 6. Toolbar & Filtering Pattern

**File:** `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/data-table-toolbar.tsx`

```typescript
export function DataTableToolbar<TData>({
  table,
  enableGlobalFilter,
  bulkActions,
  enableExport,
  exportFilename,
}: DataTableToolbarProps<TData>) {
  const isFiltered = 
    table.getState().columnFilters.length > 0 || 
    table.getState().globalFilter;
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Global search */}
        {enableGlobalFilter && (
          <Input
            placeholder="Search all columns..."
            value={table.getState().globalFilter ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {/* Clear filters button */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter('');
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Bulk actions when rows selected */}
      {selectedRows.length > 0 && bulkActions && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} row(s) selected
          </span>
          {bulkActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'default'}
              size="sm"
              onClick={() => action.onClick(
                selectedRows.map(row => row.original)
              )}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Export & column visibility */}
      {selectedRows.length === 0 && (
        <div className="flex items-center space-x-2">
          {enableExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(table, exportFilename)}
            >
              Export CSV
            </Button>
          )}
          <DataTableViewOptions table={table} />
        </div>
      )}
    </div>
  );
}
```

---

## 7. Complete Example: Building a New Resource Dashboard

### Step 1: Define Types

```typescript
// types/resource.ts
export interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'archived';
  priority: 'low' | 'medium' | 'high';
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceFilters {
  search?: string;
  status?: string;
  priority?: string;
  limit?: number;
  offset?: number;
}

export interface ResourceListResponse {
  resources: Resource[];
  total: number;
  limit: number;
  offset: number;
}
```

### Step 2: Add MCP Client Methods

```typescript
// lib/mcp-client/queries.ts (add to MCPGatewayClientWithQueries)
async listResources(filters: ResourceFilters): Promise<ResourceListResponse> {
  // ... implementation (see pattern above)
}

async getResourceById(id: string): Promise<Resource | null> {
  // ... implementation
}

async createResource(data: CreateResourceInput): Promise<Resource> {
  // ... implementation
}

async updateResource(id: string, data: Partial<Resource>): Promise<Resource> {
  // ... implementation
}

async deleteResource(id: string): Promise<void> {
  // ... implementation
}
```

### Step 3: Define Columns

```typescript
// app/dashboard/tools/resources/columns.tsx
export const columns: ColumnDef<Resource>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={
        row.original.status === 'active' ? 'default' : 'outline'
      }>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const color = {
        low: 'text-blue-600',
        medium: 'text-yellow-600',
        high: 'text-red-600',
      }[row.original.priority];
      return <span className={color}>{row.original.priority}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/tools/resources/${row.original.id}`}>
            View
          </Link>
        </Button>
        <DropdownMenu>
          {/* ... menu options */}
        </DropdownMenu>
      </div>
    ),
  },
];
```

### Step 4: Create Data Table Component

```typescript
// app/dashboard/tools/resources/ResourcesDataTable.tsx
'use client';

export function ResourcesDataTable({
  initialData,
  total,
  limit,
  offset,
}: {
  initialData: Resource[];
  total: number;
  limit: number;
  offset: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'all'
  );

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (offset > 0) params.set('offset', offset.toString());

    router.replace(
      `/dashboard/tools/resources${params.toString() ? `?${params.toString()}` : ''}`
    );
  }, [debouncedSearch, statusFilter, offset, router]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={initialData}
        pagination="server"
        pageCount={Math.ceil(total / limit)}
        onPaginationChange={(page, pageSize) => {
          const newOffset = page * pageSize;
          const params = new URLSearchParams(searchParams.toString());
          if (newOffset > 0) {
            params.set('offset', newOffset.toString());
          } else {
            params.delete('offset');
          }
          router.replace(`/dashboard/tools/resources?${params.toString()}`);
        }}
        enableSorting
        enableExport
      />
    </div>
  );
}
```

### Step 5: Create Server Page

```typescript
// app/dashboard/tools/resources/page.tsx
import { Metadata } from 'next';
import { requireAuth } from '@/lib/auth-utils';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client/queries';
import { ResourcesDataTable } from './ResourcesDataTable';
import { ResourceFilters } from '@/types/resource';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/admin/data-table-skeleton';

export const metadata: Metadata = {
  title: 'Resources | Admin Dashboard',
  description: 'Manage resources',
};

const mcpClient = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'admin-db',
});

export default async function ResourcesPage({ searchParams }) {
  await requireAuth();

  const filters: ResourceFilters = {
    search: searchParams.search,
    status: searchParams.status !== 'all' ? searchParams.status : undefined,
    offset: searchParams.offset ? parseInt(searchParams.offset, 10) : 0,
    limit: 50,
  };

  let resources = [];
  let total = 0;
  let limit = 50;
  let offset = 0;

  try {
    const result = await mcpClient.listResources(filters);
    resources = result.resources;
    total = result.total;
    limit = result.limit;
    offset = result.offset;
  } catch (error) {
    console.error('Error fetching resources:', error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground">Manage all resources</p>
      </div>

      <Suspense fallback={<DataTableSkeleton columns={5} rows={10} />}>
        <ResourcesDataTable
          initialData={resources}
          total={total}
          limit={limit}
          offset={offset}
        />
      </Suspense>
    </div>
  );
}
```

### Step 6: Create API Routes

```typescript
// app/api/resources/route.ts
import { auth } from '@/lib/auth/config';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';
import { z } from 'zod';

const createResourceSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createResourceSchema.parse(body);

    const mcpClient = new MCPGatewayClientWithQueries();
    const resource = await mcpClient.createResource({
      ...validatedData,
      createdBy: session.user.adminUserId,
    });

    return NextResponse.json({ resource }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// app/api/resources/[id]/route.ts
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mcpClient = new MCPGatewayClientWithQueries();
    const resource = await mcpClient.getResourceById(params.id);

    if (!resource) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ resource });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const mcpClient = new MCPGatewayClientWithQueries();
    const resource = await mcpClient.updateResource(params.id, body);

    return NextResponse.json({ resource });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mcpClient = new MCPGatewayClientWithQueries();
    await mcpClient.deleteResource(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Key Takeaways

### 1. **Server-Client Split**
- **Server components** (page.tsx): Fetch data, auth checks, metadata
- **Client components** (DataTable, Dashboard): Interactivity, state management, filtering

### 2. **Data Flow**
```
Server Page
  ↓ (fetches data via MCP client)
  ↓ (auth check)
Client DataTable Component
  ↓ (debounced search)
  ↓ (URL sync)
  ↓ (server pagination)
  API Route
  ↓ (auth check, validate, execute)
  MCP Gateway (port 8100)
```

### 3. **Standardized Patterns**
- **Types first**: Define domain types, filter types, response types
- **MCP client methods**: CRUD operations follow same pattern
- **Columns definition**: Reusable column configuration with custom cells
- **Toolbars**: Filters, search, bulk actions, export all from one component
- **Pagination**: Server-side by default (URL state sync)
- **API routes**: Auth → Validate → Execute → Audit

### 4. **Component Hierarchy**
```
Page (async, server)
  └─ DataTable (async, client with props)
       ├─ DataTableToolbar
       ├─ Table (from @/lib/ui)
       └─ DataTablePagination
```

### 5. **State Management**
- URL params for pagination/filters (browser history)
- React state (useState) for UI controls
- Debounced search to prevent excessive API calls
- Automatic URL sync on filter changes

---

## Files Reference

- **Data Table**: `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/`
- **Dashboard Pages**: `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/`
- **API Routes**: `/opt/ozean-licht-ecosystem/apps/admin/app/api/`
- **MCP Client**: `/opt/ozean-licht-ecosystem/apps/admin/lib/mcp-client/`
- **Types**: `/opt/ozean-licht-ecosystem/apps/admin/types/`
- **Auth/RBAC**: `/opt/ozean-licht-ecosystem/apps/admin/lib/auth/` and `/opt/ozean-licht-ecosystem/apps/admin/lib/rbac/`
