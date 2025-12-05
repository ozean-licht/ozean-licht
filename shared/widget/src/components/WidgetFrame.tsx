/**
 * WidgetFrame Component
 *
 * Main chat window frame for the support widget.
 * Provides the container, header, and content area for the widget interface.
 */

import React, { CSSProperties } from 'react';

// ============================================================================
// Component Props
// ============================================================================

export interface WidgetFrameProps {
  /** Whether the widget is currently open */
  isOpen: boolean;
  /** Callback when user clicks close button */
  onClose: () => void;
  /** Widget position on screen */
  position?: 'left' | 'right';
  /** Primary brand color in hex format */
  primaryColor?: string;
  /** Greeting message shown when no messages exist */
  greeting?: string;
  /** Widget title shown in header */
  title?: string;
  /** Child content (message list and composer) */
  children?: React.ReactNode;
}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_POSITION = 'right';
const DEFAULT_PRIMARY_COLOR = '#0ec2bc';
const DEFAULT_GREETING = 'Hallo! Wie können wir Ihnen helfen?';
const DEFAULT_TITLE = 'Ozean Licht Support';

// ============================================================================
// WidgetFrame Component
// ============================================================================

export const WidgetFrame: React.FC<WidgetFrameProps> = ({
  isOpen,
  onClose,
  position = DEFAULT_POSITION,
  primaryColor = DEFAULT_PRIMARY_COLOR,
  greeting = DEFAULT_GREETING,
  title = DEFAULT_TITLE,
  children,
}) => {
  // Container styles based on position and open state
  const containerStyle: CSSProperties = {
    position: 'fixed',
    bottom: '90px', // Above launcher button (assuming ~70px button + 20px margin)
    [position]: '20px',
    width: '380px',
    maxHeight: '600px',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 2147483646, // Below launcher button (2147483647) but above everything else
    // Animation
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
    transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
    pointerEvents: isOpen ? 'auto' : 'none',
    visibility: isOpen ? 'visible' : 'hidden',
  };

  // Header styles with dynamic primary color
  const headerStyle: CSSProperties = {
    backgroundColor: primaryColor,
    color: '#ffffff',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
    boxSizing: 'border-box',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    flexShrink: 0,
  };

  const titleStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    margin: 0,
    color: '#ffffff',
    letterSpacing: '0.01em',
  };

  const closeButtonStyle: CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    lineHeight: '1',
    opacity: 0.9,
    transition: 'opacity 0.2s ease',
    width: '32px',
    height: '32px',
    borderRadius: '4px',
  };

  const closeButtonHoverStyle: CSSProperties = {
    ...closeButtonStyle,
    opacity: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  };

  const contentAreaStyle: CSSProperties = {
    flexGrow: 1,
    overflowY: 'auto',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  };

  // Greeting bubble styles (shown when no children messages)
  const greetingContainerStyle: CSSProperties = {
    padding: '32px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flex: 1,
  };

  const avatarStyle: CSSProperties = {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: primaryColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    fontSize: '28px',
    color: '#ffffff',
  };

  const greetingBubbleStyle: CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px 20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    maxWidth: '300px',
    fontSize: '15px',
    lineHeight: '1.5',
    color: '#374151',
  };

  // State for close button hover
  const [isCloseHovered, setIsCloseHovered] = React.useState(false);

  // Determine if we should show greeting (no children or children is empty)
  const shouldShowGreeting = !children;

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <h2 style={titleStyle}>{title}</h2>
        <button
          onClick={onClose}
          style={isCloseHovered ? closeButtonHoverStyle : closeButtonStyle}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          aria-label="Close widget"
          type="button"
        >
          ×
        </button>
      </header>

      {/* Content Area */}
      <div style={contentAreaStyle}>
        {shouldShowGreeting ? (
          // Show greeting when no messages
          <div style={greetingContainerStyle}>
            <div style={avatarStyle}>
              {/* Support icon (chat bubble) */}
              💬
            </div>
            <div style={greetingBubbleStyle}>
              {greeting}
            </div>
          </div>
        ) : (
          // Render children (message list and composer)
          children
        )}
      </div>
    </div>
  );
};

export default WidgetFrame;
