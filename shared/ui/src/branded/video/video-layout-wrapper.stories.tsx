'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { VideoLayoutWrapper } from './video-layout-wrapper'
import { BackgroundModeProvider } from '../layout/background-mode-context'
import { Card } from '../../cossui/card'
import { Badge } from '../../cossui/badge'
import { Button } from '../../cossui/button'
import { Sparkles, Heart, Lightbulb, ArrowRight, Clock, Users, Trophy } from 'lucide-react'

/**
 * # VideoLayoutWrapper Component
 *
 * A layout wrapper that combines responsive background video/image content with foreground elements.
 * Automatically integrates with BackgroundModeContext for seamless background switching and
 * provides customizable overlay effects for optimal text readability.
 *
 * ## Features
 *
 * - **BackgroundModeContext Integration** - Respects user's background mode preference (video/image/none)
 * - **Responsive Media Selection** - Different URLs for desktop and mobile viewports
 * - **Customizable Overlay** - Adjustable opacity (0-1) and color for text readability
 * - **Hydration Safe** - Uses BackgroundModeProvider's isLoaded flag to prevent hydration mismatches
 * - **Content Flexibility** - Accepts any React content as children
 * - **Image Fallback Support** - Can display static images when video mode is disabled
 * - **Performance Optimized** - Properly manages video lifecycle and responsive behavior
 *
 * ## Integration Pattern
 *
 * ```
 * ┌─────────────────────────────────────────┐
 * │    BackgroundModeProvider (root level)  │
 * ├─────────────────────────────────────────┤
 * │  ┌───────────────────────────────────┐  │
 * │  │  VideoLayoutWrapper               │  │
 * │  │  ┌─────────────────────────────┐  │  │
 * │  │  │  BackgroundVideo            │  │  │
 * │  │  │  (fixed bg, z-index: -10)  │  │  │
 * │  │  └─────────────────────────────┘  │  │
 * │  │  ┌─────────────────────────────┐  │  │
 * │  │  │  Children (foreground)      │  │  │
 * │  │  │  (z-index: auto)            │  │  │
 * │  │  └─────────────────────────────┘  │  │
 * │  └───────────────────────────────────┘  │
 * └─────────────────────────────────────────┘
 * ```
 *
 * ## Design System Context
 *
 * - **Primary Color**: Oceanic cyan (#0ec2bc, `text-primary`)
 * - **Dark Background**: Deep ocean (#00070F, #0A1A1A)
 * - **Border Color**: Muted teal (#0E282E)
 * - **Typography**: Montserrat font family
 */
const meta = {
  title: 'Tier 2: Branded/Video/VideoLayoutWrapper',
  component: VideoLayoutWrapper,
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
          'A layout wrapper component that integrates BackgroundVideo with BackgroundModeContext. Provides responsive video/image backgrounds with customizable overlays for content positioning. Ideal for hero sections, landing pages, and full-page layouts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    overlayOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Opacity of the overlay layer (0-1) for text readability',
      table: {
        defaultValue: { summary: '0.5' },
      },
    },
    overlayColor: {
      control: 'color',
      description: 'Color of the overlay layer (default: black)',
      table: {
        defaultValue: { summary: 'black' },
      },
    },
    desktopVideoUrl: {
      control: 'text',
      description: 'Desktop video URL (1920x1080)',
    },
    mobileVideoUrl: {
      control: 'text',
      description: 'Mobile video URL (optimized for smaller screens)',
    },
    desktopImageUrl: {
      control: 'text',
      description: 'Desktop image URL (for image mode)',
    },
    mobileImageUrl: {
      control: 'text',
      description: 'Mobile image URL (for image mode)',
    },
    children: {
      description: 'Content to render above the background video',
      control: false,
    },
  },
} satisfies Meta<typeof VideoLayoutWrapper>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default Layout - Basic content over video background
 *
 * Shows the typical VideoLayoutWrapper usage:
 * - Video background with default overlay (0.5 opacity)
 * - Simple text content on top
 * - Responsive to BackgroundModeProvider state
 */
export const Default: Story = {
  args: {
    overlayOpacity: 0.5,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <BackgroundModeProvider>
        <div className="relative w-full h-screen overflow-hidden">
          <Story>
            <div className="relative h-full flex items-center justify-center z-10">
              <div className="text-center max-w-2xl px-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Video Layout Wrapper
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Combine responsive backgrounds with flexible content layouts
                </p>
                <Button className="bg-primary text-white hover:bg-primary/80">
                  Get Started
                </Button>
              </div>
            </div>
          </Story>
        </div>
      </BackgroundModeProvider>
    ),
  ],
}

