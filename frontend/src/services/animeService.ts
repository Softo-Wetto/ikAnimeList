// src/services/animeService.ts

import axios from 'axios';

export interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  score: number;
  episodes: number;
}

// Function to add retry logic
const fetchWithRetry = async (url: string, params: object, retries = 3, delay = 1000): Promise<Anime[]> => {
  try {
    const response = await axios.get(url, { params });
    return response.data.data as Anime[];
  } catch (error: any) {
    if (retries > 0 && error.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, params, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
};

export const fetchTopAnime = async (filter: string = 'bypopularity') => {
  return fetchWithRetry('https://api.jikan.moe/v4/top/anime', { filter });
};
