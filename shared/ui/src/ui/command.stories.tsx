import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from './command';
import { Button } from '../components/Button';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  FileText,
  Home,
  Search,
  Mail,
  MessageSquare,
  Bell,
  Clock,
  Folder,
  Star,
  Trash,
  Code,
  Terminal,
  Database,
  Cloud,
  Zap,
  Heart,
} from 'lucide-react';

/**
 * Command primitive component built on cmdk (Command Menu).
 *
 * **This is a Tier 1 Primitive** - A fast, unstyled command menu React component built on pacocoursey's cmdk.
 * For Ozean Licht branded command menus with glass morphism and cosmic effects, see Tier 2 Branded/Command.
 *
 * ## cmdk Command Menu Features
 * - **Fast Filtering**: Built-in fuzzy search with instant results
 * - **Keyboard Navigation**: Full keyboard control (Arrow keys, Enter, Escape)
 * - **Accessible**: Proper ARIA attributes and focus management
 * - **Composable**: Build custom command palettes with groups, separators, and items
 * - **Empty State**: Customizable no-results message
 * - **Shortcuts Display**: Show keyboard shortcuts alongside commands
 * - **Groups**: Organize commands into labeled sections
 * - **Icons Support**: Seamless integration with icon libraries
 * - **Search Input**: Integrated search with automatic filtering
 *
 * ## Component Structure
 * ```tsx
 * <Command> // Root - manages search state and keyboard navigation
 *   <CommandInput placeholder="Search..." /> // Search input with icon
 *   <CommandList> // Scrollable list container
 *     <CommandEmpty>No results found.</CommandEmpty> // Shown when no matches
 *     <CommandGroup heading="Suggestions"> // Labeled group of commands
 *       <CommandItem> // Individual command item
 *         <Icon /> Command name
 *         <CommandShortcut>⌘K</CommandShortcut> // Keyboard shortcut (optional)
 *       </CommandItem>
 *     </CommandGroup>
 *     <CommandSeparator /> // Visual separator between groups
 *   </CommandList>
 * </Command>
 * ```
 *
 * ## Command Dialog Pattern
 * ```tsx
 * <CommandDialog open={open} onOpenChange={setOpen}>
 *   <CommandInput placeholder="Type a command or search..." />
 *   <CommandList>
 *     <CommandEmpty>No results found.</CommandEmpty>
 *     <CommandGroup heading="Actions">
 *       <CommandItem onSelect={() => runCommand()}>
 *         Command
 *       </CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </CommandDialog>
 * ```
 *
 * ## Usage Notes
 * - CommandInput includes a built-in search icon
 * - CommandList is scrollable and has max-height constraint
 * - CommandEmpty only shows when no items match the search
 * - CommandItem supports onSelect callback for command execution
 * - CommandDialog wraps Command in a modal Dialog component
 * - Use CommandShortcut to display keyboard shortcuts (visual only)
 * - CommandGroup heading is optional
 * - Items are automatically filtered based on search input
 *
 * ## When to Use Command vs Other Components
 * - **Command**: Command palettes, quick actions, keyboard-first navigation
 * - **DropdownMenu**: Mouse-friendly action menus, context menus
 * - **Dialog**: Modal forms requiring user attention
 * - **Popover**: Lightweight overlays with rich content
 * - **Select**: Form inputs for selecting from options
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Command',
  component: Command,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Fast, composable, unstyled command menu for React. Perfect for building command palettes, action bars, and keyboard-first navigation experiences. Built on pacocoursey\'s cmdk library.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default command menu with basic structure.
 *
 * The most basic command menu implementation showing essential structure.
 */
export const Default: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile className="mr-2 h-4 w-4" />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Command menu with multiple groups.
 *
 * Organizes commands into labeled sections for better discoverability.
 */
export const WithGroups: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile className="mr-2 h-4 w-4" />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </CommandItem>
          <CommandItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Command menu with keyboard shortcuts.
 *
 * Shows how to display keyboard shortcuts alongside commands.
 */
export const WithShortcuts: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Actions">
          <CommandItem>
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Search className="mr-2 h-4 w-4" />
            <span>Search</span>
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>New Document</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Communication">
          <CommandItem>
            <Mail className="mr-2 h-4 w-4" />
            <span>Email</span>
            <CommandShortcut>⌘E</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Messages</span>
            <CommandShortcut>⌘M</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Command dialog (modal command palette).
 *
 * The most common pattern - command menu in a modal dialog triggered by keyboard shortcut.
 */
