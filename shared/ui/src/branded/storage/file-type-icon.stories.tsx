/**
 * File Type Icon - Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { FileTypeIcon } from './file-type-icon'

const meta = {
  title: 'Storage/FileTypeIcon',
  component: FileTypeIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Displays appropriate Lucide icon for file types with Ozean Licht branding. Icons are automatically colored based on file category (turquoise for images/videos/folders, muted for documents/archives).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    filename: {
      control: 'text',
      description: 'Filename or file path (used to determine icon)',
    },
    mimeType: {
      control: 'text',
      description: 'MIME type (alternative to filename)',
    },
    category: {
      control: 'select',
      options: ['image', 'video', 'document', 'archive', 'audio', 'code', 'folder', 'unknown'],
      description: 'File type category (alternative to filename/mimeType)',
    },
    isFolder: {
      control: 'boolean',
      description: 'Whether the item is a folder',
    },
    isOpen: {
      control: 'boolean',
      description: 'Whether the folder is open (only for folders)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Icon size preset',
    },
  },
} satisfies Meta<typeof FileTypeIcon>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default icon using filename
 */
export const Default: Story = {
  args: {
    filename: 'photo.jpg',
    size: 'md',
  },
}

/**
 * All file type categories
 */
export const AllCategories: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <h3 className="font-decorative text-2xl text-white mb-2">File Type Icons</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Images */}
        <div className="flex flex-col items-center gap-2 p-4 glass-card rounded-lg">
          <FileTypeIcon category="image" size="xl" />
          <span className="text-sm text-[#C4C8D4]">Image</span>
          <span className="text-xs text-[#C4C8D4]/70">photo.jpg</span>
        </div>

        {/* Videos */}
        <div className="flex flex-col items-center gap-2 p-4 glass-card rounded-lg">
          <FileTypeIcon category="video" size="xl" />
          <span className="text-sm text-[#C4C8D4]">Video</span>
          <span className="text-xs text-[#C4C8D4]/70">video.mp4</span>
        </div>

        {/* Documents */}
        <div className="flex flex-col items-center gap-2 p-4 glass-card rounded-lg">
          <FileTypeIcon category="document" size="xl" />
          <span className="text-sm text-[#C4C8D4]">Document</span>
          <span className="text-xs text-[#C4C8D4]/70">report.pdf</span>
        </div>

        {/* Archives */}
        <div className="flex flex-col items-center gap-2 p-4 glass-card rounded-lg">
          <FileTypeIcon category="archive" size="xl" />
          <span className="text-sm text-[#C4C8D4]">Archive</span>
          <span className="text-xs text-[#C4C8D4]/70">files.zip</span>
        </div>

        {/* Audio */}
        <div className="flex flex-col items-center gap-2 p-4 glass-card rounded-lg">
          <FileTypeIcon category="audio" size="xl" />
          <span className="text-sm text-[#C4C8D4]">Audio</span>
          <span className="text-xs text-[#C4C8D4]/70">song.mp3</span>
        </div>

        {/* Code */}
        <div className="flex flex-col items-center gap-2 p-4 glass-card rounded-lg">
          <FileTypeIcon category="code" size="xl" />
          <span className="text-sm text-[#C4C8D4]">Code</span>
          <span className="text-xs text-[#C4C8D4]/70">script.ts</span>
        </div>

        {/* Folder (closed) */}
        <div className="flex flex-col items-center gap-2 p-4 glass-card rounded-lg">
          <FileTypeIcon category="folder" size="xl" />
          <span className="text-sm text-[#C4C8D4]">Folder</span>
          <span className="text-xs text-[#C4C8D4]/70">Closed</span>
        </div>

        {/* Folder (open) */}
        <div className="flex flex-col items-center gap-2 p-4 glass-card rounded-lg">
          <FileTypeIcon category="folder" isOpen size="xl" />
          <span className="text-sm text-[#C4C8D4]">Folder</span>
          <span className="text-xs text-[#C4C8D4]/70">Open</span>
        </div>
      </div>
    </div>
  ),
}

