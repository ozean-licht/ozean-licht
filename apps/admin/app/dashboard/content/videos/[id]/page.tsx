/**
 * Video Detail Page
 *
 * Display a single video with metadata, platforms, and actions.
 * Server component using Next.js 14 App Router.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVideoWithPlatforms } from '@/lib/db/videos';
import { requireAnyRole } from '@/lib/rbac/utils';
import { PlatformBadges, MigrationStatus } from '@/components/videos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PIPELINE_STAGES } from '@/types/video';

interface VideoDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate metadata for video detail page
 */
export async function generateMetadata({ params }: VideoDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideoWithPlatforms(id);

  return {
    title: video ? `${video.title} | Video Detail` : 'Video Not Found',
    description: video?.description || 'View and manage video details',
  };
}

/**
 * Video Detail Page Component
 */
export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  // Require admin role for video management
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_content']);

  const { id } = await params;

  // Fetch video with platform data
  const video = await getVideoWithPlatforms(id);

  // Return 404 if video not found
  if (!video) {
    notFound();
  }

  // Find pipeline stage configuration
  const pipelineStageConfig = PIPELINE_STAGES.find(
    (stage) => stage.value === video.pipelineStage
  );

  // Format duration as mm:ss
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {video.title}
            </h1>
            <Badge
              variant={video.status === 'published' ? 'success' : video.status === 'draft' ? 'outline' : 'secondary'}
            >
              {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Created {formatDate(video.createdAt)}
          </p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/content/videos/${id}/edit`}>
            Edit Video
          </Link>
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Video Metadata Card */}
        <Card>
          <CardHeader>
            <CardTitle>Video Information</CardTitle>
            <CardDescription>Core video metadata and details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <p className="text-sm text-foreground">
                {video.description || 'No description provided'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Duration</h3>
                <p className="text-sm text-foreground font-mono">
                  {formatDuration(video.durationSeconds)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Entity Scope</h3>
                <p className="text-sm text-foreground">
                  {video.entityScope || 'Not set'}
                </p>
              </div>
            </div>

            {video.tags && video.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {video.publishedAt && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Published</h3>
                <p className="text-sm text-foreground">
                  {formatDate(video.publishedAt)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visibility & Pipeline Card */}
        <Card>
          <CardHeader>
            <CardTitle>Visibility & Status</CardTitle>
            <CardDescription>Video visibility and pipeline state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Visibility</h3>
              <Badge
                variant={
                  video.visibility === 'public'
                    ? 'success'
                    : video.visibility === 'private'
                    ? 'secondary'
                    : 'outline'
                }
                className="capitalize"
              >
                {video.visibility}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Pipeline Stage</h3>
              {pipelineStageConfig && (
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        pipelineStageConfig.color === 'gray'
                          ? '#9ca3af'
                          : pipelineStageConfig.color === 'yellow'
                          ? '#fbbf24'
                          : pipelineStageConfig.color === 'orange'
                          ? '#fb923c'
                          : pipelineStageConfig.color === 'blue'
                          ? '#60a5fa'
                          : pipelineStageConfig.color === 'purple'
                          ? '#c084fc'
                          : pipelineStageConfig.color === 'cyan'
                          ? '#22d3ee'
                          : pipelineStageConfig.color === 'green'
                          ? '#4ade80'
                          : '#94a3b8',
                    }}
                  />
                  <div>
                    <div className="text-sm font-medium">{pipelineStageConfig.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {pipelineStageConfig.description}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Sort Order</h3>
              <p className="text-sm text-foreground font-mono">{video.sortOrder}</p>
            </div>
          </CardContent>
        </Card>

        {/* Platform Distribution Card */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
            <CardDescription>Video availability across platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {video.platforms && video.platforms.length > 0 ? (
              <>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Platforms</h3>
                  <PlatformBadges platforms={video.platforms} />
                </div>

                <div className="space-y-3 pt-2 border-t">
                  {video.platforms.map((platform) => (
                    <div key={platform.id} className="space-y-1">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase">
                        {platform.platform}
                      </h4>
                      {platform.externalUrl && (
                        <a
                          href={platform.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline block"
                        >
                          View on {platform.platform}
                        </a>
                      )}
                      {platform.syncedAt && (
                        <p className="text-xs text-muted-foreground">
                          Last synced: {formatDate(platform.syncedAt)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No platforms configured for this video.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Migration Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Migration Status</CardTitle>
            <CardDescription>Vimeo to Hetzner migration tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Status</h3>
              <MigrationStatus video={video} />
            </div>

            {video.masterFileUrl && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Master File</h3>
                <a
                  href={video.masterFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {video.masterFileUrl}
                </a>
              </div>
            )}

            {video.videoUrl && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Video URL</h3>
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {video.videoUrl}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Assignment Card */}
        {(video.courseId || video.moduleId) && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Course Assignment</CardTitle>
              <CardDescription>Associated course and module</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {video.courseId && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Course ID</h3>
                  <Link
                    href={`/dashboard/courses/${video.courseId}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {video.course?.title || video.courseId}
                  </Link>
                </div>
              )}
              {video.moduleId && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Module ID</h3>
                  <p className="text-sm text-foreground">
                    {video.module?.title || video.moduleId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Back to List Link */}
      <div className="pt-4 border-t">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/content/videos">← Back to Videos</Link>
        </Button>
      </div>
    </div>
  );
}
