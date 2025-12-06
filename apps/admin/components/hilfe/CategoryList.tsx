import Link from 'next/link';
import { Folder } from 'lucide-react';

interface CategoryListProps {
  categories: string[];
  activeCategory?: string;
}

export function CategoryList({ categories, activeCategory }: CategoryListProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <nav className="space-y-1">
      <h3 className="text-sm font-medium text-[#C4C8D4] uppercase tracking-wider mb-3">
        Kategorien
      </h3>
      <Link
        href="/hilfe"
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          !activeCategory
            ? 'bg-primary/10 text-primary'
            : 'text-[#C4C8D4] hover:text-white hover:bg-[#00111A]'
        }`}
      >
        <Folder className="w-4 h-4" />
        <span>Alle Artikel</span>
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/hilfe?category=${encodeURIComponent(category)}`}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            activeCategory === category
              ? 'bg-primary/10 text-primary'
              : 'text-[#C4C8D4] hover:text-white hover:bg-[#00111A]'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>{category}</span>
        </Link>
      ))}
    </nav>
  );
}
