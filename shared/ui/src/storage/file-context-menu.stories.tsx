/**
 * File Context Menu - Storybook Stories
 * Comprehensive stories for the FileContextMenu component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { FileContextMenu } from './file-context-menu'
import type { StorageFile, FileAction } from './types'
import {
  Download,
  Trash2,
  Edit,
  Share2,
  Info,
  Copy,
  Eye,
  FolderOpen,
  Lock,
  Unlock,
  Archive,
  RotateCw,
} from 'lucide-react'
import React from 'react'

/**
 * File Context Menu component for right-click file operations
 * Provides contextual actions for files and folders in storage interfaces
 *
 * ## Features
 * - Right-click activation for files and folders
 * - Standard file operations (download, delete, rename, share)
 * - Folder-specific actions (open in bucket)
 * - File-specific actions (preview)
 * - Custom action support
 * - Disabled action support
 * - Ozean Licht branding with glass morphism
 * - Action grouping with separators
 *
 * ## Usage
 * ```tsx
 * <FileContextMenu
 *   file={storageFile}
 *   onDownload={(file) => console.log('Download', file)}
 *   onDelete={(file) => console.log('Delete', file)}
 *   onRename={(file) => console.log('Rename', file)}
 * >
 *   <div>Right-click me</div>
 * </FileContextMenu>
 * ```
 */
const meta = {
  title: 'Storage/FileContextMenu',
  component: FileContextMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Right-click context menu for file operations in storage interfaces. Supports both files and folders with intelligent action filtering.',
      },
    },
    backgrounds: {
      default: 'ozean-dark',
      values: [
        { name: 'ozean-dark', value: '#0a1f24' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    file: {
      description: 'StorageFile object representing the file or folder',
      control: 'object',
    },
    onDownload: {
      description: 'Callback when download is clicked',
    },
    onDelete: {
      description: 'Callback when delete is clicked',
    },
    onRename: {
      description: 'Callback when rename is clicked',
    },
    onShare: {
      description: 'Callback when share is clicked',
    },
    onViewDetails: {
      description: 'Callback when view details is clicked',
    },
    onCopyUrl: {
      description: 'Callback when copy URL is clicked',
    },
    onPreview: {
      description: 'Callback when preview is clicked (files only)',
    },
    onOpenInBucket: {
      description: 'Callback when open in bucket is clicked (folders only)',
    },
    customActions: {
      description: 'Array of custom actions to add',
      control: 'object',
    },
    disabledActions: {
      description: 'Array of action IDs to disable',
      control: 'object',
    },
  },
} satisfies Meta<typeof FileContextMenu>

export default meta
type Story = StoryObj<typeof meta>

// Mock file data
const mockImageFile: StorageFile = {
  id: 'file-1',
  name: 'vacation-photo.jpg',
  path: '/uploads/2025/vacation-photo.jpg',
  size: 2500000, // 2.5 MB
  mimeType: 'image/jpeg',
  uploadedAt: new Date('2025-01-15T10:30:00'),
  uploadedBy: 'user@ozean-licht.dev',
  bucket: 'user-uploads',
  entityScope: 'user:123',
  md5Hash: 'a1b2c3d4e5f6',
  metadata: { width: 1920, height: 1080 },
  tags: ['vacation', '2025'],
  isFolder: false,
}

const mockPdfFile: StorageFile = {
  id: 'file-2',
  name: 'annual-report-2024.pdf',
  path: '/documents/annual-report-2024.pdf',
  size: 1500000, // 1.5 MB
  mimeType: 'application/pdf',
  uploadedAt: new Date('2025-01-10T14:20:00'),
  uploadedBy: 'admin@ozean-licht.dev',
  bucket: 'documents',
  entityScope: 'org:456',
  isFolder: false,
}

const mockVideoFile: StorageFile = {
  id: 'file-3',
  name: 'tutorial-video.mp4',
  path: '/videos/tutorial-video.mp4',
  size: 45000000, // 45 MB
  mimeType: 'video/mp4',
  uploadedAt: new Date('2025-01-20T09:15:00'),
  uploadedBy: 'creator@ozean-licht.dev',
  bucket: 'course-content',
  entityScope: 'course:789',
  isFolder: false,
}

const mockFolder: StorageFile = {
  id: 'folder-1',
  name: 'Project Files',
  path: '/projects/project-files',
  size: 0,
  mimeType: 'application/x-directory',
  uploadedAt: new Date('2025-01-01T00:00:00'),
  uploadedBy: 'admin@ozean-licht.dev',
  bucket: 'projects',
  entityScope: 'org:456',
  isFolder: true,
}

// Reusable trigger card component
const FileCard = ({ file }: { file: StorageFile }) => (
  <div className="flex h-[200px] w-[350px] flex-col items-center justify-center gap-3 rounded-lg border border-primary/30 p-6 text-center glass-card-strong">
    {file.isFolder ? (
      <FolderOpen className="h-12 w-12 text-primary" />
    ) : (
      <div className="rounded-lg bg-primary/20 p-4">
        {file.mimeType.startsWith('image/') && <Eye className="h-8 w-8 text-primary" />}
        {file.mimeType.startsWith('video/') && <Eye className="h-8 w-8 text-primary" />}
        {file.mimeType === 'application/pdf' && <Info className="h-8 w-8 text-primary" />}
      </div>
    )}
    <div>
      <p className="text-sm font-medium text-white">{file.name}</p>
      <p className="text-xs text-[#C4C8D4]/70">
        {file.isFolder ? 'Folder' : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
      </p>
      <p className="mt-2 text-xs text-primary">Right-click for options</p>
    </div>
  </div>
)

/**
 * Default file context menu with all standard actions
 *
 * Right-click on the card to open the custom context menu.
 */
export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center p-6">
      <div className="glass-card rounded-lg p-4 max-w-md">
        <p className="text-sm text-primary font-medium mb-2">Instructions:</p>
        <p className="text-xs text-[#C4C8D4]">
          Right-click on the card below to open the custom context menu.
        </p>
      </div>
      <FileContextMenu
        file={mockImageFile}
        onDownload={fn()}
        onDelete={fn()}
        onRename={fn()}
        onShare={fn()}
        onViewDetails={fn()}
        onCopyUrl={fn()}
        onPreview={fn()}
      >
        <FileCard file={mockImageFile} />
      </FileContextMenu>
    </div>
  ),
}

