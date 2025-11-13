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
    '../../shared/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
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
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
        ],
        // Force React to be external to prevent bundling issues
        exclude: [],
      },
      build: {
        ...config.build,
        // Target modern browsers for smaller bundles
        target: 'es2020',
        // Enable module preload polyfill to fix race conditions
        modulePreload: {
          polyfill: true,
        },
        // Optimize chunk splitting
        rollupOptions: {
          ...config.build?.rollupOptions,
          output: {
            ...config.build?.rollupOptions?.output,
            // Ensure consistent module format
            format: 'es',
            // Use manual chunks for better control
            manualChunks: (id) => {
              // Split large vendor libraries into separate chunks
              if (id.includes('node_modules')) {
                // A11y testing (lazy loadable)
                if (id.includes('axe-core')) {
                  return 'axe-vendor';
                }
                // Radix UI components (can be separate)
                if (id.includes('@radix-ui')) {
                  return 'radix-vendor';
                }
                // CRITICAL FIX: Bundle React + Emotion + Storybook TOGETHER
                // Storybook vendor code needs React.useInsertionEffect immediately
                // Splitting into separate chunks causes modulepreload race condition
                // where storybook-vendor loads before react-vendor is available
                if (
                  id.includes('react') ||
                  id.includes('react-dom') ||
                  id.includes('@emotion') ||
                  id.includes('@storybook')
                ) {
                  return 'storybook-vendor';
                }
                // Other node_modules
                return 'vendor';
              }
              // Split by application/package
              if (id.includes('apps/admin')) {
                return 'admin-components';
              }
              if (id.includes('shared/ui')) {
                return 'shared-components';
              }
            },
          },
        },
        // Increase chunk size warning limit since React+Storybook are bundled together
        chunkSizeWarningLimit: 3000,
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          // Admin app aliases
          '@': join(__dirname, '../../apps/admin'),
          '@admin': join(__dirname, '../../apps/admin'),
          // Shared UI aliases (now using relative imports internally)
          '@shared': join(__dirname, '../../shared/ui/src'),
        },
        // Deduplicate React to prevent multiple instances
        dedupe: ['react', 'react-dom'],
      },
    };
  },
};

export default config;
