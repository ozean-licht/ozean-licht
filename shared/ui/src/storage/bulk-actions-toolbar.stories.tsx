/**
 * Bulk Actions Toolbar - Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { action } from '@storybook/addon-actions'
import { Share, Archive, Copy, Star } from 'lucide-react'
import { BulkActionsToolbar } from './bulk-actions-toolbar'
import type { StorageFile } from './types'

// Mock StorageFile data
const createMockFile = (
  id: string,
  name: string,
  size: number,
  mimeType: string
): StorageFile => ({
  id,
  name,
  path: `/storage/${name}`,
  size,
  mimeType,
  uploadedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  uploadedBy: 'user@example.com',
  bucket: 'ozean-licht',
  entityScope: 'organization:1',
})

const mockFiles: StorageFile[] = [
  createMockFile('1', 'vacation-photo.jpg', 2500000, 'image/jpeg'),
  createMockFile('2', 'annual-report.pdf', 1200000, 'application/pdf'),
  createMockFile('3', 'tutorial-video.mp4', 45000000, 'video/mp4'),
  createMockFile('4', 'podcast-episode.mp3', 8500000, 'audio/mpeg'),
  createMockFile('5', 'project-files.zip', 12000000, 'application/zip'),
  createMockFile('6', 'presentation.pptx', 3500000, 'application/vnd.openxmlformats-officedocument.presentationml.presentation'),
  createMockFile('7', 'data-backup.tar.gz', 25000000, 'application/gzip'),
  createMockFile('8', 'design-mockup.fig', 5600000, 'application/octet-stream'),
  createMockFile('9', 'meeting-notes.docx', 450000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
  createMockFile('10', 'logo.svg', 125000, 'image/svg+xml'),
  createMockFile('11', 'screenshot-2025.png', 890000, 'image/png'),
  createMockFile('12', 'budget-2025.xlsx', 780000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
]

const meta = {
  title: 'Storage/BulkActionsToolbar',
  component: BulkActionsToolbar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Multi-select operations toolbar that appears when files are selected. Provides quick access to bulk actions like download, move, and delete. Features a glassmorphic design with Ozean Licht branding, loading states, and support for custom actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectedFiles: {
      description: 'Array of selected StorageFile objects',
    },
    onDownloadAll: {
      description: 'Callback when download all button is clicked',
      action: 'download-all',
    },
    onDeleteSelected: {
      description: 'Callback when delete button is clicked',
      action: 'delete-selected',
    },
    onMoveSelected: {
      description: 'Callback when move button is clicked',
      action: 'move-selected',
    },
    onClearSelection: {
      description: 'Callback when clear selection button is clicked',
      action: 'clear-selection',
    },
    onSelectAll: {
      description: 'Callback when "Select all" link is clicked',
      action: 'select-all',
    },
    customActions: {
      description: 'Additional custom action buttons',
    },
    totalFiles: {
      control: 'number',
      description: 'Total number of files available (for "Select all" button)',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state that disables all actions',
    },
  },
} satisfies Meta<typeof BulkActionsToolbar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Single file selected - Shows minimal toolbar with singular "item" text.
 */
export const SingleFile: Story = {
  args: {
    selectedFiles: [mockFiles[0]],
    onDownloadAll: action('download-all'),
    onDeleteSelected: action('delete-selected'),
    onMoveSelected: action('move-selected'),
    onClearSelection: action('clear-selection'),
  },
  render: (args) => (
    <div className="flex flex-col gap-6 p-6 min-h-[200px]">
      <div className="text-center mb-2">
        <h3 className="font-decorative text-xl text-white mb-1">Single File Selected</h3>
        <p className="text-sm text-[#C4C8D4]">
          Toolbar shows "1 item selected" with all actions available
        </p>
      </div>
      <BulkActionsToolbar {...args} />
    </div>
  ),
}

/**
 * Multiple files selected (3-5) - Common use case for bulk operations.
 */
