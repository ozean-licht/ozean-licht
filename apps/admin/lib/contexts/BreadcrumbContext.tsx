'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { BreadcrumbContextValue } from '@/types/breadcrumb';

/**
 * Breadcrumb context for managing custom labels across the application
 * Allows pages to override automatic breadcrumb labels with dynamic content
 */
const BreadcrumbContext = createContext<BreadcrumbContextValue | undefined>(undefined);

/**
 * Props for BreadcrumbProvider component
 */
interface BreadcrumbProviderProps {
  children: ReactNode;
}

/**
 * Breadcrumb context provider
 * Manages custom label overrides for breadcrumb navigation
 *
 * @example
 * // In layout
 * <BreadcrumbProvider>
 *   {children}
 * </BreadcrumbProvider>
 *
 * @example
 * // In a page component
 * const { setCustomLabel } = useBreadcrumb();
 * useEffect(() => {
 *   setCustomLabel('/dashboard/users/123', 'John Doe');
 * }, [userId]);
 */
export function BreadcrumbProvider({ children }: BreadcrumbProviderProps) {
  const [customLabels, setCustomLabels] = useState<Record<string, string>>({});

  /**
   * Set a custom label for a specific path
   * Useful for dynamic routes where the label comes from API data
   */
  const setCustomLabel = useCallback((path: string, label: string) => {
    setCustomLabels(prev => ({
      ...prev,
      [path]: label,
    }));
  }, []);

  /**
   * Clear all custom labels
   * Useful when navigating away from a section
   */
  const clearCustomLabels = useCallback(() => {
    setCustomLabels({});
  }, []);

  /**
   * Clear a specific custom label
   */
  const clearCustomLabel = useCallback((path: string) => {
    setCustomLabels(prev => {
      const updated = { ...prev };
      delete updated[path];
      return updated;
    });
  }, []);

  const value: BreadcrumbContextValue = {
    customLabels,
    setCustomLabel,
    clearCustomLabels,
    clearCustomLabel,
  };

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

/**
 * Hook to access breadcrumb context
 * Must be used within a BreadcrumbProvider
 *
 * @throws Error if used outside BreadcrumbProvider
 *
 * @example
 * const { setCustomLabel, customLabels } = useBreadcrumb();
 * setCustomLabel('/dashboard/courses/123', courseName);
 */
export function useBreadcrumb(): BreadcrumbContextValue {
  const context = useContext(BreadcrumbContext);

  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }

  return context;
}
