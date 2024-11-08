// src/pages/Home.tsx
import React, { useState } from 'react';
import Layout from '../components/Layout';
import AnimeList from '../components/AnimeList';
import { useFetchAnime } from '../hooks/useFetchAnime';

const Home: React.FC = () => {
  const [filter, setFilter] = useState<string>('bypopularity');
  const { animeList, loading, error } = useFetchAnime(filter);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  return (
    <Layout>
      <div className="filter-container flex justify-center items-center mt-6 mb-4">
        <label className="mr-3 text-lg font-semibold text-primary">Filter: </label>
        <select
          value={filter}
          onChange={handleFilterChange}
          className="p-2 bg-white border border-gray-300 rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-primary"
        >
          <option value="airing">Airing</option>
          <option value="upcoming">Upcoming</option>
          <option value="bypopularity">By Popularity</option>
          <option value="favorite">Favorite</option>
        </select>
      </div>

      {loading && <p className="text-center text-primary">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && <AnimeList animeList={animeList} />}
    </Layout>
  );
};

export default Home;
