# Plan: Spec 1.5 - Admin User Management List

## Task Description
Implement a unified user list interface that displays all users from `shared_users_db.users` with their entity access (Kids Ascension, Ozean Licht, or both). This is the first feature to use the DataTable component (Spec 1.3) and RBAC system (Spec 1.4), providing admins with powerful search, filtering, and navigation capabilities across the entire user base of both platforms.

## Objective
Create a production-ready user list page that:
- Displays all users from shared_users_db with entity access indicators
- Provides fast search by email, name, or user ID (<500ms response)
- Filters by entity access, email verification status, and registration date
- Handles 10,000+ users with server-side pagination
- Shows entity badges (KA, OL, or both) for each user
- Links to user detail pages for deep inspection
- Uses DataTable component for consistent UX
- Validates foundation components (DataTable + RBAC)

## Problem Statement
Currently there is no way for admins to:
- View all users across both platforms in a unified interface
- Search for users by email, name, or ID
- Filter users by entity access or verification status
- See which platforms a user has access to
- Navigate to user profiles for detailed inspection

Without this interface, admins must manually query the database or use separate platform-specific interfaces, leading to inefficiency and potential errors in user management.

## Solution Approach

### Data Strategy
1. **Primary Query**: Fetch from `shared_users_db.users`
2. **Entity Access Join**: Join with `user_entities` to determine platform access
3. **Aggregation**: Group by user to show all entity associations
4. **Server-Side Pagination**: Query only needed rows (LIMIT/OFFSET)
5. **Search Optimization**: Use PostgreSQL text search (tsvector) or ILIKE for email/name
6. **Filter Chaining**: Combine filters with AND logic in WHERE clause

### Component Architecture
```
/dashboard/users (page)
├── UsersListPage (Server Component)
│   ├── Fetch users via MCP Gateway
│   ├── Apply search/filter query params
│   └── Pass data to client component
└── UsersDataTable (Client Component)
    ├── DataTable (from Spec 1.3)
    │   ├── Column definitions (email, entities, verified, created_at)
    │   ├── EntityBadges (from Spec 1.4)
    │   └── Action buttons (View Details)
    ├── Search input (debounced)
    ├── Filters (entity, verified status, date range)
    └── Pagination controls (server-side)
```

### Search & Filter UX
- **Global Search**: Email or user ID (debounced 300ms)
- **Entity Filter**: Dropdown (All, Kids Ascension, Ozean Licht, Both)
- **Verified Filter**: Dropdown (All, Verified, Unverified)
- **Date Range**: Date picker (Registration date from/to)
- **Clear Filters**: Button to reset all filters

### Performance Targets
- Initial load: <1s for 100 rows
- Search results: <500ms
- Pagination: <300ms
- Handles 10,000+ users without degradation

## Relevant Files

### Existing Files (Read, Understand, Extend)
- `lib/mcp-client/queries.ts` - Extend with user query methods
- `types/admin.ts` - May need user-related types
- `types/database.ts` - Add database row types for users
- `components/rbac/EntityBadge.tsx` - Display entity access (from Spec 1.4)
- `app/(dashboard)/layout-client.tsx` - Navigation includes Users link
- Spec 1.3 implementation files (DataTable components) - Use in this spec

### New Files
- `types/user.ts` - User domain types (User, UserEntity, UserFilters, etc.)
- `types/database-users.ts` - Raw database row types for users table
- `lib/mcp-client/user-queries.ts` - User-specific MCP operations
- `app/(dashboard)/users/page.tsx` - Users list page (server component)
- `app/(dashboard)/users/UsersDataTable.tsx` - Client data table wrapper
- `app/(dashboard)/users/[id]/page.tsx` - User detail page (read-only)
- `app/(dashboard)/users/columns.tsx` - Column definitions for DataTable
- `app/(dashboard)/users/UserDetailCard.tsx` - User detail display component

## Implementation Phases

### Phase 1: Data Layer
Add user query methods to MCP client for fetching, searching, and filtering users.

### Phase 2: Type System
Define TypeScript types for users, user entities, and related data structures.

### Phase 3: Column Definitions
Create strongly-typed column definitions for the DataTable component.

### Phase 4: Users List Page
Build the main users list page with search, filters, and pagination.

### Phase 5: User Detail Page
Create a read-only user detail page showing complete user information.

## Step by Step Tasks

### 1. Create User Domain Types
Create `types/user.ts` with application-level user types.

**File: `types/user.ts`**
```typescript
/**
 * User domain types
 * Application-level types for user management
 */

/**
 * Entity access type
 */
export type EntityType = 'kids_ascension' | 'ozean_licht';

/**
 * User entity association
 */
export interface UserEntity {
  id: string;
  userId: string;
  entityId: EntityType;
  role: string; // 'user' | 'admin' | 'moderator' (platform role, not admin_users role)
  createdAt: Date;
}

/**
 * User with entity access
 */
export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  entities: UserEntity[]; // Associated entities
}

/**
 * Filters for listing users
 */
export interface UserFilters {
  // Search
  search?: string; // Email or user ID

  // Entity access
  entityId?: EntityType | 'both'; // 'kids_ascension' | 'ozean_licht' | 'both' | undefined (all)

  // Email verification
  emailVerified?: boolean;

  // Date range
  createdAfter?: Date;
  createdBefore?: Date;

  // Pagination
  limit?: number;
  offset?: number;
}

/**
 * Paginated user list response
 */
export interface UserListResponse {
  users: User[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * User detail with extended information
 */
export interface UserDetail extends User {
  // OAuth providers
  oauthProviders: {
    id: string;
    provider: string; // 'google' | 'facebook'
    providerUserId: string;
    createdAt: Date;
  }[];

  // Activity
  lastLoginAt: Date | null;
  loginCount: number;
}
```

