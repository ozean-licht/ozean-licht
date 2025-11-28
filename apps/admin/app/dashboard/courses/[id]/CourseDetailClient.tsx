'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Course, ModuleWithLessons } from '@/types/content';
import {
  CossUIButton,
  CossUICard,
  CossUICardPanel,
  CossUIAlert,
  CossUIAlertTitle,
  CossUIAlertDescription,
} from '@shared/ui';
import { ArrowLeft, Plus, BookOpen, Clock, Video, HelpCircle } from 'lucide-react';
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
      {/* Back Link */}
      <Link href="/dashboard/courses" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Courses
      </Link>

      {/* Course Header */}
      <CourseDetailHeader course={course} onEdit={() => setEditCourseOpen(true)} />

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CossUICard className="bg-card/50">
          <CossUICardPanel className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{modules.length}</p>
                <p className="text-sm text-muted-foreground">Modules</p>
              </div>
            </div>
          </CossUICardPanel>
        </CossUICard>

        <CossUICard className="bg-card/50">
          <CossUICardPanel className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Video className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{totalLessons}</p>
                <p className="text-sm text-muted-foreground">Lessons</p>
              </div>
            </div>
          </CossUICardPanel>
        </CossUICard>

        <CossUICard className="bg-card/50">
          <CossUICardPanel className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Clock className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{formatDuration(totalDuration)}</p>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
            </div>
          </CossUICardPanel>
        </CossUICard>

        <CossUICard className="bg-card/50">
          <CossUICardPanel className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <HelpCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold capitalize">{course.status}</p>
                <p className="text-sm text-muted-foreground">Status</p>
              </div>
            </div>
          </CossUICardPanel>
        </CossUICard>
      </div>

      {/* Modules Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Course Content</h2>
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
