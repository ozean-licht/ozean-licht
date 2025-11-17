import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Button } from './button';
import { Info, Plus, Settings, Trash2 } from 'lucide-react';

/**
 * Tooltip component for displaying helpful information.
 * Built on Radix UI Tooltip primitive.
 *
 * ## Features
 * - Appears on hover with delay
 * - Four side positions (top, right, bottom, left)
 * - Keyboard accessible
 * - Auto-positioning to stay in viewport
 * - Smooth fade-in animation
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex items-center justify-center p-20">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default tooltip on top
 */
export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Tooltip on different sides
 */
export const Sides: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top (default)</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

/**
 * Tooltip with icon button
 */
export const WithIconButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="ghost">
          <Info className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>More information</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Multiple tooltips
 */
export const Multiple: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add new item</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete item</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

/**
 * Tooltip with detailed content
 */
export const DetailedContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Deployment Status</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-2">
          <p className="font-semibold">Deployment Information</p>
          <p className="text-xs">Last deployed: 2 hours ago</p>
          <p className="text-xs">Status: Active</p>
          <p className="text-xs">Version: v2.4.1</p>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Tooltip with keyboard shortcut
 */
export const WithKeyboardShortcut: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Save</Button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center gap-2">
          <span>Save changes</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>S
          </kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Disabled trigger with tooltip
 */
export const DisabledTrigger: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>
          <Button disabled variant="outline" className="pointer-events-none">
            Disabled Button
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>This action is currently unavailable</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Tooltip in a toolbar
 */
export const Toolbar: Story = {
  render: () => (
    <div className="flex items-center gap-1 rounded-lg border p-2">
      {['Bold', 'Italic', 'Underline', 'Strike'].map((format) => (
        <Tooltip key={format}>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <span className="font-bold text-sm">{format[0]}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{format}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};
