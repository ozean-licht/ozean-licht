import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

/**
 * Avatar component for displaying user profile images.
 * Built on Radix UI Avatar primitive.
 *
 * ## Features
 * - Automatic fallback to initials when image fails to load
 * - Circular shape with consistent sizing
 * - Supports status indicators and badges
 * - Accessible image loading states
 * - Customizable sizes via className
 *
 * ## Usage
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="https://github.com/shadcn.png" alt="User" />
 *   <AvatarFallback>CN</AvatarFallback>
 * </Avatar>
 * ```
 *
 * ## Accessibility
 * - Uses img element with alt text for screen readers
 * - Fallback provides text content when image unavailable
 * - Proper ARIA attributes for loading states
 * - Status indicators have appropriate color contrast
 *
 * ## Best Practices
 * - Always provide both AvatarImage and AvatarFallback
 * - Use 1-2 character initials for fallback (e.g., "AB", "JD")
 * - Provide descriptive alt text for images
 * - Use consistent sizing across your application
 * - Consider adding status indicators for online/offline states
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component for displaying user profile pictures with automatic fallback to initials. Handles image loading states gracefully.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom sizing',
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default avatar with image
 */
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Avatar with fallback initials (image intentionally broken)
 */
export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://invalid-url.example.com/image.png" alt="@ozean-licht" />
      <AvatarFallback>OL</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Avatar with only fallback (no image)
 */
export const InitialsOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Avatar with custom background color for fallback
 */
export const CustomFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback className="bg-[#0ec2bc] text-white font-semibold">
        KA
      </AvatarFallback>
    </Avatar>
  ),
};

/**
 * Different size variations
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="Small" />
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Default" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>

      <Avatar className="h-16 w-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="Large" />
        <AvatarFallback className="text-lg">LG</AvatarFallback>
      </Avatar>

      <Avatar className="h-24 w-24">
        <AvatarImage src="https://github.com/shadcn.png" alt="Extra Large" />
        <AvatarFallback className="text-2xl">XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * Avatar with online status indicator (Ozean Licht turquoise)
 */
export const WithOnlineStatus: Story = {
  render: () => (
    <div className="relative">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@online-user" />
        <AvatarFallback>OU</AvatarFallback>
      </Avatar>
      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-[#0ec2bc] ring-2 ring-white" />
    </div>
  ),
};

/**
 * Avatar with offline status indicator
 */
export const WithOfflineStatus: Story = {
  render: () => (
    <div className="relative">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@offline-user" />
        <AvatarFallback>OF</AvatarFallback>
      </Avatar>
      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-gray-400 ring-2 ring-white" />
    </div>
  ),
};

/**
 * Avatar with away status indicator
 */
export const WithAwayStatus: Story = {
  render: () => (
    <div className="relative">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@away-user" />
        <AvatarFallback>AW</AvatarFallback>
      </Avatar>
      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-yellow-400 ring-2 ring-white" />
    </div>
  ),
};

/**
 * Avatar with busy/do not disturb status
 */
export const WithBusyStatus: Story = {
  render: () => (
    <div className="relative">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@busy-user" />
        <AvatarFallback>BS</AvatarFallback>
      </Avatar>
      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
    </div>
  ),
};

/**
 * Avatar group (multiple avatars)
 */
export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-4">
      <Avatar className="border-2 border-white">
        <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white">
        <AvatarImage src="https://github.com/vercel.png" alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white">
        <AvatarFallback className="bg-[#0ec2bc] text-white">U3</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white">
        <AvatarFallback>U4</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white bg-muted">
        <AvatarFallback className="text-xs">+5</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * Avatar with badge notification
 */
export const WithBadge: Story = {
  render: () => (
    <div className="relative">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@user-with-notifications" />
        <AvatarFallback>UN</AvatarFallback>
      </Avatar>
      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
        3
      </span>
    </div>
  ),
};

/**
 * Avatar with verified badge
 */
export const WithVerifiedBadge: Story = {
  render: () => (
    <div className="relative">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@verified-user" />
        <AvatarFallback>VU</AvatarFallback>
      </Avatar>
      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0ec2bc] text-white ring-2 ring-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-3 w-3"
        >
          <path
            fillRule="evenodd"
            d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  ),
};

