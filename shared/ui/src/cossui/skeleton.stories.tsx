import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './skeleton'
import {
  Card,
  CardHeader,
  CardPanel,
  CardFooter,
} from './card'

const meta: Meta<typeof Skeleton> = {
  title: 'Tier 1: Primitives/CossUI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Skeleton component from Coss UI adapted for Ozean Licht design system. Used to show loading states that match the actual content layout. Features glass morphism effects with pulse animation.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Skeleton>

/**
 * Basic Skeleton Shapes
 * Demonstrates individual skeleton elements used to compose loading layouts
 */
export const BasicLine: Story = {
  render: () => <Skeleton className="h-4 w-full rounded-md" />,
}

export const CircleAvatar: Story = {
  render: () => <Skeleton className="h-12 w-12 rounded-full" />,
}

export const Rectangle: Story = {
  render: () => <Skeleton className="h-48 w-64 rounded-lg" />,
}

export const BasicShapes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-alt font-medium text-foreground">Text Line</p>
        <Skeleton className="h-4 w-full rounded-md" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-alt font-medium text-foreground">
          Circle Avatar
        </p>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-alt font-medium text-foreground">Rectangle</p>
        <Skeleton className="h-32 w-48 rounded-lg" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-alt font-medium text-foreground">Large Block</p>
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  ),
}

/**
 * Text Content Skeleton
 * Multiple lines simulating text content loading
 */
export const TextContent: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-3">
      <Skeleton className="h-6 w-3/4 rounded-md" />
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-2/3 rounded-md" />
    </div>
  ),
}

/**
 * Card Skeleton
 * Loading state for a complete card component
 */
export const CardSkeleton: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <Skeleton className="h-7 w-1/2 rounded-md mb-2" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
      </CardHeader>
      <CardPanel className="space-y-3">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
      </CardPanel>
      <CardFooter className="gap-2">
        <Skeleton className="h-8 flex-1 rounded-md" />
        <Skeleton className="h-8 flex-1 rounded-md" />
      </CardFooter>
    </Card>
  ),
}

/**
 * User Profile Skeleton
 * Loading state for a user profile card with avatar, name, and details
 */
export const UserProfileSkeleton: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardPanel className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 flex-1 rounded-md" />
        </div>
      </CardPanel>
    </Card>
  ),
}

/**
 * Table Skeleton
 * Loading state for table rows with multiple columns
 */
export const TableSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <div className="rounded-lg border border-border bg-card/70 backdrop-blur-8 overflow-hidden">
        {/* Table Header */}
        <div className="flex gap-4 p-4 border-b border-border/50 bg-card/50">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 flex-1 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
        {/* Table Rows */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 p-4 border-b border-border/50 hover:bg-card/50 transition-colors"
          >
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 flex-1 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  ),
}

/**
 * List Skeleton
 * Loading state for a list of items
 */
export const ListSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg border border-border/30 bg-card/50 hover:bg-card/60 transition-colors"
        >
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      ))}
    </div>
  ),
}

/**
 * Dashboard Skeleton
 * Loading state for multiple cards in a dashboard grid
 */
export const DashboardSkeleton: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl p-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/2 rounded-md mb-2" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </CardHeader>
          <CardPanel>
            <Skeleton className="h-10 w-2/3 rounded-md mb-2" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </CardPanel>
        </Card>
      ))}
    </div>
  ),
}

/**
 * Avatar Skeleton
 * Various sizes of avatar placeholders
 */
export const AvatarSkeleton: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col gap-2 items-center">
        <Skeleton className="h-8 w-8 rounded-full" />
        <span className="text-xs text-muted-foreground">XS (32px)</span>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <Skeleton className="h-12 w-12 rounded-full" />
        <span className="text-xs text-muted-foreground">SM (48px)</span>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <Skeleton className="h-16 w-16 rounded-full" />
        <span className="text-xs text-muted-foreground">MD (64px)</span>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <Skeleton className="h-20 w-20 rounded-full" />
        <span className="text-xs text-muted-foreground">LG (80px)</span>
      </div>
    </div>
  ),
}

/**
 * Button Skeleton
 * Loading placeholders for buttons of various sizes
 */
export const ButtonSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center flex-wrap">
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-7 w-20 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
      <div className="flex gap-2 items-center">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-12 w-12 rounded-md" />
      </div>
    </div>
  ),
}

/**
 * Form Skeleton
 * Loading state for a form with multiple input fields
 */
export const FormSkeleton: Story = {
  render: () => (
    <Card className="w-[450px]">
      <CardHeader>
        <Skeleton className="h-7 w-2/3 rounded-md mb-2" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
      </CardHeader>
      <CardPanel className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4 rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4 rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3 rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4 rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      </CardPanel>
      <CardFooter className="gap-2">
        <Skeleton className="h-8 flex-1 rounded-md" />
        <Skeleton className="h-8 flex-1 rounded-md" />
      </CardFooter>
    </Card>
  ),
}

/**
 * Combined Skeleton Layout
 * Header with sidebar and content area loading state
 */
export const CombinedLayout: Story = {
  render: () => (
    <div className="w-full max-w-5xl space-y-4">
      {/* Header */}
      <div className="p-4 border border-border rounded-lg bg-card/70 backdrop-blur-8">
        <Skeleton className="h-8 w-1/4 rounded-md" />
      </div>
      {/* Main content with sidebar */}
      <div className="grid grid-cols-3 gap-4">
        {/* Sidebar */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
        {/* Main content */}
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2 rounded-md mb-2" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </CardHeader>
            <CardPanel className="space-y-3">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </CardPanel>
          </Card>
          <Card>
            <CardPanel className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                  </div>
                </div>
              ))}
            </CardPanel>
          </Card>
        </div>
      </div>
    </div>
  ),
}

