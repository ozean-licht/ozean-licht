import type { Meta, StoryObj } from "@storybook/react";
import { Kbd } from "./kbd";

const meta: Meta<typeof Kbd> = {
  title: "Tier 1: Primitives/CossUI/Kbd",
  component: Kbd,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Kbd component from Coss UI adapted for Ozean Licht design system. Displays keyboard shortcuts and keys with a style that suggests they are interactive keyboard elements. Perfect for documentation, help text, and UI hints.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Size variant of the keyboard key",
    },
    children: {
      control: "text",
      description: "The keyboard key or shortcut text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

/**
 * Default size keyboard key
 */
export const Default: Story = {
  args: {
    children: "Enter",
    size: "default",
  },
};

/**
 * Small keyboard key - ideal for inline text
 */
export const Small: Story = {
  args: {
    children: "Ctrl",
    size: "sm",
  },
};

/**
 * Large keyboard key - for prominent display
 */
export const Large: Story = {
  args: {
    children: "⌘",
    size: "lg",
  },
};

/**
 * Common modifier keys
 */
export const ModifierKeys: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Common Modifiers
        </p>
        <div className="flex flex-wrap gap-3">
          <Kbd>Ctrl</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>Alt</Kbd>
          <Kbd>⌘</Kbd>
          <Kbd>⌥</Kbd>
          <Kbd>⇧</Kbd>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Navigation Keys
        </p>
        <div className="flex flex-wrap gap-3">
          <Kbd>Enter</Kbd>
          <Kbd>Tab</Kbd>
          <Kbd>Esc</Kbd>
          <Kbd>Space</Kbd>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Function Keys
        </p>
        <div className="flex flex-wrap gap-3">
          <Kbd>F1</Kbd>
          <Kbd>F2</Kbd>
          <Kbd>F5</Kbd>
          <Kbd>F11</Kbd>
          <Kbd>F12</Kbd>
        </div>
      </div>
    </div>
  ),
};

/**
 * Common keyboard shortcuts in context
 */
export const KeyboardShortcuts: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-8">
        <h3 className="text-sm font-alt font-semibold mb-3">
          Editing Shortcuts
        </h3>
        <div className="space-y-2 text-sm text-[#C4C8D4]">
          <p>
            Save: <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
          </p>
          <p>
            Undo: <Kbd>Ctrl</Kbd> + <Kbd>Z</Kbd>
          </p>
          <p>
            Redo: <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>Z</Kbd>
          </p>
          <p>
            Copy: <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd>
          </p>
          <p>
            Paste: <Kbd>Ctrl</Kbd> + <Kbd>V</Kbd>
          </p>
        </div>
      </div>

      <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-8">
        <h3 className="text-sm font-alt font-semibold mb-3">
          Navigation Shortcuts
        </h3>
        <div className="space-y-2 text-sm text-[#C4C8D4]">
          <p>
            Search: <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
          </p>
          <p>
            Command Menu: <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>P</Kbd>
          </p>
          <p>
            Home: <Kbd>Home</Kbd>
          </p>
          <p>
            End: <Kbd>End</Kbd>
          </p>
        </div>
      </div>

      <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-8">
        <h3 className="text-sm font-alt font-semibold mb-3">Mac Shortcuts</h3>
        <div className="space-y-2 text-sm text-[#C4C8D4]">
          <p>
            Save: <Kbd>⌘</Kbd> + <Kbd>S</Kbd>
          </p>
          <p>
            Undo: <Kbd>⌘</Kbd> + <Kbd>Z</Kbd>
          </p>
          <p>
            Search: <Kbd>⌘</Kbd> + <Kbd>K</Kbd>
          </p>
        </div>
      </div>
    </div>
  ),
};

/**
 * All size variants
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Small Size
        </p>
        <div className="flex flex-wrap gap-2">
          <Kbd size="sm">Ctrl</Kbd>
          <Kbd size="sm">⌘</Kbd>
          <Kbd size="sm">K</Kbd>
          <Kbd size="sm">Enter</Kbd>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Default Size
        </p>
        <div className="flex flex-wrap gap-2">
          <Kbd size="default">Ctrl</Kbd>
          <Kbd size="default">⌘</Kbd>
          <Kbd size="default">K</Kbd>
          <Kbd size="default">Enter</Kbd>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Large Size
        </p>
        <div className="flex flex-wrap gap-2">
          <Kbd size="lg">Ctrl</Kbd>
          <Kbd size="lg">⌘</Kbd>
          <Kbd size="lg">K</Kbd>
          <Kbd size="lg">Enter</Kbd>
        </div>
      </div>
    </div>
  ),
};

/**
 * Keyboard keys in documentation context
 */
