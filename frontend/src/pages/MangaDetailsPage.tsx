// src/pages/MangaDetailsPage.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useFetchMangaDetails } from '../hooks/useFetchMangaDetails';

const MangaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL params
  const { mangaDetails, loading, error } = useFetchMangaDetails(id || '');

  if (loading) return <Layout><p className="text-center text-primary">Loading...</p></Layout>;
  if (error) return <Layout><p className="text-center text-red-500">{error}</p></Layout>;

  return (
    <Layout>
      {mangaDetails && (
        <div className="container mx-auto p-6 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">{mangaDetails.title}</h1>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <img
              src={mangaDetails.images.jpg.image_url}
              alt={mangaDetails.title}
              className="w-full md:w-1/3 rounded-lg shadow-md mb-4"
            />
            <div className="flex-grow space-y-4">
              <p className="text-gray-700">{mangaDetails.synopsis}</p>
              {mangaDetails.chapters && <p><strong>Chapters:</strong> {mangaDetails.chapters}</p>}
              {mangaDetails.volumes && <p><strong>Volumes:</strong> {mangaDetails.volumes}</p>}
              <p><strong>Score:</strong> {mangaDetails.score}</p>
              <p><strong>Published:</strong> {mangaDetails.published.string}</p>
              <p><strong>Genres:</strong> {mangaDetails.genres.map(genre => genre.name).join(', ')}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MangaDetailsPage;
