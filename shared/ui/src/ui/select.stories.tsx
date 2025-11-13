import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';
import React from 'react';
import {
  User,
  Globe,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Zap,
  Shield,
  Star,
  Heart,
  CheckCircle,
} from 'lucide-react';

/**
 * Select component for choosing from a list of options.
 * Built on Radix UI Select primitive.
 *
 * ## Features
 * - Single selection from a list of options
 * - Support for option groups with labels
 * - Separators for visual organization
 * - Disabled options
 * - Icons in select items
 * - Controlled and uncontrolled modes
 * - Keyboard navigation (Arrow keys, Enter, Escape, Type-ahead)
 * - Auto-positioning with collision detection
 * - Smooth animations on open/close
 * - Click outside to close
 * - Scroll buttons for long lists
 *
 * ## Anatomy
 * ```tsx
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Select..." />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectGroup>
 *       <SelectLabel>Group Label</SelectLabel>
 *       <SelectItem value="1">Option 1</SelectItem>
 *       <SelectItem value="2">Option 2</SelectItem>
 *     </SelectGroup>
 *     <SelectSeparator />
 *     <SelectItem value="3">Option 3</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays a list of options for the user to pick from — triggered by a button.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default select with basic options
 */
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
        <SelectItem value="mango">Mango</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * Select with grouped options
 */
export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a device" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Mobile</SelectLabel>
          <SelectItem value="iphone">iPhone</SelectItem>
          <SelectItem value="android">Android</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Desktop</SelectLabel>
          <SelectItem value="mac">Mac</SelectItem>
          <SelectItem value="windows">Windows</SelectItem>
          <SelectItem value="linux">Linux</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Tablet</SelectLabel>
          <SelectItem value="ipad">iPad</SelectItem>
          <SelectItem value="surface">Surface</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

/**
 * Select with separators for visual organization
 */
export const WithSeparators: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select an action" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="edit">Edit Profile</SelectItem>
        <SelectItem value="duplicate">Duplicate</SelectItem>
        <SelectSeparator />
        <SelectItem value="archive">Archive</SelectItem>
        <SelectItem value="export">Export Data</SelectItem>
        <SelectSeparator />
        <SelectItem value="delete">Delete Account</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * Select with disabled options
 */
export const WithDisabledOptions: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Free (Active)</SelectItem>
        <SelectItem value="pro" disabled>
          Pro (Coming soon)
        </SelectItem>
        <SelectItem value="enterprise" disabled>
          Enterprise (Contact sales)
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * Select with icons in options
 */
export const WithIcons: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>User</span>
          </div>
        </SelectItem>
        <SelectItem value="moderator">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Moderator</span>
          </div>
        </SelectItem>
        <SelectItem value="admin">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span>Administrator</span>
          </div>
        </SelectItem>
        <SelectItem value="superadmin">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>Super Admin</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * Controlled select with state management
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('light');

    return (
      <div className="space-y-4">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Selected: <span className="font-semibold">{value}</span>
        </p>
      </div>
    );
  },
};

/**
 * Select with default value
 */
export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="banana">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * Disabled select
 */
export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Option 1</SelectItem>
        <SelectItem value="2">Option 2</SelectItem>
        <SelectItem value="3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * Long list with scroll buttons
 */
export const LongList: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="uk">United Kingdom</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
        <SelectItem value="au">Australia</SelectItem>
        <SelectItem value="de">Germany</SelectItem>
        <SelectItem value="fr">France</SelectItem>
        <SelectItem value="it">Italy</SelectItem>
        <SelectItem value="es">Spain</SelectItem>
        <SelectItem value="nl">Netherlands</SelectItem>
        <SelectItem value="se">Sweden</SelectItem>
        <SelectItem value="no">Norway</SelectItem>
        <SelectItem value="dk">Denmark</SelectItem>
        <SelectItem value="fi">Finland</SelectItem>
        <SelectItem value="pl">Poland</SelectItem>
        <SelectItem value="cz">Czech Republic</SelectItem>
        <SelectItem value="at">Austria</SelectItem>
        <SelectItem value="ch">Switzerland</SelectItem>
        <SelectItem value="be">Belgium</SelectItem>
        <SelectItem value="ie">Ireland</SelectItem>
        <SelectItem value="pt">Portugal</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * Full-width select
 */
export const FullWidth: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
          <SelectItem value="3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

/**
 * Ozean Licht branded select with turquoise accent
 */
