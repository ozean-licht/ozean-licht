/**
 * File Metadata Panel Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { FileMetadataPanel } from './file-metadata-panel'
import type { StorageFile } from './types'

const meta: Meta<typeof FileMetadataPanel> = {
  title: 'Storage/FileMetadataPanel',
  component: FileMetadataPanel,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#00070F' }] },
  },
  decorators: [(Story) => <div className="w-[380px]"><Story /></div>],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FileMetadataPanel>

const mockFile: StorageFile = {
  id: '1',
  name: 'ocean-landscape.jpg',
  path: 'images/nature/ocean-landscape.jpg',
  size: 3145728,
  mimeType: 'image/jpeg',
  uploadedAt: new Date('2024-11-20T14:30:00'),
  uploadedBy: 'admin@ozean-licht.dev',
  bucket: 'ozean-licht-assets',
  entityScope: 'ozean-licht',
  md5Hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  tags: ['ocean', 'nature', 'landscape'],
  metadata: {
    camera: 'Canon EOS R5',
    location: 'Pacific Ocean',
    resolution: '6000x4000',
  },
}

export const Default: Story = {
  args: { file: mockFile },
}

export const WithActions: Story = {
  args: {
    file: mockFile,
    onCopyUrl: (file) => alert(`Copy URL for ${file.name}`),
    onOpenInBucket: (file) => alert(`Open ${file.name} in bucket`),
  },
}

export const EditableTags: Story = {
  args: {
    file: mockFile,
    onUpdateTags: (file, tags) => console.log('Updated tags:', tags),
  },
}

export const Compact: Story = {
  args: { file: mockFile, compact: true },
}

export const NoMetadata: Story = {
  args: {
    file: {
      ...mockFile,
      uploadedBy: undefined,
      md5Hash: undefined,
      tags: [],
      metadata: undefined,
    },
  },
}
