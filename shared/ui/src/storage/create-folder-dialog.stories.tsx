/**
 * Create Folder Dialog - Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CreateFolderDialog } from './create-folder-dialog'
import { FolderPlus } from 'lucide-react'
import { Button } from '../cossui/button'

const meta = {
  title: 'Storage/CreateFolderDialog',
  component: CreateFolderDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Modal dialog for creating new folders in the storage system. Includes comprehensive validation for folder names (checks for invalid characters, reserved names, duplicates, and length). Features real-time validation feedback, loading states, and error handling with Ozean Licht glass morphism design.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls dialog visibility',
      table: {
        defaultValue: { summary: false },
      },
    },
    onOpenChange: {
      action: 'onOpenChange',
      description: 'Callback when dialog open state changes',
    },
    onCreateFolder: {
      action: 'onCreateFolder',
      description: 'Callback when folder creation is confirmed',
    },
    currentPath: {
      control: 'text',
      description: 'Current path where folder will be created',
      table: {
        defaultValue: { summary: '/' },
      },
    },
    existingFolders: {
      control: 'object',
      description: 'Array of existing folder names (for duplicate validation)',
      table: {
        defaultValue: { summary: '[]' },
      },
    },
    maxLength: {
      control: 'number',
      description: 'Maximum length for folder names',
      table: {
        defaultValue: { summary: 255 },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CreateFolderDialog>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default open dialog at root path.
 * Shows the dialog in its default state with no existing folders.
 */
export const DefaultOpen: Story = {
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <FolderPlus className="h-4 w-4" />
          Create Folder
        </Button>
        <CreateFolderDialog
          open={open}
          onOpenChange={setOpen}
          onCreateFolder={async (folderName) => {
            console.log('Creating folder:', folderName)
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }}
          currentPath="/"
        />
      </>
    )
  },
}

/**
 * Dialog at root path.
 * Create a new folder at the root level of the storage bucket.
 */
export const AtRootPath: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <FolderPlus className="h-4 w-4" />
          New Folder at Root
        </Button>
        <CreateFolderDialog
          open={open}
          onOpenChange={setOpen}
          onCreateFolder={async (folderName) => {
            console.log('Creating folder at root:', folderName)
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }}
          currentPath="/"
        />
      </>
    )
  },
}

/**
 * Dialog in nested path.
 * Create a folder deep within a nested directory structure.
 */
export const InNestedPath: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <FolderPlus className="h-4 w-4" />
          New Folder in Nested Path
        </Button>
        <CreateFolderDialog
          open={open}
          onOpenChange={setOpen}
          onCreateFolder={async (folderName) => {
            console.log('Creating folder in nested path:', folderName)
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }}
          currentPath="/documents/projects/2025/quarterly-reports"
        />
      </>
    )
  },
}

/**
 * With existing folders (duplicate validation).
 * Tests the duplicate folder name validation with several existing folders.
 * Try typing "Projects", "Documents", or "Images" to see the validation error.
 */
export const WithExistingFolders: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const existingFolders = ['Projects', 'Documents', 'Images', 'Videos', 'Archive']

    return (
      <>
        <div className="text-center space-y-4">
          <Button onClick={() => setOpen(true)} className="gap-2">
            <FolderPlus className="h-4 w-4" />
            New Folder (with existing)
          </Button>
          <div className="text-sm text-[#C4C8D4]">
            <p className="mb-2">Existing folders:</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {existingFolders.map((folder) => (
                <span key={folder} className="px-2 py-1 bg-card/50 rounded text-xs">
                  {folder}
                </span>
              ))}
            </div>
          </div>
        </div>
        <CreateFolderDialog
          open={open}
          onOpenChange={setOpen}
          onCreateFolder={async (folderName) => {
            console.log('Creating folder:', folderName)
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }}
          currentPath="/my-bucket"
          existingFolders={existingFolders}
        />
      </>
    )
  },
}

/**
 * Loading state.
 * Shows the dialog with loading state while creating the folder.
 * The create button is disabled and shows a spinner.
 */
