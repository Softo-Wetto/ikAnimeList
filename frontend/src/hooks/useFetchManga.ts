// src/hooks/useFetchManga.ts

import { useEffect, useState } from 'react';
import { fetchTopManga, Manga } from '../services/mangaService';

export const useFetchManga = (type: string, filter: string, page: number, limit: number) => {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchTopManga(type, filter, page, limit);
        setMangaList(data);
      } catch (err) {
        setError('Failed to fetch manga data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, filter, page, limit]);

  return { mangaList, loading, error };
};
