/**
 * Storage Stats Widget Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { StorageStatsWidget, type StorageStatsData } from './storage-stats-widget'

const meta: Meta<typeof StorageStatsWidget> = {
  title: 'Storage/StorageStatsWidget',
  component: StorageStatsWidget,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#00070F' }] },
  },
  decorators: [(Story) => <div className="w-[500px]"><Story /></div>],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StorageStatsWidget>

const mockData: StorageStatsData = {
  totalFiles: 1247,
  totalSize: 8589934592, // 8 GB
  recentUploads: 156,
  uploadsChange: 24.5,
  topFileTypes: [
    { type: 'images', count: 542, bytes: 3221225472 },
    { type: 'videos', count: 89, bytes: 2147483648 },
    { type: 'documents', count: 412, bytes: 1879048192 },
    { type: 'archives', count: 124, bytes: 1073741824 },
    { type: 'audio', count: 80, bytes: 268435456 },
  ],
  uploadTrend: [
    { date: 'Mon', uploads: 12 },
    { date: 'Tue', uploads: 19 },
    { date: 'Wed', uploads: 15 },
    { date: 'Thu', uploads: 28 },
    { date: 'Fri', uploads: 35 },
    { date: 'Sat', uploads: 22 },
    { date: 'Sun', uploads: 25 },
  ],
}

export const Default: Story = {
  args: { data: mockData },
}

export const WithNavigation: Story = {
  args: {
    data: mockData,
    onNavigate: () => alert('Navigate to storage'),
  },
}

export const PositiveTrend: Story = {
  args: {
    data: { ...mockData, uploadsChange: 42.3 },
  },
}

export const NegativeTrend: Story = {
  args: {
    data: { ...mockData, uploadsChange: -18.7 },
  },
}

export const Compact: Story = {
  args: {
    data: mockData,
    compact: true,
  },
}

export const Loading: Story = {
  args: {
    data: mockData,
    isLoading: true,
  },
}

export const LargeNumbers: Story = {
  args: {
    data: {
      totalFiles: 15420,
      totalSize: 107374182400, // 100 GB
      recentUploads: 2847,
      uploadsChange: 156.2,
      topFileTypes: mockData.topFileTypes,
      uploadTrend: mockData.uploadTrend,
    },
  },
}

export const MinimalData: Story = {
  args: {
    data: {
      totalFiles: 42,
      totalSize: 524288000, // 500 MB
      recentUploads: 8,
      uploadsChange: 0,
      topFileTypes: [
        { type: 'images', count: 30, bytes: 314572800 },
        { type: 'documents', count: 12, bytes: 209715200 },
      ],
      uploadTrend: [],
    },
  },
}
