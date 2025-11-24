/**
 * File Browser - Storybook Stories
 * Main orchestrator component that composes all storage components
 */

import type { Meta, StoryObj } from '@storybook/react'
import { FileBrowser } from './file-browser'
import { FileListItem } from '../branded/storage/file-list-item'
import { FileGridItem } from '../branded/storage/file-grid-item'
import { fn } from '@storybook/test'
import React from 'react'
import type { StorageFile, UploadProgress } from './types'

const meta = {
  title: 'Storage/FileBrowser',
  component: FileBrowser,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Main orchestrator component that composes all storage UI components: file dropzone, upload queue, bulk actions toolbar, file list/grid views, and folder creation. Handles file selection, keyboard shortcuts, and orchestrates all child components.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    files: {
      control: 'object',
      description: 'Array of files and folders to display',
    },
    uploads: {
      control: 'object',
      description: 'Array of upload progress items',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    viewMode: {
      control: 'radio',
      options: ['list', 'grid'],
      description: 'View mode for file display',
    },
    showDropzone: {
      control: 'boolean',
      description: 'Show dropzone when no files exist',
    },
    showBulkActions: {
      control: 'boolean',
      description: 'Show bulk actions toolbar when files are selected',
    },
    showCreateFolder: {
      control: 'boolean',
      description: 'Enable folder creation (Cmd/Ctrl+N)',
    },
    onUpload: {
      action: 'upload',
      description: 'Callback when files are uploaded',
    },
    onDownload: {
      action: 'download',
      description: 'Callback when a file is downloaded',
    },
    onDelete: {
      action: 'delete',
      description: 'Callback when a file is deleted',
    },
    onDeleteBulk: {
      action: 'deleteBulk',
      description: 'Callback when multiple files are deleted',
    },
    onDownloadBulk: {
      action: 'downloadBulk',
      description: 'Callback when multiple files are downloaded',
    },
    onCreateFolder: {
      action: 'createFolder',
      description: 'Callback when a folder is created',
    },
    onNavigate: {
      action: 'navigate',
      description: 'Callback when navigating to a folder',
    },
  },
} satisfies Meta<typeof FileBrowser>

export default meta
type Story = StoryObj<typeof meta>

// Mock data generators
const createMockFile = (
  id: string,
  name: string,
  size: number,
  mimeType: string,
  hoursAgo = 2
): StorageFile => ({
  id,
  name,
  path: `/files/${name}`,
  size,
  mimeType,
  uploadedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
  uploadedBy: 'user@example.com',
  bucket: 'ozean-cloud',
  entityScope: 'organization:123',
})

const createMockFolder = (id: string, name: string, hoursAgo = 2): StorageFile => ({
  id,
  name,
  path: `/files/${name}`,
  size: 0,
  mimeType: 'inode/directory',
  uploadedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
  uploadedBy: 'user@example.com',
  bucket: 'ozean-cloud',
  entityScope: 'organization:123',
  isFolder: true,
})

const mockFiles: StorageFile[] = [
  createMockFolder('f1', 'Documents', 1),
  createMockFolder('f2', 'Images', 2),
  createMockFolder('f3', 'Videos', 3),
  createMockFile('1', 'vacation-photo.jpg', 2500000, 'image/jpeg', 4),
  createMockFile('2', 'presentation.pdf', 1200000, 'application/pdf', 24),
  createMockFile('3', 'project-video.mp4', 45000000, 'video/mp4', 72),
  createMockFile('4', 'financial-report.xlsx', 850000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 48),
  createMockFile('5', 'meeting-notes.docx', 45000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 12),
  createMockFile('6', 'archive-2024.zip', 15000000, 'application/zip', 168),
  createMockFile('7', 'song.mp3', 8500000, 'audio/mpeg', 96),
]

