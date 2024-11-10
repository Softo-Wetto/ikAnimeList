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

const fetchWithRetry = async (url: string, retries = 3, delay = 1000): Promise<MangaDetails> => {
  try {
    const response = await axios.get(url);
    return response.data.data as MangaDetails;
  } catch (error: any) {
    if (retries > 0 && error.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
};

export const useFetchMangaDetails = (id: string) => {
  const [mangaDetails, setMangaDetails] = useState<MangaDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = `manga_details_${id}`;
    const cachedData = localStorage.getItem(cacheKey);

    const fetchData = async () => {
      try {
        setLoading(true);

        if (cachedData) {
          setMangaDetails(JSON.parse(cachedData));
        } else {
          const data = await fetchWithRetry(`https://api.jikan.moe/v4/manga/${id}`);
          setMangaDetails(data);
          localStorage.setItem(cacheKey, JSON.stringify(data));
        }
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
