'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Course, ModuleWithLessons } from '@/types/content';
import {
  CossUIButton,
  CossUIBadge,
  CossUIAlert,
  CossUIAlertTitle,
  CossUIAlertDescription,
} from '@shared/ui';
import { ArrowLeft, Plus, BookOpen, Clock, Video, Eye, Edit } from 'lucide-react';
import CourseDetailHeader from '@/components/courses/CourseDetailHeader';
import ModuleList from '@/components/courses/ModuleList';
import ModuleEditorModal from '@/components/courses/ModuleEditorModal';
import CourseEditorModal from '@/components/courses/CourseEditorModal';

interface CourseDetailClientProps {
  course: Course;
  initialModules: ModuleWithLessons[];
  error: string | null;
}

export default function CourseDetailClient({
  course: initialCourse,
  initialModules,
  error,
}: CourseDetailClientProps) {
  const [course, setCourse] = useState<Course>(initialCourse);
  const [modules, setModules] = useState<ModuleWithLessons[]>(initialModules);
  const [addModuleOpen, setAddModuleOpen] = useState(false);
  const [editCourseOpen, setEditCourseOpen] = useState(false);

  // Calculate totals
  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
  const totalDuration = modules.reduce(
    (sum, m) => sum + (m.totalDurationSeconds || 0),
    0
  );

  // Format duration as hours and minutes
  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '0 min';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/courses" className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>
        <CossUIAlert variant="destructive">
          <CossUIAlertTitle>Error loading course</CossUIAlertTitle>
          <CossUIAlertDescription>{error}</CossUIAlertDescription>
        </CossUIAlert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar - Back link and action buttons */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/courses" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>
        <div className="flex items-center gap-2">
          <CossUIButton
            variant="outline"
            size="sm"
            onClick={() => window.open(`/courses/${course.slug}`, '_blank')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </CossUIButton>
          <CossUIButton
            variant="outline"
            size="sm"
            onClick={() => setEditCourseOpen(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </CossUIButton>
        </div>
      </div>

      {/* Course Header */}
      <CourseDetailHeader course={course} />

      {/* Stats Row - Compact badges, centered */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <CossUIBadge variant="outline" className="gap-1.5 py-1 px-2.5 capitalize">
          {course.status}
        </CossUIBadge>
        {course.category && (
          <CossUIBadge variant="outline" className="gap-1.5 py-1 px-2.5">
            {course.category}
          </CossUIBadge>
        )}
        <CossUIBadge variant="outline" className="gap-1.5 py-1 px-2.5">
          <BookOpen className="h-3.5 w-3.5" />
          <span>{modules.length} Modules</span>
        </CossUIBadge>
        <CossUIBadge variant="outline" className="gap-1.5 py-1 px-2.5">
          <Video className="h-3.5 w-3.5" />
          <span>{totalLessons} Lessons</span>
        </CossUIBadge>
        <CossUIBadge variant="outline" className="gap-1.5 py-1 px-2.5">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDuration(totalDuration)}</span>
        </CossUIBadge>
      </div>

      {/* Modules Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-decorative text-white">Course Content</h2>
          <CossUIButton onClick={() => setAddModuleOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </CossUIButton>
        </div>

        <ModuleList
          courseId={course.id}
          modules={modules}
          onModulesChange={setModules}
        />
      </div>

      {/* Add Module Modal (for header button) */}
      <ModuleEditorModal
        courseId={course.id}
        module={null}
        open={addModuleOpen}
        onOpenChange={setAddModuleOpen}
        onSave={(savedModule) => {
          setModules([...modules, { ...savedModule, lessons: [] }]);
        }}
      />

      {/* Course Editor Modal */}
      <CourseEditorModal
        course={course}
        open={editCourseOpen}
        onOpenChange={setEditCourseOpen}
        onSave={(updatedCourse) => {
          setCourse(updatedCourse);
        }}
      />
    </div>
  );
}
