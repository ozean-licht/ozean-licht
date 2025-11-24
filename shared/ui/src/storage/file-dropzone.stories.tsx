/**
 * File Dropzone - Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { FileDropzone } from './file-dropzone'
import { useState } from 'react'

const meta = {
  title: 'Storage/FileDropzone',
  component: FileDropzone,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Drag & drop file upload zone with visual feedback. Supports file type restrictions, size limits, single/multiple file uploads, and automatic error handling. Built with react-dropzone and styled with Ozean Licht design system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onFilesSelected: {
      action: 'files selected',
      description: 'Callback when files are successfully selected/dropped',
    },
    accept: {
      control: 'object',
      description: 'File type restrictions (MIME types)',
      table: {
        type: {
          summary: 'Record<string, string[]>',
        },
      },
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes',
      table: {
        defaultValue: { summary: '104857600 (100MB)' },
      },
    },
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files allowed',
      table: {
        defaultValue: { summary: '10' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the dropzone',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple file selection',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-8 bg-background rounded-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileDropzone>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default dropzone configuration.
 * Accepts any file type up to 100MB, maximum 10 files.
 */
export const Default: Story = {
  args: {
    onFilesSelected: (files) => {
      console.log('Files selected:', files)
    },
  },
}

/**
 * Images only dropzone.
 * Restricts uploads to common image formats (JPEG, PNG, GIF, WebP, SVG).
 */
export const ImagesOnly: Story = {
  args: {
    onFilesSelected: (files) => {
      console.log('Images selected:', files)
    },
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB for images
    maxFiles: 20,
  },
}

/**
 * Documents only dropzone.
 * Restricts uploads to PDF, Word, and text documents.
 */
export const DocumentsOnly: Story = {
  args: {
    onFilesSelected: (files) => {
      console.log('Documents selected:', files)
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB for documents
  },
}

/**
 * Videos only dropzone.
 * Restricts uploads to common video formats with larger size limit.
 */
export const VideosOnly: Story = {
  args: {
    onFilesSelected: (files) => {
      console.log('Videos selected:', files)
    },
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
      'video/webm': ['.webm'],
    },
    maxSize: 500 * 1024 * 1024, // 500MB for videos
    maxFiles: 5,
  },
}

/**
 * Single file mode.
 * Only allows one file to be selected at a time.
 */
export const SingleFile: Story = {
  args: {
    onFilesSelected: (files) => {
      console.log('Single file selected:', files[0])
    },
    multiple: false,
    maxFiles: 1,
  },
}

/**
 * Small file size limit.
 * Demonstrates dropzone with a strict 5MB size limit.
 */
export const SmallSizeLimit: Story = {
  args: {
    onFilesSelected: (files) => {
      console.log('Files selected:', files)
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
  },
}

/**
 * Disabled state.
 * Shows the dropzone in a disabled, non-interactive state.
 */
export const Disabled: Story = {
  args: {
    onFilesSelected: (files) => {
      console.log('This should not fire:', files)
    },
    disabled: true,
  },
}

/**
 * Interactive example with file list.
 * Shows selected files below the dropzone with real-time updates.
 */
export const WithFileList: Story = {
  render: () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])

    return (
      <div className="space-y-6 w-full">
        <FileDropzone
          onFilesSelected={(files) => {
            setSelectedFiles((prev) => [...prev, ...files])
          }}
          maxSize={20 * 1024 * 1024}
          maxFiles={10}
        />

        {selectedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-lg text-white">
                Selected Files ({selectedFiles.length})
              </h3>
              <button
                onClick={() => setSelectedFiles([])}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 glass-card rounded-lg"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-white">{file.name}</span>
                    <span className="text-xs text-[#C4C8D4]/70">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
                    }}
                    className="text-destructive hover:text-destructive/80 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  },
}

/**
 * Error demonstration.
 * Shows how the dropzone handles various error states.
 * Try uploading files that exceed the limits to see error messages.
 */
