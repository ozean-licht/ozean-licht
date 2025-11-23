import type { Meta, StoryObj } from '@storybook/react'
import {
  EmptyRoot,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  EmptyAction,
  InboxIcon,
  SearchIcon,
  FileIcon,
  FolderIcon,
  PackageIcon,
  BellIcon,
  ShoppingCartIcon,
  MessageSquareIcon,
  StarIcon,
  AlertCircleIcon,
  LockIcon,
  ClockIcon,
} from './empty'
import { Button } from './button'

const meta: Meta<typeof EmptyRoot> = {
  title: 'CossUI/Empty',
  component: EmptyRoot,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Empty state component from Coss UI adapted for Ozean Licht design system. Provides a consistent way to display empty states, no data scenarios, and error messages with icons, titles, descriptions, and optional actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the empty state',
    },
  },
}

export default meta
type Story = StoryObj<typeof EmptyRoot>

/**
 * Default Empty State
 * The standard empty state with inbox icon, suitable for general empty data scenarios.
 */
export const Default: Story = {
  render: () => (
    <EmptyRoot className="w-[500px]">
      <EmptyIcon>
        <InboxIcon />
      </EmptyIcon>
      <EmptyTitle>No items found</EmptyTitle>
      <EmptyDescription>
        There are no items to display at the moment. Try adding some content to get started.
      </EmptyDescription>
    </EmptyRoot>
  ),
}

/**
 * No Search Results
 * Empty state displayed when a search query returns no results.
 */
export const NoSearchResults: Story = {
  render: () => (
    <EmptyRoot className="w-[500px]">
      <EmptyIcon>
        <SearchIcon />
      </EmptyIcon>
      <EmptyTitle>No results found</EmptyTitle>
      <EmptyDescription>
        We couldn't find any results matching your search. Try adjusting your search terms or filters.
      </EmptyDescription>
      <EmptyAction>
        <Button variant="ghost" size="sm">
          Clear search
        </Button>
      </EmptyAction>
    </EmptyRoot>
  ),
}

/**
 * No Data in Table
 * Empty state for tables and data grids with no entries.
 */
export const NoDataInTable: Story = {
  render: () => (
    <EmptyRoot className="w-[600px]">
      <EmptyIcon>
        <FileIcon />
      </EmptyIcon>
      <EmptyTitle>No data available</EmptyTitle>
      <EmptyDescription>
        This table doesn't contain any data yet. Add your first entry to populate the table.
      </EmptyDescription>
      <EmptyAction>
        <Button variant="primary" size="sm">
          Add Entry
        </Button>
      </EmptyAction>
    </EmptyRoot>
  ),
}

/**
 * No Notifications
 * Empty state for notification centers or alert lists.
 */
export const NoNotifications: Story = {
  render: () => (
    <EmptyRoot className="w-[450px]">
      <EmptyIcon>
        <BellIcon />
      </EmptyIcon>
      <EmptyTitle>No notifications</EmptyTitle>
      <EmptyDescription>
        You're all caught up! We'll notify you when there's something new.
      </EmptyDescription>
    </EmptyRoot>
  ),
}

/**
 * No Messages
 * Empty state for messaging or chat interfaces.
 */
export const NoMessages: Story = {
  render: () => (
    <EmptyRoot className="w-[500px]">
      <EmptyIcon>
        <MessageSquareIcon />
      </EmptyIcon>
      <EmptyTitle>No messages yet</EmptyTitle>
      <EmptyDescription>
        Your inbox is empty. Start a conversation to see messages here.
      </EmptyDescription>
      <EmptyAction>
        <Button variant="primary" size="sm">
          New Message
        </Button>
      </EmptyAction>
    </EmptyRoot>
  ),
}

/**
 * Empty Cart
 * Empty state for shopping carts or checkout flows.
 */
export const EmptyCart: Story = {
  render: () => (
    <EmptyRoot className="w-[500px]">
      <EmptyIcon>
        <ShoppingCartIcon />
      </EmptyIcon>
      <EmptyTitle>Your cart is empty</EmptyTitle>
      <EmptyDescription>
        Add items to your cart to start shopping. Browse our collection to find what you need.
      </EmptyDescription>
      <EmptyAction>
        <Button variant="primary" size="sm">
          Continue Shopping
        </Button>
      </EmptyAction>
    </EmptyRoot>
  ),
}

/**
 * No Files Uploaded
 * Empty state for file upload areas or document libraries.
 */
