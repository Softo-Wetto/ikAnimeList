// src/pages/MangaListPage.tsx

import React, { useState } from 'react';
import Layout from '../components/Layout';
import MangaList from '../components/MangaList';
import { useFetchManga } from '../hooks/useFetchManga';

const MangaListPage: React.FC = () => {
  const [type, setType] = useState<string>('manga');
  const [filter, setFilter] = useState<string>('bypopularity');
  const limit = 10;

  const { mangaList, loading, error } = useFetchManga(type, filter, 1, limit);

  return (
    <Layout>
      <div className="filter-container flex justify-center items-center mt-6 mb-4">
        <label className="mr-3 text-lg font-semibold text-primary">Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="p-2 bg-white border border-gray-300 rounded-md text-gray-700 shadow-sm">
          <option value="manga">Manga</option>
          <option value="novel">Novel</option>
          <option value="lightnovel">Light Novel</option>
          <option value="oneshot">One-Shot</option>
          <option value="doujin">Doujin</option>
          <option value="manhwa">Manhwa</option>
          <option value="manhua">Manhua</option>
        </select>

        <label className="ml-6 mr-3 text-lg font-semibold text-primary">Filter:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 bg-white border border-gray-300 rounded-md text-gray-700 shadow-sm">
          <option value="publishing">Publishing</option>
          <option value="upcoming">Upcoming</option>
          <option value="bypopularity">By Popularity</option>
          <option value="favorite">Favorite</option>
        </select>
      </div>

      {loading && <p className="text-center text-primary">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && <MangaList mangaList={mangaList} />}
    </Layout>
  );
};

export default MangaListPage;
