// src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import AnimeCard from '../components/AnimeCard';
import { useFetchTopAnime } from '../hooks/useFetchTopAnime';
import { Anime } from '../services/animeService';

const HomePage: React.FC = () => {
  const [airingAnime, setAiringAnime] = useState<Anime[]>([]);
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([]);
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [favoriteAnime, setFavoriteAnime] = useState<Anime[]>([]);

  const { animeList: airingList, loading: airingLoading, error: airingError } = useFetchTopAnime('airing');
  const { animeList: upcomingList, loading: upcomingLoading, error: upcomingError } = useFetchTopAnime('upcoming');
  const { animeList: popularList, loading: popularLoading, error: popularError } = useFetchTopAnime('bypopularity');
  const { animeList: favoriteList, loading: favoriteLoading, error: favoriteError } = useFetchTopAnime('favorite');

  useEffect(() => {
    setAiringAnime(airingList);
    setUpcomingAnime(upcomingList);
    setPopularAnime(popularList);
    setFavoriteAnime(favoriteList);
  }, [airingList, upcomingList, popularList, favoriteList]);

  return (
    <Layout>
      <HeroSection />
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-primary mb-10">Why You'll Love Our Site</h2>

        {/* Top Anime & Manga Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Top Anime & Manga</h3>
            <p className="text-gray-600">Discover the highest-rated and most popular anime and manga with ease.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Up-to-Date Information</h3>
            <p className="text-gray-600">Stay current with the latest trends and releases in the world of anime and manga.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">User-Friendly Design</h3>
            <p className="text-gray-600">Enjoy a clean, easy-to-use interface designed with anime and manga lovers in mind.</p>
          </div>
        </div>

        {/* Airing Section */}
        <div className="my-8">
          <div className="flex justify-between items-center mb-2 border-b pb-2">
            <h3 className="text-2xl font-bold">Airing:</h3>
            <Link
              to="/anime/category/airing"
              className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1.5 rounded-md border border-blue-500"
            >
              View All
            </Link>
          </div>
          {airingLoading && <p className="text-center">Loading airing anime...</p>}
          {airingError && <p className="text-center text-red-500">{airingError}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {airingAnime.slice(0, 6).map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </div>

        {/* Upcoming Section */}
        <div className="my-8">
          <div className="flex justify-between items-center mb-2 border-b pb-2">
            <h3 className="text-2xl font-bold">Upcoming:</h3>
            <Link
              to="/anime/category/upcoming"
              className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1.5 rounded-md border border-blue-500"
            >
              View All
            </Link>
          </div>
          {upcomingLoading && <p className="text-center">Loading upcoming anime...</p>}
          {upcomingError && <p className="text-center text-red-500">{upcomingError}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {upcomingAnime.slice(0, 6).map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </div>

        {/* Popular Section */}
        <div className="my-8">
          <div className="flex justify-between items-center mb-2 border-b pb-2">
            <h3 className="text-2xl font-bold">Popular:</h3>
            <Link
              to="/anime/category/popular"
              className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1.5 rounded-md border border-blue-500"
            >
              View All
            </Link>
          </div>
          {popularLoading && <p className="text-center">Loading popular anime...</p>}
          {popularError && <p className="text-center text-red-500">{popularError}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {popularAnime.slice(0, 6).map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </div>

        {/* Favorite Section */}
        <div className="my-8">
          <div className="flex justify-between items-center mb-2 border-b pb-2">
            <h3 className="text-2xl font-bold">Favorite:</h3>
            <Link
              to="/anime/category/favorite"
              className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1.5 rounded-md border border-blue-500"
            >
              View All
            </Link>
          </div>
          {favoriteLoading && <p className="text-center">Loading favorite anime...</p>}
          {favoriteError && <p className="text-center text-red-500">{favoriteError}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {favoriteAnime.slice(0, 6).map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
