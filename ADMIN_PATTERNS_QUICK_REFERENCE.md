# Admin Patterns - Quick Reference Guide

## File Organization for New Resource

When adding a new admin feature, follow this structure:

```
apps/admin/
├── types/
│   └── your-resource.ts          # Domain types
├── app/
│   ├── dashboard/
│   │   └── {section}/
│   │       └── {resource}/
│   │           ├── page.tsx      # Server page (fetch data)
│   │           ├── [id]/
│   │           │   └── page.tsx  # Detail page
│   │           └── columns.tsx   # DataTable columns
│   └── api/
│       └── {resource}/
│           ├── route.ts          # List + Create
│           └── [id]/
│               └── route.ts      # Get, Update, Delete
└── lib/
    └── mcp-client/queries.ts     # Add query methods
```

---

## Step-by-Step Checklist

### 1. Types (2-3 min)
```bash
# Create apps/admin/types/your-resource.ts
# Define:
- Resource interface (id, name, status, createdAt, updatedAt, ...)
- ResourceFilters interface (search, status, limit, offset)
- ResourceListResponse interface (resources[], total, limit, offset)
- Optional: specific enums (StatusType, PriorityType, etc.)
```

### 2. MCP Client Methods (5-10 min)
```bash
# Edit apps/admin/lib/mcp-client/queries.ts
# Add methods to MCPGatewayClientWithQueries:
- getResourceById(id: string): Promise<Resource | null>
- listResources(filters: ResourceFilters): Promise<ResourceListResponse>
- createResource(data: CreateResourceInput): Promise<Resource>
- updateResource(id: string, data: Partial<Resource>): Promise<Resource>
- deleteResource(id: string): Promise<void>
- _mapResource(row: ResourceRow): Resource
```

### 3. Column Definition (5-10 min)
```bash
# Create apps/admin/app/dashboard/{section}/{resource}/columns.tsx
# Define columns array:
- Simple columns: accessorKey + header
- Status/badge columns: custom cell with Badge component
- Date columns: custom cell with formatDistanceToNow()
- Action column: id='actions', dropdown menu with View/Copy/Edit/Delete
```

### 4. DataTable Component (10-15 min)
```bash
# Create apps/admin/app/dashboard/{section}/{resource}/DataTable.tsx
# Create client component with:
- useState for search, filters
- useDebounce(search, 300)
- useEffect to sync URL params
- DataTable component with:
  - columns & data props
  - pagination="server"
  - pageCount={Math.ceil(total / limit)}
  - onPaginationChange callback
  - enableSorting
  - enableExport
```

### 5. Server Page (5 min)
```bash
# Create apps/admin/app/dashboard/{section}/{resource}/page.tsx
# Server component:
- await requireAuth()
- Parse searchParams into filters
- Call mcpClient.listResources(filters)
- Wrap DataTable in <Suspense> with DataTableSkeleton fallback
```

### 6. API Routes (15-20 min)
```bash
# Create apps/admin/app/api/{resource}/route.ts
# Implement POST (create):
- auth() check
- permission check
- zod validation
- mcpClient.createResource()
- audit log
- return 201

# Create apps/admin/app/api/{resource}/[id]/route.ts
# Implement GET (read):
- auth() check
- mcpClient.getResourceById()
- return 200 or 404

# Implement PATCH (update):
- auth() check
- permission check
- zod validation
- mcpClient.updateResource()
- audit log
- return 200

# Implement DELETE (delete):
- auth() check
- permission check
- mcpClient.deleteResource()
- audit log
- return 200
```

---

## Code Snippets

### Type Definition Template
```typescript
export interface Resource {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceFilters {
  search?: string;
  status?: string;
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

### Column Definition Template
```typescript
import { ColumnDef } from '@tanstack/react-table';
import { Resource } from '@/types/resource';

export const columns: ColumnDef<Resource>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'default' : 'outline'}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatTableDate(row.original.createdAt),
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/{section}/{resource}/${row.original.id}`}>View</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
              Copy ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
```

### DataTable Component Template
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/data-table/data-table';
import { columns } from './columns';
import { Resource } from '@/types/resource';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/ui';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface DataTableProps {
  initialData: Resource[];
  total: number;
  limit: number;
  offset: number;
}