- Define User type with entity associations
- UserEntity type for platform access
- UserFilters for search and filtering
- UserListResponse for paginated results
- UserDetail for extended user information

### 2. Create Database Row Types for Users
Create `types/database-users.ts` with raw database row types.

**File: `types/database-users.ts`**
```typescript
/**
 * Database row types for users tables
 * Raw PostgreSQL row types from shared_users_db
 */

/**
 * Raw row from users table
 */
export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Raw row from user_entities table
 */
export interface UserEntityRow {
  id: string;
  user_id: string;
  entity_id: 'kids_ascension' | 'ozean_licht';
  role: string;
  created_at: string;
}

/**
 * Raw row from oauth_providers table
 */
export interface OAuthProviderRow {
  id: string;
  user_id: string;
  provider: string;
  provider_user_id: string;
  access_token: string | null;
  refresh_token: string | null;
  created_at: string;
}

/**
 * Joined user row with entity access
 */
export interface UserWithEntitiesRow {
  id: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  entities: string; // JSON aggregated array of entity_id values
  entity_roles: string; // JSON aggregated array of role values
}
```

- UserRow for users table
- UserEntityRow for user_entities table
- OAuthProviderRow for oauth_providers table
- UserWithEntitiesRow for joined query results

### 3. Add User Query Methods to MCP Client
Extend `lib/mcp-client/queries.ts` with user operations.