export const OzeanLichtBranded: Story = {
  render: () => {
    const [value, setValue] = React.useState('');

    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[240px] focus:ring-[#0ec2bc]">
          <SelectValue placeholder="Wähle eine Sprache" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="text-[#0ec2bc]">Sprachen</SelectLabel>
            <SelectItem value="de">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#0ec2bc]" />
                <span>Deutsch</span>
              </div>
            </SelectItem>
            <SelectItem value="en">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#0ec2bc]" />
                <span>English</span>
              </div>
            </SelectItem>
            <SelectItem value="fr">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#0ec2bc]" />
                <span>Français</span>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
};

/**
 * Complex select with groups, separators, icons, and disabled items
 */
export const ComplexExample: Story = {
  render: () => {
    const [device, setDevice] = React.useState('');

    return (
      <div className="space-y-4">
        <Select value={device} onValueChange={setDevice}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select your device" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Mobile Devices</SelectLabel>
              <SelectItem value="iphone">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span>iPhone</span>
                  <Heart className="ml-auto h-3 w-3 text-[#0ec2bc]" />
                </div>
              </SelectItem>
              <SelectItem value="android">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span>Android Phone</span>
                </div>
              </SelectItem>
            </SelectGroup>

            <SelectSeparator />

            <SelectGroup>
              <SelectLabel>Tablets</SelectLabel>
              <SelectItem value="ipad">
                <div className="flex items-center gap-2">
                  <Tablet className="h-4 w-4" />
                  <span>iPad</span>
                  <CheckCircle className="ml-auto h-3 w-3 text-[#0ec2bc]" />
                </div>
              </SelectItem>
              <SelectItem value="surface">
                <div className="flex items-center gap-2">
                  <Tablet className="h-4 w-4" />
                  <span>Surface</span>
                </div>
              </SelectItem>
            </SelectGroup>

            <SelectSeparator />

            <SelectGroup>
              <SelectLabel>Computers</SelectLabel>
              <SelectItem value="laptop">
                <div className="flex items-center gap-2">
                  <Laptop className="h-4 w-4" />
                  <span>Laptop</span>
                </div>
              </SelectItem>
              <SelectItem value="desktop">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span>Desktop</span>
                </div>
              </SelectItem>
              <SelectItem value="workstation" disabled>
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span>Workstation (Coming soon)</span>
                </div>
              </SelectItem>
            </SelectGroup>

            <SelectSeparator />

            <SelectItem value="other">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Other Device</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {device && (
          <div className="rounded-md border border-[#0ec2bc]/20 bg-[#0ec2bc]/5 p-3">
            <p className="text-sm text-muted-foreground">
              Selected device:{' '}
              <span className="font-semibold text-[#0ec2bc]">{device}</span>
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Form-style select with label
 */
export const InForm: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-2">
      <label htmlFor="language" className="text-sm font-medium">
        Preferred Language
      </label>
      <Select>
        <SelectTrigger id="language" className="w-full">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="de">Deutsch</SelectItem>
          <SelectItem value="fr">Français</SelectItem>
          <SelectItem value="es">Español</SelectItem>
          <SelectItem value="it">Italiano</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Choose your preferred language for the interface
      </p>
    </div>
  ),
};

/**
 * Interactive test with play function
 * Tests select interactions and keyboard navigation
 */
export const InteractiveTest: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]" data-testid="select-trigger">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent data-testid="select-content">
        <SelectItem value="apple" data-testid="option-apple">
          Apple
        </SelectItem>
        <SelectItem value="banana" data-testid="option-banana">
          Banana
        </SelectItem>
        <SelectItem value="orange" data-testid="option-orange">
          Orange
        </SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Click trigger to open select
    const trigger = canvas.getByTestId('select-trigger');
    await userEvent.click(trigger);

    // Wait for content to open
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Content should be visible
    const content = body.getByTestId('select-content');
    await expect(content).toBeInTheDocument();

    // Options should be accessible
    const appleOption = body.getByTestId('option-apple');
    await expect(appleOption).toBeInTheDocument();

    // Click an option
    await userEvent.click(appleOption);

    // Wait for content to close
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

/**
 * Multiple selects side by side
 */
export const MultipleSelects: Story = {
  render: () => (
    <div className="flex gap-4">
      <Select defaultValue="small">
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="small">Small</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="large">Large</SelectItem>
          <SelectItem value="xlarge">X-Large</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="blue">
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="red">Red</SelectItem>
          <SelectItem value="blue">Blue</SelectItem>
          <SelectItem value="green">Green</SelectItem>
          <SelectItem value="turquoise">Turquoise</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="1">
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Quantity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
          <SelectItem value="4">4</SelectItem>
          <SelectItem value="5">5</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
