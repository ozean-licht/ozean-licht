import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { Toggle } from './toggle';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Grid,
  Rows,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Sun,
  Moon,
} from 'lucide-react';

/**
 * Toggle primitive component built on Radix UI Toggle.
 *
 * **This is a Tier 1 Primitive** - unstyled Radix UI component with minimal default styling.
 * No Tier 2 branded version exists for this component.
 *
 * ## Radix UI Toggle Features
 * - **Accessible**: Proper ARIA attributes (aria-pressed), keyboard navigation
 * - **Two-State Button**: Toggles between on/off (pressed/unpressed) states
 * - **Keyboard Support**: Space and Enter keys toggle state
 * - **Focus Management**: Proper focus-visible styles
 * - **Composable**: Works standalone or within ToggleGroup
 *
 * ## Use Cases
 * - **Text Formatting**: Bold, italic, underline buttons in rich text editors
 * - **View Modes**: Toggle between list/grid views, show/hide panels
 * - **Settings**: On/off switches for features (dark mode, notifications)
 * - **Filters**: Multiple toggle buttons for filtering data
 * - **Toolbar Actions**: Any action that has a persistent on/off state
 *
 * ## Component Structure
 * ```tsx
 * <Toggle
 *   variant="default" | "outline"
 *   size="default" | "sm" | "lg"
 *   pressed={boolean}         // Controlled state
 *   defaultPressed={boolean}  // Uncontrolled initial state
 *   onPressedChange={(pressed) => void}
 *   disabled={boolean}
 * >
 *   {children}
 * </Toggle>
 * ```
 *
 * ## Variants
 * - **default**: Transparent background, accent color when pressed
 * - **outline**: Border with background changes on hover/press
 *
 * ## Sizes
 * - **sm**: Height 36px (h-9), min-width 36px, padding 10px
 * - **default**: Height 40px (h-10), min-width 40px, padding 12px
 * - **lg**: Height 44px (h-11), min-width 44px, padding 20px
 *
 * ## State Styling
 * The toggle automatically applies visual feedback:
 * - `data-[state=on]`: Pressed state with accent background
 * - `hover`: Muted background on hover
 * - `disabled`: Reduced opacity, no pointer events
 * - `focus-visible`: Ring outline for keyboard navigation
 *
 * ## Usage Notes
 * - Use for actions that have a persistent on/off state
 * - Don't use for one-time actions (use Button instead)
 * - Include visual feedback (icons, labels) to show current state
 * - Consider ToggleGroup when multiple related toggles are needed
 * - Use aria-label for icon-only toggles for accessibility
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A two-state button that can be toggled on or off. Built on Radix UI Toggle primitive.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default toggle with icon.
 *
 * The most basic toggle implementation showing essential structure.
 */
export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  ),
};

/**
 * All variants demonstration.
 *
 * Shows both available variants: default and outline.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Default Variant</h3>
        <div className="flex gap-2">
          <Toggle variant="default" aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle variant="default" defaultPressed aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle variant="default" disabled aria-label="Toggle underline">
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
        <p className="text-xs text-muted-foreground">
          Transparent background, accent color when pressed
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Outline Variant</h3>
        <div className="flex gap-2">
          <Toggle variant="outline" aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle variant="outline" defaultPressed aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle variant="outline" disabled aria-label="Toggle underline">
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
        <p className="text-xs text-muted-foreground">
          Border with background changes on hover/press
        </p>
      </div>
    </div>
  ),
};

/**
 * All sizes demonstration.
 *
 * Shows all available sizes: sm, default, and lg.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Small (sm)</h3>
        <div className="flex items-center gap-2">
          <Toggle size="sm" aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" variant="outline" aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </Toggle>
          <span className="text-xs text-muted-foreground">Height: 36px</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Default</h3>
        <div className="flex items-center gap-2">
          <Toggle size="default" aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle size="default" variant="outline" aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </Toggle>
          <span className="text-xs text-muted-foreground">Height: 40px</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Large (lg)</h3>
        <div className="flex items-center gap-2">
          <Toggle size="lg" aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle size="lg" variant="outline" aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </Toggle>
          <span className="text-xs text-muted-foreground">Height: 44px</span>
        </div>
      </div>
    </div>
  ),
};

/**
 * With icon examples.
 *
 * Common icons used in text formatting toolbars.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Toggle aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle italic">
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle underline">
          <Underline className="h-4 w-4" />
        </Toggle>
      </div>
      <p className="text-xs text-muted-foreground max-w-[300px]">
        Text formatting toggles - commonly used in rich text editors
      </p>
    </div>
  ),
};

/**
 * With text and icon.
 *
 * Toggles can include both text labels and icons for clarity.
 */
