import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: {
    ...themes.dark,
    brandTitle: 'Ozean Licht Design System',
    brandUrl: 'https://ozean-licht.dev',
    brandImage: undefined,

    // Ozean Licht color palette
    colorPrimary: '#0ec2bc',      // Turquoise
    colorSecondary: '#0ec2bc',

    // UI
    appBg: '#00111A',              // Sidebar background (card)
    appContentBg: '#00070F',       // Content area background (deep ocean)
    appBorderColor: '#0E282E',     // Border color
    appBorderRadius: 8,

    // Text colors
    textColor: '#C4C8D4',          // Paragraph text
    textInverseColor: '#FFFFFF',

    // Toolbar default and active colors
    barTextColor: '#C4C8D4',
    barSelectedColor: '#0ec2bc',
    barBg: '#00111A',

    // Form colors
    inputBg: '#00111A',
    inputBorder: '#0E282E',
    inputTextColor: '#FFFFFF',
    inputBorderRadius: 6,
  },
});
