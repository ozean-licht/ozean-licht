import type { Meta, StoryObj } from '@storybook/react';
import { FaqItem } from './faq-item';

/**
 * FaqItem - Expandable FAQ accordion item.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **Accordion Behavior**: Click to expand/collapse answer
 * - **Glass Morphism**: Translucent background with backdrop blur
 * - **Animated Icon**: Plus icon rotates 45° when open (becomes X)
 * - **Hover Effect**: Subtle background change on hover
 * - **Default State**: Can be opened by default with defaultOpen prop
 * - **Client Component**: Uses useState for interactivity
 *
 * ## Props
 * - **question**: string - The FAQ question
 * - **answer**: string - The FAQ answer
 * - **defaultOpen**: boolean - Whether to open by default (optional)
 *
 * ## Usage
 * Use for FAQ sections, help pages, or any expandable Q&A content.
 */
const meta = {
  title: 'Tier 2: Branded/FaqItem',
  component: FaqItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An expandable FAQ accordion item with glassmorphic design and animated icon.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    question: {
      control: 'text',
      description: 'FAQ question',
    },
    answer: {
      control: 'text',
      description: 'FAQ answer',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Open by default',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FaqItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default closed FAQ item.
 */
export const Default: Story = {
  args: {
    question: 'Wie kann ich mich für einen Kurs anmelden?',
    answer: 'Du kannst dich ganz einfach über die Kursseite anmelden. Klicke auf den "Jetzt Anmelden" Button und folge den Anweisungen.',
  },
};

/**
 * FAQ item opened by default.
 */
export const DefaultOpen: Story = {
  args: {
    question: 'Sind die Kurse auch für Anfänger geeignet?',
    answer: 'Ja, absolut! Wir haben Kurse für alle Erfahrungsstufen - von Basis bis Master Level. Jeder Kurs ist klar gekennzeichnet.',
    defaultOpen: true,
  },
};

/**
 * Short question and answer.
 */
export const ShortContent: Story = {
  args: {
    question: 'Wie lange habe ich Zugriff?',
    answer: 'Lebenslanger Zugriff!',
  },
};

/**
 * Long question and answer.
 */
export const LongContent: Story = {
  args: {
    question: 'Was passiert wenn ich einen Kurs gekauft habe aber nicht zufrieden bin? Gibt es eine Geld-zurück-Garantie?',
    answer: 'Ja, wir bieten eine 30-Tage Geld-zurück-Garantie für alle unsere Kurse. Wenn du innerhalb von 30 Tagen nach dem Kauf nicht zufrieden bist, kannst du eine vollständige Rückerstattung beantragen. Kontaktiere einfach unseren Support und wir kümmern uns umgehend darum. Deine Zufriedenheit ist uns wichtig!',
    defaultOpen: true,
  },
};

/**
 * FAQ list with multiple items.
 */
export const FaqList: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <FaqItem
        question="Wie kann ich mich für einen Kurs anmelden?"
        answer="Du kannst dich ganz einfach über die Kursseite anmelden. Klicke auf den 'Jetzt Anmelden' Button und folge den Anweisungen."
      />
      <FaqItem
        question="Sind die Kurse auch für Anfänger geeignet?"
        answer="Ja, absolut! Wir haben Kurse für alle Erfahrungsstufen - von Basis bis Master Level. Jeder Kurs ist klar gekennzeichnet."
      />
      <FaqItem
        question="Wie lange habe ich Zugriff auf die Kurse?"
        answer="Alle Kurse bieten lebenslangen Zugriff. Du kannst sie jederzeit und so oft du möchtest anschauen."
      />
      <FaqItem
        question="Gibt es eine Geld-zurück-Garantie?"
        answer="Ja, wir bieten eine 30-Tage Geld-zurück-Garantie für alle unsere Kurse."
      />
      <FaqItem
        question="Kann ich die Kurse auf dem Handy anschauen?"
        answer="Ja, unsere Plattform ist vollständig responsive und funktioniert auf allen Geräten - Desktop, Tablet und Smartphone."
      />
    </div>
  ),
};

/**
 * First item open by default in list.
 */
export const FaqListWithDefaultOpen: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <FaqItem
        question="Wie kann ich mich für einen Kurs anmelden?"
        answer="Du kannst dich ganz einfach über die Kursseite anmelden. Klicke auf den 'Jetzt Anmelden' Button und folge den Anweisungen."
        defaultOpen={true}
      />
      <FaqItem
        question="Sind die Kurse auch für Anfänger geeignet?"
        answer="Ja, absolut! Wir haben Kurse für alle Erfahrungsstufen - von Basis bis Master Level."
      />
      <FaqItem
        question="Wie lange habe ich Zugriff auf die Kurse?"
        answer="Alle Kurse bieten lebenslangen Zugriff."
      />
    </div>
  ),
};

/**
 * In dark background context.
 */
export const OnDarkBackground: Story = {
  args: {
    question: 'Wie funktioniert die Zahlung?',
    answer: 'Wir akzeptieren alle gängigen Zahlungsmethoden: Kreditkarte, PayPal, Sofortüberweisung und mehr.',
  },
  decorators: [
    (Story) => (
      <div className="bg-background p-8 rounded-lg max-w-2xl">
        <Story />
      </div>
    ),
  ],
};
