import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import React from 'react'
import { StorageBreadcrumb } from './storage-breadcrumb'

/**
 * StorageBreadcrumb - File path navigation with clickable breadcrumbs.
 *
 * **This is a Tier 2 Branded Component** - styled for storage/file management UIs.
 *
 * ## Features
 * - **Path Navigation**: Parse and display file paths as breadcrumbs
 * - **Clickable Segments**: Navigate to parent folders by clicking segments
 * - **Auto Truncation**: Collapse middle segments when path is too long
 * - **Home Icon**: Special treatment for root/home with icon
 * - **Responsive**: Show only last 2 segments on mobile, all on tablet+
 * - **Active State**: Current segment highlighted in white
 * - **Hover Effects**: Links highlight on hover
 * - **Ellipsis**: Middle segments replaced with "..." for long paths
 *
 * ## Props
 * - **path**: string - File path (e.g., "bucket/folder/subfolder")
 * - **onNavigate**: (path: string) => void - Navigate callback
 * - **maxSegments**: number - Maximum segments before truncation (default: 5)
 * - **homeLabel**: string - Label for root/home (default: "Home")
 * - **className**: string - Additional CSS classes
 *
 * ## Usage
 * Use in file managers, storage UIs, document browsers, or any hierarchical navigation.
 * Perfect for MinIO storage interface, file explorers, or cloud storage UIs.
 */
const meta = {
  title: 'Storage/StorageBreadcrumb',
  component: StorageBreadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A breadcrumb navigation component for file paths with automatic truncation and responsive layout.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    path: {
      control: 'text',
      description: 'File path to display',
      table: {
        defaultValue: { summary: '""' },
      },
    },
    onNavigate: {
      action: 'navigate',
      description: 'Callback when segment is clicked',
    },
    maxSegments: {
      control: { type: 'number', min: 3, max: 10, step: 1 },
      description: 'Maximum number of segments to display before truncating',
      table: {
        defaultValue: { summary: '5' },
      },
    },
    homeLabel: {
      control: 'text',
      description: 'Label for home/root',
      table: {
        defaultValue: { summary: 'Home' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    onNavigate: fn(),
  },
} satisfies Meta<typeof StorageBreadcrumb>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Root path - just home.
 * No additional segments.
 */
export const Default: Story = {
  args: {
    path: '',
    homeLabel: 'Home',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[600px] w-full p-4">
        <Story />
      </div>
    ),
  ],
}

/**
 * Short path - 2-3 segments.
 * All segments visible, no truncation needed.
 */
export const ShortPath: Story = {
  args: {
    path: 'my-bucket/documents',
    homeLabel: 'Home',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[600px] w-full p-4">
        <Story />
      </div>
    ),
  ],
}

/**
 * Medium path - 4-5 segments.
 * Still fits within maxSegments, all visible.
 */
export const MediumPath: Story = {
  args: {
    path: 'my-bucket/documents/2024/reports/january',
    homeLabel: 'Home',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[600px] w-full p-4">
        <Story />
      </div>
    ),
  ],
}

/**
 * Long path - 6+ segments with truncation.
 * Middle segments replaced with "..." to save space.
 */
export const LongPath: Story = {
  args: {
    path: 'my-bucket/documents/2024/reports/january/sales/regional/north',
    maxSegments: 5,
    homeLabel: 'Home',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[600px] w-full p-4">
        <Story />
      </div>
    ),
  ],
}

/**
 * Very deep nesting - 10+ levels.
 * Shows first segment, "...", and last few segments.
 */
export const DeepNesting: Story = {
  args: {
    path: 'storage/users/john/projects/2024/web/frontend/components/ui/buttons/primary',
    maxSegments: 5,
    homeLabel: 'Storage',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[600px] w-full p-4">
        <Story />
      </div>
    ),
  ],
}

/**
 * Interactive example with navigation.
 * Click segments to navigate up the folder tree.
 */
export const Interactive: Story = {
  render: function InteractiveExample() {
    const [currentPath, setCurrentPath] = React.useState(
      'my-bucket/documents/photos/vacation/summer-2024'
    )

    return (
      <div className="max-w-[600px] w-full p-6 glass-card rounded-lg space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-white/60 font-montserrat-alt">
            Current Path:
          </label>
          <StorageBreadcrumb
            path={currentPath}
            onNavigate={setCurrentPath}
            homeLabel="My Storage"
          />
        </div>
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-white/40 font-montserrat-alt">
            Click any segment to navigate. Current: <code className="text-primary">{currentPath || '(root)'}</code>
          </p>
        </div>
      </div>
    )
  },
}

/**
 * Mobile responsive behavior.
 * Only shows last 2 segments on small screens.
 */
