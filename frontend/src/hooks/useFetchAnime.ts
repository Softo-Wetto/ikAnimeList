// src/hooks/useFetchAnime.ts

import { useEffect, useState } from 'react';
import { fetchTopAnime, Anime } from '../services/animeService';

export const useFetchAnime = (filter: string) => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchTopAnime(filter);
        setAnimeList(data);
      } catch (err) {
        setError('Failed to fetch anime data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  return { animeList, loading, error };
};