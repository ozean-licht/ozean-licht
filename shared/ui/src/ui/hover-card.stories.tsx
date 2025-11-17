import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from './hover-card';
import { Button } from '../components/Button';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

/**
 * HoverCard primitive component built on Radix UI HoverCard.
 *
 * **This is a Tier 1 Primitive** - unstyled Radix UI component with minimal default styling.
 * No Tier 2 branded version exists for this component.
 *
 * ## Radix UI HoverCard Features
 * - **Accessible**: Proper ARIA attributes, keyboard navigation support
 * - **Smart Timing**: Configurable open/close delays for optimal UX
 * - **Positioning**: Smart positioning with collision detection
 * - **Touch Support**: Gracefully handles touch devices
 * - **Hover Intent**: Only opens when user intends to hover (reduces accidental triggers)
 * - **Portal Rendering**: Renders outside DOM hierarchy to avoid z-index issues
 *
 * ## Use Cases
 * - **User Profiles**: Show rich user information on hover
 * - **Link Previews**: Display preview content for links
 * - **Rich Tooltips**: Enhanced tooltips with interactive content
 * - **Data Cards**: Show detailed information for list items
 * - **Image Previews**: Display larger versions or metadata
 *
 * ## Component Structure
 * ```tsx
 * <HoverCard> // Root - manages hover state and timing
 *   <HoverCardTrigger> // Element that triggers the card
 *     Hover over me
 *   </HoverCardTrigger>
 *   <HoverCardContent> // Content shown on hover
 *     Rich content here
 *   </HoverCardContent>
 * </HoverCard>
 * ```
 *
 * ## Accessibility Notes
 * - Content is keyboard accessible (focus trigger, then press Space or Enter)
 * - Screen reader friendly with proper ARIA attributes
 * - Respects prefers-reduced-motion for animations
 * - Touch devices can tap to toggle (not just hover)
 *
 * ## HoverCard vs Tooltip
 * - **HoverCard**: Rich content, interactive elements, longer form information
 * - **Tooltip**: Simple text labels, non-interactive, brief descriptions
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'For sighted users to preview content available behind a link. Built on Radix UI HoverCard primitive.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default hover card with user profile.
 *
 * The most common use case - showing user profile information on hover.
 * Hover over the username to see the profile card.
 */
export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

/**
 * Link preview hover card.
 *
 * Shows a preview of link content similar to social media link cards.
 * Useful for external links or article previews.
 */
export const LinkPreview: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Check out this article:
      </p>
      <HoverCard>
        <HoverCardTrigger asChild>
          <a
            href="https://ui.shadcn.com"
            className="text-blue-600 hover:underline cursor-pointer"
          >
            shadcn/ui Documentation
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">shadcn/ui</h4>
            <p className="text-sm">
              Beautifully designed components built with Radix UI and Tailwind CSS.
              Accessible and customizable components that you can copy and paste
              into your apps.
            </p>
            <div className="flex items-center pt-2 text-xs text-muted-foreground">
              <span>ui.shadcn.com</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

/**
 * Rich user profile with avatar and stats.
 *
 * Comprehensive user profile card with avatar, bio, and statistics.
 * Perfect for social applications or team directories.
 */
export const WithAvatarAndDetails: Story = {
  render: () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Hover over any user to see their profile:
      </p>
      <div className="flex gap-4">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="text-base">
              @sarah_dev
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-3">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback style={{ backgroundColor: '#0ec2bc', color: 'white' }}>
                    SD
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-semibold">Sarah Developer</h4>
                  <p className="text-sm text-muted-foreground">@sarah_dev</p>
                </div>
              </div>
              <p className="text-sm">
                Full-stack developer passionate about React, TypeScript, and building
                accessible user interfaces. Currently working on design systems.
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="font-semibold text-foreground">234</span> Following
                </div>
                <div>
                  <span className="font-semibold text-foreground">1.2k</span> Followers
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="text-base">
              @alex_design
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-3">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback style={{ backgroundColor: '#6366f1', color: 'white' }}>
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-semibold">Alex Designer</h4>
                  <p className="text-sm text-muted-foreground">@alex_design</p>
                </div>
              </div>
              <p className="text-sm">
                UI/UX designer focused on creating beautiful, intuitive experiences.
                Love working with designers and developers to build great products.
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="font-semibold text-foreground">892</span> Following
                </div>
                <div>
                  <span className="font-semibold text-foreground">3.4k</span> Followers
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  ),
};

