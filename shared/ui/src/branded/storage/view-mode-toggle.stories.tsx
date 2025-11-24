/**
 * View Mode Toggle - Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ViewModeToggle } from './view-mode-toggle'
import { FileTypeIcon } from './file-type-icon'

const meta = {
  title: 'Storage/ViewModeToggle',
  component: ViewModeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Toggle button group for switching between list and grid view modes. Includes localStorage persistence, keyboard navigation (Tab, Enter, Space), and tooltips for accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'select',
      options: ['list', 'grid'],
      description: 'Current view mode (controlled)',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when view mode changes',
    },
    storageKey: {
      control: 'text',
      description: 'localStorage key for persistence',
    },
  },
} satisfies Meta<typeof ViewModeToggle>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default uncontrolled mode with localStorage persistence.
 * Selection is automatically saved and restored.
 */
export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="flex flex-col gap-4 p-6">
      <div className="text-center mb-2">
        <h3 className="font-decorative text-xl text-white mb-1">View Mode Toggle</h3>
        <p className="text-sm text-[#C4C8D4]">
          Selection persists to localStorage (key: 'storage-view-mode')
        </p>
      </div>
      <ViewModeToggle {...args} />
    </div>
  ),
}

/**
 * Controlled mode with external state management.
 * Useful when you need to sync view mode with other UI elements.
 */