/**
 * No Overlay - Maximum background visibility
 *
 * Demonstrates zero overlay opacity:
 * - overlayOpacity: 0 for full background visibility
 * - Suitable for brightly lit videos
 * - Only vignette effect applied
 */
export const NoOverlay: Story = {
  args: {
    overlayOpacity: 0,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <BackgroundModeProvider>
        <div className="relative w-full h-screen overflow-hidden">
          <Story>
            <div className="relative h-full flex items-center justify-center z-10">
              <div className="text-center max-w-2xl px-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  No Overlay
                </h1>
                <p className="text-xl text-white/90 drop-shadow">
                  Full background visibility with drop shadow text
                </p>
              </div>
            </div>
          </Story>
        </div>
      </BackgroundModeProvider>
    ),
  ],
}

/**
 * Light Overlay (0.3) - Recommended for most content
 *
 * Optimal overlay configuration:
 * - overlayOpacity: 0.3 for balanced visibility
 * - Good for standard text content
 * - Preserves background details while ensuring readability
 */
export const LightOverlay: Story = {
  args: {
    overlayOpacity: 0.3,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <BackgroundModeProvider>
        <div className="relative w-full h-screen overflow-hidden">
          <Story>
            <div className="relative h-full flex items-center justify-center z-10">
              <div className="text-center max-w-2xl px-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  Light Overlay
                </h1>
                <p className="text-xl text-white/90 mb-6">Opacity: 0.3 (Recommended)</p>
                <Badge variant="secondary" className="inline-block">Optimal for most content</Badge>
              </div>
            </div>
          </Story>
        </div>
      </BackgroundModeProvider>
    ),
  ],
}

/**
 * Medium Overlay (0.6) - Strong text contrast
 *
 * Heavy overlay configuration:
 * - overlayOpacity: 0.6 for maximum contrast
 * - Ensures text legibility on any background
 * - Good for dense text content and complex layouts
 */
export const MediumOverlay: Story = {
  args: {
    overlayOpacity: 0.6,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <BackgroundModeProvider>
        <div className="relative w-full h-screen overflow-hidden">
          <Story>
            <div className="relative h-full flex items-center justify-center z-10">
              <div className="text-center max-w-2xl px-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  Medium Overlay
                </h1>
                <p className="text-xl text-white/90">Opacity: 0.6 (Maximum Contrast)</p>
              </div>
            </div>
          </Story>
        </div>
      </BackgroundModeProvider>
    ),
  ],
}

/**
 * Dark Overlay (0.9) - Extreme contrast
 *
 * Maximum overlay opacity:
 * - overlayOpacity: 0.9 for darkest readability
 * - Useful for video backgrounds with high visual complexity
 * - Background becomes almost invisible
 */
export const DarkOverlay: Story = {
  args: {
    overlayOpacity: 0.9,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <BackgroundModeProvider>
        <div className="relative w-full h-screen overflow-hidden">
          <Story>
            <div className="relative h-full flex items-center justify-center z-10">
              <div className="text-center max-w-2xl px-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  Dark Overlay
                </h1>
                <p className="text-xl text-white/90">Opacity: 0.9 (Extreme Contrast)</p>
              </div>
            </div>
          </Story>
        </div>
      </BackgroundModeProvider>
    ),
  ],
}

/**
 * Blue Overlay - Custom color overlay
 *
 * Demonstrates colored overlay effect:
 * - overlayColor: 'rgba(59, 130, 246, 1)' for blue tint
 * - Creates branded aesthetic
 * - Useful for themed sections or brand consistency
 */
export const BlueOverlay: Story = {
  args: {
    overlayOpacity: 0.4,
    overlayColor: 'rgba(59, 130, 246, 1)',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <BackgroundModeProvider>
        <div className="relative w-full h-screen overflow-hidden">
          <Story>
            <div className="relative h-full flex items-center justify-center z-10">
              <div className="text-center max-w-2xl px-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  Blue Overlay
                </h1>
                <p className="text-xl text-white/90">Custom color: rgba(59, 130, 246, 1)</p>
              </div>
            </div>
          </Story>
        </div>
      </BackgroundModeProvider>
    ),
  ],
}

