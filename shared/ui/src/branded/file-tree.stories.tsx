import type { Meta, StoryObj } from '@storybook/react';
import { Tree, Folder, File, CollapseButton, type TreeViewElement } from './file-tree';
import { ChevronRight, ChevronDown, Image, FileText, Music, Video, Code, Database } from 'lucide-react';

/**
 * FileTree - Hierarchical file and folder tree view.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **Hierarchical Structure**: Nested folders and files with unlimited depth
 * - **Expandable/Collapsible**: Click folders to expand/collapse
 * - **Selection Support**: Click files to select them
 * - **Visual Indicator**: Vertical line showing hierarchy
 * - **Custom Icons**: Support for custom folder and file icons
 * - **RTL Support**: Right-to-left language support
 * - **Oceanic Cyan Theme**: Primary color (#0ec2bc) for selected items
 * - **Collapse All Button**: Expand or collapse entire tree
 * - **Scrollable**: Built-in scroll area for long trees
 *
 * ## Components
 * - **Tree**: Root container for the file tree
 * - **Folder**: Expandable folder item
 * - **File**: Selectable file item
 * - **CollapseButton**: Button to expand/collapse all items
 *
 * ## Props
 * ### Tree
 * - **initialSelectedId**: string - Initially selected file ID
 * - **indicator**: boolean - Show hierarchy indicator line (default: true)
 * - **elements**: TreeViewElement[] - Tree data structure
 * - **initialExpandedItems**: string[] - Initially expanded folder IDs
 * - **openIcon**: ReactNode - Custom open folder icon
 * - **closeIcon**: ReactNode - Custom closed folder icon
 *
 * ### Folder
 * - **element**: string - Folder name
 * - **value**: string - Unique identifier
 * - **isSelectable**: boolean - Whether folder can be selected
 *
 * ### File
 * - **value**: string - Unique identifier and file name
 * - **fileIcon**: ReactNode - Custom file icon
 * - **isSelectable**: boolean - Whether file can be selected
 *
 * ## Usage
 * Perfect for MinIO storage browsers, file managers, project explorers,
 * documentation navigation, or any hierarchical data visualization.
 */