export const InDocumentation: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-8">
        <h3 className="text-lg font-alt font-semibold mb-4">Getting Started</h3>
        <div className="space-y-3 text-sm text-[#C4C8D4]">
          <p>
            Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> (or <Kbd>⌘</Kbd> + <Kbd>K</Kbd>{" "}
            on Mac) to open the command palette.
          </p>
          <p>
            Use <Kbd>↑</Kbd> and <Kbd>↓</Kbd> arrow keys to navigate through the
            list.
          </p>
          <p>
            Press <Kbd>Enter</Kbd> to select an item.
          </p>
          <p>
            Press <Kbd>Esc</Kbd> to close the palette.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-8">
        <h3 className="text-lg font-alt font-semibold mb-4">Editor Tips</h3>
        <div className="space-y-3 text-sm text-[#C4C8D4]">
          <p>
            Select all with <Kbd>Ctrl</Kbd> + <Kbd>A</Kbd>
          </p>
          <p>
            Find and replace with <Kbd>Ctrl</Kbd> + <Kbd>H</Kbd>
          </p>
          <p>
            Go to line with <Kbd>Ctrl</Kbd> + <Kbd>G</Kbd>
          </p>
          <p>
            Indent with <Kbd>Tab</Kbd>, dedent with <Kbd>Shift</Kbd> +{" "}
            <Kbd>Tab</Kbd>
          </p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Keyboard keys with different text lengths
 */
export const DifferentContent: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Single Characters
        </p>
        <div className="flex flex-wrap gap-2">
          <Kbd>A</Kbd>
          <Kbd>Z</Kbd>
          <Kbd>1</Kbd>
          <Kbd>9</Kbd>
          <Kbd>?</Kbd>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Symbols
        </p>
        <div className="flex flex-wrap gap-2">
          <Kbd>⌘</Kbd>
          <Kbd>⌥</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>⌃</Kbd>
          <Kbd>↵</Kbd>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Words
        </p>
        <div className="flex flex-wrap gap-2">
          <Kbd>Enter</Kbd>
          <Kbd>Escape</Kbd>
          <Kbd>Spacebar</Kbd>
          <Kbd>Backspace</Kbd>
          <Kbd>Delete</Kbd>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Combinations
        </p>
        <div className="flex flex-wrap gap-2">
          <Kbd>Ctrl+S</Kbd>
          <Kbd>Shift+Alt+L</Kbd>
          <Kbd>Cmd+Opt+I</Kbd>
        </div>
      </div>
    </div>
  ),
};

/**
 * Help section with inline keyboard hints
 */
export const HelpSection: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-8">
        <h3 className="text-sm font-alt font-semibold mb-4 uppercase text-[#C4C8D4]">
          Quick Help
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm text-[#C4C8D4]">
            <p className="flex items-center gap-2">
              <Kbd size="sm">?</Kbd>
              <span>Show keyboard shortcuts</span>
            </p>
            <p className="flex items-center gap-2">
              <Kbd size="sm">Ctrl</Kbd>
              <span>+</span>
              <Kbd size="sm">K</Kbd>
              <span>Command palette</span>
            </p>
            <p className="flex items-center gap-2">
              <Kbd size="sm">Ctrl</Kbd>
              <span>+</span>
              <Kbd size="sm">F</Kbd>
              <span>Find</span>
            </p>
          </div>

          <div className="space-y-2 text-sm text-[#C4C8D4]">
            <p className="flex items-center gap-2">
              <Kbd size="sm">Esc</Kbd>
              <span>Close dialog</span>
            </p>
            <p className="flex items-center gap-2">
              <Kbd size="sm">Enter</Kbd>
              <span>Confirm action</span>
            </p>
            <p className="flex items-center gap-2">
              <Kbd size="sm">Tab</Kbd>
              <span>Navigate focus</span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-8">
        <h3 className="text-sm font-alt font-semibold mb-4 uppercase text-[#C4C8D4]">
          Accessibility Note
        </h3>
        <p className="text-sm text-[#C4C8D4]">
          Keyboard shortcuts should always be accompanied by UI buttons or menu
          items for accessibility. Use <Kbd>Kbd</Kbd> component to display the
          keyboard shortcuts in your interface.
        </p>
      </div>
    </div>
  ),
};

/**
 * Inline usage example
 */
export const InlineUsage: Story = {
  render: () => (
    <div className="max-w-2xl space-y-4 text-[#C4C8D4]">
      <p className="text-sm leading-relaxed">
        To save your work, press <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd> on Windows or
        Linux, or <Kbd>⌘</Kbd> + <Kbd>S</Kbd> on Mac. Your document will be
        saved automatically every 30 seconds.
      </p>

      <p className="text-sm leading-relaxed">
        You can quickly navigate using <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to open
        the command palette, then type to search for any command or setting you
        need.
      </p>

      <p className="text-sm leading-relaxed">
        Press <Kbd>?</Kbd> anytime to view all available keyboard shortcuts for
        the current page or application.
      </p>

      <p className="text-sm leading-relaxed">
        To close any open dialog or menu, simply press <Kbd>Esc</Kbd>.
      </p>
    </div>
  ),
};
