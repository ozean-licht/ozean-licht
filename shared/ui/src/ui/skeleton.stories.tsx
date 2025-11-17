import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './skeleton';

/**
 * Skeleton loading primitive component.
 *
 * **This is a Tier 1 Primitive** - unstyled loading skeleton with minimal default styling.
 * For Ozean Licht branded skeletons with custom animations and effects, see Tier 2 Branded/Skeleton.
 *
 * ## Purpose
 * Skeleton screens provide visual feedback during content loading by showing placeholder elements
 * that approximate the final layout. This improves perceived performance and user experience by:
 * - Reducing layout shift when content loads
 * - Providing immediate visual feedback
 * - Setting user expectations about content structure
 * - Creating a more polished, professional feel
 *
 * ## Features
 * - **Pulse Animation**: Built-in animate-pulse for loading feedback
 * - **Flexible Sizing**: Easily customize width, height via className
 * - **Shape Variants**: Create rectangles, circles, rounded corners
 * - **Composable**: Build complex loading states by combining multiple skeletons
 *
 * ## Usage Patterns
 * ```tsx
 * // Simple rectangle
 * <Skeleton className="h-4 w-[250px]" />
 *
 * // Circle (avatar)
 * <Skeleton className="h-12 w-12 rounded-full" />
 *
 * // Card skeleton
 * <div className="space-y-2">
 *   <Skeleton className="h-4 w-[250px]" />
 *   <Skeleton className="h-4 w-[200px]" />
 * </div>
 * ```
 *
 * ## Best Practices
 * - Match skeleton dimensions to actual content as closely as possible
 * - Use consistent border radius with loaded content
 * - Combine multiple skeletons to represent complex layouts
 * - Consider using skeleton screens for initial page load and data fetching
 *
 * ## Design Tokens
 * - Background: `bg-muted` (theme-aware gray)
 * - Animation: `animate-pulse` (Tailwind's built-in pulse)
 * - Border: `rounded-md` (default, can be overridden)
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A loading placeholder component that displays a pulsing animation to indicate content is being loaded. Improves perceived performance by showing the expected layout structure.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default skeleton - simple rectangle.
 *
 * The most basic skeleton implementation with default styling.
 */
export const Default: Story = {
  render: () => <Skeleton className="h-4 w-[250px]" />,
};

/**
 * All shape variants.
 *
 * Demonstrates common skeleton shapes: rectangle, rounded, circle.
 */
export const AllShapes: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Rectangle (default)</p>
        <Skeleton className="h-4 w-[300px]" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Rounded corners</p>
        <Skeleton className="h-4 w-[250px] rounded-lg" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Circle</p>
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Square</p>
        <Skeleton className="h-24 w-24" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Pill shape</p>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>
    </div>
  ),
};

/**
 * Size variants.
 *
 * Common skeleton sizes for different use cases.
 */
export const SizeVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Small text (h-3)</p>
        <Skeleton className="h-3 w-[200px]" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Normal text (h-4)</p>
        <Skeleton className="h-4 w-[250px]" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Large text (h-6)</p>
        <Skeleton className="h-6 w-[300px]" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Heading (h-8)</p>
        <Skeleton className="h-8 w-[350px]" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Avatar small</p>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Avatar medium</p>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Avatar large</p>
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
    </div>
  ),
};

/**
 * Card skeleton.
 *
 * Common pattern for loading card components with image, title, and description.
 */
