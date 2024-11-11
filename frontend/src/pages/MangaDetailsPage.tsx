// src/pages/MangaDetailsPage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useFetchMangaDetails } from '../hooks/useFetchMangaDetails';
import BackButton from '../components/BackButton';

const MangaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { mangaDetails, loading, error } = useFetchMangaDetails(id || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'additional' | 'related'>('overview');

  if (loading) return <Layout><p className="text-center text-primary">Loading...</p></Layout>;
  if (error) return <Layout><p className="text-center text-red-500">{error}</p></Layout>;

  if (!mangaDetails) return <Layout><p className="text-center">No details available.</p></Layout>;

  const {
    title,
    title_english,
    title_japanese,
    images,
    synopsis,
    type,
    chapters,
    volumes,
    status,
    score,
    published,
    genres = [],
    authors = [],
    serializations = [],
  } = mangaDetails;

  const displayTitle = title_english || title_japanese || title || 'Unknown Title';

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <BackButton />
        <h1 className="text-4xl font-bold text-indigo-600 mb-6 text-center">{displayTitle}</h1>     
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <img
              src={images.jpg.image_url}
              alt={displayTitle}
              className="w-80 h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="flex-grow">
            <div className="flex gap-4 border-b border-gray-200 mb-4">
              {['overview', 'additional', 'related'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as 'overview' | 'additional' | 'related')}
                  className={`px-4 py-2 text-lg font-semibold ${
                    activeTab === tab
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg shadow-md">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Synopsis</h2>
                  <p className="text-gray-700">{synopsis || 'Synopsis not available.'}</p>
                  <ul className="space-y-2 text-gray-800">
                    <li><strong>Type:</strong> {type || 'N/A'}</li>
                    <li><strong>Chapters:</strong> {chapters || 'N/A'}</li>
                    <li><strong>Volumes:</strong> {volumes || 'N/A'}</li>
                    <li><strong>Status:</strong> {status || 'N/A'}</li>
                    <li><strong>Published:</strong> {published?.string || 'N/A'}</li>
                  </ul>
                </div>
              )}

              {activeTab === 'additional' && (
                <div className="space-y-4">
                  <h2 className="font-semibold text-indigo-600 text-xl">Score</h2>
                  <p>Score: {score || 'N/A'}</p>
                  <h2 className="font-semibold text-indigo-600 text-xl mt-4">Genres</h2>
                  <ul className="list-disc ml-6 space-y-1">
                    {genres.map((genre) => (
                      <li key={genre.mal_id} className="text-gray-700">{genre.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'related' && (
                <div className="space-y-4">
                  <h2 className="font-semibold text-indigo-600 text-xl">Authors</h2>
                  <ul className="list-disc ml-6 space-y-1">
                    {authors.map((author) => (
                      <li key={author.mal_id} className="text-gray-700">
                        <a href={author.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{author.name}</a>
                      </li>
                    ))}
                  </ul>
                  <h2 className="font-semibold text-indigo-600 text-xl mt-4">Serializations</h2>
                  <ul className="list-disc ml-6 space-y-1">
                    {serializations.map((serialization) => (
                      <li key={serialization.mal_id} className="text-gray-700">
                        <a href={serialization.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{serialization.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MangaDetailsPage;