/**
 * All icon sizes
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <h3 className="font-decorative text-2xl text-white mb-2">Icon Sizes</h3>

      <div className="flex items-end gap-8">
        <div className="flex flex-col items-center gap-2">
          <FileTypeIcon filename="photo.jpg" size="sm" />
          <span className="text-xs text-[#C4C8D4]">sm (16px)</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <FileTypeIcon filename="photo.jpg" size="md" />
          <span className="text-xs text-[#C4C8D4]">md (20px)</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <FileTypeIcon filename="photo.jpg" size="lg" />
          <span className="text-xs text-[#C4C8D4]">lg (24px)</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <FileTypeIcon filename="photo.jpg" size="xl" />
          <span className="text-xs text-[#C4C8D4]">xl (32px)</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <FileTypeIcon filename="photo.jpg" size="2xl" />
          <span className="text-xs text-[#C4C8D4]">2xl (48px)</span>
        </div>
      </div>
    </div>
  ),
}

/**
 * Real-world filenames
 */
export const RealWorldExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <h3 className="font-decorative text-2xl text-white mb-2">Real-World Files</h3>

      <div className="space-y-3">
        {[
          { name: 'vacation-photo.jpg', desc: 'JPEG Image' },
          { name: 'presentation.pdf', desc: 'PDF Document' },
          { name: 'tutorial-video.mp4', desc: 'MP4 Video' },
          { name: 'project-files.zip', desc: 'ZIP Archive' },
          { name: 'podcast-episode.mp3', desc: 'MP3 Audio' },
          { name: 'index.tsx', desc: 'TypeScript Code' },
          { name: 'README.md', desc: 'Markdown Document' },
          { name: 'database-backup.tar.gz', desc: 'Compressed Archive' },
        ].map((file) => (
          <div
            key={file.name}
            className="flex items-center gap-3 p-3 glass-card rounded-lg hover:glass-hover transition-colors"
          >
            <FileTypeIcon filename={file.name} size="md" />
            <div className="flex flex-col">
              <span className="text-sm text-white">{file.name}</span>
              <span className="text-xs text-[#C4C8D4]/70">{file.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}

/**
 * Folder states
 */
export const FolderStates: Story = {
  render: () => (
    <div className="flex gap-8 p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="p-6 glass-card rounded-lg">
          <FileTypeIcon filename="Documents" isFolder size="2xl" />
        </div>
        <div className="text-center">
          <div className="text-sm text-white">Closed Folder</div>
          <div className="text-xs text-[#C4C8D4]/70">Default state</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="p-6 glass-card rounded-lg">
          <FileTypeIcon filename="Documents" isFolder isOpen size="2xl" />
        </div>
        <div className="text-center">
          <div className="text-sm text-white">Open Folder</div>
          <div className="text-xs text-[#C4C8D4]/70">Active state</div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Usage in list view
 */
export const ListViewUsage: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6 max-w-2xl">
      <h3 className="font-decorative text-2xl text-white mb-2">List View Example</h3>

      <div className="glass-card rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#0E282E]">
              <th className="text-left p-3 text-sm font-normal text-[#C4C8D4]">Name</th>
              <th className="text-left p-3 text-sm font-normal text-[#C4C8D4]">Size</th>
              <th className="text-left p-3 text-sm font-normal text-[#C4C8D4]">Modified</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Documents', size: '—', modified: 'Today', isFolder: true },
              { name: 'vacation-2025.jpg', size: '2.5 MB', modified: '2 hours ago' },
              { name: 'report.pdf', size: '1.2 MB', modified: 'Yesterday' },
              { name: 'video.mp4', size: '45 MB', modified: '3 days ago' },
            ].map((file) => (
              <tr key={file.name} className="border-b border-[#0E282E]/50 hover:bg-primary/5">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <FileTypeIcon
                      filename={file.name}
                      isFolder={file.isFolder}
                      size="md"
                    />
                    <span className="text-sm text-white">{file.name}</span>
                  </div>
                </td>
                <td className="p-3 text-sm text-[#C4C8D4]">{file.size}</td>
                <td className="p-3 text-sm text-[#C4C8D4]">{file.modified}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
}

/**
 * Usage in grid view
 */
export const GridViewUsage: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      <h3 className="font-decorative text-2xl text-white mb-2">Grid View Example</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'vacation.jpg', size: '2.5 MB' },
          { name: 'report.pdf', size: '1.2 MB' },
          { name: 'video.mp4', size: '45 MB' },
          { name: 'song.mp3', size: '8.5 MB' },
        ].map((file) => (
          <div
            key={file.name}
            className="flex flex-col items-center gap-3 p-4 glass-card rounded-lg hover:glass-hover transition-colors cursor-pointer"
          >
            <FileTypeIcon filename={file.name} size="2xl" />
            <div className="text-center w-full">
              <div className="text-sm text-white truncate">{file.name}</div>
              <div className="text-xs text-[#C4C8D4]/70">{file.size}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}
