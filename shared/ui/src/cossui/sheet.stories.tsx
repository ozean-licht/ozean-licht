import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from './sheet'
import { Button } from './button'

const meta: Meta<typeof Sheet> = {
  title: 'CossUI/Sheet',
  component: Sheet,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Sheet (Drawer) component from Coss UI with glass morphism effects for Ozean Licht. Slides in from edges (left, right, top, bottom) with smooth animations and backdrop blur. Perfect for navigation menus, filters, settings panels, and mobile interfaces.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Sheet>

/**
 * Default Sheet (Right)
 * A basic sheet that slides in from the right side.
 * The most common pattern for sheets/drawers.
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>
                This is a basic sheet component. Click outside or the close button to dismiss.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-sm text-[#C4C8D4]">
                Sheet content goes here. You can add any content you need.
              </p>
            </div>
            <SheetFooter>
              <SheetClose>Close</SheetClose>
              <Button variant="primary">Save Changes</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Sheet from Left
 * Sheet sliding in from the left side.
 * Commonly used for navigation menus.
 */
export const FromLeft: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>Open Left Sheet</SheetTrigger>
          <SheetContent position="left">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>Browse through the main sections</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <nav className="space-y-2">
                {['Dashboard', 'Projects', 'Team', 'Calendar', 'Documents', 'Settings'].map(
                  (item) => (
                    <button
                      key={item}
                      className="w-full text-left px-4 py-2 rounded-lg text-sm text-[#C4C8D4] hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {item}
                    </button>
                  )
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Sheet from Top
 * Sheet sliding in from the top.
 * Useful for notifications or announcements.
 */
export const FromTop: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>Open Top Sheet</SheetTrigger>
          <SheetContent position="top" size="md">
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
              <SheetDescription>Recent activity and updates</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 bg-card/50 border border-primary/10 rounded-lg"
                  >
                    <p className="text-sm font-medium text-white">Notification {i}</p>
                    <p className="text-xs text-[#C4C8D4] mt-1">
                      This is a sample notification message.
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <SheetFooter>
              <SheetClose>Dismiss</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Sheet from Bottom
 * Sheet sliding in from the bottom.
 * Perfect for mobile action sheets and context menus.
 */
export const FromBottom: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>Open Bottom Sheet</SheetTrigger>
          <SheetContent position="bottom" size="md">
            <SheetHeader>
              <SheetTitle>Actions</SheetTitle>
              <SheetDescription>Choose an action to perform</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {['Share', 'Copy Link', 'Download', 'Print', 'Report'].map((action) => (
                  <button
                    key={action}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm text-white bg-card/50 hover:bg-primary/10 border border-primary/10 hover:border-primary/30 transition-all"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Mobile Navigation Menu
 * A practical example of using a sheet for mobile navigation.
 * Includes multiple navigation sections and user profile.
 */
export const MobileNavigation: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </SheetTrigger>
          <SheetContent position="left" size="md">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Navigation and account</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-medium text-[#C4C8D4] uppercase tracking-wider mb-2">
                    Main
                  </h3>
                  <nav className="space-y-1">
                    {['Home', 'Explore', 'Following', 'Favorites'].map((item) => (
                      <button
                        key={item}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-white hover:bg-primary/10 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </nav>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-[#C4C8D4] uppercase tracking-wider mb-2">
                    Library
                  </h3>
                  <nav className="space-y-1">
                    {['Playlists', 'Liked Songs', 'Albums', 'Artists'].map((item) => (
                      <button
                        key={item}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-white hover:bg-primary/10 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            <SheetFooter>
              <div className="w-full flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-primary/10">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">John Doe</p>
                  <p className="text-xs text-[#C4C8D4] truncate">john@example.com</p>
                </div>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Settings Panel
 * A comprehensive settings panel with multiple sections.
 * Demonstrates form controls within a sheet.
 */
export const SettingsPanel: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>Settings</SheetTrigger>
          <SheetContent position="right" size="lg">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
              <SheetDescription>
                Manage your account settings and preferences
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Profile</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#C4C8D4] mb-1 block">Display Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full h-9 px-3 rounded-md border border-primary/20 bg-card/50 backdrop-blur-8 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#C4C8D4] mb-1 block">Email</label>
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full h-9 px-3 rounded-md border border-primary/20 bg-card/50 backdrop-blur-8 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-[#C4C8D4]">Email Notifications</label>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-[#C4C8D4]">Marketing Emails</label>
                      <input type="checkbox" className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-[#C4C8D4]">Auto-play Videos</label>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Appearance</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#C4C8D4] mb-1 block">Language</label>
                      <select className="w-full h-9 px-3 rounded-md border border-primary/20 bg-card/50 backdrop-blur-8 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <option>English</option>
                        <option>German</option>
                        <option>French</option>
                        <option>Spanish</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <SheetFooter>
              <SheetClose>Cancel</SheetClose>
              <Button variant="primary">Save Changes</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Filters Panel
 * A filters panel with various filter controls.
 * Perfect for e-commerce or data filtering scenarios.
 */
export const FiltersPanel: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
          </SheetTrigger>
          <SheetContent position="right" size="md">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your search results</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {['Under $25', '$25 - $50', '$50 - $100', 'Over $100'].map((range) => (
                      <label key={range} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-sm text-[#C4C8D4]">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Category</h3>
                  <div className="space-y-2">
                    {['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'].map(
                      (category) => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm text-[#C4C8D4]">{category}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Rating</h3>
                  <div className="space-y-2">
                    {['4+ Stars', '3+ Stars', '2+ Stars', 'All'].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="rating" className="w-4 h-4" />
                        <span className="text-sm text-[#C4C8D4]">{rating}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Availability</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm text-[#C4C8D4]">In Stock</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm text-[#C4C8D4]">On Sale</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <SheetFooter>
              <Button variant="ghost">Clear All</Button>
              <Button variant="primary">Apply Filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Shopping Cart
 * A shopping cart panel with product items.
 * Shows how to handle complex content layouts.
 */
export const ShoppingCart: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    const items = [
      { id: 1, name: 'Wireless Headphones', price: 99.99, quantity: 1 },
      { id: 2, name: 'Smart Watch', price: 249.99, quantity: 1 },
      { id: 3, name: 'USB-C Cable', price: 19.99, quantity: 2 },
    ]

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            Cart (3)
          </SheetTrigger>
          <SheetContent position="right" size="md">
            <SheetHeader>
              <SheetTitle>Shopping Cart</SheetTitle>
              <SheetDescription>Review your items before checkout</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-card/50 border border-primary/10 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="text-xs text-[#C4C8D4] mt-1">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium text-primary mt-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button className="text-[#C4C8D4] hover:text-red-400 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">Total</span>
                  <span className="text-lg font-decorative text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <SheetFooter>
              <SheetClose>Continue Shopping</SheetClose>
              <Button variant="primary">Checkout</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * User Profile Editor
 * A profile editing panel with avatar and form fields.
 * Demonstrates complex form layouts in a sheet.
 */
export const UserProfileEditor: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>Edit Profile</SheetTrigger>
          <SheetContent position="right" size="lg">
            <SheetHeader>
              <SheetTitle>Edit Profile</SheetTitle>
              <SheetDescription>Update your profile information and settings</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-medium">
                    JD
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-xs text-[#C4C8D4] mt-1">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#C4C8D4] mb-1 block">First Name</label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full h-9 px-3 rounded-md border border-primary/20 bg-card/50 backdrop-blur-8 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#C4C8D4] mb-1 block">Last Name</label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full h-9 px-3 rounded-md border border-primary/20 bg-card/50 backdrop-blur-8 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#C4C8D4] mb-1 block">Email</label>
                    <input
                      type="email"
                      defaultValue="john.doe@example.com"
                      className="w-full h-9 px-3 rounded-md border border-primary/20 bg-card/50 backdrop-blur-8 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#C4C8D4] mb-1 block">Bio</label>
                    <textarea
                      rows={4}
                      defaultValue="Software developer and designer."
                      className="w-full px-3 py-2 rounded-md border border-primary/20 bg-card/50 backdrop-blur-8 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#C4C8D4] mb-1 block">Location</label>
                    <input
                      type="text"
                      defaultValue="San Francisco, CA"
                      className="w-full h-9 px-3 rounded-md border border-primary/20 bg-card/50 backdrop-blur-8 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#C4C8D4] mb-1 block">Website</label>
                    <input
                      type="url"
                      defaultValue="https://johndoe.com"
                      className="w-full h-9 px-3 rounded-md border border-primary/20 bg-card/50 backdrop-blur-8 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
            <SheetFooter>
              <SheetClose>Cancel</SheetClose>
              <Button variant="primary">Save Changes</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Form in Sheet
 * A contact form inside a sheet.
 * Shows validation and form handling patterns.
 */
export const FormInSheet: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>Contact Us</SheetTrigger>
          <SheetContent position="right" size="md">
            <SheetHeader>
              <SheetTitle>Contact Form</SheetTitle>
              <SheetDescription>Send us a message and we'll get back to you</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <form className="space-y-4">
                <div>
                  <label className="text-xs text-[#C4C8D4] mb-1 block">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full h-9 px-3 rounded-md border border-primary/20 bg-card/50 backdrop-blur-8 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#C4C8D4] mb-1 block">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    className="w-full h-9 px-3 rounded-md border border-primary/20 bg-card/50 backdrop-blur-8 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#C4C8D4] mb-1 block">Subject</label>
                  <input
                    type="text"
                    placeholder="What is this about?"
                    className="w-full h-9 px-3 rounded-md border border-primary/20 bg-card/50 backdrop-blur-8 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#C4C8D4] mb-1 block">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Tell us more..."
                    className="w-full px-3 py-2 rounded-md border border-primary/20 bg-card/50 backdrop-blur-8 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                  />
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" className="w-4 h-4 mt-0.5" />
                  <label htmlFor="terms" className="text-xs text-[#C4C8D4]">
                    I agree to the terms and conditions and privacy policy
                  </label>
                </div>
              </form>
            </div>
            <SheetFooter>
              <SheetClose>Cancel</SheetClose>
              <Button variant="primary">Send Message</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Nested Content
 * Sheet with collapsible sections.
 * Demonstrates organizing complex content hierarchies.
 */
export const NestedContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [expandedSections, setExpandedSections] = useState<string[]>(['general'])

    const toggleSection = (section: string) => {
      setExpandedSections((prev) =>
        prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
      )
    }

    const sections = [
      { id: 'general', title: 'General Settings', items: ['Profile', 'Account', 'Privacy'] },
      { id: 'notifications', title: 'Notifications', items: ['Email', 'Push', 'SMS'] },
      { id: 'security', title: 'Security', items: ['Password', '2FA', 'Sessions'] },
      { id: 'billing', title: 'Billing', items: ['Subscription', 'Payment', 'Invoices'] },
    ]

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>Settings</SheetTrigger>
          <SheetContent position="right" size="md">
            <SheetHeader>
              <SheetTitle>All Settings</SheetTitle>
              <SheetDescription>Manage all your application settings</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {sections.map((section) => (
                  <div key={section.id} className="border border-primary/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-4 bg-card/30 hover:bg-card/50 transition-colors"
                    >
                      <span className="text-sm font-medium text-white">{section.title}</span>
                      <svg
                        className={`w-5 h-5 text-[#C4C8D4] transition-transform ${
                          expandedSections.includes(section.id) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {expandedSections.includes(section.id) && (
                      <div className="p-4 bg-card/20 space-y-2">
                        {section.items.map((item) => (
                          <button
                            key={item}
                            className="w-full text-left px-3 py-2 rounded text-sm text-[#C4C8D4] hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <SheetFooter>
              <SheetClose>Close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Small Size
 * A compact sheet for quick interactions.
 */
export const SmallSize: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>Quick Actions</SheetTrigger>
          <SheetContent position="right" size="sm">
            <SheetHeader>
              <SheetTitle>Quick Menu</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {['Action 1', 'Action 2', 'Action 3'].map((action) => (
                  <button
                    key={action}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-white bg-card/50 hover:bg-primary/10 border border-primary/10 hover:border-primary/30 transition-all"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Large Size
 * A wide sheet for complex content.
 */
export const LargeSize: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>View Details</SheetTrigger>
          <SheetContent position="right" size="lg">
            <SheetHeader>
              <SheetTitle>Project Details</SheetTitle>
              <SheetDescription>Comprehensive project information and analytics</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Status', value: 'Active' },
                    { label: 'Priority', value: 'High' },
                    { label: 'Progress', value: '67%' },
                    { label: 'Due Date', value: '2024-12-31' },
                  ].map((item) => (
                    <div key={item.label} className="p-4 bg-card/50 border border-primary/10 rounded-lg">
                      <p className="text-xs text-[#C4C8D4] uppercase tracking-wide">{item.label}</p>
                      <p className="text-lg font-medium text-white mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">Description</h3>
                  <p className="text-sm text-[#C4C8D4]">
                    This is a detailed description of the project that can span multiple lines and
                    provide comprehensive information about the goals, requirements, and current state.
                  </p>
                </div>
              </div>
            </div>
            <SheetFooter>
              <SheetClose>Close</SheetClose>
              <Button variant="primary">Edit Project</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Extra Large Size
 * A very wide sheet for dashboard-like content.
 */
export const ExtraLargeSize: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>Analytics</SheetTrigger>
          <SheetContent position="right" size="xl">
            <SheetHeader>
              <SheetTitle>Analytics Dashboard</SheetTitle>
              <SheetDescription>View detailed metrics and performance data</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Users', value: '12.5K' },
                    { label: 'Revenue', value: '$45.2K' },
                    { label: 'Conversion', value: '3.2%' },
                    { label: 'Growth', value: '+12%' },
                  ].map((metric) => (
                    <div key={metric.label} className="p-4 bg-card/50 border border-primary/10 rounded-lg">
                      <p className="text-xs text-[#C4C8D4] uppercase tracking-wide">{metric.label}</p>
                      <p className="text-2xl font-decorative text-primary mt-2">{metric.value}</p>
                    </div>
                  ))}
                </div>
                <div className="h-64 bg-card/30 border border-primary/10 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-[#C4C8D4]">Chart Placeholder</p>
                </div>
              </div>
            </div>
            <SheetFooter>
              <SheetClose>Close</SheetClose>
              <Button variant="primary">Export Data</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Full Width/Height
 * Sheet that takes full width or height.
 */
export const FullSize: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>Full Screen Panel</SheetTrigger>
          <SheetContent position="right" size="full">
            <SheetHeader>
              <SheetTitle>Full Panel</SheetTitle>
              <SheetDescription>Panel covering the entire viewport width</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-sm text-[#C4C8D4]">
                  This sheet uses the full viewport width, perfect for immersive experiences or
                  complex interfaces that need maximum space.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-video bg-card/50 border border-primary/10 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
            <SheetFooter>
              <SheetClose>Close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Glass Effect Variant
 * Enhanced glass morphism effect.
 */
export const GlassEffect: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00070F] via-[#055D75]/20 to-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>Open Glass Sheet</SheetTrigger>
          <SheetContent
            position="right"
            size="md"
            className="bg-[#00111A]/80 backdrop-blur-[24px]"
          >
            <SheetHeader>
              <SheetTitle>Enhanced Glass Effect</SheetTitle>
              <SheetDescription>
                Sheet with enhanced backdrop blur for a premium glass effect
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="p-6 bg-primary/10 border border-primary/20 rounded-lg backdrop-blur-sm">
                  <h3 className="text-lg font-medium text-primary mb-2">Glass Card</h3>
                  <p className="text-sm text-[#C4C8D4]">
                    The glass morphism effect creates visual depth and modern aesthetics.
                  </p>
                </div>
                <div className="p-6 bg-card/30 border border-primary/10 rounded-lg backdrop-blur-sm">
                  <h3 className="text-lg font-medium text-white mb-2">Layered Glass</h3>
                  <p className="text-sm text-[#C4C8D4]">
                    Multiple layers of glass effects can be combined for rich visual hierarchies.
                  </p>
                </div>
              </div>
            </div>
            <SheetFooter>
              <SheetClose>Close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Custom Trigger
 * Sheet with custom trigger element.
 */
export const CustomTrigger: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="outline">Open Drawer</Button>} />
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Custom Trigger</SheetTitle>
              <SheetDescription>
                This sheet was triggered by a custom button component
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-sm text-[#C4C8D4]">
                You can use any custom React element as a trigger using the render prop.
              </p>
            </div>
            <SheetFooter>
              <SheetClose>Close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Without Footer
 * Sheet with no footer actions.
 */
export const WithoutFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>Information</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Information Panel</SheetTitle>
              <SheetDescription>Read-only information display</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <p className="text-sm text-[#C4C8D4]">
                  This sheet doesn't have a footer since it's purely informational and doesn't require
                  any actions.
                </p>
                <p className="text-sm text-[#C4C8D4]">
                  Users can dismiss it by clicking outside or pressing ESC.
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * Mobile Optimized
 * Sheet optimized for mobile devices.
 */
export const MobileOptimized: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] p-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="w-full">Mobile Menu</SheetTrigger>
          <SheetContent position="bottom" size="lg" className="max-h-[80vh]">
            <div className="w-12 h-1 bg-primary/30 rounded-full mx-auto mb-4" />
            <SheetHeader>
              <SheetTitle>Mobile Actions</SheetTitle>
              <SheetDescription>Swipe down to dismiss</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {['Home', 'Search', 'Notifications', 'Profile', 'Settings', 'Help'].map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-3 rounded-lg text-base text-white bg-card/50 hover:bg-primary/10 border border-primary/10 transition-all active:scale-95"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

/**
 * All Positions Comparison
 * Shows sheets from all four positions.
 */
export const AllPositions: Story = {
  render: () => {
    const [openLeft, setOpenLeft] = useState(false)
    const [openRight, setOpenRight] = useState(false)
    const [openTop, setOpenTop] = useState(false)
    const [openBottom, setOpenBottom] = useState(false)

    return (
      <div className="min-h-screen bg-[#00070F] flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4">
          <Sheet open={openLeft} onOpenChange={setOpenLeft}>
            <SheetTrigger>Left</SheetTrigger>
            <SheetContent position="left" size="sm">
              <SheetHeader>
                <SheetTitle>Left Sheet</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-sm text-[#C4C8D4]">Content from left</p>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={openRight} onOpenChange={setOpenRight}>
            <SheetTrigger>Right</SheetTrigger>
            <SheetContent position="right" size="sm">
              <SheetHeader>
                <SheetTitle>Right Sheet</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-sm text-[#C4C8D4]">Content from right</p>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={openTop} onOpenChange={setOpenTop}>
            <SheetTrigger>Top</SheetTrigger>
            <SheetContent position="top" size="sm">
              <SheetHeader>
                <SheetTitle>Top Sheet</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-sm text-[#C4C8D4]">Content from top</p>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={openBottom} onOpenChange={setOpenBottom}>
            <SheetTrigger>Bottom</SheetTrigger>
            <SheetContent position="bottom" size="sm">
              <SheetHeader>
                <SheetTitle>Bottom Sheet</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-sm text-[#C4C8D4]">Content from bottom</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    )
  },
}
