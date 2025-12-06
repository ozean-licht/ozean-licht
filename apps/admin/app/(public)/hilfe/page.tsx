import { Suspense } from 'react';
import { getAllArticles, getCategories } from '@/lib/db/knowledge-articles';
import { SearchBar, ArticleCard, CategoryList } from '@/components/hilfe';
import { Loader2 } from 'lucide-react';

interface Props {
  searchParams: Promise<{ category?: string; search?: string }>;
}

async function ArticleList({ category, search }: { category?: string; search?: string }) {
  const result = await getAllArticles({
    status: 'published',
    category: category || undefined,
    search: search || undefined,
    limit: 50,
  });

  if (result.articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#C4C8D4]">
          {search
            ? `Keine Artikel gefunden für "${search}"`
            : 'Keine Artikel in dieser Kategorie.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {result.articles.map((article) => (
        <ArticleCard
          key={article.id}
          title={article.title}
          slug={article.slug}
          summary={article.summary}
          category={article.category}
          viewCount={article.viewCount}
          helpfulCount={article.helpfulCount}
        />
      ))}
    </div>
  );
}

export default async function HilfePage({ searchParams }: Props) {
  const params = await searchParams;
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero section with search */}
      <section className="text-center mb-12">
        <h1 className="font-decorative text-4xl md:text-5xl text-white mb-4">
          Wie können wir helfen?
        </h1>
        <p className="text-[#C4C8D4] text-lg mb-8 max-w-2xl mx-auto">
          Durchsuchen Sie unsere Wissensdatenbank oder kontaktieren Sie unser Support-Team.
        </p>
        <SearchBar />
      </section>

      {/* Content with sidebar */}
      <div className="grid lg:grid-cols-[250px,1fr] gap-8">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <CategoryList
            categories={categories}
            activeCategory={params.category}
          />
        </aside>

        {/* Article list */}
        <section>
          {params.search && (
            <div className="mb-6">
              <h2 className="text-xl text-white">
                Suchergebnisse für &quot;{params.search}&quot;
              </h2>
            </div>
          )}
          {params.category && (
            <div className="mb-6">
              <h2 className="text-xl text-white">
                Kategorie: {params.category}
              </h2>
            </div>
          )}
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            }
          >
            <ArticleList category={params.category} search={params.search} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
