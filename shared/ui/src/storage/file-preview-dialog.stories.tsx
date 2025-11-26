/**
 * File Preview Dialog Stories
 * Storybook stories for the File Preview Dialog component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FilePreviewDialog } from './file-preview-dialog'
import type { StorageFile } from './types'
import { Button } from '../cossui/button'

const meta: Meta<typeof FilePreviewDialog> = {
  title: 'Storage/Phase 3/FilePreviewDialog',
  component: FilePreviewDialog,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#00070F' }],
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FilePreviewDialog>

// Mock files
const mockImageFile: StorageFile = {
  id: '1',
  name: 'ocean-waves.jpg',
  path: 'images/ocean-waves.jpg',
  size: 2457600, // 2.4 MB
  mimeType: 'image/jpeg',
  uploadedAt: new Date('2024-11-20T10:30:00'),
  uploadedBy: 'admin@ozean-licht.dev',
  bucket: 'ozean-licht-assets',
  entityScope: 'ozean-licht',
  md5Hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  tags: ['ocean', 'nature', 'photography'],
}

const mockVideoFile: StorageFile = {
  id: '2',
  name: 'intro-video.mp4',
  path: 'videos/intro-video.mp4',
  size: 15728640, // 15 MB
  mimeType: 'video/mp4',
  uploadedAt: new Date('2024-11-21T14:20:00'),
  uploadedBy: 'content@ozean-licht.dev',
  bucket: 'ozean-licht-assets',
  entityScope: 'ozean-licht',
  md5Hash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7',
  tags: ['video', 'intro', 'marketing'],
}

const mockPdfFile: StorageFile = {
  id: '3',
  name: 'course-material.pdf',
  path: 'documents/course-material.pdf',
  size: 5242880, // 5 MB
  mimeType: 'application/pdf',
  uploadedAt: new Date('2024-11-22T09:15:00'),
  uploadedBy: 'teacher@ozean-licht.dev',
  bucket: 'kids-ascension-staging',
  entityScope: 'kids-ascension',
  md5Hash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8',
  tags: ['education', 'course', 'pdf'],
}

const mockUnsupportedFile: StorageFile = {
  id: '4',
  name: 'data-export.zip',
  path: 'exports/data-export.zip',
  size: 10485760, // 10 MB
  mimeType: 'application/zip',
  uploadedAt: new Date('2024-11-23T16:45:00'),
  uploadedBy: 'admin@ozean-licht.dev',
  bucket: 'shared-assets',
  entityScope: 'shared',
  md5Hash: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9',
}

const mockFiles = [mockImageFile, mockVideoFile, mockPdfFile, mockUnsupportedFile]

// Interactive wrapper component
function PreviewDialogWrapper(props: Partial<typeof FilePreviewDialog>) {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90">
        Open Preview Dialog
      </Button>
      <FilePreviewDialog
        file={mockImageFile}
        open={open}
        onOpenChange={setOpen}
        {...props}
      />
    </div>
  )
}

export const ImagePreview: Story = {
  render: () => <PreviewDialogWrapper file={mockImageFile} />,
  parameters: {
    docs: {
      description: {
        story: 'Preview dialog for JPEG image with zoom and rotate controls.',
      },
    },
  },
}

export const VideoPreview: Story = {
  render: () => <PreviewDialogWrapper file={mockVideoFile} />,
  parameters: {
    docs: {
      description: {
        story: 'Preview dialog for MP4 video with play/pause and volume controls.',
      },
    },
  },
}

export const PdfPreview: Story = {
  render: () => <PreviewDialogWrapper file={mockPdfFile} />,
  parameters: {
    docs: {
      description: {
        story: 'Preview dialog for PDF document with inline viewer.',
      },
    },
  },
}

export const UnsupportedFile: Story = {
  render: () => <PreviewDialogWrapper file={mockUnsupportedFile} />,
  parameters: {
    docs: {
      description: {
        story: 'Preview dialog for unsupported file type showing download option.',
      },
    },
  },
}

export const WithNavigation: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [currentFile, setCurrentFile] = useState(mockFiles[0])

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90">
          Open with Navigation (4 files)
        </Button>
        <FilePreviewDialog
          file={currentFile}
          files={mockFiles}
          open={open}
          onOpenChange={setOpen}
          onNavigate={setCurrentFile}
          onDownload={(file) => console.log('Download:', file.name)}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Preview dialog with previous/next navigation through multiple files.',
      },
    },
  },
}

export const WithDownloadHandler: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90">
          Open with Download
        </Button>
        <FilePreviewDialog
          file={mockImageFile}
          open={open}
          onOpenChange={setOpen}
          onDownload={(file) => {
            console.log('Downloading:', file.name)
            alert(`Downloading ${file.name}`)
          }}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Preview dialog with download button in header.',
      },
    },
  },
}

export const ImageWithTags: Story = {
  render: () => {
    const fileWithManyTags: StorageFile = {
      ...mockImageFile,
      tags: ['ocean', 'nature', 'photography', 'blue', 'waves', 'seascape', 'water'],
    }

    return <PreviewDialogWrapper file={fileWithManyTags} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Preview dialog showing file with multiple tags in metadata sidebar.',
      },
    },
  },
}

export const NoMetadata: Story = {
  render: () => {
    const fileWithoutMetadata: StorageFile = {
      id: '5',
      name: 'simple-image.png',
      path: 'images/simple-image.png',
      size: 1048576,
      mimeType: 'image/png',
      uploadedAt: new Date(),
      bucket: 'shared-assets',
    }

    return <PreviewDialogWrapper file={fileWithoutMetadata} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Preview dialog with minimal metadata (no tags, uploader, or checksum).',
      },
    },
  },
}

export const LargeImage: Story = {
  render: () => {
    const largeFile: StorageFile = {
      ...mockImageFile,
      name: 'high-resolution-panorama.jpg',
      size: 52428800, // 50 MB
      path: 'images/high-resolution-panorama.jpg',
    }

    return <PreviewDialogWrapper file={largeFile} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Preview dialog for large high-resolution image (50 MB).',
      },
    },
  },
}

export const LongFileName: Story = {
  render: () => {
    const fileWithLongName: StorageFile = {
      ...mockImageFile,
      name: 'this-is-a-very-long-filename-that-should-be-truncated-in-the-header-to-prevent-layout-issues.jpg',
      path: 'images/long-path/nested/deeply/this-is-a-very-long-filename-that-should-be-truncated-in-the-header-to-prevent-layout-issues.jpg',
    }

    return <PreviewDialogWrapper file={fileWithLongName} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Preview dialog with very long filename to test truncation.',
      },
    },
  },
}

export const GifImage: Story = {
  render: () => {
    const gifFile: StorageFile = {
      ...mockImageFile,
      name: 'animated-ocean.gif',
      mimeType: 'image/gif',
      path: 'images/animated-ocean.gif',
    }

    return <PreviewDialogWrapper file={gifFile} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Preview dialog for animated GIF image.',
      },
    },
  },
}

export const WebPImage: Story = {
  render: () => {
    const webpFile: StorageFile = {
      ...mockImageFile,
      name: 'modern-format.webp',
      mimeType: 'image/webp',
      path: 'images/modern-format.webp',
    }

    return <PreviewDialogWrapper file={webpFile} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Preview dialog for WebP image format.',
      },
    },
  },
}

export const WebMVideo: Story = {
  render: () => {
    const webmFile: StorageFile = {
      ...mockVideoFile,
      name: 'intro-video.webm',
      mimeType: 'video/webm',
      path: 'videos/intro-video.webm',
    }

    return <PreviewDialogWrapper file={webmFile} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Preview dialog for WebM video format.',
      },
    },
  },
}

export const KeyboardShortcuts: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-8 space-y-4">
        <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90">
          Open Dialog (Try Keyboard Shortcuts)
        </Button>
        <div className="glass-card rounded-lg p-4 max-w-md">
          <h3 className="font-sans text-sm text-white mb-2">Keyboard Shortcuts</h3>
          <ul className="text-xs text-[#C4C8D4] space-y-1 font-mono">
            <li>ESC - Close dialog</li>
            <li>← / → - Navigate between files</li>
            <li>+ / - - Zoom in/out (images)</li>
            <li>R - Rotate image</li>
            <li>SPACE - Play/pause video</li>
          </ul>
        </div>
        <FilePreviewDialog
          file={mockImageFile}
          files={mockFiles}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Preview dialog demonstrating keyboard shortcut functionality.',
      },
    },
  },
}
