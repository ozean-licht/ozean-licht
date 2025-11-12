import type { StorybookConfig } from '@storybook/react-vite';
import { join, dirname } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: [
    '../../apps/admin/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../apps/ozean-licht/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../shared/ui-components/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@chromatic-com/storybook'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    check: true,
  },
  docs: {
    autodocs: 'tag',
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (config) => {
    return {
      ...config,
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [
          ...(config.optimizeDeps?.include || []),
          '@storybook/react',
          '@storybook/blocks',
          'react',
          'react-dom',
        ],
      },
      build: {
        ...config.build,
        // Target modern browsers for smaller bundles
        target: 'es2020',
        // Optimize chunk splitting
        rollupOptions: {
          ...config.build?.rollupOptions,
          output: {
            ...config.build?.rollupOptions?.output,
            manualChunks: (id) => {
              // Split large vendor libraries into separate chunks
              if (id.includes('node_modules')) {
                // React ecosystem
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'react-vendor';
                }
                // Radix UI components
                if (id.includes('@radix-ui')) {
                  return 'radix-vendor';
                }
                // Storybook core
                if (id.includes('@storybook')) {
                  return 'storybook-vendor';
                }
                // A11y testing (lazy loadable)
                if (id.includes('axe-core')) {
                  return 'axe-vendor';
                }
                // Other node_modules
                return 'vendor';
              }
              // Split by application/package
              if (id.includes('apps/admin')) {
                return 'admin-components';
              }
              if (id.includes('shared/ui-components')) {
                return 'shared-components';
              }
            },
          },
        },
        // Increase chunk size warning limit (we've documented large chunks)
        chunkSizeWarningLimit: 1000,
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          // Admin app aliases
          '@': join(__dirname, '../../apps/admin'),
          '@admin': join(__dirname, '../../apps/admin'),
          // Shared UI aliases (now using relative imports internally)
          '@shared': join(__dirname, '../../shared/ui-components/src'),
        },
      },
    };
  },
};

export default config;
