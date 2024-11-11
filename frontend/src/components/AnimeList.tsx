// src/components/AnimeList.tsx
import React from 'react';
import AnimeCard from './AnimeCard';
import { Anime } from '../services/animeService';

interface AnimeListProps {
  animeList: Anime[];
}

const AnimeList: React.FC<AnimeListProps> = ({ animeList }) => (
  <div className="anime-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
    {animeList.map((anime) => (
      <AnimeCard key={anime.mal_id} anime={anime} />
    ))}
  </div>
);

export default AnimeList;
