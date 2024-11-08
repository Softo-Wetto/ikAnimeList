// src/pages/AnimeDetailsPage.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useFetchAnimeDetails } from '../hooks/useFetchAnimeDetails';

const AnimeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract ID from URL params
  const { animeDetails, loading, error } = useFetchAnimeDetails(id || '');

  if (loading) return <Layout><p className="text-center text-primary">Loading...</p></Layout>;
  if (error) return <Layout><p className="text-center text-red-500">{error}</p></Layout>;

  return (
    <Layout>
      {animeDetails && (
        <div className="container mx-auto p-6 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">{animeDetails.title}</h1>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <img
              src={animeDetails.images.jpg.image_url}
              alt={animeDetails.title}
              className="w-full md:w-1/3 rounded-lg shadow-md mb-4"
            />
            <div className="flex-grow space-y-4">
              <p className="text-gray-700">{animeDetails.synopsis}</p>
              <p><strong>Episodes:</strong> {animeDetails.episodes}</p>
              <p><strong>Score:</strong> {animeDetails.score}</p>
              <p><strong>Aired:</strong> {animeDetails.aired.string}</p>
              <p><strong>Genres:</strong> {animeDetails.genres.map(genre => genre.name).join(', ')}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AnimeDetailsPage;