export const MobileView: Story = {
  args: {
    path: 'my-bucket/documents/2024/reports/january',
    homeLabel: 'Home',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[375px] w-full p-4">
        <div className="glass-card p-4 rounded-lg">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * Tablet responsive behavior.
 * Shows all segments with proper spacing.
 */
export const TabletView: Story = {
  args: {
    path: 'my-bucket/documents/2024/reports/january',
    homeLabel: 'Home',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[768px] w-full p-4">
        <div className="glass-card p-4 rounded-lg">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * Custom max segments.
 * Control truncation threshold.
 */
export const CustomMaxSegments: Story = {
  render: () => (
    <div className="max-w-[800px] w-full space-y-6 p-4">
      <div className="space-y-2">
        <p className="text-xs text-white/60 font-montserrat-alt">maxSegments: 3</p>
        <StorageBreadcrumb
          path="bucket/a/b/c/d/e"
          maxSegments={3}
          onNavigate={fn()}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-white/60 font-montserrat-alt">maxSegments: 5</p>
        <StorageBreadcrumb
          path="bucket/a/b/c/d/e"
          maxSegments={5}
          onNavigate={fn()}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-white/60 font-montserrat-alt">maxSegments: 8</p>
        <StorageBreadcrumb
          path="bucket/a/b/c/d/e"
          maxSegments={8}
          onNavigate={fn()}
        />
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
}

/**
 * Different home labels.
 * Customize the root label for different contexts.
 */
export const CustomHomeLabels: Story = {
  render: () => (
    <div className="max-w-[800px] w-full space-y-4 p-4">
      <div className="glass-card p-4 rounded-lg space-y-2">
        <p className="text-xs text-white/60 font-montserrat-alt">MinIO Storage</p>
        <StorageBreadcrumb
          path="media-bucket/videos/tutorials"
          homeLabel="MinIO"
          onNavigate={fn()}
        />
      </div>
      <div className="glass-card p-4 rounded-lg space-y-2">
        <p className="text-xs text-white/60 font-montserrat-alt">My Files</p>
        <StorageBreadcrumb
          path="documents/work/projects"
          homeLabel="My Files"
          onNavigate={fn()}
        />
      </div>
      <div className="glass-card p-4 rounded-lg space-y-2">
        <p className="text-xs text-white/60 font-montserrat-alt">Cloud Storage</p>
        <StorageBreadcrumb
          path="shared/team/resources"
          homeLabel="Cloud"
          onNavigate={fn()}
        />
      </div>
    </div>
  ),
}

/**
 * File manager UI example.
 * Real-world usage in a file browser interface.
 */
export const FileManagerUI: Story = {
  render: function FileManagerExample() {
    const [currentPath, setCurrentPath] = React.useState('my-bucket/documents/projects')

    return (
      <div className="w-full max-w-[900px] glass-card rounded-lg overflow-hidden">
        {/* Header with breadcrumb */}
        <div className="border-b border-border p-4">
          <StorageBreadcrumb
            path={currentPath}
            onNavigate={setCurrentPath}
            homeLabel="Storage"
          />
        </div>

        {/* Toolbar */}
        <div className="border-b border-border p-3 flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-montserrat-alt text-white/80 hover:text-white transition-colors">
            Upload
          </button>
          <button className="px-3 py-1.5 text-sm font-montserrat-alt text-white/80 hover:text-white transition-colors">
            New Folder
          </button>
          <button className="px-3 py-1.5 text-sm font-montserrat-alt text-white/80 hover:text-white transition-colors">
            Share
          </button>
        </div>

        {/* File list placeholder */}
        <div className="p-4 space-y-2">
          {['Budget.xlsx', 'Proposal.pdf', 'Images/', 'Notes.txt'].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                {item.slice(0, 1)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/90 font-montserrat-alt">{item}</p>
                <p className="text-xs text-white/50">Modified 2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
}

/**
 * Multiple breadcrumbs comparison.
 * Side-by-side comparison of different path lengths.
 */
export const Comparison: Story = {
  render: () => (
    <div className="max-w-[800px] w-full space-y-4 p-4">
      <div className="glass-card p-4 rounded-lg space-y-2">
        <p className="text-xs text-white/60 font-montserrat-alt">Root only</p>
        <StorageBreadcrumb path="" onNavigate={fn()} />
      </div>

      <div className="glass-card p-4 rounded-lg space-y-2">
        <p className="text-xs text-white/60 font-montserrat-alt">1 level</p>
        <StorageBreadcrumb path="documents" onNavigate={fn()} />
      </div>

      <div className="glass-card p-4 rounded-lg space-y-2">
        <p className="text-xs text-white/60 font-montserrat-alt">2 levels</p>
        <StorageBreadcrumb path="documents/work" onNavigate={fn()} />
      </div>

      <div className="glass-card p-4 rounded-lg space-y-2">
        <p className="text-xs text-white/60 font-montserrat-alt">5 levels</p>
        <StorageBreadcrumb path="documents/work/2024/q1/reports" onNavigate={fn()} />
      </div>

      <div className="glass-card p-4 rounded-lg space-y-2">
        <p className="text-xs text-white/60 font-montserrat-alt">8 levels (truncated)</p>
        <StorageBreadcrumb
          path="documents/work/2024/q1/reports/sales/regional/summary"
          onNavigate={fn()}
        />
      </div>
    </div>
  ),
}

/**
 * Without navigation callback.
 * Non-interactive breadcrumb for display only.
 */
export const ReadOnly: Story = {
  args: {
    path: 'my-bucket/documents/2024/reports',
    homeLabel: 'Home',
    // No onNavigate - breadcrumb is not interactive
  },
  decorators: [
    (Story) => (
      <div className="max-w-[600px] w-full p-4">
        <div className="glass-card p-4 rounded-lg">
          <Story />
          <p className="text-xs text-white/40 font-montserrat-alt mt-4">
            No onNavigate callback - segments are not clickable
          </p>
        </div>
      </div>
    ),
  ],
}

/**
 * Long segment names.
 * Handle very long folder/file names gracefully.
 */
export const LongSegmentNames: Story = {
  args: {
    path: 'my-bucket/this-is-a-very-long-folder-name-that-might-overflow/another-extremely-long-segment-name',
    homeLabel: 'Home',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[600px] w-full p-4">
        <div className="glass-card p-4 rounded-lg">
          <Story />
        </div>
      </div>
    ),
  ],
}
