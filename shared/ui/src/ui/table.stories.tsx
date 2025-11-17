import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table';
import { Badge } from './badge';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { ArrowUpDown, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';

/**
 * Table component for displaying structured data in rows and columns.
 * Built with semantic HTML table elements and responsive overflow handling.
 *
 * ## Features
 * - Semantic table structure (thead, tbody, tfoot)
 * - Responsive overflow with horizontal scrolling
 * - Hover effects on rows
 * - Support for selection states
 * - Caption support for accessibility
 * - Customizable with className
 * - Flexible column widths
 *
 * ## Components
 * - `Table` - Container with overflow wrapper
 * - `TableHeader` - Header section (thead)
 * - `TableBody` - Body section (tbody)
 * - `TableFooter` - Footer section (tfoot)
 * - `TableRow` - Table row (tr)
 * - `TableHead` - Header cell (th)
 * - `TableCell` - Data cell (td)
 * - `TableCaption` - Table caption for accessibility
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A responsive table component for displaying structured data with support for headers, footers, captions, and interactive rows.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic table with header and rows
 */
export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alice Johnson</TableCell>
          <TableCell>alice@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob Smith</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>Editor</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Carol White</TableCell>
          <TableCell>carol@example.com</TableCell>
          <TableCell>Viewer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Table with caption for accessibility
 */
export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of recent user registrations</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Emma Davis</TableCell>
          <TableCell>emma@example.com</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Frank Miller</TableCell>
          <TableCell>frank@example.com</TableCell>
          <TableCell>Pending</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Grace Lee</TableCell>
          <TableCell>grace@example.com</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Table with footer for totals or summary information
 */
export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Premium Plan</TableCell>
          <TableCell>2</TableCell>
          <TableCell className="text-right">€29.00</TableCell>
          <TableCell className="text-right">€58.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Storage Add-on</TableCell>
          <TableCell>1</TableCell>
          <TableCell className="text-right">€10.00</TableCell>
          <TableCell className="text-right">€10.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>API Credits</TableCell>
          <TableCell>500</TableCell>
          <TableCell className="text-right">€0.05</TableCell>
          <TableCell className="text-right">€25.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">€93.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

/**
 * Table with striped rows using custom styling
 */
export const StripedRows: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Task</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { id: '001', task: 'Update documentation', status: 'Complete', priority: 'High' },
          { id: '002', task: 'Fix login bug', status: 'In Progress', priority: 'Critical' },
          { id: '003', task: 'Review pull request', status: 'Pending', priority: 'Medium' },
          { id: '004', task: 'Deploy to staging', status: 'Complete', priority: 'High' },
          { id: '005', task: 'Write unit tests', status: 'In Progress', priority: 'Low' },
        ].map((item, index) => (
          <TableRow key={item.id} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
            <TableCell className="font-mono text-xs">{item.id}</TableCell>
            <TableCell>{item.task}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>{item.priority}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/**
 * Table with badges and status indicators
 */
export const WithBadges: Story = {
  render: () => (
    <Table>
      <TableCaption>Application deployment status across environments</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Application</TableHead>
          <TableHead>Environment</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Version</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Admin Dashboard</TableCell>
          <TableCell>Production</TableCell>
          <TableCell>
            <Badge className="bg-green-500">Running</Badge>
          </TableCell>
          <TableCell>v2.4.1</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Kids Ascension</TableCell>
          <TableCell>Staging</TableCell>
          <TableCell>
            <Badge className="bg-yellow-500">Building</Badge>
          </TableCell>
          <TableCell>v1.8.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Ozean Licht</TableCell>
          <TableCell>Production</TableCell>
          <TableCell>
            <Badge className="bg-green-500">Running</Badge>
          </TableCell>
          <TableCell>v3.2.0</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">MCP Gateway</TableCell>
          <TableCell>Production</TableCell>
          <TableCell>
            <Badge variant="destructive">Error</Badge>
          </TableCell>
          <TableCell>v1.5.2</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Table with selectable rows using checkboxes
 */
export const WithSelection: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox aria-label="Select all" />
          </TableHead>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <Checkbox aria-label="Select row" />
          </TableCell>
          <TableCell>Hannah Wilson</TableCell>
          <TableCell>hannah@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow data-state="selected">
          <TableCell>
            <Checkbox checked aria-label="Select row" />
          </TableCell>
          <TableCell>Ian Brown</TableCell>
          <TableCell>ian@example.com</TableCell>
          <TableCell>Editor</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Checkbox aria-label="Select row" />
          </TableCell>
          <TableCell>Julia Martinez</TableCell>
          <TableCell>julia@example.com</TableCell>
          <TableCell>Viewer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Table with sortable columns
 */
export const Sortable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button variant="ghost" className="h-8 px-2">
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" className="h-8 px-2">
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" className="h-8 px-2">
              Role
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead className="text-right">
            <Button variant="ghost" className="h-8 px-2">
              Last Active
              <ChevronUp className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alice Johnson</TableCell>
          <TableCell>alice@example.com</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell className="text-right">2 hours ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob Smith</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>Editor</TableCell>
          <TableCell className="text-right">5 hours ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Carol White</TableCell>
          <TableCell>carol@example.com</TableCell>
          <TableCell>Viewer</TableCell>
          <TableCell className="text-right">1 day ago</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Table with actions column
 */
export const WithActions: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Kevin Clark</TableCell>
          <TableCell>kevin@example.com</TableCell>
          <TableCell>
            <Badge className="bg-[#0ec2bc] hover:bg-[#0ec2bc]/80">Active</Badge>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">
              Edit
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Laura Adams</TableCell>
          <TableCell>laura@example.com</TableCell>
          <TableCell>
            <Badge variant="secondary">Inactive</Badge>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">
              Edit
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Mike Thompson</TableCell>
          <TableCell>mike@example.com</TableCell>
          <TableCell>
            <Badge className="bg-[#0ec2bc] hover:bg-[#0ec2bc]/80">Active</Badge>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">
              Edit
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Responsive table with many columns that scrolls horizontally
 */
export const ResponsiveWideTable: Story = {
  render: () => (
    <Table>
      <TableCaption>Scroll horizontally to view all columns</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead className="text-right">Salary</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-mono">EMP001</TableCell>
          <TableCell>Nathan Green</TableCell>
          <TableCell>nathan@example.com</TableCell>
          <TableCell>Engineering</TableCell>
          <TableCell>Vienna, Austria</TableCell>
          <TableCell>Senior Developer</TableCell>
          <TableCell>2021-03-15</TableCell>
          <TableCell className="text-right">€75,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-mono">EMP002</TableCell>
          <TableCell>Olivia Parker</TableCell>
          <TableCell>olivia@example.com</TableCell>
          <TableCell>Design</TableCell>
          <TableCell>Salzburg, Austria</TableCell>
          <TableCell>Lead Designer</TableCell>
          <TableCell>2020-07-22</TableCell>
          <TableCell className="text-right">€68,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-mono">EMP003</TableCell>
          <TableCell>Paul Rodriguez</TableCell>
          <TableCell>paul@example.com</TableCell>
          <TableCell>Marketing</TableCell>
          <TableCell>Graz, Austria</TableCell>
          <TableCell>Marketing Manager</TableCell>
          <TableCell>2022-01-10</TableCell>
          <TableCell className="text-right">€62,000</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Empty state table
 */
export const EmptyState: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
            No results found.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Data-dense table with compact styling
 */
export const Compact: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="h-8">Service</TableHead>
          <TableHead className="h-8">Status</TableHead>
          <TableHead className="h-8">Uptime</TableHead>
          <TableHead className="h-8">Response Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { service: 'API Gateway', status: 'Operational', uptime: '99.99%', response: '45ms' },
          { service: 'Database', status: 'Operational', uptime: '99.95%', response: '12ms' },
          { service: 'Cache', status: 'Operational', uptime: '100%', response: '2ms' },
          { service: 'CDN', status: 'Degraded', uptime: '98.50%', response: '120ms' },
          { service: 'Storage', status: 'Operational', uptime: '99.98%', response: '35ms' },
        ].map((item) => (
          <TableRow key={item.service} className="h-10">
            <TableCell className="py-2 font-medium">{item.service}</TableCell>
            <TableCell className="py-2">
              <Badge
                variant={item.status === 'Operational' ? 'default' : 'secondary'}
                className={item.status === 'Operational' ? 'bg-[#0ec2bc] hover:bg-[#0ec2bc]/80' : ''}
              >
                {item.status}
              </Badge>
            </TableCell>
            <TableCell className="py-2">{item.uptime}</TableCell>
            <TableCell className="py-2">{item.response}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/**
 * Real-world example: User management table with all features
 */
export const UserManagement: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <Button className="bg-[#0ec2bc] hover:bg-[#0ec2bc]/80">Add User</Button>
      </div>
      <Table>
        <TableCaption>A list of all users in your organization</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox aria-label="Select all" />
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="h-8 px-2">
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Checkbox aria-label="Select row" />
            </TableCell>
            <TableCell className="font-medium">Quinn Taylor</TableCell>
            <TableCell>quinn@ozean-licht.dev</TableCell>
            <TableCell>Administrator</TableCell>
            <TableCell>
              <Badge className="bg-[#0ec2bc] hover:bg-[#0ec2bc]/80">Active</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow data-state="selected">
            <TableCell>
              <Checkbox checked aria-label="Select row" />
            </TableCell>
            <TableCell className="font-medium">Rachel Evans</TableCell>
            <TableCell>rachel@kids-ascension.dev</TableCell>
            <TableCell>Editor</TableCell>
            <TableCell>
              <Badge className="bg-[#0ec2bc] hover:bg-[#0ec2bc]/80">Active</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Checkbox aria-label="Select row" />
            </TableCell>
            <TableCell className="font-medium">Sam Cooper</TableCell>
            <TableCell>sam@example.com</TableCell>
            <TableCell>Viewer</TableCell>
            <TableCell>
              <Badge variant="secondary">Inactive</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total Users</TableCell>
            <TableCell className="text-right">3</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
};
