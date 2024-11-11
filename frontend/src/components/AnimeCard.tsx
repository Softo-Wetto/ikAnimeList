// src/components/AnimeCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Anime } from '../services/animeService';

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => (
  <Link to={`/anime/${anime.mal_id}`} className="manga-card bg-white rounded-lg shadow-md overflow-hidden transform transition hover:scale-105">
    <img src={anime.images.jpg.image_url} alt={anime.title} className="w-full h-50 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold text-primary">{anime.title}</h3>
      <p className="text-sm text-gray-600">Score: {anime.score}</p>
      <p className="text-sm text-gray-600">Episodes: {anime.episodes}</p>
    </div>
  </Link>
);

export default AnimeCard;
