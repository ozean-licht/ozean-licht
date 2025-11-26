/**
 * Bucket Selector Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { BucketSelector, type Bucket } from './bucket-selector'

const meta: Meta<typeof BucketSelector> = {
  title: 'Storage/BucketSelector',
  component: BucketSelector,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#00070F' }] },
  },
  decorators: [(Story) => <div className="w-[400px]"><Story /></div>],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BucketSelector>

const mockBuckets: Bucket[] = [
  {
    id: 'kids-ascension-staging',
    name: 'kids-ascension-staging',
    displayName: 'Kids Ascension (Staging)',
    fileCount: 342,
    usedBytes: 5368709120,
    entityScope: 'kids-ascension',
  },
  {
    id: 'ozean-licht-assets',
    name: 'ozean-licht-assets',
    displayName: 'Ozean Licht Assets',
    fileCount: 156,
    usedBytes: 3221225472,
    entityScope: 'ozean-licht',
  },
  {
    id: 'shared-assets',
    name: 'shared-assets',
    displayName: 'Shared Assets',
    fileCount: 89,
    usedBytes: 1073741824,
    entityScope: 'shared',
  },
]

function SelectorWrapper(props: Partial<React.ComponentProps<typeof BucketSelector>>) {
  const [selected, setSelected] = useState('ozean-licht-assets')
  return (
    <BucketSelector
      buckets={mockBuckets}
      selectedBucket={selected}
      onSelectBucket={setSelected}
      {...props}
    />
  )
}

export const Default: Story = {
  render: () => <SelectorWrapper />,
}

export const WithUsage: Story = {
  render: () => <SelectorWrapper showUsage />,
}

export const WithoutFileCount: Story = {
  render: () => <SelectorWrapper showFileCount={false} />,
}

export const AllInfo: Story = {
  render: () => <SelectorWrapper showFileCount showUsage />,
}
