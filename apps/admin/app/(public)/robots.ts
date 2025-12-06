/**
 * Robots.txt for the admin app
 * Allows crawling of public help center, blocks admin dashboard
 */
import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://admin.ozean-licht.at';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/hilfe/',
        disallow: [
          '/dashboard/',
          '/login',
          '/api/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/hilfe/sitemap.xml`,
  };
}
