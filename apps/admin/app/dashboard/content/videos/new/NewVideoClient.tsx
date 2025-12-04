'use client';

/**
 * New Video Client Component
 *
 * Client-side form handler for creating a new video.
 * Manages form submission, loading state, and redirects on success.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Video } from 'lucide-react';
import { VideoForm } from '@/components/videos';
import type { CreateVideoInput } from '@/types/video';
import { toast } from '@/hooks/use-toast';

export default function NewVideoClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // ================================================================
  // Handlers
  // ================================================================

  /**
   * Handle form submission
   */
  const handleSubmit = async (data: CreateVideoInput) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create video');
      }

      const { video } = await response.json();

      // Show success toast
      toast({
        title: 'Video created',
        description: `${video.title} has been created successfully.`,
      });

      // Redirect to video detail page
      router.push(`/dashboard/content/videos/${video.id}`);
    } catch (err) {
      console.error('Failed to create video:', err);

      // Show error toast
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create video',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle cancel action
   */
  const handleCancel = () => {
    router.push('/dashboard/content/videos');
  };

  // ================================================================
  // Render
  // ================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-muted-foreground hover:text-white mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Videos
          </Button>
          <h1 className="text-4xl font-decorative text-white text-glow-subtle">
            Create Video
          </h1>
          <p className="text-muted-foreground mt-2">
            Add a new video to the Video Management System
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="bg-card/70 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Video Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VideoForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
