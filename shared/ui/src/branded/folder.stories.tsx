import type { Meta, StoryObj } from '@storybook/react';
import { Folder } from './folder';
import { File, Image, FileText, Music, Video } from 'lucide-react';

/**
 * Folder - Animated folder icon with interactive papers.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **Interactive Animation**: Click to open/close folder with paper animation
 * - **Magnetic Effect**: Papers follow mouse movement when folder is open
 * - **Customizable Color**: Change folder color (default: #0ec2bc)
 * - **Scalable Size**: Adjust size with scale multiplier
 * - **Paper Items**: Display up to 3 custom items inside papers
 * - **Oceanic Cyan Theme**: Default color matches Ozean Licht branding
 * - **Hover Effects**: Smooth transitions and hover states
 *
 * ## Props
 * - **color**: string - Folder color (default: #0ec2bc)
 * - **size**: number - Scale multiplier (default: 1)
 * - **items**: React.ReactNode[] - Up to 3 items to display in papers
 * - **className**: string - Additional CSS classes
 *
 * ## Usage
 * Use for file management UIs, MinIO storage interfaces, document organization,
 * or any folder/file system visualization. Perfect for the Ozean Licht storage UI.
 */
const meta = {
  title: 'Tier 2: Branded/Folder',
  component: Folder,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Interactive animated folder with papers that respond to mouse movement. Themed with Ozean Licht oceanic cyan colors for storage UIs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'color',
      description: 'Folder color',
      table: {
        defaultValue: { summary: '#0ec2bc' },
      },
    },
    size: {
      control: { type: 'range', min: 0.5, max: 3, step: 0.1 },
      description: 'Scale multiplier',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    items: {
      control: false,
      description: 'Up to 3 React nodes to display in papers',
      table: {
        defaultValue: { summary: '[]' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Folder>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Ozean Licht folder.
 * Click to open and see papers animate. Hover over papers when open for magnetic effect.
 */
export const Default: Story = {
  args: {
    color: '#0ec2bc',
    size: 1,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Empty folder with no items.
 * Basic folder visualization.
 */
export const Empty: Story = {
  args: {
    color: '#0ec2bc',
    size: 1,
    items: [],
  },
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Folder with file icons inside papers.
 * Perfect for file management UI.
 */
export const WithFileIcons: Story = {
  args: {
    color: '#0ec2bc',
    size: 1.5,
    items: [
      <div key="1" className="flex items-center justify-center h-full text-primary">
        <FileText size={24} />
      </div>,
      <div key="2" className="flex items-center justify-center h-full text-primary">
        <Image size={24} />
      </div>,
      <div key="3" className="flex items-center justify-center h-full text-primary">
        <Music size={24} />
      </div>,
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Folder with text labels.
 * Show file names or document titles.
 */
export const WithLabels: Story = {
  args: {
    color: '#0ec2bc',
    size: 1.5,
    items: [
      <div key="1" className="flex items-center justify-center h-full text-xs font-montserrat-alt text-gray-700 px-2 text-center">
        Report.pdf
      </div>,
      <div key="2" className="flex items-center justify-center h-full text-xs font-montserrat-alt text-gray-700 px-2 text-center">
        Image.jpg
      </div>,
      <div key="3" className="flex items-center justify-center h-full text-xs font-montserrat-alt text-gray-700 px-2 text-center">
        Notes.txt
      </div>,
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Large folder for hero sections.
 * Increased size for emphasis.
 */
export const Large: Story = {
  args: {
    color: '#0ec2bc',
    size: 2,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Small folder for compact layouts.
 * Reduced size for lists or grids.
 */
export const Small: Story = {
  args: {
    color: '#0ec2bc',
    size: 0.7,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Custom color variations.
 * Different colors for folder categories.
 */
export const ColorVariations: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Folder color="#0ec2bc" size={1.2} />
        <span className="text-xs text-white/60 font-montserrat-alt">Oceanic Cyan</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Folder color="#10B981" size={1.2} />
        <span className="text-xs text-white/60 font-montserrat-alt">Green</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Folder color="#F59E0B" size={1.2} />
        <span className="text-xs text-white/60 font-montserrat-alt">Amber</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Folder color="#EF4444" size={1.2} />
        <span className="text-xs text-white/60 font-montserrat-alt">Red</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Folder color="#8B5CF6" size={1.2} />
        <span className="text-xs text-white/60 font-montserrat-alt">Purple</span>
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
};

/**
 * Size variations comparison.
 * Different sizes for different contexts.
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <div className="flex flex-col items-center gap-2">
        <Folder color="#0ec2bc" size={0.5} />
        <span className="text-xs text-white/60 font-montserrat-alt">0.5x</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Folder color="#0ec2bc" size={1} />
        <span className="text-xs text-white/60 font-montserrat-alt">1x</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Folder color="#0ec2bc" size={1.5} />
        <span className="text-xs text-white/60 font-montserrat-alt">1.5x</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Folder color="#0ec2bc" size={2} />
        <span className="text-xs text-white/60 font-montserrat-alt">2x</span>
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
};

/**
 * Folder grid for file browser.
 * Multiple folders in a grid layout like a file manager.
 */
export const FolderGrid: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="max-w-[800px] mx-auto px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8 bg-card rounded-lg border border-border">
        <div className="flex flex-col items-center gap-2">
          <Folder
            color="#0ec2bc"
            size={1}
            items={[
              <div key="1" className="flex items-center justify-center h-full">
                <Image size={20} className="text-primary" />
              </div>,
            ]}
          />
          <span className="text-xs text-white/80 font-montserrat-alt">Images</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Folder
            color="#10B981"
            size={1}
            items={[
              <div key="1" className="flex items-center justify-center h-full">
                <FileText size={20} className="text-success" />
              </div>,
            ]}
          />
          <span className="text-xs text-white/80 font-montserrat-alt">Documents</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Folder
            color="#F59E0B"
            size={1}
            items={[
              <div key="1" className="flex items-center justify-center h-full">
                <Music size={20} className="text-warning" />
              </div>,
            ]}
          />
          <span className="text-xs text-white/80 font-montserrat-alt">Music</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Folder
            color="#8B5CF6"
            size={1}
            items={[
              <div key="1" className="flex items-center justify-center h-full">
                <Video size={20} className="text-purple-500" />
              </div>,
            ]}
          />
          <span className="text-xs text-white/80 font-montserrat-alt">Videos</span>
        </div>
      </div>
    </div>
  ),
};

/**
 * MinIO Storage UI example.
 * Folder with storage metadata.
 */
export const MinIOStorage: Story = {
  render: () => (
    <div className="glass-card rounded-lg p-6 space-y-4 max-w-md">
      <h3 className="font-montserrat-alt text-white text-lg">My Bucket</h3>
      <div className="flex items-center gap-4">
        <Folder
          color="#0ec2bc"
          size={0.5}
          items={[
            <div key="1" className="flex items-center justify-center h-full text-xs font-bold text-primary">
              42
            </div>,
          ]}
        />
        <div className="flex-1">
          <p className="text-white/80 font-montserrat-alt text-sm">
            Documents folder
          </p>
          <p className="text-white/60 text-xs mt-1">
            42 files • 2.3 GB
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-primary text-white text-sm font-montserrat-alt rounded hover:bg-primary/90 transition-colors">
          Open
        </button>
        <button className="px-4 py-2 border border-border text-white/80 text-sm font-montserrat-alt rounded hover:bg-white/5 transition-colors">
          Details
        </button>
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
};

/**
 * Folder list view.
 * Folders in a vertical list like a file explorer.
 */
export const ListView: Story = {
  render: () => (
    <div className="glass-card rounded-lg p-4 space-y-2 w-96">
      {[
        { name: 'Projects', files: 24, color: '#0ec2bc' },
        { name: 'Downloads', files: 156, color: '#10B981' },
        { name: 'Photos', files: 892, color: '#F59E0B' },
        { name: 'Music', files: 342, color: '#8B5CF6' },
      ].map((folder) => (
        <div
          key={folder.name}
          className="flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Folder color={folder.color} size={0.8} />
          <div className="flex-1">
            <p className="text-white/90 font-montserrat-alt text-sm">{folder.name}</p>
            <p className="text-white/50 text-xs">{folder.files} items</p>
          </div>
          <div className="text-white/40 text-xs">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};
