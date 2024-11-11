// src/components/MangaList.tsx

import React from 'react';
import MangaCard from './MangaCard';
import { Manga } from '../services/mangaService';

interface MangaListProps {
  mangaList: Manga[];
}

const MangaList: React.FC<MangaListProps> = ({ mangaList }) => (
  <div className="manga-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
    {mangaList.map((manga) => (
      <MangaCard key={manga.mal_id} manga={manga} />
    ))}
  </div>
);

export default MangaList;
