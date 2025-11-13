/**
 * Mock for next/navigation in Storybook
 *
 * Next.js navigation hooks are not available in Storybook,
 * so we provide simple mocks with basic functionality.
 */
import { useState, useEffect } from 'react';

/**
 * Mock useRouter hook
 * Returns router object with stubbed methods
 */
export function useRouter() {
  return {
    push: (url: string) => console.log('[Storybook] Router.push:', url),
    replace: (url: string) => console.log('[Storybook] Router.replace:', url),
    back: () => console.log('[Storybook] Router.back'),
    forward: () => console.log('[Storybook] Router.forward'),
    refresh: () => console.log('[Storybook] Router.refresh'),
    prefetch: (url: string) => console.log('[Storybook] Router.prefetch:', url),
  };
}

/**
 * Mock usePathname hook
 * Returns current pathname from window.location
 */
export function usePathname(): string {
  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);

  return pathname;
}

/**
 * Mock useSearchParams hook
 * Returns URLSearchParams object from window.location
 */
export function useSearchParams() {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(new URLSearchParams());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  return searchParams;
}

/**
 * Mock useParams hook
 * Returns empty params object
 */
export function useParams() {
  return {};
}

/**
 * Mock useSelectedLayoutSegment hook
 */
export function useSelectedLayoutSegment() {
  return null;
}

/**
 * Mock useSelectedLayoutSegments hook
 */
export function useSelectedLayoutSegments() {
  return [];
}

/**
 * Mock redirect function
 */
export function redirect(url: string) {
  console.log('[Storybook] Redirect to:', url);
  if (typeof window !== 'undefined') {
    window.location.href = url;
  }
}

/**
 * Mock notFound function
 */
export function notFound() {
  console.log('[Storybook] Not found triggered');
}
