import { useState } from 'react';

// Mock Next.js navigation hooks for Storybook
export function usePathname() {
  return '/';
}

export function useRouter() {
  return {
    push: (path: string) => {
      console.log('Mock router.push:', path);
    },
    replace: (path: string) => {
      console.log('Mock router.replace:', path);
    },
    back: () => {
      console.log('Mock router.back');
    },
    pathname: '/',
    query: {},
    asPath: '/',
  };
}

export function useSearchParams() {
  return new URLSearchParams();
}

export function useParams() {
  return {};
}
