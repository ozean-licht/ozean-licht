/**
 * User Menu Component
 *
 * Dropdown menu showing authenticated user info with logout option.
 * Uses Ozean Licht design system (oceanic cyan, glass morphism).
 */

import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

interface UserMenuProps {
  session: Session;
}

export function UserMenu({ session }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.reload();
  };

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-testid="user-menu"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: 'rgba(0, 17, 26, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(14, 166, 193, 0.3)',
          borderRadius: '6px',
          color: '#fff',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(14, 166, 193, 0.5)';
          e.currentTarget.style.boxShadow = '0 0 12px rgba(14, 166, 193, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(14, 166, 193, 0.3)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* User Avatar */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#0EA6C1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            color: '#fff',
          }}
        >
          {session.user.email?.charAt(0).toUpperCase() || 'U'}
        </div>

        {/* User Info */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>
            {session.user.name || session.user.email?.split('@')[0]}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#C4C8D4',
              opacity: 0.8,
            }}
          >
            {session.user.role || 'User'}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            marginLeft: '4px',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: '220px',
            backgroundColor: 'rgba(0, 17, 26, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(14, 166, 193, 0.3)',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            zIndex: 10000,
          }}
        >
          {/* User Info Section */}
          <div
            style={{
              padding: '12px',
              borderBottom: '1px solid rgba(14, 166, 193, 0.2)',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#fff',
                marginBottom: '4px',
              }}
            >
              {session.user.email}
            </div>
            <div
              style={{
                display: 'inline-block',
                padding: '4px 8px',
                backgroundColor: 'rgba(14, 166, 193, 0.2)',
                border: '1px solid rgba(14, 166, 193, 0.4)',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: "'Montserrat Alternates', sans-serif",
                color: '#0EA6C1',
                fontWeight: 500,
              }}
            >
              {session.user.entityType || 'Ozean Licht'}
            </div>
          </div>

          {/* Menu Items */}
          <button
            onClick={handleLogout}
            data-testid="logout-button"
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: '#EF4444',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {/* Logout Icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.6667 11.3333L14 8L10.6667 4.66667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 8H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
