import { requireAnyRole } from '@/lib/rbac/utils';
import ArticleEditorClient from './ArticleEditorClient';

export default async function NewArticleEditorPage() {
  await requireAnyRole(['super_admin', 'ol_admin', 'support']);
  return <ArticleEditorClient />;
}
