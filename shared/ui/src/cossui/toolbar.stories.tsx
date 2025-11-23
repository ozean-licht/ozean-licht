import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Toolbar, ToolbarGroup, ToolbarButton, ToolbarSeparator } from './toolbar'
import { Toggle } from './toggle'
import { Label } from './label'

const meta: Meta<typeof Toolbar> = {
  title: 'CossUI/Toolbar',
  component: Toolbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Toolbar component from Coss UI adapted for Ozean Licht design system. Built on Base UI with glass morphism effects, Ozean turquoise (#0ec2bc) accent color, and full accessibility support. Ideal for text editors, document tools, view controls, and action groups.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Child elements (ToolbarGroup, ToolbarButton, ToolbarSeparator)',
    },
  },
}

export default meta
type Story = StoryObj<typeof Toolbar>

// ============================================================================
// BASIC EXAMPLES
// ============================================================================

/**
 * Basic toolbar with text formatting buttons
 */
export const Default: Story = {
  render: () => (
    <Toolbar>
      <ToolbarButton size="sm">Bold</ToolbarButton>
      <ToolbarButton size="sm">Italic</ToolbarButton>
      <ToolbarButton size="sm">Underline</ToolbarButton>
    </Toolbar>
  ),
}

/**
 * Toolbar with grouped buttons and separator
 */
export const WithGroups: Story = {
  render: () => (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarButton size="sm">Bold</ToolbarButton>
        <ToolbarButton size="sm">Italic</ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton size="sm">Save</ToolbarButton>
        <ToolbarButton size="sm">Publish</ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  ),
}

/**
 * Icon-only toolbar with compact spacing
 */
export const IconButtons: Story = {
  render: () => (
    <Toolbar>
      <ToolbarButton size="icon" aria-label="Bold" title="Bold (Ctrl+B)">
        B
      </ToolbarButton>
      <ToolbarButton size="icon" aria-label="Italic" title="Italic (Ctrl+I)">
        I
      </ToolbarButton>
      <ToolbarButton size="icon" aria-label="Underline" title="Underline (Ctrl+U)">
        U
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton size="icon" aria-label="Link" title="Insert link">
        🔗
      </ToolbarButton>
    </Toolbar>
  ),
}

// ============================================================================
// BUTTON VARIANTS
// ============================================================================

/**
 * Toolbar with default button variant
 */
export const VariantDefault: Story = {
  render: () => (
    <Toolbar>
      <ToolbarButton variant="default" size="sm">
        Default
      </ToolbarButton>
      <ToolbarButton variant="default" size="sm">
        Buttons
      </ToolbarButton>
    </Toolbar>
  ),
}

/**
 * Toolbar with ghost button variant (minimal styling)
 */
export const VariantGhost: Story = {
  render: () => (
    <Toolbar>
      <ToolbarButton variant="ghost" size="sm">
        Ghost
      </ToolbarButton>
      <ToolbarButton variant="ghost" size="sm">
        Buttons
      </ToolbarButton>
    </Toolbar>
  ),
}

/**
 * Toolbar with outline button variant
 */
export const VariantOutline: Story = {
  render: () => (
    <Toolbar>
      <ToolbarButton variant="outline" size="sm">
        Outline
      </ToolbarButton>
      <ToolbarButton variant="outline" size="sm">
        Buttons
      </ToolbarButton>
    </Toolbar>
  ),
}

/**
 * All button variants for comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
          Default
        </Label>
        <Toolbar>
          <ToolbarButton variant="default" size="sm">
            Default
          </ToolbarButton>
          <ToolbarButton variant="default" size="sm">
            Buttons
          </ToolbarButton>
        </Toolbar>
      </div>

      <div>
        <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
          Ghost
        </Label>
        <Toolbar>
          <ToolbarButton variant="ghost" size="sm">
            Ghost
          </ToolbarButton>
          <ToolbarButton variant="ghost" size="sm">
            Buttons
          </ToolbarButton>
        </Toolbar>
      </div>

      <div>
        <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
          Outline
        </Label>
        <Toolbar>
          <ToolbarButton variant="outline" size="sm">
            Outline
          </ToolbarButton>
          <ToolbarButton variant="outline" size="sm">
            Buttons
          </ToolbarButton>
        </Toolbar>
      </div>
    </div>
  ),
}

// ============================================================================
// BUTTON SIZES
// ============================================================================

/**
 * Toolbar with small buttons
 */
