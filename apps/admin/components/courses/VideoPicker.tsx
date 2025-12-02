'use client';

import { useState, useEffect, useMemo } from 'react';
import { Video } from '@/types/content';
import {
  CossUIComboboxRoot,
  CossUIComboboxInput,
  CossUIComboboxTrigger,
  CossUIComboboxPopup,
  CossUIComboboxList,
  CossUIComboboxItem,
  CossUIComboboxEmpty,
  CossUIInputGroupRoot,
  CossUIInputGroupAddon,
  CossUIBadge,
  CossUIButton,
  CossUISkeleton,
} from '@shared/ui';
import { Video as VideoIcon, Clock, X, Search } from 'lucide-react';

interface VideoPickerProps {
  /** Currently selected video ID */
  value?: string;
  /** Callback when video is selected */
  onChange: (videoId: string | undefined, video?: Video) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
}

export default function VideoPicker({
  value,
  onChange,
  placeholder = 'Search videos...',
  disabled = false,
}: VideoPickerProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);

  // Fetch videos on mount
  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const response = await fetch('/api/videos?limit=1000');
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        const data = await response.json();
        setVideos(data.videos || []);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load videos');
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  // Format duration as mm:ss
  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter videos based on search query
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    const query = searchQuery.toLowerCase();
    return videos.filter(
      (video) =>
        video.title.toLowerCase().includes(query) ||
        (video.description && video.description.toLowerCase().includes(query))
    );
  }, [videos, searchQuery]);

  // Get selected video
  const selectedVideo = useMemo(
    () => videos.find((v) => v.id === value),
    [videos, value]
  );

  // Handle selection
  const handleSelect = (videoId: string | undefined | null) => {
    if (!videoId) return;
    const video = videos.find((v) => v.id === videoId);
    onChange(videoId, video);
    setOpen(false);
    setSearchQuery('');
  };

  // Handle clear
  const handleClear = () => {
    onChange(undefined, undefined);
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <CossUISkeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="relative">
      <CossUIComboboxRoot
        open={open}
        onOpenChange={setOpen}
        value={value}
        onValueChange={handleSelect}
        disabled={disabled}
      >
        <CossUIInputGroupRoot className="flex items-center">
          <CossUIInputGroupAddon>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CossUIInputGroupAddon>
          <CossUIComboboxInput
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder={selectedVideo ? selectedVideo.title : placeholder}
            className="flex-1"
          />
          {selectedVideo && (
            <CossUIButton
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 mr-1"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              <X className="h-4 w-4" />
            </CossUIButton>
          )}
          <CossUIComboboxTrigger />
        </CossUIInputGroupRoot>

        <CossUIComboboxPopup className="w-full max-h-[300px]">
          <CossUIComboboxList>
            {filteredVideos.length === 0 ? (
              <CossUIComboboxEmpty>
                {searchQuery ? 'No videos found' : 'No videos available'}
              </CossUIComboboxEmpty>
            ) : (
              filteredVideos.map((video) => (
                <CossUIComboboxItem
                  key={video.id}
                  value={video.id}
                  className="flex items-center gap-3 py-2"
                >
                  {/* Video Thumbnail or Icon */}
                  <div className="flex-shrink-0 w-12 h-8 bg-muted rounded overflow-hidden flex items-center justify-center">
                    {video.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={video.thumbnailUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <VideoIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{video.title}</div>
                    {video.description && (
                      <div className="text-sm text-muted-foreground truncate">
                        {video.description}
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {video.durationSeconds && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(video.durationSeconds)}</span>
                      </div>
                    )}
                    <CossUIBadge
                      variant={video.status === 'published' ? 'default' : 'secondary'}
                      className="text-xs capitalize"
                    >
                      {video.status}
                    </CossUIBadge>
                  </div>
                </CossUIComboboxItem>
              ))
            )}
          </CossUIComboboxList>
        </CossUIComboboxPopup>
      </CossUIComboboxRoot>

      {/* Selected Video Preview */}
      {selectedVideo && (
        <div className="mt-2 p-3 rounded-lg border bg-card/50 flex items-center gap-3">
          <div className="flex-shrink-0 w-16 h-10 bg-muted rounded overflow-hidden flex items-center justify-center">
            {selectedVideo.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedVideo.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <VideoIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{selectedVideo.title}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              {selectedVideo.durationSeconds && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(selectedVideo.durationSeconds)}
                </span>
              )}
              <CossUIBadge
                variant={selectedVideo.status === 'published' ? 'default' : 'secondary'}
                className="text-xs capitalize"
              >
                {selectedVideo.status}
              </CossUIBadge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
