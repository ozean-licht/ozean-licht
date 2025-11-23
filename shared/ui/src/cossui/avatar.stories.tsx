import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Tier 1: Primitives/CossUI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Avatar component from Coss UI adapted for Ozean Licht design system. Displays user profile images with fallback initials. Features glass morphism effects, glow animations, and Radix UI accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size variant of the avatar (sm: 32px, default: 40px, lg: 48px)',
    },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

/**
 * Default avatar with profile image
 * Shows the standard 40px avatar with image and primary color glow
 */
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User avatar" />
      <AvatarFallback>FX</AvatarFallback>
    </Avatar>
  ),
}

/**
 * Small avatar size - 32px
 * Used in compact layouts like comment threads or notification lists
 */
export const Small: Story = {
  args: {
    size: 'sm',
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Small avatar" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
}

/**
 * Large avatar size - 48px
 * Used in profile pages or hero sections with prominent user display
 */
export const Large: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan" alt="Large avatar" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
}

/**
 * Avatar with fallback initials (no image)
 * Shows gradient background with white initials when image is unavailable
 */
export const FallbackInitials: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>SK</AvatarFallback>
    </Avatar>
  ),
}

/**
 * Fallback with single character
 * Shows how single character initials are displayed
 */
export const FallbackSingleChar: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>M</AvatarFallback>
    </Avatar>
  ),
}

/**
 * Fallback with three characters
 * Shows how longer initials or text is displayed
 */
export const FallbackThreeChars: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>ABC</AvatarFallback>
    </Avatar>
  ),
}

/**
 * Broken image handling
 * Avatar gracefully falls back to initials when image fails to load
 */
export const BrokenImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://invalid-url-that-does-not-exist.example.com/avatar.png" alt="User avatar" />
      <AvatarFallback>BR</AvatarFallback>
    </Avatar>
  ),
}

/**
 * Loading state simulation
 * Shows avatar while image is loading (fallback visible)
 */
export const LoadingState: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Loading" alt="Loading avatar" />
      <AvatarFallback>LD</AvatarFallback>
    </Avatar>
  ),
}

/**
 * All size variants displayed together
 * Comparison of small, default, and large sizes
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Avatar size="sm">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Small" alt="Small" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <p className="text-xs text-[#C4C8D4]">Small (32px)</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="default">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Medium" alt="Medium" />
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <p className="text-xs text-[#C4C8D4]">Default (40px)</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Large" alt="Large" />
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <p className="text-xs text-[#C4C8D4]">Large (48px)</p>
      </div>
    </div>
  ),
}

/**
 * User profile card example
 * Shows avatar in context of a user profile with name and status
 */
