/**
 * Empty Storage State - Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { EmptyStorageState } from './empty-storage-state'
import { Upload, Search, FolderOpen, Share2, Trash2, Filter } from 'lucide-react'

const meta = {
  title: 'Storage/EmptyStorageState',
  component: EmptyStorageState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Displays a friendly empty state with icon, message, and call-to-action. Used for empty folders, search results, or when no content is available. Automatically provides appropriate messages and icons based on the variant.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['empty', 'search', 'folder'],
      description: 'Type of empty state to display',
      table: {
        defaultValue: { summary: 'empty' },
      },
    },
    title: {
      control: 'text',
      description: 'Custom title (overrides default)',
    },
    description: {
      control: 'text',
      description: 'Optional description text',
    },
    icon: {
      control: false,
      description: 'Custom icon (overrides default)',
    },
    primaryAction: {
      control: false,
      description: 'Primary action button configuration',
    },
    secondaryAction: {
      control: false,
      description: 'Secondary action link configuration',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl p-8 bg-background rounded-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyStorageState>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default empty folder state.
 * Shows "No files yet" message with Upload icon.
 */
export const EmptyFolder: Story = {
  args: {
    variant: 'empty',
  },
}

/**
 * No search results state.
 * Shows "No results found" message with Search icon.
 */
export const NoSearchResults: Story = {
  args: {
    variant: 'search',
  },
}

/**
 * Empty bucket/folder state.
 * Shows "This folder is empty" message with FolderOpen icon.
 */
export const EmptyBucket: Story = {
  args: {
    variant: 'folder',
  },
}

/**
 * Empty state with both primary and secondary actions.
 * Demonstrates the full action layout with button and link.
 */
export const WithActions: Story = {
  args: {
    variant: 'empty',
    primaryAction: {
      label: 'Upload Files',
      onClick: () => console.log('Upload clicked'),
      icon: <Upload size={16} />,
    },
    secondaryAction: {
      label: 'Learn about file storage',
      onClick: () => console.log('Learn more clicked'),
    },
  },
}

/**
 * Empty state with custom icon.
 * Shows how to override the default variant icon.
 */
export const CustomIcon: Story = {
  args: {
    title: 'No shared files',
    description: 'Share files with your team to see them here',
    icon: <Share2 size={48} />,
    primaryAction: {
      label: 'Share Files',
      onClick: () => console.log('Share clicked'),
      icon: <Share2 size={16} />,
    },
  },
}

/**
 * Minimal empty state.
 * Just icon and message, no actions.
 */
export const Minimal: Story = {
  args: {
    variant: 'folder',
    description: undefined,
  },
}

/**
 * All variant states side by side.
 * Compare different empty state variants.
 */
export const AllVariants: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="w-full min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="font-decorative text-3xl text-white mb-8">
          Empty State Variants
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Empty variant */}
          <div className="space-y-4">
            <h3 className="text-lg font-decorative text-white/80">Empty Folder</h3>
            <EmptyStorageState variant="empty" />
          </div>

          {/* Search variant */}
          <div className="space-y-4">
            <h3 className="text-lg font-decorative text-white/80">No Results</h3>
            <EmptyStorageState variant="search" />
          </div>

          {/* Folder variant */}
          <div className="space-y-4">
            <h3 className="text-lg font-decorative text-white/80">Empty Bucket</h3>
            <EmptyStorageState variant="folder" />
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Empty state in a file browser context.
 * Shows realistic usage in a storage interface.
 */
export const InFileBrowser: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="w-full min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-decorative text-3xl text-white mb-2">
              My Documents
            </h1>
            <p className="text-[#C4C8D4] text-sm">
              Home / Documents / Projects
            </p>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            New Folder
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-4 mb-8 p-4 glass-subtle rounded-lg">
          <button className="flex items-center gap-2 px-4 py-2 text-[#C4C8D4] hover:text-white transition-colors">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-[#C4C8D4] hover:text-white transition-colors">
            <Search size={16} />
            Search
          </button>
        </div>

        {/* Empty state */}
        <EmptyStorageState
          variant="folder"
          primaryAction={{
            label: 'Upload Files',
            onClick: () => console.log('Upload'),
            icon: <Upload size={16} />,
          }}
          secondaryAction={{
            label: 'Create Folder',
            onClick: () => console.log('Create folder'),
          }}
        />
      </div>
    </div>
  ),
}

/**
 * Empty search results with action.
 * Shows empty state after a failed search with clear filters option.
 */
export const SearchWithClearAction: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="w-full min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Search bar */}
        <div className="mb-8">
          <div className="flex items-center gap-4 p-4 glass-subtle rounded-lg">
            <Search size={20} className="text-[#C4C8D4]" />
            <input
              type="text"
              placeholder="Search files..."
              value="quarterly-report-2025.pdf"
              readOnly
              className="flex-1 bg-transparent text-white placeholder:text-[#C4C8D4]/50 outline-none"
            />
            <span className="text-[#C4C8D4] text-sm">
              0 results
            </span>
          </div>
        </div>

        {/* Empty state */}
        <EmptyStorageState
          variant="search"
          description="No files match your search. Try different keywords or check your spelling."
          secondaryAction={{
            label: 'Clear search',
            onClick: () => console.log('Clear search'),
          }}
        />
      </div>
    </div>
  ),
}

/**
 * Empty trash state.
 * Custom empty state for trash/deleted items view.
 */
export const EmptyTrash: Story = {
  args: {
    title: 'Trash is empty',
    description: 'Deleted files will appear here. They are permanently deleted after 30 days.',
    icon: <Trash2 size={48} />,
  },
}

/**
 * Multiple states comparison.
 * Shows different empty states in a grid for comparison.
 */
export const StateComparison: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="w-full min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div>
          <h2 className="font-decorative text-3xl text-white mb-8">
            Empty State Comparison
          </h2>
        </div>

        {/* With actions */}
        <div className="space-y-4">
          <h3 className="text-xl font-decorative text-white/90">With Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EmptyStorageState
              variant="empty"
              primaryAction={{
                label: 'Upload Files',
                onClick: () => {},
                icon: <Upload size={16} />,
              }}
              secondaryAction={{
                label: 'Learn more',
                onClick: () => {},
              }}
            />
            <EmptyStorageState
              variant="search"
              secondaryAction={{
                label: 'Clear filters',
                onClick: () => {},
              }}
            />
          </div>
        </div>

        {/* Without actions */}
        <div className="space-y-4">
          <h3 className="text-xl font-decorative text-white/90">Without Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <EmptyStorageState variant="empty" />
            <EmptyStorageState variant="search" />
            <EmptyStorageState variant="folder" />
          </div>
        </div>

        {/* Custom states */}
        <div className="space-y-4">
          <h3 className="text-xl font-decorative text-white/90">Custom States</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EmptyStorageState
              title="No shared files"
              description="Share files with your team"
              icon={<Share2 size={48} />}
            />
            <EmptyStorageState
              title="Trash is empty"
              description="Deleted files appear here"
              icon={<Trash2 size={48} />}
            />
          </div>
        </div>
      </div>
    </div>
  ),
}
