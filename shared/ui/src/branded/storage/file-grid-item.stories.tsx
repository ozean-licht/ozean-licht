/**
 * File Grid Item - Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { FileGridItem } from './file-grid-item'
import React from 'react'

const meta = {
  title: 'Storage/FileGridItem',
  component: FileGridItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Display a file as a card with large icon/thumbnail, metadata, and interactive elements. Optimized for grid view with glass-card styling and Ozean Licht branding.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    file: {
      description: 'File object with id, name, size, modified date, and optional metadata',
    },
    isSelected: {
      control: 'boolean',
      description: 'Whether the file is selected',
    },
    showCheckbox: {
      control: 'boolean',
      description: 'Whether to show the selection checkbox',
    },
    onSelect: {
      action: 'selected',
      description: 'Callback when file is selected',
    },
    onAction: {
      action: 'action',
      description: 'Callback for action buttons (download, preview, delete)',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when card is clicked',
    },
  },
} satisfies Meta<typeof FileGridItem>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default file card with basic metadata
 */
export const Default: Story = {
  args: {
    file: {
      id: '1',
      name: 'vacation-photo.jpg',
      size: 2500000, // 2.5 MB
      modified: new Date('2025-01-15T10:30:00'),
      mimeType: 'image/jpeg',
    },
    showCheckbox: true,
  },
}

/**
 * Selected state with checkbox checked
 */
export const Selected: Story = {
  args: {
    file: {
      id: '2',
      name: 'important-document.pdf',
      size: 1200000, // 1.2 MB
      modified: new Date('2025-01-20T14:45:00'),
      mimeType: 'application/pdf',
    },
    isSelected: true,
    showCheckbox: true,
  },
}

/**
 * File with thumbnail image preview
 */
export const WithThumbnail: Story = {
  args: {
    file: {
      id: '3',
      name: 'beach-sunset.jpg',
      size: 3500000, // 3.5 MB
      modified: new Date('2025-01-18T16:20:00'),
      mimeType: 'image/jpeg',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
    },
    showCheckbox: true,
  },
}

/**
 * Folder card (no size, folder icon)
 */
export const Folder: Story = {
  args: {
    file: {
      id: '4',
      name: 'Documents',
      size: 0,
      modified: new Date('2025-01-22T09:15:00'),
      isFolder: true,
    },
    showCheckbox: true,
  },
}

/**
 * Large file with formatted size
 */
export const LargeFile: Story = {
  args: {
    file: {
      id: '5',
      name: 'project-video.mp4',
      size: 45000000, // 45 MB
      modified: new Date('2025-01-19T11:00:00'),
      mimeType: 'video/mp4',
    },
    showCheckbox: true,
  },
}

/**
 * File with very long name (tests truncation)
 */
export const LongFileName: Story = {
  args: {
    file: {
      id: '6',
      name: 'this-is-a-very-long-file-name-that-should-be-truncated-to-two-lines-maximum.txt',
      size: 15000, // 15 KB
      modified: new Date('2025-01-21T13:30:00'),
      mimeType: 'text/plain',
    },
    showCheckbox: true,
  },
}

/**
 * Grid layout - 3x3 grid of mixed files
 */
export const GridLayout: Story = {
  render: () => {
    const files = [
      {
        id: '1',
        name: 'vacation.jpg',
        size: 2500000,
        modified: new Date('2025-01-15T10:30:00'),
        mimeType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      },
      {
        id: '2',
        name: 'report.pdf',
        size: 1200000,
        modified: new Date('2025-01-20T14:45:00'),
        mimeType: 'application/pdf',
      },
      {
        id: '3',
        name: 'Documents',
        size: 0,
        modified: new Date('2025-01-22T09:15:00'),
        isFolder: true,
      },
      {
        id: '4',
        name: 'presentation.pptx',
        size: 8500000,
        modified: new Date('2025-01-18T16:20:00'),
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      },
      {
        id: '5',
        name: 'video.mp4',
        size: 45000000,
        modified: new Date('2025-01-19T11:00:00'),
        mimeType: 'video/mp4',
      },
      {
        id: '6',
        name: 'song.mp3',
        size: 8500000,
        modified: new Date('2025-01-21T13:30:00'),
        mimeType: 'audio/mpeg',
      },
      {
        id: '7',
        name: 'mountain.jpg',
        size: 3200000,
        modified: new Date('2025-01-17T08:45:00'),
        mimeType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&h=400&fit=crop',
      },
      {
        id: '8',
        name: 'archive.zip',
        size: 12000000,
        modified: new Date('2025-01-16T15:20:00'),
        mimeType: 'application/zip',
      },
      {
        id: '9',
        name: 'script.ts',
        size: 45000,
        modified: new Date('2025-01-23T10:00:00'),
        mimeType: 'text/typescript',
      },
    ]

    const [selectedIds, setSelectedIds] = React.useState<string[]>(['2', '5'])

    return (
      <div className="p-6 max-w-6xl">
        <h3 className="font-decorative text-2xl text-white mb-4">File Grid</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <FileGridItem
              key={file.id}
              file={file}
              isSelected={selectedIds.includes(file.id)}
              onSelect={(id) => {
                setSelectedIds((prev) =>
                  prev.includes(id)
                    ? prev.filter((selectedId) => selectedId !== id)
                    : [...prev, id]
                )
              }}
              onAction={(action, fileId) => {
                console.log(`Action: ${action} on file ${fileId}`)
              }}
              onClick={(id) => {
                console.log(`Clicked file: ${id}`)
              }}
            />
          ))}
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          Selected: {selectedIds.length} file(s)
        </div>
      </div>
    )
  },
}