export const WithTextAndIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Toggle aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
          <span>Bold</span>
        </Toggle>
        <Toggle aria-label="Toggle italic">
          <Italic className="h-4 w-4" />
          <span>Italic</span>
        </Toggle>
        <Toggle aria-label="Toggle underline">
          <Underline className="h-4 w-4" />
          <span>Underline</span>
        </Toggle>
      </div>
      <p className="text-xs text-muted-foreground max-w-[300px]">
        Including text labels improves usability and accessibility
      </p>
    </div>
  ),
};

/**
 * Disabled state.
 *
 * Shows disabled toggles in both pressed and unpressed states.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Toggle disabled aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle disabled defaultPressed aria-label="Toggle italic">
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle variant="outline" disabled aria-label="Toggle underline">
          <Underline className="h-4 w-4" />
        </Toggle>
        <Toggle variant="outline" disabled defaultPressed aria-label="Toggle strikethrough">
          <Underline className="h-4 w-4" />
        </Toggle>
      </div>
      <p className="text-xs text-muted-foreground max-w-[300px]">
        Disabled toggles have reduced opacity and no pointer events
      </p>
    </div>
  ),
};

/**
 * Controlled state example.
 *
 * Shows how to control toggle state programmatically using the `pressed` and `onPressedChange` props.
 */
export const ControlledState: Story = {
  render: () => {
    const ControlledToggle = () => {
      const [isBold, setIsBold] = useState(false);
      const [isItalic, setIsItalic] = useState(true);
      const [isUnderline, setIsUnderline] = useState(false);

      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Toggle
              pressed={isBold}
              onPressedChange={setIsBold}
              aria-label="Toggle bold"
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={isItalic}
              onPressedChange={setIsItalic}
              aria-label="Toggle italic"
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={isUnderline}
              onPressedChange={setIsUnderline}
              aria-label="Toggle underline"
            >
              <Underline className="h-4 w-4" />
            </Toggle>
          </div>
          <div className="space-y-1 text-sm">
            <p className="font-medium">Current State:</p>
            <p className="text-muted-foreground">
              Bold: {isBold ? 'On' : 'Off'} | Italic: {isItalic ? 'On' : 'Off'} | Underline:{' '}
              {isUnderline ? 'On' : 'Off'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsBold(true);
                setIsItalic(true);
                setIsUnderline(true);
              }}
              className="px-3 py-1 text-xs bg-muted/30 hover:bg-muted/40 rounded"
            >
              Enable All
            </button>
            <button
              onClick={() => {
                setIsBold(false);
                setIsItalic(false);
                setIsUnderline(false);
              }}
              className="px-3 py-1 text-xs bg-muted/30 hover:bg-muted/40 rounded"
            >
              Disable All
            </button>
          </div>
        </div>
      );
    };

    return <ControlledToggle />;
  },
};

/**
 * Text formatting toolbar.
 *
 * A realistic example of toggles used in a text editor toolbar.
 */
export const TextFormattingToolbar: Story = {
  render: () => {
    const FormattingToolbar = () => {
      const [bold, setBold] = useState(false);
      const [italic, setItalic] = useState(false);
      const [underline, setUnderline] = useState(false);

      return (
        <div className="space-y-4">
          <div className="flex gap-1 p-1 bg-muted rounded-md w-fit">
            <Toggle
              pressed={bold}
              onPressedChange={setBold}
              size="sm"
              aria-label="Toggle bold"
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={italic}
              onPressedChange={setItalic}
              size="sm"
              aria-label="Toggle italic"
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={underline}
              onPressedChange={setUnderline}
              size="sm"
              aria-label="Toggle underline"
            >
              <Underline className="h-4 w-4" />
            </Toggle>
          </div>
          <div className="border rounded-md p-4 min-h-[100px] max-w-[400px]">
            <p
              className={`
                ${bold ? 'font-bold' : ''}
                ${italic ? 'italic' : ''}
                ${underline ? 'underline' : ''}
              `}
            >
              This text reflects the formatting options selected above. Click the
              toolbar buttons to see the changes.
            </p>
          </div>
        </div>
      );
    };

    return <FormattingToolbar />;
  },
};