export const LoadingState: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <FolderPlus className="h-4 w-4" />
          Test Loading State
        </Button>
        <CreateFolderDialog
          open={open}
          onOpenChange={setOpen}
          onCreateFolder={async (folderName) => {
            console.log('Creating folder (slow):', folderName)
            // Simulate slow API call
            await new Promise((resolve) => setTimeout(resolve, 3000))
          }}
          currentPath="/documents"
        />
      </>
    )
  },
}

/**
 * Validation error - invalid characters.
 * Demonstrates validation error when entering invalid characters.
 * Try typing characters like: < > : " / \ | ? *
 */
export const ValidationErrorInvalidChars: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <div className="text-center space-y-4">
          <Button onClick={() => setOpen(true)} className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Test Invalid Characters
          </Button>
          <p className="text-sm text-[#C4C8D4] max-w-md">
            Try typing invalid characters: {'< > : " / \\ | ? *'}
          </p>
        </div>
        <CreateFolderDialog
          open={open}
          onOpenChange={setOpen}
          onCreateFolder={async (folderName) => {
            console.log('Creating folder:', folderName)
          }}
          currentPath="/documents"
        />
      </>
    )
  },
}

/**
 * Validation error - reserved names.
 * Demonstrates validation error for system reserved names.
 * Try typing: con, prn, aux, nul, com1, lpt1, . or ..
 */
export const ValidationErrorReservedNames: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <div className="text-center space-y-4">
          <Button onClick={() => setOpen(true)} className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Test Reserved Names
          </Button>
          <p className="text-sm text-[#C4C8D4] max-w-md">
            Try typing reserved names: con, prn, aux, nul, com1, lpt1, . or ..
          </p>
        </div>
        <CreateFolderDialog
          open={open}
          onOpenChange={setOpen}
          onCreateFolder={async (folderName) => {
            console.log('Creating folder:', folderName)
          }}
          currentPath="/documents"
        />
      </>
    )
  },
}

/**
 * Validation error - too long.
 * Tests the maximum length validation with a reduced limit.
 */
export const ValidationErrorTooLong: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <div className="text-center space-y-4">
          <Button onClick={() => setOpen(true)} className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Test Max Length (50 chars)
          </Button>
          <p className="text-sm text-[#C4C8D4] max-w-md">
            Try typing more than 50 characters
          </p>
        </div>
        <CreateFolderDialog
          open={open}
          onOpenChange={setOpen}
          onCreateFolder={async (folderName) => {
            console.log('Creating folder:', folderName)
          }}
          currentPath="/documents"
          maxLength={50}
        />
      </>
    )
  },
}

/**
 * Successful folder creation flow.
 * Simulates a successful folder creation with visual feedback.
 */
export const SuccessFlow: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [createdFolder, setCreatedFolder] = useState<string | null>(null)

    return (
      <>
        <div className="text-center space-y-4">
          <Button onClick={() => setOpen(true)} className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Create New Folder
          </Button>
          {createdFolder && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-300">
                Successfully created folder: <strong>{createdFolder}</strong>
              </p>
            </div>
          )}
        </div>
        <CreateFolderDialog
          open={open}
          onOpenChange={setOpen}
          onCreateFolder={async (folderName) => {
            console.log('Creating folder:', folderName)
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setCreatedFolder(folderName)
          }}
          currentPath="/documents"
        />
      </>
    )
  },
}

/**
 * Error handling - API failure.
 * Simulates an API error during folder creation.
 */
export const APIErrorHandling: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <FolderPlus className="h-4 w-4" />
          Test API Error
        </Button>
        <CreateFolderDialog
          open={open}
          onOpenChange={setOpen}
          onCreateFolder={async (folderName) => {
            console.log('Attempting to create folder:', folderName)
            await new Promise((resolve) => setTimeout(resolve, 1000))
            // Simulate API error
            throw new Error('Failed to create folder. Server error occurred.')
          }}
          currentPath="/documents"
        />
      </>
    )
  },
}

