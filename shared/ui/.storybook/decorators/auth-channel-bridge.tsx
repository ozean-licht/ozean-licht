/**
 * Auth Channel Bridge Decorator
 *
 * Bridges authentication state between preview context (where SessionProvider lives)
 * and manager context (where the toolbar addon lives) using Storybook's channel API.
 */

import React from 'react';
import { addons } from '@storybook/preview-api';
import { useSession, signIn, signOut } from '../../lib/auth/session-provider';
import { LoginModal } from '../../components/auth/LoginModal';

const ADDON_ID = 'ozean-licht/auth-toolbar';
const CHANNEL_EVENT = `${ADDON_ID}/auth-status`;

/**
 * Auth Channel Bridge Component
 * Wraps children and handles channel communication
 */
export function AuthChannelBridge({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  // Send auth status to manager whenever it changes
  React.useEffect(() => {
    const channel = addons.getChannel();

    const authStatus = {
      status,
      user: session?.user ? {
        email: session.user.email,
        role: session.user.role,
      } : undefined,
    };

    // Emit current status
    channel.emit(CHANNEL_EVENT, authStatus);

    // Listen for status requests from manager
    const handleStatusRequest = () => {
      channel.emit(CHANNEL_EVENT, authStatus);
    };

    // Listen for login trigger from manager
    const handleLoginTrigger = () => {
      setShowLoginModal(true);
    };

    // Listen for logout trigger from manager
    const handleLogoutTrigger = async () => {
      await signOut({ redirect: false });
      window.location.reload();
    };

    channel.on(`${ADDON_ID}/request-status`, handleStatusRequest);
    channel.on(`${ADDON_ID}/trigger-login`, handleLoginTrigger);
    channel.on(`${ADDON_ID}/trigger-logout`, handleLogoutTrigger);

    return () => {
      channel.off(`${ADDON_ID}/request-status`, handleStatusRequest);
      channel.off(`${ADDON_ID}/trigger-login`, handleLoginTrigger);
      channel.off(`${ADDON_ID}/trigger-logout`, handleLogoutTrigger);
    };
  }, [session, status]);

  return (
    <>
      {children}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}

/**
 * Decorator factory
 */
export const withAuthChannelBridge = (Story: React.ComponentType) => {
  return (
    <AuthChannelBridge>
      <Story />
    </AuthChannelBridge>
  );
};