/**
 * Alignment toggles.
 *
 * Example of using toggles for text alignment options.
 */
export const AlignmentToggles: Story = {
  render: () => {
    const AlignmentToolbar = () => {
      const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');

      return (
        <div className="space-y-4">
          <div className="flex gap-1 p-1 bg-muted rounded-md w-fit">
            <Toggle
              pressed={alignment === 'left'}
              onPressedChange={() => setAlignment('left')}
              aria-label="Align left"
            >
              <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={alignment === 'center'}
              onPressedChange={() => setAlignment('center')}
              aria-label="Align center"
            >
              <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={alignment === 'right'}
              onPressedChange={() => setAlignment('right')}
              aria-label="Align right"
            >
              <AlignRight className="h-4 w-4" />
            </Toggle>
          </div>
          <div className="border rounded-md p-4 max-w-[400px]">
            <p className={`text-${alignment}`} style={{ textAlign: alignment }}>
              This text is aligned {alignment}. Use the toolbar above to change the alignment.
            </p>
          </div>
        </div>
      );
    };

    return <AlignmentToolbar />;
  },
};

/**
 * View mode toggles.
 *
 * Toggle between different view modes (list vs grid).
 */
export const ViewModeToggles: Story = {
  render: () => {
    const ViewModeExample = () => {
      const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Toggle
              pressed={viewMode === 'list'}
              onPressedChange={() => setViewMode('list')}
              variant="outline"
              aria-label="List view"
            >
              <Rows className="h-4 w-4" />
              <span>List</span>
            </Toggle>
            <Toggle
              pressed={viewMode === 'grid'}
              onPressedChange={() => setViewMode('grid')}
              variant="outline"
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
              <span>Grid</span>
            </Toggle>
          </div>
          <div className="border rounded-md p-4 max-w-[400px]">
            <p className="text-sm text-muted-foreground">
              Current view mode: <span className="font-medium">{viewMode}</span>
            </p>
          </div>
        </div>
      );
    };

    return <ViewModeExample />;
  },
};

/**
 * Settings toggles.
 *
 * Common toggle use cases for settings and preferences.
 */
