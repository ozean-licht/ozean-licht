import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  List,
  LayoutGrid,
  Calendar,
  Filter,
  Star,
  Heart,
  Bookmark,
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

/**
 * ToggleGroup primitive component built on Radix UI ToggleGroup.
 *
 * **This is a Tier 1 Primitive** - unstyled Radix UI component with minimal default styling.
 * No Tier 2 branded version exists for this component.
 *
 * ## Radix UI ToggleGroup Features
 * - **Accessible**: Proper ARIA attributes, keyboard navigation (arrow keys), focus management
 * - **Two Types**: Single selection (radio-like) or multiple selection (checkbox-like)
 * - **Composable**: Built from individual ToggleGroupItem components
 * - **Context-aware**: Items inherit variant/size from ToggleGroup
 * - **Keyboard Navigation**: Arrow keys move focus, Space/Enter toggle
 * - **Unselectable**: Items can be toggled off (unlike radio groups)
 *
 * ## Component Structure
 * ```tsx
 * <ToggleGroup type="single" | "multiple"> // Root - manages selection state
 *   <ToggleGroupItem value="value1">Item 1</ToggleGroupItem>
 *   <ToggleGroupItem value="value2">Item 2</ToggleGroupItem>
 *   <ToggleGroupItem value="value3">Item 3</ToggleGroupItem>
 * </ToggleGroup>
 * ```
 *
 * ## Selection Types
 * - **type="single"**: Only one item can be selected at a time (like radio buttons)
 * - **type="multiple"**: Multiple items can be selected simultaneously (like checkboxes)
 *
 * ## Variants & Sizes
 * - **Variants**: `default` (transparent), `outline` (with border)
 * - **Sizes**: `sm` (36px), `default` (40px), `lg` (44px)
 * - Set on ToggleGroup to apply to all items, or override per item
 *
 * ## Common Use Cases
 * - Text alignment controls (left/center/right/justify)
 * - Text formatting toolbars (bold/italic/underline)
 * - View mode switching (list/grid/calendar)
 * - Filter toggles (category filters)
 * - Icon-only button groups
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A set of two-state buttons that can be toggled on or off. Supports single selection (radio-like) or multiple selection (checkbox-like) modes. Built on Radix UI ToggleGroup primitive.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default single selection toggle group.
 *
 * Only one item can be selected at a time. Click an active item to deselect it.
 */
export const Default: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="center">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/**
 * Multiple selection toggle group.
 *
 * Multiple items can be selected simultaneously. This is useful for formatting
 * toolbars where multiple styles can be applied at once.
 */
export const MultipleSelection: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={['bold']}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/**
 * All variants demonstration.
 *
 * Shows default (transparent) and outline variants in different sizes.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Default Variant</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">Small</span>
            <ToggleGroup type="single" variant="default" size="sm" defaultValue="center">
              <ToggleGroupItem value="left">
                <AlignLeft />
              </ToggleGroupItem>
              <ToggleGroupItem value="center">
                <AlignCenter />
              </ToggleGroupItem>
              <ToggleGroupItem value="right">
                <AlignRight />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">Default</span>
            <ToggleGroup type="single" variant="default" size="default" defaultValue="center">
              <ToggleGroupItem value="left">
                <AlignLeft />
              </ToggleGroupItem>
              <ToggleGroupItem value="center">
                <AlignCenter />
              </ToggleGroupItem>
              <ToggleGroupItem value="right">
                <AlignRight />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">Large</span>
            <ToggleGroup type="single" variant="default" size="lg" defaultValue="center">
              <ToggleGroupItem value="left">
                <AlignLeft />
              </ToggleGroupItem>
              <ToggleGroupItem value="center">
                <AlignCenter />
              </ToggleGroupItem>
              <ToggleGroupItem value="right">
                <AlignRight />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Outline Variant</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">Small</span>
            <ToggleGroup type="single" variant="outline" size="sm" defaultValue="center">
              <ToggleGroupItem value="left">
                <AlignLeft />
              </ToggleGroupItem>
              <ToggleGroupItem value="center">
                <AlignCenter />
              </ToggleGroupItem>
              <ToggleGroupItem value="right">
                <AlignRight />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">Default</span>
            <ToggleGroup type="single" variant="outline" size="default" defaultValue="center">
              <ToggleGroupItem value="left">
                <AlignLeft />
              </ToggleGroupItem>
              <ToggleGroupItem value="center">
                <AlignCenter />
              </ToggleGroupItem>
              <ToggleGroupItem value="right">
                <AlignRight />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">Large</span>
            <ToggleGroup type="single" variant="outline" size="lg" defaultValue="center">
              <ToggleGroupItem value="left">
                <AlignLeft />
              </ToggleGroupItem>
              <ToggleGroupItem value="center">
                <AlignCenter />
              </ToggleGroupItem>
              <ToggleGroupItem value="right">
                <AlignRight />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Text alignment control.
 *
 * Classic use case for toggle groups - text alignment in a rich text editor.
 */