const mockUploads: UploadProgress[] = [
  {
    fileId: 'u1',
    fileName: 'new-document.pdf',
    size: 1500000,
    loaded: 750000,
    percentage: 50,
    status: 'uploading',
  },
  {
    fileId: 'u2',
    fileName: 'image-gallery.zip',
    size: 25000000,
    loaded: 5000000,
    percentage: 20,
    status: 'uploading',
  },
  {
    fileId: 'u3',
    fileName: 'completed-file.jpg',
    size: 2000000,
    loaded: 2000000,
    percentage: 100,
    status: 'completed',
  },
]

const mockUploadError: UploadProgress[] = [
  {
    fileId: 'e1',
    fileName: 'failed-upload.pdf',
    size: 5000000,
    loaded: 2500000,
    percentage: 50,
    status: 'error',
    error: 'Network connection lost',
  },
]

/**
 * Empty browser - shows dropzone when no files exist
 */
export const Empty: Story = {
  args: {
    files: [],
    onUpload: fn(),
    onDownload: fn(),
    onDelete: fn(),
    onCreateFolder: fn(),
    showDropzone: true,
    showBulkActions: true,
    showCreateFolder: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state with file dropzone. Users can drag & drop files or click to upload. Supports keyboard shortcut Cmd/Ctrl+N to create a folder.',
      },
    },
  },
}

/**
 * Loading state - shows loader while fetching files
 */
export const Loading: Story = {
  args: {
    files: [],
    isLoading: true,
    onUpload: fn(),
    showDropzone: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state displayed while fetching files from the server.',
      },
    },
  },
}

/**
 * Error state - shows error message
 */
export const Error: Story = {
  args: {
    files: [],
    error: 'Failed to load files. Please check your network connection and try again.',
    onUpload: fn(),
    showDropzone: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state with user-friendly message displayed prominently.',
      },
    },
  },
}

/**
 * With files in list view
 */
