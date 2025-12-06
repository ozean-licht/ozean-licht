import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function ArticleNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <FileQuestion className="w-16 h-16 text-primary mx-auto mb-6" />
      <h1 className="text-2xl font-medium text-white mb-4">
        Artikel nicht gefunden
      </h1>
      <p className="text-[#C4C8D4] mb-8">
        Der gewünschte Artikel existiert nicht oder wurde entfernt.
      </p>
      <Link
        href="/hilfe"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Zum Hilfe Center
      </Link>
    </div>
  );
}