/**
 * Context menu for image files with preview
 */
export const ImageFileMenu: Story = {
  render: () => (
    <FileContextMenu
      file={mockImageFile}
      onDownload={fn()}
      onDelete={fn()}
      onRename={fn()}
      onShare={fn()}
      onViewDetails={fn()}
      onCopyUrl={fn()}
      onPreview={fn()}
    >
      <FileCard file={mockImageFile} />
    </FileContextMenu>
  ),
}

/**
 * Context menu for PDF documents
 */
export const DocumentFileMenu: Story = {
  render: () => (
    <FileContextMenu
      file={mockPdfFile}
      onDownload={fn()}
      onDelete={fn()}
      onRename={fn()}
      onShare={fn()}
      onViewDetails={fn()}
      onCopyUrl={fn()}
      onPreview={fn()}
    >
      <FileCard file={mockPdfFile} />
    </FileContextMenu>
  ),
}

/**
 * Context menu for video files
 */
export const VideoFileMenu: Story = {
  render: () => (
    <FileContextMenu
      file={mockVideoFile}
      onDownload={fn()}
      onDelete={fn()}
      onRename={fn()}
      onShare={fn()}
      onViewDetails={fn()}
      onCopyUrl={fn()}
      onPreview={fn()}
    >
      <FileCard file={mockVideoFile} />
    </FileContextMenu>
  ),
}

/**
 * Context menu for folders with folder-specific actions
 */
export const FolderMenu: Story = {
  render: () => (
    <FileContextMenu
      file={mockFolder}
      onDelete={fn()}
      onRename={fn()}
      onViewDetails={fn()}
      onOpenInBucket={fn()}
    >
      <FileCard file={mockFolder} />
    </FileContextMenu>
  ),
}

/**
 * Menu with custom actions
 */
