'use client';

/**
 * Courses Gallery View
 *
 * Card-based view for course management.
 * Uses shared-ui components and Course type from database.
 */

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
  Button,
} from '@/lib/ui';
import {
  BookOpen,
  Users,
  Clock,
  MoreVertical,
  Plus,
  Eye,
  Pencil,
  GraduationCap,
  FileText,
} from 'lucide-react';
import { Course } from '@/types/content';

interface CoursesGalleryProps {
  courses: Course[];
}

type CourseStatus = 'all' | 'published' | 'draft';

function formatDuration(minutes?: number): string {
  if (!minutes) return '-';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours} hours`;
  return `${mins} min`;
}

function formatPrice(cents: number, currency: string): string {
  if (cents === 0) return 'Free';
  const amount = cents / 100;
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency || 'EUR',
  }).format(amount);
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="group cursor-pointer">
      {/* Thumbnail */}
      {course.thumbnailUrl ? (
        <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg overflow-hidden border-b border-primary/10">
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg flex items-center justify-center border-b border-primary/10">
          <BookOpen className="w-12 h-12 text-primary/40" />
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
          <button className="p-1 rounded-md hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4 text-[#C4C8D4]" />
          </button>
        </div>
        <CardDescription className="line-clamp-2">
          {course.shortDescription || course.description || 'No description'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Status and Price badges */}
        <div className="mb-3 flex items-center gap-2">
          <Badge variant={course.status === 'published' ? 'success' : 'secondary'}>
            {course.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
          {course.priceCents > 0 && (
            <Badge variant="outline">
              {formatPrice(course.priceCents, course.currency)}
            </Badge>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm text-[#C4C8D4]">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{course.enrollmentCount || 0}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            <span>{course.lessonCount || 0} lessons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(course.durationMinutes)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10 border-primary/20',
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl border ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <dt className="text-sm font-sans text-[#C4C8D4] mb-1">{label}</dt>
          <dd className="text-2xl font-sans font-medium text-white">{value}</dd>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
        <BookOpen className="w-10 h-10 text-primary/60" />
      </div>
      <h3 className="text-xl font-sans text-white mb-2">No courses yet</h3>
      <p className="text-[#C4C8D4] mb-6 max-w-sm mx-auto">
        Create your first course to start sharing knowledge with your students.
      </p>
      <Button className="bg-primary text-white hover:bg-primary/90">
        <Plus className="w-4 h-4 mr-2" />
        Create Course
      </Button>
    </div>
  );
}

export default function CoursesGallery({ courses }: CoursesGalleryProps) {
  const [activeTab, setActiveTab] = useState<CourseStatus>('all');

  // Calculate stats from real data
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(c => c.status === 'published').length;
  const draftCourses = courses.filter(c => c.status === 'draft').length;
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0);

  // Filter courses by tab
  const filteredCourses = courses.filter(course => {
    if (activeTab === 'all') return true;
    return course.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={totalCourses}
        />
        <StatCard
          icon={Eye}
          label="Published"
          value={publishedCourses}
          iconColor="text-green-400"
          iconBg="bg-green-500/10 border-green-500/20"
        />
        <StatCard
          icon={Pencil}
          label="Drafts"
          value={draftCourses}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
        />
        <StatCard
          icon={GraduationCap}
          label="Total Students"
          value={totalStudents}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10 border-blue-500/20"
        />
      </div>

      {/* Course List */}
      <div className="glass-card-strong rounded-2xl overflow-hidden">
        <Tabs defaultValue="all" onValueChange={(v: string | null) => v && setActiveTab(v as CourseStatus)}>
          {/* Tab Header */}
          <div className="px-6 py-4 border-b border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList>
                <TabsTab value="all">All Courses</TabsTab>
                <TabsTab value="published">Published</TabsTab>
                <TabsTab value="draft">Drafts</TabsTab>
              </TabsList>

              <p className="text-sm text-[#C4C8D4]">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <TabsPanel value="all">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsPanel>

            <TabsPanel value="published">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsPanel>

            <TabsPanel value="draft">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsPanel>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
