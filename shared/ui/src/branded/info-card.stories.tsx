import type { Meta, StoryObj } from '@storybook/react';
import { InfoCard, InfoCardWithButton } from './info-card';
import { Sparkles, Heart, Lightbulb, Star, Zap } from 'lucide-react';

/**
 * InfoCard - Decorative information card with animated elements.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **Decorative Elements**: Top light effect, focus background, spinning stroke
 * - **Animated Icon**: Pulsing glow effect on icon
 * - **Custom Icon Support**: Accepts any React node as icon
 * - **Default Icon**: Lightning bolt icon if no icon provided
 * - **Centered Layout**: All content centered for visual appeal
 * - **Fixed Dimensions**: max-width: 450px, min-width: 350px
 *
 * ## Variants
 * - **InfoCard**: Basic card with heading, paragraph, and optional icon
 * - **InfoCardWithButton**: Includes CTA button with text and optional href
 *
 * ## Props (InfoCard)
 * - **heading**: string - Card heading
 * - **paragraph**: string - Card description
 * - **icon**: ReactNode - Custom icon (optional)
 *
 * ## Props (InfoCardWithButton)
 * - **heading**: string - Card heading (not displayed in this variant)
 * - **paragraph**: string - Card description
 * - **icon**: ReactNode - Custom icon (optional)
 * - **buttonText**: string - Button label
 * - **buttonHref**: string - Button link (optional)
 *
 * ## Usage
 * Use for highlighting features, benefits, or calls-to-action with visual emphasis.
 */
const meta = {
  title: 'Tier 2: Branded/InfoCard',
  component: InfoCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A decorative information card with animated elements, pulsing icon, and optional CTA button.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    heading: {
      control: 'text',
      description: 'Card heading',
    },
    paragraph: {
      control: 'text',
      description: 'Card description',
    },
  },
} satisfies Meta<typeof InfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default info card with lightning icon.
 */
export const Default: Story = {
  args: {
    heading: 'Transformative Inhalte',
    paragraph: 'Entdecke lebensverändernde Kurse und spirituelle Praktiken die dein Leben bereichern.',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * With custom Sparkles icon.
 */
export const WithSparklesIcon: Story = {
  args: {
    heading: 'Premium Kurse',
    paragraph: 'Zugang zu exklusiven Master-Level Kursen und persönlicher Begleitung.',
    icon: <Sparkles className="w-6 h-6" />,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * With Heart icon.
 */
export const WithHeartIcon: Story = {
  args: {
    heading: 'Community',
    paragraph: 'Werde Teil einer liebevollen Gemeinschaft von Gleichgesinnten.',
    icon: <Heart className="w-6 h-6" />,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * With Lightbulb icon.
 */
export const WithLightbulbIcon: Story = {
  args: {
    heading: 'Wissensbasis',
    paragraph: 'Umfangreiches Wissen aus jahrelanger Erfahrung und Praxis.',
    icon: <Lightbulb className="w-6 h-6" />,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * With Star icon.
 */
export const WithStarIcon: Story = {
  args: {
    heading: 'Qualität',
    paragraph: 'Professionell produzierte Inhalte in höchster Qualität.',
    icon: <Star className="w-6 h-6" />,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * With Zap icon.
 */
export const WithZapIcon: Story = {
  args: {
    heading: 'Schneller Start',
    paragraph: 'Sofort loslegen und erste Ergebnisse in wenigen Tagen sehen.',
    icon: <Zap className="w-6 h-6" />,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Long content example.
 */
export const LongContent: Story = {
  args: {
    heading: 'Umfassende spirituelle Transformation',
    paragraph: 'Entdecke lebensverändernde Kurse, spirituelle Praktiken und transformative Inhalte die dein Leben nachhaltig bereichern und deine spirituelle Entwicklung fördern.',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Short content example.
 */
export const ShortContent: Story = {
  args: {
    heading: 'Einfach starten',
    paragraph: 'Jetzt beginnen!',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Info card with button variant.
 */
export const WithButton: Story = {
  render: () => (
    <InfoCardWithButton
      heading="Get Started"
      paragraph="Beginne deine spirituelle Reise heute und entdecke transformative Inhalte."
      buttonText="Jetzt Starten"
      buttonHref="/courses"
      icon={<Sparkles className="w-6 h-6" />}
    />
  ),
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Info card with button (no href).
 */
export const WithButtonNoHref: Story = {
  render: () => (
    <InfoCardWithButton
      heading="Premium"
      paragraph="Erhalte Zugang zu exklusiven Premium-Inhalten und persönlicher Begleitung."
      buttonText="Mehr Erfahren"
      icon={<Star className="w-6 h-6" />}
    />
  ),
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Grid of info cards.
 */
export const InfoCardGrid: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto px-8 py-12">
      <InfoCard
        heading="Qualität"
        paragraph="Professionell produzierte Inhalte in höchster Qualität."
        icon={<Star className="w-6 h-6" />}
      />
      <InfoCard
        heading="Community"
        paragraph="Werde Teil einer liebevollen Gemeinschaft."
        icon={<Heart className="w-6 h-6" />}
      />
      <InfoCard
        heading="Wissensbasis"
        paragraph="Umfangreiches Wissen aus jahrelanger Erfahrung."
        icon={<Lightbulb className="w-6 h-6" />}
      />
      <InfoCard
        heading="Premium"
        paragraph="Zugang zu exklusiven Master-Level Kursen."
        icon={<Sparkles className="w-6 h-6" />}
      />
      <InfoCard
        heading="Schneller Start"
        paragraph="Sofort loslegen und erste Ergebnisse sehen."
        icon={<Zap className="w-6 h-6" />}
      />
      <InfoCardWithButton
        heading="Get Started"
        paragraph="Beginne deine spirituelle Reise heute."
        buttonText="Jetzt Starten"
        icon={<Sparkles className="w-6 h-6" />}
      />
    </div>
  ),
};

/**
 * Comparison: Basic vs With Button.
 */
export const Comparison: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <InfoCard
        heading="Basic Card"
        paragraph="Informationskarte ohne Button für reine Informationsdarstellung."
        icon={<Star className="w-6 h-6" />}
      />
      <InfoCardWithButton
        heading="Card With Button"
        paragraph="Informationskarte mit Call-to-Action Button für Interaktion."
        buttonText="Call to Action"
        buttonHref="/action"
        icon={<Sparkles className="w-6 h-6" />}
      />
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="max-w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * In dark background context.
 */
export const OnDarkBackground: Story = {
  args: {
    heading: 'Dark Background',
    paragraph: 'Diese Karte funktioniert perfekt auf dunklem Hintergrund.',
    icon: <Sparkles className="w-6 h-6" />,
  },
  decorators: [
    (Story) => (
      <div className="bg-background p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
};
