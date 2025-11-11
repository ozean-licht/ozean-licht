/**
 * Storage Statistics Component
 * Display storage usage statistics and metrics
 * Now using ShadCN UI components for consistent styling
 */

'use client';

import { useState, useEffect } from 'react';
import {
  HardDrive,
  Files,
  TrendingUp,
  Clock,
  Database,
  BarChart3
} from 'lucide-react';
import { StorageStats as StorageStatsType, EntityScope } from '@/types/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StorageStatsProps {
  entityScope?: EntityScope;
}

export function StorageStats({ entityScope }: StorageStatsProps) {
  const [stats, setStats] = useState<StorageStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, [entityScope]);

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (entityScope) params.append('entityScope', entityScope);

      const response = await fetch(`/api/storage/stats?${params}`);

      if (!response.ok) {
        throw new Error('Failed to load statistics');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  const getUsagePercentage = (used: number, total: number = 500 * 1024 * 1024 * 1024): number => {
    // Assume 500GB total storage per entity for now
    return Math.min((used / total) * 100, 100);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-3 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between">
          <span>{error || 'Failed to load statistics'}</span>
          <Button variant="outline" size="sm" onClick={loadStats}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Files
            </CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalFiles.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {(stats.filesByStatus?.active || 0).toLocaleString()} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Storage Used
            </CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatSize(stats.totalSize)}
            </div>
            <Progress
              value={getUsagePercentage(stats.totalSize)}
              className="mt-2 h-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {getUsagePercentage(stats.totalSize).toFixed(1)}% of 500 GB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upload Activity
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.recentUploads.length}
            </div>
            <p className="text-xs text-muted-foreground">
              files uploaded today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Storage by Bucket */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage by Bucket
          </CardTitle>
          <CardDescription>
            Distribution of files across storage buckets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.filesByBucket && Object.entries(stats.filesByBucket).map(([bucket, count]) => {
            const bucketSize = stats.sizeByBucket?.[bucket] || 0;
            const percentage = (bucketSize / stats.totalSize) * 100;

            return (
              <div key={bucket} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{bucket}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count} files
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatSize(bucketSize)}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Uploads
          </CardTitle>
          <CardDescription>
            Latest files uploaded to the storage system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentUploads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent uploads
              </p>
            ) : (
              stats.recentUploads.slice(0, 5).map((file, index) => (
                <div
                  key={file.id}
                  className={cn(
                    "flex items-center justify-between py-2",
                    index !== stats.recentUploads.slice(0, 5).length - 1 &&
                    "border-b"
                  )}
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium truncate">
                      {file.originalFilename}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {file.bucketName}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(file.uploadedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground ml-4">
                    {formatSize(file.fileSizeBytes)}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Storage by Entity */}
      {!entityScope && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Storage by Entity
            </CardTitle>
            <CardDescription>
              Storage usage comparison between entities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.filesByEntity && (Object.entries(stats.filesByEntity) as unknown as [string, { count: number; size: number }][]).map(([entity, data]) => {
              const entityFiles = data.count || 0;
              const entitySize = data.size || 0;
              const percentage = (entitySize / stats.totalSize) * 100;

              return (
                <div key={entity} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium capitalize">
                        {entity.replace('_', ' ')}
                      </span>
                      <Badge
                        variant={entity === 'kids_ascension' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {entityFiles} files
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatSize(entitySize)}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}