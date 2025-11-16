import type { StorybookConfig } from '@storybook/react-vite';
import { join, dirname } from 'path';
import fs from 'fs';

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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Montserrat', system-ui, -apple-system, sans-serif;
      }
    </style>
  `,
  previewHead: (head) => `
    ${head}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
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
    const projectRoot = join(__dirname, '../..');
    config.plugins = config.plugins || [];

    // AI iteration plugin is development-only, skip during build
    const isDev = process.env.NODE_ENV !== 'production';

    if (isDev) {
      try {
        // Dynamic import to avoid ESM issues during Storybook build process
        const { aiIterationPlugin } = await import('../ai-mvp/vite-plugin');
        config.plugins.push(aiIterationPlugin({ projectRoot }));
        console.log('✓ AI Iteration plugin loaded');
      } catch (error) {
        console.warn('⚠ AI Iteration plugin not available:', error.message);
      }
    }

    // Serve client script as static asset (development-only)
    // Note: TypeScript will be transpiled by Vite's transform
    if (isDev) {
      config.plugins.push({
        name: 'serve-ai-client',
        configureServer(server) {
          server.middlewares.use('/ai-mvp-client.js', async (req, res) => {
            try {
              const clientPath = join(__dirname, '../ai-mvp/client.ts');
              // Use Vite's /@fs/ prefix for absolute file paths
              const viteId = `/@fs${clientPath}`;
              const result = await server.transformRequest(viteId);

              if (result) {
                res.writeHead(200, {
                  'Content-Type': 'application/javascript',
                  'Cache-Control': 'no-cache'
                });
                res.end(result.code);
              } else {
                throw new Error('Failed to transform client script');
              }
            } catch (error) {
              console.error('Error serving AI client script:', error);
              res.writeHead(500, { 'Content-Type': 'application/javascript' });
              res.end('console.error("Failed to load AI iteration client:", ' + JSON.stringify(error.message) + ');');
            }
          });
        }
      });
    }

    return {
      ...config,
      // Set base path for proxied deployment through auth wrapper
      // In production, Storybook is accessed via /storybook-content/ proxy
      base: process.env.NODE_ENV === 'production' ? '/storybook-content/' : '/',
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
          // Mock Next.js modules for Storybook compatibility
          'next/link': join(__dirname, '../mocks/next-link.tsx'),
          'next/image': join(__dirname, '../mocks/next-image.tsx'),
          'next/navigation': join(__dirname, '../mocks/next-navigation.tsx'),
          'next/server': join(__dirname, '../mocks/next-server.tsx'),
        },
        // Deduplicate to single instance
        dedupe: ['react', 'react-dom', '@emotion/react'],
      },
    };
  },
};

export default config;