export const UserProfile: Story = {
  render: () => (
    <div className="w-64 rounded-lg border border-border bg-card/50 backdrop-blur-8 p-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar size="lg">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=UserProfile" alt="Profile" />
          <AvatarFallback>UP</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="text-sm font-alt font-semibold text-white mb-1">Sarah Anderson</h3>
          <p className="text-xs text-[#C4C8D4] mb-3">Product Designer</p>
          <div className="flex items-center justify-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-xs text-[#C4C8D4]">Online</span>
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Team member grid
 * Multiple avatars in a grid layout for team display
 */
export const TeamMemberGrid: Story = {
  render: () => (
    <div className="w-96 rounded-lg border border-border bg-card/50 backdrop-blur-8 p-6">
      <h3 className="text-sm font-alt font-semibold text-white mb-4">Team Members</h3>
      <div className="grid grid-cols-4 gap-4">
        {[
          { name: 'Sarah', seed: 'sarah', fallback: 'SA' },
          { name: 'Michael', seed: 'michael', fallback: 'MK' },
          { name: 'Emma', seed: 'emma', fallback: 'EM' },
          { name: 'David', seed: 'david', fallback: 'DV' },
          { name: 'Lisa', seed: 'lisa', fallback: 'LS' },
          { name: 'James', seed: 'james', fallback: 'JM' },
          { name: 'Rachel', seed: 'rachel', fallback: 'RC' },
          { name: 'Thomas', seed: 'thomas', fallback: 'TM' },
        ].map((member) => (
          <div key={member.seed} className="flex flex-col items-center gap-2">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.seed}`}
                alt={member.name}
              />
              <AvatarFallback>{member.fallback}</AvatarFallback>
            </Avatar>
            <p className="text-xs text-[#C4C8D4] text-center">{member.name}</p>
          </div>
        ))}
      </div>
    </div>
  ),
}

/**
 * Comment section with avatars
 * Shows avatars in context of user comments and replies
 */
export const CommentSection: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      {[
        {
          name: 'John Smith',
          fallback: 'JS',
          seed: 'john-smith',
          comment: 'This is a great implementation!',
          time: '2 hours ago',
        },
        {
          name: 'Emily Johnson',
          fallback: 'EJ',
          seed: 'emily-johnson',
          comment: 'I love the glass morphism effects. Really polished!',
          time: '1 hour ago',
        },
        {
          name: 'Alex Chen',
          fallback: 'AC',
          seed: 'alex-chen',
          comment: 'How does this perform on mobile devices?',
          time: '30 minutes ago',
        },
      ].map((item) => (
        <div
          key={item.seed}
          className="flex gap-3 rounded-lg border border-border bg-card/50 backdrop-blur-8 p-4"
        >
          <Avatar size="sm">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.seed}`}
              alt={item.name}
            />
            <AvatarFallback>{item.fallback}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-alt font-semibold text-white">{item.name}</p>
              <span className="text-xs text-[#C4C8D4]">{item.time}</span>
            </div>
            <p className="text-sm text-[#C4C8D4]">{item.comment}</p>
          </div>
        </div>
      ))}
    </div>
  ),
}

/**
 * Navigation bar with user menu
 * Avatar in header navigation showing current user
 */