export const MultipleFiles: Story = {
  args: {
    selectedFiles: mockFiles.slice(0, 4),
    onDownloadAll: action('download-all'),
    onDeleteSelected: action('delete-selected'),
    onMoveSelected: action('move-selected'),
    onClearSelection: action('clear-selection'),
    totalFiles: 12,
    onSelectAll: action('select-all'),
  },
  render: (args) => (
    <div className="flex flex-col gap-6 p-6 min-h-[200px]">
      <div className="text-center mb-2">
        <h3 className="font-decorative text-xl text-white mb-1">Multiple Files Selected</h3>
        <p className="text-sm text-[#C4C8D4]">
          4 of 12 files selected - "Select all 12" button is shown
        </p>
      </div>
      <BulkActionsToolbar {...args} />
    </div>
  ),
}

/**
 * Many files selected (10+) - Shows toolbar handles large selections gracefully.
 */
export const ManyFiles: Story = {
  args: {
    selectedFiles: mockFiles.slice(0, 10),
    onDownloadAll: action('download-all'),
    onDeleteSelected: action('delete-selected'),
    onMoveSelected: action('move-selected'),
    onClearSelection: action('clear-selection'),
    totalFiles: 12,
    onSelectAll: action('select-all'),
  },
  render: (args) => (
    <div className="flex flex-col gap-6 p-6 min-h-[200px]">
      <div className="text-center mb-2">
        <h3 className="font-decorative text-xl text-white mb-1">Many Files Selected</h3>
        <p className="text-sm text-[#C4C8D4]">
          10 of 12 files selected - Shows "Select all 12" option
        </p>
      </div>
      <BulkActionsToolbar {...args} />
    </div>
  ),
}

/**
 * All files selected - "Select all" button is hidden when all files are selected.
 */
export const AllFilesSelected: Story = {
  args: {
    selectedFiles: mockFiles,
    onDownloadAll: action('download-all'),
    onDeleteSelected: action('delete-selected'),
    onMoveSelected: action('move-selected'),
    onClearSelection: action('clear-selection'),
    totalFiles: 12,
    onSelectAll: action('select-all'),
  },
  render: (args) => (
    <div className="flex flex-col gap-6 p-6 min-h-[200px]">
      <div className="text-center mb-2">
        <h3 className="font-decorative text-xl text-white mb-1">All Files Selected</h3>
        <p className="text-sm text-[#C4C8D4]">
          12 of 12 files selected - "Select all" button is hidden
        </p>
      </div>
      <BulkActionsToolbar {...args} />
    </div>
  ),
}

/**
 * With custom actions - Demonstrates extensibility with additional action buttons.
 */
export const WithCustomActions: Story = {
  args: {
    selectedFiles: mockFiles.slice(0, 3),
    onDownloadAll: action('download-all'),
    onDeleteSelected: action('delete-selected'),
    onMoveSelected: action('move-selected'),
    onClearSelection: action('clear-selection'),
    customActions: [
      {
        id: 'share',
        label: 'Share',
        icon: Share,
        onClick: (files: StorageFile[]) => action('share-files')(files),
      },
      {
        id: 'archive',
        label: 'Archive',
        icon: Archive,
        onClick: (files: StorageFile[]) => action('archive-files')(files),
      },
      {
        id: 'copy',
        label: 'Copy',
        icon: Copy,
        onClick: (files: StorageFile[]) => action('copy-files')(files),
      },
      {
        id: 'favorite',
        label: 'Add to Favorites',
        icon: Star,
        onClick: (files: StorageFile[]) => action('favorite-files')(files),
      },
    ],
  },
  render: (args) => (
    <div className="flex flex-col gap-6 p-6 min-h-[200px]">
      <div className="text-center mb-2">
        <h3 className="font-decorative text-xl text-white mb-1">Custom Actions</h3>
        <p className="text-sm text-[#C4C8D4]">
          Toolbar extended with Share, Archive, Copy, and Favorite actions
        </p>
      </div>
      <BulkActionsToolbar {...args} />
    </div>
  ),
}

