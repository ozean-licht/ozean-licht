import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverPopup,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
} from './popover'
import { Button } from './button'

// Icon components (single-color SVG icons in primary color)
const SettingsIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const UserIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const BellIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)

const GlobeIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const SearchIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const SunIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const MoonIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)

const RefreshIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const QuestionIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const meta: Meta<typeof Popover> = {
  title: 'CossUI/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Popover component from Coss UI with glass morphism effects for Ozean Licht. Uses `PopoverPopup` instead of `PopoverContent` (Coss UI convention). Provides lightweight, floating UI patterns for contextual information, settings, and user interactions with smooth animations and backdrop blur effects.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Popover>

/**
 * Default Popover
 * A simple popover with a trigger button and basic content.
 * Demonstrates the minimal popover pattern with smooth animations.
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        
          <PopoverPopup>
          <div className="text-sm text-[#C4C8D4]">
            This is a simple popover with basic content.
          </div>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Popover with Title and Description
 * A popover with a title and description for more structured content.
 * Perfect for providing contextual information to users.
 */
export const WithTitleAndDescription: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>Learn More</PopoverTrigger>
        
          <PopoverPopup>
          <PopoverTitle>Getting Started</PopoverTitle>
          <PopoverDescription>
            Learn the basics of using this feature and get up to speed quickly.
          </PopoverDescription>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Popover with Close Button
 * A popover featuring a dedicated close button for explicit dismissal.
 * Demonstrates the PopoverClose component.
 */
export const WithCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>Help</PopoverTrigger>
        
          <PopoverPopup>
          <PopoverTitle>Need Help?</PopoverTitle>
          <PopoverDescription>
            Click the button below when you're done with this tip.
          </PopoverDescription>
          <PopoverClose>Got It</PopoverClose>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Form in Popover
 * A popover containing form elements for user input.
 * Perfect for quick actions like subscribing to a newsletter.
 */
export const FormInPopover: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>Subscribe</PopoverTrigger>
        
          <PopoverPopup>
          <PopoverTitle>Get Updates</PopoverTitle>
          <PopoverDescription>
            Sign up to receive our latest news and features.
          </PopoverDescription>
          <div className="space-y-3 mt-4">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full h-9 px-3 rounded-lg border border-border bg-card/50 backdrop-blur-8 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <Button variant="primary" size="sm" className="w-full">
              Subscribe
            </Button>
          </div>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Settings Panel Popover
 * A popover designed as a settings panel with multiple options.
 * Demonstrates using checkboxes and toggles within a popover.
 */
export const SettingsPanel: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(true)
    const [notifications, setNotifications] = useState(true)
    const [autoSave, setAutoSave] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <div className="flex items-center gap-2">
            <SettingsIcon />
            Settings
          </div>
        </PopoverTrigger>
        
          <PopoverPopup>
          <PopoverTitle>Preferences</PopoverTitle>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Dark Mode</label>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Notifications</label>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Auto-save</label>
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * User Profile Card Popover
 * A popover displaying a user profile with avatar and basic information.
 * Useful for user account menus or profile previews.
 */
export const UserProfileCard: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <div className="flex items-center gap-2">
            <UserIcon />
            Profile
          </div>
        </PopoverTrigger>

          <PopoverPopup>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                <UserIcon />
              </div>
              <div>
                <p className="font-medium text-white">John Doe</p>
                <p className="text-xs text-[#C4C8D4]">john@example.com</p>
              </div>
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-[#C4C8D4] hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                View Profile
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-[#C4C8D4] hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                Account Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Help Popover
 * A popover providing helpful tips and contextual assistance.
 * Great for onboarding and feature discovery.
 */
export const HelpPopover: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>? Tips</PopoverTrigger>
        
          <PopoverPopup>
          <PopoverTitle>Pro Tips</PopoverTitle>
          <div className="space-y-3 mt-3">
            <div>
              <p className="text-xs font-medium text-primary mb-1">Keyboard Shortcuts</p>
              <p className="text-xs text-[#C4C8D4]">
                Press <kbd className="bg-primary/20 px-2 py-1 rounded text-xs">Ctrl</kbd> +{' '}
                <kbd className="bg-primary/20 px-2 py-1 rounded text-xs">K</kbd> to open search
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-primary mb-1">Quick Actions</p>
              <p className="text-xs text-[#C4C8D4]">
                Double-click items to perform quick actions instead of single-click.
              </p>
            </div>
          </div>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Color Picker Popover
 * A popover displaying a color palette for selection.
 * Demonstrates how popovers can be used for interactive selections.
 */
export const ColorPicker: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [selectedColor, setSelectedColor] = useState('#0ec2bc')

    const colors = [
      '#0ec2bc',
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
    ]

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <span
            className="inline-block w-8 h-8 rounded-lg border-2 border-primary/40"
            style={{ backgroundColor: selectedColor }}
          />
        </PopoverTrigger>
        <PopoverPopup className="w-fit">
          <PopoverTitle>Choose Color</PopoverTitle>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color)
                  setOpen(false)
                }}
                className="w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: selectedColor === color ? '#ffffff' : color + '40',
                }}
                title={color}
              />
            ))}
          </div>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Date Picker UI Popover
 * A popover displaying a simplified date picker interface.
 * Demonstrates calendar-like UI patterns within a popover.
 */