export const WithFilesListView: Story = {
  args: {
    files: mockFiles,
    viewMode: 'list',
    onUpload: fn(),
    onDownload: fn(),
    onDelete: fn(),
    onDeleteBulk: fn(),
    onDownloadBulk: fn(),
    onCreateFolder: fn(),
    onNavigate: fn(),
    showBulkActions: true,
    showCreateFolder: true,
  },
  render: (args: typeof meta.args) => (
    <div className="w-full max-w-6xl">
      <FileBrowser {...args}>
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
              {args.files?.map((file: StorageFile) => (
                <FileListItem
                  key={file.id}
                  file={{
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    modified: file.uploadedAt,
                    mimeType: file.mimeType,
                    isFolder: file.isFolder,
                  }}
                  showCheckbox
                  onSelect={() => console.log('Selected:', file.id)}
                  onAction={(action) => {
                    if (action === 'download' && args.onDownload) args.onDownload(file)
                    if (action === 'delete' && args.onDelete) args.onDelete(file)
                  }}
                  onClick={() => {
                    if (file.isFolder && args.onNavigate) {
                      args.onNavigate(file.path)
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </FileBrowser>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Files displayed in list/table view with folders at the top. Supports bulk selection (Cmd/Ctrl+A to select all, ESC to clear), hover actions, and row click to navigate folders.',
      },
    },
  },
}

/**
 * With files in grid view
 */
export const WithFilesGridView: Story = {
  args: {
    files: mockFiles,
    viewMode: 'grid',
    onUpload: fn(),
    onDownload: fn(),
    onDelete: fn(),
    onDeleteBulk: fn(),
    onDownloadBulk: fn(),
    onCreateFolder: fn(),
    onNavigate: fn(),
    showBulkActions: true,
    showCreateFolder: true,
  },
  render: (args: typeof meta.args) => (
    <div className="w-full max-w-6xl">
      <FileBrowser {...args}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {args.files?.map((file: StorageFile) => (
            <FileGridItem
              key={file.id}
              file={{
                id: file.id,
                name: file.name,
                size: file.size,
                modified: file.uploadedAt,
                mimeType: file.mimeType,
                isFolder: file.isFolder,
              }}
              showCheckbox
              onSelect={() => console.log('Selected:', file.id)}
              onAction={(action) => {
                if (action === 'download' && args.onDownload) args.onDownload(file)
                if (action === 'delete' && args.onDelete) args.onDelete(file)
              }}
              onClick={() => {
                if (file.isFolder && args.onNavigate) {
                  args.onNavigate(file.path)
                }
              }}
            />
          ))}
        </div>
      </FileBrowser>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Files displayed in grid/card view with large icons. Better for visual browsing of images and folders. Supports same keyboard shortcuts as list view.',
      },
    },
  },
}

/**
 * With uploads in progress
 */
export const WithUploads: Story = {
  args: {
    files: mockFiles.slice(0, 4),
    uploads: mockUploads,
    viewMode: 'list',
    onUpload: fn(),
    onDownload: fn(),
    onDelete: fn(),
    onCancelUpload: fn(),
    onRetryUpload: fn(),
    onClearUpload: fn(),
    showBulkActions: true,
  },
  render: (args: typeof meta.args) => (
    <div className="w-full max-w-6xl">
      <FileBrowser {...args}>
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
              {args.files?.map((file: StorageFile) => (
                <FileListItem
                  key={file.id}
                  file={{
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    modified: file.uploadedAt,
                    mimeType: file.mimeType,
                    isFolder: file.isFolder,
                  }}
                  showCheckbox
                  onSelect={(id) => console.log('Selected:', id)}
                  onAction={(action) => console.log('Action:', action)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </FileBrowser>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Files with upload queue overlay showing progress. Upload queue appears in bottom-right corner with individual progress bars. Completed uploads auto-dismiss after 3 seconds.',
      },
    },
  },
}

/**
 * With failed upload
 */
export const WithUploadError: Story = {
  args: {
    files: mockFiles.slice(0, 3),
    uploads: mockUploadError,
    viewMode: 'list',
    onUpload: fn(),
    onDownload: fn(),
    onDelete: fn(),
    onCancelUpload: fn(),
    onRetryUpload: fn(),
    onClearUpload: fn(),
  },
  render: (args: typeof meta.args) => (
    <div className="w-full max-w-6xl">
      <FileBrowser {...args}>
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
              {args.files?.map((file: StorageFile) => (
                <FileListItem
                  key={file.id}
                  file={{
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    modified: file.uploadedAt,
                    mimeType: file.mimeType,
                    isFolder: file.isFolder,
                  }}
                  showCheckbox
                  onSelect={(id) => console.log('Selected:', id)}
                  onAction={(action) => console.log('Action:', action)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </FileBrowser>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Upload queue showing a failed upload with error message. User can retry or clear the failed upload.',
      },
    },
  },
}

/**
 * With bulk selection active
 */
export const WithBulkSelection: Story = {
  args: {
    files: mockFiles,
    viewMode: 'list',
    onUpload: fn(),
    onDownload: fn(),
    onDelete: fn(),
    onDeleteBulk: fn(),
    onDownloadBulk: fn(),
    onCreateFolder: fn(),
    showBulkActions: true,
    showCreateFolder: true,
  },
  render: function WithBulkSelectionRender(args: typeof meta.args) {
    const [selectedIds, setSelectedIds] = React.useState<string[]>(['1', '2', '5'])

    return (
      <div className="w-full max-w-6xl">
        <div className="mb-4 p-4 glass-card rounded-lg">
          <h4 className="text-sm font-medium text-white mb-2">Keyboard Shortcuts</h4>
          <ul className="text-xs text-[#C4C8D4] space-y-1">
            <li><kbd className="px-1 py-0.5 bg-card rounded text-white">Cmd/Ctrl + A</kbd> - Select all files</li>
            <li><kbd className="px-1 py-0.5 bg-card rounded text-white">ESC</kbd> - Clear selection</li>
            <li><kbd className="px-1 py-0.5 bg-card rounded text-white">Delete</kbd> - Delete selected files</li>
            <li><kbd className="px-1 py-0.5 bg-card rounded text-white">Cmd/Ctrl + N</kbd> - Create new folder</li>
          </ul>
        </div>

        <FileBrowser {...args}>
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
                {args.files?.map((file: StorageFile) => (
                  <FileListItem
                    key={file.id}
                    file={{
                      id: file.id,
                      name: file.name,
                      size: file.size,
                      modified: file.uploadedAt,
                      mimeType: file.mimeType,
                      isFolder: file.isFolder,
                    }}
                    isSelected={selectedIds.includes(file.id)}
                    showCheckbox
                    onSelect={(id: string) => {
                      setSelectedIds((prev) =>
                        prev.includes(id)
                          ? prev.filter((selectedId) => selectedId !== id)
                          : [...prev, id]
                      )
                    }}
                    onAction={(action) => console.log('Action:', action, file.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </FileBrowser>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Bulk actions toolbar appears when files are selected. Shows selection count, bulk actions (download, delete), and "Select All" option if not all files are selected.',
      },
    },
  },
}

/**
 * Complete integration - all features enabled
 */
export const CompleteIntegration: Story = {
  args: {
    files: mockFiles,
    uploads: mockUploads.slice(0, 2),
    viewMode: 'grid',
    currentPath: '/My Files',
    onUpload: fn(),
    onDownload: fn(),
    onDelete: fn(),
    onDeleteBulk: fn(),
    onDownloadBulk: fn(),
    onCreateFolder: fn(),
    onNavigate: fn(),
    onCancelUpload: fn(),
    onRetryUpload: fn(),
    onClearUpload: fn(),
    showDropzone: true,
    showBulkActions: true,
    showCreateFolder: true,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 10,
  },
  render: function CompleteIntegrationRender(args: typeof meta.args) {
    const [selectedIds, setSelectedIds] = React.useState<string[]>(['1', 'f2'])

    return (
      <div className="w-full max-w-7xl space-y-6">
        {/* Header */}
        <div className="glass-card rounded-lg p-6">
          <h2 className="font-decorative text-3xl text-white mb-2">Ozean Cloud Storage</h2>
          <p className="text-sm text-[#C4C8D4]">
            Complete file browser with all features: upload, download, delete, bulk operations, folder creation, and more.
          </p>
          <div className="mt-4 text-xs text-[#C4C8D4] space-y-1">
            <p><strong>Current Path:</strong> {args.currentPath}</p>
            <p><strong>Total Files:</strong> {args.files.length}</p>
            <p><strong>Selected:</strong> {selectedIds.length}</p>
            <p><strong>Active Uploads:</strong> {args.uploads?.length || 0}</p>
          </div>
        </div>

        {/* File Browser */}
        <FileBrowser {...args}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {args.files?.map((file: StorageFile) => (
              <FileGridItem
                key={file.id}
                file={{
                  id: file.id,
                  name: file.name,
                  size: file.size,
                  modified: file.uploadedAt,
                  mimeType: file.mimeType,
                  isFolder: file.isFolder,
                  thumbnailUrl: file.mimeType?.startsWith('image/')
                    ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
                    : undefined,
                }}
                isSelected={selectedIds.includes(file.id)}
                showCheckbox
                onSelect={(id: string) => {
                  setSelectedIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((selectedId) => selectedId !== id)
                      : [...prev, id]
                  )
                }}
                onAction={(action) => {
                  console.log('Action:', action, file.id)
                  if (action === 'download' && args.onDownload) args.onDownload(file)
                  if (action === 'delete' && args.onDelete) args.onDelete(file)
                }}
                onClick={() => {
                  if (file.isFolder && args.onNavigate) {
                    args.onNavigate(file.path)
                  }
                }}
              />
            ))}
          </div>
        </FileBrowser>

        {/* Feature List */}
        <div className="glass-card rounded-lg p-6">
          <h3 className="font-decorative text-xl text-white mb-4">Features Demonstrated</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#C4C8D4]">
            <div>
              <h4 className="text-white font-medium mb-2">File Operations</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Upload via dropzone or drag & drop</li>
                <li>Download individual files</li>
                <li>Delete files and folders</li>
                <li>Navigate folder structure</li>
                <li>Create new folders</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Bulk Operations</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Multi-select with checkboxes</li>
                <li>Bulk download</li>
                <li>Bulk delete</li>
                <li>Select all / Clear selection</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Upload Management</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Real-time progress tracking</li>
                <li>Cancel active uploads</li>
                <li>Retry failed uploads</li>
                <li>Auto-dismiss completed uploads</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Keyboard Shortcuts</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Cmd/Ctrl+A - Select all</li>
                <li>ESC - Clear selection</li>
                <li>Delete - Remove selected</li>
                <li>Cmd/Ctrl+N - New folder</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete integration story showing all FileBrowser features working together: file browsing, uploads, bulk operations, folder management, and keyboard shortcuts. This is the recommended starting point for understanding the component.',
      },
    },
  },
}

/**
 * Folders and files mixed
 */
export const FoldersAndFiles: Story = {
  args: {
    files: [
      createMockFolder('f1', 'Documents', 1),
      createMockFolder('f2', 'Photos 2024', 2),
      createMockFolder('f3', 'Projects', 3),
      createMockFolder('f4', 'Archive', 4),
      createMockFile('1', 'README.md', 2500, 'text/markdown', 5),
      createMockFile('2', 'budget-2025.xlsx', 125000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 6),
      createMockFile('3', 'contract.pdf', 450000, 'application/pdf', 7),
    ],
    viewMode: 'list',
    onUpload: fn(),
    onDownload: fn(),
    onDelete: fn(),
    onNavigate: fn(),
    showBulkActions: true,
  },
  render: (args: typeof meta.args) => (
    <div className="w-full max-w-6xl">
      <div className="mb-4 p-4 glass-card rounded-lg">
        <p className="text-sm text-[#C4C8D4]">
          Folders appear first, followed by files. Click on folders to navigate, click on files to select.
        </p>
      </div>

      <FileBrowser {...args}>
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
              {args.files?.map((file: StorageFile) => (
                <FileListItem
                  key={file.id}
                  file={{
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    modified: file.uploadedAt,
                    mimeType: file.mimeType,
                    isFolder: file.isFolder,
                  }}
                  showCheckbox
                  onSelect={() => console.log('Selected:', file.id)}
                  onAction={(action) => {
                    if (action === 'download' && args.onDownload) args.onDownload(file)
                    if (action === 'delete' && args.onDelete) args.onDelete(file)
                  }}
                  onClick={() => {
                    if (file.isFolder && args.onNavigate) {
                      args.onNavigate(file.path)
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </FileBrowser>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Mixed content with folders and files. Folders are typically sorted first and have different visual treatment (no size, folder icon).',
      },
    },
  },
}

/**
 * Custom file type restrictions
 */
export const WithFileTypeRestrictions: Story = {
  args: {
    files: [],
    onUpload: fn(),
    showDropzone: true,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dropzone with file type restrictions. Only images and PDFs are accepted, with a 10MB size limit and maximum of 5 files.',
      },
    },
  },
}

/**
 * Minimal configuration
 */
export const Minimal: Story = {
  args: {
    files: mockFiles.slice(0, 3),
    onUpload: fn(),
    showDropzone: false,
    showBulkActions: false,
    showCreateFolder: false,
  },
  render: (args: typeof meta.args) => (
    <div className="w-full max-w-6xl">
      <FileBrowser {...args}>
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
              {args.files?.map((file: StorageFile) => (
                <FileListItem
                  key={file.id}
                  file={{
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    modified: file.uploadedAt,
                    mimeType: file.mimeType,
                    isFolder: file.isFolder,
                  }}
                  showCheckbox={false}
                  onAction={(action) => console.log('Action:', action, file.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </FileBrowser>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Minimal configuration with bulk actions, dropzone, and folder creation disabled. Simple read-only file list.',
      },
    },
  },
}