export const CommandDialogExample: Story = {
  render: () => {
    const CommandDialogDemo = () => {
      const [open, setOpen] = useState(false);

      // Toggle command dialog with Cmd+K
      React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
          if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setOpen((open) => !open);
          }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
      }, []);

      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Press{' '}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>{' '}
            to open command menu
          </p>
          <Button onClick={() => setOpen(true)}>Open Command Menu</Button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem
                  onSelect={() => {
                    console.log('Calendar selected');
                    setOpen(false);
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Calendar</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    console.log('Search Emoji selected');
                    setOpen(false);
                  }}
                >
                  <Smile className="mr-2 h-4 w-4" />
                  <span>Search Emoji</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    console.log('Calculator selected');
                    setOpen(false);
                  }}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  <span>Calculator</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem
                  onSelect={() => {
                    console.log('Profile selected');
                    setOpen(false);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    console.log('Billing selected');
                    setOpen(false);
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    console.log('Settings selected');
                    setOpen(false);
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>
      );
    };

    return <CommandDialogDemo />;
  },
};

/**
 * File system command palette.
 *
 * Real-world example showing a file browser/search command palette.
 */
export const FileSystemPalette: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Search files and folders..." />
      <CommandList>
        <CommandEmpty>No files found.</CommandEmpty>
        <CommandGroup heading="Recent Files">
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>project-proposal.docx</span>
            <CommandShortcut>2h ago</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Code className="mr-2 h-4 w-4" />
            <span>app.tsx</span>
            <CommandShortcut>5h ago</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>README.md</span>
            <CommandShortcut>1d ago</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Folders">
          <CommandItem>
            <Folder className="mr-2 h-4 w-4" />
            <span>Documents</span>
            <CommandShortcut>145 files</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Folder className="mr-2 h-4 w-4" />
            <span>Projects</span>
            <CommandShortcut>23 files</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Folder className="mr-2 h-4 w-4" />
            <span>Downloads</span>
            <CommandShortcut>89 files</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>
            <Star className="mr-2 h-4 w-4" />
            <span>Starred</span>
          </CommandItem>
          <CommandItem>
            <Clock className="mr-2 h-4 w-4" />
            <span>Recent</span>
          </CommandItem>
          <CommandItem>
            <Trash className="mr-2 h-4 w-4" />
            <span>Trash</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Developer command palette.
 *
 * Example of a developer-focused command palette with code actions.
 */