export const NoFilesUploaded: Story = {
  render: () => (
    <EmptyRoot className="w-[550px]">
      <EmptyIcon>
        <FolderIcon />
      </EmptyIcon>
      <EmptyTitle>No files uploaded</EmptyTitle>
      <EmptyDescription>
        This folder is empty. Upload files by dragging them here or using the upload button.
      </EmptyDescription>
      <EmptyAction>
        <Button variant="primary" size="sm">
          Upload Files
        </Button>
        <Button variant="ghost" size="sm">
          Browse Computer
        </Button>
      </EmptyAction>
    </EmptyRoot>
  ),
}

/**
 * Empty Inbox
 * Empty state for email or message inbox.
 */
export const EmptyInbox: Story = {
  render: () => (
    <EmptyRoot className="w-[500px]">
      <EmptyIcon>
        <InboxIcon />
      </EmptyIcon>
      <EmptyTitle>Inbox Zero!</EmptyTitle>
      <EmptyDescription>
        Congratulations! You've cleared your inbox. Enjoy the peace of mind.
      </EmptyDescription>
    </EmptyRoot>
  ),
}

/**
 * Empty Favorites
 * Empty state for favorites, bookmarks, or saved items.
 */
export const EmptyFavorites: Story = {
  render: () => (
    <EmptyRoot className="w-[500px]">
      <EmptyIcon>
        <StarIcon />
      </EmptyIcon>
      <EmptyTitle>No favorites yet</EmptyTitle>
      <EmptyDescription>
        Save your favorite items here for quick access. Click the star icon on any item to add it.
      </EmptyDescription>
    </EmptyRoot>
  ),
}

/**
 * No Projects Created
 * Empty state for project lists or workspaces.
 */
export const NoProjects: Story = {
  render: () => (
    <EmptyRoot className="w-[550px]">
      <EmptyIcon>
        <PackageIcon />
      </EmptyIcon>
      <EmptyTitle>No projects created</EmptyTitle>
      <EmptyDescription>
        Get started by creating your first project. Projects help you organize and manage your work efficiently.
      </EmptyDescription>
      <EmptyAction>
        <Button variant="primary" size="sm">
          Create Project
        </Button>
      </EmptyAction>
    </EmptyRoot>
  ),
}

/**
 * 404 Error State
 * Empty state for page not found errors.
 */
export const Error404: Story = {
  render: () => (
    <EmptyRoot className="w-[550px]">
      <EmptyIcon>
        <AlertCircleIcon />
      </EmptyIcon>
      <EmptyTitle>Page not found</EmptyTitle>
      <EmptyDescription>
        The page you're looking for doesn't exist or has been moved. Please check the URL or return to the homepage.
      </EmptyDescription>
      <EmptyAction>
        <Button variant="primary" size="sm">
          Go to Homepage
        </Button>
        <Button variant="ghost" size="sm">
          Contact Support
        </Button>
      </EmptyAction>
    </EmptyRoot>
  ),
}

/**
 * Permission Denied
 * Empty state for access denied or insufficient permissions.
 */
export const PermissionDenied: Story = {
  render: () => (
    <EmptyRoot className="w-[550px]">
      <EmptyIcon>
        <LockIcon />
      </EmptyIcon>
      <EmptyTitle>Access denied</EmptyTitle>
      <EmptyDescription>
        You don't have permission to view this content. Contact your administrator to request access.
      </EmptyDescription>
      <EmptyAction>
        <Button variant="secondary" size="sm">
          Request Access
        </Button>
      </EmptyAction>
    </EmptyRoot>
  ),
}

/**
 * Coming Soon
 * Empty state for features under development.
 */
export const ComingSoon: Story = {
  render: () => (
    <EmptyRoot className="w-[550px]">
      <EmptyIcon>
        <ClockIcon />
      </EmptyIcon>
      <EmptyTitle>Coming soon</EmptyTitle>
      <EmptyDescription>
        We're working hard to bring you this feature. Stay tuned for updates and announcements.
      </EmptyDescription>
      <EmptyAction>
        <Button variant="secondary" size="sm">
          Notify Me
        </Button>
      </EmptyAction>
    </EmptyRoot>
  ),
}

/**
 * With Action Button
 * Empty state with a primary action button.
 */
export const WithActionButton: Story = {
  render: () => (
    <EmptyRoot className="w-[500px]">
      <EmptyIcon>
        <FileIcon />
      </EmptyIcon>
      <EmptyTitle>No documents</EmptyTitle>
      <EmptyDescription>
        Create your first document to get started. Documents can be shared and collaborated on with your team.
      </EmptyDescription>
      <EmptyAction>
        <Button variant="primary" size="default">
          Create Document
        </Button>
      </EmptyAction>
    </EmptyRoot>
  ),
}

/**
 * With Multiple Actions
 * Empty state with multiple action buttons for different options.
 */
