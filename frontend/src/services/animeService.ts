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

export const fetchTopAnime = async (filter: string = 'bypopularity') => {
  const response = await axios.get(`https://api.jikan.moe/v4/top/anime`, {
    params: { filter },
  });
  return response.data.data as Anime[];
};