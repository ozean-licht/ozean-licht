import Link from 'next/link';
import { BookOpen, Eye, ThumbsUp } from 'lucide-react';

interface ArticleCardProps {
  title: string;
  slug: string;
  summary?: string;
  category?: string;
  viewCount?: number;
  helpfulCount?: number;
}

export function ArticleCard({
  title,
  slug,
  summary,
  category,
  viewCount = 0,
  helpfulCount = 0,
}: ArticleCardProps) {
  return (
    <Link href={`/hilfe/${slug}`} className="block group">
      <article className="p-6 bg-[#00111A]/70 border border-[#0E282E] rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            {category && (
              <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-[#001e1f] text-primary rounded">
                {category}
              </span>
            )}
            {summary && (
              <p className="mt-2 text-[#C4C8D4] text-sm line-clamp-2">{summary}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-[#C4C8D4]">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {viewCount}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" />
                {helpfulCount}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
