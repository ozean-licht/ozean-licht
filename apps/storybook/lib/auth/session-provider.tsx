/**
 * Session Provider Wrapper for Storybook
 *
 * Wraps NextAuth SessionProvider for use in Storybook context.
 */

import React from 'react';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

interface SessionProviderProps {
  children: React.ReactNode;
}

/**
 * Wrapper component for NextAuth SessionProvider
 */
export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      // Refetch session every 5 minutes to keep it fresh
      refetchInterval={5 * 60}
      // Refetch on window focus
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  );
}

/**
 * Re-export useSession hook for convenience
 */
export { useSession, signIn, signOut } from 'next-auth/react';
