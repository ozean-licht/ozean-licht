import { requireAuth } from '@/lib/auth-utils';
import CoursesDashboard from './CoursesDashboard';

export default async function CoursesPage() {
  // Ensure user is authenticated
  await requireAuth();

  return <CoursesDashboard />;
}