/**
 * E-commerce Product Skeleton
 * Loading state for a product card with image, title, and price
 */
export const ProductCardSkeleton: Story = {
  render: () => (
    <Card className="w-[280px] overflow-hidden">
      <div className="relative">
        <Skeleton className="h-64 w-full rounded-none" />
        <Skeleton className="absolute top-3 right-3 h-8 w-8 rounded-full" />
      </div>
      <CardPanel className="space-y-3">
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-1/3 rounded-md" />
          <Skeleton className="h-4 w-1/4 rounded-md" />
        </div>
        <Skeleton className="h-8 w-full rounded-md" />
      </CardPanel>
    </Card>
  ),
}

/**
 * Blog Post Skeleton
 * Loading state for blog post preview cards
 */
export const BlogPostSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
    </div>
  ),
}

/**
 * Search Results Skeleton
 * Loading state for search result items
 */
export const SearchResultsSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-3">
      <div className="flex gap-3 p-3 rounded-lg border border-border/30 bg-card/50">
        <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
      </div>
      <div className="flex gap-3 p-3 rounded-lg border border-border/30 bg-card/50">
        <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-3 w-2/3 rounded-md" />
        </div>
      </div>
      <div className="flex gap-3 p-3 rounded-lg border border-border/30 bg-card/50">
        <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-4/5 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-3 w-3/5 rounded-md" />
        </div>
      </div>
    </div>
  ),
}

/**
 * Comments Section Skeleton
 * Loading state for a comments thread with replies
 */
export const CommentsSectionSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <Skeleton className="h-6 w-1/4 rounded-md" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-l-2 border-border/50 pl-4 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  ),
}

/**
 * Notification Skeleton
 * Loading state for notification items
 */
export const NotificationSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 rounded-lg border border-border/30 bg-card/50 hover:bg-card/60 transition-colors"
        >
          <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0 mt-1" />
          <div className="flex-1 space-y-2 min-w-0">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
          <Skeleton className="h-4 w-8 rounded-md flex-shrink-0" />
        </div>
      ))}
    </div>
  ),
}

/**
 * Calendar Event Skeleton
 * Loading state for a calendar with events
 */
export const CalendarEventSkeleton: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <Skeleton className="h-6 w-1/3 rounded-md mb-3" />
      </CardHeader>
      <CardPanel>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-10 w-full rounded-md"
              style={{ opacity: Math.random() > 0.7 ? 0.5 : 1 }}
            />
          ))}
        </div>
      </CardPanel>
    </Card>
  ),
}

/**
 * Chat Message Skeleton
 * Loading state for chat messages in a conversation
 */
export const ChatMessageSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-3 h-96 flex flex-col justify-end">
      <div className="flex gap-2 justify-start">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 flex-1 max-w-sm">
          <Skeleton className="h-4 w-1/2 rounded-md" />
          <div className="bg-card/70 backdrop-blur-8 rounded-lg p-3 space-y-1">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <div className="space-y-2 flex-1 max-w-sm">
          <div className="bg-primary/20 rounded-lg p-3 space-y-1 ml-auto">
            <Skeleton className="h-4 w-full rounded-md bg-primary/30" />
            <Skeleton className="h-4 w-4/5 rounded-md bg-primary/30" />
          </div>
          <Skeleton className="h-3 w-20 rounded-md ml-auto" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  ),
}

/**
 * Media Grid Skeleton
 * Loading state for image gallery or media grid
 */
export const MediaGridSkeleton: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto px-8 py-12">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="relative group">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="absolute bottom-2 left-2 right-2 h-8 rounded-md opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  ),
}

/**
 * Timeline Skeleton
 * Loading state for a timeline or activity feed
 */
export const TimelineSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <div className="relative space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <Skeleton className="h-3 w-3 rounded-full" />
              {i < 4 && <div className="h-12 w-0.5 bg-border/30 my-2" />}
            </div>
            <div className="pb-4 flex-1">
              <Skeleton className="h-4 w-1/3 rounded-md mb-2" />
              <Skeleton className="h-4 w-full rounded-md mb-1" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}

/**
 * Stats Card Skeleton
 * Loading state for statistics dashboard cards
 */
export const StatsCardSkeleton: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-4 w-1/2 rounded-md mb-3" />
          <Skeleton className="h-10 w-2/3 rounded-md mb-3" />
          <Skeleton className="h-3 w-1/3 rounded-md" />
        </Card>
      ))}
    </div>
  ),
}

/**
 * Video Thumbnail Skeleton
 * Loading state for video thumbnail cards with metadata
 */
export const VideoThumbnailSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <div className="relative">
        <Skeleton className="aspect-video rounded-lg" />
        <Skeleton className="absolute inset-0 h-12 w-12 rounded-full m-auto" />
      </div>
      <div className="mt-3 space-y-2">
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-3 w-1/3 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Responsive Grid Skeleton
 * Demonstrates responsive behavior across different breakpoints
 */
export const ResponsiveGridSkeleton: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-40 w-full rounded-none" />
            <CardPanel className="space-y-2">
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </CardPanel>
          </Card>
        ))}
      </div>
    </div>
  ),
}
