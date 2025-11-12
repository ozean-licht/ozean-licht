import type { Preview } from '@storybook/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '../../apps/admin/app/globals.css';

// CRITICAL: Make React globally available IMMEDIATELY
// Storybook core tries to access React.useInsertionEffect before module initialization
// This must happen synchronously before any Storybook code runs
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
  // Also ensure React is available on globalThis for ESM compatibility
  (globalThis as any).React = React;
  (globalThis as any).ReactDOM = ReactDOM;
}

const preview: Preview = {
  parameters: {
    tags: ['autodocs'],
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {
        rules: [
          // WCAG 2.1 AA Compliance - Critical Rules
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'link-name', enabled: true },
          { id: 'label', enabled: true },
          { id: 'valid-lang', enabled: true },
          { id: 'html-has-lang', enabled: true },

          // Keyboard Navigation
          { id: 'focus-order-semantics', enabled: true },
          { id: 'tabindex', enabled: true },

          // Screen Reader Support
          { id: 'aria-hidden-focus', enabled: true },
          { id: 'aria-valid-attr', enabled: true },
          { id: 'aria-valid-attr-value', enabled: true },

          // Form Accessibility
          { id: 'form-field-multiple-labels', enabled: true },
          { id: 'duplicate-id-aria', enabled: true },

          // Image Accessibility
          { id: 'image-alt', enabled: true },

          // Semantic HTML
          { id: 'landmark-one-main', enabled: true },
          { id: 'page-has-heading-one', enabled: true },
          { id: 'region', enabled: true },
        ],
      },
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
        // Report violations, incomplete, and experimental checks
        resultTypes: ['violations', 'incomplete'],
      },
      // Manual check requirements (documented in TESTING_GUIDE.mdx)
      manual: {
        // These require manual testing
        checks: [
          'keyboard-navigation',
          'screen-reader-compatibility',
          'focus-management',
          'touch-target-size',
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for all stories',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    entity: {
      description: 'Entity context for multi-tenant stories',
      defaultValue: 'admin',
      toolbar: {
        title: 'Entity',
        icon: 'user',
        items: [
          { value: 'admin', title: 'Admin' },
          { value: 'kids_ascension', title: 'Kids Ascension' },
          { value: 'ozean_licht', title: 'Ozean Licht' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
