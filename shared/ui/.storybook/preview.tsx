import type { Preview, Decorator } from '@storybook/react';
import React, { useEffect } from 'react';
import '../src/styles/globals.css';

// Decorator to ensure dark mode is always applied
const withDarkMode: Decorator = (Story, context) => {
  useEffect(() => {
    // Ensure dark class is on the document element
    document.documentElement.classList.add('dark');
    // Also set background on body for docs pages
    document.body.style.backgroundColor = '#00070F';
    document.body.style.color = '#C4C8D4';
  }, []);

  return (
    <div className="dark bg-[#00070F] min-h-screen">
      <Story {...context} />
    </div>
  );
};

const preview: Preview = {
  decorators: [withDarkMode],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      current: 'dark',
      darkClass: 'dark',
      classTarget: 'html',
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
    docs: {
      theme: {
        base: 'dark',
        colorPrimary: '#0EA6C1',
        colorSecondary: '#055D75',
        appBg: '#00070F',
        appContentBg: '#00111A',
        appBorderColor: '#0E282E',
        appBorderRadius: 8,
        textColor: '#C4C8D4',
        textInverseColor: '#00070F',
        barTextColor: '#C4C8D4',
        barSelectedColor: '#0EA6C1',
        barBg: '#00111A',
      },
    },
    layout: 'fullscreen',
  },
};

export default preview;