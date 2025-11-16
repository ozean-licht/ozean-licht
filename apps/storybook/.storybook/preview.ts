import type { Preview } from '@storybook/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '../globals.css';

// Inject custom CSS for Storybook docs dark mode
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    /* ===== GLOBAL FIXES ===== */

    /* Fix: Border radius everywhere (Ozean Licht Design System) */
    * {
      border-radius: 0.5rem !important;
    }

    /* Reset border-radius for elements that should be sharp */
    .sbdocs-wrapper,
    .sb-show-main,
    html, body, #storybook-root {
      border-radius: 0 !important;
    }

    /* ===== STORYBOOK UI FIXES ===== */

    /* Storybook Docs Dark Mode */
    .sbdocs.sbdocs-wrapper {
      background-color: #0A0F1A !important;
      color: #FFFFFF !important;
    }

    /* Fix: White backgrounds in Storybook UI classes */
    .css-p1dfi6,
    .css-4ii5m,
    .css-14m39zm,
    .css-4lbn0a {
      background-color: #00111A !important;
      color: #FFFFFF !important;
    }

    /* Fix: Zoom controls styling */
    .css-171onha,
    button[title*="Zoom"],
    button[title*="zoom"] {
      color: #FFFFFF !important;
      background-color: transparent !important;
      border: none !important;
    }

    .css-171onha:hover,
    button[title*="Zoom"]:hover,
    button[title*="zoom"]:hover {
      color: #0ec2bc !important;
      background-color: transparent !important;
    }

    /* ===== TYPOGRAPHY ===== */

    /* Headlines styling */
    .sbdocs h1, .sbdocs h2, .sbdocs h3, .sbdocs h4, .sbdocs h5, .sbdocs h6 {
      color: #FFFFFF !important;
    }

    /* H1 with Cinzel Decorative */
    .sbdocs h1 {
      font-family: 'Cinzel Decorative', serif !important;
      font-weight: 400 !important;
      color: #FFFFFF !important;
    }

    /* Description text */
    .sbdocs p, .sbdocs li {
      color: #E2E8F0 !important;
    }

    /* Links */
    .sbdocs a {
      color: #0ec2bc !important;
    }

    /* ===== CANVAS & PREVIEW CONTAINERS ===== */

    /* Canvas container - fit content, don't force height */
    .sbdocs-preview {
      min-height: auto !important;
      height: auto !important;
      border-color: #0A7B77 !important;
      border-width: 1px !important;
      background-color: #00111A !important;
    }

    /* Fix: docs-story container - NO BORDER (outer container already has it) */
    .docs-story {
      background-color: transparent !important;
      border: none !important;
      min-height: auto !important;
      height: auto !important;
      padding: 0 !important;
    }

    /* Fix: css-kdwx3d - transparent background */
    .css-kdwx3d {
      background-color: transparent !important;
      border: none !important;
    }

    /* Fix: Remove double border bug from innerZoomElementWrapper */
    .innerZoomElementWrapper {
      border: none !important;
      background-color: transparent !important;
    }

    /* Fix: Full-height container issues - use fit-content */
    [id^="anchor--"] {
      min-height: fit-content !important;
      height: auto !important;
      max-height: none !important;
    }

    /* Canvas zoom container - Override white border */
    .sb-zoom-wrapper,
    #storybook-preview-wrapper,
    #storybook-docs .sb-zoom-wrapper {
      border: 1px solid #0A7B77 !important;
      background-color: #0A0F1A !important;
      height: auto !important;
      min-height: auto !important;
      box-shadow: 0 0 8px rgba(14, 194, 188, 0.15) !important;
    }

    /* Story wrapper - fit content */
    .sb-story,
    .sb-show-main {
      background-color: #0A0F1A !important;
      min-height: auto !important;
      height: auto !important;
    }

    /* Iframe containers */
    .sbdocs-preview iframe,
    .docs-story > div,
    #storybook-docs iframe,
    .sbdocs-preview > div,
    .docs-story iframe {
      border-color: #0A7B77 !important;
      height: auto !important;
      min-height: fit-content !important;
      max-height: fit-content !important;
    }

    /* Fix: White preview backgrounds */
    .sbdocs .sbdocs-preview.sb-unstyled,
    .sbdocs .css-hd7ysc {
      background-color: #00111A !important;
    }

    /* ===== COMPONENT-SPECIFIC FIXES ===== */

    /* Fix: Accordion primitives sizing - constrain the actual component */
    [id*="accordion"] [data-radix-accordion-root],
    [id*="accordion"] > div > div > div {
      max-width: 600px !important;
      width: 100% !important;
      margin: 0 auto !important;
    }

    /* Accordion items should respect parent width */
    [data-radix-accordion-item] {
      width: 100% !important;
      max-width: 100% !important;
    }

    /* Accordion trigger buttons */
    [data-radix-accordion-item] button {
      width: 100% !important;
      max-width: 100% !important;
    }

    /* ===== CODE & TABLES ===== */

    /* Code blocks */
    .sbdocs pre {
      background-color: #1A1F2E !important;
      border: 1px solid #0ec2bc33 !important;
    }

    .sbdocs .docblock-source {
      border-color: #0A7B77 !important;
    }

    /* Tables */
    .sbdocs table {
      color: #FFFFFF !important;
    }

    .sbdocs tbody tr {
      border-color: #0ec2bc33 !important;
    }

    /* ===== SIDEBAR ===== */

    /* Sidebar active button */
    .sidebar-item[data-selected="true"],
    .sidebar-item.active,
    [aria-selected="true"] {
      background-color: #C4C8D4 !important;
      color: #0A0F1A !important;
    }

    /* Sidebar hover state */
    .sidebar-item:hover {
      background-color: rgba(196, 200, 212, 0.1) !important;
    }
  `;
  document.head.appendChild(style);
}

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
    // Ozean Licht cosmic dark backgrounds
    backgrounds: {
      default: 'cosmic-dark',
      values: [
        {
          name: 'cosmic-dark',
          value: '#0A0F1A',
        },
        {
          name: 'card',
          value: '#1A1F2E',
        },
        {
          name: 'cosmic-gradient',
          value: 'linear-gradient(135deg, #0A0F1A 0%, #1A1F2E 50%, #0A0F1A 100%)',
        },
        {
          name: 'white',
          value: '#FFFFFF',
        },
      ],
    },
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
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'circle',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark (Ozean Licht)' },
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
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'dark';

      // Apply theme class to document root for Tailwind dark mode
      React.useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        // Apply cosmic background color
        root.style.backgroundColor = theme === 'dark' ? '#0A0F1A' : '#FFFFFF';
      }, [theme]);

      return React.createElement(
        'div',
        { className: theme === 'dark' ? 'dark' : '' },
        React.createElement(
          'div',
          {
            className: 'min-h-screen',
            style: {
              backgroundColor: theme === 'dark' ? '#0A0F1A' : '#FFFFFF',
              color: theme === 'dark' ? '#FFFFFF' : '#000000',
            },
          },
          React.createElement(Story)
        )
      );
    },
    // AI Iteration Decorator (development-only)
    (Story) => {
      React.useEffect(() => {
        // Only inject in development mode (localhost or 127.0.0.1)
        const isDev = window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1';

        if (!isDev) {
          // Production mode: Log informational message
          console.info(
            '🚀 Storybook is running in production mode. ' +
            'AI Iteration (Cmd+K) is only available in development. ' +
            'Run `pnpm storybook` locally to use AI features.'
          );
          return;
        }

        // Development mode: Inject AI iteration client script
        const script = document.createElement('script');
        script.src = '/ai-mvp-client.js';
        script.async = true;

        // Handle errors with helpful message
        script.onerror = () => {
          console.warn(
            '⚠️ AI iteration client failed to load. ' +
            'Ensure ANTHROPIC_API_KEY is set in .env and Storybook dev server is running.'
          );
        };

        // Only inject once
        if (!document.querySelector('script[src="/ai-mvp-client.js"]')) {
          document.body.appendChild(script);
        }
      }, []);

      return React.createElement(Story);
    },
  ],
};

export default preview;
