/**
 * ErrorBoundary Component
 *
 * Catches React errors in child components and displays fallback UI
 * Prevents entire app crash when errors occur in messaging components
 */

'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary catches errors in React component tree
 *
 * When an error is caught:
 * - Displays a fallback UI with error message
 * - Provides a "Reload" button to refresh the page
 * - Logs error details to console for debugging
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MessagesPageClient />
 * </ErrorBoundary>
 * ```
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = (): void => {
    // Reload the page to reset state
    window.location.reload();
  };

  handleReset = (): void => {
    // Reset error state to try rendering again
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-2xl w-full bg-card/70 backdrop-blur-sm border border-border rounded-lg p-8">
            <div className="text-center">
              {/* Error icon */}
              <div className="mx-auto w-16 h-16 mb-4 text-red-500">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Error title */}
              <h2 className="text-2xl font-semibold text-white mb-2">
                Something went wrong
              </h2>

              {/* Error message */}
              <p className="text-sm font-sans font-light text-[#C4C8D4] mb-6">
                An error occurred while loading the messaging system. Please try
                reloading the page.
              </p>

              {/* Error details (development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-[#C4C8D4] mb-2">
                    Error details (development only)
                  </summary>
                  <div className="bg-background/50 rounded-lg p-4 overflow-auto max-h-64">
                    <pre className="text-xs text-red-400 whitespace-pre-wrap">
                      {this.state.error.toString()}
                      {'\n\n'}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </details>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="min-w-[120px]"
                >
                  Try Again
                </Button>
                <Button
                  onClick={this.handleReload}
                  className="min-w-[120px]"
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
