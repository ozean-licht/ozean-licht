/**
 * Migration Dashboard Client Component
 *
 * Interactive client component for video migration actions.
 * Provides filtering, video list display, and migration controls.
 */

'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Video, VideoMigrationStatus } from '@/types/video';
import { MigrationStatus } from '@/components/videos/MigrationStatus';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import {
  Search,
  Filter,
  RefreshCw,
  PlayCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MigrationDashboardClientProps {
  // Future: Add props for initial data if needed
}

export function MigrationDashboardClient({}: MigrationDashboardClientProps) {
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState<Record<string, boolean>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VideoMigrationStatus | 'all'>('all');

  // Fetch videos on mount
  useEffect(() => {
    fetchVideos();
  }, []);

  // Apply filters when videos or filters change
  useEffect(() => {
    applyFilters();
  }, [videos, searchQuery, statusFilter]);

  /**
   * Fetch all videos from API
   */
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/videos?limit=1000');

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: 'Error',
        description: 'Failed to load videos. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply search and filter logic
   */
  const applyFilters = () => {
    let filtered = [...videos];

    // Filter by migration status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((v) => v.migrationStatus === statusFilter);
    }

    // Filter by search query (title/description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.description?.toLowerCase().includes(query)
      );
    }

    setFilteredVideos(filtered);
  };

  /**
   * Handle individual video migration
   */
  const handleMigrate = async (videoId: string) => {
    try {
      setMigrating((prev) => ({ ...prev, [videoId]: true }));

      const response = await fetch(`/api/videos/${videoId}/migrate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Migration failed');
      }

      toast({
        title: 'Migration Started',
        description: 'Video migration has been queued.',
      });

      // Refresh videos to show updated status
      await fetchVideos();
    } catch (error) {
      console.error('Error migrating video:', error);
      toast({
        title: 'Migration Failed',
        description: 'Failed to start migration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setMigrating((prev) => ({ ...prev, [videoId]: false }));
    }
  };

  /**
   * Handle video rollback to Vimeo
   */
  const handleRollback = async (videoId: string) => {
    try {
      setMigrating((prev) => ({ ...prev, [videoId]: true }));

      const response = await fetch(`/api/videos/${videoId}/rollback`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Rollback failed');
      }

      toast({
        title: 'Rollback Complete',
        description: 'Video has been rolled back to Vimeo only.',
      });

      // Refresh videos
      await fetchVideos();
    } catch (error) {
      console.error('Error rolling back video:', error);
      toast({
        title: 'Rollback Failed',
        description: 'Failed to rollback video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setMigrating((prev) => ({ ...prev, [videoId]: false }));
    }
  };

  /**
   * Handle batch migration of selected videos
   */
  const handleBatchMigrate = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: 'No Videos Selected',
        description: 'Please select videos to migrate.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/videos/batch-migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoIds: selectedIds }),
      });

      if (!response.ok) {
        throw new Error('Batch migration failed');
      }

      toast({
        title: 'Batch Migration Started',
        description: `${selectedIds.length} videos queued for migration.`,
      });

      // Clear selection and refresh
      setSelectedIds([]);
      await fetchVideos();
    } catch (error) {
      console.error('Error in batch migration:', error);
      toast({
        title: 'Batch Migration Failed',
        description: 'Failed to start batch migration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle video selection
   */
  const toggleSelection = (videoId: string) => {
    setSelectedIds((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  /**
   * Toggle all videos selection
   */
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredVideos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVideos.map((v) => v.id));
    }
  };

  // Calculate stats for filtered videos
  const canMigrateCount = filteredVideos.filter(
    (v) => v.migrationStatus === 'vimeo_only'
  ).length;

  return (
    <div className="space-y-6">
      {/* Filters and Actions Bar */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-64">
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as VideoMigrationStatus | 'all')
                }
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="vimeo_only">Vimeo Only</SelectItem>
                  <SelectItem value="migrating">Migrating</SelectItem>
                  <SelectItem value="hetzner_primary">Hetzner Primary</SelectItem>
                  <SelectItem value="hetzner_only">Hetzner Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="default"
              onClick={fetchVideos}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Batch Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <span className="text-sm font-sans text-white">
                {selectedIds.length} video{selectedIds.length !== 1 ? 's' : ''} selected
              </span>
              <Button onClick={handleBatchMigrate} disabled={loading}>
                <PlayCircle className="h-4 w-4" />
                Migrate Selected
              </Button>
            </div>
          )}

          {/* Stats Summary */}
          <div className="flex items-center gap-6 text-sm font-sans text-muted-foreground">
            <span>Total: {filteredVideos.length}</span>
            <span className="text-blue-400">Can Migrate: {canMigrateCount}</span>
          </div>
        </div>
      </Card>

      {/* Videos Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-sans text-white">No videos found</p>
            <p className="text-sm font-sans text-muted-foreground mt-1">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredVideos.length > 0 &&
                        selectedIds.length === filteredVideos.length
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Migration Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVideos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(video.id)}
                        onCheckedChange={() => toggleSelection(video.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-sans text-white font-medium">
                          {video.title}
                        </p>
                        {video.description && (
                          <p className="text-sm font-sans text-muted-foreground line-clamp-1 mt-1">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-sans text-muted-foreground">
                        {video.durationSeconds
                          ? `${Math.floor(video.durationSeconds / 60)}:${String(
                              video.durationSeconds % 60
                            ).padStart(2, '0')}`
                          : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-sans text-muted-foreground capitalize">
                        {video.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <MigrationStatus
                        video={video}
                        onMigrate={() => handleMigrate(video.id)}
                        onRollback={() => handleRollback(video.id)}
                        isLoading={migrating[video.id]}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {video.migrationStatus === 'vimeo_only' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleMigrate(video.id)}
                          disabled={migrating[video.id]}
                        >
                          {migrating[video.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <PlayCircle className="h-4 w-4" />
                          )}
                          Migrate
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
