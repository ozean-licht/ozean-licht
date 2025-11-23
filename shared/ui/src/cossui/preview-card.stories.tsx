import type { Meta, StoryObj } from '@storybook/react'
import {
  PreviewCardRoot,
  PreviewCardTrigger,
  PreviewCardContent,
} from './preview-card'
import { Button } from './button'
import { Badge } from './badge'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'

const meta: Meta<typeof PreviewCardRoot> = {
  title: 'Tier 1: Primitives/CossUI/PreviewCard',
  component: PreviewCardRoot,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Preview Card component provides rich content previews on hover. Built with Base UI Popover and Ozean Licht design system with glass morphism effects. Perfect for link previews, user profiles, and content summaries.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PreviewCardRoot>

/**
 * Default Preview Card Story
 * Simple text preview on hover
 */
export const Default: Story = {
  render: () => (
    <div className="p-8">
      <p className="text-sm text-[#C4C8D4] mb-4">
        Hover over the{' '}
        <PreviewCardRoot>
          <PreviewCardTrigger>
            <span className="text-primary underline cursor-pointer">highlighted text</span>
          </PreviewCardTrigger>
          <PreviewCardContent>
            <div className="space-y-2">
              <h4 className="font-decorative text-lg text-white">Preview Card</h4>
              <p className="text-sm text-[#C4C8D4] font-sans font-light">
                This is a preview card that appears when you hover over the trigger. It uses
                glass morphism with strong blur effects for an immersive experience.
              </p>
            </div>
          </PreviewCardContent>
        </PreviewCardRoot>{' '}
        to see the preview.
      </p>
    </div>
  ),
}

/**
 * User Profile Preview Story
 * Shows user information on hover
 */
export const UserProfilePreview: Story = {
  render: () => (
    <div className="p-8 space-y-4">
      <p className="text-sm text-[#C4C8D4]">
        Hover over the user avatar to see their profile preview
      </p>
      <PreviewCardRoot hoverDelay={200}>
        <PreviewCardTrigger>
          <div className="inline-flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition-colors">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="text-sm text-white font-medium">John Doe</span>
          </div>
        </PreviewCardTrigger>
        <PreviewCardContent side="bottom" align="start" width={320}>
          <div className="space-y-3">
            {/* Profile Header */}
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-decorative text-base text-white">John Doe</h4>
                <p className="text-xs text-[#C4C8D4]">@johndoe</p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              Senior Software Engineer passionate about building great user experiences with
              modern web technologies.
            </p>

            {/* Stats */}
            <div className="flex gap-4 text-xs">
              <div>
                <span className="font-medium text-white">1,234</span>
                <span className="text-[#C4C8D4] ml-1">Followers</span>
              </div>
              <div>
                <span className="font-medium text-white">567</span>
                <span className="text-[#C4C8D4] ml-1">Following</span>
              </div>
            </div>

            {/* Action */}
            <Button variant="primary" size="sm" className="w-full">
              View Profile
            </Button>
          </div>
        </PreviewCardContent>
      </PreviewCardRoot>
    </div>
  ),
}

/**
 * Link Preview with Thumbnail Story
 * Shows webpage preview with image
 */
export const LinkPreview: Story = {
  render: () => (
    <div className="p-8 space-y-4">
      <p className="text-sm text-[#C4C8D4]">
        Hover over the link to see a rich preview
      </p>
      <div>
        <PreviewCardRoot hoverDelay={250}>
          <PreviewCardTrigger>
            <a
              href="#"
              className="text-primary underline hover:text-primary/80 transition-colors text-sm"
              onClick={(e) => e.preventDefault()}
            >
              https://ozean-licht.dev/blog/design-systems
            </a>
          </PreviewCardTrigger>
          <PreviewCardContent side="bottom" width={400}>
            <div className="space-y-3">
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-primary/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h4 className="font-decorative text-base text-white">
                  Building Modern Design Systems
                </h4>
                <p className="text-xs text-[#C4C8D4] font-sans font-light">
                  Learn how to create scalable, maintainable design systems using modern
                  tools and best practices. A comprehensive guide for designers and
                  developers.
                </p>
                <div className="flex items-center gap-2 text-xs text-[#C4C8D4]">
                  <Badge variant="secondary" className="text-xs">
                    Design
                  </Badge>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </PreviewCardContent>
        </PreviewCardRoot>
      </div>
    </div>
  ),
}

/**
 * Product Preview Card Story
 * Shows product information on hover
 */
export const ProductPreview: Story = {
  render: () => (
    <div className="p-8 space-y-4">
      <p className="text-sm text-[#C4C8D4] mb-4">
        Hover over the product card to see details
      </p>
      <PreviewCardRoot>
        <PreviewCardTrigger>
          <div className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border hover:border-primary/30 transition-all cursor-pointer max-w-xs">
            <h4 className="font-medium text-white text-sm">Premium Headphones</h4>
            <p className="text-xs text-[#C4C8D4] mt-1">$299.99</p>
          </div>
        </PreviewCardTrigger>
        <PreviewCardContent side="right" width={360}>
          <div className="space-y-3">
            {/* Product Image */}
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-transparent rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-primary/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-decorative text-base text-white">Premium Headphones</h4>
                  <p className="text-sm text-primary font-medium mt-1">$299.99</p>
                </div>
                <Badge variant="outline">In Stock</Badge>
              </div>

              <p className="text-sm text-[#C4C8D4] font-sans font-light">
                High-fidelity audio with active noise cancellation. 30-hour battery life and
                premium comfort for all-day listening.
              </p>

              {/* Features */}
              <ul className="space-y-1 text-xs text-[#C4C8D4]">
                <li className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Active Noise Cancellation
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  30-Hour Battery Life
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Premium Audio Quality
                </li>
              </ul>

              <Button variant="primary" size="sm" className="w-full mt-2">
                Add to Cart
              </Button>
            </div>
          </div>
        </PreviewCardContent>
      </PreviewCardRoot>
    </div>
  ),
}

/**
 * Document Preview Story
 * Shows document metadata on hover
 */
export const DocumentPreview: Story = {
  render: () => (
    <div className="p-8 space-y-4">
      <p className="text-sm text-[#C4C8D4] mb-4">Hover over documents to preview</p>
      <div className="space-y-2">
        {[
          { name: 'Project Proposal.pdf', size: '2.4 MB', date: 'Nov 20, 2024' },
          { name: 'Design System.sketch', size: '15.8 MB', date: 'Nov 19, 2024' },
          { name: 'Meeting Notes.docx', size: '124 KB', date: 'Nov 18, 2024' },
        ].map((doc, i) => (
          <PreviewCardRoot key={i} hoverDelay={200}>
            <PreviewCardTrigger>
              <div className="flex items-center gap-3 p-3 bg-card/40 backdrop-blur-8 rounded-lg border border-border hover:border-primary/30 transition-all cursor-pointer">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-[#C4C8D4]">
                    {doc.size} • {doc.date}
                  </p>
                </div>
              </div>
            </PreviewCardTrigger>
            <PreviewCardContent side="right" width={320}>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm truncate">{doc.name}</h4>
                    <p className="text-xs text-[#C4C8D4] mt-1">Modified {doc.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-[#C4C8D4]">Size</p>
                    <p className="text-white font-medium mt-1">{doc.size}</p>
                  </div>
                  <div>
                    <p className="text-[#C4C8D4]">Type</p>
                    <p className="text-white font-medium mt-1">
                      {doc.name.split('.').pop()?.toUpperCase()}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#C4C8D4] font-sans font-light">
                  This document contains important project information and has been recently
                  updated.
                </p>

                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="flex-1">
                    Open
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Download
                  </Button>
                </div>
              </div>
            </PreviewCardContent>
          </PreviewCardRoot>
        ))}
      </div>
    </div>
  ),
}

/**
 * Image Gallery Preview Story
 * Shows image preview with metadata
 */
export const ImageGalleryPreview: Story = {
  render: () => (
    <div className="p-8 space-y-4">
      <p className="text-sm text-[#C4C8D4] mb-4">Hover over images to preview</p>
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <PreviewCardRoot key={i} hoverDelay={150}>
            <PreviewCardTrigger>
              <div className="aspect-square bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl text-primary/40 font-decorative">{i + 1}</span>
                </div>
              </div>
            </PreviewCardTrigger>
            <PreviewCardContent side="top" width={280}>
              <div className="space-y-3">
                {/* Large Preview */}
                <div className="aspect-square bg-gradient-to-br from-primary/30 via-primary/15 to-transparent rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl text-primary/60 font-decorative">{i + 1}</span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-1">
                  <h4 className="font-medium text-white text-sm">Image-{i + 1}.jpg</h4>
                  <p className="text-xs text-[#C4C8D4]">1920 × 1080 • 2.3 MB</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="flex-1">
                    View Full
                  </Button>
                  <Button variant="outline" size="sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </PreviewCardContent>
          </PreviewCardRoot>
        ))}
      </div>
    </div>
  ),
}

/**
 * Video Preview Story
 * Shows video preview with metadata
 */
export const VideoPreview: Story = {
  render: () => (
    <div className="p-8 space-y-4">
      <p className="text-sm text-[#C4C8D4] mb-4">Hover over video thumbnails</p>
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        {[
          { title: 'Design System Tutorial', duration: '12:34', views: '1.2K' },
          { title: 'Component Architecture', duration: '8:45', views: '856' },
        ].map((video, i) => (
          <PreviewCardRoot key={i}>
            <PreviewCardTrigger>
              <div className="space-y-2 cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-lg overflow-hidden relative group">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg
                        className="w-6 h-6 text-primary ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                    {video.duration}
                  </div>
                </div>
                <h4 className="text-sm text-white font-medium">{video.title}</h4>
              </div>
            </PreviewCardTrigger>
            <PreviewCardContent side="bottom" width={360}>
              <div className="space-y-3">
                {/* Video Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-lg overflow-hidden relative">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-primary ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="space-y-2">
                  <h4 className="font-decorative text-base text-white">{video.title}</h4>
                  <p className="text-sm text-[#C4C8D4] font-sans font-light">
                    Learn how to build scalable component architectures using modern design
                    patterns and best practices.
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#C4C8D4]">
                    <span>{video.views} views</span>
                    <span>•</span>
                    <span>2 days ago</span>
                  </div>
                </div>

                <Button variant="primary" size="sm" className="w-full">
                  Watch Now
                </Button>
              </div>
            </PreviewCardContent>
          </PreviewCardRoot>
        ))}
      </div>
    </div>
  ),
}

/**
 * Different Positions Story
 * Demonstrates all positioning options
 */
export const DifferentPositions: Story = {
  render: () => (
    <div className="p-16 flex items-center justify-center">
      <div className="grid grid-cols-3 gap-8 items-center">
        {/* Top */}
        <div className="col-start-2">
          <PreviewCardRoot>
            <PreviewCardTrigger>
              <Button variant="outline" size="sm">
                Top
              </Button>
            </PreviewCardTrigger>
            <PreviewCardContent side="top">
              <div className="text-center">
                <p className="text-sm text-white font-medium">Top Position</p>
                <p className="text-xs text-[#C4C8D4] mt-1">
                  Preview appears above the trigger
                </p>
              </div>
            </PreviewCardContent>
          </PreviewCardRoot>
        </div>

        {/* Left, Center, Right */}
        <PreviewCardRoot>
          <PreviewCardTrigger>
            <Button variant="outline" size="sm">
              Left
            </Button>
          </PreviewCardTrigger>
          <PreviewCardContent side="left">
            <div className="text-center">
              <p className="text-sm text-white font-medium">Left Position</p>
              <p className="text-xs text-[#C4C8D4] mt-1">Preview appears to the left</p>
            </div>
          </PreviewCardContent>
        </PreviewCardRoot>

        <div className="flex items-center justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-xs text-primary font-medium">Trigger</span>
          </div>
        </div>

        <PreviewCardRoot>
          <PreviewCardTrigger>
            <Button variant="outline" size="sm">
              Right
            </Button>
          </PreviewCardTrigger>
          <PreviewCardContent side="right">
            <div className="text-center">
              <p className="text-sm text-white font-medium">Right Position</p>
              <p className="text-xs text-[#C4C8D4] mt-1">Preview appears to the right</p>
            </div>
          </PreviewCardContent>
        </PreviewCardRoot>

        {/* Bottom */}
        <div className="col-start-2">
          <PreviewCardRoot>
            <PreviewCardTrigger>
              <Button variant="outline" size="sm">
                Bottom
              </Button>
            </PreviewCardTrigger>
            <PreviewCardContent side="bottom">
              <div className="text-center">
                <p className="text-sm text-white font-medium">Bottom Position</p>
                <p className="text-xs text-[#C4C8D4] mt-1">
                  Preview appears below the trigger
                </p>
              </div>
            </PreviewCardContent>
          </PreviewCardRoot>
        </div>
      </div>
    </div>
  ),
}

/**
 * Delayed Show Story
 * Demonstrates hover delay customization
 */
export const DelayedShow: Story = {
  render: () => (
    <div className="p-8 space-y-6">
      <div>
        <p className="text-sm text-[#C4C8D4] mb-3">Instant (0ms delay)</p>
        <PreviewCardRoot hoverDelay={0}>
          <PreviewCardTrigger>
            <Button variant="outline" size="sm">
              Hover Me
            </Button>
          </PreviewCardTrigger>
          <PreviewCardContent>
            <p className="text-sm text-white">Appears instantly on hover</p>
          </PreviewCardContent>
        </PreviewCardRoot>
      </div>

      <div>
        <p className="text-sm text-[#C4C8D4] mb-3">Quick (150ms delay)</p>
        <PreviewCardRoot hoverDelay={150}>
          <PreviewCardTrigger>
            <Button variant="outline" size="sm">
              Hover Me
            </Button>
          </PreviewCardTrigger>
          <PreviewCardContent>
            <p className="text-sm text-white">Appears after 150ms hover</p>
          </PreviewCardContent>
        </PreviewCardRoot>
      </div>

      <div>
        <p className="text-sm text-[#C4C8D4] mb-3">Default (300ms delay)</p>
        <PreviewCardRoot>
          <PreviewCardTrigger>
            <Button variant="outline" size="sm">
              Hover Me
            </Button>
          </PreviewCardTrigger>
          <PreviewCardContent>
            <p className="text-sm text-white">Appears after 300ms hover (default)</p>
          </PreviewCardContent>
        </PreviewCardRoot>
      </div>

      <div>
        <p className="text-sm text-[#C4C8D4] mb-3">Slow (600ms delay)</p>
        <PreviewCardRoot hoverDelay={600}>
          <PreviewCardTrigger>
            <Button variant="outline" size="sm">
              Hover Me
            </Button>
          </PreviewCardTrigger>
          <PreviewCardContent>
            <p className="text-sm text-white">Appears after 600ms hover</p>
          </PreviewCardContent>
        </PreviewCardRoot>
      </div>
    </div>
  ),
}

/**
 * Rich Content with Images Story
 * Shows complex content layouts
 */
export const RichContentWithImages: Story = {
  render: () => (
    <div className="p-8">
      <PreviewCardRoot>
        <PreviewCardTrigger>
          <div className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border hover:border-primary/30 transition-all cursor-pointer max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">Project Repository</h4>
                <p className="text-xs text-[#C4C8D4]">ozean-licht/ecosystem</p>
              </div>
            </div>
          </div>
        </PreviewCardTrigger>
        <PreviewCardContent side="right" width={420}>
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-decorative text-base text-white">
                  ozean-licht/ecosystem
                </h4>
                <p className="text-xs text-[#C4C8D4] mt-1">
                  Monorepo for Ozean Licht ecosystem
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    TypeScript
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    React
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Next.js
                  </Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              A comprehensive monorepo containing all applications, shared libraries, and
              tools for the Ozean Licht ecosystem. Built with modern web technologies and
              best practices.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-3 bg-card/40 rounded-lg border border-border">
              <div className="text-center">
                <p className="text-xs text-[#C4C8D4]">Stars</p>
                <p className="text-lg font-decorative text-white mt-1">342</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#C4C8D4]">Forks</p>
                <p className="text-lg font-decorative text-white mt-1">28</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#C4C8D4]">Issues</p>
                <p className="text-lg font-decorative text-white mt-1">12</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="primary" size="sm" className="flex-1">
                View Repository
              </Button>
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </PreviewCardContent>
      </PreviewCardRoot>
    </div>
  ),
}

/**
 * List Items with Previews Story
 * Shows preview cards in a list context
 */
export const ListItemsWithPreviews: Story = {
  render: () => (
    <div className="p-8 space-y-4">
      <h3 className="font-decorative text-lg text-white mb-4">Team Members</h3>
      <div className="space-y-2 max-w-md">
        {[
          { name: 'Alice Johnson', role: 'Product Designer', status: 'online' },
          { name: 'Bob Smith', role: 'Frontend Developer', status: 'away' },
          { name: 'Carol White', role: 'Backend Developer', status: 'offline' },
          { name: 'David Brown', role: 'UX Researcher', status: 'online' },
        ].map((member, i) => (
          <PreviewCardRoot key={i} hoverDelay={200}>
            <PreviewCardTrigger>
              <div className="flex items-center gap-3 p-3 bg-card/40 backdrop-blur-8 rounded-lg border border-border hover:border-primary/30 transition-all cursor-pointer">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                    />
                    <AvatarFallback>
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card',
                      member.status === 'online' && 'bg-green-500',
                      member.status === 'away' && 'bg-yellow-500',
                      member.status === 'offline' && 'bg-gray-500'
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{member.name}</p>
                  <p className="text-xs text-[#C4C8D4]">{member.role}</p>
                </div>
              </div>
            </PreviewCardTrigger>
            <PreviewCardContent side="right" width={300}>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                      />
                      <AvatarFallback>
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card',
                        member.status === 'online' && 'bg-green-500',
                        member.status === 'away' && 'bg-yellow-500',
                        member.status === 'offline' && 'bg-gray-500'
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm">{member.name}</h4>
                    <p className="text-xs text-[#C4C8D4]">{member.role}</p>
                    <p className="text-xs text-primary capitalize mt-1">{member.status}</p>
                  </div>
                </div>

                <p className="text-xs text-[#C4C8D4] font-sans font-light">
                  {member.role === 'Product Designer'
                    ? 'Creating beautiful, user-centered designs that solve real problems.'
                    : member.role === 'Frontend Developer'
                    ? 'Building responsive and accessible user interfaces with React.'
                    : member.role === 'Backend Developer'
                    ? 'Developing robust APIs and server infrastructure.'
                    : 'Researching user needs and behaviors to inform design decisions.'}
                </p>

                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="flex-1">
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Profile
                  </Button>
                </div>
              </div>
            </PreviewCardContent>
          </PreviewCardRoot>
        ))}
      </div>
    </div>
  ),
}

/**
 * Glass Effect Variants Story
 * Shows different glass effect intensities
 */
export const GlassEffectVariants: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-[#0ec2bc]/10 rounded-lg space-y-6">
      <div>
        <p className="text-sm text-[#C4C8D4] mb-3">Strong Glass Effect (Default)</p>
        <PreviewCardRoot>
          <PreviewCardTrigger>
            <Button variant="outline" size="sm">
              Strong Glass
            </Button>
          </PreviewCardTrigger>
          <PreviewCardContent glassEffect={true}>
            <div className="space-y-2">
              <h4 className="font-decorative text-base text-white">Strong Glass Effect</h4>
              <p className="text-sm text-[#C4C8D4] font-sans font-light">
                With backdrop-blur-16 and 80% opacity for maximum depth and visual interest.
              </p>
            </div>
          </PreviewCardContent>
        </PreviewCardRoot>
      </div>

      <div>
        <p className="text-sm text-[#C4C8D4] mb-3">No Glass Effect</p>
        <PreviewCardRoot>
          <PreviewCardTrigger>
            <Button variant="outline" size="sm">
              Solid Background
            </Button>
          </PreviewCardTrigger>
          <PreviewCardContent glassEffect={false}>
            <div className="space-y-2">
              <h4 className="font-decorative text-base text-white">Solid Background</h4>
              <p className="text-sm text-[#C4C8D4] font-sans font-light">
                Without glass effect for better readability in certain contexts.
              </p>
            </div>
          </PreviewCardContent>
        </PreviewCardRoot>
      </div>

      <div>
        <p className="text-sm text-[#C4C8D4] mb-3">Custom Styling</p>
        <PreviewCardRoot>
          <PreviewCardTrigger>
            <Button variant="outline" size="sm">
              Custom Style
            </Button>
          </PreviewCardTrigger>
          <PreviewCardContent
            className="bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-20 border-primary/40"
            glassEffect={false}
          >
            <div className="space-y-2">
              <h4 className="font-decorative text-base text-white">Custom Gradient</h4>
              <p className="text-sm text-[#C4C8D4] font-sans font-light">
                Override with custom gradients and styling for unique effects.
              </p>
            </div>
          </PreviewCardContent>
        </PreviewCardRoot>
      </div>
    </div>
  ),
}

/**
 * Controlled State Story
 * Demonstrates external state control
 */
export const ControlledState: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <div className="p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
            {open ? 'Close' : 'Open'} Preview
          </Button>
          <span className="text-sm text-[#C4C8D4]">
            State: <span className="text-primary font-medium">{open ? 'Open' : 'Closed'}</span>
          </span>
        </div>

        <PreviewCardRoot open={open} onOpenChange={setOpen}>
          <PreviewCardTrigger>
            <div className="inline-flex items-center gap-2 p-3 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm text-white font-medium">Controlled Preview</span>
            </div>
          </PreviewCardTrigger>
          <PreviewCardContent side="bottom">
            <div className="space-y-3">
              <h4 className="font-decorative text-base text-white">Controlled State</h4>
              <p className="text-sm text-[#C4C8D4] font-sans font-light">
                This preview card's open state is controlled externally. You can open/close it
                using the button above or by hovering.
              </p>
              <Button variant="primary" size="sm" onClick={() => setOpen(false)} className="w-full">
                Close Preview
              </Button>
            </div>
          </PreviewCardContent>
        </PreviewCardRoot>
      </div>
    )
  },
}

/**
 * Complex Layout Story
 * Shows preview card in complex layout scenarios
 */
export const ComplexLayout: Story = {
  render: () => (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-2 gap-6 max-w-4xl">
        {/* Left Column */}
        <div className="space-y-4">
          <h3 className="font-decorative text-lg text-white">Featured Projects</h3>
          {[
            { title: 'Design System', status: 'Active', progress: 85 },
            { title: 'Component Library', status: 'In Progress', progress: 60 },
          ].map((project, i) => (
            <PreviewCardRoot key={i}>
              <PreviewCardTrigger>
                <div className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border hover:border-primary/30 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white text-sm">{project.title}</h4>
                    <Badge
                      variant={project.status === 'Active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#C4C8D4] mt-1">{project.progress}% complete</p>
                </div>
              </PreviewCardTrigger>
              <PreviewCardContent side="right" width={360}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-decorative text-base text-white">{project.title}</h4>
                    <Badge
                      variant={project.status === 'Active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-[#C4C8D4] font-sans font-light">
                    Building a comprehensive design system with reusable components and design
                    tokens for the Ozean Licht ecosystem.
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#C4C8D4]">Progress</span>
                      <span className="text-white font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[#C4C8D4]">Tasks</p>
                      <p className="text-white font-medium mt-1">24 / 32</p>
                    </div>
                    <div>
                      <p className="text-[#C4C8D4]">Team</p>
                      <p className="text-white font-medium mt-1">5 members</p>
                    </div>
                  </div>

                  <Button variant="primary" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </PreviewCardContent>
            </PreviewCardRoot>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <h3 className="font-decorative text-lg text-white">Recent Updates</h3>
          <div className="space-y-2">
            {[
              { action: 'Updated', item: 'Button Component', time: '2 hours ago' },
              { action: 'Created', item: 'Preview Card', time: '5 hours ago' },
              { action: 'Fixed', item: 'Dialog Animation', time: '1 day ago' },
            ].map((update, i) => (
              <PreviewCardRoot key={i} hoverDelay={200}>
                <PreviewCardTrigger>
                  <div className="p-3 bg-card/40 backdrop-blur-8 rounded-lg border border-border hover:border-primary/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-primary font-medium">{update.action}</span>
                      <span className="text-white">{update.item}</span>
                    </div>
                    <p className="text-xs text-[#C4C8D4] mt-1">{update.time}</p>
                  </div>
                </PreviewCardTrigger>
                <PreviewCardContent side="left" width={280}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{update.item}</p>
                        <p className="text-xs text-[#C4C8D4]">{update.action}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#C4C8D4] font-sans font-light">
                      {update.action} the {update.item.toLowerCase()} with new features and
                      improvements.
                    </p>
                    <p className="text-xs text-primary">{update.time}</p>
                  </div>
                </PreviewCardContent>
              </PreviewCardRoot>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
}