**Add to `lib/mcp-client/queries.ts`:**
```typescript
import {
  User,
  UserEntity,
  UserFilters,
  UserListResponse,
  UserDetail,
  EntityType,
} from '@/types/user';
import {
  UserRow,
  UserEntityRow,
  OAuthProviderRow,
  UserWithEntitiesRow,
} from '@/types/database-users';

// Add to MCPGatewayClientWithQueries class:

  // ============================================================================
  // User Operations
  // ============================================================================

  /**
   * List users with filters and pagination
   */
  async listUsers(filters?: UserFilters): Promise<UserListResponse> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Build WHERE clause
    if (filters?.search) {
      conditions.push(`(u.email ILIKE $${paramIndex} OR u.id::text ILIKE $${paramIndex})`);
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters?.emailVerified !== undefined) {
      conditions.push(`u.email_verified = $${paramIndex}`);
      params.push(filters.emailVerified);
      paramIndex++;
    }

    if (filters?.createdAfter) {
      conditions.push(`u.created_at >= $${paramIndex}`);
      params.push(filters.createdAfter.toISOString());
      paramIndex++;
    }

    if (filters?.createdBefore) {
      conditions.push(`u.created_at <= $${paramIndex}`);
      params.push(filters.createdBefore.toISOString());
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Handle entity filter (special case: needs subquery or join)
    let entityFilter = '';
    if (filters?.entityId && filters.entityId !== 'both') {
      entityFilter = `
        AND EXISTS (
          SELECT 1 FROM user_entities ue
          WHERE ue.user_id = u.id AND ue.entity_id = $${paramIndex}
        )
      `;
      params.push(filters.entityId);
      paramIndex++;
    } else if (filters?.entityId === 'both') {
      // User must have both entities
      entityFilter = `
        AND (
          SELECT COUNT(DISTINCT ue.entity_id)
          FROM user_entities ue
          WHERE ue.user_id = u.id
        ) = 2
      `;
    }

    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;

    // Get total count
    const countSql = `
      SELECT COUNT(*) as count
      FROM users u
      ${whereClause}
      ${entityFilter}
    `;

    const countRows = await this.query<{ count: string }>(countSql, params.slice(0, paramIndex - 1));
    const total = parseInt(countRows[0].count, 10);

    // Get users with entities (aggregated)
    const sql = `
      SELECT
        u.id,
        u.email,
        u.email_verified,
        u.created_at,
        u.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ue.id,
              'entity_id', ue.entity_id,
              'role', ue.role,
              'created_at', ue.created_at
            )
          ) FILTER (WHERE ue.id IS NOT NULL),
          '[]'
        ) as entities
      FROM users u
      LEFT JOIN user_entities ue ON u.id = ue.user_id
      ${whereClause}
      ${entityFilter}
      GROUP BY u.id, u.email, u.email_verified, u.created_at, u.updated_at
      ORDER BY u.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.query<UserWithEntitiesRow>(sql, params);

    const users = rows.map((row) => this._mapUserWithEntities(row));

    return {
      users,
      total,
      limit,
      offset,
    };
  }

  /**
   * Get user by ID with entities
   */
  async getUserById(id: string): Promise<User | null> {
    const sql = `
      SELECT
        u.id,
        u.email,
        u.email_verified,
        u.created_at,
        u.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ue.id,
              'entity_id', ue.entity_id,
              'role', ue.role,
              'created_at', ue.created_at
            )
          ) FILTER (WHERE ue.id IS NOT NULL),
          '[]'
        ) as entities
      FROM users u
      LEFT JOIN user_entities ue ON u.id = ue.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.email, u.email_verified, u.created_at, u.updated_at
    `;

    const rows = await this.query<UserWithEntitiesRow>(sql, [id]);
    return rows.length > 0 ? this._mapUserWithEntities(rows[0]) : null;
  }

  /**
   * Get user detail with OAuth providers
   */
  async getUserDetail(id: string): Promise<UserDetail | null> {
    const user = await this.getUserById(id);

    if (!user) {
      return null;
    }

    // Get OAuth providers
    const oauthSql = `
      SELECT id, provider, provider_user_id, created_at
      FROM oauth_providers
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const oauthRows = await this.query<OAuthProviderRow>(oauthSql, [id]);

    const oauthProviders = oauthRows.map((row) => ({
      id: row.id,
      provider: row.provider,
      providerUserId: row.provider_user_id,
      createdAt: new Date(row.created_at),
    }));

    // TODO: Get activity metrics (last_login_at, login_count)
    // This requires session tracking or audit log integration
    // For now, return placeholder values

    return {
      ...user,
      oauthProviders,
      lastLoginAt: null, // TODO: Implement session tracking
      loginCount: 0, // TODO: Implement login count
    };
  }

  /**
   * Map database row to User
   */
  private _mapUserWithEntities(row: UserWithEntitiesRow): User {
    // Parse aggregated entities JSON
    const entitiesArray = typeof row.entities === 'string'
      ? JSON.parse(row.entities)
      : row.entities;

    const entities: UserEntity[] = entitiesArray.map((e: any) => ({
      id: e.id,
      userId: row.id,
      entityId: e.entity_id as EntityType,
      role: e.role,
      createdAt: new Date(e.created_at),
    }));

    return {
      id: row.id,
      email: row.email,
      emailVerified: row.email_verified,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      entities,
    };
  }
```

- listUsers with comprehensive filtering
- Server-side pagination with total count
- Entity filtering (single entity or both)
- Search by email or user ID (ILIKE for case-insensitive)
- getUserById for detail pages
- getUserDetail with OAuth providers
- JSON aggregation for entity associations

### 4. Create DataTable Column Definitions
Create `app/(dashboard)/users/columns.tsx` with strongly-typed column definitions.

**File: `app/(dashboard)/users/columns.tsx`**
```typescript
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { User, EntityType } from '@/types/user';
import { EntityBadge } from '@/components/rbac/EntityBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Eye, CheckCircle2, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.email}</span>
        <span className="text-xs text-muted-foreground font-mono">
          {row.original.id.substring(0, 8)}...
        </span>
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'entities',
    header: 'Platform Access',
    cell: ({ row }) => {
      const entities = row.original.entities;

      if (entities.length === 0) {
        return <span className="text-sm text-muted-foreground">None</span>;
      }

      return (
        <div className="flex items-center gap-1">
          {entities.map((entity) => (
            <EntityBadge
              key={entity.id}
              entity={entity.entityId}
              compact
            />
          ))}
        </div>
      );
    },
    enableSorting: false,
    filterFn: (row, id, value) => {
      // Custom filter function for entity filtering
      const entities = row.original.entities;
      const entityIds = entities.map((e) => e.entityId);

      if (value === 'all') return true;
      if (value === 'both') return entityIds.length === 2;
      return entityIds.includes(value as EntityType);
    },
  },
  {
    accessorKey: 'emailVerified',
    header: 'Email Status',
    cell: ({ row }) => {
      const verified = row.original.emailVerified;
      return verified ? (
        <Badge variant="default" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </Badge>
      ) : (
        <Badge variant="outline" className="gap-1">
          <XCircle className="h-3 w-3" />
          Unverified
        </Badge>
      );
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      if (value === 'all') return true;
      return row.original.emailVerified === (value === 'verified');
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Registered',
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <div className="flex flex-col">
          <span className="text-sm">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {date.toLocaleDateString()}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/users/${user.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/users/${user.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy User ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.email)}
              >
                Copy Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
```

- Email column with truncated user ID
- Platform Access column with EntityBadge components
- Email Status with verified/unverified badges
- Registered column with relative time
- Actions column with View button and dropdown menu
- Custom filter functions for entity and verification status

### 5. Create Users Data Table Client Component
Create `app/(dashboard)/users/UsersDataTable.tsx` as client wrapper.

**File: `app/(dashboard)/users/UsersDataTable.tsx`**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/tables/DataTable';
import { columns } from './columns';
import { User } from '@/types/user';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface UsersDataTableProps {
  initialData: User[];
  total: number;
  limit: number;
  offset: number;
}

export function UsersDataTable({
  initialData,
  total,
  limit,
  offset,
}: UsersDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [entityFilter, setEntityFilter] = useState(
    searchParams.get('entity') || 'all'
  );
  const [verifiedFilter, setVerifiedFilter] = useState(
    searchParams.get('verified') || 'all'
  );

  // Debounce search
  const debouncedSearch = useDebounce(search, 300);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set('search', debouncedSearch);
    if (entityFilter !== 'all') params.set('entity', entityFilter);
    if (verifiedFilter !== 'all') params.set('verified', verifiedFilter);
    if (offset > 0) params.set('offset', offset.toString());

    const newUrl = `/dashboard/users${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl);
  }, [debouncedSearch, entityFilter, verifiedFilter, offset, router]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setEntityFilter('all');
    setVerifiedFilter('all');
    router.push('/dashboard/users');
  };

  const hasFilters = search || entityFilter !== 'all' || verifiedFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Entity Filter */}
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="kids_ascension">Kids Ascension</SelectItem>
            <SelectItem value="ozean_licht">Ozean Licht</SelectItem>
            <SelectItem value="both">Both Platforms</SelectItem>
          </SelectContent>
        </Select>

        {/* Verified Filter */}
        <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-9"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={initialData}
        pagination="server"
        pageCount={Math.ceil(total / limit)}
        onPaginationChange={(pagination) => {
          const params = new URLSearchParams(searchParams.toString());
          const newOffset = pagination.pageIndex * limit;
          if (newOffset > 0) {
            params.set('offset', newOffset.toString());
          } else {
            params.delete('offset');
          }
          router.push(`/dashboard/users?${params.toString()}`);
        }}
        enableSorting
        enableExport
      />

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} users
      </div>
    </div>
  );
}
```

- Client component managing filter state
- Debounced search input (300ms)
- Entity and verification status filters
- Clear filters button
- URL sync for filter state (shareable links)
- Server-side pagination via URL params
- Uses DataTable from Spec 1.3

### 6. Create Users List Server Component Page
Create `app/(dashboard)/users/page.tsx` as main server component.

**File: `app/(dashboard)/users/page.tsx`**
```typescript
/**
 * Users List Page
 *
 * Unified user list across both platforms (Kids Ascension + Ozean Licht).
 * Server component that fetches data and passes to client data table.
 */

import { requireAuth } from '@/lib/auth-utils';
import { requireAnyRole } from '@/lib/rbac/utils';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';
import { UsersDataTable } from './UsersDataTable';
import { UserFilters } from '@/types/user';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';

const mcpClient = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'shared-users-db',
});

interface UsersPageProps {
  searchParams: {
    search?: string;
    entity?: string;
    verified?: string;
    offset?: string;
  };
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  // Require admin role (super_admin, ka_admin, or ol_admin)
  await requireAnyRole(['super_admin', 'ka_admin', 'ol_admin']);

  // Parse search params into filters
  const filters: UserFilters = {
    search: searchParams.search,
    entityId: searchParams.entity as any,
    emailVerified:
      searchParams.verified === 'verified'
        ? true
        : searchParams.verified === 'unverified'
        ? false
        : undefined,
    offset: searchParams.offset ? parseInt(searchParams.offset, 10) : 0,
    limit: 50,
  };

  // Fetch users
  const { users, total, limit, offset } = await mcpClient.listUsers(filters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage users across Kids Ascension and Ozean Licht platforms
        </p>
      </div>

      {/* Data Table */}
      <Suspense fallback={<DataTableSkeleton columns={5} rows={10} />}>
        <UsersDataTable
          initialData={users}
          total={total}
          limit={limit}
          offset={offset}
        />
      </Suspense>
    </div>
  );
}
```

- Server component fetching user data
- Requires admin role (super_admin, ka_admin, or ol_admin)
- Parses search params into UserFilters
- Passes data to client UsersDataTable component
- Suspense boundary with skeleton loader

### 7. Create User Detail Card Component
Create `app/(dashboard)/users/[id]/UserDetailCard.tsx` for displaying user info.

**File: `app/(dashboard)/users/[id]/UserDetailCard.tsx`**
```typescript
'use client';

import { UserDetail } from '@/types/user';
import { EntityBadge } from '@/components/rbac/EntityBadge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Calendar, Mail, Key, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserDetailCardProps {
  user: UserDetail;
}

export function UserDetailCard({ user }: UserDetailCardProps) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Basic account details and verification status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <div className="font-medium">{user.email}</div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Key className="h-4 w-4" />
                User ID
              </Label>
              <div className="font-mono text-sm">{user.id}</div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Email Status</Label>
              <div>
                {user.emailVerified ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    Unverified
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Registered
              </Label>
              <div className="text-sm">
                {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                <span className="text-muted-foreground ml-2">
                  ({user.createdAt.toLocaleDateString()})
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Platform Access
          </CardTitle>
          <CardDescription>
            Platforms this user has access to
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.entities.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No platform access granted
            </p>
          ) : (
            <div className="space-y-3">
              {user.entities.map((entity) => (
                <div
                  key={entity.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <EntityBadge entity={entity.entityId} />
                    <div>
                      <div className="text-sm font-medium">
                        {entity.entityId === 'kids_ascension'
                          ? 'Kids Ascension'
                          : 'Ozean Licht'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Role: {entity.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Added {formatDistanceToNow(entity.createdAt, { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* OAuth Providers */}
      {user.oauthProviders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              OAuth providers linked to this account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user.oauthProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="capitalize font-medium">{provider.provider}</div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {provider.providerUserId}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Connected {formatDistanceToNow(provider.createdAt, { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>
            User activity and engagement metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Login</span>
              <span className="text-sm font-medium">
                {user.lastLoginAt
                  ? formatDistanceToNow(user.lastLoginAt, { addSuffix: true })
                  : 'Never'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Logins</span>
              <span className="text-sm font-medium">{user.loginCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

- Card-based layout for user information
- Email verification status badge
- Platform access list with entity badges
- OAuth provider connections
- Activity metrics (placeholder for now)
- Relative timestamps with absolute dates

### 8. Create User Detail Page
Create `app/(dashboard)/users/[id]/page.tsx` for user detail view.

**File: `app/(dashboard)/users/[id]/page.tsx`**
```typescript
/**
 * User Detail Page
 *
 * Read-only view of user details with entity access and OAuth connections.
 */

import { requireAuth } from '@/lib/auth-utils';
import { requireAnyRole } from '@/lib/rbac/utils';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';
import { UserDetailCard } from './UserDetailCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const mcpClient = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'shared-users-db',
});

