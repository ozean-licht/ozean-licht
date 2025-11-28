import { requireAuth } from '@/lib/auth-utils';
import BlogWriter from './BlogWriter';

export default async function BlogPage() {
  const session = await requireAuth();
  return <BlogWriter user={session.user} />;
}
