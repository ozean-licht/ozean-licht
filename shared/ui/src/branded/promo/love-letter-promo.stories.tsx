import type { Meta, StoryObj } from '@storybook/react'
import { LoveLetterPromo } from './love-letter-promo'

/**
 * LoveLetterPromo - Newsletter promotion section with image, badges, and CTA.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **Two-Column Layout**: Image on left, content on right (responsive)
 * - **Feature Badges**: Display up to 3 feature badges with icons
 * - **Glass Card**: Image wrapped in dark glass card with border
 * - **Cinzel Decorative Title**: Large, elegant title font
 * - **Call-to-Action Button**: Primary CTA button with gradient
 * - **Responsive Design**: Stacks on mobile, side-by-side on desktop
 *
 * ## Available Badge Icons
 * - **moon** - Lunar/cyclical content
 * - **star** - Featured/highlighted content
 * - **heart** - Love/affection related
 * - **lightbulb** - Insights/wisdom
 * - **magicwand** - Mystical/magical content
 * - **users** - Community/group content
 * - **feedback** - Messages/communication
 * - **sparkle** - Special/premium content
 *
 * ## Usage
 * Use for newsletter signup sections, promotional content, and feature highlights on the Ozean Licht platform.
 * Perfect for Love Letter newsletter or similar content-focused promotions.
 */