/**
 * Loading state - All actions are disabled when isLoading is true.
 */
export const LoadingState: Story = {
  args: {
    selectedFiles: mockFiles.slice(0, 3),
    onDownloadAll: action('download-all'),
    onDeleteSelected: action('delete-selected'),
    onMoveSelected: action('move-selected'),
    onClearSelection: action('clear-selection'),
    isLoading: true,
  },
  render: (args) => (
    <div className="flex flex-col gap-6 p-6 min-h-[200px]">
      <div className="text-center mb-2">
        <h3 className="font-decorative text-xl text-white mb-1">Loading State</h3>
        <p className="text-sm text-[#C4C8D4]">
          All actions are disabled during operation
        </p>
      </div>
      <BulkActionsToolbar {...args} />
    </div>
  ),
}

/**
 * Without delete action - Shows toolbar without destructive operations.
 */
export const WithoutDeleteAction: Story = {
  args: {
    selectedFiles: mockFiles.slice(0, 3),
    onDownloadAll: action('download-all'),
    onMoveSelected: action('move-selected'),
    onClearSelection: action('clear-selection'),
    // onDeleteSelected is intentionally omitted
  },
  render: (args) => (
    <div className="flex flex-col gap-6 p-6 min-h-[200px]">
      <div className="text-center mb-2">
        <h3 className="font-decorative text-xl text-white mb-1">Without Delete Action</h3>
        <p className="text-sm text-[#C4C8D4]">
          Delete button is hidden when onDeleteSelected is not provided
        </p>
      </div>
      <BulkActionsToolbar {...args} />
    </div>
  ),
}

/**
 * Minimal actions (download only) - Shows toolbar with only essential actions.
 */
export const MinimalActions: Story = {
  args: {
    selectedFiles: mockFiles.slice(0, 3),
    onDownloadAll: action('download-all'),
    onClearSelection: action('clear-selection'),
    // onDeleteSelected and onMoveSelected are intentionally omitted
  },
  render: (args) => (
    <div className="flex flex-col gap-6 p-6 min-h-[200px]">
      <div className="text-center mb-2">
        <h3 className="font-decorative text-xl text-white mb-1">Minimal Actions</h3>
        <p className="text-sm text-[#C4C8D4]">
          Only download action available - useful for read-only views
        </p>
      </div>
      <BulkActionsToolbar {...args} />
    </div>
  ),
}

/**
 * Interactive demo - Full interactive example with state management.
 */
export const InteractiveDemo: Story = {
  render: () => {
    const [selectedFiles, setSelectedFiles] = useState<StorageFile[]>([mockFiles[0]])
    const [isLoading, setIsLoading] = useState(false)

    const handleDownloadAll = async () => {
      action('download-all')()
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsLoading(false)
    }

    const handleDeleteSelected = async () => {
      action('delete-selected')()
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsLoading(false)
      setSelectedFiles([])
    }

    const handleMoveSelected = async () => {
      action('move-selected')()
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsLoading(false)
    }

    const handleClearSelection = () => {
      action('clear-selection')()
      setSelectedFiles([])
    }

    const handleSelectAll = () => {
      action('select-all')()
      setSelectedFiles(mockFiles)
    }

    return (
      <div className="flex flex-col gap-6 p-6 min-h-[400px]">
        <div className="text-center mb-2">
          <h3 className="font-decorative text-2xl text-white mb-2">Interactive Demo</h3>
          <p className="text-sm text-[#C4C8D4] mb-4">
            Select files below to see the toolbar in action. Actions have simulated loading states.
          </p>
        </div>

        {/* Toolbar */}
        <BulkActionsToolbar
          selectedFiles={selectedFiles}
          onDownloadAll={handleDownloadAll}
          onDeleteSelected={handleDeleteSelected}
          onMoveSelected={handleMoveSelected}
          onClearSelection={handleClearSelection}
          onSelectAll={handleSelectAll}
          totalFiles={mockFiles.length}
          isLoading={isLoading}
        />

        {/* File list for selection */}
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="border-b border-[#0E282E] p-3 bg-card/20">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">Files</h4>
              <div className="text-xs text-[#C4C8D4]">
                {selectedFiles.length} of {mockFiles.length} selected
              </div>
            </div>
          </div>
          <div className="divide-y divide-[#0E282E]/50">
            {mockFiles.slice(0, 6).map((file) => {
              const isSelected = selectedFiles.some((f) => f.id === file.id)
              return (
                <label
                  key={file.id}
                  className="flex items-center gap-3 p-3 hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles([...selectedFiles, file])
                      } else {
                        setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id))
                      }
                    }}
                    disabled={isLoading}
                    className="w-4 h-4 rounded border-[#0E282E] bg-card/30 text-primary focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm text-white truncate">{file.name}</span>
                    <span className="text-xs text-[#C4C8D4]">
                      {(file.size / 1000000).toFixed(2)} MB
                    </span>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Info panel */}
        <div className="glass-card rounded-lg p-4">
          <h5 className="text-sm font-medium text-white mb-2">Try these actions:</h5>
          <ul className="text-sm text-[#C4C8D4] space-y-1 list-disc list-inside">
            <li>Select files using checkboxes</li>
            <li>Click "Select all {mockFiles.length}" to select all files</li>
            <li>Try Download, Move, or Delete (simulated with 1.5-2s loading)</li>
            <li>Click Clear or X to deselect all</li>
          </ul>
        </div>
      </div>
    )
  },
}

