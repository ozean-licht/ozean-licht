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

  // Serve static files from public directory
  staticDirs: ['../public'],

  // Explicitly set preview path
  previewAnnotations: [
    join(__dirname, 'preview.tsx'),
  ],

  viteFinal: async (config) => {
    // Add Tailwind CSS v4 Vite plugin (modern, recommended approach)
    const tailwindcss = (await import('@tailwindcss/vite')).default;
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());

    // Allow Vite to access files outside the app root
    if (!config.server) config.server = {};
    if (!config.server.fs) config.server.fs = {};
    config.server.fs.allow = [
      // Allow access to the monorepo root
      join(__dirname, '../../../'),
    ];

    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'next/link': join(__dirname, 'next-link-mock.tsx'),
        'next/image': join(__dirname, 'next-image-mock.tsx'),
        'next/navigation': join(__dirname, 'next-navigation-mock.tsx'),
        '@/shared/assets': join(__dirname, '../../../shared/assets'),
        '@shared/ui/dist': join(__dirname, '../../../shared/ui/dist'),
        '@shared/ui': join(__dirname, '../../../shared/ui/src'),
      };
      // Ensure TypeScript extensions are resolved
      config.resolve.extensions = [
        '.mjs',
        '.js',
        '.mts',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
      ];
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