/**
 * Multiple hover cards in a list.
 *
 * Demonstrates hover cards in a practical list scenario.
 * Each item shows detailed information on hover.
 */
export const MultipleHoverCards: Story = {
  render: () => (
    <div className="space-y-2 w-96">
      <h3 className="text-sm font-semibold mb-4">Team Members</h3>
      <div className="space-y-1">
        {[
          {
            name: 'Emma Wilson',
            username: 'emma_w',
            role: 'Product Manager',
            initials: 'EW',
            color: '#0ec2bc',
          },
          {
            name: 'James Chen',
            username: 'jchen',
            role: 'Senior Engineer',
            initials: 'JC',
            color: '#f59e0b',
          },
          {
            name: 'Maria Garcia',
            username: 'mgarcia',
            role: 'UX Designer',
            initials: 'MG',
            color: '#ec4899',
          },
          {
            name: 'David Kim',
            username: 'dkim',
            role: 'DevOps Lead',
            initials: 'DK',
            color: '#8b5cf6',
          },
        ].map((member) => (
          <div
            key={member.username}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="flex items-center gap-2 text-left">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      style={{ backgroundColor: member.color, color: 'white' }}
                    >
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback
                        style={{ backgroundColor: member.color, color: 'white' }}
                      >
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">@{member.username}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    Contact: {member.username}@company.com
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">
                      View Profile
                    </Button>
                    <Button size="sm" style={{ backgroundColor: member.color, color: 'white' }}>
                      Message
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        ))}
      </div>
    </div>
  ),
};

/**
 * Controlled open state.
 *
 * Shows how to control the hover card state programmatically using `open` and `onOpenChange` props.
 * Useful for programmatic control or analytics tracking.
 */
export const ControlledState: Story = {
  render: () => {
    const ControlledHoverCard = () => {
      const [open, setOpen] = useState(false);

      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)} size="sm">
              Open HoverCard
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} size="sm">
              Close HoverCard
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            HoverCard is currently: <strong>{open ? 'Open' : 'Closed'}</strong>
          </p>
          <HoverCard open={open} onOpenChange={setOpen}>
            <HoverCardTrigger asChild>
              <Button variant="link">@controlled_user</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarFallback style={{ backgroundColor: '#0ec2bc', color: 'white' }}>
                    CU
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Controlled User</h4>
                  <p className="text-sm">
                    This hover card's state is controlled externally.
                    You can open/close it programmatically or by hovering.
                  </p>
                  <div className="flex items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      onOpenChange fires when state changes
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      );
    };

    return <ControlledHoverCard />;
  },
};

/**
 * Custom positioning.
 *
 * Demonstrates different positioning options using the `side` and `align` props.
 * Content can be positioned on any side with different alignments.
 */
export const CustomPositioning: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-12">
      {/* Top positioning */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground mb-2">Top (default center align)</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline">Hover (Top)</Button>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="w-64">
            <p className="text-sm">Content positioned on top</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Right positioning */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground mb-2">Right (align start)</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline">Hover (Right)</Button>
          </HoverCardTrigger>
          <HoverCardContent side="right" align="start" className="w-64">
            <p className="text-sm">Content positioned on right, aligned to start</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Bottom positioning */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground mb-2">Bottom (align end)</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline">Hover (Bottom)</Button>
          </HoverCardTrigger>
          <HoverCardContent side="bottom" align="end" className="w-64">
            <p className="text-sm">Content positioned on bottom, aligned to end</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Left positioning */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground mb-2">Left (default center align)</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline">Hover (Left)</Button>
          </HoverCardTrigger>
          <HoverCardContent side="left" className="w-64">
            <p className="text-sm">Content positioned on left</p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  ),
};

