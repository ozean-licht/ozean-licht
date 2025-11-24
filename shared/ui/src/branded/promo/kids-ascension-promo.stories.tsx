'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { KidsAscensionPromo, type KidsAscensionPromoProps } from './kids-ascension-promo'

/**
 * # KidsAscensionPromo Component
 *
 * A promotional section showcasing the Kids Ascension educational platform.
 * Features a split layout with content and an image gallery (simplified, no ticker).
 *
 * ## Features
 * - **Responsive Grid**: Two-column layout on desktop, single column on mobile
 * - **Dynamic Badges**: Feature badges with icons and text
 * - **Image Gallery**: Two rows of three images each (simplified gallery)
 * - **CTA Button**: Call-to-action button with link support
 * - **German Content**: Full German language support for children's education theme
 * - **Ozean Licht Design System**: Cinzel Decorative and Montserrat fonts, oceanic cyan primary color
 *
 * ## Layout Structure
 * ```
 * ┌─────────────────────────────────────────┐
 * │  Content (Left)  │  Image Gallery (Right)│
 * │  - Title         │  - Upper row (3 imgs) │
 * │  - Description   │  - Lower row (3 imgs) │
 * │  - Badges        │                       │
 * │  - CTA Button    │                       │
 * └─────────────────────────────────────────┘
 * ```
 *
 * ## Icon Support
 * - `star` - Star icon
 * - `magicwand` - Magic wand (Wand2)
 * - `lightbulb` - Light bulb
 * - `heart` - Heart
 * - `moon` - Moon
 * - `feedback` - Message circle
 * - `users` - Users
 * - `sparkle` - Sparkle
 *
 * ## Usage
 *
 * ```tsx
 * <KidsAscensionPromo
 *   title="Kids AscensioN"
 *   description="Entdecke, wie wir allen Kindern helfen..."
 *   buttonText="Zu Kids Ascension →"
 *   buttonHref="https://kids-ascension.org"
 *   badges={[
 *     { icon: 'star', text: 'Ganzheitliche Entwicklung' },
 *     { icon: 'magicwand', text: 'Spirituelle & Magische Schule' },
 *     { icon: 'lightbulb', text: 'Kreative Entfaltung' },
 *   ]}
 *   upperImages={[...]}
 *   lowerImages={[...]}
 * />
 * ```
 */
