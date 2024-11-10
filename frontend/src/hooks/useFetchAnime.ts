// src/hooks/useFetchAnime.ts

import { useEffect, useState } from 'react';
import { fetchTopAnime, Anime } from '../services/animeService';

export const useFetchAnime = (filter: string, staggerDelay = 0) => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = `anime_${filter}`;
    const cachedData = localStorage.getItem(cacheKey);

    const fetchData = async () => {
      try {
        setLoading(true);

        // Delay the fetch if a staggered delay is specified
        if (staggerDelay > 0) await new Promise(resolve => setTimeout(resolve, staggerDelay));

        // Use cached data if available
        if (cachedData) {
          setAnimeList(JSON.parse(cachedData));
        } else {
          const data = await fetchTopAnime(filter);
          setAnimeList(data);
          localStorage.setItem(cacheKey, JSON.stringify(data));
        }
      } catch (err) {
        setError('Failed to fetch anime data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter, staggerDelay]);

  return { animeList, loading, error };
};