const meta = {
  title: 'Tier 2: Branded/Promo/LoveLetterPromo',
  component: LoveLetterPromo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A promotional section component for the Love Letter newsletter with image, description, feature badges, and call-to-action.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    imageUrl: {
      control: 'text',
      description: 'Promo image URL (WebP recommended)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '/images/love-letter-promo.webp' },
      },
    },
    title: {
      control: 'text',
      description: 'Section title',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Love Letter' },
      },
    },
    description: {
      control: 'text',
      description: 'Description text (supports long content)',
    },
    buttonText: {
      control: 'text',
      description: 'Call-to-action button text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Beitrag einreichen →' },
      },
    },
    buttonHref: {
      control: 'text',
      description: 'Button link destination',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '/love-letter' },
      },
    },
    badges: {
      control: false,
      description: 'Array of feature badges with icon and text',
      table: {
        type: { summary: 'Array<{ icon: string; text: string }>' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof LoveLetterPromo>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default Love Letter newsletter promo with all default content and badges.
 */
export const Default: Story = {
  args: {
    imageUrl: '/images/love-letter-promo.webp',
    title: 'Love Letter',
    description: 'Möchtest du regelmäßig sanfte Wellen der Inspiration empfangen, die dein inneres Licht nähren? Unser Love Letter bringt dir Erkenntnisse, praktische Übungen und herzöffnende Gedanken direkt in deinen digitalen Raum – wie eine Botschaft aus der kosmischen Heimat.',
    buttonText: 'Beitrag einreichen →',
    buttonHref: '/love-letter',
    badges: [
      { icon: 'moon', text: 'Alle 3 Monde' },
      { icon: 'star', text: 'Community Beiträge' },
      { icon: 'heart', text: 'Love to Go' },
    ],
  },
}

/**
 * Custom badges with different icons and text.
 */
export const CustomBadges: Story = {
  args: {
    imageUrl: '/images/love-letter-promo.webp',
    title: 'Love Letter',
    description: 'Möchtest du regelmäßig sanfte Wellen der Inspiration empfangen, die dein inneres Licht nähren? Unser Love Letter bringt dir Erkenntnisse, praktische Übungen und herzöffnende Gedanken direkt in deinen digitalen Raum – wie eine Botschaft aus der kosmischen Heimat.',
    buttonText: 'Beitrag einreichen →',
    buttonHref: '/love-letter',
    badges: [
      { icon: 'sparkle', text: 'Exklusive Inhalte' },
      { icon: 'lightbulb', text: 'Praktische Übungen' },
      { icon: 'users', text: '5.000+ Abonnenten' },
    ],
  },
}

/**
 * Different image with alternative content.
 */
export const AlternativeImage: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=600&fit=crop',
    title: 'Love Letter',
    description: 'Tauche ein in eine Welt voller Spiritualität und Weisheit. Unser Love Letter Newsletter ist dein persönlicher Begleiter auf der Reise zu innerer Erfüllung und kosmischem Verständnis.',
    buttonText: 'Jetzt Anmelden',
    buttonHref: '/subscribe',
    badges: [
      { icon: 'heart', text: 'Liebevoll verfasst' },
      { icon: 'star', text: 'Premium Qualität' },
      { icon: 'moon', text: 'Monatsweise' },
    ],
  },
}

/**
 * Single badge variant (minimal design).
 */
export const SingleBadge: Story = {
  args: {
    imageUrl: '/images/love-letter-promo.webp',
    title: 'Love Letter',
    description: 'Erhalte regelmäßig inspirierende Inhalte direkt in dein Postfach. Ein Newsletter für Spiritualität, persönliche Entwicklung und kosmisches Wissen.',
    buttonText: 'Newsletter abonnieren',
    buttonHref: '/newsletter',
    badges: [{ icon: 'heart', text: 'Mit Liebe geschrieben' }],
  },
}

/**
 * Custom call-to-action button text.
 */
export const CustomCallToAction: Story = {
  args: {
    imageUrl: '/images/love-letter-promo.webp',
    title: 'Love Letter',
    description: 'Möchtest du regelmäßig sanfte Wellen der Inspiration empfangen, die dein inneres Licht nähren? Unser Love Letter bringt dir Erkenntnisse, praktische Übungen und herzöffnende Gedanken direkt in deinen digitalen Raum – wie eine Botschaft aus der kosmischen Heimat.',
    buttonText: 'Jetzt kostenlos abonnieren',
    buttonHref: '/love-letter/subscribe',
    badges: [
      { icon: 'moon', text: 'Alle 3 Monde' },
      { icon: 'star', text: 'Community Beiträge' },
      { icon: 'heart', text: 'Love to Go' },
    ],
  },
}

/**
 * Different title variation.
 */
export const CustomTitle: Story = {
  args: {
    imageUrl: '/images/love-letter-promo.webp',
    title: 'Kosmische Gedanken',
    description: 'Jedes Schreiben ist ein Geschenk - ein Funkenschlag aus dem Universum, der dein Sein berührt und dich näher zu deiner wahren Essenz führt. Lies Botschaften, die dein Herz öffnen.',
    buttonText: 'Mitglied werden',
    buttonHref: '/membership',
    badges: [
      { icon: 'sparkle', text: 'Transformativ' },
      { icon: 'heart', text: 'Authentisch' },
      { icon: 'star', text: 'Kraftvoll' },
    ],
  },
}

/**
 * Extended description with longer text.
 */
export const LongDescription: Story = {
  args: {
    imageUrl: '/images/love-letter-promo.webp',
    title: 'Love Letter',
    description: 'Möchtest du regelmäßig sanfte Wellen der Inspiration empfangen, die dein inneres Licht nähren? Unser Love Letter bringt dir Erkenntnisse, praktische Übungen und herzöffnende Gedanken direkt in deinen digitalen Raum – wie eine Botschaft aus der kosmischen Heimat.\n\nJedes Schreiben wird mit Hingabe verfasst und trägt die Energie der kosmischen Wahrheit in sich. Du erhältst nicht nur Worte, sondern Werkzeuge für deine persönliche Transformation und spirituelle Entfaltung.',
    buttonText: 'Jetzt anmelden und inspiriert werden',
    buttonHref: '/love-letter/signup',
    badges: [
      { icon: 'moon', text: 'Alle 3 Monde' },
      { icon: 'star', text: 'Community Beiträge' },
      { icon: 'heart', text: 'Love to Go' },
    ],
  },
}

/**
 * All available badge icons showcase in one component.
 */
export const AllBadgeIcons: Story = {
  render: () => (
    <LoveLetterPromo
      imageUrl="/images/love-letter-promo.webp"
      title="Love Letter - Alle Icons"
      description="Diese Variante zeigt alle verfügbaren Icons für die Feature Badges."
      buttonText="Ansehen"
      buttonHref="#"
      badges={[
        { icon: 'moon', text: 'Moon Icon' },
        { icon: 'star', text: 'Star Icon' },
        { icon: 'heart', text: 'Heart Icon' },
        { icon: 'lightbulb', text: 'Lightbulb Icon' },
        { icon: 'magicwand', text: 'Magic Wand Icon' },
        { icon: 'users', text: 'Users Icon' },
        { icon: 'feedback', text: 'Feedback Icon' },
        { icon: 'sparkle', text: 'Sparkle Icon' },
      ]}
    />
  ),
}

/**
 * Dark background container for contrast visualization.
 */
export const WithDarkBackground: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  args: {
    imageUrl: '/images/love-letter-promo.webp',
    title: 'Love Letter',
    description: 'Möchtest du regelmäßig sanfte Wellen der Inspiration empfangen, die dein inneres Licht nähren? Unser Love Letter bringt dir Erkenntnisse, praktische Übungen und herzöffnende Gedanken direkt in deinen digitalen Raum – wie eine Botschaft aus der kosmischen Heimat.',
    buttonText: 'Beitrag einreichen →',
    buttonHref: '/love-letter',
    badges: [
      { icon: 'moon', text: 'Alle 3 Monde' },
      { icon: 'star', text: 'Community Beiträge' },
      { icon: 'heart', text: 'Love to Go' },
    ],
  },
}

