import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from './table';
import { Button } from '../../components/Button';
import { Checkbox } from '../../ui/checkbox';
import { Badge } from '../../components/Badge';

/**
 * Catalyst Table component for displaying structured data.
 *
 * **This is a Tier 1 Primitive** - Headless UI-based table component with Catalyst styling.
 * No Tier 2 branded version exists yet. This is the authoritative data table component.
 *
 * ## Catalyst Table Features
 * - **Responsive**: Horizontal scroll on small screens with gutter-based spacing
 * - **Flexible Layouts**: Grid mode, dense mode, striped rows, bleed mode
 * - **Interactive Rows**: Support for clickable rows with proper focus states
 * - **Sortable**: Can be enhanced with sort handlers
 * - **Selectable**: Can integrate checkboxes for row selection
 * - **Accessible**: Semantic HTML table structure with proper ARIA attributes
 *
 * ## Component Structure
 * ```tsx
 * <Table dense={false} grid={false} striped={false} bleed={false}>
 *   <TableHead>
 *     <TableRow>
 *       <TableHeader>Column 1</TableHeader>
 *       <TableHeader>Column 2</TableHeader>
 *     </TableRow>
 *   </TableHead>
 *   <TableBody>
 *     <TableRow href="/link"> // Optional clickable row
 *       <TableCell>Data 1</TableCell>
 *       <TableCell>Data 2</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 *
 * ## Props
 * - **dense**: Reduces vertical padding (py-2.5 vs py-4)
 * - **grid**: Adds vertical borders between columns
 * - **striped**: Alternating row background colors
 * - **bleed**: Removes horizontal padding (full-width)
 *
 * ## Usage Notes
 * - Use `href` on TableRow to make entire row clickable (link behavior)
 * - TableCell automatically handles link overlay when row has href
 * - TableContext provides shared props (dense, grid, striped, bleed) to all children
 * - Use `first:` and `last:` modifiers for responsive gutter spacing
 */