export const ErrorStates: Story = {
  render: () => {
    const [logs, setLogs] = useState<string[]>([])

    const addLog = (message: string) => {
      setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    }

    return (
      <div className="space-y-6 w-full">
        <div className="space-y-2">
          <h3 className="font-decorative text-xl text-white">
            Test Error Conditions
          </h3>
          <ul className="text-sm text-[#C4C8D4] space-y-1 list-disc list-inside">
            <li>Try uploading a file larger than 1MB</li>
            <li>Try uploading more than 2 files</li>
            <li>Try uploading a non-image file</li>
          </ul>
        </div>

        <FileDropzone
          onFilesSelected={(files) => {
            addLog(`Successfully uploaded ${files.length} file(s)`)
          }}
          accept={{
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
          }}
          maxSize={1 * 1024 * 1024} // 1MB
          maxFiles={2}
        />

        {logs.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-sans text-sm text-white">Activity Log</h4>
              <button
                onClick={() => setLogs([])}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="p-3 glass-card rounded-lg space-y-1 max-h-32 overflow-y-auto">
              {logs.map((log, index) => (
                <p key={index} className="text-xs text-[#C4C8D4] font-mono">
                  {log}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  },
}

/**
 * All file type examples.
 * Shows different configurations for various file types side by side.
 */
export const AllFileTypes: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="w-full min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="font-decorative text-3xl text-white mb-2">
            File Type Configurations
          </h2>
          <p className="text-[#C4C8D4]">
            Different dropzone configurations for various file types
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-3">
            <div>
              <h3 className="font-decorative text-xl text-white">Images</h3>
              <p className="text-sm text-[#C4C8D4]">
                JPEG, PNG, GIF, WebP, SVG up to 10MB
              </p>
            </div>
            <FileDropzone
              onFilesSelected={(files) => console.log('Images:', files)}
              accept={{
                'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
              }}
              maxSize={10 * 1024 * 1024}
            />
          </div>

          {/* Documents */}
          <div className="space-y-3">
            <div>
              <h3 className="font-decorative text-xl text-white">Documents</h3>
              <p className="text-sm text-[#C4C8D4]">
                PDF, Word, Text up to 50MB
              </p>
            </div>
            <FileDropzone
              onFilesSelected={(files) => console.log('Documents:', files)}
              accept={{
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
                  '.docx',
                ],
                'text/plain': ['.txt'],
              }}
              maxSize={50 * 1024 * 1024}
            />
          </div>

          {/* Videos */}
          <div className="space-y-3">
            <div>
              <h3 className="font-decorative text-xl text-white">Videos</h3>
              <p className="text-sm text-[#C4C8D4]">
                MP4, MOV, AVI, WebM up to 500MB
              </p>
            </div>
            <FileDropzone
              onFilesSelected={(files) => console.log('Videos:', files)}
              accept={{
                'video/*': ['.mp4', '.mov', '.avi', '.webm'],
              }}
              maxSize={500 * 1024 * 1024}
              maxFiles={5}
            />
          </div>

          {/* Audio */}
          <div className="space-y-3">
            <div>
              <h3 className="font-decorative text-xl text-white">Audio</h3>
              <p className="text-sm text-[#C4C8D4]">
                MP3, WAV, OGG up to 50MB
              </p>
            </div>
            <FileDropzone
              onFilesSelected={(files) => console.log('Audio:', files)}
              accept={{
                'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'],
              }}
              maxSize={50 * 1024 * 1024}
            />
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Compact variant.
 * Smaller version suitable for inline forms or limited space.
 */
export const Compact: Story = {
  args: {
    onFilesSelected: (files) => {
      console.log('Files selected:', files)
    },
    className: 'p-6',
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-8 bg-background rounded-lg">
        <Story />
      </div>
    ),
  ],
}

/**
 * Full page upload example.
 * Shows dropzone in a realistic file upload interface.
 */
export const FullPageExample: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => {
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)

    const handleUpload = () => {
      setUploading(true)
      // Simulate upload
      setTimeout(() => {
        setUploading(false)
        setFiles([])
        alert('Files uploaded successfully!')
      }, 2000)
    }

    return (
      <div className="w-full min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="font-decorative text-4xl text-white mb-2">
              Upload Files
            </h1>
            <p className="text-[#C4C8D4]">
              Share your files with the team. Supported formats: images, documents,
              videos, and archives.
            </p>
          </div>

          {/* Dropzone */}
          <FileDropzone
            onFilesSelected={(newFiles) => {
              setFiles((prev) => [...prev, ...newFiles])
            }}
            maxSize={100 * 1024 * 1024}
            maxFiles={20}
          />

          {/* Selected files */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-decorative text-2xl text-white">
                  Ready to Upload ({files.length} {files.length === 1 ? 'file' : 'files'})
                </h2>
                <button
                  onClick={() => setFiles([])}
                  className="text-sm text-destructive hover:text-destructive/80 transition-colors"
                >
                  Remove all
                </button>
              </div>

              <div className="grid gap-3">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-4 glass-card rounded-lg"
                  >
                    <div className="flex flex-col flex-1">
                      <span className="text-sm text-white font-medium">
                        {file.name}
                      </span>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-[#C4C8D4]/70">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <span className="text-xs text-[#C4C8D4]/50">•</span>
                        <span className="text-xs text-[#C4C8D4]/70">
                          {file.type || 'Unknown type'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFiles((prev) => prev.filter((_, i) => i !== index))
                      }}
                      className="text-sm text-destructive hover:text-destructive/80 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  onClick={() => setFiles([])}
                  className="px-6 py-2.5 text-white hover:bg-white/5 transition-colors rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : `Upload ${files.length} ${files.length === 1 ? 'file' : 'files'}`}
                </button>
              </div>
            </div>
          )}

          {/* Help text */}
          <div className="p-4 glass-subtle rounded-lg">
            <h3 className="font-sans text-sm text-white mb-2">Upload Guidelines</h3>
            <ul className="text-xs text-[#C4C8D4] space-y-1 list-disc list-inside">
              <li>Maximum file size: 100MB per file</li>
              <li>Maximum files: 20 files at once</li>
              <li>Supported formats: All common file types</li>
              <li>Files are scanned for viruses before upload</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
}
