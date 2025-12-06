'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category?: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/public/hilfe/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/hilfe/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length >= 2) {
      setIsOpen(false);
      router.push(`/hilfe?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C4C8D4]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suche nach Hilfeartikeln..."
            className="w-full pl-12 pr-12 py-4 bg-[#00111A]/70 border border-[#0E282E] rounded-xl text-white placeholder-[#C4C8D4] focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
          />
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
          )}
        </div>
      </form>

      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-[#00111A] border border-[#0E282E] rounded-xl shadow-lg overflow-hidden"
        >
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result.slug)}
              className="w-full px-4 py-3 text-left hover:bg-primary/10 border-b border-[#0E282E] last:border-b-0 transition-colors"
            >
              <div className="text-white font-medium">{result.title}</div>
              {result.category && (
                <div className="text-xs text-primary mt-1">{result.category}</div>
              )}
              <div className="text-sm text-[#C4C8D4] mt-1 line-clamp-1">
                {result.summary}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
