/**
 * Users List Page
 *
 * User list for Ozean Licht platform.
 * Server component that fetches data and passes to client data table.
 */

import { Metadata } from 'next';
import { requireAnyRole } from '@/lib/rbac/utils';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client/queries';
import { UsersDataTable } from './UsersDataTable';
import { User, UserFilters } from '@/types/user';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/admin/data-table-skeleton';

export const metadata: Metadata = {
  title: 'Users | Admin Dashboard',
  description: 'Manage users for Ozean Licht platform',
};

const mcpClient = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'ozean-licht-db',
});

// Team members for Ozean Licht
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'lia@ozean-licht.com',
    name: 'Lia Lohmann',
    image: null,
    emailVerified: new Date('2025-11-01'),
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-26'),
    entities: [{ id: 'e1', userId: '1', entityId: 'ozean_licht', role: 'team', createdAt: new Date('2025-11-01') }],
  },
  {
    id: '2',
    email: 'sergej@ozean-licht.com',
    name: 'Sergej Götz',
    image: null,
    emailVerified: new Date('2025-11-01'),
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-26'),
    entities: [{ id: 'e2', userId: '2', entityId: 'ozean_licht', role: 'team', createdAt: new Date('2025-11-01') }],
  },
  {
    id: '3',
    email: 'raphael@ozean-licht.com',
    name: 'Raphael Reichert',
    image: null,
    emailVerified: new Date('2025-11-01'),
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-26'),
    entities: [{ id: 'e3', userId: '3', entityId: 'ozean_licht', role: 'team', createdAt: new Date('2025-11-01') }],
  },
  {
    id: '4',
    email: 'maria@ozean-licht.com',
    name: 'Maria Hinrichs',
    image: null,
    emailVerified: new Date('2025-11-01'),
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-26'),
    entities: [{ id: 'e4', userId: '4', entityId: 'ozean_licht', role: 'team', createdAt: new Date('2025-11-01') }],
  },
  {
    id: '5',
    email: 'kristin@ozean-licht.com',
    name: 'Kristin Allemann',
    image: null,
    emailVerified: new Date('2025-11-01'),
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-26'),
    entities: [{ id: 'e5', userId: '5', entityId: 'ozean_licht', role: 'team', createdAt: new Date('2025-11-01') }],
  },
  {
    id: '6',
    email: 'shoshana@ozean-licht.com',
    name: 'Shoshana Kerger',
    image: null,
    emailVerified: new Date('2025-11-01'),
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-26'),
    entities: [{ id: 'e6', userId: '6', entityId: 'ozean_licht', role: 'team', createdAt: new Date('2025-11-01') }],
  },
];

interface UsersPageProps {
  searchParams: {
    search?: string;
    entity?: string;
    verified?: string;
    offset?: string;
  };
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  // Require admin role (super_admin or ol_admin)
  await requireAnyRole(['super_admin', 'ol_admin']);

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

  // Try to fetch users from MCP Gateway, fallback to mock data
  let users = MOCK_USERS;
  let total = MOCK_USERS.length;
  let limit = 50;
  let offset = 0;

  try {
    const result = await mcpClient.listUsers(filters);
    users = result.users;
    total = result.total;
    limit = result.limit;
    offset = result.offset;
  } catch (error) {
    console.warn('MCP Gateway unavailable, using mock users:', error);
    // Apply filters to mock data
    let filteredUsers = [...MOCK_USERS];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(u =>
        u.email.toLowerCase().includes(search) ||
        u.name?.toLowerCase().includes(search)
      );
    }

    if (filters.emailVerified !== undefined) {
      filteredUsers = filteredUsers.filter(u =>
        filters.emailVerified ? u.emailVerified !== null : u.emailVerified === null
      );
    }

    users = filteredUsers;
    total = filteredUsers.length;
    offset = filters.offset || 0;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-decorative font-normal tracking-tight text-white">Users</h1>
        <p className="text-muted-foreground">
          Manage users across Ozean Licht platform
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
