import type { Meta, StoryObj } from '@storybook/react';
import { PartnerDealPromo } from './partner-deal-promo';

/**
 * PartnerDealPromo - Partner deal promotional section component.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **Decorative Badge**: Top span design with elegant theme
 * - **Cinzel Decorative Font**: Large, elegant heading for partners
 * - **Feature Badges**: Display partner benefits with icons (heart, users, sparkles)
 * - **Centered Layout**: All content centered for visual emphasis
 * - **Promo Image**: Centered image with decorative border
 * - **CTA Button**: High-impact call-to-action for conversion
 * - **Responsive**: Adapts to all screen sizes
 * - **German Content**: Couples/partners-focused messaging
 *
 * ## Props
 * - **imageUrl**: string - URL to partner deal promo image
 * - **title**: string - Section heading (couples/partners theme)
 * - **description**: string - Detailed description of the partner offer
 * - **buttonText**: string - CTA button label
 * - **buttonHref**: string - CTA button link destination
 * - **topBadgeText**: string - Decorative top badge text
 * - **badges**: Array - Feature badges with icon and text
 * - **className**: string - Additional CSS classes
 *
 * ## Badge Icons
 * Standard icons: heart, users, sparkles, star, gift, flame, etc.
 *
 * ## Usage
 * Use for displaying partner deal promotions on the Ozean Licht platform,
 * targeting couples seeking to share courses and spiritual growth together.
 */
const meta = {
  title: 'Tier 2: Branded/PartnerDealPromo',
  component: PartnerDealPromo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A promotional section component designed for partner/couple deals with elegant centering, decorative elements, and high-impact CTA.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    imageUrl: {
      control: 'text',
      description: 'URL to the promo image',
      table: {
        defaultValue: { summary: '/images/partner-deal-cover.webp' },
      },
    },
    title: {
      control: 'text',
      description: 'Main heading for the promo section',
      table: {
        defaultValue: { summary: 'Partner Special Deal' },
      },
    },
    description: {
      control: 'text',
      description: 'Description text (supports multi-line with \\n)',
      table: {
        defaultValue: { summary: 'Du hast eine/n Partner/in mit dem du die Kurse teilen möchtest?\\nDieses Angebot ist für euch!' },
      },
    },
    buttonText: {
      control: 'text',
      description: 'CTA button text',
      table: {
        defaultValue: { summary: 'Zum Partner Deal →' },
      },
    },
    buttonHref: {
      control: 'text',
      description: 'CTA button link destination',
      table: {
        defaultValue: { summary: '/partner-deal' },
      },
    },
    topBadgeText: {
      control: 'text',
      description: 'Decorative badge text above heading',
      table: {
        defaultValue: { summary: 'Für deinen Seelenpartner' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof PartnerDealPromo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default partner deal promo with all standard content.
 */
export const Default: Story = {
  args: {
    imageUrl: '/images/partner-deal-cover.webp',
    title: 'Partner Special Deal',
    description: 'Du hast eine/n Partner/in mit dem du die Kurse teilen möchtest?\nDieses Angebot ist für euch!',
    buttonText: 'Zum Partner Deal →',
    buttonHref: '/partner-deal',
    topBadgeText: 'Für deinen Seelenpartner',
    badges: [
      { icon: 'heart', text: 'Gemeinsam Wachsen' },
      { icon: 'users', text: 'Für Paare' },
      { icon: 'sparkles', text: 'Sonderpreis' },
    ],
  },
};

/**
 * Custom badges variant with different benefits highlighted.
 */
export const CustomBadges: Story = {
  args: {
    imageUrl: '/images/partner-deal-cover.webp',
    title: 'Partner Kurs Angebot',
    description: 'Teile deine spirituelle Reise mit deinem Partner und genießt exklusive Vorteile zusammen.',
    buttonText: 'Zum Angebot →',
    buttonHref: '/partner-deal',
    topBadgeText: 'Spezial für Paare',
    badges: [
      { icon: 'gift', text: '50% Rabatt für 2' },
      { icon: 'flame', text: 'Tiefere Verbindung' },
      { icon: 'star', text: 'Premium Zugang' },
    ],
  },
};

/**
 * Premium tier variant with higher-value messaging.
 */
export const PremiumTier: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1516966556100-bc8057e05b22?w=600&h=400&fit=crop',
    title: 'Premium Couple Experience',
    description: 'Für soulmates die zusammen wachsen möchten.\nExklusive Master-Level Kurse für zwei Personen.',
    buttonText: 'Premium Partner Abo →',
    buttonHref: '/premium/partner-deal',
    topBadgeText: 'Für Seelenpartner',
    badges: [
      { icon: 'heart', text: 'Seelenverbindung' },
      { icon: 'sparkles', text: 'Meditationen zu Zweit' },
      { icon: 'star', text: 'VIP Support' },
    ],
  },
};

/**
 * Simple messaging variant with minimal badges.
 */
export const SimplifiedMessage: Story = {
  args: {
    imageUrl: '/images/partner-deal-cover.webp',
    title: 'Gemeinsam Wachsen',
    description: 'Das perfekte Angebot für Paare die ihre spirituelle Reise zusammen gestalten möchten.',
    buttonText: 'Mehr Infos →',
    buttonHref: '/partnership',
    topBadgeText: 'Für zwei Herzen',
    badges: [
      { icon: 'heart', text: 'Zusammen Stärker' },
      { icon: 'users', text: 'Partner Package' },
    ],
  },
};

/**
 * Longer description variant showcasing multi-line text support.
 */
export const LongDescription: Story = {
  args: {
    imageUrl: '/images/partner-deal-cover.webp',
    title: 'Gemeinsame Transformation für Paare',
    description: 'Du suchst nach einer Möglichkeit, deine spirituelle Reise mit deinem Partner zu teilen?\nUnsere exklusiven Kurse sind speziell für Paare entwickelt worden, die zusammen wachsen und sich weiterentwickeln möchten.\nGenießt tiefe Meditationen, kreative Übungen und inspirierende Inhalte - zusammen.',
    buttonText: 'Jetzt Paar-Abo Sichern →',
    buttonHref: '/partner-deal/checkout',
    topBadgeText: 'Das Geschenk der Partnerschaft',
    badges: [
      { icon: 'heart', text: 'Liebe & Verbindung' },
      { icon: 'users', text: 'Paare-Community' },
      { icon: 'sparkles', text: 'Sonderpreis' },
      { icon: 'star', text: 'Premium Inhalte' },
    ],
  },
};

/**
 * Alternative image example with different promo picture.
 */
export const AlternativeImage: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop',
    title: 'Partner Deal',
    description: 'Entdecke das perfekte Angebot für zwei Herzen.\nGemeinsam wachsen, gemeinsam strahlen.',
    buttonText: 'Jetzt Beitreten →',
    buttonHref: '/partner-deal',
    topBadgeText: 'Für deine Liebsten',
    badges: [
      { icon: 'heart', text: 'Echte Verbindung' },
      { icon: 'users', text: 'Zwei Seelen' },
      { icon: 'sparkles', text: 'Magische Zusammenkunft' },
    ],
  },
};