/**
 * Cyan Overlay - Ozean Licht brand color
 *
 * Brand-themed overlay:
 * - overlayColor: 'rgba(0, 200, 200, 1)' for cyan/turquoise tint
 * - Aligns with Ozean Licht design system
 * - Creates ocean-inspired aesthetic
 */
export const CyanOverlay: Story = {
  args: {
    overlayOpacity: 0.35,
    overlayColor: 'rgba(0, 200, 200, 1)',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <BackgroundModeProvider>
        <div className="relative w-full h-screen overflow-hidden">
          <Story>
            <div className="relative h-full flex items-center justify-center z-10">
              <div className="text-center max-w-2xl px-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  Cyan Overlay
                </h1>
                <p className="text-xl text-white/90">Ozean Licht brand color</p>
              </div>
            </div>
          </Story>
        </div>
      </BackgroundModeProvider>
    ),
  ],
}

/**
 * Purple Overlay - Spiritual theme
 *
 * Spiritual-themed overlay:
 * - overlayColor: 'rgba(147, 51, 234, 1)' for purple tint
 * - Enhances mystical atmosphere
 * - Good for meditation or transformation content
 */
export const PurpleOverlay: Story = {
  args: {
    overlayOpacity: 0.35,
    overlayColor: 'rgba(147, 51, 234, 1)',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <BackgroundModeProvider>
        <div className="relative w-full h-screen overflow-hidden">
          <Story>
            <div className="relative h-full flex items-center justify-center z-10">
              <div className="text-center max-w-2xl px-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  Purple Overlay
                </h1>
                <p className="text-xl text-white/90">Spiritual theme color</p>
              </div>
            </div>
          </Story>
        </div>
      </BackgroundModeProvider>
    ),
  ],
}

/**
 * Card Content Over Video - Structured content layout
 *
 * Demonstrates card-based content:
 * - InfoCard-like components layered on top
 * - Multiple content cards in a grid
 * - Typical use case for feature showcases
 */
export const CardContentOverVideo: Story = {
  args: {
    overlayOpacity: 0.5,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <BackgroundModeProvider>
        <div className="relative w-full min-h-screen overflow-hidden">
          <Story>
            <div className="relative z-10 min-h-screen py-20 px-6 flex flex-col items-center justify-center">
              <div className="text-center mb-16 max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Unsere Angebote
                </h1>
                <p className="text-xl text-white/80">
                  Transformative Kurse und spirituelle Praktiken
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                {/* Card 1 */}
                <Card className="bg-[#0A1A1A]/80 backdrop-blur-sm border-[#0E282E] hover:border-primary/50 transition-all p-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-3">Meditation</h3>
                  <p className="text-white/70 text-center text-sm">
                    Tiefe Meditationspraktiken zur Erleuchtung und innerer Ruhe
                  </p>
                </Card>

                {/* Card 2 */}
                <Card className="bg-[#0A1A1A]/80 backdrop-blur-sm border-[#0E282E] hover:border-primary/50 transition-all p-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-3">Transformation</h3>
                  <p className="text-white/70 text-center text-sm">
                    Persönliche Transformationskurse für deine Entwicklung
                  </p>
                </Card>

                {/* Card 3 */}
                <Card className="bg-[#0A1A1A]/80 backdrop-blur-sm border-[#0E282E] hover:border-primary/50 transition-all p-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Lightbulb className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-3">Wisdom</h3>
                  <p className="text-white/70 text-center text-sm">
                    Alte Weisheit für moderne spirituelle Praktiken
                  </p>
                </Card>
              </div>

              <div className="mt-12">
                <Button className="bg-primary text-white hover:bg-primary/80 gap-2">
                  Alle Kurse entdecken
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Story>
        </div>
      </BackgroundModeProvider>
    ),
  ],
}

/**
 * Full Page Layout with Header and Footer
 *
 * Comprehensive layout example:
 * - Fixed header with navigation
 * - Video background for main content area
 * - Full-width footer
 * - Realistic application structure
 */