/**
 * Mobile responsive view (narrow viewport).
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    imageUrl: '/images/love-letter-promo.webp',
    title: 'Love Letter',
    description: 'Möchtest du regelmäßig sanfte Wellen der Inspiration empfangen, die dein inneres Licht nähren? Unser Love Letter bringt dir Erkenntnisse, praktische Übungen und herzöffnende Gedanken direkt in deinen digitalen Raum – wie eine Botschaft aus der kosmischen Heimat.',
    buttonText: 'Beitrag einreichen →',
    buttonHref: '/love-letter',
    badges: [
      { icon: 'moon', text: 'Alle 3 Monde' },
      { icon: 'star', text: 'Community Beiträge' },
      { icon: 'heart', text: 'Love to Go' },
    ],
  },
}

/**
 * Tablet responsive view (medium viewport).
 */
export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  args: {
    imageUrl: '/images/love-letter-promo.webp',
    title: 'Love Letter',
    description: 'Möchtest du regelmäßig sanfte Wellen der Inspiration empfangen, die dein inneres Licht nähren? Unser Love Letter bringt dir Erkenntnisse, praktische Übungen und herzöffnende Gedanken direkt in deinen digitalen Raum – wie eine Botschaft aus der kosmischen Heimat.',
    buttonText: 'Beitrag einreichen →',
    buttonHref: '/love-letter',
    badges: [
      { icon: 'moon', text: 'Alle 3 Monde' },
      { icon: 'star', text: 'Community Beiträge' },
      { icon: 'heart', text: 'Love to Go' },
    ],
  },
}

/**
 * Custom styling with className override.
 */
export const CustomStyling: Story = {
  args: {
    imageUrl: '/images/love-letter-promo.webp',
    title: 'Love Letter',
    description: 'Möchtest du regelmäßig sanfte Wellen der Inspiration empfangen, die dein inneres Licht nähren? Unser Love Letter bringt dir Erkenntnisse, praktische Übungen und herzöffnende Gedanken direkt in deinen digitalen Raum – wie eine Botschaft aus der kosmischen Heimat.',
    buttonText: 'Beitrag einreichen →',
    buttonHref: '/love-letter',
    badges: [
      { icon: 'moon', text: 'Alle 3 Monde' },
      { icon: 'star', text: 'Community Beiträge' },
      { icon: 'heart', text: 'Love to Go' },
    ],
    className: 'bg-gradient-to-br from-primary/5 to-transparent rounded-3xl',
  },
}
