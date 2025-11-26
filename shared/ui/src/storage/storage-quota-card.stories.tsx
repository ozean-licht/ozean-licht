/**
 * Storage Quota Card Stories
 * Storybook stories for the Storage Quota Card component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { StorageQuotaCard } from './storage-quota-card'
import type { FileTypeBreakdown } from './storage-quota-card'

const meta: Meta<typeof StorageQuotaCard> = {
  title: 'Storage/StorageQuotaCard',
  component: StorageQuotaCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#00070F' }],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StorageQuotaCard>

const mockFileTypes: FileTypeBreakdown[] = [
  { type: 'images', bytes: 2147483648, color: '#0ec2bc' }, // 2 GB
  { type: 'videos', bytes: 3221225472, color: '#3B82F6' }, // 3 GB
  { type: 'documents', bytes: 1073741824, color: '#10B981' }, // 1 GB
  { type: 'archives', bytes: 536870912, color: '#F59E0B' }, // 512 MB
  { type: 'other', bytes: 268435456, color: '#6B7280' }, // 256 MB
]

// Low usage (30%)
export const LowUsage: Story = {
  args: {
    usedBytes: 3221225472, // 3 GB
    totalBytes: 10737418240, // 10 GB
    fileTypeBreakdown: [
      { type: 'images', bytes: 1073741824 },
      { type: 'documents', bytes: 1073741824 },
      { type: 'videos', bytes: 1073741824 },
    ],
    showChart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card with low usage (30%) - green status.',
      },
    },
  },
}

// Medium usage (65%)
export const MediumUsage: Story = {
  args: {
    usedBytes: 6979321856, // 6.5 GB
    totalBytes: 10737418240, // 10 GB
    fileTypeBreakdown: mockFileTypes.slice(0, 3),
    showChart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card with medium usage (65%) - green status.',
      },
    },
  },
}

// High usage (75%)
export const HighUsage: Story = {
  args: {
    usedBytes: 8053063680, // 7.5 GB
    totalBytes: 10737418240, // 10 GB
    fileTypeBreakdown: mockFileTypes.slice(0, 4),
    showChart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card with high usage (75%) - yellow warning.',
      },
    },
  },
}

// Critical usage (95%)
export const CriticalUsage: Story = {
  args: {
    usedBytes: 10200547328, // 9.5 GB
    totalBytes: 10737418240, // 10 GB
    fileTypeBreakdown: mockFileTypes,
    showChart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card with critical usage (95%) - red alert.',
      },
    },
  },
}

// With manage button
export const WithManageButton: Story = {
  args: {
    usedBytes: 8053063680,
    totalBytes: 10737418240,
    fileTypeBreakdown: mockFileTypes,
    showChart: true,
    onManageStorage: () => alert('Manage storage clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card with "Manage" button in header.',
      },
    },
  },
}

// Without chart
export const WithoutChart: Story = {
  args: {
    usedBytes: 5368709120, // 5 GB
    totalBytes: 10737418240, // 10 GB
    showChart: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card without file type breakdown chart (compact mode).',
      },
    },
  },
}

// With recent activity
export const WithRecentActivity: Story = {
  args: {
    usedBytes: 6442450944, // 6 GB
    totalBytes: 10737418240, // 10 GB
    fileTypeBreakdown: mockFileTypes.slice(0, 3),
    showChart: true,
    showRecentActivity: true,
    recentUploads: 42,
    uploadsChange: 15.5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card with recent activity section showing upload trends.',
      },
    },
  },
}

// Activity with negative change
export const ActivityNegativeTrend: Story = {
  args: {
    usedBytes: 5368709120,
    totalBytes: 10737418240,
    fileTypeBreakdown: mockFileTypes.slice(0, 3),
    showChart: true,
    showRecentActivity: true,
    recentUploads: 12,
    uploadsChange: -23.4,
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card showing decreased upload activity (negative trend).',
      },
    },
  },
}

// Small storage plan
export const SmallPlan: Story = {
  args: {
    usedBytes: 2147483648, // 2 GB
    totalBytes: 5368709120, // 5 GB
    fileTypeBreakdown: [
      { type: 'images', bytes: 1073741824 },
      { type: 'documents', bytes: 805306368 },
      { type: 'other', bytes: 268435456 },
    ],
    showChart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card for smaller 5 GB storage plan.',
      },
    },
  },
}

// Large storage plan
export const LargePlan: Story = {
  args: {
    usedBytes: 53687091200, // 50 GB
    totalBytes: 107374182400, // 100 GB
    fileTypeBreakdown: [
      { type: 'videos', bytes: 32212254720 }, // 30 GB
      { type: 'images', bytes: 10737418240 }, // 10 GB
      { type: 'documents', bytes: 5368709120 }, // 5 GB
      { type: 'archives', bytes: 3221225472 }, // 3 GB
      { type: 'audio', bytes: 2147483648, color: '#8B5CF6' }, // 2 GB
    ],
    showChart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card for large 100 GB storage plan.',
      },
    },
  },
}

// Almost empty
export const AlmostEmpty: Story = {
  args: {
    usedBytes: 104857600, // 100 MB
    totalBytes: 10737418240, // 10 GB
    fileTypeBreakdown: [
      { type: 'documents', bytes: 52428800 },
      { type: 'images', bytes: 52428800 },
    ],
    showChart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card with very low usage (< 1%).',
      },
    },
  },
}

// Full storage
export const FullStorage: Story = {
  args: {
    usedBytes: 10737418240, // 10 GB
    totalBytes: 10737418240, // 10 GB
    fileTypeBreakdown: mockFileTypes,
    showChart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card at 100% capacity - critical alert.',
      },
    },
  },
}

// Many file types
export const ManyFileTypes: Story = {
  args: {
    usedBytes: 8053063680,
    totalBytes: 10737418240,
    fileTypeBreakdown: [
      { type: 'images', bytes: 2147483648, color: '#0ec2bc' },
      { type: 'videos', bytes: 2147483648, color: '#3B82F6' },
      { type: 'documents', bytes: 1073741824, color: '#10B981' },
      { type: 'archives', bytes: 1073741824, color: '#F59E0B' },
      { type: 'audio', bytes: 805306368, color: '#8B5CF6' },
      { type: 'code', bytes: 536870912, color: '#EC4899' },
      { type: 'other', bytes: 268435456, color: '#6B7280' },
    ],
    showChart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card with many file type categories in breakdown.',
      },
    },
  },
}

// Custom colors
export const CustomColors: Story = {
  args: {
    usedBytes: 6442450944,
    totalBytes: 10737418240,
    fileTypeBreakdown: [
      { type: 'photos', bytes: 3221225472, color: '#FF6B6B' },
      { type: 'music', bytes: 2147483648, color: '#4ECDC4' },
      { type: 'backups', bytes: 1073741824, color: '#FFE66D' },
    ],
    showChart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card with custom file type names and colors.',
      },
    },
  },
}

// Complete feature set
export const AllFeatures: Story = {
  args: {
    usedBytes: 8589934592, // 8 GB
    totalBytes: 10737418240, // 10 GB
    fileTypeBreakdown: mockFileTypes,
    showChart: true,
    showRecentActivity: true,
    recentUploads: 156,
    uploadsChange: 42.3,
    onManageStorage: () => alert('Opening storage management...'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Storage quota card with all features enabled: chart, activity, and manage button.',
      },
    },
  },
}
