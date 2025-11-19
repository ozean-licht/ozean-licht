import type { Preview } from '@storybook/react';
import React from 'react';
import { DocsContainer } from '@storybook/blocks';
import { themes } from '@storybook/theming';
import '@shared/ui/styles/globals.css';

// Mock Next.js Link for Storybook
globalThis.React = React;

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
    docs: {
      container: DocsContainer,
      theme: {
        ...themes.dark,

        // Brand
        brandTitle: 'Ozean Licht Design System',
        brandUrl: 'https://ozean-licht.dev',
        brandImage: undefined,

        // Ozean Licht color palette
        colorPrimary: '#0ec2bc',      // Turquoise
        colorSecondary: '#0ec2bc',

        // UI backgrounds
        appBg: '#00070F',              // Deep ocean background
        appContentBg: '#00111A',       // Card background (docs content area)
        appBorderColor: '#0E282E',     // Border color
        appBorderRadius: 8,

        // Text colors
        textColor: '#C4C8D4',          // Paragraph text
        textInverseColor: '#FFFFFF',   // Headings
        textMutedColor: '#7A8A99',     // Muted/secondary text

        // Toolbar
        barTextColor: '#C4C8D4',
        barSelectedColor: '#0ec2bc',
        barBg: '#00111A',

        // Form elements
        inputBg: '#00111A',
        inputBorder: '#0E282E',
        inputTextColor: '#FFFFFF',
        inputBorderRadius: 6,

        // Buttons
        buttonBg: '#00111A',
        buttonBorder: '#0E282E',

        // Code blocks
        base: 'dark',
      },
    },
  },
};

export default preview;