const meta = {
  title: 'Tier 2: Branded/Promo/KidsAscensionPromo',
  component: KidsAscensionPromo,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#00070F' },
        { name: 'light', value: '#FFFFFF' },
      ],
    },
    docs: {
      description: {
        component:
          'Promotional section for Kids Ascension educational platform. Features split layout with content, badges, and image gallery. Responsive and fully customizable.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Section title',
      table: {
        defaultValue: { summary: 'Kids AscensioN' },
      },
    },
    description: {
      control: 'text',
      description: 'Description text',
      table: {
        defaultValue: {
          summary: 'Entdecke, wie wir allen Kindern helfen, ihr volles Potenzial zu entfalten...',
        },
      },
    },
    buttonText: {
      control: 'text',
      description: 'Button text',
      table: {
        defaultValue: { summary: 'Zu Kids Ascension →' },
      },
    },
    buttonHref: {
      control: 'text',
      description: 'Button link destination',
      table: {
        defaultValue: { summary: 'https://kids-ascension.org' },
      },
    },
    badges: {
      control: 'object',
      description: 'Array of feature badges with icon and text',
      table: {
        type: {
          summary: 'Array<{ icon: string; text: string }>',
        },
      },
    },
    upperImages: {
      control: 'object',
      description: 'Array of image URLs for upper gallery row',
      table: {
        type: { summary: 'string[]' },
      },
    },
    lowerImages: {
      control: 'object',
      description: 'Array of image URLs for lower gallery row',
      table: {
        type: { summary: 'string[]' },
      },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the section',
      table: {
        defaultValue: { summary: '""' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof KidsAscensionPromo>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default Kids Ascension promo with standard content and three badges.
 *
 * Shows the component in its most common state with:
 * - Default title and description
 * - Three feature badges (Ganzheitliche Entwicklung, Spirituelle & Magische Schule, Kreative Entfaltung)
 * - Standard image gallery (6 images total)
 * - Default CTA button linking to kids-ascension.org
 */
export const Default: Story = {
  args: {
    title: 'Kids AscensioN',
    description:
      'Entdecke, wie wir allen Kindern helfen, ihr volles Potenzial zu entfalten und ihr inneres Licht zum Leuchten zu bringen.',
    buttonText: 'Zu Kids Ascension →',
    buttonHref: 'https://kids-ascension.org',
    badges: [
      { icon: 'star', text: 'Ganzheitliche Entwicklung' },
      { icon: 'magicwand', text: 'Spirituelle & Magische Schule' },
      { icon: 'lightbulb', text: 'Kreative Entfaltung' },
    ],
    upperImages: [
      '/images/kids-ascension/promo-1.webp',
      '/images/kids-ascension/promo-2.webp',
      '/images/kids-ascension/promo-5.webp',
    ],
    lowerImages: [
      '/images/kids-ascension/promo-3.webp',
      '/images/kids-ascension/promo-4.webp',
      '/images/kids-ascension/promo-6.webp',
    ],
  },
}

/**
 * Custom Badges variant with different feature highlights.
 *
 * Demonstrates the component with alternative badge configuration:
 * - Focus on different educational aspects
 * - Different icon choices (heart, moon, users)
 * - Shows flexibility of badge system
 */
export const CustomBadges: Story = {
  args: {
    title: 'Kids AscensioN',
    description:
      'Entdecke, wie wir allen Kindern helfen, ihr volles Potenzial zu entfalten und ihr inneres Licht zum Leuchten zu bringen.',
    buttonText: 'Zu Kids Ascension →',
    buttonHref: 'https://kids-ascension.org',
    badges: [
      { icon: 'heart', text: 'Liebevolle Begleitung' },
      { icon: 'moon', text: 'Bewusstseinsentwicklung' },
      { icon: 'users', text: 'Gemeinschaft der Kinder' },
      { icon: 'sparkle', text: 'Magie des Lernens' },
    ],
    upperImages: [
      '/images/kids-ascension/promo-1.webp',
      '/images/kids-ascension/promo-2.webp',
      '/images/kids-ascension/promo-5.webp',
    ],
    lowerImages: [
      '/images/kids-ascension/promo-3.webp',
      '/images/kids-ascension/promo-4.webp',
      '/images/kids-ascension/promo-6.webp',
    ],
  },
}

/**
 * Alternative image gallery variant.
 *
 * Shows the component with a different set of placeholder images,
 * demonstrating how the gallery adapts to different visual content.
 * Uses Unsplash images as examples of alternative image sets.
 */
export const AlternativeImageGallery: Story = {
  args: {
    title: 'Kids AscensioN',
    description:
      'Entdecke, wie wir allen Kindern helfen, ihr volles Potenzial zu entfalten und ihr inneres Licht zum Leuchten zu bringen.',
    buttonText: 'Zu Kids Ascension →',
    buttonHref: 'https://kids-ascension.org',
    badges: [
      { icon: 'star', text: 'Ganzheitliche Entwicklung' },
      { icon: 'magicwand', text: 'Spirituelle & Magische Schule' },
      { icon: 'lightbulb', text: 'Kreative Entfaltung' },
    ],
    upperImages: [
      'https://images.unsplash.com/photo-1596395564845-91d340d3e0e8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    ],
    lowerImages: [
      'https://images.unsplash.com/photo-1514306688772-cfb67f51a537?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1546527868-cceddcc7d7f0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    ],
  },
}

/**
 * Single row images variant.
 *
 * Shows the component with only three images in the upper row
 * and three images in the lower row (still displays both rows).
 * Demonstrates flexible image gallery size configuration.
 */
export const SingleRowImages: Story = {
  args: {
    title: 'Kids AscensioN - Vorschau',
    description:
      'Ein Überblick über unsere wichtigsten Kurse und Programme für Kinder aller Altersgruppen.',
    buttonText: 'Jetzt erkunden →',
    buttonHref: 'https://kids-ascension.org/courses',
    badges: [
      { icon: 'star', text: 'Für alle Altersgruppen' },
      { icon: 'lightbulb', text: 'Interaktives Lernen' },
    ],
    upperImages: [
      'https://images.unsplash.com/photo-1596395564845-91d340d3e0e8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    ],
    lowerImages: [
      'https://images.unsplash.com/photo-1514306688772-cfb67f51a537?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1546527868-cceddcc7d7f0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    ],
  },
}

/**
 * Long title and description variant.
 *
 * Demonstrates how the component handles extended content:
 * - Longer title text
 * - Extended description
 * - Shows text wrapping and responsive behavior
 */
export const LongContent: Story = {
  args: {
    title: 'Kids AscensioN - Ganzheitliche Entwicklung für die Kinder der neuen Erde',
    description:
      'Entdecke, wie wir allen Kindern helfen, ihr volles Potenzial zu entfalten und ihr inneres Licht zum Leuchten zu bringen. Durch unsere speziell entwickelten Kurse und Programme unterstützen wir jedes Kind auf seinem eigenen Weg der spirituellen und kreativen Entfaltung. Mit liebevoller Begleitung und modernsten pädagogischen Methoden schaffen wir einen Raum, in dem Kinder frei wachsen und ihre Gaben entdecken können.',
    buttonText: 'Erfahre mehr über unser Programm →',
    buttonHref: 'https://kids-ascension.org',
    badges: [
      { icon: 'star', text: 'Ganzheitliche Entwicklung für Körper, Geist und Seele' },
      { icon: 'magicwand', text: 'Spirituelle & Magische Schule mit interaktiven Kursen' },
      { icon: 'lightbulb', text: 'Kreative Entfaltung durch Künstlerische Techniken' },
    ],
    upperImages: [
      'https://images.unsplash.com/photo-1596395564845-91d340d3e0e8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    ],
    lowerImages: [
      'https://images.unsplash.com/photo-1514306688772-cfb67f51a537?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1546527868-cceddcc7d7f0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    ],
  },
}

/**
 * Minimal badges variant.
 *
 * Shows the component with only one badge for a cleaner, simpler look.
 * Useful when focusing the attention on the core message.
 */
export const MinimalBadges: Story = {
  args: {
    title: 'Kids AscensioN',
    description:
      'Entdecke, wie wir allen Kindern helfen, ihr volles Potenzial zu entfalten und ihr inneres Licht zum Leuchten zu bringen.',
    buttonText: 'Zu Kids Ascension →',
    buttonHref: 'https://kids-ascension.org',
    badges: [{ icon: 'star', text: 'Ganzheitliche Entwicklung' }],
    upperImages: [
      'https://images.unsplash.com/photo-1596395564845-91d340d3e0e8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    ],
    lowerImages: [
      'https://images.unsplash.com/photo-1514306688772-cfb67f51a537?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1546527868-cceddcc7d7f0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    ],
  },
}

/**
 * Interactive controls demonstration.
 *
 * Fully interactive version allowing manipulation of all props
 * including title, description, badges, and images in real-time.
 * Perfect for testing different content combinations and layouts.
 */
export const Interactive: Story = {
  render: (args: KidsAscensionPromoProps) => {
    const [title, setTitle] = useState(args.title || 'Kids AscensioN')
    const [description, setDescription] = useState(
      args.description ||
        'Entdecke, wie wir allen Kindern helfen, ihr volles Potenzial zu entfalten und ihr inneres Licht zum Leuchten zu bringen.'
    )
    const [buttonText, setButtonText] = useState(args.buttonText || 'Zu Kids Ascension →')
    const [buttonHref, setButtonHref] = useState(args.buttonHref || 'https://kids-ascension.org')
    const [badges, setBadges] = useState(
      args.badges || [
        { icon: 'star', text: 'Ganzheitliche Entwicklung' },
        { icon: 'magicwand', text: 'Spirituelle & Magische Schule' },
        { icon: 'lightbulb', text: 'Kreative Entfaltung' },
      ]
    )

    return (
      <div className="space-y-8">
        {/* Control Panel */}
        <div className="max-w-7xl mx-auto px-4 py-8 bg-[#0A1A1A]/50 rounded-lg border border-[#0E282E] space-y-6">
          <h3 className="text-lg font-semibold text-white">Interactive Controls</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0E282E] border border-[#0E282E] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[#0E282E] border border-[#0E282E] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Button Text</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full bg-[#0E282E] border border-[#0E282E] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Button Href</label>
                <input
                  type="text"
                  value={buttonHref}
                  onChange={(e) => setButtonHref(e.target.value)}
                  className="w-full bg-[#0E282E] border border-[#0E282E] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/30"
                />
              </div>
            </div>

            <div className="text-xs text-white/50 p-3 bg-[#001a1a] rounded">
              <p>Badges (3 defaults): {badges.length} badges configured</p>
              <div className="mt-2 space-y-1">
                {badges.map((badge, i) => (
                  <p key={i}>
                    • <span className="text-primary">{badge.icon}</span>: {badge.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="border-t border-[#0E282E] pt-8">
          <h3 className="text-lg font-semibold text-white px-4 mb-6">Preview</h3>
          <KidsAscensionPromo
            title={title}
            description={description}
            buttonText={buttonText}
            buttonHref={buttonHref}
            badges={badges}
            upperImages={[
              'https://images.unsplash.com/photo-1596395564845-91d340d3e0e8?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
            ]}
            lowerImages={[
              'https://images.unsplash.com/photo-1514306688772-cfb67f51a537?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1546527868-cceddcc7d7f0?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
            ]}
          />
        </div>
      </div>
    )
  },
}

/**
 * All icon types showcase.
 *
 * Displays all available badge icon types in a single component instance.
 * Useful for design review and icon selection reference.
 */
export const AllIconTypes: Story = {
  args: {
    title: 'Kids AscensioN - Icon Reference',
    description: 'Showcase aller verfügbaren Badge-Icons für die Komponentenkonfiguration.',
    buttonText: 'Zu Kids Ascension →',
    buttonHref: 'https://kids-ascension.org',
    badges: [
      { icon: 'star', text: 'Star Icon' },
      { icon: 'heart', text: 'Heart Icon' },
      { icon: 'lightbulb', text: 'Lightbulb Icon' },
      { icon: 'magicwand', text: 'Magic Wand Icon' },
      { icon: 'moon', text: 'Moon Icon' },
      { icon: 'feedback', text: 'Feedback Icon' },
      { icon: 'users', text: 'Users Icon' },
      { icon: 'sparkle', text: 'Sparkle Icon' },
    ],
    upperImages: [
      'https://images.unsplash.com/photo-1596395564845-91d340d3e0e8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    ],
    lowerImages: [
      'https://images.unsplash.com/photo-1514306688772-cfb67f51a537?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1546527868-cceddcc7d7f0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    ],
  },
}

/**
 * Custom className variant.
 *
 * Demonstrates how the className prop can be used to apply
 * additional custom styling or spacing to the section.
 */
export const WithCustomClass: Story = {
  args: {
    title: 'Kids AscensioN',
    description:
      'Entdecke, wie wir allen Kindern helfen, ihr volles Potenzial zu entfalten und ihr inneres Licht zum Leuchten zu bringen.',
    buttonText: 'Zu Kids Ascension →',
    buttonHref: 'https://kids-ascension.org',
    badges: [
      { icon: 'star', text: 'Ganzheitliche Entwicklung' },
      { icon: 'magicwand', text: 'Spirituelle & Magische Schule' },
      { icon: 'lightbulb', text: 'Kreative Entfaltung' },
    ],
    upperImages: [
      'https://images.unsplash.com/photo-1596395564845-91d340d3e0e8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    ],
    lowerImages: [
      'https://images.unsplash.com/photo-1514306688772-cfb67f51a537?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1546527868-cceddcc7d7f0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    ],
    className: 'bg-gradient-to-br from-primary/10 to-transparent',
  },
}

/**
 * Mobile responsive view.
 *
 * Shows how the component adapts to smaller screen sizes
 * with responsive grid layout changes (single column on mobile).
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    title: 'Kids AscensioN',
    description:
      'Entdecke, wie wir allen Kindern helfen, ihr volles Potenzial zu entfalten und ihr inneres Licht zum Leuchten zu bringen.',
    buttonText: 'Zu Kids Ascension →',
    buttonHref: 'https://kids-ascension.org',
    badges: [
      { icon: 'star', text: 'Ganzheitliche Entwicklung' },
      { icon: 'magicwand', text: 'Spirituelle & Magische Schule' },
      { icon: 'lightbulb', text: 'Kreative Entfaltung' },
    ],
    upperImages: [
      'https://images.unsplash.com/photo-1596395564845-91d340d3e0e8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    ],
    lowerImages: [
      'https://images.unsplash.com/photo-1514306688772-cfb67f51a537?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1546527868-cceddcc7d7f0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    ],
  },
}

/**
 * Tablet responsive view.
 *
 * Demonstrates the component on tablet-sized screens,
 * showing the responsive grid behavior between mobile and desktop.
 */
export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  args: {
    title: 'Kids AscensioN',
    description:
      'Entdecke, wie wir allen Kindern helfen, ihr volles Potenzial zu entfalten und ihr inneres Licht zum Leuchten zu bringen.',
    buttonText: 'Zu Kids Ascension →',
    buttonHref: 'https://kids-ascension.org',
    badges: [
      { icon: 'star', text: 'Ganzheitliche Entwicklung' },
      { icon: 'magicwand', text: 'Spirituelle & Magische Schule' },
      { icon: 'lightbulb', text: 'Kreative Entfaltung' },
    ],
    upperImages: [
      'https://images.unsplash.com/photo-1596395564845-91d340d3e0e8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    ],
    lowerImages: [
      'https://images.unsplash.com/photo-1514306688772-cfb67f51a537?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1546527868-cceddcc7d7f0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    ],
  },
}
