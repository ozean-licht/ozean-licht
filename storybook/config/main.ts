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
                // BUNDLE ALL REACT-DEPENDENT PACKAGES TOGETHER
                // This prevents "Cannot read properties of undefined" errors
                // by ensuring React is available when any dependent code executes
                if (
                  // Core React
                  id.includes('node_modules/react/') ||
                  id.includes('node_modules/react-dom/') ||
                  // Storybook (uses React)
                  id.includes('node_modules/@storybook/') ||
                  id.includes('node_modules/storybook/') ||
                  // Emotion styling (uses React hooks)
                  id.includes('node_modules/@emotion/') ||
                  // Radix UI (uses React)
                  id.includes('node_modules/@radix-ui/') ||
                  // UI libraries that use React
                  id.includes('node_modules/lucide-react') ||
                  id.includes('node_modules/motion') ||
                  id.includes('node_modules/framer-motion') ||
                  id.includes('node_modules/recharts') ||
                  id.includes('node_modules/sonner') ||
                  id.includes('node_modules/vaul') ||
                  id.includes('node_modules/next-themes') ||
                  id.includes('node_modules/react-day-picker') ||
                  id.includes('node_modules/react-hook-form') ||
                  id.includes('node_modules/react-resizable-panels') ||
                  id.includes('node_modules/embla-carousel-react') ||
                  id.includes('node_modules/cmdk') ||
                  id.includes('node_modules/input-otp')
                ) {
                  return 'storybook-vendor';
                }
                // A11Y TESTING - Separate chunk (doesn't use React)
                if (id.includes('axe-core')) {
                  return 'axe-vendor';
                }
                // PURE UTILITIES - No React dependencies
                // (class-variance-authority, clsx, tailwind-merge, date-fns, zod, etc.)
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
