// src/hooks/useFetchSearchManga.ts

import { useEffect, useState } from 'react';
import { searchManga, fetchMangaList, Manga } from '../services/mangaService';

export const useFetchSearchManga = (query: string, filters: Record<string, any> = {}) => {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data: Manga[];

        if (query) {
          data = await searchManga(query, { ...filters, page });
        } else {
          data = await fetchMangaList({ ...filters, page });
        }

        setMangaList(prev => (page === 1 ? data : [...prev, ...data]));
        setHasMore(data.length > 0);
        setError(null);
      } catch (err) {
        setError('Failed to fetch manga data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, filters, page]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const resetSearch = () => {
    setMangaList([]);
    setPage(1);
  };

  return { mangaList, loading, error, loadMore, resetSearch, hasMore };
};
