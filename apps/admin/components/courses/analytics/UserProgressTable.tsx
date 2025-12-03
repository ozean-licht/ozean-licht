'use client';

/**
 * UserProgressTable - Per-user progress view
 *
 * Displays enrolled users with their progress, time spent, and status.
 * Part of Phase 10: Progress & Analytics for Course Builder.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Pause,
  XCircle,
  AlertCircle,
} from 'lucide-react';

// Types
export type EnrollmentStatus = 'active' | 'paused' | 'completed' | 'cancelled' | 'expired';

export interface UserEnrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progressPercent: number;
  lessonsCompleted: number;
  totalTimeSeconds: number;
  certificateIssued: boolean;
  enrolledAt: string;
  startedAt: string | null;
  completedAt: string | null;
  lastAccessedAt: string | null;
  courseTitle?: string;
  totalLessons?: number;
  userName?: string;
  userEmail?: string;
}

interface UserProgressTableProps {
  enrollments: UserEnrollment[];
  total: number;
  limit: number;
  offset: number;
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  onStatusFilter?: (status: EnrollmentStatus | 'all') => void;
  onPageChange?: (page: number) => void;
  onUserClick?: (userId: string) => void;
}

/**
 * Format time duration
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) return '< 1m';
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Format date
 */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Status badge with icon
 */
function StatusBadge({ status }: { status: EnrollmentStatus }) {
  const config: Record<EnrollmentStatus, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
    active: { icon: Clock, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Active' },
    paused: { icon: Pause, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Paused' },
    completed: { icon: CheckCircle, color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Completed' },
    cancelled: { icon: XCircle, color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Cancelled' },
    expired: { icon: AlertCircle, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Expired' },
  };

  const { icon: Icon, color, label } = config[status];

  return (
    <Badge variant="outline" className={`${color} border gap-1`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

/**
 * Progress bar
 */
function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-[#0E282E] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            percent >= 100
              ? 'bg-green-500'
              : percent >= 50
              ? 'bg-primary'
              : 'bg-yellow-500'
          }`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      <span className="text-xs text-[#C4C8D4] w-10 text-right">{percent}%</span>
    </div>
  );
}

/**
 * Table skeleton
 */
function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

/**
 * UserProgressTable component
 */
export function UserProgressTable({
  enrollments,
  total,
  limit,
  offset,
  isLoading = false,
  onSearch,
  onStatusFilter,
  onPageChange,
  onUserClick,
}: UserProgressTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | 'all'>('all');

  // Calculate pagination
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  // Handle status filter
  const handleStatusFilter = (value: string) => {
    const status = value as EnrollmentStatus | 'all';
    setStatusFilter(status);
    onStatusFilter?.(status);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-medium text-white">
            Enrolled Users
          </CardTitle>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4C8D4]" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-9 w-48 bg-[#00111A] border-[#0E282E] text-white"
              />
            </div>
            {/* Status filter */}
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-32 bg-[#00111A] border-[#0E282E] text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#00111A] border-[#0E282E]">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="active" className="text-white">Active</SelectItem>
                <SelectItem value="completed" className="text-white">Completed</SelectItem>
                <SelectItem value="paused" className="text-white">Paused</SelectItem>
                <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
                <SelectItem value="expired" className="text-white">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TableSkeleton />
        ) : enrollments.length === 0 ? (
          <div className="py-12 text-center text-[#C4C8D4]">
            No enrollments found
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#0E282E]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#C4C8D4]">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#C4C8D4]">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#C4C8D4] min-w-[150px]">
                      Progress
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#C4C8D4]">
                      Lessons
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#C4C8D4]">
                      Time Spent
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#C4C8D4]">
                      Enrolled
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#C4C8D4]">
                      Last Active
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr
                      key={enrollment.id}
                      className="border-b border-[#0E282E] last:border-0 hover:bg-[#001e1f]/50 cursor-pointer"
                      onClick={() => onUserClick?.(enrollment.userId)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary text-sm font-medium">
                              {enrollment.userName?.charAt(0).toUpperCase() || enrollment.userEmail?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {enrollment.userName || 'Unknown User'}
                            </p>
                            <p className="text-xs text-[#C4C8D4]">
                              {enrollment.userEmail || enrollment.userId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={enrollment.status} />
                      </td>
                      <td className="py-3 px-4">
                        <ProgressBar percent={enrollment.progressPercent} />
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-[#C4C8D4]">
                        {enrollment.lessonsCompleted}
                        {enrollment.totalLessons !== undefined && (
                          <span className="text-[#C4C8D4]/60">/{enrollment.totalLessons}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-[#C4C8D4]">
                        {formatDuration(enrollment.totalTimeSeconds)}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-[#C4C8D4]">
                        {formatDate(enrollment.enrolledAt)}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-[#C4C8D4]">
                        {formatDate(enrollment.lastAccessedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#0E282E]">
                <p className="text-sm text-[#C4C8D4]">
                  Showing {offset + 1}-{Math.min(offset + limit, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="border-[#0E282E] text-[#C4C8D4]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-[#C4C8D4]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="border-[#0E282E] text-[#C4C8D4]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default UserProgressTable;
