import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'shared/ui-components/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'apps/admin/components/**/*.{test,spec}.{js,ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'shared/ui-components/src/**/*.{js,ts,jsx,tsx}',
        'apps/admin/components/**/*.{js,ts,tsx}',
      ],
      exclude: [
        '**/*.stories.{js,ts,jsx,tsx}',
        '**/*.test.{js,ts,jsx,tsx}',
        '**/*.spec.{js,ts,jsx,tsx}',
        '**/node_modules/**',
        '**/dist/**',
        '**/.storybook/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './apps/admin'),
      '@admin': resolve(__dirname, './apps/admin'),
      '@shared': resolve(__dirname, './shared/ui-components/src'),
    },
  },
});
