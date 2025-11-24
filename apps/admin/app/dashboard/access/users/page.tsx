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
import { UserFilters } from '@/types/user';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';

export const metadata: Metadata = {
  title: 'Users | Admin Dashboard',
  description: 'Manage users for Ozean Licht platform',
};

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
