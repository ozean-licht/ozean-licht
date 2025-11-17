import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './aspect-ratio';

/**
 * AspectRatio primitive component built on Radix UI AspectRatio.
 *
 * **This is a Tier 1 Primitive** - unstyled Radix UI component for maintaining consistent aspect ratios.
 * No Tier 2 branded version exists as this is a layout primitive.
 *
 * ## Radix UI AspectRatio Features
 * - **Ratio Preservation**: Maintains width/height ratio across all screen sizes
 * - **Responsive**: Automatically scales while preserving aspect ratio
 * - **Flexible**: Works with images, videos, iframes, or any content
 * - **CSS-based**: Uses CSS aspect-ratio property with fallback
 * - **Zero Runtime**: Pure CSS solution with no JavaScript overhead
 *
 * ## Common Aspect Ratios
 * - **16:9** (1.777) - Widescreen video, modern displays
 * - **4:3** (1.333) - Traditional video, older displays
 * - **1:1** (1.0) - Square, social media posts
 * - **21:9** (2.333) - Ultra-wide, cinematic
 * - **9:16** (0.5625) - Portrait, mobile video, stories
 * - **3:2** (1.5) - Photography standard
 * - **2:1** (2.0) - Panoramic
 *
 * ## Component Structure
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <img src="..." alt="..." />
 * </AspectRatio>
 * ```
 *
 * ## Usage Notes
 * - Container width is controlled by parent, height adjusts automatically
 * - Ratio is specified as width / height (e.g., 16 / 9 = 1.777)
 * - Default ratio is 1 / 1 (square)
 * - Perfect for responsive images and video embeds
 * - Works with any child content (images, videos, iframes, divs)
 *
 * ## Use Cases
 * - **Video Players**: Maintain video aspect ratio across screen sizes
 * - **Image Galleries**: Consistent thumbnail sizes
 * - **Hero Sections**: Responsive banner images
 * - **Social Media Previews**: Square or portrait posts
 * - **Embedded Content**: YouTube, Vimeo, maps
 * - **Product Images**: Consistent e-commerce thumbnails
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A container that maintains a consistent aspect ratio. Built on Radix UI AspectRatio primitive.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default 16:9 aspect ratio.
 *
 * The most common aspect ratio for modern video and displays.
 * Perfect for widescreen content, YouTube embeds, and hero images.
 */
export const Default: Story = {
  render: () => (
    <AspectRatio ratio={16 / 9}>
      <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700">
        <div className="text-center">
          <div className="text-4xl font-bold">16:9</div>
          <div className="text-sm">Widescreen</div>
        </div>
      </div>
    </AspectRatio>
  ),
};

/**
 * Square 1:1 aspect ratio.
 *
 * Perfect for social media posts, avatars, and product thumbnails.
 * Common on Instagram, Pinterest, and profile pictures.
 */
export const Square: Story = {
  render: () => (
    <AspectRatio ratio={1 / 1}>
      <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700">
        <div className="text-center">
          <div className="text-4xl font-bold">1:1</div>
          <div className="text-sm">Square</div>
        </div>
      </div>
    </AspectRatio>
  ),
};

/**
 * 4:3 aspect ratio.
 *
 * Traditional video format and older displays.
 * Common for presentations, older content, and some photography.
 */
export const FourThree: Story = {
  render: () => (
    <AspectRatio ratio={4 / 3}>
      <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-green-100 to-green-200 text-green-700">
        <div className="text-center">
          <div className="text-4xl font-bold">4:3</div>
          <div className="text-sm">Traditional</div>
        </div>
      </div>
    </AspectRatio>
  ),
};

/**
 * 21:9 ultra-wide aspect ratio.
 *
 * Cinematic and ultra-wide display format.
 * Perfect for immersive hero sections and panoramic images.
 */
export const UltraWide: Story = {
  render: () => (
    <AspectRatio ratio={21 / 9}>
      <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700">
        <div className="text-center">
          <div className="text-4xl font-bold">21:9</div>
          <div className="text-sm">Ultra-Wide / Cinematic</div>
        </div>
      </div>
    </AspectRatio>
  ),
};

