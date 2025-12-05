import React from 'react';

/**
 * Props for the WidgetLauncher component
 */
export interface WidgetLauncherProps {
  /** Whether the widget is currently open */
  isOpen: boolean;
  /** Click handler for opening/closing the widget */
  onClick: () => void;
  /** Position of the launcher button on screen */
  position?: 'left' | 'right';
  /** Primary brand color in hex format */
  primaryColor?: string;
  /** Number of unread messages */
  unreadCount?: number;
}

/**
 * WidgetLauncher Component
 *
 * A floating action button that launches the support chat widget.
 * Features:
 * - Circular button with message bubble or close icon
 * - Positioned at bottom-left or bottom-right
 * - Shows unread message badge when applicable
 * - Smooth animations and transitions
 * - Accessible with proper ARIA labels
 */
export const WidgetLauncher: React.FC<WidgetLauncherProps> = ({
  isOpen,
  onClick,
  position = 'right',
  primaryColor = '#0ec2bc',
  unreadCount = 0,
}) => {
  // Calculate lighter hover color (10% lighter)
  const getLighterColor = (hex: string): string => {
    // Remove # if present
    const color = hex.replace('#', '');

    // Parse RGB components
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // Lighten by 10% (add 25 to each component, cap at 255)
    const lightenedR = Math.min(255, r + 25);
    const lightenedG = Math.min(255, g + 25);
    const lightenedB = Math.min(255, b + 25);

    // Convert back to hex
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(lightenedR)}${toHex(lightenedG)}${toHex(lightenedB)}`;
  };

  const lighterColor = getLighterColor(primaryColor);

  // Styles
  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '24px',
    [position]: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: primaryColor,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isOpen ? 'rotate(180deg) scale(0.9)' : 'rotate(0deg) scale(1)',
    zIndex: 999999,
    outline: 'none',
  };

  const iconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    color: '#ffffff',
    transition: 'transform 0.3s ease',
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#ff4444',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: 'bold',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    minWidth: '20px',
    height: '20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 6px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    lineHeight: '1',
  };

  const focusRingStyle: React.CSSProperties = {
    outline: '2px solid ' + primaryColor,
    outlineOffset: '2px',
  };

  // Message bubble icon (when closed)
  const MessageBubbleIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={iconStyle}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );

  // Close icon (X, when open)
  const CloseIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={iconStyle}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  // Show badge when there are unread messages and widget is closed
  const showBadge = !isOpen && unreadCount > 0;

  // Format unread count (99+ for values over 99)
  const formatUnreadCount = (count: number): string => {
    return count > 99 ? '99+' : count.toString();
  };

  // Accessibility label
  const ariaLabel = isOpen ? 'Close support chat' : 'Open support chat';

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = lighterColor;
        e.currentTarget.style.transform = isOpen
          ? 'rotate(180deg) scale(0.95)'
          : 'rotate(0deg) scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = primaryColor;
        e.currentTarget.style.transform = isOpen
          ? 'rotate(180deg) scale(0.9)'
          : 'rotate(0deg) scale(1)';
      }}
      onFocus={(e) => {
        Object.assign(e.currentTarget.style, focusRingStyle);
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
        e.currentTarget.style.outlineOffset = '0';
      }}
    >
      {isOpen ? <CloseIcon /> : <MessageBubbleIcon />}

      {showBadge && (
        <span style={badgeStyle} aria-live="polite">
          {formatUnreadCount(unreadCount)}
        </span>
      )}
    </button>
  );
};
