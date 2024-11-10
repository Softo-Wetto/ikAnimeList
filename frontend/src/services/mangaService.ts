// src/services/mangaService.ts

import axios from 'axios';

export interface Manga {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  score: number;
  chapters?: number;
  volumes?: number;
  type: string;
}

const fetchWithRetry = async (url: string, params: object, retries = 3, delay = 1000): Promise<Manga[]> => {
  try {
    const response = await axios.get(url, { params });
    return response.data.data as Manga[];
  } catch (error: any) {
    if (retries > 0 && error.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, params, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
};

// Fetch top manga with filters
export const fetchTopManga = async (filter: string = 'bypopularity') => {
  return fetchWithRetry('https://api.jikan.moe/v4/top/manga', { filter });
};

// Search manga by title with filters and pagination
export const searchManga = async (query: string, filters: Record<string, any> = {}, page: number = 1): Promise<Manga[]> => {
  const params = { q: query, page, ...filters };
  return fetchWithRetry('https://api.jikan.moe/v4/manga', params);
};

// Fetch manga list with filters and pagination, for default listing when no search query
export const fetchMangaList = async (filters: Record<string, any> = {}, page: number = 1): Promise<Manga[]> => {
  const params = { page, ...filters };
  return fetchWithRetry('https://api.jikan.moe/v4/manga', params);
};