/**
 * 9:16 portrait aspect ratio.
 *
 * Mobile video format (vertical).
 * Perfect for Instagram Stories, TikTok, Reels, and mobile-first content.
 */
export const Portrait: Story = {
  render: () => (
    <AspectRatio ratio={9 / 16}>
      <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-pink-100 to-pink-200 text-pink-700">
        <div className="text-center">
          <div className="text-4xl font-bold">9:16</div>
          <div className="text-sm">Portrait / Stories</div>
        </div>
      </div>
    </AspectRatio>
  ),
};

/**
 * 3:2 photography aspect ratio.
 *
 * Standard photography format for DSLR cameras.
 * Common in professional photography and print media.
 */
export const Photography: Story = {
  render: () => (
    <AspectRatio ratio={3 / 2}>
      <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700">
        <div className="text-center">
          <div className="text-4xl font-bold">3:2</div>
          <div className="text-sm">Photography</div>
        </div>
      </div>
    </AspectRatio>
  ),
};

/**
 * 2:1 panoramic aspect ratio.
 *
 * Wide panoramic format.
 * Perfect for landscape photography and wide banner images.
 */
export const Panoramic: Story = {
  render: () => (
    <AspectRatio ratio={2 / 1}>
      <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-teal-100 to-teal-200 text-teal-700">
        <div className="text-center">
          <div className="text-4xl font-bold">2:1</div>
          <div className="text-sm">Panoramic</div>
        </div>
      </div>
    </AspectRatio>
  ),
};

/**
 * With image example.
 *
 * Demonstrates AspectRatio with an actual image element.
 * The image will scale to fill the container while maintaining the aspect ratio.
 */
export const WithImage: Story = {
  render: () => (
    <AspectRatio ratio={16 / 9}>
      <img
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        alt="Photo by Drew Beamer"
        className="h-full w-full rounded-md object-cover"
      />
    </AspectRatio>
  ),
};

/**
 * With video placeholder example.
 *
 * Demonstrates AspectRatio for video content.
 * Common pattern for YouTube/Vimeo embeds.
 */
export const WithVideo: Story = {
  render: () => (
    <AspectRatio ratio={16 / 9}>
      <div className="flex h-full w-full items-center justify-center rounded-md bg-black text-white">
        <div className="text-center">
          <svg
            className="mx-auto mb-4 h-16 w-16"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          <div className="text-sm opacity-75">Video Player (16:9)</div>
        </div>
      </div>
    </AspectRatio>
  ),
};

/**
 * With iframe embed example.
 *
 * Demonstrates AspectRatio with iframe for embedding external content.
 * Shows the common pattern for YouTube embeds.
 */
export const WithIframe: Story = {
  render: () => (
    <AspectRatio ratio={16 / 9}>
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full rounded-md"
      />
    </AspectRatio>
  ),
};

/**
 * With placeholder content.
 *
 * Shows how to create placeholder boxes for content loading states.
 * Useful for skeleton screens and lazy loading.
 */
export const WithPlaceholder: Story = {
  render: () => (
    <AspectRatio ratio={16 / 9}>
      <div className="flex h-full w-full items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-slate-50">
        <div className="text-center text-slate-400">
          <svg
            className="mx-auto mb-2 h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div className="text-sm">Image Placeholder</div>
        </div>
      </div>
    </AspectRatio>
  ),
};

/**
 * Responsive grid with multiple aspect ratios.
 *
 * Demonstrates different aspect ratios in a grid layout.
 * Shows how AspectRatio maintains consistency across varying content.
 */
export const ResponsiveGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4" style={{ width: '600px' }}>
      <AspectRatio ratio={1 / 1}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-red-100 to-red-200 text-red-700">
          <div className="text-center">
            <div className="text-2xl font-bold">1:1</div>
          </div>
        </div>
      </AspectRatio>

      <AspectRatio ratio={1 / 1}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700">
          <div className="text-center">
            <div className="text-2xl font-bold">1:1</div>
          </div>
        </div>
      </AspectRatio>

      <AspectRatio ratio={16 / 9}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-green-100 to-green-200 text-green-700">
          <div className="text-center">
            <div className="text-2xl font-bold">16:9</div>
          </div>
        </div>
      </AspectRatio>

      <AspectRatio ratio={16 / 9}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700">
          <div className="text-center">
            <div className="text-2xl font-bold">16:9</div>
          </div>
        </div>
      </AspectRatio>

      <div className="col-span-2">
        <AspectRatio ratio={21 / 9}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700">
            <div className="text-center">
              <div className="text-2xl font-bold">21:9 Full Width</div>
            </div>
          </div>
        </AspectRatio>
      </div>
    </div>
  ),
};

