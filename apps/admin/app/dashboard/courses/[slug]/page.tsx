import { requireAnyRole } from '@/lib/rbac/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourseById, getCourseBySlug } from '@/lib/db/courses';
import { getModulesWithLessonsByCourse } from '@/lib/db/modules';
import CourseDetailClient from './CourseDetailClient';

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Helper to fetch course by slug or ID (backward compatibility)
 * Tries slug first, then falls back to UUID lookup
 */
async function getCourse(slugOrId: string) {
  // Try slug first
  let course = await getCourseBySlug(slugOrId);

  // Fallback to ID lookup (for UUID backward compatibility)
  if (!course) {
    course = await getCourseById(slugOrId);
  }

  return course;
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);

  return {
    title: course ? `${course.title} | Course Builder` : 'Course Not Found',
    description: course?.description || 'Manage course modules and lessons',
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  // Require admin role for course management
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_content']);

  const { slug } = await params;

  // Fetch course
  let course;
  let modules;
  let error: string | null = null;

  try {
    course = await getCourse(slug);
    if (!course) {
      notFound();
    }

    // Fetch modules with lessons using course.id
    modules = await getModulesWithLessonsByCourse(course.id);
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
