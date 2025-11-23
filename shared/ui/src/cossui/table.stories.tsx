import type { Meta, StoryObj } from '@storybook/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table'

const meta: Meta<typeof Table> = {
  title: 'Tier 1: Primitives/CossUI/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Table component from Coss UI with glass morphism effects and Ozean Licht styling. Features hover effects, accessibility support, and responsive design.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Table>

// Sample data for stories
const invoices = [
  {
    invoice: 'INV-001',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    amount: '$250.00',
  },
  {
    invoice: 'INV-002',
    paymentStatus: 'Pending',
    paymentMethod: 'PayPal',
    amount: '$150.00',
  },
  {
    invoice: 'INV-003',
    paymentStatus: 'Unpaid',
    paymentMethod: 'Bank Transfer',
    amount: '$350.00',
  },
  {
    invoice: 'INV-004',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    amount: '$450.00',
  },
]

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">{invoice.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Table>
        <TableCaption>Summary of quarterly sales data.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Quarter</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Growth</TableHead>
            <TableHead className="text-right">Target</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Q1 2024</TableCell>
            <TableCell>$125,000</TableCell>
            <TableCell className="text-green-400">+15%</TableCell>
            <TableCell className="text-right">$100,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Q2 2024</TableCell>
            <TableCell>$143,750</TableCell>
            <TableCell className="text-green-400">+15%</TableCell>
            <TableCell className="text-right">$120,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Q3 2024</TableCell>
            <TableCell>$165,312</TableCell>
            <TableCell className="text-green-400">+15%</TableCell>
            <TableCell className="text-right">$140,000</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total YTD</TableCell>
            <TableCell>$434,062</TableCell>
            <TableCell className="text-green-400">+15%</TableCell>
            <TableCell className="text-right">$360,000</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
}

export const DataTable: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                className="rounded border-border bg-card/50 text-primary focus:ring-primary"
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            {
              id: '1',
              name: 'Alice Johnson',
              email: 'alice@example.com',
              role: 'Admin',
              status: 'Active',
            },
            {
              id: '2',
              name: 'Bob Smith',
              email: 'bob@example.com',
              role: 'User',
              status: 'Active',
            },
            {
              id: '3',
              name: 'Carol White',
              email: 'carol@example.com',
              role: 'Editor',
              status: 'Inactive',
            },
            {
              id: '4',
              name: 'David Brown',
              email: 'david@example.com',
              role: 'User',
              status: 'Active',
            },
            {
              id: '5',
              name: 'Eve Davis',
              email: 'eve@example.com',
              role: 'Viewer',
              status: 'Pending',
            },
          ].map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <input
                  type="checkbox"
                  className="rounded border-border bg-card/50 text-primary focus:ring-primary"
                  aria-label={`Select ${user.name}`}
                />
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-right">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    user.status === 'Active'
                      ? 'bg-green-500/20 text-green-300'
                      : user.status === 'Inactive'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                  }`}
                >
                  {user.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}

export const Compact: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>#001</TableCell>
            <TableCell>Fix login bug</TableCell>
            <TableCell>2024-11-20</TableCell>
            <TableCell className="text-right">
              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs font-medium">
                High
              </span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#002</TableCell>
            <TableCell>Update documentation</TableCell>
            <TableCell>2024-11-21</TableCell>
            <TableCell className="text-right">
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs font-medium">
                Medium
              </span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#003</TableCell>
            <TableCell>Refactor API</TableCell>
            <TableCell>2024-11-22</TableCell>
            <TableCell className="text-right">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-medium">
                Low
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
}

export const WithCustomStyling: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Table>
        <TableCaption>Product inventory with custom styling</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-primary/10">
            <TableCell className="font-semibold">Laptop</TableCell>
            <TableCell>SKU-001</TableCell>
            <TableCell>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                42 units
              </span>
            </TableCell>
            <TableCell className="text-right font-medium text-primary">
              $1,299.99
            </TableCell>
          </TableRow>
          <TableRow className="hover:bg-primary/10">
            <TableCell className="font-semibold">Mouse</TableCell>
            <TableCell>SKU-002</TableCell>
            <TableCell>
              <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-sm">
                12 units
              </span>
            </TableCell>
            <TableCell className="text-right font-medium text-primary">
              $29.99
            </TableCell>
          </TableRow>
          <TableRow className="hover:bg-primary/10">
            <TableCell className="font-semibold">Keyboard</TableCell>
            <TableCell>SKU-003</TableCell>
            <TableCell>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                156 units
              </span>
            </TableCell>
            <TableCell className="text-right font-medium text-primary">
              $149.99
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
}