/**
 * Image gallery with consistent ratios.
 *
 * Real-world example of an image gallery using AspectRatio.
 * All images maintain the same aspect ratio regardless of original dimensions.
 */
export const ImageGallery: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4" style={{ width: '700px' }}>
      <AspectRatio ratio={1 / 1}>
        <img
          src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=400&fit=crop"
          alt="Gallery image 1"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>

      <AspectRatio ratio={1 / 1}>
        <img
          src="https://images.unsplash.com/photo-1682687221038-404cb8830901?w=400&h=400&fit=crop"
          alt="Gallery image 2"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>

      <AspectRatio ratio={1 / 1}>
        <img
          src="https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=400&h=400&fit=crop"
          alt="Gallery image 3"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>

      <AspectRatio ratio={1 / 1}>
        <img
          src="https://images.unsplash.com/photo-1682687220208-22d7a2543e88?w=400&h=400&fit=crop"
          alt="Gallery image 4"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>

      <AspectRatio ratio={1 / 1}>
        <img
          src="https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=400&h=400&fit=crop"
          alt="Gallery image 5"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>

      <AspectRatio ratio={1 / 1}>
        <img
          src="https://images.unsplash.com/photo-1682687221080-5cb261c645cb?w=400&h=400&fit=crop"
          alt="Gallery image 6"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

/**
 * Product card with aspect ratio.
 *
 * Common e-commerce pattern with consistent product image ratios.
 */
export const ProductCard: Story = {
  render: () => (
    <div className="w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <AspectRatio ratio={1 / 1}>
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
          alt="Product"
          className="h-full w-full object-cover"
        />
      </AspectRatio>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">Premium Headphones</h3>
        <p className="mt-1 text-sm text-slate-500">Wireless over-ear headphones</p>
        <p className="mt-2 text-lg font-bold text-slate-900">$299.00</p>
      </div>
    </div>
  ),
};

/**
 * Hero section with aspect ratio.
 *
 * Demonstrates using AspectRatio for hero sections and banners.
 */
export const HeroSection: Story = {
  render: () => (
    <div style={{ width: '800px' }}>
      <AspectRatio ratio={21 / 9}>
        <div className="relative h-full w-full">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=686&fit=crop"
            alt="Hero"
            className="h-full w-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold">Welcome to Our Platform</h1>
              <p className="mt-2 text-lg">Discover amazing content</p>
            </div>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
};

/**
 * Video thumbnail grid.
 *
 * YouTube-style video thumbnail layout with consistent 16:9 ratios.
 */
export const VideoThumbnails: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4" style={{ width: '600px' }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="overflow-hidden rounded-lg bg-white shadow-sm">
          <AspectRatio ratio={16 / 9}>
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white">
              <svg
                className="h-16 w-16 opacity-75"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </AspectRatio>
          <div className="p-3">
            <h4 className="text-sm font-semibold text-slate-900">
              Video Title {i}
            </h4>
            <p className="mt-1 text-xs text-slate-500">123K views • 2 days ago</p>
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Mobile story format.
 *
 * Instagram/Snapchat style story cards in 9:16 portrait format.
 */
export const MobileStories: Story = {
  render: () => (
    <div className="flex gap-4" style={{ width: '600px' }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="w-32">
          <AspectRatio ratio={9 / 16}>
            <div
              className="flex h-full w-full items-center justify-center rounded-lg text-white"
              style={{
                background: `linear-gradient(135deg, hsl(${i * 60}, 70%, 60%), hsl(${i * 60 + 30}, 70%, 50%))`,
              }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold">Story {i}</div>
              </div>
            </div>
          </AspectRatio>
          <p className="mt-2 text-center text-xs text-slate-600">User {i}</p>
        </div>
      ))}
    </div>
  ),
};

