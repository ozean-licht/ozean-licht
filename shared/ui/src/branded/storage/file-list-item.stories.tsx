/**
 * File List Item - Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { FileListItem } from './file-list-item'
import { fn } from '@storybook/test'

const meta = {
  title: 'Storage/FileListItem',
  component: FileListItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Displays a single file as a table row with icon, name, size, date, and actions. Includes checkbox for multi-select, action buttons on hover, and glass-card effect. Responsive: hides date column on mobile.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    file: {
      control: 'object',
      description: 'File data to display',
    },
    isSelected: {
      control: 'boolean',
      description: 'Whether the file is selected',
    },
    showCheckbox: {
      control: 'boolean',
      description: 'Whether to show the checkbox',
    },
    onSelect: {
      action: 'selected',
      description: 'Callback when selection changes',
    },
    onAction: {
      action: 'action',
      description: 'Callback when an action is triggered',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when the row is clicked',
    },
  },
  // Wrap in a table to provide proper context
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <table className="w-full glass-card rounded-lg overflow-hidden">
          <thead>
            <tr className="border-b border-[#0E282E]">
              <th className="text-left p-3 text-sm font-normal text-[#C4C8D4]"></th>
              <th className="text-left p-3 text-sm font-normal text-[#C4C8D4]">Name</th>
              <th className="text-left p-3 text-sm font-normal text-[#C4C8D4]">Size</th>
              <th className="text-left p-3 text-sm font-normal text-[#C4C8D4] hidden md:table-cell">
                Modified
              </th>
              <th className="text-right p-3 text-sm font-normal text-[#C4C8D4]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <Story />
          </tbody>
        </table>
      </div>
    ),
  ],
} satisfies Meta<typeof FileListItem>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default file item
 */
export const Default: Story = {
  args: {
    file: {
      id: '1',
      name: 'vacation-photo.jpg',
      size: 2500000,
      modified: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      mimeType: 'image/jpeg',
    },
    onSelect: fn(),
    onAction: fn(),
    onClick: fn(),
  },
}

/**
 * Selected file with checkbox
 */
export const Selected: Story = {
  args: {
    file: {
      id: '2',
      name: 'presentation.pdf',
      size: 1200000,
      modified: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      mimeType: 'application/pdf',
    },
    isSelected: true,
    showCheckbox: true,
    onSelect: fn(),
    onAction: fn(),
    onClick: fn(),
  },
}

/**
 * Folder item
 */
export const Folder: Story = {
  args: {
    file: {
      id: '3',
      name: 'Documents',
      size: 0,
      modified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      isFolder: true,
    },
    showCheckbox: true,
    onSelect: fn(),
    onAction: fn(),
    onClick: fn(),
  },
}

/**
 * File with hover actions visible (simulated)
 */
export const WithActions: Story = {
  args: {
    file: {
      id: '4',
      name: 'video-tutorial.mp4',
      size: 45000000,
      modified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      mimeType: 'video/mp4',
    },
    showCheckbox: true,
    onSelect: fn(),
    onAction: fn(),
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover over the row to see action buttons (download, delete, more). On mobile, only the "More" button is visible.',
      },
    },
  },
}

/**
 * Multiple files in list view
 */
export const ListView: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Example of multiple FileListItem components in a complete table. Hover over rows to see action buttons. First item (Documents) is a folder, second item (vacation photo) is selected.',
      },
    },
  },
  decorators: [],
  render: () => (
    <div className="w-full max-w-4xl">
      <div className="glass-card rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#0E282E]">
              <th className="text-left p-3 text-sm font-normal text-[#C4C8D4] w-12"></th>
              <th className="text-left p-3 text-sm font-normal text-[#C4C8D4]">Name</th>
              <th className="text-left p-3 text-sm font-normal text-[#C4C8D4]">Size</th>
              <th className="text-left p-3 text-sm font-normal text-[#C4C8D4] hidden md:table-cell">
                Modified
              </th>
              <th className="text-right p-3 text-sm font-normal text-[#C4C8D4]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <FileListItem
              file={{
                id: '1',
                name: 'Documents',
                size: 0,
                modified: new Date(Date.now() - 1 * 60 * 60 * 1000),
                isFolder: true,
              }}
              showCheckbox
              onSelect={fn()}
              onAction={fn()}
              onClick={fn()}
            />
            <FileListItem
              file={{
                id: '2',
                name: 'vacation-2025.jpg',
                size: 2500000,
                modified: new Date(Date.now() - 2 * 60 * 60 * 1000),
                mimeType: 'image/jpeg',
              }}
              isSelected
              showCheckbox
              onSelect={fn()}
              onAction={fn()}
              onClick={fn()}
            />
            <FileListItem
              file={{
                id: '3',
                name: 'report.pdf',
                size: 1200000,
                modified: new Date(Date.now() - 24 * 60 * 60 * 1000),
                mimeType: 'application/pdf',
              }}
              showCheckbox
              onSelect={fn()}
              onAction={fn()}
              onClick={fn()}
            />
            <FileListItem
              file={{
                id: '4',
                name: 'video-tutorial.mp4',
                size: 45000000,
                modified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                mimeType: 'video/mp4',
              }}
              showCheckbox
              onSelect={fn()}
              onAction={fn()}
              onClick={fn()}
            />
            <FileListItem
              file={{
                id: '5',
                name: 'song.mp3',
                size: 8500000,
                modified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                mimeType: 'audio/mpeg',
              }}
              showCheckbox
              onSelect={fn()}
              onAction={fn()}
              onClick={fn()}
            />
            <FileListItem
              file={{
                id: '6',
                name: 'project-files.zip',
                size: 15000000,
                modified: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                mimeType: 'application/zip',
              }}
              showCheckbox
              onSelect={fn()}
              onAction={fn()}
              onClick={fn()}
            />
          </tbody>
        </table>
      </div>
    </div>
  ),
}

/**
 * Various file types
 */
export const VariousFileTypes: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Showcase of various file types with different icons and sizes.',
      },
    },
  },
  decorators: [],
  render: () => (
    <div className="w-full max-w-4xl">
      <div className="glass-card rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#0E282E]">
              <th className="text-left p-3 text-sm font-normal text-[#C4C8D4]">Name</th>
              <th className="text-left p-3 text-sm font-normal text-[#C4C8D4]">Size</th>
              <th className="text-left p-3 text-sm font-normal text-[#C4C8D4] hidden md:table-cell">
                Modified
              </th>
              <th className="text-right p-3 text-sm font-normal text-[#C4C8D4]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'photo.jpg', size: 2500000, mimeType: 'image/jpeg' },
              { name: 'document.pdf', size: 1200000, mimeType: 'application/pdf' },
              { name: 'video.mp4', size: 45000000, mimeType: 'video/mp4' },
              { name: 'archive.zip', size: 15000000, mimeType: 'application/zip' },
              { name: 'audio.mp3', size: 8500000, mimeType: 'audio/mpeg' },
              { name: 'code.tsx', size: 5000, mimeType: 'text/plain' },
              { name: 'README.md', size: 2000, mimeType: 'text/markdown' },
              {
                name: 'spreadsheet.xlsx',
                size: 500000,
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              },
            ].map((file, index) => (
              <FileListItem
                key={index}
                file={{
                  id: `file-${index}`,
                  name: file.name,
                  size: file.size,
                  modified: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
                  mimeType: file.mimeType,
                }}
                onSelect={fn()}
                onAction={fn()}
                onClick={fn()}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
}