/**
 * Complete validation showcase.
 * Interactive demo showing all validation rules with examples.
 */
export const ValidationShowcase: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="font-decorative text-3xl text-white mb-4">
              Folder Name Validation Rules
            </h2>
            <p className="text-[#C4C8D4]">
              The CreateFolderDialog component includes comprehensive validation to ensure
              folder names are valid and unique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rule 1 */}
            <div className="glass-card p-6 rounded-lg space-y-2">
              <h3 className="text-lg font-decorative text-white">1. Required Field</h3>
              <p className="text-sm text-[#C4C8D4]">Folder name cannot be empty</p>
              <div className="pt-2">
                <span className="text-xs font-mono text-red-400">❌ Empty string</span>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="glass-card p-6 rounded-lg space-y-2">
              <h3 className="text-lg font-decorative text-white">2. Invalid Characters</h3>
              <p className="text-sm text-[#C4C8D4]">
                Cannot contain: {'< > : " / \\ | ? * or control characters'}
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono text-red-400">❌ My/Folder</span>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="glass-card p-6 rounded-lg space-y-2">
              <h3 className="text-lg font-decorative text-white">3. Reserved Names</h3>
              <p className="text-sm text-[#C4C8D4]">
                Cannot use: con, prn, aux, nul, com1, lpt1, . or ..
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono text-red-400">❌ con</span>
              </div>
            </div>

            {/* Rule 4 */}
            <div className="glass-card p-6 rounded-lg space-y-2">
              <h3 className="text-lg font-decorative text-white">4. Duplicate Names</h3>
              <p className="text-sm text-[#C4C8D4]">
                Folder name must be unique in current location (case-insensitive)
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono text-red-400">
                  ❌ Projects (if exists)
                </span>
              </div>
            </div>

            {/* Rule 5 */}
            <div className="glass-card p-6 rounded-lg space-y-2">
              <h3 className="text-lg font-decorative text-white">5. Maximum Length</h3>
              <p className="text-sm text-[#C4C8D4]">
                Folder name must be less than 255 characters (configurable)
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono text-red-400">
                  ❌ Very long name exceeding limit...
                </span>
              </div>
            </div>

            {/* Valid examples */}
            <div className="glass-card p-6 rounded-lg space-y-2">
              <h3 className="text-lg font-decorative text-white">✅ Valid Names</h3>
              <div className="space-y-1 pt-2">
                <div className="text-xs font-mono text-green-400">✓ My Documents</div>
                <div className="text-xs font-mono text-green-400">✓ Project_2025</div>
                <div className="text-xs font-mono text-green-400">✓ Reports-Q1</div>
                <div className="text-xs font-mono text-green-400">✓ 2025 Archive</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={() => setOpen(true)} className="gap-2" size="lg">
              <FolderPlus className="h-5 w-5" />
              Try Creating a Folder
            </Button>
          </div>

          <CreateFolderDialog
            open={open}
            onOpenChange={setOpen}
            onCreateFolder={async (folderName) => {
              console.log('Creating folder:', folderName)
              await new Promise((resolve) => setTimeout(resolve, 1000))
            }}
            currentPath="/documents"
            existingFolders={['Projects', 'Archive', 'Reports']}
          />
        </div>
      </div>
    )
  },
}

/**
 * Realistic usage scenario.
 * Shows the dialog in a realistic file browser context.
 */
