export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  thumbnail?: string;
  published_at: string;
  author: string;
}

// MinIO S3 base URL for blog images
const MINIO_BASE_URL = process.env.MINIO_PUBLIC_URL || '/images/blog';

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'einfuehrung-lcq',
    title: 'Einführung in die LCQ® Methode',
    excerpt: 'Was ist Light Code Quantum und wie kann es dein Leben transformieren? Entdecke die Grundlagen dieser revolutionären Methode.',
    thumbnail: `${MINIO_BASE_URL}/lcq-intro.jpg`,
    published_at: '2025-01-15T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  {
    id: '2',
    slug: 'chakra-balance-alltag',
    title: '7 Wege zur Chakra-Balance im Alltag',
    excerpt: 'Praktische Übungen, um deine Chakren täglich zu harmonisieren und in Balance zu halten, auch bei einem vollen Terminkalender.',
    thumbnail: `${MINIO_BASE_URL}/chakra-balance.jpg`,
    published_at: '2025-01-20T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  {
    id: '3',
    slug: 'vollmond-rituale',
    title: 'Kraftvolle Vollmond-Rituale für Loslassen',
    excerpt: 'Nutze die transformative Energie des Vollmonds, um alte Muster loszulassen und Platz für Neues zu schaffen.',
    thumbnail: `${MINIO_BASE_URL}/full-moon.jpg`,
    published_at: '2025-02-01T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  {
    id: '4',
    slug: 'meditation-fuer-anfaenger',
    title: 'Meditation für Anfänger: 5 Tipps für den Start',
    excerpt: 'Du möchtest mit Meditation beginnen? Diese 5 einfachen Tipps helfen dir, eine regelmäßige Praxis aufzubauen.',
    thumbnail: `${MINIO_BASE_URL}/meditation-tips.jpg`,
    published_at: '2025-02-05T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  {
    id: '5',
    slug: 'kristalle-reinigen',
    title: 'Kristalle richtig reinigen und aufladen',
    excerpt: 'Lerne die wichtigsten Methoden, um deine Heilsteine zu reinigen und ihre Energie zu aktivieren.',
    thumbnail: `${MINIO_BASE_URL}/crystal-cleansing.jpg`,
    published_at: '2025-02-10T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  {
    id: '6',
    slug: 'intuition-staerken',
    title: 'Wie du deine Intuition täglich stärkst',
    excerpt: 'Einfache Übungen und Praktiken, um deine intuitive Wahrnehmung zu schärfen und deiner inneren Stimme zu vertrauen.',
    thumbnail: `${MINIO_BASE_URL}/intuition.jpg`,
    published_at: '2025-02-15T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  {
    id: '7',
    slug: 'manifestation-tipps',
    title: 'Die 3 Säulen erfolgreicher Manifestation',
    excerpt: 'Verstehe die grundlegenden Prinzipien der Manifestation und lerne, wie du sie in deinem Leben anwendest.',
    thumbnail: `${MINIO_BASE_URL}/manifestation.jpg`,
    published_at: '2025-02-20T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  {
    id: '8',
    slug: 'energetischer-schutz',
    title: 'Energetischer Schutz für Empathen',
    excerpt: 'Spezielle Techniken für hochsensible Menschen, um sich vor energetischer Überladung zu schützen.',
    thumbnail: `${MINIO_BASE_URL}/protection.jpg`,
    published_at: '2025-02-25T00:00:00Z',
    author: 'Lia Oberhauser',
  },
];
