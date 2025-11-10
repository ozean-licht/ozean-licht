'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes';

/**
 * Theme provider wrapper for next-themes
 * Enables dark/light mode switching with system preference support
 *
 * @example
 * // In root layout
 * <ThemeProvider defaultTheme="dark" enableSystem>
 *   {children}
 * </ThemeProvider>
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
