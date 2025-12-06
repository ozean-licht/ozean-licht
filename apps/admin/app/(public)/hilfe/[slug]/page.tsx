import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getArticleBySlug, incrementViewCount, getArticlesByCategory } from '@/lib/db/knowledge-articles';
import { ArticleFeedback, ContactEscalation, ArticleCard } from '@/components/hilfe';
import { sanitizeHtml } from '@/lib/utils/sanitize';
import { ArrowLeft, Calendar, Eye, ThumbsUp, Tag } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== 'published') {
    return {
      title: 'Artikel nicht gefunden',
    };
  }

  return {
    title: article.title,
    description: article.summary || article.content.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.summary || article.content.slice(0, 160),
      type: 'article',
      publishedTime: article.publishedAt || article.createdAt,
      modifiedTime: article.updatedAt,
    },
  };
}

async function RelatedArticles({ category, currentId }: { category?: string; currentId: string }) {
  if (!category) return null;

  const articles = await getArticlesByCategory(category);
  const related = articles.filter(a => a.id !== currentId).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-medium text-white mb-6">Ähnliche Artikel</h2>
      <div className="grid gap-4">
        {related.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            slug={article.slug}
            summary={article.summary}
            category={article.category}
          />
        ))}
      </div>
    </section>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== 'published') {
    notFound();
  }

  // Track view (fire and forget)
  // eslint-disable-next-line no-console
  incrementViewCount(article.id).catch(console.error);

  const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/hilfe"
          className="inline-flex items-center gap-2 text-[#C4C8D4] hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zum Hilfe Center</span>
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-8">
        {article.category && (
          <Link
            href={`/hilfe?category=${encodeURIComponent(article.category)}`}
            className="inline-block px-3 py-1 text-sm bg-primary/10 text-primary rounded-full mb-4 hover:bg-primary/20 transition-colors"
          >
            {article.category}
          </Link>
        )}
        <h1 className="font-decorative text-3xl md:text-4xl text-white mb-4">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#C4C8D4]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {article.viewCount} Aufrufe
          </span>
          <span className="flex items-center gap-1.5">
            <ThumbsUp className="w-4 h-4" />
            {article.helpfulCount} fanden das hilfreich
          </span>
        </div>
      </header>

      {/* Content */}
      <div
        className="prose prose-invert prose-lg max-w-none
          prose-headings:font-sans prose-headings:text-white
          prose-p:text-[#C4C8D4] prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white
          prose-code:text-primary prose-code:bg-[#00111A] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-[#00111A] prose-pre:border prose-pre:border-[#0E282E]
          prose-blockquote:border-l-primary prose-blockquote:text-[#C4C8D4]
          prose-ul:text-[#C4C8D4] prose-ol:text-[#C4C8D4]
          prose-li:marker:text-primary"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
      />

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-8 pt-8 border-t border-[#0E282E]">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-[#C4C8D4]" />
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-[#001e1f] text-[#C4C8D4] rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      <ArticleFeedback articleSlug={article.slug} />

      {/* Contact escalation */}
      <ContactEscalation articleTitle={article.title} />

      {/* Related articles */}
      <Suspense fallback={null}>
        <RelatedArticles category={article.category} currentId={article.id} />
      </Suspense>
    </article>
  );
}