/**
 * Ozean Licht themed example.
 *
 * AspectRatio with Ozean Licht turquoise accent (#0ec2bc).
 * Demonstrates branding integration with aspect ratio containers.
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="space-y-6" style={{ width: '600px' }}>
      <AspectRatio ratio={16 / 9}>
        <div
          className="flex h-full w-full items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: '#0ec2bc' }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold">Ozean Licht</h2>
            <p className="mt-2 text-sm opacity-90">16:9 Hero Section</p>
          </div>
        </div>
      </AspectRatio>

      <div className="grid grid-cols-2 gap-4">
        <AspectRatio ratio={1 / 1}>
          <div
            className="flex h-full w-full items-center justify-center rounded-lg border-4 text-center"
            style={{ borderColor: '#0ec2bc', color: '#0ec2bc' }}
          >
            <div>
              <div className="text-2xl font-bold">Content</div>
              <div className="text-sm">Square Format</div>
            </div>
          </div>
        </AspectRatio>

        <AspectRatio ratio={1 / 1}>
          <div
            className="h-full w-full rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #0ec2bc 0%, #0a9d98 100%)',
            }}
          >
            <div className="flex h-full items-center justify-center text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">Gradient</div>
                <div className="text-sm">Turquoise</div>
              </div>
            </div>
          </div>
        </AspectRatio>
      </div>

      <AspectRatio ratio={21 / 9}>
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 30% 50%, #0ec2bc 0%, #08847f 100%)',
            }}
          />
          <div className="relative flex h-full items-center justify-center text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold">Ultra-Wide Banner</h3>
              <p className="mt-1 text-sm opacity-90">21:9 Cinematic Format</p>
            </div>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
};

/**
 * Comparison of different sizes.
 *
 * Shows how the same aspect ratio scales with different container widths.
 */
export const ResponsiveSizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div style={{ width: '200px' }}>
        <AspectRatio ratio={16 / 9}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700">
            <div className="text-center">
              <div className="text-lg font-bold">200px</div>
              <div className="text-xs">16:9</div>
            </div>
          </div>
        </AspectRatio>
      </div>

      <div style={{ width: '400px' }}>
        <AspectRatio ratio={16 / 9}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700">
            <div className="text-center">
              <div className="text-2xl font-bold">400px</div>
              <div className="text-sm">16:9</div>
            </div>
          </div>
        </AspectRatio>
      </div>

      <div style={{ width: '600px' }}>
        <AspectRatio ratio={16 / 9}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700">
            <div className="text-center">
              <div className="text-3xl font-bold">600px</div>
              <div className="text-base">16:9</div>
            </div>
          </div>
        </AspectRatio>
      </div>
    </div>
  ),
};

/**
 * All standard ratios comparison.
 *
 * Visual reference showing all common aspect ratios side by side.
 */
export const AllRatios: Story = {
  render: () => (
    <div className="space-y-4" style={{ width: '600px' }}>
      {[
        { ratio: 21 / 9, label: '21:9', color: 'from-red-100 to-red-200 text-red-700' },
        { ratio: 16 / 9, label: '16:9', color: 'from-orange-100 to-orange-200 text-orange-700' },
        { ratio: 2 / 1, label: '2:1', color: 'from-yellow-100 to-yellow-200 text-yellow-700' },
        { ratio: 3 / 2, label: '3:2', color: 'from-green-100 to-green-200 text-green-700' },
        { ratio: 4 / 3, label: '4:3', color: 'from-teal-100 to-teal-200 text-teal-700' },
        { ratio: 1 / 1, label: '1:1', color: 'from-blue-100 to-blue-200 text-blue-700' },
        { ratio: 9 / 16, label: '9:16', color: 'from-purple-100 to-purple-200 text-purple-700' },
      ].map(({ ratio, label, color }) => (
        <div key={label}>
          <AspectRatio ratio={ratio}>
            <div className={`flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br ${color}`}>
              <div className="text-center">
                <div className="text-2xl font-bold">{label}</div>
                <div className="text-sm">{ratio.toFixed(3)}</div>
              </div>
            </div>
          </AspectRatio>
        </div>
      ))}
    </div>
  ),
};