export const WithCustomActions: Story = {
  render: () => {
    const customActions: FileAction[] = [
      {
        id: 'archive',
        label: 'Archive',
        icon: Archive,
        onClick: fn(),
      },
      {
        id: 'refresh',
        label: 'Refresh Metadata',
        icon: RotateCw,
        onClick: fn(),
      },
      {
        id: 'lock',
        label: 'Lock File',
        icon: Lock,
        onClick: fn(),
      },
    ]

    return (
      <FileContextMenu
        file={mockImageFile}
        onDownload={fn()}
        onDelete={fn()}
        onRename={fn()}
        onShare={fn()}
        customActions={customActions}
      >
        <FileCard file={mockImageFile} />
      </FileContextMenu>
    )
  },
}

/**
 * Menu with disabled actions
 */
export const WithDisabledActions: Story = {
  render: () => (
    <FileContextMenu
      file={mockImageFile}
      onDownload={fn()}
      onDelete={fn()}
      onRename={fn()}
      onShare={fn()}
      onViewDetails={fn()}
      onCopyUrl={fn()}
      onPreview={fn()}
      disabledActions={['delete', 'share']}
    >
      <div className="flex h-[200px] w-[350px] flex-col items-center justify-center gap-3 rounded-lg border border-primary/30 p-6 text-center glass-card-strong">
        <Lock className="h-12 w-12 text-primary/50" />
        <div>
          <p className="text-sm font-medium text-white">vacation-photo.jpg</p>
          <p className="text-xs text-[#C4C8D4]/70">Read-only file</p>
          <p className="mt-2 text-xs text-primary">Right-click (delete & share disabled)</p>
        </div>
      </div>
    </FileContextMenu>
  ),
}

/**
 * Minimal menu with download only
 */
export const MinimalMenu: Story = {
  render: () => (
    <FileContextMenu file={mockImageFile} onDownload={fn()}>
      <div className="flex h-[200px] w-[350px] flex-col items-center justify-center gap-3 rounded-lg border border-primary/30 p-6 text-center glass-card-strong">
        <Download className="h-12 w-12 text-primary" />
        <div>
          <p className="text-sm font-medium text-white">vacation-photo.jpg</p>
          <p className="text-xs text-[#C4C8D4]/70">Download only</p>
          <p className="mt-2 text-xs text-primary">Right-click to download</p>
        </div>
      </div>
    </FileContextMenu>
  ),
}

/**
 * Full-featured menu with all options
 */
export const FullFeatured: Story = {
  render: () => {
    const customActions: FileAction[] = [
      {
        id: 'archive',
        label: 'Archive File',
        icon: Archive,
        onClick: fn(),
      },
      {
        id: 'unlock',
        label: 'Unlock for Editing',
        icon: Unlock,
        onClick: fn(),
      },
    ]

    return (
      <FileContextMenu
        file={mockImageFile}
        onDownload={fn()}
        onDelete={fn()}
        onRename={fn()}
        onShare={fn()}
        onViewDetails={fn()}
        onCopyUrl={fn()}
        onPreview={fn()}
        customActions={customActions}
      >
        <FileCard file={mockImageFile} />
      </FileContextMenu>
    )
  },
}

/**
 * Grid view usage example with multiple files
 */
