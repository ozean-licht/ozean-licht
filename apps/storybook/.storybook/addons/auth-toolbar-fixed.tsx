/**
 * Authentication Toolbar Addon (Fixed)
 *
 * Adds authentication status to the Storybook toolbar.
 * Uses Storybook channel API to communicate with preview context.
 *
 * NOTE: This is the corrected version that properly uses Storybook's
 * architecture. The manager addon doesn't have access to React hooks,
 * so we use the channel API to get auth status from the preview context.
 */

import React from 'react';
import { addons, types } from '@storybook/manager-api';
import { IconButton } from '@storybook/components';

const ADDON_ID = 'ozean-licht/auth-toolbar';
const TOOL_ID = `${ADDON_ID}/tool`;
const CHANNEL_EVENT = `${ADDON_ID}/auth-status`;

/**
 * Auth Toolbar Component
 * Displays auth status received from preview via channel API
 */
const AuthToolbar = () => {
  const [authStatus, setAuthStatus] = React.useState<{
    status: 'loading' | 'authenticated' | 'unauthenticated';
    user?: { email: string; role: string };
  }>({ status: 'loading' });

  React.useEffect(() => {
    const channel = addons.getChannel();

    // Listen for auth status updates from preview
    const handleAuthStatus = (data: any) => {
      setAuthStatus(data);
    };

    channel.on(CHANNEL_EVENT, handleAuthStatus);

    // Request initial auth status
    channel.emit(`${ADDON_ID}/request-status`);

    return () => {
      channel.off(CHANNEL_EVENT, handleAuthStatus);
    };
  }, []);

  // Trigger login via channel
  const handleLogin = () => {
    const channel = addons.getChannel();
    channel.emit(`${ADDON_ID}/trigger-login`);
  };

  // Trigger logout via channel
  const handleLogout = () => {
    const channel = addons.getChannel();
    channel.emit(`${ADDON_ID}/trigger-logout`);
  };

  if (authStatus.status === 'loading') {
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

  if (authStatus.status === 'authenticated' && authStatus.user) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px',
          backgroundColor: 'rgba(14, 166, 193, 0.1)',
          borderRadius: '6px',
        }}
      >
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px',
            color: '#0EA6C1',
          }}
        >
          {authStatus.user.email}
        </span>
        <IconButton
          onClick={handleLogout}
          title="Sign Out"
          style={{
            padding: '4px',
            minWidth: 'auto',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6"
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.6667 11.3333L14 8L10.6667 4.66667"
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 8H6"
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </IconButton>
      </div>
    );
  }

  return (
    <IconButton
      key="login"
      title="Sign in to Storybook"
      onClick={handleLogin}
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
