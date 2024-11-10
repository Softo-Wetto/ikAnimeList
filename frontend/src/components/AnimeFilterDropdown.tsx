// src/components/AnimeFilterDropdown.tsx

import React from 'react';

interface FilterDropdownProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
}

// Mapping genre names to Jikan genre IDs
const genreMapping: Record<string, string> = {
  action: '1',
  adventure: '2',
  comedy: '4',
  drama: '8',
  fantasy: '10',
  horror: '14',
  mystery: '7',
  romance: '22',
  scifi: '24',
};

// Reverse mapping genre IDs to names for display purposes
const genreReverseMapping = Object.fromEntries(
  Object.entries(genreMapping).map(([key, value]) => [value, key])
);

// Mapping months to season names for display
const monthToSeason: Record<string, string> = {
  '01': 'winter',
  '04': 'spring',
  '07': 'summer',
  '10': 'fall',
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value || undefined });
  };

  return (
    <div className="flex flex-wrap space-x-4 mb-4">
      {/* Type Filter */}
      <select
        value={filters.type || ''}
        onChange={(e) => handleFilterChange('type', e.target.value)}
        className="p-2 border rounded-md"
      >
        <option value="">All Types</option>
        <option value="tv">TV</option>
        <option value="movie">Movie</option>
        <option value="ova">OVA</option>
        <option value="special">Special</option>
        <option value="ona">ONA</option>
        <option value="music">Music</option>
      </select>

      {/* Status Filter */}
      <select
        value={filters.status || ''}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="p-2 border rounded-md"
      >
        <option value="">All Statuses</option>
        <option value="airing">Airing</option>
        <option value="complete">Completed</option>
        <option value="upcoming">Upcoming</option>
      </select>

      {/* Rating Filter */}
      <select
        value={filters.rating || ''}
        onChange={(e) => handleFilterChange('rating', e.target.value)}
        className="p-2 border rounded-md"
      >
        <option value="">All Ratings</option>
        <option value="g">G - All Ages</option>
        <option value="pg">PG - Children</option>
        <option value="pg13">PG-13 - Teens 13 or older</option>
        <option value="r17">R - 17+ (violence & profanity)</option>
        <option value="r">R+ - Mild Nudity</option>
        <option value="rx">Rx - Hentai</option>
      </select>

      {/* Year Filter */}
      <select
        value={filters.start_date ? filters.start_date.slice(0, 4) : ''}
        onChange={(e) => handleFilterChange('start_date', e.target.value ? `${e.target.value}-01-01` : '')}
        className="p-2 border rounded-md"
      >
        <option value="">All Years</option>
        {[...Array(50)].map((_, i) => {
          const year = new Date().getFullYear() - i;
          return (
            <option key={year} value={`${year}`}>
              {year}
            </option>
          );
        })}
      </select>

      {/* Genre Filter */}
      <select
        value={filters.genres ? genreReverseMapping[filters.genres] : ''}
        onChange={(e) => handleFilterChange('genres', genreMapping[e.target.value] || '')}
        className="p-2 border rounded-md"
      >
        <option value="">All Genres</option>
        {Object.keys(genreMapping).map((genre) => (
          <option key={genre} value={genre}>
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </option>
        ))}
      </select>

      {/* Season Filter */}
      <select
        value={filters.start_date ? monthToSeason[filters.start_date.split('-')[1]] : ''}
        onChange={(e) => {
          const seasonToDate: { winter: string; spring: string; summer: string; fall: string } = {
            winter: '01-01',
            spring: '04-01',
            summer: '07-01',
            fall: '10-01',
          };
          const monthDay = seasonToDate[e.target.value as keyof typeof seasonToDate];
          const year = filters.start_date ? filters.start_date.split('-')[0] : new Date().getFullYear().toString();
          handleFilterChange('start_date', year && monthDay ? `${year}-${monthDay}` : '');
        }}
        className="p-2 border rounded-md"
      >
        <option value="">All Seasons</option>
        <option value="winter">Winter</option>
        <option value="spring">Spring</option>
        <option value="summer">Summer</option>
        <option value="fall">Fall</option>
      </select>
    </div>
  );
};

export default FilterDropdown;