/**
 * Custom timing and delays.
 *
 * HoverCard supports custom open and close delays for better UX.
 * This shows how to configure timing behavior.
 */
export const CustomTiming: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Instant open (0ms delay)</p>
        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild>
            <Button variant="outline">Instant</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <p className="text-sm">Opens immediately on hover (0ms delay)</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Default timing (700ms delay)</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline">Default</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <p className="text-sm">Opens after default 700ms hover delay</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Long delay (1500ms)</p>
        <HoverCard openDelay={1500}>
          <HoverCardTrigger asChild>
            <Button variant="outline">Long Delay</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <p className="text-sm">Opens after 1500ms (1.5 second) delay</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Quick close (0ms close delay)</p>
        <HoverCard closeDelay={0}>
          <HoverCardTrigger asChild>
            <Button variant="outline">Quick Close</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <p className="text-sm">Closes immediately when you stop hovering (0ms close delay)</p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  ),
};

/**
 * Product card example.
 *
 * Real-world example showing product information on hover.
 * Useful for e-commerce or catalog applications.
 */
export const ProductCard: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <h3 className="text-sm font-semibold mb-4">Product Catalog</h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            name: 'Wireless Headphones',
            price: '$129.99',
            rating: '4.5',
            description: 'Premium noise-canceling wireless headphones with 30-hour battery life.',
          },
          {
            name: 'Smart Watch',
            price: '$299.99',
            rating: '4.8',
            description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
          },
          {
            name: 'Laptop Stand',
            price: '$49.99',
            rating: '4.6',
            description: 'Ergonomic aluminum stand with adjustable height and angle.',
          },
          {
            name: 'Mechanical Keyboard',
            price: '$159.99',
            rating: '4.9',
            description: 'RGB backlit mechanical keyboard with customizable keys.',
          },
        ].map((product, index) => (
          <HoverCard key={index}>
            <HoverCardTrigger asChild>
              <div className="border rounded-lg p-3 cursor-pointer hover:border-gray-400 transition-colors">
                <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center text-xs text-gray-400">
                  Image
                </div>
                <h4 className="text-sm font-medium">{product.name}</h4>
                <p className="text-sm font-semibold" style={{ color: '#0ec2bc' }}>
                  {product.price}
                </p>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{product.name}</h4>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-yellow-500">★★★★★</span>
                  <span className="text-muted-foreground">(256 reviews)</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-bold" style={{ color: '#0ec2bc' }}>
                    {product.price}
                  </span>
                  <Button size="sm" style={{ backgroundColor: '#0ec2bc', color: 'white' }}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  ),
};

/**
 * Interactive content.
 *
 * HoverCard can contain interactive elements like buttons, links, and forms.
 * The card stays open when you hover over its content.
 */
export const InteractiveContent: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Hover over the user to see interactive profile card:
      </p>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" className="text-base">
            @interactive_user
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-4">
            <div className="flex gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback style={{ backgroundColor: '#0ec2bc', color: 'white' }}>
                  IU
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-semibold">Interactive User</h4>
                <p className="text-sm text-muted-foreground">@interactive_user</p>
              </div>
            </div>
            <p className="text-sm">
              Full-stack developer with a passion for creating interactive user experiences.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                style={{ backgroundColor: '#0ec2bc', color: 'white' }}
                onClick={() => alert('Following user!')}
              >
                Follow
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => alert('Viewing profile!')}
              >
                View Profile
              </Button>
            </div>
            <div className="pt-2 border-t text-xs text-muted-foreground">
              Click the buttons above - card stays open!
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

/**
 * Repository preview.
 *
 * GitHub-style repository preview on hover.
 * Shows metadata and quick actions.
 */
