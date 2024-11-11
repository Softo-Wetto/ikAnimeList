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

// Fetch top anime with filters
export const fetchTopAnime = async (filter: string = 'bypopularity', page: number = 1) => {
  return fetchWithRetry('https://api.jikan.moe/v4/top/anime', { filter, page });
};

// Search anime by title with filters and pagination
export const searchAnime = async (query: string, filters: Record<string, any> = {}, page: number = 1): Promise<Anime[]> => {
  const params = { q: query, page, ...filters };
  return fetchWithRetry('https://api.jikan.moe/v4/anime', params);
};

// Fetch anime list with filters and pagination, for default listing when no search query
export const fetchAnimeList = async (filters: Record<string, any> = {}, page: number = 1): Promise<Anime[]> => {
  const params = { page, ...filters };
  return fetchWithRetry('https://api.jikan.moe/v4/anime', params);
};

