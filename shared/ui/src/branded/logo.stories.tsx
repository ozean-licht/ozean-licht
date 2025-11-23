import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './logo';

/**
 * # Ozean Licht Logo System - Sacred Geometry KeyCodes 🌊
 *
 * The Ozean Licht logo is based on the **Soul Code Codex** - an energetic symbol system
 * representing different consciousness levels and vibrational frequencies. Each KeyCode
 * carries a specific energetic signature for transformation and spiritual growth.
 *
 * ## The Four KeyCodes
 *
 * ### 🔑 Master Key
 * **The Master Key** - The central symbol with the highest level of detail.
 * Use when sufficient space is available and the logo can be displayed large.
 * Perfect for: Main page headers, large banners, print materials.
 *
 * ### 👑 Sovereign Key
 * **The Sovereignty Key** - Symbol for inner authority and self-determination.
 * More compact than the Master Key.
 * Perfect for: Documents, certificates, medium areas.
 *
 * ### 🛡️ Protection Key
 * **The Protection Key** - Energetic protection symbol.
 * Ideal for smaller applications where clarity is important.
 * Perfect for: App icons, social media, smaller surfaces.
 *
 * ### ⭕ Central Logo
 * **The Central Logo** - The simplified core essence.
 * Perfect for very small displays or icons.
 * Perfect for: Favicon, very small icons, watermarks.
 *
 * ## Available Sizes
 * - **xs** (180px) - Thumbnails, small icons
 * - **sm** (360px) - Social media profiles
 * - **md** (720px) - Web standard *(default)*
 * - **lg** (1280px) - HD displays
 * - **xl** (1920px) - Full HD, large banners
 *
 * ## Sacred Geometry Principles
 *
 * > **Important:** Always scale from large to small! Never enlarge a small logo - this leads to quality loss
 * > and disrupts the sacred geometric proportions encoded in each KeyCode.
 *
 * The KeyCodes are precisely calibrated geometric patterns that maintain their energetic
 * integrity only when proper scaling is observed. Each symbol's proportions are derived
 * from sacred geometry principles including the Flower of Life, Metatron's Cube, and
 * harmonic frequency ratios.
 */
