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
  // Manager customization for Ozean Licht branding
  managerHead: (head) => `
    ${head}
    <style>
      body {
        font-family: 'Montserrat', system-ui, -apple-system, sans-serif;
      }
    </style>
  `,
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
      // CSS processing - Enable PostCSS/Tailwind
      css: {
        ...config.css,
        postcss: join(__dirname, '../postcss.config.js'),
      },
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
                // WHITELIST APPROACH: Only allow known-safe utilities in vendor
                // Everything else goes into storybook-vendor with React
                const safeUtilities = [
                  'clsx',
                  'class-variance-authority',
                  'tailwind-merge',
                  'tailwindcss',
                  'date-fns',
                  'zod',
                  'axe-core'
                ];

                // Check if this is a safe utility
                const isSafeUtility = safeUtilities.some(util =>
                  id.includes(`node_modules/${util}`)
                );

                if (isSafeUtility) {
                  if (id.includes('axe-core')) {
                    return 'axe-vendor';
                  }
                  return 'vendor';
                }

                // EVERYTHING ELSE goes with React
                // This includes React itself, all UI libraries, and any unknown dependencies
                return 'storybook-vendor';
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
