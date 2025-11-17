import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';
import { create } from '@storybook/theming/create';
// Temporarily disabled auth toolbar to fix Loading issue
// import './addons/auth-toolbar-fixed';

/**
 * Custom Ozean Licht theme for Storybook Manager UI
 * Applies cosmic dark theme with turquoise branding
 */
const ozeanLichtTheme = create({
  base: 'dark',

  // Brand
  brandTitle: 'Ozean Licht Design System',
  brandUrl: 'https://ozean-licht.dev',
  brandTarget: '_self',

  // Colors - Ozean Licht Cosmic Dark
  colorPrimary: '#0ec2bc', // Turquoise primary
  colorSecondary: '#0ec2bc', // Turquoise secondary

  // UI
  appBg: '#0A0F1A', // Cosmic background
  appContentBg: '#0A0F1A', // Content background
  appPreviewBg: '#0A0F1A', // Preview background (canvas)
  appBorderColor: '#2A2F3E', // Border color
  appBorderRadius: 8,

  // Text colors
  textColor: '#FFFFFF', // Primary text
  textInverseColor: '#0A0F1A', // Inverse text
  textMutedColor: '#94A3B8', // Muted text

  // Toolbar default and active colors
  barTextColor: '#94A3B8', // Toolbar text
  barSelectedColor: '#0ec2bc', // Selected toolbar item
  barHoverColor: '#0ec2bc', // Hover toolbar item
  barBg: '#1A1F2E', // Toolbar background

  // Form colors
  inputBg: '#1A1F2E',
  inputBorder: '#2A2F3E',
  inputTextColor: '#FFFFFF',
  inputBorderRadius: 6,

  // Button colors
  buttonBg: '#0ec2bc',
  buttonBorder: '#0ec2bc',
  booleanBg: '#1A1F2E',
  booleanSelectedBg: '#0ec2bc',

  // Typography
  fontBase: '"Montserrat", system-ui, -apple-system, sans-serif',
  fontCode: '"Fira Code", "Courier New", monospace',
});

addons.setConfig({
  theme: ozeanLichtTheme,
  // Enable panel on right side
  panelPosition: 'right',
  // Show toolbar by default
  showToolbar: true,
  // Initial active panel
  selectedPanel: 'storybook/controls/panel',
});
