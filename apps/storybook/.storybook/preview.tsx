import type { Preview } from '@storybook/react';
import '@shared/ui/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#00070F', // Ozean Licht deep ocean background
        },
        {
          name: 'card',
          value: '#00111A', // Card background
        },
        {
          name: 'light',
          value: '#FFFFFF',
        },
      ],
    },
  },
};

export default preview;