interface UserDetailPageProps {
  params: {
    id: string;
  };
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  // Require admin role
  await requireAnyRole(['super_admin', 'ka_admin', 'ol_admin']);

  // Fetch user detail
  const user = await mcpClient.getUserDetail(params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/users">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{user.email}</h1>
        <p className="text-muted-foreground">
          User details and platform access
        </p>
      </div>

      {/* User Detail Card */}
      <UserDetailCard user={user} />
    </div>
  );
}
```

- Server component fetching user detail
- Back button to user list
- User email as page title
- UserDetailCard component for display
- notFound() if user doesn't exist

### 9. Create useDebounce Hook
Create `hooks/use-debounce.ts` for search input debouncing.

**File: `hooks/use-debounce.ts`**
```typescript
import { useEffect, useState } from 'react';

/**
 * Debounce a value with a delay
 * Useful for search inputs to avoid excessive API calls
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

- Generic debounce hook
- Used for search input (300ms delay)
- Prevents excessive server requests

### 10. Add Navigation Link to Users Page
Update `app/(dashboard)/layout-client.tsx` to include Users link.

**Add to sidebar navigation items:**
```typescript
{
  type: 'item',
  href: '/dashboard/users',
  label: 'Users',
  icon: 'Users',
  description: 'Manage users across platforms',
},
```

- Add Users menu item to sidebar
- Icon: Users (from Lucide React)
- Accessible to super_admin, ka_admin, ol_admin (filtered by RBAC)

### 11. Create DataTableSkeleton Component
Create `components/ui/data-table-skeleton.tsx` for loading states.

**File: `components/ui/data-table-skeleton.tsx`**
```typescript
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableSkeletonProps {
  columns: number;
  rows?: number;
}

export function DataTableSkeleton({ columns, rows = 10 }: DataTableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-[250px]" />
        <Skeleton className="h-9 w-[150px]" />
        <Skeleton className="h-9 w-[150px]" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: columns }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[200px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-[80px]" />
        </div>
      </div>
    </div>
  );
}
```

- Skeleton loader matching DataTable structure
- Configurable columns and rows
- Used in Suspense boundaries

### 12. Update CLAUDE.md with User Management Patterns
Add user management examples to `CLAUDE.md`.

**Add to CLAUDE.md:**
```markdown
## User Management

// List users with filters
const { users, total } = await client.listUsers({
  search: 'john@example.com',
  entityId: 'kids_ascension',
  emailVerified: true,
  limit: 50,
  offset: 0,
});

// Get user detail
const user = await client.getUserDetail(userId);

// Display entity badges
{user.entities.map((entity) => (
  <EntityBadge key={entity.id} entity={entity.entityId} />
))}
```

- Quick reference for common user operations
- Examples of filtering and entity badges

### 13. Write Tests for User Query Methods
Create `tests/unit/mcp-client/user-queries.test.ts`.

**File: `tests/unit/mcp-client/user-queries.test.ts`**
```typescript
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';
import { UserFilters } from '@/types/user';

describe('User Query Methods', () => {
  let client: MCPGatewayClientWithQueries;

  beforeEach(() => {
    client = new MCPGatewayClientWithQueries({
      baseUrl: 'http://localhost:8100',
      database: 'shared-users-db',
    });
  });

  describe('listUsers', () => {
    it('should list users without filters', async () => {
      const result = await client.listUsers();
      expect(result.users).toBeInstanceOf(Array);
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.limit).toBe(50); // Default limit
      expect(result.offset).toBe(0);
    });

    it('should filter by search term', async () => {
      const filters: UserFilters = {
        search: 'test@example.com',
      };
      const result = await client.listUsers(filters);
      expect(result.users.every(u => u.email.includes('test'))).toBe(true);
    });

    it('should filter by entity access', async () => {
      const filters: UserFilters = {
        entityId: 'kids_ascension',
      };
      const result = await client.listUsers(filters);
      expect(
        result.users.every(u =>
          u.entities.some(e => e.entityId === 'kids_ascension')
        )
      ).toBe(true);
    });

    it('should filter by email verification', async () => {
      const filters: UserFilters = {
        emailVerified: true,
      };
      const result = await client.listUsers(filters);
      expect(result.users.every(u => u.emailVerified)).toBe(true);
    });

    it('should paginate results', async () => {
      const page1 = await client.listUsers({ limit: 10, offset: 0 });
      const page2 = await client.listUsers({ limit: 10, offset: 10 });

      expect(page1.users.length).toBeLessThanOrEqual(10);
      expect(page2.users.length).toBeLessThanOrEqual(10);

      // Ensure different pages
      if (page1.users.length > 0 && page2.users.length > 0) {
        expect(page1.users[0].id).not.toBe(page2.users[0].id);
      }
    });
  });

  describe('getUserById', () => {
    it('should get user by ID', async () => {
      const { users } = await client.listUsers({ limit: 1 });
      if (users.length === 0) {
        console.log('No users to test with');
        return;
      }

      const userId = users[0].id;
      const user = await client.getUserById(userId);

      expect(user).not.toBeNull();
      expect(user!.id).toBe(userId);
      expect(user!.entities).toBeInstanceOf(Array);
    });

    it('should return null for non-existent user', async () => {
      const user = await client.getUserById('00000000-0000-0000-0000-000000000000');
      expect(user).toBeNull();
    });
  });

  describe('getUserDetail', () => {
    it('should get user detail with OAuth providers', async () => {
      const { users } = await client.listUsers({ limit: 1 });
      if (users.length === 0) {
        console.log('No users to test with');
        return;
      }

      const userId = users[0].id;
      const detail = await client.getUserDetail(userId);

      expect(detail).not.toBeNull();
      expect(detail!.oauthProviders).toBeInstanceOf(Array);
      expect(detail!.lastLoginAt).toBeDefined();
      expect(detail!.loginCount).toBeGreaterThanOrEqual(0);
    });
  });
});
```

- Unit tests for all user query methods
- Tests for filtering, pagination, and edge cases
- Real database connections (ephemeral tests)

### 14. Add Error Handling for User Not Found
Create `app/(dashboard)/users/[id]/not-found.tsx`.

**File: `app/(dashboard)/users/[id]/not-found.tsx`**
```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function UserNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">User Not Found</h2>
        <p className="text-muted-foreground">
          The user you're looking for doesn't exist or has been deleted.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard/users">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users List
        </Link>
      </Button>
    </div>
  );
}
```

- Custom not-found page for user detail
- Clear error message
- Back button to users list

### 15. Create Index for Performance
Document recommended database indexes in `docs/database-indexes.md`.

**File: `docs/database-indexes.md`**
```markdown
# Database Indexes for User Management

## Recommended Indexes (shared_users_db)

### Users Table
```sql
-- Email search (ILIKE optimization)
CREATE INDEX idx_users_email_trgm ON users USING gin (email gin_trgm_ops);

-- User ID search
CREATE INDEX idx_users_id ON users (id);

-- Email verification filter
CREATE INDEX idx_users_email_verified ON users (email_verified);

-- Registration date filter/sort
CREATE INDEX idx_users_created_at ON users (created_at DESC);
```

### User Entities Table
```sql
-- Entity access joins
CREATE INDEX idx_user_entities_user_id ON user_entities (user_id);

-- Entity filter
CREATE INDEX idx_user_entities_entity_id ON user_entities (entity_id);

-- Combined index for entity filtering
CREATE INDEX idx_user_entities_user_entity ON user_entities (user_id, entity_id);
```

### OAuth Providers Table
```sql
-- User OAuth lookup
CREATE INDEX idx_oauth_providers_user_id ON oauth_providers (user_id);
```

## Performance Benefits

- **Email search**: ILIKE with trigram index for fuzzy matching
- **User ID search**: Fast exact match lookups
- **Entity filtering**: Efficient JOIN and WHERE clauses
- **Date sorting**: DESC index for newest-first ordering
- **Combined index**: Single index scan for multi-column queries

## Testing Indexes

```sql
-- Explain query plan
EXPLAIN ANALYZE
SELECT u.id, u.email, u.email_verified, u.created_at
FROM users u
LEFT JOIN user_entities ue ON u.id = ue.user_id
WHERE u.email ILIKE '%test%'
ORDER BY u.created_at DESC
LIMIT 50;

-- Should show "Index Scan" or "Bitmap Index Scan" (not "Seq Scan")
```
```

- Recommended indexes for performance
- ILIKE optimization with trigram indexes
- Combined indexes for multi-column queries
- Testing commands with EXPLAIN ANALYZE

### 16. Add Metadata for SEO
Add metadata to users page.

**Add to `app/(dashboard)/users/page.tsx`:**
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users | Admin Dashboard',
  description: 'Manage users across Kids Ascension and Ozean Licht platforms',
};
```

**Add to `app/(dashboard)/users/[id]/page.tsx`:**
```typescript
import { Metadata } from 'next';

export async function generateMetadata({ params }: UserDetailPageProps): Promise<Metadata> {
  const user = await mcpClient.getUserById(params.id);

  if (!user) {
    return {
      title: 'User Not Found | Admin Dashboard',
    };
  }

  return {
    title: `${user.email} | Users | Admin Dashboard`,
    description: `User details and platform access for ${user.email}`,
  };
}
```

- SEO-friendly page titles
- Dynamic metadata for user detail pages

### 17. Run Type Check
Ensure all TypeScript types are correct.

```bash
cd /opt/ozean-licht-ecosystem/apps/admin
npm run typecheck
```

- Verify no TypeScript errors
- Ensure all imports resolve
- Check type compatibility with DataTable

### 18. Manual Testing Checklist
Test all user management functionality.

**Test Scenarios:**

1. **Users List Page**
   - Load /dashboard/users (should show users)
   - Search by email (should filter results)
   - Search by user ID (should find exact match)
   - Filter by Kids Ascension (should show only KA users)
   - Filter by Ozean Licht (should show only OL users)
   - Filter by Both Platforms (should show users with both entities)
   - Filter by Verified (should show verified users only)
   - Filter by Unverified (should show unverified users only)
   - Combine filters (search + entity + verified)
   - Clear filters button (should reset to default view)

2. **Pagination**
   - Navigate to page 2 (should show next 50 users)
   - Navigate back to page 1
   - URL should update with offset param
   - Results summary should update

3. **Entity Badges**
   - Users with Kids Ascension should show KA badge
   - Users with Ozean Licht should show OL badge
   - Users with both should show both badges
   - Badges should have correct colors and icons

4. **User Detail Page**
   - Click View on a user (should navigate to detail page)
   - User email should be page title
   - Basic info card should show email, ID, verified status, registration date
   - Platform access card should list all entities
   - OAuth providers card should show connected accounts (if any)
   - Back button should return to users list

5. **Performance**
   - Initial load < 1s
   - Search results < 500ms
   - Pagination < 300ms
   - No jank or lag with 1000+ users

6. **RBAC**
   - super_admin can access /dashboard/users
   - ka_admin can access /dashboard/users
   - ol_admin can access /dashboard/users
   - support cannot access /dashboard/users (should redirect)

7. **Edge Cases**
   - No users found (empty state)
   - User with no entity access (should show "None")
   - User with no OAuth providers (card should not render)
   - Invalid user ID (should show not-found page)

### 19. Performance Testing
Test with large datasets to ensure performance targets are met.

```bash
# Generate test users (if needed)
# TODO: Create script to seed test users

# Load users page and measure performance
# Use Chrome DevTools Performance tab
# - Initial load should be < 1s
# - Search should be < 500ms
# - Pagination should be < 300ms
```

- Test with 1000+ users
- Measure response times
- Ensure pagination works smoothly
- Verify no N+1 query issues

### 20. Validate Implementation
Run all validation checks.

**Validation Checklist:**
- [ ] User types defined in types/user.ts
- [ ] Database row types defined in types/database-users.ts
- [ ] User query methods added to MCP client
- [ ] listUsers with comprehensive filtering works
- [ ] getUserById returns user with entities
- [ ] getUserDetail includes OAuth providers
- [ ] Column definitions include all required columns
- [ ] UsersDataTable component renders correctly
- [ ] Search input debounced (300ms)
- [ ] Entity filter dropdown works
- [ ] Verified filter dropdown works
- [ ] Clear filters button resets all filters
- [ ] URL syncs with filter state
- [ ] Server-side pagination works
- [ ] Users list page fetches and displays users
- [ ] User detail page shows complete user info
- [ ] Entity badges display correctly
- [ ] Not-found page shows for invalid user IDs
- [ ] Navigation link added to sidebar
- [ ] RBAC enforced (admin roles only)
- [ ] Performance targets met (<500ms search, <1s initial load)
- [ ] TypeScript types pass without errors
- [ ] All tests pass

## Testing Strategy

### Unit Tests
- Test user query methods (listUsers, getUserById, getUserDetail)
- Test filter logic (search, entity, verified, date range)
- Test pagination calculations
- Located in `tests/unit/mcp-client/user-queries.test.ts`

### Integration Tests
- Test full user list page rendering
- Test search and filter functionality end-to-end
- Test navigation to user detail page
- Test RBAC enforcement (different roles)
- Located in `tests/integration/users/`

### Performance Tests
- Load test with 10,000+ users
- Measure search response time (<500ms target)
- Measure pagination response time (<300ms target)
- Measure initial page load (<1s target)
- Test with combined filters

### Manual Testing
- Test all search and filter combinations
- Test entity badges display correctly
- Test user detail page shows complete information
- Test RBAC access control
- Test edge cases (empty results, invalid IDs)

## Acceptance Criteria

- [ ] Users list displays all users from shared_users_db
- [ ] Search by email or user ID works with <500ms response time
- [ ] Entity filter (Kids Ascension, Ozean Licht, Both) works correctly
- [ ] Email verification filter (Verified, Unverified) works correctly
- [ ] Filters can be combined (search + entity + verified)
- [ ] Clear filters button resets all filters
- [ ] Server-side pagination handles 10,000+ users
- [ ] Pagination controls update URL with offset parameter
- [ ] Entity badges display correctly (KA, OL, or both)
- [ ] User detail page shows complete user information
- [ ] Platform access card lists all entity associations
- [ ] OAuth providers card shows connected accounts
- [ ] Back button returns to users list from detail page
- [ ] Not-found page shows for invalid user IDs
- [ ] Navigation link added to sidebar (visible to admin roles)
- [ ] RBAC enforced: super_admin, ka_admin, ol_admin can access
- [ ] RBAC enforced: support role cannot access (redirects)
- [ ] DataTable component used (from Spec 1.3)
- [ ] RoleBadge and EntityBadge components used (from Spec 1.4)
- [ ] TypeScript types are strongly typed (no `any`)
- [ ] All tests pass (unit + integration)
- [ ] Performance targets met (search <500ms, pagination <300ms, load <1s)
- [ ] Database indexes documented for performance
- [ ] SEO metadata added to pages

## Validation Commands

Execute these commands to validate the task is complete:

```bash
# Type check
cd /opt/ozean-licht-ecosystem/apps/admin
npm run typecheck

# Run tests
npm test -- user-queries
npm test -- users

# Lint check
npm run lint

# Build check
npm run build

# Manual verification
npm run dev

# 1. Navigate to /dashboard/users
#    - Should load users list
#    - Should show entity badges (KA, OL, or both)
#    - Should show email verification status

# 2. Test search
#    - Type email in search box
#    - Wait 300ms (debounce)
#    - Results should filter

# 3. Test entity filter
#    - Select "Kids Ascension"
#    - Should show only KA users
#    - Select "Both Platforms"
#    - Should show users with both entities

# 4. Test verified filter
#    - Select "Verified"
#    - Should show verified users only
#    - Select "Unverified"
#    - Should show unverified users only

# 5. Test combined filters
#    - Search + entity + verified
#    - All filters should apply (AND logic)

# 6. Test pagination
#    - Navigate to page 2
#    - URL should update with ?offset=50
#    - Results should show next 50 users

# 7. Test user detail
#    - Click "View" on a user
#    - Should navigate to /dashboard/users/{id}
#    - Should show user email, ID, entities, OAuth providers
#    - Back button should return to list

# 8. Test not-found
#    - Navigate to /dashboard/users/invalid-id
#    - Should show not-found page
#    - Back button should return to list

# 9. Test RBAC
#    - Login as support role
#    - Navigate to /dashboard/users
#    - Should redirect to /dashboard with error
#    - Navigation should not show Users link

# 10. Performance check (Chrome DevTools)
#     - Initial load: < 1s
#     - Search: < 500ms
#     - Pagination: < 300ms
```

## Notes

### Dependencies
No new npm packages required beyond Spec 1.3 and 1.4 dependencies:
- TanStack Table v8 (from Spec 1.3)
- date-fns (already installed)
- Lucide React (already installed)

### Database Configuration
- Database: `shared-users-db`
- Tables: `users`, `user_entities`, `oauth_providers`
- MCP Gateway URL: `http://localhost:8100`

### Existing Infrastructure Used
- DataTable component (Spec 1.3) - Main table component
- RoleBadge, EntityBadge (Spec 1.4) - Visual role/entity indicators
- MCP Gateway client - Database operations via unified API
- NextAuth session - Authentication and role checking
- RBAC utilities - Role-based access control

### Performance Optimizations
- Server-side pagination (LIMIT/OFFSET)
- Debounced search (300ms)
- JSON aggregation for entity joins (single query)
- Recommended database indexes (see docs/database-indexes.md)
- Suspense boundaries with skeleton loaders

### Security Considerations
- RBAC enforced at page level (requireAnyRole)
- Only admin roles can view user data (super_admin, ka_admin, ol_admin)
- No password hashes exposed (excluded from queries)
- OAuth tokens not exposed (excluded from queries)
- User IDs truncated in list view (show first 8 chars)

### Future Enhancements (Out of Scope for This Spec)
- User editing actions (Spec 1.6)
- Grant/revoke entity access
- Deactivate/reactivate users
- Reset password triggers
- Bulk operations
- Export to CSV
- Activity tracking (last login, login count)
- Advanced filters (date range picker)

### Related Specs
- **Spec 1.3** (admin-data-tables-foundation.md) - Provides DataTable component
- **Spec 1.4** (admin-basic-rbac.md) - Provides EntityBadge and role checking
- **Spec 1.6** (admin-user-management-actions.md) - Extends with editing capabilities
- **Spec 1.7** (admin-audit-logging.md) - Logs user actions

### Estimated Effort
**18 hours** total:
- Phase 1 (Data Layer): 4 hours
- Phase 2 (Type System): 2 hours
- Phase 3 (Column Definitions): 2 hours
- Phase 4 (Users List Page): 6 hours
- Phase 5 (User Detail Page): 3 hours
- Testing & Documentation: 1 hour

### Priority
**P1 (Critical)** - First real feature using DataTable and RBAC. Validates foundation components and unblocks subsequent user management features (Spec 1.6). Essential for platform administration.