export const FullPageLayoutWithHeaderFooter: Story = {
  args: {
    overlayOpacity: 0.4,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <BackgroundModeProvider>
        <div className="flex flex-col h-screen bg-[#00070F]">
          {/* Fixed Header */}
          <header className="fixed top-0 left-0 right-0 h-16 bg-[#0A1A1A]/95 backdrop-blur-md border-b border-[#0E282E] z-20 flex items-center px-6">
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-primary">Ozean Licht</h1>
              <nav className="hidden md:flex gap-8">
                <a href="#" className="text-white/80 hover:text-white transition">
                  Home
                </a>
                <a href="#" className="text-white/80 hover:text-white transition">
                  Kurse
                </a>
                <a href="#" className="text-white/80 hover:text-white transition">
                  Über uns
                </a>
                <a href="#" className="text-white/80 hover:text-white transition">
                  Kontakt
                </a>
              </nav>
              <Button className="bg-primary text-white hover:bg-primary/80">Sign In</Button>
            </div>
          </header>

          {/* Main Content with Video Background */}
          <div className="flex-1 mt-16 relative overflow-hidden">
            <Story>
              <div className="relative h-full flex items-center justify-center z-10">
                <div className="text-center max-w-3xl px-6">
                  <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">
                    Spirituelle Erweckung
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 mb-12">
                    Transformiere dein Leben durch tiefe spirituelle Praktiken und universelle Weisheit
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-primary text-white hover:bg-primary/80 px-8 py-3 text-lg">
                      Jetzt beginnen
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
                    >
                      Mehr erfahren
                    </Button>
                  </div>
                </div>
              </div>
            </Story>
          </div>

          {/* Footer */}
          <footer className="relative bg-[#0A1A1A]/95 backdrop-blur-md border-t border-[#0E282E] py-12 px-6 z-10">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="text-white font-bold mb-4">Ozean Licht</h3>
                  <p className="text-white/60 text-sm">
                    Ihr Weg zur spirituellen Transformation
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Produkte</h4>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li>
                      <a href="#" className="hover:text-primary transition">
                        Kurse
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-primary transition">
                        Workshops
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Unternehmen</h4>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li>
                      <a href="#" className="hover:text-primary transition">
                        Über uns
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-primary transition">
                        Kontakt
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Rechtliches</h4>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li>
                      <a href="#" className="hover:text-primary transition">
                        Datenschutz
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-primary transition">
                        Impressum
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-[#0E282E] pt-8">
                <p className="text-white/60 text-sm text-center">
                  Copyright 2025 Ozean Licht. Alle Rechte vorbehalten.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </BackgroundModeProvider>
    ),
  ],
}

/**
 * Course Card Layout - Educational content showcase
 *
 * Demonstrates course-style cards:
 * - Course info with icons and descriptions
 * - Multiple content cards in responsive grid
 * - Includes call-to-action buttons
 */
export const CourseCardLayout: Story = {
  args: {
    overlayOpacity: 0.45,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <BackgroundModeProvider>
        <div className="relative w-full min-h-screen overflow-hidden">
          <Story>
            <div className="relative z-10 min-h-screen py-24 px-6">
              <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    Populäre Kurse
                  </h1>
                  <p className="text-xl text-white/80">
                    Wähle aus unseren umfassenden spirituellen Kursen
                  </p>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Course Card 1 */}
                  <Card className="bg-gradient-to-br from-[#0A1A1A]/90 to-[#050F0F]/90 backdrop-blur-md border border-primary/20 overflow-hidden hover:border-primary/50 transition-all group">
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-primary/40 group-hover:text-primary/60 transition-colors" />
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Meditation für Anfänger
                        </h3>
                        <p className="text-white/70 text-sm">
                          Lerne die Grundlagen der Meditation und Achtsamkeit
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-white/60 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>6 Wochen</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>500+ Teilnehmer</span>
                        </div>
                      </div>
                      <div className="pt-4">
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                          Anfänger
                        </Badge>
                      </div>
                      <Button className="w-full bg-primary text-white hover:bg-primary/80">
                        Kurs beitreten
                      </Button>
                    </div>
                  </Card>

                  {/* Course Card 2 */}
                  <Card className="bg-gradient-to-br from-[#0A1A1A]/90 to-[#050F0F]/90 backdrop-blur-md border border-primary/20 overflow-hidden hover:border-primary/50 transition-all group">
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Heart className="w-16 h-16 text-primary/40 group-hover:text-primary/60 transition-colors" />
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Selbstliebe und Heilung
                        </h3>
                        <p className="text-white/70 text-sm">
                          Transformiere deine Beziehung zu dir selbst
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-white/60 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>8 Wochen</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>350+ Teilnehmer</span>
                        </div>
                      </div>
                      <div className="pt-4">
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                          Mittelstufe
                        </Badge>
                      </div>
                      <Button className="w-full bg-primary text-white hover:bg-primary/80">
                        Kurs beitreten
                      </Button>
                    </div>
                  </Card>

                  {/* Course Card 3 */}
                  <Card className="bg-gradient-to-br from-[#0A1A1A]/90 to-[#050F0F]/90 backdrop-blur-md border border-primary/20 overflow-hidden hover:border-primary/50 transition-all group">
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Trophy className="w-16 h-16 text-primary/40 group-hover:text-primary/60 transition-colors" />
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Fortgeschrittene Praktiken
                        </h3>
                        <p className="text-white/70 text-sm">
                          Vertiefte spirituelle Techniken für Erfahrene
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-white/60 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>12 Wochen</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>200+ Teilnehmer</span>
                        </div>
                      </div>
                      <div className="pt-4">
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                          Fortgeschritten
                        </Badge>
                      </div>
                      <Button className="w-full bg-primary text-white hover:bg-primary/80">
                        Kurs beitreten
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </Story>
        </div>
      </BackgroundModeProvider>
    ),
  ],
}

