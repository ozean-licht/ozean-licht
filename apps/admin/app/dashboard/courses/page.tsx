import { requireAnyRole } from '@/lib/rbac/utils';
import { Metadata } from 'next';
import CoursesPageClient from './CoursesPageClient';
import { listCourses } from '@/lib/db/courses';

export const metadata: Metadata = {
  title: 'Courses | Admin Dashboard',
  description: 'Manage courses for Ozean Licht platform',
};

export default async function CoursesPage() {
  // Require admin role for course management
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_content']);

  // Fetch courses directly from PostgreSQL (no MCP Gateway dependency)
  let courses: Awaited<ReturnType<typeof listCourses>>['courses'] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const result = await listCourses({
      limit: 100,
      offset: 0,
      orderBy: 'created_at',
      orderDirection: 'desc',
    });
    courses = result.courses;
    total = result.total;
  } catch (err) {
    console.error('Failed to fetch courses:', err);
    error = err instanceof Error ? err.message : 'Failed to connect to database';
  }

  return (
    <CoursesPageClient
      initialCourses={courses}
      initialTotal={total}
      error={error}
    />
  );
}
