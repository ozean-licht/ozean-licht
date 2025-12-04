/**
 * MigrationStatus Component
 *
 * Displays migration status badge with optional rollback/migrate actions.
 * Shows current migration status between Vimeo and Hetzner platforms.
 */

import * as React from 'react';
import { Video, MIGRATION_STATUSES } from '@/types/video';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MigrationStatusProps {
  video: Video;
  onMigrate?: () => void;
  onRollback?: () => void;
  isLoading?: boolean;
}

// Valid Badge variants from the component
type BadgeVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'outline';

/**
 * Get badge variant and custom classes based on migration status color
 */
function getBadgeStyles(color: string): { variant: BadgeVariant; className: string } {
  switch (color) {
    case 'blue':
      return {
        variant: 'info',
        className: '',
      };
    case 'yellow':
      return {
        variant: 'warning',
        className: '',
      };
    case 'green':
      return {
        variant: 'success',
        className: '',
      };
    case 'emerald':
      return {
        variant: 'success',
        className: 'bg-emerald-600 shadow-emerald-600/20',
      };
    default:
      return {
        variant: 'default',
        className: '',
      };
  }
}

export function MigrationStatus({
  video,
  onMigrate,
  onRollback,
  isLoading = false,
}: MigrationStatusProps) {
  // Find the status configuration
  const statusConfig = MIGRATION_STATUSES.find(
    (s) => s.value === video.migrationStatus
  );

  if (!statusConfig) {
    console.warn(`Unknown migration status: ${video.migrationStatus}`);
    return null;
  }

  const { variant, className } = getBadgeStyles(statusConfig.color);
  const showMigrateButton = statusConfig.canMigrate && onMigrate;
  const showRollbackButton = statusConfig.canRollback && onRollback;

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={variant}
        className={cn('font-sans', className)}
        title={`Migration Status: ${statusConfig.label}`}
      >
        {statusConfig.label}
      </Badge>

      {showMigrateButton && (
        <Button
          size="sm"
          variant="outline"
          onClick={onMigrate}
          disabled={isLoading}
          className="h-7"
        >
          {isLoading ? 'Migrating...' : 'Migrate to Hetzner'}
        </Button>
      )}

      {showRollbackButton && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRollback}
          disabled={isLoading}
          className="h-7"
        >
          {isLoading ? 'Rolling back...' : 'Rollback to Vimeo'}
        </Button>
      )}
    </div>
  );
}
