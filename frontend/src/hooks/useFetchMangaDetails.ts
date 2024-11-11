// src/hooks/useFetchMangaDetails.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

export interface MangaDetails {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  titles: { type: string; title: string }[];
  title: string;
  title_english?: string;
  title_japanese?: string;
  type?: string;
  chapters?: number;
  volumes?: number;
  status?: string;
  publishing?: boolean;
  published?: { string: string };
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  synopsis?: string;
  background?: string;
  authors?: { mal_id: number; name: string; url: string }[];
  serializations?: { mal_id: number; name: string; url: string }[];
  genres?: { mal_id: number; name: string; url: string }[];
  themes?: { mal_id: number; name: string; url: string }[];
  demographics?: { mal_id: number; name: string; url: string }[];
}

// Fetch function with retry logic
const fetchWithRetry = async (url: string, retries = 3, delay = 1000): Promise<MangaDetails> => {
  try {
    const response = await axios.get(url);
    return response.data.data as MangaDetails;
  } catch (error: any) {
    if (retries > 0 && error.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const useFetchMangaDetails = (id: string) => {
  const [mangaDetails, setMangaDetails] = useState<MangaDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchWithRetry(`https://api.jikan.moe/v4/manga/${id}`);
        setMangaDetails(data);
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