/**
 * Responsive behavior - Shows how toolbar adapts on smaller screens.
 * Action labels are hidden on mobile, showing only icons.
 */
export const ResponsiveBehavior: Story = {
  args: {
    selectedFiles: mockFiles.slice(0, 3),
    onDownloadAll: action('download-all'),
    onDeleteSelected: action('delete-selected'),
    onMoveSelected: action('move-selected'),
    onClearSelection: action('clear-selection'),
    customActions: [
      {
        id: 'share',
        label: 'Share',
        icon: Share,
        onClick: (files: StorageFile[]) => action('share-files')(files),
      },
    ],
  },
  render: (args) => (
    <div className="flex flex-col gap-6 p-6">
      <div className="text-center mb-2">
        <h3 className="font-decorative text-xl text-white mb-2">Responsive Design</h3>
        <p className="text-sm text-[#C4C8D4] mb-4">
          Action labels hide on small screens (using <code className="text-primary">hidden sm:inline</code>)
        </p>
      </div>

      {/* Desktop view */}
      <div>
        <div className="text-xs text-[#C4C8D4] mb-2 uppercase tracking-wide">Desktop View</div>
        <div className="min-w-[640px]">
          <BulkActionsToolbar {...args} />
        </div>
      </div>

      {/* Mobile view */}
      <div>
        <div className="text-xs text-[#C4C8D4] mb-2 uppercase tracking-wide">Mobile View (&lt; 640px)</div>
        <div className="max-w-[375px]">
          <BulkActionsToolbar {...args} />
        </div>
      </div>
    </div>
  ),
}

/**
 * Empty state - Returns null when no files are selected.
 * This is the default state before any selection is made.
 */
export const EmptyState: Story = {
  args: {
    selectedFiles: [],
    onDownloadAll: action('download-all'),
    onDeleteSelected: action('delete-selected'),
    onClearSelection: action('clear-selection'),
  },
  render: (args) => (
    <div className="flex flex-col gap-6 p-6 min-h-[200px]">
      <div className="text-center mb-2">
        <h3 className="font-decorative text-xl text-white mb-1">Empty State</h3>
        <p className="text-sm text-[#C4C8D4]">
          Component returns null when no files are selected
        </p>
      </div>
      <BulkActionsToolbar {...args} />
      <div className="glass-card rounded-lg p-8 text-center">
        <p className="text-[#C4C8D4] text-sm">No toolbar visible above - as expected!</p>
      </div>
    </div>
  ),
}