/**
 * Love-focused variant with romantic messaging.
 */
export const LoveFocused: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1606216174052-410c73d30ffd?w=600&h=400&fit=crop',
    title: 'Liebe Vertiefen - Gemeinsam',
    description: 'Nutze die Kraft der gemeinsamen Heilung und spirituellen Transformation.\nFür Paare die ihre Liebe auf ein neues Level bringen möchten.',
    buttonText: 'Liebe Verstärken →',
    buttonHref: '/love-partnership',
    topBadgeText: 'Die Magie der Zweiheit',
    badges: [
      { icon: 'heart', text: 'Herz-zu-Herz' },
      { icon: 'sparkles', text: 'Tantra Kurse' },
      { icon: 'star', text: 'Intimität Vertiefen' },
    ],
  },
};

/**
 * Budget-friendly variant with discount messaging.
 */
export const BudgetFriendly: Story = {
  args: {
    imageUrl: '/images/partner-deal-cover.webp',
    title: 'Partner Deal - Spart Zusammen',
    description: 'Teilt euch die Kosten und genießt 40% Rabatt auf beide Kurse!\nWenn ihr zusammen bucht spart ihr massiv.',
    buttonText: 'Zum Sparen →',
    buttonHref: '/partner-deal/save',
    topBadgeText: 'Sparen für Zwei',
    badges: [
      { icon: 'gift', text: '40% Ersparnisse' },
      { icon: 'sparkles', text: 'Bezahlbar Zusammen' },
      { icon: 'users', text: 'Doppelter Spaß' },
    ],
  },
};

/**
 * Extended content grid showing multiple promotional variations.
 */
