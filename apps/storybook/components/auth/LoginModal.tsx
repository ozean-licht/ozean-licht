/**
 * Login Modal Component
 *
 * Modal for authenticating users in Storybook.
 * Uses Ozean Licht design system (oceanic cyan, glass morphism).
 */

import React, { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else if (result?.ok) {
        // Success - close modal and refresh
        onClose();
        window.location.reload();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('[LoginModal] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(0, 17, 26, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(14, 166, 193, 0.3)',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '420px',
          width: '90%',
          boxShadow: '0 0 30px rgba(14, 166, 193, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: "'Cinzel Decorative', Georgia, serif",
              fontSize: '28px',
              fontWeight: 400,
              color: '#fff',
              margin: 0,
              marginBottom: '8px',
              textShadow: '0 0 8px rgba(255, 255, 255, 0.42)',
            }}
          >
            Sign In to Storybook
          </h2>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px',
              fontWeight: 300,
              color: '#C4C8D4',
              margin: 0,
            }}
          >
            Access enhanced features with your Ozean Licht account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '20px',
                color: '#EF4444',
                fontSize: '14px',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {error}
            </div>
          )}

          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontFamily: "'Montserrat Alternates', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#fff',
                marginBottom: '8px',
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(0, 15, 31, 0.6)',
                border: '1px solid rgba(14, 40, 46, 1)',
                borderRadius: '6px',
                color: '#fff',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(14, 166, 193, 0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(14, 166, 193, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(14, 40, 46, 1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontFamily: "'Montserrat Alternates', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#fff',
                marginBottom: '8px',
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(0, 15, 31, 0.6)',
                border: '1px solid rgba(14, 40, 46, 1)',
                borderRadius: '6px',
                color: '#fff',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(14, 166, 193, 0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(14, 166, 193, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(14, 40, 46, 1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(14, 166, 193, 0.3)',
                borderRadius: '6px',
                color: '#0EA6C1',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '16px',
                fontWeight: 500,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = 'rgba(14, 166, 193, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: '#0EA6C1',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '16px',
                fontWeight: 500,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#0B859A';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(14, 166, 193, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0EA6C1';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <p
          style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '12px',
            fontFamily: "'Montserrat', sans-serif",
            color: '#C4C8D4',
            opacity: 0.7,
          }}
        >
          Secure authentication via shared_users_db
        </p>
      </div>
    </div>
  );
}
