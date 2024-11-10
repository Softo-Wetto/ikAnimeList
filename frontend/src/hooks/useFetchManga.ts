// src/hooks/useFetchManga.ts

import { useEffect, useState } from 'react';
import { fetchTopManga, Manga } from '../services/mangaService';

export const useFetchManga = (
  type: string,
  filter: string,
  page: number = 1,
  limit: number = 10,
  staggerDelay = 0
) => {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = `manga_${type}_${filter}_${page}_${limit}`;
    const cachedData = localStorage.getItem(cacheKey);

    const fetchData = async () => {
      try {
        setLoading(true);

        // Apply stagger delay if specified
        if (staggerDelay > 0) await new Promise(resolve => setTimeout(resolve, staggerDelay));

        if (cachedData) {
          setMangaList(JSON.parse(cachedData));
        } else {
          const data = await fetchTopManga(type, filter, page, limit);
          setMangaList(data);
          localStorage.setItem(cacheKey, JSON.stringify(data));
        }
      } catch (err) {
        setError('Failed to fetch manga data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, filter, page, limit, staggerDelay]);

  return { mangaList, loading, error };
};