export const NavigationBar: Story = {
  render: () => (
    <div className="w-full border-b border-border bg-card/50 backdrop-blur-8">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="text-sm font-alt font-semibold text-white">Admin Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xs text-[#C4C8D4] hover:text-white transition-colors">
            Help
          </button>
          <button className="text-xs text-[#C4C8D4] hover:text-white transition-colors">
            Settings
          </button>
          <div className="h-6 w-px bg-border"></div>
          <div className="flex items-center gap-2 cursor-pointer group">
            <Avatar size="sm">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin-user" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className="text-xs text-[#C4C8D4] group-hover:text-white transition-colors">
              Admin User
            </span>
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Settings page with user avatar
 * Avatar in user settings/profile management context
 */
export const SettingsPage: Story = {
  render: () => (
    <div className="w-full max-w-2xl rounded-lg border border-border bg-card/50 backdrop-blur-8 p-6">
      <h2 className="text-lg font-alt font-semibold text-white mb-6">Account Settings</h2>
      <div className="space-y-6">
        <div className="flex items-start gap-6">
          <Avatar size="lg">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=settings-user" alt="User" />
            <AvatarFallback>SU</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider mb-1">
                Profile Picture
              </p>
              <p className="text-sm text-[#C4C8D4] mb-3">
                JPG, GIF or PNG. Max 5MB. Recommended size: 400x400px
              </p>
              <button className="text-xs bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded transition-colors">
                Upload New Photo
              </button>
            </div>
          </div>
        </div>
        <div className="h-px bg-border"></div>
        <div>
          <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider mb-2">
            Full Name
          </p>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded text-white placeholder-[#C4C8D4] focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  ),
}

/**
 * Avatar group/stacked display
 * Multiple avatars overlapping for group representation
 */
export const AvatarGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Avatar Group (Default Size)
        </p>
        <div className="flex items-center">
          {[
            { seed: 'group-1', fallback: 'G1' },
            { seed: 'group-2', fallback: 'G2' },
            { seed: 'group-3', fallback: 'G3' },
            { seed: 'group-4', fallback: 'G4' },
          ].map((item, index) => (
            <div key={item.seed} style={{ marginLeft: index > 0 ? '-12px' : '0' }} className="relative z-0">
              <div className="ring-2 ring-card">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.seed}`}
                    alt={item.fallback}
                  />
                  <AvatarFallback>{item.fallback}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          ))}
          <span className="ml-2 text-xs text-[#C4C8D4]">+12 more</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Avatar Group (Small Size)
        </p>
        <div className="flex items-center">
          {[
            { seed: 'group-s1', fallback: 'S1' },
            { seed: 'group-s2', fallback: 'S2' },
            { seed: 'group-s3', fallback: 'S3' },
          ].map((item, index) => (
            <div key={item.seed} style={{ marginLeft: index > 0 ? '-8px' : '0' }} className="relative z-0">
              <div className="ring-2 ring-card">
                <Avatar size="sm">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.seed}`}
                    alt={item.fallback}
                  />
                  <AvatarFallback>{item.fallback}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          ))}
          <span className="ml-2 text-xs text-[#C4C8D4]">+8 more</span>
        </div>
      </div>
    </div>
  ),
}

/**
 * With different fallback styles
 * Shows various initials patterns and text lengths
 */
export const FallbackVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Common Initials (2 characters)
        </p>
        <div className="flex flex-wrap gap-4">
          {[
            { initials: 'JD', name: 'John Doe' },
            { initials: 'SM', name: 'Sarah Miller' },
            { initials: 'BC', name: 'Brian Chen' },
            { initials: 'EJ', name: 'Emily Jones' },
            { initials: 'MK', name: 'Michael Kim' },
            { initials: 'LP', name: 'Lisa Park' },
          ].map((item) => (
            <div key={item.initials} className="flex flex-col items-center gap-2">
              <Avatar>
                <AvatarFallback>{item.initials}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-[#C4C8D4]">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Single Character Fallback
        </p>
        <div className="flex flex-wrap gap-4">
          {['J', 'S', 'B', 'E', 'M', 'L'].map((char) => (
            <div key={char} className="flex flex-col items-center gap-2">
              <Avatar>
                <AvatarFallback>{char}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-[#C4C8D4]">User {char}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Three Character Initials
        </p>
        <div className="flex flex-wrap gap-4">
          {[
            { initials: 'JDC', name: 'John D. Chen' },
            { initials: 'SMK', name: 'Sarah M. Kim' },
            { initials: 'BRP', name: 'Brian R. Park' },
          ].map((item) => (
            <div key={item.initials} className="flex flex-col items-center gap-2">
              <Avatar>
                <AvatarFallback>{item.initials}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-[#C4C8D4] text-center">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

/**
 * Glass morphism effects
 * Shows avatar with glass effect background and visual hierarchy
 */
export const GlassMorphismEffects: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider mb-3">
          Avatar on Gradient Background
        </p>
        <div className="p-8 rounded-lg bg-gradient-to-br from-background via-[#055D75]/20 to-primary/10 border border-primary/20">
          <div className="flex justify-center">
            <Avatar size="lg">
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=glass-effect"
                alt="Glass effect"
              />
              <AvatarFallback>GE</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider mb-3">
          Avatar in Card with Glow
        </p>
        <div className="rounded-lg border border-primary/50 bg-card/50 backdrop-blur-8 p-8 shadow-lg shadow-primary/20">
          <div className="flex justify-center">
            <Avatar size="lg">
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=glow-effect"
                alt="Glow effect"
              />
              <AvatarFallback>GL</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider mb-3">
          Multiple Avatars with Hover Effect
        </p>
        <div className="flex justify-center gap-6">
          {[
            { seed: 'hover-1', fallback: 'H1' },
            { seed: 'hover-2', fallback: 'H2' },
            { seed: 'hover-3', fallback: 'H3' },
          ].map((item) => (
            <div
              key={item.seed}
              className="transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30"
            >
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.seed}`}
                  alt={item.fallback}
                />
                <AvatarFallback>{item.fallback}</AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

/**
 * Accessibility features
 * Demonstrates proper alt text and focus states for keyboard navigation
 */
export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          With Proper Alt Text
        </p>
        <div className="flex flex-wrap gap-4">
          <Avatar>
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=a11y-user1"
              alt="Profile picture of Sarah Anderson, Product Designer"
            />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=a11y-user2"
              alt="Profile picture of Michael Chen, Frontend Engineer"
            />
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Focus Visible State (Tab to Focus)
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="focus:outline-none rounded-full" tabIndex={0}>
            <Avatar>
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=focus-1"
                alt="Focusable avatar - User 1"
              />
              <AvatarFallback>F1</AvatarFallback>
            </Avatar>
          </button>
          <button className="focus:outline-none rounded-full" tabIndex={0}>
            <Avatar>
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=focus-2"
                alt="Focusable avatar - User 2"
              />
              <AvatarFallback>F2</AvatarFallback>
            </Avatar>
          </button>
        </div>
        <p className="text-xs text-[#C4C8D4] italic">
          Try pressing Tab to navigate to avatars. They display focus-visible ring when focused.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          High Contrast Fallback
        </p>
        <div className="flex flex-wrap gap-4">
          <Avatar>
            <AvatarFallback>HC1</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>HC2</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>HC3</AvatarFallback>
          </Avatar>
        </div>
        <p className="text-xs text-[#C4C8D4]">
          Fallback initials have WCAG AAA contrast ratio with primary gradient background.
        </p>
      </div>
    </div>
  ),
}

/**
 * Real-world usage - notification badge
 * Avatar with indicator for notifications or status
 */
export const WithNotificationBadge: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          With Status Indicator
        </p>
        <div className="flex flex-wrap gap-8">
          {[
            { status: 'Online', statusColor: 'bg-green-500', seed: 'online' },
            { status: 'Away', statusColor: 'bg-yellow-500', seed: 'away' },
            { status: 'Offline', statusColor: 'bg-gray-500', seed: 'offline' },
            { status: 'In Meeting', statusColor: 'bg-red-500', seed: 'meeting' },
          ].map((item) => (
            <div key={item.status} className="flex flex-col items-center gap-2">
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.seed}`}
                    alt={item.status}
                  />
                  <AvatarFallback>{item.status[0]}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 inline-block h-3 w-3 rounded-full border-2 border-card ${item.statusColor}`}
                ></span>
              </div>
              <p className="text-xs text-[#C4C8D4]">{item.status}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          With Notification Count
        </p>
        <div className="flex flex-wrap gap-8">
          {[
            { count: '3', seed: 'notif-3' },
            { count: '12', seed: 'notif-12' },
            { count: '99+', seed: 'notif-99' },
          ].map((item) => (
            <div key={item.seed} className="flex flex-col items-center gap-2">
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.seed}`}
                    alt={`${item.count} notifications`}
                  />
                  <AvatarFallback>N{item.count[0]}</AvatarFallback>
                </Avatar>
                <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-semibold text-white">
                  {item.count}
                </span>
              </div>
              <p className="text-xs text-[#C4C8D4]">{item.count} messages</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

/**
 * Real-world usage - user list/directory
 * Multiple avatars in a directory or member list context
 */
export const UserDirectory: Story = {
  render: () => (
    <div className="w-full max-w-2xl rounded-lg border border-border bg-card/50 backdrop-blur-8 p-6">
      <h3 className="text-sm font-alt font-semibold text-white mb-4">Team Directory</h3>
      <div className="space-y-3">
        {[
          {
            name: 'Sarah Anderson',
            role: 'Product Designer',
            status: 'online',
            seed: 'dir-sarah',
            fallback: 'SA',
          },
          {
            name: 'Michael Chen',
            role: 'Frontend Engineer',
            status: 'away',
            seed: 'dir-michael',
            fallback: 'MC',
          },
          {
            name: 'Emma Wilson',
            role: 'Backend Engineer',
            status: 'offline',
            seed: 'dir-emma',
            fallback: 'EW',
          },
          {
            name: 'David Kumar',
            role: 'Product Manager',
            status: 'online',
            seed: 'dir-david',
            fallback: 'DK',
          },
        ].map((user) => (
          <div
            key={user.seed}
            className="flex items-center gap-3 p-3 rounded hover:bg-primary/5 transition-colors cursor-pointer"
          >
            <div className="relative">
              <Avatar size="sm">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.seed}`}
                  alt={user.name}
                />
                <AvatarFallback>{user.fallback}</AvatarFallback>
              </Avatar>
              {user.status === 'online' && (
                <span className="absolute bottom-0 right-0 inline-block h-2 w-2 rounded-full bg-green-500 border border-card"></span>
              )}
              {user.status === 'away' && (
                <span className="absolute bottom-0 right-0 inline-block h-2 w-2 rounded-full bg-yellow-500 border border-card"></span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-alt font-semibold text-white">{user.name}</p>
              <p className="text-xs text-[#C4C8D4]">{user.role}</p>
            </div>
            <span className="text-xs text-[#C4C8D4] capitalize">{user.status}</span>
          </div>
        ))}
      </div>
    </div>
  ),
}

/**
 * Mixed images and fallbacks
 * Real-world scenario with some images loading and others showing fallbacks
 */
export const MixedContent: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <h3 className="text-sm font-alt font-semibold text-white mb-4">
        Recent Activity - Mixed Avatar States
      </h3>
      {[
        {
          hasImage: true,
          name: 'John Doe',
          fallback: 'JD',
          action: 'uploaded a new file',
          time: '2 hours ago',
          seed: 'activity-john',
        },
        {
          hasImage: false,
          name: 'Sarah Smith',
          fallback: 'SS',
          action: 'commented on the design',
          time: '1 hour ago',
          seed: 'activity-sarah',
        },
        {
          hasImage: true,
          name: 'Michael Brown',
          fallback: 'MB',
          action: 'approved the pull request',
          time: '30 minutes ago',
          seed: 'activity-michael',
        },
        {
          hasImage: false,
          name: 'Emily Davis',
          fallback: 'ED',
          action: 'assigned a new task to you',
          time: '15 minutes ago',
          seed: 'activity-emily',
        },
      ].map((item) => (
        <div
          key={item.seed}
          className="flex gap-3 rounded-lg border border-border bg-card/50 backdrop-blur-8 p-4"
        >
          <Avatar size="sm">
            {item.hasImage && (
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.seed}`}
                alt={item.name}
              />
            )}
            <AvatarFallback>{item.fallback}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm text-[#C4C8D4]">
              <span className="font-alt font-semibold text-white">{item.name}</span> {item.action}
            </p>
            <p className="text-xs text-[#C4C8D4] mt-1">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  ),
}

/**
 * Interactive size controls
 * Demonstrates size variations with interactive control
 */
export const InteractiveDemo: Story = {
  args: {
    size: 'default',
  },
  render: (args) => (
    <div className="flex flex-col items-center gap-6">
      <Avatar {...args}>
        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=interactive" alt="Interactive avatar" />
        <AvatarFallback>ID</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className="text-xs text-[#C4C8D4] mb-2">Select a size from the controls to adjust avatar dimensions</p>
        <p className="text-xs font-alt font-semibold text-white">
          Current Size: {args.size === 'sm' ? '32px' : args.size === 'lg' ? '48px' : '40px'}
        </p>
      </div>
    </div>
  ),
}