export const RepositoryPreview: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <h3 className="text-sm font-semibold mb-4">Popular Repositories</h3>
      <div className="space-y-2">
        {[
          {
            name: 'shadcn/ui',
            description: 'Beautifully designed components built with Radix UI and Tailwind CSS.',
            stars: '42.5k',
            language: 'TypeScript',
            languageColor: '#3178c6',
          },
          {
            name: 'vercel/next.js',
            description: 'The React Framework for Production',
            stars: '115k',
            language: 'JavaScript',
            languageColor: '#f1e05a',
          },
          {
            name: 'facebook/react',
            description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
            stars: '215k',
            language: 'JavaScript',
            languageColor: '#f1e05a',
          },
        ].map((repo, index) => (
          <HoverCard key={index}>
            <HoverCardTrigger asChild>
              <div className="border rounded-lg p-3 cursor-pointer hover:border-gray-400 transition-colors">
                <h4 className="text-sm font-semibold text-blue-600">{repo.name}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {repo.description}
                </p>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold">{repo.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {repo.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: repo.languageColor }}
                    />
                    {repo.language}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⭐</span>
                    {repo.stars}
                  </div>
                  <div>MIT license</div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Repo
                  </Button>
                  <Button
                    size="sm"
                    style={{ backgroundColor: '#0ec2bc', color: 'white' }}
                    className="flex-1"
                  >
                    Star
                  </Button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  ),
};

/**
 * Ozean Licht themed examples.
 *
 * Multiple hover cards showcasing the Ozean Licht turquoise color (#0ec2bc).
 * Demonstrates how to apply brand colors to hover card components.
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Turquoise accent hover card</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant="outline"
              style={{ borderColor: '#0ec2bc', color: '#0ec2bc' }}
            >
              Hover for info
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80" style={{ borderColor: '#0ec2bc' }}>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold" style={{ color: '#0ec2bc' }}>
                Ozean Licht Design System
              </h4>
              <p className="text-sm text-muted-foreground">
                Built with Radix UI primitives and styled with the Ozean Licht
                turquoise accent color (#0ec2bc).
              </p>
              <div className="pt-2">
                <Button size="sm" style={{ backgroundColor: '#0ec2bc', color: 'white' }}>
                  Learn More
                </Button>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Team member with turquoise avatar</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" style={{ color: '#0ec2bc' }}>
              @ozean_team
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback style={{ backgroundColor: '#0ec2bc', color: 'white' }}>
                  OL
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <div>
                  <h4 className="text-sm font-semibold">Ozean Licht Team</h4>
                  <p className="text-sm text-muted-foreground">@ozean_team</p>
                </div>
                <p className="text-sm">
                  Building modern web applications with beautiful design and
                  accessible components.
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    style={{ backgroundColor: '#0ec2bc', color: 'white' }}
                  >
                    Follow
                  </Button>
                  <Button size="sm" variant="outline">
                    Visit Site
                  </Button>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  ),
};

/**
 * Interactive test with play function.
 *
 * Tests hover card interactions using Storybook play function.
 * Validates keyboard and mouse interactions.
 */
export const InteractiveTest: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline" data-testid="hover-trigger">
          Hover or Focus Me
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" data-testid="hover-content">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Test HoverCard</h4>
          <p className="text-sm text-muted-foreground">
            This hover card tests both mouse hover and keyboard focus interactions.
          </p>
          <Button
            size="sm"
            data-testid="interactive-button"
            style={{ backgroundColor: '#0ec2bc', color: 'white' }}
          >
            Interactive Button
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Get trigger element
    const trigger = canvas.getByTestId('hover-trigger');

    // Hover over trigger
    await userEvent.hover(trigger);

    // Wait for hover delay and animation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Content should be visible in the document body
    const body = within(document.body);
    const content = body.getByTestId('hover-content');
    await expect(content).toBeInTheDocument();

    // Test keyboard navigation - trigger should be focusable
    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    // Unhover to close
    await userEvent.unhover(trigger);

    // Wait for close delay and animation
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};
