/**
 * Authentication Toolbar Addon
 *
 * Adds authentication status and controls to the Storybook toolbar.
 * Displays login button when unauthenticated, user menu when authenticated.
 */

import React, { useState, useEffect } from 'react';
import { addons, types } from '@storybook/manager-api';
import { IconButton } from '@storybook/components';
import { useSession } from 'next-auth/react';
import { LoginModal } from '../../components/auth/LoginModal';
import { UserMenu } from '../../components/auth/UserMenu';

const ADDON_ID = 'ozean-licht/auth-toolbar';
const TOOL_ID = `${ADDON_ID}/tool`;

/**
 * Auth Toolbar Component
 */
const AuthToolbar = () => {
  const { data: session, status } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Debug logging in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AuthToolbar] Session status:', status);
      console.log('[AuthToolbar] Session data:', session);
    }
  }, [session, status]);

  // Loading state
  if (status === 'loading') {
    return (
      <div
        style={{
          padding: '0 8px',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '12px',
          color: '#94A3B8',
        }}
      >
        Loading...
      </div>
    );
  }

  // Authenticated state - show user menu
  if (status === 'authenticated' && session?.user) {
    return <UserMenu session={session} />;
  }

  // Unauthenticated state - show login button
  return (
    <>
      <IconButton
        key="login"
        title="Sign in to Storybook"
        onClick={() => setShowLoginModal(true)}
        data-testid="auth-toolbar-login"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '14px',
          color: '#0EA6C1',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{ marginRight: '6px' }}
        >
          <path
            d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z"
            fill="currentColor"
          />
        </svg>
        Sign In
      </IconButton>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

/**
 * Register the addon
 */
addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Authentication',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => React.createElement(AuthToolbar),
  });
});
