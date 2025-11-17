import { addons } from '@storybook/manager-api';

addons.setConfig({
  // Use default Storybook theme
  theme: undefined,
  // Enable panel on right side
  panelPosition: 'right',
  // Show toolbar by default
  showToolbar: true,
  // Initial active panel
  selectedPanel: 'storybook/controls/panel',
});
