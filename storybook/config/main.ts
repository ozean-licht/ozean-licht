import type { StorybookConfig } from '@storybook/react-vite';
import { join, dirname } from 'path';
import { injectReactShim } from './plugins/inject-react-shim';

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
      plugins: [
        ...(config.plugins || []),
        injectReactShim(),
      ],
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
        // Optimize chunk splitting
        rollupOptions: {
          ...config.build?.rollupOptions,
          output: {
            ...config.build?.rollupOptions?.output,
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
                // CRITICAL: Keep React + React DOM + Emotion TOGETHER
                // @emotion/react has runtime dependency on useInsertionEffect
                // Splitting them causes race condition where emotion loads before React
                if (id.includes('react') || id.includes('react-dom') || id.includes('@emotion')) {
                  return 'react-vendor';
                }
                // Storybook core (without emotion - it's now in react-vendor)
                if (id.includes('@storybook')) {
                  return 'storybook-vendor';
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
        // Deduplicate React to prevent multiple instances
        dedupe: ['react', 'react-dom'],
      },
    };
  },
};

export default config;