export function ResourcesDataTable({ initialData, total, limit, offset }: DataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (offset > 0) params.set('offset', offset.toString());

    const newUrl = `/dashboard/{section}/{resource}${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl);
  }, [debouncedSearch, statusFilter, offset, router]);

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    router.replace('/dashboard/{section}/{resource}');
  };

  const hasFilters = search || statusFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
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
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>Clear</Button>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={initialData}
        pagination="server"
        pageCount={Math.ceil(total / limit)}
        onPaginationChange={(page, pageSize) => {
          const newOffset = page * pageSize;
          const params = new URLSearchParams(searchParams.toString());
          if (newOffset > 0) params.set('offset', newOffset.toString());
          else params.delete('offset');
          router.replace(`/dashboard/{section}/{resource}?${params.toString()}`);
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

### Server Page Template
```typescript
import { Metadata } from 'next';
import { requireAuth } from '@/lib/auth-utils';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client/queries';
import { ResourcesDataTable } from './ResourcesDataTable';
import { ResourceFilters } from '@/types/resource';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/admin/data-table-skeleton';

export const metadata: Metadata = {
  title: 'Resources | Admin',
  description: 'Manage resources',
};

const mcpClient = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'admin-db',
});

interface PageProps {
  searchParams: {
    search?: string;
    status?: string;
    offset?: string;
  };
}

export default async function ResourcesPage({ searchParams }: PageProps) {
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

### API Route Template
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';
import { z } from 'zod';

const createResourceSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
});

const mcpClient = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'admin-db',
});

// CREATE
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createResourceSchema.parse(body);

    const resource = await mcpClient.createResource({
      ...validatedData,
      createdBy: session.user.adminUserId,
    });

    await mcpClient.createAuditLog({
      action: 'resource.created',
      entityType: 'resources',
      entityId: resource.id,
      metadata: { name: resource.name },
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

// GET (single resource)
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

// UPDATE
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
    const validatedData = createResourceSchema.partial().parse(body);

    const resource = await mcpClient.updateResource(params.id, {
      ...validatedData,
      updatedBy: session.user.adminUserId,
    });

    await mcpClient.createAuditLog({
      action: 'resource.updated',
      entityType: 'resources',
      entityId: params.id,
      metadata: validatedData,
    });

    return NextResponse.json({ resource });
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

// DELETE
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await mcpClient.deleteResource(params.id);

    await mcpClient.createAuditLog({
      action: 'resource.deleted',
      entityType: 'resources',
      entityId: params.id,
    });

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

## Common Patterns & Best Practices

### URL State Synchronization
Always sync filters/pagination to URL for bookmarking and browser history:
```typescript
const params = new URLSearchParams();
if (search) params.set('search', search);
if (offset > 0) params.set('offset', offset.toString());
router.replace(`/path?${params.toString()}`);
```

### Debounced Search
Prevent excessive API calls with 300ms debounce:
```typescript
const debouncedSearch = useDebounce(search, 300);
```

### Server-Side Pagination by Default
Use `pagination="server"` to handle large datasets efficiently

### Audit Logging
Always log state changes:
```typescript
await mcpClient.createAuditLog({
  action: 'resource.created',
  entityType: 'resources',
  entityId: resource.id,
  metadata: { /* relevant data */ },
});
```

### Loading States
Wrap tables in Suspense with skeleton fallback:
```typescript
<Suspense fallback={<DataTableSkeleton columns={5} rows={10} />}>
  <DataTable ... />
</Suspense>
```

### Error Handling
Use Zod for validation, provide clear error messages:
```typescript
if (error instanceof z.ZodError) {
  return NextResponse.json(
    { error: 'Validation error', details: error.errors },
    { status: 400 }
  );
}
```

---

## Key Files to Reference

- **Users Data Table**: `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/access/users/UsersDataTable.tsx`
- **Users Columns**: `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/access/users/columns.tsx`
- **Projects Dashboard**: `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/tools/projects/ProjectsDashboard.tsx`
- **Admin User API**: `/opt/ozean-licht-ecosystem/apps/admin/app/api/admin-users/[id]/route.ts`
- **MCP Client Queries**: `/opt/ozean-licht-ecosystem/apps/admin/lib/mcp-client/queries.ts`
- **Data Table Component**: `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/data-table.tsx`

---

## Time Estimates

- Types: 2-3 min
- MCP Client Methods: 5-10 min
- Column Definition: 5-10 min
- DataTable Component: 10-15 min
- Server Page: 5 min
- API Routes: 15-20 min
- **Total: 45-75 min** for a complete new resource