/**
 * Interactive Overlay Controls Demo
 *
 * Demonstrates interactive control of overlay opacity:
 * - Allows adjustment of overlay in real-time
 * - Shows how changing props updates appearance
 * - Interactive controls for transparency testing
 */
export const InteractiveOverlayDemo: Story = {
  args: {
    overlayOpacity: 0.5,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <BackgroundModeProvider>
        <div className="relative w-full h-screen overflow-hidden">
          <Story>
            <div className="relative h-full flex flex-col items-center justify-center z-10 px-6">
              <div className="text-center max-w-2xl mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Interactive Overlay Demo
                </h1>
                <p className="text-xl text-white/90">
                  Adjust the overlay opacity using the Storybook controls
                </p>
              </div>

              <Card className="bg-[#0A1A1A]/90 backdrop-blur-md border border-primary/30 p-8 max-w-md w-full">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-white/80 mb-3">
                      Current Settings
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-primary/10 rounded p-3">
                        <p className="text-xs text-white/60 mb-1">Overlay Opacity</p>
                        <p className="text-lg font-bold text-primary">{Story.args?.overlayOpacity || '0.5'}</p>
                      </div>
                      <div className="bg-primary/10 rounded p-3">
                        <p className="text-xs text-white/60 mb-1">Overlay Color</p>
                        <div className="w-full h-6 rounded bg-black/50 border border-primary/30" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded p-4">
                    <p className="text-sm text-primary/90">
                      Use the controls panel in Storybook to adjust the overlay opacity (0-1) and see real-time
                      changes to the background visibility.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </Story>
        </div>
      </BackgroundModeProvider>
    ),
  ],
}

/**
 * Responsive Media Selection - Shows mobile vs desktop behavior
 *
 * Demonstrates responsive behavior:
 * - Different video URLs for mobile and desktop
 * - Text size scales responsively
 * - Layout adapts to viewport width
 * - Can test by resizing browser
 */
export const ResponsiveMediaSelection: Story = {
  args: {
    overlayOpacity: 0.3,
    overlayColor: 'black',
    desktopVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
    mobileVideoUrl: 'https://videos.pexels.com/video-files/3741334/3741334-sd_640_360_25fps.mp4',
  },
  decorators: [
    (Story) => (
      <BackgroundModeProvider>
        <div className="relative w-full h-screen overflow-hidden">
          <Story>
            <div className="relative h-full flex items-center justify-center z-10 px-6">
              <div className="text-center max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Responsive Video Selection
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8">
                  Try resizing your browser to see how media URLs adapt
                </p>

                <Card className="bg-[#0A1A1A]/90 backdrop-blur-md border border-primary/30 p-8 mb-8">
                  <div className="space-y-4 text-left">
                    <div>
                      <p className="text-sm text-white/60 mb-2">Desktop Breakpoint</p>
                      <p className="text-white font-mono text-xs bg-[#050F0F] p-3 rounded border border-[#0E282E]">
                        width: {typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60 mb-2">Media Selection Logic</p>
                      <div className="bg-[#050F0F] p-4 rounded border border-[#0E282E] text-left text-xs text-white/80 space-y-2">
                        <p>if (width {'>'}= 1024px)</p>
                        <p className="text-primary ml-4">Use desktop video URL</p>
                        <p>else</p>
                        <p className="text-primary ml-4">Use mobile video URL</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Badge variant="secondary">Responsive Design Demo</Badge>
              </div>
            </div>
          </Story>
        </div>
      </BackgroundModeProvider>
    ),
  ],
}
