'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Course, ModuleWithLessons } from '@/types/content';
import { Button, Badge, Alert, AlertTitle, AlertDescription } from '@/lib/ui';
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
        <Alert variant="destructive">
          <AlertTitle>Error loading course</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/courses/${course.slug}`, '_blank')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditCourseOpen(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Course Header */}
      <CourseDetailHeader course={course} />

      {/* Stats Row - Compact badges, centered */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Badge variant="outline" className="gap-1.5 py-1 px-2.5 capitalize">
          {course.status}
        </Badge>
        {course.category && (
          <Badge variant="outline" className="gap-1.5 py-1 px-2.5">
            {course.category}
          </Badge>
        )}
        <Badge variant="outline" className="gap-1.5 py-1 px-2.5">
          <BookOpen className="h-3.5 w-3.5" />
          <span>{modules.length} Modules</span>
        </Badge>
        <Badge variant="outline" className="gap-1.5 py-1 px-2.5">
          <Video className="h-3.5 w-3.5" />
          <span>{totalLessons} Lessons</span>
        </Badge>
        <Badge variant="outline" className="gap-1.5 py-1 px-2.5">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDuration(totalDuration)}</span>
        </Badge>
      </div>

      {/* Modules Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-decorative text-white">Course Content</h2>
          <Button onClick={() => setAddModuleOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
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