export const CardSkeleton: Story = {
  render: () => (
    <div className="flex flex-col space-y-3 w-[350px]">
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

/**
 * List skeleton.
 *
 * Loading state for list items with icons/avatars and text.
 */
export const ListSkeleton: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Profile skeleton.
 *
 * Loading state for user profile section with avatar and bio.
 */
export const ProfileSkeleton: Story = {
  render: () => (
    <div className="flex items-start space-x-4 w-[500px]">
      <Skeleton className="h-24 w-24 rounded-full" />
      <div className="space-y-3 flex-1">
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex space-x-2 pt-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Table skeleton.
 *
 * Loading state for data table with header and rows.
 */
export const TableSkeleton: Story = {
  render: () => (
    <div className="w-[700px] space-y-3">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 pb-3 border-b">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Rows */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="grid grid-cols-4 gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  ),
};

/**
 * Dashboard skeleton.
 *
 * Complex loading state for dashboard with stats cards and charts.
 */
export const DashboardSkeleton: Story = {
  render: () => (
    <div className="w-[800px] space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 p-4 border rounded-lg">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="space-y-3 p-4 border rounded-lg">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-[300px] w-full" />
      </div>

      {/* Recent activity */}
      <div className="space-y-3 p-4 border rounded-lg">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/**
 * Text skeleton.
 *
 * Simulates paragraph loading with varying line widths.
 */
export const TextSkeleton: Story = {
  render: () => (
    <div className="space-y-6 w-[600px]">
      <div className="space-y-2">
        <p className="text-sm font-medium mb-3">Single paragraph</p>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium mb-3">Multiple paragraphs</p>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium mb-3">Article with heading</p>
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-3 w-32 mt-2" />
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Form skeleton.
 *
 * Loading state for forms with labels and input fields.
 */
export const FormSkeleton: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-24 w-full" />
      </div>

      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="flex space-x-3 pt-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  ),
};

/**
 * Blog post skeleton.
 *
 * Loading state for blog post with hero image, metadata, and content.
 */
export const BlogPostSkeleton: Story = {
  render: () => (
    <div className="w-[700px] space-y-6">
      {/* Hero image */}
      <Skeleton className="h-[400px] w-full rounded-xl" />

      {/* Metadata */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Title */}
      <Skeleton className="h-10 w-3/4" />

      {/* Content */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="space-y-3 mt-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* Tags */}
      <div className="flex space-x-2 pt-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  ),
};

/**
 * E-commerce product skeleton.
 *
 * Loading state for product card with image, price, and details.
 */
export const ProductSkeleton: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3 w-[250px]">
          <Skeleton className="h-[250px] w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  ),
};

/**
 * Sidebar navigation skeleton.
 *
 * Loading state for navigation menu with icons and labels.
 */
export const NavigationSkeleton: Story = {
  render: () => (
    <div className="w-[250px] space-y-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center space-x-3 p-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  ),
};

/**
 * Comment thread skeleton.
 *
 * Loading state for nested comments with avatars and text.
 */
export const CommentThreadSkeleton: Story = {
  render: () => (
    <div className="w-[600px] space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-start space-x-3">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex space-x-4 pt-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>

          {/* Nested reply */}
          {i === 1 && (
            <div className="ml-12 flex items-start space-x-3">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  ),
};

/**
 * Media grid skeleton.
 *
 * Loading state for image/video grid gallery.
 */
export const MediaGridSkeleton: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[700px]">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <Skeleton key={i} className="h-[220px] w-full rounded-lg" />
      ))}
    </div>
  ),
};

/**
 * Chat message skeleton.
 *
 * Loading state for chat interface with messages.
 */
export const ChatSkeleton: Story = {
  render: () => (
    <div className="w-[500px] space-y-4">
      {/* Received message */}
      <div className="flex items-start space-x-3">
        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
        <div className="space-y-2 max-w-[70%]">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>

      {/* Sent message */}
      <div className="flex items-start space-x-3 justify-end">
        <div className="space-y-2 max-w-[70%]">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-3 w-12 ml-auto" />
        </div>
      </div>

      {/* Received message */}
      <div className="flex items-start space-x-3">
        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
        <div className="space-y-2 max-w-[70%]">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Notification skeleton.
 *
 * Loading state for notification list items.
 */
export const NotificationSkeleton: Story = {
  render: () => (
    <div className="w-[400px] space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start space-x-3 p-3 border rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
      ))}
    </div>
  ),
};

/**
 * Timeline skeleton.
 *
 * Loading state for activity timeline.
 */
export const TimelineSkeleton: Story = {
  render: () => (
    <div className="w-[500px] space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex space-x-4">
          <div className="flex flex-col items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            {i < 4 && <Skeleton className="h-12 w-0.5 my-2" />}
          </div>
          <div className="flex-1 space-y-2 pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-24 mt-2" />
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Ozean Licht themed skeleton.
 *
 * Custom skeleton using Ozean Licht turquoise color (#0ec2bc) for the pulse effect.
 * Demonstrates how to customize the skeleton for branded experiences.
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="space-y-8 w-[700px]">
      <div className="space-y-2">
        <p className="text-sm font-medium mb-3" style={{ color: '#0ec2bc' }}>
          Turquoise accent skeleton
        </p>
        <div
          className="h-4 w-[250px] rounded-md animate-pulse"
          style={{
            background: 'linear-gradient(90deg, rgba(14, 194, 188, 0.1) 0%, rgba(14, 194, 188, 0.2) 50%, rgba(14, 194, 188, 0.1) 100%)',
          }}
        />
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium mb-3" style={{ color: '#0ec2bc' }}>
          Branded card skeleton
        </p>
        <div className="flex flex-col space-y-3 w-full border rounded-lg p-6" style={{ borderColor: '#0ec2bc' }}>
          <div
            className="h-[200px] w-full rounded-xl animate-pulse"
            style={{
              background: 'linear-gradient(90deg, rgba(14, 194, 188, 0.1) 0%, rgba(14, 194, 188, 0.2) 50%, rgba(14, 194, 188, 0.1) 100%)',
            }}
          />
          <div className="space-y-2">
            <div
              className="h-4 w-3/4 rounded-md animate-pulse"
              style={{
                background: 'linear-gradient(90deg, rgba(14, 194, 188, 0.1) 0%, rgba(14, 194, 188, 0.2) 50%, rgba(14, 194, 188, 0.1) 100%)',
              }}
            />
            <div
              className="h-4 w-1/2 rounded-md animate-pulse"
              style={{
                background: 'linear-gradient(90deg, rgba(14, 194, 188, 0.1) 0%, rgba(14, 194, 188, 0.2) 50%, rgba(14, 194, 188, 0.1) 100%)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium mb-3" style={{ color: '#0ec2bc' }}>
          Branded profile skeleton
        </p>
        <div className="flex items-start space-x-4 w-full">
          <div
            className="h-24 w-24 rounded-full animate-pulse"
            style={{
              background: 'linear-gradient(90deg, rgba(14, 194, 188, 0.1) 0%, rgba(14, 194, 188, 0.2) 50%, rgba(14, 194, 188, 0.1) 100%)',
            }}
          />
          <div className="space-y-3 flex-1">
            <div
              className="h-6 w-[200px] rounded-md animate-pulse"
              style={{
                background: 'linear-gradient(90deg, rgba(14, 194, 188, 0.1) 0%, rgba(14, 194, 188, 0.2) 50%, rgba(14, 194, 188, 0.1) 100%)',
              }}
            />
            <div
              className="h-4 w-full rounded-md animate-pulse"
              style={{
                background: 'linear-gradient(90deg, rgba(14, 194, 188, 0.1) 0%, rgba(14, 194, 188, 0.2) 50%, rgba(14, 194, 188, 0.1) 100%)',
              }}
            />
            <div
              className="h-4 w-full rounded-md animate-pulse"
              style={{
                background: 'linear-gradient(90deg, rgba(14, 194, 188, 0.1) 0%, rgba(14, 194, 188, 0.2) 50%, rgba(14, 194, 188, 0.1) 100%)',
              }}
            />
            <div
              className="h-4 w-3/4 rounded-md animate-pulse"
              style={{
                background: 'linear-gradient(90deg, rgba(14, 194, 188, 0.1) 0%, rgba(14, 194, 188, 0.2) 50%, rgba(14, 194, 188, 0.1) 100%)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