export const RealisticUsage: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => {
    const [open, setOpen] = useState(false)
    const [folders, setFolders] = useState([
      'Documents',
      'Images',
      'Videos',
      'Projects',
    ])

    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-decorative text-3xl text-white mb-2">
                My Storage
              </h1>
              <p className="text-[#C4C8D4] text-sm">
                /my-bucket
              </p>
            </div>
            <Button onClick={() => setOpen(true)} className="gap-2">
              <FolderPlus className="h-4 w-4" />
              New Folder
            </Button>
          </div>

          {/* Folder list */}
          <div className="glass-card rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#0E282E]">
              <h2 className="text-white font-medium">Folders</h2>
            </div>
            <div className="divide-y divide-[#0E282E]/50">
              {folders.map((folder) => (
                <div
                  key={folder}
                  className="flex items-center gap-3 p-4 hover:bg-primary/5 transition-colors"
                >
                  <FolderPlus className="h-5 w-5 text-primary" />
                  <span className="text-white">{folder}</span>
                </div>
              ))}
              {folders.length === 0 && (
                <div className="p-8 text-center text-[#C4C8D4]">
                  No folders yet. Create one to get started.
                </div>
              )}
            </div>
          </div>

          <CreateFolderDialog
            open={open}
            onOpenChange={setOpen}
            onCreateFolder={async (folderName) => {
              console.log('Creating folder:', folderName)
              await new Promise((resolve) => setTimeout(resolve, 1000))
              setFolders([...folders, folderName])
            }}
            currentPath="/my-bucket"
            existingFolders={folders}
          />
        </div>
      </div>
    )
  },
}

/**
 * All states showcase.
 * Side-by-side comparison of different dialog states.
 */
export const AllStatesShowcase: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => {
    const [openDefault, setOpenDefault] = useState(false)
    const [openNested, setOpenNested] = useState(false)
    const [openWithExisting, setOpenWithExisting] = useState(false)

    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="font-decorative text-3xl text-white mb-8">
            Dialog States Showcase
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Default state */}
            <div className="space-y-4">
              <div className="glass-card p-6 rounded-lg">
                <h3 className="text-lg font-decorative text-white mb-2">
                  Root Path
                </h3>
                <p className="text-sm text-[#C4C8D4] mb-4">
                  Create folder at root level
                </p>
                <Button onClick={() => setOpenDefault(true)} className="w-full gap-2">
                  <FolderPlus className="h-4 w-4" />
                  Open Dialog
                </Button>
              </div>
            </div>

            {/* Nested path */}
            <div className="space-y-4">
              <div className="glass-card p-6 rounded-lg">
                <h3 className="text-lg font-decorative text-white mb-2">
                  Nested Path
                </h3>
                <p className="text-sm text-[#C4C8D4] mb-4">
                  Create folder in deep structure
                </p>
                <Button onClick={() => setOpenNested(true)} className="w-full gap-2">
                  <FolderPlus className="h-4 w-4" />
                  Open Dialog
                </Button>
              </div>
            </div>

            {/* With existing folders */}
            <div className="space-y-4">
              <div className="glass-card p-6 rounded-lg">
                <h3 className="text-lg font-decorative text-white mb-2">
                  With Duplicates
                </h3>
                <p className="text-sm text-[#C4C8D4] mb-4">
                  Test duplicate validation
                </p>
                <Button onClick={() => setOpenWithExisting(true)} className="w-full gap-2">
                  <FolderPlus className="h-4 w-4" />
                  Open Dialog
                </Button>
              </div>
            </div>
          </div>

          <CreateFolderDialog
            open={openDefault}
            onOpenChange={setOpenDefault}
            onCreateFolder={async (folderName) => {
              console.log('Creating folder at root:', folderName)
              await new Promise((resolve) => setTimeout(resolve, 1000))
            }}
            currentPath="/"
          />

          <CreateFolderDialog
            open={openNested}
            onOpenChange={setOpenNested}
            onCreateFolder={async (folderName) => {
              console.log('Creating folder in nested path:', folderName)
              await new Promise((resolve) => setTimeout(resolve, 1000))
            }}
            currentPath="/documents/2025/reports/quarterly"
          />

          <CreateFolderDialog
            open={openWithExisting}
            onOpenChange={setOpenWithExisting}
            onCreateFolder={async (folderName) => {
              console.log('Creating folder with existing:', folderName)
              await new Promise((resolve) => setTimeout(resolve, 1000))
            }}
            currentPath="/my-bucket"
            existingFolders={['Projects', 'Documents', 'Images', 'Videos', 'Archive']}
          />
        </div>
      </div>
    )
  },
}
