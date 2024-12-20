// src/pages/AnimeListPage.tsx

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AnimeList from '../components/AnimeList';
import SearchBar from '../components/SearchBar';
import AnimeFilterDropdown from '../components/AnimeFilterDropdown';
import BackToTopButton from '../components/BackToTopButton';
import { useFetchSearchAnime } from '../hooks/useFetchSearchAnime';

const AnimeListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const { animeList, loading, error, loadMore, resetSearch, hasMore } = useFetchSearchAnime(searchTerm, filters);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetSearch();
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    resetSearch(); 
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500 && hasMore) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, hasMore]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        {/* Flex container for search and filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 bg-gray-100 rounded-lg shadow-md">
          {/* Search bar */}
          <div className="w-full md:w-1/4">
            <SearchBar search={searchTerm} onSearchChange={handleSearchChange} />
          </div>

          {/* Filters container */}
          <div className="flex-1 flex flex-wrap items-center gap-4">
            <AnimeFilterDropdown filters={filters} onFiltersChange={handleFiltersChange} />
          </div>
        </div>

        {error && <p className="text-center text-red-500">{error}</p>}
        <AnimeList animeList={animeList} />

        {loading && <p className="text-center text-primary">Loading more...</p>}
        <BackToTopButton />
      </div>
    </Layout>
  );
};

export default AnimeListPage;
