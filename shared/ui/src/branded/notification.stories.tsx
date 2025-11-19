import type { Meta, StoryObj } from '@storybook/react';
import { Notification } from './notification';

/**
 * Notification - Information notification banner.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **Info Icon**: Uses @phosphor-icons/react Info icon
 * - **Glass Morphism**: Translucent background with subtle border
 * - **Flexible Content**: Supports string or React node for description
 * - **Icon Alignment**: Icon aligned to top for multi-line content
 * - **Dark Theme**: Matches Ozean Licht color palette
 *
 * ## Props
 * - **title**: string - Notification title
 * - **description**: string | React.ReactNode - Notification body content
 * - **className**: string - Additional CSS classes (optional)
 *
 * ## Usage
 * Use for informational messages, tips, updates, or important notices to users.
 */
const meta = {
  title: 'Tier 2: Branded/Notification',
  component: Notification,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An information notification component with icon and glassmorphic design.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Notification title',
    },
    description: {
      control: 'text',
      description: 'Notification content',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default notification.
 */
export const Default: Story = {
  args: {
    title: 'Neue Funktionen verfügbar',
    description: 'Wir haben einige spannende neue Funktionen hinzugefügt. Schau sie dir an!',
  },
};

/**
 * Short message.
 */
export const ShortMessage: Story = {
  args: {
    title: 'Tipp',
    description: 'Speichere deine Fortschritte regelmäßig.',
  },
};

/**
 * Long message.
 */
export const LongMessage: Story = {
  args: {
    title: 'Wichtige Information',
    description: 'Bitte beachte dass wir am kommenden Wochenende eine geplante Wartung durchführen werden. Die Plattform wird am Samstag zwischen 2:00 und 6:00 Uhr nicht verfügbar sein. Wir entschuldigen uns für etwaige Unannehmlichkeiten.',
  },
};

/**
 * With React node as description.
 */
export const WithReactNode: Story = {
  args: {
    title: 'Sonderangebot',
    description: (
      <div>
        <p>Nur diese Woche: <strong className="text-primary">50% Rabatt</strong> auf alle Master Kurse!</p>
        <a href="#" className="text-primary hover:underline mt-2 inline-block">
          Jetzt ansehen →
        </a>
      </div>
    ),
  },
};

/**
 * Different notification types.
 */
export const NotificationTypes: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Notification
        title="Update verfügbar"
        description="Eine neue Version der Plattform ist verfügbar."
      />
      <Notification
        title="Erinnerung"
        description="Dein Kurs 'Meditation Basics' wartet auf dich!"
      />
      <Notification
        title="Tipp des Tages"
        description="Beginne jeden Tag mit 5 Minuten Meditation."
      />
      <Notification
        title="Community Event"
        description="Nächste Woche findet unser monatliches Live Q&A statt."
      />
    </div>
  ),
};

/**
 * With custom className.
 */
export const CustomStyling: Story = {
  args: {
    title: 'Custom styled',
    description: 'This notification has additional margin.',
    className: 'my-8',
  },
};

/**
 * Full width notification.
 */
export const FullWidth: Story = {
  args: {
    title: 'Systemankündigung',
    description: 'Geplante Wartungsarbeiten am Wochenende. Weitere Informationen folgen.',
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
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
    title: 'Willkommen zurück!',
    description: 'Schön dich wiederzusehen. Du hast 3 neue Nachrichten.',
  },
  decorators: [
    (Story) => (
      <div className="bg-background p-8 rounded-lg max-w-md">
        <Story />
      </div>
    ),
  ],
};

/**
 * Notification stack.
 */
export const NotificationStack: Story = {
  render: () => (
    <div className="space-y-3 max-w-md">
      <Notification
        title="Neuer Kurs"
        description="'Fortgeschrittene Channeling Techniken' ist jetzt verfügbar!"
      />
      <Notification
        title="Kurs abgeschlossen"
        description="Herzlichen Glückwunsch! Du hast 'Meditation Basics' abgeschlossen."
      />
      <Notification
        title="Community"
        description="5 neue Mitglieder haben sich der Community angeschlossen."
      />
    </div>
  ),
};
