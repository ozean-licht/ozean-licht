'use client';

/**
 * Error Boundary for Kanban View
 *
 * Catches and displays errors that occur during Kanban board rendering.
 * Provides a user-friendly error message and recovery options.
 */

import { useEffect } from 'react';
import { Button, Card, CardContent, Alert, AlertTitle, AlertDescription } from '@/lib/ui';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function KanbanError({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      console.error('[Kanban Error Boundary]', error);
    } else {
      // In production, log sanitized error
      console.error('[Kanban Error]', error.message);
    }
  }, [error]);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-decorative text-white mb-3">
              Failed to Load Kanban Board
            </h1>

            {/* Error Message */}
            <p className="text-[#C4C8D4] mb-6">
              We encountered an error while loading the Kanban board. This might be due to a
              temporary issue or invalid data.
            </p>

            {/* Error Details (development only) */}
            {process.env.NODE_ENV === 'development' && (
              <Alert variant="destructive" className="mb-6 text-left">
                <AlertTitle className="text-sm font-medium">Error Details (Dev Mode)</AlertTitle>
                <AlertDescription className="text-xs mt-2 font-mono break-all">
                  {error.message}
                  {error.digest && (
                    <>
                      <br />
                      <span className="text-[#C4C8D4]">Digest: {error.digest}</span>
                    </>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={reset}
                className="bg-primary text-white hover:bg-primary/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/tools/tasks')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tasks
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-sm text-[#C4C8D4] mt-6">
              If this problem persists, please contact support or try accessing the{' '}
              <button
                onClick={() => router.push('/dashboard/tools/tasks')}
                className="text-primary hover:underline"
              >
                list view
              </button>
              {' '}instead.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
