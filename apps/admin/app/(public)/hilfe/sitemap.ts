/**
 * Sitemap for Help Center
 * Generates dynamic sitemap for all published articles
 */
import { MetadataRoute } from 'next';
import { getAllArticles, getCategories } from '@/lib/db/knowledge-articles';

// Force dynamic rendering - sitemap needs database access
export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://admin.ozean-licht.at';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all published articles
  const { articles } = await getAllArticles({ status: 'published', limit: 100 });

  // Get all categories
  const categories = await getCategories();

  // Build sitemap entries
  const sitemapEntries: MetadataRoute.Sitemap = [
    // Main help center page
    {
      url: `${BASE_URL}/hilfe`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Category pages
    ...categories.map((category) => ({
      url: `${BASE_URL}/hilfe?category=${encodeURIComponent(category)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // Individual article pages
    ...articles.map((article) => ({
      url: `${BASE_URL}/hilfe/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  return sitemapEntries;
}