export const SizeSmall: Story = {
  render: () => (
    <Toolbar>
      <ToolbarButton size="sm">Small</ToolbarButton>
      <ToolbarButton size="sm">Buttons</ToolbarButton>
    </Toolbar>
  ),
}

/**
 * Toolbar with default size buttons
 */
export const SizeDefault: Story = {
  render: () => (
    <Toolbar>
      <ToolbarButton size="default">Default</ToolbarButton>
      <ToolbarButton size="default">Buttons</ToolbarButton>
    </Toolbar>
  ),
}

/**
 * Toolbar with large buttons
 */
export const SizeLarge: Story = {
  render: () => (
    <Toolbar>
      <ToolbarButton size="lg">Large</ToolbarButton>
      <ToolbarButton size="lg">Buttons</ToolbarButton>
    </Toolbar>
  ),
}

/**
 * All button sizes displayed
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
          Small
        </Label>
        <Toolbar>
          <ToolbarButton size="sm">Small</ToolbarButton>
          <ToolbarButton size="sm">Buttons</ToolbarButton>
        </Toolbar>
      </div>

      <div>
        <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
          Default
        </Label>
        <Toolbar>
          <ToolbarButton size="default">Default</ToolbarButton>
          <ToolbarButton size="default">Buttons</ToolbarButton>
        </Toolbar>
      </div>

      <div>
        <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
          Large
        </Label>
        <Toolbar>
          <ToolbarButton size="lg">Large</ToolbarButton>
          <ToolbarButton size="lg">Buttons</ToolbarButton>
        </Toolbar>
      </div>

      <div>
        <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
          Icon
        </Label>
        <Toolbar>
          <ToolbarButton size="icon" aria-label="Action 1">
            A
          </ToolbarButton>
          <ToolbarButton size="icon" aria-label="Action 2">
            B
          </ToolbarButton>
        </Toolbar>
      </div>
    </div>
  ),
}

// ============================================================================
// SEPARATORS
// ============================================================================

/**
 * Toolbar with multiple groups separated
 */
export const WithSeparators: Story = {
  render: () => (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarButton size="sm">Save</ToolbarButton>
        <ToolbarButton size="sm">Load</ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton size="sm">Undo</ToolbarButton>
        <ToolbarButton size="sm">Redo</ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton size="sm">Help</ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  ),
}

/**
 * Complex toolbar with multiple separators and groups
 */
export const ComplexLayout: Story = {
  render: () => (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarButton size="icon" aria-label="New">
          📄
        </ToolbarButton>
        <ToolbarButton size="icon" aria-label="Open">
          📁
        </ToolbarButton>
        <ToolbarButton size="icon" aria-label="Save">
          💾
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton size="icon" aria-label="Undo">
          ↶
        </ToolbarButton>
        <ToolbarButton size="icon" aria-label="Redo">
          ↷
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton size="icon" aria-label="Bold">
          B
        </ToolbarButton>
        <ToolbarButton size="icon" aria-label="Italic">
          I
        </ToolbarButton>
        <ToolbarButton size="icon" aria-label="Underline">
          U
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton size="icon" aria-label="Align left">
          ◀
        </ToolbarButton>
        <ToolbarButton size="icon" aria-label="Align center">
          ◆
        </ToolbarButton>
        <ToolbarButton size="icon" aria-label="Align right">
          ▶
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  ),
}

// ============================================================================
// STATES
// ============================================================================

/**
 * Disabled toolbar button
 */
export const DisabledButton: Story = {
  render: () => (
    <Toolbar>
      <ToolbarButton size="sm">Enabled</ToolbarButton>
      <ToolbarButton size="sm" disabled>
        Disabled
      </ToolbarButton>
      <ToolbarButton size="sm">Enabled</ToolbarButton>
    </Toolbar>
  ),
}

/**
 * Toolbar with focus demonstration for accessibility
 */
export const FocusState: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="p-3 rounded-lg bg-card/50 border border-border">
        <p className="text-xs text-muted-foreground">
          Tab through the toolbar buttons to see focus state with turquoise ring
        </p>
      </div>

      <Toolbar>
        <ToolbarButton size="sm">First</ToolbarButton>
        <ToolbarButton size="sm" autoFocus>
          Focused
        </ToolbarButton>
        <ToolbarButton size="sm">Third</ToolbarButton>
      </Toolbar>
    </div>
  ),
}

// ============================================================================
// REAL-WORLD USE CASES
// ============================================================================

/**
 * Text editor formatting toolbar
 */