const meta = {
  title: 'Tier 1: Primitives/Catalyst/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible, accessible data table component built with Headless UI patterns and Catalyst design system. Supports sorting, selection, striped rows, and clickable rows.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default table with basic data.
 *
 * Shows the simplest table implementation with clean, minimal styling.
 */
export const Default: Story = {
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Email</TableHeader>
          <TableHeader>Role</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Anna Schmidt</TableCell>
          <TableCell>anna.schmidt@ozean-licht.dev</TableCell>
          <TableCell>Administrator</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Markus Weber</TableCell>
          <TableCell>markus.weber@ozean-licht.dev</TableCell>
          <TableCell>Editor</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Sophie Mueller</TableCell>
          <TableCell>sophie.mueller@ozean-licht.dev</TableCell>
          <TableCell>Viewer</TableCell>
          <TableCell>Inactive</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Lukas Fischer</TableCell>
          <TableCell>lukas.fischer@kids-ascension.dev</TableCell>
          <TableCell>Teacher</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Striped table with alternating row colors.
 *
 * The `striped` prop adds subtle background color to even rows for better readability.
 */
export const Striped: Story = {
  render: () => (
    <Table striped>
      <TableHead>
        <TableRow>
          <TableHeader>Product</TableHeader>
          <TableHeader>Category</TableHeader>
          <TableHeader>Price</TableHeader>
          <TableHeader>Stock</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Meditation Cushion</TableCell>
          <TableCell>Accessories</TableCell>
          <TableCell>€45.00</TableCell>
          <TableCell>24</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Crystal Singing Bowl</TableCell>
          <TableCell>Instruments</TableCell>
          <TableCell>€180.00</TableCell>
          <TableCell>8</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Yoga Mat</TableCell>
          <TableCell>Equipment</TableCell>
          <TableCell>€32.00</TableCell>
          <TableCell>56</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Essential Oil Set</TableCell>
          <TableCell>Wellness</TableCell>
          <TableCell>€28.00</TableCell>
          <TableCell>42</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Incense Bundle</TableCell>
          <TableCell>Aromatherapy</TableCell>
          <TableCell>€12.00</TableCell>
          <TableCell>98</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Grid table with vertical borders.
 *
 * The `grid` prop adds vertical borders between columns for structured data visualization.
 */
export const Grid: Story = {
  render: () => (
    <Table grid>
      <TableHead>
        <TableRow>
          <TableHeader>Region</TableHeader>
          <TableHeader>Q1</TableHeader>
          <TableHeader>Q2</TableHeader>
          <TableHeader>Q3</TableHeader>
          <TableHeader>Q4</TableHeader>
          <TableHeader>Total</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Vienna</TableCell>
          <TableCell>€24,500</TableCell>
          <TableCell>€28,200</TableCell>
          <TableCell>€31,800</TableCell>
          <TableCell>€35,400</TableCell>
          <TableCell>€119,900</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Salzburg</TableCell>
          <TableCell>€18,600</TableCell>
          <TableCell>€21,400</TableCell>
          <TableCell>€19,800</TableCell>
          <TableCell>€23,200</TableCell>
          <TableCell>€83,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Innsbruck</TableCell>
          <TableCell>€15,200</TableCell>
          <TableCell>€17,900</TableCell>
          <TableCell>€16,500</TableCell>
          <TableCell>€19,400</TableCell>
          <TableCell>€69,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Graz</TableCell>
          <TableCell>€12,800</TableCell>
          <TableCell>€14,600</TableCell>
          <TableCell>€13,900</TableCell>
          <TableCell>€16,700</TableCell>
          <TableCell>€58,000</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Dense table with reduced vertical spacing.
 *
 * The `dense` prop reduces padding for compact data display.
 */
export const Dense: Story = {
  render: () => (
    <Table dense>
      <TableHead>
        <TableRow>
          <TableHeader>ID</TableHeader>
          <TableHeader>Timestamp</TableHeader>
          <TableHeader>Event</TableHeader>
          <TableHeader>User</TableHeader>
          <TableHeader>IP Address</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>#1024</TableCell>
          <TableCell>2025-11-13 14:32:18</TableCell>
          <TableCell>Login</TableCell>
          <TableCell>anna.schmidt@ozean-licht.dev</TableCell>
          <TableCell>138.201.139.25</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>#1025</TableCell>
          <TableCell>2025-11-13 14:34:52</TableCell>
          <TableCell>File Upload</TableCell>
          <TableCell>markus.weber@ozean-licht.dev</TableCell>
          <TableCell>138.201.139.25</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>#1026</TableCell>
          <TableCell>2025-11-13 14:38:10</TableCell>
          <TableCell>Settings Change</TableCell>
          <TableCell>sophie.mueller@ozean-licht.dev</TableCell>
          <TableCell>138.201.139.25</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>#1027</TableCell>
          <TableCell>2025-11-13 14:42:35</TableCell>
          <TableCell>Logout</TableCell>
          <TableCell>anna.schmidt@ozean-licht.dev</TableCell>
          <TableCell>138.201.139.25</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>#1028</TableCell>
          <TableCell>2025-11-13 14:45:19</TableCell>
          <TableCell>Login</TableCell>
          <TableCell>lukas.fischer@kids-ascension.dev</TableCell>
          <TableCell>138.201.139.25</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Table with clickable rows using href.
 *
 * Add `href` to TableRow to make the entire row clickable with proper hover and focus states.
 */
export const ClickableRows: Story = {
  render: () => (
    <Table striped>
      <TableHead>
        <TableRow>
          <TableHeader>Workshop</TableHeader>
          <TableHeader>Instructor</TableHeader>
          <TableHeader>Date</TableHeader>
          <TableHeader>Participants</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow href="/workshops/mindfulness-basics" title="View Mindfulness Basics">
          <TableCell>Mindfulness Basics</TableCell>
          <TableCell>Maria Huber</TableCell>
          <TableCell>Nov 20, 2025</TableCell>
          <TableCell>12 / 15</TableCell>
        </TableRow>
        <TableRow href="/workshops/crystal-healing" title="View Crystal Healing">
          <TableCell>Crystal Healing Workshop</TableCell>
          <TableCell>Thomas Bauer</TableCell>
          <TableCell>Nov 22, 2025</TableCell>
          <TableCell>8 / 10</TableCell>
        </TableRow>
        <TableRow href="/workshops/meditation-intensive" title="View Meditation Intensive">
          <TableCell>Meditation Intensive</TableCell>
          <TableCell>Elisabeth Gruber</TableCell>
          <TableCell>Nov 25, 2025</TableCell>
          <TableCell>15 / 20</TableCell>
        </TableRow>
        <TableRow href="/workshops/energy-work" title="View Energy Work">
          <TableCell>Energy Work Fundamentals</TableCell>
          <TableCell>Johannes Steiner</TableCell>
          <TableCell>Nov 28, 2025</TableCell>
          <TableCell>6 / 12</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Table with sorting functionality.
 *
 * Demonstrates sortable columns with visual indicators and state management.
 */
export const WithSorting: Story = {
  render: () => {
    const SortableTable = () => {
      const [sortColumn, setSortColumn] = useState<string>('name');
      const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

      const data = [
        { name: 'Anna Schmidt', email: 'anna.schmidt@ozean-licht.dev', role: 'Admin', joined: '2023-01-15' },
        { name: 'Markus Weber', email: 'markus.weber@ozean-licht.dev', role: 'Editor', joined: '2023-03-22' },
        { name: 'Sophie Mueller', email: 'sophie.mueller@ozean-licht.dev', role: 'Viewer', joined: '2024-05-10' },
        { name: 'Lukas Fischer', email: 'lukas.fischer@kids-ascension.dev', role: 'Teacher', joined: '2024-08-03' },
      ];

      const handleSort = (column: string) => {
        if (sortColumn === column) {
          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
          setSortColumn(column);
          setSortDirection('asc');
        }
      };

      const sortedData = [...data].sort((a, b) => {
        const aVal = a[sortColumn as keyof typeof a];
        const bVal = b[sortColumn as keyof typeof b];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        return aVal < bVal ? -modifier : modifier;
      });

      const SortIcon = ({ column }: { column: string }) => {
        if (sortColumn !== column) return <span className="text-zinc-400">↕</span>;
        return sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>;
      };

      return (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white"
                >
                  Name <SortIcon column="name" />
                </button>
              </TableHeader>
              <TableHeader>
                <button
                  onClick={() => handleSort('email')}
                  className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white"
                >
                  Email <SortIcon column="email" />
                </button>
              </TableHeader>
              <TableHeader>
                <button
                  onClick={() => handleSort('role')}
                  className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white"
                >
                  Role <SortIcon column="role" />
                </button>
              </TableHeader>
              <TableHeader>
                <button
                  onClick={() => handleSort('joined')}
                  className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white"
                >
                  Joined <SortIcon column="joined" />
                </button>
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.joined}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    };

    return <SortableTable />;
  },
};

/**
 * Table with row selection using checkboxes.
 *
 * Demonstrates multi-select functionality with select all header.
 */
export const WithSelection: Story = {
  render: () => {
    const SelectableTable = () => {
      const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

      const data = [
        { id: 1, name: 'Anna Schmidt', email: 'anna.schmidt@ozean-licht.dev', role: 'Admin' },
        { id: 2, name: 'Markus Weber', email: 'markus.weber@ozean-licht.dev', role: 'Editor' },
        { id: 3, name: 'Sophie Mueller', email: 'sophie.mueller@ozean-licht.dev', role: 'Viewer' },
        { id: 4, name: 'Lukas Fischer', email: 'lukas.fischer@kids-ascension.dev', role: 'Teacher' },
      ];

      const toggleRow = (id: number) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
        setSelectedRows(newSelected);
      };

      const toggleAll = () => {
        if (selectedRows.size === data.length) {
          setSelectedRows(new Set());
        } else {
          setSelectedRows(new Set(data.map((row) => row.id)));
        }
      };

      const allSelected = selectedRows.size === data.length;
      const someSelected = selectedRows.size > 0 && selectedRows.size < data.length;

      return (
        <div className="space-y-4">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {selectedRows.size} of {data.length} rows selected
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>
                  <Checkbox
                    checked={allSelected}
                    ref={(ref) => {
                      if (ref) ref.indeterminate = someSelected;
                    }}
                    onCheckedChange={toggleAll}
                    aria-label="Select all rows"
                  />
                </TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Role</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(row.id)}
                      onCheckedChange={() => toggleRow(row.id)}
                      aria-label={`Select ${row.name}`}
                    />
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    };

    return <SelectableTable />;
  },
};

/**
 * Table with pagination controls.
 *
 * Demonstrates paginated data display with navigation controls.
 */
export const WithPagination: Story = {
  render: () => {
    const PaginatedTable = () => {
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 5;

      const allData = [
        { id: 1, course: 'Math Fundamentals', students: 24, teacher: 'Prof. Weber', progress: '85%' },
        { id: 2, course: 'Science Exploration', students: 18, teacher: 'Dr. Schmidt', progress: '72%' },
        { id: 3, course: 'Creative Writing', students: 15, teacher: 'Maria Huber', progress: '90%' },
        { id: 4, course: 'History of Austria', students: 22, teacher: 'Thomas Bauer', progress: '68%' },
        { id: 5, course: 'Digital Art', students: 12, teacher: 'Sophie Mueller', progress: '78%' },
        { id: 6, course: 'Physical Education', students: 28, teacher: 'Lukas Fischer', progress: '82%' },
        { id: 7, course: 'Music Theory', students: 16, teacher: 'Elisabeth Gruber', progress: '75%' },
        { id: 8, course: 'Environmental Studies', students: 20, teacher: 'Johannes Steiner', progress: '88%' },
        { id: 9, course: 'Language Arts', students: 19, teacher: 'Anna Hoffman', progress: '91%' },
        { id: 10, course: 'Social Studies', students: 21, teacher: 'Michael Koch', progress: '70%' },
      ];

      const totalPages = Math.ceil(allData.length / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedData = allData.slice(startIndex, startIndex + itemsPerPage);

      return (
        <div className="space-y-4">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeader>Course</TableHeader>
                <TableHeader>Students</TableHeader>
                <TableHeader>Teacher</TableHeader>
                <TableHeader>Progress</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.course}</TableCell>
                  <TableCell>{row.students}</TableCell>
                  <TableCell>{row.teacher}</TableCell>
                  <TableCell>{row.progress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, allData.length)} of {allData.length}{' '}
              results
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'solid' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      );
    };

    return <PaginatedTable />;
  },
};

/**
 * Responsive table with horizontal scroll.
 *
 * Demonstrates how table handles overflow on small screens.
 */
export const ResponsiveTable: Story = {
  render: () => (
    <div className="max-w-2xl">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Transaction ID</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>TXN-2025-001</TableCell>
            <TableCell>2025-11-13</TableCell>
            <TableCell>Workshop Registration - Mindfulness Basics</TableCell>
            <TableCell>Education</TableCell>
            <TableCell>€45.00</TableCell>
            <TableCell>
              <Badge variant="secondary" style={{ backgroundColor: '#0ec2bc20', color: '#0ec2bc' }}>
                Completed
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>TXN-2025-002</TableCell>
            <TableCell>2025-11-12</TableCell>
            <TableCell>Crystal Singing Bowl Purchase</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>€180.00</TableCell>
            <TableCell>
              <Badge variant="secondary" style={{ backgroundColor: '#0ec2bc20', color: '#0ec2bc' }}>
                Completed
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>TXN-2025-003</TableCell>
            <TableCell>2025-11-10</TableCell>
            <TableCell>Monthly Membership Subscription</TableCell>
            <TableCell>Subscription</TableCell>
            <TableCell>€29.99</TableCell>
            <TableCell>
              <Badge variant="outline">Pending</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

/**
 * Dashboard-style admin table with realistic data.
 *
 * Demonstrates a complete admin dashboard table with status badges, actions, and rich data.
 */
export const DashboardTable: Story = {
  render: () => {
    const AdminTable = () => {
      const users = [
        {
          id: 1,
          name: 'Anna Schmidt',
          email: 'anna.schmidt@ozean-licht.dev',
          role: 'Administrator',
          entity: 'Ozean Licht',
          status: 'active',
          lastLogin: '2025-11-13 14:32',
        },
        {
          id: 2,
          name: 'Markus Weber',
          email: 'markus.weber@ozean-licht.dev',
          role: 'Editor',
          entity: 'Ozean Licht',
          status: 'active',
          lastLogin: '2025-11-13 10:15',
        },
        {
          id: 3,
          name: 'Sophie Mueller',
          email: 'sophie.mueller@ozean-licht.dev',
          role: 'Viewer',
          entity: 'Ozean Licht',
          status: 'inactive',
          lastLogin: '2025-11-05 16:42',
        },
        {
          id: 4,
          name: 'Lukas Fischer',
          email: 'lukas.fischer@kids-ascension.dev',
          role: 'Teacher',
          entity: 'Kids Ascension',
          status: 'active',
          lastLogin: '2025-11-13 09:28',
        },
        {
          id: 5,
          name: 'Maria Huber',
          email: 'maria.huber@kids-ascension.dev',
          role: 'Teacher',
          entity: 'Kids Ascension',
          status: 'active',
          lastLogin: '2025-11-12 18:50',
        },
      ];

      const getStatusBadge = (status: string) => {
        if (status === 'active') {
          return (
            <Badge variant="secondary" style={{ backgroundColor: '#0ec2bc20', color: '#0ec2bc' }}>
              Active
            </Badge>
          );
        }
        return (
          <Badge variant="outline" style={{ color: '#71717a' }}>
            Inactive
          </Badge>
        );
      };

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">User Management</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Manage users across both entities</p>
            </div>
            <Button style={{ backgroundColor: '#0ec2bc', color: 'white' }}>Add User</Button>
          </div>
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeader>User</TableHeader>
                <TableHeader>Entity</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Last Login</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-white">{user.name}</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.entity}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="plain" size="sm">
                        Edit
                      </Button>
                      <Button variant="plain" size="sm" style={{ color: '#ef4444' }}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    };

    return <AdminTable />;
  },
};

/**
 * Ozean Licht themed table.
 *
 * Demonstrates applying Ozean Licht turquoise (#0ec2bc) accents to table elements.
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: '#0ec2bc' }}>
          Workshop Schedule
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Upcoming workshops with Ozean Licht turquoise accents
        </p>
      </div>
      <Table striped>
        <TableHead>
          <TableRow>
            <TableHeader style={{ color: '#0ec2bc' }}>Workshop</TableHeader>
            <TableHeader style={{ color: '#0ec2bc' }}>Instructor</TableHeader>
            <TableHeader style={{ color: '#0ec2bc' }}>Date</TableHeader>
            <TableHeader style={{ color: '#0ec2bc' }}>Capacity</TableHeader>
            <TableHeader style={{ color: '#0ec2bc' }}>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <span className="font-medium" style={{ color: '#0ec2bc' }}>
                Mindfulness Basics
              </span>
            </TableCell>
            <TableCell>Maria Huber</TableCell>
            <TableCell>Nov 20, 2025</TableCell>
            <TableCell>12 / 15</TableCell>
            <TableCell>
              <Badge variant="secondary" style={{ backgroundColor: '#0ec2bc20', color: '#0ec2bc' }}>
                Available
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <span className="font-medium" style={{ color: '#0ec2bc' }}>
                Crystal Healing Workshop
              </span>
            </TableCell>
            <TableCell>Thomas Bauer</TableCell>
            <TableCell>Nov 22, 2025</TableCell>
            <TableCell>8 / 10</TableCell>
            <TableCell>
              <Badge variant="secondary" style={{ backgroundColor: '#0ec2bc20', color: '#0ec2bc' }}>
                Available
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <span className="font-medium" style={{ color: '#0ec2bc' }}>
                Meditation Intensive
              </span>
            </TableCell>
            <TableCell>Elisabeth Gruber</TableCell>
            <TableCell>Nov 25, 2025</TableCell>
            <TableCell>15 / 20</TableCell>
            <TableCell>
              <Badge variant="secondary" style={{ backgroundColor: '#0ec2bc20', color: '#0ec2bc' }}>
                Available
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <span className="font-medium" style={{ color: '#0ec2bc' }}>
                Energy Work Fundamentals
              </span>
            </TableCell>
            <TableCell>Johannes Steiner</TableCell>
            <TableCell>Nov 28, 2025</TableCell>
            <TableCell>12 / 12</TableCell>
            <TableCell>
              <Badge variant="outline" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                Full
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="flex justify-end gap-2">
        <Button variant="outline" style={{ borderColor: '#0ec2bc', color: '#0ec2bc' }}>
          View All Workshops
        </Button>
        <Button style={{ backgroundColor: '#0ec2bc', color: 'white' }}>Create Workshop</Button>
      </div>
    </div>
  ),
};

/**
 * Combined features table.
 *
 * Demonstrates multiple features working together: grid, dense, and custom styling.
 */
export const CombinedFeatures: Story = {
  render: () => (
    <Table grid dense striped>
      <TableHead>
        <TableRow>
          <TableHeader>Service</TableHeader>
          <TableHeader>Host</TableHeader>
          <TableHeader>Port</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Uptime</TableHeader>
          <TableHeader>CPU</TableHeader>
          <TableHeader>Memory</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Admin Dashboard</TableCell>
          <TableCell>coolify.ozean-licht.dev</TableCell>
          <TableCell>9200</TableCell>
          <TableCell>
            <Badge variant="secondary" style={{ backgroundColor: '#0ec2bc20', color: '#0ec2bc' }}>
              Running
            </Badge>
          </TableCell>
          <TableCell>24d 16h</TableCell>
          <TableCell>12%</TableCell>
          <TableCell>342 MB</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>MCP Gateway</TableCell>
          <TableCell>coolify.ozean-licht.dev</TableCell>
          <TableCell>8100</TableCell>
          <TableCell>
            <Badge variant="secondary" style={{ backgroundColor: '#0ec2bc20', color: '#0ec2bc' }}>
              Running
            </Badge>
          </TableCell>
          <TableCell>24d 16h</TableCell>
          <TableCell>8%</TableCell>
          <TableCell>256 MB</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>PostgreSQL</TableCell>
          <TableCell>138.201.139.25</TableCell>
          <TableCell>5432</TableCell>
          <TableCell>
            <Badge variant="secondary" style={{ backgroundColor: '#0ec2bc20', color: '#0ec2bc' }}>
              Running
            </Badge>
          </TableCell>
          <TableCell>24d 16h</TableCell>
          <TableCell>18%</TableCell>
          <TableCell>1.2 GB</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>MinIO</TableCell>
          <TableCell>138.201.139.25</TableCell>
          <TableCell>9000</TableCell>
          <TableCell>
            <Badge variant="secondary" style={{ backgroundColor: '#0ec2bc20', color: '#0ec2bc' }}>
              Running
            </Badge>
          </TableCell>
          <TableCell>24d 16h</TableCell>
          <TableCell>5%</TableCell>
          <TableCell>512 MB</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Grafana</TableCell>
          <TableCell>grafana.ozean-licht.dev</TableCell>
          <TableCell>3000</TableCell>
          <TableCell>
            <Badge variant="secondary" style={{ backgroundColor: '#0ec2bc20', color: '#0ec2bc' }}>
              Running
            </Badge>
          </TableCell>
          <TableCell>24d 16h</TableCell>
          <TableCell>3%</TableCell>
          <TableCell>198 MB</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Interactive test with play function.
 *
 * Tests table interactions using Storybook testing utilities.
 */
export const InteractiveTest: Story = {
  render: () => (
    <Table striped>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Email</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell data-testid="user-name-1">Anna Schmidt</TableCell>
          <TableCell>anna.schmidt@ozean-licht.dev</TableCell>
          <TableCell>
            <Button variant="plain" size="sm" data-testid="edit-button-1">
              Edit
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell data-testid="user-name-2">Markus Weber</TableCell>
          <TableCell>markus.weber@ozean-licht.dev</TableCell>
          <TableCell>
            <Button variant="plain" size="sm" data-testid="edit-button-2">
              Edit
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify table renders with correct data
    const userName1 = canvas.getByTestId('user-name-1');
    await expect(userName1).toHaveTextContent('Anna Schmidt');

    const userName2 = canvas.getByTestId('user-name-2');
    await expect(userName2).toHaveTextContent('Markus Weber');

    // Test button interaction
    const editButton = canvas.getByTestId('edit-button-1');
    await userEvent.click(editButton);
  },
};
