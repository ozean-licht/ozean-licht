import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Admin Dashboard',
  description: 'Create and manage blog posts for Ozean Licht',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
