import type { Preview } from '@storybook/react';
import '../globals-simple.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      current: 'dark',
      stylePreview: true,
    },
    backgrounds: {
      default: 'ozean-dark',
      values: [
        {
          name: 'ozean-dark',
          value: '#00070F',
        },
        {
          name: 'ozean-card',
          value: '#00111A',
        },
      ],
    },
  },
};

export default preview;