/**
 * Avatar with name label
 */
export const WithName: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@username" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">John Doe</span>
        <span className="text-xs text-muted-foreground">@johndoe</span>
      </div>
    </div>
  ),
};

/**
 * Avatar with name and status
 */
export const WithNameAndStatus: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@username" />
          <AvatarFallback>OL</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-[#0ec2bc] ring-2 ring-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">Ozean Licht</span>
        <span className="text-xs text-[#0ec2bc]">Online</span>
      </div>
    </div>
  ),
};

/**
 * Avatar in a user card
 */
export const UserCard: Story = {
  render: () => (
    <div className="w-[300px] rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://github.com/shadcn.png" alt="@profile-user" />
            <AvatarFallback className="text-lg">PU</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-[#0ec2bc] ring-2 ring-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Profile User</h3>
          <p className="text-sm text-muted-foreground">@profileuser</p>
          <p className="mt-2 text-sm">
            Passionate about education and technology. Building the future of learning.
          </p>
          <div className="mt-3 flex gap-4 text-sm">
            <span><strong>123</strong> Following</span>
            <span><strong>456</strong> Followers</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Avatar in a comment
 */
export const Comment: Story = {
  render: () => (
    <div className="w-[400px] rounded-lg border border-border bg-card p-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://github.com/shadcn.png" alt="@commenter" />
          <AvatarFallback>CM</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Commenter Name</span>
            <span className="text-xs text-muted-foreground">2 hours ago</span>
          </div>
          <p className="mt-1 text-sm">
            This is a great example of how to use avatars in comment sections.
            The design is clean and the implementation is straightforward.
          </p>
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
            <button className="hover:text-foreground">Reply</button>
            <button className="hover:text-foreground">Like</button>
            <button className="hover:text-foreground">Share</button>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Avatar in a list
 */
export const UserList: Story = {
  render: () => (
    <div className="w-[350px] space-y-3 rounded-lg border border-border bg-card p-4">
      <h3 className="font-semibold mb-4">Team Members</h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@member1" />
            <AvatarFallback>M1</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Member One</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
        <span className="text-xs text-[#0ec2bc]">Active</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-[#0ec2bc] text-white">M2</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Member Two</p>
            <p className="text-xs text-muted-foreground">Editor</p>
          </div>
        </div>
        <span className="text-xs text-yellow-600">Away</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" alt="@member3" />
            <AvatarFallback>M3</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Member Three</p>
            <p className="text-xs text-muted-foreground">Viewer</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">Offline</span>
      </div>
    </div>
  ),
};

/**
 * All avatar variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold">With Image</h3>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="With image" />
          <AvatarFallback>WI</AvatarFallback>
        </Avatar>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Fallback Only</h3>
        <Avatar>
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Custom Background</h3>
        <Avatar>
          <AvatarFallback className="bg-[#0ec2bc] text-white">CB</AvatarFallback>
        </Avatar>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">With Status</h3>
        <div className="flex gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Online" />
              <AvatarFallback>ON</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-[#0ec2bc] ring-2 ring-white" />
          </div>

          <div className="relative">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Away" />
              <AvatarFallback>AW</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-yellow-400 ring-2 ring-white" />
          </div>

          <div className="relative">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Busy" />
              <AvatarFallback>BS</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
          </div>

          <div className="relative">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Offline" />
              <AvatarFallback>OF</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-gray-400 ring-2 ring-white" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">With Badge</h3>
        <div className="flex gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Notifications" />
              <AvatarFallback>NT</AvatarFallback>
            </Avatar>
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              9
            </span>
          </div>

          <div className="relative">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Verified" />
              <AvatarFallback>VF</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0ec2bc] text-white ring-2 ring-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3 w-3"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Sizes</h3>
        <div className="flex items-end gap-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src="https://github.com/shadcn.png" alt="XS" />
            <AvatarFallback className="text-[10px]">XS</AvatarFallback>
          </Avatar>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="SM" />
            <AvatarFallback className="text-xs">SM</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="MD" />
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://github.com/shadcn.png" alt="LG" />
            <AvatarFallback className="text-lg">LG</AvatarFallback>
          </Avatar>
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://github.com/shadcn.png" alt="XL" />
            <AvatarFallback className="text-xl">XL</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  ),
};
