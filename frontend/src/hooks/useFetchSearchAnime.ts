// src/hooks/useFetchSearchAnime.ts

import { useEffect, useState } from 'react';
import { searchAnime, fetchAnimeList, Anime } from '../services/animeService';

export const useFetchSearchAnime = (query: string, filters: Record<string, any> = {}) => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data: Anime[];

        if (query) {
          data = await searchAnime(query, { ...filters, page });
        } else {
          data = await fetchAnimeList({ ...filters, page });
        }

        setAnimeList(prev => (page === 1 ? data : [...prev, ...data])); // Append or replace based on page
        setHasMore(data.length > 0);
        setError(null);
      } catch (err) {
        setError('Failed to fetch anime data');
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
    setAnimeList([]);
    setPage(1);
  };

  return { animeList, loading, error, loadMore, resetSearch, hasMore };
};
