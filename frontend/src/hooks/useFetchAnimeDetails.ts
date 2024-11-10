// src/hooks/useFetchAnimeDetails.ts

import { useEffect, useState } from 'react';
import axios from 'axios';

export interface AnimeDetails {
  mal_id: number;
  title: string;
  synopsis: string;
  score: number;
  episodes: number;
  images: {
    jpg: {
      image_url: string;
    };
  };
  aired: {
    string: string;
  };
  genres: { name: string }[];
}

// Helper function for retrying requests
const fetchWithRetry = async (url: string, retries = 3, delay = 1000): Promise<AnimeDetails> => {
  try {
    const response = await axios.get(url);
    return response.data.data as AnimeDetails;
  } catch (error: any) {
    if (retries > 0 && error.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
};

export const useFetchAnimeDetails = (id: string) => {
  const [animeDetails, setAnimeDetails] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}`);
        setAnimeDetails(data);
      } catch (err) {
        setError('Failed to fetch anime details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { animeDetails, loading, error };
};