export const TextEditorToolbar: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <div className="p-4 rounded-lg bg-card/50 border border-border text-sm font-light">
          <p className="text-muted-foreground">
            This simulates a rich text editor toolbar with formatting options
          </p>
        </div>

        <Toolbar>
          <ToolbarGroup>
            <ToolbarButton size="icon" aria-label="Bold" title="Bold (Ctrl+B)">
              B
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Italic" title="Italic (Ctrl+I)">
              I
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Underline" title="Underline (Ctrl+U)">
              U
            </ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <ToolbarButton size="icon" aria-label="Align left">
              ◀
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Align center">
              ◆
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Align right">
              ▶
            </ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <ToolbarButton size="icon" aria-label="Link">
              🔗
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Image">
              🖼️
            </ToolbarButton>
          </ToolbarGroup>
        </Toolbar>
      </div>
    )
  },
}

/**
 * Document toolbar with file operations
 */
export const DocumentToolbar: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <div className="p-4 rounded-lg bg-card/50 border border-border text-sm font-light">
        <p className="text-muted-foreground">
          Document manipulation toolbar with file operations and view controls
        </p>
      </div>

      <Toolbar>
        <ToolbarGroup>
          <ToolbarButton size="icon" aria-label="New document" title="New">
            📄
          </ToolbarButton>
          <ToolbarButton size="icon" aria-label="Open file" title="Open">
            📁
          </ToolbarButton>
          <ToolbarButton size="icon" aria-label="Save" title="Save">
            💾
          </ToolbarButton>
          <ToolbarButton size="icon" aria-label="Print" title="Print">
            🖨️
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <ToolbarButton size="icon" aria-label="Undo" title="Undo">
            ↶
          </ToolbarButton>
          <ToolbarButton size="icon" aria-label="Redo" title="Redo">
            ↷
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <ToolbarButton size="icon" aria-label="Grid view" title="Grid">
            ⊞
          </ToolbarButton>
          <ToolbarButton size="icon" aria-label="List view" title="List">
            ☰
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
    </div>
  ),
}

/**
 * Image editor toolbar with tool selection
 */
export const ImageEditorToolbar: Story = {
  render: () => {
    const [tool, setTool] = React.useState<string>('select')

    return (
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <div className="p-4 rounded-lg bg-card/50 border border-border text-sm font-light">
          <p className="text-muted-foreground">
            Image editor toolbar with tool selection and effects
          </p>
          <p className="text-xs text-primary font-semibold mt-2">
            Current tool: {tool}
          </p>
        </div>

        <Toolbar>
          <ToolbarGroup>
            <ToolbarButton
              size="icon"
              aria-label="Select tool"
              title="Select (V)"
              variant={tool === 'select' ? 'default' : 'ghost'}
              onClick={() => setTool('select')}
            >
              ➤
            </ToolbarButton>
            <ToolbarButton
              size="icon"
              aria-label="Brush tool"
              title="Brush (B)"
              variant={tool === 'brush' ? 'default' : 'ghost'}
              onClick={() => setTool('brush')}
            >
              🖌️
            </ToolbarButton>
            <ToolbarButton
              size="icon"
              aria-label="Eraser tool"
              title="Eraser (E)"
              variant={tool === 'eraser' ? 'default' : 'ghost'}
              onClick={() => setTool('eraser')}
            >
              🧹
            </ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <ToolbarButton size="icon" aria-label="Crop">
              ⊟
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Rotate">
              ⟳
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Flip">
              ⇄
            </ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <ToolbarButton size="icon" aria-label="Zoom in">
              🔍+
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Zoom out">
              🔍−
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Fit to window">
              ↔️
            </ToolbarButton>
          </ToolbarGroup>
        </Toolbar>
      </div>
    )
  },
}

/**
 * Data table view controls toolbar
 */
export const DataTableToolbar: Story = {
  render: () => {
    const [view, setView] = React.useState<string>('grid')

    return (
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <div className="p-4 rounded-lg bg-card/50 border border-border text-sm font-light">
          <p className="text-muted-foreground">
            Data table controls with view mode switching
          </p>
          <p className="text-xs text-primary font-semibold mt-2">
            View: {view}
          </p>
        </div>

        <Toolbar>
          <ToolbarGroup>
            <ToolbarButton
              size="sm"
              variant={view === 'grid' ? 'default' : 'ghost'}
              onClick={() => setView('grid')}
            >
              ⊞ Grid
            </ToolbarButton>
            <ToolbarButton
              size="sm"
              variant={view === 'list' ? 'default' : 'ghost'}
              onClick={() => setView('list')}
            >
              ☰ List
            </ToolbarButton>
            <ToolbarButton
              size="sm"
              variant={view === 'table' ? 'default' : 'ghost'}
              onClick={() => setView('table')}
            >
              ⊟ Table
            </ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <ToolbarButton size="icon" aria-label="Settings">
              ⚙️
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Filter">
              ⊕
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Export">
              ⬇️
            </ToolbarButton>
          </ToolbarGroup>
        </Toolbar>
      </div>
    )
  },
}

