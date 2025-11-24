/**
 * File Upload Queue - Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { FileUploadQueue } from './file-upload-queue'
import type { UploadProgress } from './types'
import { useState } from 'react'

const meta = {
  title: 'Storage/FileUploadQueue',
  component: FileUploadQueue,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Displays upload progress for multiple files with individual progress bars, status indicators, and actions. Features auto-dismiss for completed uploads, cancel/retry buttons, and configurable positioning. Uses Ozean Licht design system with glassmorphic styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    uploads: {
      control: false,
      description: 'Array of upload progress objects',
    },
    onCancel: {
      action: 'cancel',
      description: 'Callback when user cancels an upload',
    },
    onRetry: {
      action: 'retry',
      description: 'Callback when user retries a failed upload',
    },
    onClear: {
      action: 'clear',
      description: 'Callback when user clears a completed/failed upload',
    },
    position: {
      control: 'select',
      options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
      description: 'Position of the upload queue on screen',
      table: {
        defaultValue: { summary: 'bottom-right' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-decorative text-3xl text-white mb-2">
              File Upload Queue
            </h1>
            <p className="text-[#C4C8D4]">
              Simulated file browser with upload progress tracking
            </p>
          </div>

          {/* Mock file browser interface */}
          <div className="glass-card rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-sans text-lg text-white">My Documents</h2>
              <div className="text-sm text-[#C4C8D4]">3 items</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 glass-subtle rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center text-xs text-primary">
                  PDF
                </div>
                <span className="text-white text-sm">report-2025.pdf</span>
                <span className="text-[#C4C8D4] text-xs ml-auto">2.5 MB</span>
              </div>
              <div className="flex items-center gap-3 p-3 glass-subtle rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center text-xs text-primary">
                  IMG
                </div>
                <span className="text-white text-sm">vacation.jpg</span>
                <span className="text-[#C4C8D4] text-xs ml-auto">3.2 MB</span>
              </div>
              <div className="flex items-center gap-3 p-3 glass-subtle rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center text-xs text-primary">
                  VID
                </div>
                <span className="text-white text-sm">tutorial.mp4</span>
                <span className="text-[#C4C8D4] text-xs ml-auto">45 MB</span>
              </div>
            </div>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUploadQueue>

export default meta
type Story = StoryObj<typeof meta>

// Mock upload data generators
const createMockUpload = (
  id: string,
  fileName: string,
  size: number,
  status: UploadProgress['status'],
  percentage: number = 0,
  error?: string
): UploadProgress => ({
  fileId: id,
  fileName,
  size,
  loaded: Math.floor((size * percentage) / 100),
  percentage,
  status,
  error,
})

/**
 * Empty queue - no uploads.
 * The component returns null when there are no uploads.
 */
export const EmptyQueue: Story = {
  args: {
    uploads: [],
    position: 'bottom-right',
  },
}

/**
 * Single file uploading at 45%.
 * Shows a single active upload with progress bar and cancel button.
 */
export const SingleUpload: Story = {
  args: {
    uploads: [
      createMockUpload('1', 'presentation.pdf', 5242880, 'uploading', 45),
    ],
    position: 'bottom-right',
  },
}

/**
 * Multiple files uploading simultaneously.
 * Shows progress tracking for 4 concurrent uploads with different completion percentages.
 */
export const MultipleUploads: Story = {
  args: {
    uploads: [
      createMockUpload('1', 'presentation.pdf', 5242880, 'uploading', 75),
      createMockUpload('2', 'vacation-photos.zip', 52428800, 'uploading', 35),
      createMockUpload('3', 'tutorial-video.mp4', 104857600, 'uploading', 15),
      createMockUpload('4', 'document.docx', 1048576, 'uploading', 90),
    ],
    position: 'bottom-right',
  },
}

/**
 * All uploads completed successfully.
 * Shows completed state with checkmarks. Auto-dismisses after 3 seconds.
 */
export const CompletedUploads: Story = {
  args: {
    uploads: [
      createMockUpload('1', 'presentation.pdf', 5242880, 'completed', 100),
      createMockUpload('2', 'vacation-photos.zip', 52428800, 'completed', 100),
      createMockUpload('3', 'document.docx', 1048576, 'completed', 100),
    ],
    position: 'bottom-right',
  },
}

