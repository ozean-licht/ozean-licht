/**
 * Storage Search Bar Stories
 * Storybook stories for the Storage Search Bar component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { StorageSearchBar } from './storage-search-bar'
import type { FileFilter } from './types'

const meta: Meta<typeof StorageSearchBar> = {
  title: 'Storage/Phase 3/StorageSearchBar',
  component: StorageSearchBar,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#00070F' }],
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StorageSearchBar>

function SearchBarWrapper(props: Partial<React.ComponentProps<typeof StorageSearchBar>>) {
  const [value, setValue] = useState('')
  const [filters, setFilters] = useState<FileFilter>({})

  return (
    <div className="p-8 space-y-4">
      <StorageSearchBar
        value={value}
        onChange={setValue}
        filters={filters}
        onFiltersChange={setFilters}
        {...props}
      />
      <div className="glass-card rounded-lg p-4 text-sm">
        <h4 className="text-white font-medium mb-2">Current State:</h4>
        <pre className="text-[#C4C8D4] font-mono text-xs">
          {JSON.stringify({ value, filters }, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <SearchBarWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Default search bar with filter button and CMD+K shortcut.',
      },
    },
  },
}

export const WithPlaceholder: Story = {
  render: () => <SearchBarWrapper placeholder="Search your cloud storage..." />,
}

export const WithoutFilterButton: Story = {
  render: () => <SearchBarWrapper showFilterButton={false} />,
  parameters: {
    docs: {
      description: {
        story: 'Simple search bar without advanced filter button.',
      },
    },
  },
}

export const WithActiveFilters: Story = {
  render: () => {
    const [value, setValue] = useState('ocean')
    const [filters, setFilters] = useState<FileFilter>({
      fileType: 'image',
      sizeRange: { min: 1048576, max: 10485760 },
    })

    return (
      <div className="p-8">
        <StorageSearchBar
          value={value}
          onChange={setValue}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Search bar with active filters showing filter badges.',
      },
    },
  },
}

export const WithDateRange: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [filters, setFilters] = useState<FileFilter>({
      dateRange: {
        from: new Date('2024-11-01'),
        to: new Date('2024-11-30'),
      },
    })

    return (
      <div className="p-8">
        <StorageSearchBar
          value={value}
          onChange={setValue}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>
    )
  },
}

export const AllFiltersActive: Story = {
  render: () => {
    const [value, setValue] = useState('document')
    const [filters, setFilters] = useState<FileFilter>({
      fileType: 'document',
      sizeRange: { min: 10485760, max: 104857600 },
      dateRange: {
        from: new Date('2024-10-01'),
        to: new Date('2024-11-30'),
      },
    })

    return (
      <div className="p-8">
        <StorageSearchBar
          value={value}
          onChange={setValue}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Search bar with all filter types active simultaneously.',
      },
    },
  },
}

export const CustomFileTypes: Story = {
  render: () => {
    const customTypes = [
      { label: 'All Files', value: '' },
      { label: 'Photos', value: 'photo' },
      { label: 'Music', value: 'music' },
      { label: 'Backups', value: 'backup' },
      { label: 'Projects', value: 'project' },
    ]

    return <SearchBarWrapper fileTypeOptions={customTypes} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Search bar with custom file type options.',
      },
    },
  },
}
