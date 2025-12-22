'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

export default function WordCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCount() {
      try {
        const response = await fetch('/api/cards/count');
        const data = await response.json();
        setCount(data.count);
      } catch (error) {
        console.error('Error fetching count:', error);
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCount();
  }, []);

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full animate-pulse">
        <div className="w-5 h-5 bg-primary-200 rounded" />
        <div className="w-24 h-4 bg-primary-200 rounded" />
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full shadow-sm">
      <BookOpen className="w-5 h-5 text-primary-600" />
      <span className="text-sm font-semibold text-primary-900">
        {count} {count === 1 ? 'word' : 'words'} in library
      </span>
    </div>
  );
}