/**
 * Upload failed with error message.
 * Shows error state with retry button and detailed error message.
 */
export const FailedUpload: Story = {
  args: {
    uploads: [
      createMockUpload('1', 'presentation.pdf', 5242880, 'uploading', 65),
      createMockUpload(
        '2',
        'large-video.mp4',
        524288000,
        'error',
        45,
        'Network connection lost. Please check your internet and try again.'
      ),
      createMockUpload('3', 'document.docx', 1048576, 'pending', 0),
    ],
    position: 'bottom-right',
  },
}

/**
 * Cancelled upload with mixed states.
 * Shows cancelled upload alongside active uploads.
 */
export const CancelledUpload: Story = {
  args: {
    uploads: [
      createMockUpload('1', 'presentation.pdf', 5242880, 'completed', 100),
      createMockUpload('2', 'vacation-photos.zip', 52428800, 'cancelled', 30),
      createMockUpload('3', 'tutorial-video.mp4', 104857600, 'uploading', 55),
    ],
    position: 'bottom-right',
  },
}

/**
 * Mixed upload states.
 * Comprehensive example showing all possible states: pending, uploading, completed, error, cancelled.
 */
export const MixedStates: Story = {
  args: {
    uploads: [
      createMockUpload('1', 'report-2025.pdf', 2097152, 'completed', 100),
      createMockUpload('2', 'presentation.pptx', 8388608, 'uploading', 72),
      createMockUpload(
        '3',
        'large-dataset.csv',
        52428800,
        'error',
        35,
        'File size exceeds limit'
      ),
      createMockUpload('4', 'photo-album.zip', 104857600, 'uploading', 28),
      createMockUpload('5', 'notes.txt', 10240, 'cancelled', 15),
      createMockUpload('6', 'video-tutorial.mp4', 209715200, 'pending', 0),
    ],
    position: 'bottom-right',
  },
}

/**
 * Queue positioned at bottom-left.
 * Shows upload queue in the bottom-left corner of the screen.
 */
export const PositionBottomLeft: Story = {
  args: {
    uploads: [
      createMockUpload('1', 'presentation.pdf', 5242880, 'uploading', 60),
      createMockUpload('2', 'document.docx', 1048576, 'uploading', 30),
    ],
    position: 'bottom-left',
  },
}

/**
 * Queue positioned at top-right.
 * Shows upload queue in the top-right corner of the screen.
 */
export const PositionTopRight: Story = {
  args: {
    uploads: [
      createMockUpload('1', 'presentation.pdf', 5242880, 'uploading', 60),
      createMockUpload('2', 'document.docx', 1048576, 'uploading', 30),
    ],
    position: 'top-right',
  },
}

/**
 * Queue positioned at top-left.
 * Shows upload queue in the top-left corner of the screen.
 */
export const PositionTopLeft: Story = {
  args: {
    uploads: [
      createMockUpload('1', 'presentation.pdf', 5242880, 'uploading', 60),
      createMockUpload('2', 'document.docx', 1048576, 'uploading', 30),
    ],
    position: 'top-left',
  },
}

/**
 * Interactive demo with simulated progress.
 * Demonstrates live upload progress simulation with all interactions.
 */