export const TextAlignment: Story = {
  render: () => (
    <div className="space-y-4">
      <ToggleGroup type="single" variant="outline" defaultValue="left">
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeft />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenter />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRight />
        </ToggleGroupItem>
        <ToggleGroupItem value="justify" aria-label="Justify">
          <AlignJustify />
        </ToggleGroupItem>
      </ToggleGroup>
      <p className="text-sm text-muted-foreground max-w-md">
        Use arrow keys to navigate between items, Space or Enter to select.
      </p>
    </div>
  ),
};

/**
 * View mode switcher.
 *
 * Switch between different view modes like list, grid, and calendar.
 */
export const ViewModes: Story = {
  render: () => (
    <ToggleGroup type="single" variant="outline" defaultValue="list">
      <ToggleGroupItem value="list" aria-label="List view">
        <List />
        <span>List</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGrid />
        <span>Grid</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="calendar" aria-label="Calendar view">
        <Calendar />
        <span>Calendar</span>
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/**
 * With icons and text.
 *
 * Combining icons with text labels for better clarity.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-medium">Icon + Text</p>
        <ToggleGroup type="single" variant="outline" defaultValue="filter">
          <ToggleGroupItem value="filter">
            <Filter />
            <span>Filter</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="star">
            <Star />
            <span>Star</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="bookmark">
            <Bookmark />
            <span>Bookmark</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium">Icon Only</p>
        <ToggleGroup type="multiple" variant="outline">
          <ToggleGroupItem value="star" aria-label="Star">
            <Star />
          </ToggleGroupItem>
          <ToggleGroupItem value="heart" aria-label="Heart">
            <Heart />
          </ToggleGroupItem>
          <ToggleGroupItem value="bookmark" aria-label="Bookmark">
            <Bookmark />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
};

/**
 * Disabled state.
 *
 * Individual items can be disabled while others remain interactive.
 */
export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-medium">Entire group disabled</p>
        <ToggleGroup type="single" variant="outline" disabled>
          <ToggleGroupItem value="left">
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center">
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right">
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium">Individual items disabled</p>
        <ToggleGroup type="single" variant="outline" defaultValue="left">
          <ToggleGroupItem value="left">
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" disabled>
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right">
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-muted-foreground">Center alignment is disabled</p>
      </div>
    </div>
  ),
};

/**
 * Controlled value state.
 *
 * Demonstrates controlling the toggle group value programmatically using state.
 */
export const ControlledValue: Story = {
  render: () => {
    const ControlledExample = () => {
      const [singleValue, setSingleValue] = useState('center');
      const [multipleValue, setMultipleValue] = useState(['bold', 'italic']);

      return (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Single Selection (Controlled)</h3>
              <span className="text-xs text-muted-foreground">
                Selected: {singleValue || 'none'}
              </span>
            </div>
            <ToggleGroup
              type="single"
              variant="outline"
              value={singleValue}
              onValueChange={setSingleValue}
            >
              <ToggleGroupItem value="left" aria-label="Align left">
                <AlignLeft />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center">
                <AlignCenter />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right">
                <AlignRight />
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="flex gap-2">
              <button
                onClick={() => setSingleValue('left')}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Set Left
              </button>
              <button
                onClick={() => setSingleValue('center')}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Set Center
              </button>
              <button
                onClick={() => setSingleValue('')}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Multiple Selection (Controlled)</h3>
              <span className="text-xs text-muted-foreground">
                Selected: {multipleValue.length > 0 ? multipleValue.join(', ') : 'none'}
              </span>
            </div>
            <ToggleGroup
              type="multiple"
              variant="outline"
              value={multipleValue}
              onValueChange={setMultipleValue}
            >
              <ToggleGroupItem value="bold" aria-label="Bold">
                <Bold />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Italic">
                <Italic />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Underline">
                <Underline />
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="flex gap-2">
              <button
                onClick={() => setMultipleValue(['bold', 'italic', 'underline'])}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Select All
              </button>
              <button
                onClick={() => setMultipleValue([])}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      );
    };

    return <ControlledExample />;
  },
};

/**
 * Rich text formatting toolbar.
 *
 * Complete example of a text formatting toolbar with multiple toggle groups
 * for different formatting categories.
 */
export const TextFormatToolbar: Story = {
  render: () => {
    const FormatToolbar = () => {
      const [alignment, setAlignment] = useState('left');
      const [formatting, setFormatting] = useState<string[]>([]);

      return (
        <div className="space-y-4 max-w-2xl">
          <div className="border rounded-lg p-4 space-y-3 bg-white">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Format:</span>
                <ToggleGroup
                  type="multiple"
                  variant="outline"
                  size="sm"
                  value={formatting}
                  onValueChange={setFormatting}
                >
                  <ToggleGroupItem value="bold" aria-label="Toggle bold">
                    <Bold />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label="Toggle italic">
                    <Italic />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="underline" aria-label="Toggle underline">
                    <Underline />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="h-6 w-px bg-gray-200" />

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Align:</span>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  value={alignment}
                  onValueChange={setAlignment}
                >
                  <ToggleGroupItem value="left" aria-label="Align left">
                    <AlignLeft />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="center" aria-label="Align center">
                    <AlignCenter />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="right" aria-label="Align right">
                    <AlignRight />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="justify" aria-label="Justify">
                    <AlignJustify />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 min-h-[200px] bg-white">
            <p
              className="text-sm"
              style={{
                textAlign: alignment as any,
                fontWeight: formatting.includes('bold') ? 'bold' : 'normal',
                fontStyle: formatting.includes('italic') ? 'italic' : 'normal',
                textDecoration: formatting.includes('underline') ? 'underline' : 'none',
              }}
            >
              This is example text that demonstrates the formatting toolbar above.
              Select different formatting options and alignment to see how they affect
              this text. The toggle groups allow you to combine multiple text styles
              simultaneously.
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Active formatting: {formatting.length > 0 ? formatting.join(', ') : 'none'}</p>
            <p>Text alignment: {alignment}</p>
          </div>
        </div>
      );
    };

    return <FormatToolbar />;
  },
};

