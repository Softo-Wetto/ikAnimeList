// src/components/MangaCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Manga } from '../services/mangaService';

interface MangaCardProps {
  manga: Manga;
}

const MangaCard: React.FC<MangaCardProps> = ({ manga }) => (
  <Link to={`/manga/${manga.mal_id}`} className="manga-card bg-white rounded-lg shadow-md overflow-hidden transform transition hover:scale-105">
    <img src={manga.images.jpg.image_url} alt={manga.title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold text-primary">{manga.title}</h3>
      <p className="text-sm text-gray-600">Score: {manga.score}</p>
      {manga.chapters && <p className="text-sm text-gray-600">Chapters: {manga.chapters}</p>}
      {manga.volumes && <p className="text-sm text-gray-600">Volumes: {manga.volumes}</p>}
      <p className="text-sm text-gray-600">Type: {manga.type}</p>
    </div>
  </Link>
);

export default MangaCard;
