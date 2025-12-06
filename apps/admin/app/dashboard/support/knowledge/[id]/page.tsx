import { notFound } from 'next/navigation';
import { getArticleById } from '@/lib/db/knowledge-articles';
import { requireAnyRole } from '@/lib/rbac/utils';
import ArticleEditorClient from '../editor/ArticleEditorClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  await requireAnyRole(['super_admin', 'ol_admin', 'support']);
  const { id } = await params;

  const article = await getArticleById(id);
  if (!article) {
    notFound();
  }

  return <ArticleEditorClient article={article} />;
}