/**
 * Video player controls toolbar
 */
export const VideoPlayerToolbar: Story = {
  render: () => {
    const [isPlaying, setIsPlaying] = React.useState(false)

    return (
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <div className="p-4 rounded-lg bg-card/50 border border-border text-sm font-light">
          <p className="text-muted-foreground">
            Video player playback controls
          </p>
          <p className="text-xs text-primary font-semibold mt-2">
            {isPlaying ? 'Playing' : 'Paused'}
          </p>
        </div>

        <Toolbar>
          <ToolbarGroup>
            <ToolbarButton
              size="icon"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? '⏸' : '▶️'}
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Stop">
              ⏹️
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Previous">
              ⏮️
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Next">
              ⏭️
            </ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <ToolbarButton size="icon" aria-label="Volume">
              🔊
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Subtitles">
              CC
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Fullscreen">
              ⛶
            </ToolbarButton>
          </ToolbarGroup>
        </Toolbar>
      </div>
    )
  },
}

// ============================================================================
// COMPOSITION WITH TOGGLE
// ============================================================================

/**
 * Toolbar with Toggle composition for state management
 */
export const WithToggleComposition: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <div className="p-4 rounded-lg bg-card/50 border border-border text-sm font-light">
        <p className="text-muted-foreground">
          Toolbar buttons with Toggle component composition for togglable states
        </p>
      </div>

      <Toolbar>
        <ToolbarGroup>
          <ToolbarButton render={<Toggle />} size="sm" aria-label="Bold">
            Bold
          </ToolbarButton>
          <ToolbarButton render={<Toggle />} size="sm" aria-label="Italic">
            Italic
          </ToolbarButton>
          <ToolbarButton render={<Toggle />} size="sm" aria-label="Underline">
            Underline
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
    </div>
  ),
}

// ============================================================================
// ACCESSIBILITY
// ============================================================================

/**
 * Accessibility demonstration with ARIA attributes
 */
export const AccessibilityExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <div className="p-3 rounded-lg bg-card/50 border border-border">
        <p className="text-xs text-muted-foreground">
          This toolbar includes proper ARIA attributes and keyboard navigation:
        </p>
        <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
          <li>Toolbar role for screen readers</li>
          <li>Button labels and aria-labels for icon buttons</li>
          <li>Title attributes for keyboard hints</li>
          <li>Full keyboard navigation support</li>
          <li>Focus indicators visible on all buttons</li>
        </ul>
      </div>

      <Toolbar>
        <ToolbarGroup>
          <ToolbarButton
            size="icon"
            aria-label="Bold"
            title="Make text bold (Ctrl+B)"
          >
            B
          </ToolbarButton>
          <ToolbarButton
            size="icon"
            aria-label="Italic"
            title="Make text italic (Ctrl+I)"
          >
            I
          </ToolbarButton>
          <ToolbarButton
            size="icon"
            aria-label="Underline"
            title="Underline text (Ctrl+U)"
          >
            U
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <ToolbarButton
            size="icon"
            aria-label="Insert link"
            title="Insert hyperlink (Ctrl+K)"
          >
            🔗
          </ToolbarButton>
          <ToolbarButton
            size="icon"
            aria-label="Insert image"
            title="Insert image"
          >
            🖼️
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
    </div>
  ),
}

/**
 * Keyboard navigation demonstration
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <div className="p-3 rounded-lg bg-card/50 border border-border">
        <p className="text-xs text-muted-foreground">
          Try tabbing through these toolbar buttons - focus ring is visible with Ozean turquoise color
        </p>
      </div>

      <Toolbar>
        <ToolbarButton size="sm">First</ToolbarButton>
        <ToolbarButton size="sm">Second</ToolbarButton>
        <ToolbarButton size="sm" autoFocus>
          Third (Auto-focused)
        </ToolbarButton>
        <ToolbarButton size="sm">Fourth</ToolbarButton>
        <ToolbarButton size="sm">Fifth</ToolbarButton>
      </Toolbar>
    </div>
  ),
}
