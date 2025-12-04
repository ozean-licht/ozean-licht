'use client';

/**
 * Edit Video Client Component
 *
 * Handles video editing form with:
 * - Form submission to PUT /api/videos/${id}
 * - Loading state management
 * - Success redirect to video detail page
 * - Error handling with toast notifications
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Video, UpdateVideoInput } from '@/types/video';
import { VideoForm } from '@/components/videos';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface EditVideoClientProps {
  video: Video;
}

export default function EditVideoClient({ video }: EditVideoClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle form submission
   * Sends PUT request to /api/videos/[id]
   */
  const handleSubmit = async (data: UpdateVideoInput) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/videos/${video.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update video');
      }

      const updatedVideo = await response.json();

      // Show success toast
      toast({
        title: 'Success',
        description: 'Video updated successfully',
        variant: 'default',
      });

      // Redirect to video detail page
      router.push(`/dashboard/content/videos/${updatedVideo.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating video:', error);

      // Show error toast
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update video',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle cancel action
   * Navigates back to video detail page
   */
  const handleCancel = () => {
    router.push(`/dashboard/content/videos/${video.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          disabled={isLoading}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-4xl font-decorative text-white text-glow-subtle">
            Edit Video: {video.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            Update video details and settings
          </p>
        </div>
      </div>

      {/* Video Form */}
      <div className="bg-card/50 border border-primary/10 rounded-lg p-6 backdrop-blur-sm">
        <VideoForm
          video={video}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
