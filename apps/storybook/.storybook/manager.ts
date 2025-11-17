import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: {
    ...themes.dark,
    brandTitle: 'Ozean Licht Design System',
    brandUrl: 'https://ozean-licht.dev',
    brandImage: undefined,

    // Ozean Licht color palette
    colorPrimary: '#0EA6C1',      // Oceanic cyan
    colorSecondary: '#0EA6C1',

    // UI
    appBg: '#00070F',              // Deep ocean background
    appContentBg: '#00111A',       // Card background
    appBorderColor: '#0E282E',     // Border color
    appBorderRadius: 8,

    // Text colors
    textColor: '#C4C8D4',          // Paragraph text
    textInverseColor: '#FFFFFF',

    // Toolbar default and active colors
    barTextColor: '#C4C8D4',
    barSelectedColor: '#0EA6C1',
    barBg: '#00111A',

    // Form colors
    inputBg: '#00111A',
    inputBorder: '#0E282E',
    inputTextColor: '#FFFFFF',
    inputBorderRadius: 6,
  },
});
