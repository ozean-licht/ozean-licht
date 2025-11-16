import type { Plugin } from 'vite';

/**
 * Vite plugin to inject a React shim script before any module loads
 * This prevents "Cannot read properties of undefined (reading 'useInsertionEffect')" error
 * 
 * Problem: Storybook core accesses React.useInsertionEffect during module initialization
 * but React module may not have loaded yet due to modulepreload race conditions
 * 
 * Solution: Inject synchronous script that creates React shim before any modules load
 */
export function injectReactShim(): Plugin {
  return {
    name: 'inject-react-shim',
    transformIndexHtml(html) {
      // Inject script right before the first <script type="module">
      const shim = `
    <!-- React Shim: Prevent useInsertionEffect undefined error -->
    <script>
      // Create minimal React shim to prevent errors during module initialization
      // This will be replaced by the real React once react-vendor loads
      if (typeof window !== 'undefined' && !window.React) {
        window.React = {
          useInsertionEffect: function() {},
          // Add other hooks to prevent similar errors
          useState: function() { return [null, function() {}]; },
          useEffect: function() {},
          useContext: function() {},
          useCallback: function(fn) { return fn; },
          useMemo: function(fn) { return fn(); },
          useRef: function() { return { current: null }; },
        };
      }
    </script>`;
      
      // Insert before first <script type="module">
      return html.replace(
        /<script type="module"/,
        shim + '\n    <script type="module"'
      );
    },
  };
}
