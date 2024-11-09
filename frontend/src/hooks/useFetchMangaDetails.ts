// src/hooks/useFetchMangaDetails.ts

import { useEffect, useState } from 'react';
import axios from 'axios';

export interface MangaDetails {
  mal_id: number;
  title: string;
  synopsis: string;
  score: number;
  chapters?: number;
  volumes?: number;
  images: {
    jpg: {
      image_url: string;
    };
  };
  published: {
    string: string;
  };
  genres: { name: string }[];
}

export const useFetchMangaDetails = (id: string) => {
  const [mangaDetails, setMangaDetails] = useState<MangaDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.jikan.moe/v4/manga/${id}`);
        setMangaDetails(response.data.data);
      } catch (err) {
        setError('Failed to fetch manga details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { mangaDetails, loading, error };
};
