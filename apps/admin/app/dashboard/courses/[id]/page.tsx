import { requireAnyRole } from '@/lib/rbac/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourseById } from '@/lib/db/courses';
import { getModulesWithLessonsByCourse } from '@/lib/db/modules';
import CourseDetailClient from './CourseDetailClient';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourseById(id);

  return {
    title: course ? `${course.title} | Course Builder` : 'Course Not Found',
    description: course?.description || 'Manage course modules and lessons',
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  // Require admin role for course management
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_content']);

  const { id } = await params;

  // Fetch course
  let course;
  let modules;
  let error: string | null = null;

  try {
    course = await getCourseById(id);
    if (!course) {
      notFound();
    }

    // Fetch modules with lessons
    modules = await getModulesWithLessonsByCourse(id);
  } catch (err) {
    console.error('Failed to fetch course:', err);
    error = err instanceof Error ? err.message : 'Failed to connect to database';
  }

  if (!course) {
    notFound();
  }

  return (
    <CourseDetailClient
      course={course}
      initialModules={modules || []}
      error={error}
    />
  );
}
