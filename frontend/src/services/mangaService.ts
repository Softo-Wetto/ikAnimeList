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

// Helper function to handle retries with exponential backoff
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

export const fetchTopManga = async (
  type: string = 'manga',
  filter: string = 'bypopularity',
  page: number = 1,
  limit: number = 10
) => {
  return fetchWithRetry('https://api.jikan.moe/v4/top/manga', { type, filter, page, limit });
};
