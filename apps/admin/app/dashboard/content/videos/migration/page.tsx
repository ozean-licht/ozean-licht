/**
 * Video Migration Dashboard Page
 *
 * Server component that displays migration statistics and progress
 * from Vimeo to Hetzner hosting platform.
 *
 * Features:
 * - Migration statistics overview cards
 * - Estimated cost savings
 * - Migration progress visualization
 * - Interactive client component for actions
 */

import { Metadata } from 'next';
import { requireAnyRole } from '@/lib/rbac/utils';
import { getMigrationStats } from '@/lib/db/videos';
import { MigrationDashboardClient } from './MigrationDashboardClient';
import {
  Server,
  Cloud,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const metadata: Metadata = {
  title: 'Video Migration Dashboard | Admin Dashboard',
  description: 'Monitor and manage video migration from Vimeo to Hetzner',
};

export default async function MigrationDashboardPage() {
  // Require content management role (super_admin, ol_admin, or ol_content)
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_content']);

  // Fetch migration statistics
  const stats = await getMigrationStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-decorative text-white text-glow-subtle">
            Video Migration Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Track the migration progress from Vimeo to Hetzner hosting
          </p>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Videos Card */}
        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-sans text-muted-foreground">Total Videos</p>
              <p className="text-3xl font-decorative text-white mt-2">
                {stats.totalVideos}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Server className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Migrated Videos Card */}
        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-sans text-muted-foreground">Migrated</p>
              <p className="text-3xl font-decorative text-white mt-2">
                {stats.migratedCount}
              </p>
              <p className="text-xs font-sans text-emerald-400 mt-1">
                Hetzner Primary + Only
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Pending Videos Card */}
        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-sans text-muted-foreground">Pending</p>
              <p className="text-3xl font-decorative text-white mt-2">
                {stats.pendingCount}
              </p>
              <p className="text-xs font-sans text-blue-400 mt-1">
                Vimeo Only
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Cloud className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* In Progress Card */}
        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-sans text-muted-foreground">In Progress</p>
              <p className="text-3xl font-decorative text-white mt-2">
                {stats.inProgressCount}
              </p>
              <p className="text-xs font-sans text-yellow-400 mt-1">
                Currently Migrating
              </p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/10">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Migration Progress Section */}
      <div className="glass-card rounded-2xl p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-decorative text-white">Migration Progress</h2>
              <p className="text-sm font-sans text-muted-foreground mt-1">
                Overall completion status
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-decorative text-primary">
                {stats.migrationProgress}%
              </p>
              <p className="text-xs font-sans text-muted-foreground mt-1">
                Complete
              </p>
            </div>
          </div>

          <Progress value={stats.migrationProgress} className="h-3" />

          <div className="flex items-center justify-between text-sm font-sans text-muted-foreground">
            <span>{stats.migratedCount} of {stats.totalVideos} videos migrated</span>
            <span>{stats.pendingCount} remaining</span>
          </div>
        </div>
      </div>

      {/* Cost Savings Section */}
      <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-emerald-500/5 to-primary/5 border-emerald-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10">
            <DollarSign className="h-8 w-8 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-decorative text-white">Estimated Cost Savings</h2>
            <p className="text-sm font-sans text-muted-foreground mt-1">
              Monthly savings from migrated videos
            </p>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-4xl font-decorative text-emerald-400">
                ${stats.estimatedSavings}
              </span>
              <span className="text-sm font-sans text-muted-foreground">/month</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm font-sans text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span>Based on $5/video/month savings estimate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Component for Interactive Features */}
      <MigrationDashboardClient />
    </div>
  );
}