export const MultipleVariants: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="space-y-16 bg-background">
      <PartnerDealPromo
        title="Partner Special Deal"
        description="Du hast eine/n Partner/in mit dem du die Kurse teilen möchtest?\nDieses Angebot ist für euch!"
        buttonText="Zum Partner Deal →"
        buttonHref="/partner-deal"
        topBadgeText="Für deinen Seelenpartner"
        badges={[
          { icon: 'heart', text: 'Gemeinsam Wachsen' },
          { icon: 'users', text: 'Für Paare' },
          { icon: 'sparkles', text: 'Sonderpreis' },
        ]}
      />

      <PartnerDealPromo
        title="Premium Couple Experience"
        description="Master-Level Kurse speziell für Paare entwickelt.\nTiefe, Qualität und Transformation zusammen."
        buttonText="Zur Premium Membership →"
        buttonHref="/premium-couple"
        topBadgeText="Meister Ebene"
        badges={[
          { icon: 'star', text: 'Premium Inhalte' },
          { icon: 'sparkles', text: 'Exclusive Zugang' },
          { icon: 'heart', text: 'VIP Support' },
        ]}
      />

      <PartnerDealPromo
        title="Gemeinsame Transformation"
        description="Beginnt eine gemeinsame Reise spiritueller Entwicklung.\nDoppelte Kraft, doppeltes Wachstum."
        buttonText="Jetzt Starten →"
        buttonHref="/couple-journey"
        topBadgeText="Zwei Herzen, Ein Weg"
        badges={[
          { icon: 'heart', text: 'Tiefere Liebe' },
          { icon: 'users', text: 'Vereinte Seelen' },
          { icon: 'flame', text: 'Passionate Growth' },
        ]}
      />
    </div>
  ),
};

/**
 * Comparison view showing default and custom styling together.
 */
export const ComparisonView: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="space-y-8 bg-background">
      <div>
        <h3 className="text-center text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Standard Version</h3>
        <PartnerDealPromo
          title="Partner Special Deal"
          description="Du hast eine/n Partner/in mit dem du die Kurse teilen möchtest?\nDieses Angebot ist für euch!"
          buttonText="Zum Partner Deal →"
          buttonHref="/partner-deal"
          topBadgeText="Für deinen Seelenpartner"
          badges={[
            { icon: 'heart', text: 'Gemeinsam Wachsen' },
            { icon: 'users', text: 'Für Paare' },
            { icon: 'sparkles', text: 'Sonderpreis' },
          ]}
        />
      </div>

      <div>
        <h3 className="text-center text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Custom Variant</h3>
        <PartnerDealPromo
          title="Premium Couple Experience"
          description="Für Paare die zusammen auf höchste Ebenen ihrer Spiritualität aufsteigen möchten."
          buttonText="Premium Couple Abo →"
          buttonHref="/premium-couple"
          topBadgeText="Meister Level für Zwei"
          badges={[
            { icon: 'star', text: 'Premium Access' },
            { icon: 'sparkles', text: 'Exclusive Content' },
            { icon: 'heart', text: 'Soulmate Bond' },
          ]}
          className="border-t border-t-gray-800 pt-20"
        />
      </div>
    </div>
  ),
};

/**
 * Interactive controls story - modify all props dynamically.
 */
export const Interactive: Story = {
  args: {
    imageUrl: '/images/partner-deal-cover.webp',
    title: 'Partner Special Deal',
    description: 'Du hast eine/n Partner/in mit dem du die Kurse teilen möchtest?\nDieses Angebot ist für euch!',
    buttonText: 'Zum Partner Deal →',
    buttonHref: '/partner-deal',
    topBadgeText: 'Für deinen Seelenpartner',
    badges: [
      { icon: 'heart', text: 'Gemeinsam Wachsen' },
      { icon: 'users', text: 'Für Paare' },
      { icon: 'sparkles', text: 'Sonderpreis' },
    ],
  },
  render: (args) => <PartnerDealPromo {...args} />,
};

/**
 * Dark background context - shows component visibility on dark layouts.
 */
export const OnDarkBackground: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'Partner Special Deal',
    description: 'Du hast eine/n Partner/in mit dem du die Kurse teilen möchtest?\nDieses Angebot ist für euch!',
    buttonText: 'Zum Partner Deal →',
    buttonHref: '/partner-deal',
    topBadgeText: 'Für deinen Seelenpartner',
    badges: [
      { icon: 'heart', text: 'Gemeinsam Wachsen' },
      { icon: 'users', text: 'Für Paare' },
      { icon: 'sparkles', text: 'Sonderpreis' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background">
        <Story />
      </div>
    ),
  ],
};
