export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  thumbnail?: string;
  published_at: string;
  author: string;
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'einfuehrung-lcq',
    title: 'Einführung in die LCQ® Methode',
    excerpt: 'Was ist Light Code Quantum und wie kann es dein Leben transformieren? Entdecke die Grundlagen dieser revolutionären Methode.',
    thumbnail: 'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/blog_images/lcq-intro.jpg',
    published_at: '2025-01-15T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  {
    id: '2',
    slug: 'chakra-balance-alltag',
    title: '7 Wege zur Chakra-Balance im Alltag',
    excerpt: 'Praktische Übungen, um deine Chakren täglich zu harmonisieren und in Balance zu halten, auch bei einem vollen Terminkalender.',
    thumbnail: 'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/blog_images/chakra-balance.jpg',
    published_at: '2025-01-20T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  {
    id: '3',
    slug: 'vollmond-rituale',
    title: 'Kraftvolle Vollmond-Rituale für Loslassen',
    excerpt: 'Nutze die transformative Energie des Vollmonds, um alte Muster loszulassen und Platz für Neues zu schaffen.',
    thumbnail: 'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/blog_images/full-moon.jpg',
    published_at: '2025-02-01T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  {
    id: '4',
    slug: 'meditation-fuer-anfaenger',
    title: 'Meditation für Anfänger: 5 Tipps für den Start',
    excerpt: 'Du möchtest mit Meditation beginnen? Diese 5 einfachen Tipps helfen dir, eine regelmäßige Praxis aufzubauen.',
    thumbnail: 'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/blog_images/meditation-tips.jpg',
    published_at: '2025-02-05T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  {
    id: '5',
    slug: 'kristalle-reinigen',
    title: 'Kristalle richtig reinigen und aufladen',
    excerpt: 'Lerne die wichtigsten Methoden, um deine Heilsteine zu reinigen und ihre Energie zu aktivieren.',
    thumbnail: 'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/blog_images/crystal-cleansing.jpg',
    published_at: '2025-02-10T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  {
    id: '6',
    slug: 'intuition-staerken',
    title: 'Wie du deine Intuition täglich stärkst',
    excerpt: 'Einfache Übungen und Praktiken, um deine intuitive Wahrnehmung zu schärfen und deiner inneren Stimme zu vertrauen.',
    thumbnail: 'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/blog_images/intuition.jpg',
    published_at: '2025-02-15T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  {
    id: '7',
    slug: 'manifestation-tipps',
    title: 'Die 3 Säulen erfolgreicher Manifestation',
    excerpt: 'Verstehe die grundlegenden Prinzipien der Manifestation und lerne, wie du sie in deinem Leben anwendest.',
    thumbnail: 'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/blog_images/manifestation.jpg',
    published_at: '2025-02-20T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  {
    id: '8',
    slug: 'energetischer-schutz',
    title: 'Energetischer Schutz für Empathen',
    excerpt: 'Spezielle Techniken für hochsensible Menschen, um sich vor energetischer Überladung zu schützen.',
    thumbnail: 'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/blog_images/protection.jpg',
    published_at: '2025-02-25T00:00:00Z',
    author: 'Lia Oberhauser',
  },
];