const meta = {
  title: 'Tier 2: Branded/FileTree',
  component: Tree,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Hierarchical file and folder tree view with Ozean Licht oceanic cyan theme. Ideal for storage UIs, file browsers, and navigation systems.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    indicator: {
      control: 'boolean',
      description: 'Show hierarchy indicator line',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    initialSelectedId: {
      control: 'text',
      description: 'Initially selected file ID',
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8 bg-background rounded-lg">
        <div className="w-full max-w-md h-96 border border-border rounded-lg glass-card p-4">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample tree data
const sampleTree: TreeViewElement[] = [
  {
    id: '1',
    name: 'Documents',
    children: [
      {
        id: '2',
        name: 'Reports',
        children: [
          { id: '3', name: 'Q1-2024.pdf' },
          { id: '4', name: 'Q2-2024.pdf' },
        ],
      },
      { id: '5', name: 'Presentation.pptx' },
      { id: '6', name: 'Notes.txt' },
    ],
  },
  {
    id: '7',
    name: 'Images',
    children: [
      { id: '8', name: 'vacation.jpg' },
      { id: '9', name: 'profile.png' },
    ],
  },
  {
    id: '10',
    name: 'Music',
    children: [
      { id: '11', name: 'playlist.m3u' },
      { id: '12', name: 'song.mp3' },
    ],
  },
];

/**
 * Basic file tree with default styling.
 * Click folders to expand/collapse, click files to select.
 */
export const Default: Story = {
  render: () => (
    <Tree className="h-full" initialSelectedId="3">
      <Folder element="Documents" value="1">
        <Folder element="Reports" value="2">
          <File value="Q1-2024.pdf">
            <span>Q1-2024.pdf</span>
          </File>
          <File value="Q2-2024.pdf">
            <span>Q2-2024.pdf</span>
          </File>
        </Folder>
        <File value="Presentation.pptx">
          <span>Presentation.pptx</span>
        </File>
        <File value="Notes.txt">
          <span>Notes.txt</span>
        </File>
      </Folder>
      <Folder element="Images" value="7">
        <File value="vacation.jpg">
          <span>vacation.jpg</span>
        </File>
        <File value="profile.png">
          <span>profile.png</span>
        </File>
      </Folder>
      <Folder element="Music" value="10">
        <File value="playlist.m3u">
          <span>playlist.m3u</span>
        </File>
        <File value="song.mp3">
          <span>song.mp3</span>
        </File>
      </Folder>
    </Tree>
  ),
};

/**
 * File tree with custom file type icons.
 * Different icons for different file types.
 */
export const WithCustomIcons: Story = {
  render: () => (
    <Tree className="h-full">
      <Folder element="Projects" value="1">
        <Folder element="Website" value="2">
          <File value="index.html" fileIcon={<Code className="size-4 text-orange-500" />}>
            <span>index.html</span>
          </File>
          <File value="styles.css" fileIcon={<Code className="size-4 text-blue-500" />}>
            <span>styles.css</span>
          </File>
          <File value="script.js" fileIcon={<Code className="size-4 text-yellow-500" />}>
            <span>script.js</span>
          </File>
        </Folder>
        <Folder element="Database" value="3">
          <File value="schema.sql" fileIcon={<Database className="size-4 text-primary" />}>
            <span>schema.sql</span>
          </File>
        </Folder>
      </Folder>
      <Folder element="Media" value="4">
        <File value="banner.jpg" fileIcon={<Image className="size-4 text-green-500" />}>
          <span>banner.jpg</span>
        </File>
        <File value="intro.mp4" fileIcon={<Video className="size-4 text-purple-500" />}>
          <span>intro.mp4</span>
        </File>
        <File value="bgm.mp3" fileIcon={<Music className="size-4 text-pink-500" />}>
          <span>bgm.mp3</span>
        </File>
      </Folder>
    </Tree>
  ),
};

/**
 * File tree with custom chevron icons.
 * Using chevrons instead of folder icons.
 */
export const WithChevrons: Story = {
  render: () => (
    <Tree
      className="h-full"
      openIcon={<ChevronDown className="size-4 text-primary" />}
      closeIcon={<ChevronRight className="size-4 text-white/60" />}
    >
      <Folder element="Root" value="1">
        <Folder element="Subfolder 1" value="2">
          <File value="file1.txt">
            <span>file1.txt</span>
          </File>
          <File value="file2.txt">
            <span>file2.txt</span>
          </File>
        </Folder>
        <Folder element="Subfolder 2" value="3">
          <File value="file3.txt">
            <span>file3.txt</span>
          </File>
        </Folder>
      </Folder>
    </Tree>
  ),
};

/**
 * File tree with initially expanded folders.
 * Some folders start open.
 */
export const InitiallyExpanded: Story = {
  render: () => (
    <Tree className="h-full" initialExpandedItems={['1', '2']}>
      <Folder element="Documents" value="1">
        <Folder element="Work" value="2">
          <File value="project.docx">
            <span>project.docx</span>
          </File>
          <File value="budget.xlsx">
            <span>budget.xlsx</span>
          </File>
        </Folder>
        <Folder element="Personal" value="3">
          <File value="resume.pdf">
            <span>resume.pdf</span>
          </File>
        </Folder>
      </Folder>
    </Tree>
  ),
};

/**
 * File tree without hierarchy indicator.
 * Cleaner look without the vertical line.
 */
export const NoIndicator: Story = {
  render: () => (
    <Tree className="h-full" indicator={false}>
      <Folder element="Folder A" value="1">
        <File value="file1.txt">
          <span>file1.txt</span>
        </File>
        <File value="file2.txt">
          <span>file2.txt</span>
        </File>
      </Folder>
      <Folder element="Folder B" value="2">
        <File value="file3.txt">
          <span>file3.txt</span>
        </File>
      </Folder>
    </Tree>
  ),
};

/**
 * Deep nested file tree.
 * Multiple levels of nesting.
 */
export const DeepNesting: Story = {
  render: () => (
    <Tree className="h-full">
      <Folder element="Level 1" value="1">
        <Folder element="Level 2" value="2">
          <Folder element="Level 3" value="3">
            <Folder element="Level 4" value="4">
              <File value="deep-file.txt">
                <span>deep-file.txt</span>
              </File>
            </Folder>
          </Folder>
        </Folder>
        <File value="level1-file.txt">
          <span>level1-file.txt</span>
        </File>
      </Folder>
    </Tree>
  ),
};

/**
 * MinIO bucket browser example.
 * Complete storage UI with buckets and objects.
 */
export const MinIOBrowser: Story = {
  render: () => (
    <div className="w-full max-w-2xl h-[500px] glass-card rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="font-montserrat-alt text-white text-lg">Storage Browser</h3>
        <p className="text-white/60 text-sm mt-1">Browse your MinIO buckets and objects</p>
      </div>
      <Tree className="h-[calc(100%-80px)]" initialExpandedItems={['bucket1', 'images']}>
        <Folder element="my-bucket" value="bucket1">
          <Folder element="images" value="images">
            <File value="logo.png" fileIcon={<Image className="size-4 text-green-500" />}>
              <span>logo.png</span>
              <span className="ml-auto text-xs text-white/40">2.3 MB</span>
            </File>
            <File value="banner.jpg" fileIcon={<Image className="size-4 text-green-500" />}>
              <span>banner.jpg</span>
              <span className="ml-auto text-xs text-white/40">1.8 MB</span>
            </File>
          </Folder>
          <Folder element="documents" value="documents">
            <File value="report.pdf" fileIcon={<FileText className="size-4 text-red-500" />}>
              <span>report.pdf</span>
              <span className="ml-auto text-xs text-white/40">456 KB</span>
            </File>
            <File value="data.xlsx" fileIcon={<FileText className="size-4 text-green-600" />}>
              <span>data.xlsx</span>
              <span className="ml-auto text-xs text-white/40">89 KB</span>
            </File>
          </Folder>
          <Folder element="videos" value="videos">
            <File value="intro.mp4" fileIcon={<Video className="size-4 text-purple-500" />}>
              <span>intro.mp4</span>
              <span className="ml-auto text-xs text-white/40">15.2 MB</span>
            </File>
          </Folder>
        </Folder>
        <Folder element="backup-bucket" value="bucket2">
          <File value="backup-2024.tar.gz" fileIcon={<Database className="size-4 text-primary" />}>
            <span>backup-2024.tar.gz</span>
            <span className="ml-auto text-xs text-white/40">523 MB</span>
          </File>
        </Folder>
        <Folder element="public-assets" value="bucket3">
          <File value="favicon.ico" fileIcon={<Image className="size-4 text-blue-500" />}>
            <span>favicon.ico</span>
            <span className="ml-auto text-xs text-white/40">15 KB</span>
          </File>
        </Folder>
      </Tree>
    </div>
  ),
};

/**
 * File tree with collapse all button.
 * Expand or collapse entire tree with one click.
 */
export const WithCollapseButton: Story = {
  render: () => (
    <div className="relative w-full h-full">
      <Tree className="h-full" elements={sampleTree}>
        <Folder element="Documents" value="1">
          <Folder element="Reports" value="2">
            <File value="Q1-2024.pdf">
              <span>Q1-2024.pdf</span>
            </File>
            <File value="Q2-2024.pdf">
              <span>Q2-2024.pdf</span>
            </File>
          </Folder>
          <File value="Presentation.pptx">
            <span>Presentation.pptx</span>
          </File>
        </Folder>
        <Folder element="Images" value="7">
          <File value="vacation.jpg">
            <span>vacation.jpg</span>
          </File>
        </Folder>
        <CollapseButton elements={sampleTree}>
          <span className="text-xs">Collapse All</span>
        </CollapseButton>
      </Tree>
    </div>
  ),
};

/**
 * File tree with file metadata.
 * Show file sizes, dates, and other metadata.
 */
export const WithMetadata: Story = {
  render: () => (
    <Tree className="h-full">
      <Folder element="Projects" value="1">
        <File value="package.json" fileIcon={<Code className="size-4 text-green-500" />}>
          <div className="flex items-center justify-between flex-1">
            <span>package.json</span>
            <div className="flex gap-3 text-xs text-white/40">
              <span>2.1 KB</span>
              <span>Today</span>
            </div>
          </div>
        </File>
        <File value="README.md" fileIcon={<FileText className="size-4 text-blue-500" />}>
          <div className="flex items-center justify-between flex-1">
            <span>README.md</span>
            <div className="flex gap-3 text-xs text-white/40">
              <span>1.5 KB</span>
              <span>Yesterday</span>
            </div>
          </div>
        </File>
      </Folder>
    </Tree>
  ),
};

/**
 * Empty file tree state.
 * Showing empty state message.
 */
export const EmptyState: Story = {
  render: () => (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-2">
        <p className="text-white/60 font-montserrat-alt">No files or folders</p>
        <button className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors">
          Upload Files
        </button>
      </div>
    </div>
  ),
};
