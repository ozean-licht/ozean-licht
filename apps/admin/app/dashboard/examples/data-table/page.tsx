'use client';

import { DataTable } from '@/components/data-table/data-table';
import { columns, User } from './columns';
import { useState } from 'react';

// Mock data with 25 users for pagination testing
const mockUsers: User[] = [
  {
    id: '1',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    role: 'SUPER_ADMIN',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    email: 'bob@example.com',
    name: 'Bob Smith',
    role: 'KA_ADMIN',
    status: 'active',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    email: 'charlie@example.com',
    name: 'Charlie Brown',
    role: 'OL_ADMIN',
    status: 'inactive',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    email: 'diana@example.com',
    name: 'Diana Prince',
    role: 'SUPER_ADMIN',
    status: 'active',
    createdAt: new Date('2024-01-25'),
  },
  {
    id: '5',
    email: 'evan@example.com',
    name: 'Evan Davis',
    role: 'KA_ADMIN',
    status: 'pending',
    createdAt: new Date('2024-04-05'),
  },
  {
    id: '6',
    email: 'fiona@example.com',
    name: 'Fiona Green',
    role: 'OL_ADMIN',
    status: 'active',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '7',
    email: 'george@example.com',
    name: 'George Wilson',
    role: 'SUPER_ADMIN',
    status: 'inactive',
    createdAt: new Date('2024-03-20'),
  },
  {
    id: '8',
    email: 'hannah@example.com',
    name: 'Hannah Moore',
    role: 'KA_ADMIN',
    status: 'active',
    createdAt: new Date('2024-01-30'),
  },
  {
    id: '9',
    email: 'ian@example.com',
    name: 'Ian Taylor',
    role: 'OL_ADMIN',
    status: 'active',
    createdAt: new Date('2024-04-10'),
  },
  {
    id: '10',
    email: 'julia@example.com',
    name: 'Julia Anderson',
    role: 'SUPER_ADMIN',
    status: 'pending',
    createdAt: new Date('2024-02-28'),
  },
  {
    id: '11',
    email: 'kevin@example.com',
    name: 'Kevin Martinez',
    role: 'KA_ADMIN',
    status: 'active',
    createdAt: new Date('2024-03-15'),
  },
  {
    id: '12',
    email: 'laura@example.com',
    name: 'Laura Lee',
    role: 'OL_ADMIN',
    status: 'inactive',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '13',
    email: 'michael@example.com',
    name: 'Michael Garcia',
    role: 'SUPER_ADMIN',
    status: 'active',
    createdAt: new Date('2024-04-15'),
  },
  {
    id: '14',
    email: 'nancy@example.com',
    name: 'Nancy White',
    role: 'KA_ADMIN',
    status: 'active',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '15',
    email: 'oscar@example.com',
    name: 'Oscar Harris',
    role: 'OL_ADMIN',
    status: 'pending',
    createdAt: new Date('2024-03-25'),
  },
  {
    id: '16',
    email: 'paula@example.com',
    name: 'Paula Clark',
    role: 'SUPER_ADMIN',
    status: 'active',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '17',
    email: 'quincy@example.com',
    name: 'Quincy Lewis',
    role: 'KA_ADMIN',
    status: 'inactive',
    createdAt: new Date('2024-04-20'),
  },
  {
    id: '18',
    email: 'rachel@example.com',
    name: 'Rachel Walker',
    role: 'OL_ADMIN',
    status: 'active',
    createdAt: new Date('2024-02-05'),
  },
  {
    id: '19',
    email: 'steven@example.com',
    name: 'Steven Hall',
    role: 'SUPER_ADMIN',
    status: 'active',
    createdAt: new Date('2024-03-30'),
  },
  {
    id: '20',
    email: 'tina@example.com',
    name: 'Tina Young',
    role: 'KA_ADMIN',
    status: 'pending',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '21',
    email: 'ursula@example.com',
    name: 'Ursula King',
    role: 'OL_ADMIN',
    status: 'active',
    createdAt: new Date('2024-04-25'),
  },
  {
    id: '22',
    email: 'victor@example.com',
    name: 'Victor Wright',
    role: 'SUPER_ADMIN',
    status: 'inactive',
    createdAt: new Date('2024-02-18'),
  },
  {
    id: '23',
    email: 'wendy@example.com',
    name: 'Wendy Lopez',
    role: 'KA_ADMIN',
    status: 'active',
    createdAt: new Date('2024-03-05'),
  },
  {
    id: '24',
    email: 'xavier@example.com',
    name: 'Xavier Hill',
    role: 'OL_ADMIN',
    status: 'active',
    createdAt: new Date('2024-01-28'),
  },
  {
    id: '25',
    email: 'yvonne@example.com',
    name: 'Yvonne Scott',
    role: 'SUPER_ADMIN',
    status: 'pending',
    createdAt: new Date('2024-04-08'),
  },
];

export default function DataTableExamplePage() {
  const [data] = useState<User[]>(mockUsers);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-serif font-bold mb-6">DataTable Demo</h1>
      <DataTable
        columns={columns}
        data={data}
        enableRowSelection
        enableExport
        exportFilename="users"
        bulkActions={[
          {
            label: 'Delete Selected',
            variant: 'destructive',
            onClick: (rows) => {
              console.log('Delete:', rows);
              alert(`Would delete ${rows.length} users`);
            },
          },
        ]}
        emptyState={{
          title: 'No users found',
          description: 'Get started by creating your first user',
          action: {
            label: 'Create User',
            onClick: () => console.log('Create user'),
          },
        }}
      />
    </div>
  );
}