/**
 * Filter toggle group.
 *
 * Use toggle groups for filtering content with multiple categories.
 */
export const FilterToggles: Story = {
  render: () => {
    const FilterExample = () => {
      const [filters, setFilters] = useState<string[]>(['all']);

      return (
        <div className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Filter Content</h3>
            <ToggleGroup
              type="multiple"
              variant="outline"
              value={filters}
              onValueChange={setFilters}
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="active">Active</ToggleGroupItem>
              <ToggleGroupItem value="draft">Draft</ToggleGroupItem>
              <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-muted-foreground">
              Showing items with filters: {filters.length > 0 ? filters.join(', ') : 'none'}
            </p>
          </div>
        </div>
      );
    };

    return <FilterExample />;
  },
};

/**
 * Ozean Licht themed example.
 *
 * ToggleGroup using the Ozean Licht turquoise color (#0ec2bc) for active states.
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Turquoise Accent (Default Variant)</h3>
        <ToggleGroup type="single" variant="default" defaultValue="center">
          <ToggleGroupItem
            value="left"
            className="data-[state=on]:bg-[#0ec2bc] data-[state=on]:text-white"
          >
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="center"
            className="data-[state=on]:bg-[#0ec2bc] data-[state=on]:text-white"
          >
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="right"
            className="data-[state=on]:bg-[#0ec2bc] data-[state=on]:text-white"
          >
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Turquoise Border (Outline Variant)</h3>
        <ToggleGroup type="multiple" variant="outline" defaultValue={['bold']}>
          <ToggleGroupItem
            value="bold"
            className="data-[state=on]:border-[#0ec2bc] data-[state=on]:bg-[#0ec2bc]/10 data-[state=on]:text-[#0ec2bc]"
          >
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            className="data-[state=on]:border-[#0ec2bc] data-[state=on]:bg-[#0ec2bc]/10 data-[state=on]:text-[#0ec2bc]"
          >
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="underline"
            className="data-[state=on]:border-[#0ec2bc] data-[state=on]:bg-[#0ec2bc]/10 data-[state=on]:text-[#0ec2bc]"
          >
            <Underline />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <p className="text-xs text-muted-foreground">
        Active items use Ozean Licht primary color (#0ec2bc) for visual feedback.
      </p>
    </div>
  ),
};

/**
 * Accessibility demonstration.
 *
 * Shows proper ARIA labels and keyboard navigation hints.
 */
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">With ARIA Labels</h3>
        <ToggleGroup type="single" variant="outline" defaultValue="center">
          <ToggleGroupItem value="left" aria-label="Align text to the left">
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align text to the center">
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align text to the right">
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="border rounded-lg p-4 bg-blue-50 space-y-2">
        <h4 className="text-sm font-medium">Keyboard Navigation</h4>
        <ul className="text-xs space-y-1 text-muted-foreground">
          <li><kbd className="px-1.5 py-0.5 bg-white border rounded">Tab</kbd> - Focus the toggle group</li>
          <li><kbd className="px-1.5 py-0.5 bg-white border rounded">→</kbd> / <kbd className="px-1.5 py-0.5 bg-white border rounded">←</kbd> - Navigate between items</li>
          <li><kbd className="px-1.5 py-0.5 bg-white border rounded">Space</kbd> / <kbd className="px-1.5 py-0.5 bg-white border rounded">Enter</kbd> - Toggle the focused item</li>
          <li><kbd className="px-1.5 py-0.5 bg-white border rounded">Home</kbd> - Focus first item</li>
          <li><kbd className="px-1.5 py-0.5 bg-white border rounded">End</kbd> - Focus last item</li>
        </ul>
      </div>

      <div className="border rounded-lg p-4 bg-amber-50 space-y-2">
        <h4 className="text-sm font-medium">Best Practices</h4>
        <ul className="text-xs space-y-1 text-muted-foreground">
          <li>• Always provide aria-label for icon-only items</li>
          <li>• Use semantic value names (e.g., "left", "bold") not numbers</li>
          <li>• Ensure sufficient color contrast for active states</li>
          <li>• Provide visual feedback for disabled items</li>
          <li>• Consider adding tooltips for complex icon-only buttons</li>
        </ul>
      </div>
    </div>
  ),
};