export const SettingsToggles: Story = {
  render: () => {
    const SettingsExample = () => {
      const [darkMode, setDarkMode] = useState(false);
      const [soundOn, setSoundOn] = useState(true);
      const [visible, setVisible] = useState(true);

      return (
        <div className="space-y-4 max-w-[400px]">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="space-y-1">
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">
                Switch between light and dark theme
              </p>
            </div>
            <Toggle
              pressed={darkMode}
              onPressedChange={setDarkMode}
              variant="outline"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Toggle>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="space-y-1">
              <p className="text-sm font-medium">Sound Effects</p>
              <p className="text-xs text-muted-foreground">
                Enable or disable sound effects
              </p>
            </div>
            <Toggle
              pressed={soundOn}
              onPressedChange={setSoundOn}
              variant="outline"
              aria-label="Toggle sound"
            >
              {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Toggle>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="space-y-1">
              <p className="text-sm font-medium">Visibility</p>
              <p className="text-xs text-muted-foreground">
                Show or hide from other users
              </p>
            </div>
            <Toggle
              pressed={visible}
              onPressedChange={setVisible}
              variant="outline"
              aria-label="Toggle visibility"
            >
              {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Toggle>
          </div>
        </div>
      );
    };

    return <SettingsExample />;
  },
};

/**
 * With ToggleGroup.
 *
 * Demonstrates relationship between Toggle and ToggleGroup components.
 * ToggleGroup provides shared variant/size and manages single/multiple selection.
 */
export const WithToggleGroup: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Single Selection (type="single")</h3>
        <ToggleGroup type="single" defaultValue="center">
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-muted-foreground">
          Only one item can be selected at a time
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Multiple Selection (type="multiple")</h3>
        <ToggleGroup type="multiple" defaultValue={['bold', 'italic']}>
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-muted-foreground">
          Multiple items can be selected simultaneously
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">With Variant and Size</h3>
        <ToggleGroup type="multiple" variant="outline" size="lg">
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="ordered" aria-label="Ordered list">
            <ListOrdered className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-muted-foreground">
          ToggleGroup passes variant and size to all items
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Standalone Toggles vs ToggleGroup</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Standalone (independent state):</p>
            <div className="flex gap-1">
              <Toggle aria-label="Toggle bold">
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle aria-label="Toggle italic">
                <Italic className="h-4 w-4" />
              </Toggle>
              <Toggle aria-label="Toggle underline">
                <Underline className="h-4 w-4" />
              </Toggle>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              ToggleGroup (managed state, visual grouping):
            </p>
            <ToggleGroup type="multiple">
              <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <Bold className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <Italic className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Toggle underline">
                <Underline className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Interactive test with play function.
 *
 * Tests toggle state changes using Storybook interactions.
 */
export const InteractiveTest: Story = {
  render: () => (
    <div className="space-y-4">
      <Toggle data-testid="test-toggle" aria-label="Toggle test">
        <Bold className="h-4 w-4" />
      </Toggle>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const toggle = canvas.getByTestId('test-toggle');

    // Initial state should be unpressed
    await expect(toggle).toHaveAttribute('data-state', 'off');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    // Click to press
    await userEvent.click(toggle);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await expect(toggle).toHaveAttribute('data-state', 'on');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    // Click to unpress
    await userEvent.click(toggle);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await expect(toggle).toHaveAttribute('data-state', 'off');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  },
};

/**
 * Complete toolbar example.
 *
 * A comprehensive example showing all formatting options together.
 */
export const CompleteToolbar: Story = {
  render: () => {
    const CompleteToolbarExample = () => {
      const [bold, setBold] = useState(false);
      const [italic, setItalic] = useState(false);
      const [underline, setUnderline] = useState(false);
      const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');

      return (
        <div className="space-y-4">
          <div className="flex gap-4 p-2 bg-muted rounded-md w-fit">
            <div className="flex gap-1">
              <Toggle
                pressed={bold}
                onPressedChange={setBold}
                size="sm"
                aria-label="Toggle bold"
              >
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={italic}
                onPressedChange={setItalic}
                size="sm"
                aria-label="Toggle italic"
              >
                <Italic className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={underline}
                onPressedChange={setUnderline}
                size="sm"
                aria-label="Toggle underline"
              >
                <Underline className="h-4 w-4" />
              </Toggle>
            </div>

            <div className="w-px bg-border" />

            <div className="flex gap-1">
              <Toggle
                pressed={alignment === 'left'}
                onPressedChange={() => setAlignment('left')}
                size="sm"
                aria-label="Align left"
              >
                <AlignLeft className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={alignment === 'center'}
                onPressedChange={() => setAlignment('center')}
                size="sm"
                aria-label="Align center"
              >
                <AlignCenter className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={alignment === 'right'}
                onPressedChange={() => setAlignment('right')}
                size="sm"
                aria-label="Align right"
              >
                <AlignRight className="h-4 w-4" />
              </Toggle>
            </div>
          </div>

          <div className="border rounded-md p-4 min-h-[120px] max-w-[500px]">
            <p
              className={`
                ${bold ? 'font-bold' : ''}
                ${italic ? 'italic' : ''}
                ${underline ? 'underline' : ''}
              `}
              style={{ textAlign: alignment }}
            >
              This is a complete text formatting toolbar. You can apply bold, italic,
              and underline formatting, as well as change text alignment. Try clicking
              the various buttons to see the effects.
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <span className="font-medium">Active Formatting:</span>{' '}
              {[bold && 'Bold', italic && 'Italic', underline && 'Underline']
                .filter(Boolean)
                .join(', ') || 'None'}
            </p>
            <p>
              <span className="font-medium">Alignment:</span>{' '}
              {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
            </p>
          </div>
        </div>
      );
    };

    return <CompleteToolbarExample />;
  },
};
