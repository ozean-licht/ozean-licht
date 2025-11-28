import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses - Admin Dashboard',
  description: 'Manage courses for Ozean Licht platform',
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