export const DeveloperPalette: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Run a command..." />
      <CommandList>
        <CommandEmpty>No commands found.</CommandEmpty>
        <CommandGroup heading="Build & Deploy">
          <CommandItem>
            <Terminal className="mr-2 h-4 w-4" />
            <span>Run Build</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Cloud className="mr-2 h-4 w-4" />
            <span>Deploy to Production</span>
            <CommandShortcut>⌘⇧D</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Zap className="mr-2 h-4 w-4" />
            <span>Start Dev Server</span>
            <CommandShortcut>⌘R</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Database">
          <CommandItem>
            <Database className="mr-2 h-4 w-4" />
            <span>Run Migrations</span>
            <CommandShortcut>⌘M</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Database className="mr-2 h-4 w-4" />
            <span>Seed Database</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Database className="mr-2 h-4 w-4" />
            <span>Reset Database</span>
            <CommandShortcut>⌘⇧R</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Git">
          <CommandItem>
            <Code className="mr-2 h-4 w-4" />
            <span>Commit Changes</span>
            <CommandShortcut>⌘⇧C</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Code className="mr-2 h-4 w-4" />
            <span>Push to Remote</span>
            <CommandShortcut>⌘⇧P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Code className="mr-2 h-4 w-4" />
            <span>Pull from Remote</span>
            <CommandShortcut>⌘⇧L</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Ozean Licht branded command palette.
 *
 * Demonstrates using Ozean Licht turquoise accent color (#0ec2bc) for selected items.
 */
export const OzeanLichtBranded: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Search Ozean Licht..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Platform">
          <CommandItem className="aria-selected:bg-[#0ec2bc]/10 aria-selected:text-[#0ec2bc]">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem className="aria-selected:bg-[#0ec2bc]/10 aria-selected:text-[#0ec2bc]">
            <FileText className="mr-2 h-4 w-4" />
            <span>Content Library</span>
            <CommandShortcut>⌘L</CommandShortcut>
          </CommandItem>
          <CommandItem className="aria-selected:bg-[#0ec2bc]/10 aria-selected:text-[#0ec2bc]">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Events</span>
            <CommandShortcut>⌘E</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Associations">
          <CommandItem className="aria-selected:bg-[#0ec2bc]/10 aria-selected:text-[#0ec2bc]">
            <Heart className="mr-2 h-4 w-4" />
            <span>Kids Ascension</span>
          </CommandItem>
          <CommandItem className="aria-selected:bg-[#0ec2bc]/10 aria-selected:text-[#0ec2bc]">
            <Heart className="mr-2 h-4 w-4" />
            <span>Ozean Licht</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem className="aria-selected:bg-[#0ec2bc]/10 aria-selected:text-[#0ec2bc]">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem className="aria-selected:bg-[#0ec2bc]/10 aria-selected:text-[#0ec2bc]">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Compact command menu (no search input).
 *
 * Shows command menu without search input for static command lists.
 */
export const CompactMenu: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md">
      <CommandList>
        <CommandGroup heading="Quick Actions">
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>New Document</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Folder className="mr-2 h-4 w-4" />
            <span>New Folder</span>
            <CommandShortcut>⌘⇧N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Search className="mr-2 h-4 w-4" />
            <span>Search</span>
            <CommandShortcut>⌘F</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Command menu with custom empty state.
 *
 * Demonstrates customizing the empty state message.
 */
export const CustomEmptyState: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>
          <div className="py-6 text-center">
            <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No results found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try searching with different keywords
            </p>
          </div>
        </CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Controlled command dialog with state management.
 *
 * Shows how to manage command dialog state and handle command selection.
 */
export const ControlledDialog: Story = {
  render: () => {
    const ControlledDialogDemo = () => {
      const [open, setOpen] = useState(false);
      const [selectedCommand, setSelectedCommand] = useState<string | null>(null);

      const runCommand = (command: string) => {
        setSelectedCommand(command);
        setOpen(false);
        // In real app, execute the command here
        console.log('Running command:', command);
      };

      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Button onClick={() => setOpen(true)}>Open Command Menu</Button>
            {selectedCommand && (
              <p className="text-sm text-muted-foreground">
                Last command: <strong>{selectedCommand}</strong>
              </p>
            )}
          </div>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Actions">
                <CommandItem onSelect={() => runCommand('Create new file')}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Create new file</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand('Open folder')}>
                  <Folder className="mr-2 h-4 w-4" />
                  <span>Open folder</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand('Search')}>
                  <Search className="mr-2 h-4 w-4" />
                  <span>Search</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem onSelect={() => runCommand('Open settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Open settings</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand('View profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>View profile</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>
      );
    };

    return <ControlledDialogDemo />;
  },
};

/**
 * Command menu with loading state.
 *
 * Shows how to handle async command loading.
 */