export const DatePicker: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState('2024-01-15')

    const days = Array.from({ length: 28 }, (_, i) => i + 1)
    const today = new Date().getDate()

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <div className="flex items-center gap-2">
            <CalendarIcon />
            {selectedDate}
          </div>
        </PopoverTrigger>
        <PopoverPopup className="w-fit">
          <PopoverTitle>Select Date</PopoverTitle>
          <div className="mt-4">
            <div className="text-xs text-[#C4C8D4] mb-3 font-medium">January 2024</div>
            <div className="grid grid-cols-7 gap-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="w-8 h-8 text-xs text-[#C4C8D4] flex items-center justify-center">
                  {day}
                </div>
              ))}
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDate(`2024-01-${String(day).padStart(2, '0')}`)
                    setOpen(false)
                  }}
                  className={`w-8 h-8 rounded-lg text-xs transition-colors ${
                    day === today
                      ? 'bg-primary text-white'
                      : 'bg-card/50 text-[#C4C8D4] hover:bg-primary/20'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Popover - Top Placement
 * A popover positioned at the top of the trigger element.
 * Demonstrates placement control (if supported by Base UI).
 */
export const TopPlacement: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="pt-20">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>Top Placement</PopoverTrigger>
          <PopoverPopup className="mb-2">
            <PopoverTitle>Above the Trigger</PopoverTitle>
            <PopoverDescription>
              This popover appears above the trigger button.
            </PopoverDescription>
          </PopoverPopup>
        
        </Popover>
      </div>
    )
  },
}

/**
 * Popover - Bottom Placement
 * A popover positioned at the bottom of the trigger element.
 * This is the default and most common placement.
 */
export const BottomPlacement: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>Bottom Placement</PopoverTrigger>
        
          <PopoverPopup>
          <PopoverTitle>Below the Trigger</PopoverTitle>
          <PopoverDescription>
            This popover appears below the trigger button (default placement).
          </PopoverDescription>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Controlled Popover
 * A popover with fully controlled open/close state.
 * Demonstrates managing popover state externally with buttons.
 */
export const ControlledPopover: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
            Open
          </Button>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setOpen(!open)}>
            Toggle
          </Button>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>Status: {open ? 'Open' : 'Closed'}</PopoverTrigger>
          
          <PopoverPopup>
            <PopoverTitle>Controlled State</PopoverTitle>
            <PopoverDescription>
              You can control the popover state from external buttons above.
            </PopoverDescription>
            <div className="mt-4">
              <p className="text-xs text-[#C4C8D4] mb-2">
                Current state: <span className="text-primary font-medium">{open ? 'OPEN' : 'CLOSED'}</span>
              </p>
            </div>
          </PopoverPopup>
        
        </Popover>
      </div>
    )
  },
}

/**
 * Custom Trigger Button
 * A popover with a custom styled trigger element.
 * Demonstrates using the `render` prop for custom triggers.
 */
export const CustomTrigger: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button variant="outline" size="sm">Custom Trigger</Button>} />
        
          <PopoverPopup>
          <PopoverTitle>Custom Styled Trigger</PopoverTitle>
          <PopoverDescription>
            This popover uses a custom button as the trigger element using the render prop.
          </PopoverDescription>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Glass Effect Variations
 * Multiple popovers showcasing different glass morphism effects.
 * Demonstrates the glass-card styling variations.
 */
export const GlassEffectVariations: Story = {
  render: () => {
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [open3, setOpen3] = useState(false)

    return (
      <div className="space-y-8">
        <div className="p-8 bg-gradient-to-br from-background via-card to-[#055D75]/20 rounded-lg">
          <Popover open={open1} onOpenChange={setOpen1}>
            <PopoverTrigger>Subtle Glass</PopoverTrigger>
            <PopoverPopup className="glass-subtle">
              <PopoverTitle>Subtle Effect</PopoverTitle>
              <PopoverDescription>
                Light glass effect with minimal blur.
              </PopoverDescription>
            </PopoverPopup>
        
          </Popover>
        </div>

        <div className="p-8 bg-gradient-to-br from-background via-card to-[#055D75]/40 rounded-lg">
          <Popover open={open2} onOpenChange={setOpen2}>
            <PopoverTrigger>Medium Glass</PopoverTrigger>
            <PopoverPopup className="glass-card">
              <PopoverTitle>Medium Effect</PopoverTitle>
              <PopoverDescription>
                Balanced glass effect with moderate blur.
              </PopoverDescription>
            </PopoverPopup>
        
          </Popover>
        </div>

        <div className="p-8 bg-gradient-to-br from-background via-card to-[#055D75]/60 rounded-lg">
          <Popover open={open3} onOpenChange={setOpen3}>
            <PopoverTrigger>Strong Glass</PopoverTrigger>
            <PopoverPopup className="glass-card-strong">
              <PopoverTitle>Strong Effect</PopoverTitle>
              <PopoverDescription>
                Heavy glass effect with maximum blur and opacity.
              </PopoverDescription>
            </PopoverPopup>
        
          </Popover>
        </div>
      </div>
    )
  },
}

/**
 * Nested Content Popover
 * A popover containing complex nested content and lists.
 * Demonstrates how popovers handle rich content structures.
 */
export const NestedContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>Resources</PopoverTrigger>
        
          <PopoverPopup>
          <PopoverTitle>Documentation</PopoverTitle>
          <div className="space-y-3 mt-4">
            <div>
              <p className="text-xs font-medium text-primary mb-2">Getting Started</p>
              <ul className="space-y-1 ml-2">
                <li>
                  <a href="#" className="text-xs text-[#C4C8D4] hover:text-primary transition-colors">
                    → Installation Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs text-[#C4C8D4] hover:text-primary transition-colors">
                    → Quick Start
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-primary mb-2">API Reference</p>
              <ul className="space-y-1 ml-2">
                <li>
                  <a href="#" className="text-xs text-[#C4C8D4] hover:text-primary transition-colors">
                    → Core Components
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs text-[#C4C8D4] hover:text-primary transition-colors">
                    → Utilities
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Popover with Footer Actions
 * A popover with action buttons in a footer area.
 * Useful for confirmation dialogs and action-oriented popovers.
 */
export const WithFooterActions: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>Confirm Action</PopoverTrigger>
        
          <PopoverPopup>
          <PopoverTitle>Delete Item?</PopoverTitle>
          <PopoverDescription>
            Are you sure you want to delete this item? This action cannot be undone.
          </PopoverDescription>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Delete
            </Button>
          </div>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Notification Badge Popover
 * A popover triggered by a notification badge with unread count.
 * Demonstrates notification-style UI patterns.
 */
export const NotificationBadge: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const notificationCount = 3

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="relative w-10 h-10 p-0 inline-flex items-center justify-center">
          <BellIcon />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
              {notificationCount}
            </span>
          )}
        </PopoverTrigger>
        <PopoverPopup className="w-80">
          <PopoverTitle>Notifications</PopoverTitle>
          <div className="space-y-2 mt-3 max-h-64 overflow-y-auto">
            {[
              { id: 1, message: 'Your deployment was successful', time: '2 minutes ago' },
              { id: 2, message: 'New comment on your issue', time: '1 hour ago' },
              { id: 3, message: 'System update completed', time: '3 hours ago' },
            ].map((notification) => (
              <div
                key={notification.id}
                className="p-3 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
              >
                <p className="text-sm text-white">{notification.message}</p>
                <p className="text-xs text-[#C4C8D4] mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs text-primary hover:text-primary/80 transition-colors">
            View All Notifications
          </button>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Language Selector Popover
 * A popover for selecting language preferences.
 * Demonstrates a dropdown-like interface within a popover.
 */
export const LanguageSelector: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [language, setLanguage] = useState('en')

    const languages = [
      { code: 'en', name: 'English' },
      { code: 'de', name: 'Deutsch' },
      { code: 'es', name: 'Español' },
      { code: 'fr', name: 'Français' },
      { code: 'it', name: 'Italiano' },
    ]

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <div className="flex items-center gap-2">
            <GlobeIcon />
            {languages.find((l) => l.code === language)?.name}
          </div>
        </PopoverTrigger>
        <PopoverPopup className="w-56">
          <PopoverTitle>Choose Language</PopoverTitle>
          <div className="space-y-2 mt-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  language === lang.code
                    ? 'bg-primary/20 border border-primary text-primary'
                    : 'hover:bg-primary/10 text-[#C4C8D4] hover:text-primary'
                }`}
              >
                <span className="text-sm font-medium">{lang.name}</span>
                {language === lang.code && (
                  <span className="ml-auto">
                    <CheckIcon />
                  </span>
                )}
              </button>
            ))}
          </div>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Search Results Preview Popover
 * A popover displaying search results or quick access items.
 * Demonstrates how popovers can show dynamic content.
 */
