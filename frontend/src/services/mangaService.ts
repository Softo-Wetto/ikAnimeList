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

export const fetchTopManga = async (
  type: string = 'manga',
  filter: string = 'bypopularity',
  page: number = 1,
  limit: number = 10
) => {
  const response = await axios.get(`https://api.jikan.moe/v4/top/manga`, {
    params: { type, filter, page, limit },
  });
  return response.data.data as Manga[];
};
