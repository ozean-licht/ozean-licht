import type { Meta, StoryObj } from '@storybook/react';
import TestimonialCard from './testimonial-card';

/**
 * TestimonialCard - Customer testimonial card component.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **Glass Morphism**: Translucent background with backdrop blur
 * - **Cinzel Decorative Font**: For customer name
 * - **Location Highlight**: Uses accent color for location
 * - **Centered Layout**: All content centered for elegance
 * - **Max Width**: Constrained to max-w-md for readability
 *
 * ## Props
 * - **name**: string - Customer/client name
 * - **location**: string - Customer location (city, country)
 * - **testimonial**: string - The testimonial text
 *
 * ## Usage
 * Use for displaying customer testimonials, reviews, or feedback on the Ozean Licht platform.
 */
const meta = {
  title: 'Tier 2: Branded/TestimonialCard',
  component: TestimonialCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A testimonial card with glassmorphic design for displaying customer feedback.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Customer name',
    },
    location: {
      control: 'text',
      description: 'Customer location',
    },
    testimonial: {
      control: 'text',
      description: 'Testimonial text',
    },
  },
} satisfies Meta<typeof TestimonialCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default testimonial card.
 */
export const Default: Story = {
  args: {
    name: 'Maria Schmidt',
    location: 'Wien, Österreich',
    testimonial: 'Die Kurse haben mein Leben verändert. Ich habe so viel über mich selbst gelernt und bin jetzt auf einem klaren spirituellen Weg.',
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
 * Short testimonial.
 */
export const ShortTestimonial: Story = {
  args: {
    name: 'Thomas Müller',
    location: 'München, Deutschland',
    testimonial: 'Absolut empfehlenswert! Vielen Dank für die wertvollen Inhalte.',
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
 * Long testimonial.
 */
export const LongTestimonial: Story = {
  args: {
    name: 'Julia Hofmann',
    location: 'Salzburg, Österreich',
    testimonial: 'Ich bin so dankbar für diese Plattform und die transformativen Inhalte. Die Kurse sind professionell gestaltet, leicht verständlich und voller tiefer Weisheit. Seit ich mit den Meditationen begonnen habe, fühle ich mich ausgeglichener und verbundener mit meinem wahren Selbst. Absolute Empfehlung für jeden der auf seinem spirituellen Weg weiterkommen möchte!',
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
 * Different locations.
 */
export const Locations: Story = {
  render: () => (
    <div className="space-y-4">
      <TestimonialCard
        name="Anna Weber"
        location="Berlin, Deutschland"
        testimonial="Wunderbare Erfahrung! Die Inhalte sind sehr bereichernd."
      />
      <TestimonialCard
        name="Michael Schneider"
        location="Zürich, Schweiz"
        testimonial="Professionell und tiefgehend. Kann ich nur weiterempfehlen."
      />
      <TestimonialCard
        name="Sophie Laurent"
        location="Paris, Frankreich"
        testimonial="Une expérience transformatrice. Merci beaucoup!"
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
 * Testimonial grid layout.
 */
export const TestimonialGrid: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto px-8 py-12">
      <TestimonialCard
        name="Petra Nowak"
        location="Graz, Österreich"
        testimonial="Die Kurse sind inspirierend und lebensverändernd. Absolute Empfehlung!"
      />
      <TestimonialCard
        name="Hans Fischer"
        location="Hamburg, Deutschland"
        testimonial="Professionelle Inhalte mit viel Tiefgang. Sehr zu empfehlen."
      />
      <TestimonialCard
        name="Lisa Kowalski"
        location="Warschau, Polen"
        testimonial="Eine wunderbare spirituelle Reise. Vielen Dank!"
      />
      <TestimonialCard
        name="Marco Rossi"
        location="Rom, Italien"
        testimonial="Transformative experience! Highly recommended for spiritual growth."
      />
      <TestimonialCard
        name="Emma Johnson"
        location="London, UK"
        testimonial="Life-changing content. Thank you for this amazing platform!"
      />
      <TestimonialCard
        name="Carlos Sanchez"
        location="Madrid, Spanien"
        testimonial="¡Increíble! Los cursos son profundos y transformadores."
      />
    </div>
  ),
};

/**
 * In dark background context.
 */
export const OnDarkBackground: Story = {
  args: {
    name: 'Sarah Meyer',
    location: 'Innsbruck, Österreich',
    testimonial: 'Eine bereichernde Erfahrung die mein Leben nachhaltig verändert hat.',
  },
  decorators: [
    (Story) => (
      <div className="bg-background p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
};