export const WithMultipleActions: Story = {
  render: () => (
    <EmptyRoot className="w-[600px]">
      <EmptyIcon>
        <FolderIcon />
      </EmptyIcon>
      <EmptyTitle>No content available</EmptyTitle>
      <EmptyDescription>
        Start by creating content or importing from existing sources. Choose the option that works best for you.
      </EmptyDescription>
      <EmptyAction>
        <Button variant="primary" size="sm">
          Create New
        </Button>
        <Button variant="secondary" size="sm">
          Import Content
        </Button>
        <Button variant="ghost" size="sm">
          Browse Templates
        </Button>
      </EmptyAction>
    </EmptyRoot>
  ),
}

/**
 * Small Size
 * Compact empty state for smaller containers or inline displays.
 */
export const SmallSize: Story = {
  render: () => (
    <EmptyRoot size="sm" className="w-[400px]">
      <EmptyIcon size="sm">
        <InboxIcon className="w-12 h-12" />
      </EmptyIcon>
      <EmptyTitle size="sm">No items</EmptyTitle>
      <EmptyDescription size="sm">
        No items to display in this section.
      </EmptyDescription>
      <EmptyAction>
        <Button variant="ghost" size="xs">
          Add Item
        </Button>
      </EmptyAction>
    </EmptyRoot>
  ),
}

/**
 * Large Size
 * Spacious empty state for full-page displays or hero sections.
 */
export const LargeSize: Story = {
  render: () => (
    <EmptyRoot size="lg" className="w-[700px]">
      <EmptyIcon size="lg">
        <PackageIcon className="w-24 h-24" />
      </EmptyIcon>
      <EmptyTitle size="lg">Welcome to your workspace</EmptyTitle>
      <EmptyDescription size="lg">
        This is where all your projects will live. Create your first project to start organizing your work and collaborating with your team.
      </EmptyDescription>
      <EmptyAction>
        <Button variant="primary" size="lg">
          Create Your First Project
        </Button>
      </EmptyAction>
    </EmptyRoot>
  ),
}

/**
 * Custom Illustration
 * Empty state with custom SVG illustration instead of icon.
 */
export const CustomIllustration: Story = {
  render: () => (
    <EmptyRoot className="w-[550px]">
      <EmptyIcon>
        <svg
          viewBox="0 0 200 200"
          className="w-32 h-32 text-primary"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="80" fill="currentColor" opacity="0.1" />
          <circle cx="100" cy="100" r="60" fill="currentColor" opacity="0.2" />
          <circle cx="100" cy="100" r="40" fill="currentColor" opacity="0.3" />
          <circle cx="100" cy="100" r="20" fill="currentColor" />
        </svg>
      </EmptyIcon>
      <EmptyTitle>Custom illustration</EmptyTitle>
      <EmptyDescription>
        Empty states can use custom illustrations or graphics to match your brand and enhance user experience.
      </EmptyDescription>
    </EmptyRoot>
  ),
}

/**
 * With Glass Effect
 * Empty state displayed with glass morphism effect over gradient background.
 */
export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-12 bg-gradient-to-br from-background via-card to-[#055D75]/20 rounded-lg">
      <div className="glass-card rounded-lg">
        <EmptyRoot className="w-[500px]">
          <EmptyIcon>
            <InboxIcon />
          </EmptyIcon>
          <EmptyTitle>Glass morphism empty state</EmptyTitle>
          <EmptyDescription>
            This empty state uses the glass morphism effect for a modern, elegant appearance that blends beautifully with the background.
          </EmptyDescription>
          <EmptyAction>
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </EmptyAction>
        </EmptyRoot>
      </div>
    </div>
  ),
}

/**
 * All Sizes Comparison
 * Side-by-side comparison of all three size variants.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 items-center">
      <EmptyRoot size="sm" className="w-[350px] border border-border rounded-lg bg-card/50">
        <EmptyIcon size="sm">
          <InboxIcon className="w-12 h-12" />
        </EmptyIcon>
        <EmptyTitle size="sm">Small size</EmptyTitle>
        <EmptyDescription size="sm">
          Compact empty state for smaller spaces.
        </EmptyDescription>
      </EmptyRoot>

      <EmptyRoot size="md" className="w-[500px] border border-border rounded-lg bg-card/50">
        <EmptyIcon size="md">
          <InboxIcon className="w-16 h-16" />
        </EmptyIcon>
        <EmptyTitle size="md">Medium size (default)</EmptyTitle>
        <EmptyDescription size="md">
          Standard empty state for most use cases.
        </EmptyDescription>
      </EmptyRoot>

      <EmptyRoot size="lg" className="w-[650px] border border-border rounded-lg bg-card/50">
        <EmptyIcon size="lg">
          <InboxIcon className="w-24 h-24" />
        </EmptyIcon>
        <EmptyTitle size="lg">Large size</EmptyTitle>
        <EmptyDescription size="lg">
          Spacious empty state for full-page or hero sections.
        </EmptyDescription>
      </EmptyRoot>
    </div>
  ),
}

/**
 * All Icons Showcase
 * Comprehensive display of all available built-in icons.
 */
