// src/pages/AnimeCategoryPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import AnimeCard from '../components/AnimeCard';
import BackButton from '../components/BackButton';
import BackToTopButton from '../components/BackToTopButton';
import { fetchTopAnime } from '../services/animeService';
import { Anime } from '../services/animeService';

const AnimeCategoryPage: React.FC = () => {
  const { category = 'bypopularity' } = useParams<{ category?: string }>();
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchCategoryAnime = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTopAnime(category, page);
      setAnimeList(prev => [...prev, ...data]);
      setHasMore(data.length > 0);
    } catch (err) {
      setError('Failed to fetch anime data');
    } finally {
      setLoading(false);
    }
  }, [category, page]);

  useEffect(() => {
    fetchCategoryAnime();
  }, [fetchCategoryAnime]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
        loading
      ) {
        return;
      }
      setPage(prevPage => prevPage + 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 text-center">
          {category.charAt(0).toUpperCase() + category.slice(1)} Anime
        </h1>
        <hr className="border-t-2 border-gray-200 mb-6 w-2/3 mx-auto" />

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {animeList.map(anime => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>

        {loading && <p className="text-center mt-4">Loading more anime...</p>}
        {!hasMore && <p className="text-center mt-4">No more results.</p>}

        <BackToTopButton />
      </div>
    </Layout>
  );
};

export default AnimeCategoryPage;
