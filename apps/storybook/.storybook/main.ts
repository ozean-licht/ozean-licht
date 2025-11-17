import type { StorybookConfig } from '@storybook/nextjs';
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
    // Admin components
    '../../admin/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // Shared UI - shadcn components (primary source)
    '../../../shared/ui/src/ui/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../shared/ui/src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // Exclude broken Catalyst components for now
    // '../../../shared/ui/src/catalyst/**/*.stories.@(js|jsx|mjs|ts|tsx)',
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
    name: getAbsolutePath('@storybook/nextjs'),
    options: {
      // Enable Turbopack for faster development builds
      builder: {
        useSWC: true,
      },
    },
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
  // Next.js-specific configuration
  staticDirs: ['../public'],
};

export default config;