export const GridViewUsage: Story = {
  render: () => {
    const files = [mockImageFile, mockPdfFile, mockVideoFile, mockFolder]

    return (
      <div className="flex flex-col gap-6 p-6">
        <h3 className="font-decorative text-2xl text-white">Storage Grid View</h3>
        <p className="text-sm text-[#C4C8D4]">Right-click any item for context menu</p>

        <div className="grid grid-cols-2 gap-4">
          {files.map((file) => (
            <FileContextMenu
              key={file.id}
              file={file}
              onDownload={file.isFolder ? undefined : fn()}
              onDelete={fn()}
              onRename={fn()}
              onShare={fn()}
              onViewDetails={fn()}
              onCopyUrl={file.isFolder ? undefined : fn()}
              onPreview={file.isFolder ? undefined : fn()}
              onOpenInBucket={file.isFolder ? fn() : undefined}
            >
              <div className="group relative cursor-pointer rounded-lg border border-primary/20 bg-gradient-to-br from-[#0a1f24] to-[#0E282E] p-4 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
                <div className="flex flex-col items-center gap-3">
                  {file.isFolder ? (
                    <FolderOpen className="h-10 w-10 text-primary" />
                  ) : (
                    <div className="rounded-lg bg-primary/10 p-3">
                      {file.mimeType.startsWith('image/') && (
                        <Eye className="h-6 w-6 text-primary" />
                      )}
                      {file.mimeType.startsWith('video/') && (
                        <Eye className="h-6 w-6 text-primary" />
                      )}
                      {file.mimeType === 'application/pdf' && (
                        <Info className="h-6 w-6 text-primary" />
                      )}
                    </div>
                  )}
                  <div className="w-full text-center">
                    <p className="truncate text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-[#C4C8D4]/70">
                      {file.isFolder ? 'Folder' : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    </p>
                  </div>
                </div>
              </div>
            </FileContextMenu>
          ))}
        </div>
      </div>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * List view usage example
 */
export const ListViewUsage: Story = {
  render: () => {
    const files = [mockFolder, mockImageFile, mockPdfFile, mockVideoFile]

    return (
      <div className="flex flex-col gap-4 p-6 max-w-4xl">
        <h3 className="font-decorative text-2xl text-white">Storage List View</h3>
        <p className="text-sm text-[#C4C8D4]">Right-click any row for context menu</p>

        <div className="glass-card rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#0E282E]">
                <th className="text-left p-3 text-sm font-normal text-[#C4C8D4]">Name</th>
                <th className="text-left p-3 text-sm font-normal text-[#C4C8D4]">Size</th>
                <th className="text-left p-3 text-sm font-normal text-[#C4C8D4]">Modified</th>
                <th className="text-left p-3 text-sm font-normal text-[#C4C8D4]">Type</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <FileContextMenu
                  key={file.id}
                  file={file}
                  onDownload={file.isFolder ? undefined : fn()}
                  onDelete={fn()}
                  onRename={fn()}
                  onShare={fn()}
                  onViewDetails={fn()}
                  onCopyUrl={file.isFolder ? undefined : fn()}
                  onPreview={file.isFolder ? undefined : fn()}
                  onOpenInBucket={file.isFolder ? fn() : undefined}
                >
                  <tr className="border-b border-[#0E282E]/50 hover:bg-primary/5 cursor-pointer transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {file.isFolder ? (
                          <FolderOpen className="h-5 w-5 text-primary" />
                        ) : (
                          <Eye className="h-5 w-5 text-primary" />
                        )}
                        <span className="text-sm text-white">{file.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-[#C4C8D4]">
                      {file.isFolder ? '—' : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    </td>
                    <td className="p-3 text-sm text-[#C4C8D4]">
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }).format(file.uploadedAt)}
                    </td>
                    <td className="p-3 text-sm text-[#C4C8D4]">
                      {file.isFolder ? 'Folder' : file.mimeType.split('/')[1].toUpperCase()}
                    </td>
                  </tr>
                </FileContextMenu>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Interactive demo showing action feedback
 */
export const InteractiveDemo: Story = {
  render: () => {
    const [lastAction, setLastAction] = React.useState<string>('None')
    const [file, setFile] = React.useState(mockImageFile)

    return (
      <div className="flex flex-col items-center gap-6 p-6">
        <h3 className="font-decorative text-2xl text-white">Interactive Demo</h3>

        <FileContextMenu
          file={file}
          onDownload={(f) => setLastAction(`Downloaded: ${f.name}`)}
          onDelete={(f) => setLastAction(`Deleted: ${f.name}`)}
          onRename={(f) => setLastAction(`Renamed: ${f.name}`)}
          onShare={(f) => setLastAction(`Shared: ${f.name}`)}
          onViewDetails={(f) => setLastAction(`Viewing details: ${f.name}`)}
          onCopyUrl={(f) => setLastAction(`Copied URL: ${f.path}`)}
          onPreview={(f) => setLastAction(`Previewing: ${f.name}`)}
        >
          <FileCard file={file} />
        </FileContextMenu>

        <div className="glass-card rounded-lg p-4 min-w-[300px]">
          <p className="text-xs text-[#C4C8D4]/70 mb-2">Last action:</p>
          <p className="text-sm font-medium text-primary">{lastAction}</p>
        </div>

        <div className="text-xs text-[#C4C8D4]/70 text-center max-w-md">
          Right-click the card above to trigger actions. The last action will be displayed below.
        </div>
      </div>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}
