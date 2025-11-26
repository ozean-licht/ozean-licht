/**
 * Share Dialog Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ShareDialog } from './share-dialog'
import type { StorageFile } from './types'
import { Button } from '../cossui/button'

const meta: Meta<typeof ShareDialog> = {
  title: 'Storage/Phase 3/ShareDialog',
  component: ShareDialog,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#00070F' }] },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ShareDialog>

const mockFile: StorageFile = {
  id: '1',
  name: 'presentation-slides.pdf',
  path: 'documents/presentations/presentation-slides.pdf',
  size: 8388608,
  mimeType: 'application/pdf',
  uploadedAt: new Date(),
  bucket: 'ozean-licht-assets',
}

function DialogWrapper(props: Partial<React.ComponentProps<typeof ShareDialog>>) {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90">
        Open Share Dialog
      </Button>
      <ShareDialog file={mockFile} open={open} onOpenChange={setOpen} {...props} />
    </div>
  )
}

export const Default: Story = {
  render: () => <DialogWrapper />,
}

export const WithUrlGeneration: Story = {
  render: () => (
    <DialogWrapper
      onGenerateUrl={async (file, expiry) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return `https://storage.ozean-licht.dev/share/${file.id}?expires=${Date.now() + expiry * 1000}`
      }}
    />
  ),
}

export const QuickExpiry: Story = {
  render: () => (
    <DialogWrapper
      onGenerateUrl={async (file, expiry) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return `https://cdn.ozean-licht.dev/f/${file.id}?exp=${expiry}`
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Share dialog with quick URL generation for testing countdown.',
      },
    },
  },
}
