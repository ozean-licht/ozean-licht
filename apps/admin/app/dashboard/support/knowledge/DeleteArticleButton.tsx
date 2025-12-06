'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteArticleButtonProps {
  articleId: string;
  articleTitle: string;
}

export default function DeleteArticleButton({ articleId, articleTitle }: DeleteArticleButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${articleTitle}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/support/knowledge/${articleId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete article');
      }

      router.refresh();
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete article');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      className="p-2 text-[#C4C8D4] hover:text-red-400 hover:bg-[#00070F] rounded-lg transition-colors disabled:opacity-50"
      title="Delete article"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
