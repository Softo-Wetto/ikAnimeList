// src/pages/AnimeDetailsPage.tsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchAnimeDetails } from '../hooks/useFetchAnimeDetails';
import BackButton from '../components/BackButton';
import Layout from '../components/Layout';

const AnimeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { animeDetails, loading, error } = useFetchAnimeDetails(id || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'additional' | 'related'>('overview');

  if (loading) return <Layout><p className="text-center text-primary">Loading...</p></Layout>;
  if (error) return <Layout><p className="text-center text-red-500">{error}</p></Layout>;

  // Ensure that animeDetails is defined before rendering
  if (!animeDetails) return <p>No details available for this anime.</p>;

  const {
    images,
    trailer,
    titles,
    title_english,
    title_japanese,
    type,
    source,
    episodes,
    status,
    aired,
    duration,
    rating,
    score,
    scored_by,
    rank,
    popularity,
    members,
    favorites,
    synopsis,
    producers = [],
    licensors = [],
    studios = [],
    genres = [],
    themes = [],
    demographics = []
  } = animeDetails;

  const displayTitle =
  title_english || title_japanese || titles?.[0]?.title || 'Unknown Title';

return (
  <Layout>
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
    <BackButton />
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">
        {displayTitle}
      </h1>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image and Trailer Section */}
        <div className="flex-shrink-0 mb-4 md:mb-0">
          <img
            src={images?.jpg?.image_url}
            alt={displayTitle || 'Anime Image'}
            className="w-80 h-auto rounded-lg shadow-lg"
          />
          {trailer?.embed_url && (
            <iframe
              src={trailer.embed_url}
              title="Trailer"
              className="w-full h-56 mt-4 rounded-lg shadow-lg"
              allowFullScreen
            />
          )}
        </div>

        {/* Details and Tabs Section */}
        <div className="flex-grow">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 mb-6">
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

          {/* Tab Content */}
          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Synopsis</h2>
                <p className="text-gray-700">{synopsis || 'Synopsis not available.'}</p>
                <ul className="space-y-2 text-gray-800">
                  <li><strong>Type:</strong> {type || 'N/A'}</li>
                  <li><strong>Source:</strong> {source || 'N/A'}</li>
                  <li><strong>Episodes:</strong> {episodes || 'N/A'}</li>
                  <li><strong>Status:</strong> {status || 'N/A'}</li>
                  <li><strong>Aired:</strong> {aired?.string || 'N/A'}</li>
                  <li><strong>Duration:</strong> {duration || 'N/A'}</li>
                  <li><strong>Rating:</strong> {rating || 'N/A'}</li>
                </ul>
              </div>
            )}

            {activeTab === 'additional' && (
              <div className="space-y-4">
                <h2 className="font-semibold text-indigo-600 text-xl">Score</h2>
                <p>
                  Score: {score || 'N/A'} (Rated by {scored_by || 'N/A'} users)
                  | Ranked: #{rank} | Popularity: #{popularity}
                </p>
                <h2 className="font-semibold text-indigo-600 text-xl mt-4">Community Stats</h2>
                <p>Members: {members || 'N/A'} | Favorites: {favorites || 'N/A'}</p>
                <h2 className="font-semibold text-indigo-600 text-xl mt-4">Genres</h2>
                <ul className="list-disc ml-6 space-y-1">
                  {genres.map((genre) => (
                    <li key={genre.mal_id} className="text-gray-700">{genre.name}</li>
                  ))}
                </ul>
                <h2 className="font-semibold text-indigo-600 text-xl mt-4">Themes</h2>
                <ul className="list-disc ml-6 space-y-1">
                  {themes.map((theme) => (
                    <li key={theme.mal_id} className="text-gray-700">{theme.name}</li>
                  ))}
                </ul>
                <h2 className="font-semibold text-indigo-600 text-xl mt-4">Demographics</h2>
                <ul className="list-disc ml-6 space-y-1">
                  {demographics.map((demographic) => (
                    <li key={demographic.mal_id} className="text-gray-700">{demographic.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'related' && (
              <div className="space-y-4">
                <h2 className="font-semibold text-indigo-600 text-xl">Studios</h2>
                <ul className="list-disc ml-6 space-y-1">
                  {studios.map((studio) => (
                    <li key={studio.mal_id} className="text-gray-700">{studio.name}</li>
                  ))}
                </ul>
                <h2 className="font-semibold text-indigo-600 text-xl mt-4">Producers</h2>
                <ul className="list-disc ml-6 space-y-1">
                  {producers.map((producer) => (
                    <li key={producer.mal_id} className="text-gray-700">{producer.name}</li>
                  ))}
                </ul>
                <h2 className="font-semibold text-indigo-600 text-xl mt-4">Licensors</h2>
                <ul className="list-disc ml-6 space-y-1">
                  {licensors.map((licensor) => (
                    <li key={licensor.mal_id} className="text-gray-700">{licensor.name}</li>
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
}

export default AnimeDetailsPage;
