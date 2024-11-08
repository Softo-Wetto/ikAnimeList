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

export const useFetchAnimeDetails = (id: string) => {
  const [animeDetails, setAnimeDetails] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
        setAnimeDetails(response.data.data);
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