/**
 * Responsive grid - shows 1 col mobile, 2 tablet, 3-4 desktop
 */
export const ResponsiveGrid: Story = {
  render: () => {
    const files = [
      {
        id: '1',
        name: 'beach.jpg',
        size: 2500000,
        modified: new Date(),
        thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
      },
      {
        id: '2',
        name: 'mountain.jpg',
        size: 3200000,
        modified: new Date(),
        thumbnailUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&h=400&fit=crop',
      },
      {
        id: '3',
        name: 'forest.jpg',
        size: 2800000,
        modified: new Date(),
        thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=400&fit=crop',
      },
      {
        id: '4',
        name: 'city.jpg',
        size: 3500000,
        modified: new Date(),
        thumbnailUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
      },
    ]

    return (
      <div className="p-6 w-full max-w-7xl">
        <h3 className="font-decorative text-2xl text-white mb-4">
          Responsive Grid Layout
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Resize browser: 1 col mobile → 2 cols tablet → 3 cols desktop → 4 cols wide
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => (
            <FileGridItem key={file.id} file={file} showCheckbox />
          ))}
        </div>
      </div>
    )
  },
}

/**
 * Without checkboxes
 */
export const WithoutCheckboxes: Story = {
  render: () => {
    const files = [
      {
        id: '1',
        name: 'photo.jpg',
        size: 2500000,
        modified: new Date(),
        thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      },
      {
        id: '2',
        name: 'document.pdf',
        size: 1200000,
        modified: new Date(),
      },
      {
        id: '3',
        name: 'video.mp4',
        size: 45000000,
        modified: new Date(),
      },
    ]

    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file) => (
            <FileGridItem
              key={file.id}
              file={file}
              showCheckbox={false}
              onClick={(id) => console.log('Clicked:', id)}
            />
          ))}
        </div>
      </div>
    )
  },
}

/**
 * Interactive demo with all actions
 */
export const Interactive: Story = {
  render: () => {
    const [selectedId, setSelectedId] = React.useState<string | null>(null)
    const [lastAction, setLastAction] = React.useState<string>('')

    const file = {
      id: 'interactive-1',
      name: 'sample-document.pdf',
      size: 2500000,
      modified: new Date('2025-01-20T14:30:00'),
      mimeType: 'application/pdf',
    }

    return (
      <div className="p-6 flex flex-col gap-6">
        <div className="max-w-xs">
          <FileGridItem
            file={file}
            isSelected={selectedId === file.id}
            onSelect={(id) => {
              setSelectedId(selectedId === id ? null : id)
              setLastAction('Selection toggled')
            }}
            onAction={(action, fileId) => {
              setLastAction(`${action} on ${fileId}`)
            }}
            onClick={(id) => {
              setLastAction(`Clicked card: ${id}`)
            }}
          />
        </div>

        <div className="glass-card rounded-lg p-4 max-w-md">
          <h4 className="text-sm font-medium text-white mb-2">Interaction Log</h4>
          <p className="text-sm text-muted-foreground">
            {lastAction || 'Try clicking the card, checkbox, or hover to see action buttons'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Selected: {selectedId ? 'Yes' : 'No'}
          </p>
        </div>
      </div>
    )
  },
}

/**
 * Different file types showcase
 */
export const FileTypes: Story = {
  render: () => {
    const files = [
      { id: '1', name: 'photo.jpg', size: 2500000, mimeType: 'image/jpeg' },
      { id: '2', name: 'document.pdf', size: 1200000, mimeType: 'application/pdf' },
      { id: '3', name: 'video.mp4', size: 45000000, mimeType: 'video/mp4' },
      { id: '4', name: 'song.mp3', size: 8500000, mimeType: 'audio/mpeg' },
      { id: '5', name: 'archive.zip', size: 12000000, mimeType: 'application/zip' },
      { id: '6', name: 'code.tsx', size: 45000, mimeType: 'text/typescript' },
      { id: '7', name: 'presentation.pptx', size: 8500000, mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
      { id: '8', name: 'spreadsheet.xlsx', size: 2300000, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    ].map(f => ({ ...f, modified: new Date() }))

    return (
      <div className="p-6">
        <h3 className="font-decorative text-2xl text-white mb-4">
          Different File Types
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file) => (
            <FileGridItem
              key={file.id}
              file={file}
              showCheckbox={false}
            />
          ))}
        </div>
      </div>
    )
  },
}
