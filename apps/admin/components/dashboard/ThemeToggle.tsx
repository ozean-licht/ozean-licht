'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

/**
 * Theme toggle button component for switching between dark and light modes
 * Uses next-themes for theme management with smooth transitions
 *
 * Features:
 * - Smooth animations on theme switch
 * - Ozean Licht branding (glow effect)
 * - Keyboard accessible (Enter/Space to toggle)
 * - ARIA labels for screen readers
 *
 * @example
 * <ThemeToggle />
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 bg-gray-200 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900/30"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      role="button"
      tabIndex={0}
    >
      <Sun
        className={`absolute w-5 h-5 text-amber-500 transition-all duration-300 ${
          theme === 'dark'
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        }`}
      />
      <Moon
        className={`absolute w-5 h-5 text-primary-500 transition-all duration-300 ${
          theme === 'dark'
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
        }`}
      />
    </button>
  );
}