export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6 max-w-[900px]">
      <EmptyRoot size="sm" className="border border-border rounded-lg bg-card/50">
        <EmptyIcon size="sm">
          <InboxIcon className="w-12 h-12" />
        </EmptyIcon>
        <EmptyTitle size="sm">Inbox</EmptyTitle>
      </EmptyRoot>

      <EmptyRoot size="sm" className="border border-border rounded-lg bg-card/50">
        <EmptyIcon size="sm">
          <SearchIcon className="w-12 h-12" />
        </EmptyIcon>
        <EmptyTitle size="sm">Search</EmptyTitle>
      </EmptyRoot>

      <EmptyRoot size="sm" className="border border-border rounded-lg bg-card/50">
        <EmptyIcon size="sm">
          <FileIcon className="w-12 h-12" />
        </EmptyIcon>
        <EmptyTitle size="sm">File</EmptyTitle>
      </EmptyRoot>

      <EmptyRoot size="sm" className="border border-border rounded-lg bg-card/50">
        <EmptyIcon size="sm">
          <FolderIcon className="w-12 h-12" />
        </EmptyIcon>
        <EmptyTitle size="sm">Folder</EmptyTitle>
      </EmptyRoot>

      <EmptyRoot size="sm" className="border border-border rounded-lg bg-card/50">
        <EmptyIcon size="sm">
          <PackageIcon className="w-12 h-12" />
        </EmptyIcon>
        <EmptyTitle size="sm">Package</EmptyTitle>
      </EmptyRoot>

      <EmptyRoot size="sm" className="border border-border rounded-lg bg-card/50">
        <EmptyIcon size="sm">
          <BellIcon className="w-12 h-12" />
        </EmptyIcon>
        <EmptyTitle size="sm">Bell</EmptyTitle>
      </EmptyRoot>

      <EmptyRoot size="sm" className="border border-border rounded-lg bg-card/50">
        <EmptyIcon size="sm">
          <ShoppingCartIcon className="w-12 h-12" />
        </EmptyIcon>
        <EmptyTitle size="sm">Cart</EmptyTitle>
      </EmptyRoot>

      <EmptyRoot size="sm" className="border border-border rounded-lg bg-card/50">
        <EmptyIcon size="sm">
          <MessageSquareIcon className="w-12 h-12" />
        </EmptyIcon>
        <EmptyTitle size="sm">Message</EmptyTitle>
      </EmptyRoot>

      <EmptyRoot size="sm" className="border border-border rounded-lg bg-card/50">
        <EmptyIcon size="sm">
          <StarIcon className="w-12 h-12" />
        </EmptyIcon>
        <EmptyTitle size="sm">Star</EmptyTitle>
      </EmptyRoot>

      <EmptyRoot size="sm" className="border border-border rounded-lg bg-card/50">
        <EmptyIcon size="sm">
          <AlertCircleIcon className="w-12 h-12" />
        </EmptyIcon>
        <EmptyTitle size="sm">Alert</EmptyTitle>
      </EmptyRoot>

      <EmptyRoot size="sm" className="border border-border rounded-lg bg-card/50">
        <EmptyIcon size="sm">
          <LockIcon className="w-12 h-12" />
        </EmptyIcon>
        <EmptyTitle size="sm">Lock</EmptyTitle>
      </EmptyRoot>

      <EmptyRoot size="sm" className="border border-border rounded-lg bg-card/50">
        <EmptyIcon size="sm">
          <ClockIcon className="w-12 h-12" />
        </EmptyIcon>
        <EmptyTitle size="sm">Clock</EmptyTitle>
      </EmptyRoot>
    </div>
  ),
}

/**
 * Accessibility Example
 * Empty state with ARIA attributes for screen readers.
 */
export const AccessibilityExample: Story = {
  render: () => (
    <EmptyRoot
      className="w-[500px]"
      role="status"
      aria-live="polite"
      aria-label="No items found in the list"
    >
      <EmptyIcon>
        <InboxIcon />
      </EmptyIcon>
      <EmptyTitle>Accessible empty state</EmptyTitle>
      <EmptyDescription>
        This empty state includes proper ARIA attributes (role="status", aria-live="polite") for screen reader compatibility and accessibility.
      </EmptyDescription>
    </EmptyRoot>
  ),
}
