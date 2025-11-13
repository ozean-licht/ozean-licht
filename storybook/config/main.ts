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
      // Optimize deps for determinism - Pre-bundle React FIRST
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [
          ...(config.optimizeDeps?.include || []),
          'react',
          'react-dom',
          '@emotion/react',
          '@emotion/styled',
          '@storybook/react',
          '@storybook/blocks',
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
        ],
        exclude: [],
      },
      build: {
        ...config.build,
        target: 'es2020',
        minify: 'terser',
        sourcemap: false,
        reportCompressedSize: false,
        // Force single worker for deterministic builds
        workers: 1,
        // Optimize chunk splitting with guaranteed load order
        rollupOptions: {
          ...config.build?.rollupOptions,
          output: {
            ...config.build?.rollupOptions?.output,
            format: 'es',
            chunkFileNames: '[name]-[hash].js',
            entryFileNames: '[name]-[hash].js',
            // CRITICAL: Granular chunk splitting with alphabetical ordering
            manualChunks: (id) => {
              if (id.includes('node_modules')) {
                // BUNDLE REACT WITH STORYBOOK - Ensures React is always available
                // This prevents race conditions by including React in the main vendor chunk
                if (
                  id.includes('node_modules/react/') ||
                  id.includes('node_modules/react-dom/') ||
                  id.includes('node_modules/@storybook/') ||
                  id.includes('node_modules/storybook/') ||
                  id.includes('node_modules/@emotion/')
                ) {
                  return 'storybook-vendor';
                }
                // RADIX UI - Separate chunk
                if (id.includes('@radix-ui')) {
                  return 'radix-vendor';
                }
                // A11Y TESTING - Separate chunk
                if (id.includes('axe-core')) {
                  return 'axe-vendor';
                }
                // OTHER VENDOR CODE
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
        chunkSizeWarningLimit: 3000,
      },
      // Module preload - default behavior is fine now that React is bundled with dependencies
      modulePreload: true,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@': join(__dirname, '../../apps/admin'),
          '@admin': join(__dirname, '../../apps/admin'),
          '@shared': join(__dirname, '../../shared/ui/src'),
        },
        // Deduplicate to single instance
        dedupe: ['react', 'react-dom', '@emotion/react'],
      },
    };
  },
};

export default config;
