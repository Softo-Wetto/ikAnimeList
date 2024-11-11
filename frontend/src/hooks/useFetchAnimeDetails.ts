// src/hooks/useFetchAnimeDetails.ts

import { useEffect, useState } from 'react';
import axios from 'axios';

export interface AnimeDetails {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
  };
  titles: { type: string; title: string }[];
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string | null;
  source: string | null;
  episodes: number | null;
  status: string | null;
  airing: boolean;
  aired: { string: string };
  duration: string | null;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  producers: { mal_id: number; name: string; url: string }[];
  licensors: { mal_id: number; name: string; url: string }[];
  studios: { mal_id: number; name: string; url: string }[];
  genres: { mal_id: number; name: string; url: string }[];
  themes: { mal_id: number; name: string; url: string }[];
  demographics: { mal_id: number; name: string; url: string }[];
}

// Helper function to retry fetching data on 429 error
const fetchWithRetry = async (url: string, retries = 3, delay = 1000): Promise<AnimeDetails> => {
  try {
    const response = await axios.get(url);
    return response.data.data as AnimeDetails;
  } catch (error: any) {
    if (retries > 0 && error.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
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