export const InteractiveDemo: Story = {
  render: function InteractiveDemoRender() {
    const [uploads, setUploads] = useState<UploadProgress[]>([
      createMockUpload('1', 'presentation.pdf', 5242880, 'uploading', 0),
      createMockUpload('2', 'vacation-photos.zip', 52428800, 'uploading', 0),
      createMockUpload('3', 'tutorial-video.mp4', 104857600, 'uploading', 0),
    ])

    // Simulate upload progress
    useState(() => {
      const interval = setInterval(() => {
        setUploads((prev) =>
          prev.map((upload) => {
            if (upload.status === 'uploading' && upload.percentage < 100) {
              const newPercentage = Math.min(upload.percentage + Math.random() * 10, 100)
              return {
                ...upload,
                percentage: Math.round(newPercentage),
                loaded: Math.floor((upload.size * newPercentage) / 100),
                status: newPercentage >= 100 ? 'completed' : 'uploading',
              }
            }
            return upload
          })
        )
      }, 500)

      return () => clearInterval(interval)
    })

    const handleCancel = (fileId: string) => {
      setUploads((prev) =>
        prev.map((upload) =>
          upload.fileId === fileId
            ? { ...upload, status: 'cancelled' as const }
            : upload
        )
      )
    }

    const handleRetry = (fileId: string) => {
      setUploads((prev) =>
        prev.map((upload) =>
          upload.fileId === fileId
            ? { ...upload, status: 'uploading' as const, percentage: 0, error: undefined }
            : upload
        )
      )
    }

    const handleClear = (fileId: string) => {
      setUploads((prev) => prev.filter((upload) => upload.fileId !== fileId))
    }

    const handleAddUpload = () => {
      const id = Date.now().toString()
      const files = [
        { name: 'new-document.pdf', size: 2097152 },
        { name: 'image-gallery.zip', size: 31457280 },
        { name: 'video-recording.mp4', size: 78643200 },
      ]
      const randomFile = files[Math.floor(Math.random() * files.length)]

      setUploads((prev) => [
        ...prev,
        createMockUpload(id, randomFile.name, randomFile.size, 'uploading', 0),
      ])
    }

    const handleSimulateError = () => {
      if (uploads.length > 0) {
        const randomIndex = Math.floor(Math.random() * uploads.length)
        setUploads((prev) =>
          prev.map((upload, idx) =>
            idx === randomIndex
              ? {
                  ...upload,
                  status: 'error' as const,
                  error: 'Simulated network error. Click retry to continue.',
                }
              : upload
          )
        )
      }
    }

    return (
      <>
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          <button
            onClick={handleAddUpload}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            Add Upload
          </button>
          <button
            onClick={handleSimulateError}
            className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors text-sm"
          >
            Simulate Error
          </button>
          <button
            onClick={() => setUploads([])}
            className="px-4 py-2 bg-card text-white rounded-lg hover:bg-card/80 transition-colors text-sm"
          >
            Clear All
          </button>
        </div>
        <FileUploadQueue
          uploads={uploads}
          onCancel={handleCancel}
          onRetry={handleRetry}
          onClear={handleClear}
          position="bottom-right"
        />
      </>
    )
  },
}

/**
 * Large file uploads with realistic sizes.
 * Shows uploads of various large files with appropriate size formatting.
 */
export const LargeFiles: Story = {
  args: {
    uploads: [
      createMockUpload('1', '4K-video-raw.mov', 2147483648, 'uploading', 25), // 2 GB
      createMockUpload('2', 'project-backup.tar.gz', 524288000, 'uploading', 60), // 500 MB
      createMockUpload('3', 'database-dump.sql', 104857600, 'uploading', 85), // 100 MB
    ],
    position: 'bottom-right',
  },
}

/**
 * Small files uploading quickly.
 * Shows multiple small files at high completion percentages.
 */
export const SmallFiles: Story = {
  args: {
    uploads: [
      createMockUpload('1', 'config.json', 2048, 'uploading', 95),
      createMockUpload('2', 'notes.txt', 4096, 'completed', 100),
      createMockUpload('3', 'thumbnail.jpg', 51200, 'uploading', 88),
      createMockUpload('4', 'README.md', 8192, 'uploading', 92),
    ],
    position: 'bottom-right',
  },
}

/**
 * All position variants comparison.
 * Shows the upload queue in all four corner positions side by side.
 */