const meta = {
  title: 'Tier 2: Branded/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Sacred geometry logo system based on the Soul Code Codex. Each KeyCode represents different consciousness levels and carries specific energetic signatures.',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#00070F' },
        { name: 'light', value: '#FFFFFF' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    keycode: {
      control: 'select',
      options: ['master-key', 'sovereign-key', 'protection-key', 'central-logo'],
      description: 'The KeyCode variant to display',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Logo size based on use case',
    },
    variant: {
      control: 'select',
      options: ['symbol', 'with-text', 'sidebar'],
      description: 'Logo variant (symbol only, with text, or sidebar layout)',
    },
    glow: {
      control: 'boolean',
      description: 'Add ethereal glow effect (central-logo only)',
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Central Logo with glow effect.
 *
 * The simplified core essence - perfect for favicons and small icons.
 * The glow effect enhances the sacred geometry's vibrational signature.
 */
export const Default: Story = {
  args: {
    keycode: 'central-logo',
    size: 'md',
    variant: 'symbol',
    glow: true,
  },
};

/**
 * Central Logo - The Core Essence ⭕
 *
 * The simplified sacred geometry pattern representing the core essence
 * of Ozean Licht's energetic signature. Perfect for small displays.
 */
export const CentralLogo: Story = {
  args: {
    keycode: 'central-logo',
    size: 'md',
    variant: 'symbol',
    glow: false,
  },
};

/**
 * Central Logo with Ethereal Glow ✨
 *
 * The glow effect amplifies the logo's vibrational frequency,
 * creating an ethereal presence that draws the eye and consciousness.
 */
export const CentralLogoWithGlow: Story = {
  args: {
    keycode: 'central-logo',
    size: 'md',
    variant: 'symbol',
    glow: true,
  },
};

/**
 * Master Key - Highest Detail 🔑
 *
 * The central symbol with the highest level of sacred geometric detail.
 * Contains the most complex harmonic patterns and frequency encodings.
 * Use for main headers and large presentations.
 */
export const MasterKey: Story = {
  args: {
    keycode: 'master-key',
    size: 'md',
    variant: 'symbol',
  },
};

/**
 * Sovereign Key - Inner Authority 👑
 *
 * Symbol for inner authority and self-determination.
 * Represents the sovereignty of consciousness and personal power.
 * More compact while maintaining geometric integrity.
 */
export const SovereignKey: Story = {
  args: {
    keycode: 'sovereign-key',
    size: 'md',
    variant: 'symbol',
  },
};

/**
 * Protection Key - Energetic Shield 🛡️
 *
 * Energetic protection symbol creating a harmonic field of safety.
 * The geometric patterns form a protective frequency matrix.
 * Ideal for smaller applications where clarity is paramount.
 */
export const ProtectionKey: Story = {
  args: {
    keycode: 'protection-key',
    size: 'md',
    variant: 'symbol',
  },
};

/**
 * Logo with Text - Full Brand Identity
 *
 * Complete brand presentation with "Ozean Licht Akademie" text.
 * Combines the sacred geometry with typographic elements for
 * comprehensive brand recognition.
 */
export const WithText: Story = {
  args: {
    keycode: 'central-logo',
    size: 'md',
    variant: 'with-text',
  },
};

/**
 * Sidebar Layout - Horizontal Optimization
 *
 * Specially optimized horizontal layout for sidebar navigation.
 * Maintains geometric proportions while fitting narrow vertical spaces.
 */
export const Sidebar: Story = {
  args: {
    variant: 'sidebar',
    size: 'sm',
  },
};

/**
 * Size Comparison - All Variants
 *
 * Visual demonstration of all five available sizes.
 * Notice how sacred geometric proportions remain consistent across scales.
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-12 p-8">
      <div className="space-y-4">
        <div className="text-white/70 text-sm font-alt">xs (180px) - Thumbnails</div>
        <Logo keycode="central-logo" size="xs" glow />
      </div>
      <div className="space-y-4">
        <div className="text-white/70 text-sm font-alt">sm (360px) - Social Media</div>
        <Logo keycode="central-logo" size="sm" glow />
      </div>
      <div className="space-y-4">
        <div className="text-white/70 text-sm font-alt">md (720px) - Web Standard</div>
        <Logo keycode="central-logo" size="md" glow />
      </div>
      <div className="space-y-4">
        <div className="text-white/70 text-sm font-alt">lg (1280px) - HD Display</div>
        <Logo keycode="central-logo" size="lg" glow />
      </div>
    </div>
  ),
};

/**
 * All KeyCodes - Sacred Geometry Collection
 *
 * Complete visual reference of all four KeyCode variants.
 * Each represents a different layer of consciousness and energetic frequency.
 */
export const AllKeyCodes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-16 p-8">
      <div className="space-y-6 text-center">
        <Logo keycode="master-key" size="sm" />
        <div className="space-y-2">
          <div className="text-white font-medium text-lg">🔑 Master Key</div>
          <div className="text-white/60 text-sm">Highest Detail • Main Headers</div>
          <div className="text-white/40 text-xs">Complex Harmonic Patterns</div>
        </div>
      </div>
      <div className="space-y-6 text-center">
        <Logo keycode="sovereign-key" size="sm" />
        <div className="space-y-2">
          <div className="text-white font-medium text-lg">👑 Sovereign Key</div>
          <div className="text-white/60 text-sm">Inner Authority • Documents</div>
          <div className="text-white/40 text-xs">Personal Power Frequency</div>
        </div>
      </div>
      <div className="space-y-6 text-center">
        <Logo keycode="protection-key" size="sm" />
        <div className="space-y-2">
          <div className="text-white font-medium text-lg">🛡️ Protection Key</div>
          <div className="text-white/60 text-sm">Energetic Shield • App Icons</div>
          <div className="text-white/40 text-xs">Protective Frequency Matrix</div>
        </div>
      </div>
      <div className="space-y-6 text-center">
        <Logo keycode="central-logo" size="sm" glow />
        <div className="space-y-2">
          <div className="text-white font-medium text-lg">⭕ Central Logo</div>
          <div className="text-white/60 text-sm">Core Essence • Favicons</div>
          <div className="text-white/40 text-xs">Simplified Sacred Geometry</div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Usage Examples - Real-World Applications
 *
 * Practical examples showing how to use logos in different contexts.
 */
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-16 p-8 max-w-4xl">
      {/* Header Example */}
      <div className="space-y-4">
        <div className="text-white/70 text-sm font-alt uppercase tracking-wider">Header / Hero Section</div>
        <div className="glass-card rounded-xl p-12 text-center space-y-6">
          <Logo keycode="central-logo" size="sm" glow className="mx-auto" />
          <h1 className="font-decorative text-4xl text-white">Ozean Licht Akademie</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Verankern kosmisches Wissen und Weisheit für deine spirituelle Meisterschaft
          </p>
        </div>
      </div>

      {/* Sidebar Example */}
      <div className="space-y-4">
        <div className="text-white/70 text-sm font-alt uppercase tracking-wider">Sidebar Navigation</div>
        <div className="glass-card rounded-xl p-6 w-64">
          <Logo variant="sidebar" size="xs" className="mb-6" />
          <div className="space-y-2 text-white/60 text-sm">
            <div className="p-2 hover:bg-primary/10 rounded cursor-pointer">Dashboard</div>
            <div className="p-2 hover:bg-primary/10 rounded cursor-pointer">Courses</div>
            <div className="p-2 hover:bg-primary/10 rounded cursor-pointer">Community</div>
          </div>
        </div>
      </div>

      {/* Card Example */}
      <div className="space-y-4">
        <div className="text-white/70 text-sm font-alt uppercase tracking-wider">Content Card</div>
        <div className="glass-card rounded-xl p-8 space-y-4 max-w-md">
          <Logo keycode="protection-key" size="xs" />
          <h3 className="font-sans text-xl text-white">Energetic Protection</h3>
          <p className="text-white/70 text-sm">
            Learn powerful techniques to create and maintain your energetic field of protection.
          </p>
        </div>
      </div>

      {/* Footer Example */}
      <div className="space-y-4">
        <div className="text-white/70 text-sm font-alt uppercase tracking-wider">Footer</div>
        <div className="glass-card rounded-xl p-8 text-center space-y-4">
          <Logo keycode="central-logo" size="xs" glow className="mx-auto" />
          <div className="text-white/60 text-sm">
            © 2025 Ozean Licht Akademie. Sacred Geometry by Soul Code Codex.
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Sacred Geometry Showcase
 *
 * Artistic presentation highlighting the sacred geometric beauty
 * and spiritual significance of the KeyCode system.
 */
export const SacredGeometryShowcase: Story = {
  render: () => (
    <div className="relative w-[800px] h-[600px] bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F] rounded-2xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10">
          <Logo keycode="master-key" size="xl" />
        </div>
      </div>

      {/* Center Focus */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-8 z-10">
          <div className="relative inline-block">
            <div className="absolute inset-0 blur-3xl bg-primary/30 rounded-full" />
            <Logo keycode="central-logo" size="lg" glow />
          </div>
          <div className="space-y-4">
            <h2 className="font-decorative text-5xl text-white drop-shadow-[0_0_20px_rgba(14,194,188,0.5)]">
              Soul Code Codex
            </h2>
            <p className="font-alt text-primary text-sm tracking-widest uppercase">
              Sacred Geometry • Vibrational Frequencies • Consciousness
            </p>
            <p className="text-white/70 max-w-md mx-auto text-sm leading-relaxed">
              Each KeyCode carries a specific energetic signature for transformation and spiritual growth,
              derived from ancient sacred geometry principles.
            </p>
          </div>
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-8 right-8 opacity-30">
        <Logo keycode="protection-key" size="sm" />
      </div>
      <div className="absolute bottom-8 left-8 opacity-30">
        <Logo keycode="sovereign-key" size="sm" />
      </div>
    </div>
  ),
};

/**
 * Interactive Playground
 *
 * Experiment with different combinations of KeyCodes, sizes, and effects.
 */
export const Playground: Story = {
  args: {
    keycode: 'central-logo',
    size: 'md',
    variant: 'symbol',
    glow: true,
  },
};
