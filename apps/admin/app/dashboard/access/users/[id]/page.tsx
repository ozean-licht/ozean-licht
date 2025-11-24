/**
 * User Detail Page
 *
 * Read-only view of user details with entity access and OAuth connections.
 */

import { Metadata } from 'next';
import { requireAnyRole } from '@/lib/rbac/utils';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client/queries';
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

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  // Require admin role
  await requireAnyRole(['super_admin', 'ol_admin']);

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
