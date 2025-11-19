import type { StorybookConfig } from '@storybook/react-vite';
import { join, dirname } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  // Import all stories from shared/ui package
  stories: [
    '../../../shared/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],

  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'next/link': join(__dirname, 'next-link-mock.tsx'),
        '@/shared/assets': join(__dirname, '../../../shared/assets'),
      };
    }
    return config;
  },

  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
    check: false, // Disable type checking in Storybook (run separately in CI)
  },

  docs: {
    autodocs: 'tag',
  },

  core: {
    disableTelemetry: true,
  },
};

export default config;