export const AllPositions: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => {
    const mockUploads = [
      createMockUpload('1', 'file.pdf', 5242880, 'uploading', 65),
      createMockUpload('2', 'video.mp4', 52428800, 'uploading', 40),
    ]

    return (
      <div className="relative min-h-screen bg-background">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="font-decorative text-3xl text-white">
              Upload Queue Positions
            </h2>
            <p className="text-[#C4C8D4] max-w-md">
              Upload queues appear in all four corners. Each shows the same two files
              uploading at different progress percentages.
            </p>
          </div>
        </div>

        {/* Bottom Right */}
        <FileUploadQueue
          uploads={mockUploads}
          position="bottom-right"
          onCancel={() => {}}
          onRetry={() => {}}
          onClear={() => {}}
        />

        {/* Bottom Left */}
        <FileUploadQueue
          uploads={mockUploads}
          position="bottom-left"
          onCancel={() => {}}
          onRetry={() => {}}
          onClear={() => {}}
        />

        {/* Top Right */}
        <FileUploadQueue
          uploads={mockUploads}
          position="top-right"
          onCancel={() => {}}
          onRetry={() => {}}
          onClear={() => {}}
        />

        {/* Top Left */}
        <FileUploadQueue
          uploads={mockUploads}
          position="top-left"
          onCancel={() => {}}
          onRetry={() => {}}
          onClear={() => {}}
        />
      </div>
    )
  },
}

/**
 * Scrollable queue with many uploads.
 * Demonstrates the max-height scroll behavior with 10+ files.
 */
export const ScrollableQueue: Story = {
  args: {
    uploads: [
      createMockUpload('1', 'report-q1.pdf', 2097152, 'completed', 100),
      createMockUpload('2', 'report-q2.pdf', 2097152, 'completed', 100),
      createMockUpload('3', 'report-q3.pdf', 2097152, 'uploading', 85),
      createMockUpload('4', 'presentation-jan.pptx', 8388608, 'uploading', 70),
      createMockUpload('5', 'presentation-feb.pptx', 8388608, 'uploading', 55),
      createMockUpload('6', 'presentation-mar.pptx', 8388608, 'uploading', 40),
      createMockUpload('7', 'video-tutorial-1.mp4', 104857600, 'uploading', 25),
      createMockUpload('8', 'video-tutorial-2.mp4', 104857600, 'uploading', 10),
      createMockUpload(
        '9',
        'large-dataset.csv',
        52428800,
        'error',
        30,
        'Connection timeout'
      ),
      createMockUpload('10', 'backup.zip', 209715200, 'pending', 0),
      createMockUpload('11', 'photos-2025.zip', 524288000, 'pending', 0),
      createMockUpload('12', 'documents.tar.gz', 104857600, 'cancelled', 15),
    ],
    position: 'bottom-right',
  },
}

/**
 * Error states with different messages.
 * Shows various error scenarios with different error messages.
 */
export const ErrorStates: Story = {
  args: {
    uploads: [
      createMockUpload(
        '1',
        'oversized-file.mov',
        5368709120,
        'error',
        0,
        'File exceeds maximum size limit of 5 GB'
      ),
      createMockUpload(
        '2',
        'invalid-format.xyz',
        1048576,
        'error',
        0,
        'File type not supported'
      ),
      createMockUpload(
        '3',
        'network-failed.pdf',
        5242880,
        'error',
        45,
        'Network connection lost. Please check your internet and try again.'
      ),
      createMockUpload(
        '4',
        'permission-denied.docx',
        2097152,
        'error',
        0,
        'Insufficient permissions to upload to this folder'
      ),
      createMockUpload(
        '5',
        'server-error.zip',
        52428800,
        'error',
        75,
        'Server error occurred. Please try again later.'
      ),
    ],
    position: 'bottom-right',
  },
}

/**
 * Pending uploads queue.
 * Shows files waiting to start uploading (0% progress with pending status).
 */
export const PendingUploads: Story = {
  args: {
    uploads: [
      createMockUpload('1', 'file-1.pdf', 5242880, 'uploading', 85),
      createMockUpload('2', 'file-2.pdf', 5242880, 'uploading', 60),
      createMockUpload('3', 'file-3.pdf', 5242880, 'uploading', 35),
      createMockUpload('4', 'file-4.pdf', 5242880, 'pending', 0),
      createMockUpload('5', 'file-5.pdf', 5242880, 'pending', 0),
      createMockUpload('6', 'file-6.pdf', 5242880, 'pending', 0),
    ],
    position: 'bottom-right',
  },
}