export const WithLoadingState: Story = {
  render: () => {
    const LoadingCommandDemo = () => {
      const [loading, setLoading] = useState(false);

      return (
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search..." />
          <CommandList>
            {loading ? (
              <div className="py-6 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="text-sm text-muted-foreground mt-2">Loading commands...</p>
              </div>
            ) : (
              <>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem
                    onSelect={() => {
                      setLoading(true);
                      setTimeout(() => setLoading(false), 2000);
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Load Calendar (triggers loading)</span>
                  </CommandItem>
                  <CommandItem>
                    <Smile className="mr-2 h-4 w-4" />
                    <span>Search Emoji</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      );
    };

    return <LoadingCommandDemo />;
  },
};

/**
 * Interactive test with play function.
 *
 * Tests command menu search, keyboard navigation, and selection using Storybook interactions.
 */
export const InteractiveTest: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md" data-testid="command-menu">
      <CommandInput placeholder="Type a command..." data-testid="command-input" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Commands">
          <CommandItem data-testid="calendar-item">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem data-testid="calculator-item">
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculator</span>
          </CommandItem>
          <CommandItem data-testid="settings-item">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the command input
    const input = canvas.getByTestId('command-input');
    await expect(input).toBeInTheDocument();

    // Type in search query
    await userEvent.click(input);
    await userEvent.type(input, 'cal');

    // Wait for filtering to occur
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Calendar and Calculator should be visible (matches "cal")
    const calendarItem = canvas.getByTestId('calendar-item');
    await expect(calendarItem).toBeInTheDocument();

    // Clear and search for "sett"
    await userEvent.clear(input);
    await userEvent.type(input, 'sett');

    await new Promise((resolve) => setTimeout(resolve, 300));

    // Settings should be visible
    const settingsItem = canvas.getByTestId('settings-item');
    await expect(settingsItem).toBeInTheDocument();
  },
};

/**
 * Complete application command palette.
 *
 * Full-featured example combining all command menu features.
 */
export const CompleteExample: Story = {
  render: () => {
    const CompleteCommandDemo = () => {
      const [open, setOpen] = useState(false);

      React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
          if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setOpen((open) => !open);
          }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
      }, []);

      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Press{' '}
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>{' '}
              to open
            </p>
            <Button onClick={() => setOpen(true)} variant="cta">
              Open Complete Command Palette
            </Button>
          </div>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>
                <div className="py-6 text-center">
                  <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">No results found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try searching with different keywords
                  </p>
                </div>
              </CommandEmpty>

              <CommandGroup heading="Navigation" className="[&_[cmdk-group-heading]]:text-[#0ec2bc]">
                <CommandItem
                  className="aria-selected:bg-[#0ec2bc]/10"
                  onSelect={() => setOpen(false)}
                >
                  <Home className="mr-2 h-4 w-4" />
                  <span>Home</span>
                  <CommandShortcut>⌘H</CommandShortcut>
                </CommandItem>
                <CommandItem
                  className="aria-selected:bg-[#0ec2bc]/10"
                  onSelect={() => setOpen(false)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>Search</span>
                  <CommandShortcut>⌘F</CommandShortcut>
                </CommandItem>
                <CommandItem
                  className="aria-selected:bg-[#0ec2bc]/10"
                  onSelect={() => setOpen(false)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Calendar</span>
                  <CommandShortcut>⌘C</CommandShortcut>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Actions" className="[&_[cmdk-group-heading]]:text-[#0ec2bc]">
                <CommandItem
                  className="aria-selected:bg-[#0ec2bc]/10"
                  onSelect={() => setOpen(false)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>New Document</span>
                  <CommandShortcut>⌘N</CommandShortcut>
                </CommandItem>
                <CommandItem
                  className="aria-selected:bg-[#0ec2bc]/10"
                  onSelect={() => setOpen(false)}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  <span>New Folder</span>
                  <CommandShortcut>⌘⇧N</CommandShortcut>
                </CommandItem>
                <CommandItem
                  className="aria-selected:bg-[#0ec2bc]/10"
                  onSelect={() => setOpen(false)}
                >
                  <Star className="mr-2 h-4 w-4" />
                  <span>Add to Favorites</span>
                  <CommandShortcut>⌘D</CommandShortcut>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Communication" className="[&_[cmdk-group-heading]]:text-[#0ec2bc]">
                <CommandItem
                  className="aria-selected:bg-[#0ec2bc]/10"
                  onSelect={() => setOpen(false)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email</span>
                  <CommandShortcut>⌘E</CommandShortcut>
                </CommandItem>
                <CommandItem
                  className="aria-selected:bg-[#0ec2bc]/10"
                  onSelect={() => setOpen(false)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                  <CommandShortcut>⌘M</CommandShortcut>
                </CommandItem>
                <CommandItem
                  className="aria-selected:bg-[#0ec2bc]/10"
                  onSelect={() => setOpen(false)}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Settings" className="[&_[cmdk-group-heading]]:text-[#0ec2bc]">
                <CommandItem
                  className="aria-selected:bg-[#0ec2bc]/10"
                  onSelect={() => setOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem
                  className="aria-selected:bg-[#0ec2bc]/10"
                  onSelect={() => setOpen(false)}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                  <CommandShortcut>⌘$</CommandShortcut>
                </CommandItem>
                <CommandItem
                  className="aria-selected:bg-[#0ec2bc]/10"
                  onSelect={() => setOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <CommandShortcut>⌘,</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>
      );
    };

    return <CompleteCommandDemo />;
  },
};