export const Controlled: Story = {
  render: () => {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="text-center">
          <h3 className="font-decorative text-xl text-white mb-1">Controlled Mode</h3>
          <p className="text-sm text-[#C4C8D4] mb-4">
            Current mode: <span className="text-primary font-medium">{viewMode}</span>
          </p>
          <ViewModeToggle value={viewMode} onChange={setViewMode} />
        </div>

        {/* Example content that changes based on view mode */}
        <div className="glass-card rounded-lg p-4 max-w-2xl">
          <div className="text-sm text-[#C4C8D4] mb-3">Preview:</div>
          {viewMode === 'list' ? (
            <div className="space-y-2">
              {['document.pdf', 'photo.jpg', 'video.mp4'].map((file) => (
                <div
                  key={file}
                  className="flex items-center gap-3 p-2 bg-card/30 rounded hover:bg-card/50 transition-colors"
                >
                  <FileTypeIcon filename={file} size="sm" />
                  <span className="text-sm text-white">{file}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {['document.pdf', 'photo.jpg', 'video.mp4'].map((file) => (
                <div
                  key={file}
                  className="flex flex-col items-center gap-2 p-3 bg-card/30 rounded hover:bg-card/50 transition-colors"
                >
                  <FileTypeIcon filename={file} size="xl" />
                  <span className="text-xs text-white text-center truncate w-full">
                    {file}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  },
}

/**
 * Active list view mode.
 */
export const ListMode: Story = {
  args: {
    value: 'list',
  },
  render: (args) => (
    <div className="flex flex-col gap-4 p-6">
      <div className="text-center mb-2">
        <h3 className="font-decorative text-xl text-white mb-1">List View Active</h3>
        <p className="text-sm text-[#C4C8D4]">Toggle shows list view selected</p>
      </div>
      <ViewModeToggle {...args} />
    </div>
  ),
}

/**
 * Active grid view mode.
 */
export const GridMode: Story = {
  args: {
    value: 'grid',
  },
  render: (args) => (
    <div className="flex flex-col gap-4 p-6">
      <div className="text-center mb-2">
        <h3 className="font-decorative text-xl text-white mb-1">Grid View Active</h3>
        <p className="text-sm text-[#C4C8D4]">Toggle shows grid view selected</p>
      </div>
      <ViewModeToggle {...args} />
    </div>
  ),
}

/**
 * Integration in a toolbar context.
 * Shows how the toggle fits with other toolbar elements.
 */
export const ToolbarIntegration: Story = {
  render: () => {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
    const [sortBy, setSortBy] = useState('name')

    return (
      <div className="flex flex-col gap-6 p-6">
        <h3 className="font-decorative text-2xl text-white mb-2">File Browser Toolbar</h3>

        {/* Toolbar */}
        <div className="glass-card rounded-lg p-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Search and filters */}
            <div className="flex items-center gap-3 flex-1">
              <input
                type="text"
                placeholder="Search files..."
                className="px-3 py-1.5 bg-card/30 border border-[#0E282E] rounded-lg text-sm text-white placeholder:text-[#C4C8D4]/50 focus:outline-none focus:ring-2 focus:ring-primary/50 flex-1 max-w-xs"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-card/30 border border-[#0E282E] rounded-lg text-sm text-[#C4C8D4] focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="name">Name</option>
                <option value="date">Date modified</option>
                <option value="size">Size</option>
                <option value="type">Type</option>
              </select>
            </div>

            {/* Right side - View toggle */}
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
          </div>
        </div>

        {/* File browser content */}
        <div className="glass-card rounded-lg overflow-hidden">
          {viewMode === 'list' ? (
            <div>
              <div className="border-b border-[#0E282E] p-3 bg-card/20">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 text-xs font-medium text-[#C4C8D4] uppercase tracking-wide">
                  <div>Name</div>
                  <div className="w-24">Size</div>
                  <div className="w-32">Modified</div>
                </div>
              </div>
              <div className="divide-y divide-[#0E282E]/50">
                {[
                  { name: 'Documents', size: '—', date: 'Today', isFolder: true },
                  { name: 'vacation-2025.jpg', size: '2.5 MB', date: '2 hours ago' },
                  { name: 'annual-report.pdf', size: '1.2 MB', date: 'Yesterday' },
                  { name: 'tutorial-video.mp4', size: '45 MB', date: '3 days ago' },
                  { name: 'project-files.zip', size: '12 MB', date: 'Last week' },
                ].map((file) => (
                  <div
                    key={file.name}
                    className="grid grid-cols-[1fr_auto_auto] gap-4 p-3 hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileTypeIcon
                        filename={file.name}
                        isFolder={file.isFolder}
                        size="md"
                      />
                      <span className="text-sm text-white truncate">{file.name}</span>
                    </div>
                    <div className="w-24 text-sm text-[#C4C8D4] text-right">{file.size}</div>
                    <div className="w-32 text-sm text-[#C4C8D4] text-right">{file.date}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {[
                { name: 'Documents', isFolder: true },
                { name: 'vacation-2025.jpg' },
                { name: 'annual-report.pdf' },
                { name: 'tutorial-video.mp4' },
                { name: 'project-files.zip' },
                { name: 'photo-album.jpg' },
              ].map((file) => (
                <div
                  key={file.name}
                  className="flex flex-col items-center gap-3 p-4 bg-card/20 rounded-lg hover:bg-card/40 transition-colors cursor-pointer"
                >
                  <FileTypeIcon
                    filename={file.name}
                    isFolder={file.isFolder}
                    size="2xl"
                  />
                  <span className="text-sm text-white text-center truncate w-full">
                    {file.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  },
}

/**
 * Keyboard navigation demonstration.
 * Use Tab to focus, Enter/Space to toggle.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6 max-w-md">
      <div className="text-center">
        <h3 className="font-decorative text-xl text-white mb-2">Keyboard Navigation</h3>
        <div className="text-sm text-[#C4C8D4] space-y-1">
          <p>• Press <kbd className="px-2 py-0.5 bg-card/50 rounded text-xs">Tab</kbd> to focus</p>
          <p>• Press <kbd className="px-2 py-0.5 bg-card/50 rounded text-xs">Enter</kbd> or <kbd className="px-2 py-0.5 bg-card/50 rounded text-xs">Space</kbd> to toggle</p>
          <p>• Hover for tooltips</p>
        </div>
      </div>
      <div className="flex justify-center">
        <ViewModeToggle />
      </div>
    </div>
  ),
}

/**
 * Custom storage key example.
 */
export const CustomStorageKey: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <h3 className="font-decorative text-2xl text-white mb-2">Multiple Instances</h3>
      <p className="text-sm text-[#C4C8D4] mb-4">
        Each toggle can have its own storage key to maintain separate preferences
      </p>

      <div className="space-y-6">
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-medium text-white">My Files</h4>
              <p className="text-xs text-[#C4C8D4]">Storage key: 'my-files-view'</p>
            </div>
            <ViewModeToggle storageKey="my-files-view" />
          </div>
        </div>

        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-medium text-white">Shared Files</h4>
              <p className="text-xs text-[#C4C8D4]">Storage key: 'shared-files-view'</p>
            </div>
            <ViewModeToggle storageKey="shared-files-view" />
          </div>
        </div>

        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-medium text-white">Recent Files</h4>
              <p className="text-xs text-[#C4C8D4]">Storage key: 'recent-files-view'</p>
            </div>
            <ViewModeToggle storageKey="recent-files-view" />
          </div>
        </div>
      </div>
    </div>
  ),
}