export const SearchResults: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const results = [
      { id: 1, title: 'Documentation', category: 'Docs' },
      { id: 2, title: 'API Reference', category: 'Docs' },
      { id: 3, title: 'Component Gallery', category: 'UI' },
      { id: 4, title: 'Design System', category: 'Design' },
    ]

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <div className="flex items-center gap-2">
            <SearchIcon />
            Search
          </div>
        </PopoverTrigger>
        <PopoverPopup className="w-80">
          <input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-border bg-card/50 backdrop-blur-8 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onFocus={() => setOpen(true)}
          />
          <div className="space-y-2 mt-3 max-h-64 overflow-y-auto">
            {results
              .filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((result) => (
                <div
                  key={result.id}
                  className="p-2 rounded-lg hover:bg-primary/10 cursor-pointer transition-colors"
                >
                  <p className="text-sm text-white">{result.title}</p>
                  <p className="text-xs text-[#C4C8D4]">{result.category}</p>
                </div>
              ))}
            {results.filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
              <p className="text-xs text-[#C4C8D4] py-4 text-center">No results found</p>
            )}
          </div>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Theme Switcher Popover
 * A popover for switching between light and dark themes.
 * Demonstrates theme selection patterns.
 */
export const ThemeSwitcher: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [theme, setTheme] = useState('dark')

    const themes = [
      { id: 'light', name: 'Light', icon: <SunIcon /> },
      { id: 'dark', name: 'Dark', icon: <MoonIcon /> },
      { id: 'auto', name: 'Auto', icon: <RefreshIcon /> },
    ]

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <div className="flex items-center gap-2">
            {themes.find((t) => t.id === theme)?.icon}
            Theme
          </div>
        </PopoverTrigger>
        <PopoverPopup className="w-56">
          <PopoverTitle>Choose Theme</PopoverTitle>
          <div className="space-y-2 mt-3">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => {
                  setTheme(themeOption.id)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  theme === themeOption.id
                    ? 'bg-primary/20 border border-primary text-primary'
                    : 'hover:bg-primary/10 text-[#C4C8D4] hover:text-primary'
                }`}
              >
                {themeOption.icon}
                <span className="text-sm font-medium">{themeOption.name}</span>
                {theme === themeOption.id && (
                  <span className="ml-auto">
                    <CheckIcon />
                  </span>
                )}
              </button>
            ))}
          </div>
        </PopoverPopup>
        
      </Popover>
    )
  },
}

/**
 * Information Tooltip-like Popover
 * A minimal popover styled like a tooltip for brief information.
 * Perfect for contextual help and tips.
 */
export const TooltipLike: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="w-8 h-8 p-0 inline-flex items-center justify-center">
          <QuestionIcon />
        </PopoverTrigger>
        <PopoverPopup className="w-48">
          <p className="text-xs text-[#C4C8D4]">
            Hover over or click this icon to learn more about this feature and how to use it effectively.
          </p>
        </PopoverPopup>

      </Popover>
    )
  },
}

/**
 * Multiple Popovers
 * Demonstrates multiple independent popovers on the same page.
 * Shows how popovers can coexist without interfering.
 */
export const MultiplePopovers: Story = {
  render: () => {
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [open3, setOpen3] = useState(false)

    return (
      <div className="flex gap-4 flex-wrap justify-center">
        <Popover open={open1} onOpenChange={setOpen1}>
          <PopoverTrigger size="sm">Popover 1</PopoverTrigger>
          
          <PopoverPopup>
            <PopoverTitle>First Popover</PopoverTitle>
            <PopoverDescription>This is the first independent popover.</PopoverDescription>
          </PopoverPopup>
        
        </Popover>

        <Popover open={open2} onOpenChange={setOpen2}>
          <PopoverTrigger size="sm">Popover 2</PopoverTrigger>
          
          <PopoverPopup>
            <PopoverTitle>Second Popover</PopoverTitle>
            <PopoverDescription>This is the second independent popover.</PopoverDescription>
          </PopoverPopup>
        
        </Popover>

        <Popover open={open3} onOpenChange={setOpen3}>
          <PopoverTrigger size="sm">Popover 3</PopoverTrigger>
          
          <PopoverPopup>
            <PopoverTitle>Third Popover</PopoverTitle>
            <PopoverDescription>This is the third independent popover.</PopoverDescription>
          </PopoverPopup>
        
        </Popover>
      </div>
    )
  },
}

/**
 * Rich Content Popover
 * A popover with images, code snippets, and formatted content.
 * Demonstrates how popovers can display complex information.
 */
export const RichContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>Code Snippet</PopoverTrigger>
        <PopoverPopup className="max-w-sm">
          <PopoverTitle>Usage Example</PopoverTitle>
          <div className="mt-3 bg-card/70 border border-border rounded-lg p-3">
            <pre className="text-xs text-[#C4C8D4] overflow-x-auto">
              {`const [open, setOpen] = useState(false)

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger>Click me</PopoverTrigger>
  
          <PopoverPopup>
    <PopoverTitle>Hello</PopoverTitle>
  </PopoverPopup>
        
</Popover>`}
            </pre>
          </div>
        </PopoverPopup>
        
      </Popover>
    )
  },
}
