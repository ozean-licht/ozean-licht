import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';
import { NavButton } from './nav-button';

/**
 * NavButton - Navigation button with active state.
 *
 * **This is a Tier 2 Branded Component** - styled for navigation menus with Ozean Licht theme.
 *
 * ## Features
 * - **Active State**: Background and border when active
 * - **Hover Effect**: Text color lightens on hover
 * - **Responsive Text**: Adjusts size based on breakpoint (lg, md)
 * - **Rounded Pill**: rounded-full for smooth navigation feel
 * - **Light Font Weight**: font-light for elegance
 *
 * ## States
 * - **Default**: Light gray text (#C4C8D4) with hover effect
 * - **Active**: Primary color background with opacity and border, lighter text (#E1E3E9)
 *
 * ## Usage
 * Use for navigation menus, tabs, or filter buttons where active state indication is needed.
 */
const meta = {
  title: 'Tier 2: Branded/NavButton',
  component: NavButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A navigation button component with active state styling for menus and tabs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: 'boolean',
      description: 'Active state',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof NavButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default inactive navigation button.
 */
export const Default: Story = {
  args: {
    children: 'Home',
  },
};

/**
 * Active navigation button.
 */
export const Active: Story = {
  args: {
    children: 'Kurse',
    active: true,
  },
};

/**
 * Inactive navigation button.
 */
export const Inactive: Story = {
  args: {
    children: 'Über Uns',
    active: false,
  },
};

/**
 * Navigation menu example.
 */
export const NavigationMenu: Story = {
  render: () => (
    <div className="flex gap-2">
      <NavButton active={true}>Home</NavButton>
      <NavButton active={false}>Kurse</NavButton>
      <NavButton active={false}>Bibliothek</NavButton>
      <NavButton active={false}>Community</NavButton>
      <NavButton active={false}>Über Uns</NavButton>
    </div>
  ),
};

/**
 * Vertical navigation.
 */
export const VerticalNav: Story = {
  render: () => (
    <div className="flex flex-col gap-2 items-start">
      <NavButton active={true}>Dashboard</NavButton>
      <NavButton active={false}>Meine Kurse</NavButton>
      <NavButton active={false}>Favoriten</NavButton>
      <NavButton active={false}>Einstellungen</NavButton>
      <NavButton active={false}>Profil</NavButton>
    </div>
  ),
};

/**
 * Interactive example - toggle active state.
 */
export const Interactive: Story = {
  render: function InteractiveExample() {
    const [activeTab, setActiveTab] = React.useState('tab1');

    return (
      <div className="flex gap-2">
        <NavButton
          active={activeTab === 'tab1'}
          onClick={() => setActiveTab('tab1')}
        >
          Tab 1
        </NavButton>
        <NavButton
          active={activeTab === 'tab2'}
          onClick={() => setActiveTab('tab2')}
        >
          Tab 2
        </NavButton>
        <NavButton
          active={activeTab === 'tab3'}
          onClick={() => setActiveTab('tab3')}
        >
          Tab 3
        </NavButton>
      </div>
    );
  },
};

/**
 * Filter buttons use case.
 */
export const FilterButtons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <NavButton active={true}>Alle</NavButton>
      <NavButton active={false}>Basis</NavButton>
      <NavButton active={false}>Aufbau</NavButton>
      <NavButton active={false}>Master</NavButton>
      <NavButton active={false}>Kostenlos</NavButton>
    </div>
  ),
};

/**
 * Different text lengths.
 */
export const TextLengths: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <NavButton active={true}>Hi</NavButton>
      <NavButton active={false}>Medium Text</NavButton>
      <NavButton active={false}>A Longer Navigation Label</NavButton>
    </div>
  ),
};
